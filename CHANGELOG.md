# Changelog

All notable changes to this project will be documented in this file.

This project is a fork of [@mozartec/capacitor-microphone](https://github.com/mozartec/capacitor-microphone). The changelog below documents changes made in this fork.

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
