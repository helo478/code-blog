/**
 * Created by Donald on 6/14/2015.
 */

angular.module("createAccount", ["ui.bootstrap"])

.controller("CreateAccountModalCtrl", [function() {

    console.log("Initializing CreateAccountModalCtrl");
}])

.directive("createAccount", function() {
  return {
    restrict: "E",
    template: "<span ng-click='openModal()'><span class='glyphicon glyphicon-user'></span> Create Account</span>",
    controller: ["$log", "$scope", "$modal", function($log, $scope, $modal) {
      console.log("Initializing directive 'createAccount' anonymous controller");

      $scope.openModal = function() {
        $log.log("entering directive 'createAccount' anonymous controller function 'openModal'");

        var modalInstance = $modal.open({
          templateUrl: "modals/create-account-modal/create-account-modal.html",
          controller: ["$log", "$scope", "$http", function($log, $scope, $http) {
            $log.log("initializing directive 'createAccount' modal.open anonymous controller");

            $scope.logInCredentials = null;
            var initializeLogInCredentials = function() {
              $scope.logInCredentials = {
                userName: "",
                password: ""
              };
            };
            initializeLogInCredentials();

            $scope.submit = function() {
              $log.log("entering directive 'createAccount modal.open anonymous controller function 'submit'");

              var userName = $scope.logInCredentials.userName;
              var password = $scope.logInCredentials.password;

              $http({
                url: "/createAccount",
                method: "POST",
                headers: {
                  "username": userName,
                  "password": password
                }
              }).success(function(data, status, headers, config) {
                $log.info("AJAX callback success for create account", data, status, headers, config);


                modalInstance.close();
                initializeLogInCredentials();

              }).error(function(data, status, headers, config) {
                $log.info("AJAX callback error for create account", data, status, headers, config);

              });
            };

            $scope.cancel = function() {
              $log.log("entering directive 'createAccount modal.open anonymous controller function 'cancel'");

              modalInstance.close();
              initializeLogInCredentials();
            };
          }]
        });
      };

    }]
  };
});