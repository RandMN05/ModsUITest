local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__New = ____lualib.__TS__New
local __TS__SourceMapTraceBack = ____lualib.__TS__SourceMapTraceBack
__TS__SourceMapTraceBack(debug.getinfo(1).short_src, {["7"] = 1,["8"] = 1,["9"] = 2,["10"] = 2,["11"] = 3,["12"] = 3,["13"] = 4,["14"] = 4,["15"] = 5,["16"] = 5,["17"] = 7,["18"] = 7,["19"] = 7,["21"] = 8,["22"] = 12,["23"] = 14,["24"] = 16,["25"] = 16,["26"] = 16,["27"] = 16,["28"] = 17,["29"] = 17,["30"] = 17,["31"] = 17,["32"] = 18,["33"] = 18,["34"] = 18,["35"] = 18,["36"] = 21,["38"] = 10,["39"] = 25,["40"] = 26,["41"] = 25,["42"] = 29,["43"] = 30,["45"] = 30,["47"] = 29});
local ____exports = {}
local ____constants = require("constants")
local Constants = ____constants.Constants
local ____gamestatemachine = require("states.gamestatemachine")
local GameStateMachine = ____gamestatemachine.GameStateMachine
local ____introductionstate = require("states.introductionstate")
local IntroductionState = ____introductionstate.IntroductionState
local ____activitystate = require("states.activitystate")
local ActivityState = ____activitystate.ActivityState
local ____completedstate = require("states.completedstate")
local CompletedState = ____completedstate.CompletedState
____exports.GameHost = __TS__Class()
local GameHost = ____exports.GameHost
GameHost.name = "GameHost"
function GameHost.prototype.____constructor(self)
    self.gameStateMachine = nil
    self.gameStateMachine = __TS__New(GameStateMachine)
    if self.gameStateMachine ~= nil then
        self.gameStateMachine:RegisterState(
            Constants.IntroductionState,
            __TS__New(IntroductionState, self.gameStateMachine)
        )
        self.gameStateMachine:RegisterState(
            Constants.ActivityState,
            __TS__New(ActivityState, self.gameStateMachine)
        )
        self.gameStateMachine:RegisterState(
            Constants.CompletedState,
            __TS__New(CompletedState, self.gameStateMachine)
        )
        self.gameStateMachine:ChangeState(Constants.IntroductionState)
    end
end
function GameHost.prototype.Destroy(self)
    self.gameStateMachine = nil
end
function GameHost.prototype.Update(self, deltaTime)
    local ____opt_0 = self.gameStateMachine
    if ____opt_0 ~= nil then
        ____opt_0:Update(deltaTime)
    end
end
return ____exports

--# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9nYW1laG9zdC50cyJdLCJuYW1lcyI6WyJ0aGlzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxzQkFBMEI7QUFBakI7QUFDVCw2QkFBaUM7QUFBeEI7QUFDVCw4QkFBa0M7QUFBekI7QUFDVCwwQkFBOEI7QUFBckI7QUFDVCwyQkFBK0I7QUFBdEI7QUFFVDtNQUFhO0FBQWI7QUFHSTtBQUZBLDRCQUE0QztBQUl4QyxJQUFBQSx3QkFBd0IsVUFBSTtPQUV6QixBQUFBQSx5QkFBeUI7UUFFeEIsQUFBQUEsc0JBQXNCO1lBQWM7WUFBNkIsVUFBSSxtQkFBa0IsQUFBQUE7O1FBQ3ZGLEFBQUFBLHNCQUFzQjtZQUFjO1lBQXlCLFVBQUksZUFBYyxBQUFBQTs7UUFDL0UsQUFBQUEsc0JBQXNCO1lBQWM7WUFBMEIsVUFBSSxnQkFBZSxBQUFBQTs7UUFHakYsQUFBQUEsc0JBQXNCLFlBQVk7O0FBWDFDO0FBZUE7QUFDSSxJQUFBQSx3QkFBd0I7QUFENUI7QUFJQSx5Q0FBTztzQkFDSCxBQUFBQTs7UUFBQSxVQUF1QixPQUFPOztBQURsQyIsImZpbGUiOiJnYW1laG9zdC5sdWEiLCJzb3VyY2VSb290IjoiIn0=
