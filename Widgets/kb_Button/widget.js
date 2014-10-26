WAF.define('kb_Button', ['waf-core/widget'], function(widget) {
	
    var kb_Button = widget.create('kb_Button', {
        init: function() {
        	 

        }

    });

	// properties
	kb_Button.addProperty('kbTemplate', {
	    type: "string",
	    bindable: false,
		defaultValue: "{{{widget}}}"
	});
	kb_Button.addProperty('kbType', {
	    type: "enum",
	    "values": {
	    	'btn-default'	: 'Default',
			'btn-primary'	: 'Primary',
			'btn-success'	: 'Success',
			'btn-info'		: 'Info',
			'btn-warning'	: 'Warning',
			'btn-danger'	: 'Danger',
			'btn-link'		: 'Link'
	    },
	    bindable: false
	});
	kb_Button.addProperty('kbSize', {
	    type: "enum",
	    "values": {
	    	''			: 'Default',
			'btn-lg'	: 'Large',
			'btn-sm'	: 'Small',
			'btn-xs'	: 'Extra-small'
	    },
	    bindable: false
	});
	kb_Button.addProperty('kbBlock', { 
	    type: 'boolean',
	    defaultValue: false,
	    bindable: false
	});
	kb_Button.addProperty('kbPull', {
	    type: "enum",
	    "values": {
	    	''				: 'None',
			'pull-left'		: 'Left',
			'pull-right'	: 'Right'
	    },
	    bindable: false
	});
	kb_Button.addProperty('kbDisabled', { 
	    type: 'boolean',
	    defaultValue: false,
	    bindable: false
	});
    
    kb_Button.inherit('waf-behavior/layout/container');
    kb_Button.addClass('waf-ui-box');

    return kb_Button;

});

