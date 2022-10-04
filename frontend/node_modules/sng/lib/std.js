(function(){
  var delay, cycle, lpad, rpad;
  delay = function(ms, callback){
    return setTimeout(callback, ms);
  };
  cycle = function(ms, callback){
    return setInterval(callback, ms);
  };
  lpad = function(str, length, padString){
    padString == null && (padString = ' ');
    while (str.length < length) {
      str = padString + str;
    }
    return str;
  };
  rpad = function(str, length, padString){
    padString == null && (padString = ' ');
    while (str.length < length) {
      str = str + padString;
    }
    return str;
  };
  exports.delay = delay;
  exports.cycle = cycle;
  exports.lpad = lpad;
  exports.rpad = rpad;
}).call(this);
