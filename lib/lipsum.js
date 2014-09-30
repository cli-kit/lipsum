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
