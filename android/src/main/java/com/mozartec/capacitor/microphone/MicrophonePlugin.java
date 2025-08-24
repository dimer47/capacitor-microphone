package com.mozartec.capacitor.microphone;

import android.Manifest;
import android.media.MediaPlayer;
import android.net.Uri;
import android.util.Log;
import com.getcapacitor.FileUtils;
import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.PermissionState;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.getcapacitor.annotation.PermissionCallback;
import java.io.File;
import java.util.List;
import org.json.JSONException;

@CapacitorPlugin(
    name = "Microphone",
    permissions = { @Permission(strings = { Manifest.permission.RECORD_AUDIO }, alias = MicrophonePlugin.MICROPHONE) }
)
public class MicrophonePlugin extends Plugin {

    // Permission alias constants
    static final String MICROPHONE = "microphone";

    private Microphone implementation;

    // Looks like checkPermissions is available out of the box

    @PluginMethod
    public void requestPermissions(PluginCall call) {
        // Save the call to be able to access it in microphonePermissionsCallback
        bridge.saveCall(call);
        // If the microphone permission is defined in the manifest, then we have to prompt the user
        // or else we will get a security exception when trying to present the microphone. If, however,
        // it is not defined in the manifest then we don't need to prompt and it will just work.
        if (isPermissionDeclared(MICROPHONE)) {
            // just request normally
            super.requestPermissions(call);
        } else {
            // the manifest does not define microphone permissions, so we need to decide what to do
            // first, extract the permissions being requested
            // TODO: (CHECK) We are not even sending permission list (Do we need it ?)
            JSArray providedPerms = call.getArray("permissions");
            List<String> permsList = null;
            try {
                permsList = providedPerms.toList();
            } catch (JSONException e) {}

            // TODO: (CHECK) This may not even be needed as till now we only need mic permission
            if (permsList != null && permsList.size() == 1 && permsList.contains(MICROPHONE)) {
                // the only thing being asked for was the microphone so we can just return the current state
                checkPermissions(call);
            } else {
                // we need to ask about microphone so request storage permissions
                // This will break complaining about permission missing in manifest
                requestPermissionForAlias(MICROPHONE, call, "checkPermissions");
            }
        }
    }

    @PermissionCallback
    private void microphonePermissionsCallback(PluginCall call) {
        checkPermissions(call);
    }

    @PluginMethod
    public void startRecording(PluginCall call) {
        if (!isAudioRecordingPermissionGranted()) {
            call.reject(StatusMessageTypes.MicrophonePermissionNotGranted.getValue());
            return;
        }

        if (implementation != null) {
            call.reject(StatusMessageTypes.RecordingInProgress.getValue());
            return;
        }

        try {
            implementation = new Microphone(getContext());
            implementation.startRecording();
            String status = StatusMessageTypes.RecordingStared.getValue();
            emitStatus(status);
            JSObject success = new JSObject();
            success.put("status", status);
            call.resolve(success);
        } catch (Exception exp) {
            call.reject(StatusMessageTypes.CannotRecordOnThisPhone.getValue());
        }
    }

    @PluginMethod
    public void pauseRecording(PluginCall call) {
        if (implementation == null) {
            call.reject(StatusMessageTypes.NoRecordingInProgress.getValue());
            return;
        }

        try {
            implementation.pauseRecording();
            String status = StatusMessageTypes.RecordingPaused.getValue();
            emitStatus(status);
            JSObject success = new JSObject();
            success.put("status", status);
            call.resolve(success);
        } catch (Exception exp) {
            call.reject(StatusMessageTypes.RecordingFailed.getValue());
        }
    }

    @PluginMethod
    public void resumeRecording(PluginCall call) {
        if (implementation == null) {
            call.reject(StatusMessageTypes.NoRecordingInProgress.getValue());
            return;
        }

        try {
            implementation.resumeRecording();
            String status = StatusMessageTypes.RecordingResumed.getValue();
            emitStatus(status);
            JSObject success = new JSObject();
            success.put("status", status);
            call.resolve(success);
        } catch (Exception exp) {
            call.reject(StatusMessageTypes.RecordingFailed.getValue());
        }
    }

    @PluginMethod
    public void getCurrentStatus(PluginCall call) {
        JSObject result = new JSObject();
        String status;
        if (implementation == null) {
            status = StatusMessageTypes.NoRecordingInProgress.getValue();
        } else {
            status = implementation.getCurrentStatus();
        }
        result.put("status", status);
        emitStatus(status);
        call.resolve(result);
    }

    @PluginMethod(returnType = PluginMethod.RETURN_PROMISE)
    public void removeStatusListener(PluginCall call) {
        removeListener(call);
        call.resolve();
    }

    @PluginMethod
    public void stopRecording(PluginCall call) {
        if (implementation == null) {
            call.reject(StatusMessageTypes.NoRecordingInProgress.getValue());
            return;
        }

        try {
            implementation.stopRecording();
            File audioFileUrl = implementation.getOutputFile();
            Uri newUri = Uri.fromFile(audioFileUrl);
            String webURL = FileUtils.getPortablePath(getContext(), bridge.getLocalUrl(), newUri);
            Log.e("webURL", webURL);
            int duration = getAudioFileDuration(audioFileUrl.getAbsolutePath());
            Log.e("duration", duration + "");
            Log.e("newUri", newUri.toString());
            Recording recording = new Recording(newUri.toString(), webURL, duration, ".m4a", "audio/aac");
            if (duration < 0) {
                call.reject(StatusMessageTypes.FailedToFetchRecording.getValue());
            } else {
                emitStatus(StatusMessageTypes.NoRecordingInProgress.getValue());
                call.resolve(recording.toJSObject());
            }
        } catch (Exception exp) {
            call.reject(StatusMessageTypes.FailedToFetchRecording.getValue());
        } finally {
            implementation = null;
        }
    }

    private boolean isAudioRecordingPermissionGranted() {
        return getPermissionState(MICROPHONE) == PermissionState.GRANTED;
    }

    private int getAudioFileDuration(String filePath) {
        try {
            MediaPlayer mp = new MediaPlayer();
            mp.setDataSource(filePath);
            mp.prepare();
            return mp.getDuration();
        } catch (Exception ignore) {
            return -1;
        }
    }

    private void emitStatus(String status) {
        JSObject ret = new JSObject();
        ret.put("status", status);
        notifyListeners("status", ret);
    }
}
