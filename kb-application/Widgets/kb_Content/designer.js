(function(kb_Content) {
    /* Default width and height of your widget */
    kb_Content.setWidth('300');
    kb_Content.setHeight('400');
    /* Properties */
    // parent
    kb_Content.customizeProperty('kbTitle', {
    	category: "Kabootit",
        title: 'Title',
        description: 'Parent tag this kb_Content fits into'
    });
    //  template
    kb_Content.customizeProperty('kbTemplate', {
    	category: "Kabootit",
        title: 'Template',
        description: 'Insert tags and markup',
        multiline: true
    });
    kb_Content.customizeProperty('kbFormatted', {
    	category: "Kabootit",
        title: 'Use template',
        description: 'Default state of button is disabled'
    });
	var setBadge = function setBadge() {
		var widgetName = "Content";
		this.node.innerHTML = '<div class="kb-badge">' + widgetName + ':<b> ' + this.kbTitle()  + '</b></div>';
	};
    kb_Content.doAfter('init', function() {
    	setBadge.call(this);
    	this.kbTitle.onChange(setBadge, "Content");
    });
});
