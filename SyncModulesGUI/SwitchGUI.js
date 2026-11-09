import SwitchModule from "../SyncModules/SwitchModule.js";
import GUICore from "./GUICore.js";

export default class SwitchGUI extends GUICore {
	static type = SwitchModule.type;

	
	constructor ( module, parent ) {
		super ( module, parent );

		this.params.value = module.value; 
		this.folder.add( this.params, "value" )
		.onChange( this.#controlToggle.bind( this ) )
		.listen( );
	}

	setCallbacks ( ) {
		this.module.setOnChange( this.module.commands.toggle,
			( { value } ) => this.#toggle( value )
		);
	}

	#toggle ( value ) {
		this.params.value = value;
	}

	#controlToggle ( value ) {
		this.module.toggle( value, true );
	}
}