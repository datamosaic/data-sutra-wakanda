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
			template = '<button id="kb-id" type="button" class="btn {{kbType}} {{kbSize}} {{kbBlock}} {{kbPull}}"  {{disabled}}>{{kbLabel}}</button>',
			data = {
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
		
		// merge = JSON.stringify(merge);
		
		// RACTIVE v1: working out organization
		//1. v1 ractive...node.innerHTML is target for ractive code in step 3
		this.node.innerHTML = '<div style="display:none;" kb-data=\'' + merge + '\'></div><div class="kb-label-button"><b>Button: </b>' + this.kbLabel()  + '</div>';
		//2. <script id="xxx" type="text/template"> template goes here </script>
			// add into this.node.innerHTML for builder to grab
		//3. <script>ractive setup code here. will run on html page on render. use hard coded data</script>
			// add into this.node.innerHTML for builder to grab
		
		// RACTIVE v2: get data in dynamically
		
		// RACTIVE v3: synchronize client data with server data using websockets
		
	};

    return kb_Button;

});

