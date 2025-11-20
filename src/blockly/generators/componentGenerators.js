// Component Lua code generators
import { Order } from "blockly/lua";

export const registerComponentGenerators = (luaGenerator) => {
  luaGenerator.forBlock["add_gltf_component"] = function (block, generator) {
    const guid = generator.valueToCode(block, "GUID", Order.ATOMIC) || '""';
    const node = generator.valueToCode(block, "NODE", Order.ATOMIC) || "nil";
    return `${node}:AddGltfComponent(${guid})\n`;
  };

  luaGenerator.forBlock["add_component"] = function (block, generator) {
    const component =
      generator.valueToCode(block, "COMPONENT", Order.ATOMIC) || '""';
    const node = generator.valueToCode(block, "NODE", Order.ATOMIC) || "nil";
    return `${node}:AddComponent(${component})\n`;
  };

  luaGenerator.forBlock["add_component_by_name"] = function (block, generator) {
    const name = generator.valueToCode(block, "NAME", Order.ATOMIC) || '""';
    const node = generator.valueToCode(block, "NODE", Order.ATOMIC) || "nil";
    return `${node}:AddComponent(${name});\n`;
  };
};
