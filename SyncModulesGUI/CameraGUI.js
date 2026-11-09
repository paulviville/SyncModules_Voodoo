import TransformGUI from "./TransformGUI.js";
import CameraModule from "../SyncModules/CameraModule.js";

export default class CameraGUI extends TransformGUI {
	static type = "CameraModule";
	
	constructor ( module, parent ) {
		super( module, parent );

		this.params.fov = 50;
		this.params.aspect = 4/3;
		this.params.near = 0.1;
		this.params.far = 1;

		const cameraFolder = this.folder.addFolder( "Camera" );
		cameraFolder.add( this.params, "fov", 10, 170, 1 ).listen( );
		cameraFolder.add( this.params, "aspect", 0.25, 4, 0.01 ).listen( );
		cameraFolder.add( this.params, "near", 0.01, 10, 0.01 ).listen( );
		cameraFolder.add( this.params, "far", 0.05, 100, 0.01 ).listen( );
		
		cameraFolder.onChange( ( ) => {
			const { fov, aspect, near, far } = this.params;
			this.#controlCamera( { fov, aspect, near, far } );
		} );
		cameraFolder.close( );
	}

	setCallbacks ( ) {
		super.setCallbacks( );

		this.module.setOnChange( this.module.commands.updateCamera,
			( camera ) => this.#updateCamera( camera ) 
		);
	}

	#updateCamera ( { fov, aspect, near, far } ) {
		if ( fov ) 
			this.params.fov = fov;
		if ( aspect ) 
			this.params.aspect = aspect;
		if ( near ) 
			this.params.near = near;
		if ( far ) 
			this.params.far = far;
	}

	#controlCamera ( camera ) {
		this.module.updateCamera( camera, true );
	}
}