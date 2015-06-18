/**
 * Created by Donald on 6/14/2015.
 */
angular.module("authentication", ["ui.bootstrap"])

.service("authenticationService", ["$log", function($log) {

  $log.log("Initializing logInProvider");

  var authenticationService = this;

  var authenticatedUser = null;
  var initializeAuthenticatedUser = function() {
    authenticatedUser = {
      _id: null,
      userName: null,
      session: {
        userId: null,
        sessionToken: null,
        expiration: null
      }
    };
  };
  initializeAuthenticatedUser();

  this.setAuthenticatedUser = function(_authenticatedUser) {
    $log.info("setting authenticated user to ", _authenticatedUser);

    authenticatedUser = _authenticatedUser;
  };

  this.getAuthenticatedUserName = function() {
    if (authenticatedUser) {
      return authenticatedUser.userName;
    }
    return null;
  };

  this.getAuthenticatedUserId = function() {
    if (authenticatedUser) {
      return authenticatedUser._id;
    }
  };

  this.getSessionToken = function() {
    return authenticatedUser.session.sessionToken;
  };

  this.isLoggedIn = function() {
    return authenticatedUser != null && authenticatedUser._id != null;
  };

  this.logOut = function() {
    $log.log("entering module 'authentication' service 'logInService' function 'logOut'");

    initializeAuthenticatedUser();
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
              $log.log("entering directive 'logInButton modal.open anonymous controller function 'submit'");

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
          }]
        });
      };
    }]
  };
});