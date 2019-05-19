#!/bin/bash

cd /Users/rr/Git_repo/TAW-project/server

npm run compile

echo "running mongo..."

mongod &

sleep 2 &

echo "running node..."

npm start
