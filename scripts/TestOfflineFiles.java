
import java.util.zip.*;
import java.io.*;
public class TestOfflineFiles {
 static byte[] read(String apk,String path)throws Exception {
  if(path.isEmpty())path="/";
  if(path.endsWith("/"))path+="index.html";
  else if(!path.substring(path.lastIndexOf('/')+1).contains("."))path+="/index.html";
  try(ZipFile zip=new ZipFile(apk)) {
   ZipEntry e=zip.getEntry("assets/web"+path);
   if(e==null)throw new FileNotFoundException(path);
   try(InputStream in=zip.getInputStream(e)){return in.readAllBytes();}
  }
 }
 public static void main(String[] args)throws Exception {
  String apk=args[0];int count=0;
  for(String route:new String[]{"","/","/program","/program/","/day/1/sat/"}) {
   String html=new String(read(apk,route),"UTF-8");
   if(!html.toLowerCase().contains("<!doctype html>"))throw new AssertionError(route);
  }
  try(ZipFile zip=new ZipFile(apk)){
   java.util.Enumeration<? extends ZipEntry> entries=zip.entries();
   while(entries.hasMoreElements()){
    ZipEntry e=entries.nextElement();if(e.getName().contains("\\"))throw new AssertionError("Invalid APK separator: "+e.getName());if(!e.getName().startsWith("assets/web/")||e.isDirectory())continue;
    byte[] data=read(apk,e.getName().substring("assets/web".length()));
    CRC32 crc=new CRC32();crc.update(data);
    if(crc.getValue()!=e.getCrc())throw new AssertionError(e.getName());count++;
   }
  }
  System.out.println("PASS: launch and restored routes; "+count+" packaged assets CRC verified.");
 }
}
