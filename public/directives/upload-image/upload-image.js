/**
 * Created by Donald on 7/17/2015.
 */
angular.module("peak15.uploadImage", [])

.directive("uploadImage", function() {
    return {
      restrict: "E",
      templateUrl: "directives/upload-image/upload-image.html",
      controller: [function() {

      }] // end controller
    }; // end return
}); // end directive