#!/bin/bash

cp -rf client/ mobile/src

cat mobile/src/angular.json | sed -i 's/\"outputPath\"\: \"dist\/client\"\,/new/g' '\"outputPath\"\: \"\.\.\/www\"'