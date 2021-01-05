//var navSets = ds.NavigationSet.all();

//for (var i = 0; i < navSets.length; i++) {
//	var navSet = navSets[i];
//
//	for (var j = 0; j < navSet.NavigationItemCollection.length; j++) {
//		var navItem = navSet.NavigationItemCollection[j];
//
//		if (!navItem.identifier) {
//			navItem.identifier = navSet.identifier;
//			navItem.save();
//		}
//	}
//}

var bob = new Array();
for (var i in application) {
	bob.push(i);
}
bob.sort()
bob;
FileSystemSync('SOLUTION').path
//application.solutionFolder