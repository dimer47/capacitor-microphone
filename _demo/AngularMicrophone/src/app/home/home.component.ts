import { Component, OnInit } from '@angular/core';
import { Microphone, AudioRecording } from '@mozartec/capacitor-microphone';
import { ToastController } from '@ionic/angular';

interface RecordingDetails {
  index: number;
  recording: AudioRecording;
  webPath: string;
  duration: string;
  format: string;
  mimeType: string;
  path: string;
  recordingTime: string;
  expanded: boolean; // Track expanded/collapsed state
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  recording!: AudioRecording;
  webPaths = [];
  dataUrls = [];

  // Recordings collection
  recordingDetails: RecordingDetails[] = [];

  // Timer properties
  isRecording = false;
  isPaused = false;
  recordingTime = '00:00';
  timerInterval: any;
  recordingStartTime: number = 0;
  totalPausedDuration: number = 0;
  pauseStartTime: number | null = null;

  // Data URL verification site
  dataUrlVerificationSite = 'https://base64.guru/converter/decode/audio';

  constructor(
    private toastController: ToastController
  ) { }

  ngOnInit() { }

  async checkPermissions() {
    try {
      const checkPermissionsResult = await Microphone.checkPermissions();
      console.log('checkPermissionsResult: ' + JSON.stringify(checkPermissionsResult));
      this.showToast(`Permissions: ${JSON.stringify(checkPermissionsResult)}`, 'primary');
    } catch (error) {
      console.error('checkPermissions Error: ' + JSON.stringify(error));
      this.showToast(`Error checking permissions: ${this.getErrorMessage(error)}`, 'danger');
    }
  }

  async requestPermissions() {
    try {
      const requestPermissionsResult = await Microphone.requestPermissions();
      console.log('requestPermissionsResult: ' + JSON.stringify(requestPermissionsResult));
      this.showToast(`Permissions: ${JSON.stringify(requestPermissionsResult)}`, 'primary');
    } catch (error) {
      console.error('requestPermissions Error: ' + JSON.stringify(error));
      this.showToast(`Error requesting permissions: ${this.getErrorMessage(error)}`, 'danger');
    }
  }

  async startRecording() {
    try {
      const startRecordingResult = await Microphone.startRecording();
      console.log('startRecordingResult: ' + JSON.stringify(startRecordingResult));

      // Start the timer
      this.isRecording = true;
      this.isPaused = false;
      this.recordingStartTime = Date.now();
      this.totalPausedDuration = 0;
      this.pauseStartTime = null;
      this.startTimer();
      this.showToast('Recording started', 'tertiary');
    } catch (error) {
      console.error('startRecordingResult Error: ' + JSON.stringify(error));
      this.showToast(`Error starting recording: ${this.getErrorMessage(error)}`, 'danger');
    }
  }

  async stopRecording() {
    try {
      // Stop the timer first
      this.isRecording = false;
      this.isPaused = false;
      const recordedTime = this.recordingTime;
      this.stopTimer();
      // Reset pause tracking
      this.pauseStartTime = null;
      this.totalPausedDuration = 0;

      this.recording = await Microphone.stopRecording();
      console.log('recording: ' + JSON.stringify(this.recording));
      console.log('recording.duration: ' + JSON.stringify(this.recording.duration));
      console.log('recording.format: ' + JSON.stringify(this.recording.format));
      console.log('recording.mimeType: ' + JSON.stringify(this.recording.mimeType));
      console.log('recording.path: ' + JSON.stringify(this.recording.path));
      console.log('recording.webPath: ' + JSON.stringify(this.recording.webPath));

      // @ts-ignore
      this.webPaths.push(this.recording.webPath);
      // @ts-ignore
      this.dataUrls.push(this.recording.dataUrl);

      // Add to recording details collection
      this.recordingDetails.push({
        index: this.recordingDetails.length + 1,
        recording: this.recording,
        webPath: this.recording.webPath || '',
        duration: this.recording.duration ? this.recording.duration.toString() : '0',
        format: this.recording.format || '',
        mimeType: this.recording.mimeType || '',
        path: this.recording.path || '',
        recordingTime: recordedTime,
        expanded: false // Initialize as collapsed
      });

      this.showToast(`Recording stopped. Duration: ${recordedTime}`, 'success');
    } catch (error) {
      console.error('recordingResult Error: ' + JSON.stringify(error));
      this.showToast(`Error stopping recording: ${this.getErrorMessage(error)}`, 'danger');
    }
  }

