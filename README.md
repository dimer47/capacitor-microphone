<div align="center">
  <h1>Mozartec Capacitor Microphone</h1>
  <h2>@mozartec/capacitor-microphone</h2>

This Microphone API provides the ability to interact with the microphone and record Audio

[![Maintenance](https://img.shields.io/badge/maintained-yes-green.svg)](https://github.com/mozartec/capacitor-microphone/graphs/commit-activity) [![License](https://img.shields.io/npm/l/@mozartec/capacitor-microphone.svg)](/LICENSE) 
  <br>
[![Dependency Status](https://david-dm.org/mozartec/capacitor-microphone.svg)](https://david-dm.org/mozartec/capacitor-microphone) [![devDependency Status](https://david-dm.org/mozartec/capacitor-microphone/dev-status.svg)](https://david-dm.org/mozartec/capacitor-microphone?type=dev)
  <br>
[![npm version](https://badge.fury.io/js/%40mozartec%2Fcapacitor-microphone.svg)](https://www.npmjs.com/package/@mozartec/capacitor-microphone) [![NPM Downloads](https://img.shields.io/npm/dw/@mozartec/capacitor-microphone)](https://www.npmjs.com/package/@mozartec/capacitor-microphone)
</div>
  
## Platform support
|              | iOS                  | Android            | Web (Preview)                |
| ------------ |--------------------- | ------------------ | ------------------ |
| Availability | :heavy_check_mark:   | :heavy_check_mark: | :heavy_check_mark: |
| Encoding     | kAudioFormatMPEG4AAC (audio/aac) | MPEG_4 / AAC (audio/aac)       | audio/webm or audio/mp4 or audio/ogg or audio/wav               |
| Extension    | .m4a                 | .m4a               | .webm or .mp4 or .ogg or .wav               |


## Installation

## Install

```bash
npm install @mozartec/capacitor-microphone
npx cap sync
```

## Demo
- **[🌐 Live Demo](https://mozartec.github.io/capacitor-microphone/)** - Try the plugin in your browser
- [📁 Demo source code](_demo/)

## iOS

iOS requires the following usage description to be added and filled out for your app in `Info.plist`:

- `NSMicrophoneUsageDescription` (`Privacy - Microphone Usage Description`)

Read about [Configuring `Info.plist`](https://capacitorjs.com/docs/ios/configuration#configuring-infoplist) in the [iOS Guide](https://capacitorjs.com/docs/ios) for more information on setting iOS permissions in Xcode.

## Android

This API requires the following permission to be added to your `AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.RECORD_AUDIO" />
```

The RECORD_AUDIO permission is for recording audio.

Read about [Setting Permissions](https://capacitorjs.com/docs/android/configuration#setting-permissions) in the [Android Guide](https://capacitorjs.com/docs/android) for more information on setting Android permissions.


## API

<docgen-index>

* [`checkPermissions()`](#checkpermissions)
* [`requestPermissions()`](#requestpermissions)
* [`startRecording()`](#startrecording)
* [`pauseRecording()`](#pauserecording)
* [`resumeRecording()`](#resumerecording)
* [`getCurrentStatus()`](#getcurrentstatus)
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

## Contributors

Thanks to all the people who have contributed to this project! 🙏

<a href="https://github.com/mozartec/capacitor-microphone/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=mozartec/capacitor-microphone" />
</a>

Made with [contrib.rocks](https://contrib.rocks)
