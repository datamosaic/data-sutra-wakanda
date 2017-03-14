var TIME = require("Utility/time.js");

model.ServerAlertEvent.events.init = function(event)
{
	this.rec_created = new Date();
};

model.ServerAlertEvent.rec_created_fmt.onGet = function()
{
	return TIME.dateTimeUTCToString( this.rec_created );
};
