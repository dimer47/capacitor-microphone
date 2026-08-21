<div align="center">
  <h1>@dimer47/capacitor-microphone</h1>

A Capacitor plugin for microphone audio recording with **pause/resume** support, **real-time status events**, and cross-platform compatibility.

</div>

> **[Lire en Fran&ccedil;ais](README_FR.md)**

> **[Try the live demo](https://dimer47.github.io/capacitor-microphone/)** — records in the browser; the same API runs natively on iOS and Android.

## About

This plugin is a fork of [`@mozartec/capacitor-microphone`](https://github.com/mozartec/capacitor-microphone) originally created by [Mozart](https://github.com/mozartec). We are grateful for the solid foundation provided by the original project.

This fork was created to add **advanced recording control** needed for long-form audio recording use cases (meetings, interviews, lectures, etc.):

- **Pause & Resume** — Full control over the recording flow without losing data
- **Status Tracking** — Query the current recording state at any time
- **Native Events** — Real-time status change notifications via event listeners
- Full cross-platform support: **iOS**, **Android**, and **Web**

## Platform Support

|              | iOS                  | Android              | Web                  |
| ------------ | -------------------- | -------------------- | -------------------- |
| Availability | :heavy_check_mark:   | :heavy_check_mark:   | :heavy_check_mark:   |
| Encoding     | kAudioFormatMPEG4AAC (audio/aac) | MPEG_4 / AAC (audio/aac) | audio/webm or audio/mp4 or audio/ogg or audio/wav |
| Extension    | .m4a                 | .m4a                 | .webm or .mp4 or .ogg or .wav |

## Installation

```bash
npm install @dimer47/capacitor-microphone
npx cap sync
```

## iOS Setup

Add the following usage description to your app's `Info.plist`:

- `NSMicrophoneUsageDescription` (`Privacy - Microphone Usage Description`)

Read about [Configuring `Info.plist`](https://capacitorjs.com/docs/ios/configuration#configuring-infoplist) in the [iOS Guide](https://capacitorjs.com/docs/ios) for more information.

## Android Setup

Add the following permission to your `AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.RECORD_AUDIO" />
```

> **Note:** Pause/Resume requires Android API 24+ (Android 7.0 Nougat).

Read about [Setting Permissions](https://capacitorjs.com/docs/android/configuration#setting-permissions) in the [Android Guide](https://capacitorjs.com/docs/android) for more information.

## Usage

```typescript
import { Microphone } from '@dimer47/capacitor-microphone';

// Request permissions
const { microphone } = await Microphone.requestPermissions();

// Start recording
await Microphone.startRecording();

// Pause / Resume
await Microphone.pauseRecording();
await Microphone.resumeRecording();

// Check status
const { status } = await Microphone.getCurrentStatus();

// Listen to status changes
await Microphone.addListener('status', ({ status }) => {
  console.log('Recording status:', status);
});

// Stop and get the audio file
const recording = await Microphone.stopRecording();
console.log(recording.path, recording.duration, recording.mimeType);
```

## API

<docgen-index>

* [`checkPermissions()`](#checkpermissions)
* [`requestPermissions()`](#requestpermissions)
* [`startRecording()`](#startrecording)
* [`pauseRecording()`](#pauserecording)
* [`resumeRecording()`](#resumerecording)
* [`getCurrentStatus()`](#getcurrentstatus)
* [`addListener('status', ...)`](#addlistenerstatus-)
* [`removeStatusListener(...)`](#removestatuslistener)
* [`removeAllListeners()`](#removealllisteners)
* [`stopRecording()`](#stoprecording)
* [Interfaces](#interfaces)
* [Type Aliases](#type-aliases)

</docgen-index>

<docgen-api>
<!--Update the source file JSDoc comments and rerun docgen to update the docs below-->

### checkPermissions()

```typescript
checkPermissions() => Promise<PermissionStatus>
```

Checks microphone permission

**Returns:** <code>Promise&lt;<a href="#permissionstatus">PermissionStatus</a>&gt;</code>

**Since:** 0.0.3

--------------------


### requestPermissions()

```typescript
requestPermissions() => Promise<PermissionStatus>
```

Requests microphone permission

**Returns:** <code>Promise&lt;<a href="#permissionstatus">PermissionStatus</a>&gt;</code>

**Since:** 0.0.3

--------------------


### startRecording()

```typescript
startRecording() => Promise<{ status: string; }>
```

Starts recoding session if no session is in progress

**Returns:** <code>Promise&lt;{ status: string; }&gt;</code>

**Since:** 0.0.3

--------------------


### pauseRecording()

```typescript
pauseRecording() => Promise<{ status: string; }>
```

Pauses recoding session if one is in progress

**Returns:** <code>Promise&lt;{ status: string; }&gt;</code>

**Since:** 0.0.3

--------------------


### resumeRecording()

```typescript
resumeRecording() => Promise<{ status: string; }>
```

Resumes recoding session if one is paused

**Returns:** <code>Promise&lt;{ status: string; }&gt;</code>

**Since:** 0.0.3

--------------------


### getCurrentStatus()

```typescript
getCurrentStatus() => Promise<{ status: string; }>
```

Gets current recording status

**Returns:** <code>Promise&lt;{ status: string; }&gt;</code>

**Since:** 0.0.3

--------------------


### addListener('status', ...)

```typescript
addListener(eventName: 'status', listenerFunc: (status: { status: string; }) => void) => Promise<PluginListenerHandle>
```

Adds a listener to microphone status updates

| Param              | Type                                                  | Description                      |
| ------------------ | ----------------------------------------------------- | -------------------------------- |
| **`eventName`**    | <code>'status'</code>                                 | status                           |
| **`listenerFunc`** | <code>(status: { status: string; }) =&gt; void</code> | function to be executed on event |

**Returns:** <code>Promise&lt;<a href="#pluginlistenerhandle">PluginListenerHandle</a>&gt;</code>

**Since:** 0.0.4

--------------------


### removeStatusListener(...)

```typescript
removeStatusListener(eventName: 'status', listenerFunc: (status: { status: string; }) => void) => Promise<void>
```

Removes a specific listener from microphone status updates

| Param              | Type                                                  | Description            |
| ------------------ | ----------------------------------------------------- | ---------------------- |
| **`eventName`**    | <code>'status'</code>                                 | status                 |
| **`listenerFunc`** | <code>(status: { status: string; }) =&gt; void</code> | function to be removed |

**Since:** 0.0.4

--------------------


### removeAllListeners()

```typescript
removeAllListeners() => Promise<void>
```

Removes all listeners from microphone status updates

**Since:** 0.0.4

--------------------


### stopRecording()

```typescript
stopRecording() => Promise<AudioRecording>
```

Stops recoding session if one is in progress

**Returns:** <code>Promise&lt;<a href="#audiorecording">AudioRecording</a>&gt;</code>

**Since:** 0.0.3

--------------------


### Interfaces


#### PermissionStatus

| Prop             | Type                                                                            |
| ---------------- | ------------------------------------------------------------------------------- |
| **`microphone`** | <code><a href="#microphonepermissionstate">MicrophonePermissionState</a></code> |


#### PluginListenerHandle

| Prop         | Type                                      |
| ------------ | ----------------------------------------- |
| **`remove`** | <code>() =&gt; Promise&lt;void&gt;</code> |


#### AudioRecording

| Prop           | Type                | Description                                                                                                                                  | Since |
| -------------- | ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ----- |
| **`path`**     | <code>string</code> | Platform-specific file URL that can be read later using the Filesystem API.                                                                  | 0.0.3 |
| **`webPath`**  | <code>string</code> | webPath returns a path that can be used to set the src attribute of an audio element and can be useful for testing.                          | 0.0.3 |
| **`duration`** | <code>number</code> | recoding duration in milliseconds                                                                                                            | 0.0.3 |
| **`format`**   | <code>string</code> | file extension: ".m4a" for (iOS and Android) and ".webm" \| ".mp4" \| ".ogg" \| ".wav" for Web based on compatibility                        | 0.0.3 |
| **`mimeType`** | <code>string</code> | file encoding: "audio/aac" for (iOS and Android) and "audio/webm \| "audio/mp4" \| "audio/ogg" \| "audio/wav" for Web based on compatibility | 0.0.3 |


### Type Aliases


#### MicrophonePermissionState

<code><a href="#permissionstate">PermissionState</a> | 'limited'</code>


#### PermissionState

<code>'prompt' | 'prompt-with-rationale' | 'granted' | 'denied'</code>

</docgen-api>

## Status Messages

The following status strings are returned by the API methods and emitted through status events:

| Status                             | Description                                |
| ---------------------------------- | ------------------------------------------ |
| `recording stared`                 | Recording has started successfully         |
| `recording in progress`            | A recording is currently in progress       |
| `recording paused`                 | Recording has been paused                  |
| `recording resumed`                | Recording has been resumed                 |
| `no recording in progress`         | No active recording session                |
| `microphone permission not granted`| Microphone permission was not granted      |
| `cannot record on this phone`      | Device does not support audio recording    |
| `recording failed`                 | An error occurred during recording         |
| `failed to fetch recording`        | Could not retrieve the recorded audio file |
| `microphone is busy`               | Microphone is already in use               |

## Acknowledgments

This project is a fork of [`@mozartec/capacitor-microphone`](https://github.com/mozartec/capacitor-microphone) by [Mozart](https://mozartec.com/). Thank you for creating and maintaining the original plugin that made this work possible.

## License

MIT - See [LICENSE](LICENSE) for details.

## 📊 Project status

[![npm version](https://img.shields.io/npm/v/@dimer47/capacitor-microphone?color=red&style=flat-square)](https://www.npmjs.com/package/@dimer47/capacitor-microphone) [![License](https://img.shields.io/npm/l/@dimer47/capacitor-microphone.svg)](/LICENSE)
