
WAF.define('kb_Data', ['waf-core/widget'], function(widget, kb_DataRow) {

    var kb_Data = widget.create('kb_Data', {
        init: function() {
        	 
        }
    });
    
    kb_Data.addClass('waf-ui-box');
    
    kb_Data.inherit('waf-behavior/layout/container');
    
    // properties
	kb_Data.addProperty('kbTitle', {
	    type: "string",
	    bindable: false,
	    onChange: function(newValue) {
            
            this.node.innerHTML = '<div class="kb-label-data"><b>Data:</b> ' + this.kbTitle()  + '</div>';
        
		     var img =  $('div')
			.filter(function() {
			    return this.id.match(/(?=.*Kabootit)(?=.*Layout)/);
			})
			.find('button')
			.filter(function() {
				return $(this).text() == 'Data';
			})
			.css('background-image');
	        
	        $(this.node).css('background', img + ' no-repeat');
            
        }
	});


    return kb_Data;

});