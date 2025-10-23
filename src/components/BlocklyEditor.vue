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
import { luaGenerator, Order } from 'blockly/lua';
import { serialization } from 'blockly';

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

// Define GameMode blocks
const defineGameModeBlocks = () => {
    const gameModeBlocks = {
        'gamemode_start': {
            type: 'gamemode_start',
            message0: 'Start function %1 %2',
            args0: [
                { type: 'input_dummy' },
                { type: 'input_statement', name: 'CODE' }
            ],
            colour: 20,
            tooltip: 'GameModeController.Start function',
            helpUrl: ''
        },
        'gamemode_update': {
            type: 'gamemode_update',
            message0: 'Update function %1 %2',
            args0: [
                { type: 'input_dummy' },
                { type: 'input_statement', name: 'CODE' }
            ],
            colour: 20,
            tooltip: 'GameModeController.Update function with deltaTime',
            helpUrl: ''
        },
        'get_space': {
            type: 'get_space',
            message0: 'get space',
            output: 'Space',
            colour: 160,
            tooltip: 'Get the current Vertex space',
            helpUrl: ''
        },
        'create_node': {
            type: 'create_node',
            message0: 'create node %1',
            args0: [{ type: 'input_value', name: 'NAME' }],
            output: 'Node',
            colour: 160,
            tooltip: 'Create a new node',
            helpUrl: ''
        },
        'add_node_to_space': {
            type: 'add_node_to_space',
            message0: 'add %1 to space %2',
            args0: [
                { type: 'input_value', name: 'NODE' },
                { type: 'input_value', name: 'SPACE' }
            ],
            previousStatement: null,
            nextStatement: null,
            colour: 160,
            tooltip: 'Add node to the space',
            helpUrl: ''
        },
        'add_gltf_component': {
            type: 'add_gltf_component',
            message0: 'add 3D model %1 to %2',
            args0: [
                { type: 'input_value', name: 'GUID' },
                { type: 'input_value', name: 'NODE' }
            ],
            previousStatement: null,
            nextStatement: null,
            colour: 230,
            tooltip: 'Add GLTF component to node',
            helpUrl: ''
        },
        'add_component': {
            type: 'add_component',
            message0: 'add component %1 to %2',
            args0: [
                { type: 'input_value', name: 'COMPONENT' },
                { type: 'input_value', name: 'NODE' }
            ],
            previousStatement: null,
            nextStatement: null,
            colour: 230,
            tooltip: 'Add component to node',
            helpUrl: ''
        },
        'set_rotation': {
            type: 'set_rotation',
            message0: 'set %1 rotation to %2',
            args0: [
                { type: 'input_value', name: 'NODE' },
                { type: 'input_value', name: 'ROTATION' }
            ],
            previousStatement: null,
            nextStatement: null,
            colour: 160,
            tooltip: 'Set node rotation',
            helpUrl: ''
        },
        'set_position': {
            type: 'set_position',
            message0: 'set %1 position to %2',
            args0: [
                { type: 'input_value', name: 'NODE' },
                { type: 'input_value', name: 'POSITION' }
            ],
            previousStatement: null,
            nextStatement: null,
            colour: 160,
            tooltip: 'Set node position',
            helpUrl: ''
        },
        'add_rotation': {
            type: 'add_rotation',
            message0: 'add to %1 rotation %2',
            args0: [
                { type: 'input_value', name: 'NODE' },
                { type: 'input_value', name: 'ROTATION' }
            ],
            previousStatement: null,
            nextStatement: null,
            colour: 160,
            tooltip: 'Add rotation to current rotation',
            helpUrl: ''
        },
        'add_position': {
            type: 'add_position',
            message0: 'add to %1 position %2',
            args0: [
                { type: 'input_value', name: 'NODE' },
                { type: 'input_value', name: 'POSITION' }
            ],
            previousStatement: null,
            nextStatement: null,
            colour: 160,
            tooltip: 'Add position to current position',
            helpUrl: ''
        },
        'vector3_create': {
            type: 'vector3_create',
            message0: 'vector x %1 y %2 z %3',
            args0: [
                { type: 'input_value', name: 'X' },
                { type: 'input_value', name: 'Y' },
                { type: 'input_value', name: 'Z' }
            ],
            output: 'Vector3',
            colour: 60,
            tooltip: 'Create Vector3',
            helpUrl: ''
        },
        'delta_time': {
            type: 'delta_time',
            message0: 'delta time',
            output: 'Number',
            colour: 120,
            tooltip: 'Delta time from Update function',
            helpUrl: ''
        },
        'get_main_camera': {
            type: 'get_main_camera',
            message0: 'get main camera',
            output: 'Camera',
            colour: 290,
            tooltip: 'Get the main camera',
            helpUrl: ''
        },
        'camera_position': {
            type: 'camera_position',
            message0: '%1 position',
            args0: [{ type: 'input_value', name: 'CAMERA' }],
            output: 'Vector3',
            colour: 290,
            tooltip: 'Get camera position',
            helpUrl: ''
        },
        'multiply_number': {
            type: 'multiply_number',
            message0: '%1 × %2',
            args0: [
                { type: 'input_value', name: 'A' },
                { type: 'input_value', name: 'B' }
            ],
            output: 'Number',
            colour: 230,
            tooltip: 'Multiply two numbers',
            helpUrl: ''
        },
        'declare_variable': {
            type: 'declare_variable',
            message0: 'declare %1',
            args0: [{ type: 'input_value', name: 'NAME' }],
            previousStatement: null,
            nextStatement: null,
            colour: 330,
            tooltip: 'Declare a global variable',
            helpUrl: ''
        }
    };

    // Register all blocks
    Object.keys(gameModeBlocks).forEach(blockType => {
        Blockly.Blocks[blockType] = {
            init: function () {
                this.jsonInit(gameModeBlocks[blockType]);
            }
        };
    });
};

