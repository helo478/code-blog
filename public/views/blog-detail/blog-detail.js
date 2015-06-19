/**
 * Created by Donald on 6/18/2015.
 */
angular.module("codeBlog.blogDetail", ["ngRoute"])

.config(["$routeProvider", function($routeProvider) {
    $routeProvider.
      when("/blogs/:blogId", {
        templateUrl: "views/blog-detail/blog-detail.html",
        controller: ["$log", "$scope", "$http", "$routeParams", function($log, $scope, $http, $routeParams) {
          $log.log("initializing route '/blogs/:blogId' anonymous controller");

          $scope.blog = null;
          var initializeBlog = function() {
            $scope.blog = {
              'subject': "",
              'body': "",
              'author': {
                "_id": null,
                "userName": ""
              }
            };
          };
          initializeBlog();

          var blogId = $routeParams["blogId"];

          $http({
            url: "/blogs/" + blogId,
            method: "GET",
            headers: {
              "content-type": "application/json"
            }
          }).success(function(data, status, headers, config) {
            $log.debug("AJAX success for get blog detail: ", data, status, headers, config);
            $scope.blog = data;
          }).error(function(data, status, headers, config) {
            $log.error("AJAX error for get blog detail: ", data, status, headers, config);
            // TODO redirect to error page
          })
        }]
      });
}]);