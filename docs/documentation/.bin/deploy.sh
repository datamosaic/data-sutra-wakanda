#!/bin/bash

# documentation
rm -rf ../../docs/documentation
cp -rf ../documentation ../../docs/documentation


# website
cp -rf ../favicon.ico ../../docs/favicon.ico
cp -rf ../index.html ../../docs/index.html

# git
# git add -A
# git commit -m 'update documentation from deploy script'
# git push