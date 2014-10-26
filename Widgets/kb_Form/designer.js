(function(kb_Form) {

	var widgetName = "Form";

    /* Default width and height of your widget */
    kb_Form.setWidth('400');
    kb_Form.setHeight('500');

    /* Properties */
    // parent
    kb_Form.customizeProperty('kbTitle', {
    	category: "Kabootit",
        title: 'Title',
        description: 'Parent tag this kb_Form fits into'
    });
    //  template
    kb_Form.customizeProperty('kbTemplate', {
    	category: "Kabootit",
        title: 'Template',
        description: 'Must include mustache tag = "widgets"',
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
	
	
    kb_Form.doAfter('init', function() {
        this.node.innerHTML = '<div class="kb-label-form"><b>Form:</b> ' + this.kbTitle()  + '</div>';
        
	    var img =  getImg(widgetName);
        $(this.node).css('background', img + ' no-repeat');
    });

});

