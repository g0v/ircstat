angular.module \g0vis, []
.config [\$httpProvider, ($httpProvider) ->
  delete $httpProvider.defaults.headers.common[ \X-Requested-With ]
]

sum = (v,k) -> v.map (-> it[k]) .reduce (+), 0
g0visController = ($scope, $http) ->
  $scope.elapsed_day = parseInt(((new Date!)getTime! - new Date(2012,12,1)getTime!)/86400000)
  $http.get \http://kcwu.csie.org/~kcwu/ircstat/g0v-count.json
  .success (data) ->
    console.log data
  $http.get \https://api.github.com/orgs/g0v/repos,
    params: 
      client_id: \ab2376373fe2da1ccb17
      client_secret: \6560c859d46e79f00dade30999ee62ca5052437d
  .success (org-prjs) ->
    org-prjs-list = org-prjs.map (->it.name)
    $http.get \https://api.github.com/users/g0v/repos,
      params: 
        client_id: \ab2376373fe2da1ccb17
        client_secret: \6560c859d46e79f00dade30999ee62ca5052437d
    .success (user-prjs) ->
      user-prjs = user-prjs.filter (-> it.name not in org-prjs-list )
      prjs = org-prjs ++ user-prjs
      $scope.contributors = {}
      $scope.contrib-array = []
      $scope.prjs = prjs
      #$scope.forks = prjs.map (-> it.forks_count) .reduce (+), 0
      #$scope.issues = prjs.map (-> it.open_issues) .reduce (+), 0
      $scope.forks = sum prjs, \forks_count
      $scope.issues = sum prjs, \open_issues
      $scope.watchers = sum prjs, \watchers
      $scope.contributor-count = 0
      $scope.prjs-allcontrib = 0
      $scope.commits = 0
      for _prj in prjs
        ( (prj) -> 
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
          $http.get prj.contributors_url.replace(/{.+}/, ""), 
            params: 
              client_id: \ab2376373fe2da1ccb17
              client_secret: \6560c859d46e79f00dade30999ee62ca5052437d
          .success (d) ->
            for user in d
              if user.login not of $scope.contributors
                v = {name: user.login, total: 0, projects: []}
                $scope.contributors[user.login] = v
                $scope.contrib-array .push v
                $scope.contributor-count += 1
              $scope.contributors[user.login].total += 1
              $scope.contributors[user.login].projects.push prj.name
              $scope.prjs-allcontrib += 1
        ) _prj

