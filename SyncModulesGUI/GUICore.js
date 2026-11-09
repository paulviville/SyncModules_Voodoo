import GUI from '../three/libs/lil-gui.module.min.js';

import ModuleCore from '../SyncModules/Core/ModuleCore.js';

export default class GUICore {
	static type = ModuleCore.type;

	#module; 
	#folder;
	#guiParams = {

	}
	#deleteController;

	constructor ( module, parent  ) {
		this.#module = module;
		this.#folder = parent.addFolder( `${ module.type } \n- ${ module.UUID }` );

		this.setCallbacks( );
		// this.#folder.close( );
	}

	get module ( ) {
		return this.#module;
	}

	get folder ( ) {
		return this.#folder;
	}

	get params ( ) {
		return this.#guiParams;
	}

	/// overload in children
	#setModule ( module ) {
		this.#module = module;
		
		this.setCallbacks( );
	}

	get onDelete ( ) {
		//return on
	} 

	set onDelete ( onDelete ) {
		this.#deleteController = this.#folder.add( { delete: onDelete }, "delete" );
	}

	/// overload in children
	setCallbacks ( ) {

		return;
	}

	delete ( ) {
		this.#folder.destroy( );
	}

	refresh ( ) {

	}
}