'use strict';

/**
 * @ngdoc function
 * @name jauziBackApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the jauziBackApp
 */
angular.module('jauzi')
  .controller('glosarioaDetailCtrl', function ($scope,$http,$rootScope,$stateParams) {
    	
  	/* Get Definition*/
  	$scope.getDefinition = function(){
  		$http.get($rootScope.publicapiUrl + 'definition/' + $stateParams.id,$rootScope.getHttpRequestConfig()).then(function(response){
  			if(response.status === 200){
  				$scope.definition = response.data;
  			}	
  			else{
  				console.log('Error al obtener definiciones de la BBDD');
  			}
  		});
  	};

  	$scope.definition = {
      name: '',
      description: ''
    };

  	$scope.getDefinition();



  });