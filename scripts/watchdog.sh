#!/bin/bash
cd /home/z/my-project
while true; do
  if ! pgrep -f "next-server" > /dev/null; then
    echo "[$(date +%H:%M:%S)] Server down, starting..."
    nohup npx next dev -p 3000 > /tmp/dev.log 2>&1 &
    disown
    sleep 15
  fi
  sleep 10
done
