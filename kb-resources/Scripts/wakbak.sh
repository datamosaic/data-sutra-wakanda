#!/bin/bash

syntax="syntax: $(basename $0) <wakanda solution base folder>"

if [ $# -le 0 ] ; then
  echo "${syntax}" >&2
  exit 1
fi

startdir=$(pwd)

timestamp=$(date -u "+%Y%m%d_%H%M%S_utc")
wakbasefolder=$(basename "$1")
targetbasename="${wakbasefolder}_backup_${timestamp}"
backupdest="/tmp"
targetbasefolder="${backupdest}/${targetbasename}"
datafolder="DataFolder"
cpcmd="cp --archive"
zipcmd="zip -r"
rmcmd="rm --recursive"

#printf "base folder: $1\n"
#printf "solution: $wakbasefolder\n"
#printf "target base: $targetbasename\n"

echo mkdir "$targetbasefolder"
mkdir "$targetbasefolder"

#printf "project folders:\n"
folderlist=$(find "$wakbasefolder" -maxdepth 2 | grep "$datafolder" | sort)

for folder in $folderlist ; do
  
  projfolder=$(basename $(dirname $folder))
  
  echo mkdir "${targetbasefolder}/${projfolder}"
  mkdir "${targetbasefolder}/${projfolder}"
  
  echo $cpcmd "${wakbasefolder}/${projfolder}/${datafolder}" "${targetbasefolder}/${projfolder}/${datafolder}"
  $cpcmd "${wakbasefolder}/${projfolder}/${datafolder}" "${targetbasefolder}/${projfolder}/${datafolder}"

done

echo cd "${backupdest}"
cd "${backupdest}"

echo $zipcmd "${targetbasename}.zip" "${targetbasename}"
$zipcmd "${targetbasename}.zip" "${targetbasename}"

echo $rmcmd "${targetbasename}"
$rmcmd "${targetbasename}"

echo cd "$startdir"
cd "$startdir"

printf "\n"
exit 0
