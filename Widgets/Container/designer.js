(function(Container) {

    /* Default width and height of your widget */
    Container.setWidth('200');
    Container.setHeight('200');

    /* Properties */
    
    //  title
    Container.customizeProperty('kbTemplate', {
    	category: "Kabootit",
        title: 'Template',
        description: 'Title meta tag value',
        multiline: true 
    });


    // layout
    Container.customizeProperty('kbTemplate', {
    	category: "Kabootit",
        title: 'Template',
        description: 'Specify theme layout'
    });
    // sections
    Container.customizeProperty('kbChildren', {
    	category: "Kabootit",
        title: 'Children',
        description: 'Map theme tags to resources'
    });

    /* Override widget's initialization */
//    Container.prototype.init = function() {
//        this.node.innerHTML = "<div class='kb-label-kabootit'><b>Kabootit:</b> Container</div>";
//    };
    

    Container.doAfter('init', function() {
    	setTimeout(function() {
		    $('#textInput-id').change(function(event) {
	    	 	console.log(event.target.value);
	    	 } );
		}, 100);
    	
//    	console.log(this);
    	
    });

});