// Define Lua generators for GameMode blocks
const defineGameModeGenerators = () => {
    luaGenerator.forBlock['gamemode_start'] = function (block, generator) {
        const statements = generator.statementToCode(block, 'CODE');
        return `GameModeController.Start = function(server)\n${statements}end\n`;
    };

    luaGenerator.forBlock['gamemode_update'] = function (block, generator) {
        const statements = generator.statementToCode(block, 'CODE');
        return `GameModeController.Update = function(server, deltaTime)\n${statements}end\n`;
    };

    luaGenerator.forBlock['get_space'] = function (block, generator) {
        return ['Vertex.GetSpace()', Order.HIGH];
    };

    luaGenerator.forBlock['create_node'] = function (block, generator) {
        const name = generator.valueToCode(block, 'NAME', Order.ATOMIC) || '""';
        return [`space:CreateNode(${name})`, Order.HIGH];
    };

    luaGenerator.forBlock['add_node_to_space'] = function (block, generator) {
        const node = generator.valueToCode(block, 'NODE', Order.ATOMIC) || 'nil';
        const space = generator.valueToCode(block, 'SPACE', Order.ATOMIC) || 'space';
        return `${space}:AddNode(${node})\n`;
    };

    luaGenerator.forBlock['add_gltf_component'] = function (block, generator) {
        const guid = generator.valueToCode(block, 'GUID', Order.ATOMIC) || '""';
        const node = generator.valueToCode(block, 'NODE', Order.ATOMIC) || 'nil';
        return `${node}:AddGltfComponent(${guid})\n`;
    };

    luaGenerator.forBlock['add_component'] = function (block, generator) {
        const component = generator.valueToCode(block, 'COMPONENT', Order.ATOMIC) || '""';
        const node = generator.valueToCode(block, 'NODE', Order.ATOMIC) || 'nil';
        return `${node}:AddComponent(${component})\n`;
    };

    luaGenerator.forBlock['set_rotation'] = function (block, generator) {
        const node = generator.valueToCode(block, 'NODE', Order.ATOMIC) || 'nil';
        const rotation = generator.valueToCode(block, 'ROTATION', Order.ATOMIC) || 'Vector3.Zero()';
        return `${node}.Rotation = ${rotation}\n`;
    };

    luaGenerator.forBlock['set_position'] = function (block, generator) {
        const node = generator.valueToCode(block, 'NODE', Order.ATOMIC) || 'nil';
        const position = generator.valueToCode(block, 'POSITION', Order.ATOMIC) || 'Vector3.Zero()';
        return `${node}.Position = ${position}\n`;
    };

    luaGenerator.forBlock['add_rotation'] = function (block, generator) {
        const node = generator.valueToCode(block, 'NODE', Order.ATOMIC) || 'nil';
        const rotation = generator.valueToCode(block, 'ROTATION', Order.ATOMIC) || 'Vector3.Zero()';
        return `${node}.Rotation = ${node}.Rotation:Add(${rotation})\n`;
    };

    luaGenerator.forBlock['add_position'] = function (block, generator) {
        const node = generator.valueToCode(block, 'NODE', Order.ATOMIC) || 'nil';
        const position = generator.valueToCode(block, 'POSITION', Order.ATOMIC) || 'Vector3.Zero()';
        return `${node}.Position = ${node}.Position:Add(${position})\n`;
    };

    luaGenerator.forBlock['vector3_create'] = function (block, generator) {
        const x = generator.valueToCode(block, 'X', Order.ATOMIC) || '0';
        const y = generator.valueToCode(block, 'Y', Order.ATOMIC) || '0';
        const z = generator.valueToCode(block, 'Z', Order.ATOMIC) || '0';
        return [`Vector3.FromValues(${x}, ${y}, ${z})`, Order.HIGH];
    };

    luaGenerator.forBlock['delta_time'] = function (block, generator) {
        return ['deltaTime', Order.HIGH];
    };

    luaGenerator.forBlock['get_main_camera'] = function (block, generator) {
        return ['Camera:GetMainCamera()', Order.HIGH];
    };

    luaGenerator.forBlock['camera_position'] = function (block, generator) {
        const camera = generator.valueToCode(block, 'CAMERA', Order.ATOMIC) || 'camera';
        return [`${camera}.Position`, Order.HIGH];
    };

    luaGenerator.forBlock['multiply_number'] = function (block, generator) {
        const a = generator.valueToCode(block, 'A', Order.ATOMIC) || '0';
        const b = generator.valueToCode(block, 'B', Order.ATOMIC) || '0';
        return [`${a} * ${b}`, Order.MULTIPLICATIVE];
    };

    luaGenerator.forBlock['declare_variable'] = function (block, generator) {
        const name = generator.valueToCode(block, 'NAME', Order.ATOMIC) || 'nil';
        return `${name} = nil\n`;
    };
};

