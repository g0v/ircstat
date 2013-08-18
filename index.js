window.onload = function(){
  return $.ajax('http://kcwu.csie.org/~kcwu/ircstat/g0v-count.json').done(function(){}).fail(function(){});
};