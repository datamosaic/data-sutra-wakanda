(function(kb_Grid) {

    /* Default width and height of your widget */
    kb_Grid.setWidth('200');
    kb_Grid.setHeight('200');

    /* Properties */
    // parent
    kb_Grid.customizeProperty('kbParent', {
    	category: "Kabootit",
        title: 'Parent Tag',
        description: 'Parent tag this kb_Grid fits into'
    });
    //  content
    kb_Grid.customizeProperty('kbContent', {
    	category: "Kabootit",
        title: 'Content',
        description: 'Any html content',
        multiline: true 
    });


    /* Override widget's initialization */
    kb_Grid.prototype.init = function() {
        this.node.innerHTML = '<div class="kb-label-div"><b>Div:</b> ' + this.kbParent()  + '</div>';
    };
   

});

