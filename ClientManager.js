import ClientNetwork from "./ClientNetwork.js";
import ModulesRegistry from "./SyncModules/Core/ModulesRegistry.js";
import ViewsRegistry from "./SyncModulesViews/ViewsRegistry.js";
import SceneController from "./SceneController.js";
// import PrimitiveModule from "./SyncModules/PrimitiveModule.js";
import uuid from "./uuid.js";

const SCOPES = {
	SYSTEM: "SYSTEM",
	INSTANCE: "INSTANCE",
	MODULE: "MODULE",
};
const INSTANCE_COMMANDS = {
	INSTANCE_LIST: "INSTANCE_LIST",
	INSTANCE_ADD: "INSTANCE_ADD",
	INSTANCE_REMOVE: "INSTANCE_REMOVE",
	INSTANCE_JOIN: "INSTANCE_JOIN",
	INSTANCE_LEAVE: "INSTANCE_LEAVE",
	INSTANCE_CLEAR: "INSTANCE_CLEAR",
	OWNERSHIP: "OWNERSHIP", /// declare the ownership of a module
}

export default class ClientManager {
	#UUID = uuid();
	#clientNetwork = new ClientNetwork( this.#UUID );
	#modulesRegistry;
	#viewsRegistry;
	#sceneController;
	#modulesOwned = new Set( ); /// UUIDs
	#cameraModule;
	#sendFn;

	constructor ( ) {
		
		this.#sendFn = this.#clientNetwork.send;
		
		const viewport = document.getElementById('viewport');
		this.#sceneController = new SceneController( viewport );
		this.#modulesRegistry = new ModulesRegistry ( 
			( payload ) => {
				const message = this.#createMessage( SCOPES.MODULE, payload );
				this.#sendFn( message );
		} );
		this.#viewsRegistry = new ViewsRegistry( this.#modulesRegistry );
		this.#sceneController.scene.add( this.#viewsRegistry );
		this.#sceneController.startRender( );
				
