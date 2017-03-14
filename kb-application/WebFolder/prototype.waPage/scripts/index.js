
WAF.onAfterInit = function onAfterInit() {// @lock

// @region namespaceDeclaration// @startlock
	var documentEvent = {};	// @document
	var btn_nav_engine = {};	// @button
	var kb_logout = {};	// @button
	var kb_nav_set = {};	// @dataGrid
	var kb_nav_item = {};	// @dataGrid
	var btn_hard_refresh = {};	// @button
	var btn_navset = {};	// @button
	var btn_navitem = {};	// @button
	var btn_go = {};	// @button
// @endregion// @endlock

// eventHandlers// @lock
	
	// append font awesome cdn
	$("head").append('<link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css">');
	// apply normal font style so not displaying italic
	$("i, .fa").css("font-style", "normal");
	
	var NAV;
	
	var shownElements = [
			"kb_login",
			"kb_nav_set",
			"kb_nav_item",
			"fld_temp",
			"btn_go",
			"kb_page"
		];
	
	documentEvent.onLoad = function documentEvent_onLoad (event)// @startlock
	{// @endlock
		// check what browser running in
		var supported = false;
		// this is chrome
		if (/Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor)) {
			supported = true;
		}
		// opera
		else if (/OPR/.test(navigator.userAgent) && /Opera Software ASA/.test(navigator.vendor)) {
			supported = true;
		}
		// // safari
		// else if () {
		// 	supported = true;
		// }
		// // IE
		// else if () {
		// 	supported = true;
		// }
		// firefox
		else if (/firefox/i.test(navigator.userAgent)) {
			supported = true;
		}
		// // spartan
		// else if () {
		// 	supported = true;
		// }
		
		// only allow to work in supported browsers
		if (supported) {
			// set up navigation
				// TODO: don't assign to window (here so easier to debug what's happening)
			window.NAV = 
			NAV = new Navigation();
		
			// DEBUG: save user info
			NAV.fillUser($('#kb_username'),$('#kb_password'));
			
			// show elements
			setTimeout(function() {
				// debugger;
				$('#' + shownElements.join(', #')).fadeIn();
			},250);
			
		}
		// display error that must use google chrome
		else {
			alert("Unsupported browser.\nPlease open this page in Google Chrome.");
		}
		
	};// @lock
	
	btn_nav_engine.click = function btn_nav_engine_click (event)// @startlock
	{// @endlock
		NAV.configure();
	};// @lock
	
	kb_logout.click = function kb_logout_click (event)// @startlock
	{// @endlock
		AC.logout();
		location.reload();
	};// @lock

	kb_nav_set.onRowClick = function kb_nav_set_onRowClick (event)// @startlock
	{// @endlock
		NAV.setNavItems();
	};// @lock
	
	kb_nav_item.onRowClick = function kb_nav_item_onRowClick (event)// @startlock
	{// @endlock
		NAV.refreshPage();
	};// @lock
	
	btn_hard_refresh.click = function btn_hard_refresh_click (event)// @startlock
	{// @endlock
		NAV.getNavTree();
	};// @lock

	btn_navset.click = function btn_navset_click (event)// @startlock
	{// @endlock
		NAV.refreshPage(true);
	};// @lock
	
	btn_navitem.click = function btn_navitem_click (event)// @startlock
	{// @endlock
		NAV.refreshPage();
	};// @lock
	
	btn_go.click = function btn_go_click (event)// @startlock
	{// @endlock
		var value = NAV.getPageURL();
		
		if (value) {
			window.open(value,'blank');
		}
	};// @lock

// @region eventManager// @startlock
	WAF.addListener("document", "onLoad", documentEvent.onLoad, "WAF");
	WAF.addListener("btn_nav_engine", "click", btn_nav_engine.click, "WAF");
	WAF.addListener("kb_logout", "click", kb_logout.click, "WAF");
	WAF.addListener("btn_go", "click", btn_go.click, "WAF");
	WAF.addListener("kb_nav_set", "onRowClick", kb_nav_set.onRowClick, "WAF");
	WAF.addListener("kb_nav_item", "onRowClick", kb_nav_item.onRowClick, "WAF");
	WAF.addListener("btn_hard_refresh", "click", btn_hard_refresh.click, "WAF");
	WAF.addListener("btn_navset", "click", btn_navset.click, "WAF");
	WAF.addListener("btn_navitem", "click", btn_navitem.click, "WAF");
// @endregion
};// @endlock
