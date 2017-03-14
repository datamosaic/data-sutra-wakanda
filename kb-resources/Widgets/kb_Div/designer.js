(function(kb_Div) {

    /* Default width and height of your widget */
    kb_Div.setWidth('200');
    kb_Div.setHeight('200');

    /* Properties */
    // parent
    kb_Div.customizeProperty('kbParent', {
    	category: "Kabootit",
        title: 'Parent Tag',
        description: 'Parent tag this kb_Div fits into'
    });
    //  content
    kb_Div.customizeProperty('kbContent', {
    	category: "Kabootit",
        title: 'Content',
        description: 'Any html content',
        multiline: true 
    });


    /* Override widget's initialization */
    kb_Div.prototype.init = function() {
        this.node.innerHTML = '<div class="kb-label-div"><b>Div:</b> ' + this.kbParent()  + '</div>';
    };
   

});

