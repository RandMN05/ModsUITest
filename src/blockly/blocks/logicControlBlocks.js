// Logic and Control Flow-related block definitions
export const logicControlBlocks = {
  if_statement_comparison: {
    type: "if_statement_comparison",
    message0: "if %1 %2 %3 then %4 %5",
    args0: [
      { type: "input_value", name: "A" },
      {
        type: "field_dropdown",
        name: "OP",
        options: [
          ["==", "=="],
          ["~=", "~="],
          ["<", "<"],
          [">", ">"],
          ["<=", "<="],
          [">=", ">="],
        ],
      },
      { type: "input_value", name: "B" },
      { type: "input_dummy" },
      { type: "input_statement", name: "DO" },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 210,
    tooltip: "If statement with comparison",
    helpUrl: "",
  },
  return_statement: {
    type: "return_statement",
    message0: "return",
    previousStatement: null,
    colour: 330,
    tooltip: "Return from function",
    helpUrl: "",
  },
  boolean_literal: {
    type: "boolean_literal",
    message0: "%1",
    args0: [
      {
        type: "field_dropdown",
        name: "BOOL",
        options: [
          ["true", "TRUE"],
          ["false", "FALSE"],
        ],
      },
    ],
    output: "Boolean",
    colour: 210,
    tooltip: "Boolean literal",
    helpUrl: "",
  },
  anonymous_function: {
    type: "anonymous_function",
    message0: "function ( %1 ) %2 return %3",
    args0: [
      { type: "field_input", name: "PARAMS", text: "node" },
      { type: "input_dummy" },
      { type: "input_value", name: "RETURN" },
    ],
    output: "Function",
    colour: 290,
    tooltip: "Anonymous function that returns a value",
    helpUrl: "",
  },
};
