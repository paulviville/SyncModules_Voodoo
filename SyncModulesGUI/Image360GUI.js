import ImageGUI from "./ImageGUI.js";
import Image360Module from "../SyncModules/Image360Module.js";

export default class Image360GUI extends ImageGUI {
	static type = Image360Module.type;
	
	constructor ( module, parent ) {
		super( module, parent );
	}

	setCallbacks ( ) {
		super.setCallbacks( );
	}
}