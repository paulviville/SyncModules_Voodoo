import GUICore from './GUICore.js';
import LineModule from '../SyncModules/LineModule.js';

export default class LineGUI extends GUICore {
	static type = LineModule.type;
	
	constructor ( module, parent ) {
		super( module, parent );

		this.params.origin = { x: 0, y: 0, z: 0 };
		this.params.end = { x: 0, y: 0, z: 0 };

		const originFolder = this.folder.addFolder( "origin" );
		const endFolder = this.folder.addFolder( "end" );

		originFolder.add( this.params.origin, 'x', -10, 10, 0.01 ).listen( );
		originFolder.add( this.params.origin, 'y', -10, 10, 0.01 ).listen( );
		originFolder.add( this.params.origin, 'z', -10, 10, 0.01 ).listen( );
		originFolder.onChange( ( ) => {
			this.#controlLine( { origin: [
				this.params.origin.x,
				this.params.origin.y,
				this.params.origin.z,
			] } );
		} );

		endFolder.add( this.params.end, 'x', -10, 10, 0.01 ).listen( );
		endFolder.add( this.params.end, 'y', -10, 10, 0.01 ).listen( );
		endFolder.add( this.params.end, 'z', -10, 10, 0.01 ).listen( );
		endFolder.onChange( ( ) => {
			this.#controlLine( { end: [
				this.params.end.x,
				this.params.end.y,
				this.params.end.z,
			] } );
		} );
	}

	setCallbacks ( ) {
		this.module.setOnChange( this.module.commands.updateLine,
			( line ) => this.#updateLine( line ) 
		);
	}

	#updateLine ( line ) {
		const { origin, end } = line;
		if ( origin ) 
			[ this.params.origin.x, this.params.origin.y, this.params.origin.z ] = origin
		if ( end ) 
			[ this.params.end.x, this.params.end.y, this.params.end.z ] = end
	}

	#controlLine ( line ) {
		this.module.updateLine( line, true );
	}
}