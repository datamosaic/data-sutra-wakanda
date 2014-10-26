
WAF.define('kb_Form', ['waf-core/widget'], function(widget, kb_FormRow) {

    var kb_Form = widget.create('kb_Form', {
        init: function() {
        	 
        }
    });
    
    kb_Form.addClass('waf-ui-box');
    
    kb_Form.inherit('waf-behavior/layout/container');
    
    // properties
	kb_Form.addProperty('kbTitle', {
	    type: "string",
	    bindable: false,
	    onChange: function(newValue) {
            
            this.node.innerHTML = '<div class="kb-label-form"><b>Form:</b> ' + this.kbTitle()  + '</div>';
        
		     var img =  $('div')
			.filter(function() {
			    return this.id.match(/(?=.*Kabootit)(?=.*Layout)/);
			})
			.find('button')
			.filter(function() {
				return $(this).text() == 'Form';
			})
			.css('background-image');
	        
	        $(this.node).css('background', img + ' no-repeat');
            
        }
	});
	kb_Form.addProperty('kbTemplate', {
	    type: "string",
	    bindable: false,
		defaultValue: "{{{widgets}}}"
	});


    return kb_Form;

});