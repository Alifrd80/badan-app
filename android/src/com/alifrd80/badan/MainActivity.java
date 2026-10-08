package com.alifrd80.badan;
import android.app.Activity;
import android.os.Bundle;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;
import android.webkit.*;
import android.view.WindowManager;
import java.io.*;
import java.util.*;

public class MainActivity extends Activity {
 private WebView web;
 private SharedPreferences prefs;
 private static final String HOST="app.badan.local";
 @Override public void onCreate(Bundle state){
  super.onCreate(state); prefs=getSharedPreferences("badan",MODE_PRIVATE);
  web=new WebView(this);setContentView(web);
  web.setBackgroundColor(0xff10140f);
  WebSettings s=web.getSettings();s.setJavaScriptEnabled(true);s.setDomStorageEnabled(true);s.setMediaPlaybackRequiresUserGesture(false);s.setAllowFileAccess(false);s.setAllowContentAccess(false);s.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
  web.addJavascriptInterface(new Store(),"BadanNative");
  web.setWebChromeClient(new WebChromeClient());
  web.setWebViewClient(new WebViewClient(){
   @Override public boolean shouldOverrideUrlLoading(WebView v,WebResourceRequest r){
    Uri u=r.getUrl();if("https".equals(u.getScheme())&&HOST.equals(u.getHost()))return false;
    if(r.isForMainFrame()&&r.hasGesture()&&("https".equals(u.getScheme())||"http".equals(u.getScheme()))){try{startActivity(new Intent(Intent.ACTION_VIEW,u));}catch(Exception ignored){}}
    return true;
   }
   @Override public WebResourceResponse shouldInterceptRequest(WebView v,WebResourceRequest r){return asset(r);}
   @Override public void onPageFinished(WebView v,String url){
    v.evaluateJavascript("window.addEventListener('badan-storage',function(){var d=document.querySelector('dialog[open]');if(d)BadanNative.keepAwake(true);else BadanNative.keepAwake(false);});",null);
   }
  });
  String last=prefs.getString("badan:last-page","/");if(last==null||!last.startsWith("/")||last.startsWith("//")||last.contains(".."))last="/";
  web.loadUrl("https://"+HOST+last);
 }
 private WebResourceResponse asset(WebResourceRequest request){
  Uri u=request.getUrl();if(!HOST.equals(u.getHost())||!"https".equals(u.getScheme()))return response(403,"Forbidden","text/plain",new byte[0],new HashMap<>());
  String path=u.getPath();if(path==null)path="/";if(path.contains("..")||path.contains("\\"))return response(403,"Forbidden","text/plain",new byte[0],new HashMap<>());
  if(path.endsWith("/"))path+="index.html";if(!path.substring(path.lastIndexOf('/')+1).contains("."))path+="/index.html";
  try{
   InputStream in=getAssets().open("web"+path);ByteArrayOutputStream out=new ByteArrayOutputStream();byte[] buf=new byte[16384];int n;while((n=in.read(buf))!=-1)out.write(buf,0,n);in.close();byte[] bytes=out.toByteArray();
   String ext=path.substring(path.lastIndexOf('.')+1);String mime=MimeTypeMap.getSingleton().getMimeTypeFromExtension(ext);if("js".equals(ext))mime="application/javascript";if("txt".equals(ext))mime="text/plain";if("webmanifest".equals(ext))mime="application/manifest+json";if(mime==null)mime="application/octet-stream";
   Map<String,String> headers=new HashMap<>();headers.put("Accept-Ranges","bytes");headers.put("Cache-Control","no-cache");
   String range=request.getRequestHeaders().get("Range");if(range==null)range=request.getRequestHeaders().get("range");
   if(range!=null&&range.startsWith("bytes=")){
    String[] parts=range.substring(6).split("-",-1);int start=parts[0].isEmpty()?Math.max(0,bytes.length-Integer.parseInt(parts[1])):Integer.parseInt(parts[0]);int end=parts[0].isEmpty()||parts.length<2||parts[1].isEmpty()?bytes.length-1:Math.min(Integer.parseInt(parts[1]),bytes.length-1);
    if(start<0||start>end)return response(416,"Range Not Satisfiable",mime,new byte[0],headers);
    headers.put("Content-Range","bytes "+start+"-"+end+"/"+bytes.length);return response(206,"Partial Content",mime,Arrays.copyOfRange(bytes,start,end+1),headers);
   }
   return response(200,"OK",mime,bytes,headers);
  }catch(Exception e){return response(404,"Not Found","text/plain",new byte[0],new HashMap<>());}
 }
 private WebResourceResponse response(int status,String reason,String mime,byte[] bytes,Map<String,String> headers){headers.put("Content-Length",String.valueOf(bytes.length));return new WebResourceResponse(mime,mime.startsWith("text/")||mime.contains("javascript")||mime.contains("json")?"UTF-8":null,status,reason,headers,new ByteArrayInputStream(bytes));}
 public class Store {
  @JavascriptInterface public String get(String key){return key.startsWith("badan:")?prefs.getString(key,null):null;}
  @JavascriptInterface public void set(String key,String value){if(key.startsWith("badan:")&&value.length()<2000000)prefs.edit().putString(key,value).commit();}
  @JavascriptInterface public void remove(String key){if(key.startsWith("badan:"))prefs.edit().remove(key).commit();}
  @JavascriptInterface public void keepAwake(boolean active){runOnUiThread(()->{if(active)getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);else getWindow().clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);});}
 }
 @Override public void onBackPressed(){web.evaluateJavascript("(function(){if(document.querySelector('dialog[open]')){window.dispatchEvent(new Event('badan-back'));return 'dialog';}return 'page';})()",result->{if("\"dialog\"".equals(result))return;if(web.canGoBack())web.goBack();else super.onBackPressed();});}
 @Override protected void onPause(){web.evaluateJavascript("document.querySelectorAll('video').forEach(v=>v.pause());window.dispatchEvent(new Event('badan-background'));",null);web.onPause();getWindow().clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);super.onPause();}
 @Override protected void onResume(){super.onResume();if(web!=null)web.onResume();}
 @Override protected void onDestroy(){if(web!=null){web.removeJavascriptInterface("BadanNative");web.destroy();}super.onDestroy();}
}
