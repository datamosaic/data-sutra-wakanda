WAF.define('kb_Container', ['waf-core/widget'], function(widget) {

    var kb_Container = widget.create('kb_Container', {
        init: function() {


        }

    });

	// properties
	kb_Container.addProperty('kbParent', {
	    type: "string",
	    bindable: false,
	    onChange: function(newValue) {
            this.node.innerHTML = '<div class="kb-label-container"><b>Container:</b> ' + newValue  + '</div>';

            var img =  $('div')
			.filter(function() {
			    return this.id.match(/(?=.*Kabootit)(?=.*Layout)/);
			})
			.find('button')
			.filter(function() {
				return $(this).text() == 'Container';
			})
			.css('background-image');

	 	   $(this.node).css('background', img + ' no-repeat');
        }
	});
	kb_Container.addProperty('kbTemplate', {
	    type: "string",
	    bindable: false
	});


    kb_Container.inherit('waf-behavior/layout/container');
    kb_Container.addClass('waf-ui-box');

    return kb_Container;

});

