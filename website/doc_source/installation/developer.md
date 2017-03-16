# Developer Installation

<!-- toc -->

## Files to modify

#### Async RPC with timeout functionality

Requires replacing a file ([proxy-body.js](../assets/proxy-body.js)) in Wakanda Server install. Instructions:
http://forum.wakanda.org/showthread.php?7501-RPC-with-timeout


#### Hosts file modifications

To easily access pages from multiple Wakanda projects in one browser at
the same time unique host name entries must be entered into you
development computer’s host file. Naming convention is `<project identifier>.<client identifier>`. Example:

```
##
# Wakanda
##

# lightspeed
127.0.0.1   app.light fn.light html.light crm.light data.light inv.light tckt.light time.light dpl.light test.light help.light i18n.light rpt.light code.light ac.light sa.light vl.light wdgt.light

# families
127.0.0.1   app.family html.family form.family ssm.family dpl.family i18n.family rpt.family code.family ac.family sa.family fl.family wdgt.family
```

The hosts file on mac is `/etc/hosts`