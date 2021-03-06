﻿/**


















































































































































































































































































































































































































































































































































































 * Class that does navigation.
 *
 * @param {String} [navSet] Name of navigation set datasource
 * @param {String} [navItem] Name of navigation item datasource
 */
function Navigation(navSet, navItem) {
	// reference to the class so can access it from other contexts
	var that = this;

	// flag to turn on/off debugging in navigation class
	var DEBUG = true;
	/**
	 * Either log what's passed in or run it (callback function)
	 *
	 * @param {Function|Object} fx Custom function to run; else console.log
	 * @param {Array} [args] Array of arguments to pass when custom function
	 */
	function debug(fx,args) {
		if (DEBUG) {
			// custom callback specified
			if (typeof fx == 'function') {
				if (!args) {
					args = new Array();
				}

				// run function (to do console.log, set output, etc)
				fx.apply(this,args);
			}
			// just do a console.log for whatever passed in
			else {
				console.log(fx);
			}
		}
	}

	// default landing page when no navigation configured
	var homePage = 'http://www.kabootit.com/';

	// name of data sources (can be customized when NAV inited)
	var srcNavSet = navSet || 'NavSet';
	var srcNavItem = navItem || 'NavItem';

	// credentials
	var user = "";
	var pass = "";

	// url for navigation button 1-off
	var navConfig = false;
	var acURL = "";

	// track spinners
	var loggingIn = false;

	/**
	 * Figure out what project and page we're on
	 *
	 * @return {{[project]: string, [page]: string}}
	 */
	function parsePath() {
		var path = location.pathname.split('/');
		path = path.splice(1);

		var page = path.splice(1).join('/');
		var project = path[0].toUpperCase();

		return {
			project: project,
			page: page
		}
	}

	/**
	 * Function that is used to communicate with the iframe (different based on browser)
	 *
	 * @param {String|Object|etc} message Data to be sent
	 * @param {String} targetOrigin What the origin of the iframe must be
	 * @param {Transferable[]} [transfer] Sequence of transferable objects to gift the iframe
	 */
	this.messagePost = function messagePost(message, targetOrigin, transfer) {
		// postMessage method available on the window we're talking with
		if (iframeWindow && typeof iframeWindow.postMessage == 'function') {
			iframeWindow.postMessage(message, targetOrigin, transfer);
		}
	};
	// this is defined in the constructor, referenced differently depending on browser used
	var iframeWindow;

	/**
	 * Fill user and password fields of iframe with proper credentials
	 *
	 * @param {jQuery.Element[]} $user jQuery user field element
	 * @param {jQuery.Element[]} $pass jQuery password field element
	 */
	this.fillUser = function fillUser($user, $pass) {
		// fill user name
		if ($user) {
			$user.val(user);
		}

		// fill password
		if ($pass) {
			$pass.val(pass);
		}
	};

	/**
	 * Get navigation tree from server and fill local datasource
	 * Waits to fill navigation until async call is done
	 */
	this.getNavTree = function getNavigationPromise() {
		$.when( getNavigation() )
			// onsuccess of all promises
			.done(function(navInfo) {
				setNavigation(navInfo,"<h2>Refreshing navigation...</h2>");
			})
			// onerror or ontimeout of any promise
			.fail(function(error) {
				debug(error);
			})
		;
	};
	/**
	 * Promise-based get navigation tree from server
	 */
	function getNavigation() {
		var deferred = $.Deferred();

		AC.navigationAsync({
			"onSuccess" : function(result) {
				deferred.resolve(result);
			},
			"onError" : function(error) {
				debug(error);
				deferred.reject(error);
			},
			"params" : []
		});

		return deferred.promise();
	};
	/**
	 * Promise-based fill local datasource
	 * @param {{[name]: String, [id]: UUID, [url]: String, [items]: {[name]: String, [url]: String}[]}[]} navInfo An array of navigation sets
	 * @param {String} [loadingMessage] Message to display when loading page
	 */
	function setNavigation(navInfo,loadingMessage) {
		// fill navigation array and sync datasource
		if (!(navInfo instanceof Array)) {
			navInfo = new Array();
		}
		window[srcNavSet] = navInfo;
		sources[srcNavSet].sync();

		that.setNavItems(null,loadingMessage);

		// // if url has some text in it, we want to select correct record before running
		// if (location.pathname != '/') {
		// 	var pathInfo = parsePath();
		//
		// 	// set navigation set properly
		// 	sources[srcNavSet].selectByKey(pathInfo.project);
		//
		// 	// set navigation items, but don't load page
		// 	that.setNavItems(true);
		//
		// 	// select correct nav item
		// 	sources[srcNavItem].selectByKey(pathInfo.page);
		//
		// 	// now load the load page
		// 	that.refreshPage(true);
		// }
		// // change navigation items under current nav set
		// else {
		// 	that.setNavItems();
		// }
	};

	/**
	 * Open new tab with contents of iframe
	 *
	 * @param {String} sourceName Name of the local datasource
	 */
	this.iframeToTab = function openStandalone() {
		var value = $('#fld_temp').val();

		if (value) {
			window.open(value,'blank');
		}
	};

	/**
	 * Change navigation items under current navigation set
	 *
	 * @param {Boolean} [skipPageLoad] Don't load page, just set navigation items
	 * @param {String} [loadingMessage] Message to display when loading page
	 */
	this.setNavItems = function setNavSetItems(skipPageLoad,loadingMessage) {
		var navItems = new Array();

		// a navigation set is selected
		if (sources[srcNavSet].getCurrentElement()) {
			navItems = sources[srcNavSet].getCurrentElement().items;
		}
		// case when all navigation removed...need to go to default page
		else {
			$('#fld_temp').val(homePage);
			$('#kb_page iframe').attr('src',homePage);
		}

		// set navigation items
		window[srcNavItem] = navItems;
		sources[srcNavItem].sync();

		// load the page
		if (!skipPageLoad) {
			that.refreshPage(true,loadingMessage);
		}
	};

	/**
	 * Reload page
	 *
	 * @param {Boolean} [fullReload] Change entire contents of iframe instead of messaging
	 * @param {String} [customBlock] Message to display on block screen
	 */
	this.refreshPage = function loadNavItem(fullReload,customBlock) {
		/**
		 * Turn on blocker over iframe
		 *
		 * @param {String} message What to show in blocker
		 * @param {Boolean} [login] Are we logging in to a new project as well?
		 */
		function block(message, login) {
			// set up default options for blocker
			var opts = {
				css: {
					border: 'none',
					padding: '25px',
					backgroundColor: '#000',
					'-webkit-border-radius': '10px',
					'-moz-border-radius': '10px',
					opacity: .8,
					color: '#fff'
				},
				overlayCSS: {
					backgroundColor: "#f7f7f7",
					opacity: 1
				},
				message: message
			};

			if (login) {
				loggingIn = true;
			}

			$('#kb_page').block(opts);
			$('body').addClass('wait');
		};

		// there is a place to navigate to
		var newPage = that.getPageURL();

		// when in navigation config mode, only want to show navigation pane
		if (navConfig) {
			newPage = acURL + 'navigation/';

			if (!customBlock) {
				customBlock = "<h2>Entering navigation...</h2>";
			}
		}
		// is this an internal or external page
		else if (!sources[srcNavSet].length || !sources[srcNavSet].getCurrentElement().url) {
			fullReload = true;
			var noBlocker = true;
		}

		// use default block message
		if (!customBlock) {
			customBlock = "<h2>Changing project...please wait</h2>";
		}
		// don't show message block
		else if (customBlock == 'null') {
			customBlock = null;
		}

		// there is someplace to navigate
		if (newPage) {
			// display URL of page showing in iframe
			$('#fld_temp').val(newPage);

			// showing location
			var pathOld = parsePath();

			// location we're headed to
			var pathNew;
			// when in navigation config mode, only want to show navigation pane
			if (navConfig) {
				pathNew = {
					project: 'AC',
					page: 'navigation',
					url: acURL
				};
			}
			// grab location from project/page selected
			else {
			    pathNew = {
	   				project: sources[srcNavSet].getCurrentElement().id,
	   				page: sources[srcNavItem].getCurrentElement().url,
	   				url: sources[srcNavSet].getCurrentElement().url
	   			};
			}

			// do big reload
			if (fullReload) {
				// // only update URL when different from what's currently showing
				// if (pathOld.page != pathNew.page || pathOld.project != pathNew.project) {
				// // update URL (show going to login even though we're requesting particular page already)
				// 	history.pushState(
				// 			pathNew,
				// 			"Login",
				// 			"/" + pathNew.project.toLowerCase() + "/login/"
				// 		);
				// }

				$('#kb_page iframe').attr('src',newPage);

				// manually turn off big blocker to make sure it's off
				if (noBlocker) {
					$('#kb_page').unblock();
					$('body').removeClass('wait');
				}
				// turn on big blocker when switching navigation sets, but not when loading in external content
				else {
					block(customBlock,true);
				}
			}
			// do small reload
			else {
				// 1st small reload after a big one will replace last history state (/login/)
				var hixAction = (pathOld.page == "login") ? "replaceState" : "pushState";

				// only update URL when different from what's currently showing
				if (pathOld.page != pathNew.page) {
					// history[hixAction](
					// 		pathNew,
					// 		sources[srcNavItem].getCurrentElement().name,
					// 		"/" + pathNew.project.toLowerCase() + "/" + pathNew.page
					// 	);

					// turn on  small blocker when switching nav items
					if (!loggingIn) {
						block(null,false);
					}
				}

				that.messagePost(
					{
						page: pathNew.page
					},
					pathNew.url
				);
			}
		}
	};

	/**
	 * URL of currently shown page
	 *
	 * @return {String} URL string
	 */
	this.getPageURL = function getPageURL(fullReload) {
		var fullUrl	= "";

		// there is a place to navigate to
		if (sources[srcNavSet].length && sources[srcNavItem].length) {
			fullUrl = sources[srcNavSet].getCurrentElement().url + sources[srcNavItem].getCurrentElement().url;
		}

		return fullUrl;
	};

	/**
	 * Enter navigation engine
	 *
	 * @return {Boolean} Current status of navigation engine
	 */
	this.configure = function configureNavigation() {
		// if not authorized, disallow
		if (AC.getUserValue(AC.user().ID,'Group.name') != 'Admin') {
			return
		}

		if (!navConfig) {
			// in navigation engine
			navConfig = true;

			// disable navigation project and page grid
			$('#kb_nav_set').block({
					message: null
				});
			$('#kb_nav_item').block({
					message: null
				});

			// go to navigation login page
			that.refreshPage(true);
		}
		else {
			// no longer in navigation engine
			navConfig = false;

			// update navigation (will reload whatever is under the current nav item)
			that.getNavTree();

			// enable navigation project and page grids
			$('#kb_nav_set').unblock();
			$('#kb_nav_item').unblock();
		}
	};

	/**
	 * This function will be run when new NAV instantiated
	 * NOTE: don't really need to wrap function in (), this is to avoid Wakanda warning
	 */
	var __construct = (function setupNavClass() {
		// grab user/pass
		function getUser() {
			var deferred = $.Deferred();

			AC.sessionAsync({
				"onSuccess" : function(result) {
					// some test for good data, we probably have valid data
					if (typeof result == 'object') {
						deferred.resolve({
							user: result.user.name,
							pass: result.storage.protoPass
						});
					}
					// something not right, m’aidez
					else {
						deferred.reject(result);
					}
				},
				"onError" : function(error) {
					debug(error);
					deferred.reject(error);
				},
				"params" : []
			});

			return deferred.promise();
		};

		// after navigation and user gotten, do some stuff
		$.when( getUser(), getNavigation() )
			// onsuccess of all promises
			.done(function(userInfo, navInfo) {
				// fill user name and pass
				user = userInfo.user;
				pass = userInfo.pass;

				// fill local datasources
				setNavigation(navInfo,"null");
			})
			// onerror or ontimeout of any promise
			.fail(function(error) {
				debug(error);
			})
		;

		// reference to the iframe's window for communication
		if (/Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor)) {
			iframeWindow = window.frames['kb_page-frame'].contentWindow;
		}
		// safari and ie11+ and all ies
		else if ((/Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor)) ||
				(!!(navigator.userAgent.match(/Trident/) && !navigator.userAgent.match(/MSIE/))) ||
				navigator.userAgent.match(/MSIE/)) {
			iframeWindow = window.frames['kb_page-frame'];
		}
		else {
			iframeWindow = window.frames['kb_page-frame'].contentWindow;
		}

		// Listen for messages posted from downstream iframe
		var portholeMethodOn = window.addEventListener ? "addEventListener" : "attachEvent";
		var portholeMethodOff = window.addEventListener ? "removeEventListener" : "detachEvent";
		var portholeEvent = portholeMethodOn == "attachEvent" ? "onmessage" : "message";

		function portholeSetup(e) {
			// console.log(e.data);

			// send credentials currently stored
			if (e.data == 'getCredentials') {
				that.messagePost(
					{
						user: user,
						pass: pass
					},
					"*"
				);
			}
			// navigate to the page we actually want to go to
			else if (e.data == 'softRefresh') {
				that.refreshPage();
			}
			// turn off blocker
			else if (e.data == 'unblock') {
				// unblock
				function unblock() {
					$('#kb_page').unblock();
					$('body').removeClass('wait');
				};

				// changing project
				if (loggingIn) {
					loggingIn = false;

					// give an extra half-second to render on project changes
					// console.log("extra time");
					setTimeout(unblock,500);
				}
				// changing page within project
				else {
					unblock();
				}
			}
		};

		window[portholeMethodOn](portholeEvent,portholeSetup,false);

		// change project/page selected as history navigated
		// window.onpopstate = function(event) {
		// 	var pathInfo = event.state;
		//
		// 	// set navigation set properly
		// 	sources[srcNavSet].selectByKey(pathInfo.project);
		//
		// 	// set navigation items, but don't load page
		// 	that.setNavItems(true);
		//
		// 	// select correct nav item
		// 	sources[srcNavItem].selectByKey(pathInfo.page);
		//
		// 	// now load the load page
		// 	that.refreshPage(true);
		// };

		// grab URL for accessing security screens
		AC.navigationURLAsync({
			"onSuccess" : function(result) {
				// when this returns an object (401 unauth), there is a problem with getting the allowed routes
				if (typeof result == 'string') {
					acURL = result;
				}
			},
			"onError" : function(error) {
				debug(error);
			},
			"params" : []
		});
	})();
}