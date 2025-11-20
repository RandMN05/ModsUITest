// Camera and Time Lua code generators
import { Order } from "blockly/lua";

export const registerCameraTimeGenerators = (luaGenerator) => {
  luaGenerator.forBlock["delta_time"] = function (block, generator) {
    return ["deltaTime", Order.HIGH];
  };

  luaGenerator.forBlock["get_main_camera"] = function (block, generator) {
    return ["Camera:GetMainCamera()", Order.HIGH];
  };

  luaGenerator.forBlock["camera_position"] = function (block, generator) {
    const camera =
      generator.valueToCode(block, "CAMERA", Order.ATOMIC) || "camera";
    return [`${camera}.Position`, Order.HIGH];
  };
};
