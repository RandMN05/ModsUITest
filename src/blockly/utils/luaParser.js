// Lua code parser utilities
/**
 * Parse Lua code into a structured format
 * @param {string} luaCode - The Lua code to parse
 * @returns {Object} Parsed structure
 */
export const parseLuaCode = (luaCode) => {
  const structure = {
    variables: [],
    startFunction: null,
    updateFunction: null,
    destroyFunction: null,
  };

  const lines = luaCode.split("\n");
  let currentFunction = null;
  let functionContent = [];
  let braceCount = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (!line || line.startsWith("--")) continue;

    if (line.includes("GameModeController.Start")) {
      currentFunction = "start";
      functionContent = [];
      braceCount = 0;
    } else if (line.includes("GameModeController.Update")) {
      currentFunction = "update";
      functionContent = [];
      braceCount = 0;
    } else if (line.includes("GameModeController.Destroy")) {
      currentFunction = "destroy";
      functionContent = [];
      braceCount = 0;
    } else if (currentFunction) {
      braceCount += (line.match(/function/g) || []).length;
      braceCount -= (line.match(/end/g) || []).length;

      if (braceCount < 0 || line === "end") {
        if (currentFunction === "start") {
          structure.startFunction = parseStatements(functionContent);
        } else if (currentFunction === "update") {
          structure.updateFunction = parseStatements(functionContent);
        }
        currentFunction = null;
        functionContent = [];
      } else if (
        line !== "function(server)" &&
        line !== "function(server, deltaTime)"
      ) {
        functionContent.push(line);
      }
    } else {
      if (line.includes(" = nil") || line.includes(" = ")) {
        const varMatch = line.match(/^(\w+)\s*=/);
        if (varMatch) {
          structure.variables.push(varMatch[1]);
        }
      }
    }
  }

  return structure;
};

/**
 * Parse multiple statements
 * @param {string[]} lines - Array of code lines
 * @returns {Object[]} Parsed statements
 */
export const parseStatements = (lines) => {
  const statements = [];

  for (const line of lines) {
    const statement = parseStatement(line);
    if (statement) {
      statements.push(statement);
    }
  }

  return statements;
};

/**
 * Parse a single statement
 * @param {string} line - Line of code to parse
 * @returns {Object|null} Parsed statement or null
 */
export const parseStatement = (line) => {
  line = line.trim();

  const createNodeMatch = line.match(
    /(\w+)\s*=\s*space:CreateNode\(["']([^"']+)["']\)/
  );
  if (createNodeMatch) {
    return {
      type: "variable_set_create_node",
      variable: createNodeMatch[1],
      nodeName: createNodeMatch[2],
    };
  }

  const addNodeMatch = line.match(/space:AddNode\((\w+)\)/);
  if (addNodeMatch) {
    return {
      type: "add_node_to_space",
      node: addNodeMatch[1],
    };
  }

  const gltfMatch = line.match(/(\w+):AddGltfComponent\(["']([^"']+)["']\)/);
  if (gltfMatch) {
    return {
      type: "add_gltf_component",
      node: gltfMatch[1],
      guid: gltfMatch[2],
    };
  }

  const positionMatch = line.match(
    /(\w+)\.Position\s*=\s*Vector3\.FromValues\(([^)]+)\)/
  );
  if (positionMatch) {
    const coords = positionMatch[2].split(",").map((s) => s.trim());
    return {
      type: "set_position",
      node: positionMatch[1],
      x: coords[0] || "0",
      y: coords[1] || "0",
      z: coords[2] || "0",
    };
  }

  const rotationMatch = line.match(
    /(\w+)\.Rotation\s*=\s*Vector3\.FromValues\(([^)]+)\)/
  );
  if (rotationMatch) {
    const coords = rotationMatch[2].split(",").map((s) => s.trim());
    return {
      type: "set_rotation",
      node: rotationMatch[1],
      x: coords[0] || "0",
      y: coords[1] || "0",
      z: coords[2] || "0",
    };
  }

  const addPosMatch = line.match(
    /(\w+)\.Position\s*=\s*(\w+)\.Position:Add\(Vector3\.FromValues\(([^)]+)\)\)/
  );
  if (addPosMatch) {
    const coords = addPosMatch[3].split(",").map((s) => s.trim());
    return {
      type: "add_position",
      node: addPosMatch[1],
      x: coords[0] || "0",
      y: coords[1] || "0",
      z: coords[2] || "0",
    };
  }

  const varMatch = line.match(/^(\w+)\s*=\s*nil$/);
  if (varMatch) {
    return {
      type: "declare_variable",
      name: varMatch[1],
    };
  }

  return null;
};
