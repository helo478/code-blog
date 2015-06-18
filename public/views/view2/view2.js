/**
 * Created by Donald on 5/22/2015.
 */

angular.module("myApp.view2", ['ngRoute'])

.config(["$routeProvider", function($routeProvider) {

  $routeProvider.when(
    "/view2/:userId", {
      templateUrl: "views/view2/view2.html",
      controller: "View2Ctrl"
    });
}])

.controller("View2Ctrl", ["$log", "$scope", "$http", "$routeParams",
  function($log, $scope, $http, $routeParams) {

  $log.log("Initializing View2Ctrl");

  $scope.blogs = [];

  /*
   * $scope.populateBlogs
   *
   * Gets the data for all blogs written by a given user.
   * The user id is passed in $routeParams
   * If successful, $scope.blogs will contain an array of blogs
   */
  $scope.populateBlogs = function() {
    $log.log("entering view2 controller function populateBlogs");

    var userId = $routeParams["userId"];

    $http({
      url: "/users/" + userId + "/blogs",
      method: "GET",
      headers: {
        "content-type": "application/json"
      }
    }).success(function(data, status, headers, config) {
      $log.info("AJAX callback success for get get blogs by user", data, status, headers, config);

      $scope.blogs = data["blogs"];
    }).error(function(data, status, headers, config) {
      $log.info("AJAX callback error for log in", data, status, headers, config);
    });
  };
  $scope.populateBlogs(); // Populate blogs when the controller initializes
}]);