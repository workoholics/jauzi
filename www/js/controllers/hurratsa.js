'use strict';

/**
 * @ngdoc function
 * @name jauziBackApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the jauziBackApp
 */
angular.module('jauzi')
  .controller('hurratsaCtrl', function ($scope,$rootScope,$http,$stateParams,$sce,$ionicSlideBoxDelegate,$ionicPlatform) {
    /* Get dance data */
    $scope.getStep = function(){
    	$http.get($rootScope.publicapiUrl + 'step/' + $stateParams.id,$rootScope.getHttpRequestConfig()).then(function(response){
	    	$scope.step = response.data;
	    	$scope.step.video = $sce.trustAsResourceUrl($scope.step.video + '?rel=0');
            $rootScope.loadedVideo = $scope.step.video;
            $scope.videoW = window.innerWidth;
            $scope.videoH = $scope.videoW * 9 / 16;
	    });
    };

    $scope.getResources = function(){
    	$http.get($rootScope.publicapiUrl + 'resourcesbytype' + '?type=step' + '&related_id=' + $stateParams.id,$scope.getHttpRequestConfig()).then(function(response){
    		$scope.resources = response.data;
    		console.log($scope.resources);
    		$ionicSlideBoxDelegate.update();
      	});
    };


    $ionicPlatform.on('resume',function(){
        if($scope.step.video){
            $rootScope.loadedVideo = $sce.trustAsResourceUrl($scope.step.video + '?rel=0');;
            $rootScope.$apply();  
        }
    });

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
        if(toState.name === 'urratsa'){
            if($scope.step.video){
                $rootScope.loadedVideo = $sce.trustAsResourceUrl($scope.step.video + '?rel=0');
                $rootScope.$apply();
            }
        }      
    });


    $scope.getStep();
    $scope.getResources();

  });