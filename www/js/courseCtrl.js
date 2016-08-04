/**
 * Created by Jostein on 01.08.2016.
 */
angular.module('skills.controllers')
  .controller('CourseCtrl', ['$scope', '$window', '$timeout', '$log', '$http', 'CourseManager', '$location', '$ionicHistory', function($scope, $window, $timeout, $log, $http, CourseManager, $location, $ionicHistory) {

  var values = [];
  var pickedValue = "";
  $scope.inputVal = {};
  $scope.$log = $log;
  $scope.log = {text: "Log here"};
  $scope.points = {"points": 0};
  $scope.title = {myTitle: "Course"};
  $scope.customStyle = {}; //Made to change the color of the log
  $scope.focusManager = { focusOnBlur: true};


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
        //file = filename;
        values = data.values;
        $scope.$log.log(values);
        for(var i = 0; i < values.length; i++){  //Puts everything in lowercase, so that you can copy/paste into the JSON
          values[i].match = values[i].match.join('|').toLowerCase().split('|');  //Clever way to lowercase an array
        }
        $scope.values = values;
        $scope.chooseRandom();
        $scope.$log.log("Setting new value " + pickedValue.char);
      });
  };

  //Both route- and stateChangeSuccess may be called, depending on implementation. Probably redundant, but better safe than sorry
  $scope.$on('$routeChangeSuccess', function() {
    $scope.loadCourse();
  });

  $scope.$on('$stateChangeSuccess', function() {
    $scope.loadCourse();
  });



  /*Takes inputVal from the guessing field in the HTML
   *If it matches the current pickedValue, choose a new value and reset. turnGreen/Red is for logging
   * InputVal is the ng-model of the input field
   * pickedValue is equal to the object in the JSON. Checks if match is equal to the text
   */

  $scope.checkIfCorrect = function() {
    var matching = pickedValue.match.indexOf($scope.inputVal.text.toLowerCase()) != -1; //Test if value is in array

    $scope.log.text = "Value is " + " " + $scope.inputVal.text + " and " + pickedValue.match + ": " + matching; //For onscreen text
    $scope.$log.log("Input: " + $scope.inputVal.text + "  Picked: " + pickedValue.match); //For in-browser log

    if(matching){

      //Check if you're at max points
      if($scope.points.points == 5){
        $ionicHistory.nextViewOptions({
          disableBack: true
        }); //Must reset back button so it doesn't point back to the course
        $location.path("#/app");
      }else{
        $scope.points.points += 1;
        $scope.chooseRandom();
        $scope.changeColor("green");
        $scope.inputVal.text = "";
      }

    }else{
      if($scope.points.points > 0) $scope.points.points -= 1;
      $scope.changeColor("red");

      //TODO: Add more functionality for when you answer wrong
    }

    $scope.setFocusOnInputField();
  };

  $scope.setFocusOnInputField = function(){
    var inputField = $window.document.getElementById("inputbox");
    $scope.$log.log(inputField);
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
