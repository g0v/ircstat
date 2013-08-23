angular.module \g0vis, []

sum = (v,k) -> v.map (-> it[k]) .reduce (+), 0
g0visController = ($scope, $http) ->
  $http.get \https://api.github.com/users/g0v/repos,
    params: 
      client_id: \ab2376373fe2da1ccb17
      client_secret: \6560c859d46e79f00dade30999ee62ca5052437d
  .success (d) ->
    $scope.contributors = {}
    $scope.prjs = d
    #$scope.forks = d.map (-> it.forks_count) .reduce (+), 0
    #$scope.issues = d.map (-> it.open_issues) .reduce (+), 0
    $scope.forks = sum d, \forks_count
    $scope.issues = sum d, \open_issues
    $scope.watchers = sum d, \watchers
    $scope.contributor-count = 0
    $scope.prjs-allcontrib = 0
    $scope.commits = 0
    for prj in d
      $http.get "https://api.github.com/repos/g0v/#{prj.name}/stats/commit_activity",
        params: 
          client_id: \ab2376373fe2da1ccb17
          client_secret: \6560c859d46e79f00dade30999ee62ca5052437d
      .success (d) -> 
        commits = 0
        for contrib in d
          commits += contrib.total
        prj.commits = commits
        $scope.commits += commits
      $http.get prj.collaborators_url.replace(/{.+}/, ""), 
        params: 
          client_id: \ab2376373fe2da1ccb17
          client_secret: \6560c859d46e79f00dade30999ee62ca5052437d
      .success (d) ->
        for user in d
          $scope.contributors[user.login] = if $scope.contributors[user.login] => that + 1 else 1
          if $scope.contributors[user.login] == 1 => $scope.contributor-count += 1
          $scope.prjs-allcontrib += 1

#window.onload = ->
#  $.ajax \http://kcwu.csie.org/~kcwu/ircstat/g0v-count.json,
#  .done ->
#    #console.log it
#  .fail -> # fallback to do something
