angular.module('aiv-pos.services', ['common.services'])

/*.factory('$exceptionHandler', ['$log','Nucleus','AIV_CONSTANTS', function($log,Nucleus,AIV_CONSTANTS) {
    return function myExceptionHandler(exception, cause) {
      //logErrorsToBackend(exception, cause);
      $log.warn(exception, cause);
	  var name = AIV_CONSTANTS.REMOTE_DB+AIV_CONSTANTS.APP_VER;
	  Nucleus.trackError(name, exception)
    };
}])*/

.factory('dataService', ['$http', '$q', 'APIFunctions', 'utility', '$filter','AIV_CONSTANTS','$rootScope', function($http, $q, APIFunctions, utility, $filter,AIV_CONSTANTS,$rootScope) {

	var baseURL = AIV_CONSTANTS.BASE_URL;
	var sel_category;
	var username="";
	var update_doc = function(data_url,content,retries=5){
		var deferred = $q.defer();

		var	timedOut = false;
		var aborted = false;
		var timeout_value = 15000;

		var timeout_ref = setTimeout(function () {
			timedOut = true;
			if(deferred){
				deferred.resolve();
			}
		}, timeout_value);
		
		var request = $http({
			method: 'PUT',
			url: data_url, 
			data: content,
			headers: {
				'Content-Type': 'application/json',
				"Authorization":'Basic ' + window.btoa(AIV_CONSTANTS.CUSER+':'+AIV_CONSTANTS.CPASS)
			},
			timeout:deferred.promise
		});
		
		var promise = request.then(
			function( response ) {
				return( response.data );
			},
			function( response ) {
				if(aborted){
					//User aborted
					clearTimeout(timeout_ref);
					return($q.reject({
						error: 'aborted',
						message: 'User aborted...'
					}));
				}else if(timedOut){
					//Timed out
					return($q.reject({
						error: 'timeout',
						message: 'Slow connection...'
					}));
				}else{
					clearTimeout(timeout_ref);
					if(angular.isDefined(response) && angular.isDefined(response.status) && response.status == 409){
						if(retries){
							retries--;
							console.log("Retry "+retries);
							return update_doc(data_url,content,retries);
						}
					}
					return( $q.reject( response ) );
				}
			}
		);

		promise.abort = function() {
			aborted = true;
			deferred.resolve();
		};
		
		promise.finally(
			function() {
				console.info( "Cleaning up object references." );
				promise.abort = angular.noop;
				deferred = request = promise = null;
			}
		);
		return( promise );
	}
		
    return {
        validateCoupon: function(cart, coupon , grand,coupon_lines) {
			var deferred = $q.defer();

			var	timedOut = false;
			var aborted = false;
			var timeout_value = 10000;
				
			console.log(cart);

            var line_items = [];
            for (var i = 0; i < cart.length; i++) {
				if (angular.isUndefined(cart[i].sel_variations)) {
					line_items.push({
						"product_id": cart[i].id,
						"sku": cart[i].sku,
						"quantity": cart[i].quantity,
						"subtotal": cart[i].total,
						"total": cart[i].total ,
						"price": cart[i].price,
						"featured_src": cart[i].featured_src,
						"title": cart[i].title,
						"categories": cart[i].categories
					})
				}else{
					var varia = {};
					for (var k=0;k<cart[i].sel_variations.attributes.length;k++) {
					  var key = cart[i].sel_variations.attributes[k];
					  if (cart[i].sel_variations.attributes.hasOwnProperty(key)) {
						varia[key] = cart[i].sel_variations.attributes[key];
					  }
					}
					line_items.push({
						"product_id": cart[i].id,
						"sku": cart[i].sku,
						"quantity": cart[i].quantity,
						"subtotal": cart[i].total,
						"total": cart[i].total,
						"price": cart[i].price,
						"featured_src": cart[i].featured_src,
						"title": cart[i].title,
						"categories": cart[i].categories,
						"variations": varia
					})
				}
            };
			
            var postData = {
                "line_items": angular.toJson(line_items),
				"coupon_lines" : angular.toJson(coupon_lines),
				"coupon_code": coupon,
				"sub_total" : grand.Total
            };
			
			var timeout_ref = setTimeout(function () {
				timedOut = true;
				if(deferred){
					deferred.resolve();
				}
			}, timeout_value);
			
			var request =  $http({
				method: 'POST',
				url: baseURL+'/API.php', 
				transformRequest: function(obj) {
					var str = [];
					for (var p in obj)
						str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
					return str.join("&");
				},
				params: {
					validateCoupon: ''
				},
				data: postData,
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				timeout:deferred.promise
			})
			
			 var promise = request.then(
				function( response ) {
					return( response.data );
				},
				function( response ) {
					if(aborted){
						//User aborted
						clearTimeout(timeout_ref);
						return($q.reject({
							error: 'aborted',
							message: 'User aborted...'
						}));
					}else if(timedOut){
						//User aborted
						return($q.reject({
							error: 'timeout',
							message: 'Slow connection...'
						}));
					}else{
						return( $q.reject( "Something went wrong" ) );
					}
				}
			);

			promise.abort = function() {
				aborted = true;
				deferred.resolve();
			};
			
			promise.finally(
				function() {
					console.info( "Cleaning up object references." );
					promise.abort = angular.noop;
					deferred = request = promise = null;
				}
			);
			return( promise );
        },
		redeemHFPoints: function(data) {
			var deferred = $q.defer();

			var	timedOut = false;
			var aborted = false;
			var timeout_value = 10000;
						
            var postData = {
                "phone": data,
				"shop_name" : $rootScope.aiv_info.shop_name,
				"pos":true
            };
			
			var timeout_ref = setTimeout(function () {
				timedOut = true;
				if(deferred){
					deferred.resolve();
				}
			}, timeout_value);
			
			var request =  $http({
				method: 'POST',
				url: baseURL+'/API.php', 
				transformRequest: function(obj) {
					var str = [];
					for (var p in obj)
						str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
					return str.join("&");
				},
				params: {
					redeemHFPoints: ''
				},
				data: postData,
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				timeout:deferred.promise
			})
			
			 var promise = request.then(
				function( response ) {
					return( response.data );
				},
				function( response ) {
					if(aborted){
						//User aborted
						clearTimeout(timeout_ref);
						return($q.reject({
							error: 'aborted',
							message: 'User aborted...'
						}));
					}else if(timedOut){
						//User aborted
						return($q.reject({
							error: 'timeout',
							message: 'Slow connection...'
						}));
					}else{
						return( $q.reject( "Something went wrong" ) );
					}
				}
			);

			promise.abort = function() {
				aborted = true;
				deferred.resolve();
			};
			
			promise.finally(
				function() {
					console.info( "Cleaning up object references." );
					promise.abort = angular.noop;
					deferred = request = promise = null;
				}
			);
			return( promise );
        },
		getPoints: function(card,shop_name) {
		
			shop_name ="";
            var deferred = $q.defer();

			var	timedOut = false;
			var aborted = false;
			var timeout_value = 5000;
				
			card = card.replace(' ','').toLowerCase();
			var timeout_ref = setTimeout(function () {
				timedOut = true;
				if(deferred){
					deferred.resolve();
				}
			}, timeout_value);
			
			var request = $http({
				method: 'GET',
				url: AIV_CONSTANTS.LOYALTY_URL+"/hfl_get_customer_info.php?phone="+card+"&&pts=ALL",
				params: {
					
				},
				timeout:deferred.promise
			});
			
			 var promise = request.then(
				function( response ) {
					return( response.data );
				},
				function( response ) {
					if(aborted){
						//User aborted
						clearTimeout(timeout_ref);
						return($q.reject({
							error: 'aborted',
							message: 'User aborted...'
						}));
					}else if(timedOut){
						//User aborted
						return($q.reject({
							error: 'timeout',
							message: 'Slow connection...'
						}));
					}else{
						return( $q.reject( "Something went wrong" ) );
					}
				}
			);

			promise.abort = function() {
				aborted = true;
				deferred.resolve();
			};
			
			promise.finally(
				function() {
					console.info( "Cleaning up object references." );
					promise.abort = angular.noop;
					deferred = request = promise = null;
				}
			);
			return( promise );
        },
		getReplicationStatus: function(couchDBUrl) {
		
			//shop_name ="";
            var deferred = $q.defer();

			var	timedOut = false;
			var aborted = false;
			var timeout_value = 5000;
				
			
			var timeout_ref = setTimeout(function () {
				timedOut = true;
				if(deferred){
					deferred.resolve();
				}
			}, timeout_value);
		
			var request = $http({
				method: 'GET',
				url:  couchDBUrl,
				headers: {
					'Content-Type': 'application/json',
					"Authorization":'Basic ' + window.btoa(AIV_CONSTANTS.AUSER+':'+AIV_CONSTANTS.APASS)
				},
				timeout:deferred.promise
			});
			
			 var promise = request.then(
				function( response ) {
				var limit=0;
				if(response.data.length>=2){
					for(var i=0;i<response.data.length;i++){
					 if(response.data[i].target.includes(AIV_CONSTANTS.REMOTE_DB))
						limit ++;
					}
				}
				if(limit >=2)
					return true;
				else
					return false;
				},
				function( response ) {
					if(aborted){
						//User aborted
						clearTimeout(timeout_ref);
						return($q.reject({
							error: 'aborted',
							message: 'User aborted...'
						}));
					}else if(timedOut){
						//User aborted
						return($q.reject({
							error: 'timeout',
							message: 'Slow connection...'
						}));
					}else{
						return( $q.reject( "Something went wrong" ) );
					}
				}
			);

			promise.abort = function() {
				aborted = true;
				deferred.resolve();
			};
			
			promise.finally(
				function() {
					console.info( "Cleaning up object references." );
					promise.abort = angular.noop;
					deferred = request = promise = null;
				}
			);
			return( promise );
        },
		startReplication: function(couchDBUrl,source,ip) {
			if(source =='LOCAL'){
				var postData ={
					"source" : "http://localhost:5984/"+AIV_CONSTANTS.REMOTE_DB,
					"target" : AIV_CONSTANTS.REMOTE_DBURL,
					"continuous" : true
					}
			}else if(source =='REMOTE'){
				var postData ={
					"source" : AIV_CONSTANTS.REMOTE_DBURL,
					"target" : "http://localhost:5984/"+AIV_CONSTANTS.REMOTE_DB,
					"continuous" : true
					}
			}
			//shop_name ="";
            var deferred = $q.defer();

			var	timedOut = false;
			var aborted = false;
			var timeout_value = 5000;
				
			
			var timeout_ref = setTimeout(function () {
				timedOut = true;
				if(deferred){
					deferred.resolve();
				}
			}, timeout_value);
			
		
			var request = $http({
				method: 'POST',
				url:  couchDBUrl,
				data:postData,
				headers: {
					'Content-Type': 'application/json',
					"Authorization":'Basic ' + window.btoa(AIV_CONSTANTS.AUSER+':'+AIV_CONSTANTS.APASS)
				},
				timeout:deferred.promise
			});
			
			 var promise = request.then(
				function( response ) {
				return response;
				},
				function( response ) {
					if(aborted){
						//User aborted
						clearTimeout(timeout_ref);
						return($q.reject({
							error: 'aborted',
							message: 'User aborted...'
						}));
					}else if(timedOut){
						//User aborted
						return($q.reject({
							error: 'timeout',
							message: 'Slow connection...'
						}));
					}else{
						return( $q.reject( "Something went wrong" ) );
					}
				}
			);

			promise.abort = function() {
				aborted = true;
				deferred.resolve();
			};
			
			promise.finally(
				function() {
					console.info( "Cleaning up object references." );
					promise.abort = angular.noop;
					deferred = request = promise = null;
				}
			);
			return( promise );
        },
		        getpos_terminals: function(terminalurl,password,installer_id,software_house_id) {
				var encodedString = btoa(username + ':' + password);
        		 var deferred = $q.defer();

        		 var timedOut = false;
			     var aborted = false;
			     var timeout_value = 2000;
			    
			     var timeout_ref = setTimeout(function () {
				timedOut = true;
				if(deferred){
					deferred.resolve();
				}
			}, timeout_value);

        		 var request = $http({
				   method : 'GET',
				   url : terminalurl,
                   dataType: 'json',
				   headers: {
					   "authorization": 'Basic ' + encodedString,
    					"Content-Type": "application/json",
    					"accept": "application/connect.v2+json",
    					"Software-House-Id":software_house_id,
    					"Installer-Id": installer_id
				  },
				  timeout:deferred.promise
			     });

			     var promise = request.then(
				function( response ) {
					
					var terminaldetials=response.data['terminals'];
				    return(terminaldetials);
				
				},

				function( response ) {
					if(aborted){
						//User aborted
						clearTimeout(timeout_ref);
						return($q.reject({
							error: 'aborted',
							message: 'User aborted...'
						}));
					}else if(timedOut){
						//User aborted
						return($q.reject({
							error: 'timeout',
							message: 'Slow connection...'
						}));
					}else{

						if(response.data==null)
						{
							return( $q.reject("Please Check the URL or POS Connection"));
						}

						return( $q.reject(response.data.userMessage));

					}
				}
				
			);

			     promise.abort = function() {
				aborted = true;
				deferred.resolve();
			};
			
			promise.finally(
				function() {
					console.info( "Cleaning up object references." );
					promise.abort = angular.noop;
					deferred = request = promise = null;
				}
			);
			return(promise);
        },
        getterminalid: function(tid,terminalurl,password,installer_id,software_house_id) {
			var encodedString = btoa(username + ':' + password);
        		 var deferred = $q.defer();

        		 var timedOut = false;
			     var aborted = false;
			     var timeout_value = 2000;

			     var timeout_ref = setTimeout(function () {
				timedOut = true;
				if(deferred){
					deferred.resolve();
				}
			}, timeout_value);

        		 var request = $http({
				   method : 'GET',
				   url : terminalurl+tid,
                   dataType: 'json',
				   headers: {
					   "authorization": 'Basic ' + encodedString,
    					"Content-Type": "application/json",
    					"accept": "application/connect.v2+json",
    					"Software-House-Id": software_house_id,
    					"Installer-Id": installer_id
				  },
				  timeout:deferred.promise
			     });

			     var promise = request.then(
				function( response ) {
					
					
				    var terminaldetials=response.data;
				    return(terminaldetials);
				
				},

				function( response ) {
					if(aborted){
						//User aborted
						clearTimeout(timeout_ref);
						return($q.reject({
							error: 'aborted',
							message: 'User aborted...'
						}));
					}else if(timedOut){
						//User aborted
						return($q.reject({
							error: 'timeout',
							message: 'Slow connection...'
						}));
					}else{

						if(response.data==null)
						{
							return($q.reject("Please Check the URL or POS Connection"));
						}
						return( $q.reject(response.data.userMessage));
					}
				}
				
			);

			     promise.abort = function() {
				aborted = true;
				deferred.resolve();
			};
			
			promise.finally(
				function() {
					console.info( "Cleaning up object references." );
					promise.abort = angular.noop;
					deferred = request = promise = null;
				}
			);
			return(promise);
        },


		posttransactionrequest: function(tid,type,amount,terminalurl,password,installer_id,software_house_id) {
			 var encodedString = btoa(username + ':' + password);
        	  
        	  var deferred = $q.defer();

        		 var timedOut = false;
			     var aborted = false;
			     var timeout_value =2000;

			     var timeout_ref = setTimeout(function () {
				timedOut = true;
				if(deferred){
					deferred.resolve();
				}
			}, timeout_value);

			     var sendata= {
						  "transactionType": type,
						  "currency": "GBP",
						  "amount": amount,
						  "cardholderNotPresent": false,
						  "authCode": ""
				};


        		 var request = $http({
				   method : 'POST',
				   url : terminalurl+tid+'/transactions',
                   dataType: 'json',
                   data: JSON.stringify(sendata),
				   headers: {
					   "authorization": 'Basic ' + encodedString,
    					"Content-Type": "application/json",
    					"accept": "application/connect.v2+json",
    					"Software-House-Id": software_house_id,
    					"Installer-Id":installer_id
    
				  },
				  timeout:deferred.promise
			     });

			     var promise = request.then(
				function( response ) {
					
					
				    return(response.data);
				
				},

				function( response ) {
					if(aborted){
						//User aborted
						clearTimeout(timeout_ref);
						return($q.reject({
							error: 'aborted',
							message: 'User aborted...'
						}));
					}else if(timedOut){
						//User aborted
						return($q.reject({
							error: 'timeout',
							message: 'Slow connection...'
						}));
					}else{
						if(response.data==null)
						{
							return($q.reject("Please Check the URL or POS Connection"));
						}
						return( $q.reject(response.data.userMessage));
					}
				}
				
			);

			     promise.abort = function() {
				aborted = true;
				deferred.resolve();
			};
			
			promise.finally(
				function() {
					console.info( "Cleaning up object references." );
					promise.abort = angular.noop;
					deferred = request = promise = null;
				}
			);
			return(promise);
		},      
		report_id: function(tid,reporttype,terminalurl,password,installer_id,software_house_id) {
		var encodedString = btoa(username + ':' + password);
      	var deferred = $q.defer();

        		 var timedOut = false;
			     var aborted = false;
			     var timeout_value = 1000;

			     var timeout_ref = setTimeout(function () {
				timedOut = true;
				if(deferred){
					deferred.resolve();
				}
			}, timeout_value);

			     var signaturedata= {
  					"reportType": reporttype
				 };

			     
        		  var request = $http({
				   method : 'POST',
				   url : terminalurl+tid+'/reports',
				   data: JSON.stringify(signaturedata),
                   dataType: 'json',
				   headers: {
    							"authorization": 'Basic ' + encodedString,
    							"Content-Type": "application/json",
    							"accept": "application/connect.v2+json",
    							"Software-House-Id": software_house_id,
    							"Installer-Id": installer_id	
   
  							},
				  timeout:deferred.promise
			     });

			     var promise = request.then(
				function(response) {
					
					
				    return(response.data.requestId);
				
				},

				function( response ) {
					if(aborted){
						//User aborted
						clearTimeout(timeout_ref);
						return($q.reject({
							error: 'aborted',
							message: 'User aborted...'
						}));
					}else if(timedOut){
						//User aborted
						return($q.reject({
							error: 'timeout',
							message: 'Slow connection...'
						}));
					}else{
						if(response.data==null)
						{
							return($q.reject("Please Check the URL or POS Connection"));
						}

						return( $q.reject(response.data.userMessage));
					}
				}
				
			);

			     promise.abort = function() {
				aborted = true;
				deferred.resolve();
			};
			
			promise.finally(
				function() {
					console.info( "Cleaning up object references." );
					promise.abort = angular.noop;
					deferred = request = promise = null;
				}
			);
			return(promise);
      	 
      },
	   getreportresult: function(reqid,tid,terminalurl,password,installer_id,software_house_id) {
		var encodedString = btoa(username + ':' + password);
      	var deferred = $q.defer();

        		 var timedOut = false;
			     var aborted = false;
			     var timeout_value = 1000;

			     var timeout_ref = setTimeout(function () {
				timedOut = true;
				if(deferred){
					deferred.resolve();
				}
			}, timeout_value);

			    
			     
        		  var request = $http({
				   method : 'GET',
				   url : terminalurl+tid+'/reports/'+reqid,
                   dataType: 'json',
				   headers: {
    							"authorization": 'Basic ' + encodedString,
    							"Content-Type": "application/json",
    							"accept": "application/connect.v2+json",
    							"Software-House-Id": software_house_id,
    							"Installer-Id": installer_id	
   
  							},
				  timeout:deferred.promise
			     });

			     var promise = request.then(
				function(response) {
					
					
				    return(response.data);
				
				},

				function( response ) {
					if(aborted){
						//User aborted
						clearTimeout(timeout_ref);
						return($q.reject({
							error: 'aborted',
							message: 'User aborted...'
						}));
					}else if(timedOut){
						//User aborted
						return($q.reject({
							error: 'timeout',
							message: 'Slow connection...'
						}));
					}else{

						if(response.data==null)
						{
							return($q.reject("Please Check the URL or POS Connection"));
						}
						
						return( $q.reject(response.data.userMessage));
					}
				}
				
			);

			     promise.abort = function() {
				aborted = true;
				deferred.resolve();
			};
			
			promise.finally(
				function() {
					console.info( "Cleaning up object references." );
					promise.abort = angular.noop;
					deferred = request = promise = null;
				}
			);
			return(promise);

      },
      gettransactionresult: function(tid,requestedid,terminalurl,password,installer_id,software_house_id) {
		var encodedString = btoa(username + ':' + password);
      	 var deferred = $q.defer();

        		 var timedOut = false;
			     var aborted = false;
			     var timeout_value = 1000;

			     var timeout_ref = setTimeout(function () {
				timedOut = true;
				if(deferred){
					deferred.resolve();
				}
			}, timeout_value);

        		 var request = $http({
				   method : 'GET',
				  url : terminalurl+tid+'/transactions/'+requestedid,
                   dataType: 'json',
				   headers: {
					    "authorization": 'Basic ' + encodedString,
    					"Content-Type": "application/json",
    					"accept": "application/connect.v2+json",
    					"Software-House-Id": software_house_id,
    					"Installer-Id": installer_id
    
				  },
				  timeout:deferred.promise
			     });

			     var promise = request.then(
				function( response ) {
					
					
				    return(response.data);
				
				},

				function( response ) {
					if(aborted){
						//User aborted
						clearTimeout(timeout_ref);
						return($q.reject({
							error: 'aborted',
							message: 'User aborted...'
						}));
					}else if(timedOut){
						//User aborted
						return($q.reject({
							error: 'timeout',
							message: 'Slow connection...'
						}));
					}else{

						if(response.data==null)
						{
							return($q.reject("Please Check the URL or POS Connection"));
						}

						return( $q.reject(response.data.userMessage));
					}
				}
				
			);

			     promise.abort = function() {
				aborted = true;
				deferred.resolve();
			};
			
			promise.finally(
				function() {
					console.info( "Cleaning up object references." );
					promise.abort = angular.noop;
					deferred = request = promise = null;
				}
			);
			return(promise);
      	 
      },


      signatureverification: function(tid,requestedid,accept,terminalurl,password,installer_id,software_house_id) {
			var encodedString = btoa(username + ':' + password);
      	  var deferred = $q.defer();

        		 var timedOut = false;
			     var aborted = false;
			     var timeout_value = 1000;

			     var timeout_ref = setTimeout(function () {
				timedOut = true;
				if(deferred){
					deferred.resolve();
				}
			}, timeout_value);

			     var signaturedata= {
  					"accepted": accept
				 };

        		 var request = $http({
				   method : 'PUT',
				   url : terminalurl+tid+'/transactions/'+requestedid+'/signature',
				   data: JSON.stringify(signaturedata),
                   dataType: 'json',
				   headers: {
					    "authorization": 'Basic ' + encodedString,
    					"Content-Type": "application/json",
    					"accept": "application/connect.v2+json",
    					"Software-House-Id": software_house_id,
    					"Installer-Id": installer_id
    
				  },
				  timeout:deferred.promise
			     });

			     var promise = request.then(
				function( response ) {
					
					
				    return(response);
				
				},

				function( response ) {
					if(aborted){
						//User aborted
						clearTimeout(timeout_ref);
						return($q.reject({
							error: 'aborted',
							message: 'User aborted...'
						}));
					}else if(timedOut){
						//User aborted
						return($q.reject({
							error: 'timeout',
							message: 'Slow connection...'
						}));
					}else{

						if(response.data==null)
						{
							return($q.reject("Please Check the URL or POS Connection"));
						}

						return( $q.reject(response.data.userMessage));
					}
				}
				
			);

			     promise.abort = function() {
				aborted = true;
				deferred.resolve();
			};
			
			promise.finally(
				function() {
					console.info( "Cleaning up object references." );
					promise.abort = angular.noop;
					deferred = request = promise = null;
				}
			);
			return(promise);
      },

      cancelrequest: function(locurl,password,installer_id,software_house_id) {
		var encodedString = btoa(username + ':' + password);
      	var deferred = $q.defer();

        		 var timedOut = false;
			     var aborted = false;
			     var timeout_value = 1000;

			     var timeout_ref = setTimeout(function () {
				timedOut = true;
				if(deferred){
					deferred.resolve();
				}
			}, timeout_value);

			     
        		  var request = $http({
				   method : 'DELETE',
				   url : locurl,
                   dataType: 'json',
				   headers: {
    							"authorization": 'Basic ' + encodedString,
    							"Content-Type": "application/json",
    							"accept": "application/connect.v2+json",
    							"Software-House-Id": software_house_id,
    							"Installer-Id": installer_id	
   
  							},
				  timeout:deferred.promise
			     });

			     var promise = request.then(
				function(response) {
					
					
				    return(response);
				
				},

				function( response ) {
					if(aborted){
						//User aborted
						clearTimeout(timeout_ref);
						return($q.reject({
							error: 'aborted',
							message: 'User aborted...'
						}));
					}else if(timedOut){
						//User aborted
						return($q.reject({
							error: 'timeout',
							message: 'Slow connection...'
						}));
					}else{
						if(response.data==null)
						{
							return($q.reject("Please Check the URL or POS Connection"));
						}

						return( $q.reject(response.data.userMessage));
					}
				}
				
			);

			     promise.abort = function() {
				aborted = true;
				deferred.resolve();
			};
			
			promise.finally(
				function() {
					console.info( "Cleaning up object references." );
					promise.abort = angular.noop;
					deferred = request = promise = null;
				}
			);
			return(promise);

      },
		getAddress: function(postcode) {
            var deferred = $q.defer();

			var	timedOut = false;
			var aborted = false;
			var timeout_value = 10000;
				
			postcode = postcode.replace(' ','').toLowerCase();
			var timeout_ref = setTimeout(function () {
				timedOut = true;
				if(deferred){
					deferred.resolve();
				}
			}, timeout_value);
			
			var request = $http({
				method: 'GET',
				url: AIV_CONSTANTS.POSTCODE_API_URL+postcode,
				params: {
					'api_key': $rootScope.aiv_info.POSTCODE_API_KEY
				},
				timeout:deferred.promise
			});
			
			 var promise = request.then(
				function( response ) {
					return( response.data );
				},
				function( response ) {
					if(aborted){
						//User aborted
						clearTimeout(timeout_ref);
						return($q.reject({
							error: 'aborted',
							message: 'User aborted...'
						}));
					}else if(timedOut){
						//User aborted
						return($q.reject({
							error: 'timeout',
							message: 'Slow connection...'
						}));
					}else{
						return( $q.reject( "Something went wrong" ) );
					}
				}
			);

			promise.abort = function() {
				aborted = true;
				deferred.resolve();
			};
			
			promise.finally(
				function() {
					console.info( "Cleaning up object references." );
					promise.abort = angular.noop;
					deferred = request = promise = null;
				}
			);
			return( promise );
        },
		uploadChanges: function(post_data) {
            var deferred = $q.defer();

			var postData = {
				products:angular.toJson(post_data.products),
				categories:angular.toJson(post_data.categories)
			}
			
            $http({
                    method: 'POST',
                    url: baseURL+'/pos_upload_changes.php', 
                    transformRequest: function(obj) {
                        var str = [];
                        for (var p in obj)
                            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                        return str.join("&");
                    },
                    data: postData,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                })
                .success(function(data) {
                    deferred.resolve(data);
                })
                .error(function() {
                    deferred.reject('There was an error');
                })

            return deferred.promise;
        },
		checkUrl:function(data_url){
			var deferred = $q.defer(),
				timeout = $q.defer(),
                timedOut = false;
			setTimeout(function () {
                timedOut = true;
                timeout.resolve();
            }, 10000);
            $http({
                    method: 'GET',
                    url: data_url,
                    params: {},
					"headers":{
						"Authorization":'Basic ' + window.btoa(AIV_CONSTANTS.CUSER+':'+AIV_CONSTANTS.CPASS)
					}
                })
                .success(function(data) {
                    deferred.resolve(data);
                })
                .error(function(data, status, headers, config) {
					if (timedOut) {
						deferred.reject({
							error: 'timeout',
							message: 'Slow connection...'
						});
					} else {
						deferred.reject(data);
					}
                })

            return deferred.promise;
		},
		sendSMS: function(message,recipients) {
            var deferred = $q.defer();

			var	timedOut = false;
			var aborted = false;
			var timeout_value = 20000;
			
			var postData = {
				campaign_name : $rootScope.aiv_info.sms_campaign_name,
				sender : $rootScope.aiv_info.sms_campaign_name,
				content : message,
				recipients : angular.toJson(recipients)
			};
			
			var timeout_ref = setTimeout(function () {
				timedOut = true;
				if(deferred){
					deferred.resolve();
				}
			}, timeout_value);
			
            var request = $http({
				method: 'POST',
				url: $rootScope.aiv_info.SMS_API+'/aiv_send_sms.php ', 
				transformRequest: function(obj) {
					var str = [];
					for (var p in obj)
						str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
					return str.join("&");
				},
				data: postData,
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				timeout:deferred.promise
			});
			
			var promise = request.then(
				function( response ) {
					return( response.data );
				},
				function( response ) {
					if(aborted){
						//User aborted
						clearTimeout(timeout_ref);
						return($q.reject({
							error: 'aborted',
							message: 'User aborted...'
						}));
					}else if(timedOut){
						//User aborted
						return($q.reject({
							error: 'timeout',
							message: 'Slow connection...'
						}));
					}else{
						return( $q.reject( "Something went wrong" ) );
					}
				}
			);

			promise.abort = function() {
				aborted = true;
				deferred.resolve();
			};
			
			promise.finally(
				function() {
					console.info( "Cleaning up object references." );
					promise.abort = angular.noop;
					deferred = request = promise = null;
				}
			);
			return( promise );
        },
		updateDoc:update_doc
    }
}])

