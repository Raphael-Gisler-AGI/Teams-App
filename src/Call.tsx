import React, { useCallback } from "react"
import { State, TeamsCallState } from "./Types"
import { CallAgentProvider, CallClientProvider, CallProvider, CameraButton, ControlBar, EndCallButton, MicrophoneButton, ScreenShareButton, usePropsFor, VideoGallery } from "@azure/communication-react"
import { mergeStyles, Stack } from "@fluentui/react"
import { useNavigate } from "react-router-dom"

function Call({ state, teamsCallState }: { state: State, teamsCallState: TeamsCallState }) {
    return (
        <div>
            <CallClientProvider callClient={state.callClient}>
                <CallAgentProvider callAgent={state.callAgent}>
                    <CallProvider call={teamsCallState.teamsCall}>
                        <CallComponents />
                    </CallProvider>
                </CallAgentProvider>
            </CallClientProvider>
        </div>
    )
}

function CallComponents() {
    const navigate = useNavigate()

    const videoGalleryProps = usePropsFor(VideoGallery)
    const cameraProps = usePropsFor(CameraButton);
    const microphoneProps = usePropsFor(MicrophoneButton);
    const screenShareProps = usePropsFor(ScreenShareButton);
    const endCallProps = usePropsFor(EndCallButton);

    const onHangup = useCallback(async (): Promise<void> => {
        await endCallProps.onHangUp();
        navigate("/app/overview")
    }, [endCallProps]);

    return (
        <Stack className={mergeStyles({ height: '100%' })}>
            <div style={{ width: '100vw', height: '90vh' }}>
                {videoGalleryProps && <VideoGallery {...videoGalleryProps} />}
            </div>

            <ControlBar layout="floatingBottom">
                {cameraProps && <CameraButton {...cameraProps} />}
                {microphoneProps && <MicrophoneButton {...microphoneProps} />}
                {screenShareProps && <ScreenShareButton {...screenShareProps} />}
                {endCallProps && <EndCallButton {...endCallProps} onHangUp={onHangup} />}
            </ControlBar>
        </Stack>
    )
}

export default Call