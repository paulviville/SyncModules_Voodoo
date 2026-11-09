import AmbientLightModule from '../SyncModules/AmbientLightModule.js';
import LightGUI from './LightGUI.js';

export default class AmbientLightGUI extends LightGUI {
	static type = AmbientLightModule.type;

	constructor ( module, parent ) {
		super( module, parent );
	}
}