<template>
    <div>
        <div id="blocklyDiv" ref="blocklyDiv" style="height: 480px; width: 600px;"></div>
    </div>
</template>
<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import * as Blockly from 'blockly/core';
import * as En from 'blockly/msg/en';
import 'blockly/blocks';
import { luaGenerator } from 'blockly/lua';
import { serialization } from 'blockly';

// Import block definitions
import { allBlocks } from '../blockly/blocks/index.js';

// Import generators
import { registerAllGenerators } from '../blockly/generators/index.js';

// Import utilities
import { registerBlocks } from '../blockly/utils/blockRegistration.js';
import { generateLuaCode } from '../blockly/utils/codeGenerator.js';
import { parseLuaCode } from '../blockly/utils/luaParser.js';
import { createBlocksFromStructure } from '../blockly/utils/blockCreator.js';
import { analyzeWorkspace } from '../blockly/utils/workspaceAnalyzer.js';

// Import toolbox configuration
import { toolboxConfig } from '../blockly/toolbox.js';

const blocklyDiv = ref(null);
const workspace = ref(null);

onMounted(() => {
    initBlockly();
});

onBeforeUnmount(() => {
    if (workspace.value) {
        workspace.value.dispose();
    }
});

// Initialize Blockly with all custom blocks and generators
const initBlockly = () => {
    // Register all custom blocks
    registerBlocks(allBlocks);

    // Register all Lua generators
    registerAllGenerators(luaGenerator);

    Blockly.setLocale(En);

    workspace.value = Blockly.inject(blocklyDiv.value, {
        toolbox: toolboxConfig,
        collapse: true,
        comments: true,
        disable: true,
        maxBlocks: Infinity,
        trashcan: true,
        horizontalLayout: false,
        toolboxPosition: 'start',
        css: true,
        media: 'https://unpkg.com/blockly/media/',
        rtl: false,
        scrollbars: true,
        sounds: true,
        oneBasedIndex: true,
        grid: { spacing: 20, length: 1, colour: '#888', snap: true },
        zoom: { controls: true, wheel: true, startScale: 1, maxScale: 3, minScale: 0.3, scaleSpeed: 1.2 }
    });
};

const getCode = () => {
    return generateLuaCode(workspace.value);
};

const getXml = () => {
    if (workspace.value) {
        const state = serialization.workspaces.save(workspace.value);
        return JSON.stringify(state);
    }
    return '';
};

const loadXml = (xmlText) => {
    if (workspace.value && xmlText) {
        try {
            const state = JSON.parse(xmlText);
            serialization.workspaces.load(state, workspace.value);
        } catch (e) {
            console.error('Failed to load project:', e);
        }
    }
};

const importLuaCode = (luaCode) => {
    if (!workspace.value) {
        throw new Error('Workspace not initialized');
    }

    workspace.value.clear();

    const parsedStructure = parseLuaCode(luaCode);
    createBlocksFromStructure(workspace.value, parsedStructure);
};

defineExpose({
    getCode,
    getXml,
    loadXml,
    importLuaCode
});
</script>
