

model.ServerAlertContact.myservername.onGet = function() {
	return this.Server !== null ? this.Server.name : "";
};
