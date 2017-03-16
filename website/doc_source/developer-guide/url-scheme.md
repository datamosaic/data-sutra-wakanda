URL Scheme
==========

Overview: `base > project > document > state > record(s) > parameters`

Specification
-------------

*1. base url*

This is set by the Apache gateway server (domain name).

*2. project identifier (opt)*

This is piped through to the correct project `WebFolder` by Apache
`mod_proxy`. This identifier is optional for the solution default
project.

*3. page with folder hierarchy*

This follows the folder directory structure as defined in the project’s
`WebFolder/projectIdentifier` until it hits a document.

*4. view state (opt)*

Once a document is served up, the next parts of the url are for
establishing view state. This is handled by the router implementation.

*5. pretty identifier (opt)*

If the current view is a record detail, you have the option to use a
“pretty identifier” for the record. Example: the company name.

*6. record UUID | collection cache UUID (opt)*

If the current view is a record detail, the record UUID will always be
shown.

If the current view is based primarily around a collection, the
registered UUID (as defined in the API) for the collection can
optionally be displayed.

If the view is not based around any particular data, this slot is empty.

*7. parameters (opt)*

Additional parameters can be tacked on to the URL in the form of
key/values. Comma delimit the values and if no value use a “-” in the
slot.

Example: `../action/GET/company/Data%20Mosaic`.