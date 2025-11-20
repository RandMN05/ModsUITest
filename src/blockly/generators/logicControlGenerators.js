// Logic and Control Flow Lua code generators
import { Order } from "blockly/lua";

export const registerLogicControlGenerators = (luaGenerator) => {
  luaGenerator.forBlock["if_statement_comparison"] = function (
    block,
    generator
  ) {
    const a = generator.valueToCode(block, "A", Order.ATOMIC) || "nil";
    const op = block.getFieldValue("OP");
    const b = generator.valueToCode(block, "B", Order.ATOMIC) || "nil";
    const statements = generator.statementToCode(block, "DO");
    return `if ${a} ${op} ${b} then\n${statements}end\n`;
  };

  luaGenerator.forBlock["return_statement"] = function (block, generator) {
    return "return;\n";
  };

  luaGenerator.forBlock["boolean_literal"] = function (block, generator) {
    const bool = block.getFieldValue("BOOL") === "TRUE" ? "true" : "false";
    return [bool, Order.ATOMIC];
  };

  luaGenerator.forBlock["anonymous_function"] = function (block, generator) {
    const params = block.getFieldValue("PARAMS");
    const returnValue =
      generator.valueToCode(block, "RETURN", Order.ATOMIC) || "true";
    return [`function(${params}) return ${returnValue} end`, Order.ATOMIC];
  };
};
