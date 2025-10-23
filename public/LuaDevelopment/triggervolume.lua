local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__SourceMapTraceBack = ____lualib.__TS__SourceMapTraceBack
__TS__SourceMapTraceBack(debug.getinfo(1).short_src, {["6"] = 1,["7"] = 1,["8"] = 1,["9"] = 6,["10"] = 6,["11"] = 6,["12"] = 19,["13"] = 19,["14"] = 19,["16"] = 19,["17"] = 19,["19"] = 19,["20"] = 19,["22"] = 19,["23"] = 19,["25"] = 21,["26"] = 23,["27"] = 25,["28"] = 27,["29"] = 28,["30"] = 29,["31"] = 31,["32"] = 33,["33"] = 34,["34"] = 35,["35"] = 36,["36"] = 38,["37"] = 39,["39"] = 42,["40"] = 43,["42"] = 46,["43"] = 47,["44"] = 49,["45"] = 50,["47"] = 19,["48"] = 53,["49"] = 54,["52"] = 57,["54"] = 57,["56"] = 58,["57"] = 59,["59"] = 53});
local ____exports = {}
local ____gamemode_lua_bindings = require("gamemode_lua_bindings")
local TokenHandoffPolicy = ____gamemode_lua_bindings.TokenHandoffPolicy
local Vector3 = ____gamemode_lua_bindings.Vector3
____exports.StageTriggerVolume = __TS__Class()
local StageTriggerVolume = ____exports.StageTriggerVolume
StageTriggerVolume.name = "StageTriggerVolume"
function StageTriggerVolume.prototype.____constructor(self, gltfid, name, position, rotation, scale, manipuable)
    if gltfid == nil then
        gltfid = ""
    end
    if name == nil then
        name = ""
    end
    if scale == nil then
        scale = Vector3:FromValues(1, 1, 1)
    end
    if manipuable == nil then
        manipuable = false
    end
    self._Space = Vertex.GetSpace()
    self._GLTF = gltfid
    self._Name = name ~= "" and name or "StageTriggerVolume"
    self._Position = position
    self._Rotation = rotation
    self._Scale = scale
    self._isManipulable = manipuable
    self._Node = self._Space:CreateNode(self._Name, TokenHandoffPolicy.DestroyWithLastClient)
    self._Node.Position = position
    self._Node.Rotation = rotation
    self._Node.Scale = scale
    if self._GLTF ~= "" then
        self._Node:AddGltfComponent(self._GLTF)
    end
    if self._isManipulable then
        self._Node:AddManipulableComponent(false)
    end
    self._Node:AddPhysicsComponent(true, 0)
    self._Node:AddComponent("TriggerVolume")
    if self._Node ~= nil then
        self._Space:AddNode(self._Node)
    end
end
function StageTriggerVolume.prototype.Destroy(self)
    if self._Node == nil then
        return
    end
    local ____opt_0 = self._Node:GetComponent("DestructionHelper")
    if ____opt_0 ~= nil then
        ____opt_0.InvokeOnDestroy({})
    end
    if self._Node ~= nil then
        Vertex.GetSpace():DestroyNode(self._Node)
    end
end
return ____exports

--# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy90cmlnZ2Vydm9sdW1lLnRzIl0sIm5hbWVzIjpbInRoaXMiXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsa0NBQTJHO0FBQTVGO0FBQTJCO0FBSzFDO01BQWE7QUFBYjtBQWFJLDREQUFZLFFBQXFCLE1BQW1CLFVBQW1CLFVBQW1CLE9BQTRDO09BQTFIO1FBQUEsU0FBaUI7O09BQUk7UUFBQSxPQUFlOztPQUEwQztRQUFBLFFBQWlCLFFBQVEsV0FBVyxHQUFFLEdBQUU7O09BQUk7UUFBQSxhQUFzQjs7QUFFeEosSUFBQUEsY0FBYztBQUVkLElBQUFBLGFBQWE7QUFFYixJQUFBQSxhQUFhLFFBQVEsT0FBSyxRQUFPO0FBRWpDLElBQUFBLGlCQUFpQjtBQUNqQixJQUFBQSxpQkFBaUI7QUFDakIsSUFBQUEsY0FBYztBQUVkLElBQUFBLHNCQUFzQjtBQUV0QixJQUFBQSxhQUFhLEFBQUFBLFlBQVksV0FBVyxBQUFBQSxZQUFZO0FBQ2hELElBQUFBLHNCQUFzQjtBQUN0QixJQUFBQSxzQkFBc0I7QUFDdEIsSUFBQUEsbUJBQW1CO09BRWYsQUFBQUEsY0FBYztRQUNkLEFBQUFBLFdBQVcsaUJBQWlCLEFBQUFBOztPQUc1QixBQUFBQTtRQUNBLEFBQUFBLFdBQVcsd0JBQXdCOztJQUd2QyxBQUFBQSxXQUFXLG9CQUFvQixNQUFNO0lBQ3JDLEFBQUFBLFdBQVcsYUFBYTtPQUVwQixBQUFBQSxjQUFjO1FBQ2QsQUFBQUEsWUFBWSxRQUFRLEFBQUFBOztBQS9CNUI7QUFrQ0E7T0FDUSxBQUFBQSxjQUFjO0FBQ2Q7O3NCQUVILEFBQUFBLFdBQVcsYUFBYTs7UUFBekIsMEJBQXVFOztPQUNuRSxBQUFBQSxjQUFjO1FBQ2Qsa0JBQWtCLFlBQVksQUFBQUE7O0FBTnRDIiwiZmlsZSI6InRyaWdnZXJ2b2x1bWUubHVhIiwic291cmNlUm9vdCI6IiJ9
