#!/bin/bash
cd /home/z/my-project
while true; do
  if ! pgrep -f "next-server" > /dev/null; then
    echo "[$(date)] Server down, restarting..."
    nohup npx next dev -p 3000 > dev.log 2>&1 &
    sleep 20
  fi
  sleep 5
done
