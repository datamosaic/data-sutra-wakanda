﻿var	projectName,	srcDir,	destDir;	projectName = 'Widgets';srcDir = 'src';destDir = 'wdgt';// the path to get to the resources projectvar codePath = ds.getModelFolder().path;// which project is this running in?var projPath = Folder(codePath).parent.path + projectName + '/';var bootPath = Folder(codePath).parent.path + '/Resources/';// require in bootstrap buildervar bootstrap = require(bootPath + "Extensions/builders/bootstrap/bootstrap.js");// run the bootstrap buildervar results = bootstrap.run(projPath + 'WebFolder/' + srcDir + '/', projPath + 'WebFolder/' + destDir + '/');results