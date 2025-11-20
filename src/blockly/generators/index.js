// Central export for all Lua generators
import { registerGameModeGenerators } from "./gameModeGenerators.js";
import { registerSpaceNodeGenerators } from "./spaceNodeGenerators.js";
import { registerTransformGenerators } from "./transformGenerators.js";
import { registerVectorMathGenerators } from "./vectorMathGenerators.js";
import { registerComponentGenerators } from "./componentGenerators.js";
import { registerCameraTimeGenerators } from "./cameraTimeGenerators.js";
import { registerLogicControlGenerators } from "./logicControlGenerators.js";
import { registerArrayStringGenerators } from "./arrayStringGenerators.js";

/**
 * Register all Lua code generators with the provided luaGenerator instance
 * @param {Object} luaGenerator - The Blockly Lua generator instance
 */
export const registerAllGenerators = (luaGenerator) => {
  registerGameModeGenerators(luaGenerator);
  registerSpaceNodeGenerators(luaGenerator);
  registerTransformGenerators(luaGenerator);
  registerVectorMathGenerators(luaGenerator);
  registerComponentGenerators(luaGenerator);
  registerCameraTimeGenerators(luaGenerator);
  registerLogicControlGenerators(luaGenerator);
  registerArrayStringGenerators(luaGenerator);
};

// Export individual registration functions for flexibility
export {
  registerGameModeGenerators,
  registerSpaceNodeGenerators,
  registerTransformGenerators,
  registerVectorMathGenerators,
  registerComponentGenerators,
  registerCameraTimeGenerators,
  registerLogicControlGenerators,
  registerArrayStringGenerators,
};
