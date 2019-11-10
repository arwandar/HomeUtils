#!/bin/bash
cd /home/pi/dev/HomeUtils/
sudo forever stop HomeUtilsIp
sudo forever stop HomeUtilsElectric

sudo npm run build

sudo forever start -a --uid "HomeUtilsIp" ./dist/getIp.js
sudo forever start -a --uid "HomeUtilsElectric" ./dist/verifyElectricCurrent.js
