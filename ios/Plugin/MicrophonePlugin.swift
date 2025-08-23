import Capacitor
import AVFoundation

/**
 * Please read the Capacitor iOS Plugin Development Guide
 * here: https://capacitorjs.com/docs/plugins/ios
 */
@objc(MicrophonePlugin)
public class MicrophonePlugin: CAPPlugin {
    private var implementation: Microphone?

    @objc override public func checkPermissions(_ call: CAPPluginCall) {
        var result: [String: Any] = [:]
        for permission in MicrophonePermissionType.allCases {
            let state: String
            switch permission {
            case .microphone:
                state = AVCaptureDevice.authorizationStatus(for: .audio).authorizationState
            }
            result[permission.rawValue] = state
        }
        call.resolve(result)
    }

    @objc override public func requestPermissions(_ call: CAPPluginCall) {
        // TODO: (CHECK) We are not even sending permission list (Do we need it ?)
        // get the list of desired types, if passed
        let typeList = call.getArray("permissions", String.self)?.compactMap({ (type) -> MicrophonePermissionType? in
            return MicrophonePermissionType(rawValue: type)
        }) ?? []
        // otherwise check everything
        let permissions: [MicrophonePermissionType] = (typeList.count > 0) ? typeList : MicrophonePermissionType.allCases
        // request the permissions
        let group = DispatchGroup()
        for permission in permissions {
            switch permission {
            case .microphone:
                group.enter()
                AVCaptureDevice.requestAccess(for: .audio) { _ in
                    group.leave()
                }
            }
        }
        group.notify(queue: DispatchQueue.main) { [weak self] in
            self?.checkPermissions(call)
        }
    }

    @objc func startRecording(_ call: CAPPluginCall) {
        if !isAudioRecordingPermissionGranted() {
            call.reject(StatusMessageTypes.microphonePermissionNotGranted.rawValue)
            return
        }

        if implementation != nil {
            call.reject(StatusMessageTypes.recordingInProgress.rawValue)
            return
        }

        implementation = Microphone()
        if implementation == nil {
            call.reject(StatusMessageTypes.cannotRecordOnThisPhone.rawValue)
            return
        }

        let successfullyStartedRecording = implementation!.startRecording()
        if successfullyStartedRecording == false {
            call.reject(StatusMessageTypes.cannotRecordOnThisPhone.rawValue)
        } else {
            call.resolve(["status": StatusMessageTypes.recordingStared.rawValue])
        }
    }

    @objc func pauseRecording(_ call: CAPPluginCall) {
        if implementation == nil {
            call.reject(StatusMessageTypes.noRecordingInProgress.rawValue)
            return
        }

        implementation?.pauseRecording()
        call.resolve(["status": StatusMessageTypes.recordingPaused.rawValue])
    }

    @objc func resumeRecording(_ call: CAPPluginCall) {
        if implementation == nil {
            call.reject(StatusMessageTypes.noRecordingInProgress.rawValue)
            return
        }

        implementation?.resumeRecording()
        call.resolve(["status": StatusMessageTypes.recordingResumed.rawValue])
    }

    @objc func getCurrentStatus(_ call: CAPPluginCall) {
        if let impl = implementation {
            call.resolve(["status": impl.getCurrentStatus()])
        } else {
            call.resolve(["status": StatusMessageTypes.noRecordingInProgress.rawValue])
        }
    }

    @objc func stopRecording(_ call: CAPPluginCall) {
        if implementation == nil {
            call.reject(StatusMessageTypes.noRecordingInProgress.rawValue)
            return
        }

        implementation?.stopRecording()

        let audioFileUrl = implementation?.getOutputFile()
        if audioFileUrl == nil {
            implementation = nil
            call.reject(StatusMessageTypes.failedToFetchRecording.rawValue)
            return
        }

        let webURL = bridge?.portablePath(fromLocalURL: audioFileUrl)

        let audioRecording = AudioRecording(
            path: audioFileUrl?.absoluteString,
            webPath: webURL?.path,
            duration: getAudioFileDuration(audioFileUrl),
            format: ".m4a",
            mimeType: "audio/aac"
        )
        implementation = nil
        if audioRecording.duration < 0 {
            call.reject(StatusMessageTypes.failedToFetchRecording.rawValue)
        } else {
            call.resolve(audioRecording.toDictionary())
        }
    }

    private func isAudioRecordingPermissionGranted() -> Bool {
        return AVAudioSession.sharedInstance().recordPermission == AVAudioSession.RecordPermission.granted
    }

    private func getAudioFileDuration(_ filePath: URL?) -> Int {
        if filePath == nil {
            return -1
        }
        return Int(CMTimeGetSeconds(AVURLAsset(url: filePath!).duration) * 1000)
    }
}
