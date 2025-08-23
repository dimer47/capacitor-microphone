//
//  MicrophoneTypes.swift
//  Plugin
//
//  Created by mozart alkhateeb on 30/05/2021.
//  Copyright © 2021 Max Lynch. All rights reserved.
//

struct AudioRecording {
    let path: String?
    let webPath: String?
    let duration: Int
    let format: String?
    let mimeType: String?

    func toDictionary() -> [String: Any] {
        var result: [String: Any] = [:]

        if path != nil {
            result["path"] = path
        }

        if webPath != nil {
            result["webPath"] = webPath
        }

        result["duration"] = duration

        if format != nil {
            result["format"] = format
        }

        if mimeType != nil {
            result["mimeType"] = mimeType
        }

        return result
    }
}

enum StatusMessageTypes: String {
    case microphonePermissionNotGranted = "microphone permission not granted"
    case cannotRecordOnThisPhone = "cannot record on this phone"
    case recordingFailed = "recording failed"
    case noRecordingInProgress = "no recording in progress"
    case failedToFetchRecording = "failed to fetch recording"
    case recordingInProgress = "recording in progress"
    case recordingPaused = "recording paused"
    case recordingResumed = "recording resumed"
    case microphoneIsBusy = "microphone is busy"
    case recordingStared = "recording stared"
}

enum MicrophonePermissionType: String, CaseIterable {
    case microphone
}
