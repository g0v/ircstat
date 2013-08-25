var sum, g0visController;
angular.module('g0vis', []).config([
  '$httpProvider', function($httpProvider){
    var ref$, ref1$;
    return ref1$ = (ref$ = $httpProvider.defaults.headers.common)['X-Requested-With'], delete ref$['X-Requested-With'], ref1$;
  }
]);
sum = function(v, k){
  return v.map(function(it){
    return it[k];
  }).reduce(curry$(function(x$, y$){
    return x$ + y$;
  }), 0);
};
g0visController = function($scope, $http){
  $scope.elapsed_day = parseInt((new Date().getTime() - new Date(2012, 12, 1).getTime()) / 86400000);
  $http.get('http://kcwu.csie.org/~kcwu/ircstat/g0v-count.json').success(function(data){
    return console.log(data);
  });
  return $http.get('https://api.github.com/orgs/g0v/repos', {
    params: {
      client_id: 'ab2376373fe2da1ccb17',
      client_secret: '6560c859d46e79f00dade30999ee62ca5052437d'
    }
  }).success(function(orgPrjs){
    var orgPrjsList;
    orgPrjsList = orgPrjs.map(function(it){
      return it.name;
    });
    return $http.get('https://api.github.com/users/g0v/repos', {
      params: {
        client_id: 'ab2376373fe2da1ccb17',
        client_secret: '6560c859d46e79f00dade30999ee62ca5052437d'
      }
    }).success(function(userPrjs){
      var prjs, i$, len$, _prj, results$ = [];
      userPrjs = userPrjs.filter(function(it){
        return !in$(it.name, orgPrjsList);
      });
      prjs = orgPrjs.concat(userPrjs);
      $scope.contributors = {};
      $scope.contribArray = [];
      $scope.prjs = prjs;
      $scope.forks = sum(prjs, 'forks_count');
      $scope.issues = sum(prjs, 'open_issues');
      $scope.watchers = sum(prjs, 'watchers');
      $scope.contributorCount = 0;
      $scope.prjsAllcontrib = 0;
      $scope.commits = 0;
      for (i$ = 0, len$ = prjs.length; i$ < len$; ++i$) {
        _prj = prjs[i$];
        results$.push(fn$(_prj));
      }
      return results$;
      function fn$(prj){
        $http.get("https://api.github.com/repos/g0v/" + prj.name + "/stats/commit_activity", {
          params: {
            client_id: 'ab2376373fe2da1ccb17',
            client_secret: '6560c859d46e79f00dade30999ee62ca5052437d'
          }
        }).success(function(d){
          var commits, i$, len$, contrib;
          commits = 0;
          for (i$ = 0, len$ = d.length; i$ < len$; ++i$) {
            contrib = d[i$];
            commits += contrib.total;
          }
          prj.commits = commits;
          return $scope.commits += commits;
        });
        return $http.get(prj.contributors_url.replace(/{.+}/, ""), {
          params: {
            client_id: 'ab2376373fe2da1ccb17',
            client_secret: '6560c859d46e79f00dade30999ee62ca5052437d'
          }
        }).success(function(d){
          var i$, len$, user, v, results$ = [];
          for (i$ = 0, len$ = d.length; i$ < len$; ++i$) {
            user = d[i$];
            if (!(user.login in $scope.contributors)) {
              v = {
                name: user.login,
                total: 0,
                projects: []
              };
              $scope.contributors[user.login] = v;
              $scope.contribArray.push(v);
              $scope.contributorCount += 1;
            }
            $scope.contributors[user.login].total += 1;
            $scope.contributors[user.login].projects.push(prj.name);
            results$.push($scope.prjsAllcontrib += 1);
          }
          return results$;
        });
      }
    });
  });
};
function curry$(f, bound){
  var context,
  _curry = function(args) {
    return f.length > 1 ? function(){
      var params = args ? args.concat() : [];
      context = bound ? context || this : this;
      return params.push.apply(params, arguments) <
          f.length && arguments.length ?
        _curry.call(context, params) : f.apply(context, params);
    } : f;
  };
  return _curry();
}
function in$(x, arr){
  var i = -1, l = arr.length >>> 0;
  while (++i < l) if (x === arr[i] && i in arr) return true;
  return false;
}