
const WormId = 206005;206006;206007;206008;206009;

module.exports = function WormDeleter(mod) {
	const command = mod.command;
	let enabled = true;
	let myGameId = 0n;
		
    command.add('wd', {
        $none() {
            enabled = !enabled;
			command.message(`Worm-Deleter is now: ${enabled ? "enabled" : "disabled"}.`);
		}
	});
	
	mod.hook('S_LOGIN', 12, (event) => {
		myGameId = event.gameId;
	})
	
	mod.hook('S_INVEN', mod.majorPatchVersion >= 80 ? 18 : 17, (event) => {
		if (!enabled) return;
		
		for (var i = 0; i < event.items.length; i++)
		{
			if (event.items[i].id === WormId && event.items[i].amount > 250)
			{
				mod.toServer('C_DEL_ITEM', 2, {
					gameId: myGameId,
					slot: (event.items[i].slot - 40),
					amount: 200
				});
				break;
			}
		}
	});
}