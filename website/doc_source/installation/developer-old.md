# Installation

Kabootit comes with a number of configuration and javascript files that
need to be put into specific places in the Wakanda Solution/Project
directly structure.

We’ve included a relatively simple theme in the download that you can
use in (and distribute with) your applications. However, any Bootstrap 3
compatible theme can be implemented with Kabootit. A good 3rd party site
for top notch themes: https://wrapbootstrap.com/

<!-- toc -->

Studio setup
------------

#### Debugger for Designer

1. `Wakanda Studio/Contents/Resources/default.waPreferences` set line
near the top: `<debugging web_inspector="true"/>` to true  
2. with a page open in designer, right-click either the left of right
sections of the editor (not center section which is the page editor
proper) and choose “Inspect element”.

#### Designer Mods

*1. Container in tab panel to show properties*

In file: `designer-min.js` in `../Resources/Web Components/GUIDesigner/`

Delete the following:
`,context:[f["protected"],f.allowDrop,f.allowBind,f.allowPaste].join(" ")`

*2. Kabootit additions to Designer*

Add `kabootit-run.js` to
`../Resources/Web Components/GUIDesigner/scripts/designer/` directory

Add line:
`<script type="text/javascript" src="./scripts/designer/kabootit-run.js"></script>`  
to `../Resources/Web Components/GUIDesigner/guidesigner.html` and
`guidesigner-debug.html`  
near the bottom just above line:
`<script type="text/javascript" src="./scripts/designer/designer-run.js"></script>`

Studio extensions
-----------------

We store extensions and reusable modules in this directory.

Install the following extensions into `~/Documents/Wakanda/Extensions`

1.  Kabootit: our main Kabootit extension (pull from
    “Wakanda/Extension/Kabootit” repo)
2.  Sutra: various utilities (pull from “Wakanda/Extension/Sutra” repo)
3.  Modules folder: currently contains Mustache.js. Will have a lot more
    I suspect (pull from “Wakanda/Extension/Modules” repo)

### Usage notes

Docs:
http://doc.wakanda.org/home2.en.html\#/Files-and-Folders/Customizing-FileSystem-Definitions.200-1037821.en.html

    require(FileSystemSync("EXTENSIONS_USER").path + "Modules/Mustache.js")

Server Changes
--------------

1. Grab the latest minified jQuery and overwrite the jQuery section in
`/Applications/Wakanda Server.app/Contents/walib/minifiedCoresWAF/desktop.core.min.js`  
2. Search for `jqueryui.com` and delete it  
3. Replace hammer.js 1.0.5 with 1.0.6  
4. Remove all jquery UI stuff  
5. Remove SVG library `jquery.svg`  
6. Remove `jquery-selectbox.js`, `jquery-combobox.js`, `beautytips.js`,
`jquery.notify.js` (basically anything with jquery in it)

Alternately, replace the source files and rebuild the minified file per
instructions:
http://forum.wakanda.org/showthread.php?5088-Jquery-update&p=27476\#post27476

Project Boilerplate
-------------------

### Build source

This is where things get interesting. Instead of the development process
starting with a Wakanda page, Kabootit applies a build process to a
`src` directory structure.

The src directory structure:

<table>
<tbody>
<tr class="odd">
<td>WebFolder</td>
<td></td>
<td></td>
<td></td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr class="even">
<td></td>
<td>src</td>
<td></td>
<td></td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr class="odd">
<td></td>
<td></td>
<td>pages</td>
<td>Wakanda Page</td>
<td>Wakanda Component</td>
<td>[Grid][Container][Widget]</td>
<td>[Container][Widget]</td>
<td>[Widget]</td>
</tr>
<tr class="even">
<td></td>
<td></td>
<td>templates</td>
<td>templateNameDir</td>
<td>tpl files</td>
<td></td>
<td></td>
<td></td>
</tr>
<tr class="odd">
<td></td>
<td></td>
<td>views</td>
<td>sectionNameDir</td>
<td>Wakanda Component</td>
<td>[Grid][Container][Widget]</td>
<td>[Container][Widget]</td>
<td>[Widget]</td>
</tr>
</tbody>
</table>