  // Timer methods
  startTimer() {
    this.stopTimer(); // Clear any existing timer
    this.timerInterval = setInterval(() => {
      if (!this.isPaused) {
        const elapsedTime = Date.now() - this.recordingStartTime - this.totalPausedDuration;
        this.recordingTime = this.formatTime(Math.max(0, elapsedTime));
      }
    }, 1000);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  formatTime(milliseconds: number): string {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  // Copy to clipboard functionality
  async copyToClipboard(text: string, label: string) {
    try {
      await navigator.clipboard.writeText(text);
      this.showToast(`${label} copied to clipboard!`, 'success');
    } catch (err) {
      this.showToast('Failed to copy to clipboard', 'danger');
      console.error('Failed to copy: ', err);
    }
  }

  // Open data URL verification site
  openVerificationSite() {
    window.open(this.dataUrlVerificationSite, '_blank');
  }

  // Pause recording
  async pauseRecording() {
    try {
      const result = await (Microphone as any).pauseRecording?.();
      console.log('pauseRecordingResult: ' + JSON.stringify(result));
      if (!this.isPaused) {
        this.isPaused = true;
        this.pauseStartTime = Date.now();
      }
      this.showToast('Recording paused', 'warning');
    } catch (error) {
      console.error('pauseRecording Error: ' + JSON.stringify(error));
      this.showToast(`Error pausing recording: ${this.getErrorMessage(error)}`, 'danger');
    }
  }

  // Resume recording
  async resumeRecording() {
    try {
      const result = await (Microphone as any).resumeRecording?.();
      console.log('resumeRecordingResult: ' + JSON.stringify(result));
      if (this.isPaused) {
        const now = Date.now();
        if (this.pauseStartTime) {
          this.totalPausedDuration += now - this.pauseStartTime;
        }
        this.pauseStartTime = null;
        this.isPaused = false;
      }
      this.showToast('Recording resumed', 'medium');
    } catch (error) {
      console.error('resumeRecording Error: ' + JSON.stringify(error));
      this.showToast(`Error resuming recording: ${this.getErrorMessage(error)}`, 'danger');
    }
  }

  // Get current status
  async getCurrentStatus() {
    try {
      const status = await (Microphone as any).getCurrentStatus?.();
      console.log('getCurrentStatus: ' + JSON.stringify(status));
      this.showToast(`Status: ${JSON.stringify(status)}`, 'primary');
    } catch (error) {
      console.error('getCurrentStatus Error: ' + JSON.stringify(error));
      this.showToast(`Error getting status: ${this.getErrorMessage(error)}`, 'danger');
    }
  }

  // Show toast message
  async showToast(message: string, color: string = 'success') {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'bottom',
      color: color,
      buttons: [
        {
          icon: 'close',
          role: 'cancel'
        }
      ]
    });
    await toast.present();
  }

  // Extract error message from error object
  private getErrorMessage(error: any): string {
    if (typeof error === 'string') {
      return error;
    }
    if (error.message) {
      return error.message;
    }
    if (error.error && error.error.message) {
      return error.error.message;
    }
    return JSON.stringify(error);
  }

  // Toggle expand/collapse of recording details
  toggleRecordingDetails(record: RecordingDetails) {
    record.expanded = !record.expanded;
  }
}
