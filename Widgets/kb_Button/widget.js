WAF.define('kb_Button', ['waf-core/widget','kb'], function(widget,kb) {

	
    var kb_Button = widget.create('kb_Button');
    kb_Button.inherit('waf-behavior/layout/container');
	kb_Button.inherit('kb_lib');
    kb_Button.addClass('waf-ui-box');
	
	kb_Button.prototype.init = function init() {
		this.doMarkup();

		console.log(this.helloWorld());
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
			merge = this.merge(template,data);
		// TODO: remove regex once switch to mustache (which handles null better)
		merge = merge.replace(/false|null/g,"");
		merge = merge.replace(/[ \t]{2,}/g," ");
		merge = merge.replace(/[ ]\"[ ]/g,"\"");
		
		$(this.node).attr("data-kb", merge);
		// testing...view in designer console
		console.log(merge);
	};

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

