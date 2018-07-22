#!/bin/sh


if [ -d "ui/build/bower_components" ]; then
  echo "Already Done Before!"
  exit 1
fi


if [ ! -d "ui/build" ]; then
  echo "no build dir found"
  exit 1
fi

if [ ! -d "ui/bower_components" ]; then
  echo "no Bower dir found"
  exit 1
fi


if [ ! -d "ui/static_assets" ]; then
  echo "no assets dir found"
  exit 1
fi

cd ui
cd build 
ln -s ../bower_components .
ln -s ../static_assets .

echo "Done!"
