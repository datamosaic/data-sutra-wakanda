#!/bin/bash

syntax="syntax: $(basename $0) <zip archive of DataFolders> <destination Wakanda solution folder>"

if [ $# -lt 2 ] ; then
  echo "${syntax}" >&2
  exit 1
fi

startdir=$(pwd)

datafolder="DataFolder"
cpcmd="cp --archive"
rmcmd="rm --recursive"
unzipcmd="unzip -o"  #caution: overwrites without warning

srcparentfolder="/tmp"
srcfolder="${srcparentfolder}/${1%.zip}"
destfolder="${2%/}"

echo $unzipcmd "$1" -d "$srcparentfolder"
$unzipcmd "$1" -d "$srcparentfolder"

#printf "srcfolder: $srcfolder\n"
#printf "destfolder: $destfolder\n"

for projfolder in "$srcfolder"/* ; do
  projname=$(basename "$projfolder")
  if [ -d $projfolder ] ; then
    echo $cpcmd "$projfolder/${datafolder}" "${destfolder}/${projname}"
    $cpcmd "$projfolder/${datafolder}" "${destfolder}/${projname}"
  fi
done

echo $rmcmd "$srcfolder"
$rmcmd "$srcfolder"

printf "\n"
exit 0
