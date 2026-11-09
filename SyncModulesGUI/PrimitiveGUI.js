import PrimitiveModule from '../SyncModules/PrimitiveModule.js';
import TransformGUI from './TransformGUI.js';

export default class PrimitiveGUI extends TransformGUI {
	static type = PrimitiveModule.type;

	constructor ( module, parent ) {
		super( module, parent );

		const primitiveTypes = Object.keys( module.primitiveTypes );

		this.params.primitive = module.primitive;
		const color = module.color;
		this.params.color = color.slice( 0, 3 );
		this.params.alpha = color[ 3 ];

		const primitiveFolder = this.folder.addFolder( "Primitive" );
		const primitiveParam = primitiveFolder.add( this.params, "primitive", primitiveTypes ).listen( );
		const colorParam = primitiveFolder.addColor( this.params, "color" ).listen( );
		const alphaParam = primitiveFolder.add( this.params, "alpha", 0, 1, 0.01 ).listen( );

		colorParam.onChange( ( ) => { this.#controlColor( this.params.color, this.params.alpha ) } );
		alphaParam.onChange( ( ) => { this.#controlColor( this.params.color, this.params.alpha ) } );
		primitiveParam.onChange( ( ) => this.#controlPrimitive( this.params.primitive ) );
	}
	
	setCallbacks ( ) {
		super.setCallbacks( );

		this.module.setOnChange( this.module.commands.updatePrimitive,
			( transform ) => this.#updatePrimitive( transform ) 
		);

		this.module.setOnChange( this.module.commands.updateColor,
			( color ) => this.#updateColor( color ) 
		);
	}

	#updatePrimitive ( primitive ) {
		this.params.primitive = primitive;
	}

	#updateColor ( color ) {
		this.params.color.forEach( ( _, i ) => this.params.color[ i ] = color[ i ] || 0 * 255 );
		this.params.alpha = color[ 3 ];
	}

	#controlPrimitive ( primitive ) {
		this.module.updatePrimitive( primitive, true );
	}

	#controlColor ( color, alpha ) {
		this.module.updateColor( [ ...color, alpha ], true );
	}
}