.service("$pouchDB", ["$rootScope", "$q", function($rootScope, $q) {

    var database;
    var changeListener = null;

    this.setDatabase = function(databaseName) {
        database = new PouchDB(databaseName,{adapter:'idb',skip_setup: true,revs_limit: 10});
		/*database = new PouchDB(databaseName,{adapter:'idb'}).destroy().then(function () {
		  // database destroyed
			console.log();
		}).catch(function (err) {
		  // error occurred
		  console.error(err);
		})*/
		database.setMaxListeners(20);
		//PouchDB.debug.enable('*');
		//PouchDB.debug.disable();
		PouchDB.debug.enable('pouchdb:find');
    }

    this.startListening = function() {
		if(changeListener)return;
        changeListener = database.changes({
			since: 'now',
            live: true,
            include_docs: true,
			conflicts: true
        }).on("change", function(change) {
            if(!change.deleted) {
                $rootScope.$broadcast("$pouchDB:change", change);
            } else {
                $rootScope.$broadcast("$pouchDB:delete", change);
            }
        });
    }

    this.stopListening = function() {
		if(!changeListener)return;
        changeListener.cancel();
    }

    this.sync = function(remoteDatabase,options) {
        database.sync(remoteDatabase, options).on('complete', function (info) {
			// handle complete
			console.log('Sync completed '+info);
			$rootScope.$broadcast("$pouchDB:sync_complete", {status:true});
		}).on('error', function (err) {
			// handle error
			console.log('Sync error ');
			console.error(err);
			$rootScope.$broadcast("$pouchDB:sync_complete", {status:false});
		});
    }

    this.save = function(jsonDocument) {
        var deferred = $q.defer();
        if(!jsonDocument._id) {
            database.post(jsonDocument).then(function(response) {
                deferred.resolve(response);
            }).catch(function(error) {
                deferred.reject(error);
            });
        } else {
            database.put(jsonDocument).then(function(response) {
                deferred.resolve(response);
            }).catch(function(error) {
                deferred.reject(error);
            });
        }
        return deferred.promise;
    }

    this.delete = function(documentId, documentRevision) {
        return database.remove(documentId, documentRevision);
    }

    this.get = function(documentId,options={}) {
        return database.get(documentId,options);
    }

    this.destroy = function() {
        database.destroy();
    }
	
	this.search = function(key,inc_docs,reverse_order) {
		var deferred = $q.defer();
		if(reverse_order){
			database.allDocs({
				startkey: key+'\uffff', 
				endkey: key,
				include_docs:inc_docs,
				descending:true
			}).then(function (response) {
			  deferred.resolve(response);
			}).catch(function (error) {
			   deferred.reject(error);
			});		
		}else{
			database.allDocs({
				startkey: key, 
				endkey: key+'\uffff',
				include_docs:inc_docs
			}).then(function (response) {
			  deferred.resolve(response);
			}).catch(function (error) {
			   deferred.reject(error);
			});
		}

		return deferred.promise;
	}
	
	this.searchText = function(text,arr){
		var deferred = $q.defer();
		database.search({
		  query: text,
		  fields: arr,
		  include_docs: true
 	    }).then(function (res) {
		  // handle results
		  deferred.resolve(res);
		}).catch(function (error) {
		  // handle error
		  deferred.reject(error);
		});
		return deferred.promise;
	}
	
	this.upsert = function(documentId,diffFunc) {
		var deferred = $q.defer();
        database.upsert(documentId, diffFunc).then(function (res) {
			deferred.resolve(res);
		}).catch(function (error) {
			// error
			deferred.reject(error);
		});
		return deferred.promise;
    }
	
	this.bulkDocs = function(docs) {
		var deferred = $q.defer();
		database.bulkDocs(docs).then(function (response) {
		  deferred.resolve(response);
		}).catch(function (error) {
		   deferred.reject(error);
		});		

		return deferred.promise;
	}
	
	this.compactDB = function() {
		var deferred = $q.defer();
		database.compact().then(function (response) {
		  // compaction complete
		  deferred.resolve(response);
		}).catch(function (error) {
		  // handle errors
		  deferred.reject(error);
		});
		return deferred.promise;
	}
	
	this.find = function(find_index,find_selector,find_params={}) {
		var deferred = $q.defer();
		database.createIndex({
			index: find_index
		}).then(function (res) {
			database.find({
				selector: find_selector,
				sort:find_params.sort?find_params.sort:'',
				limit:find_params.limit?find_params.limit:10000
			}).then(function (response) {
				deferred.resolve(response);
			}).catch(function (err) {
				// handle errors
				deferred.reject(err);
			});
		}).catch(function (err) {
			// handle errors
			deferred.reject(err);
		});
		return deferred.promise;
	}
	
	this.query = function(index,key){
		var deferred = $q.defer();
		database.query(index,{
			startkey:key,
			endkey:key+'\uffff',
			include_docs: true,
			stale:'update_after'
		}).then(function(response) {
			deferred.resolve(response);
		}).catch(function (err) {
			// handle errors
			deferred.reject(err);
		});
		return deferred.promise;
	}
	
	this.bulkFetch = function(config) {
		var deferred = $q.defer();
		database.allDocs(config).then(function (response) {
		  deferred.resolve(response);
		}).catch(function (error) {
		   deferred.reject(error);
		});		

		return deferred.promise;
	}
		
	this.putIfNotExists = function(doc) {
		var deferred = $q.defer();
        database.putIfNotExists(doc).then(function (res) {
			deferred.resolve(res);
		}).catch(function (error) {
			// error
			deferred.reject(error);
		});
		return deferred.promise;
    }

}])

