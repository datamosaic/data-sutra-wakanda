// get a reference to the export folder
var myFolder = Folder("/Volumes/Ice Man/stratos/navigation");

// if the folder actually exists
if (!myFolder.exists) {
	myFolder.create();
}

// export
ds.exportAsJSON( myFolder ) ;