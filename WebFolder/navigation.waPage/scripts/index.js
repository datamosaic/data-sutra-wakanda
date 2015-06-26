
WAF.onAfterInit = function onAfterInit() {// @lock

// @region namespaceDeclaration// @startlock
	var btn_user = {};	// @menuItem
	var btn_group = {};	// @menuItem
	var btn_navigation = {};	// @menuItem
// @endregion// @endlock

// eventHandlers// @lock

	btn_user.click = function btn_user_click (event)// @startlock
	{// @endlock
		// Add your code here
	};// @lock

	btn_group.click = function btn_group_click (event)// @startlock
	{// @endlock
		// Add your code here
	};// @lock

	btn_navigation.click = function btn_navigation_click (event)// @startlock
	{// @endlock
		// Add your code here
	};// @lock

// @region eventManager// @startlock
	WAF.addListener("btn_user", "click", btn_user.click, "WAF");
	WAF.addListener("btn_group", "click", btn_group.click, "WAF");
	WAF.addListener("btn_navigation", "click", btn_navigation.click, "WAF");
// @endregion
};// @endlock
