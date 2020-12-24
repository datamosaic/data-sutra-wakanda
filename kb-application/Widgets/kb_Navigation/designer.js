(function(kb_Navigation) {
	var widgetName = "Navigation";
    /* Default width and height of your widget */
    kb_Navigation.setWidth('160');
    kb_Navigation.setHeight('300');
    /* Properties */
    //  title
    kb_Navigation.customizeProperty('kbTitle', {
    	category: "Kabootit",
        title: 'Title',
        description: 'Title meta tag value'
    });
    //  title
    kb_Navigation.customizeProperty('kbPublish', {
    	category: "Kabootit",
        title: 'Publish',
        description: 'Builder only picks up published pages'
    });
    // theme
    kb_Navigation.customizeProperty('kbTheme', {
    	category: "Kabootit",
        title: 'Theme',
        description: 'Pick a theme'
    });
    // layout
    kb_Navigation.customizeProperty('kbResource', {
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
    kb_Navigation.doAfter('init', function() {
        this.node.innerHTML = '<div class="kb-label-navigation"><b>Navigation:</b> ' + this.kbTitle()  + '</div>';
	    var img =  getImg(widgetName);
        $(this.node).css('background', img + ' no-repeat');
    });
});
