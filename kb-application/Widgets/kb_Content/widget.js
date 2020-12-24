
WAF.define('kb_Content', ['waf-core/widget'], function(widget, kb_ContentRow) {

    var kb_Content = widget.create('kb_Content', {
        init: function() {

        }
    });

    kb_Content.addClass('waf-ui-box');

    kb_Content.inherit('waf-behavior/layout/container');

    // properties
	kb_Content.addProperty('kbTitle', {
	    type: "string",
	    bindable: false
//	    onChange: function(newValue) {
//            this.node.innerHTML = '<div class="kb-label-content"><b>Content:</b> ' + this.kbTitle()  + '</div>';

//        }
	});
	kb_Content.addProperty('kbFormatted', {
	    type: 'boolean',
	    defaultValue: true,
	    bindable: false,
		onChange: function(newValue) {
			// this.doMarkup();
		}
	});
	kb_Content.addProperty('kbTemplate', {
	    type: "string",
	    defaultValue: "{{{widgets}}}",
	    bindable: false
	});


    return kb_Content;

});