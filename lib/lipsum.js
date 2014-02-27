var util = require('util');
var interface = require('cli-interface');
var cli = require('cli-command'), help = cli.help;
var Interface = interface.Interface;

var fs = require('fs');
var path = require('path');
var convert = require('cli-native');
var formats = cli.doc.fmt.formats;
var sections = {};
var description = ''
  + fs.readFileSync(path.join(__dirname, 'description.txt'));
description = description.replace(/\s+$/, '');
var lipsum = ''
  + fs.readFileSync(path.join(__dirname, 'lipsum.txt'));
var paragraphs = lipsum.split('\n\n');
sections.examples = require('./examples');

var list = [null, true, false, 1, -1];
var sort = 'Alters the help option sort order. '
sort += 'Set to null to use natural order which ';
sort += 'is likely the order that options were declared in however this is not ';
sort += 'guaranteed. Use false for the default sorting logic which favours ';
sort += 'options with more names, use true to sort lexicographically ';
sort += '(Array.prototype.sort). Use 1 to sort by option string length ';
sort += '(determined by the length of the help option string), reverse the ';
sort += 'order with -1.';

var copyright = 'Copyright (C) 2014 Freeform Systems, Ltd.';
copyright += 'This is free software; see the source for copying conditions. ';
copyright += 'There is NO warranty; not even for MERCHANTABILITY or FITNESS ';
copyright += 'FOR A PARTICULAR PURPOSE.';

var prefix = cli.middleware.events.prefix;

var alignments = ['column', 'line', 'flex', 'wrap'];

var stash = {};

var LoremIpsum = function() {
  Interface.apply(this, arguments);
}

util.inherits(LoremIpsum, Interface);

LoremIpsum.prototype.configure = function() {
  var conf = {stash: stash, copyright: copyright, help: {sections: sections}};


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
    .usage(hints)
    .description(description);
}

LoremIpsum.prototype.use = function() {
  this
    .use(cli.middleware.color)
    .use(cli.middleware.logger, null, {level: {}, file: {}})
    .use(cli.middleware.debug);
}

LoremIpsum.prototype.command = function() {
  this.command('print')
    .description('Print some messages using the log middleware')
    .action(function print() {
      var keys = require('cli-logger').keys;
      var log = this.log;
      keys.forEach(function(key) {
        log[key]('mock %s message', key);
      })
    });
  this.command('ex, exception, e')
    .description('Throw an exception')
    .action(function print(cmd) {
      this.raise('%s command invoked', [cmd.getOptionString(' | ')]);
    });
}

LoremIpsum.prototype.option = function() {
  this
    .option('-l, --latin', 'Include mock lipsum options and commands')
    .option('-j, --json', 'Print help as json')
    .option('-c, --collapse', 'Collapse whitespace between sections')
    .option('-v, --vanilla', 'Disable parameter replacement')
    .option('-e, --exit', 'Include exit section from error definitions')
    .option('-s, --sort [value]', sort, cli.types.enum(list, true))
    .option('-f, --format [value]', 'Set the help output format',
      cli.types.enum(formats))
    .option('-a, --align [value]',
      'Alignment style (column|line|flex|wrap)',
      cli.types.enum(alignments))
    .option('-m, --maximum [value]', 'Maximum column width, default 80',
      cli.types.integer)
    .help('-h, --help')
    .version();
}

LoremIpsum.prototype.on = function() {
  this
    .once('latin', function(req, arg, value) {
      // add mock options
      this.option('-L, --lorem-ipsum-dolor[=VALUE]', 'Lorem ipsum dolor')
        .option('-i, --ipsum [VALUE]', 'Ipsum dolor sit amet')
        .option('--mauris-pulvinar, --ut-bibendum=[VALUE]', 'Mauris pulvinar')
        .option('-a, --aliquam [VALUE]', paragraphs[2])

      // add mock commands
      var program = this;
      paragraphs.forEach(function(para) {
        var cmd = para.replace(/\s+.*/, '').trim().toLowerCase();
        var desc = para.substr(0, para.indexOf('.') + 1);
        program.command(cmd, desc);
      })
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
      //help.call(this);
      //this.raise('');
      //this.log.info('nothing to do, try %s', '-h | --help');
      process.stdout.write(lipsum);
    });
}

module.exports = function(pkg, name, description) {
  return new LoremIpsum(pkg, name, description);
}
