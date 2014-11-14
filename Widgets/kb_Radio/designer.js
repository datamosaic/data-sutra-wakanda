(function(kb_Radio) {

    /* Default width and height of your widget */
    kb_Radio.setWidth('210');
    kb_Radio.setHeight('30');

    /* Properties */
    // parent
    kb_Radio.customizeProperty('kbParent', {
    	category: "Kabootit",
        title: 'Parent Tag',
        description: 'Parent tag this kb_Radio fits into'
    });
    //  content
    kb_Radio.customizeProperty('kbContent', {
    	category: "Kabootit",
        title: 'Content',
        description: 'Any html content',
        multiline: true 
    });


    /* Override widget's initialization */
    kb_Radio.prototype.init = function() {
        this.node.innerHTML = '<div class="kb-label-div"><b>Div:</b> ' + this.kbParent()  + '</div>';
    };
   

});

