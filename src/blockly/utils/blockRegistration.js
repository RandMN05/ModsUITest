// Block registration utilities
import * as Blockly from "blockly/core";

/**
 * Register block definitions with Blockly
 * @param {Object} blockDefinitions - Object containing block definitions
 */
export const registerBlocks = (blockDefinitions) => {
  Object.keys(blockDefinitions).forEach((blockType) => {
    Blockly.Blocks[blockType] = {
      init: function () {
        this.jsonInit(blockDefinitions[blockType]);
      },
    };
  });
};
