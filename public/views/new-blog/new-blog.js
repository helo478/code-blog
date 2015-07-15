/**
 * Created by Donald on 5/22/2015.
 */

angular.module("codeBlog.newBlog", ['ngRoute', "peak15.authentication"])

.config(["$routeProvider", function($routeProvider) {

  $routeProvider.when(
      "/newBlog", {
      templateUrl: "views/new-blog/new-blog.html",
      controller: "NewBlogCtrl"
  });
}])

.controller("NewBlogCtrl", ["$log", "$scope", "$http", "$location", "authenticationService",
    function($log, $scope, $http, $location, authenticationService) {

  console.log("Initializing NewBlogCtrl");

  $scope.newBlogEntry = null;
  var initializeNewBlogEntry = function() {
    $scope.newBlogEntry = {
      'subject': "",
      'body': ""
    };
  };
  initializeNewBlogEntry();

  $scope.parsedNewBlogEntryBody = "";

  $scope.refreshNewBlogEntryBody = function() {
    $log.debug("entering 'NewBlogCtrl' controller 'refreshNewBlogEntryBody' function")
    $scope.parsedNewBlogEntryBody = $scope.newBlogEntry.body.split("\n");
  };

  $scope.isCode = function(line) {
     return line === "code" || line === "codex";
  }

  $scope.submit = function() {
    $log.log("entering 'NewBlogCtrl' function 'submit'");

    $http({
      url: "/blogs",
      method: "POST",
      data: $scope.newBlogEntry,
      headers: {
        'userid': authenticationService.getAuthenticatedUserId(),
        'token': JSON.stringify(authenticationService.getSessionToken())
      }
    })
      .success(function(data, status, headers, config) {
        $log.log("AJAX success for post blog: ", data, status, headers, config);
        initializeNewBlogEntry();
        $location.path("blogs/" + data._id);
    })
      .error(function(data, status, headers, config) {
        $log.error("AJAX error for post blog: ", data, status, headers, config);
    });
  };
}]);