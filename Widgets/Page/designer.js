(function(Page) {

    /* Default width and height of your widget */
    Page.setWidth('400');
    Page.setHeight('40');

    /* Properties */
    
    // page title
    Page.customizeProperty('kbTitle', {
    	category: "Kabootit",
        title: 'Title',
        description: 'Title meta tag value'
    });
    // page title
    Page.customizeProperty('kbPublish', {
    	category: "Kabootit",
        title: 'Publish',
        description: 'Builder only picks up published pages'
    });
    // theme
    Page.customizeProperty('kbTheme', {
    	category: "Kabootit",
        title: 'Theme',
        description: 'Pick a theme'
    });
    // layout
    Page.customizeProperty('kbLayout', {
    	category: "Kabootit",
        title: 'Layout',
        description: 'Specify theme layout'
    });
    // sections
    Page.customizeProperty('kbSections', {
    	category: "Kabootit",
        title: 'Sections',
        description: 'Map theme tags to resources'
    });





    /* Override widget's initialization */
    Page.prototype.init = function() {
        this.node.innerHTML = "<div class='kb-label-kabootit'><b>Kabootit:</b> Page</div>";
    }

});

// For more information, refer to http://doc.wakanda.org/Wakanda0.DevBranch/help/Title/en/page3870.html