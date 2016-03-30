// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('jauzi', ['ionic'])

app.run(function($ionicPlatform,$rootScope) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }

    console.log(window.cordova);

  });
  $rootScope.publicapiUrl = 'http://51.255.43.236:8080/publicapi/';
  $rootScope.imagesUrl = 'http://backend.jauzi.eus/upload/';
  $rootScope.audiosUrl = 'http://backend.jauzi.eus/upload/audio/';
  $rootScope.videosUrl = 'http://backend.jauzi.eus/upload/video/';
  
  $rootScope.getHttpRequestConfig = function(){
    var headers = {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'};
    return {
      headers: headers,
      transformRequest: function(obj) {
          var str = [];
          for(var p in obj)
          str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
          return str.join("&");
      }
    }
  }

  $rootScope.loadedVideo = '';

  $ionicPlatform.on('pause',function(){
    $rootScope.loadedVideo = '';
    $rootScope.$apply();   
  });
})

app.config(['$stateProvider','$urlRouterProvider', function($stateProvider ,$urlRouterProvider){

  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('home',{
      url: '/',
      templateUrl: 'templates/home.html',
      controller: 'homeCtrl'
    })
    .state('slider',{
      url: '/slider',
      templateUrl: 'templates/slider.html',
      controller: 'sliderCtrl'
    })
    .state('urratsa',{
      url: '/urratsa/:id',
      templateUrl: 'templates/hurratsa.html',
      controller: 'hurratsaCtrl'
    })
    .state('dantza',{
      url: '/dantza/:id',
      templateUrl: 'templates/dantza.html',
      controller: 'dantzaCtrl'
    })
    .state('glosarioa',{
      url: '/glosarioa',
      templateUrl: 'templates/glosarioa.html',
      controller: 'glosarioaCtrl'
    })
    .state('about',{
      url: '/about',
      templateUrl: 'templates/about.html'
    })
    .state('glosarioaDetail',{
      url: '/glosarioaDetail/:id',
      templateUrl: 'templates/glosarioaDetail.html',
      controller: 'glosarioaDetailCtrl'
    })
    .state('guriBuruz',{
      url: '/guriBuruz',
      templateUrl: 'templates/guriBuruz.html',
      controller: 'glosarioaDetailCtrl'
    });
}])

app.controller('NavigationCtrl',['$scope','$ionicSideMenuDelegate','$rootScope','$http','$location','$ionicSlideBoxDelegate','$ionicPlatform','$ionicHistory',function($scope,$ionicSideMenuDelegate,$rootScope,$http,$location,$ionicSlideBoxDelegate,$ionicPlatform,$ionicHistory){
  
  /* Init jbar */
  $scope.jbar = {};

  $scope.jbar.visible = true;
  $scope.jbar.title = '';

  $scope.openLink = function(url,target,location){
    window.open(url,target,location);
  };

  $scope.toggleLeft = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };

  $scope.back = function(state){
    $ionicHistory.goBack();
  };

  /* Get app paused */

  $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
      $scope.jbar.visible = true;
      switch(toState.name){
        case 'home': {
          if(!localStorage.getItem('visited')){
            localStorage.setItem('visited','visited');
            $location.path('slider');
          }
          $scope.jbar.visible = true;
          $scope.jbar.title = 'JAUZI';
          $scope.jbar.leftAction = 'menu';
          if($rootScope.danceOrStep !== 'steps'){
            $rootScope.danceOrStep = 'dances';
          }
          $rootScope.isHome = true;
        };
        break;
        case 'dantza':{
          $rootScope.danceOrStep = 'dances';
          $scope.jbar.visible = true;
          $scope.jbar.title = '';
          $scope.jbar.leftAction = 'back';
          $rootScope.isHome = false;
          $http.get($rootScope.publicapiUrl + 'dance/' + toParams.id,$rootScope.getHttpRequestConfig()).then(function(response){
            $scope.jbar.title = response.data.name;
          });
        };
        break;
        case 'urratsa': {
          $rootScope.danceOrStep = 'steps';
          $scope.jbar.visible = true;
          $scope.jbar.title = '';
          $scope.jbar.leftAction = 'back';
          $rootScope.isHome = false;
          $http.get($rootScope.publicapiUrl + 'step/' + toParams.id,$rootScope.getHttpRequestConfig()).then(function(response){
            $scope.jbar.title = response.data.name;
          });
        } 
        break;
        case 'slider':{
          $scope.jbar.visible = false;
          $rootScope.isHome = false;
        };
        break;
        case 'glosarioa':{
          $scope.jbar.visible = true;
          $scope.jbar.title = 'Glosarioa';
          $scope.jbar.leftAction = 'menu'; 
          $rootScope.danceOrStep = 'dances';
          $rootScope.isHome = false;
        };
        break;
        case 'glosarioaDetail':{
            $scope.jbar.visible = true;
            $scope.jbar.leftAction = 'back';
            $rootScope.danceOrStep = 'dances';
            $rootScope.isHome = false;
            $http.get($rootScope.publicapiUrl + 'definition/' + toParams.id,$rootScope.getHttpRequestConfig()).then(function(response){
              $scope.jbar.title = response.data.name;
            });
        };
        break;
        case 'guriBuruz':{
            $scope.jbar.visible = true;
            $scope.jbar.title = 'JAUZIri buruz';
            $scope.jbar.leftAction = 'menu';
            $rootScope.danceOrStep = 'other';
            $rootScope.isHome = false;
            $http.get($rootScope.publicapiUrl + 'definition/' + toParams.id,$rootScope.getHttpRequestConfig()).then(function(response){
              $scope.jbar.title = response.data.name;
            });
        };
        break;
        case 'about':{
            $scope.jbar.visible = true;
            $scope.jbar.title = 'Kredituak';
            $scope.jbar.leftAction = 'menu';
            $rootScope.danceOrStep = 'other';
            $rootScope.isHome = false;
        };
        break;
      }
  });

  


}])
