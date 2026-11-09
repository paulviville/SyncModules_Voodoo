import GUICore from './GUICore.js';
import TextModule from '../SyncModules/TextModule.js';

export default class TextGUI extends GUICore {
	static type = TextModule.type;
	
	constructor ( module, parent ) {
		super( module, parent );

		this.params.text = "";

		this.folder.add( this.params, 'text' )
		.onChange( this.#controlText.bind( this ) )
		.listen( );
	}

	setCallbacks ( ) {
		this.module.setOnChange( this.module.commands.updateText,
			( text ) => this.#updateText( text ) 
		);
	}

	#updateText ( text ) {
		this.params.text = text;
	}

	#controlText ( text ) {
		this.module.updateText( text, true );
	}
}