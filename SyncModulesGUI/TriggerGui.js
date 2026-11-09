import TriggerModule from "../SyncModules/TriggerModule.js";
import GUICore from "./GUICore.js";

export default class TriggerGUI extends GUICore {
	static type = TriggerModule.type;

	constructor ( module, parent ) {
		super ( module, parent );

		this.folder.add( { trigger: ( ) => this.#controlTrigger( ) }, "trigger" );
	}

	#controlTrigger ( ) {
		this.module.trigger( true );
	}
}