#!/usr/bin/env bash

#echo "capture.sh called ${@}" > ~/Desktop/test.txt

output="$1";
sleep 1;
screencapture -o -P -w ${output} &
sleep 1;
cliclick c:100,100
sleep 1;
tmux kill-session -t screenshot
tmux set status on
