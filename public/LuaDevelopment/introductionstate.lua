local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local __TS__New = ____lualib.__TS__New
local __TS__SourceMapTraceBack = ____lualib.__TS__SourceMapTraceBack
__TS__SourceMapTraceBack(debug.getinfo(1).short_src, {["8"] = 2,["9"] = 2,["10"] = 4,["11"] = 4,["12"] = 6,["13"] = 6,["14"] = 6,["15"] = 6,["17"] = 6,["18"] = 8,["19"] = 6,["20"] = 10,["21"] = 11,["22"] = 13,["23"] = 14,["24"] = 14,["25"] = 14,["26"] = 10,["27"] = 17,["28"] = 18,["29"] = 17,["30"] = 21,["31"] = 22,["32"] = 21});
local ____exports = {}
local ____button_controller = require("button_controller")
local ButtonController = ____button_controller.ButtonController
local ____gamestate = require("gamestate")
local GameState = ____gamestate.GameState
____exports.IntroductionState = __TS__Class()
local IntroductionState = ____exports.IntroductionState
IntroductionState.name = "IntroductionState"
__TS__ClassExtends(IntroductionState, GameState)
function IntroductionState.prototype.____constructor(self, ...)
    GameState.prototype.____constructor(self, ...)
    self.buttonPedestal = nil
end
function IntroductionState.prototype.OnStateEnter(self)
    print("onStateEnter IntroductionState")
    self.buttonPedestal = __TS__New(ButtonController)
    self.buttonPedestal.OnButtonPressed = function(____, index, position)
        print("ButtonPressed ", position)
    end
end
function IntroductionState.prototype.OnStateExit(self)
    print("onStateExit IntroductionState")
end
function IntroductionState.prototype.Update(self, deltaTime)
    print("You're in the Introduction State, Well Done!")
end
return ____exports

--# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9pbnRyb2R1Y3Rpb25zdGF0ZS50cyJdLCJuYW1lcyI6WyJ0aGlzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQ0EsOEJBQWlDO0FBQXhCO0FBRVQsc0JBQTBCO0FBQWpCO0FBRVQ7TUFBYTtBQUFiO0FBQStCLHNDQUFRO0FBQXZDO0lBQXVDO0FBRW5DLDBCQUEwQztBQUY5QztBQUlJO1VBQ2U7QUFFWixJQUFBQSxzQkFBc0IsVUFBSTtBQUMxQixJQUFBQSxzQ0FBc0MsZUFBQyxPQUFnQjtjQUFxQyxrQkFBa0I7SUFBeEU7QUFKekM7QUFPQTtVQUNnQjtBQURoQjtBQUlBLGtEQUFPO1VBQ1M7QUFEaEIiLCJmaWxlIjoiaW50cm9kdWN0aW9uc3RhdGUubHVhIiwic291cmNlUm9vdCI6IiJ9
