Sections
========

<!-- toc -->

Sections are the main component abstractions of Kabootit. These can be
html snippet files, mustache templates files, Wakanda containers, or
Wakanda components allowing for scenarios ranging from reporting to full
on SPAs.

Sections are inherently reusable as page meta data for sections map
section tags to files anywhere in the `WebFolder` directory. By
convention, best practice is to put reusable sections in the `src/views`
directory and non-reusable sections under the specific page directory.

HTML files
----------

1. Map a section tag to an `.html` file

*Build behavior:*

Tag is replaced by the html file.

Mustache templates
------------------

*TODO: implement*

1. Map a section tag to a `.tpl` file  
2. Create a `.json` file in the same location and name as the `.tpl`
file (just different extension)

*Build behavior:*

Tag is replaced by a `Mustache.render(tpl, json)`

Kabootit widgets
----------------

Widgets that work with Kabootit have two required properties: `Tag` and
`Order`.

We have modified a number of Wakanda widgets to have these properties
and all Kabootit custom widgets have these properties as well.

Any additional properties are used specifically by the widget and don’t
have any bearing on the Kabootit build process.

*Build behavior:*

See [Using Wakanda’s Widgets] and [Creating Custom Widgets]

Wakanda containers
------------------

*TODO: implement*

1. Create a Wakanda Web Component with the same name as the section tag
it is meant to replace  
2. Place a Wakanda `Container` widget on the page  
3. Add `.tpl` markup to the container’s Kabootit `Template` property  
4. Place `Kabootit Widgets` inside the container and associate to
specific `.tpl` tags via the `Tag` property  
5. Multiple widgets with the same `Tag` property can be ordered by the
`Order` property

*Build behavior:*

1.  Widget markup is merged into container template markup
2.  Tag is replaced by container results

  [Using Wakanda’s Widgets]: http://community.data-sutra.com/projects/kabootit/wiki/Using_Wakanda's_Widgets
  [Creating Custom Widgets]: http://community.data-sutra.com/projects/kabootit/wiki/Creating_Custom_Widgets

Grid system
-----------

Kabootit models the Bootstrap grid system via Wakanda’s `tab widget`. An
additional Kabootit property `Template` has been added to the
`tab widget` and its sub containers. The various template properties are
where you enter specific Bootstrap grid markup.

Easiest starting point is to duplicate a `Wakanda Component` that
already has everything setup. Example setup:

1.  Create a `Wakanda Component` in `src/pages` or `src/views`
2.  Add a `tab` widget to the screen. This will be the horizontal tab
    panel
3.  Horizontal `Template` property needs to have a `.tpl` tag of
    `{\{\{columns}\}\}`.

```html
    <div class="container"><div class="row">{\{\{columns}\}\}</div></div>
```

4.  For each horizontal tab, click the tab container and enter markup in
    the `Template` property. A `.tpl` tag of `{\{\{widgets}\}\}` is
    required.

```html    
<div class="col-lg-4  col-md-4 col-xs-12">{\{\{widgets}\}\}</div>
```

5.  For each horizontal tab, add a new `tab` widget to the container.
    This is the vertical tab
6.  For each vertical tab container, refer to the [Wakanda containers]
    instructions

*Build behavior*:

1.  Widget markup is merged into container template markup
2.  Vertical tab results are combined in order of tabs and then combined
    with horizontal parent template markup
3.  Horizontal tab container template markup is added up in order of
    tabs
4.  Horizontal tab container results is combined with horizontal tab
    template markup
5.  Tag is replaced by horizontal tab results

  [Wakanda containers]: http://community.data-sutra.com/projects/kabootit/wiki/Sections#Wakanda-containers