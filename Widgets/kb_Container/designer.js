(function(kb_Container) {

	var widgetName = "Container";

    kb_Container.setWidth('200');
    kb_Container.setHeight('200');

    /* Properties */
    // parent
    kb_Container.customizeProperty('kbParent', {
    	category: "Kabootit",
        title: 'Parent Tag',
        description: 'Parent tag this kb_Container fits into'
    });
    //  template
    kb_Container.customizeProperty('kbTemplate', {
    	category: "Kabootit",
        title: 'Template',
        description: 'Mustache tags are children containers',
        multiline: true 
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
	
    kb_Container.doAfter('init', function() {
        this.node.innerHTML = '<div class="kb-label-container"><b>Container:</b> ' + this.kbParent()  + '</div>';

	    var img =  getImg(widgetName);
        $(this.node).css('background', img + ' no-repeat');
    });
   

});