.service("$pouchDBEtc", ["$rootScope", "$q", function($rootScope, $q) {

    var database;
    var changeListener;

	this.isInitialized = function(){
		if(database) return true;
		return false;
	}
	
    this.setDatabase = function(databaseName) {
        database = new PouchDB(databaseName, {skip_setup: true});
		//PouchDB.debug.enable('pouchdb:find');
    }

    this.startListening = function() {
        changeListener = database.changes({
			since: 'now',
            live: true,
            include_docs: true
        }).on("change", function(change) {
            if(!change.deleted) {
                $rootScope.$broadcast("$pouchDBEtc:change", change);
            } else {
                $rootScope.$broadcast("$pouchDBEtc:delete", change);
            }
        });
    }

    this.stopListening = function() {
        changeListener.cancel();
    }

    this.sync = function(remoteDatabase,options) {
        database.sync(remoteDatabase, options).on('complete', function (info) {
			// handle complete
			console.log('Sync completed '+info);
			$rootScope.$broadcast("$pouchDBEtc:sync_complete", {status:true});
		}).on('error', function (err) {
			// handle error
			console.log('Sync error ');
			$rootScope.$broadcast("$pouchDBEtc:sync_complete", {status:false});
		});
    }

    this.save = function(jsonDocument) {
        var deferred = $q.defer();
		if(database == undefined){
			deferred.reject("Db undefined");
		}else{
			if(!jsonDocument._id) {
				database.post(jsonDocument).then(function(response) {
					deferred.resolve(response);
				}).catch(function(error) {
					deferred.reject(error);
				});
			} else {
				database.put(jsonDocument).then(function(response) {
					deferred.resolve(response);
				}).catch(function(error) {
					deferred.reject(error);
				});
			}
		}
        return deferred.promise;
    }

    this.delete = function(documentId, documentRevision) {
        return database.remove(documentId, documentRevision);
    }

    this.get = function(documentId) {
        return database.get(documentId);
    }

    this.destroy = function() {
        database.destroy();
    }
	
	this.search = function(key,inc_docs,reverse_order) {
		var deferred = $q.defer();
		if(database == undefined){
			deferred.reject("Db undefined");
		}else{
			if(reverse_order){
				database.allDocs({
					startkey: key+'\uffff', 
					endkey: key,
					include_docs:inc_docs,
					descending:true
				}).then(function (response) {
				  deferred.resolve(response);
				}).catch(function (error) {
				   deferred.reject(error);
				});		
			}else{
				database.allDocs({
					startkey: key, 
					endkey: key+'\uffff',
					include_docs:inc_docs
				}).then(function (response) {
				  deferred.resolve(response);
				}).catch(function (error) {
				   deferred.reject(error);
				});
			}
		}

		return deferred.promise;
	}
	
	this.searchText = function(text,arr){
		var deferred = $q.defer();
		if(database == undefined){
			deferred.reject("Db undefined");
		}else{
			database.search({
			  query: text,
			  fields: arr,
			  include_docs: true
			}).then(function (res) {
			  // handle results
			  deferred.resolve(res);
			}).catch(function (error) {
			  // handle error
			  deferred.reject(error);
			});
		}
		return deferred.promise;
	}
	
	this.upsert = function(documentId,diffFunc) {
		var deferred = $q.defer();
        if(database == undefined){
			deferred.reject("Db undefined");
		}else{
			database.upsert(documentId, diffFunc).then(function (res) {
				deferred.resolve(res);
			}).catch(function (error) {
				// error
				deferred.reject(error);
			});
		}
		return deferred.promise;
    }
	
	this.bulkDocs = function(docs) {
		var deferred = $q.defer();
		if(database == undefined){
			deferred.reject("Db undefined");
		}else{
			database.bulkDocs(docs).then(function (response) {
			  deferred.resolve(response);
			}).catch(function (error) {
			   deferred.reject(error);
			});	
		}

		return deferred.promise;
	}
	
	this.compactDB = function() {
		var deferred = $q.defer();
		if(database == undefined){
			deferred.reject("Db undefined");
		}else{
			database.compact().then(function (response) {
			  // compaction complete
			  deferred.resolve(response);
			}).catch(function (error) {
			  // handle errors
			  deferred.reject(error);
			});
		}
		return deferred.promise;
	}
	
	this.find = function(find_index,find_selector,find_params={}) {
		var deferred = $q.defer();
		if(database == undefined){
			deferred.reject("Db undefined");
		}else{
			database.createIndex({
				index: find_index
			}).then(function (res) {
				database.find({
					selector: find_selector,
					sort:find_params.sort?find_params.sort:'',
					limit:find_params.limit?find_params.limit:10000
				}).then(function (response) {
					deferred.resolve(response);
				}).catch(function (err) {
					// handle errors
					deferred.reject(err);
				});
			}).catch(function (err) {
				// handle errors
				deferred.reject(err);
			});
		}
		return deferred.promise;
	}
	
	this.query = function(index,key){
		var deferred = $q.defer();
		if(database == undefined){
			deferred.reject("Db undefined");
		}else{
			database.query(index,{
				startkey:key,
				endkey:key+'\uffff',
				include_docs: true,
				stale:'update_after'
			}).then(function(response) {
				deferred.resolve(response);
			}).catch(function (err) {
				// handle errors
				deferred.reject(err);
			});
		}
		return deferred.promise;
	}
	
	this.bulkFetch = function(config) {
		var deferred = $q.defer();
		if(database == undefined){
			deferred.reject("Db undefined");
		}else{
			database.allDocs(config).then(function (response) {
			  deferred.resolve(response);
			}).catch(function (error) {
			   deferred.reject(error);
			});	
		}

		return deferred.promise;
	}
	
	this.clearDB = function(){
	    var deferred = $q.defer();
		if(database == undefined){
			deferred.reject("Db undefined");
		}else{
	        database.allDocs({include_docs: true}).then(function (result) {
                return Promise.all(result.rows.map(function (row) {
                   return database.remove(row.doc);
                }));
            }).then(function (response) {
                // All docs have really been removed() now!
				deferred.resolve(response);
            }).catch(function (error) {
			   deferred.reject(error);
			});
		}
		
		return deferred.promise;
	}
	
	this.putIfNotExists = function(doc) {
		var deferred = $q.defer();
        database.putIfNotExists(doc).then(function (res) {
			deferred.resolve(res);
		}).catch(function (error) {
			// error
			deferred.reject(error);
		});
		return deferred.promise;
    }

}])

