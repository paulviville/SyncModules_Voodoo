import LightModule from '../SyncModules/LightModule.js';
import TransformGUI from './TransformGUI.js';

export default class LightGUI extends TransformGUI {
	static type = LightModule.type;

	lightFolder;

	constructor ( module, parent ) {
		super( module, parent );

		this.params.intensity = module.intensity;
		this.params.color = module.color.slice( 0, 3 );

		this.lightFolder = this.folder.addFolder( "Light" );
		const colorParam = this.lightFolder.addColor( this.params, "color" ).listen( );
		const intensityParam = this.lightFolder.add( this.params, "intensity", 0, 100, 0.01 ).listen( );

		colorParam.onChange( ( ) => { this.#controlColor( this.params.color ) } );
		intensityParam.onChange( ( ) => { this.#controlIntensity( this.params.intensity ) } );
	}
	
	setCallbacks ( ) {
		super.setCallbacks( );

		this.module.setOnChange( this.module.commands.setColor,
			( color ) => this.#setColor( color ) 
		);

		this.module.setOnChange( this.module.commands.setIntensity,
			( intensity ) => this.#setIntensity( intensity ) 
		);
	}

	#setIntensity ( intensity ) {
		this.params.intensity = intensity;
	}

	#setColor ( color ) {
		this.params.color.forEach( ( _, i ) => this.params.color[ i ] = color[ i ] || 0 );
	}

	#controlIntensity ( intensity ) {
		this.module.setIntensity( intensity, true );
	}

	#controlColor ( color ) {
		this.module.setColor( [ ...color ], true );
	}
}