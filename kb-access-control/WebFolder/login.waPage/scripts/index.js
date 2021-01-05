WAF.onAfterInit = function onAfterInit() {// @lock

// @region namespaceDeclaration// @startlock
	var documentEvent = {};
	var btn_signin = {};
	var btn_signout = {};
// @endregion// @endlock

// eventHandlers// @lock

	var LOGON;

	documentEvent.onLoad = function documentEvent_onLoad (event)// @startlock
	{// @endlock
		// set up login; assigned to window so that can reference from prototype.js message listener
		window.LOGON =
		LOGON = new Login();
	};// @lock

	btn_signin.click = function btn_signin_click (event)// @startlock
	{// @endlock
		LOGON.signin(event);
	};// @lock

	btn_signout.click = function btn_signout_click (event)// @startlock
	{// @endlock
		LOGON.signout(event);
	};// @lock

// @region eventManager// @startlock
	WAF.addListener("document", "onLoad", documentEvent.onLoad, "WAF");
	WAF.addListener("btn_signin", "click", btn_signin.click, "WAF");
	WAF.addListener("btn_signout", "click", btn_signout.click, "WAF");
// @endregion
};// @endlock
