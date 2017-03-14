model.AlertContact.events.remove = function(event)
{
	var collectionSAC = this.ServerAlertContactCollection;
	console.log( "model.AlertContact.events.remove before:\n" + collectionSAC );
	collectionSAC.remove();
	console.log( "model.AlertContact.events.remove after:\n" + collectionSAC );
};
