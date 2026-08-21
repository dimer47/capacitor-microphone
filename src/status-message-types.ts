export enum StatusMessageTypes {
  MicrophonePermissionNotGranted = 'microphone permission not granted',
  CannotRecordOnThisPhone = 'cannot record on this phone',
  RecordingFailed = 'recording failed',
  NoRecordingInProgress = 'no recording in progress',
  FailedToFetchRecording = 'failed to fetch recording',
  RecordingInProgress = 'recording in progress',
  RecordingPaused = 'recording paused',
  RecordingResumed = 'recording resumed',
  MicrophoneIsBusy = 'microphone is busy',
  /**
   * @deprecated Misspelled, kept for backward compatibility. Use {@link StatusMessageTypes.RecordingStarted}.
   */
  RecordingStared = 'recording stared',
  /**
   * Correctly spelled alias of {@link StatusMessageTypes.RecordingStared}.
   *
   * Both members share the same `'recording stared'` value: the emitted string is
   * part of the public contract and changing it would break callers comparing to it.
   */
  RecordingStarted = 'recording stared',
}
