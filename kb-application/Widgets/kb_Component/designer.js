(function(kb_Component) {
	
	var widgetName = "Component";

    /* Default width and height of your widget */
    kb_Component.setWidth('200');
    kb_Component.setHeight('200');

    /* Properties */
    // parent
    kb_Component.customizeProperty('kbParent', {
    	category: "Kabootit",
        title: 'Parent Tag',
        description: 'Parent tag this kb_Component fits into'
    });
    // resource
    kb_Component.customizeProperty('kbResource', {
    	category: "Kabootit",
        title: 'Resource',
        description: 'Specify resource'
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
	
    kb_Component.doAfter('init', function() {
        this.node.innerHTML = '<div class="kb-label-component"><b>Component:</b> ' + this.kbParent()  + '</div>';
		
	    var img =  getImg(widgetName);
        $(this.node).css('background', img + ' no-repeat');
    });
   

});

