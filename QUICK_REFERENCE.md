# Quick Reference Guide - Blockly Editor Modules

## 🎯 Common Tasks

### Adding a New Block

1. **Create the block definition** in the appropriate category file:

   ```javascript
   // src/blockly/blocks/yourCategoryBlocks.js
   export const yourCategoryBlocks = {
     your_new_block: {
       type: "your_new_block",
       message0: "your block %1",
       args0: [{ type: "input_value", name: "INPUT" }],
       output: "Type",
       colour: 160,
       tooltip: "Description",
       helpUrl: "",
     },
   };
   ```

2. **Create the Lua generator**:

   ```javascript
   // src/blockly/generators/yourCategoryGenerators.js
   luaGenerator.forBlock["your_new_block"] = function (block, generator) {
     const input = generator.valueToCode(block, "INPUT", Order.ATOMIC) || "nil";
     return [`YourLuaCode(${input})`, Order.HIGH];
   };
   ```

3. **Add to toolbox**:
   ```javascript
   // src/blockly/toolbox.js
   {
       kind: 'category',
       name: 'Your Category',
       contents: [
           { kind: 'block', type: 'your_new_block' }
       ]
   }
   ```

### Creating a New Block Category

1. Create `src/blockly/blocks/newCategoryBlocks.js`
2. Create `src/blockly/generators/newCategoryGenerators.js`
3. Export from both index files
4. Add category to toolbox

### Modifying Code Generation

Edit `src/blockly/utils/codeGenerator.js` - the `normalizeCode()` function handles formatting.

### Updating Lua Parser

Edit `src/blockly/utils/luaParser.js` - add new patterns to `parseStatement()` function.

## 📂 File Locations

### Block Definitions

```
src/blockly/blocks/
├── gameModeBlocks.js      → Start, Update, Variables
├── spaceNodeBlocks.js     → Space, Nodes, Node operations
├── transformBlocks.js     → Position, Rotation, Scale
├── vectorMathBlocks.js    → Vector3, Math operations
├── componentBlocks.js     → Components, GLTF
├── cameraTimeBlocks.js    → Camera, Delta time
├── logicControlBlocks.js  → If, Boolean, Functions
└── arrayStringBlocks.js   → Arrays, Strings, Loops
```

### Lua Generators

```
src/blockly/generators/
└── [Same structure as blocks]
```

### Utilities

```
src/blockly/utils/
├── blockRegistration.js   → Register blocks with Blockly
├── codeGenerator.js       → Generate & format Lua code
├── luaParser.js          → Parse Lua → blocks
├── blockCreator.js       → Create blocks from parsed code
└── workspaceAnalyzer.js  → Analyze workspace structure
```

## 🔧 API Reference

### BlocklyEditor Component

```javascript
// Get generated Lua code
const code = editor.value.getCode();

// Get workspace state (for saving)
const state = editor.value.getXml();

// Load workspace state
editor.value.loadXml(savedState);

// Import Lua code as blocks
editor.value.importLuaCode(luaCodeString);
```

### Utility Functions

```javascript
// Register blocks
import { registerBlocks } from "../blockly/utils/blockRegistration.js";
registerBlocks(blockDefinitions);

// Generate code
import { generateLuaCode } from "../blockly/utils/codeGenerator.js";
const code = generateLuaCode(workspace);

// Parse Lua
import { parseLuaCode } from "../blockly/utils/luaParser.js";
const structure = parseLuaCode(luaCode);

// Analyze workspace
import { analyzeWorkspace } from "../blockly/utils/workspaceAnalyzer.js";
const analysis = analyzeWorkspace(workspace);
```

## 🎨 Block Properties

### Common Block Structure

```javascript
{
    type: 'block_id',              // Unique identifier
    message0: 'block text %1 %2',  // Display text with placeholders
    args0: [                       // Input definitions
        {
            type: 'input_value',   // or input_statement, field_dropdown, etc.
            name: 'INPUT_NAME'
        }
    ],
    output: 'Type',                // For value blocks
    previousStatement: null,       // For statement blocks
    nextStatement: null,           // For statement blocks
    colour: 160,                   // Block color
    tooltip: 'Description',
    helpUrl: ''
}
```

### Block Types

- `input_value` - Connection for value blocks
- `input_statement` - Connection for statement blocks
- `field_dropdown` - Dropdown menu
- `field_number` - Number input
- `field_input` - Text input
- `field_variable` - Variable selector

## 🧪 Testing

### Manual Testing Checklist

- [ ] Blocks appear in toolbox
- [ ] Blocks can be connected properly
- [ ] Generated Lua code is correct
- [ ] Code import works
- [ ] Save/load preserves workspace

### Common Issues

- **Block not appearing**: Check toolbox.js and block registration
- **Wrong Lua output**: Check generator function
- **Import failing**: Check luaParser.js patterns
- **Connection issues**: Verify previousStatement/nextStatement/output

## 📚 Resources

- Blockly Developer Docs: https://developers.google.com/blockly
- Lua 5.1 Reference: https://www.lua.org/manual/5.1/
- Project Structure: See BLOCKLY_STRUCTURE.md
- Refactoring Details: See REFACTORING_SUMMARY.md
