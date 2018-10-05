onNet('teleportManager:AddGroup', (group) => { //
	Config.TelportLoc.push(group);
	console.log("Added new group. Count:", Config.TelportLoc.length);
});

onNet('teleportManager:ChangeGroup', (name, loc) => { //
	Config.TelportLoc[Config.getTeleportGroupIndex(name)].Loc = loc;
	console.log("Changeed group. Count:", Config.TelportLoc.length);
});

onNet('teleportManager:RemoveGroup', (name) => { //
	Config.TelportLoc.splice(Config.getTeleportGroupIndex(name), 1);
	console.log("Removed group. Count:", Config.TelportLoc.length);
});

onNet('teleportManager:updateGroups', (locs) => { //
	Config.TelportLoc = locs;
	console.log("Got groups. Count:", Config.TelportLoc.length);
});

emitNet('teleportManager:requestGroups', GetPlayerPed(-1));

function HelpText(text) {
    SetTextComponentFormat("STRING");
    AddTextComponentString(text);
    DisplayHelpTextFromStringLabel(0, 0, 0, -1);
}

function drawMarkerDis(playerCoord, locCord) {
	if (GetDistanceBetweenCoords(playerCoord[0], playerCoord[1], playerCoord[2], locCord[0], locCord[1], locCord[2], false) < Config.MarkerInfo.DrawDistance) {
		DrawMarker(Config.MarkerInfo.MarkerType, locCord[0], locCord[1], locCord[2]-0.908, 0.0, 0.0, 0.0, 0, 0.0, 0.0, Config.MarkerInfo.MarkerSize.x, Config.MarkerInfo.MarkerSize.y, Config.MarkerInfo.MarkerSize.z - 2.0, Config.MarkerInfo.MarkerColor.r, Config.MarkerInfo.MarkerColor.g, Config.MarkerInfo.MarkerColor.b, 100, false, true, 2, false, false, false, false);
	}
}

function doControlDis(playerCoord, fromC, toC, str) {
	if (GetDistanceBetweenCoords(playerCoord[0], playerCoord[1], playerCoord[2], fromC[0], fromC[1], fromC[2], false) < Config.MarkerInfo.MarkerSize.x / 2) {
		HelpText("Press ~INPUT_PICKUP~ To " + str);
		if (IsControlJustReleased(0, 38)) { // e
			SetEntityCoords(GetPlayerPed(-1), toC[0], toC[1], toC[2])
		}
	}
}

setTick(() => {
	var playerCoord = GetEntityCoords(GetPlayerPed(-1), true);
	var tempArr = Config.TelportLoc.slice(0);
	
	for (var i = 0; i < tempArr.length; i++) {		
		var teleportGroup = tempArr[i];
		for (var t = 0; t < teleportGroup.Loc.length; t++) {
			var teleportObject = teleportGroup.Loc[t];
			
			drawMarkerDis(playerCoord, teleportObject.startPos);
			doControlDis(playerCoord, teleportObject.startPos, teleportObject.endPos, "go to " + teleportObject.Name);
			
			if (!teleportObject.oneWay) { 
				drawMarkerDis(playerCoord, teleportObject.endPos);
				doControlDis(playerCoord, teleportObject.endPos, teleportObject.startPos, "go Back");
			}
		}
	}
});