const initBlockly = () => {
    // Register custom blocks and generators
    defineGameModeBlocks();
    defineGameModeGenerators();

    Blockly.setLocale(En);

    const toolbox = {
        kind: 'categoryToolbox',
        contents: [
            {
                kind: 'category',
                name: 'Variables',
                colour: '#A65C81',
                custom: 'VARIABLE'
            },
            {
                kind: 'category',
                name: 'GameMode',
                colour: '#FF6B6B',
                contents: [
                    { kind: 'block', type: 'gamemode_start' },
                    { kind: 'block', type: 'gamemode_update' },
                    { kind: 'block', type: 'declare_variable' }
                ]
            },
            {
                kind: 'category',
                name: 'Space & Nodes',
                colour: '#4ECDC4',
                contents: [
                    { kind: 'block', type: 'get_space' },
                    { kind: 'block', type: 'create_node' },
                    { kind: 'block', type: 'add_node_to_space' }
                ]
            },
            {
                kind: 'category',
                name: 'Components',
                colour: '#45B7D1',
                contents: [
                    { kind: 'block', type: 'add_gltf_component' },
                    { kind: 'block', type: 'add_component' }
                ]
            },
            {
                kind: 'category',
                name: 'Transform',
                colour: '#96CEB4',
                contents: [
                    { kind: 'block', type: 'set_position' },
                    { kind: 'block', type: 'set_rotation' },
                    { kind: 'block', type: 'add_position' },
                    { kind: 'block', type: 'add_rotation' }
                ]
            },
            {
                kind: 'category',
                name: 'Vectors & Math',
                colour: '#FFEAA7',
                contents: [
                    { kind: 'block', type: 'vector3_create' },
                    { kind: 'block', type: 'multiply_number' },
                    { kind: 'block', type: 'math_number' },
                    { kind: 'block', type: 'math_arithmetic' }
                ]
            },
            {
                kind: 'category',
                name: 'Time & Camera',
                colour: '#DDA0DD',
                contents: [
                    { kind: 'block', type: 'delta_time' },
                    { kind: 'block', type: 'get_main_camera' },
                    { kind: 'block', type: 'camera_position' }
                ]
            },
            {
                kind: 'sep'
            },
            {
                kind: 'category',
                name: 'Logic',
                colour: '#5C81A6',
                contents: [
                    { kind: 'block', type: 'controls_if' },
                    { kind: 'block', type: 'logic_compare' },
                    { kind: 'block', type: 'logic_operation' },
                    { kind: 'block', type: 'logic_negate' },
                    { kind: 'block', type: 'logic_boolean' },
                    { kind: 'block', type: 'logic_null' },
                    { kind: 'block', type: 'logic_ternary' }
                ]
            },
            {
                kind: 'category',
                name: 'Loops',
                colour: '#5CA65C',
                contents: [
                    { kind: 'block', type: 'controls_repeat_ext' },
                    { kind: 'block', type: 'controls_repeat' },
                    { kind: 'block', type: 'controls_whileUntil' },
                    { kind: 'block', type: 'controls_for' },
                    { kind: 'block', type: 'controls_forEach' },
                    { kind: 'block', type: 'controls_flow_statements' }
                ]
            },
            {
                kind: 'category',
                name: 'Text',
                colour: '#5CA68D',
                contents: [
                    { kind: 'block', type: 'text' },
                    { kind: 'block', type: 'text_join' },
                    { kind: 'block', type: 'text_append' },
                    { kind: 'block', type: 'text_length' },
                    { kind: 'block', type: 'text_isEmpty' },
                    { kind: 'block', type: 'text_indexOf' },
                    { kind: 'block', type: 'text_charAt' },
                    { kind: 'block', type: 'text_getSubstring' },
                    { kind: 'block', type: 'text_changeCase' },
                    { kind: 'block', type: 'text_trim' },
                    { kind: 'block', type: 'text_print' }
                ]
            },
            {
                kind: 'sep'
            },
            {
                kind: 'category',
                name: 'Variables',
                colour: '#A65C81',
                custom: 'VARIABLE'
            },
            {
                kind: 'category',
                name: 'Functions',
                colour: '#9A5CA6',
                custom: 'PROCEDURE'
            }
        ]
    };

    workspace.value = Blockly.inject(blocklyDiv.value, {
        toolbox: toolbox,
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
    if (!workspace.value) return '';

    // Generate code without source maps
    const originalAddSourceMapping = luaGenerator.addSourceMapping;
    luaGenerator.addSourceMapping = () => { }; // Disable source mapping

    let code = luaGenerator.workspaceToCode(workspace.value);

    // Restore original source mapping function
    luaGenerator.addSourceMapping = originalAddSourceMapping;

    // Clean up any duplicate function definitions
    const lines = code.split('\n');
    const cleanedLines = [];
    const seenFunctions = new Set();

    for (const line of lines) {
        const trimmedLine = line.trim();
        if (trimmedLine.startsWith('GameModeController.')) {
            const funcMatch = trimmedLine.match(/^(GameModeController\.\w+)/);
            if (funcMatch) {
                const funcName = funcMatch[1];
                if (seenFunctions.has(funcName)) {
                    continue; // Skip duplicate function
                }
                seenFunctions.add(funcName);
            }
        }
        cleanedLines.push(line);
    }

    code = cleanedLines.join('\n');

    // Add global variable declarations and missing functions
    const hasStart = code.includes('GameModeController.Start');
    const hasUpdate = code.includes('GameModeController.Update');

    let finalCode = '';

    // Add global variables that might be needed
    if (hasStart || hasUpdate) {
        finalCode += 'newNode = nil\n';
    }

    finalCode += code;

    // Add missing functions if they don't exist
    if (!code.includes('GameModeController.Destroy')) {
        finalCode += 'GameModeController.Destroy = function()\nend\n';
    }

    // Remove any source mapping comments that might have slipped through
    finalCode = finalCode.replace(/--# sourceMappingURL=.*$/gm, '');

    // --- New: normalize quotes and semicolons inside function bodies ---
    const normalizeCode = (raw) => {
        // Replace simple single-quoted strings with double quotes (safe for simple literals)
        raw = raw.replace(/'([^'\n]*)'/g, "\"$1\"");

        const outLines = [];
        const rl = raw.split('\n');
        let inFunction = false;

        for (let ln of rl) {
            const trimmed = ln.trim();

            // Detect function header lines (e.g. GameModeController.Start = function(server))
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
            if (inFunction && trimmed.length > 0 && !trimmed.startsWith('--')) {
                // Skip lines that already end with ';' or are control lines (function/if/for/while/then)
                if (!/;\s*$/.test(trimmed) && !/\bfunction\b/.test(trimmed) && !/\bthen\b$/.test(trimmed) && !/^\s*(if|for|while)\b/.test(trimmed)) {
                    ln = ln.replace(/\s*$/, '') + ';';
                }
            }

            outLines.push(ln);
        }

        return outLines.join('\n');
    };

    finalCode = normalizeCode(finalCode);

    return finalCode;
};

// Analyze workspace to find missing dependencies
const analyzeWorkspace = (workspace) => {
    const analysis = {
        createdNodes: new Set(),           // Nodes created with create_node
        foundNodes: new Set(),              // Nodes found with find_node
        nodesWithPhysics: new Set(),        // Nodes that have physics added
        nodesUsingCollision: new Set(),     // Nodes using collision events
        nodesNeedingPhysics: new Set(),     // Nodes needing physics (collision without physics)
        missingNodeVariables: new Set(),    // Variables that should be declared
        allNodeReferences: new Set(),       // All node variable references
        nodeVariableMap: new Map()          // Map node names to their variable references
    };

    const blocks = workspace.getAllBlocks();

    blocks.forEach(block => {
        const type = block.type;

        // Track created nodes and their variable assignments
        if (type === 'vertex_create_node') {
            const nameBlock = block.getInputTargetBlock('NAME');
            if (nameBlock && nameBlock.type === 'text') {
                const nodeName = nameBlock.getFieldValue('TEXT');
                analysis.createdNodes.add(nodeName);

                // Check if this node is stored in a variable
                const parent = block.getParent();
                if (parent && parent.type === 'variables_set') {
                    const varName = parent.getField('VAR')?.getText();
                    if (varName) {
                        analysis.nodeVariableMap.set(nodeName, varName);
                    }
                }
            }
        }

        // Track found nodes and their variable assignments
        if (type === 'vertex_find_node') {
            const nameBlock = block.getInputTargetBlock('NAME');
            if (nameBlock && nameBlock.type === 'text') {
                const nodeName = nameBlock.getFieldValue('TEXT');
                analysis.foundNodes.add(nodeName);

                // Check if this node is stored in a variable
                const parent = block.getParent();
                if (parent && parent.type === 'variables_set') {
                    const varName = parent.getField('VAR')?.getText();
                    if (varName) {
                        analysis.nodeVariableMap.set(nodeName, varName);
                    }
                }
            }
        }

        // Track nodes with physics component
        if (type === 'vertex_add_physics') {
            const nodeBlock = block.getInputTargetBlock('NODE');
            const nodeInfo = extractNodeInfo(nodeBlock);
            if (nodeInfo) {
                analysis.nodesWithPhysics.add(nodeInfo.name || nodeInfo.variable);
                if (nodeInfo.name && nodeInfo.variable) {
                    analysis.nodeVariableMap.set(nodeInfo.name, nodeInfo.variable);
                }
            }
        }

        // Track nodes using collision events
        if (type === 'vertex_on_collision') {
            const nodeBlock = block.getInputTargetBlock('NODE');
            const nodeInfo = extractNodeInfo(nodeBlock);
            if (nodeInfo) {
                const identifier = nodeInfo.name || nodeInfo.variable;
                analysis.nodesUsingCollision.add(identifier);
                if (nodeInfo.name && nodeInfo.variable) {
                    analysis.nodeVariableMap.set(nodeInfo.name, nodeInfo.variable);
                }
            }
        }

        // Track all variable references
        if (type === 'variables_get') {
            const varName = block.getField('VAR')?.getText();
            if (varName) {
                analysis.allNodeReferences.add(varName);
            }
        }
    });

    // Find nodes that need physics but don't have it
    analysis.nodesUsingCollision.forEach(identifier => {
        if (!analysis.nodesWithPhysics.has(identifier)) {
            analysis.nodesNeedingPhysics.add(identifier);
        }
    });

    return analysis;
};

// Helper to extract node info from a block chain
const extractNodeInfo = (block) => {
    if (!block) return null;

    const info = {
        name: null,      // The literal name string (e.g., "myObject")
        variable: null   // The variable name holding the node (e.g., "obj")
    };

    // If it's a variable, get the variable name
    if (block.type === 'variables_get') {
        info.variable = block.getField('VAR')?.getText();
        return info;
    }

    // If it's a create_node or find_node block, try to get the name
    if (block.type === 'vertex_create_node' || block.type === 'vertex_find_node') {
        const nameBlock = block.getInputTargetBlock('NAME');
        if (nameBlock && nameBlock.type === 'text') {
            info.name = nameBlock.getFieldValue('TEXT');
        }
        return info;
    }

    return null;
};

// Helper to extract node name from a block chain (for backwards compatibility)
const extractNodeName = (block) => {
    const info = extractNodeInfo(block);
    if (!info) return null;
    return info.name || info.variable;
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

// Lua code import functionality
const importLuaCode = (luaCode) => {
    if (!workspace.value) {
        throw new Error('Workspace not initialized');
    }

    // Clear the workspace first
    workspace.value.clear();

    // Parse the Lua code and create blocks
    const parsedStructure = parseLuaCode(luaCode);
    createBlocksFromStructure(parsedStructure);
};

// Parse Lua code into a structured format
const parseLuaCode = (luaCode) => {
    const structure = {
        variables: [],
        startFunction: null,
        updateFunction: null,
        destroyFunction: null
    };

    const lines = luaCode.split('\n');
    let currentFunction = null;
    let functionContent = [];
    let braceCount = 0;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        // Skip empty lines and comments
        if (!line || line.startsWith('--')) continue;

        // Detect function declarations
        if (line.includes('GameModeController.Start')) {
            currentFunction = 'start';
            functionContent = [];
            braceCount = 0;
        } else if (line.includes('GameModeController.Update')) {
            currentFunction = 'update';
            functionContent = [];
            braceCount = 0;
        } else if (line.includes('GameModeController.Destroy')) {
            currentFunction = 'destroy';
            functionContent = [];
            braceCount = 0;
        } else if (currentFunction) {
            // Track braces to know when function ends
            braceCount += (line.match(/function/g) || []).length;
            braceCount -= (line.match(/end/g) || []).length;

            if (braceCount < 0 || line === 'end') {
                // Function ended, process content
                if (currentFunction === 'start') {
                    structure.startFunction = parseStatements(functionContent);
                } else if (currentFunction === 'update') {
                    structure.updateFunction = parseStatements(functionContent);
                }
                currentFunction = null;
                functionContent = [];
            } else if (line !== 'function(server)' && line !== 'function(server, deltaTime)') {
                functionContent.push(line);
            }
        } else {
            // Global variable declarations
            if (line.includes(' = nil') || line.includes(' = ')) {
                const varMatch = line.match(/^(\w+)\s*=/);
                if (varMatch) {
                    structure.variables.push(varMatch[1]);
                }
            }
        }
    }

    return structure;
};

// Parse individual statements within functions
const parseStatements = (lines) => {
    const statements = [];

    for (const line of lines) {
        const statement = parseStatement(line);
        if (statement) {
            statements.push(statement);
        }
    }

    return statements;
};

// Parse a single Lua statement into block structure
const parseStatement = (line) => {
    line = line.trim();

    // Variable assignment with create_node
    const createNodeMatch = line.match(/(\w+)\s*=\s*space:CreateNode\(["']([^"']+)["']\)/);
    if (createNodeMatch) {
        return {
            type: 'variable_set_create_node',
            variable: createNodeMatch[1],
            nodeName: createNodeMatch[2]
        };
    }

    // Add node to space
    const addNodeMatch = line.match(/space:AddNode\((\w+)\)/);
    if (addNodeMatch) {
        return {
            type: 'add_node_to_space',
            node: addNodeMatch[1]
        };
    }

    // Add GLTF component
    const gltfMatch = line.match(/(\w+):AddGltfComponent\(["']([^"']+)["']\)/);
    if (gltfMatch) {
        return {
            type: 'add_gltf_component',
            node: gltfMatch[1],
            guid: gltfMatch[2]
        };
    }

    // Set position
    const positionMatch = line.match(/(\w+)\.Position\s*=\s*Vector3\.FromValues\(([^)]+)\)/);
    if (positionMatch) {
        const coords = positionMatch[2].split(',').map(s => s.trim());
        return {
            type: 'set_position',
            node: positionMatch[1],
            x: coords[0] || '0',
            y: coords[1] || '0',
            z: coords[2] || '0'
        };
    }

    // Set rotation
    const rotationMatch = line.match(/(\w+)\.Rotation\s*=\s*Vector3\.FromValues\(([^)]+)\)/);
    if (rotationMatch) {
        const coords = rotationMatch[2].split(',').map(s => s.trim());
        return {
            type: 'set_rotation',
            node: rotationMatch[1],
            x: coords[0] || '0',
            y: coords[1] || '0',
            z: coords[2] || '0'
        };
    }

    // Add to position
    const addPosMatch = line.match(/(\w+)\.Position\s*=\s*(\w+)\.Position:Add\(Vector3\.FromValues\(([^)]+)\)\)/);
    if (addPosMatch) {
        const coords = addPosMatch[3].split(',').map(s => s.trim());
        return {
            type: 'add_position',
            node: addPosMatch[1],
            x: coords[0] || '0',
            y: coords[1] || '0',
            z: coords[2] || '0'
        };
    }

    // Variable declarations
    const varMatch = line.match(/^(\w+)\s*=\s*nil$/);
    if (varMatch) {
        return {
            type: 'declare_variable',
            name: varMatch[1]
        };
    }

    return null;
};

