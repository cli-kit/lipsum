#!/usr/bin/env bash

. ~/.profile

dir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

tmuxwin(){
  local output="$1";
  local cmd="${@:2}";
 
  tmux has-session -t lipsum-help 2>/dev/null
  if [ "$?" -eq 1 ]; then
    tmux new-session -d -s lipsum-help -n screencapture
    tmux new-window -k -t lipsum-help:1 -n screencapture-win
  fi

  tmux set status off

  tmux clearhist -t lipsum:help
  tmux send-keys -t lipsum-help:1 "clear" C-m

  # execute the command whose output we want
  tmux send-keys -t lipsum-help:1 "$cmd" C-m

  ${dir}/capture.sh ${output} &

  tmux select-window -t lipsum-help:1
  tmux attach-session -t lipsum-help
}

sleep 1;
tmuxwin $@;
