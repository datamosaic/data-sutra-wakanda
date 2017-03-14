(function(kb_Image) {
	
	var widgetName = "Image";

    kb_Image.setWidth('210');
    kb_Image.setHeight('30');

    /* Properties */
    kb_Image.customizeProperty('kbTemplate', {
    	category: "Kabootit",
        title: 'Template',
        description: 'Mustache tag "widget" required',
        multiline: true 
    });
    kb_Image.customizeProperty('kbLabel', {
    	category: "Kabootit",
        title: 'Label',
        description: 'Label for input'
    });
    kb_Image.customizeProperty('kbType', {
    	category: "Kabootit",
        title: 'Type',
        description: 'Type of button'
    });
    kb_Image.customizeProperty('kbSize', {
    	category: "Kabootit",
        title: 'Size',
        description: 'Size of button'
    });
    kb_Image.customizeProperty('kbBlock', {
    	category: "Kabootit",
        title: 'Block',
        description: 'Display full width of parent'
    });
    kb_Image.customizeProperty('kbPull', {
    	category: "Kabootit",
        title: 'Pull',
        description: 'Optional pull to right or left'
    });
    kb_Image.customizeProperty('kbDisabled', {
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
	
    kb_Image.doAfter('init', function() {
        this.node.innerHTML = '<div kb-data=""></div><div class="kb-label-image"><b>Image: </b>' + this.kbLabel()  + '</div>';
		// this.node.setAttribute('data-kb','some value');
		console.log($(this.node));
	    var img =  getImg(widgetName);
        $(this.node).css('background', img + ' no-repeat');
    });
   

});

