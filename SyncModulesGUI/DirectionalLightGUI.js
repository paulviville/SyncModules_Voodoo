import DirectionalLightModule from '../SyncModules/DirectionalLightModule.js';
import LightGUI from './LightGUI.js';

export default class DirectionalLightGUI extends LightGUI {
	static type = DirectionalLightModule.type;

	constructor ( module, parent ) {
		super( module, parent );

		this.params.target = { x: 0, y: 0, z: 0 };

		this.targetFolder = this.lightFolder.addFolder( "Target" );
		this.targetFolder.add( this.params.target, 'x', -10, 10, 0.01 ).listen( );
		this.targetFolder.add( this.params.target, 'y', -10, 10, 0.01 ).listen( );
		this.targetFolder.add( this.params.target, 'z', -10, 10, 0.01 ).listen( );
		// .onChange( this.#controlValue.bind( this ) )
		// .listen( );
		this.targetFolder.onChange( ( ) => {
			this.#controlTarget( [
				this.params.target.x,
				this.params.target.y,
				this.params.target.z,
			] );
		} );
	}

	#setTarget ( target ) {
		this.params.target.x = target[ 0 ];
		this.params.target.y = target[ 1 ];
		this.params.target.z = target[ 2 ];
	}

	#controlTarget ( target ) {
		this.module.setTarget( target, true );
	}
}