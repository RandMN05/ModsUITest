<template>
  <div id="app">
    <h1>Blockly Mod Creator</h1>
    <BlocklyEditor ref="blocklyEditor" />
    <div class="controls">
      <div class="input-group">
        <label for="modName">Mod Name:</label>
        <input id="modName" v-model="modName" type="text" placeholder="My Awesome Mod" />
      </div>
      <div class="input-group">
        <label for="modDescription">Description:</label>
        <input id="modDescription" v-model="modDescription" type="text" placeholder="Mod description" />
      </div>
      <div class="input-group">
        <label for="modAuthor">Author:</label>
        <input id="modAuthor" v-model="modAuthor" type="text" placeholder="Your name" />
      </div>
    </div>
    <div class="buttons">
      <button @click="generateCode">Generate Lua Code</button>
      <button @click="saveProject">Save Project</button>
      <button @click="loadProject">Load Project</button>
      <button @click="showImportDialog" class="secondary">Import Lua Code</button>
      <button @click="downloadMod" class="primary">Download Mod (ZIP)</button>
    </div>

    <!-- Import Lua Code Dialog -->
    <div v-if="showImport" class="import-dialog">
      <div class="import-content">
        <h3>Import Lua Code</h3>
        <textarea v-model="luaCodeToImport" placeholder="Paste your Lua code here..." rows="15" cols="80"></textarea>
        <div class="import-buttons">
          <button @click="importLuaCode" class="primary">Import to Blocks</button>
          <button @click="cancelImport">Cancel</button>
        </div>
      </div>
    </div>

    <!-- Make sure this section is visible when there's generated code -->
    <div v-if="generatedCode" class="code-output">
      <h3>Generated Lua Code:</h3>
      <pre>{{ generatedCode }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import BlocklyEditor from './components/BlocklyEditor.vue';
import JSZip from 'jszip';

const generatedCode = ref('');
const savedXml = ref('');
const blocklyEditor = ref(null);

// Mod metadata
const modName = ref('My Custom Mod');
const modDescription = ref('A mod created with Blockly');
const modAuthor = ref('Anonymous');

// New import-related variables
const showImport = ref(false);
const luaCodeToImport = ref('');

// Helper to embed arbitrary Lua using long-bracket strings
const toLuaLongBracketString = (s) => {
  s = String(s ?? '');
  let eqs = '';
  // increase equal signs until no conflict with ]...]
  while (s.includes(`]${eqs}]`)) {
    eqs += '=';
  }
  // Build a valid Lua long-bracket: [===[\n<content>\n]===]
  return '[' + eqs + '[\n' + s + '\n]' + eqs + ']';
};

// Detect whether user code already defines lifecycle functions
const findLifecycleDefs = (code) => {
  const s = String(code ?? '');
  return {
    hasStart: /GameModeController\.Start\s*=\s*function\b/.test(s),
    hasUpdate: /GameModeController\.Update\s*=\s*function\b/.test(s),
    hasDestroy: /GameModeController\.Destroy\s*=\s*function\b/.test(s),
  };
};

// Deduplicate lifecycle blocks: keep only the last Start/Update/Destroy definitions
const lifecycleBlockRegex = /GameModeController\.(Start|Update|Destroy)\s*=\s*function\b[\s\S]*?end/g;
const dedupeLifecycle = (code) => {
  const s = String(code ?? '');
  const last = { Start: null, Update: null, Destroy: null };
  let m;
  while ((m = lifecycleBlockRegex.exec(s)) !== null) {
    last[m[1]] = m[0];
  }
  // strip all lifecycle blocks and re-append the last ones once
  const cleaned = s.replace(lifecycleBlockRegex, '').trim();
  const parts = [];
  if (cleaned) parts.push(cleaned);
  ['Start', 'Update', 'Destroy'].forEach((k) => {
    if (last[k]) parts.push(last[k]);
  });
  return parts.join('\n\n').trim();
};

const generateCode = () => {
  if (blocklyEditor.value) {
    generatedCode.value = blocklyEditor.value.getCode();
    console.log('Generated code:', generatedCode.value);
  } else {
    console.error('Blockly editor not ready');
  }
};

const saveProject = () => {
  savedXml.value = blocklyEditor.value.getXml();
  console.log('Project saved!');
};

const loadProject = () => {
  if (savedXml.value) {
    blocklyEditor.value.loadXml(savedXml.value);
  }
};

const downloadMod = async () => {
  try {
    const userCode = blocklyEditor.value.getCode();

    const luaFiles = [
      'gamemode_view.lua',
      'gamemode_lua_bindings.lua'
    ];

    const zip = new JSZip();

    const configJson = {
      Name: modName.value,
      Description: modDescription.value,
      Author: modAuthor.value
    };
    zip.file('config.json', JSON.stringify(configJson, null, 2));

    // Helper: normalize simple single-quoted strings and semicolons inside function bodies
    const normalizeFunctionBody = (body) => {
      if (!body) return '';

      // Convert simple single-quoted strings to double quotes
      body = body.replace(/'([^'\n]*)'/g, "\"$1\"");

      // Normalize each line: add semicolons for statements (but keep blank lines and comments)
      const lines = body.split('\n');
      const out = [];
      for (let line of lines) {
        const trimmed = line.trim();
        if (trimmed === '' || trimmed.startsWith('--')) {
          out.push(line);
          continue;
        }
        // Don't append semicolon to control/definition lines
        if (/\bfunction\b/.test(trimmed) || /^\s*end\s*$/.test(trimmed) || /\bthen$/.test(trimmed) || /^\s*(if|for|while)\b/.test(trimmed)) {
          out.push(line);
          continue;
        }
        if (!/;\s*$/.test(trimmed)) {
          line = line.replace(/\s*$/, '') + ';';
        }
        out.push(line);
      }
      // Trim leading/trailing blank lines
      while (out.length && out[0].trim() === '') out.shift();
      while (out.length && out[out.length - 1].trim() === '') out.pop();
      return out.join('\n');
    };

    // Detect lifecycle defs (as before)
    const { hasStart, hasUpdate, hasDestroy } = findLifecycleDefs(userCode);
    let gamemodeControllerCode = '';

    // Try to extract last Start/Update/Destroy bodies from user's code (non-greedy)
    const extractBody = (code, name) => {
      const re = new RegExp(`GameModeController\\.${name}\\s*=\\s*function\\s*\\([^)]*\\)\\s*([\\s\\S]*?)\\nend`, 'g');
      let match, last = null;
      while ((match = re.exec(code)) !== null) {
        last = match[1];
      }
      return last;
    };

    const startBody = extractBody(userCode, 'Start');
    const updateBody = extractBody(userCode, 'Update');
    const destroyBody = extractBody(userCode, 'Destroy');

    // Build canonical controller file:
    // start with global var (no semicolon) to match sample
    gamemodeControllerCode += 'newNode = nil\n';

    if (startBody !== null) {
      gamemodeControllerCode += 'GameModeController.Start = function(server)\n';
      gamemodeControllerCode += normalizeFunctionBody(startBody) ? ('    ' + normalizeFunctionBody(startBody).replace(/\n/g, '\n    ') + '\n') : '';
      gamemodeControllerCode += 'end\n';
    } else if (hasStart) {
      // fallback: if detection said there's a Start but we couldn't extract, include raw user code (normalized)
      gamemodeControllerCode += 'GameModeController.Start = function(server)\n';
      gamemodeControllerCode += normalizeFunctionBody(userCode) ? ('    ' + normalizeFunctionBody(userCode).replace(/\n/g, '\n    ') + '\n') : '';
      gamemodeControllerCode += 'end\n';
    } else {
      // No Start: wrap user statements inside Start (common case)
      const normalizedUser = normalizeFunctionBody(userCode);
      gamemodeControllerCode += 'GameModeController.Start = function(server)\n';
      gamemodeControllerCode += normalizedUser ? ('    ' + normalizedUser.replace(/\n/g, '\n    ') + '\n') : '';
      gamemodeControllerCode += 'end\n';
    }

    if (updateBody !== null) {
      gamemodeControllerCode += 'GameModeController.Update = function(server, deltaTime)\n';
      gamemodeControllerCode += normalizeFunctionBody(updateBody) ? ('    ' + normalizeFunctionBody(updateBody).replace(/\n/g, '\n    ') + '\n') : '';
      gamemodeControllerCode += 'end\n';
    } else if (hasUpdate) {
      gamemodeControllerCode += 'GameModeController.Update = function(server, deltaTime)\n';
      gamemodeControllerCode += normalizeFunctionBody(userCode) ? ('    ' + normalizeFunctionBody(userCode).replace(/\n/g, '\n    ') + '\n') : '';
      gamemodeControllerCode += 'end\n';
    } else {
      // add empty Update
      gamemodeControllerCode += 'GameModeController.Update = function(server, deltaTime)\nend\n';
    }

    if (destroyBody !== null) {
      gamemodeControllerCode += 'GameModeController.Destroy = function()\n';
      gamemodeControllerCode += normalizeFunctionBody(destroyBody) ? ('    ' + normalizeFunctionBody(destroyBody).replace(/\n/g, '\n    ') + '\n') : '';
      gamemodeControllerCode += 'end\n';
    } else if (hasDestroy) {
      gamemodeControllerCode += 'GameModeController.Destroy = function()\n';
      gamemodeControllerCode += normalizeFunctionBody(userCode) ? ('    ' + normalizeFunctionBody(userCode).replace(/\n/g, '\n    ') + '\n') : '';
      gamemodeControllerCode += 'end\n';
    } else {
      // add empty Destroy
      gamemodeControllerCode += 'GameModeController.Destroy = function()\nend\n';
    }

    // Ensure blank line at end
    if (!gamemodeControllerCode.endsWith('\n')) gamemodeControllerCode += '\n';

    zip.file('gamemode_controller.lua', gamemodeControllerCode);

    // Fetch and add the required Lua files
    for (const fileName of luaFiles) {
      try {
        const response = await fetch(`/LuaDevelopment/${fileName}`);
        if (response.ok) {
          const content = await response.text();
          zip.file(fileName, content);
        } else {
          console.warn(`Could not fetch ${fileName}`);
        }
      } catch (error) {
        console.error(`Error fetching ${fileName}:`, error);
      }
    }

    // Generate the zip file
    const blob = await zip.generateAsync({ type: 'blob' });

    // Create download link and trigger download
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    // Create a safe filename from the mod name
    const safeFileName = modName.value.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    link.download = `${safeFileName}_mod.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    console.log('Mod downloaded successfully!');
    alert(`Mod "${modName.value}" downloaded successfully!`);
  } catch (error) {
    console.error('Error creating mod zip:', error);
    alert('Failed to create mod package. Check console for details.');
  }
};

const showImportDialog = () => {
  showImport.value = true;
  luaCodeToImport.value = '';
};

const cancelImport = () => {
  showImport.value = false;
  luaCodeToImport.value = '';
};

const importLuaCode = () => {
  if (blocklyEditor.value && luaCodeToImport.value.trim()) {
    try {
      blocklyEditor.value.importLuaCode(luaCodeToImport.value);
      showImport.value = false;
      luaCodeToImport.value = '';
      alert('Lua code imported successfully!');
    } catch (error) {
      console.error('Error importing Lua code:', error);
      alert('Failed to import Lua code. Check console for details.');
    }
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 20px;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

.controls {
  margin: 20px 0;
  padding: 15px;
  background: #f5f5f5;
  border-radius: 8px;
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
}

.input-group {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 5px;
}

.input-group label {
  font-weight: bold;
  font-size: 14px;
  color: #555;
}

.input-group input {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  width: 200px;
}

.buttons {
  margin: 20px 0;
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
}

button {
  padding: 10px 20px;
  font-size: 14px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background: #4CAF50;
  color: white;
  transition: background 0.3s;
}

button:hover {
  background: #45a049;
}

button.primary {
  background: #2196F3;
  font-weight: bold;
  font-size: 16px;
  padding: 12px 24px;
}

button.primary:hover {
  background: #0b7dda;
}

button.secondary {
  background: #FF9800;
}

button.secondary:hover {
  background: #F57C00;
}

.import-dialog {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.import-content {
  background: white;
  padding: 30px;
  border-radius: 8px;
  max-width: 90%;
  max-height: 90%;
  overflow: auto;
}

.import-content h3 {
  margin-top: 0;
  color: #333;
}

.import-content textarea {
  width: 100%;
  min-height: 300px;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  resize: vertical;
}

.import-buttons {
  margin-top: 15px;
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

pre {
  text-align: left;
  background: #f4f4f4;
  padding: 15px;
  border-radius: 8px;
  overflow-x: auto;
  margin-top: 20px;
  border: 1px solid #ddd;
}

h1 {
  color: #333;
  margin-bottom: 20px;
}

.code-output {
  margin-top: 20px;
  text-align: left;
}

.code-output h3 {
  color: #333;
  margin-bottom: 10px;
  font-size: 18px;
}
</style>