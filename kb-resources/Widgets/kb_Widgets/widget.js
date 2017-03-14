
WAF.define('kb_Widgets', ['waf-core/widget'], function(widget, kb_WidgetsRow) {

    var kb_Widgets = widget.create('kb_Widgets', {
        init: function() {
        	 
        }
    });
    
    kb_Widgets.addClass('waf-ui-box');
    
    kb_Widgets.inherit('waf-behavior/layout/container');
    
    // properties
	kb_Widgets.addProperty('kbTitle', {
	    type: "string",
	    bindable: false,
	    onChange: function(newValue) {
            
            this.node.innerHTML = '<div class="kb-label-widgets"><b>Widgets:</b> ' + this.kbTitle()  + '</div>';
        
		     var img =  $('div')
			.filter(function() {
			    return this.id.match(/(?=.*Kabootit)(?=.*Layout)/);
			})
			.find('button')
			.filter(function() {
				return $(this).text() == 'Widgets';
			})
			.css('background-image');
	        
	        $(this.node).css('background', img + ' no-repeat');
            
        }
	});
	kb_Widgets.addProperty('kbTemplate', {
	    type: "string",
	    bindable: false,
		defaultValue: "{{{widgets}}}"
	});


    return kb_Widgets;

});