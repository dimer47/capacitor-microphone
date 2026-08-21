package com.mozartec.capacitor.microphone;

import android.content.Context;
import android.media.MediaRecorder;
import android.os.Build;
import java.io.File;
import java.io.IOException;

public class Microphone {

    public static final String PAUSE_RESUME_UNSUPPORTED = "pause and resume require Android 7.0 (API 24) or later";

    private Context context;
    private MediaRecorder mediaRecorder;
    private File outputFile;
    private StatusMessageTypes currentStatus = StatusMessageTypes.NoRecordingInProgress;

    public Microphone(Context context) throws IOException {
        this.context = context;
    }

    public void startRecording() throws IOException {
        File outputDir = context.getCacheDir();
        outputFile = File.createTempFile(java.util.UUID.randomUUID().toString(), ".m4a", outputDir);
        mediaRecorder = new MediaRecorder();
        mediaRecorder.setAudioSource(MediaRecorder.AudioSource.MIC);
        mediaRecorder.setOutputFormat(MediaRecorder.OutputFormat.MPEG_4);
        mediaRecorder.setAudioChannels(1);
        mediaRecorder.setAudioSamplingRate(44100);
        mediaRecorder.setAudioEncodingBitRate(96000);
        mediaRecorder.setOutputFile(outputFile.getAbsolutePath());
        mediaRecorder.setAudioEncoder(MediaRecorder.AudioEncoder.AAC);
        mediaRecorder.prepare();
        mediaRecorder.start();
        currentStatus = StatusMessageTypes.RecordingInProgress;
    }

    public void pauseRecording() {
        // MediaRecorder.pause() only exists from API 24 onwards. Below that the
        // recording keeps running, so reporting a paused state would be a lie.
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.N) {
            throw new UnsupportedOperationException(PAUSE_RESUME_UNSUPPORTED);
        }
        mediaRecorder.pause();
        currentStatus = StatusMessageTypes.RecordingPaused;
    }

    public void resumeRecording() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.N) {
            throw new UnsupportedOperationException(PAUSE_RESUME_UNSUPPORTED);
        }
        mediaRecorder.resume();
        currentStatus = StatusMessageTypes.RecordingInProgress;
    }

    public static boolean isPauseResumeSupported() {
        return Build.VERSION.SDK_INT >= Build.VERSION_CODES.N;
    }

    public void stopRecording() {
        mediaRecorder.stop();
        mediaRecorder.release();
        currentStatus = StatusMessageTypes.NoRecordingInProgress;
    }

    public File getOutputFile() {
        return outputFile;
    }

    public String getCurrentStatus() {
        return currentStatus.getValue();
    }
}
