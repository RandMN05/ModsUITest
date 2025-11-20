# Blockly Editor Module Structure

This document describes the refactored Blockly editor structure, which has been modularized for better maintainability and organization.

## Directory Structure

```
src/
├── blockly/
│   ├── blocks/                  # Block definitions organized by category
│   │   ├── gameModeBlocks.js    # GameMode-related blocks
│   │   ├── spaceNodeBlocks.js   # Space and Node blocks
│   │   ├── transformBlocks.js   # Transform operation blocks
│   │   ├── vectorMathBlocks.js  # Vector and Math blocks
│   │   ├── componentBlocks.js   # Component-related blocks
│   │   ├── cameraTimeBlocks.js  # Camera and Time blocks
│   │   ├── logicControlBlocks.js # Logic and Control flow blocks
│   │   ├── arrayStringBlocks.js # Array and String blocks
│   │   └── index.js             # Central export for all blocks
│   │
│   ├── generators/              # Lua code generators organized by category
│   │   ├── gameModeGenerators.js
│   │   ├── spaceNodeGenerators.js
│   │   ├── transformGenerators.js
│   │   ├── vectorMathGenerators.js
│   │   ├── componentGenerators.js
│   │   ├── cameraTimeGenerators.js
│   │   ├── logicControlGenerators.js
│   │   ├── arrayStringGenerators.js
│   │   └── index.js             # Central registration function
│   │
│   ├── utils/                   # Utility functions
│   │   ├── blockRegistration.js # Register blocks with Blockly
│   │   ├── codeGenerator.js     # Lua code generation & formatting
│   │   ├── luaParser.js         # Parse Lua code for import
│   │   ├── blockCreator.js      # Create blocks from parsed code
│   │   └── workspaceAnalyzer.js # Analyze workspace structure
│   │
│   └── toolbox.js               # Toolbox configuration
│
└── components/
    └── BlocklyEditor.vue        # Main Vue component (now only 115 lines!)
```

## Module Descriptions

### Block Definitions (`blockly/blocks/`)

Each file contains block definitions for a specific category:

- **gameModeBlocks.js**: Start/Update functions, variable declarations, print statements
- **spaceNodeBlocks.js**: Space operations, node creation, node management
- **transformBlocks.js**: Position, rotation, scale operations
- **vectorMathBlocks.js**: Vector3 operations, math functions
- **componentBlocks.js**: Component addition and management
- **cameraTimeBlocks.js**: Camera access, delta time
- **logicControlBlocks.js**: If statements, boolean operations, functions
- **arrayStringBlocks.js**: Array operations, string manipulation

### Lua Generators (`blockly/generators/`)

Each generator file contains the Lua code generation logic for its corresponding block category. All generators are registered via the `registerAllGenerators()` function.

### Utilities (`blockly/utils/`)

- **blockRegistration.js**: Registers block definitions with Blockly
- **codeGenerator.js**: Generates Lua code with proper formatting, semicolons, and cleanup
- **luaParser.js**: Parses Lua code into structured format for import
- **blockCreator.js**: Creates Blockly blocks from parsed Lua code
- **workspaceAnalyzer.js**: Analyzes workspace for node relationships and physics dependencies

### Toolbox Configuration (`blockly/toolbox.js`)

Contains the complete toolbox structure defining which blocks appear in which categories.

### Main Component (`components/BlocklyEditor.vue`)

The main Vue component has been drastically simplified from **1500 lines to 115 lines** by importing all the modularized components. It now focuses solely on:

- Component lifecycle management
- Workspace initialization
- Public API methods (getCode, getXml, loadXml, importLuaCode)

## Benefits of This Structure

1. **Maintainability**: Each file has a single, clear responsibility
2. **Scalability**: Easy to add new block categories or modify existing ones
3. **Readability**: Files are smaller and easier to understand
4. **Testability**: Individual modules can be tested in isolation
5. **Reusability**: Modules can be imported and used in other parts of the application
6. **Organization**: Related functionality is grouped together

## Adding New Blocks

To add a new block:

1. Create or update the appropriate block definition file in `blockly/blocks/`
2. Create or update the corresponding generator in `blockly/generators/`
3. Add the block to the toolbox in `blockly/toolbox.js`
4. The block will automatically be registered when the application starts

## Usage Example

```javascript
// Import only what you need
import { gameModeBlocks } from "../blockly/blocks/gameModeBlocks.js";
import { registerGameModeGenerators } from "../blockly/generators/gameModeGenerators.js";

// Or import everything
import { allBlocks } from "../blockly/blocks/index.js";
import { registerAllGenerators } from "../blockly/generators/index.js";
```

## Migration Notes

All functionality from the original 1500-line file has been preserved. The refactoring is purely structural - no behavioral changes have been made. All existing features including:

- Block definitions
- Lua code generation
- Code import/export
- Workspace serialization
- Code formatting and cleanup

...continue to work exactly as before.
