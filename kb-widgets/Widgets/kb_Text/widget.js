WAF.define('kb_Text', ['waf-core/widget'], function(widget) {
	
    var kb_Text = widget.create('kb_Text', {
        init: function() {
        	 

        }

    });

	// properties
	kb_Text.addProperty('kbParent', {
	    type: "string",
	    bindable: false,
	    onChange: function(newValue) {
            this.node.innerHTML = '<div class="kb-label-text"><b>Text:</b> ' + newValue  + '</div>';
        }
	});
	kb_Text.addProperty('kbContent', {
	    type: "string",
	    bindable: false
	});
    
    
    kb_Text.inherit('waf-behavior/layout/container');
    kb_Text.addClass('waf-ui-box');

    return kb_Text;

});

