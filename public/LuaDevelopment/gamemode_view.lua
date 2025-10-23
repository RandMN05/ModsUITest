local ____lualib = require("lualib_bundle")
local __TS__SourceMapTraceBack = ____lualib.__TS__SourceMapTraceBack
__TS__SourceMapTraceBack(debug.getinfo(1).short_src, {["4"] = 2,["5"] = 3,["6"] = 2,["7"] = 6,["8"] = 6,["9"] = 9,["10"] = 9});
GameModeView.Start = function(server)
    GameModeView:SendMessageToHost("Greetings", "HELLO I AM MESSAGING YOU FROM THE VIEW OF THIS MOD")
end
GameModeView.Update = function(server, deltaTime)
end
GameModeView.Destroy = function()
end

--# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9nYW1lbW9kZV92aWV3LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLHFCQUFxQixTQUFDO0lBQ2xCLGFBQWEsa0JBQWtCLGFBQWE7QUFEM0I7QUFJckIsc0JBQXNCLFNBQUMsUUFBYTtBQUFkO0FBR3RCLHVCQUF1QjtBQUFBIiwiZmlsZSI6ImdhbWVtb2RlX3ZpZXcubHVhIiwic291cmNlUm9vdCI6IiJ9