		// const primitiveModule = this.addModule("PrimitiveModule", false, true, true);
		// primitiveModule.updatePrimitive("Box", false);
		// primitiveModule.updateTransform( {
		// 	translation: [(1 - 2*Math.random()), (1 - 2*Math.random()), (1 - 2*Math.random()) ],
		// 	scale: [ 0.5, 0.5, 0.5 ]
		// });
		// this.#sceneController.addPrimitive( primitiveModule )
		console.log( this )
		const cameraModule = this.addModule("CameraModule", true, true, false);
		this.#sceneController.controls.setModule( cameraModule );
		this.#cameraModule = cameraModule;
		console.log(this.#cameraModule)

		// this.#sceneController.transformController.setModule( primitiveModule );

		this.#modulesRegistry.setOnChange( this.#modulesRegistry.commands.addModule, ( moduleData ) => {
			const { type, UUID } = moduleData;
			console.log( type, UUID )
			if ( type != "PrimitiveModule" && type != "GLTFModule" )
				return;

			// const module = this.#modulesRegistry.getModule( UUID );
			// if ( type == "PrimitiveModule" ) 
			// 	this.#sceneController.addPrimitive( module );
			// if ( type == "GLTFModule" ) {
			// 	this.#sceneController.addObject( module );
			// }
		} );
		this.#modulesRegistry.setOnChange( this.#modulesRegistry.commands.removeModule, ( moduleData ) => {
			const { type, UUID } = moduleData;
			if ( type != "PrimitiveModule" && type != "GLTFModule" )
				return;


			const module = this.#modulesRegistry.getModule( UUID );
			
			if ( type == "PrimitiveModule" ) 
				this.#sceneController.removePrimitive( module );
			if ( type == "GLTFModule" ) {
				this.#sceneController.removeObject( module );
			}

		} );

		this.#clientNetwork.setCallbacks( {
			onOpen: ( ) => {
				this.#sendFn( JSON.stringify( { UUID: this.#UUID } ) );

				/// debug
				const registryState = this.#modulesRegistry.outputState( );
				console.log(registryState)
				const stateBuffer = this.#bufferizeRegistryState( );


				const message = this.#createMessage(SCOPES.SYSTEM, {
					command: INSTANCE_COMMANDS.INSTANCE_JOIN,
					data: {
						instanceUUID: "00000000-0000-0000-0000-000000000000",
						userUUID: this.#UUID,
					},
				});
				this.#sendFn( message );


				for ( const state of stateBuffer ) {
					const message = this.#createMessage( SCOPES.MODULE, state );
					this.#sendFn( message );
				}






				// /
			},

			onMessage: ( message ) => {
				const messageData = JSON.parse( message );
				// console.log(messageData)
				const { scope, senderUUID, payload } = messageData;
				/// REPLACE WITH ROUTING FUNCTIONS
				switch ( scope ) {
					case SCOPES.SYSTEM:
						console.log( payload );
						break;
					case SCOPES.MODULE:
						// const module = this.#moduleRegistry.getModule( moduleUUID );

						// this.#modulesRegistry.input( payload );
						this.#onModuleMessage( payload );
						break;
				}
			},
		} );

		this.#sceneController.setCallbacks( {
			addModule: ( type, visible = true, own = true ) => {
				return this.addModule( type, true, own, visible);
			},
			getView: ( module ) => {
				// console.log( this.#viewsRegistry )
				// console.log( module )
				// console.log( this.#viewsRegistry.getView( module.UUID ) )
				return this.#viewsRegistry.getView( module.UUID );
			},
			getModule: ( moduleUUID ) => {
				console.log( this.#modulesRegistry, moduleUUID )
				return this.#modulesRegistry.getModule( moduleUUID );
			},
			removeModule: ( moduleUUID ) => {
				this.removeModule ( moduleUUID, true );
			},
			getCameraModule: ( ) => {
				return this.#cameraModule;
			}
		} );
	}

	connect ( url = "ws://localhost", port = "3000" ) {
		this.#clientNetwork.connect( url, port );
	}

	disconnect ( ) {
		this.#clientNetwork.disconnect( );
	}

	/// Debug
	get clientNetwork ( ) {
		return this.#clientNetwork;
	}

	get modulesRegistry ( ) {
		return this.#modulesRegistry;
	}

	get viewsRegistry ( ) {
		return this.#viewsRegistry;
	}

	get UUID ( ) {
		return this.#UUID;
	}

	#createMessage ( scope, payload ) {
		const messageData = {
			scope,
			senderUUID: this.#UUID,
			payload,
		};

		return JSON.stringify( messageData );
	}

	#onModuleMessage ( payload ) {
		const { moduleUUID } = payload;
		const module = this.#modulesRegistry.getModule( moduleUUID );
		module?.input( payload );
	}

	addModule ( type, sync = false, own = false, view = true ) {
		const UUID = uuid();
		const module = this.#modulesRegistry.addModule( type, UUID, sync );
		
		if ( !view ) {
			const moduleView = this.#viewsRegistry.getView( UUID );
			moduleView.visible = false;
		}

		if ( own ) {
			this.#modulesOwned.add( UUID );
		}

		return module;
	}

	removeModule ( moduleUUID, sync = false ) {
		this.#modulesRegistry.removeModule( moduleUUID, sync );

		if ( this.#modulesOwned.has( moduleUUID ) ) {
			this.#modulesOwned.delete( moduleUUID );
		}
	}

	beforeUnload ( event ) {
		this.#modulesOwned.forEach( moduleUUID => this.removeModule( moduleUUID, true ) );
	}

	#bufferizeRegistryState ( ) {
		const stateBuffer = [];
		for ( const [ UUID, module ] of this.#modulesRegistry.modules ) {
			stateBuffer.push( module.outputState( ) )
		}
		return stateBuffer;
	}

	get sceneController ( ) {
		return this.#sceneController;
	}

	get cameraModule ( ) {
		console.log("client manager camera module", this.#cameraModule)
		return this.#cameraModule;
	}

	/// debug
	clearInstance ( ) {
		const message = this.#createMessage(SCOPES.SYSTEM, {
			command: INSTANCE_COMMANDS.INSTANCE_CLEAR,
			data: {
				instanceUUID: "00000000-0000-0000-0000-000000000000",
			},
		});
		
		this.#sendFn( message );
	}
}