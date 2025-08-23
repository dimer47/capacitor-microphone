import type { PermissionState } from '@capacitor/core';

export interface MicrophonePlugin {
  /**
   * Checks microphone permission
   * @returns {PermissionStatus} PermissionStatus
   * @since 0.0.3
   */
  checkPermissions(): Promise<PermissionStatus>;

  /**
   * Requests microphone permission
   * @returns {Promise<PermissionStatus>} PermissionStatus
   * @since 0.0.3
   */
  requestPermissions(): Promise<PermissionStatus>;

  /**
   * Starts recoding session if no session is in progress
   * @returns {Promise<{ status: string }>} Object with status message
   * @since 0.0.3
   */
  startRecording(): Promise<{ status: string }>;

  /**
   * Pauses recoding session if one is in progress
   * @returns {Promise<{ status: string }>} Object with status message
   * @since 0.0.3
   */
  pauseRecording(): Promise<{ status: string }>;

  /**
   * Resumes recoding session if one is paused
   * @returns {Promise<{ status: string }>} Object with status message
   * @since 0.0.3
   */
  resumeRecording(): Promise<{ status: string }>;

  /**
   * Gets current recording status
   * @returns {Promise<{ status: string }>} Object with status message
   * @since 0.0.3
   */
  getCurrentStatus(): Promise<{ status: string }>;

  /**
   * Stops recoding session if one is in progress
   * @returns {Promise<AudioRecording>} AudioRecording including file path
   * @since 0.0.3
   */
  stopRecording(): Promise<AudioRecording>;
}

export interface AudioRecording {
  /**
   * Platform-specific file URL that can be read later using the Filesystem API.
   *
   * @since 0.0.3
   */
  path?: string;

  /**
   * webPath returns a path that can be used to set the src attribute of an audio element and can be useful for testing.
   *
   * @since 0.0.3
   */
  webPath?: string;

  /**
   * recoding duration in milliseconds
   *
   * @since 0.0.3
   */
  duration: number;

  /**
   * file extension:
   * ".m4a" for (iOS and Android) and
   * ".webm" | ".mp4" | ".ogg" | ".wav" for Web based on compatibility
   *
   * @since 0.0.3
   */
  format?: string;

  /**
   * file encoding:
   * "audio/aac" for (iOS and Android) and
   * "audio/webm | "audio/mp4" | "audio/ogg" | "audio/wav" for Web based on compatibility
   *
   * @since 0.0.3
   */
  mimeType?: string;
}

export type MicrophonePermissionState = PermissionState | 'limited';

export enum MicrophonePermissionStateValue {
  prompt = 'prompt',
  promptWithRationale = 'prompt-with-rationale',
  granted = 'granted',
  denied = 'denied',
  limited = 'limited',
}

export type MicrophonePermissionType = 'microphone';

export interface PermissionStatus {
  microphone: MicrophonePermissionState;
}

export interface MicrophonePluginPermissions {
  permissions: MicrophonePermissionType[];
}
