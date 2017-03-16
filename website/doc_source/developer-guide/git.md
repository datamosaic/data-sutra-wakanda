GIT
===

<!-- toc -->

We use GIT to manage all of our solution code. Multiple developers,
Wakanda versions, clients, staging servers, and deployment servers — are
all tied together with GIT workflows.

GIT Tutorial: http://mrchlblng.me/2014/09/practical-git-introduction/

Sub modules
-----------

We are using GIT submodules to give us the ability to use “connected”
projects across many solutions. This adds another layer of complexity to
our development GIT setups but is well worth the end result.

The default Wakanda file ignore list is used to keep connected projects
localized. For example, `Access and Control` project has all of its
functionality, data description, etc shared but the actual data storage
file is not.

    # OS X
    *.DS_Store
    ._*
    # Wakanda data
    *.waData
    # Wakanda preferences
    *.waPreferences
    # Wakanda log
    *.waLog
    */Logs
    studio_log*
    # Wakanda code symbols
    *.waSym
    *.waSymData
    # Wakanda index
    *.waIndex
    *.waIndx
    *.Match
    # Wakanda User and Group cache
    *.cacheUAG
    # Wakanda breakpoints
    breakpoints.json
    # Wakanda session ID cache
    sessionID.json
    # Wakanda backup
    *.waBackup
    # Wakanda Remote Model Cache
    *.waRemoteModel

Branches and Tags
-----------------

TODO:

How-to detached head when needing to commit
-------------------------------------------

We use git submodules for all our shared projects. Generally these
submodules will be on a detached head. Detached heads aren’t bad…unless
you’ve done some modifications in the submodule and want to commit them
back to the repository. Here’s how to get back on master when that
happens:

-   commit your changes like normal
    -   right click on the commit you just made (if not in history,
        click on the detached head and it will show up there) and choose
        “copy commit hash to clipboard”
-   double click on the branch you want to be head (not the detached
    one)
    -   it may prompt you about losing your work
-   right click on branches heading in sidebar and “create new branch”
    -   give the branch any name you want (“fix\_head”)
    -   paste the hash on your clipboard into the starting point
    -   press create branch button
-   double click on the branch you want to be head (probably “master”)
-   under working copy menu, choose merge
    -   choose your newly created branch “fix\_head” and press merge
-   right-click on newly created branch in sidebar and choose option to
    delete
-   push your changes
-   go out of the submodule, click the check-box next to the submodule
    and commit the change (this will update the pointer)