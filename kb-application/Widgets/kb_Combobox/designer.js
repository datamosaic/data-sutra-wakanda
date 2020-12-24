(function(kb_Combobox) {

    /* Default width and height of your widget */
    kb_Combobox.setWidth('210');
    kb_Combobox.setHeight('30');

    /* Properties */
    // parent
    kb_Combobox.customizeProperty('kbParent', {
    	category: "Kabootit",
        title: 'Parent Tag',
        description: 'Parent tag this kb_Combobox fits into'
    });
    //  content
    kb_Combobox.customizeProperty('kbContent', {
    	category: "Kabootit",
        title: 'Content',
        description: 'Any html content',
        multiline: true
    });


    /* Override widget's initialization */
    kb_Combobox.prototype.init = function() {
        this.node.innerHTML = '<div class="kb-label-div"><b>Div:</b> ' + this.kbParent()  + '</div>';
    };


});

