(function(kb_Text) {

    /* Default width and height of your widget */
    kb_Text.setWidth('210');
    kb_Text.setHeight('30');

    /* Properties */
    // parent
    kb_Text.customizeProperty('kbParent', {
    	category: "Kabootit",
        title: 'Parent Tag',
        description: 'Parent tag this kb_Text fits into'
    });
    //  content
    kb_Text.customizeProperty('kbContent', {
    	category: "Kabootit",
        title: 'Content',
        description: 'Any html content',
        multiline: true
    });


    /* Override widget's initialization */
    kb_Text.prototype.init = function() {
        this.node.innerHTML = '<div class="kb-label-text"><b>Text:</b> ' + this.kbParent()  + '</div>';
    };


});

