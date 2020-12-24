(function(kb_Config) {
	var widgetName = "Config";
    /* Default width and height of your widget */
    kb_Config.setWidth('400');
    kb_Config.setHeight('40');
    /* Properties */
    // title
    kb_Config.customizeProperty('kbTitle', {
    	category: "Kabootit",
        title: 'Title',
        description: 'Title meta tag value'
    });
    // publish
    kb_Config.customizeProperty('kbPublish', {
    	category: "Kabootit",
        title: 'Publish',
        description: 'Builder only picks up published pages'
    });
    // theme
    kb_Config.customizeProperty('kbTheme', {
    	category: "Kabootit",
        title: 'Theme',
        description: 'Pick a theme'
    });
    // layout
    kb_Config.customizeProperty('kbResource', {
    	category: "Kabootit",
        title: 'Resource',
        description: 'Specify theme resource'
    });
	/* designer load code */
	function getImg(widgetName) {
		// grab img used
		var img =  $('div')
		.filter(function() {
		    return this.id.match(/(?=.*Kabootit)(?=.*Layout)/);
		})
		.find('button')
		.filter(function() {
			return $(this).text() == widgetName;
		})
		.css('background-image');
		return img;
       }
	setTimeout(function(){
		var img = getImg(widgetName);
		// find all widgets of this type
		var widgets = $('div[data-type="kb_' + widgetName + '"]');
		// set image
		$( widgets ).each(function( index ) {
		  	 $(widgets[index]).css('background', img + ' no-repeat');
		});
	}, 100);
    kb_Config.doAfter('init', function() {
        this.node.innerHTML = '<div class="kb-label-config"><b>Config:</b> ' + this.kbTitle()  + '</div>';
	    var img =  getImg(widgetName);
        $(this.node).css('background', img + ' no-repeat');
    });
});
