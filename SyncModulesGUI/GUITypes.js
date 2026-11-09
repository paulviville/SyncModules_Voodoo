import AmbientLightGUI from "./AmbientLightGUI.js";
import CameraGUI from "./CameraGUI.js";
import DirectionalLightGUI from "./DirectionalLightGUI.js";
import GLTFGUI from "./GLTFGUI.js";
import GUICore from "./GUICore.js"
import Image360GUI from "./Image360GUI.js";
import ImageGUI from "./ImageGUI.js";
import LightGUI from "./LightGUI.js";
import LineGUI from "./LineGUI.js";
import PointLightGUI from "./PointLightGUI.js";
import PrimitiveGUI from "./PrimitiveGUI.js";
import ScalarGUI from "./ScalarGUI.js"
import SpotLightGUI from "./SpotLightGUI.js";
import SwitchGUI from "./SwitchGUI.js";
import TextGUI from "./TextGUI.js";
import TextLogGUI from "./TextLogGUI.js";
import TransformGUI from "./TransformGUI.js";
import TriggerGUI from "./TriggerGui.js";
import Vector3GUI from "./Vector3GUI.js";

const GUITypes = {
	[ GUICore.type ]: GUICore,
	[ ScalarGUI.type ]: ScalarGUI,
	[ Vector3GUI.type ]: Vector3GUI,
	[ TransformGUI.type ]: TransformGUI,
	[ PrimitiveGUI.type ]: PrimitiveGUI,
	[ CameraGUI.type ]: CameraGUI,
	[ TriggerGUI.type ]: TriggerGUI,
	[ SwitchGUI.type ]: SwitchGUI,
	[ TextGUI.type ]: TextGUI,
	[ ImageGUI.type ]: ImageGUI,
	[ Image360GUI.type ]: Image360GUI,
	[ LineGUI.type ]: LineGUI,
	[ TextLogGUI.type ]: TextLogGUI,
	// [ LightGUI.type ]: LightGUI,
	[ PointLightGUI.type ]: PointLightGUI,
	[ AmbientLightGUI.type ]: AmbientLightGUI,
	[ SpotLightGUI.type ]: SpotLightGUI,
	[ DirectionalLightGUI.type ]: DirectionalLightGUI,
	[ GLTFGUI.type ]: GLTFGUI,
};
console.log( SpotLightGUI.type )
Object.freeze( GUITypes );
export default GUITypes;


