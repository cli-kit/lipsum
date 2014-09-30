Table of Contents
=================

* [lipsum(1)](#lipsum1)
  * [Install](#install)
  * [Definition](#definition)
  * [Source](#source)
  * [Usage](#usage)
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
var formats = require('cli-help').fmt.formats;
var lipsum = '' + fs.readFileSync(path.join(__dirname, 'lipsum.txt'));
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

function exception(info, req, next) {
  this.raise('%s command invoked', [info.cmd.getOptionString(' | ')]);
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
var options = {
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
  var file = path.join(__dirname, 'lipsum.md');
  var conf = {
    trace: process.env.NODE_ENV === 'devel',
    load: {
      file: file, options: options
    },
    substitute: {enabled: true},
    manual: {
      dir: path.normalize(path.join(__dirname, '..', 'doc', 'man')),
      dynamic: true
    }
  };
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

var midcolor = require('cli-mid-color')
  , midlogger = require('cli-mid-logger')
  , middebug = require('cli-mid-debug')
  , midmanual = require('cli-mid-manual')

LoremIpsum.prototype.use = function() {
  this
    .use(midcolor)
    .use(midlogger, null, {level: {}, file: {}})
    .use(middebug)
    .use(midmanual);
}

LoremIpsum.prototype.on = function() {
  this
    .once('load', function(req) {
      //console.log(this.name());
      this.help('-h, --help')
        .version();
    })
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
  return new LoremIpsum(pkg);
}
```

## Usage

This is the help output which is the result of combining the markdown [definition](https://github.com/freeformsystems/cli-lipsum/blob/master/lib/lipsum.md) with the [source code](#source).

```
Usage: lipsum <command> [-ljcveh] [--color|--no-color]
              [--debug] [-l|--latin] [-j|--json] [-c|--collapse]
              [-v|--vanilla] [-e|--exit] [-h|--help] [--version]
              [--log-level=<level>] [--log-file=<file>]
              [-s|--sort=(null|true|false|1|-1)]
              [-f|--format=(text|json|markdown|man)]
              [-a|--align=(column|line|flex|wrap)]
              [-m|--maximum=<60-240>] <args>

Canonical example for the command module.

Commands:
 help               Show help for commands.
 print, p           Print some messages using the log middleware.
 exception, ex, e   Throw an exception.

Options:
 -v, --vanilla      Disable parameter replacement.
     --[no]-color   Enable or disable terminal colors.
     --log-file=[file]
                    Redirect to log file.
     --debug        Enable stack traces.
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

Report bugs to muji <noop@xpm.io>.
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
