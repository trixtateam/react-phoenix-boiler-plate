#!/bin/bash
currentDefaultFolder="./semantic/themes/default"
newDefaultFolder="./node_modules/semantic-ui-less/themes/default"

# Delete our default folder.
if [ -d "$currentDefaultFolder" ]
then
    echo "Deleting current folder..."
    rm -r "$currentDefaultFolder"
fi


# Check if current folder exists

if [ -d "$newDefaultFolder" ]
then
    echo "Copying new default folder..."
    cp -R $newDefaultFolder $currentDefaultFolder
fi