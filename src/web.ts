import { WebPlugin } from '@capacitor/core';

import type { MicrophonePlugin, PermissionStatus, AudioRecording } from './definitions';
import { StatusMessageTypes } from './status-message-types';

export class MicrophoneWeb extends WebPlugin implements MicrophonePlugin {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private recordingStartedAt = 0;
  private pausedAt = 0;
  private pausedDuration = 0;

  private resetRecordingState() {
    this.mediaRecorder = null;
    this.recordingStartedAt = 0;
    this.pausedAt = 0;
    this.pausedDuration = 0;
  }

  private emitStatus(status: string) {
    this.notifyListeners('status', { status });
  }

  async removeStatusListener(eventName: 'status', listenerFunc: (status: { status: string }) => void): Promise<void> {
    await (this as any).removeListener(eventName, listenerFunc);
  }

  async checkPermissions(): Promise<PermissionStatus> {
    const permissionStatus = await navigator.permissions.query({ name: 'microphone' as PermissionName });
    return { microphone: permissionStatus.state as 'granted' | 'denied' | 'prompt' };
  }

  async requestPermissions(): Promise<PermissionStatus> {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      return { microphone: 'granted' };
    } catch {
      return { microphone: 'denied' };
    }
  }

  async startRecording(): Promise<{ status: string }> {
    // Check permission first
    const permissionStatus = await this.checkPermissions();
    if (permissionStatus.microphone !== 'granted') {
      throw StatusMessageTypes.MicrophonePermissionNotGranted;
    }

    // Check if there's already a recording in progress
    if (this.mediaRecorder !== null) {
      throw StatusMessageTypes.RecordingInProgress;
    }

    try {
      const stream = await navigator?.mediaDevices?.getUserMedia({ audio: true });

      // Find a supported MIME type for audio recording
      const getSupportedMimeType = () => {
        // Try these MIME types in order of preference
        const types = ['audio/webm', 'audio/mp4', 'audio/ogg', 'audio/wav'];
        for (const type of types) {
          if (MediaRecorder.isTypeSupported(type)) {
            return type;
          }
        }
        return ''; // Let browser decide default
      };

      const mimeType = getSupportedMimeType();
      this.mediaRecorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      this.audioChunks = [];

      this.mediaRecorder.ondataavailable = (event: any) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.start();
      this.recordingStartedAt = Date.now();
      this.pausedAt = 0;
      this.pausedDuration = 0;
      const status = StatusMessageTypes.RecordingStared;
      this.emitStatus(status);
      return {
        status,
      };
    } catch (error) {
      throw StatusMessageTypes.RecordingFailed;
    }
  }

  async pauseRecording(): Promise<{ status: string }> {
    if (!this.mediaRecorder || this.mediaRecorder.state !== 'recording') {
      throw StatusMessageTypes.NoRecordingInProgress;
    }
    try {
      this.mediaRecorder.pause();
      this.pausedAt = Date.now();
      const status = StatusMessageTypes.RecordingPaused;
      this.emitStatus(status);
      return { status };
    } catch {
      throw StatusMessageTypes.RecordingFailed;
    }
  }

  async resumeRecording(): Promise<{ status: string }> {
    if (!this.mediaRecorder || this.mediaRecorder.state !== 'paused') {
      throw StatusMessageTypes.NoRecordingInProgress;
    }
    try {
      this.mediaRecorder.resume();
      if (this.pausedAt > 0) {
        this.pausedDuration += Date.now() - this.pausedAt;
        this.pausedAt = 0;
      }
      const status = StatusMessageTypes.RecordingResumed;
      this.emitStatus(status);
      return { status };
    } catch {
      throw StatusMessageTypes.RecordingFailed;
    }
  }

  async getCurrentStatus(): Promise<{ status: string }> {
    if (!this.mediaRecorder) {
      const status = StatusMessageTypes.NoRecordingInProgress;
      this.emitStatus(status);
      return { status };
    }
    const status =
      this.mediaRecorder.state === 'paused'
        ? StatusMessageTypes.RecordingPaused
        : this.mediaRecorder.state === 'recording'
          ? StatusMessageTypes.RecordingInProgress
          : StatusMessageTypes.NoRecordingInProgress;
    this.emitStatus(status);
    return { status };
  }

  async stopRecording(): Promise<AudioRecording> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(StatusMessageTypes.NoRecordingInProgress);
        return;
      }

      this.mediaRecorder.onstop = () => {
        try {
          // Use the actual MIME type that was used for recording
          const mimeType = this.mediaRecorder?.mimeType || 'audio/webm';
          const audioBlob = new Blob(this.audioChunks, { type: mimeType });
          const audioUrl = URL.createObjectURL(audioBlob);
          this.mediaRecorder?.stream?.getTracks().forEach((track) => track.stop());

          // Elapsed recording time in milliseconds, paused time excluded, to match
          // the duration reported by the iOS and Android implementations.
          const pausedDuration = this.pausedDuration + (this.pausedAt > 0 ? Date.now() - this.pausedAt : 0);
          const duration = this.recordingStartedAt > 0 ? Date.now() - this.recordingStartedAt - pausedDuration : 0;

          if (duration < 0) {
            this.resetRecordingState();
            reject(StatusMessageTypes.FailedToFetchRecording);
            return;
          }

          // Determine file extension based on MIME type
          const format = mimeType.includes('webm')
            ? '.webm'
            : mimeType.includes('mp4')
              ? '.mp4'
              : mimeType.includes('ogg')
                ? '.ogg'
                : mimeType.includes('wav')
                  ? '.wav'
                  : '.webm';

          const recording: AudioRecording = {
            webPath: audioUrl,
            duration,
            format,
            mimeType,
          };

          this.resetRecordingState();
          this.emitStatus(StatusMessageTypes.NoRecordingInProgress);
          resolve(recording);
        } catch (error) {
          this.resetRecordingState();
          reject(StatusMessageTypes.FailedToFetchRecording);
        }
      };

      try {
        this.mediaRecorder.stop();
      } catch (error) {
        this.resetRecordingState();
        reject(StatusMessageTypes.FailedToFetchRecording);
      }
    });
  }
}
