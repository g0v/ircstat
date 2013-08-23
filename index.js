var sum, g0visController;
angular.module('g0vis', []);
sum = function(v, k){
  return v.map(function(it){
    return it[k];
  }).reduce(curry$(function(x$, y$){
    return x$ + y$;
  }), 0);
};
g0visController = function($scope, $http){
  return $http.get('https://api.github.com/users/g0v/repos', {
    params: {
      client_id: 'ab2376373fe2da1ccb17',
      client_secret: '6560c859d46e79f00dade30999ee62ca5052437d'
    }
  }).success(function(d){
    var i$, len$, prj, results$ = [];
    $scope.contributors = {};
    $scope.prjs = d;
    $scope.forks = sum(d, 'forks_count');
    $scope.issues = sum(d, 'open_issues');
    $scope.watchers = sum(d, 'watchers');
    $scope.contributorCount = 0;
    $scope.prjsAllcontrib = 0;
    $scope.commits = 0;
    for (i$ = 0, len$ = d.length; i$ < len$; ++i$) {
      prj = d[i$];
      $http.get("https://api.github.com/repos/g0v/" + prj.name + "/stats/commit_activity", {
        params: {
          client_id: 'ab2376373fe2da1ccb17',
          client_secret: '6560c859d46e79f00dade30999ee62ca5052437d'
        }
      }).success(fn$);
      results$.push($http.get(prj.collaborators_url.replace(/{.+}/, ""), {
        params: {
          client_id: 'ab2376373fe2da1ccb17',
          client_secret: '6560c859d46e79f00dade30999ee62ca5052437d'
        }
      }).success(fn1$));
    }
    return results$;
    function fn$(d){
      var commits, i$, len$, contrib;
      commits = 0;
      for (i$ = 0, len$ = d.length; i$ < len$; ++i$) {
        contrib = d[i$];
        commits += contrib.total;
      }
      prj.commits = commits;
      return $scope.commits += commits;
    }
    function fn1$(d){
      var i$, len$, user, that, results$ = [];
      for (i$ = 0, len$ = d.length; i$ < len$; ++i$) {
        user = d[i$];
        $scope.contributors[user.login] = (that = $scope.contributors[user.login]) ? that + 1 : 1;
        if ($scope.contributors[user.login] === 1) {
          $scope.contributorCount += 1;
        }
        results$.push($scope.prjsAllcontrib += 1);
      }
      return results$;
    }
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