
WAF.onAfterInit = function onAfterInit() {// @lock

// @region namespaceDeclaration// @startlock
	var btn_pass_set = {};	// @button
	var btn_navitem_new = {};	// @button
	var grid_navset_group = {};	// @dataGrid
	var grid_navset_group_picker = {};	// @dataGrid
	var grid_user_group_picker = {};	// @dataGrid
	var grid_group_navset = {};	// @dataGrid
	var grid_group_navset_picker = {};	// @dataGrid
	var grid_group_userpicker = {};	// @dataGrid
	var grid_group_user = {};	// @dataGrid
	var btn_add_all = {};	// @button
	var btn_user = {};	// @menuItem
	var btn_group = {};	// @menuItem
	var btn_navigation = {};	// @menuItem
// @endregion// @endlock

// eventHandlers// @lock

	btn_pass_set.click = function btn_pass_set_click (event)// @startlock
	{// @endlock
		sources.User.save({
			onSuccess: function(event) {
				var pass = prompt('Please enter a new password');
				
				if (pass) {
					AC.resetUserPassword(
						sources.User.ID,
						pass
					);
				}
			}
		});
	};// @lock

	btn_navitem_new.click = function btn_navitem_new_click (event)// @startlock
	{// @endlock
		// create on server so prefill everything correctly
		sources.NavSetItem.addNewElement();
		// if identifier on parent, prefill on child
		sources.NavSetItem.identifier = sources.NavSet.identifier;
		sources.NavSetItem.order_by = sources.NavSetItem.length;
		sources.NavSetItem.save( { 
			onSuccess: function(event){ 
				//TODO: enter name field
//				$('#grid_navitem .waf-dataGrid-row.waf-state-active .waf-dataGrid-col-name .content').click();
			}
		});
	};// @lock

	grid_navset_group.onRowDblClick = function grid_navset_group_onRowDblClick (event)// @startlock
	{// @endlock
		sources.NavSetGroup.remove();
	};// @lock

	grid_navset_group_picker.onRowDblClick = function grid_navset_group_picker_onRowDblClick (event)// @startlock
	{// @endlock
		sources.NavSetGroup.addNewElement();
		sources.NavSetGroup.Group.set(sources.GroupPicker.getCurrentElement());
		sources.NavSetGroup.save();
	};// @lock

	grid_user_group_picker.onRowDblClick = function grid_user_group_picker_onRowDblClick (event)// @startlock
	{// @endlock
		sources.User.Group.set(sources.GroupPicker.getCurrentElement());
		sources.User.save({
			onSuccess: function(event) {
				sources.User.serverRefresh({forceReload:true});
			}
		});
	};// @lock

	grid_group_navset.onRowDblClick = function grid_group_navset_onRowDblClick (event)// @startlock
	{// @endlock
		sources.GroupNavSet.remove();
	};// @lock

	grid_group_navset_picker.onRowDblClick = function grid_group_navset_picker_onRowDblClick (event)// @startlock
	{// @endlock
		sources.GroupNavSet.addNewElement();
		sources.GroupNavSet.NavigationSet.set(sources.NavSetPicker.getCurrentElement());
		sources.GroupNavSet.save();
	};// @lock

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
	WAF.addListener("btn_pass_set", "click", btn_pass_set.click, "WAF");
	WAF.addListener("btn_navitem_new", "click", btn_navitem_new.click, "WAF");
	WAF.addListener("grid_navset_group", "onRowDblClick", grid_navset_group.onRowDblClick, "WAF");
	WAF.addListener("grid_navset_group_picker", "onRowDblClick", grid_navset_group_picker.onRowDblClick, "WAF");
	WAF.addListener("grid_user_group_picker", "onRowDblClick", grid_user_group_picker.onRowDblClick, "WAF");
	WAF.addListener("grid_group_navset", "onRowDblClick", grid_group_navset.onRowDblClick, "WAF");
	WAF.addListener("grid_group_navset_picker", "onRowDblClick", grid_group_navset_picker.onRowDblClick, "WAF");
	WAF.addListener("grid_group_userpicker", "onRowDblClick", grid_group_userpicker.onRowDblClick, "WAF");
	WAF.addListener("grid_group_user", "onRowDblClick", grid_group_user.onRowDblClick, "WAF");
	WAF.addListener("btn_add_all", "click", btn_add_all.click, "WAF");
	WAF.addListener("btn_user", "click", btn_user.click, "WAF");
	WAF.addListener("btn_group", "click", btn_group.click, "WAF");
	WAF.addListener("btn_navigation", "click", btn_navigation.click, "WAF");
// @endregion
};// @endlock
