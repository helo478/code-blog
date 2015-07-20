/**
 * Created by Donald on 5/22/2015.
 */

angular.module("codeBlog.users", ['ngRoute', "peak15.editUser", "peak15.authentication"])

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

      // Iterate in reverse through each blog and format code
      if ($scope.user.blogs) {
        $scope.user.blogs.reverse().forEach(function (blog, index) {
          formatBody(blog, index);
        });
      }

    }).error(function(data, status, headers, config) {
      $log.error("AJAX callback error for get user blogs", data, status, headers, config);
      initializeUser();
    });
  };
  $scope.populateUser(); // Populate user and blogs

  function isCode(line) {
    return line.startsWith("    ");
  }

  function formatBody(blog, index) {

    var target = document.getElementById("user-blog-" + index);

    if (target) {

      var tokens = blog.body.split("\n");
      var newCode;

      tokens.forEach(function (token) {

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
      if (newCode) {
        target.appendChild(newCode);
      }

      prettyPrint();
    }
    else {
      setTimeout(function() {formatBody(blog, index); }, 1000);
    }
  } // end formatBody
}])// end userCtrl

.service("users", ["$log", "$http", "authenticationService",
    function($log, $http, authenticationService) {

  this.getUserData = function(userId, callback) {
    $log.debug("entering users service function 'getUserData' for userId: " + userId);

    $http({
      url: "/users/" + userId,
      method: "GET",
      headers: {
        "content-type": "application/json"
      }
    }) // end http
      .success(function(data) {
        $log.debug("AJAX success for getUserData: ", data);
        callback(data);
    }) // end success
      .error(function(data, status, headers, config) {
        $log.error("AJAX error for getUserData: ", data, status, headers, config);
        callback(null, "An unknown error has occurred");
    }); // end error
  };

  this.updateUserData = function(user, callback) {

    var userId = user._id;

    $log.debug("entering users service function 'updateUserData' for userId: " + userId);

    $http({
      url: "/users/" + userId,
      method: "PUT",
      data: user,
      headers: {
        "content-type": "application/json",
        "userid": authenticationService.getAuthenticatedUserId(),
        "token": JSON.stringify(authenticationService.getSessionToken())
      }
    }) // end http
      .success(function(data, status, headers, config) {
        $log.log("AJAX success for updateUserData for userId: " + userId);
        $log.debug(status, headers, config);
        callback(data);
    }) // end success
      .error(function(data, status, headers, config) {
        $log.error("AJAX error for updateUserData: ", data, status, headers, config);
        callback(null, "An unknown error has occurred");
    }); // end error
  };
}]);