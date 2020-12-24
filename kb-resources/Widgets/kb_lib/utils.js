WAF.define('utils', [], function() {

	var utils = {};

	utils.test = function () {
		return "word";
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
	utils.merge = function merge(template, data){

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
	};


	return utils;


});