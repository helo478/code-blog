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
            populateBody();
          }).error(function(data, status, headers, config) {
            $log.error("AJAX error for get blog detail: ", data, status, headers, config);
            // TODO redirect to error page
          });

          function populateBody() {
            var target = document.getElementById("blog-detail-body");
            var tokens = $scope.blog.body.split("\n");
            var newCode;

            tokens.forEach(function(token) {

              if (isCode(token)) {
                // If there is not an existing code section, create one
                if (!newCode) {
                  newCode = document.createElement("pre");
                  newCode.className += "prettyprint";
                }
                else {
                  // Add a line break
                  newCode.textContent += "\n";
                }

                // Add the code line
                newCode.textContent += token.substring(3);
              }
              else {
                // If the last line was code, add the code section
                if (newCode) {
                  target.appendChild(newCode);
                  newCode = null;
                }

                // Add the non-code line
                var newParagraph = document.createElement("p");
                newParagraph.textContent = token;
                target.appendChild(newParagraph);
              }
            });

            // Add a final code section, if exists
            if (newCode) { target.appendChild(newCode); }

            prettyPrint();
          }

          function isCode(line) {
            return line.startsWith("    ");
          }
        }]
      });
}]);