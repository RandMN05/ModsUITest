// Code generation utilities
import { luaGenerator } from "blockly/lua";

/**
 * Generate Lua code from workspace with post-processing
 * @param {Blockly.Workspace} workspace - The Blockly workspace
 * @returns {string} Generated and formatted Lua code
 */
export const generateLuaCode = (workspace) => {
  if (!workspace) return "";

  // Temporarily disable source mapping
  const originalAddSourceMapping = luaGenerator.addSourceMapping;
  luaGenerator.addSourceMapping = () => {};

  let code = luaGenerator.workspaceToCode(workspace);

  // Restore source mapping
  luaGenerator.addSourceMapping = originalAddSourceMapping;

  // Remove duplicate function definitions
  code = removeDuplicateFunctions(code);

  // Check for required functions
  const hasStart = code.includes("GameModeController.Start");
  const hasUpdate = code.includes("GameModeController.Update");

  let finalCode = "";

  // Add newNode = nil at the top if Start or Update exists
  if (hasStart || hasUpdate) {
    if (!code.startsWith("newNode = nil")) {
      finalCode += "newNode = nil\n";
    }
  }

  finalCode += code;

  // Add Destroy function if missing
  if (!code.includes("GameModeController.Destroy")) {
    finalCode += "GameModeController.Destroy = function()\nend\n";
  }

  // Remove source map comments
  finalCode = finalCode.replace(/--# sourceMappingURL=.*$/gm, "");

  // Normalize code formatting
  finalCode = normalizeCode(finalCode);

  return finalCode;
};

/**
 * Remove duplicate function definitions
 * @param {string} code - The code to process
 * @returns {string} Code with duplicates removed
 */
const removeDuplicateFunctions = (code) => {
  const lines = code.split("\n");
  const cleanedLines = [];
  const seenFunctions = new Set();

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith("GameModeController.")) {
      const funcMatch = trimmedLine.match(/^(GameModeController\.\w+)/);
      if (funcMatch) {
        const funcName = funcMatch[1];
        if (seenFunctions.has(funcName)) {
          continue;
        }
        seenFunctions.add(funcName);
      }
    }
    cleanedLines.push(line);
  }

  return cleanedLines.join("\n");
};

/**
 * Normalize code formatting (add semicolons, fix quotes)
 * @param {string} raw - Raw code
 * @returns {string} Normalized code
 */
const normalizeCode = (raw) => {
  // Replace simple single-quoted strings with double quotes
  raw = raw.replace(/'([^'\n]*)'/g, '"$1"');

  const outLines = [];
  const rl = raw.split("\n");
  let inFunction = false;

  for (let ln of rl) {
    const trimmed = ln.trim();

    // Detect function header lines
    if (/^\s*GameModeController\.\w+\s*=\s*function\b/.test(trimmed)) {
      inFunction = true;
      outLines.push(ln);
      continue;
    }

    // Detect end line that closes a function
    if (/^\s*end\s*$/.test(trimmed)) {
      inFunction = false;
      outLines.push(ln);
      continue;
    }

    // If inside a function body, ensure simple statements end with semicolon
    if (inFunction && trimmed.length > 0 && !trimmed.startsWith("--")) {
      // Skip lines that already end with ';' or are control lines
      if (
        !/;\s*$/.test(trimmed) &&
        !/\bfunction\b/.test(trimmed) &&
        !/\bthen\b\s*$/.test(trimmed) &&
        !/\bdo\b\s*$/.test(trimmed) &&
        !/^\s*(if|for|while)\b/.test(trimmed)
      ) {
        // Add semicolon to all other lines
        ln = ln.replace(/\s*$/, "") + ";";
      }
    }

    outLines.push(ln);
  }

  return outLines.join("\n");
};
