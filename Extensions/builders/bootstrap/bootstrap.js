/* * Bootstrap page builder */ // requirevar 	Mustache	= require("../../../Modules/Mustache.js");// variablesvar 	_pages,	_themes,	_views,	_destination,	_log 		= { pages: [], count : 0 },	_extras		= { model: [], datasources: [], scripts: { shared : [], namespace : [], eventHandlers : [], eventManager : [] }, widgets: {} };	try {	var themesProject = Folder(ds.getModelFolder().path).parent.path + 'Themes/Themes/';}catch (e) {	var themesProject = FileSystemSync("SOLUTION").path.split('/');	themesProject.splice(-2,1);	themesProject = themesProject.join('/') + 'Themes/Themes/';}		/** * * Intialize build variables * * @param {String} sourceCode Will generally be ds.getModelFolder().path + 'WebFolder/src', * @param {String} compiledOutput Will generally be ds.getModelFolder().path + 'WebFolder', * */	function init( sourceCode, compiledOutput ) {		_pages			= Folder(sourceCode + "pages");	_themes			= Folder(sourceCode + "templates");	_views			= Folder(sourceCode + "views");	_destination	= compiledOutput;	_log			= { pages: [], count : 0 };		// check to make sure that all these folders exist	[_pages,_themes,_views].forEach(function(item) {		if (!item.exists) {			item.create();		}	});}/** * LOGGING * Takes an object, strigifies it and outputs to solution log file * * @param {Object} item */	function log( item, status ) {		var		stringified = JSON.stringify(item);		// when run as an extension, console isn't available, so don't do anything	try {		studio;		// TODO: figure out a way to log when running from extension	}	catch (e) {		switch(status) {			case "error":				console.error(stringified);				break;			case "info":				console.info(stringified);				break;			case "warn":				console.warn(stringified);				break;		}	}			return stringified;}/*  * LAYOUTS * 3rd level iteration of Bootstrap build. Parent process is a row. Child process is widget(). * * @param {Folder} folder	source folder * @param {String} file		source file * @param {Object} config	config object  *  */function layout(folder, file, config) {	try {		var			layoutReturn,			columnData = '',			widgetData = '',			map = new Array();				// 1. get map of widgets		var 			html 	= file.toString(),			map		= [],			json 	= JSON.parse(XmlToJSON(html, "json-bag", "section"));		/**************		 * DATA		 * //TODO: refactor naming here		 *************/		 map["kabootit-catalog"] 		= null;		 map["kabootit-datasources"] 	= [];		 json.meta.forEach(function(item){			if ( item.name === "WAF.catalog" ) {		 		map["kabootit-catalog"] = item;			}			else if ( item.name === "WAF.config.datasources" ) {				// clean up ID and source				item["data-id"] = item["data-id"].split("}")[1];				item["data-source"] = item["data-source"].split("}")[1];				map["kabootit-datasources"].push(item);			}		 }); 		/**************		 * WIDGETS		 *************/			// get widget layer-out-er and get positioning of widgets on it		json.div.forEach(function(item) {			// widgetizer			if ( item["data-type"] === "kb_Widgets" ) {				// TODO: grab order based on css (array comes in based on left, not top)				var widgets = item.div;							// loop over all widgets and pull out correct properties				for (var i = 0; i < widgets.length; i++) {					// ignore the display labels					 if ( widgets[i]["class"].substr(0,8) !== "kb-label" ) {					// get data-kb div from interior//					if (widgets[i]["data-kb"]) {						// need to push in id to template...all else comes in from widget												if (widgets[i].div && widgets[i].div.length) {							widgets[i].div.forEach(function(item) {								if (item['kb-data']) {									map.push(item['kb-data'].replace(/kb-id/,widgets[i].id));								}							})						}					}				}			}		});			// // add row template		// map["kabootit-row-template"] = bootstrap_row["data-kabootit-template"];		// // add column template		// map["kabootit-column-template"] = [];		// columnObjects.forEach(function(entry){		// 	map["kabootit-column-template"].push(entry["data-kabootit-template"]);		// });			// 2. store extras		function union_arrays(x, y) {			var obj = {};			for (var i = x.length-1; i >= 0; -- i)				obj[x[i]] = x[i];			for (var i = y.length-1; i >= 0; -- i)				obj[y[i]] = y[i];			var res = [];			for (var k in obj) {				if (obj.hasOwnProperty(k))  // <-- optional					res.push(obj[k]);				}			return res;		}			function union_array_objects(x, y) {			var obj = {};			for (var i = x.length-1; i >= 0; -- i)				obj[x[i]["data-id"]] = x[i];			for (var i = y.length-1; i >= 0; -- i)				obj[y[i]["data-id"]] = y[i];			var res = [];			for (var k in obj) {				if (obj.hasOwnProperty(k))  // <-- optional					res.push(obj[k]);				}			return res;		}		// aggregate unique models		_extras.model = union_arrays(_extras.model, map["kabootit-catalog"].content.split(","));		// aggregate unique datasources		_extras.datasources = union_array_objects(_extras.datasources, map["kabootit-datasources"]);				// // 3. layout widgets into container and column templates		// for (var i = 0; i < map.length; i++) {		// 	for (var j = 0; j < map[i].length; j++) {		// 		// return widget		// 		widgetData += map[i][j];		// 	};		// 	// put widgets into column template		// 	columnData += Mustache.render(map["kabootit-column-template"][i], { column : widgetData } );		// 	widgetData = ''; // clear out widget variable		// };		//		// // put columns into container template		// layoutReturn = Mustache.render(map["kabootit-row-template"], { row : columnData } );		// return layoutReturn;				return map.join('\n');	}	catch (e) {		return '';	}}/*  * ROWS * 2nd level iteration of Bootstrap build. Parent process is page. Child process is layout(). * * @param {Folder} folder	source folder * @param {String} file		source file * @param {Object} config	config object * */function row(folder, file, config) {		var		rowReturn,		layoutReturn,		source 	= file.toString(),		widgets	= '',		nodes;			// if wakanda file	if ( source.search(/<!DOCTYPE/) !== -1 ) {				// TODO: strip out wakanda meta (datastores, datasources). store and return.		// 			OR: do in layout.js?						/*		 * next level: Layout		 */		layoutReturn = layout(folder, file, config);		// error chain		if ( layoutReturn && layoutReturn.hasOwnProperty && layoutReturn.hasOwnProperty("code") ) {			log({ code : "Row processing issue", message: layoutReturn}, "error");		}		return layoutReturn;			}	else {		// not wakanda file		// TODO: detect if tpl and do a merge else return raw		return source;	}	}/*  * SECTION * 2nd level iteration of Bootstrap build. Parent process is page. Child process is row(). *  * @param {Folder} folder	source folder object * @param {String} file		path to source file/directory * @param {Object} config	config object * @param {String} location which item currently iterating over * @param {String} view		path to views for this template */function section(folder, file, config) {	var		pageResults = {},		dataPage    = {},		subFolders  = folder.folders,		subFiles,		script,		regexJS,		matchJS,		modules     = [],		packages    = [],		rawHTML     = '';			// location of theme-generic resource (views in the theme directory)		// TODO: this code allows any file at all (including page src file) to have a default value specified in the theme views directory.  We need this for sections, but probably don't for everything else	var globalFile = File(themesProject + config.theme.substr(8) + "/views/" + file);	var localFile = File(folder.path + file);	var localFolder = Folder(folder.path + file);		// file must exist for us to bother processing	if (globalFile.exists || localFile.exists || localFolder.exists) {		// process non wakanda documents		if ( (folder.extension !== "waPage" && folder.extension !== "waComponent") || localFile.extension === "tpl" || localFile.extension === "html" || globalFile.extension === "tpl" || globalFile.extension === "html") {			// TODO: wakanda html page OR html snippet		 				// local file has precedence			if (localFile.exists) {				pageResults.html = localFile.toString();			}			// pull from theme directory			else if (globalFile.exists) {				pageResults.html = globalFile.toString();			}		}		// process wakanda documents		else {			// process 1st level folders			for (var i in subFolders) {							// waComponent				if ( subFolders[i].extension === "waComponent") {										// process 1st level files					subFiles = subFolders[i].files;					for (var j in subFiles) {											// html file (this is what drives preview...any changes must be reflected down there)						if (subFiles[j].extension === "html") {							// need to pull template from subfile							config = getConfig(subFiles[j]);											 			// process row html				 			pageResults.html = row(subFolders[i], subFiles[j], config);			 									}						// js file						else if (subFiles[j].extension === "js") {							// component js							var script 	= subFiles[j].toString();							var regexJS = new RegExp("Component \\(id\\) {// @lock([^]*?)function[^]*?namespaceDeclaration([^]*?)// @endregion[^]*?// eventHandlers([^]*?)// @region eventManager([^]*?)// @endregion");							var matchJS = regexJS.exec(script);														_extras.scripts.shared.push((matchJS[1]) ? matchJS[1].replace(/\/\/ @lock/g,"").replace(/\/\/ @startlock/g,"").replace(/\/\/ @endlock/g,"") : null);							_extras.scripts.namespace.push((matchJS[2]) ? matchJS[2].replace(/\/\/ @lock/g,"").replace(/\/\/ @startlock/g,"").replace(/\/\/ @endlock/g,"") : null);							_extras.scripts.eventHandlers.push((matchJS[3]) ? matchJS[3].replace(/\/\/ @lock/g,"").replace(/\/\/ @startlock/g,"").replace(/\/\/ @endlock/g,"") : null);							_extras.scripts.eventManager.push((matchJS[4]) ? matchJS[4].replace(/\/\/ @lock/g,"").replace(/\/\/ @startlock/g,"").replace(/\/\/ @endlock/g,"").replace(/this.id.*"_/g,'"') : null);													}						// json file						else if (subFiles[j].extension === "json") {							var json 	= JSON.parse(subFiles[j].toString());							if (json.hasOwnProperty("loadDependencies")) {								json.loadDependencies.forEach(function(item){									// grab widgets									if ( item.type === "widget" ) {										var type = item.id.split("/")[1];										if ( !_extras.widgets.hasOwnProperty(type) ) {											// TODO: only allow certain widgets (ie, not tabView, etc)											_extras.widgets[type] = item;										}									}																	})															}						}					}				}				// scripts folder				else if ( subFolders[i].name === "scripts" ) {										// process 1st level files					subFiles = subFolders[i].files;					for (var j in subFiles) {						if (subFiles[j].extension === "js") {							// page js							var script 	= subFiles[j].toString();														var regexJS	= new RegExp("onAfterInit\\(\\) {([^]*?)// @region .*([^]*?)// @endregion[^]*?// eventHandlers([^]*?)// @region .*([^]*?)// @endregion([^]*?)};");							var matchJS	= regexJS.exec(script);														_extras.scripts.shared.push((matchJS[1]) ? matchJS[1].replace(/\/\/ @lock/g,"").replace(/\/\/ @startlock/g,"").replace(/\/\/ @endlock/g,"") : null);							_extras.scripts.namespace.push((matchJS[2]) ? matchJS[2].replace(/\/\/ @lock/g,"").replace(/\/\/ @startlock/g,"").replace(/\/\/ @endlock/g,"") : null);							_extras.scripts.eventHandlers.push((matchJS[3]) ? matchJS[3].replace(/\/\/ @lock/g,"").replace(/\/\/ @startlock/g,"").replace(/\/\/ @endlock/g,"") : null);							_extras.scripts.eventManager.push((matchJS[4]) ? matchJS[4].replace(/\/\/ @lock/g,"").replace(/\/\/ @startlock/g,"").replace(/\/\/ @endlock/g,"") : null);													}						// json file						else if (subFiles[j].extension === "json") {							// currently handled by convention in the package.json template						}					}										}						}		}		}	else {		pageResults.error = log( { code: "404", message: "Section file doesn't exist" }, "error");	}		return pageResults;//	// there was an error//	return { code : 401, message : "Page or view processing issue" } }/** * Grab kabootit config options for requested page * @param {File} file * @return {Object} */function getConfig(file) {	var html   = file.toString();	var json   = JSON.parse(XmlToJSON(html, "json-bag", "html"));	var config = new Object();		// pull out data sources	config["datasources"] = [];	if ( json.hasOwnProperty("head") ) {		json.head[0].meta.forEach(function(item){			if ( item.name === "WAF.catalog" ) {	//	 		map["kabootit-catalog"] = item;			}			else if ( item.name === "WAF.config.datasources" ) {								// clean up ID and source				item["data-id"] = item["data-id"];				item["data-source"] = item["data-source"];				config["datasources"].push(item);			}		});	}		/**	 * Build up tree of nested components and containers	 * @param {Object} div Div may contain components or containers	 * @param {Object} parent Object representation to which children are added	 * @return {Object}	 */	function componentContainer(div,parent) {		switch (div["data-type"]) {			case "kb_Container":				// tack on top-level layout cut				var item = {					template: div["data-kbtemplate"],					children: new Object()				};								// TODO: nested components/containers not working quite right yet				if (parent.hasOwnProperty('children')) {					parent.children[div["data-kbparent"]] = item;				}				else {					parent[div["data-kbparent"]] = item;				}								// components inside it				if (div.div && div.div.length) {					div.div.forEach(function(child) {						// ignore the display labels						if ( child["class"].substr(0,8) !== "kb-label" ) {							componentContainer(child,item);						}					});				}				break			case "kb_Component":				// when there is a key, add it				if (div["data-kbparent"]) {					parent.children[div["data-kbparent"]] = div["data-kbresource"];				}				break		}	}		// grab all properties for the page from the kabootit widgets	if (json.body && json.body.length && json.body[0].div && json.body[0].div.length) {		// place holder for section mapping		config.sections = new Object();				json.body[0].div.forEach(function(item) {			// page widget			if ( item["data-type"] === "kb_Page" ) {				// kbtitle = "Widget Testing", kbtheme = "/mars", kbresource = "login.tpl", kbpublish = "true"				for (var i in item) {					if (typeof i === 'string' && i.substr(0,7) === "data-kb") {						var itemName = i.slice(7);												if (itemName === "theme") {							config.theme = '/themes' + item[i];						}						else {							config[itemName] = item[i];												}					}				}			}			// container widgets			else {				componentContainer(item,config.sections);			}		});				// error: required items		["theme","resource","sections"].forEach(function(item) {			if ( !config.hasOwnProperty(item) ) {				config.error = log({ code : "Config issue", message: "A value for \"" + item + "\" is required"}, 'error');			}		});	}	else {		config.error = log({ code : "Config issue", message: "There was an error with the file " + html.parent.name + '/' + html.name}, 'error');	}		return config}/*  * FILE * 1st level iteration of Bootstrap build. Child process is page(). * Main controller entry point. Outputs final file. * * * @param {Folder} pages * @param {Folder} themes * @param {Folder} sections * @param {Folder} destination*/function bootstrap(pages, themes, sections, destination) {	// TODO: error checking (kabootit.json, incorrect directory setup, etc)				// recursive loop through pages directory	pages.parse(function (file, position, folder) {		var			pageReturn,			themeTemplate,			template,			dataFile      = {},			config        = {};				/******************		 * config		 ******************/				// process .waPage properties and put into the config object		if ( folder.extension === "waPage" ) {			if (file instanceof File && file.extension === "html") {					config = getConfig(file);			}			// if any error, log and exit			if ( config.error ) {				return config.error;			}		}		else {			// TODO: alternate non .waPage stuff processing here. Primary location is in sections function so all sub stuff is collected before writing out page			return;		}					/******************		 * publish top level file		 ******************/		// debugger;		if ( config.publish === "true" ) {						/*			 * SECTIONS			 */						/**			 * Go through all sections and wrap-up into one html block for each section			 * @param {Object} node			 * @return {String}			 */			function nestedSections(node) {				// this node has children, send them through				if (node.hasOwnProperty("children")) {					for (var i in node.children) {						// replace child with contents of what referencing						node.children[i] = nestedSections(node.children[i]).html;					}					return Mustache.render(node.template,node.children);				}				// run singleton and return back out				else {					// located within page directory					if ( node.indexOf('views') == -1 ) {						return section(folder, node, config);					}					// located within src/views directory in this project					else {						// remove "views" from file reference						var fileRef = node.replace(/views\//g,'');						return section(sections, fileRef, config);					}				}			}						for (var i in config.sections) {				dataFile[i] = nestedSections(config.sections[i]);			}								/*			 * HTML file 			 */						// 1. Grab theme file (first check in src directory, then in default theme directory)			var templateFile = File(themesProject + config.theme.substr(8) + "/templates/" + config.resource);			var templateFileOV = File(themes.path + config.theme + "/" + config.resource);			if (templateFileOV.exists) {				themeTemplate      = templateFileOV.toString();			}			else if (templateFile.exists) {				themeTemplate      = templateFile.toString();			}			else {				var msg = log( { code: "404", message: "Template file doesn't exist" }, "error");				return			}						// 1.5. Remove script resources from theme file for insertion in the package.json			// var themeHTML = JSON.parse(XmlToJSON(themeTemplate, "json-bag", "html"));			var themeRegex = /<script kabootit="package.json" src=(?:'|")([^>]*)(?:'|")><\/script>/gi;			var themeScripts = new Array();			var themeScriptLocation = new Array();			var scriptTemplate = JSON.stringify({				"id": "{{path}}{{script}}",				"path": "THEMES-KABOOTIT",				"type": "script"			});			var scriptItem = {				// we don't want to specify the initial / for the package.json				"path": config.resource.substr(1)			};			var themeHTML;			while (themeHTML = themeRegex.exec(themeTemplate)) {				// track where this is to remove after regex cycle finished				themeScriptLocation.push({					startIndex: themeHTML.index,					stopIndex: themeHTML.index + themeHTML[0].length				});								// keep track for package.json				scriptItem.script = themeHTML[1];				themeScripts.push(JSON.parse(Mustache.render(scriptTemplate,scriptItem).replace(/&#x2F;/gi,'/')));			};			for (var z = themeScriptLocation.length - 1; z >= 0; z--) {				var locationRemove = themeScriptLocation[z];								// remove this script definition from template				themeTemplate = themeTemplate.substring(0,locationRemove.startIndex) + themeTemplate.substr(locationRemove.stopIndex);			}						// 2. resources path			dataFile.resources = config.theme;						// 3. model entry			dataFile.models = Mustache.render('<meta name="WAF.catalog" content="{{content}}"/>',{ content: _extras.model.join(",") });						// 4. datasource entries			dataFile.datasources = [];						function datasourceTemplate(type) {				switch(type) {					case "dataClass":						return '<meta data-type="{{data-type}}" data-lib="WAF" data-source="{{data-source}}" data-source-type="dataClass" data-dataType="{{data-dataType}}" name="WAF.config.datasources" data-id="{{data-id}}" content="{{content}}"/>';					case "array":						return '<meta data-type="{{data-type}}" data-lib="WAF" data-source="{{data-source}}" data-source-type="array" data-dataType="{{data-dataType}}" name="WAF.config.datasources" data-scope="local" data-id="{{data-id}}" data-attributes="{{data-attributes}}" content="{{content}}"/>';					break;				}							}						config["datasources"].forEach(function(item){				template = datasourceTemplate(item["data-source-type"]);				dataFile.datasources.push(Mustache.render(template,item));			});									dataFile.datasources = dataFile.datasources.join('\n\t\t');						// 5. rpc modules, additional scripts, additional css			var moduleHTML 		= file.toString();			var	moduleJSON 		= JSON.parse(XmlToJSON(moduleHTML, "json-bag", "html"));			var moduleResults 	= '';			var	targetFolder	= destination.split("/");			targetFolder		= targetFolder[targetFolder.length - 2];						var	rpcData			= [];			var rpcTemplate 	= '<meta name="WAF.config.rpc.file" content="';			if (targetFolder != 'WebFolder') {				rpcTemplate 	+= '/'+ targetFolder;			}			rpcTemplate 		+= '{{{content}}}"/>';						var	scriptData		= [];						var	cssData			= [];			var cssTemplate 	= '<meta name="WAF.config.loadCSS" content="{{style}}"/>';						moduleJSON.head[0].meta.forEach(function(item) {				// rpc				if ( item.name === "WAF.config.rpc.file" ) {					// get content property value					rpcData.push(item.content);				}				// style				else if (item.name === "WAF.config.loadCSS" && !(item.id === "waf-interface-css" || item.id === "waf-project-css")) {					cssData.push(item.content);				}				// js				else if (item.name === "WAF.config.loadJS") {					scriptData.push(item.content);				}			});	 	   			rpcData.forEach(function(item) {				moduleResults += Mustache.render(rpcTemplate,{ "content" : item }) + '\n';			});			scriptData.forEach(function(item) {				// wakanda's generated index.js is handled elsewhere, don't include				if (item == 'scripts/index.js') {					return				}				// when first character of script is '/' it is in relation to WebFolder so don't need a path and also don't need to copy				if (item[0] == '/') {					var scriptPath = '';										// slash not required becuase we're coming from vantage point of webfolder					item = item.slice(1);				}				// relative to page itself, let's copy to compiled page				else {					// copy included scripts across					scriptPath = (destination + folder.name + '/').split('WebFolder/')[1];										var srcScript = File(folder.path + item);					var destScript = File(destination + folder.name + '/' + item);										if (srcScript.exists) {						// make sure directory exists						Folder(destScript.parent.path).create();												jsStream = new TextStream(destScript, "Overwrite");						jsStream.rewind();						jsStream.write(srcScript.toString());						jsStream.flush();						jsStream.close();					}				}								scriptTemplate = JSON.stringify({					"id": "{{path}}{{script}}",					"path": "WEBFOLDER",					"type": "script"				});								scriptItem = {					"path": scriptPath,					"script": item				};								themeScripts.push(JSON.parse(Mustache.render(scriptTemplate,scriptItem).replace(/&#x2F;/gi,'/')));			});			cssData.forEach(function(item){				// when first character of style is '/' it is in relation to WebFolder so don't need a path and also don't need to copy				// relative to page itself, let's copy to compiled page				if (item[0] != '/') {					// copy included styles across										var srcStyle = File(folder.path + item);					var destStyle = File(destination + folder.name + '/' + item);										if (srcStyle.exists) {						// make sure directory exists						Folder(destStyle.parent.path).create();												jsStream = new TextStream(destStyle, "Overwrite");						jsStream.rewind();						jsStream.write(srcStyle.toString());						jsStream.flush();						jsStream.close();					}				}								var cssItem = {					"style": item				};								moduleResults += Mustache.render(cssTemplate,cssItem).replace(/&#x2F;/gi,'/') + '\n';			});			dataFile.modules = moduleResults;						// 6. Page title			dataFile.title = config.title;						// 7. HTML file			// TODO: get rid of double pass (needed currently to fill in tags that are in views)				// TODO: put into while loop			var content = Mustache.render(themeTemplate, dataFile);			content = Mustache.render(content, dataFile);			// 8. create the output folder and file and write to it			var folder 	= Folder(destination + folder.name);			var success	= folder.create();			var file	= File(folder.path + "index.html");						// 9. write to output			var textStream = new TextStream(file, "Overwrite");			textStream.rewind();			textStream.write(content);			textStream.flush();			textStream.close();							// log results			log({ code : 201, message: "HTML page created"}, 'info');			_log.pages.push( { name : folder.name, error : [{ code : 201, message : "Created" }] } );			_log.count ++;									/*			 * Javascript file			 */			// create scripts folder			var scripts	= Folder(folder.path + "scripts");			success = scripts.create();						// create the output js file 			var jsFile	= File(scripts.path + "index.js");						var jsTemplate = 'WAF.onAfterInit = function onAfterInit() {\n\					{{{shared}}}\n\				\n\				// @region namespaceDeclaration\n\					{{{namespace}}}\n\				// @endregion\n\				\n\				// eventHandlers\n\				\n\					{{{eventHandlers}}}\n\				\n\				// @region eventManager\n\					{{{eventManager}}}\n\				// @endregion\n\				};\n';			var jsData	= { 				shared: _extras.scripts.shared.join("\n"),				namespace: _extras.scripts.namespace.join("\n"),				eventHandlers: _extras.scripts.eventHandlers.join("\n"),				eventManager: _extras.scripts.eventManager.join("\n")			};						// write to output			var jsStream = new TextStream(jsFile, "Overwrite");			jsStream.rewind();			jsStream.write(Mustache.render(jsTemplate, jsData));			jsStream.flush();			jsStream.close();							/*			 * Package file			 */			 var jsTemplate = {				"loadDependencies": [					{						"id": "Desktop_Core",						"type": "core",						"version": "1.0.0"					},					{						"id": "{{{target}}}{{title}}/scripts/index.js",						"path": "WEBFOLDER",						"type": "script"					}				],				"name": "{{projectName}}/{{title}}/index.html",				"version": "1.0.0"			};						// all widgets for this page (this one should probably not be done this way...better to push through mustache template)			for (var m in _extras.widgets) {				jsTemplate.loadDependencies.push(_extras.widgets[m]);			}			// all custom scripts for this page			jsTemplate.loadDependencies = jsTemplate.loadDependencies.concat(themeScripts);						// convert object into string for mustache to wax			var superPrefs = 				template = JSON.stringify(jsTemplate,null,'\t');				// this line removes all the pretty formatting: JSON.stringify(jsTemplate);			var packageData				= {};			packageData.projectName		= folder.parent.parent.name;			packageData.title			= folder.name;			packageData.target			= targetFolder == 'WebFolder' ? "" : targetFolder + '/';										// create the output package file and write to it			var packageFile	= File(folder.path + "index.package.json");						// write to output			var stream = new TextStream(packageFile, "Overwrite");			stream.rewind();			stream.write(Mustache.render(template, packageData));			stream.flush();			stream.close();							// log results			log({ code : 201, message: "package file created"}, 'info');			_log.pages.push( { name : folder.name, error : [{ code : 201, message : "Created" }] } );			_log.count ++;							// reset page variables			_extras		= { model: [], datasources: [], scripts: { shared : [], namespace : [], eventHandlers : [], eventManager : [] }, widgets: {} };		}		// not published page		else {			// log skipped page as a warning			var msg = log( { code: "204", message: "Page skipped because not published" }, "warn");		}				});}/** * * Build step entry point for Bootstrap development * * @param {String} sourceCode Will generally be ds.getModelFolder().path + 'WebFolder/src' * @param {String} compiledOutput Will generally be ds.getModelFolder().path + 'WebFolder/<projectName>' * * @return {Object} _log  */exports.run = function run(sourceCode, compiledOutput) {		// set up	init(sourceCode, compiledOutput);		// run process	bootstrap(_pages, _themes, _views, _destination);		// show completed status	var msg = log( { code: themesProject, message: "File processed: " + _log.count }, "info");		return msg;};/** * Build step entry point for Bootstrap preview * * @param {String} sourceFile The currently open editor * * @return {File} Location of file to preview */exports.preview = function preview(sourceFile) {	// show completed status	if (sourceFile.exists) {		// process this component		var html = row(null, sourceFile);				// template and stuffings for mustache		var template = File(FileSystemSync("EXTENSIONS_USER").path + 'Kabootit/preview/template.html').toString();				var obj = {			snippet: html,			fileName: sourceFile.parent.name		};				// create the previewable file and write to it		var tempFile	= File(FileSystemSync("EXTENSIONS_USER").path + 'Kabootit/__preview_' + sourceFile.name);		var stream = new TextStream(tempFile, "Overwrite");		stream.rewind();		stream.write(Mustache.render(template,obj));		stream.flush();		stream.close();				// return name of file to be displayed/deleted		return tempFile;	}};