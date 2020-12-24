//var AC = require(FileSystemSync("PROJECT").path + "Kabootit/API/ac.js");




























//var x = AC.organization.getAll();

//var info = {
//	// get everything that's enabled
//	everything : AC.navigation.getSet(),

//	// get one project
//	onething: AC.navigation.getSet('Finance')

//	// get only what is allowed when not logged in
////	notLoggedIn: AC.navigation.getSet(null,true)
//}

//info;

////var query = 'flag_active = true';
//////query += " and name = :1";
////
////ds.NavigationSet.query(query,"Finance").orderBy("order_by asc")


var ID = '54958BD06F984394BF813781258830C0';

ds.Group.query('User.ID = :1',ID);
ds.NavigationSet.query('flag_active = true and GroupNavigationSet.Group.User.ID = :2','Meta',ID)
//ds.NavigationSet.all()

//var navSets = ds.NavigationSet.query(query, name).orderBy("order_by asc");