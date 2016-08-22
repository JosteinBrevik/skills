// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('skills', ['ionic','ionic.service.core', 'skills.controllers'])

  .run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
    });
  })

  /*Used to carry data from a course to the corresponding info page.
   *Used to set and get a value "text", which equals the name of the course
    */
  .factory('CourseManager', function() {
    var courseManager = {};
    courseManager.name = "Default";
    return {
      getCourseManager: function(){
        return courseManager;
      },
      setCourseManager: function (courseManagerObject) {
        courseManager = courseManagerObject;
      }
    };
  })

  .factory('TimerManager', function() {
    var timerManager = {};
    timerManager.time = 0;
    return {
      getTime: function(){
        return timerManager.time;
      },
      setTime: function (time) {
        timerManager.time = time;
      }
    };
  })


  .directive("detectFocus", function () {
    return {
      restrict: "A",
      scope: {
        onFocus: '&onFocus',
        onBlur: '&onBlur',
        focusOnBlur: '=focusOnBlur'
      },
        link: function (scope, elem) {

          elem.on("focus", function () {
            scope.onFocus();
            scope.focusOnBlur = true;  //note the reassignment here, reason why I set '=' instead of '@' above.
          });

          elem.on("blur", function () {
            scope.onBlur();
            if (scope.focusOnBlur)
              elem[0].focus();
          });
        }
      }
    })


    .config(function($stateProvider, $urlRouterProvider) {
      $stateProvider

        .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
      })

      .state('app.search', {
        url: '/search',
        views: {
          'menuContent': {
            templateUrl: 'templates/search.html'
          }
        }
      })

      .state('app.course', {
        url: '/course',
        views: {
          'menuContent': {
            templateUrl: 'templates/course.html'
          }
        }
      })

      .state('app.browse', {
          url: '/browse',
          views: {
            'menuContent': {
              templateUrl: 'templates/browse.html'
            }
          }
        })


        .state('app.alphabet', {
          url: '/alphabet',
          views: {
            'menuContent': {
              templateUrl: 'templates/alphabet.html'
            }
          }
        })

        .state('app.info', {
          url: '/info',
          views: {
            'menuContent': {
              templateUrl: 'templates/info.html'
            }
          }
        })

        .state('app.cyrillic', {
          url: '/cyrillic',
          views: {
            'menuContent': {
              templateUrl: 'templates/cyrillic.html'
            }
          }
        })

      .state('app.playlists', {
        url: '/playlists',
        views: {
          'menuContent': {
            templateUrl: 'templates/playlists.html',
            controller: 'PlaylistsCtrl'
          }
        }
      })

      .state('app.single', {
        url: '/playlists/:playlistId',
        views: {
          'menuContent': {
            templateUrl: 'templates/playlist.html',
            controller: 'PlaylistCtrl'
          }
        }
      });
      // if none of the above states are matched, use this as the fallback
      $urlRouterProvider.otherwise('/app/playlists');

    });



angular.module('utils.autofocus', [])

  .directive('autofocus', ['$timeout', function($timeout) {
    return {
      restrict: 'A',
      link : function($scope, $element) {
        $timeout(function() {
          $element[0].focus();
        });
      }
    }
  }]);