.service('QyScrollDelegate', ['$ionicScrollDelegate',function ($ionicScrollDelegate) {
	var custom = {
		$getByHandle: function(name) {
			var instances = $ionicScrollDelegate.$getByHandle(name)._instances;
			return instances.filter(function(element) {
				return (element['$$delegateHandle'] == name);
			})[0];
		}
	};

	return custom;
}])
	
.factory('qz', [function() {
	return qz;
}])

.factory('QZHelper', ['$q','qz',function($q,qz) {
	
    var qz_cfg = null;
	var print_config = {
		'copies':1,
		'size':null,
		'units':"in",
		'orientation':"portrait"
	};
    
	return {
		getPrintParams : function (){
			return print_config;
		},
		setPrintParams : function (config){
			print_config = config;
		},
		print : function (config,data){
			return qz.print(config,data);
		},
		createConfigs: function(name,config){
			return qz.configs.create(name,config);
		},
		getUpdatedConfig : function () {// QZ Config
			if (qz_cfg == null) {
				qz_cfg = qz.configs.create(null);
			}

			qz_cfg.reconfigure({
				copies: print_config.copies,
				size:print_config.size,
				orientation:print_config.orientation,
				units:print_config.units
			});
			return qz_cfg;
		},
		handleConnectionError : function (err) {
			if (err.target != undefined) {
				if (err.target.readyState >= 2) { //if CLOSING or CLOSED
					console.error("Connection to QZ Tray was closed");
				} else {
					console.error(err);
				}
			} else {
				console.error(err);
			}
		},
		startConnection : function (config) {
			var deferred = $q.defer();
			if (!qz.websocket.isActive()) {
				qz.websocket.connect(config).then(function() {
					deferred.resolve({'Success':1,'exists':false});
				}).catch(function(err){
					deferred.reject({'Success':0,'err':err});
				});
			} else {
				console.log('An active connection with QZ already exists.');
				deferred.resolve({'Success':1,'exists':true});
			}
			return deferred.promise;
		}
	}
}])

