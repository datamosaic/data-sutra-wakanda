WAF.define('kb_Radio', ['waf-core/widget'], function(widget) {
	
    var kb_Radio = widget.create('kb_Radio', {
        init: function() {
        	 

        }

    });

	// properties
	kb_Radio.addProperty('kbParent', {
	    type: "string",
	    bindable: false,
	    onChange: function(newValue) {
            this.node.innerHTML = '<div class="kb-label-div"><b>Div:</b> ' + newValue  + '</div>';
        }
	});
	kb_Radio.addProperty('kbContent', {
	    type: "string",
	    bindable: false
	});
    
    
    kb_Radio.inherit('waf-behavior/layout/container');
    kb_Radio.addClass('waf-ui-box');

    return kb_Radio;

});

