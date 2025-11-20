// Space and Node Lua code generators
import { Order } from "blockly/lua";

export const registerSpaceNodeGenerators = (luaGenerator) => {
  luaGenerator.forBlock["get_space"] = function (block, generator) {
    return ["Vertex.GetSpace()", Order.HIGH];
  };

  luaGenerator.forBlock["create_node"] = function (block, generator) {
    const name = generator.valueToCode(block, "NAME", Order.ATOMIC) || '""';
    return [`space:CreateNode(${name})`, Order.HIGH];
  };

  luaGenerator.forBlock["add_node_to_space"] = function (block, generator) {
    const node = generator.valueToCode(block, "NODE", Order.ATOMIC) || "nil";
    const space =
      generator.valueToCode(block, "SPACE", Order.ATOMIC) || "space";
    return `${space}:AddNode(${node})\n`;
  };

  luaGenerator.forBlock["get_nodes"] = function (block, generator) {
    const space =
      generator.valueToCode(block, "SPACE", Order.ATOMIC) || "space";
    const filter =
      generator.valueToCode(block, "FILTER", Order.ATOMIC) ||
      "function(node) return true end";
    return [`${space}:GetNodes(${filter})`, Order.HIGH];
  };

  luaGenerator.forBlock["get_node_name"] = function (block, generator) {
    const node = generator.valueToCode(block, "NODE", Order.ATOMIC) || "nil";
    return [`${node}:GetName()`, Order.HIGH];
  };

  luaGenerator.forBlock["destroy_node"] = function (block, generator) {
    const node = generator.valueToCode(block, "NODE", Order.ATOMIC) || "nil";
    const space =
      generator.valueToCode(block, "SPACE", Order.ATOMIC) || "space";
    return `${space}:DestroyNode(${node});\n`;
  };
};
