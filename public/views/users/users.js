/**
 * Created by Donald on 5/22/2015.
 */

angular.module("codeBlog.users", ['ngRoute'])

.config(["$routeProvider", function($routeProvider) {

  $routeProvider
    .when(
      "/users", {
        templateUrl: "views/users/users.html",
        controller: "UsersCtrl"
      }
    ).when(
      "/users/:userId", {
        templateUrl: "views/users/user.html",
        controller: "UserCtrl"
      }
    );
}])

.controller("UsersCtrl", ["$log", "$scope", "$http", function($log, $scope, $http) {
  $log.log("initializing UsersCtrl");

  $scope.populateUsers = function() {
    $http({
      url: "/users",
      method: "GET",
      headers: {
        "content-type": "application/json"
      }
    }).success(function(data, status, headers, config) {
      $log.debug("AJAX success for get users: ", data, status, headers, config);
      $scope.users = data;
    }).error(function(data, status, headers, config) {
      $log.error("AJAX error for get users: ", data, status, headers, config);
    });
  };
  $scope.populateUsers();
}])

.controller("UserCtrl", ["$log", "$scope", "$http", "$routeParams",
  function($log, $scope, $http, $routeParams) {

  $log.log("Initializing View2Ctrl");

  $scope.user = null;
  var initializeUser = function() {
    $scope.user = {
      _id: null,
      userName: "",
      blogs: []
    };
  };
  initializeUser();

  $scope.populateUser = function() {
    $log.log("entering users controller function populateUser");

    var userId = $routeParams["userId"];

    $http({
      url: "/users/" + userId,
      method: "GET",
      headers: {
        "content-type": "application/json"
      }
    }).success(function(data, status, headers, config) {
      $log.debug("AJAX callback success for get get user", data, status, headers, config);

      $scope.user = data;
    }).error(function(data, status, headers, config) {
      $log.error("AJAX callback error for get user", data, status, headers, config);
      initializeUser();
    });

    $http({
      url: "/users/" + userId + "/blogs",
      method: "GET",
      headers: {
        "content-type": "application/json"
      }
    }).success(function(data, status, headers, config) {
      $log.debug("AJAX callback success for get user blogs", data, status, headers, config);

      $scope.user.blogs = data;
    }).error(function(data, status, headers, config) {
      $log.error("AJAX callback error for get user blogs", data, status, headers, config);
      initializeUser();
    })
  };
  $scope.populateUser(); // Populate user and blogs
}]);