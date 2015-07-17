/**
 * Created by Donald on 6/14/2015.
 */

angular.module("peak15.createAccount", ["ui.bootstrap"])

.directive("createAccountButton", function() {
  return {
    restrict: "E",
    template: "<span ng-click='openModal()'><span class='glyphicon glyphicon-user'></span> Create Account</span>",
    controller: ["$log", "$scope", "$modal", function($log, $scope, $modal) {
      console.log("initializing directive 'createAccountButton' anonymous controller");

      $scope.openModal = function() {
        $log.log("entering directive 'createAccountButton' anonymous controller function 'openModal'");

        var modalInstance = $modal.open({
          templateUrl: "../directives/create-account/create-account-modal.html",
          controller: ["$log", "$scope", "$http", function($log, $scope, $http) {
            $log.log("initializing directive 'createAccountButton' modal.open anonymous controller");

            $scope.createAccountCredentials = null;
            var initializeCreateAccountCredentials = function() {
              $scope.createAccountCredentials = {
                userName: "",
                password: ""
              };
            };
            initializeCreateAccountCredentials();

            $scope.submit = function() {
              $log.log("entering directive 'createAccountButton' modal.open anonymous controller function 'submit'");

              var userName = $scope.createAccountCredentials.userName;
              var password = $scope.createAccountCredentials.password;
              var betaCode = $scope.createAccountCredentials.betaCode;

              $http({
                url: "/createAccountButton",
                method: "POST",
                headers: {
                  "username": userName,
                  "password": password,
                  "betacode": betaCode
                }
              }).success(function(data, status, headers, config) {
                $log.info("AJAX callback success for create account", data, status, headers, config);

                modalInstance.close();
                initializeCreateAccountCredentials();

              }).error(function(data, status, headers, config) {
                $log.info("AJAX callback error for create account", data, status, headers, config);
              });
            };

            $scope.cancel = function() {
              $log.log("entering directive 'createAccountButton' modal.open anonymous controller function 'cancel'");

              initializeCreateAccountCredentials();
              modalInstance.close();
            };
          }]
        });
      };

    }]
  };
});