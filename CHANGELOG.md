# Changelog

All notable changes to this project will be documented in this file.

This project is a fork of [@mozartec/capacitor-microphone](https://github.com/mozartec/capacitor-microphone). The changelog below documents changes made in this fork.

## [8.1.0] - 2026-08-21

### Fixed

- **Web: `duration` now reports milliseconds** — it previously returned the total
  size of the recorded chunks in bytes, so a one minute recording reported a value
  in the hundreds of thousands. The elapsed time is now measured between start and
  stop, with paused time excluded, matching the iOS and Android implementations.
- **Android: `pauseRecording()` and `resumeRecording()` no longer report a false
  success below API 24** — `MediaRecorder.pause()` does not exist on those versions,
  so the recording kept running while the plugin answered `recording paused`. Both
  methods now reject with an explicit message. `minSdkVersion` is 23, so this case
  was reachable.
- **Android: released the `MediaPlayer`** used to read the recording duration, which
  was leaked on every `stopRecording()` call.

### Changed

- Removed debug `Log.e` calls left in the Android release path.
- `README_FR.md` is now part of the published package, so the French link in the
  README resolves on npm.

## [8.0.0] - 2026-04-17

### Breaking Changes

- Renamed package from `@mozartec/capacitor-microphone` to `@dimer47/capacitor-microphone`
- Update your imports: `import { Microphone } from '@dimer47/capacitor-microphone'`

### Added

- **Pause/Resume recording** — `pauseRecording()` and `resumeRecording()` methods on all platforms (iOS, Android API 24+, Web)
- **Status tracking** — `getCurrentStatus()` to query the recording state without side effects
- **Native event system** — `addListener('status', callback)` and `removeStatusListener()` for real-time status change notifications
- Status message types: `RecordingPaused`, `RecordingResumed`, `MicrophoneIsBusy`
- Bilingual documentation (English + French)
- CHANGELOG

### Changed

- Updated author and repository information
- Improved API documentation in README

### Previous history

This fork is based on `@mozartec/capacitor-microphone@7.1.0`. For the original changelog, see the [upstream repository](https://github.com/mozartec/capacitor-microphone).
