import SpotLightModule from '../SyncModules/SpotLightModule.js';
import PointLightModule from '../SyncModules/PointLightModule.js';
import PointLightGUI from './PointLightGUI.js';

export default class SpotLightGUI extends PointLightGUI {
	static type = SpotLightModule.type;

	constructor ( module, parent ) {
		super( module, parent );

		this.params.angle = module.angle;
		this.params.penumbra = module.penumbra;

		// const pointFolder = this.folder.addFolder( "Point" );
		const penumbraParam = this.lightFolder.add( this.params, "penumbra", 0, 1, 0.01 ).listen( );
		const angleParam = this.lightFolder.add( this.params, "angle", 0, Math.PI / 2, 0.01 ).listen( );

		penumbraParam.onChange( ( ) => { this.#controlDecay( this.params.penumbra ) } );
		angleParam.onChange( ( ) => { this.#controlDistance( this.params.angle ) } );
	}
	
	setCallbacks ( ) {
		super.setCallbacks( );

		this.module.setOnChange( this.module.commands.setAngle,
			( angle ) => this.#setAngle( angle ) 
		);

		this.module.setOnChange( this.module.commands.setPenumbra,
			( penumbra ) => this.#setPenumbra( penumbra ) 
		);
	}

	#setPenumbra ( penumbra ) {
		this.params.penumbra = penumbra;
	}

	#setAngle ( angle ) {
		this.params.angle = angle;
	}

	#controlDecay ( penumbra ) {
		this.module.setPenumbra( penumbra, true );
	}

	#controlDistance ( angle ) {
		this.module.setAngle( angle, true );
	}
}