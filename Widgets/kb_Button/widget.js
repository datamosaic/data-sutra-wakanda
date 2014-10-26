WAF.define('kb_Button', ['waf-core/widget'], function(widget) {

	
    var kb_Button = widget.create('kb_Button');
    kb_Button.inherit('waf-behavior/layout/container');
    kb_Button.addClass('waf-ui-box');
	
	kb_Button.prototype.init = function init() {
		this.doMarkup();
	};
	
	kb_Button.prototype.doMarkup = function doMarkup() {
		var
			template = '<button type="button" class="btn {{kbType}} {{kbSize}} {{kbBlock}} {{kbPull}}"  {{disabled}}>{{kbLabel}}</button>',
			data = {
				kbType		: this.kbType(),
				kbSize		: this.kbSize(),
				kbBlock		: this.kbBlock(),
				kbLabel		: this.kbLabel(),
				kbPull		: this.kbPull(),
				disabled	: (this.kbDisabled()) ? 'disabled="disabled"' : null
			};
		$(this.node).attr("data-kb", this.merge(template,data));
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


	/**
	 * Tim (lite): A tiny, secure JavaScript micro-templating script.
	 *   github.com/premasagar/tim
	 *   
	 * @param {String} template
	 * @param {Object} data
	 * 
	 * @example 
	 * 		CMS.markup.merge("Hello {{place}}", {place: "world"})
	 * 			> Hello world
	 * 		CMS.markup.merge("Hello {{place}}. My name is {{person.name}}.", { place: "Brighton", person: { name: "Prem" } })
	 *			> Hello Brighton. My name is Prem.
	 *
	 * @properties={typeid:24,uuid:"E93C4B64-5AC4-4A50-A6EF-8506C5D07371"}
	 */
	kb_Button.prototype.merge = function merge(template, data){

	    var start   = "{{",
	        end     = "}}",
	        path    = "[a-z0-9_][\\.a-z0-9_]*", // e.g. config.person.name
	        pattern = new RegExp(start + "\\s*("+ path +")\\s*" + end, "gi"),
	        undef; 

	        // Merge data into the template string
	        return template.replace(pattern, function(tag, token){
	            path = 	token.split(".")
	            var  	len = path.length,
	                	lookup = data,
	                	i = 0;

	            for (; i < len; i++){
	                lookup = lookup[path[i]];
                
	                // Property not found
	                if (lookup === undef){
	                    throw "tim: '" + path[i] + "' not found in " + tag;
	                }
                
	                // Return the required value
	                if (i === len - 1){
	                    return lookup;
	                }
	            }
	        });
	}

    return kb_Button;

});

