#!/bin/bash
sudo apt-get install -y npm
proc=$(ps -ef | grep "http-server" | grep -v "npm\|sh\|grep" | awk '{print $2}')
if [ ! -z "$proc" ]
then
    kill $proc
    echo "previous server shutted down"
fi
echo "Server started on: http://127.0.0.1:8080"
npx http-server ../src/ -c-1 -s -p 8080 > /dev/null 2>&1 &
