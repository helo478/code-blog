/**
 * Created by Donald on 6/14/2015.
 */
angular.module("peak15.authentication", ["ui.bootstrap"])

.service("authenticationService", ["$log", function($log) {
  $log.log("Initializing authenticationService");

  var getValidAuthenticatedUser = function() {
      var authenticatedUser = JSON.parse(localStorage.getItem("authenticatedUser"));

    if (authenticatedUser
        && authenticatedUser._id
        && authenticatedUser.userName
        && authenticatedUser.session
        && authenticatedUser.session.userId
        && authenticatedUser.session.token
        && authenticatedUser.session.expiration
        && authenticatedUser.session.expiration > Date.now()) {
      return authenticatedUser;
    }
    else {
      return null;
    }
  };

  this.setAuthenticatedUser = function(authenticatedUser) {
    $log.info("setting authenticated user to ", authenticatedUser);

    localStorage.setItem("authenticatedUser", JSON.stringify(authenticatedUser));
  };

  this.getAuthenticatedUserName = function() {

    var authenticatedUser = getValidAuthenticatedUser();
    if (authenticatedUser) {
      return authenticatedUser.userName;
    }
    else {
      $log.warn("authenticationService trying to access authenticated user name when no authenticated user exists");
      return null;
    }
  };

  this.getAuthenticatedUserId = function() {

    var authenticatedUser = getValidAuthenticatedUser();
    if (authenticatedUser) {
      return authenticatedUser._id;
    }
    else {
      $log.warn("authenticationService trying to access authenticated user id when no authenticated user exists");
      return null;
    }
  };

  this.getSessionToken = function() {

    var authenticatedUser = getValidAuthenticatedUser();
    if (authenticatedUser && authenticatedUser.session) {
      return authenticatedUser.session.token;
    }
    else {
      $log.warn(
        "authenticationService trying to access authenticated user sessionToken when no authenticated user exists");
      return null;
    }
  };

  this.isLoggedIn = function() {
    return getValidAuthenticatedUser() != null;
  };

  this.logOut = function() {
    $log.log("entering module 'authentication' service 'logInService' function 'logOut'");

    // TODO access server side log out function

    localStorage.setItem("authenticatedUser", null);
  };

}])

.directive("logOutButton", ["authenticationService", function(authenticationService) {
  return {
    restrict: "E",
    template: "<span ng-click='logOut()'>Log Out</span>",
    controller: ["$log", "$scope", function($log, $scope) {
      $log.log("initializing directive 'logOutButton' anonymous controller");

      $scope.logOut = function() {
        $log.log("entering directive 'logOutButton' anonymous controller function 'logOut'");

        authenticationService.logOut();
      };
    }],
    controllerAs: "LogOutCtrl"
  };
}])

.directive("logInButton", function() {
  return {
    restrict: "E",
    template: "<span ng-click='openLogInModal()'><span class='glyphicon glyphicon-log-in'></span> Log In</span>",
    controller: ["$log", "$scope", "$modal", "authenticationService", function($log, $scope, $modal, authenticationService) {
      $log.log("initializing directive 'logInButton' anonymous controller");

      $scope.openLogInModal = function() {
        $log.log("entering directive 'logInButton' anonymous controller function 'openLogInModal'");

        var modalInstance = $modal.open({
          templateUrl: "../directives/authentication/log-in-modal.html",
          controller: ["$log", "$scope", "$http", function($log, $scope, $http) {
            $log.log("initializing directive 'logInButton' modal.open anonymous controller");

            // The data model for the form the user types their credentials into
            $scope.logInCredentials = null;
            var initializeLogInCredentials = function() {
              $scope.logInCredentials = {
                userName: "",
                password: ""
              };
            };
            initializeLogInCredentials();

            // Submit the credentials to the server, attempting to log in
            $scope.submit = function() {
              $log.log("entering directive 'logInButton' modal.open anonymous controller function 'submit'");

              var userName = $scope.logInCredentials.userName;
              var password = $scope.logInCredentials.password;

              $http({
                url: "/logIn",
                method: "POST",
                headers: {
                  "content-type": "application/json",
                  "username": userName,
                  "password": password
                }
              }).success(function(data, status, headers, config) {
                $log.info("AJAX callback success for log in", data, status, headers, config);

                authenticationService.setAuthenticatedUser(data);
                modalInstance.close();
                initializeLogInCredentials();

              }).error(function(data, status, headers, config) {
                $log.info("AJAX callback error for log in", data, status, headers, config);
              });
            };

            $scope.cancel = function() {
              $log.log("entering deirective 'logInButton' modal.open anonymous controller function 'cancel'");

              initializeLogInCredentials();
              modalInstance.close();
            }
          }]
        });
      };
    }]
  };
});