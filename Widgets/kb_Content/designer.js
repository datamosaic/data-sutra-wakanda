(function(kb_Content) {

	var widgetName = "Content";

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
	
	
    kb_Content.doAfter('init', function() {
        this.node.innerHTML = '<div class="kb-label-content"><b>Content:</b> ' + this.kbTitle()  + '</div>';
        
	    var img =  getImg(widgetName);
        $(this.node).css('background', img + ' no-repeat');
    });

});

