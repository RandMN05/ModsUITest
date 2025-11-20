// Array and String Lua code generators
import { Order } from "blockly/lua";

export const registerArrayStringGenerators = (luaGenerator) => {
  luaGenerator.forBlock["array_index"] = function (block, generator) {
    const array =
      generator.valueToCode(block, "ARRAY", Order.ATOMIC) || "array";
    const index = generator.valueToCode(block, "INDEX", Order.ATOMIC) || "1";
    return [`${array}[${index}]`, Order.HIGH];
  };

  luaGenerator.forBlock["array_length"] = function (block, generator) {
    const array =
      generator.valueToCode(block, "ARRAY", Order.ATOMIC) || "array";
    return [`#${array}`, Order.HIGH];
  };

  luaGenerator.forBlock["for_loop_array"] = function (block, generator) {
    const variable = generator.getVariableName(block.getFieldValue("VAR"));
    const array =
      generator.valueToCode(block, "ARRAY", Order.ATOMIC) || "array";
    const statements = generator.statementToCode(block, "DO");
    return `for ${variable} = 1, #${array} do\n${statements}end\n`;
  };

  luaGenerator.forBlock["string_concat"] = function (block, generator) {
    const a = generator.valueToCode(block, "A", Order.CONCATENATION) || '""';
    const b = generator.valueToCode(block, "B", Order.CONCATENATION) || '""';
    return [`${a} .. ${b}`, Order.CONCATENATION];
  };

  luaGenerator.forBlock["string_find"] = function (block, generator) {
    const pattern =
      generator.valueToCode(block, "PATTERN", Order.ATOMIC) || '""';
    const string = generator.valueToCode(block, "STRING", Order.ATOMIC) || '""';
    return [`string.find(${string}, ${pattern})`, Order.HIGH];
  };

  luaGenerator.forBlock["string_format"] = function (block, generator) {
    const format = generator.valueToCode(block, "FORMAT", Order.ATOMIC) || '""';
    const value = generator.valueToCode(block, "VALUE", Order.ATOMIC) || "0";
    return [`string.format(${format}, ${value})`, Order.HIGH];
  };
};
