(function(){
  var util, fs, std, colors, fresh, logme, error, emphasize, print_stdout, print_ngnix_conf, print_stderr, print_accesslog;
  util = require('util');
  fs = require('fs');
  std = require('./std');
  colors = {
    chead: '\x1b[96;1m',
    cblue: '\x1b[94;1m',
    cgreen: '\x1b[92;1m',
    cred: '\x1b[91;1m',
    cyellow: '\x1b[93;1m',
    cfail: '\x1b[91m',
    cend: '\x1b[0m'
  };
  fresh = true;
  logme = function(data, arrow){
    arrow == null && (arrow = true);
    if (arrow) {
      return console.log('  ' + colors.cgreen + '==>' + colors.cend + ' ' + data);
    } else {
      return console.log('   ' + data);
    }
  };
  error = function(data){
    return console.log(colors.cfail + data.toString() + colors.cend);
  };
  emphasize = function(data){
    return colors.chead + data + colors.cend;
  };
  print_stdout = function(data){
    return util.print(data.toString());
  };
  print_ngnix_conf = function(file, lineno, context){
    var conf, i, i$, ref$, len$, line, results$ = [];
    context == null && (context = 7);
    conf = fs.readFileSync(file, 'UTF-8');
    i = 1;
    for (i$ = 0, len$ = (ref$ = conf.split("\n")).length; i$ < len$; ++i$) {
      line = ref$[i$];
      if (i >= lineno - context && i <= lineno + context) {
        if (i === lineno) {
          error(colors.cred + '--> ' + std.lpad(i + ':', 4) + line);
        } else {
          error(std.lpad(i + ':', 8) + line);
        }
      }
      results$.push(i += 1);
    }
    return results$;
  };
  print_stderr = function(data){
    var str, ngnix_err, match;
    str = data.toString();
    ngnix_err = /in (\/tmp\/nginx-.{7}\/nginx.conf):(\d+)/m;
    if (fresh && !ngnix_err.test(str)) {
      fresh = false;
    } else {
      util.print(colors.cred + str + colors.cend);
    }
    match = ngnix_err.exec(str);
    if (match !== null) {
      return print_ngnix_conf(match[1], parseInt(match[2]));
    }
  };
  print_accesslog = function(data){
    var mdata, line, request, mode, url, proto, status, length, time, fro, bytes_sent;
    mdata = data.toString();
    line = mdata.split('||');
    request = line[0].split(' ');
    mode = request[0];
    url = request[1];
    proto = request[2];
    status = line[1];
    length = line[2];
    time = line[3];
    fro = line[4];
    bytes_sent = parseInt(line[5]) / 1024;
    if (parseInt(status) >= 400) {
      status = colors.cred + status + colors.cend;
    } else {
      status = colors.cgreen + status + colors.cend;
    }
    return console.log(colors.cblue + mode + colors.cend + ' ' + colors.cyellow + url + colors.cend + ' ' + status + ' (' + colors.chead + fro + colors.cend + ') ' + colors.cblue + bytes_sent + colors.cend + 'Kb, ' + colors.cblue + time + colors.cend + 's');
  };
  exports.logme = logme;
  exports.error = error;
  exports.emphasize = emphasize;
  exports.print_stdout = print_stdout;
  exports.print_stderr = print_stderr;
  exports.print_accesslog = print_accesslog;
}).call(this);
