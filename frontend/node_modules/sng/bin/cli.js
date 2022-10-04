#!/usr/bin/env node

var i$, ref$, len$, param, sng_conf_file;

var path = require('path');
var optimist = require('optimist');
var fs = require('fs');

var sng = require('../lib/sng');


var argv = optimist.usage('sng [basedir]')['default']({
  n: sng.defaults.nginx_bind,
  p: sng.defaults.php_bind,
  b: sng.defaults.behavior
}).alias({
  n: 'nginx-base',
  p: 'php-bind',
  b: 'behavior',
  x: 'extra-directives',
  h: 'help'
}).describe({
  n: 'Default binding NGinx wil be listening on',
  p: 'Default binding address for php-cgi',
  b: 'Changes behavior. Avialable are: "standard", "zend"',
  x: 'Extra directives file for the NGinx server'
}).argv;

if (optimist.argv.h) {
  optimist.showHelp();
  process.exit();
  return;
}

if (optimist.argv._.length > 0) {
  for (i$ = 0, len$ = (ref$ = optimist.argv._).length; i$ < len$; ++i$) {
    param = ref$[i$];
    if (typeof param === 'string') {
      sng.base_path = param;
      break;
    }
  }
  if (typeof sng.base_path !== 'string') {
    sng.base_path = process.cwd();
  }
  if (sng.base_path[0] != '/') {
    sng.base_path = path.join(process.cwd(), sng.base_path);
  }
} else {
  sng.base_path = process.cwd();
}

sng.base(sng.base_path);
sng_conf_file = path.join(sng.base_path, '.sng.conf');

if (fs.existsSync(sng_conf_file + '.tpl')) {
  sng.load_behavior('sng conf file', sng_conf_file);
} else {
  if (!sng.behavior(argv.b)) {
    optimist.showHelp();
    process.exit();
    return;
  }
}

if (argv.x !== undefined && !sng.extraDirectives(argv.x)) {
  process.exit();
}

sng.bind(argv.p, argv.n);
sng.start();
process.stdin.resume();

process.on('SIGINT', function(){
  console.log("\nInterrupted");
  return sng.stop();
});

process.on('SIGTERM', function(){
  console.log("\nTerminated");
  return sng.stop();
});
