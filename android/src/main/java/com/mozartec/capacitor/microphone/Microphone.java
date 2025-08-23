package com.mozartec.capacitor.microphone;

import android.content.Context;
import android.media.MediaRecorder;
import android.os.Build;
import java.io.File;
import java.io.IOException;

public class Microphone {

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
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            mediaRecorder.pause();
            currentStatus = StatusMessageTypes.RecordingPaused;
        }
    }

    public void resumeRecording() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            mediaRecorder.resume();
            currentStatus = StatusMessageTypes.RecordingInProgress;
        }
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
