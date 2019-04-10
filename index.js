module.exports = function WormDeleter(mod) {
	const WormId = [206005, 206006, 206007, 206008, 206009]
	const command = mod.command || mod.require.command;
	let gameId = 0n;
	
	if(mod.proxyAuthor !== 'caali'){
		const options = require('./module').options
		if(options){
			const settingsVersion = options.settingsVersion
			if(settingsVersion){
				mod.settings = require('./' + (options.settingsMigrator || 'module_settings_migrator.js'))(mod.settings._version, settingsVersion, mod.settings)
				mod.settings._version = settingsVersion
			}
		}
	}
	
    command.add('wd', {
        $none() {
            mod.settings.enabled = !mod.settings.enabled;
			command.message(`Worm-Deleter is now: ${mod.settings.enabled ? "enabled" : "disabled"}.`);
		},
		$default(y){
			y = parseInt(y);
			if(!y || isNaN(y) || y < 1) {
				command.message(`${y} is an invalid argument. Type something like: wd 10`);
			} else{
				mod.settings.X = y;
				command.message(`Deleting at ${mod.settings.X} Worms`);
				mod.saveSettings();
			}
    	}
	});
	
	mod.hook('S_LOGIN', 12, (event) => {
		gameId = event.gameId;
	});
	
	mod.hook('S_INVEN', 18, (event) => {
		if(!mod.settings.enabled) return;
		
		for (var i = 0; i < event.items.length; i++){
			if(WormId.includes(event.items[i].id) && event.items[i].amount >= mod.settings.X){
				mod.toServer('C_DEL_ITEM', 2, {
					gameId,
					slot: (event.items[i].slot - 40),
					amount: event.items[i].amount
				});
				break;
			}
		}
	});
}
