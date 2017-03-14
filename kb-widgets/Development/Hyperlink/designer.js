(function(Hyperlink) {

    /*Default width and height of your widget when added to the Page*/
    Hyperlink.setWidth('200');
    Hyperlink.setHeight('20');

    /*Customize existing properties*/
    Hyperlink.customizeProperty('url', {
        title: 'URL/Email',
        description: 'A datasource attribute containing a URL or email.',
        display: false,
        sourceDisplay: true
    });
    Hyperlink.customizeProperty('urlText', {
        title: 'Link text',
        description: 'A datasource attribute containing the text to display for the hyperlink.',
        display: false,
        sourceDisplay: true
    });
    Hyperlink.customizeProperty('defaultText', {
        title: 'Default text',
        multiline: 'true',
        description: 'The default text to display if the URL Text is blank.',
        display: true,
        sourceDisplay: false
    });
    Hyperlink.customizeProperty('target', {
        title: 'Target',
        description: 'Target for the URL.'
    });

    /*Include a label property*/
    Hyperlink.addLabel({
        defaultValue: 'Hyperlink',
        position: 'left'
    });

    /*Set the Design and Styles panels*/
    Hyperlink.setPanelStyle({
        'fClass': true,
        'text': true,
        'background': true,
        'border': true,
        'sizePosition': true,
        'label': true,
        'disabled': ['border-radius']
    });
    
});
