var ConfigObject = function() {
	var self = this;
	
	this.path = require('path');
	this.resourceDir = self.path.join(process.cwd(), '/resources/TeleportManager');
	this.telportDir = self.path.join(self.resourceDir, '/teleports');
	this.chokidar = require('chokidar');
	this.fs = require("fs");
	
	this.TelportLoc = [
		
	];
	
	this.getTeleportGroupIndex = function(name) {
		for(var i = 0; i < self.TelportLoc.length; i++)
			if (self.TelportLoc[i].Group == name)
				return i;
	};
}

var Config = new ConfigObject();