
WAF.onAfterInit = function onAfterInit() {// @lock

// @region namespaceDeclaration// @startlock
	var grid_group_userpicker = {};	// @dataGrid
	var grid_group_user = {};	// @dataGrid
	var btn_add_all = {};	// @button
	var btn_user = {};	// @menuItem
	var btn_group = {};	// @menuItem
	var btn_navigation = {};	// @menuItem
// @endregion// @endlock

// eventHandlers// @lock

	grid_group_userpicker.onRowDblClick = function grid_group_userpicker_onRowDblClick (event)// @startlock
	{// @endlock
		sources.UserPicker.Group.set(sources.Group.getCurrentElement());
		sources.UserPicker.save({
			onSuccess: function(event) {
				sources.Group.serverRefresh({forceReload:true});
			}
		});
		
	};// @lock

	grid_group_user.onRowDblClick = function grid_group_user_onRowDblClick (event)// @startlock
	{// @endlock
		sources.GroupUser.Group.set(null);
		sources.GroupUser.save({
			onSuccess: function(event) {
				sources.Group.serverRefresh({forceReload:true});
			}
		});
	};// @lock

	btn_add_all.click = function btn_add_all_click (event)// @startlock
	{// @endlock
		// Add your code here
	};// @lock

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
	WAF.addListener("grid_group_userpicker", "onRowDblClick", grid_group_userpicker.onRowDblClick, "WAF");
	WAF.addListener("grid_group_user", "onRowDblClick", grid_group_user.onRowDblClick, "WAF");
	WAF.addListener("btn_add_all", "click", btn_add_all.click, "WAF");
	WAF.addListener("btn_user", "click", btn_user.click, "WAF");
	WAF.addListener("btn_group", "click", btn_group.click, "WAF");
	WAF.addListener("btn_navigation", "click", btn_navigation.click, "WAF");
// @endregion
};// @endlock