*Usage: See attached zip file for boilerplate directory structure. Drop
into the WebFolder of a project.*

### Build destination

The Kabootit build process compiles the source files to destination
files to a location of your choosing (as specified in the
`Kabootit Settings` file in the solution folder).

In a full Kabootit solution structure (with Apache gateway server and
name spacing for projects), this directory will be to the project’s name
spaced directory inside of the `WebFolder` directory. This is not
necessary only for the default `APP` project of a solution.

Note that while you can open and view the destination files in Studio,
they are not meant to be edited directly. Instead, open them in the
browser to view what you develop in the source files.

### API

Projects expose various data and functionalities via a project-specific
API.

To setup, create an `API` directory in project. Inside this directory
are a minimum of two files: `{{projectName}}.js` and `1.js`. These files
correspond to the “header” api file and an api version file (you can
have many api version files). The header file is used by Kabootit to
setup the project api in accordance with security and the version files
contain the actual api’s.

### RPC

Kabootit UI code accesses server side code via RPC.

To setup, create a `Modules` folder if it doesn’t already exist. Inside
this directory is a `{{projectName}}.js` file tagged as a Wakanda RPC
file.

Depending on the destination location of various builder files and the
deployment server configuration, the RPC meta tag on a page may need
adjusting. Currently, our bootstrap builder is doing this automatically
but it is likely to change or be pulled out into a settings data point.
Example:
`<meta name="WAF.config.rpc.file" content="/factory/rpc-proxy/ssjs?namespace=SSJS"/>`
(note that additional “factory” slot).

### Security

Projects “publish” security information for what records are viewable,
what actions are allowed, and some default routing information. The
\[\[Access and Control\]\] project uses this information to configure
security for groups.

To setup, create a `Security` directory in the project. Inside this
directory is a `{{projectNamej}}.json` file with an object containing
various information.

Kabootit Settings
-----------------

`Kabootit Settings.waSettings` goes in the top level of the solution.

This file configures various builders for each project in a solution.
`project` nodes tells Kabootit which projects to process. `builder`
nodes tell Kaboot which builders to run for a project.

    <?xml version="1.0" encoding="UTF-8"?><settings>
        <project name="Kabootit v3">
            <builder name="kabootit" src="WebFolder/src" target="WebFolder"/>
        </project>
    </settings>

Themes
------

Kabootit theme originals are stored in the
`~/Documents/Wakanda/Themes/Kabootit/themeName` directory.

### New template

1.  select an file as your starting point and duplicate it to
    `{{Theme}}/templates/templateName/`
2.  alternately, duplicate it to
    `{{Project}}/WebFolder/src/templates/templateName/`
3.  change extension of file from “.html” (or whatever) to “.tpl”

See \[\[Themes\]\] for instructions on how to “cut” a theme.

Widgets
-------

*NOTE: this section not implemented yet! We’re using the Tab widget as
an interim fillin.*

Kabootit comes with two specialized widgets to do the fluid + responsive
layout in Wakanda Studio. Place these in Wakanda’s custom widget
directory.

Additionally, there are many custom widgets in development specifically
for Kabootit. These are stashed on our website and you can get to them
quickly by right-clicking on the WIDGETS folder in the Studio file
explorer pane and selecting “Get Kabootit Widgets”.

Developer instances
-------------------

To start server with specific port. Example:

1.  navigate to
    `cd /Applications/Wakanda\ 0.150497/Wakanda\ Server.app/Contents/MacOS/`
2.  start with
    `./Wakanda\ Server --admin-port=8090 --admin-ssl-port=4434`
3.  or on the server
    `./Wakanda\ Server <full path to waSolution file> --admin-port=8090 --admin-ssl-port=4434 --debug-off`