#!/bin/bash

cd /Users/rr/Git_repo/TAW-project/server

echo "running mongo..."

mongod &

sleep 2 &

echo "running node..."

npm start