/**
 * Created by Jostein on 01.08.2016.
 */
angular.module('skills.controllers')
  .controller('InfoCtrl', ['$log', '$scope', 'CourseManager', '$http', function($log, $scope, CourseManager, $http){
    var courseManager = {};
    var courseData = {};
    $scope.courseManager = courseManager;
    $scope.courseData = courseData;
    $scope.$log = $log;
    $scope.courseData.image = "https://learn.getgrav.org/user/pages/11.troubleshooting/01.page-not-found/error-404.png";
    $scope.courseData.text = "Text not found";
    $scope.courseData.title = "404";

    $scope.infoPath = "";

    $scope.getInfo = function(){
      $scope.courseManager = CourseManager.getCourseManager();
      $scope.courseData.title = $scope.courseManager.displayName; //Capitalize the header
      var courseURL = $scope.courseManager.name;
      $scope.infoPath = "./JSON/" + courseURL + ".json";
      $scope.$log.log("Fetching info: " + courseURL);
      $scope.findImageAndText();
    };

    $scope.findImageAndText = function(){
      $scope.$log.log("Getting image and text from " + $scope.infoPath);
      $http.get($scope.infoPath)
        .success(function(data) {
          $scope.courseData.image = data.image.value;
          $scope.courseData.text = data.text.value;
          $log.log($scope.courseData);
        });
    };

    $scope.capitalize = function(text){
      return text.charAt(0).toUpperCase() + text.slice(1);
    };

    //Keeps the courseManager up to date
    $scope.$watch(function(){
      return CourseManager.getCourseManager();
    }, function(NewValue, OldValue){
      $scope.courseManager = NewValue;
      $scope.$log.log("New courseManager @info: " + NewValue.name);
    });

    //Both route- and stateChangeSuccess may be called, depending on implementation. Probably redundant, but better safe than sorry
    $scope.$on('$routeChangeSuccess', function() {

      $scope.getInfo();
    })

    ;$scope.$on('$stateChangeSuccess', function() {
      $scope.getInfo();
    });
  }]);
