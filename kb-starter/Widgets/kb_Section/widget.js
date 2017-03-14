WAF.define('kb_Section', ['waf-core/widget'], function(widget) {
	
    var kb_Section = widget.create('kb_Section', {
        init: function() {
        	 

        }

    });

	// properties
	kb_Section.addProperty('kbParent', {
	    type: "string",
	    bindable: false,
	    onChange: function(newValue) {
            this.node.innerHTML = '<div class="kb-label-section"><b>Section:</b> ' + newValue  + '</div>';
            
            var img =  $('div')
			.filter(function() {
			    return this.id.match(/(?=.*Kabootit)(?=.*Layout)/);
			})
			.find('button')
			.filter(function() {
				return $(this).text() == 'Section';
			})
			.css('background-image');
	        
	 	   $(this.node).css('background', img + ' no-repeat');
        }
	});
	kb_Section.addProperty('kbTemplate', {
	    type: "string",
	    bindable: false
	});
    
    
    kb_Section.inherit('waf-behavior/layout/container');
    kb_Section.addClass('waf-ui-box');

    return kb_Section;

});

