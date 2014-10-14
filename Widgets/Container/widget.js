WAF.define('Container', ['waf-core/widget'], function(widget) {
	
    var Container = widget.create('Container', {
        init: function() {
        	 

        }

    });

	// properties
	Container.addProperty('kbTemplate', {
	    type: "string",
	    bindable: false
	});
	Container.addProperty('kbChildren', {
	    type: "list",
	    attributes: [{
	        name: 'tag'
	    }, {
	        name: 'resource'
	    }],
	    bindable: false
	});
    
    
    Container.inherit('waf-behavior/layout/container');
    Container.addClass('waf-ui-box');

    return Container;

});

/* For more information, refer to http://doc.wakanda.org/Wakanda0.DevBranch/help/Title/en/Container3871.html */