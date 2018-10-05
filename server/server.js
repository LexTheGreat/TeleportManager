Config.emitSync = [];
setTimeout(function(){
	Config.watcher = Config.chokidar.watch(Config.telportDir, {persistent: true});
	Config.watcher.on('add', function(path) {
		if (path.endsWith(".json")) {
			try {
				var objectGroup = JSON.parse(fs.readFileSync(path));
				var fileName = Config.path.parse(path).name;
				
				var pushObject = {
					Group: fileName,
					Loc: objectGroup
				}
				
				Config.TelportLoc.push(pushObject);
				
				console.log('Telport Group \'', fileName, '\' was added. Total:', Config.TelportLoc.length);
				Config.emitSync.push(['teleportManager:AddGroup', -1, pushObject]);
			} catch(e){
				console.log(e);
			}
		} else {
			Config.watcher.unwatch(path);
		}
	}).on('change', function(path) {
		if (path.endsWith(".json")) {
			try {		
				var objectGroup = JSON.parse(fs.readFileSync(path));
				var fileName = Config.path.parse(path).name;
				
				Config.TelportLoc[Config.getTeleportGroupIndex(fileName)].Loc = objectGroup;
				
				console.log('Telport Group \'', fileName, '\' was updated. Total:', Config.TelportLoc.length);
				Config.emitSync.push(['teleportManager:ChangeGroup', -1, fileName, objectGroup]);
			} catch(e){
				console.log(e);
			}
		} else {
			Config.watcher.unwatch(path);
		}
	}).on('unlink', function(path) {
		if (path.endsWith(".json")) {
			var fileName = Config.path.parse(path).name;
			
			Config.TelportLoc.splice(Config.getTeleportGroupIndex(fileName), 1);
			
			console.log('Telport Group \'', fileName, '\' was removed. Total:', Config.TelportLoc.length);
			Config.emitSync.push(['teleportManager:RemoveGroup', -1, fileName]);
		}
	}).on('error', function(error) {
		console.error('Error happened', error);
	});
}, 2000);

onNet('teleportManager:requestGroups', () => {
	Config.emitSync.push(['teleportManager:updateGroups', source, Config.TelportLoc]);
	console.log("Sending Teleport Groups to", source);
});

onNet('onResourceStop', (resourceName) => { // Prevents crash, not all the time :(
	if (resourceName == "TeleportManager") {
		Config.watcher.close();
		Config.watcher = null;
		console.log("TeleportManager closed watcher.");
	}
});

setTick(() => {
	if (Config.emitSync.length != 0) {
		var args = Config.emitSync.shift()
		emitNet.apply(this, args);
	}
});