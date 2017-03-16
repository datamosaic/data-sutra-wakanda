Staging Server
==============

Data and notes about our current setup.

<!-- toc -->

Installation Details
--------------------

Only one install of wakanda is required. As of this writing, the active
one is located here: /opt/wakanda-8-156352/bin/  
Each running solution has it’s own script and boot script. Taking the
sample solution 42, the startup script is located
/opt/wakanda-8-156352/bin/wak-42.sh and the boot script is located
/etc/init.d/wakanda-42.

**Remember!** Must follow the steps outlined here:
\[\[Installation\#Server-Changes\]\]

**Naming conventions**

**1. Admin**  
`<solution name>.admin.kabootit.co`  
*Is this required? `<project name>.<solution name>.admin.kabootit.co`*

**2. Solution**  
`<solution name>.kabootit.co/<project name>`

**Default server password**  
Unless otherwise specified, a running server with no open solution is
accessible using:  
admin/WorlduvTanks  
Once a solution has been started, the user/pass combos in use for that
server come from the solution.

**Notes**

-   Wakanda assumes that the project/solution is always the top-level
    directory. This makes it impossible to use apache to rewrite into
    directories. Take for example
    http://stratosphere.kabootit.co/barracks/. It would be better to
    have all the projects as folders under one solution’s url. However,
    that isn’t possible and necessitates a
    http://barracks.stratosphere.kabootit.co/ naming convention.
-   Need to rewrite the admin pages output so that launching the data
    browser works. The current code tacks on the solution’s port number
    to whatever the existing url is. With apache in front of things,
    this breaks down. Use naming convention (solution and project names
    combined with kabootit.co) to determine what the correct url should
    be.
-   When creating new solution, you can have spaces in the name. After
    creation, replace spaces in the solution folder with underscores.
    This gets around Wakanda bug with spaces in full path.

Apache Server
-------------

1. Lock down API url for each project:

    addHttpRequestHandler(
          '/api/\.\*',
          'API/AC.js', 
          'controller' 
    );

2. Handle URL routing (proxy) and caching2

TODO: test caching out. Seems like a good fit for Kabootit. From:
http://forum.wakanda.org/showthread.php?6374-Wakanda-application-on-apache-server&p=29111&viewfull=1\#post29111

You can either:

- use Apache only as proxy
- use Apache as remote cache servers (+proxy)

In some situations from internal rules, any published website has to go through some Apache HTTP server
In such case the Wakanda server can run internally and be accessed from a public IP via Apache which will manage the domain name and route the request to Wakanda

See:
-> http://httpd.apache.org/docs/current/mod/mod_proxy.html

Using Apache as a remote cache serves can be interesting in combination with load balancers.
All Apache Servers have a copy of the static files and proxy only the requests for dynamic data like the ones starting by "/rest" or "/rpc"

Deployments
-----------

A solution directory can live anyplace on the hard drive. For now, all
solutions live inside  
`/opt/wakanda-solutions/`

When beanstalk deploys to a Wakanda solution, it executes a git pull in
that solution’s directory.

fileSystems.json
----------------

Themes, Widgets, and Extensions live here:  
`/opt/wakanda-filesystem/`

Must also modify wakanda/bin/Resources/fileSystems.json

Multiple Wakanda versions
-------------------------

Developing with multiple versions of Wakanda is a known constant.

**Developer**

Process:

1.  install wakanda version on development machine
2.  create and populate new git branch of project/solution
3.  naming convention of branch is wak version
4.  use this branch to develop with

**Staging server**

1.  install wakanda version
2.  shuts down staging server instance for target solution (if exists)
3.  spins up new wakanda server version using the assigned ports
4.  add Git deployment to pull from specific branch instead of trunk

Eventually, replace trunk with a branch as things get moved along. Rinse
and repeat.

Certificate handling
--------------------

TODO: fill this in

Deployment Servers
------------------

TODO: fill this in

- monitoring, restart script, fail safes, auto-start on reboot

Data Security
-------------

- add notes here as they come up

URLs to lock down
-----------------

- `/admin`:
http://forum.wakanda.org/showthread.php?6334-add-admin-to-say-hello&p=28836&viewfull=1\#post28836
(this one is a hoot, just returns “hello” lol)  
-`/rest`: redirect to `/empty_rest.txt` (returns `{"dataClasses": []}`)
so WAF doesn’t throw an error loading up.

Changes to get around ה naming
------------------------------

- Duplicate .waProject file in all core modules (AC, VL, etc) and remove
the ה

- Update the .waSolution file to point to the newly duped files

- Change var securityDS (~line 102) in AC/Security/login.js to remove
the ה  
- Remember to update .waSolution file whenever new projects added to
solution

Performance tuning
------------------

Query cache:
http://forum.wakanda.org/showthread.php?6868-What-exactly-does-the-cacheUAG-file-do

Indexing and cache settings explained:
http://www.wakanda.org/blog/tuning-datastore-engine

Solution settings:
http://doc.wakanda.org/Wakanda-Server-Reference-Guide/Configuration-and-Settings-Files/Solution-Settings-File.300-929450.en.html

Forum posts:  
http://forum.wakanda.org/showthread.php?7615-Wakanda-settings-for-production

Startup script:
http://community.data-sutra.com/attachments/download/205/test-startup.sh

Async RPC with timeout functionality
------------------------------------

Requires replacing a file in Wakanda Server install. Instructions:
http://forum.wakanda.org/showthread.php?7501-RPC-with-timeout

File:
http://community.data-sutra.com/attachments/download/204/proxy-body.js