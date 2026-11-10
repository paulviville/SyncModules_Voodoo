import * as THREE from './three/three.module.js';
import { OrbitControls } from './three/controls/OrbitControls.js';
import SceneController from "./SceneController.js";
import ClientManager from "./ClientManager.js";

import GUI from './three/libs/lil-gui.module.min.js';
import GUICore from './SyncModulesGUI/GUICore.js';
import GUIRegistry from './SyncModulesGUI/GUIRegistry.js';
import GUIController from './GUIController.js';
import ImageImportController from './SyncModulesViews/Controllers/ImageImportController.js';

import { DRACOLoader } from './three/loaders/DRACOLoader.js';
import { GLTFLoader } from './three/loaders/GLTFLoader.js';
import GLTFImportController from './SyncModulesViews/Controllers/GLTFImportController.js';


const app = document.getElementById('app');
const btnFs = document.getElementById('btn-fullscreen');
 
function toggleSidebar() { app.classList.toggle('sidebar-hidden'); }   // canvas resizes via ResizeObserver
const reqFs = app.requestFullscreen || app.webkitRequestFullscreen;           // iPadOS / older Safari
const exitFs = document.exitFullscreen || document.webkitExitFullscreen;
const fsElement = () => document.fullscreenElement || document.webkitFullscreenElement;
 
function syncFsButton() {
  btnFs.textContent = (fsElement() || app.classList.contains('pseudo-fs')) ? '✕' : '⛶';
  requestAnimationFrame(resize);
}
function toggleFullscreen() {
  if (!reqFs) {                                   // iPhone Safari: no Fullscreen API, use CSS fallback
    app.classList.toggle('pseudo-fs');
    syncFsButton();
  } else if (fsElement()) {
    exitFs.call(document);
  } else {
    Promise.resolve(reqFs.call(app)).catch(err => console.warn(err));
  }
}
document.getElementById('btn-sidebar').onclick = toggleSidebar;
btnFs.onclick = toggleFullscreen;
document.addEventListener('fullscreenchange', syncFsButton);
document.addEventListener('webkitfullscreenchange', syncFsButton);

const viewport = document.getElementById('viewport');
const sidebar = document.getElementById('sidebar');

const clientManager = new ClientManager( );


// --- Resize canvas to its container ---
function resize() {
  const { clientWidth: w, clientHeight: h } = viewport;
  clientManager.sceneController.renderer.setSize(w, h, false);
  clientManager.sceneController.camera.aspect = w / h;
  clientManager.sceneController.camera.updateProjectionMatrix();
}
new ResizeObserver(resize).observe(viewport);
resize();





const guiController = new GUIController( );
guiController.modulesRegistry = clientManager.modulesRegistry;



guiController.setNetworkCallbacks(
	( url, port ) => {
		clientManager.connect( url, port );
	},
	( ) => {
		clientManager.disconnect( );
	}
)

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath( './three/draco/gltf/' );
const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader( dracoLoader );



const gltfImportController = new GLTFImportController( );

const urlPre = "./vodou/";
const urls = [ "Crane", "MamieWataDouble", "Boccio001" ];
const urlPost = ".glb";

// const importers = [

// ]
let gltfModule = clientManager.addModule( "GLTFModule", true, true, true );;

const importers = urls.map( url => {
	const importer = new  GLTFImportController( );
	importer.setModule( gltfModule );
	importer.preload( urlPre + url + urlPost ) ;
	return importer;
} );

// const [ crane ]  = await Promise.all([gltfLoader.loadAsync('./vodou/Crane.glb')]);
// const [ mamieWata ]  = await Promise.all([gltfLoader.loadAsync('./vodou/MamieWataDouble.glb')]);


const triggerModule = clientManager.addModule( "TriggerModule", true, true, true );
triggerModule.setOnChange( triggerModule.commands.trigger, ( ) => {
	// const targetUrl = urls.shift( );
	console.log( "triggered", urls[ 0 ] );
	// urls.push( targetUrl );

	// if( gltfModule ) {
	// 	clientManager.removeModule( gltfModule.UUID, true );
	// }
	// gltfModule = clientManager.addModule( "GLTFModule", true, true, true );
	// gltfImportController.setModule( gltfModule );
	// gltfImportController.loadFile( urlPre + urls[ 0 ] + urlPost );
	importers[ 0 ].postload( );
	importers.push( importers.shift( ) );
	urls.push( urls.shift( ) );
} );






// clientManager.connect( "wss://icos.univ-reims.fr", "443" );
window.addEventListener("beforeunload", (event) => { clientManager.beforeUnload( event ) } );
