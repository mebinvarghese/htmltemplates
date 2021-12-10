// Ionic aiv-pos App
 var data="";
var db_name =''; 
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'aiv-pos' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'aiv-pos.services' is found in services.js
// 'aiv-pos.controllers' is found in controllers.js
angular.module('aiv-pos', ['ionic','ionic.service.core', 'aiv-pos.controllers', 'aiv-pos.services', 'aiv-pos.directives', 'common.services','ionicLazyLoad', 'ngMessages', 'angularUtils.directives.dirPagination','ionicSelect','ngKeypad','ng-virtual-keyboard','PHPass', 'ionic-datepicker','timer','ja.qr','ionic-timepicker'])

/*.constant("Nucleus",require("electron-nucleus")("5aa7b598bcaaac001bc09172", {
	disableInDev: true, // disable module while in development (default: false)
	userId: 'TPOS', // Set a custom identifier for this User
	version: '2.2.6' // Set a custom version
}))*/
.constant("AIV_CONSTANTS",{
	"BASE_URL" : '',
	"LOYALTY_URL" : '',
	"CORS_URL": 'http://capturltd.co.uk/cors.php',
	"REMOTE_DB": 'pos_'+db_name,
	"CUSER":"captur",
	"CPASS":"CapturLtd1986",
	"AUSER":"aivknowtech",
	"APASS":"aivknowtech6",
	"REMOTE_DBURL": "http://captur:CapturLtd1986@35.197.240.3:5984/pos_"+db_name,
	"SECOND_DB": 'pos_'+db_name,
	"SECOND_DBURL": "http://192.168.1.131:5984/pos_"+db_name,
	"POSTCODE_API_URL":'https://api.ideal-postcodes.co.uk/v1/postcodes/',
	"LS_PREFIX" : 'aivrpos_'+db_name+'_',
	"SYNC_TIMEOUT":5000,
	"OPTION_SEPARATOR":'###',
	"TEST_MODE":false,
	"TEST_KITCHEN":false,
	"APP_VER":"V2.2.6"
})
/* .constant("AIV_CONSTANTS",{
	"BASE_URL" : '',
    "LOYALTY_URL" : '',
	"CORS_URL": 'http://capturltd.co.uk/cors.php',
	"REMOTE_DB": 'pos_capturtableposdemo',
	"CUSER":"captur",
	"AUSER":"aivknowtech",
	"APASS":"aivknowtech6",
	"CPASS":"CapturLtd1986",
	"REMOTE_DBURL": "https://captur:CapturLtd1986@35.197.240.3:5984/pos_capturtableposdemo",
	"SECOND_DB": 'posk_capturtableposdemo',
	"SECOND_DBURL": "http://192.168.1.131:5984/posk_capturtableposdemo",
	"POSTCODE_API_URL":'https://api.ideal-postcodes.co.uk/v1/postcodes/',
	"LS_PREFIX" : 'aivtpos_capturtableposdemo_',
	"SYNC_TIMEOUT":5000,
	"OPTION_SEPARATOR":'###',
	"TEST_MODE":false,
	"TEST_KITCHEN":false,
	"APP_VER":"V2.4.5"
})
 */
.run(function($ionicPlatform, $rootScope,$localstorage,$ionicPopup,$ionicLoading,$pouchDB,AIV_CONSTANTS) {
    $ionicPlatform.ready(function() {
		
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleLightContent();
        }
		$localstorage.setObject('app_db_name','capturcsi');
		data =$localstorage.getObject('app_db_name_1');
		var url = $localstorage.getObject('BASE_URL');
		var loyalty_url = $localstorage.getObject('LOYALTY_URL');
		if(data){
			AIV_CONSTANTS.BASE_URL =url;
			AIV_CONSTANTS.LOYALTY_URL =loyalty_url;
			AIV_CONSTANTS.REMOTE_DB ='pos_'+data;
			AIV_CONSTANTS.REMOTE_DBURL ="http://captur:CapturLtd1986@35.197.240.3:5984/pos_"+data;
			AIV_CONSTANTS.SECOND_DB ='pos_'+data;
			AIV_CONSTANTS.SECOND_DBURL ="http://192.168.1.131:5984/pos_"+data;
			AIV_CONSTANTS.LS_PREFIX ='aivrpos_'+data+'_';
		}
		
		$pouchDB.setDatabase(AIV_CONSTANTS.REMOTE_DB);
	});	
	
	$rootScope.aiv_info = {
		"name" : 'AIVPOS',
		"author" : '',
		"description" : '',
		"lat" : '',
		"long" : '',
		"currency" : '',
		"currency_symbol" : '',
		"url" : '',
		"fb_url" : '',
		"hf_url" : '',
		"fb_appid" : '',
		"domain" : '',
		"phone1" : 'Phone',
		"phone2" : 'Phone',
		"email" : 'Email',
		"android_id" : '',
		"ios_id" : '',
		"windows_id" : '',
		"android_icon" : '',
		"app_name" : '',
		"address" : '',
		"hyg_url":'',
		"hf_name" : '',
		"orders_url" : '',
		"POSTCODE_API_KEY":"",
		"enable_kitchen":"",
		"SMS_API":"",
		"enable_sms":false,
		"sms_campaign_name":"",
		"shop_id":"",
		"shop_name":"",
		"dbname":"",
		"twitter":"",
		"vat_no":"",
		"day_ends_at":"03:00:00",
		"enable_compaction":true,
		"compact_days":1,
		"APP_VER":AIV_CONSTANTS.APP_VER
	};
	$rootScope.user = "Guest";
	$rootScope.edit_mode = false;
	$rootScope.virtual_key_enable = true;
	$rootScope.current_terminal = "";
})

