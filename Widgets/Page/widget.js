WAF.define('Page', ['waf-core/widget'], function(widget) {
	
    var Page = widget.create('Page', {
        init: function() {
        }
        


    });

	// properties
	Page.addProperty('kbTitle', {
	    type: "string",
	    bindable: false
	});
	Page.addProperty('kbPublish', {
	    type: "boolean",
	    bindable: false
	});
	Page.addProperty('kbTheme', {
	    type: "enum",
	    "values": {
	    	''				: '',
	        "../Quickstart/"	: "Quickstart",
	       	"../Sphere/"	: "Sphere",
	       	"../onthegoadmin/"	: "On-the-Go",
	       	"../serenity/"	: "Serenity",
	       	"/mars"	: "Mars",
	       	"../empowered/"	: "Empowered",
	       	"../super/"	: "Super"
	    },
	    bindable: false
	});
	Page.addProperty('kbLayout', {
		    type: "string",
		    bindable: false
		});	
	Page.addProperty('kbSections', {
	    type: "list",
	    attributes: [{
	        name: 'tag'
	    }, {
	        name: 'resource'
	    }],
	    bindable: false
	});
    
    
    Page.inherit('waf-behavior/layout/container');
    Page.addClass('waf-ui-box');

    return Page;

});

/* For more information, refer to http://doc.wakanda.org/Wakanda0.DevBranch/help/Title/en/page3871.html */