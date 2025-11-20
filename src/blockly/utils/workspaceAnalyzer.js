// Workspace analysis utilities
/**
 * Analyze the workspace to identify nodes and their relationships
 * @param {Blockly.Workspace} workspace - The Blockly workspace
 * @returns {Object} Analysis results
 */
export const analyzeWorkspace = (workspace) => {
  const analysis = {
    createdNodes: new Set(),
    foundNodes: new Set(),
    nodesWithPhysics: new Set(),
    nodesUsingCollision: new Set(),
    nodesNeedingPhysics: new Set(),
    missingNodeVariables: new Set(),
    allNodeReferences: new Set(),
    nodeVariableMap: new Map(),
  };

  const blocks = workspace.getAllBlocks();

  blocks.forEach((block) => {
    const type = block.type;

    if (type === "vertex_create_node") {
      const nameBlock = block.getInputTargetBlock("NAME");
      if (nameBlock && nameBlock.type === "text") {
        const nodeName = nameBlock.getFieldValue("TEXT");
        analysis.createdNodes.add(nodeName);

        const parent = block.getParent();
        if (parent && parent.type === "variables_set") {
          const varName = parent.getField("VAR")?.getText();
          if (varName) {
            analysis.nodeVariableMap.set(nodeName, varName);
          }
        }
      }
    }

    if (type === "vertex_find_node") {
      const nameBlock = block.getInputTargetBlock("NAME");
      if (nameBlock && nameBlock.type === "text") {
        const nodeName = nameBlock.getFieldValue("TEXT");
        analysis.foundNodes.add(nodeName);

        const parent = block.getParent();
        if (parent && parent.type === "variables_set") {
          const varName = parent.getField("VAR")?.getText();
          if (varName) {
            analysis.nodeVariableMap.set(nodeName, varName);
          }
        }
      }
    }

    if (type === "vertex_add_physics") {
      const nodeBlock = block.getInputTargetBlock("NODE");
      const nodeInfo = extractNodeInfo(nodeBlock);
      if (nodeInfo) {
        analysis.nodesWithPhysics.add(nodeInfo.name || nodeInfo.variable);
        if (nodeInfo.name && nodeInfo.variable) {
          analysis.nodeVariableMap.set(nodeInfo.name, nodeInfo.variable);
        }
      }
    }

    if (type === "vertex_on_collision") {
      const nodeBlock = block.getInputTargetBlock("NODE");
      const nodeInfo = extractNodeInfo(nodeBlock);
      if (nodeInfo) {
        const identifier = nodeInfo.name || nodeInfo.variable;
        analysis.nodesUsingCollision.add(identifier);
        if (nodeInfo.name && nodeInfo.variable) {
          analysis.nodeVariableMap.set(nodeInfo.name, nodeInfo.variable);
        }
      }
    }

    if (type === "variables_get") {
      const varName = block.getField("VAR")?.getText();
      if (varName) {
        analysis.allNodeReferences.add(varName);
      }
    }
  });

  analysis.nodesUsingCollision.forEach((identifier) => {
    if (!analysis.nodesWithPhysics.has(identifier)) {
      analysis.nodesNeedingPhysics.add(identifier);
    }
  });

  return analysis;
};

/**
 * Extract node information from a block
 * @param {Blockly.Block} block - The block to extract from
 * @returns {Object|null} Node information or null
 */
export const extractNodeInfo = (block) => {
  if (!block) return null;

  const info = {
    name: null,
    variable: null,
  };

  if (block.type === "variables_get") {
    info.variable = block.getField("VAR")?.getText();
    return info;
  }

  if (
    block.type === "vertex_create_node" ||
    block.type === "vertex_find_node"
  ) {
    const nameBlock = block.getInputTargetBlock("NAME");
    if (nameBlock && nameBlock.type === "text") {
      info.name = nameBlock.getFieldValue("TEXT");
    }
    return info;
  }

  return null;
};

/**
 * Extract node name from a block
 * @param {Blockly.Block} block - The block to extract from
 * @returns {string|null} Node name or null
 */
export const extractNodeName = (block) => {
  const info = extractNodeInfo(block);
  if (!info) return null;
  return info.name || info.variable;
};
