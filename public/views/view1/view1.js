/**
 * Created by Donald on 5/22/2015.
 */

angular.module("myApp.view1", ['ngRoute', "authentication"])

.config(["$routeProvider", function($routeProvider) {

  $routeProvider.when(
      "/view1", {
      templateUrl: "views/view1/view1.html",
      controller: "View1Ctrl"
  });
}])

.controller("View1Ctrl", ["$scope", "$http", "authenticationService",
    function($scope, $http, authenticationService) {

  console.log("Initializing View1Ctrl");

  $scope.newBlogEntry = null;
  var initializeNewBlogEntry = function() {
    $scope.newBlogEntry = {
      'subject': "",
      'body': ""
    };
  };
  initializeNewBlogEntry();

  $scope.submit = function() {

    var data = {
      'subject': $scope.newBlogEntry.subject,
      'body': $scope.newBlogEntry.body,
      'headers': {
        'userid': authenticationService.getAuthenticatedUserId(),
        'sessionToken': authenticationService.getSessionToken()
      }
    };

    $http({
      url: "/blogs",
      method: "POST",
      data: data
    })
      .success(function(data) {
      $log.log("AJAX success for post blog: ", data);
    })
      .error(function(data) {
        $log.log("AJAX error for post blog: ", data);
    })
  };
}]);