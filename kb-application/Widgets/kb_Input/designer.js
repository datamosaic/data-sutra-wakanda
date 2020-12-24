(function(kb_Input) {
	var widgetName = "Input";
    kb_Input.setWidth('210');
    kb_Input.setHeight('30');
    /* Properties */
    kb_Input.customizeProperty('kbTemplate', {
    	category: "Kabootit",
        title: 'Template',
        description: 'Mustache tag "widget" required',
        multiline: true
    });
    kb_Input.customizeProperty('kbLabel', {
    	category: "Kabootit",
        title: 'Label',
        description: 'Label for input'
    });
    kb_Input.customizeProperty('kbPlaceholder', {
    	category: "Kabootit",
        title: 'Placeholder',
        description: 'Placeholder text to be displayed in input'
    });
    kb_Input.customizeProperty('kbType', {
    	category: "Kabootit",
        title: 'Type',
        description: 'Determines keyboard on mobile devices'
    });
    kb_Input.customizeProperty('kbRows', {
    	category: "Kabootit",
        title: 'Rows',
        description: 'Amount of rows if text area'
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
    kb_Input.doAfter('init', function() {
        this.node.innerHTML = '<div class="kb-label-input"><b>Input: </b>' + this.kbLabel()  + '</div>';
	    var img =  getImg(widgetName);
        $(this.node).css('background', img + ' no-repeat');
    });
});
