'use strict';

/**
 * @ngdoc function
 * @name jauziBackApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the jauziBackApp
 */
angular.module('jauzi')
  .controller('dantzaCtrl', function ($scope,$http,$rootScope,$stateParams,$sce,$ionicSlideBoxDelegate,$ionicPlatform) {
    /* Get dance data */
    $scope.getDance = function(){
    	$http.get($rootScope.publicapiUrl + 'dance/' + $stateParams.id,$rootScope.getHttpRequestConfig()).then(function(response){
	    	$scope.dance = response.data;
            $rootScope.loadedVideo = $sce.trustAsResourceUrl($scope.dance.video + '?rel=0');
	    	$scope.dance.video = $sce.trustAsResourceUrl($scope.dance.video + '?rel=0');
	    	$scope.videoW = window.innerWidth;
	    	$scope.videoH = $scope.videoW * 9 / 16;
	    });
    };

    $scope.getDanceSteps = function(){
    	$http.get($rootScope.publicapiUrl + 'danceSteps?dance_id=' + $stateParams.id,$rootScope.getHttpRequestConfig()).then(function(response){
	    	var danceSteps = response.data; 
	    	angular.forEach(danceSteps,function(danceStep){
	    		console.log(danceStep);
	    		$http.get($rootScope.publicapiUrl + 'step/' + danceStep.step_id,$rootScope.getHttpRequestConfig()).then(function(response){
	    			danceStep.level = response.data.level;
	    			danceStep.name = response.data.name;
	    			$scope.danceSteps.push(danceStep);
	    			console.log($scope.danceSteps);
	    		});
	    	});
	    });
    };

    $scope.getResources = function(){
    	$http.get($rootScope.publicapiUrl + 'resourcesbytype' + '?type=dance' + '&related_id=' + $stateParams.id,$scope.getHttpRequestConfig()).then(function(response){
    		$scope.resources = response.data;
    		console.log($scope.resources);
    		$ionicSlideBoxDelegate.update();
      	});
    };

    $scope.getAudios = function(){
        $scope.getAudioInstOn();
        $scope.getAudioInstOff();
    };

    $scope.getAudioInstOn = function(){
        $http.get($rootScope.publicapiUrl + 'audiosbydanceON?dance_id=' + $stateParams.id,$rootScope.getHttpRequestConfig()).then(function(response){
            $scope.audioOn = response.data;
            $(audioElement).find('source').attr('src',$rootScope.audiosUrl +  $scope.audioOn.name);
            audioElement.load();
            $scope.currentAudio.duration = '00:00';
            $scope.currentAudio.currentTime ='00:00';
        });
    };

    $scope.getAudioInstOff = function(){
        $http.get($rootScope.publicapiUrl + 'audiosbydanceOFF?dance_id=' + $stateParams.id,$rootScope.getHttpRequestConfig()).then(function(response){
            $scope.audioOff = response.data;
        });
    };

    $scope.playAudio = function(){
        audioElement.play();
        $scope.currentAudio.running = true;
    };
    $scope.pauseAudio = function(){
        audioElement.pause();
        $scope.currentAudio.running = false;
    };

    $scope.restartAudio = function(){
        audioElement.pause();
        audioElement.currentTime = 0 ;
        audioElement.play();
    };

    $scope.toggleAudioInst = function(){
        $scope.currentAudio.running = false;
        if($scope.currentAudio.inst){
            $(audioElement).find('source').attr('src',$rootScope.audiosUrl +  $scope.audioOn.name);
            audioElement.load();
            $scope.currentAudio.duration = '00:00';
            $scope.currentAudio.currentTime ='00:00';
            $('.progbar .progress').css('width','0%');
        }
        else{
            $(audioElement).find('source').attr('src',$rootScope.audiosUrl +  $scope.audioOff.name);
            audioElement.load();
            $scope.currentAudio.duration = '00:00';
            $scope.currentAudio.currentTime ='00:00';
            $('.progbar .progress').css('width','0%');
        }
    };



    var getTimeFormat = function(value){
        var result = '';
        var minutes = Math.floor(value / 60);
        if(minutes.toString().length === 1){
            result = '0' + minutes.toString();
        }
        else{
            result = minutes.toString();
        }
        var seconds = value - (minutes * 60);
        if(seconds.toString().length === 1){
            result += ':0' + seconds.toString();
        }
        else{
            result += ':' + seconds.toString();
        }
        return result;
    };

    /* END FUNCTIONS */

    $scope.danceSteps =[];
    $scope.getDance();
    $scope.getDanceSteps();
    $scope.getResources();
    $scope.getAudios();

    /* Get audio element*/
    var audioElement = $('audio')[0];
    $scope.currentAudio = {};
    /* Audio instructions to on*/
    $scope.currentAudio.inst = true;
    $scope.currentAudio.running = false;

    audioElement.addEventListener('timeupdate',function(ev){
        $scope.currentAudio.duration = getTimeFormat(Math.floor(this.duration)); 
        $scope.currentAudio.currentTime = getTimeFormat(Math.floor(this.currentTime));
        $('.progbar .progress').css('width',Math.floor((100 * this.currentTime)/this.duration) + '%');
        $scope.$apply();
    });

    audioElement.addEventListener('canplaythrough',function(){
        $scope.currentAudio.duration = getTimeFormat(Math.floor(this.duration));
        $scope.$apply();
    });

    $('.progbar').on('click',function(ev){
        var xTarget = ev.pageX - $(ev.currentTarget).offset().left;
        var progbarWidth = $(ev.currentTarget).width();
        var currentTime = (xTarget * audioElement.duration) / progbarWidth;
        $('.progbar .progress').css('width',Math.floor((100 * currentTime)/ audioElement.duration) + '%');
        audioElement.currentTime = currentTime; 
    });

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
        if(toState.name === 'dantza'){
            if($scope.dance.video){
                $rootScope.loadedVideo = $sce.trustAsResourceUrl($scope.dance.video + '?rel=0');
                $rootScope.$apply();
            }
        }      
    });

    
    $ionicPlatform.on('resume',function(){
        if($scope.dance.video){
            $rootScope.loadedVideo = $sce.trustAsResourceUrl($scope.dance.video + '?rel=0');;
            $rootScope.$apply();  
        }
    });

  });