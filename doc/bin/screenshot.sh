#!/usr/bin/env bash

. ~/.profile

dir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

tmuxwin(){
  local output="$1";
  local cmd="${@:2}";
 
  tmux has-session -t screenshot 2>/dev/null
  if [ "$?" -eq 1 ]; then
    tmux new-session -d -s screenshot -n screencapture
    tmux new-window -k -t screenshot:1 -n screencapture-win
  fi

  tmux set status off

  tmux clearhist -t screenshot:1
  #tmux send-keys -t screenshot:1 C-l

  # execute the command whose output we want
  tmux send-keys -t screenshot:1 "$cmd" C-m

  ${dir}/capture.sh ${output} &

  tmux select-window -t screenshot:1
  tmux attach-session -t screenshot
}

sleep 1;
tmuxwin $@;