.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider,AIV_CONSTANTS,ionicTimePickerProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

    // setup an abstract state for the tabs directive
    .state('tab', {
        url: "/tab",
        abstract: true,
        templateUrl: 'templates/main.html',
        controller: 'AppCtrl'
    })

    // Each tab has its own nav history stack:
    .state('tab.front', {
		cache: false,
        url: '/front',
        views: {
            'tab-front': {
                templateUrl: 'templates/front.html',
                controller: 'FrontCtrl'
            }
        }
    })
	
	.state('tab.back', {
		cache: false,
        url: '/back',
        views: {
            'tab-back': {
                templateUrl: 'templates/back.html',
                controller: 'BackCtrl'
            }
        }
    })
	
	.state('tab.kitchen', {
		cache: false,
        url: '/kitchen',
        views: {
            'tab-kitchen': {
                templateUrl: 'templates/kitchen.html',
                controller: 'KitchenCtrl'
            }
        }
    })
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/tab/front');
	$ionicConfigProvider.tabs.position('bottom');
	$ionicConfigProvider.scrolling.jsScrolling(false);
	
	var zero_time = new Date("2018-08-18T00:00:00Z");
	var pickerOffset = zero_time.getTimezoneOffset();
    var utcDate = new Date();
    utcDate.setTime(zero_time.getTime() + pickerOffset * 60000);
	var timePickerObj = {
      inputTime: ((utcDate.getHours() * 60 * 60) + (utcDate.getMinutes() * 60)),
      format: 12,
      step: 5,
      setLabel: 'Set',
      closeLabel: 'Close'
    };
    ionicTimePickerProvider.configTimePicker(timePickerObj);

     var firebaseConfig = {
	  apiKey: "AIzaSyAXa9r0LplV3vGmcpJLFax6ZZhXBSMTlAg",
      authDomain: "cosi-production.firebaseapp.com",
      databaseURL: "https://cosi-production.firebaseio.com",
      projectId: "cosi-production",
      storageBucket: "",
      messagingSenderId: "55876442914",
      appId: "1:55876442914:web:43e4330dc0f6d9bf"
    };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  

})

.filter('split', function() {
	return function(input, splitChar, splitIndex) {
		var arr = input.split(splitChar);
		if(arr.length > splitIndex){
			return arr[splitIndex];
		}
		return input;
	}
})
	
.filter('nonalpha', function() {
	return function(input) {
		var output = input.replace(/[^0-9a-z]/gi, '')
		return output;
	}
})

.filter('decodehtml', function() {
	return function decodeHtml(html) {
		var txt = document.createElement("textarea");
		txt.innerHTML = html;
		return txt.value;
	}
})

.filter('abs', function () {
  return function(val) {
    return Math.abs(val);
  }
})

.filter('checkdeals', function () {
  return function(product) {
    var current_date = new Date();
	if(angular.isDefined(product.meta.wc_productdata_options)){
		if(product.meta.wc_productdata_options[0]._freqtype == 'W'){
			var weekday = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];
			if(product.meta.wc_productdata_options[0]._dealfreq.toLowerCase().indexOf(weekday[current_date.getDay()]) != -1){
				return true;
			}
		}else if(product.meta.wc_productdata_options[0]._freqtype == 'D'){
			if(product.meta.wc_productdata_options[0]._dealfreq.indexOf(current_date.getDate()) != -1){
				return true;
			}
		}else if(product.meta.wc_productdata_options[0]._freqtype == 'C'){
			var yyyy = current_date.getFullYear().toString();                                    
			var mm = (current_date.getMonth()+1).toString(); // getMonth() is zero-based         
			var dd  = current_date.getDate().toString();             
			current_date = yyyy + '-' + (mm[1]?mm:"0"+mm[0]) + '-' + (dd[1]?dd:"0"+dd[0]);
			if(current_date == product.meta.wc_productdata_options[0]._dealfreq){
				return true;
			}
		}
	}
	return false;
  }
})

.filter('search_customer', function () {
  return function(haystack,needle) {
	if(needle != '' && needle.length > 2){
		var new_arr = [];
		angular.forEach(haystack, function(customer) {
			if (customer.id.indexOf(needle) > -1) {
				new_arr.push(customer);
			}
		});
		return new_arr;
	}
	return haystack;
  }
})

.filter('sanitize_title', function (decodehtmlFilter) {
  return function(str) {
	str = decodehtmlFilter(str);
	str = str.replace(/^\s+|\s+$/g, ''); // trim
	str = str.toLowerCase();

	// remove accents, swap ñ for n, etc
	var from = "àáäâèéëêìíïîòóöôùúüûñç·_,:;";
	var to   = "aaaaeeeeiiiioooouuuunc-----";

	for (var i=0, l=from.length ; i<l ; i++)
	{
		str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
	}

	str = str.replace(/\.+/g, '-') // replace . by -
		.replace(/[^a-z0-9 +-]/g, '') // remove invalid chars
		.replace(/\++/g, '') // collapse plus
		.replace(/\s+/g, '-') // collapse whitespace and replace by -
		.replace(/-+/g, '-'); // collapse dashes

	return str;
  }
})

.filter('aiv_payment_filter', function () {
  return function(methods,custom) {
	if(custom){
		var new_arr = [];
		angular.forEach(methods, function(method) {
			if (method.id != "cod" && method.id != "credit") {
				new_arr.push(method);
			}
		});
		return new_arr;
	}
	return methods;
  }
})

.filter('aiv_keymatch', function () {
  return function(items,input) {
	if(items[input] != undefined){
		var item = {};
		item[input] = items[input];
		return item;
	}
	return items;
  }
})

.controller('MainCtrl', ['$state','$ionicHistory', function($state,$ionicHistory) {

}]);
