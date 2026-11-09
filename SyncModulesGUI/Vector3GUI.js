import GUICore from './GUICore.js';
import Vector3Module from '../SyncModules/Vector3Module.js';

export default class Vector3GUI extends GUICore {
	static type = Vector3Module.type;
	
	constructor ( module, parent ) {
		super( module, parent );

		this.params.vector = { x: 0, y: 0, z: 0 };

		this.folder.add( this.params.vector, 'x', -10, 10, 0.01 ).listen( );
		this.folder.add( this.params.vector, 'y', -10, 10, 0.01 ).listen( );
		this.folder.add( this.params.vector, 'z', -10, 10, 0.01 ).listen( );
		// .onChange( this.#controlValue.bind( this ) )
		// .listen( );
		this.folder.onChange( ( ) => {
			this.#controlVector( [
				this.params.vector.x,
				this.params.vector.y,
				this.params.vector.z,
			] );
		} );
	}

	setCallbacks ( ) {
		this.module.setOnChange( this.module.commands.updateVector,
			( vector ) => this.#updateVector( vector ) 
		);
	}

	#updateVector ( vector ) {
		this.params.vector.x = vector[ 0 ];
		this.params.vector.y = vector[ 1 ];
		this.params.vector.z = vector[ 2 ];
	}

	#controlVector ( vector ) {
		this.module.updateVector( vector, true );
	}
}