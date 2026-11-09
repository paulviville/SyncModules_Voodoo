import GUICore from './GUICore.js';
import TextLogModule from '../SyncModules/TextLogModule.js';

import uuid from '../uuid.js';

export default class TextLogGUI extends GUICore {
	static type = TextLogModule.type;

	#controllersMap = new Map( ); /// textUUID -> controller
	#logsFolder;



	constructor ( module, parent ) {
		super ( module, parent );

		this.params.input = "";
		this.params.add = ( ) => { this.#controlAddText( this.params.input ) };
		this.inputControler = this.folder.add( this.params, "input" );
		this.addTextControler = this.folder.add( this.params, "add" );
		this.#logsFolder = this.folder.addFolder( "Logs" );

		const textLogs = module.textLogs
		for ( const textLog of textLogs ) {
			console.log( textLog )
			this.#addText( textLog );
		}

	}

	setCallbacks ( ) {
		super.setCallbacks( );

		this.module.setOnChange( this.module.commands.addText,
			( textLog ) => { this.#addText( textLog ) } 
		);
		this.module.setOnChange( this.module.commands.removeText,
			( ) => { } 
		);
		this.module.setOnChange( this.module.commands.updateText,
			( ) => { } 
		);
		this.module.setOnChange( this.module.commands.clear,
			( ) => { } 
		);
	}

	#addText ( textLog ) {

	}

	#removeText ( textLog ) {

	}
	
	#updateText ( textLog ) {

	}

	#clear ( ) {

	}

	#controlAddText ( text ) {
		const UUID = uuid( );
		this.module.addText( { text, UUID }, true );
	}

	#controlRemoveText ( textLog ) {

	}

	#controlUpdateText ( textLog ) {

	}


}