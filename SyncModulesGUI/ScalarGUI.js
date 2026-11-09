import GUICore from './GUICore.js';
import ScalarModule from '../SyncModules/ScalarModule.js';

export default class ScalarGUI extends GUICore {
	static type = ScalarModule.type;
	
	constructor ( module, parent ) {
		super( module, parent );

		this.params.value = 0.0;

		this.folder.add( this.params, 'value', 0, 1, 0.01 )
		.onChange( this.#controlValue.bind( this ) )
		.listen( );
	}

	setCallbacks ( ) {
		this.module.setOnChange( this.module.commands.updateValue,
			( value ) => this.#updateValue( value ) 
		);
	}

	#updateValue ( value ) {
		this.params.value = value;
	}

	#controlValue ( value ) {
		console.log( this, value );
		this.module.updateValue( value, true );
	}
}