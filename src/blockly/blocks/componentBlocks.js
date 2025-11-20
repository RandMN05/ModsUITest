// Component-related block definitions
export const componentBlocks = {
  add_gltf_component: {
    type: "add_gltf_component",
    message0: "add 3D model %1 to %2",
    args0: [
      { type: "input_value", name: "GUID" },
      { type: "input_value", name: "NODE" },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 230,
    tooltip: "Add GLTF component to node",
    helpUrl: "",
  },
  add_component: {
    type: "add_component",
    message0: "add component %1 to %2",
    args0: [
      { type: "input_value", name: "COMPONENT" },
      { type: "input_value", name: "NODE" },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 230,
    tooltip: "Add component to node",
    helpUrl: "",
  },
  add_component_by_name: {
    type: "add_component_by_name",
    message0: "add component %1 to %2",
    args0: [
      { type: "input_value", name: "NAME" },
      { type: "input_value", name: "NODE" },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 230,
    tooltip: "Add component by name to node",
    helpUrl: "",
  },
};
