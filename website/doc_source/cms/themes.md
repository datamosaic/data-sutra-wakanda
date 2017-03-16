Themes
======

<!-- toc -->

A theme is a collection of static html files (layouts) that have been
adapted to allow Kabootit to fill with application pieces (widgets,
components, templates, html snippets, etc). Each page of an app requires
a theme layout to provide the base starting point for the page.

Theme layouts start off as static html files. These files can be custom
built by designers or chosen from among the many available themes on the
web. A complete theme typically includes several html files for various
layout options and all of the resources—images, css and javascript—that
go into making the theme layouts look and behave as intended. Examples:

1.  http://preview.jumpstartthemes.com/canvas-admin/
2.  http://mars.pinsupreme.com/
3.  http://wrapbootstrap.com/preview/WB0F35928

The process of adapting a theme for Kabootit is quite simple. Because it
requires few modifications to the original static html files, the design
process can easily be iterated on while a site is in development (and
even in production).

The theme abstraction allows designers to do what they do best—without
impeding the efforts of programmers and content experts. Said another
way—themes remove the burden of design from programmers!


Setup
-----

A theme is an entire directory of html files with all resources files
included in sub directories. Kabootit is not opinionated about the
directory structure inside of a theme directory as long as everything
resolves properly in the html files.

Put entire themes (along with all resources) in
`~/Documents/Wakanda/Themes/<<project_name>>/<<theme_name>>` directory.
All resources in Wakanda’s `THEMES_CUSTOM` path can be served up by the
web server as if they were in any project’s `WebFolder` directory.

Add a json file to the top level theme directory called `kabootit.json`
that describes your theme. This meta data is not required currently but
could be used for automatically registering themes with Kabootit in the
future. Example:

    {
        "name" :        "Quickstart",
        "description" :     "A default Kabootit theme"
    }

<s>To use in a project, copy a theme directory to the
`{{Project}}/WebFolder/themes` directory. This manual step will go away
once:</s>

<s>TODO: http listener per project that listens for `/theme/...` and
reads in resources from original location location and returns them in
correct encoding (text, images, video). Some helpful code:
http://community.data-sutra.com/projects/kabootit/wiki/Routing\#Wakanda-Ideas</s>

(Note: all files and resources in `THEMES_CUSTOM` path can now be served
up by the web server as if they were in any project’s `WebFolder`
directory)

### New template file

\# choose an html file from your template (theoretically could be other
file types as well) as your starting point and duplicate it to either

    * @{{Project}}/WebFolder/src/templates/<<templateName>>/@ or
    * @Themes/<<themeName>>/templates/@

1.  change extension of file from “.html” (or whatever) to “.tpl”

### Register theme with Kabootit

All newly added themes need to be added to the
`<IDE>/Resources/Web Components/GUIDesigner/scripts/designer/kabootit-run.js`
file. Look for this line of code:

    {
        name:"data-kabootit-theme",
        description:"Theme",
        type:"dropdown",
        defaultValue:"Quickstart",options:["Quickstart","Sphere","On-the-Go Admin","Serenity"],
        category:'Kabootit'
    }

Cutting a theme template
------------------------

### Wakanda

*1. Footer*

Add wakanda loader just before closing body tag (note the “async”):

    <script async type="text/javascript" src="/waLib/WAF/Loader.js"></script>

*2. Header*

Replace the current `<title>..` tag line with:

    <title>{{{title}}}</title>

Add the following just before the closing head tag:

    <!-- Wakanda -->
    <meta name="WAF.packageJson"/>
    {{{ models }}}      
    {{{ datasources }}}
    {{{ modules }}}

*3. Resources*

Link up resources by inserting the a “link” tag into all resource
references:

    <link href="css/bootstrap.min.css" rel="stylesheet">

    // becomes

    <link href="{{{ resources }}}/css/bootstrap.min.css" rel="stylesheet"> 

*4. JavaScript Loader*

The WAF Loader file added into the footer can bring in all other
javascript source files as well. Best practices is to flag all
javascript to be brought in by the loader. However, if your javascript
relies on jQuery, it must be brought in with the loader.

Insert an attribute named kabootit with value package.json into all
script tags.

    <script src='{{{ resources }}}/resources/js/bootstrap.min.js'></script>

    // becomes

    <script kabootit="package.json" src='{{{ resources }}}/resources/js/bootstrap.min.js'></script>

### Section tags

For all sections that you want to abstract with server-side rendering at
runtime, insert mustachejs tags into the the html markup at the
appropriate location. Use triple braces so html is not converted to
entities. Example:

    <!-- Header Starts -->
    {{{ navigation }}}
    <!-- Header Ends -->

In the [page] file properties, you will map section tags to specific
files. These files are located either in the `pages` directory
(non-shared sections) or the `views` directory (shared sections).

Browser quirks handling
-----------------------

1. Nexus 7 screen pixel density very high. Need to zoom in a bit by
default:
http://developer.android.com/guide/webapps/targeting.html\#ViewportDensity

  [page]: http://community.data-sutra.com/projects/kabootit/wiki/Pages#Properties