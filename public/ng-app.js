/**
 * Created by Donald on 5/22/2015.
 */

"use strict";

angular.module("codeBlog", [
  "ngRoute",
  "ui.bootstrap",
  "peak15.navbar",
  "peak15.createAccount",
  "peak15.authentication",
  "peak15.editUser",
  "codeBlog.home",
  "codeBlog.blogDetail",
  "codeBlog.blogsList",
  "codeBlog.newBlog",
  "codeBlog.users"
])

.config(["$routeProvider", function($routeProvider) {
    $routeProvider.otherwise({redirectTo: "/home"});
}])

.controller("AppCtrl", ["$log", "$scope", "authenticationService", function($log, $scope, authenticationService) {
  $log.log("initializing ng-app AppCtrl controller");

  $scope.isLoggedIn = function() {
    return authenticationService.isLoggedIn();
  };

  $scope.getAuthenticatedUserName = function() {
      return authenticationService.getAuthenticatedUserName();
  };

  $scope.getAuthenticatedUserId = function() {
    return authenticationService.getAuthenticatedUserId();
  };
}]);