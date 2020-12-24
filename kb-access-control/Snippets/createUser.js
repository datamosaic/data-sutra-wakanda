// create user


































if (false) {
	var newValues = {
		name: "username",
		password: "userpass",
		name_first: "Test",
		name_last: "User",
		flag_active: true
	};

	var record = ds.User.createEntity();
	record.name = newValues.name;
	record.password = directory.computeHA1(newValues.name, newValues.password);
	record.name_first = newValues.name_first;
	record.name_last = newValues.name_last;
	record.flag_active = newValues.flag_active;
	record.save();
}

// change user name
if (false) {
	var record = ds.User.query("name = :1","username").first();

	record.name = "newuser";
	record.password = directory.computeHA1("newuser", "userpass");
	record.save();
}

// delete user
if (false) {
	var record = ds.User.query("name = :1","username").first();
	record.remove();
}

ds.User.all()