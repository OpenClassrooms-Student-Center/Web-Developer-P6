
  var ref$, exec, spawn, jinjs, path, fs, std, nginx_conf, stdio, defaults, _vars, _processes, _proc_stoping, _killed, _stop_callback, _initiated, bind, behavior, load_behavior, extraDirectives, phpExited, nginxExited, tailExited, errExited, killed, start, stop, base;
  
  ref$ = require('child_process'), exec = ref$.exec, spawn = ref$.spawn;
  swig = require('swig');
  path = require('path');
  fs = require('fs');
  std = require('./std');

  swig.setDefaults({ autoescape: false});
  nginx_conf = swig.compileFile(path.join(__dirname, '../templates/nginx.conf.tpl'));
  stdio = require('./stdio');
  defaults = {
    php_bind: '127.0.0.1:9000',
    nginx_bind: '127.0.0.1:8000',
    behavior: 'standard'
  };
  _vars = {
    prefix_dir: 'nginx-',
    php_bind: defaults.php_bind,
    nginx_bind: defaults.nginx_bind,
    fresh: true,
    behavior: defaults.behavior,
    behavior_file: '',
    meta: JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'UTF-8'))
  };
  _processes = {};
  _proc_stoping = false;
  _killed = [];
  _stop_callback = false;
  _initiated = false;
  bind = function(php_bind, nginx_bind){
    _vars.php_bind = php_bind;
    return _vars.nginx_bind = nginx_bind;
  };
  behavior = function(profile){
    var posible, found, i$, len$, next;
    posible = ['zend', 'standard'];
    found = false;
    for (i$ = 0, len$ = posible.length; i$ < len$; ++i$) {
      next = posible[i$];
      if (next === profile) {
        found = true;
      }
    }
    if (!found) {
      stdio.error('Invalid behavior selected: ' + profile);
      return false;
    }
    load_behavior(profile, path.join(__dirname, '../templates/behaviors/', profile + '.conf.tpl'));
    return true;
  };
  load_behavior = function(profile, path){
    _vars.behavior = profile;
    return _vars.behavior_file =  path;
  };
  extraDirectives = function(directivesFile){
    var exists;
    exists = fs.existsSync(directivesFile);
    if (!exists) {
      stdio.error('Passed extra directives file do not exists: ' + directivesFile);
      return false;
    }
    _vars.extraDirectives = fs.readFileSync(directivesFile, 'UTF-8');
    return true;
  };
  phpExited = function(code, signal){
    return killed('php', code, signal);
  };
  nginxExited = function(code, signal){
    return killed('nginx', code, signal);
  };
  tailExited = function(code, signal){
    return killed('tail', code, signal);
  };
  errExited = function(code, signal){
    return killed('err', code, signal);
  };
  killed = function(processName, code, signal){
    if (!_proc_stoping && (code !== 0 || signal !== null)) {
      if (code !== 0) {
        stdio.error('Process "' + processName + '" has exited with errorcode: ' + code);
      } else {
        stdio.error('Process "' + processName + '" has has been killed: ' + signal);
      }
      stdio.error('Shutting down node-sng...');
      stop();
    }
    if (!of$(processName, _killed)) {
      _killed.push(processName);
    }
    if (_killed.length === 4) {
      process.exit();
      return exec('rm -r ' + _vars.tmpdir, function(){
        var res;
        if (_stop_callback) {
          res = {
            vars: _vars,
            processes: _processes
          };
          _stop_callback(null, res);
        } else {
          return std.delay(1000, function(){
            stdio.logme('Server has been closed properly');
            return process.exit();
          });
        }
      });
    }
  };
  start = function(callback){
    callback == null && (callback = false);
    return exec('mktemp -d /tmp/' + _vars.prefix_dir + 'XXXXXXX', function(err, stdout, stderr){
      if (err !== null) {
        stdio.error('exec error:' + err);
        process.exit();
      }
      _vars.tmpdir = stdout.substr(0, stdout.length - 1);
      _vars.access_log = _vars.tmpdir + '/access.log';
      _vars.error_log = _vars.tmpdir + '/error.log';
      _vars.behavior_file = swig.renderFile(_vars.behavior_file, _vars);
      _vars.nginx_conf = nginx_conf(_vars);
      _vars.conffilename = path.join(_vars.tmpdir, 'nginx.conf');
      fs.writeFileSync(_vars.conffilename, _vars.nginx_conf);
      fs.writeFileSync(_vars.access_log, '');
      fs.writeFileSync(_vars.error_log, '');
      if (!callback) {
        stdio.logme('Document root: ' + stdio.emphasize(_vars.base));
        stdio.logme('Behavior: ' + stdio.emphasize(_vars.behavior));
        stdio.logme('NGinx temporary directory is ' + stdio.emphasize(_vars.tmpdir));
      }
      if (!callback) {
        stdio.logme('Starting PHP CGI on ' + stdio.emphasize(_vars.php_bind));
      }
      _processes.php = spawn('php-cgi', ['-b', _vars.php_bind, '-q']);
      _processes.php.on('exit', phpExited);
      if (!callback) {
        _processes.php.stdout.on('data', stdio.print_stdout);
        _processes.php.stderr.on('data', stdio.print_stderr);
      }
      if (!callback) {
        stdio.logme("Starting NGinx CGI on " + stdio.emphasize(_vars.nginx_bind));
      }
      _processes.nginx = spawn('nginx', ['-c', _vars.conffilename]);
      _processes.nginx.on('exit', nginxExited);
      if (!callback) {
        _processes.nginx.stdout.on('data', stdio.print_stdout);
        _processes.nginx.stderr.on('data', stdio.print_stderr);
      }
      _processes.tail = spawn('tail', ['-f', _vars.access_log]);
      _processes.tail.on('exit', tailExited);
      if (!callback) {
        _processes.tail.stdout.on('data', stdio.print_accesslog);
      }
      _processes.err = spawn('tail', ['-f', _vars.error_log]);
      _processes.err.on('exit', errExited);
      if (!callback) {
        _processes.err.stdout.on('data', stdio.print_stderr);
      }
      if (callback) {
        process.nextTick(function(){
          var res;
          res = {
            vars: _vars,
            processes: _processes
          };
          return callback(null, res);
        });
        return;
      }
      return setTimeout;
    });
  };
  stop = function(callback){
    callback == null && (callback = false);
    _stop_callback = callback;
    _proc_stoping = true;
    if (!(_processes.tail === undefined || _processes.tail.killed)) {
      _processes.tail.kill('SIGINT');
    }
    if (!(_processes.nginx === undefined || _processes.nginx.killed)) {
      _processes.nginx.kill('SIGINT');
    }
    if (!(_processes.php === undefined || _processes.php.killed)) {
      _processes.php.kill('SIGINT');
    }
    if (!(_processes.err === undefined || _processes.err.killed)) {
      return _processes.err.kill('SIGINT');
    }
  };
  base = function(base){
    return _vars.base = base;
  };
  exports.defaults = defaults;
  exports.base = base;
  exports.bind = bind;
  exports.start = start;
  exports.stop = stop;
  exports.behavior = behavior;
  exports.load_behavior = load_behavior;
  exports.extraDirectives = extraDirectives;
  function of$(x, arr){
    var i = 0, l = arr.length >>> 0;
    while (i < l) if (x === arr[i++]) return true;
    return false;
  }
