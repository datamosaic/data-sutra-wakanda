(function(kb_Button) {
	
	var widgetName = "Button";

    kb_Button.setWidth('210');
    kb_Button.setHeight('30');

    /* Properties */
    kb_Button.customizeProperty('kbTemplate', {
    	category: "Kabootit",
        title: 'Template',
        description: 'Mustache tag "widget" required',
        multiline: true 
    });
    kb_Button.customizeProperty('kbLabel', {
    	category: "Kabootit",
        title: 'Label',
        description: 'Label for input'
    });
    kb_Button.customizeProperty('kbType', {
    	category: "Kabootit",
        title: 'Type',
        description: 'Type of button'
    });
    kb_Button.customizeProperty('kbSize', {
    	category: "Kabootit",
        title: 'Size',
        description: 'Size of button'
    });
    kb_Button.customizeProperty('kbBlock', {
    	category: "Kabootit",
        title: 'Block',
        description: 'Display full width of parent'
    });
    kb_Button.customizeProperty('kbPull', {
    	category: "Kabootit",
        title: 'Pull',
        description: 'Optional pull to right or left'
    });
    kb_Button.customizeProperty('kbDisabled', {
    	category: "Kabootit",
        title: 'Disabled',
        description: 'Default state of button is disabled'
    });
	
	
	/* designer load code */
	function getImg(widgetName) {
		// grab img used
		var img =  $('div')
		.filter(function() {
		    return this.id.match(/(?=.*Kabootit)(?=.*Widgets)/);
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
	
    kb_Button.doAfter('init', function() {
        this.node.innerHTML = '<div class="kb-label-button"><b>Button: </b>' + this.kbLabel()  + '</div>';

	    var img =  getImg(widgetName);
        $(this.node).css('background', img + ' no-repeat');
    });
   

});

