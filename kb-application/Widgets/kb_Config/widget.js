WAF.define('kb_Config', ['waf-core/widget'], function(widget) {

    var kb_Config = widget.create('kb_Config', {
        init: function() {

        }
    });




	// properties
	kb_Config.addProperty('kbTitle', {
	    type: "string",
	    bindable: false,
	    onChange: function(newValue) {

            this.node.innerHTML = '<div class="kb-label-config"><b>Config:</b> ' + this.kbTitle()  + '</div>';

		     var img =  $('div')
			.filter(function() {
			    return this.id.match(/(?=.*Kabootit)(?=.*Layout)/);
			})
			.find('button')
			.filter(function() {
				return $(this).text() == 'Config';
			})
			.css('background-image');

	        $(this.node).css('background', img + ' no-repeat');

        }
	});
	kb_Config.addProperty('kbPublish', {
	    type: "boolean",
	    bindable: false
	});
	kb_Config.addProperty('kbTheme', {
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
	kb_Config.addProperty('kbResource', {
		    type: "string",
		    bindable: false
		});


    kb_Config.inherit('waf-behavior/layout/container');
    kb_Config.addClass('waf-ui-box');

    return kb_Config;

});

