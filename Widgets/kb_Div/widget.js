WAF.define('kb_Div', ['waf-core/widget'], function(widget) {
	
    var kb_Div = widget.create('kb_Div', {
        init: function() {
        	 

        }

    });

	// properties
	kb_Div.addProperty('kbParent', {
	    type: "string",
	    bindable: false,
	    onChange: function(newValue) {
            this.node.innerHTML = '<div class="kb-label-div"><b>Div:</b> ' + newValue  + '</div>';
        }
	});
	kb_Div.addProperty('kbContent', {
	    type: "string",
	    bindable: false
	});
    
    
    kb_Div.inherit('waf-behavior/layout/container');
    kb_Div.addClass('waf-ui-box');

    return kb_Div;

});

