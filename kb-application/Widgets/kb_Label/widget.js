WAF.define('kb_Label', ['waf-core/widget'], function(widget) {
    var kb_Label = widget.create('kb_Label', {
        init: function() {
        }
    });
	// properties
	kb_Label.addProperty('kbParent', {
	    type: "string",
	    bindable: false,
	    onChange: function(newValue) {
            this.node.innerHTML = '<div class="kb-label-div"><b>Div:</b> ' + newValue  + '</div>';
        }
	});
	kb_Label.addProperty('kbContent', {
	    type: "string",
	    bindable: false
	});
    kb_Label.inherit('waf-behavior/layout/container');
    kb_Label.addClass('waf-ui-box');
    return kb_Label;
});
