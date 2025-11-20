// Block creation utilities for Lua code import
/**
 * Create blocks from parsed structure
 * @param {Blockly.Workspace} workspace - The Blockly workspace
 * @param {Object} structure - Parsed Lua code structure
 */
export const createBlocksFromStructure = (workspace, structure) => {
  let currentY = 50;
  const spacing = 150;

  structure.variables.forEach((varName, index) => {
    createVariableBlock(workspace, varName, 50, currentY + index * 80);
  });

  if (structure.variables.length > 0) {
    currentY += structure.variables.length * 80 + spacing;
  }

  if (structure.startFunction) {
    createGameModeBlock(
      workspace,
      "gamemode_start",
      structure.startFunction,
      50,
      currentY
    );
    currentY += spacing;
  }

  if (structure.updateFunction) {
    createGameModeBlock(
      workspace,
      "gamemode_update",
      structure.updateFunction,
      50,
      currentY
    );
  }
};

/**
 * Create a variable declaration block
 * @param {Blockly.Workspace} workspace - The Blockly workspace
 * @param {string} varName - Variable name
 * @param {number} x - X position
 * @param {number} y - Y position
 */
export const createVariableBlock = (workspace, varName, x, y) => {
  workspace.createVariable(varName);

  const block = workspace.newBlock("declare_variable");
  const textBlock = workspace.newBlock("text");
  textBlock.setFieldValue(varName, "TEXT");

  block.getInput("NAME").connection.connect(textBlock.outputConnection);
  block.moveBy(x, y);
  block.initSvg();
  textBlock.initSvg();
  block.render();
  textBlock.render();
};

/**
 * Create a GameMode function block with statements
 * @param {Blockly.Workspace} workspace - The Blockly workspace
 * @param {string} functionType - Type of function ('gamemode_start' or 'gamemode_update')
 * @param {Object[]} statements - Array of statement objects
 * @param {number} x - X position
 * @param {number} y - Y position
 */
export const createGameModeBlock = (
  workspace,
  functionType,
  statements,
  x,
  y
) => {
  const funcBlock = workspace.newBlock(functionType);
  funcBlock.moveBy(x, y);
  funcBlock.initSvg();

  let previousBlock = null;
  let statementConnection = funcBlock.getInput("CODE").connection;

  statements.forEach((statement, index) => {
    const block = createStatementBlock(workspace, statement);
    if (block) {
      if (previousBlock) {
        previousBlock.nextConnection.connect(block.previousConnection);
      } else {
        statementConnection.connect(block.previousConnection);
      }
      previousBlock = block;
    }
  });

  funcBlock.render();
};

/**
 * Create a statement block from a statement object
 * @param {Blockly.Workspace} workspace - The Blockly workspace
 * @param {Object} statement - Statement object
 * @returns {Blockly.Block|null} Created block or null
 */
export const createStatementBlock = (workspace, statement) => {
  let block = null;

  switch (statement.type) {
    case "variable_set_create_node":
      workspace.createVariable(statement.variable);
      block = workspace.newBlock("variables_set");
      block.setFieldValue(statement.variable, "VAR");

      const createBlock = workspace.newBlock("create_node");
      const nameBlock = workspace.newBlock("text");
      nameBlock.setFieldValue(statement.nodeName, "TEXT");

      createBlock
        .getInput("NAME")
        .connection.connect(nameBlock.outputConnection);
      block.getInput("VALUE").connection.connect(createBlock.outputConnection);

      createBlock.initSvg();
      nameBlock.initSvg();
      break;

    case "add_node_to_space":
      block = workspace.newBlock("add_node_to_space");
      const spaceBlock = workspace.newBlock("get_space");
      const nodeVarBlock = workspace.newBlock("variables_get");
      nodeVarBlock.setFieldValue(statement.node, "VAR");

      block.getInput("SPACE").connection.connect(spaceBlock.outputConnection);
      block.getInput("NODE").connection.connect(nodeVarBlock.outputConnection);

      spaceBlock.initSvg();
      nodeVarBlock.initSvg();
      break;

    case "add_gltf_component":
      block = workspace.newBlock("add_gltf_component");
      const guidBlock = workspace.newBlock("text");
      guidBlock.setFieldValue(statement.guid, "TEXT");
      const nodeBlock = workspace.newBlock("variables_get");
      nodeBlock.setFieldValue(statement.node, "VAR");

      block.getInput("GUID").connection.connect(guidBlock.outputConnection);
      block.getInput("NODE").connection.connect(nodeBlock.outputConnection);

      guidBlock.initSvg();
      nodeBlock.initSvg();
      break;

    case "set_position":
    case "add_position":
      block = workspace.newBlock(statement.type);
      const posNodeBlock = workspace.newBlock("variables_get");
      posNodeBlock.setFieldValue(statement.node, "VAR");
      const vectorBlock = createVector3Block(
        workspace,
        statement.x,
        statement.y,
        statement.z
      );

      block.getInput("NODE").connection.connect(posNodeBlock.outputConnection);
      block
        .getInput("POSITION")
        .connection.connect(vectorBlock.outputConnection);

      posNodeBlock.initSvg();
      break;

    case "set_rotation":
    case "add_rotation":
      block = workspace.newBlock(statement.type);
      const rotNodeBlock = workspace.newBlock("variables_get");
      rotNodeBlock.setFieldValue(statement.node, "VAR");
      const rotVectorBlock = createVector3Block(
        workspace,
        statement.x,
        statement.y,
        statement.z
      );

      block.getInput("NODE").connection.connect(rotNodeBlock.outputConnection);
      block
        .getInput("ROTATION")
        .connection.connect(rotVectorBlock.outputConnection);

      rotNodeBlock.initSvg();
      break;
  }

  if (block) {
    block.initSvg();
    block.render();
  }

  return block;
};

/**
 * Create a Vector3 block with components
 * @param {Blockly.Workspace} workspace - The Blockly workspace
 * @param {string|number} x - X component
 * @param {string|number} y - Y component
 * @param {string|number} z - Z component
 * @returns {Blockly.Block} Created Vector3 block
 */
export const createVector3Block = (workspace, x, y, z) => {
  const vectorBlock = workspace.newBlock("vector3_create");

  const xBlock = workspace.newBlock("math_number");
  xBlock.setFieldValue(parseFloat(x) || 0, "NUM");

  const yBlock = workspace.newBlock("math_number");
  yBlock.setFieldValue(parseFloat(y) || 0, "NUM");

  const zBlock = workspace.newBlock("math_number");
  zBlock.setFieldValue(parseFloat(z) || 0, "NUM");

  vectorBlock.getInput("X").connection.connect(xBlock.outputConnection);
  vectorBlock.getInput("Y").connection.connect(yBlock.outputConnection);
  vectorBlock.getInput("Z").connection.connect(zBlock.outputConnection);

  vectorBlock.initSvg();
  xBlock.initSvg();
  yBlock.initSvg();
  zBlock.initSvg();

  return vectorBlock;
};
