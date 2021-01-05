
//// path to ac api from another project
//var path = (FileSystemSync("PROJECT").path.splitSecurity,path.length-2).join('/')) + '/AccessControl' + '/API/AC.js'


//path

/// NEW WAY
//var AC = require(FileSystemSync("PROJECT").path + 'API/AC.js');
//var results = AC.external('FACTORY.test.testAction');
////var results = FACTORY.external('AC.organization.getAll',[1,'string',{fish: 'bowl'}]);
//results



//ds.NavigationSet.all()[1].NavigationItemCollection.orderBy("order_by asc");

//ds.Group.all()
ds.User.all()
//var david = ds.User({ID:'C4772173415A4EFCAE4DA99CE27CEAE5'})
//david.Group = '5756CFC6CF9A4B40A7A86EDA1ECFAC7F'
//david.save();

//var ID = '';
//if (ID && pass) {
//		var record = ds.User.query("ID = :1", ID).first();
//
//		if (record) {
//			record.password = directory.computeHA1(record.name, pass);
//			record.save();
//
//			return true;
//		}
//
//		return {
//			'error': 404,
//			'errorMessage': 'User not found'
//		};
//	}