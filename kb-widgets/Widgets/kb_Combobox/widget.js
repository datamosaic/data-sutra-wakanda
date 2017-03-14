WAF.define('kb_Combobox', ['waf-core/widget'], function(widget) {
	
    var kb_Combobox = widget.create('kb_Combobox', {
        init: function() {
        	 

        }

    });

	// properties
	kb_Combobox.addProperty('kbParent', {
	    type: "string",
	    bindable: false,
	    onChange: function(newValue) {
            this.node.innerHTML = '<div class="kb-label-div"><b>Div:</b> ' + newValue  + '</div>';
        }
	});
	kb_Combobox.addProperty('kbContent', {
	    type: "string",
	    bindable: false
	});
    
    
    kb_Combobox.inherit('waf-behavior/layout/container');
    kb_Combobox.addClass('waf-ui-box');

    return kb_Combobox;

});

