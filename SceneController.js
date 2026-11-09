import * as THREE from './three/three.module.js';
import { OrbitControls } from './three/controls/OrbitControls.js';
import CameraController from './SyncModulesViews/Controllers/CameraController.js';
import TransformController from './SyncModulesViews/Controllers/TransformController.js';
import { TransformControls } from "controls/TransformControls.js";
import SceneGraphController from './SyncModulesViews/Controllers/SceneGraphController.js';

// import { XRControllerModelFactory } from './three/webxr/XRControllerModelFactory.js';
// import XRInputListener from './XRInputListener.js';
import GLTFImportController from './SyncModulesViews/Controllers/GLTFImportController.js';


export default class SceneController {
	#renderer;
	#scene;
	#camera;
	#cameraController;
	#transformController;
	#orbitControls;
	#sceneGraphController;
	#onRender;

	#controls;

	#callbacks;
	#primtives = new Set( );
	#gltfs = new Set( );

	#selectedPrimitive;
	#selectedGLTF;
	#activeController;
	#lineModule;

	#raycaster = new THREE.Raycaster();

	constructor ( container ) {
		console.log( `SceneController - constructor` );
		// console.log( leftModel )

		this.#renderer = new THREE.WebGLRenderer({antialias: true});
		this.#renderer.autoClear = false;
		this.#renderer.setPixelRatio( window.devicePixelRatio );
		this.#renderer.setSize( container.innerWidth, container.innerHeight );
		this.#renderer.xr.enabled = true;
		container.appendChild( this.#renderer.domElement );

		this.#scene = new THREE.Scene( );
        this.#scene.background = new THREE.Color(0xcccccc);
		this.#camera = new THREE.PerspectiveCamera( 50, container.innerWidth / container.innerHeight, 0.1, 100 );
		this.#camera.position.set( -2, 3, -3 );
		this.#cameraController = new CameraController( this.#camera, this.#renderer.domElement );
		this.#transformController = new TransformController( this.#camera, this.#renderer.domElement );
		this.#scene.add( this.#transformController.getHelper( ) );
		this.#scene.add( this.#transformController.object3D );
		this.#transformController.addEventListener( 'dragging-changed', event => this.#cameraController.enabled = !event.value );
		
		this.#sceneGraphController = new SceneGraphController( this.#camera, this.#renderer.domElement );
		this.#scene.add( this.#sceneGraphController.getHelper( ) );
		this.#scene.add( this.#sceneGraphController.object3D );
		this.#sceneGraphController.addEventListener( 'dragging-changed', event => this.#cameraController.enabled = !event.value );

		// this.#orbitControls = new OrbitControls( this.#camera, this.#renderer.domElement);
		// console.log(this.#orbitControls)
		const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
		this.#scene.add(ambientLight);
		const pointLight = new THREE.PointLight( 0xffffff, 120);
		pointLight.position.set(-2, 3, -4);
		this.#scene.add(pointLight);
		this.#addDebug( );



		window.onresize = this.#onWindowResize.bind( this );
	}

	setCallbacks ( callbacks ) {
		this.#callbacks = callbacks;
	}


	#addDebug ( ) {
		const axesHelper = new THREE.AxesHelper( );
		this.#scene.add( axesHelper );
		const gridHelper = new THREE.GridHelper( );
		this.#scene.add( gridHelper );


	}

	#onWindowResize ( ) {
		// this.#camera.aspect = window.innerWidth / window.innerHeight;
		// this.#camera.updateProjectionMatrix();

		// this.#renderer.setSize(window.innerWidth, window.innerHeight);
	}

	#animate ( time, frame ) {
		this.#renderer.render(this.#scene, this.#camera);
		this.#onRender?.( time, frame );
	}

	startRender ( ) {
		this.#renderer.setAnimationLoop( this.#animate.bind(this) );
	}

	stopRender ( ) {
		this.#renderer.setAnimationLoop(null);
	}

	get camera ( ) {
		return this.#camera;
	}

	get controls ( ) {
		return this.#cameraController;
	}

	get transformController ( ) {
		return this.#transformController;
	}

	get sceneGraphController ( ) {
		return this.#sceneGraphController;
	}

	get scene ( ) {
		return this.#scene;
	}

	get renderer ( ) {
		return this.#renderer;
	}

	set onRender ( callback ) {
		this.#onRender = callback;
	}


	addPrimitive ( primitiveModule ) {
		this.#primtives.add( primitiveModule );
		this.transformController.setModule( primitiveModule );
	}

	removePrimitive ( primitiveModule ) {
		this.#primtives.delete( primitiveModule );
	}

	addObject ( gltfModule ) {
		console.log( `adding gltf module ${ gltfModule.UUID }`);
		this.#gltfs.add( gltfModule );
	}
	
	removeObject ( gltfModule ) {
		console.log( `removing gltf module ${ gltfModule.UUID }`);
		this.#gltfs.delete( gltfModule );
	}


	#raycast ( controller ) {
		const primitiveViews = [ ...this.#primtives].map( primitiveModule => {
			return this.#callbacks?.getView( primitiveModule );
		} );

		const gltfViews = [ ...this.#gltfs ].flatMap( gltfModule => {
			if ( gltfModule.lock ) 
				return [];
			return [ this.#callbacks?.getView( gltfModule ) ];
		} );

		this.#raycaster.setFromXRController( controller );
		const intersections = this.#raycaster.intersectObjects( primitiveViews );
		
		if ( intersections.length == 0 ) {
			this.#selectedPrimitive = undefined;
			this.#transformController.setModule( undefined );
		}

		let hitModule = undefined;
		let dist = Infinity;
		for ( const hit of intersections ) {
			const { object } = hit;
			if ( object.type == "Mesh" ) {
				const module = object.module ?? object.parent.module;
				if ( module && module.type == "PrimitiveModule" ) {
					hitModule = module;
					dist = hit.distance;

					break;
				}
			}
		}
		
		const intersectionsGLTF = this.#raycaster.intersectObjects( gltfViews );

		for ( const hit of intersectionsGLTF ) {
			const { object } = hit;
			let parent = object.parent
			while ( parent.module?.type != "GLTFModule" && parent.type !== "Scene" ) {
				parent = parent.parent;
			}
			
			if ( parent.type == "Scene" ) {
				continue;
			}

			const module = parent.module;
			if ( hit.distance < dist ) {
				dist = hit.distance;
				hitModule = module;
			}
			break;
		}

		return { hitModule, dist };
	}
}


