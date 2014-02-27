lipsum
======

Lipsum is a program used to generate lorem ipsum text and to test help output for the command module.

If the -l | --latin option is specified and it looks like latin then it does nothing, other more meaningful options that have an affect are interspersed, try --align and --format in particular. The examples are valid, they illustrate some of the functionality of the command module.

When invoked without no arguments the program will print some lorem ipsum paragraphs.

## Commands

* `print`: Print some messages using the log middleware
* `ex, exception, e`: Throw an exception

## Options

## Examples

Print help using the command module defaults

```
lipsum --help
```

Print help and include mock latin options and commands

```
lipsum -lh
```

Print help as JSON

```
lipsum -jh
```

Include exit codes in the help output

```
lipsum -eh
```

Print help as markdown

```
lipsum --format markdown --help
```

Switch to flex alignment

```
lipsum -h --align flex
```

Increase maximum column width

```
lipsum -lh --maximum 100
```

Disable help option sort (natural order)

```
lipsum -lh --sort null
```

Use default sort order

```
lipsum -lh --sort false
```

Use lexicographic sort order

```
lipsum -lh --sort true
```

Sort by length of option (longest first)

```
lipsum -lh --sort 1
```

Sort by length of option (shortest first)

```
lipsum -lh --sort -1
```

Disable terminal colors

```
lipsum --help --no-color
```

Verify ANSI escape sequences are not written to files

```
lipsum --help > help.txt && cat help.txt
```

Print some messages, illustrates the log middleware

```
lipsum print
```

Set log level to warn and print some messages

```
lipsum print --log-level=warn --no-color
```

Print an error, will be treated as an uncaught exception

```
lipsum ex
```

Include stack trace in exception and set log level to trace

```
lipsum ex --debug
```

Verify exit code for uncaught exception, compare to `lipsum -eh`

```
lipsum ex; echo $?;
```

## Copyright

Copyright (C) 2014 Freeform Systems, Ltd.
This is free software; see the source for copying conditions. There is NO warranty; not even for MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.