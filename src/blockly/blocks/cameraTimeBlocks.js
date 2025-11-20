// Camera and Time-related block definitions
export const cameraTimeBlocks = {
  delta_time: {
    type: "delta_time",
    message0: "delta time",
    output: "Number",
    colour: 120,
    tooltip: "Delta time from Update function",
    helpUrl: "",
  },
  get_main_camera: {
    type: "get_main_camera",
    message0: "get main camera",
    output: "Camera",
    colour: 290,
    tooltip: "Get the main camera",
    helpUrl: "",
  },
  camera_position: {
    type: "camera_position",
    message0: "%1 position",
    args0: [{ type: "input_value", name: "CAMERA" }],
    output: "Vector3",
    colour: 290,
    tooltip: "Get camera position",
    helpUrl: "",
  },
};
