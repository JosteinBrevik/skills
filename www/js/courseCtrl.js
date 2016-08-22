/**
 * Created by Jostein on 01.08.2016.
 */
angular.module('skills.controllers')
  .controller('CourseCtrl', ['$scope', '$window', '$timeout', '$log', '$http', 'CourseManager', 'TimerManager', '$location', '$ionicHistory', function($scope, $window, $timeout, $log, $http, CourseManager, TimerManager, $location, $ionicHistory) {

    var values = [];
    var pickedValue = "";
    var file = "";
    $scope.inputVal = {};
    $scope.values = values;
    $scope.$log = $log;
    $scope.log = {text: "Log here"};
    $scope.points = {"points": 0};
    $scope.title = {myTitle: "Course"};
    $scope.customStyle = {}; //Made to change the color of the log
    $scope.focusManager = { focusOnBlur: false}; // This value decides if the keyboard should be visible
    $scope.meta = {};
    $scope.meta.isImageCourse = false;


    //Called to load the data that the picked course contains.
    $scope.loadCourse= function () {
      $scope.$log.log("Initializing course");
      var courseManager = CourseManager.getCourseManager();
      $scope.$log.log(courseManager);
      var filename = courseManager.name;
      var filePath = "JSON/" + filename + ".json";

      $scope.title = {myTitle: courseManager.displayName}; //courseManager.displayName.slice(0).toUpperCase()}; //Changes the title of the view dynamically
      $scope.$log.log("Initializing " + filename + " with " + filePath);
      $http.get(filePath)
        .success(function(data) {
          values = data.values;
          $scope.$log.log(values);
          for(var i = 0; i < values.length; i++){  //Puts everything in lowercase, so that you can copy/paste into the JSON
            values[i].match = values[i].match.join('|').toLowerCase().split('|');  //Clever way to lowercase an array
          }

          var typeOfCourse = data.type.value;
          $scope.meta.isImageCourse = typeOfCourse == "img";

          $scope.chooseRandom();
          $scope.$log.log("Setting new value " + pickedValue.char + " . Type of course: " + typeOfCourse + $scope.meta.isImageCourse);
        });
    };

    /*Takes inputVal from the guessing field in the HTML
     *If it matches the current pickedValue, choose a new value and reset. turnGreen/Red is for logging
     * InputVal is the ng-model of the input field
     * pickedValue is equal to the object in the JSON. Checks if match is equal to the text
     */

    $scope.checkIfCorrect = function() {
      if(typeof $scope.inputVal.text == 'undefined' || $scope.inputVal.text == "") {return;}


      var inputText = $scope.inputVal.text.toLowerCase();
      var matching = pickedValue.match.indexOf(inputText) != -1; //Test if value is the array of accepted answers

      $scope.log.text = "Value is " + " " + inputText + " and " + pickedValue.match + ": " + matching; //For onscreen text
      $scope.$log.log("Input: " + inputText + "  Picked: " + pickedValue.match); //For in-browser log

      if(matching){

        //Check if you're at max points
        if($scope.points.points == 5){
          $scope.checkForNewRecord();
          $ionicHistory.nextViewOptions({
            disableBack: true
          }); //Must reset back button so it doesn't point back to the course (shows burgermenu instead)
          $location.path("#/app");
        }else{
          $scope.points.points += 1;
          $scope.chooseRandom();
          $scope.changeColor("green");
          $scope.inputVal.text = "";
          $scope.setFocusOnInputField();
        }

      }else{
        if($scope.points.points > 0) $scope.points.points -= 1;
        $scope.changeColor("red");

        //TODO: Add more functionality for when you answer wrong
      }
    };

    $scope.checkForNewRecord = function(){
      var currentTime = TimerManager.getTime();
      $scope.$log.log("Time used: " + currentTime);
    };

    //Handles everything on enter
    $scope.$on('$ionicView.beforeEnter', function(e) {
      $scope.$log.log("Entered course");
      $scope.loadCourse();
    });

    // Sets the focus on the input field after entering
    $scope.$on('$ionicView.afterEnter', function(e) {
      $scope.focusManager = { focusOnBlur: true};
      $scope.setFocusOnInputField();
    });

    $scope.$on('modal.shown', function() {
      $scope.$log.log("Modal opened");
      $window.document.activeElement.blur();
      $scope.focusManager = { focusOnBlur: false};
      $scope.removeFocusOnInputField();
    });

    $scope.$on('modal.hidden', function() {
      $scope.$log.log("Modal hidden");
      $scope.setFocusOnInputField();
      $scope.focusManager = { focusOnBlur: true};
    });


    $scope.$on('$ionicView.beforeLeave', function(e) {
      $scope.$log.log("Leaving course");
      $scope.removeFocusOnInputField();
    });

    $scope.removeFocusOnInputField = function(){
      var inputField = $window.document.getElementById("inputbox");
      inputField.blur();
    };

    $scope.setFocusOnInputField = function(){
      var inputField = $window.document.getElementById("inputbox");
      inputField.focus();
    };

    $scope.chooseRandom = function() {
      $scope.setPickedValue(values[Math.floor(Math.random() * values.length)]);
    };

    $scope.setPickedValue = function(newValue){
      pickedValue = newValue;
      $scope.pickedValue = pickedValue;
    };

    $scope.changeColor = function (newColor){
      $scope.customStyle.style = {"color": newColor};
    };



}]);
