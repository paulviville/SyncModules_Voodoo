import GUICore from './GUICore.js';
import GLTFModule from "../SyncModules/GLTFModule.js";
import GLTFImportController from '../SyncModulesViews/Controllers/GLTFImportController.js';

export default class GLTFGUI extends GUICore {
	static type = GLTFModule.type;
	
	constructor ( module, parent ) {
		super( module, parent );

		this.params.gltf = "";
		this.params.name = "";


		const gltfImportController = new GLTFImportController( );
		gltfImportController.setModule( module );

		const gltfFolder = this.folder.addFolder( "Gltf" );
		gltfFolder.add( { import: ( ) => {
			/// move that crap to a utils later
			gltfImportController.inputFile( );
		// 	const input = document.createElement("input");
		// 	input.type = "file";
		// 	input.accept = ".png,.jpg";

		// 	input.onchange = ( ) => {
		// 		const file = input.files[ 0 ];
		// 		if ( file === undefined )
		// 			return;
		// 		const reader = new FileReader( );
		// 		reader.onload = ( ) => {
		// 			const { result: image } = reader;
		// 			this.#controlImage( image );
		// 		};
		// reader.readAsDataURL( file );
		// 	};
		// 	input.click();
		} }, "import" );

		gltfFolder.add( this.params, "name" ).listen( ).disable( );
	}

	setCallbacks ( ) {
		super.setCallbacks( );

		this.module.setOnChange( this.module.commands.updateFile,
			( gltf ) => this.#updateFile( gltf ) 
		);
	}

	#updateFile ( gltf ) {
		this.params.name = gltf.name ?? "<unnamed>";
	}

	// #controlImage ( image ) {
	// 	this.module.setImage( image, true );
	// }
}