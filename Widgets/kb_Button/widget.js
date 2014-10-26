WAF.define('kb_Button', ['waf-core/widget', 'utils'], function(widget,utils) {

	
    var kb_Button = widget.create('kb_Button');
    kb_Button.inherit('waf-behavior/layout/container');
    kb_Button.addClass('waf-ui-box');
	
	kb_Button.prototype.init = function init() {
		this.doMarkup();
	};
	
	// properties
	kb_Button.addProperty('kbTemplate', {
	    type: "string",
	    bindable: false,
		defaultValue: "{{{widget}}}"
	});
	kb_Button.addProperty('kbLabel', {
	    type: "string",
	    bindable: false,
		onChange: function(newValue) {
			this.node.innerHTML = '<div class="kb-label-button"><b>Button: </b>' + this.kbLabel()  + '</div>';
			this.doMarkup();
		}
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
	    bindable: false,
		onChange: function(newValue) {
			this.doMarkup();
		}
	});
	kb_Button.addProperty('kbSize', {
	    type: "enum",
	    "values": {
	    	''			: 'Default',
			'btn-lg'	: 'Large',
			'btn-sm'	: 'Small',
			'btn-xs'	: 'Extra-small'
	    },
	    bindable: false,
		onChange: function(newValue) {
			this.doMarkup();
		}
	});
	kb_Button.addProperty('kbBlock', { 
	    type: 'boolean',
	    defaultValue: false,
	    bindable: false,
		onChange: function(newValue) {
			this.doMarkup();
		}
	});
	kb_Button.addProperty('kbPull', {
	    type: "enum",
	    "values": {
	    	''				: 'None',
			'pull-left'		: 'Left',
			'pull-right'	: 'Right'
	    },
	    bindable: false,
		onChange: function(newValue) {
			this.doMarkup();
		}
	});
	kb_Button.addProperty('kbDisabled', { 
	    type: 'boolean',
	    defaultValue: false,
	    bindable: false,
		onChange: function(newValue) {
			this.doMarkup();
		}
	});

	/**
	 * doMarkup
	 * store widget client markup in attr "data-kb"
	 * 
	 * TODO:
	 * 		- add any data bindings
	 *		- add required wakanda widget attr's(?)
	 * 		- add event bindings
	 */
	kb_Button.prototype.doMarkup = function doMarkup() {
		var
			template = '<button id="{{id}}" data-lib="WAF" data-type="kb_Button" type="button" class="btn {{kbType}} {{kbSize}} {{kbBlock}} {{kbPull}}"  {{disabled}}>{{kbLabel}}</button>',
			data = {
				id			: "{{id}}", // picked up by builder because i can't attach an onChange to ID property
				kbType		: this.kbType(),
				kbSize		: this.kbSize(),
				kbBlock		: (this.kbBlock()) ? 'btn-block' : null,
				kbLabel		: this.kbLabel(),
				kbPull		: this.kbPull(),
				disabled	: (this.kbDisabled()) ? 'disabled="disabled"' : null
			},
			merge = utils.merge(template,data);
		// TODO: remove regex once switch to mustache (which handles null better)
		merge = merge.replace(/false|null/g,"");
		merge = merge.replace(/[ \t]{2,}/g," ");
		merge = merge.replace(/[ ]\"[ ]/g,"\"");
		
		$(this.node).attr("data-kb", merge);
		// testing...view in designer console
		console.log(merge);
	};

    return kb_Button;

});

