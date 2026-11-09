import GUICore from './GUICore.js';
import TransformModule from '../SyncModules/TransformModule.js';

const indices = { x: 0, y: 1, z: 2, w: 3 };
const axes = [ "x", "y", "z", "w" ];

function normalizeQuaternion( q, fixedAxis ) {
	const fixedIndex = indices[ fixedAxis ];
    const fixed = Math.max(-1, Math.min(1, q[fixedIndex]));
    const scale = Math.sqrt(Math.max(0, 1 - fixed * fixed));

    let lenSq = 0;
    for (let i = 0; i < 4; i++) {
        if (i !== fixedIndex) lenSq += q[i] * q[i];
    }

    const len = Math.sqrt(lenSq);

    for (let i = 0; i < 4; i++) {
        if (i !== fixedIndex) {
            q[i] = len > 1e-8
                ? q[i] / len * scale
                : 0;
        }
    }

    if (len <= 1e-8) {
        q[(fixedIndex + 1) % 4] = scale;
    }

    return q;
}

export default class TransformGUI extends GUICore {
	static type = TransformModule.type;
	
	constructor ( module, parent ) {
		super( module, parent );

		const { translation: T, rotation: R, scale: S } = module.transform;
		const translation = { x: T[ 0 ], y: T[ 1 ], z: T[ 2 ] };
		const rotation = { x: R[ 0 ], y: R[ 1 ], z: R[ 2 ], w: R[ 3 ] };
		const scale = { x: S[ 0 ], y: S[ 1 ], z: S[ 2 ] };
		this.params.transform = { translation, rotation, scale	};

		const TRSFolder =  this.folder.addFolder( "Transform" );
		const TFolder = TRSFolder.addFolder( "Translation" );
		const RFolder = TRSFolder.addFolder( "Rotation" );
		const SFolder = TRSFolder.addFolder( "Scale" );

		TFolder.add( translation, 'x', -10, 10, 0.01 ).listen( );
		TFolder.add( translation, 'y', -10, 10, 0.01 ).listen( );
		TFolder.add( translation, 'z', -10, 10, 0.01 ).listen( );
		TFolder.onChange( ( ) => {
			this.#controlTransform( { translation: [ translation.x, translation.y, translation.z ] } );
		} );

		RFolder.add( rotation, 'x', -1, 1, 0.01 ).listen( );
		RFolder.add( rotation, 'y', -1, 1, 0.01 ).listen( );
		RFolder.add( rotation, 'z', -1, 1, 0.01 ).listen( );
		RFolder.add( rotation, 'w', -1, 1, 0.01 ).listen( );

		RFolder.onChange( ( { property: fixedAxis, value } ) => {
			const q = normalizeQuaternion( [ rotation.x, rotation.y, rotation.z, rotation.w ], fixedAxis );
			rotation.x = q[ 0 ];
			rotation.y = q[ 1 ];
			rotation.z = q[ 2 ];
			rotation.w = q[ 3 ];
			this.#controlTransform( { rotation: [ rotation.x, rotation.y, rotation.z, rotation.w ] } );
		} );

		SFolder.add( scale, 'x', -10, 10, 0.01 ).listen( );
		SFolder.add( scale, 'y', -10, 10, 0.01 ).listen( );
		SFolder.add( scale, 'z', -10, 10, 0.01 ).listen( );
		SFolder.onChange( ( ) => {
			this.#controlTransform( { scale: [ scale.x, scale.y, scale.z ] } );
		} );

		TFolder.close( );
		RFolder.close( );
		SFolder.close( );
		TRSFolder.close( );
	}

	setCallbacks ( ) {
		this.module.setOnChange( this.module.commands.updateTransform,
			( transform ) => this.#updateTransform( transform ) 
		);
	}

	#updateTransform ( transform ) {
		if ( transform.translation ) 
			this.#updateTranslation( transform.translation );

		if ( transform.rotation ) 
			this.#updateRotation( transform.rotation );

		if ( transform.scale ) 
			this.#updateScale( transform.scale );
	}

	#updateTranslation ( translation ) {
		this.params.transform.translation.x = translation[ 0 ];
		this.params.transform.translation.y = translation[ 1 ];
		this.params.transform.translation.z = translation[ 2 ];
	}

	#updateRotation ( rotation ) {
		this.params.transform.rotation.x = rotation[ 0 ];
		this.params.transform.rotation.y = rotation[ 1 ];
		this.params.transform.rotation.z = rotation[ 2 ];
		this.params.transform.rotation.w = rotation[ 3 ];
	}

	#updateScale ( scale ) {
		this.params.transform.scale.x = scale[ 0 ];
		this.params.transform.scale.y = scale[ 1 ];
		this.params.transform.scale.z = scale[ 2 ];
	}

	#controlTransform ( transform ) {
		this.module.updateTransform( transform, true );
	}
}