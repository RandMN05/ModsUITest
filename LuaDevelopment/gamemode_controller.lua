-- Gamemode Controller for saving compiled Blockly code
local GamemodeController = {}

-- Path to this file for self-replacement
local SELF_FILE_PATH = "c:\\Users\\rand.nessif\\Documents\\ModsUITest\\LuaDevelopment\\gamemode_controller.lua"

-- helper to embed arbitrary compiled code safely in a long-bracket string
local function toLongBracketString(s)
    s = tostring(s or "")
    local eqs = ""
    while s:find("]" .. eqs .. "]", 1, true) do
        eqs = eqs .. "="
    end
    -- Produce a correct Lua long-bracket string without extra spaces:
    -- Example output: [=[\n<content>\n]=]
    return string.format("[%s[\n%s\n]%s]", eqs, s, eqs)
end

-- simple detector for common duplicate patterns in raw compiled code
local function hasDuplicateControllerStubs(code)
    code = tostring(code or "")
    local counts = { Start = 0, Update = 0, Destroy = 0 }
    for name in code:gmatch("GameModeController%.([A-Za-z_]+)%s*=%s*function") do
        if counts[name] ~= nil then counts[name] = counts[name] + 1 end
    end
    return (counts.Start > 1) or (counts.Update > 1) or (counts.Destroy > 1), counts
end

-- Function to replace this file (or another) with a wrapper that applies compiled Blockly code
function GamemodeController.replaceWithBlocklyCode(compiledCode, metadata)
    metadata = metadata or {}

    -- require an explicit outputFile; never overwrite this loader by default
    local outPath = metadata.outputFile
    if not outPath or outPath == "" then
        print("No outputFile provided; skipping file write (runtime-only apply).")
        return true
    end

    local gamemodeName = metadata.gamemode or "Blockly Game Controller"

    -- warn if the raw compiled code appears to contain duplicate stubs
    local dup, counts = hasDuplicateControllerStubs(compiledCode)
    if dup then
        print(string.format(
            "Notice: compiled code contains duplicate stubs Start:%d Update:%d Destroy:%d. Writing wrapper to avoid duplicates.",
            counts.Start or 0, counts.Update or 0, counts.Destroy or 0
        ))
    end

    -- wrapper defers execution to this loader and applies compiled code once (no duplicates)
    local wrapperContent = string.format([[-- Generated Wrapper for GameModeController (no-dup)
-- Generated on: %s
-- Gamemode: %s

local controller = dofile(%q)
local code = %s
controller.onBlocklyCompiled(code, { gamemode = %q })
_G.GameModeController = controller
return controller
]],
        os.date("%Y-%m-%d %H:%M:%S"),
        gamemodeName,
        SELF_FILE_PATH,
        toLongBracketString(compiledCode),
        gamemodeName
    )

    local file, err = io.open(outPath, "w")
    if not file then
        print("Error writing wrapper file: " .. (err or "Unknown error"))
        return false
    end
    file:write(wrapperContent)
    file:close()

    print("Wrapper file written (no duplicates): " .. outPath)
    return true
end

-- Replace the previous onBlocklyCompiled with a sandboxed loader that applies functions without duplication
function GamemodeController.onBlocklyCompiled(compiledCode, metadata)
    if not compiledCode or compiledCode == "" then
        print("No compiled code received.")
        return false
    end

    -- idempotency: skip if identical code already applied
    if GamemodeController._last_code == compiledCode then
        print("Compiled Blockly code unchanged; skipping re-apply.")
        return true
    end

    -- warn if the raw compiled code appears to contain duplicate stubs
    local dup = hasDuplicateControllerStubs(compiledCode)
    if dup then
        print("Notice: compiled code contains duplicate stubs; loader will apply only the final definitions.")
    end

    -- sandbox environment that falls back to globals for engine functions
    -- IMPORTANT: seed a fresh controller so compiled code doesn't inherit base functions
    local env = {}
    setmetatable(env, { __index = _G })
    env.GameModeController = {}
    env.GamemodeController = env.GameModeController

    local chunk, err = load(compiledCode, "blockly_compiled", "t", env)
    if not chunk then
        print("Error loading compiled Blockly code: " .. tostring(err))
        return false
    end

    local ok, execErr = pcall(chunk)
    if not ok then
        print("Error executing compiled Blockly code: " .. tostring(execErr))
        return false
    end

    -- Try to find the controller table in the sandbox (common patterns)
    local blCtrl = env.GameModeController or env.GamemodeController
    if not blCtrl then
        blCtrl = {}
        if type(env.Start) == "function" then blCtrl.Start = env.Start end
        if type(env.Update) == "function" then blCtrl.Update = env.Update end
        if type(env.Destroy) == "function" then blCtrl.Destroy = env.Destroy end
    end

    if next(blCtrl or {}) == nil then
        print("No GameModeController functions found in compiled code.")
        return false
    end

    -- clear previous lifecycle functions, then replace to avoid any stacking
    GamemodeController.Start = nil
    GamemodeController.Update = nil
    GamemodeController.Destroy = nil
    if type(blCtrl.Start) == "function" then GamemodeController.Start = blCtrl.Start end
    if type(blCtrl.Update) == "function" then GamemodeController.Update = blCtrl.Update end
    if type(blCtrl.Destroy) == "function" then GamemodeController.Destroy = blCtrl.Destroy end

    -- publish as global and persist env/state and last applied code
    _G.GameModeController = GamemodeController
    GamemodeController._blockly_env = env
    GamemodeController._last_code = compiledCode

    print("Compiled Blockly code applied to GamemodeController (no duplicates).")

    -- optionally emit a wrapper file if requested
    if metadata and metadata.outputFile then
        return GamemodeController.replaceWithBlocklyCode(compiledCode, metadata)
    end

    return true
end

return GamemodeController
