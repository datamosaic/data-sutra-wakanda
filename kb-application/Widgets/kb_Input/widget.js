WAF.define('kb_Input', ['waf-core/widget'], function(widget) {
    var kb_Input = widget.create('kb_Input', {
        init: function() {
        }
    });
	// properties
	kb_Input.addProperty('kbTemplate', {
	    type: "string",
	    bindable: false,
		defaultValue: "{{{widget}}}"
	});
	kb_Input.addProperty('kbLabel', {
	    type: "string",
	    bindable: false,
		onChange: function(newValue) {
			this.node.innerHTML = '<div class="kb-label-input"><b>Input: </b>' + this.kbLabel()  + '</div>';
		}
	});
	kb_Input.addProperty('kbPlaceholder', {
	    type: "string",
	    bindable: false
	});
	kb_Input.addProperty('kbType', {
	    type: "enum",
	    "values": {
	    	'text'				: 'Text',
			'password'			: 'Password',
			'datetime'			: 'Datetime',
			'datetime-local'	: 'Datetime local',
			'date'				: 'Date',
			'month'				: 'Month',
			'time'				: 'Time',
			'week'				: 'Week',
			'number'			: 'Number',
			'email'				: 'Email',
			'url'				: 'URL',
			'search'			: 'Search',
			'tel'				: 'Phone',
			'color'				: 'Color',
			''					: '---',
			'textarea'			: 'Text area'
	    },
	    bindable: false
	});
	kb_Input.addProperty('kbRows', {
	    type: "string",
	    bindable: false
	});
    kb_Input.inherit('waf-behavior/layout/container');
    kb_Input.addClass('waf-ui-box');
    return kb_Input;
});
