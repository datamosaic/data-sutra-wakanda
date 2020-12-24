(function(kb_Label) {

    /* Default width and height of your widget */
    kb_Label.setWidth('210');
    kb_Label.setHeight('30');

    /* Properties */
    // parent
    kb_Label.customizeProperty('kbParent', {
    	category: "Kabootit",
        title: 'Parent Tag',
        description: 'Parent tag this kb_Label fits into'
    });
    //  content
    kb_Label.customizeProperty('kbContent', {
    	category: "Kabootit",
        title: 'Content',
        description: 'Any html content',
        multiline: true
    });


    /* Override widget's initialization */
    kb_Label.prototype.init = function() {
        this.node.innerHTML = '<div class="kb-label-div"><b>Div:</b> ' + this.kbParent()  + '</div>';
    };


});

