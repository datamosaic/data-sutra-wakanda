(function(kb_Checkbox) {

    /* Default width and height of your widget */
    kb_Checkbox.setWidth('200');
    kb_Checkbox.setHeight('200');

    /* Properties */
    // parent
    kb_Checkbox.customizeProperty('kbParent', {
    	category: "Kabootit",
        title: 'Parent Tag',
        description: 'Parent tag this kb_Checkbox fits into'
    });
    //  content
    kb_Checkbox.customizeProperty('kbContent', {
    	category: "Kabootit",
        title: 'Content',
        description: 'Any html content',
        multiline: true 
    });


    /* Override widget's initialization */
    kb_Checkbox.prototype.init = function() {
        this.node.innerHTML = '<div class="kb-label-div"><b>Div:</b> ' + this.kbParent()  + '</div>';
    };
   

});