.factory('shareData', function($filter){

  var allCustomers = [],allOrders = [];
  var settings = {};
  var aiv_postcodes = [];

  return {
    addCustomer: function(data) {
		var i;
		for(var i=0;i<allCustomers.length;i++){
			if(allCustomers[i]._id == data._id){
				//Update customer data
				allCustomers[i] = data;
				break;
			}
		}
		
		if(i >= allCustomers.length){
			//Add customer
			allCustomers.push(data); 
		}
    },
	addCustomers: function(data) {
        allCustomers = data; 
    },
    getCustomers: function() {
        return allCustomers;
    },
    getCustomer:function(type,input) {
		if(type == "DOCID"){
			for(var i=0;i<allCustomers.length;i++){
				if(allCustomers[i].meta.docid == input){
					return allCustomers[i];
				}
			}
		}else if(type == "PHONE"){
			for(var i=0;i<allCustomers.length;i++){
				var customer = allCustomers[i];
				if(customer!=null&&customer.hasOwnProperty('billing_address')&&customer.billing_address.hasOwnProperty('phone')&&customer.hasOwnProperty('first_name')){
					if(allCustomers[i].billing_address.phone == input){
						return allCustomers[i];
					}
				}
			}
		}else if(type == "LOYALTY_CARD"){
			for(var i=0;i<allCustomers.length;i++){

				var customer = allCustomers[i];
				if(customer!=null&&customer.hasOwnProperty('billing_address')&&customer.billing_address.hasOwnProperty('phone')&&customer.hasOwnProperty('first_name')){
					if(allCustomers[i].meta.loyalty_card_id == input){
						return allCustomers[i];
					}
				}
			}
		}
		return {}; 
    },
	addSettings:function(data){
		settings = data;
	},
	getSettings:function(){
		return settings;
	},
	addPostcodes:function(data){
		aiv_postcodes = data;
	},
	getPostcodes:function(){
		return aiv_postcodes;
	},
	addOrder: function(data) {
		var i;
		for(var i=0;i<allOrders.length;i++){
			if(allOrders[i]._id == data._id){
				//Update order data
				allOrders[i] = data;
				break;
			}
		}
		
		if(i >= allOrders.length){
			//Add order
			allOrders.push(data); 
		}
    },
	addOrders: function(data) {
        allOrders = data; 
    },
    getOrders: function() {
        return allOrders;
    },
	removeOrder:function(data){
		var i;
		for(var i=0;i<allOrders.length;i++){
			if(allOrders[i]._id == data._id){
				//Remove order data
				allOrders.splice(i,1);
				break;
			}
		}
	}
  }
});
