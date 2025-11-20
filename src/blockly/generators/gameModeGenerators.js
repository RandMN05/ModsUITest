// GameMode Lua code generators
import { Order } from "blockly/lua";

export const registerGameModeGenerators = (luaGenerator) => {
  // Override Blockly's built-in variables_set generator to add semicolons
  luaGenerator.forBlock["variables_set"] = function (block, generator) {
    const varName = generator.getVariableName(block.getFieldValue("VAR"));
    const value = generator.valueToCode(block, "VALUE", Order.NONE) || "0";
    return `${varName} = ${value};\n`;
  };

  luaGenerator.forBlock["gamemode_start"] = function (block, generator) {
    const statements = generator.statementToCode(block, "CODE");
    return `GameModeController.Start = function(server)\n${statements}end\n`;
  };

  luaGenerator.forBlock["gamemode_update"] = function (block, generator) {
    const statements = generator.statementToCode(block, "CODE");
    return `GameModeController.Update = function(server, deltaTime)\n${statements}end\n`;
  };

  luaGenerator.forBlock["declare_variable"] = function (block, generator) {
    const name = generator.valueToCode(block, "NAME", Order.ATOMIC) || "nil";
    return `${name} = nil\n`;
  };

  luaGenerator.forBlock["declare_local_variable"] = function (
    block,
    generator
  ) {
    const varName = generator.getVariableName(block.getFieldValue("VAR"));
    const value = generator.valueToCode(block, "VALUE", Order.ATOMIC) || "nil";
    return `local ${varName} = ${value};\n`;
  };

  luaGenerator.forBlock["print_statement"] = function (block, generator) {
    const text = generator.valueToCode(block, "TEXT", Order.ATOMIC) || '""';
    return `print(${text});\n`;
  };
};
