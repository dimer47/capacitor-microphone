# Capacitor Microphone — demo

A small Vue 3 + Vite app exercising every method of
[`@dimer47/capacitor-microphone`](../../), including the additions this fork brings:
`pauseRecording()`, `resumeRecording()`, `getCurrentStatus()` and the native
`status` event listener.

The plugin is linked from the repository root (`file:../..`), so the demo always
runs against the working copy rather than a published version.

## Web

```sh
npm install
npm run dev
```

The web implementation uses `MediaRecorder`, so it works in any modern browser and
in a PWA. Recording requires a secure context: `localhost` or HTTPS.

The published build lives at <https://dimer47.github.io/capacitor-microphone/>,
deployed by `.github/workflows/deploy-demo.yml` on every push to `main`.

## iOS and Android

The very same page runs natively through Capacitor, backed by `AVAudioRecorder`
on iOS and `MediaRecorder` on Android:

```sh
npm run add:ios       # or: npm run add:android
npm run open:ios      # or: npm run open:android
```

After changing the plugin or the demo, rebuild and copy the web assets:

```sh
npm run sync
```

The generated `ios/` and `android/` folders are not tracked; recreate them with the
commands above.

> Pause and resume need Android 7.0 (API 24) or later. Below that the plugin
> rejects the call rather than reporting a paused state it cannot honour.
