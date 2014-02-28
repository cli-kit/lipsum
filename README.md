Table of Contents
=================

* [lipsum(1)](#lipsum1)
  * [Install](#install)
  * [Definition](#definition)
  * [Source](#source)
  * [Usage](#usage)
  * [Version](#version)
  * [Screenshot](#screenshot)
  * [License](#license)

lipsum(1)
=========

Canonical example for the [command](https://github.com/freeformsystems/cli-command) module.

## Install

```
npm i -g cli-lipsum
```

## Definition

The `lipsum` program was configured using this [markdown definition file](https://github.com/freeformsystems/cli-lipsum/blob/master/lib/lipsum.md), see [lipsum.md](https://raw.github.com/freeformsystems/lipsum/master/lib/lipsum.md) for the raw version, check out [usage](#usage) to see the resulting help output from combining the definition with the [source](#source).

## Source

Code from [lipsum.js](https://github.com/freeformsystems/cli-lipsum/blob/master/lib/lipsum.js):

```javascript
var util = require('util');
var glue = require('cli-interface');
var CommandInterface = glue.CommandInterface;
var cli = glue.cli, help = cli.help;

var fs = require('fs');
var path = require('path');
var convert = require('cli-native');
var formats = cli.doc.fmt.formats;
var lipsum = ''
  + fs.readFileSync(path.join(__dirname, 'lipsum.txt'));
var paragraphs = lipsum.split('\n\n');

var list = [null, true, false, 1, -1];
var alignments = ['column', 'line', 'flex', 'wrap'];
var stash = {};

// command handlers
function print() {
  var keys = require('cli-logger').keys;
  var log = this.log;
  keys.forEach(function(key) {
    log[key]('mock %s message', key);
  })
}

function exception(cmd) {
  this.raise('%s command invoked', [cmd.getOptionString(' | ')]);
}

// add mock options and commands
function mock() {
  this.option('-L, --lorem-ipsum-dolor[=VALUE]', 'Lorem ipsum dolor')
    .option('-i, --ipsum [VALUE]', 'Ipsum dolor sit amet')
    .option('--mauris-pulvinar, --ut-bibendum=[VALUE]', 'Mauris pulvinar')
    .option('-a, --aliquam [VALUE]', paragraphs[2])

  var program = this;
  paragraphs.forEach(function(para) {
    var cmd = para.replace(/\s+.*/, '').trim().toLowerCase();
    var desc = para.substr(0, para.indexOf('.') + 1);
    program.command(cmd, desc);
  })
}

// properties to associate with the commands
// and options loaded from lipsum.md
var def = {
  commands: {
    print: print,
    exception: exception
  },
  options: {
    sort: cli.types.enum(list, true),
    format: cli.types.enum(formats),
    align: cli.types.enum(alignments),
    maximum: cli.types.integer
  }
};


var LoremIpsum = function() {
  CommandInterface.apply(this, arguments);
}

util.inherits(LoremIpsum, CommandInterface);

LoremIpsum.prototype.configure = function() {
  var conf = {};
  var hints = {
    values: {
      format: formats,
      align: alignments,
      sort: list,
      maximum: [60, 240]
    }
  }
  this
    .configure(conf)
    //.usage(usage)
    //.usage(false)
    //.usage(null)
    .usage(hints);
}

LoremIpsum.prototype.use = function() {
  this
    .use(cli.middleware.color)
    .use(cli.middleware.logger, null, {level: {}, file: {}})
    .use(cli.middleware.debug);
}

LoremIpsum.prototype.on = function() {
  this
    .once('latin', function(req, arg, value) {
      mock.call(this);
    })
    .once('json', function(req, arg, value) {
      if(value) {
        this.configure().help.style = 'json';
        this.configure().help.indent = 2;
      }
    })
    .once('format', function(req, arg, value) {
      this.configure().help.style = value;
    })
    .once('maximum', function(req, arg, value) {
      this.configure().help.maximum = parseInt(value);
    })
    .once('exit', function(req, arg, value) {
      this.configure().help.exit = value;
    })
    .once('collapse', function(req, arg, value) {
      this.configure().help.collapse = value;
    })
    .once('vanilla', function(req, arg, value) {
      this.configure().help.vanilla = value;
    })
    .once('sort', function(req, arg, value) {
      this.configure().help.sort = convert.to(value);
    })
    .once('align', function(req, arg, value) {
      this.configure().help.align = value;
    })
    .on('empty', function(req) {
      process.stdout.write(lipsum);
    });
}

module.exports = function(pkg) {
  var file = path.join(__dirname, 'lipsum.md');
  var lipsum = new LoremIpsum(pkg);
  lipsum.load(file, def, function() {
    this.help('-h, --help')
      .version()
      .parse();
  });
}
```

## Usage

This is the help output which is the result of combining the markdown [definition](https://github.com/freeformsystems/cli-lipsum/blob/master/lib/lipsum.md) with the [source code](#source).

```
Lipsum is a program used to generate lorem ipsum text and to test help output
for the command module.

If the -l | --latin option is specified and it looks like latin then it does
nothing, other more meaningful options that have an affect are interspersed, try
--align and --format in particular. The examples are valid, they illustrate some
of the functionality of the command module.

When invoked without arguments the program will print some lorem ipsum
paragraphs.

Usage: lipsum <command> [-ljcveh] [--color|--no-color]
              [--debug] [-l|--latin] [-j|--json] [-c|--collapse]
              [-v|--vanilla] [-e|--exit] [-h|--help] [--version]
              [--log-level=<level>] [--log-file=<file>]
              [-s|--sort=(null|true|false|1|-1)]
              [-f|--format=(text|json|markdown)]
              [-a|--align=(column|line|flex|wrap)]
              [-m|--maximum=<60-240>] <args>

Options:

Command should be one of: print, ex.

Commands:
 print              Print some messages using the log middleware.
 ex, exception, e   Throw an exception.

Arguments:
 -v, --vanilla      Disable parameter replacement.
     --[no]-color   Enable or disable terminal colors.
     --log-file=[file]
                    Redirect to log file.
     --debug        Enable debugging.
 -l, --latin        Include mock lipsum options and commands.
 -j, --json         Print help as json.
 -c, --collapse     Collapse whitespace between sections.
     --log-level=[level]
                    Set the log level.
 -e, --exit         Include exit section from error definitions.
 -s, --sort=[value] Alters the help option sort order. Set to null to use
                    natural order which is likely the order that options were
                    declared in however this is not guaranteed. Use false for
                    the default sorting logic which favours options with more
                    names, use true to sort lexicographically using
                    Array.prototype.sort. Use 1 to sort by option string length
                    (determined by the length of the help option string),
                    reverse the order with -1.
 -f, --format=[value]
                    Set the help output format.
 -a, --align=[value]
                    Alignment style.
 -m, --maximum=[value]
                    Maximum column width.
 -h, --help         Display this help and exit.
     --version      Output version information and exit.

Examples:
 lipsum --help      Print help using the command module defaults.
 lipsum -lh         Print help and include mock latin options and commands.
 lipsum -jh         Print help as JSON.
 lipsum -eh         Include exit codes in the help output.
 lipsum --format markdown --help
                    Print help as markdown.
 lipsum -h --align flex
                    Switch to flex alignment.
 lipsum -lh --maximum 100
                    Increase maximum column width.
 lipsum -lh --sort null
                    Disable help option sort (natural order).
 lipsum -lh --sort false
                    Use default sort order.
 lipsum -lh --sort true
                    Use lexicographic sort order.
 lipsum -lh --sort 1
                    Sort by length of option (longest first).
 lipsum -lh --sort -1
                    Sort by length of option (shortest first).
 lipsum --help --no-color
                    Disable terminal colors.
 lipsum --help > help.txt && cat help.txt
                    Verify ANSI escape sequences are not written to files.
 lipsum print       Print some messages, illustrates the log middleware.
 lipsum print --log-level=warn --no-color
                    Set log level to warn and print some messages.
 lipsum ex          Print an error, will be treated as an uncaught exception.
 lipsum ex --debug  Include stack trace in exception and set log level to trace.
 lipsum ex; echo $?;
                    Verify exit code for uncaught exception, compare to `lipsum
                    -eh`.

Report bugs to muji <noop@xpm.io>.
```

## Version

Notice that the copyright information configured in the [definition](https://github.com/freeformsystems/cli-lipsum/blob/master/lib/lipsum.md) is used in the program version:

```
lipsum 0.1.7

Copyright (C) 2014 Freeform Systems, Ltd.
This is free software; see the source for copying conditions. There is NO
warranty; not even for MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
```

## Screenshot

<p align="center">
  <img src="https://raw.github.com/freeformsystems/lipsum/master/doc/img/help.png" />
</p>

## License

Everything is [MIT](http://en.wikipedia.org/wiki/MIT_License). Read the [license](https://github.com/freeformsystems/cli-lipsum/blob/master/LICENSE) if you feel inclined.

This program was built using the [command](https://github.com/freeformsystems/cli-command) module, if you care for excellent documentation and write command line interfaces you should check it out.

Generated by [mdp(1)](https://github.com/freeformsystems/mdp).

[command]: https://github.com/freeformsystems/cli-command
