// create userif (false) {	var newValues = {		name: "top3line",		password: "sphereT3st",		name_first: "Top",		name_last: "3Line",		flag_active: true	};		var record = ds.User.createEntity();	record.name = newValues.name;	record.password = directory.computeHA1(newValues.name, newValues.password);	record.name_first = newValues.name_first;	record.name_last = newValues.name_last;	record.flag_active = newValues.flag_active;	record.save();}// change user nameif (false) {	var record = ds.User.query("name = :1","thomas.hertzler@stratotainment.com").first();		record.name = "vintage64";	record.password = directory.computeHA1("vintage64", "tango1");	record.save();}// delete userif (false) {	var record = ds.User.query("name = :1","DataNinja").first();	record.remove();}ds.User.all()