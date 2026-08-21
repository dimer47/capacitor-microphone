package com.mozartec.capacitor.microphone

import com.getcapacitor.JSObject

enum class StatusMessageTypes(val value: String) {
    MicrophonePermissionNotGranted("microphone permission not granted"),
    CannotRecordOnThisPhone("cannot record on this phone"),
    RecordingFailed("recording failed"),
    NoRecordingInProgress("no recording in progress"),
    FailedToFetchRecording("failed to fetch recording"),
    RecordingInProgress("recording in progress"),
    RecordingPaused("recording paused"),
    RecordingResumed("recording resumed"),
    MicrophoneIsBusy("microphone is busy"),
    RecordingStared("recording stared");

    companion object {
        /**
         * Correctly spelled alias of [RecordingStared].
         *
         * Declared here rather than as a second entry so that iterating over
         * `values()` does not yield a duplicate. The emitted string stays
         * "recording stared": it is part of the public contract and changing it
         * would break existing callers.
         */
        @JvmField
        val RecordingStarted = RecordingStared
    }
}

class Recording(val path: String?, val webPath: String?, val duration: Int, val format: String?, val mimeType: String?) {
    fun toJSObject(): JSObject {
        var result = JSObject()

        if (path != null) {
            result.put("path", path)
        }

        if (webPath != null) {
            result.put("webPath", webPath)
        }

        result.put("duration", duration)

        if (format != null) {
            result.put("format", format)
        }

        if (mimeType != null) {
            result.put("mimeType", mimeType)
        }

        return result
    }
}