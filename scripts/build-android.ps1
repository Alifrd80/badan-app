param([string]$ToolsRoot = (Join-Path $PSScriptRoot '../../android-tools'), [string]$JavaRoot='C:/Program Files/Java/jdk-24', [string]$OutputApk=(Join-Path $PSScriptRoot '../../../outputs/badan-2.0.1.apk'))
$ErrorActionPreference='Stop'
$repo=(Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$ToolsRoot=(Resolve-Path $ToolsRoot).Path
$bt=Join-Path $ToolsRoot 'build-tools_r35_windows/android-15'
$jar=Join-Path $ToolsRoot 'platform-35_r02/android-35/android.jar'
$env:JAVA_HOME=$JavaRoot
$env:PATH="$JavaRoot/bin;"+$env:PATH
$build=Join-Path $repo ('android/build/'+[DateTime]::Now.ToString('yyyyMMdd-HHmmss'))
New-Item -ItemType Directory -Force "$build/classes","$build/dex","$build/assets/web" | Out-Null
Copy-Item -Path "$repo/out/*" -Destination "$build/assets/web" -Recurse -Force
function RunChecked([string]$exe,[string[]]$arguments){ & $exe @arguments; if($LASTEXITCODE -ne 0){throw "Build step failed: $exe ($LASTEXITCODE)"} }
RunChecked "$bt/aapt2.exe" @('compile','--dir',"$repo/android/res",'-o',"$build/resources.zip")
RunChecked "$bt/aapt2.exe" @('link','-o',"$build/unsigned.apk",'--manifest',"$repo/android/AndroidManifest.xml",'-I',$jar,'-A',"$build/assets",'--min-sdk-version','26','--target-sdk-version','35',"$build/resources.zip")
RunChecked "$JavaRoot/bin/javac.exe" @('-encoding','UTF-8','--release','8','-classpath',$jar,'-d',"$build/classes","$repo/android/src/com/alifrd80/badan/MainActivity.java")
$classFiles=@(Get-ChildItem "$build/classes" -Filter '*.class' -Recurse | ForEach-Object FullName)
RunChecked "$JavaRoot/bin/java.exe" (@('-cp',"$bt/lib/d8.jar",'com.android.tools.r8.D8','--lib',$jar,'--min-api','26','--output',"$build/dex")+$classFiles)
RunChecked "$JavaRoot/bin/jar.exe" @('uf',"$build/unsigned.apk",'-C',"$build/dex",'classes.dex')
RunChecked "python" @("$repo/scripts/normalize-apk-paths.py","$build/unsigned.apk")
RunChecked "$bt/zipalign.exe" @('-f','4',"$build/unsigned.apk","$build/aligned.apk")
$signing=Join-Path $ToolsRoot 'badan-signing.jks'
if(!(Test-Path $signing)){RunChecked "$JavaRoot/bin/keytool.exe" @('-genkeypair','-keystore',$signing,'-storepass','android','-keypass','android','-alias','badan','-keyalg','RSA','-keysize','2048','-validity','10000','-dname','CN=Badan Local APK, O=Personal, C=IR')}
RunChecked "$JavaRoot/bin/java.exe" @('-jar',"$bt/lib/apksigner.jar",'sign','--ks',$signing,'--ks-key-alias','badan','--ks-pass','pass:android','--key-pass','pass:android','--out',$OutputApk,"$build/aligned.apk")
RunChecked "$JavaRoot/bin/java.exe" @('-jar',"$bt/lib/apksigner.jar",'verify','--verbose',$OutputApk)
RunChecked "$JavaRoot/bin/javac.exe" @('-encoding','UTF-8','-d',"$build/classes","$repo/scripts/TestOfflineFiles.java")
RunChecked "$JavaRoot/bin/java.exe" @('-cp',"$build/classes",'TestOfflineFiles',$OutputApk)
Get-FileHash $OutputApk -Algorithm SHA256
