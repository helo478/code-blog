/**
 * Created by Donald on 7/17/2015.
 */
angular.module("peak15.editUser", ["peak15.uploadImage"])

.config(["$routeProvider", function($routeProvider) {
    $routeProvider
      .when("/edit-user/:userId", {
        templateUrl: "views/edit-user/edit-user.html",
        controller: ["$log", "$scope", "$routeParams", "$location", "users",
            function($log, $scope, $routeParams, $location, users) {

          $log.debug("entering edit-user anonymous controller for user: " + $routeParams["userId"]);

          function initializeUserData() {
            $scope.user = {
              _id: null,
              name: "",
              emailAddress: ""
            };
          }
          initializeUserData();

          $scope.populateUserData = function() {
            users.getUserData($routeParams["userId"], function(userData, error) {
              if (userData) {
                $scope.user = userData;
              }
              else {
                initializeUserData();
                alert("Error: " + error);
              }
            });
          }; // end populateUserData
          $scope.populateUserData();

          $scope.updateUserData = function() {
            users.updateUserData($scope.user, function(data, error) {
              if (data.success) {
                $scope.initializeUserData();
                $location.path("users/" + data._id);
              }
              else if (error) {
                alert(error);
              }
              else {
                alert("An unknown error has occurred");
              }
            });
          }; // end updateUserData

        }] // end controller
    }); // end $routeProvider.when
}]); // end config