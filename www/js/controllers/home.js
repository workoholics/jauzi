'use strict';

/**
 * @ngdoc function
 * @name jauziBackApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the jauziBackApp
 */
angular.module('jauzi')
  .controller('homeCtrl', function ($scope,$http,$rootScope,$ionicSlideBoxDelegate) {

    // Obtener datos de los bailes
    $http.get($rootScope.publicapiUrl + 'dances',$rootScope.getHttpRequestConfig()).then(function(response){
    	$scope.dances = response.data;
    });

    // Obtener dados de los pasos
    $http.get($rootScope.publicapiUrl + 'steps',$rootScope.getHttpRequestConfig()).then(function(response){
    	$scope.steps = response.data;
        $('.urratsak-list').css({height: 0});
    });

    

    $scope.changeActive = function(index){
        if(index === 0){
            $rootScope.danceOrStep = 'dances';
        }
        else if(index === 1){
            $rootScope.danceOrStep = 'steps';
        }
    };


    $scope.changeDances = function() {
        $ionicSlideBoxDelegate.slide(0);
        $rootScope.danceOrStep = 'dances';
        $('.urratsak-list').css({height: 0});
    };

    $scope.changeSteps = function() {
        $ionicSlideBoxDelegate.slide(1);
        $rootScope.danceOrStep = 'steps';
        $('.urratsak-list').css({height: 'auto'});
    };

    $scope.toggleStepSortOrder = function(){
        $scope.stepsSortOrder = $scope.stepsSortOrder === 'level' ?  '-level' : 'level';
    };

    console.log($rootScope);

    $scope.jbar.title = 'JAUZI';
    $scope.jbar.visible =true;
    
    $rootScope.danceOrStep = 'dances';
    $('.dantzak-list').css({height: 0});

    $scope.stepsSortOrder = 'level';
    
    $scope.imagesUrl = $rootScope.imagesUrl; 
  });