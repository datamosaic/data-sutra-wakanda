WAF.define('kb_Navigation', ['waf-core/widget'], function(widget) {

    var kb_Navigation = widget.create('kb_Navigation', {
        init: function() {

        }
    });




	// properties
	kb_Navigation.addProperty('kbTitle', {
	    type: "string",
	    bindable: false,
	    onChange: function(newValue) {

            this.node.innerHTML = '<div class="kb-label-navigation"><b>Navigation:</b> ' + this.kbTitle()  + '</div>';

		     var img =  $('div')
			.filter(function() {
			    return this.id.match(/(?=.*Kabootit)(?=.*Layout)/);
			})
			.find('button')
			.filter(function() {
				return $(this).text() == 'Navigation';
			})
			.css('background-image');

	        $(this.node).css('background', img + ' no-repeat');

        }
	});
	kb_Navigation.addProperty('kbPublish', {
	    type: "boolean",
	    bindable: false
	});
	kb_Navigation.addProperty('kbTheme', {
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
	kb_Navigation.addProperty('kbResource', {
		    type: "string",
		    bindable: false
		});


    kb_Navigation.inherit('waf-behavior/layout/container');
    kb_Navigation.addClass('waf-ui-box');

    return kb_Navigation;

});

