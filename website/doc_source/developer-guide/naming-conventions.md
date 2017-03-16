Naming Conventions
==================

<!-- toc -->

Default style guide we try and stick with is the classic:
https://github.com/airbnb/javascript

Specific examples and overrides
-------------------------------

### Solution

Name the solution after the client or client project.

### Projects

*1. Unique projects*

`Some Name (<<identifier>>)`

*2. Shared projects*

`<<affix>> Some Name (<<identifier>>)`

### Data

*1. Classes*

-   CamelCase with initial capital
-   Tack on “Collection” for class collection name (Wakanda does this
    automatically)

*2. Attributes*

-   Lower case with underscore. This is to distinguish from variable
    names which are camelCase
-   Main related n-1: class name to class collection name
-   alternate related n-1: as above plus underscore plus relationship
    identifier

### Methods

-   class, collection, entity: camelCase
-   api, rpc: camelCase

### Repos

Not necessary but we tend to prefix repo names with affixes representing
categories. Keeps our repo list organized in some fashion. Examples
“kb\_” for share Kabootit projects, “wakanda\_” for Wakanda-based
solutions, etc.

### Variables

camelCase.

### Constants

ALLCAPS

CSS
---

http://blog.trello.com/refining-the-way-we-structure-our-css-at-trello/