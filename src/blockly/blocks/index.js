// Central export for all Blockly block definitions
import { gameModeBlocks } from "./gameModeBlocks.js";
import { spaceNodeBlocks } from "./spaceNodeBlocks.js";
import { transformBlocks } from "./transformBlocks.js";
import { vectorMathBlocks } from "./vectorMathBlocks.js";
import { componentBlocks } from "./componentBlocks.js";
import { cameraTimeBlocks } from "./cameraTimeBlocks.js";
import { logicControlBlocks } from "./logicControlBlocks.js";
import { arrayStringBlocks } from "./arrayStringBlocks.js";

// Combine all block definitions
export const allBlocks = {
  ...gameModeBlocks,
  ...spaceNodeBlocks,
  ...transformBlocks,
  ...vectorMathBlocks,
  ...componentBlocks,
  ...cameraTimeBlocks,
  ...logicControlBlocks,
  ...arrayStringBlocks,
};

// Export individual categories for flexibility
export {
  gameModeBlocks,
  spaceNodeBlocks,
  transformBlocks,
  vectorMathBlocks,
  componentBlocks,
  cameraTimeBlocks,
  logicControlBlocks,
  arrayStringBlocks,
};
