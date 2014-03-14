$0
==

Canonical example for the command module.

Generates lorem ipsum text and is used to test help output for the command module.

If the `${opt_latin_pipe}` option is specified and it looks like latin then it does nothing, other more meaningful options that have an affect are interspersed, try `${opt_align_long}` and `${opt_format_long}` in particular. The examples are valid, they illustrate some of the functionality of the command module.

When invoked without arguments the program will print some lorem ipsum paragraphs.

## Commands

* `print`: Print some messages using the log middleware
* `ex, exception, e`: Throw an exception

## Options

* `-l, --latin`: Include mock lipsum options and commands.
* `-j, --json`: Print help as json.
* `-c, --collapse`: Collapse whitespace between sections.
* `-v, --vanilla`: Disable parameter replacement.
* `-e, --exit`: Include exit section from error definitions.
* `-s, --sort [value]`: Alters the help option sort order. Set to null to use natural order which is likely the order that options were declared in however this is not guaranteed. Use false for the default sorting logic which favours options with more names, use true to sort lexicographically using *Array.prototype.sort*. Use 1 to sort by option string length (determined by the length of the help option string), reverse the order with -1.
* `-f, --format [value]`: Set the help output format.
* `-a, --align [value]`: Alignment style.
* `-m, --maximum [value]`: Maximum column width.

## Examples

Print help using the command module defaults:

```
$0 ${opt_help_long}
```

Print help and include mock latin options and commands:

```
$0 -lh
```

Print help as JSON:

```
$0 -jh
```

Include exit codes in the help output:

```
$0 -eh
```

Print help as markdown:

```
$0 ${opt_format_long} markdown ${opt_help_long}
```

Switch to flex alignment:

```
$0 -h ${opt_align_long} flex
```

Increase maximum column width:

```
$0 -lh ${opt_maximum_long} 100
```

Disable help option sort (natural order):

```
$0 -lh ${opt_sort_long} null
```

Use default sort order:

```
$0 -lh ${opt_sort_long} false
```

Use lexicographic sort order:

```
$0 -lh ${opt_sort_long} true
```

Sort by length of option (longest first):

```
$0 -lh ${opt_sort_long} 1
```

Sort by length of option (shortest first):

```
$0 -lh ${opt_sort_long} -1
```

Disable terminal colors:

```
$0 ${opt_help_long} ${opt_color_no}
```

Verify ANSI escape sequences are not written to files:

```
$0 ${opt_help_long} > help.txt && cat help.txt
```

Print some messages, illustrates the log middleware:

```
$0 ${cmd_print_long}
```

Set log level to warn and print some messages:

```
$0 ${cmd_print_long} --log-level=warn ${opt_color_no}
```

Print an error, will be treated as an uncaught exception:

```
$0 ex
```

Include stack trace in exception and set log level to trace:

```
$0 ex --debug
```

Verify exit code for uncaught exception, compare to `$0 -eh`:

```
$0 ex; echo $?;
```

## Copyright

Copyright (C) 2014 Freeform Systems, Ltd.
This is free software; see the source for copying conditions. There is NO warranty; not even for MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
