WAF.define('kb_Grid', ['waf-core/widget'], function(widget) {

    var kb_Grid = widget.create('kb_Grid', {
        init: function() {


        }

    });

	// properties
	kb_Grid.addProperty('kbParent', {
	    type: "string",
	    bindable: false,
	    onChange: function(newValue) {
            this.node.innerHTML = '<div class="kb-label-div"><b>Div:</b> ' + newValue  + '</div>';
        }
	});
	kb_Grid.addProperty('kbContent', {
	    type: "string",
	    bindable: false
	});


    kb_Grid.inherit('waf-behavior/layout/container');
    kb_Grid.addClass('waf-ui-box');

    return kb_Grid;

});

