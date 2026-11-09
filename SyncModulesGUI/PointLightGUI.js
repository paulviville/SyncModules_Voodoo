import PointLightModule from '../SyncModules/PointLightModule.js';
import LightGUI from './LightGUI.js';

export default class PointLightGUI extends LightGUI {
	static type = PointLightModule.type;

	constructor ( module, parent ) {
		super( module, parent );

		this.params.distance = module.distance;
		this.params.decay = module.decay;

		// const pointFolder = this.folder.addFolder( "Point" );
		const decayParam = this.lightFolder.add( this.params, "decay", 0, 100, 0.01 ).listen( );
		const distanceParam = this.lightFolder.add( this.params, "distance", 0, 100, 0.01 ).listen( );

		decayParam.onChange( ( ) => { this.#controlDecay( this.params.decay ) } );
		distanceParam.onChange( ( ) => { this.#controlDistance( this.params.distance ) } );
	}
	
	setCallbacks ( ) {
		super.setCallbacks( );

		this.module.setOnChange( this.module.commands.setDistance,
			( distance ) => this.#setDistance( distance ) 
		);

		this.module.setOnChange( this.module.commands.setDecay,
			( decay ) => this.#setDecay( decay ) 
		);
	}

	#setDecay ( decay ) {
		this.params.decay = decay;
	}

	#setDistance ( distance ) {
		this.params.distance = distance;
	}

	#controlDecay ( decay ) {
		this.module.setDecay( decay, true );
	}

	#controlDistance ( distance ) {
		this.module.setDistance( distance, true );
	}
}