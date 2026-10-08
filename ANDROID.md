# Badan Android 2.0

Standalone signed APK for Android 8+ (API 26), target API 35. No Android Studio required.

## Build

The web app is exported into APK assets. MainActivity serves a private HTTPS asset origin with byte-range video responses; no hosted page is required. External user-clicked links open in the system browser. Other remote WebView requests are blocked. A restricted JavaScript bridge stores only badan-prefixed preferences in SharedPreferences; auto-backup is disabled.

1. Install Node dependencies with `npm ci`.
2. Run `npm run build` (static export plus offline manifest and Next segment aliases).
3. Run `node scripts/test-core.cjs`.
4. Run `pwsh -File scripts/build-android.ps1 -ToolsRoot <tool-directory> -JavaRoot <JDK-directory> -OutputApk <absolute-apk-path>`.

The build uses official Android build tools 35.0.0 (`build-tools_r35_windows/android-15`), Android 35 platform (`platform-35_r02/android-35`) and JDK 24, without Gradle or Android Studio. The source of SDK packages is Google's Android repository. The retained local tool directory is `../android-tools`. Each build gets a separate generated staging directory.

Signing key: `../android-tools/badan-signing.jks`, alias `badan`, local-development password `android`. Keep this private key for future updates; it is excluded from Git. This is a personal sideload build, not a Play Store publication. Do not delete the key if you need compatible future APK updates.

## Features

- One-time three-question setup. Level uses the original guide's push-up thresholds: below 20 beginner, 20–40 intermediate, above 40 professional. No level selector after setup.
- Muted automatic looping video, with a manual fallback if a browser blocks autoplay. Native WebView allows playback without a gesture.
- 69 exercise IDs map to 68 H.264 videos bundled locally (one original shared video); original durations retained, audio removed for GIF-like playback. Existing content and original Drive links remain unchanged.
- Persistent progress, week, selected alternatives, session position, theme, nutrition values and search preferences. App updates retain preferences; uninstall/data clearing removes them.
- App content and exercise videos available offline from installation. External links (warmup on YouTube, original Drive links and websites) still require Internet. Web edition offers an explicit offline download.
- Light, dark and device-following themes. Backgrounding pauses/saves a workout. App reopens the last page and offers the saved session.

## Verification and limits

TypeScript and production export passed. Core tests cover assessment, pause/rest/skip/timed transitions, restore and all video mappings. Browser QA verified initial setup, medium-level content, reload persistence, dark theme, native HTML video playback and pause, and saved-session resume. APK v2/v3 signatures and bundled assets verified.

Native emulator QA could not complete: downloaded Android 11/15 emulators did not boot on this Windows host without a working hypervisor. APK installation and native lifecycle behavior need a real-device run. No claim that all possible bugs have been eliminated.

Sites source synchronization failed with an empty server reply. The APK is independent of Sites and does not require its deployment.
