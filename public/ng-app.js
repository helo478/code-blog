/**
 * Created by Donald on 5/22/2015.
 */

"use strict";

angular.module("myApp", [
  "ngRoute",
  "navbar",
  "createAccount",
  "authentication",
  "myApp.home",
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
}]);