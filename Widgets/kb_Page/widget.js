WAF.define('kb_Page', ['waf-core/widget'], function(widget) {
	
    var kb_Page = widget.create('kb_Page', {
        init: function() {
        	 
        }
    });
    
    


	// properties
	kb_Page.addProperty('kbTitle', {
	    type: "string",
	    bindable: false,
	    onChange: function(newValue) {
            
            this.node.innerHTML = '<div class="kb-label-page"><b>Page:</b> ' + this.kbTitle()  + '</div>';
        
		     var img =  $('div')
			.filter(function() {
			    return this.id.match(/(?=.*Kabootit)(?=.*Layout)/);
			})
			.find('button')
			.filter(function() {
				return $(this).text() == 'Page';
			})
			.css('background-image');
	        
	        $(this.node).css('background', img + ' no-repeat');
            
        }
	});
	kb_Page.addProperty('kbPublish', {
	    type: "boolean",
	    bindable: false
	});
	kb_Page.addProperty('kbTheme', {
	    type: "enum",
	    "values": {
	    	''				: '',
	        "../quickstart/"	: "Quickstart",
	       	"../sphere/"	: "Sphere",
	       	"../onthegoadmin/"	: "On-the-Go",
	       	"../serenity/"	: "Serenity",
	       	"/mars"	: "Mars",
	       	"/canvas"	: "Canvas",
	       	"../families/"	: "Empowered",
	       	"../super/"	: "Super",
			"/binary" : "Binary"
	    },
	    bindable: false
	});
	kb_Page.addProperty('kbResource', {
		    type: "string",
		    bindable: false
		});
    
    
    kb_Page.inherit('waf-behavior/layout/container');
    kb_Page.addClass('waf-ui-box');

    return kb_Page;

});

