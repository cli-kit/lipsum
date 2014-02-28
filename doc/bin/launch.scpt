on run argv
  

  tell application "iTerm"
    activate
    -- close the first session
    #terminate the first session of the first terminal
    -- make a new terminal
    set myterm to (make new terminal)
    -- talk to the new terminal
    tell myterm
      -- set size
      set number of columns to 80
      set number of rows to 26
      -- make a new session
      set mysession to (make new session at the end of sessions)
      -- talk to the session
      tell mysession
        -- set some attributes
        set name to "lipsum"
        log (item 1 of argv)
        -- execute a command
        exec command (item 1 of argv) & " \"" & (item 2 of argv) & "\" \"" & (item 3 of argv) & "\""
      end tell -- we are done talking to the session
    end tell
    -- 80x26
    --set the bounds of the first window to {0, 0, 570, 388}
    -- 80x1050px
    set the bounds of the first window to {0, 0, 570, 1050}
  end tell
end run

