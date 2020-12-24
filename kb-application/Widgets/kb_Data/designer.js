(function(kb_Data) {
	var widgetName = "Data";
    kb_Data.setWidth('210');
    kb_Data.setHeight('30');
    /* Properties */
    // parent
    kb_Data.customizeProperty('kbTitle', {
    	category: "Kabootit",
        title: 'Title',
        description: 'Parent tag this kb_Data fits into'
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
    kb_Data.doAfter('init', function() {
        this.node.innerHTML = '<div class="kb-label-data"><b>Data:</b> ' + this.kbTitle()  + '</div>';
	    var img =  getImg(widgetName);
        $(this.node).css('background', img + ' no-repeat');
    });
});
