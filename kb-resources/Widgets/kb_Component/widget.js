WAF.define('kb_Component', ['waf-core/widget'], function(widget) {

    var kb_Component = widget.create('kb_Component', {
        init: function() {


        }

    });

	// properties
	kb_Component.addProperty('kbParent', {
	    type: "string",
	    bindable: false,
	    onChange: function(newValue) {
            this.node.innerHTML = '<div class="kb-label-component"><b>Component:</b> ' + newValue  + '</div>';
        }
	});
	kb_Component.addProperty('kbResource', {
	    type: "string",
	    bindable: false
	});



    kb_Component.inherit('waf-behavior/layout/container');
    kb_Component.addClass('waf-ui-box');

    return kb_Component;

});

