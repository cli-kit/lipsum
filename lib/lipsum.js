var util = require('util');
var interface = require('cli-interface');
var cli = require('cli-command'), help = cli.help;
var Interface = interface.Interface;

var fs = require('fs');
var path = require('path');
var convert = require('cli-native');
var formats = cli.doc.fmt.formats;
var description = 'Lorem ipsum is a program used to test help output.\n\n';
description += 'If it looks like latin then it does nothing, other more ';
description += 'meaningful options that have an affect are interspersed, ';
description += 'try --align and --format in particular. The examples are ';
description += 'valid, they illustrate some of the program functionality.';
var sections = {};
var lipsum = '' + fs.readFileSync(path.join(__dirname, '..', 'lipsum.txt'));
var paragraphs = lipsum.split('\n\n');
sections.examples = [
  {
    name: 'lipsum -j',
    description: 'Print help as JSON'
  },
  {
    name: 'lipsum -f=markdown',
    description: 'Print help as markdown'
  },
  {
    name: 'lipsum --align flex',
    description: 'Switch to flex alignment'
  },
  {
    name: 'lipsum --maximum=100',
    description: 'Increase maximum column width'
  },
  {
    name: 'lipsum --sort null',
    description: 'Disable help option sort (natural order)'
  },
  {
    name: 'lipsum --sort false',
    description: 'Use default sort order'
  },
  {
    name: 'lipsum --sort true',
    description: 'Use lexicographic sort order'
  },
  {
    name: 'lipsum --sort 1',
    description: 'Sort by length of option (longest first)'
  },
  {
    name: 'lipsum --sort -1',
    description: 'Sort by length of option (shortest first)'
  },
  {
    name: 'lipsum --no-color',
    description: 'Disable ansi colors'
  },
]

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

var usage = '[-jcve] [--json] [--collapse] [--vanilla] ';
usage += '[--sort=null|false|true|1|-1]\n[--format=text|json|markdown] ';
usage += '[--align=column|line|flex|wrap] ';
usage += '[--maximum=INT]';

var stash = {};

var LoremIpsum = function() {
  Interface.apply(this, arguments);
}

util.inherits(LoremIpsum, Interface);

LoremIpsum.prototype.configure = function() {
  var conf = {stash: stash, copyright: copyright, help: {sections: sections}};
  this
    .configure(conf)
    .usage(usage)
    .description(description);
}

LoremIpsum.prototype.use = function() {
  this
    .use(cli.middleware.color)
    .use(cli.middleware.debug);
}

LoremIpsum.prototype.command = function() {
  var program = this;
  paragraphs.forEach(function(para) {
    var cmd = para.replace(/\s+.*/, '').trim().toLowerCase();
    var desc = para.substr(0, para.indexOf('.') + 1);
    program.command(cmd, desc);
  })
}

LoremIpsum.prototype.option = function() {
  this
    .option('-j, --json', 'Print help as json')
    .option('-c, --collapse', 'Collapse whitespace between sections')
    .option('-v, --vanilla', 'Disable parameter replacement')
    .option('-e, --exit', 'Include exit section from error definitions')
    .option('-s, --sort [value]', sort, cli.types.enum(list, true))
    .option('-f, --format [value]', 'Set the help output format',
      cli.types.enum(formats))
    .option('-a, --align [value]',
      'Alignment style (column|line|flex|wrap)',
      cli.types.enum(['column', 'line', 'flex', 'wrap']))
    .option('-m, --maximum [value]', 'Maximum column width, default 80',
      cli.types.integer)
    .option('-L, --lorem-ipsum-dolor[=VALUE]', 'Lorem ipsum dolor')
    .option('-i, --ipsum [VALUE]', 'Ipsum dolor sit amet')
    .option('--mauris-pulvinar, --ut-bibendum=[VALUE]', 'Mauris pulvinar')
    .option('-a, --aliquam [VALUE]', paragraphs[2])
    .help()
    .version();
}

LoremIpsum.prototype.on = function() {
  this
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
    .on('complete', function(req) {
      help.call(this);
    });
}

module.exports = function(pkg, name, description) {
  return new LoremIpsum(pkg, name, description);
}
