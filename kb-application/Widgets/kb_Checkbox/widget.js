WAF.define('kb_Checkbox', ['waf-core/widget'], function(widget) {
	
    var kb_Checkbox = widget.create('kb_Checkbox', {
        init: function() {
        	 

        }

    });

	// properties
	kb_Checkbox.addProperty('kbParent', {
	    type: "string",
	    bindable: false,
	    onChange: function(newValue) {
            this.node.innerHTML = '<div class="kb-label-div"><b>Div:</b> ' + newValue  + '</div>';
        }
	});
	kb_Checkbox.addProperty('kbContent', {
	    type: "string",
	    bindable: false
	});
    
    
    kb_Checkbox.inherit('waf-behavior/layout/container');
    kb_Checkbox.addClass('waf-ui-box');

    return kb_Checkbox;

});

