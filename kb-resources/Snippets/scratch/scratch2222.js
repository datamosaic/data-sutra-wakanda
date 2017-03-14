﻿//var solutionFile = File('/Data/Codex/Wakanda/Labels/Labels_Solution/Labels.waSolution');//// get sample file//var projectsGit = File(FileSystemSync('EXTENSIONS_USER').path + 'Kabootit/setup/gitmodules.txt');//var projectsWakanda = File(FileSystemSync('EXTENSIONS_USER').path + 'Kabootit/setup/solutionprojects.txt');//// shared code//var configPath = solutionFile.path.split('/');//configPath.pop();//var solutionName = configPath.pop();//configPath = configPath.join('/') + '/';//if (projectsGit.exists && projectsWakanda.exists) {//	// create .gitmodules file////	var gitmodules = File(configPath + '.gitmodules');////	var stream = new TextStream(gitmodules, "Overwrite");////	stream.rewind();////	stream.write(coreProjects.toString());////	stream.flush();////	stream.close();//	//	//	// modify solution file//	var solutionText = solutionFile.toString();//	//	var insertRegex = /<file path=/gi;//	var match = insertRegex.exec(solutionText);//	//	// insert new modules after all other projects//	if (match.index) {//		solutionText = solutionText.slice(0,match.index) + projectsWakanda + solutionText.slice(match.index);//		//		stream = new TextStream(solutionFile, "Overwrite");//		stream.rewind();//		stream.write(solutionText);//		stream.flush();//		stream.close();//	}//}/** * Copy tree and contents from one location to another * * @param {Folder} from The from * @param {Folder} to The to * @param {Function} [callback] Function to call on each file (skips folders) * @return {Folder} Newly created folder */function copyTree(from, to, callback) {	try {		function createFolder(path) {			var destFolder = Folder(path);			if (!destFolder.exists) {				destFolder.create();			}			return destFolder		}				function makeSureGetAllSubDirectories(item, iterator, parent) {			var relativePath = parent.path.substr(from.parent.path.length);						// this is a folder			if (Folder.isFolder(item.path)) {				// create on destination				var destFolder = createFolder(to.path + relativePath + item.name);								// do it's children				item.forEachFolder(makeSureGetAllSubDirectories);			}		}				// recursively create directory structure		from.forEachFolder(makeSureGetAllSubDirectories);						// only works on files!  what about folders		from.parse(function(item, iterator, parent) {			var relativePath = parent.path.substr(from.parent.path.length);						// this is a folder, create on destination and continue in			if (Folder.isFolder(item.path)) {				//NOTE: this will never run because parse isn't running on empty directories				var destFolder = createFolder(to.path + relativePath + item.name);			}			// copy file			else {				// destination file path (as string)				var destFile = File(to.path + relativePath + item.name);								// make sure parent directory exists				var destFolder = createFolder(to.path + relativePath);								item.copyTo(destFile,true);								// run callback, pass in new file				if (typeof callback == 'function') {					callback(destFile);				}			}		});				// the newly created folder inside the "to" directory		return Folder(to.path + from.path.substr(from.parent.path.length));	}	catch (e) {			}}// assumption here is that extensions directory is sibling to all other solutions	var wakSolutions = Folder(FileSystemSync('EXTENSIONS_USER').path).parent.path;		var templateSolution = Folder(FileSystemSync('EXTENSIONS_USER').path + 'Kabootit/setup/solution/Base');		if (templateSolution.exists) {		// prompt for info about this solution		var solutionInfo = new Object();		solutionInfo.solutionName = 'Bob09';//studio.prompt("Please enter a name for the new solution");		solutionInfo.basePort = '9900';//studio.prompt("Please enter the base port for \"" + solutionName + "\".\nNote: Ports are assigned in blocks of 100.","8900");		solutionInfo.subdomain = 'troy';//studio.prompt("If this will be hosted with kabootit.co, please input the subdomain");				// hard-coded for now		solutionInfo.theme = "jupiter";				// make sure that valid information passed in		if (solutionInfo.solutionName) {			// replace out all spaces			solutionInfo.solutionName = solutionInfo.solutionName.replace(' ','_');		}		if (solutionInfo.basePort && (solutionInfo.basePort / 100) == Math.floor(solutionInfo.basePort / 100)) {			solutionInfo.portPrefix = solutionInfo.basePort / 100;		}				// solution already exists here, prompt to choose a new name		if (Folder(wakSolutions + solutionInfo.solutionName).exists) {			var foo = 'bar';		}				// callback function that does some additional processing when required		function mustacheMe(file) {			var needsProcessing = [				// all settings files				solutionInfo.solutionName + '/Settings.waSettings',				'Application/Settings.waSettings',				'Themes/Settings.waSettings',				// json files				'Security/app.json',				'Security/html.json',				// router				'Startup/router.js',				// keep track of ports used				'Meta/ports.json',				// description file for github				solutionInfo.solutionName + '/README.md'				// all custom settings files for shared projects are in the if statement below			];						var context = file.parent.name + '/' + file.name;			if ( // exact entry in needsProcessing				needsProcessing.indexOf(context) != -1 || 				// entire contents of shared projects settings files				(file.parent.name == 'Setup' && file.parent.parent.parent.name == 'Base_Solution')				) {								var template = file.toString();				var stream = new TextStream(file, "Overwrite");				stream.rewind();				stream.write(MUSTACHE.render(template, solutionInfo));				stream.flush();				stream.close();			}		}				// we rename template solution to new solution name		templateSolution.setName(solutionInfo.solutionName);		templateSolution = Folder(FileSystemSync('EXTENSIONS_USER').path + 'Kabootit/setup/solution/' + solutionInfo.solutionName);				// copy all files across and run through mustache if needed		var newSolution = copyTree(			// blueprint solution			templateSolution,			// new solution location			Folder(wakSolutions),			// callback that will run mustache selectively			mustacheMe		);				// undo the rename of the template		templateSolution.setName('Base');				// rename 'Base_Solution' folder in the copied solution		Folder(newSolution.path + 'Base_Solution/').setName(solutionInfo.solutionName + '_Solution');				// rename actual solution file		File(newSolution.path + solutionInfo.solutionName + '_Solution/Base.waSolution').setName(solutionInfo.solutionName + '.waSolution');				// after prompt, copy across settings files into submodules		var filesToCopy = Folder(newSolution.path + solutionInfo.solutionName + '_Solution/Kabootit/Setup');		newSolution.forEachFolder(function findSharedProject(item, iterator, parent) {			item.forEachFile(function findProjectFile(file, iterator, parent) {				// grab project id from project name				if (file.extension == 'waProject') {					var getID = /\((.*)\)/;					var match = getID.exec(file.name);										// there is an identifier, check to see if json and settings exist for it					if (match[1]) {						var jsonFile = File(filesToCopy.path + match[1].toLowerCase() + '.json');						var settingsFile = File(filesToCopy.path + match[1].toUpperCase() + ' Settings.waSettings');												// config files exists, copy to correct locations						if (jsonFile.exists && settingsFile.exists) {							jsonFile.copyTo(File(item.path + 'Kabootit/Security/' + jsonFile.name),true);							settingsFile.copyTo(File(item.path + settingsFile.name),true);						}					}				}			});		});	}	// no template solution, throw error	else {			}