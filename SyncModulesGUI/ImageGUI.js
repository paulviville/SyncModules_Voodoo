import TransformGUI from "./TransformGUI.js";
import ImageModule from "../SyncModules/ImageModule.js";

export default class ImageGUI extends TransformGUI {
	static type = ImageModule.type;
	
	constructor ( module, parent ) {
		console.log( "imagegui")
		super( module, parent );

		this.params.image = "";

		const imageFolder = this.folder.addFolder( "Image" );
		imageFolder.add( { import: ( ) => {
			/// move that crap to a utils later
			const input = document.createElement("input");
			input.type = "file";
			input.accept = ".png,.jpg";

			input.onchange = ( ) => {
				const file = input.files[ 0 ];
				if ( file === undefined )
					return;
				const reader = new FileReader( );
				reader.onload = ( ) => {
					const { result: image } = reader;
					this.#controlImage( image );
				};
		reader.readAsDataURL( file );
			};
			input.click();
		} }, "import" );
	}

	setCallbacks ( ) {
		super.setCallbacks( );

		this.module.setOnChange( this.module.commands.setImage,
			( { image } ) => this.#setImage( image ) 
		);
	}

	#setImage ( image ) {

	}

	#controlImage ( image ) {
		this.module.setImage( image, true );
	}
}