// Vector and Math Lua code generators
import { Order } from "blockly/lua";

export const registerVectorMathGenerators = (luaGenerator) => {
  luaGenerator.forBlock["vector3_create"] = function (block, generator) {
    const x = generator.valueToCode(block, "X", Order.ATOMIC) || "0";
    const y = generator.valueToCode(block, "Y", Order.ATOMIC) || "0";
    const z = generator.valueToCode(block, "Z", Order.ATOMIC) || "0";
    return [`Vector3.FromValues(${x}, ${y}, ${z})`, Order.HIGH];
  };

  luaGenerator.forBlock["vector3_distance"] = function (block, generator) {
    const from =
      generator.valueToCode(block, "FROM", Order.ATOMIC) || "Vector3.Zero()";
    const to =
      generator.valueToCode(block, "TO", Order.ATOMIC) || "Vector3.Zero()";
    return [`${from}:Distance(${to})`, Order.HIGH];
  };

  luaGenerator.forBlock["vector3_component"] = function (block, generator) {
    const vector =
      generator.valueToCode(block, "VECTOR", Order.ATOMIC) || "Vector3.Zero()";
    const component = block.getFieldValue("COMPONENT");
    return [`${vector}.${component}`, Order.HIGH];
  };

  luaGenerator.forBlock["multiply_number"] = function (block, generator) {
    const a = generator.valueToCode(block, "A", Order.ATOMIC) || "0";
    const b = generator.valueToCode(block, "B", Order.ATOMIC) || "0";
    return [`${a} * ${b}`, Order.MULTIPLICATIVE];
  };

  luaGenerator.forBlock["number_literal"] = function (block, generator) {
    const num = block.getFieldValue("NUM");
    return [String(num), Order.ATOMIC];
  };
};
