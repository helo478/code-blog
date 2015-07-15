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

  $scope.$watch(
    function(scope) {
      return scope.newBlogEntry.body;
    },
    function() {
      $log.debug("detecting a change to $scope.newBlogEntry.body");
      populatePreview();
    }
  );

  function populatePreview() {
    var target = document.getElementById("new-blog-preview");

    target.innerHTML = "";

    var tokens = $scope.newBlogEntry.body.split("\n");
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