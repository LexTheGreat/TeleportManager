var ConfigObject = function() {
	var self = this;

	this.TelportLoc = [
		
	];
	
	this.MarkerInfo = {
		MarkerType: 1,
		DrawDistance: 100.0,
		MarkerSize: {x:1.5,y:1.5,z:1.0},
		BlipSprite:79,
		EnterExitDelay:0,
		EnterExitDelayMax:600,
		MarkerColor: {r : 0, g : 255, b : 0}
	}
	
	this.getTeleportGroupIndex = function(name) {
		for(var i = 0; i < self.TelportLoc.length; i++)
			if (self.TelportLoc[i].Group == name)
				return i;
	};
}

var Config = new ConfigObject();

