'use strict';

/**
 * @ngdoc function
 * @name jauziBackApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the jauziBackApp
 */
angular.module('jauzi')
  .controller('glosarioaCtrl', function ($scope,$http,$rootScope) {
    	
  	/* Get Definition*/
  	$scope.getDefinitions = function(){
  		$http.get($rootScope.publicapiUrl + 'definitions',$rootScope.getHttpRequestConfig()).then(function(response){
  			if(response.status === 200){
  				$scope.definitions = response.data;
  			}	
  			else{
  				console.log('Error al obtener definiciones de la BBDD');
  			}
  		});
  	};

  	$scope.definitions = [];

  	$scope.getDefinitions();


  });