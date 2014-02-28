#!/usr/bin/env bash

bin=$(pwd)/doc/bin;
out=$(pwd)/doc/img;
screenshot=${bin}/screenshot.sh
name=${screen_name:-${npm_package_name:-screenshot}};
#echo "$name"
#echo "$screenshot"

echo "${SCREEN_CMD}"
output=${out}/${OUTPUT};

echo $output;

# 570, 388 = 80x26 columns at this resolution (1680x1050)
# 520, 1050 = 80 columns wide by screen height
width="${screen_width:-520}";
height="${screen_height:-1050}";
screen_tmux="${screen_tmux:-$(pwd)/}"
osascript "${bin}/launch.scpt" "${screenshot}" "${output}" "${SCREEN_CMD}" \
  "${name}" "${width}" "${height}";
sleep 5;
