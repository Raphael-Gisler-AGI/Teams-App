import {
  AcceptCallOptions,
  DeviceManager,
  LocalVideoStream,
  StartCallOptions,
  VideoDeviceInfo,
} from "@azure/communication-calling";
import { ActiveErrorMessage } from "@azure/communication-react";
import { CallDevice, TeamsCallState } from "../Types";

async function getCamera(device: VideoDeviceInfo): Promise<LocalVideoStream[]> {
  if (!device || device?.id === "camera:") {
    throw new Error();
  }
  return [new LocalVideoStream(device)];
}

async function getSpeakers(device: DeviceManager): Promise<CallDevice> {
  const speakers = await device.getSpeakers();
  const speakerDevice =
    speakers.find((speaker) => speaker.isSystemDefault) ?? speakers[0];

  if (!speakerDevice || speakerDevice.id === "speaker:") {
    throw new Error();
  }
  await device.selectSpeaker(speakerDevice);
  return {
    selectedId: speakerDevice.id,
    options: speakers.map((speaker) => {
      return { id: speaker.id, name: speaker.name };
    }),
  };
}

const getMicrophones = async (device: DeviceManager): Promise<CallDevice> => {
  const microphones = await device.getMicrophones();

  const microphoneDevice =
    microphones.find((mic) => mic.isSystemDefault) ?? microphones[0];
  if (!microphoneDevice || microphoneDevice.id === "microphone:") {
    throw new Error();
  }
  await device.selectMicrophone(microphoneDevice);
  return {
    selectedId: microphoneDevice.id,
    options: microphones.map((microphone) => {
      return { id: microphone.id, name: microphone.name };
    }),
  };
};

export async function getCallOptions(
  isMuted: boolean,
  hasVideo: boolean,
  callState: TeamsCallState,
  deviceManager: DeviceManager,
  errors: ActiveErrorMessage[] = []
): Promise<AcceptCallOptions | StartCallOptions> {
  const callOptions: AcceptCallOptions = {
    videoOptions: {},
    audioOptions: { muted: isMuted },
  };

  const cameras = await deviceManager.getCameras();
  const cameraDevice = cameras[0];

  const hasCamera = cameraDevice && cameraDevice?.id !== "camera:";

  if (hasCamera) {
    callState.camera = {
      selectedId: cameraDevice.id,
      options: cameras.map((camera) => {
        return { id: camera.id, name: camera.name };
      }),
    };
  }

  if (hasVideo) {
    try {
      callOptions.videoOptions!.localVideoStreams = await getCamera(
        cameraDevice
      );
    } catch {
      errors.push({ type: "callCameraAccessDenied" });
    }
  }

  try {
    callState.speakers = await getSpeakers(deviceManager);
  } catch {
    errors.push({ type: "callNoSpeakerFound" });
  }

  try {
    callState.microphones = await getMicrophones(deviceManager);
  } catch {
    errors.push({ type: "callNoMicrophoneFound" });
  }
  return callOptions;
}
