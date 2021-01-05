

model.NavigationItem.flag_active.events.init = function(event) {
	this.flag_active = true;
};

model.NavigationItem.url_domain.onGet = function() {
	if (this.identifier) {
		return SECURITY.path(this.identifier);
	}
};
