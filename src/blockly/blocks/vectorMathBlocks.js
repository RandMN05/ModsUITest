// Vector and Math-related block definitions
export const vectorMathBlocks = {
  vector3_create: {
    type: "vector3_create",
    message0: "vector x %1 y %2 z %3",
    args0: [
      { type: "input_value", name: "X" },
      { type: "input_value", name: "Y" },
      { type: "input_value", name: "Z" },
    ],
    output: "Vector3",
    colour: 60,
    tooltip: "Create Vector3",
    helpUrl: "",
  },
  vector3_distance: {
    type: "vector3_distance",
    message0: "distance from %1 to %2",
    args0: [
      { type: "input_value", name: "FROM" },
      { type: "input_value", name: "TO" },
    ],
    output: "Number",
    colour: 60,
    tooltip: "Calculate distance between two vectors",
    helpUrl: "",
  },
  vector3_component: {
    type: "vector3_component",
    message0: "%1 %2",
    args0: [
      { type: "input_value", name: "VECTOR" },
      {
        type: "field_dropdown",
        name: "COMPONENT",
        options: [
          ["X", "X"],
          ["Y", "Y"],
          ["Z", "Z"],
        ],
      },
    ],
    output: "Number",
    colour: 60,
    tooltip: "Get vector component (X, Y, or Z)",
    helpUrl: "",
  },
  multiply_number: {
    type: "multiply_number",
    message0: "%1 × %2",
    args0: [
      { type: "input_value", name: "A" },
      { type: "input_value", name: "B" },
    ],
    output: "Number",
    colour: 230,
    tooltip: "Multiply two numbers",
    helpUrl: "",
  },
  number_literal: {
    type: "number_literal",
    message0: "%1",
    args0: [{ type: "field_number", name: "NUM", value: 1 }],
    output: "Number",
    colour: 230,
    tooltip: "Number literal",
    helpUrl: "",
  },
};
