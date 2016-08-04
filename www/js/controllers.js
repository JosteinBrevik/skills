
angular.module('skills.controllers', [])
  //If you want to move one of these to its own file, look at courseCtrl and add a new script src in index.html


  .controller('TimerCtrl', ['$log', '$scope', '$timeout', function($log, $scope, $timeout){
    var startTime = Date.now();
    $scope.$log = $log;
    $scope.timer = {"timeSinceStart" : "0"};
    var timeKeeper;


    $scope.setStartTime = function(){
      startTime = Date.now();
      $scope.$log.log("StartTime: " + startTime);
      $scope.timer.timeSinceStart = 0;
    };

    $scope.startTimer = function(){
      $scope.$log.log("ticK");
      $scope.timer.timeSinceStart = Math.floor((Date.now() - startTime)/1000);
      timeKeeper = $timeout($scope.startTimer, 1000);
    };
    $scope.startTimer();

    //Both route- and stateChangeSuccess may be called, depending on implementation. Probably redundant, but better safe than sorry
    $scope.$on('$viewContentLoaded', function() {
      $scope.setStartTime();
    });

    /*$scope.$on('$stateChangeSuccess', function() {
      $scope.setStartTime();
    });*/

    $scope.$on("$destroy", function(){
      $timeout.cancel(timeKeeper);
      $scope.$log.log("Destroyed timer");
    });

  }])

  /*
    Controller for the main menu with all the courses
    CourseManager is a factory used for storing the name of the currently selected course
   */
.controller('CoursesListCtrl', ['$log', '$scope', '$http', 'CourseManager', function($log, $scope, $http, CourseManager){
  $scope.$log = $log;
  $scope.categories = [];
  $scope.courses = [];
  $scope.status = {text: "Status"};

  //Finds all the different categories, and courses within these
  //Creates a 2d array (courses) which is then used in the html
  $scope.init = function(){
    $scope.$log.log("Initializing courseList");
    $http({
      method: 'GET',
      url: "./JSON/courses.json"  // './' is a relative path, '/' is absolute. Relative works better on Android
    }).then(function successCallback(response) {
      $scope.$log.log("Success fetching response" + response);
      var data = response.data;
      $scope.categories = Object.keys(data); //Categories like alphabets and geography
      $scope.courses = new Array($scope.categories.length);
      for(var i = 0; i < $scope.categories.length; i++){
        $scope.courses[i] = data[$scope.categories[i]];  //Courses like Cyrillic and European Capitals
      }
      $scope.$log.log("Success fetching courseList");
    }, function errorCallback(response) {
      $scope.$log.log("Error occurred fetching courseList" + response);
      $scope.courses[0][0] = {name: "error", displayName: "error"};
    });
  };

  //Sets the current course to the clicked index. Course view is loaded after this (done in the html-file)
  $scope.courseClicked = function(category, index){
    $scope.$log.log("Category: " + category + " Index: " + index);
    var catIndex = $scope.categories.indexOf(category);
    CourseManager.setCourseManager($scope.courses[catIndex][index]);


    $scope.$log.log("New CourseManager: " + CourseManager.getCourseManager().name);
  }
}])


  /*Controller for each courses info page
    courseManager retrieves what course is currently selected
    courseData holds the text and image to be displayed
   */


//This is only here because I am a mercyful God
.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Smooth jazz', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
})

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/info.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.openModal = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };

  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
});
