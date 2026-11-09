import ModulesRegistry from "../SyncModules/Core/ModulesRegistry.js";
import GUICore from './GUICore.js';
import GUITypes from "./GUITypes.js";

export default class GUIRegistry extends GUICore {
	static type = ModulesRegistry.type;

	#guis = new Map( );

	constructor ( registry, parent ) {

		super( registry, parent );

		this.folder.open( ); 

		for ( const [ _, mod ] of registry.modules ) {
			if ( mod == registry ) {
				continue;
			}
			this.#addModuleGUI( mod );
		}
	}

	setCallbacks ( ) {
		console.log( `GUIRegistry - setCallbacks` );

		this.module.setOnChange( this.module.commands.addModule,
			( moduleData ) => this.#addModuleGUI( moduleData ) 
		);
		this.module.setOnChange(this.module.commands.removeModule,
			( moduleData ) => this.#removeModuleGUI( moduleData ) 
		);
	}

	getGUI ( moduleUUID ) {
		return this.#guis.get( moduleUUID );
	}

	#addModuleGUI ( moduleData ) {
		console.log( `GUIRegistry - #addModuleGUI` );

		const { type, UUID } = moduleData;
		const module = this.module.getModule( UUID );

		const constructor = GUITypes[ type ] || GUICore;
		const gui = new constructor(
			module,
			this.folder,
		);
		gui.onDelete = ( ) => { this.module.removeModule( module.UUID, true ) };
		// gui.folder.onOpenClose( changedGui => {
		// 	console.log( changedGui._closed );
		// } );
		// gui.folder.hide()
		// gui.folder.show()

		this.#guis.set( UUID, gui );

		return gui;
	}

	#removeModuleGUI ( moduleData ) {
		const gui = this.getGUI( moduleData.UUID );
		if ( gui === undefined ) {
			return;
		}

		gui.delete( );
	}
}