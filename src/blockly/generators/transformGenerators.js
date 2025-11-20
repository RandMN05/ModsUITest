// Transform Lua code generators
import { Order } from "blockly/lua";

export const registerTransformGenerators = (luaGenerator) => {
  luaGenerator.forBlock["set_position"] = function (block, generator) {
    const node = generator.valueToCode(block, "NODE", Order.ATOMIC) || "nil";
    const position =
      generator.valueToCode(block, "POSITION", Order.ATOMIC) ||
      "Vector3.Zero()";
    return `${node}.Position = ${position}\n`;
  };

  luaGenerator.forBlock["set_rotation"] = function (block, generator) {
    const node = generator.valueToCode(block, "NODE", Order.ATOMIC) || "nil";
    const rotation =
      generator.valueToCode(block, "ROTATION", Order.ATOMIC) ||
      "Vector3.Zero()";
    return `${node}.Rotation = ${rotation}\n`;
  };

  luaGenerator.forBlock["add_position"] = function (block, generator) {
    const node = generator.valueToCode(block, "NODE", Order.ATOMIC) || "nil";
    const position =
      generator.valueToCode(block, "POSITION", Order.ATOMIC) ||
      "Vector3.Zero()";
    return `${node}.Position = ${node}.Position:Add(${position})\n`;
  };

  luaGenerator.forBlock["add_rotation"] = function (block, generator) {
    const node = generator.valueToCode(block, "NODE", Order.ATOMIC) || "nil";
    const rotation =
      generator.valueToCode(block, "ROTATION", Order.ATOMIC) ||
      "Vector3.Zero()";
    return `${node}.Rotation = ${node}.Rotation:Add(${rotation})\n`;
  };

  luaGenerator.forBlock["set_scale"] = function (block, generator) {
    const node = generator.valueToCode(block, "NODE", Order.ATOMIC) || "nil";
    const scale =
      generator.valueToCode(block, "SCALE", Order.ATOMIC) ||
      "Vector3.FromValues(1, 1, 1)";
    return `${node}.Scale = ${scale};\n`;
  };

  luaGenerator.forBlock["get_scale"] = function (block, generator) {
    const node = generator.valueToCode(block, "NODE", Order.ATOMIC) || "nil";
    return [`${node}.Scale`, Order.HIGH];
  };

  luaGenerator.forBlock["set_world_position"] = function (block, generator) {
    const node = generator.valueToCode(block, "NODE", Order.ATOMIC) || "nil";
    const position =
      generator.valueToCode(block, "POSITION", Order.ATOMIC) ||
      "Vector3.Zero()";
    return `${node}.WorldPosition = ${position};\n`;
  };

  luaGenerator.forBlock["get_world_position"] = function (block, generator) {
    const node = generator.valueToCode(block, "NODE", Order.ATOMIC) || "nil";
    return [`${node}.WorldPosition`, Order.HIGH];
  };
};