// Create Blockly blocks from parsed structure
const createBlocksFromStructure = (structure) => {
    let currentY = 50;
    const spacing = 150;

    // Create variable declarations
    structure.variables.forEach((varName, index) => {
        createVariableBlock(varName, 50, currentY + (index * 80));
    });

    if (structure.variables.length > 0) {
        currentY += structure.variables.length * 80 + spacing;
    }

    // Create Start function block
    if (structure.startFunction) {
        createGameModeBlock('gamemode_start', structure.startFunction, 50, currentY);
        currentY += spacing;
    }

    // Create Update function block
    if (structure.updateFunction) {
        createGameModeBlock('gamemode_update', structure.updateFunction, 50, currentY);
    }
};

// Create a variable declaration block
const createVariableBlock = (varName, x, y) => {
    // Create variable in Blockly's variable model first
    workspace.value.createVariable(varName);

    const block = workspace.value.newBlock('declare_variable');
    const textBlock = workspace.value.newBlock('text');
    textBlock.setFieldValue(varName, 'TEXT');

    block.getInput('NAME').connection.connect(textBlock.outputConnection);
    block.moveBy(x, y);
    block.initSvg();
    textBlock.initSvg();
    block.render();
    textBlock.render();
};

// Create GameMode function blocks with their statements
const createGameModeBlock = (functionType, statements, x, y) => {
    const funcBlock = workspace.value.newBlock(functionType);
    funcBlock.moveBy(x, y);
    funcBlock.initSvg();

    let previousBlock = null;
    let statementConnection = funcBlock.getInput('CODE').connection;

    statements.forEach((statement, index) => {
        const block = createStatementBlock(statement);
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

// Create individual statement blocks
const createStatementBlock = (statement) => {
    let block = null;

    switch (statement.type) {
        case 'variable_set_create_node':
            // Create variable assignment with create_node
            workspace.value.createVariable(statement.variable);
            block = workspace.value.newBlock('variables_set');
            block.setFieldValue(statement.variable, 'VAR');

            const createBlock = workspace.value.newBlock('create_node');
            const nameBlock = workspace.value.newBlock('text');
            nameBlock.setFieldValue(statement.nodeName, 'TEXT');

            createBlock.getInput('NAME').connection.connect(nameBlock.outputConnection);
            block.getInput('VALUE').connection.connect(createBlock.outputConnection);

            createBlock.initSvg();
            nameBlock.initSvg();
            break;

        case 'add_node_to_space':
            block = workspace.value.newBlock('add_node_to_space');
            const spaceBlock = workspace.value.newBlock('get_space');
            const nodeVarBlock = workspace.value.newBlock('variables_get');
            nodeVarBlock.setFieldValue(statement.node, 'VAR');

            block.getInput('SPACE').connection.connect(spaceBlock.outputConnection);
            block.getInput('NODE').connection.connect(nodeVarBlock.outputConnection);

            spaceBlock.initSvg();
            nodeVarBlock.initSvg();
            break;

        case 'add_gltf_component':
            block = workspace.value.newBlock('add_gltf_component');
            const guidBlock = workspace.value.newBlock('text');
            guidBlock.setFieldValue(statement.guid, 'TEXT');
            const nodeBlock = workspace.value.newBlock('variables_get');
            nodeBlock.setFieldValue(statement.node, 'VAR');

            block.getInput('GUID').connection.connect(guidBlock.outputConnection);
            block.getInput('NODE').connection.connect(nodeBlock.outputConnection);

            guidBlock.initSvg();
            nodeBlock.initSvg();
            break;

        case 'set_position':
        case 'add_position':
            block = workspace.value.newBlock(statement.type);
            const posNodeBlock = workspace.value.newBlock('variables_get');
            posNodeBlock.setFieldValue(statement.node, 'VAR');
            const vectorBlock = createVector3Block(statement.x, statement.y, statement.z);

            block.getInput('NODE').connection.connect(posNodeBlock.outputConnection);
            block.getInput('POSITION').connection.connect(vectorBlock.outputConnection);

            posNodeBlock.initSvg();
            break;

        case 'set_rotation':
        case 'add_rotation':
            block = workspace.value.newBlock(statement.type);
            const rotNodeBlock = workspace.value.newBlock('variables_get');
            rotNodeBlock.setFieldValue(statement.node, 'VAR');
            const rotVectorBlock = createVector3Block(statement.x, statement.y, statement.z);

            block.getInput('NODE').connection.connect(rotNodeBlock.outputConnection);
            block.getInput('ROTATION').connection.connect(rotVectorBlock.outputConnection);

            rotNodeBlock.initSvg();
            break;
    }

    if (block) {
        block.initSvg();
        block.render();
    }

    return block;
};

// Helper to create Vector3 blocks
const createVector3Block = (x, y, z) => {
    const vectorBlock = workspace.value.newBlock('vector3_create');

    const xBlock = workspace.value.newBlock('math_number');
    xBlock.setFieldValue(parseFloat(x) || 0, 'NUM');

    const yBlock = workspace.value.newBlock('math_number');
    yBlock.setFieldValue(parseFloat(y) || 0, 'NUM');

    const zBlock = workspace.value.newBlock('math_number');
    zBlock.setFieldValue(parseFloat(z) || 0, 'NUM');

    vectorBlock.getInput('X').connection.connect(xBlock.outputConnection);
    vectorBlock.getInput('Y').connection.connect(yBlock.outputConnection);
    vectorBlock.getInput('Z').connection.connect(zBlock.outputConnection);

    vectorBlock.initSvg();
    xBlock.initSvg();
    yBlock.initSvg();

    return vectorBlock;
};

// Expose methods for parent component to access
defineExpose({
    getCode,
    getXml,
    loadXml,
    importLuaCode
});
</script>