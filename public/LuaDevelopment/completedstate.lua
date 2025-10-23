local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local __TS__SourceMapTraceBack = ____lualib.__TS__SourceMapTraceBack
__TS__SourceMapTraceBack(debug.getinfo(1).short_src, {["7"] = 3,["8"] = 3,["9"] = 5,["10"] = 5,["11"] = 5,["12"] = 5,["13"] = 7,["14"] = 8,["15"] = 7,["16"] = 11,["17"] = 12,["18"] = 11,["19"] = 15,["20"] = 16,["21"] = 15});
local ____exports = {}
local ____gamestate = require("gamestate")
local GameState = ____gamestate.GameState
____exports.CompletedState = __TS__Class()
local CompletedState = ____exports.CompletedState
CompletedState.name = "CompletedState"
__TS__ClassExtends(CompletedState, GameState)
function CompletedState.prototype.OnStateEnter(self)
    print("onStateEnter CompletedState")
end
function CompletedState.prototype.OnStateExit(self)
    print("onStateExit CompletedState")
end
function CompletedState.prototype.Update(self, deltaTime)
    print("You're in the Completed State, Well Done!")
end
return ____exports

--# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jb21wbGV0ZWRzdGF0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFFQSxzQkFBMEI7QUFBakI7QUFFVDtNQUFhO0FBQWI7QUFBNEIsbUNBQVE7QUFFaEM7VUFDZTtBQURmO0FBSUE7VUFDZ0I7QUFEaEI7QUFJQSwrQ0FBTztVQUNTO0FBRGhCIiwiZmlsZSI6ImNvbXBsZXRlZHN0YXRlLmx1YSIsInNvdXJjZVJvb3QiOiIifQ==
