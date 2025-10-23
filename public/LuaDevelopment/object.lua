local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__SourceMapTraceBack = ____lualib.__TS__SourceMapTraceBack
__TS__SourceMapTraceBack(debug.getinfo(1).short_src, {["6"] = 1,["7"] = 1,["8"] = 1,["9"] = 5,["10"] = 5,["11"] = 5,["12"] = 19,["13"] = 19,["14"] = 19,["16"] = 19,["17"] = 19,["19"] = 21,["20"] = 23,["21"] = 24,["22"] = 25,["23"] = 26,["24"] = 27,["25"] = 29,["26"] = 31,["27"] = 31,["28"] = 31,["30"] = 31,["32"] = 31,["33"] = 33,["34"] = 34,["35"] = 35,["37"] = 19,["38"] = 39,["39"] = 40,["40"] = 41,["41"] = 42,["42"] = 44,["43"] = 46,["44"] = 47,["46"] = 50,["47"] = 51,["48"] = 39,["49"] = 54,["50"] = 55,["53"] = 58,["55"] = 58,["57"] = 59,["58"] = 60,["60"] = 54});
local ____exports = {}
local ____gamemode_lua_bindings = require("gamemode_lua_bindings")
local Vector3 = ____gamemode_lua_bindings.Vector3
local TokenHandoffPolicy = ____gamemode_lua_bindings.TokenHandoffPolicy
____exports.StageObject = __TS__Class()
local StageObject = ____exports.StageObject
StageObject.name = "StageObject"
function StageObject.prototype.____constructor(self, id, name, position, manipuable, addtospace, rotation, scale)
    if rotation == nil then
        rotation = Vector3:FromValues(0, 0, 0)
    end
    if scale == nil then
        scale = Vector3:FromValues(1, 1, 1)
    end
    self._Space = Vertex.GetSpace()
    self._Id = id
    self._Name = name
    self._Position = position
    self._Rotation = rotation
    self._Scale = scale
    self._isManipulable = manipuable
    local ____temp_0
    if addtospace ~= nil then
        ____temp_0 = addtospace
    else
        ____temp_0 = true
    end
    self._isAdded = ____temp_0
    self._Node = self._Space:CreateNode(self._Name, TokenHandoffPolicy.DestroyWithLastClient)
    if self._isAdded == true and self._Node ~= nil then
        self:BuildNode()
    end
end
function StageObject.prototype.BuildNode(self)
    self._Node.Position = self._Position
    self._Node.Rotation = self._Rotation
    self._Node.Scale = self._Scale
    self._Node:AddGltfComponent(self._Id)
    if self._isManipulable then
        self._Node:AddManipulableComponent(false)
    end
    self._Space:AddNode(self._Node)
    print("Added: " .. self._Name, self._Id)
end
function StageObject.prototype.Destroy(self)
    if self._Node == nil then
        return
    end
    local ____opt_1 = self._Node:GetComponent("DestructionHelper")
    if ____opt_1 ~= nil then
        ____opt_1.InvokeOnDestroy({})
    end
    if self._Node ~= nil then
        Vertex.GetSpace():DestroyNode(self._Node)
    end
end
return ____exports

--# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9vYmplY3QudHMiXSwibmFtZXMiOlsidGhpcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxrQ0FBa0g7QUFBMUY7QUFBOEQ7QUFJdEY7TUFBYTtBQUFiO0FBY0kscURBQVksSUFBWSxNQUFjLFVBQW1CLFlBQXFCLFlBQWtDLFVBQWdEO09BQWhEO1FBQUEsV0FBb0IsUUFBUSxXQUFXLEdBQUUsR0FBRTs7T0FBSztRQUFBLFFBQWlCLFFBQVEsV0FBVyxHQUFFLEdBQUU7O0FBRXBNLElBQUFBLGNBQWM7QUFFZCxJQUFBQSxXQUFXO0FBQ1gsSUFBQUEsYUFBYTtBQUNiLElBQUFBLGlCQUFpQjtBQUNqQixJQUFBQSxpQkFBaUI7QUFDakIsSUFBQUEsY0FBYztBQUVkLElBQUFBLHNCQUFzQjtBQUVOO09BQUEsY0FBYztBQUFZOztBQUFhOztBQUF2RCxJQUFBQSxLQUFLO0FBRUwsSUFBQUEsYUFBYSxBQUFBQSxZQUFZLFdBQVcsQUFBQUEsWUFBWTtPQUM3QyxBQUFBQSxpQkFBaUIsU0FBUSxBQUFBQSxjQUFjO1FBQ3RDLEFBQUFBLEtBQUs7O0FBaEJiO0FBb0JBO0FBQ0ksSUFBQUEsc0JBQXNCLEFBQUFBO0FBQ3RCLElBQUFBLHNCQUFzQixBQUFBQTtBQUN0QixJQUFBQSxtQkFBbUIsQUFBQUE7SUFFbkIsQUFBQUEsV0FBVyxpQkFBaUIsQUFBQUE7T0FFeEIsQUFBQUE7UUFDQSxBQUFBQSxXQUFXLHdCQUF3Qjs7SUFHdkMsQUFBQUEsWUFBWSxRQUFRLEFBQUFBO1VBQ1IsYUFBWSxBQUFBQSxZQUFZLEFBQUFBO0FBWnhDO0FBZUE7T0FDUSxBQUFBQSxjQUFjO0FBQ2Q7O3NCQUVILEFBQUFBLFdBQVcsYUFBYTs7UUFBekIsMEJBQXVFOztPQUNuRSxBQUFBQSxjQUFjO1FBQ2Qsa0JBQWtCLFlBQVksQUFBQUE7O0FBTnRDIiwiZmlsZSI6Im9iamVjdC5sdWEiLCJzb3VyY2VSb290IjoiIn0=
