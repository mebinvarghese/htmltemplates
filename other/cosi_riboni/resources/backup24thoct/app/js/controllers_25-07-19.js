angular.module('aiv-pos.controllers', ['aiv-pos.services'])

.controller('FrontCtrl', function($scope, $state, $ionicSlideBoxDelegate, dataService,$ionicPopover,$rootScope,$localstorage,$filter,ngVirtualKeyboardService) {


})

.controller('BackCtrl', function($scope, $state) {


})

.controller('KitchenCtrl', function($scope, $state, $ionicSlideBoxDelegate, dataService,$ionicPopover,$rootScope,$localstorage,$filter,ngVirtualKeyboardService) {


})

.controller('AppCtrl', function($scope, dataService, $localstorage, $timeout, $ionicLoading, $ionicModal, $filter, $state, $rootScope,$ionicPlatform, $ionicHistory,$window,$ionicScrollDelegate,
	$ionicPopup,$ionicSideMenuDelegate,AIV_CONSTANTS,$pouchDB,qz,QZHelper,$ionicPopover,PHPass,ionicDatePicker,$pouchDBEtc,$location,ngVirtualKeyboardService,$q,shareData,ionicTimePicker,$interval) {
	$scope.product_show=true;
	$scope.posview = {'type':'POS'};
	$scope.otheroptions=[];
	$scope.otheroptionsstart=[];
	$scope.depositInfo =[];
	$scope.voucher_code_area='';
	$scope.voucherId=[];
	$scope.voucher_pay_type='';
	$scope.selected_postfix =false;
	$scope.showClockInButton =false;
	$scope.replication_status ={'title':'replication','status':'false','class':'assertive blink','icon':'ion-more'};
	$scope.pouch_replication_status ={'title':'replication','status':'false','class':'assertive blink','icon':'ion-more'};
	$scope.purchaseListArray =[];
	$scope.purchaseListNameArray =[];
	$scope.updateDailyOrderNo=[];
	$scope.vouchercode="";
	$scope.getPurchaseItemName=[];
	$scope.globelPurchseList=[];
	$scope.showPurchasePrevios =false;
	$scope.showPurchasePrevios =false;
	$scope.globelPurchseListSerach =[];
	$scope.offlineWatchDog = false;
	$scope.offlineWatchDogStart = false;
	$scope.offlineWatchDogCount = 5;
	$scope.showCODPayment =false;
	$scope.heartBeat ={'newBeat':'','oldBeat':''};
	$scope.split_multiple =true;
	$scope.formCustomer_find = {
		address_1:"",
		address_2:""
	};

	var clear_payment = function(){
		$scope.selected_pay = {};
		$scope.order_to_pay = {order:'',type:''};
		$scope.payment_fee = 0;
		$scope.payment_select = {
			id : '',
			err : '',
			amount : '',
			tender : '',
			delivery:false,
			to_pay:0,
			delivery_van:'',
			customer_id:"guest",
			shipping_method:$scope.selected_shipping.title,
			credit_period:'30 days',
			custom:false,
			cheque_number:'',
			partial_payment:false,
			payment_done:false,
			balance:"Credit",
			del_charge:0
		};
		$scope.split_payment = {'paid':0,'to_pay':0,'total':0};
		$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'split_payment',$scope.split_payment);
		//$scope.loyalty_card = {id:'',manual_search:false,reward_amount:0,reward_points:0};
	}
	
	$scope.resetLoyaltyFields = function(){
		$scope.loyalty_card = {
			id:'',
			manual_search:false,
			points_added_status:false,
			points_redeem_status:false,
			order_amount:0,
			current_points:0,
			points_to_redeem:0,
			reward_points:0,
			reward_amount:0,
			reward_money:0,
			redeem_status:true,
			assigned:false,
			error:''
		};
	}
	
	$scope.toggleLayout = function(){
		if($scope.aiv_menu.show_layout){
			$scope.aiv_menu.expose = "(min-width:700px)";
			var keyboard = $('#aiv-customer-search1').find('.aiv-autocomplete').keyboard().getkeyboard();
			if(keyboard){
				keyboard.options.alwaysOpen = true;
				keyboard.redraw();
			}
			$scope.aiv_menu.drag = false;
		}else{
			$scope.aiv_menu.expose = "(min-width:10000px)";
			var keyboard = $('#aiv-customer-search1').find('.aiv-autocomplete').keyboard().getkeyboard();
			if(keyboard){
				keyboard.options.alwaysOpen = false;
				keyboard.close();
			}
			$scope.aiv_menu.drag = true;
		}
	}
	
	$scope.setMainPrinter = function(){
		var exists = $filter('filter')($scope.AIVPrinterSettings,{usage:'Main'},true);
		if(exists.length){
			$scope.settingsPrinter = exists[0];
		}else{
			$scope.settingsPrinter = {
				id:'',
				name:'',
				connected:false,
				lineLength:48,
				type:$scope.aiv_printer_types[0],
				paper:$scope.aiv_paper_sizes[0].type,
				cmd_cut:default_print_cmds.cut,
				cmd_don:default_print_cmds.don,
				cmd_doff:default_print_cmds.doff,
				cmd_bon:default_print_cmds.bon,
				cmd_boff:default_print_cmds.boff,
				cmd_lon:default_print_cmds.lon,
			    cmd_loff:default_print_cmds.loff,
				cmd_cashdrawer:default_print_cmds.cashdrawer,
				enable_cut:true,
				usage:'Main',
				dept:'None'
			};
		}
	}
	
	function chr(i) {
	  return String.fromCharCode(i);
	}
	
	/*var createDBUrl = function(ip,db){
		return "http://"+ip+":5984/"+db;
	}*/
	
	var createDBUrl = function(ip,db){
		return "http://"+AIV_CONSTANTS.CUSER+":"+AIV_CONSTANTS.CPASS+"@"+ip+":5984/"+db;
	}
		
		
	//Creates a print command
	var gen_print_command = function(cmd_string){
		var arr = cmd_string.split(",");
		var cmd = '';
		for(var i=0;i<arr.length;i++){
			if(arr[i].length){
				cmd+=chr(arr[i]);
			}
		}
		
		return cmd;
	}
		
	var yyyymmdd = function(dt) {         
        var yyyy = dt.getFullYear().toString();                                    
        var mm = (dt.getMonth()+1).toString(); // getMonth() is zero-based         
        var dd  = dt.getDate().toString();             
                            
        return yyyy + '-' + (mm[1]?mm:"0"+mm[0]) + '-' + (dd[1]?dd:"0"+dd[0]);
    }
	
	var hhmmss = function(date) {
        var hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
        var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
        var seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
        time = hours + ":" + minutes + ":" + seconds;
        return time;
    };
	
	var default_print_cmds = {//EPSON POS commands
		bon:"27,33,8",
		boff:"27,33,0",
		don:"29,33,16",
		doff:"29,33,0",
		cut:"29,86,1",
		lon:"27,51,70",
		loff:"27,51,65",
		cashdrawer:"27,112,48,25,25,13"
	}
	
	console.log($localstorage.getObject(AIV_CONSTANTS.LS_PREFIX+'cart'));
    $scope.cartItems = $localstorage.getArray(AIV_CONSTANTS.LS_PREFIX+'cart');
    $scope.countries = $localstorage.getObject(AIV_CONSTANTS.LS_PREFIX+'countries');
	$scope.base_country = $localstorage.getObject(AIV_CONSTANTS.LS_PREFIX+'base_country');
	$scope.order_type = $localstorage.getObject(AIV_CONSTANTS.LS_PREFIX+'order_type');
	$scope.local_ip = $localstorage.getObject(AIV_CONSTANTS.LS_PREFIX+'local_ip');
	$scope.local_ip = $scope.local_ip.length?$scope.local_ip:'';
	$scope.localdb_ip = $localstorage.getObject(AIV_CONSTANTS.LS_PREFIX+'localdb_ip');
	$scope.views = {table:false};
	if($scope.localdb_ip.length){
		$ionicLoading.show({
			template: '<ion-spinner icon="ios"></ion-spinner><br><span class="aiv-loading">Initial loading<br>This may take a while.Please wait...</span>',
			animation: 'fade-in',
			showBackdrop: true,
			maxWidth: 300,
			showDelay: 0
		});
	}else{
		$scope.localdb_ip = '';
	}
	
	if(AIV_CONSTANTS.TEST_KITCHEN){
		$scope.local_ip = '192.168.1.131';
	}
	
	$scope.secondDBUrl = createDBUrl($scope.local_ip,AIV_CONSTANTS.SECOND_DB);
	$scope.couchDBUrl = createDBUrl($scope.localdb_ip,AIV_CONSTANTS.REMOTE_DB);

	if (!angular.isArray($localstorage.getArray(AIV_CONSTANTS.LS_PREFIX+'terminalData'))) {
		$scope.terminalData = $localstorage.getObject(AIV_CONSTANTS.LS_PREFIX+'terminalData');
	}else {
		$scope.terminalData = {
			'_id':'',
			'name':'',
			'id':'',
			'prefix':'',
			'last_bill_number':'',
			'last_order_seq':'',
			'type':'',
			'assigned':false,
			'dept':[],
			'last_customer_seq':0
		};
		$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'terminalData',$scope.terminalData);
	}
	$rootScope.current_terminal = $scope.terminalData.name;
	
	$scope.weekdays = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
	$scope.loginInfo = {user_login:'','role':''};
	$scope.pre_loginInfo = {user_login:'','role':''};
	if (!angular.isArray($localstorage.getArray(AIV_CONSTANTS.LS_PREFIX+'login')) && $scope.terminalData.type=='KITCHEN') {
		$scope.loginInfo = $localstorage.getObject(AIV_CONSTANTS.LS_PREFIX+'login');
	}
	
	$scope.dropdown_menu = [
		'Settings'
	];
	
	$scope.product_types = ["Hot","Cold"];
	
	if($scope.terminalData.type!='KITCHEN'){
		$scope.dropdown_menu.push('Reports');
	}
	
	if (!angular.isArray($localstorage.getArray(AIV_CONSTANTS.LS_PREFIX+'CIDSettings'))) {
		$scope.settingsCID = $localstorage.getObject(AIV_CONSTANTS.LS_PREFIX+'CIDSettings');
		if($scope.settingsCID.device_connected == undefined){
			$scope.settingsCID.device_connected = false;
			$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'CIDSettings',$scope.settingsCID);
		}
		if($scope.settingsCID.fid_connected == undefined){
			$scope.settingsCID.fid_connected = false;
			$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'CIDSettings',$scope.settingsCID);
		}
	}else {
		$scope.settingsCID = {
			port:'',
			connected:false,
			device_connected:false,
			fid_connected:false
		}
		$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'CIDSettings',$scope.settingsCID);
	}
	
	$scope.aiv_printer_types = ["Receipt Print","Pixel Print"];
	$scope.aiv_paper_sizes = [
		{type:'Letter',width:8.5,height:11},
		{type:'A4',width:8.3,height:11.7},
	];
	
	if (angular.isArray($localstorage.getArray(AIV_CONSTANTS.LS_PREFIX+'AIVPrinterSettings'))) {
		$scope.AIVPrinterSettings = $localstorage.getArray(AIV_CONSTANTS.LS_PREFIX+'AIVPrinterSettings');
	}else {
		$scope.AIVPrinterSettings = [];
		$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'AIVPrinterSettings',$scope.AIVPrinterSettings);
	}
	
	$scope.setMainPrinter();
	
	if (!angular.isArray($localstorage.getArray(AIV_CONSTANTS.LS_PREFIX+'KOTPrinter1Settings'))) {
		$scope.KOTPrinter1Settings = $localstorage.getObject(AIV_CONSTANTS.LS_PREFIX+'KOTPrinter1Settings');
	}else {
		$scope.KOTPrinter1Settings = {
			selected:false,
			name:'',
			connected:false,
			lineLength:48,
			type:$scope.aiv_printer_types[0],
			cmd_cut:default_print_cmds.cut,
			cmd_don:default_print_cmds.don,
			cmd_doff:default_print_cmds.doff,
			cmd_bon:default_print_cmds.bon,
			cmd_boff:default_print_cmds.boff,
			cmd_lon:default_print_cmds.lon,
			cmd_loff:default_print_cmds.loff,
			enable_cut:true
		}
		$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'KOTPrinter1Settings',$scope.KOTPrinter1Settings);
	}
	
	if (!angular.isArray($localstorage.getArray(AIV_CONSTANTS.LS_PREFIX+'KOTPrinter2Settings'))) {
		$scope.KOTPrinter2Settings = $localstorage.getObject(AIV_CONSTANTS.LS_PREFIX+'KOTPrinter2Settings');
	}else {
		$scope.KOTPrinter2Settings = {
			selected:false,
			name:'',
			connected:false,
			lineLength:48,
			type:$scope.aiv_printer_types[0],
			cmd_cut:default_print_cmds.cut,
			cmd_don:default_print_cmds.don,
			cmd_doff:default_print_cmds.doff,
			cmd_bon:default_print_cmds.bon,
			cmd_boff:default_print_cmds.boff,
			cmd_lon:default_print_cmds.lon,
			cmd_loff:default_print_cmds.loff,
			enable_cut:true
		}
		$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'KOTPrinter2Settings',$scope.KOTPrinter2Settings);
	}
	
	if (!angular.isArray($localstorage.getArray(AIV_CONSTANTS.LS_PREFIX+'LabelPrinterSettings'))) {
		$scope.LabelPrinterSettings = $localstorage.getObject(AIV_CONSTANTS.LS_PREFIX+'LabelPrinterSettings');
	}else {
		$scope.LabelPrinterSettings = {
			selected:false,
			name:'',
			connected:false,
			lineLength:48,
			type:$scope.aiv_printer_types[0],
			cmd_cut:default_print_cmds.cut,
			cmd_don:default_print_cmds.don,
			cmd_doff:default_print_cmds.doff,
			cmd_bon:default_print_cmds.bon,
			cmd_boff:default_print_cmds.boff,
			cmd_lon:default_print_cmds.lon,
			cmd_loff:default_print_cmds.loff,
			enable_cut:true
		}
		$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'LabelPrinterSettings',$scope.LabelPrinterSettings);
	}
	
	if (!angular.isArray($localstorage.getArray(AIV_CONSTANTS.LS_PREFIX+'terminals'))) {
		$scope.aiv_terminals = $localstorage.getObject(AIV_CONSTANTS.LS_PREFIX+'terminals');
	}else {
		$scope.aiv_terminals = {
			'_id':'getTerminals',
			terminals:[]
		};
		$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'terminals',$scope.aiv_terminals);
	}
	
	//Get last order
	if (!angular.isArray($localstorage.getArray(AIV_CONSTANTS.LS_PREFIX+'lastOrder'))) {
		$scope.lastOrder = $localstorage.getObject(AIV_CONSTANTS.LS_PREFIX+'lastOrder');
		if(angular.isUndefined($scope.lastOrder.order)){
			$scope.lastOrder = {order:{},date:yyyymmdd(new Date())};
			$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'lastOrder',$scope.lastOrder);
		}
	}else {
		$scope.lastOrder = {order:{},date:yyyymmdd(new Date())};
		$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'lastOrder',$scope.lastOrder);
	}
	
	//Get online order settings
	if (!angular.isArray($localstorage.getArray(AIV_CONSTANTS.LS_PREFIX+'onlineOrder'))) {
		$scope.onlineOrder = $localstorage.getObject(AIV_CONSTANTS.LS_PREFIX+'onlineOrder');
		$scope.onlineOrder_1 = $localstorage.getObject(AIV_CONSTANTS.LS_PREFIX+'onlineOrder');
	}else {
		if($scope.terminalData.type=='BOTH'||$scope.terminalData.type=='BACK'){
			$scope.onlineOrder = {enable:true};
			$scope.onlineOrder_1 = {enable:true};
		}else{
			$scope.onlineOrder = {enable:false};
			$scope.onlineOrder_1 = {enable:false};
		}
		$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'onlineOrder',$scope.onlineOrder);
	}
	
	//Get call order settings
	if (!angular.isArray($localstorage.getArray(AIV_CONSTANTS.LS_PREFIX+'callOrder'))) {
		$scope.callOrder = $localstorage.getObject(AIV_CONSTANTS.LS_PREFIX+'callOrder');
	}else {
		$scope.callOrder = {sound:true};
		$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'callOrder',$scope.callOrder);
	}
	
	//Enable JustEat button
	if (!angular.isArray($localstorage.getArray(AIV_CONSTANTS.LS_PREFIX+'justEat'))) {
		$scope.justEat = $localstorage.getObject(AIV_CONSTANTS.LS_PREFIX+'justEat');
	}else {
		$scope.justEat = {orders:true};
		$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'justEat',$scope.justEat);
	}
	
	//Default buttons
	if (!angular.isArray($localstorage.getArray(AIV_CONSTANTS.LS_PREFIX+'defaultBtns'))) {
		$scope.defaultBtns = $localstorage.getObject(AIV_CONSTANTS.LS_PREFIX+'defaultBtns');
		if(angular.isUndefined($scope.defaultBtns.show_takeaway_options)){
			$scope.defaultBtns.show_takeaway_options = true;
		}
		if(angular.isUndefined($scope.defaultBtns.clear_cloud_orders)){
			$scope.defaultBtns.clear_cloud_orders = false;
		}
	}else {
		$scope.defaultBtns = {default_print_enable_btn:false,show_takeaway_options:true,clear_cloud_orders:false};
		$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'defaultBtns',$scope.defaultBtns);
	}
	
	//Get common print settings
	if (!angular.isArray($localstorage.getArray(AIV_CONSTANTS.LS_PREFIX+'commonPrintSettings'))) {
		$scope.commonPrintSettings = $localstorage.getObject(AIV_CONSTANTS.LS_PREFIX+'commonPrintSettings');
	}else {
		$scope.commonPrintSettings = {'kot_receipt':false};
		$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'commonPrintSettings',$scope.commonPrintSettings);
	}
	
	$scope.OnlineOrders = function(action){
		$scope.onlineOrder.enable = action;
		$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'onlineOrder',$scope.onlineOrder);
		
		if($scope.onlineOrder.enable){
			moreOnlineOrders(true);
		}else{
			$scope.alertArr = [];
		}
	}
	
	//Collection and Delivery receipts
	if (!angular.isArray($localstorage.getArray(AIV_CONSTANTS.LS_PREFIX+'receiptCount'))) {
		$scope.receiptCount = $localstorage.getObject(AIV_CONSTANTS.LS_PREFIX+'receiptCount');
		if(angular.isUndefined($scope.receiptCount.card)){
			$scope.receiptCount.card = 0;
		}
	}else {
		$scope.receiptCount = {
			"collection":1,
			"delivery":1,
			"kot":1,
			"inshop":1,
			"card":0,
			"sitin":1
		};
		$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'receiptCount',$scope.receiptCount);
	}
	
	//Department KOT receipts
	if (!angular.isArray($localstorage.getArray(AIV_CONSTANTS.LS_PREFIX+'dept_receiptCount'))) {
		$scope.dept_receiptCount = JSON.parse($localstorage.getObject(AIV_CONSTANTS.LS_PREFIX+'dept_receiptCount'));
	}else {
		$scope.dept_receiptCount = [];
		$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'dept_receiptCount',JSON.stringify($scope.dept_receiptCount));
	}
	
	//Bag charges
	if (!angular.isArray($localstorage.getArray(AIV_CONSTANTS.LS_PREFIX+'bagCharges'))) {
		$scope.bagCharges = $localstorage.getObject(AIV_CONSTANTS.LS_PREFIX+'bagCharges');
		$scope.bagCharges.selected = 0;
		if(angular.isUndefined($scope.bagCharges.default)){
			$scope.bagCharges.default = 0;
		}
	}else {
		$scope.bagCharges = {
			"charges":[],
			"currency":"",
			"doc_type":"",
			"selected":0,
			"default":0
		};
		$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'bagCharges',$scope.bagCharges);
	}
	
	//Order history settings
	if (!angular.isArray($localstorage.getArray(AIV_CONSTANTS.LS_PREFIX+'orderlistSettings'))) {
		$scope.orderlistSettings = $localstorage.getObject(AIV_CONSTANTS.LS_PREFIX+'orderlistSettings');
	}else {
		$scope.orderlistSettings = {
			'view_all':false
		};
		$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'orderlistSettings',$scope.orderlistSettings);
	}
	
	//Setting to show login screen after action
	if (!angular.isArray($localstorage.getArray(AIV_CONSTANTS.LS_PREFIX+'enableLoginScreen'))) {
		$scope.enableLoginScreen = $localstorage.getObject(AIV_CONSTANTS.LS_PREFIX+'enableLoginScreen');
	}else {
		$scope.enableLoginScreen = {
			'show':true
		};
		$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'enableLoginScreen',$scope.enableLoginScreen);
	}
	
	//Other Settings
	if (!angular.isArray($localstorage.getArray(AIV_CONSTANTS.LS_PREFIX+'otherSettings'))) {
		$scope.otherSettings = $localstorage.getObject(AIV_CONSTANTS.LS_PREFIX+'otherSettings');
	}else {
		$scope.otherSettings = {
			'show_product_instructions':false
		};
		$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'otherSettings',$scope.otherSettings);
	}
	
	$scope.user_register = [];
	
	$scope.defaultDuration = {
		collection:25,
		delivery:40
	}
		
	$scope.SMSTemplates = [];
	$scope.delivery_drivers = {drivers:[],selected:''};
	$scope.user_discounts = [];
	$scope.product_deals = [];
	$scope.print_terminals = [];
	$scope.user_terminals = [];
	$scope.deal_category = '';
	
	$scope.backTemplateOptions = [
		{id:'FPOS',name:'POS + Online orders'},
		{id:'MPOS',name:'Online orders only'}
	];
	if (!angular.isArray($localstorage.getArray(AIV_CONSTANTS.LS_PREFIX+'backTemplate'))) {
		$scope.backTemplate = $localstorage.getObject(AIV_CONSTANTS.LS_PREFIX+'backTemplate');
	}else {
		$scope.backTemplate = $scope.backTemplateOptions[0];
		$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'backTemplate',$scope.backTemplate);
	}
	
	$scope.aiv_menu = {
		expose : "(min-width:700px)",
		show_layout:false
	};
	
	if($scope.terminalData.type == 'KITCHEN'){
		$scope.aiv_menu.expose = "(min-width:10000px)";
		$ionicSideMenuDelegate.canDragContent(false);
		$scope.aiv_menu.drag = false;
	}else if($scope.terminalData.type == 'BACK' && $scope.backTemplate.id=='MPOS'){
		$scope.orderlistSettings.view_all = false;
		$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'orderlistSettings',$scope.orderlistSettings);
	}
		
	$scope.layout_inputs = {
		barcode:'',
		qty:''
	}
	
	$scope.qwerty_inputs = {
		pass:'',
		clock_pass:''
	}
	
	$scope.order_view = {view:'ORDERS'};
	$scope.callerid_status = { 'online':false,'title':'Disconnected','class':'assertive-imp','response':0};
	$scope.fid_status = { 'online':false,'title':'Disconnected','class':'assertive-imp','response':0};
	$scope.search_inputs = {'phone':'','customer':''};
	$scope.aiv_table = {number:'',seats:'',shape:'',status:'empty',cover:'',server:'',table_loc:'',activity:[],orders:[],lock:false};
	$scope.table_shape =['--select options--','circle','square'];
	$scope.current_options = {};
	$scope.current_display_options = {};
	$scope.display_options_tooptions={};
	$scope.cook_instructions = {};
	$scope.all_users = [];
	$scope.master_pass = '';
	$scope.sel_category = '';
	$scope.selected_customer = '';
	$scope.selected_shipping = {};
	$scope.temp_shipping = {};
	$scope.delivery_areas = {areas:[],show:false,value:'',selected:''};
	$scope.startup = {action:null};
	if($scope.terminalData.type == 'FRONT' || $scope.startup.action=='TABLEVIEW'){
		$scope.selected_shipping = {'id':'','title':'Takeaway','method_title':'','method_description':'','fee':''};
	}
	clear_payment();
	
	if (!angular.isArray($localstorage.getArray(AIV_CONSTANTS.LS_PREFIX+'split_payment'))) {
		$scope.split_payment = $localstorage.getObject(AIV_CONSTANTS.LS_PREFIX+'split_payment');
	}else {
		$scope.split_payment = {'paid':0,'to_pay':0,'total':0};
		$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'split_payment',$scope.split_payment);
	}
	
	$scope.print_config = {copies:1,cashdrawer:false,kot:true,label_needed:false,receipt:true};
	//Get KOT settings
	if (!angular.isArray($localstorage.getArray(AIV_CONSTANTS.LS_PREFIX+'configKOT'))) {
		$scope.print_config.kot = $localstorage.getObject(AIV_CONSTANTS.LS_PREFIX+'configKOT');
	}

	//Get CashDrawer settings
	if (!angular.isArray($localstorage.getArray(AIV_CONSTANTS.LS_PREFIX+'configCDR'))) {
		$scope.print_config.cashdrawer = $localstorage.getObject(AIV_CONSTANTS.LS_PREFIX+'configCDR');
	}
	
	$scope.aiv_certs = {};
	$scope.aiv_tables = [];
	$scope.tax_classes = [];
	$scope.categories = [];
	$scope.sel_variations = {};
	$scope.payment_fee = 0;
	$scope.credit_periods = [
		"7 days",
		"15 days",
		"30 days",
		"60 days",
		"90 days",
		"120 days"
	];
	
	$scope.report_filters = {
		"customer":'',
		"show_price":true,
		"category":'',
		"pos":'',
		"z_amount":''
	}
	
	$scope.errors = {
		"update_category":'',
		"update_product":'',
		"update_stock":'',
		"edit_cart_product":'',
		"show_report":'',
		"bill_postcode":'',
		"ship_postcode":'',
		"customer_edit":'',
		"sms":'',
		"void_reason":''
	}
	
	$scope.success_done = {
		"edit_cashflow":'',
		"coupon_applied":'',
		"sms":''
	}
	
	$scope.aiv_toggles = {
		'assign_price':false,
		'assigned_price':0,
		'assign_changed':false,
		'show_cash':true,
		'default_print_enable_btn':true,
		'early_takeaway':false,
		'show_customer_extra':false,
		'set_unpaid':false,
		'user_view':false
	}
	$scope.allProducts = {};
	$scope.fid_users = {selected:false,user:null};
	
	$scope.fiduser=function(user)
	{
		$scope.fid_users.user = user;
	}
	
	$scope.registerUser=function(user){
		var str = "X04"+user.user.user_id;
		for(var p=str.length;p<20;p++){
			str+= "0";
		}
		$scope.sendCommData(str);
	}
	
	
	$scope.cancelRegistration=function(id){
		var str = "X05";
		for(var p=str.length;p<20;p++){
			str+= "0";
		}
		$scope.sendCommData(str);
		$ionicLoading.hide();
		return true;
	}
	
	if (!angular.isArray($localstorage.getArray(AIV_CONSTANTS.LS_PREFIX+'order_no'))) {
		$scope.dailyOrderNo = $localstorage.getObject(AIV_CONSTANTS.LS_PREFIX+'order_no');
		if(angular.isUndefined($scope.dailyOrderNo.common)){
			$scope.dailyOrderNo.common = false;
		}
	}else {
		$scope.dailyOrderNo = {
			'num':1,
			'date':yyyymmdd(new Date()),
			'prefix':'',
			'start':1,
			'common':false
		};
		$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'order_no',$scope.dailyOrderNo);
	}
	
	if (!angular.isArray($localstorage.getArray(AIV_CONSTANTS.LS_PREFIX+'HFLoyaltySettings'))) {
		$scope.hf_loyalty = $localstorage.getObject(AIV_CONSTANTS.LS_PREFIX+'HFLoyaltySettings');
		if(angular.isUndefined($scope.hf_loyalty.signup_points)){
			$scope.hf_loyalty.signup_points = "0";
		}
	}else {
		$scope.hf_loyalty = {
		   "enabled": false,
		   "sales": {
			   "amount": "1",
			   "points": "1"
		   },
		   "rewards": {
			   "points": "100",
			   "amount": "1"
		   },
		   "feedback_points":"1",
		   "signup_points":"0"
		}
		$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'HFLoyaltySettings',$scope.hf_loyalty);
	}
	
	var zero_time = new Date("2018-08-18T00:00:00Z");
	var pickerOffset = zero_time.getTimezoneOffset();
    var utcDate = new Date();
    utcDate.setTime(zero_time.getTime() + pickerOffset * 60000);
	
	if (!angular.isArray($localstorage.getArray(AIV_CONSTANTS.LS_PREFIX+'POSSettings'))) {
		$scope.POSSettings = $localstorage.getObject(AIV_CONSTANTS.LS_PREFIX+'POSSettings');
		if(angular.isUndefined($scope.POSSettings.early_takeaway)){
			$scope.POSSettings.early_takeaway = {
				"start" : utcDate,
				"end" : utcDate
			}
		}else{
			$scope.POSSettings.early_takeaway.start = new Date($scope.POSSettings.early_takeaway.start);
			$scope.POSSettings.early_takeaway.end = new Date($scope.POSSettings.early_takeaway.end);
		}
		
		if(angular.isUndefined($scope.POSSettings.online_default_accept)){
		
		$scope.POSSettings.online_default_accept=false;
		}
	}else {
		$scope.POSSettings = {
		   "enable_sitin": false,
		   "show_delcharge_report":true,
		   "early_takeaway" :{
				"start" : utcDate,
				"end" : utcDate
			},
			"master_terminal":'',
			"online_default_accept":false,
			"print_server":''
		}
		$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'POSSettings',$scope.POSSettings);
	}
	
	if (!angular.isArray($localstorage.getArray(AIV_CONSTANTS.LS_PREFIX+'GenSettings'))) {
		$scope.gen_settings = $localstorage.getObject(AIV_CONSTANTS.LS_PREFIX+'GenSettings');
	}else {
		$scope.gen_settings = {
			last_compaction : new Date(yyyymmdd(new Date())+' 00:00:01')
		};
		$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'GenSettings',$scope.gen_settings);
	}

	var date_st = yyyymmdd(new Date())+' 00:00:01';
	var date_end = yyyymmdd(new Date())+' 23:59:59';
	$scope.oh_from_date = $scope.cashflow_from_date = $scope.outofstock_from_date = new Date(date_st);
	$scope.oh_to_date = $scope.outofstock_to_date = new Date(date_end);
	$scope.xr_from_date = new Date(yyyymmdd(new Date())+' '+$rootScope.aiv_info.day_ends_at);
	
	var ipObj1 = {
      callback: function (val) {  //Mandatory
		switch($scope.date_clicked){
			case 'OH_FROM'		: val = yyyymmdd(new Date(val))+' 00:00:01';
								  $scope.oh_from_date = new Date(val);
								  break;
			case 'OH_TO'		: val = yyyymmdd(new Date(val))+' 23:59:59';
								  $scope.oh_to_date = new Date(val);
								  break;	
			case 'EXPENSE_DATE' : $scope.update_expense.date = new Date(val);
								  break;	
			case 'CASHFLOW_FROM': $scope.cashflow_from_date = new Date(val);
								  break;
			case 'OUTOFSTOCK_FROM': val = yyyymmdd(new Date(val))+' 00:00:01';
									$scope.outofstock_from_date = new Date(val);
									break;
			case 'OUTOFSTOCK_TO': val = yyyymmdd(new Date(val))+' 23:59:59';
								  $scope.outofstock_to_date = new Date(val);
								  break;
			case 'AD_FROM'		: val = yyyymmdd(new Date(val))+' 00:00:01';
								  $scope.ad_from_date = new Date(val);
								  break;
			case 'AD_TO'		: val = yyyymmdd(new Date(val))+' 23:59:59';
								  $scope.ad_to_date = new Date(val);
								  break;
			case 'CSR_FROM'		: val = yyyymmdd(new Date(val))+' 00:00:01';
								  $scope.csr_from_date = new Date(val);
								  break;
			case 'CSR_TO'		: val = yyyymmdd(new Date(val))+' 23:59:59';
								  $scope.csr_to_date = new Date(val);
								  break;
			case 'PSR_FROM'		: val = yyyymmdd(new Date(val))+' 00:00:01';
								  $scope.psr_from_date = new Date(val);
								  break;
			case 'PSR_TO'		: val = yyyymmdd(new Date(val))+' 23:59:59';
								  $scope.psr_to_date = new Date(val);
								  break;
			case 'CS_FROM'		: val = yyyymmdd(new Date(val))+' 00:00:01';
								  $scope.cs_from_date = new Date(val);
								  break;
			case 'CS_TO'		: val = yyyymmdd(new Date(val))+' 23:59:59';
								  $scope.cs_to_date = new Date(val);
								  break;
			case 'DS_FROM'		: val = yyyymmdd(new Date(val))+' 00:00:01';
								  $scope.ds_from_date = new Date(val);
								  break;
			case 'DS_TO'		: val = yyyymmdd(new Date(val))+' 23:59:59';
								  $scope.ds_to_date = new Date(val);
								  break;
			case 'OI_FROM'		: val = yyyymmdd(new Date(val))+' 00:00:01';
								  $scope.oi_from_date = new Date(val);
								  break;
			case 'OI_TO'		: val = yyyymmdd(new Date(val))+' 23:59:59';
								  $scope.oi_to_date = new Date(val);
								  break;
			case 'CPL_FROM'		: val = yyyymmdd(new Date(val))+' 00:00:01';
								  $scope.cpl_from_date = new Date(val);
								  break;
			case 'CPL_TO'		: val = yyyymmdd(new Date(val))+' 23:59:59';
								  $scope.cpl_to_date = new Date(val);
								  break;
			case 'PAR_FROM'		: val = yyyymmdd(new Date(val))+' 00:00:01';
								  $scope.par_from_date = new Date(val);
								  break;
			case 'PAR_TO'		: val = yyyymmdd(new Date(val))+' 23:59:59';
								  $scope.par_to_date = new Date(val);
								  break;
			case 'STOCK_EXP'	: val = yyyymmdd(new Date(val))+' 23:59:59';
								  $scope.product_stock.exp_date = new Date(val);
								  break;
			case 'XR_FROM'		: val = yyyymmdd(new Date(val))+' '+$rootScope.aiv_info.day_ends_at;
								  $scope.xr_from_date = new Date(val);
								  $scope.getSalesReport('X',false);
								  break;
			case 'ZR_FROM'		: val = yyyymmdd(new Date(val))+' '+$rootScope.aiv_info.day_ends_at;
								  $scope.zr_from_date = new Date(val);
								  $scope.getSalesReport('Z',false);
								  break;
			case 'SALES'		: val = yyyymmdd(new Date(val))+' 00:00:01';
								  $scope.sales_from_date = new Date(val);
								  break;
			case 'VOIDR_FROM'	: val = yyyymmdd(new Date(val))+' 03:00:00';
								  $scope.voidr_from_date = new Date(val);
								  $scope.getSalesReport('VOID',false);
								  break;
		}
      }
	}
	$scope.openDatePicker  = function(type,date){
		$scope.date_clicked = type;
		ipObj1.inputDate = date;
		ionicDatePicker.openDatePicker(ipObj1);
	}
	
	var getTimePickerTime = function(date){
		return ((date.getHours() * 60 * 60) + (date.getMinutes() * 60));
	}
	
	var timeObj = {
      callback: function (val) {  //Mandatory
		if (typeof (val) !== 'undefined') {
			var hours = Math.floor(val / 60 / 60),
				minutes = val / 60 % 60;
			switch($scope.time_clicked){
				case 'ET_FROM'		: $scope.settings_data.pos_settings.early_takeaway.start.setHours(hours, minutes);
									  break;
				case 'ET_TO'		: $scope.settings_data.pos_settings.early_takeaway.end.setHours(hours, minutes);
									  break;	
			}
		}
      }
	}
	
	$scope.openTimePicker  = function(type,time){
		$scope.time_clicked = type;
		timeObj.inputTime = getTimePickerTime(time);
		ionicTimePicker.openTimePicker(timeObj);
		}
	$scope.range = function(min, max, step) {
	    step = step || 1;
	    var input = [];
	    for (var i = min; i <= max; i += step) {
	        input.push(i);
	    }
	    return input;
    };
	$scope.init_success = false;
	$scope.kitchen_init_success = false;
	$scope.initial_loading = 0;
	$scope.pos_connection_status = { 'online_orders':true,'couch_connection':true,'couch_replication':true,'internet_connection':true, 'message': "Clear to receive online orders"};
	$scope.pos_status = { 'online':false,'title':'offline','class':'assertive blink','icon':'ion-more'};
	Offline.options = {
		checks: {
		  xhr: {
			url: function() {
			  return AIV_CONSTANTS.CORS_URL+"?_=" + (Math.floor(Math.random() * 1000000000));
			},
			timeout: 5000
		  },
		  active: 'xhr'
		},
		checkOnLoad: true,
		interceptRequests: true,
		reconnect: true,
		requests: false
	};

	Offline.on('confirmed-down', function () {
		console.log("offline");
		$scope.pos_status = { 'online':false,'title':'offline','class':'assertive blink','icon':'ion-more'};
		$scope.pos_connection_status.internet_connection=false;
		$scope.$digest();

		if(!$scope.initial_loading && !$scope.init_success){
			$ionicLoading.show({
				template : '<h2>Please check your internet connection and restart</h2>',
			});
		}
	});

	Offline.on('confirmed-up', function () {
		console.log("online");   
		$scope.pos_connection_status.internet_connection=true;
		$scope.pos_status = { 'online':true,'title':'online','class':'balanced','icon':'ion-more'};
		$scope.$digest();
	});

/* 	$(window).load(function() {
		//Offline.check();
		console.log("periodic check");   
		$scope.checkPeriodic(true)
	}); */
	
	$scope.onceStarted =false;
	$scope.displayTime = "";
	$scope.checkPeriodic = function(start=false){
		var time_repeat = 30000;
		
	
		if(start)
		{
			if($scope.onceStarted ==false)
			{
				
				$scope.periodicProceedure();
				$timeout(function(){
					$scope.checkPeriodic(false)
				},time_repeat);
				$scope.onceStarted =true;
				
			}
		}
		else
		{
			$scope.periodicProceedure();
			$timeout(function(){
					$scope.checkPeriodic(false)
			},time_repeat);
		}
	
	   
		
	}
	
	$scope.periodicProceedure=function(){
		Offline.check();
		 //update time information on the display
		 var d = new Date();
		 var minutes =d.getMinutes();
		 $scope.displayTime =  d.getHours()+":"+((minutes < 10) ? "0" + minutes : minutes);
		// $scope.checkCouchServerReplication();
		$scope.checkServerStatus();
		
		//check for couchdb connection 
		
		//check for replication status to server.
	}
	//function check server connection is avaliable -04-20-19
	$scope.checkServerStatus =function(){
		if($scope.heartBeat.newBeat ==	$scope.heartBeat.oldBeat ){
			$scope.replication_status ={'title':'replication','status':'false','class':'assertive blink','icon':'ion-more'}; 
			$scope.onlineOrder_1 = {enable:false};
			if($scope.pos_status.online){
				$scope.startReplication('LOCAL');
				$scope.startReplication('REMOTE');
			}
			//$scope.offline_audio.play();

		}else if($scope.heartBeat.newBeat != $scope.heartBeat.oldBeat ){
			$scope.replication_status ={'title':'replication','status':'true','class':'balanced','icon':'ion-more'};
			if($scope.pos_status.online){
				$scope.onlineOrder_1 = {enable:true};
			}else{
				$scope.onlineOrder_1 = {enable:false}; 
			}
			//$scope.offline_audio.loop =false;
		}
		var date =new Date().getTime();
		if($scope.pos_status.online){
			/*$pouchDB.upsert('getServerStatus',function(doc){
					doc.data = date;
					$scope.localReplication = date;
						console.log(doc);
					return doc;
			}).catch(function(error){
				console.error(error);
			});*/
		}
		$scope.heartBeat.oldBeat =	$scope.heartBeat.newBeat; 
	}


	//$scope.offline_audio = new Audio('audio/offline.mp3');
	//$scope.offline_audio.loop = true;
	$scope.onlineOrder_1 = {enable:false};
	$scope.checkCouchServerReplication=function(){
		if(!AIV_CONSTANTS.REMOTE_DBURL.includes($scope.localdb_ip)){
			var CouchDBUrl= createDBUrl("localhost","_active_tasks");
			$scope.httpRequest = dataService.getReplicationStatus(CouchDBUrl);
				$scope.httpRequest.then(function(returnData) {
				if(returnData == true){
					console.log("replication avliable");
					$scope.replication_status ={'title':'replication','status':'true','class':'balanced','icon':'ion-more'};
					 if($scope.pos_status.online){
						$scope.onlineOrder_1 = {enable:true};
					}else{ 
						$scope.onlineOrder_1 = {enable:false}; 
						}
					//$scope.offline_audio.loop =false;
				}else{
					console.log("replication not avilable");
					$scope.replication_status ={'title':'replication','status':'false','class':'assertive blink','icon':'ion-more'};
					$scope.onlineOrder_1 = {enable:false};
					console.log(returnData);
					$scope.startReplication('LOCAL');
					$scope.startReplication('REMOTE');
					//$scope.offline_audio.play();
				}	
				}).catch(function(err){
					$scope.replication_status ={'title':'replication','status':'false','class':'assertive blink','icon':'ion-more'};
					$scope.onlineOrder_1 = {enable:false};
					$scope.startReplication('LOCAL');
					$scope.startReplication('REMOTE');
					//$scope.offline_audio.play();
				});
		
		}
	}
	$scope.startReplication =function(source){
		var CouchDBUrl= createDBUrl("localhost","_replicate");
		var source =source;
		$scope.httpRequest = dataService.startReplication(CouchDBUrl,source,'localhost');
		$scope.httpRequest.then(function(returnData) {
		console.log(returnData);
		});
	}
	  $timeout(function(){$scope.checkPeriodic(true)}, 3000);
	$scope.limitedDogPatting =function(delay){
		if($scope.offlineWatchDogCount>0){
			$timeout(function(){
				$scope.offlineWatchDogPat(delay);
			}, delay*2.5);
			$scope.offlineWatchDogCount--;
		}
	}
	$scope.offlineWatchDogPat =function(delay){
		if($scope.offlineWatchDog==true){
			console.log("We are still offline, dog is up....");
			$scope.offlineWatchDog = false;
			$scope.offlineWatchDogCount = 5;
		}else{
				console.log("Yes we are online, dog is silent....");
				$scope.pouch_replication_status ={'title':'pouch_replication','status':'true','class':'balanced','icon':'ion-more'};
				$scope.offlineWatchDogCount=0;
				$scope.offlineWatchDogStart = false;
		}
		$scope.limitedDogPatting(delay)
	}
	$scope.startDogPatting=function(delay){
		if($scope.offlineWatchDogStart==false){
			$scope.offlineWatchDogStart = true;
			$scope.offlineWatchDogCount = 5;
			$timeout(function() {
			$scope.offlineWatchDogPat(delay);
			}, delay*2.5);
		}
	}
	$scope.$on('aiv.pos_initialized', function(e) {		
		if($scope.aiv_certs.print != undefined){
			console.log("certificate");
			qz.security.setCertificatePromise(function(resolve, reject) {
				resolve($scope.aiv_certs.print);
			});
			$scope.startConnection();
		}
		
		if($scope.local_ip && $scope.init_success && !$scope.kitchen_init_success && $rootScope.aiv_info.enable_kitchen=="TRUE"){
			options = {
				live: true,
				retry: true,
			}
			$pouchDBEtc.setDatabase(AIV_CONSTANTS.SECOND_DB);
			$pouchDBEtc.sync($scope.secondDBUrl,options);
			$pouchDBEtc.startListening();
			
			$ionicLoading.show({
				template: '<ion-spinner icon="ios"></ion-spinner><br><span class="aiv-loading">Almost there...<br>Retrieving kitchen orders</span>',
				animation: 'fade-in',
				showBackdrop: true,
				maxWidth: 300,
				showDelay: 0
			});
					
			var config = {
				include_docs: true,
			}
			$pouchDBEtc.bulkFetch(config).then(function(returnData){
				angular.forEach(returnData.rows,function(data){
					getDBEtcChanges(data.doc,false);
				});
				$ionicLoading.hide();				
			}).catch(function(error){
				console.error(error);
				$ionicLoading.hide();
				$ionicLoading.show({
					template : '<h2>Failed to retrieve kitchen orders...</h2>',
					duration : 1300
				});
			})
			
			$rootScope.$on("$pouchDBEtc:change", function(event, data) {
				getDBEtcChanges(data.doc,true);
			});
			$rootScope.$on("$pouchDBEtc:delete", function(event, data) {
				onDBEtcRemoved(data.doc);
			});
			$scope.kitchen_init_success = true;
		}
					
		if($scope.categories.length && ($scope.terminalData.type != 'BACK' || ($scope.terminalData.type == 'BACK' && $scope.backTemplate.id != 'MPOS'))){
			$ionicLoading.show({
				template: '<ion-spinner icon="ios"></ion-spinner><br><span class="aiv-loading">Almost there...<br>Fetching products</span>',
				animation: 'fade-in',
				showBackdrop: true,
				maxWidth: 300,
				showDelay: 0
			});
			
			var options = {
				live: true,
				retry: true,
				continuous: true,
				conflicts: true,
				back_off_function: function (delay) {
					console.log("retrying for connection...");
					$scope.offlineWatchDog = true;
					//$scope.startDogPatting();
					$scope.pouch_replication_status ={'title':'pouch_replication','status':'false','class':'assertive blink','icon':'ion-more'};
					$scope.onlineOrder_1 = {enable:false};
					if (delay === 0) {
					$scope.startDogPatting(5000);
						return 5000;
					}
					if(delay >5000)
						delay = 5000;
					else
					{
						delay = delay * 1;
					}
					$scope.startDogPatting(5000);
					console.log(delay);
					return delay;
				}
			};
			$pouchDB.sync($scope.couchDBUrl,options);
				$scope.pouch_replication_status ={'title':'pouch_replication','status':'true','class':'balanced','icon':'ion-more'};
			if($scope.offlineWatchDog ==false)
			Promise.all($scope.categories.map(function (row) {
				return $pouchDB.get(row.slug);
			})).then(function (result) {
				if(result.length){
					for(var p=0;p<result.length;p++){
						if(result[p].products){
								for(var j=0;j<result[p].products.length;j++){
									var info = result[p].products[j];
									if(info.meta && info.meta.wc_productdata_options && info.meta.wc_productdata_options[0] && info.meta.wc_productdata_options[0].group){
										if(info.meta.wc_productdata_options[0].group == "suboption"){
											result[p].products.splice(j,1);
											j--;
											}
									}
								}
							}
						$scope.allProducts[result[p]._id] = result[p].products;
					}
				
					loadDefaultProduct();
				}
				$pouchDB.query('productsindex','pizza');
				$ionicLoading.hide();
				$scope.openUserModal(false);
				//testOrders();
			}).catch(function (error) {
				console.log(error);
				$ionicLoading.hide();
				$scope.openUserModal(false);
			});
		
			
		}else{
			options = {
				live: true,
				retry: true,
				continuous: true,
				conflicts: true,
				back_off_function: function (delay) {
					console.log("retrying for connection...");
					$scope.offlineWatchDog = true;
					//$scope.startDogPatting();
					$scope.pouch_replication_status ={'title':'pouch_replication','status':'false','class':'assertive blink','icon':'ion-more'};
					if (delay === 0) {
					$scope.startDogPatting(5000);
						return 5000;
					}
					if(delay >5000)
						delay = 5000;
					else
					{
						delay = delay * 1;
					}
					$scope.startDogPatting(5000);
					console.log(delay);
					return delay;
				}
			}
			$pouchDB.sync($scope.couchDBUrl,options);
			if($scope.offlineWatchDog ==false)
				$scope.pouch_replication_status ={'title':'pouch_replication','status':'true','class':'balanced','icon':'ion-more'};
			$ionicLoading.hide();
			$scope.openUserModal(false);
		}
		//getAllCustomers();
		cacheInitialData();
		$pouchDB.startListening();
		//delete_conflicts('getPaymentMethods');
	});
	
	var delete_conflicts = function(doc_id){
		$pouchDB.get(doc_id,{conflicts:true}).then(function(doc){
			console.log(doc);
			if(angular.isDefined(doc._conflicts) && doc._conflicts.length){
				return $pouchDB.delete(doc_id,doc._conflicts[0]);
			}
			//return $pouchDB.delete(doc_id,doc._rev);
		}).then(function(res){
			if(res != undefined)
			delete_conflicts(doc_id);
		}).catch(function(error){
			console.error(error);
		});
	}
		
	$scope.shop_nots = {
		"shop_open" : "",
		"shop_close" : "",
		"delivery_start" : "",
		"delivery_stop" : "",
		"nots" : ""
	};
	
	$scope.UKGovPostcodeRegex = /^(GIR 0AA)|(GIR0AA)|(gir 0aa)|(gir0aa)|(([a-zA-Z]){1}([0-9][0-9]|[0-9]|[a-zA-Z][0-9][a-zA-Z]|[a-zA-Z][0-9][0-9]|[a-zA-Z][0-9]){1}(\s?)([0-9][a-zA-z][a-zA-z]){1})$/;
	$rootScope.platform = (ionic.Platform.isIPad() || ionic.Platform.isIOS())?'ios':(ionic.Platform.isAndroid()?'android':'others');
	var deviceInfo = ionic.Platform.device();
	$scope.aiv_id = '';
	if(deviceInfo.hasOwnProperty('uuid')){
		$scope.aiv_id = deviceInfo.uuid;
	}else{
		var d = new Date().getTime();
		$scope.aiv_id = ionic.Platform.platform()+'_'+ionic.Platform.version()+'_'+AIV_CONSTANTS.APP_VER+'_'+d;
	}
	$rootScope.aiv_id = $scope.aiv_id;
	
	
	$scope.processProducts = function()
	{
		angular.forEach($scope.products, function(item) {
			if(item.meta && item.meta.wc_productdata_options[0].hasOwnProperty('prdt_configs'))
			{
				var splits = item.meta.wc_productdata_options[0].prdt_configs.split(AIV_CONSTANTS.OPTION_SEPARATOR);
				item['color']=$scope.getColor(splits[0]);
					if(splits.length>1)
					{
						if(splits[1].charAt(0)=='L')
						{
							item['freelimit']=parseInt(splits[1].substring(1));//this item will have free suboptions till the limit number
						}
					}
				
			}
			else
			{
			item['color']=$scope.getColor('');
			}
		});
	}
	
	$scope.exitSub= function(manual_click)
	{
		if(manual_click && $scope.compulsory_option_mode){
			return;
		}
		$scope.optionClick = {name:'',count:0};
		$scope.compulsory_option_mode = false;
		$scope.product_show=true;
	}
	$scope.nextSub= function(enabled){
		
		if(enabled)
		{
		var itemdetails = {};//{"parent":"Prefix###PH","raw":"No###TO"};
				
		var item = "Next###TO";
		
		itemdetails["title"]= item.split(AIV_CONSTANTS.OPTION_SEPARATOR)[0];
		itemdetails["stitle"]= $scope.getShowName(itemdetails.title);
		itemdetails["color"]= $scope.getColor(item.split(AIV_CONSTANTS.OPTION_SEPARATOR)[1]);
		itemdetails["type"]= "PRE";
		itemdetails["raw"]="Next###TO";
		itemdetails["parent"]="Action###PH";
		$scope.onClickOthers(itemdetails);
		}
	}
	
	$scope.prevSub= function(enabled){
		
		if(enabled)
		{
		var itemdetails = {};//{"parent":"Prefix###PH","raw":"No###TO"};
				
		var item = "Back###TO";
		
		itemdetails["title"]= item.split(AIV_CONSTANTS.OPTION_SEPARATOR)[0];
		itemdetails["stitle"]= $scope.getShowName(itemdetails.title);
		itemdetails["color"]= $scope.getColor(item.split(AIV_CONSTANTS.OPTION_SEPARATOR)[1]);
		itemdetails["type"]= "PRE";
		itemdetails["raw"]="Back###TO";
		itemdetails["parent"]="Action###PH";
		
		$scope.onClickOthers(itemdetails);
		}
		
		
		
	}
	
	var filter_products = function(type,cat_products){
		if(!cat_products)return;
		var products = angular.copy(cat_products);
		if((angular.isDefined($scope.selected_shipping.id) && $scope.selected_shipping.id == "sitin") || type == "TABLEVIEW"){
			for(var i=0;i<products.length;i++){
				if(products[i].tags.indexOf('sitin') < 0){
					products.splice(i,1);
					i--;
				}
			}
		}else if($scope.aiv_toggles.early_takeaway){
			for(var i=0;i<products.length;i++){
				if(products[i].tags.indexOf('etakeaway') < 0){
					products.splice(i,1);
					i--;
				}
			}
		}else{
			for(var i=0;i<products.length;i++){
				if(products[i].tags.indexOf('etakeaway') > -1 || products[i].tags.indexOf('sitin') > -1){
					products.splice(i,1);
					i--;
				}
			}
		}
		
		return products;
	}

	$scope.sub_categories = {selected:'',items:[],show_as_product:false,subcategory_mode:false};
	$scope.getProducts = function(cat,navigate,event){
		if($scope.edit_mode && $scope.sync_pending){
			$scope.showCheckoutMsg('Warning','Please Upload/Cancel changes...');
			return;
		}else if($scope.compulsory_option_mode || (cat.slug==$scope.deal_category&&!$scope.deal_status.show_msg)){
			return;
		}
		$scope.optionClick = {name:'',count:0};
		$scope.sel_product = '';
		$scope.show_sub.cook_inst = false;
		$scope.product_search = false;
		$scope.product_edited = [];
		$scope.product_removed = [];
		$scope.otheroptions=[];
		var	arraytofill=$scope.otheroptions;
		
		if(!cat.parent){
			$scope.sel_category = cat.slug;
			$scope.sub_categories = {selected:'',items:[],show_as_product:false,subcategory_mode:false};
		}
		
		if(cat.children.length>0)
		{
			$scope.sub_categories.items = cat.children;
			$scope.sub_categories.show_as_product = angular.isDefined(cat.show_as_product)?cat.show_as_product:false;
			var prdt_loaded = false;
			angular.forEach(cat.children, function(item) {
						var itemdetails = {}; 
						itemdetails["title"]= item.name;
						itemdetails["stitle"]= item.name;
						itemdetails["color"]= $scope.getColor("G");
						itemdetails["type"]= "CAT";
						itemdetails["raw"]=item.name;
						itemdetails["parent"]=item;
						arraytofill.push(itemdetails);
						
						if(!prdt_loaded){
							$scope.products = filter_products($scope.startup.action,$scope.allProducts[item.slug]);
							$scope.processProducts();
							prdt_loaded = true;
							$scope.sub_categories.selected = item.slug;
						}
						arraytofill.push(itemdetails);
						
						if(!prdt_loaded){
							$scope.products = filter_products($scope.startup.action,$scope.allProducts[item.slug]);
							$scope.processProducts();
							prdt_loaded = true;
							$scope.sub_categories.selected = item.slug;
					}
			});

			if($scope.sub_categories.show_as_product){
				$scope.product_show = false;
			}else{
				$scope.product_show = true;
			}
			$scope.sub_categories.subcategory_mode = true;
		}else{
			$scope.products = filter_products($scope.startup.action,$scope.allProducts[cat.slug]);
			$scope.processProducts();
			$ionicScrollDelegate.$getByHandle('productScroll').scrollTop();
			if(navigate){
				$ionicSideMenuDelegate.toggleRight();
			}
			$scope.product_show=true;
			$scope.sub_categories.subcategory_mode = false;
		}
	}
	
	$scope.showCheckoutMsg = function(tit_txt,msg) {
	   var alertPopup = $ionicPopup.alert({
		 title: tit_txt,
		 template: msg
	   });
	};	
		
	$scope.alertArr = [];
	$scope.readyArr = [];
	$scope.tableArr = [];
	$scope.PaymentMethods = $localstorage.getArray(AIV_CONSTANTS.LS_PREFIX+'PaymentMethods');
	$scope.ShippingMethods = $localstorage.getObject(AIV_CONSTANTS.LS_PREFIX+'ShippingMethods');
	
	var getWorkingDate = function(){
		var current_date = new Date();
		var current_time = hhmmss(current_date);
		if(current_time>="00:00:00" && current_time<$rootScope.aiv_info.day_ends_at){
			current_date = new Date(current_date.setDate(current_date.getDate() - 1));
		}
		return yyyymmdd(current_date);
	}
	
	var getWorkingDay = function(){
		var current_date = new Date();
		var current_time = hhmmss(current_date);
		if(current_time>="00:00:00" && current_time<$rootScope.aiv_info.day_ends_at){
			current_date = new Date(current_date.setDate(current_date.getDate() - 1));
		}
		return $scope.weekdays[current_date.getDay()];
	}
	
	var getDBDeletes = function(doc,init){
		if(!doc)return;
		console.log(doc);
		if(doc._id.includes('_order_')){
			shareData.removeOrder(doc);
		}
	}
	var signup_mutex = true;
	var cupdate_mutex = true;
	
	var getDBChanges = function(doc,init){
		if(!doc)return;
		console.log(doc);
		if(angular.isDefined(doc._conflicts) && doc._conflicts.length){
			console.log(doc._conflicts.length+" CONFLICTS ON "+doc._id);
		}
		var returnData;
		switch(doc._id){
			case 'getNotifications':
				returnData = doc;
				if(angular.isDefined(returnData.nots)){
					$scope.shop_nots.nots = returnData.nots;
				}
				
				$scope.shop_timings = returnData.timings;
				if(returnData.Success){
					$scope.shop_nots.shop_open = returnData.shop_open;
					$scope.shop_nots.shop_close = returnData.shop_close;
					$scope.shop_nots.delivery_start = returnData.delivery_start;
					$scope.shop_nots.delivery_stop = returnData.delivery_stop;
				}
				break;
			
			case 'getShopInfo':
				returnData = doc;
				$rootScope.aiv_info.name = $filter('decodehtml')(returnData.shop_name);
				$rootScope.aiv_info.description = returnData.description;
				$rootScope.aiv_info.currency = returnData.currency;
				$rootScope.aiv_info.currency_symbol = $filter('decodehtml')(returnData.currency_symbol);
				
				if(returnData.extra_info == "1"){
					$rootScope.aiv_info.author = returnData.author;
					$rootScope.aiv_info.domain = returnData.domain;
					$rootScope.aiv_info.url = returnData.url;
					$rootScope.aiv_info.fb_url = returnData.fb_url;
					$rootScope.aiv_info.hf_url = returnData.hf_url;
					$rootScope.aiv_info.lat = returnData.shop_lat;
					$rootScope.aiv_info.long = returnData.shop_long;
					$rootScope.aiv_info.fb_appid = returnData.fb_appid;
					$rootScope.aiv_info.phone1 = returnData.phone1;
					$rootScope.aiv_info.phone2 = returnData.phone2;
					$rootScope.aiv_info.email = returnData.email;
					$rootScope.aiv_info.android_id = returnData.android_id;
					$rootScope.aiv_info.ios_id = returnData.ios_id;
					$rootScope.aiv_info.windows_id = returnData.windows_id;
					$rootScope.aiv_info.android_icon = returnData.android_icon;
					$rootScope.aiv_info.app_name = returnData.app_name;
					$rootScope.aiv_info.address = returnData.address;
					$rootScope.aiv_info.hyg_url = returnData.hygiene_url;
					$rootScope.aiv_info.hf_name = returnData.hf_name;
					$rootScope.aiv_info.orders_url = returnData.orders_url;
					$rootScope.aiv_info.POSTCODE_API_KEY = (returnData.test_mode == "TRUE")?"1ddqd":"ak_ivm04eitMeIdiIAiT5LOPec7TqN30";
					$rootScope.aiv_info.enable_kitchen = returnData.enable_kitchen;
					$rootScope.aiv_info.enable_table = returnData.enable_table;
					$rootScope.aiv_info.shop_id = returnData.shop_id;
					$rootScope.aiv_info.shop_name = returnData.shop_name;
					$rootScope.aiv_info.dbname = returnData.dbname;
					$rootScope.aiv_info.SMS_API = returnData.SMS_API;
					$rootScope.aiv_info.enable_sms = returnData.enable_sms;
					$rootScope.aiv_info.sms_campaign_name = returnData.sms_campaign_name;
					$rootScope.aiv_info.twitter = returnData.twitter;
					$rootScope.aiv_info.vat_no = returnData.vat_no;
					$rootScope.aiv_info.day_ends_at = returnData.day_ends_at;
					$rootScope.aiv_info.enable_compaction = returnData.enable_compaction;
					$rootScope.aiv_info.compact_days = returnData.compact_days;
					$rootScope.aiv_info.set_to_zero = returnData.set_to_zero;
					$rootScope.aiv_info.block_z_report = returnData.block_z_report;
					$rootScope.aiv_info.doubble_font = returnData.doubbleSizeAddress;
					$rootScope.aiv_info.doubble_kot = returnData.KOTdoubbleSize;
					if($rootScope.aiv_info.set_to_zero)
						$scope.aiv_reports.types.push({id:'ZREPORT',name:'Set to Zero'});
				}
				
				if($rootScope.aiv_info.enable_kitchen == "TRUE"){
					var term = $filter('filter')($scope.term_types,{id:'KITCHEN'},false);
					if(!term.length){
						$scope.term_types.push({id:'KITCHEN',name:'Kitchen Terminal'});
					}
				}

				if($rootScope.aiv_info.enable_table == "TRUE"){
					var table = $filter('filter')($scope.aiv_settings.types,{id:'TABLES'},true);
					if(!table.length){
						$scope.aiv_settings.types.splice($scope.aiv_settings.types.length-2,0,{id:'TABLES',name:'Tables'});
					}
					
					var type = $filter('filter')($scope.term_types,{id:'WAITER'},true);
					if(!type.length){
						$scope.term_types.push({id:'WAITER',name:'Waiter Terminal'});
					}
				}
				break;
			
			case 'getCategory':
				var arr_index = $scope.syncDocsArr.indexOf('getCategory');
				if(arr_index > -1){
					$scope.syncDocsArr.splice(arr_index,1);
					if(!$scope.syncDocsArr.length){
						$ionicLoading.hide();
					}
				}
				
				returnData = doc;
				$scope.categories = returnData.product_categories;
				if($scope.categories.length){
					var count = 0;
					for(var c=0;c<$scope.categories.length;c++){
						if(!$scope.categories[c].parent){
							var children = $filter('filter')($scope.categories,{parent:$scope.categories[c].id},true);
							$scope.categories[c].children = children;
							if(count%2){
								$scope.categories[c].odd = true;
							}else{
								$scope.categories[c].odd = false;
							}
							count++;
						}else{
							$scope.categories[c].children = [];
						}
					}
				}	
					
				$rootScope.aiv_reload_app = false;
				break;
				
			case 'getCountries':
				returnData = doc;
				$scope.countries = returnData.countries;
				$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'countries', returnData.countries);
				$scope.base_country = returnData.base;
				$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'base_country', returnData.base);
				break;

			case 'getPaymentMethods':
				returnData = doc;
				$scope.PaymentMethods = returnData.methods;
				$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'PaymentMethods', $scope.PaymentMethods);
				break;
			
			case 'getShippingDetails':
				returnData = doc;
				$scope.ShippingMethods = returnData.methods;
				$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'ShippingMethods', $scope.ShippingMethods);
				$scope.shipping_methods = [];
				$scope.delivery_areas.areas = [];
				if($scope.terminalData.type != 'BACK'){
					if($scope.POSSettings.enable_sitin){
						$scope.shipping_methods.push({'id':'sitin','title':'Sit-In','method_title':'Sit-In','method_description':'','fee':''});
					}
					$scope.shipping_methods.push({'id':'','title':'Takeaway','method_title':'','method_description':'','fee':''});
				}
				angular.forEach($scope.ShippingMethods, function(item) {
					$scope.shipping_methods.push({'id':item.id,'title':item.title,'method_title':item.method_title,'method_description':item.method_description,'fee':item.fee});
					if(item.id == 'local_delivery'){
						if(angular.isDefined(item.pos_nonZipAreas) && item.pos_nonZipAreas == "true" && angular.isDefined(item.pos_codes) && item.pos_codes.length){
							for(var i=0;i<item.pos_codes.length;i++){
								for(var j=0;j<item.pos_codes[i].areas.length;j++){
									$scope.delivery_areas.areas.push({'area':item.pos_codes[i].areas[j],'amount':item.pos_codes[i].amount});
								}
							}
						}else if(item.nonZipAreas == "true" && angular.isDefined(item.codes)){
							for(var i=0;i<item.codes.length;i++){
								for(var j=0;j<item.codes[i].areas.length;j++){
									$scope.delivery_areas.areas.push({'area':item.codes[i].areas[j],'amount':item.codes[i].amount});
								}
							}
						}
					}
				}, $scope.shipping_methods);
				var method = $filter('filter')($scope.shipping_methods,{title:$scope.order_type},false);
				if(method.length){
					$scope.changeShipping(method[0]);
					$scope.ship_select.id = $scope.temp_shipping.id;
					$scope.saveShipping(false);
				}else{
					$scope.selected_shipping = {};
					if($scope.terminalData.type == 'FRONT' || $scope.startup.action=='TABLEVIEW'){
						$scope.selected_shipping = {'id':'','title':'Takeaway','method_title':'','method_description':'','fee':''};
					}
					$scope.ship_select = {id : null,err : '',amount:''};
				}
				break;
			
			case 'getCoupons':
				returnData = doc;
				$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'Coupons', returnData);
				break;
			
			case 'getTerminals': 
				returnData = doc;
				$scope.aiv_terminals = returnData;
				$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'terminals', $scope.aiv_terminals);
				$scope.user_terminals = [];
				for(var i=0;i<$scope.aiv_terminals.terminals.length;i++){
					if($scope.aiv_terminals.terminals[i].type != 'WAITER' && $scope.aiv_terminals.terminals[i].type != 'KITCHEN'){
						$scope.user_terminals.push($scope.aiv_terminals.terminals[i]);
					}
				}
				break;
			
			case 'price_bands': 
				returnData = doc.bands;
				$scope.price_bands = returnData;
				break;
			
			case 'delivery_vans': 
				returnData = doc.vans;
				$scope.delivery_vans = returnData;
				break;
				
			case 'getTaxclasses':
				returnData = doc.tax_classes;
				$scope.tax_classes = returnData;
				break;
				
			case 'getTaxes':
				returnData = doc.taxes;
				$scope.taxes = returnData;
				break;
			
			case 'getSettings':	
				returnData = doc;
				if(AIV_CONSTANTS.TEST_KITCHEN){
					$scope.local_ip = '192.168.1.131';
				}else{
					$scope.local_ip = returnData.local_ip;
					$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'local_ip',$scope.local_ip);
				}
				$scope.hf_loyalty = returnData.loyalty;
				if(angular.isUndefined($scope.hf_loyalty.signup_points)){
					$scope.hf_loyalty.signup_points = "0";
				}
				$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'HFLoyaltySettings',$scope.hf_loyalty);
				
				$scope.POSSettings = angular.copy(returnData);
				if(angular.isUndefined($scope.POSSettings.early_takeaway)){
					$scope.POSSettings.early_takeaway = {
						"start" : utcDate,
						"end" : utcDate
					}
				}else{
					$scope.POSSettings.early_takeaway.start = new Date($scope.POSSettings.early_takeaway.start);
					$scope.POSSettings.early_takeaway.end = new Date($scope.POSSettings.early_takeaway.end);
				}
				
				if(angular.isUndefined($scope.POSSettings.online_default_accept)){
					$scope.POSSettings.online_default_accept=false;
				}
				$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'POSSettings',$scope.POSSettings);
				
				if(angular.isDefined($scope.POSSettings.daily_order_no) && $scope.POSSettings.daily_order_no.common && 
					($scope.POSSettings.daily_order_no.num>=$scope.dailyOrderNo.num || ($scope.dailyOrderNo.date!=$scope.POSSettings.daily_order_no.date))){
					$scope.dailyOrderNo = angular.copy($scope.POSSettings.daily_order_no);
					$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'order_no',$scope.dailyOrderNo);
				}
				$scope.ShowPaymentButtonInCollection = returnData.showPaymentButtonInCollection;
				
				if(returnData.hasOwnProperty('enable_product_grouping'))
				{
				$scope.enable_product_grouping = returnData.enable_product_grouping;
				}
				else
				$scope.enable_product_grouping = true;

				
				break;			
				
			case 'getDepts':	
				returnData = doc;
				$scope.product_depts = returnData.data;
				
				if(!$scope.dept_receiptCount.length){
					for(var i=0;i<$scope.product_depts.length;i++){
						$scope.dept_receiptCount.push({dept:$scope.product_depts[i],copies:1});
					}
					$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'dept_receiptCount',JSON.stringify($scope.dept_receiptCount));
				}
				
				if($scope.settings_modal != undefined && $scope.settings_modal._isShown){
					$scope.settings_data.dept_receiptCount = angular.copy($scope.dept_receiptCount);
				}
				break;	
				
			case 'getProductGroups':	
				$scope.product_groups = doc.data;
				break;
				
			case 'getUsers': 
				returnData = doc;
				$scope.master_pass = doc.master_pass;
				$scope.all_users = returnData.users;
				$scope.reloadUsers();
				break;
				
			case 'cook_inst':	
				$scope.cook_instructions = doc.instructions;
				break;
				
			case 'getCerts':
				$scope.aiv_certs = doc;
				break;
				
			case 'getBagCharges':
				$scope.bagCharges = doc;
				$scope.bagCharges.currency = $filter('decodehtml')($scope.bagCharges.currency);
				$scope.bagCharges.selected = $scope.bagCharges.charges.length?Number($scope.bagCharges.charges[0]):0;
				$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'bagCharges', $scope.bagCharges);
				break;	
				
			case 'getUKPostcodes':
				shareData.addPostcodes(doc.postcodes);
				break;
				
			case 'getDeliveryDrivers':
				$scope.delivery_drivers.drivers = angular.copy(doc.drivers);
				break;
			case 'getPurchaseItem':
				$scope.getPurchaseItemName = doc.purchaseItem;
				break;
			case 'getServerHeartBeat':
				$scope.heartBeat.newBeat = doc.data;
				console.log('heartbeat');
				break;


			case 'getDiscounts':
				$scope.user_discounts = angular.copy(doc.per_discount);
				$scope.product_deals = angular.copy(doc.deals);
				break;
				
			case 'getSMSTemplates':
				$scope.SMSTemplates = angular.copy(doc.templates);
				
				break;
			
			case 'getTables': 
				$scope.aiv_tables = angular.copy(doc.tables);
				break;
				
			case $scope.terminalData._id:
				returnData = doc;
				if((returnData.last_bill_number >= $scope.terminalData.last_bill_number || returnData.last_order_seq >= $scope.terminalData.last_order_seq)
					&& returnData.last_customer_seq >= $scope.terminalData.last_customer_seq){
					$scope.terminalData = angular.copy(returnData);
					$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'terminalData',$scope.terminalData);
				}
				break;
			
			default:
				var clock_doc = 'clock_'+getWorkingDate();
				if(doc._id == clock_doc){
					$scope.user_register = angular.copy(doc.data);
				}else if(doc.products != undefined){
					//Store products
					//$scope.allProducts[doc._id] = doc.products;
					
					
						for(var j=0;j<doc.products.length;j++){
							var info = doc.products[j];
							if(info.meta.wc_productdata_options && info.meta.wc_productdata_options[0] && info.meta.wc_productdata_options[0].group){
								if(info.meta.wc_productdata_options[0].group == "suboption"){
									doc.products.splice(j,1);
									j--;
								}
							}
						}
						$scope.allProducts[doc._id] = doc.products;
					
					
					
					if($scope.init_success){
						//Store products
						$scope.sel_category = doc._id;
						$scope.products = filter_products($scope.startup.action,doc.products);
						$scope.processProducts();
					}
				}else if(doc._id.startsWith('signup_') && signup_mutex && $scope.POSSettings.master_terminal==$scope.terminalData.name){
					signup_mutex = false;
					//New online customer
					var now_date = new Date().toISOString();
					var next_seq = $scope.terminalData.last_customer_seq?(parseInt($scope.terminalData.last_customer_seq)+1):1;
					var docid = "customer_"+$scope.terminalData.prefix+next_seq;
					var new_customer = angular.copy(doc.data);
					var signup_doc = angular.copy(doc);
					delete new_customer._rev;
					new_customer._id = docid;
					new_customer.created_at = now_date;
					new_customer.meta.docid = docid;
					new_customer.meta.shop_id = $rootScope.aiv_info.shop_id;
					if($scope.hf_loyalty.enabled){
						new_customer.meta.points_to_unlock = $scope.hf_loyalty.signup_points;
					}
					new_customer.action = "WOO_CUST_UPDATE";
					$pouchDB.save(new_customer).then(function(ret) {
						if(ret != undefined){
							return $pouchDB.upsert($scope.terminalData._id,function(doc){
								if(angular.isDefined(doc._id)){
									doc.last_customer_seq = next_seq;
								}
								return doc;
							});
						}
					}).then(function(resData) {
						$pouchDB.delete(signup_doc._id,signup_doc._rev);
						signup_mutex = true;
					}).catch(function(error){
						console.error(error);
						signup_mutex = true;
					});
				}else if(doc._id.startsWith('cupdate_') && cupdate_mutex && $scope.POSSettings.master_terminal==$scope.terminalData.name){
					cupdate_mutex = false;
					var update_customer = angular.copy(doc.data);
					var cupdate_doc = angular.copy(doc);
					/*if(update_customer.update_info == 'LOYALTY'){
							//Redeemed online //Update loyalty info
							$pouchDB.upsert(update_customer.meta.docid,function(doc){
								if(angular.isDefined(doc._id)){
									doc.meta = update_customer.meta;
								}
								return doc;
							}).then(function(resData) {
								$pouchDB.delete(cupdate_doc._id,cupdate_doc._rev);
								cupdate_mutex = true;
							}).catch(function(error){
								console.error(error);
								cupdate_mutex = true;
							});
					}else */if(update_customer.update_info == 'INFO'){
						var customer_doc = shareData.getCustomer("PHONE",update_customer.billing_address.phone);
						if(angular.isDefined(customer_doc._id)){
							//Update customer
							$pouchDB.upsert(customer_doc._id,function(doc){
								if(angular.isDefined(doc._id)){
									doc.email = update_customer.email;
									doc.first_name = update_customer.first_name;
									doc.last_name = update_customer.last_name;
									doc.billing_address.email = update_customer.billing_address.email;
									doc.billing_address.first_name = update_customer.billing_address.first_name;
									doc.billing_address.last_name = update_customer.billing_address.last_name;
									doc.billing_address.phone = update_customer.billing_address.phone;
									doc.billing_address.company = update_customer.billing_address.company;
									doc.billing_address.address_1 = update_customer.billing_address.address_1;
									doc.billing_address.address_2 = update_customer.billing_address.address_2;
									doc.billing_address.city = update_customer.billing_address.city;
									doc.billing_address.state = update_customer.billing_address.state;
									doc.billing_address.postcode = update_customer.billing_address.postcode;
									doc.billing_address.country = update_customer.billing_address.country;
									return doc;
								}
								return false;
							}).then(function(resData) {
								$pouchDB.delete(cupdate_doc._id,cupdate_doc._rev);
								cupdate_mutex = true;
							}).catch(function(error){
								console.error(error);
								cupdate_mutex = true;
							});
						}
					}else if (update_customer.update_info == 'PHONE'){
						var customer_doc = shareData.getCustomer("LOYALTY_CARD",update_customer.loyalty_card_id);
						if(angular.isDefined(customer_doc._id)){
							$pouchDB.upsert(customer_doc._id,function(doc){
								if(angular.isDefined(doc._id)){
									doc.billing_address.phone = update_customer.billing_address.phone;
									return doc;
								}
								return false;
							}).then(function(resData) {
								$pouchDB.delete(cupdate_doc._id,cupdate_doc._rev);
								cupdate_mutex = true;
							}).catch(function(error){
								console.error(error);
								cupdate_mutex = true;
							});
						}
					}else{
						cupdate_mutex = true;
					}
				}else if(doc._id.startsWith('odelete_') && doc.data.update == false){
					$scope.wipeOrders(true, doc.data.date);
					$pouchDB.upsert(doc._id,function(doc){
						if(angular.isDefined(doc._id)){
							doc.data.update =true;
							return doc;
						}
						return false;
					}).catch(function(error){
					console.error(error);
					});
				}else if(doc._id.startsWith('clock_')){
					//Employee register
					
				}else if(doc._id.startsWith('users_')){
					//User details change notification 
					console.log("User change detected");
					console.log(doc);
					$scope.reloadUsers();
					
					
					
				}else if(doc._id.startsWith('zreport_print')){
					if(doc.data.print ==undefined){
						var order = doc.data.data;
						$scope.zreportPOSAdmin(order);
						$pouchDB.upsert(doc._id,function(doc){
							doc.data.print = true;
							if(AIV_CONSTANTS.DEVMODE)
								console.log(doc);
							return doc;
						}).catch(function(error){
							if(AIV_CONSTANTS.DEVMODE)
								console.error(error);
						});
					}
				}else if(doc._id.startsWith('purchaseList_')){
					//User details change notification 
					console.log("Purchse list getting");
					console.log(doc);
					if($scope.globelPurchseList.length){
						if($scope.globelPurchseList.findIndex(e=>e._id ==doc._id) !=-1){
							var index = $scope.globelPurchseList.findIndex(e=>e._id ==doc._id);
							$scope.globelPurchseList[index] = doc;
						}else{
							$scope.globelPurchseList.push(doc);
						}
					}else{
						$scope.globelPurchseList.push(doc);
					}
					
					
				}else if(doc._id.indexOf('AIVOOT_order') > -1 && angular.isDefined(doc.data)){
					//Handle online orders
					if(($scope.terminalData.type == 'BACK' || $scope.terminalData.type == 'BOTH') && $scope.onlineOrder.enable){
						removeAlert(doc.data.order_meta.bill_number);
						if(doc.data.status == "processing" ){//New order
							//Check if order is today's
							/*var updated_at = new Date(doc.data.updated_at);
							var today = new Date();
							today.toDateString() == updated_at.toDateString() && */
							if(angular.isDefined(doc.data.order_meta.processed_by) && doc.data.order_meta.processed_by=="AIVOOT"){
								add2Alert(doc.data.order_meta.bill_number);
								if($scope.online_order._id == undefined || $scope.POSSettings.online_default_accept==true){
									//Show new order
									if(doc.data.shipping_lines[0].method_id == 'local_delivery'){
										doc.data.order_meta.duration = '40 Minutes';
									}else if(doc.data.shipping_lines[0].method_id == 'local_pickup'){
										doc.data.order_meta.duration = '20 Minutes';
									}
									$scope.online_order = angular.copy(doc);
									//
									$scope.showOnlineModal();
									//Play sound
									$scope.online_order_audio.play();
								}
							}
						}else if(doc.data.status == "pending"){
							if(add2Alert(doc.data.order_meta.bill_number)){
								$timeout(function(){},0);
							}
						}else if(doc.data.status == "completed"){
							if(removeAlert(doc.data.order_meta.bill_number) || removeReady(doc.data.order_meta.bill_number)){
								$timeout(function(){},0);
							}
						}else if(doc.data.status == "on-hold"){
							if(angular.isDefined(doc.data.order_meta.processed_by) && doc.data.order_meta.processed_by=="AIVOOT"){
								doc.data.order_meta.daily_order_no = $scope.dailyOrderNo.prefix+$scope.dailyOrderNo.num;
								if(!$scope.dailyOrderNo.common){
									$scope.dailyOrderNo.num++;
									$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'order_no',$scope.dailyOrderNo);
								}
								doc.data.order_meta.processed_by =$scope.terminalData.name;
								$scope.printReceipt(doc.data,false,true);
								$pouchDB.upsert(doc._id,function (res) {
									//Store last order
									res.data =doc.data;
									return res;
								}).catch(function(err){
									console.log(err);
								});
							}
						}
						shareData.addOrder(doc);
						updateOrderArray(doc);
					}else if($scope.terminalData.type != 'KITCHEN'){
						//Unpaid online Collection orders
						//if(angular.isArray(doc.data.shipping_lines) && doc.data.shipping_lines.length && doc.data.shipping_lines[0].method_id == 'local_pickup' && !doc.data.payment_details.paid && (doc.data.status=='on-hold'||doc.data.status=='kitchen-ready')){
						if(doc.data.order_meta.processed_by != $scope.terminalData.name && angular.isArray(doc.data.shipping_lines) && doc.data.shipping_lines.length && doc.data.shipping_lines[0].method_id == 'local_pickup' && (doc.data.status=='on-hold'||doc.data.status=='kitchen-ready')){
							add2Alert(doc.data.order_meta.bill_number);
							$timeout(function(){},0);
						}else if(doc.data.status == "completed"){
							if(removeAlert(doc.data.order_meta.bill_number) || removeReady(doc.data.order_meta.bill_number)){
								$timeout(function(){},0);
							}
						}
						shareData.addOrder(doc);
					}
				}else if($scope.terminalData.type == 'FRONT' && isBackOrder(doc._id) && angular.isArray(doc.data.shipping_lines) && doc.data.shipping_lines.length && doc.data.shipping_lines[0].method_id == 'local_pickup' && (doc.data.status=='on-hold'||doc.data.status=='kitchen-ready')){
				//else if($scope.terminalData.type == 'FRONT' && isBackOrder(doc._id) && doc.data.order_meta.processed_by != $scope.terminalData.name && angular.isArray(doc.data.shipping_lines) && doc.data.shipping_lines.length && doc.data.shipping_lines[0].method_id == 'local_pickup' && (doc.data.status=='on-hold'||doc.data.status=='kitchen-ready')){
				//else if($scope.terminalData.type == 'FRONT' && isBackOrder(doc._id) && angular.isArray(doc.data.shipping_lines) && doc.data.shipping_lines.length && doc.data.shipping_lines[0].method_id == 'local_pickup' && !doc.data.payment_details.paid && (doc.data.status=='on-hold'||doc.data.status=='kitchen-ready')){
					add2Alert(doc.data.order_meta.bill_number);
					shareData.addOrder(doc);
					$timeout(function(){},0);
				}else if($scope.syncDocsArr.length){
					var arr_index = $scope.syncDocsArr.indexOf(doc._id);
					if(arr_index > -1){
						$scope.syncDocsArr.splice(arr_index,1);
						if(!$scope.syncDocsArr.length){
							$ionicLoading.hide();
						}
					}
				}else if(doc._id.indexOf('_order_') > -1){
					if(doc.data.status == "completed" && removeAlert(doc.data.order_meta.bill_number) || removeReady(doc.data.order_meta.bill_number) || removeTable(doc.data.order_meta.bill_number)){
						$timeout(function(){},0);
					}
					if(doc.data.order_meta.daily_order_no ==""){
						if($scope.updateDailyOrderNo.length){
							if($scope.updateDailyOrderNo.findIndex(e=>e.id ==doc._id) !=-1){
								var index = $scope.updateDailyOrderNo.findIndex(e=>e.id ==doc._id);
								 $pouchDB.upsert(doc._id,function(doc1){
								doc1.data.order_meta.daily_order_no = $scope.updateDailyOrderNo[index].no;
								return doc1;
								}).then(function(result) {
									$scope.updateDailyOrderNo.splice(index,1);
									console.log(result);
								}).catch(function(error){
									console.error(error);
								});
							}
						}
					}
					shareData.addOrder(doc);
				}else if(doc._id.startsWith('customer_')){
					//Update customer list
					$scope.updateCustomerList(doc);
					if(angular.isDefined($scope.selected_customer._id) && $scope.selected_customer._id == doc._id){
						$scope.selected_customer = angular.copy(doc);
						console.log("Customer re-assigned");
					}
				}else if(doc._id.indexOf('_print') > -1 && angular.isDefined(doc.data) && $scope.POSSettings.print_server==$scope.terminalData.name){
					//Check if print from Mobile App
					var temp = angular.copy(doc);
					var print_ids = [];
					for(var i=0;i<temp.data.length;i++){
						if(!temp.data[i].status){
							doMutexOperation(print_mutex,{'type':temp.data[i].type,'order':temp.data[i].order.data,'cart':[],'void_items':temp.data[i].order.void_items},false,temp.data[i].order._id);
							print_ids.push(temp.data[i].id);
						}
					}
					
					if(print_ids.length){
						var postData = {};
						postData.type = "UPDATE";
						postData.print = print_ids;
						updatePrintDoc(temp._id,postData);
						/*$pouchDB.upsert(doc._id,function(doc){
							for(var i=0;i<doc.data.length;i++){
								var index = print_ids.indexOf(doc.data[i].id);
								if(index > -1){
									doc.data[i].status = true;
								}
							}
							return doc;
						}).then(function(upres){
							console.log("Print doc updated");
						}).catch(function(err){
							console.error(err);
						})*/
					}
				}
				break;
		}
    }
	
	var updatePrintDoc = function(docid,postData){
		//Updating print doc
		$scope.httpRequest = dataService.updateDoc($scope.couchDBUrl+"/_design/updatePrintDoc/_update/print/"+docid, postData);
		$scope.httpRequest.then(function(returnData) {
			console.log(returnData);
			if(!returnData.Success){
				if(returnData.Message){
					console.error(returnData.Message);
				}
			}else{
				console.log("Print doc updated");
			}
		}).catch(function(err){
			var msg = '';
			if(!err){
				console.error("No connection!!!");
			}else if(angular.isDefined(err.error)){
				if(err.error == "timeout"){
					console.error("Failed to update print doc due to slow internet connection");
				}else{
					console.error("Failed to update print doc.Request aborted!!!");
				}
			}else{
				console.error("Failed to update print doc");
			}
			console.error(err);
		})
	}
	
	$scope.kitchenOrders = [];
	$scope.kitchenProducts = {};
	var getDBEtcChanges = function(doc,update){
		if(!doc)return;
		if($scope.terminalData.type == 'KITCHEN'){
			//Process accepted orders
			if(doc._id.indexOf('_order_') > -1 && (doc.data.status == "on-hold" || doc.data.status == "sent-to-kitchen" || doc.data.status == "re-opened")){
				var exists = $filter('filter')($scope.kitchenOrders,{data:{order_meta:{bill_number:doc.data.order_meta.bill_number}}},false);
				if(exists.length){
					if(doc.data.status == "re-opened"){
						var index = $scope.kitchenOrders.indexOf(exists[0]);
						if(index > -1){
							$scope.kitchenOrders[index].data.status = "re-opened";
						}
						
						if(update){
							$timeout(function(){},0);
						}
					}else if(doc.data.status == "on-hold"){
						//Edited order
						//Remove products from old order
						for(var j=0;j<exists[0].data.line_items.length;j++){
							var prdt_name = exists[0].data.line_items[j].title || exists[0].data.line_items[j].name;
							if($scope.kitchenProducts[prdt_name] != undefined){
								$scope.kitchenProducts[prdt_name]-= exists[0].data.line_items[j].quantity;
								if($scope.kitchenProducts[prdt_name] <=0){
									delete $scope.kitchenProducts[prdt_name];
								}
							}
						}
						
						$scope.kitchenOrders.splice($scope.kitchenOrders.indexOf(exists[0]),1);
					}
				}
					
				if(!exists.length || doc.data.status == "on-hold"){
					var dept_match = 0;
					for(var j=0;j<doc.data.line_items.length;j++){
						if(angular.isDefined(doc.data.line_items[j].dept) && $scope.terminalData.dept.indexOf(doc.data.line_items[j].dept)>-1){
							var prdt_name = doc.data.line_items[j].title || doc.data.line_items[j].name;
							if($scope.kitchenProducts[prdt_name] == undefined){
								$scope.kitchenProducts[prdt_name] = doc.data.line_items[j].quantity;
							}else{
								$scope.kitchenProducts[prdt_name]+=doc.data.line_items[j].quantity;
							}
							
							if(angular.isDefined(doc.data.line_items[j].variations)){
								doc.data.line_items[j].attributestoshow = $scope.processDisplay(doc.data.line_items[j].variations);
							}
							dept_match++;
						}
					}
					
					if(dept_match){
						if(doc.data.shipping_methods && doc.data.order_meta.duration){
							var end_time = new Date(doc.data.updated_at);
							var duration = doc.data.order_meta.duration.split(' ');
							if(duration.length){
								end_time.setMinutes(end_time.getMinutes() + parseInt(duration[0]/2));
							}
							doc.data.order_meta.end_time = end_time;
						}
						
						if(doc.data.note){
							doc.data.note_height = "68%";
						}else{
							doc.data.note_height = "75%";
						}
						$scope.kitchenOrders.push(doc);
						if(doc.data.status == "on-hold"){
							//Play sound
							$scope.kitchen_order_audio.play();
						}
						
						if(update){
							$timeout(function(){},0);
						}
					}
				}
			}
		}else{
			//Process prepared orders
			if(doc._id.indexOf('_order_') > -1 && doc.data.order_meta.processed_by == $scope.terminalData.name){
				if(doc.data.status == "sent-to-kitchen"){
					var updateProcessingStatus = function (doc) {
						if(!doc) return false;
						if(doc.data.status == "on-hold"){
							doc.data.status = "sent-to-kitchen";
							doc.data.updated_at = new Date().toISOString();
							console.log("On hold to sent to kitchen");
							return doc;
						}
						return false; // don't update the doc; it's already been "touched"
					}
					var base_doc_id = angular.isDefined(doc.data.order_meta.base_doc)?doc.data.order_meta.base_doc:doc._id;
					$pouchDB.upsert(base_doc_id,updateProcessingStatus).then(function(res){
							
					}).catch(function(error){
						console.error(error);
					});
				}else if(doc.data.status == "kitchen-ready"){//Process prepared orders
					//Check if all products are ready
					var ready_count = 0;
					for(var j=0;j<doc.data.line_items.length;j++){
						if(angular.isUndefined(doc.data.line_items[j].dept)){
							ready_count++;
						}else if(!doc.data.line_items[j].dept){
							ready_count++;
						}else if(doc.data.line_items[j].status == "READY"){
							ready_count++;
						}
					}

					if(ready_count == doc.data.line_items.length){//All items are ready
						var updateReadyStatus = function (doc) {
							if(!doc) return false;
							if(doc.data.status == "on-hold" || doc.data.status == "sent-to-kitchen"){
								/*if(doc.data.payment_details.paid && !doc.data.shipping_methods){
									doc.data.status = "completed";
								}else{
									doc.data.status = "kitchen-ready";
								}*/
								doc.data.updated_at = new Date().toISOString();
								doc.data.status = "kitchen-ready";
								add2Ready(doc.data.order_meta.bill_number);
								if(update){
									$timeout(function(){},0);
								}
								return doc;
							}
							return false; // don't update the doc; it's already been "touched"
						}
			
						var base_doc_id = angular.isDefined(doc.data.order_meta.base_doc)?doc.data.order_meta.base_doc:doc._id;
						//If Paid shop order, mark as complete else set Kitchen ready status
						$pouchDB.upsert(base_doc_id,updateReadyStatus).then(function(res){
								
						}).catch(function(error){
							console.error(error);
						});
					}
				}
			}
		}
	}
	
	var onDBEtcRemoved = function(doc){
		var exists = $filter('filter')($scope.kitchenOrders,{_id:doc._id},false);
		if(exists.length){
			removeAlert(exists[0].data.order_meta.bill_number);
			//Remove products 
			for(var j=0;j<exists[0].data.line_items.length;j++){
				var prdt_name = exists[0].data.line_items[j].title || exists[0].data.line_items[j].name;
				if($scope.kitchenProducts[prdt_name] != undefined){
					$scope.kitchenProducts[prdt_name]-= exists[0].data.line_items[j].quantity;
					if($scope.kitchenProducts[prdt_name] <=0){
						delete $scope.kitchenProducts[prdt_name];
					}
				}
			}
			
			//Remove deleted order from UI
			$scope.kitchenOrders.splice($scope.kitchenOrders.indexOf(exists[0]),1);
			$timeout(function(){},0);
		}
	}
	
	$scope.allOrders = [];
	var updateOrderArray = function(order){
		if($scope.terminalData.type == 'BACK' && $scope.backTemplate.id=='MPOS'){
			for(var i=0;i<$scope.allOrders.length;i++){
				if($scope.allOrders[i].data.id == order.data.id){
					//Order exists - readd
					$scope.allOrders.splice(i,1,order);
					break;
				}
			}
			if(i >= $scope.allOrders.length){
				//Order doesn't exists - add
				$scope.allOrders.push(order);
			}
		}
	}
	
	var add2Alert = function(bill_number){
		if($scope.alertArr.indexOf(bill_number) < 0){
			$scope.alertArr.push(bill_number);
			return true;
		}
		return false;
	}
	
	var removeAlert = function(bill_number){
		var index = $scope.alertArr.indexOf(bill_number);
		if(index >= 0 ){
			$scope.alertArr.splice(index, 1); 
			return true;
		}
		return false;
	}
	
	var add2Ready = function(bill_number){
		if($scope.readyArr.indexOf(bill_number) < 0){
			$scope.readyArr.push(bill_number);
			return true;
		}
		return false;
	}
	
	var removeReady = function(bill_number){
		var index = $scope.readyArr.indexOf(bill_number);
		if(index >= 0 ){
			$scope.readyArr.splice(index, 1); 
			return true;
		}
		return false;
	}
	
	var add2Table = function(bill_number){
		if($scope.tableArr.indexOf(bill_number) < 0){
			$scope.tableArr.push(bill_number);
			return true;
		}
		return false;
	}
	
	var removeTable = function(bill_number){
		var index = $scope.tableArr.indexOf(bill_number);
		if(index >= 0 ){
			$scope.tableArr.splice(index, 1); 
			return true;
		}
		return false;
	}
	var add2Register = function(user,create){
		var current_date = getWorkingDate();
		var date_string = new Date().toISOString();
		var user_index = -1;
		for(var i=0;i<$scope.user_register.length;i++){
			if($scope.user_register[i]._id == user._id){
				user_index = i;
				break;
			}
		}
		if(create && user_index < 0){
			var register = {
				"id":user.user_id,
				"name":user.user_login,
				"created_at": new Date(),
				"role":user.role,
				"clock_in":date_string,
				"clock_out":"",
				"enrolled":false,
				"status":false,
				"_id":user._id
			}
			$scope.user_register.push(register);
		}else if(!create && user_index > -1){
			$scope.user_register[user_index] = angular.copy(user);
		}
		return true;
	}

	
	var getUserRegister = function(docid){
		var exists = $filter('filter')($scope.user_register,{_id:docid},true);
		if(exists.length){
		var dateCraeted ="";
		var index=0;
			for(var i=0;i<exists.length;i++){
				if(dateCraeted =="" ||(dateCraeted<exists[i].created_at)){
						dateCraeted = exists[i].created_at;
						index =i;
					}
					
			}
			return exists[index];
		}
		return false;
	}
	
	var isBackOrder = function(docid){
		for(var i=0;i<$scope.aiv_terminals.terminals.length;i++){
			if(docid.indexOf($scope.aiv_terminals.terminals[i].name+'_order_') > -1 && ($scope.aiv_terminals.terminals[i].type=='BACK'||$scope.aiv_terminals.terminals[i].name==$scope.terminalData.name)){
				return true;
			}
		}
		return false;
	}
	
	$scope.online_order = {};
	$scope.delivery_interval = {
		"collection":[],
		"delivery":[]
	}
	
	$scope.settings_data = {
		enable_free_delivery:false,
		free_delivery_amt:0,
		terminal:'',
		logoInReceipt:false,
		enablePayOff:true,
		takeawayKotPrinter:'',
		enableDeafalutBagCharge:false,
		callerid:{
			port:'',
			connected:false
		},
		realsePrinter:{
			'MAIN_RELEASE':'',
			'AFTERS_RELEASE':'',
			'STARTER_RELEASE':'',
			'DRINKS_RELEASE':''
		},
		printer:{
			id:'',
			name:'',
			connected:false,
			lineLength:48,
			type:$scope.aiv_printer_types[0],
			paper:$scope.aiv_paper_sizes[0].type,
			cmd_cut:default_print_cmds.cut,
			cmd_don:default_print_cmds.don,
			cmd_doff:default_print_cmds.doff,
			cmd_bon:default_print_cmds.bon,
			cmd_boff:default_print_cmds.boff,
			cmd_cashdrawer:default_print_cmds.cashdrawer,
			cmd_lon:default_print_cmds.lon,
			cmd_loff:default_print_cmds.loff,
			enable_cut:true,
			usage:'Main',
			dept:'None'
		},
		main_printer:{
			id:'',
			name:'',
			connected:false,
			lineLength:48,
			type:$scope.aiv_printer_types[0],
			paper:$scope.aiv_paper_sizes[0].type,
			cmd_cut:default_print_cmds.cut,
			cmd_don:default_print_cmds.don,
			cmd_doff:default_print_cmds.doff,
			cmd_bon:default_print_cmds.bon,
			cmd_boff:default_print_cmds.boff,
			cmd_lon:default_print_cmds.lon,
			cmd_loff:default_print_cmds.loff,
			cmd_cashdrawer:default_print_cmds.cashdrawer,
			enable_cut:true
		},
		label_printer:{
			selected:false,
			name:'',
			connected:false,
			lineLength:48,
			type:$scope.aiv_printer_types[0]
		},
		credits:{
			max_credit_amount:100,
			max_credit_period:30
		},
		order_type:'',
		local_ip:'',
		localdb_ip:'',
		templates:{
			options:$scope.backTemplateOptions,
			selected:$scope.backTemplate
		},
		online_order: angular.copy($scope.onlineOrder),
		printers:[],
		call_order: angular.copy($scope.callOrder),
		justeat: angular.copy($scope.justEat),
		pos_settings: angular.copy($scope.POSSettings),
		default_btns: angular.copy($scope.defaultBtns),
		dept_receiptCount:angular.copy($scope.dept_receiptCount),
		common_printer_settings:angular.copy($scope.commonPrintSettings),
		payment_methods:angular.copy($scope.PaymentMethods),
		other_settings:angular.copy($scope.OtherSettings)
	};
	$scope.aiv_settings = {
		selected : '',
		types:[
			{id:'TERMINAL',name:'Terminal'},
			{id:'PRINTER',name:'Printer'},
			{id:'CALLERID',name:'Caller ID'},
			{id:'KEYBOARD',name:'Keyboard'},
			{id:'LOYALTY',name:'Loyalty'},
			{id:'DRIVERS',name:'Drivers'},
			{id:'DISCOUNTS',name:'Discounts'},
			{id:'PRDT_DEPT',name:'Product Depts'},
			{id:'PRDT_GROUP',name:'Product Groups'},
			{id:'PAY_METHODS',name:'Payment Methods'},
			{id:'DEFAULTS',name:'Defaults'},
			{id:'OTHER_SETTINGS',name:'Other Settings'},
			{id:'BIO_SETTINGS',name:'Bio Settings'}
		]
	};
	
	if($rootScope.aiv_info.enable_sms=="TRUE"){
		$scope.aiv_settings.types.splice($scope.aiv_settings.types.length-2,0,{id:'SMS',name:'Message'});
	}
		
	$scope.aiv_reports = {
		selected : '',
		types:[
				{id:'XREPORT',name:'X Reports'},
				{id:'ZREPORT',name:'Z Reports'},
				{id:'VOIDREPORT',name:'Void Report'},
				{id:'SLAESSHEET',name:'Sales sheet'},
				{id:'STOCKUPDATE',name:'Stock update'},
				{id:'DREPORT',name:'Daily Product Sales Report'},
			]
	};
	$scope.term_types = [
		{id:'FRONT',name:'Front Terminal'},
		{id:'BACK',name:'Back Terminal'},
		{id:'BOTH',name:'Single Terminal'}
	];

	if (!angular.isArray($localstorage.getArray(AIV_CONSTANTS.LS_PREFIX+'formCheckout'))) {
		$scope.formCheckout = $localstorage.getObject(AIV_CONSTANTS.LS_PREFIX+'formCheckout');
	}else {
		$scope.formCheckout = {
			"pending_data":{"order_id":'',"order_no":'',"order_seq":'',"pending_rev":'',"order_rev":'',"cart":'',"docid":'',"bagCharge":''},
			"shipping_lines": [{
				"method_id": "",
				"method_title": "",
				"total": ""
			}],
			"coupon_lines": [],
			"payment_details": {
			  "method_id": "",
			  "method_title": "",
			  "paid": false
			},
			"billing_address": {
				"first_name": "",
				"last_name": "",
				"address_1": "",
				"address_2": "",
				"city": "",
				"state": "",
				"postcode": "",
				"country": $scope.base_country,
				"email": "",
				"phone": "",
				"company": ""
			},
			"customer_id": "guest",
			"sameAddress": true,
			"shipping_address": {
				"first_name": "",
				"last_name": "",
				"address_1": "",
				"address_2": "",
				"city": "",
				"state": "",
				"postcode": "",
				"country": $scope.base_country
			},
			"shipping_note": "",
			"customer_meta":{
				"docid":''
			}
		};
	}
	if (!angular.isArray($localstorage.getArray(AIV_CONSTANTS.LS_PREFIX+'enable_free_delivery')))  {
		$scope.settings_data.enable_free_delivery = $localstorage.getObject(AIV_CONSTANTS.LS_PREFIX+'enable_free_delivery');
	}
	if (!angular.isArray($localstorage.getArray(AIV_CONSTANTS.LS_PREFIX+'free_delivery_amt')))  {
		$scope.settings_data.free_delivery_amt = $localstorage.getObject(AIV_CONSTANTS.LS_PREFIX+'free_delivery_amt');
	}
	if (!angular.isArray($localstorage.getArray(AIV_CONSTANTS.LS_PREFIX+'enablePayOff')))  {
		$scope.settings_data.enablePayOff = $localstorage.getObject(AIV_CONSTANTS.LS_PREFIX+'enablePayOff');
	}
	if (!angular.isArray($localstorage.getArray(AIV_CONSTANTS.LS_PREFIX+'logoInReceipt')))  {
		$scope.settings_data.logoInReceipt = $localstorage.getObject(AIV_CONSTANTS.LS_PREFIX+'logoInReceipt');
	}
	if (!angular.isArray($localstorage.getArray(AIV_CONSTANTS.LS_PREFIX+'enableDeafalutBagCharge')))  {
		$scope.settings_data.enableDeafalutBagCharge = $localstorage.getObject(AIV_CONSTANTS.LS_PREFIX+'enableDeafalutBagCharge');
	}
	if (!angular.isArray($localstorage.getArray(AIV_CONSTANTS.LS_PREFIX+'takeawayKotPrinter')))  {
		$scope.settings_data.takeawayKotPrinter = $localstorage.getObject(AIV_CONSTANTS.LS_PREFIX+'takeawayKotPrinter');
	}
	if (!angular.isArray($localstorage.getArray(AIV_CONSTANTS.LS_PREFIX+'realsePrinter'))) {
		$scope.settings_data.realsePrinter = $localstorage.getObject(AIV_CONSTANTS.LS_PREFIX+'realsePrinter');
	}
    $scope.grand = !angular.isArray($localstorage.getArray(AIV_CONSTANTS.LS_PREFIX+'grand')) ? $localstorage.getArray(AIV_CONSTANTS.LS_PREFIX+'grand') : {
        "Total": 0,
        "Weight": 0,
        "Shipping": 0,
		"Discount": 0,
		"Quantity":0,
		"Tax":0,
		"deposit":0,
		"Total_tax_percent":0
    }
	
	$scope.footerClick = function(type){
		$scope.show_sub.cook_inst = false;
		var itemdetails = {};//{"parent":"Prefix###PH","raw":"No###TO"};
		
		var item = type+"###TO";
		
		itemdetails["title"]= item.split(AIV_CONSTANTS.OPTION_SEPARATOR)[0];
		itemdetails["stitle"]= $scope.getShowName(itemdetails.title);
		itemdetails["color"]= $scope.getColor(item.split(AIV_CONSTANTS.OPTION_SEPARATOR)[1]);
		itemdetails["type"]= "PRE";
		itemdetails["raw"]= type+"###TO";
		itemdetails["parent"]="Prefix###PH";
		
		$scope.onClickOthers(itemdetails);
	}
	
	$scope.noClick = function(){
		$scope.show_sub.cook_inst = false;
		var itemdetails = {};//{"parent":"Prefix###PH","raw":"No###TO"};
		
		var item = "No###TO";
		
		itemdetails["title"]= item.split(AIV_CONSTANTS.OPTION_SEPARATOR)[0];
		itemdetails["stitle"]= $scope.getShowName(itemdetails.title);
		itemdetails["color"]= $scope.getColor(item.split(AIV_CONSTANTS.OPTION_SEPARATOR)[1]);
		itemdetails["type"]= "PRE";
		itemdetails["raw"]="No###TO";
		itemdetails["parent"]="Prefix###PH";
		
		$scope.onClickOthers(itemdetails);
	}
	
	$scope.ExtraClick= function(value){
		$scope.show_sub.cook_inst = false;
		var itemdetails = {};//{"parent":"Prefix###PH","raw":"No###TO"};
		
		var item = value+"###TO";
		
		itemdetails["title"]= item.split(AIV_CONSTANTS.OPTION_SEPARATOR)[0];
		itemdetails["stitle"]= $scope.getShowName(itemdetails.title);
		itemdetails["color"]= $scope.getColor(item.split(AIV_CONSTANTS.OPTION_SEPARATOR)[1]);
		itemdetails["type"]= "PRE";
		itemdetails["raw"]= value+"###TO";
		itemdetails["parent"]="Prefix###PH";
		
		$scope.onClickOthers(itemdetails);
	}
	
	var get_product_price = function(product,string){
		if(string){
			return product.price;
		}
		return parseFloat(product.price);
	}
	
	$scope.onClickOthers = function(selectitem){
		//process as per product type.
		//suboptions then add to the option of the selected product.
		
		//$scope.selected_postfix =false;
		
		if(selectitem.type=="PRE")
		{
		//add it to the suboptions
			if(selectitem.raw.split(AIV_CONSTANTS.OPTION_SEPARATOR)[1].includes("N"))
			{
				//$scope.otheroptions = $scope.otheroptions.next;
			}
			else if(selectitem.stitle.includes("Next"))
			{
			
			
				var needDClick =[];
				$scope.otheroptions = $scope.otheroptions.next;
	
				angular.forEach($scope.otheroptions, function(item) {
				
					if(item.raw.split(AIV_CONSTANTS.OPTION_SEPARATOR)[1].includes('D'))
					{
						needDClick.push(item);
					}
				
				//$scope.current_options[item.name] = '';
				});
				
				
				$scope.checkDefaultClick(needDClick);
			
				
			}
			else if (selectitem.stitle.includes("Back"))
			{
				//$scope.otheroptions = $scope.otheroptionsstart;
				var needDClick =[];
				$scope.otheroptions = $scope.otheroptions.prev;
	
				angular.forEach($scope.otheroptions, function(item) {
				
					if(item.raw.split(AIV_CONSTANTS.OPTION_SEPARATOR)[1].includes('D'))
					{
						needDClick.push(item);
					}
				
				//$scope.current_options[item.name] = '';
				});
				
				
				$scope.checkDefaultClick(needDClick);
			}
			else
			$scope.updateAttributeOptions(selectitem.parent,selectitem.raw,null);
		}
		
		if(selectitem.type=="CAT")
		{
			$scope.getProducts(selectitem.parent,true);
		}
		
		
		if(selectitem.type=="SUB")
		{
			if(angular.isDefined($scope.sel_product.ament) && $scope.sel_product.ament){
			   $scope.sel_product.title = $scope.sel_product.title+' '+selectitem.stitle;
			   if(selectitem.title.includes('(')){
				   var price  = selectitem.title.split("(")[1];
				   price = price.replace(/[)+]/g,'');
				   
				   if(angular.isDefined($scope.sel_product.sel_variations))
				   $scope.sel_product.sel_variations.price = parseFloat($scope.sel_product.sel_variations.price)+parseFloat(price);
				   else
					$scope.sel_product.price=parseFloat($scope.sel_product.price)+parseFloat(price);
					
				   $scope.calculateTotal($scope.idSelectedItem.item,$scope.idSelectedItem.index);
				   $scope.exitSub(false);
			   }
			   $scope.sel_product.ament =false;
			   return;
			}
			$scope.sub_categories.subcategory_mode = false;
			if(selectitem.raw.split(AIV_CONSTANTS.OPTION_SEPARATOR)[1].includes("C"))
			{
			
				//post fix.
				$scope.selected_postfix =true;
				$scope.updateAttributeOptions(selectitem.parent.fname,selectitem.raw,null);
			}
			else
			{
				/****************************************************************************/
				var cartitem = $scope.sel_product;
				if(!cartitem.hasOwnProperty("sel_variations"))
				{
					cartitem['sel_variations']={};
				}
				if(!cartitem.sel_variations.hasOwnProperty("attributes"))
				{
					cartitem.sel_variations['attributes']={};
				}
				if(!cartitem.sel_variations.hasOwnProperty("attributestoshow"))
				{
					cartitem.sel_variations['attributestoshow']={};
				}
				/*cartitem.sel_variations.attributes = $scope.sel_variations.attributes;
				cartitem.sel_variations.attributestoshow = $scope.current_display_options;
				cartitem.sel_variations.price =$scope.sel_variations.price;*/
				
				var attribute_name = selectitem.parent.slug;
				var i=1,found = true,opt_name = attribute_name;
				while(found){
					found = false;
					angular.forEach(cartitem.sel_variations.attributes,function(value,key){
						if (cartitem.sel_variations.attributes.hasOwnProperty(opt_name)) {
							opt_name = attribute_name;
							opt_name+=i;
							i++;
							found = true;
						}
					});
				}

				var freelimit = 0;
				if(cartitem.hasOwnProperty("freelimit"))
				{
					freelimit = cartitem.freelimit;
				}
				
				var optionname = $scope.isDefault(selectitem.raw,$scope.selected_attr_add,freelimit,cartitem);
				var splt = selectitem.raw.split(AIV_CONSTANTS.OPTION_SEPARATOR);
				if (splt.length==2&&splt[1].includes('X'))
				{
					;
				}
				else
				{
					if($scope.selected_postfix==true)
					{
						var spltarr = optionname.split(AIV_CONSTANTS.OPTION_SEPARATOR);
						if(spltarr.length>1)
						{
							cartitem.sel_variations.attributes[ opt_name ] = spltarr[0]+ " "+$scope.selected_attr_add+"###"+spltarr[1];
						}
						else
							cartitem.sel_variations.attributes[ opt_name ] = spltarr[0]+ " "+$scope.selected_attr_add;
					}else{
						if($scope.selected_attr_add == 'NOP'){
							cartitem.sel_variations.attributes[ opt_name ] = optionname;
						}else{
							cartitem.sel_variations.attributes[ opt_name ] = $scope.selected_attr_add?($scope.selected_attr_add+ " "+optionname):optionname;
						}
					}
				}
				
				$scope.selected_attr_add="";
				$scope.selected_postfix=false;
				//var option_name = 
				//$scope.current_display_options[ option_name ] = option_select+$scope.selected_attr_add;

				var sel_product_price = parseFloat($scope.sel_product.price);
				$scope.filterUnique(cartitem.sel_variations.attributes);
				if(cartitem.hasOwnProperty("freelimit"))
				{
					
					$scope.filterFree(cartitem.sel_variations.attributes,cartitem.freelimit);
				}

				cartitem.sel_variations.attributestoshow= $scope.processDisplayLink(cartitem.sel_variations.attributes,cartitem.sel_variations);
				var optionCount =0;

				angular.forEach(cartitem.sel_variations.attributes,function(value,key){
					if (cartitem.sel_variations.attributes.hasOwnProperty(key)) {
						var opt = cartitem.sel_variations.attributes[key];
						var value = opt.match(/\(([^)]+)\)/);
						if(value != null && value.length > 1){
							value[1] = value[1].replace(/[£+]/g,"");
							sel_product_price+= parseFloat(value[1]);
							
						}
						optionCount++;
					}
				});
			
				cartitem.sel_variations.price = parseFloat(sel_product_price.toFixed(2));
				$scope.calculateTotal($scope.idSelectedItem.item,$scope.idSelectedItem.index);
				
				if($scope.idSelectedItem.index == $scope.cartItems.length-1){
					$ionicScrollDelegate.$getByHandle('cartScroll').scrollBottom();
				}
					
				var isMultiple = $scope.isOptionPropertyExists("MULTIPLE",selectitem.parent.slug);
				if(angular.isUndefined(selectitem.parent.slug) || (!isMultiple && !$scope.isOptionPropertyExists("FIXED",selectitem.parent.slug))){
					$scope.optionClick = {name:'',count:0};
					if($scope.otheroptions.next!=null)//(str && str.includes("X"))
					{
						//check next action.
						$scope.processNext(selectitem);
					}else{
						//Exit suboptions
						$scope.exitSub(false);
					}
				}else{
					$scope.compulsory_option_mode = false;
					if(isMultiple && angular.isDefined(selectitem.parent.slug)){
						var nameSplitArr = selectitem.parent.slug.split(AIV_CONSTANTS.OPTION_SEPARATOR);
						var Mindex = nameSplitArr[1].indexOf("M");
						if(nameSplitArr[1].length-1>Mindex && !isNaN(nameSplitArr[1].charAt(Mindex+1))){
							var multi_count = Number(nameSplitArr[1].charAt(Mindex+1));
							if(multi_count){
								if($scope.optionClick.name==selectitem.parent.slug){
									$scope.optionClick.count++;
									if($scope.optionClick.count>=multi_count){
										//Multi option limit reached..proceed to next option
										if($scope.otheroptions.next!=null)//(str && str.includes("X"))
										{
											//check next action.
											$scope.processNext(selectitem);
										}else{
											//Exit suboptions
											$scope.exitSub(false);
										}
									}
								}else{
									$scope.optionClick = {name:selectitem.parent.slug,count:1};
								}
							}
						}
					}else{
						$scope.optionClick = {name:'',count:0};
					}
				}
			}
		}
	}
	$scope.amentItem=function(){
		 $scope.sel_product.ament =true;
		
	}
	
	$scope.optionClick = {name:'',count:0};
	$scope.isOptionPropertyExists = function(type,option){
		var exists = false;
		if(option != undefined){
			var nameSplitArr = option.split(AIV_CONSTANTS.OPTION_SEPARATOR);
			if(nameSplitArr.length){
				switch(type){
					case 'COMPULSORY':
						exists = nameSplitArr[1].includes("Z");
						break;
					case 'FIXED':
						exists = nameSplitArr[1].includes("Y");
						break;
					case 'MULTIPLE':
						exists = nameSplitArr[1].includes("M");
						break;
					case 'DEFAULT':
						exists = nameSplitArr[1].includes("D");
						break;
				}
			}
		}
		return exists;
	}
	
	$scope.processNext = function(selectitem){
		if(angular.isDefined(selectitem.raw)){
			var rawSplitArr = selectitem.raw.split(AIV_CONSTANTS.OPTION_SEPARATOR);
			if(rawSplitArr.length >1){
				//Skip/Select next options
				var Lindex = rawSplitArr[1].indexOf("L");
				if(rawSplitArr[1].length-1>Lindex && !isNaN(rawSplitArr[1].charAt(Lindex+1))){
					var skip_count = Number(rawSplitArr[1].charAt(Lindex+1));
					for(var i=0;i<skip_count;i++){
						if($scope.otheroptions.length){
							if($scope.otheroptions.next!=null)//(str && str.includes("X"))
							{
								//check next action.
								$scope.nextSub($scope.otheroptions.next!=null&&$scope.otheroptions.next.length>0);
								selectitem = $scope.otheroptions.length?$scope.otheroptions[0]:selectitem;
								//$scope.processNext($scope.otheroptions[i]);
							}else{
								//Exit suboptions
								$scope.exitSub(false);
								return;
							}
						}
					}
				}
				
			}
		}
		if(angular.isDefined(selectitem.parent.fname)){
			var str = selectitem.parent.fname.split(AIV_CONSTANTS.OPTION_SEPARATOR)[1];
			if($scope.otheroptions.next!=null)//(str && str.includes("X"))
			{
				$scope.otheroptions = $scope.otheroptions.next;
				var fixed_options = false;
				for(var i=0;i<$scope.otheroptions.length;i++){
					var nameSplitArr = $scope.otheroptions[i].parent.fname.split(AIV_CONSTANTS.OPTION_SEPARATOR);
					if(nameSplitArr.length>1 && nameSplitArr[1].includes("Y")){
						fixed_options = true;
						//Add default options to cart
						$scope.onClickOthers($scope.otheroptions[i]);
					}
				}
				if($scope.otheroptions.length&&fixed_options){
					if($scope.otheroptions.next!=null)//(str && str.includes("X"))
					{
						//check next action.
						$scope.nextSub($scope.otheroptions.next!=null&&$scope.otheroptions.next.length>0);
						//$scope.processNext($scope.otheroptions[i]);
					}else{
						//Exit suboptions
						$scope.exitSub(false);
						return;
					}
				}
				if($scope.otheroptions.length){
					var nameSplitArr = $scope.otheroptions[0].parent.fname.split(AIV_CONSTANTS.OPTION_SEPARATOR);
					if(nameSplitArr.length>1 && nameSplitArr[1].includes("Z")){
						//Compulsory options--disable buttons
						$scope.compulsory_option_mode = true;
					}else{
						$scope.compulsory_option_mode = false;
					}
				}else{
					$scope.compulsory_option_mode = false;
				}
			}
			else
			{
				if (selectitem.raw.split(AIV_CONSTANTS.OPTION_SEPARATOR)[1].includes('X'))
				{
					//navigation from sub to next list
					var ind = selectitem.raw.indexOf('X');
					var listnum = selectitem.raw.charAt(ind+1);
					var requiredlist = $scope.otheroptionsstart;
					for(var i =1;i<parseInt(listnum);i++)
					{
						requiredlist = requiredlist.next;
					}
					if(requiredlist.length>0)
					{
						$scope.otheroptions = requiredlist;
						//add a back button here.
						if(!$scope.otheroptions[$scope.otheroptions.length-1].stitle.includes("Back"))
						{
							var itemdetails = {};//{"parent":"Prefix###PH","raw":"No###TO"};
					
							var item = "Back###TO";
							
							itemdetails["title"]= item.split(AIV_CONSTANTS.OPTION_SEPARATOR)[0];
							itemdetails["stitle"]= $scope.getShowName(itemdetails.title);
							itemdetails["color"]= $scope.getColor(item.split(AIV_CONSTANTS.OPTION_SEPARATOR)[1]);
							itemdetails["type"]= "PRE";
							itemdetails["raw"]="Back###TO";
							itemdetails["parent"]="Action###PH";
							$scope.otheroptions.push(itemdetails);
						}
						if($scope.otheroptions.length){
							var nameSplitArr = $scope.otheroptions[0].parent.fname.split(AIV_CONSTANTS.OPTION_SEPARATOR);
							if(nameSplitArr.length>1 && nameSplitArr[1].includes("Z")){
								//Compulsory options--disable buttons
								$scope.compulsory_option_mode = true;
							}else{
								$scope.compulsory_option_mode = false;
							}
						}else{
							$scope.compulsory_option_mode = false;
						}
					}
				}
			}
		}
		
	}
	
	$scope.onClickSub = function(subcat){
		if($scope.compulsory_option_mode){
			return;
		}
		$scope.optionClick = {name:'',count:0};
		$scope.sub_categories.selected = subcat.slug;
		$scope.getProducts(subcat,true);
	}
	
	$scope.onClickProduct = function(product){
		if(angular.isDefined(product.meta.wc_productdata_options) && angular.isDefined(product.meta.wc_productdata_options[0].prdt_dept) && product.meta.wc_productdata_options[0].prdt_dept){
			if($scope.edit_order_flags.order_status == 'kitchen-ready'){
				$scope.showCheckoutMsg('Warning','This product needs to be send to kitchen, but this order is already prepared. Please make another order');
				return;
			}
		}
		$scope.optionClick = {name:'',count:0};
		if($scope.terminalData.type != 'FRONT'  && $scope.startup.action!='TABLEVIEW' && !$scope.selected_shipping.hasOwnProperty('title')){
			$scope.openShippingModal();
			/*if(product.product_id != ''){
				return;
			}*/
		}else if($scope.selected_shipping.id != 'sitin' && $scope.selected_shipping.id != '' && $scope.formCheckout.customer_id=='guest'){
			$scope.openCustomerModal();
		}

		if (angular.isUndefined(product.quantity)) {
            product.quantity = 1;
        }
		
		var show_options = true;
		if(angular.isDefined($scope.selected_shipping.id) && !$scope.selected_shipping.id && !$scope.defaultBtns.show_takeaway_options){
			show_options = false;
		}
		$scope.sub_categories.subcategory_mode = false;
		if(product.attributes.length){
			//$scope.selectOptions(product);
			product.sel_variations = {};
			product.sel_variations.attributes={};
			product.sel_variations.price = get_product_price(product,true);
			product.sel_variations.attributestoshow={};
			$scope.sel_variations={};
			$scope.intoCart(product);
			
			
			if(product.meta.wc_productdata_options[0].hasOwnProperty('prdt_configs'))
			{
				//if(product.meta.wc_productdata_options[0].prdt_configs.split(AIV_CONSTANTS.OPTION_SEPARATOR)[0].includes('X'))
				//{
					if(product.type!="simple" && show_options)
						$scope.editProductOptions();
				//}
			}
			
			
			
			
		}else{
			$scope.sel_variations={};
			$scope.intoCart(product);
			
			if(angular.isDefined(product.meta.wc_productdata_options) && product.meta.wc_productdata_options[0].hasOwnProperty('prdt_configs'))
			{
				if(product.meta.wc_productdata_options[0].prdt_configs.split(AIV_CONSTANTS.OPTION_SEPARATOR)[0].includes('X'))
				{
					if(product.type!="simple" && show_options)
						$scope.editProductOptions();
				}
			}
		}
		
		//Exit from deal products
		if($scope.sel_category == $scope.deal_category){
			loadDefaultProduct();
		}
	}

	var calculate_product_tax = function(product){
		var tax_amt = 0,price = 0;
		if(product.taxable){
			if (angular.isUndefined(product.sel_variations)) {
				price = get_product_price(product,false);
			}else{
				price = $scope.parseFloatNoNaN(product.sel_variations.price);
			}
			
			if($scope.grand.Discount){
				price = price - ($scope.grand.Discount/$scope.grand.Quantity);
			}
			
			if(product.tax_class == null || product.tax_class == ""){
				product.tax_class = "standard";
			}
			var tax_classObj = $filter('filter')($scope.taxes,{class:product.tax_class});
			if(tax_classObj.length){
				tax_amt = product.quantity * price * parseFloat(tax_classObj[0].rate)/100;
			}
		}
		
		if(product.quantity>1 && product.tax_amt){
			$scope.grand.Tax-=product.tax_amt;
		}
		
		$scope.grand.Tax+=tax_amt;
		product.tax_amt = tax_amt;
	}
	
	$scope.calculate_cart_tax = function(end_discount = 0){
		$scope.grand.Tax = 0;
		if(end_discount)
			$scope.grand.Total = 0;
		for(var i=0;i<$scope.cartItems.length;i++){
			var product = $scope.cartItems[i];
			var tax_amt = 0;
			var price = get_product_price(product,false)*product.quantity;
			var product_discount = ($scope.grand.Discount/$scope.grand.Quantity)*product.quantity;
			if(product.taxable){
				if(product.tax_class == null || product.tax_class == ""){
					product.tax_class = "standard";
				}
				var tax_classObj = $filter('filter')($scope.taxes,{class:product.tax_class});
				if(tax_classObj.length){
					if(end_discount){
						//Calculate individual difference 
						var ind_diff =(parseFloat(tax_classObj[0].rate)*end_discount*100)/($scope.grand.Total_tax_percent*(100+parseFloat(tax_classObj[0].rate)));
						price = price - ind_diff;
					}
					tax_amt = (price - product_discount) * parseFloat(tax_classObj[0].rate)/100;
				}
			}
			if(end_discount)
				$scope.grand.Total+= price;
			$scope.grand.Tax+=tax_amt;
			product.tax_amt = tax_amt;
		}
	}

	

	$scope.intoCartCooking = function(product) {
		var item = angular.copy(product);
		var cartitem =  $scope.sel_product;
		if(cartitem.type=="simple")
		{
			if(!cartitem.hasOwnProperty("sel_variations"))
			{
				cartitem['sel_variations']={};
			}
			if(!cartitem.sel_variations.hasOwnProperty("attributes"))
			{
				cartitem.sel_variations['attributes']={};
			}
			if(!cartitem.sel_variations.hasOwnProperty("attributestoshow"))
			{
				cartitem.sel_variations['attributestoshow']={};
			}
			cartitem.sel_variations.attributes = $scope.sel_variations.attributes;
			cartitem.sel_variations.attributestoshow = $scope.current_display_options;
			cartitem.sel_variations.price = parseFloat($scope.sel_variations.price.toFixed(2));
				
			//add to current attributes if anymore

			/*angular.forEach($scope.sel_variations.attributes,function(value,key){
				cartitem.sel_variations.attributes[key]=value;
			});*/
		}
		else
		{
			if(!cartitem.hasOwnProperty("sel_variations"))
			{
				cartitem['sel_variations']={};
			}
			if(!cartitem.sel_variations.hasOwnProperty("attributes"))
			{
				cartitem.sel_variations['attributes']={};
			}
			if(!cartitem.sel_variations.hasOwnProperty("attributestoshow"))
			{
				cartitem.sel_variations['attributestoshow']={};
			}
			cartitem.sel_variations.attributes = $scope.sel_variations.attributes;
			cartitem.sel_variations.attributestoshow = $scope.current_display_options;
			cartitem.sel_variations.price =$scope.sel_variations.price;
		}
		$scope.calculateTotal($scope.idSelectedItem.item,$scope.idSelectedItem.index);
		 
    }
	
    $scope.intoCart = function(product) {
		var item = angular.copy(product);
		var add_flg = true,product_group='';
		if(angular.isDefined(item.meta.wc_productdata_options)){
			add_flg = false;
			if(item.meta.wc_productdata_options[0]._tiedtype == 'P'){
				var tied_products = item.meta.wc_productdata_options[0]._tieditem.split(',');
				for(var i=0;i<$scope.cartItems.length;i++){
					if(tied_products.indexOf($scope.cartItems[i].id.toString()) != -1){
						add_flg = true;
						break;
					}
				}
			}else if(item.meta.wc_productdata_options[0]._tiedtype == 'C'){
				var tied_category = item.meta.wc_productdata_options[0]._tieditem.split(',');
				for(var i=0;i<$scope.cartItems.length;i++){
					if(tied_category.indexOf($scope.cartItems[i].categories[0]) != -1){
						add_flg = true;
						break;
					}
				}
			}else add_flg = true;
			
			if(angular.isDefined(item.meta.wc_productdata_options[0].group)){
				product_group = item.meta.wc_productdata_options[0].group;
			}
			
			if($scope.hf_loyalty.enabled){
				if(angular.isDefined(item.meta.wc_productdata_options[0].points)){
					item.points = item.meta.wc_productdata_options[0].points;
				}else{
					item.points = parseInt($scope.hf_loyalty.sales.points);
				}
				item.org_points = item.points;
			}
		}
		
		if(add_flg){
			if(!jQuery.isEmptyObject($scope.sel_variations)){
				item.sel_variations = $scope.sel_variations;
			}
			
			var dup_flag = false;
			/*for(var i=0;i<$scope.cartItems.length;i++){
				if(item.id == $scope.cartItems[i].id){
					if(angular.isDefined(item.sel_variations) && angular.isDefined($scope.cartItems[i].sel_variations) && angular.equals(item.sel_variations, $scope.cartItems[i].sel_variations)){
						dup_flag = true;
						$scope.cartItems[i].quantity+=1;
						$scope.setSelectedItem(i,$scope.cartItems[i]);
						//$scope.getTotal($scope.cartItems[i],i);
						$scope.calculateTotal($scope.cartItems[i],i);
						break;
					}else if(angular.isUndefined(item.sel_variations)&&angular.isUndefined($scope.cartItems[i].sel_variations) && item.product_id != ""){
						dup_flag = true;
						$scope.cartItems[i].quantity+=1;
						$scope.setSelectedItem(i,$scope.cartItems[i]);
						//$scope.getTotal($scope.cartItems[i],i);
						$scope.calculateTotal($scope.cartItems[i],i);
						break;
					}
				}
			}*/
			
			if(!dup_flag){
				product.sel_color = true;
				if(item.type=="variable"&&item.sel_variations.hasOwnProperty("attributes"))
				item.sel_variations["attributestoshow"] = $scope.processDisplay(item.sel_variations.attributes);
				var prdt_grp =[];
				item["newstatus"]=true;
				item["edit"]=true;
				var grp_found = false;
				if(!grp_found){
					$scope.cartItems.push(item);
					$scope.setSelectedItem($scope.cartItems.length-1,item);
				}
				if(product_group && $scope.enable_product_grouping && $scope.startup.action=='TABLEVIEW'){
					/*for(var c=$scope.cartItems.length-1;c>=0;c--){
						if(angular.isDefined($scope.cartItems[c].meta.wc_productdata_options) && angular.isDefined($scope.cartItems[c].meta.wc_productdata_options[0].group) && product_group==$scope.cartItems[c].meta.wc_productdata_options[0].group){
							$scope.cartItems.splice(c+1,0,item);
							$scope.getTotal($scope.cartItems[c+1],c+1);
							$scope.setSelectedItem(c+1,$scope.cartItems[c+1]);
							grp_found = true;
							break;
						}
					}*/
					if(angular.isUndefined($scope.cartItems.groupBy)){
						$scope.cartItems.groupBy = function(prop) {
							return this.reduce(function(groups, item) {
							const val = item.meta.wc_productdata_options[0][prop]
							groups[val] = groups[val] || []
							groups[val].push(item)
							return groups
							}, {})
						}
					}

					prdt_grp = $scope.cartItems.groupBy("group");
					$scope.cartItems=[];
					for(var k=0;k<$scope.product_groups.length;k++){
						if(prdt_grp[$scope.product_groups[k]]){
							$scope.cartItems =$scope.cartItems.concat(prdt_grp[$scope.product_groups[k]]);
							delete  prdt_grp[$scope.product_groups[k]];
						}
					}
					for(var key in prdt_grp) {
						if (prdt_grp.hasOwnProperty(key)) {
							$scope.cartItems = $scope.cartItems.concat(prdt_grp[key]);
						}
					}
					/* if(prdt_grp.length){
						for(var k=0;k<prdt_grp.length;k++){
							$scope.cartItems = $scope.cartItems.concat(prdt_grp[k]);
						}
					} */
				}
				var index = $scope.cartItems.findIndex(e=>(e ===item))
				$scope.setSelectedItem(index,$scope.cartItems[index]);

				$ionicScrollDelegate.$getByHandle('cartScroll').scrollBottom();
				
			}
			$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'cart', $scope.cartItems);

			console.log($scope.cartItems);
		}else {
			$ionicPopup.alert({
				title: 'Warning',
				template: item.meta.wc_productdata_options[0]._tiedmessage
		   });
		}
    }

	$scope.DealArr = [];
	$scope.calculateTotal = function(product,index){
        $scope.getTotal(product,index);
		$scope.getDiscount();
		$scope.calculate_cart_tax();
	}
	
	$scope.offer_discount = 0;
	$scope.cartDiscounts = [];
    $scope.getTotal = function(product,index) {

        var mystring = "";
        var total = 0;
        var weight = 0;

        /*if (angular.isUndefined(product.quantity)) {
            product.quantity = 1;
        }

		if (angular.isUndefined(product.sel_variations)) {
			product.total = parseFloat(product.price) * product.quantity;
		}else{
			product.total = parseFloat(product.sel_variations.price) * product.quantity;
		}

		if($scope.cartItems.length-1 == index){
			$scope.getDealDiscount();
		}
					
        $scope.grand.Total = 0;
		$scope.grand.Quantity = 0;
        $scope.grand.Weight = 0;
		$scope.grand.Total_tax_percent = 0;

        for (var i=0;i<$scope.cartItems.length;i++) {
            $scope.grand.Total += $scope.cartItems[i].total;
			$scope.grand.Quantity += $scope.cartItems[i].quantity;
			weight = ($scope.cartItems[i].weight=='' || $scope.cartItems[i].weight==null)?0:$scope.cartItems[i].weight;
			$scope.grand.Weight += ($scope.cartItems[i].quantity*weight);
			
			if($scope.cartItems[i].taxable){
				if($scope.cartItems[i].tax_class == null || $scope.cartItems[i].tax_class == ""){
					$scope.cartItems[i].tax_class = "standard";
				}
				var tax_classObj = $filter('filter')($scope.taxes,{class:$scope.cartItems[i].tax_class});
				if(tax_classObj.length){
					$scope.grand.Total_tax_percent+=parseFloat(tax_classObj[0].rate);
				}
			}
        }*/
		

		for (var i=0;i<$scope.cartItems.length;i++) {
			if (angular.isUndefined($scope.cartItems[i].quantity)) {
				$scope.cartItems[i].quantity = 1;
			}
			if (angular.isUndefined($scope.cartItems[i].sel_variations)) {
				$scope.cartItems[i].total = parseFloat($scope.cartItems[i].price) * $scope.cartItems[i].quantity;
			}else{
				$scope.cartItems[i].total = parseFloat($scope.cartItems[i].sel_variations.price) * $scope.cartItems[i].quantity;
			}
		}
		
		$scope.getDealDiscount(false);
		
		$scope.grand.Total = 0;
		$scope.grand.Quantity = 0;
        $scope.grand.Weight = 0;
		$scope.grand.Total_tax_percent = 0;

        for (var i=0;i<$scope.cartItems.length;i++) {
            $scope.grand.Total += $scope.cartItems[i].total;
			$scope.grand.Quantity += $scope.cartItems[i].quantity;
			weight = ($scope.cartItems[i].weight=='' || $scope.cartItems[i].weight==null)?0:$scope.cartItems[i].weight;
			$scope.grand.Weight += ($scope.cartItems[i].quantity*weight);
			
			if($scope.cartItems[i].taxable){
				if($scope.cartItems[i].tax_class == null || $scope.cartItems[i].tax_class == ""){
					$scope.cartItems[i].tax_class = "standard";
				}
				var tax_classObj = $filter('filter')($scope.taxes,{class:$scope.cartItems[i].tax_class});
				if(tax_classObj.length){
					$scope.grand.Total_tax_percent+=parseFloat(tax_classObj[0].rate);
				}
			}
        }
				
		//calculate VAT
		//calculate_product_tax(product);
		
        $localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'cart', $scope.cartItems);
        $localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'grand', $scope.grand);
    }
	
	var getDealInfo = function(dealcode){
		return $filter('filter')($scope.product_deals,{deal_code:dealcode},true);
	}
	
	$scope.deal_status = {status:false,msg:"",show_msg:false};
	$scope.deal_btn_clicked = {status:false,apply:false};
	$scope.applyOffer = function(){
		$scope.deal_btn_clicked = {status:true,apply:true};
		$scope.calculateTotal($scope.idSelectedItem.item,$scope.idSelectedItem.index);
	}
	
	$scope.getDealDiscount = function(apply){
		$scope.deal_applied = false;
		$scope.offer_discount = 0;
		$scope.DealArr = [];
		
		for(var c=0;c<$scope.cartItems.length;c++){
			//$scope.cartItems[c].deal_applied = false;
			var cart_product = $scope.cartItems[c];
			if(angular.isDefined(cart_product.meta.wc_productdata_options) && angular.isDefined(cart_product.meta.wc_productdata_options[0]._dealcode) && cart_product.meta.wc_productdata_options[0]._dealcode){
				var dealFlg = $filter('checkdeals')(cart_product);
				
				if(dealFlg){
					var dealGroup = cart_product.meta.wc_productdata_options[0]._dealcode;
					var group_exists = false;
					for (var key in $scope.DealArr) {
						if(key == dealGroup){
							group_exists = true;
							break;
						}
					}
					
					if(dealGroup == 'B1G1'){
						cart_product.deal_applied = angular.isDefined(cart_product.deal_applied)?cart_product.deal_applied:0;
					}
						
					if(!group_exists){
						var dealInfo = getDealInfo(dealGroup);
						if(dealInfo && dealInfo.length){
							$scope.DealArr[dealGroup] = {};
							$scope.DealArr[dealGroup]['products'] = [];
							$scope.DealArr[dealGroup]['msg'] = dealInfo[0].deal_name;//cart_product.meta.wc_productdata_options[0]._dealmsg;
							$scope.DealArr[dealGroup]['show_msg'] = false;
						}
					}
					
					var product_deal_count = angular.isDefined(cart_product.deal_applied)?cart_product.deal_applied:0;
					for(var q=0;q<cart_product.quantity;q++){
						//var prdt_price = angular.isDefined(cart_product.sel_variations)?cart_product.sel_variations.price:cart_product.price;
						var prdt_price = cart_product.price;
						var deal_applied = 0;
						deal_applied = product_deal_count>0?1:0;
						$scope.DealArr[dealGroup]['products'].push({pos:c,price:parseFloat(prdt_price),deal_applied:deal_applied});
						product_deal_count--;
						
					}
					/*for(var q=0;q<cart_product.quantity;q++){
						//var prdt_price = angular.isDefined(cart_product.sel_variations)?cart_product.sel_variations.price:cart_product.price;
						var product_deal_applied = angular.isDefined(cart_product.deal_applied)?cart_product.deal_applied:false;
						var prdt_price = cart_product.price;
						$scope.DealArr[dealGroup]['products'].push({pos:c,price:parseFloat(prdt_price),deal_applied:product_deal_applied});
						
					}*/
				}
			}
		}
		
		for (var DealGroup in $scope.DealArr) {
			var len = $scope.DealArr[DealGroup]['products'].length;
			//Buy 1 Get 1 free offers
			if(DealGroup.indexOf('B1G1') == 0){
				/*if(len%2){
					$scope.DealArr[DealGroup]['show_msg'] = true;
				}else{
					$scope.DealArr[DealGroup]['show_msg'] = false;
				}*/
				/*var exists = $filter('filter')($scope.DealArr[DealGroup]['products'],{deal_applied:0},true);
				if(exists.length>1){
					$scope.DealArr[DealGroup]['show_msg'] = true;
				}*/
				/*if(len>1){
					$scope.DealArr[DealGroup]['show_msg'] = true;
				}*/
				
				if($scope.deal_btn_clicked.status){
					$scope.deal_btn_clicked.status = false;
					for(var d=0;d<$scope.cartDiscounts.length;d++){
						if($scope.cartDiscounts[d].name == 'B1G1'){
							$scope.cartDiscounts.splice(d,1);
							break;
						}
					}
					if($scope.deal_btn_clicked.apply){
						$scope.deal_btn_clicked.apply = false;
						for(var j=0;j<Math.floor(len/2);j++){
							var price = $scope.DealArr[DealGroup]['products'][j].price;
							var second_price = price;
							var index = $scope.DealArr[DealGroup]['products'][j].pos;
							var second_index = $scope.DealArr[DealGroup]['products'][j].pos;
							var del_index = 0;
							for(var i=0;i<$scope.DealArr[DealGroup]['products'].length-1;i++){
								if(price > $scope.DealArr[DealGroup]['products'][i+1].price ){
									second_price = price;
									second_index = index;
									price = $scope.DealArr[DealGroup]['products'][i+1].price;
									index = $scope.DealArr[DealGroup]['products'][i+1].pos;
									del_index = i+1;
								}else if($scope.DealArr[DealGroup]['products'][i+1].price <= second_price && $scope.DealArr[DealGroup]['products'][i+1].pos != index){
									second_price = $scope.DealArr[DealGroup]['products'][i+1].price;
									second_index = $scope.DealArr[DealGroup]['products'][i+1].pos;
								}
							}
							//$scope.cartItems[index].total-=price;
							for(var d=0;d<$scope.cartDiscounts.length;d++){
								if($scope.cartDiscounts[d].name == 'B1G1'){
									$scope.cartDiscounts[d].amount+=price;
									$scope.cartItems[index].deal_applied++;
									$scope.cartItems[second_index].deal_applied++;
									//$scope.cartItems[index].deal_applied = true;
									$scope.DealArr[DealGroup]['show_msg'] = false;
									break;
								}
							}
							if(d>=$scope.cartDiscounts.length){
								$scope.cartDiscounts.push({name:'B1G1',amount:price});
								$scope.cartItems[index].deal_applied++;
								$scope.cartItems[second_index].deal_applied++;
								//$scope.cartItems[index].deal_applied = true;
								$scope.DealArr[DealGroup]['show_msg'] = false;
							}
							$scope.DealArr[DealGroup]['products'].splice(del_index,1);
						}
						
						if(len>1){
							$scope.deal_applied = true;
						}
					}
				}
				
				var show_count = 0;
				for(var c=0;c<$scope.cartItems.length;c++){
					if(angular.isDefined($scope.cartItems[c].deal_applied)){
						if(!$scope.cartItems[c].deal_applied){
							show_count+=$scope.cartItems[c].quantity;
						}else if($scope.cartItems[c].deal_applied && ($scope.cartItems[c].quantity - $scope.cartItems[c].deal_applied)>0){
							show_count+=$scope.cartItems[c].quantity - $scope.cartItems[c].deal_applied;
						}
					}
					if(show_count>1){
						$scope.DealArr[DealGroup]['show_msg'] = true;
						break;
					}
				}
			}/*else if(DealGroup.indexOf('B17_99') == 0){
				//Ex:Set price to 1 pound for orders above 17.99
				for(var d=0;d<$scope.cartDiscounts.length;d++){
					if($scope.cartDiscounts[d].name == 'B17_99'){
						$scope.cartDiscounts.splice(d,1);
						break;
					}
				}
				var deal_exists = $filter('filter')($scope.product_deals,{deal_code:'B17_99'},true);
				if(deal_exists.length){
					var deal_total = 0,tied_products = [],lowest_product={index:-1,price:0,diff:0};
					for(var i=0;i<$scope.cartItems.length;i++){
						if($scope.cartItems[i].meta.wc_productdata_options[0]._dealcode == 'B17_99'){
							tied_products = $scope.cartItems[i].meta.wc_productdata_options[0]._tiedproduct;
							break;
						}
					}
					for(var i=0;i<$scope.cartItems.length;i++){
						if($scope.cartItems[i].meta.wc_productdata_options[0]._dealcode == 'B17_99' || 
							(!$scope.cartItems[i].meta.wc_productdata_options[0]._dealcode && tied_products.indexOf($scope.cartItems[i].id)<0)){
							var prdt_price = parseFloat(angular.isDefined($scope.cartItems[i].sel_variations)?$scope.cartItems[i].sel_variations.price:$scope.cartItems[i].price);
							deal_total+=(prdt_price*$scope.cartItems[i].quantity);
							if($scope.cartItems[i].meta.wc_productdata_options[0]._dealcode == 'B17_99' && (lowest_product.index<0 || prdt_price<lowest_product.price)){
								lowest_product={index:i,price:prdt_price,diff:prdt_price-parseFloat(deal_exists[0].deal_amount)};
							}
						}
					}
					
					if(deal_total>parseFloat(deal_exists[0].minimum_amount) && (deal_total-lowest_product.price+parseFloat(deal_exists[0].deal_amount))>parseFloat(deal_exists[0].minimum_amount)){
						//Apply deal
						//$scope.cartItems[lowest_product.index].total-=lowest_product.diff;
						$scope.cartItems[lowest_product.index].deal_applied = true;
						$scope.cartDiscounts.push({name:'B17_99',amount:lowest_product.diff});
						$scope.DealArr[DealGroup]['show_msg'] = false;
					}
				}
			}*/else if(DealGroup.indexOf('B3G4') == 0){
				//Buy 3 or more and at 4 pound
				if(len>=3){
					var deal_total = 0;
					for(var i=0;i<$scope.DealArr[DealGroup]['products'].length;i++){
						var index = $scope.DealArr[DealGroup]['products'][i].pos;
						deal_total+=$scope.DealArr[DealGroup]['products'][i].price;
					}
					
					$scope.offer_discount = parseFloat((deal_total-($scope.DealArr[DealGroup]['products'].length*4)).toFixed(2));
				}
				
			}
			$scope.DealArr[DealGroup]['products'] = [];
		}
		
		var dealInfo = getDealInfo('B17_99');
		$scope.deal_status = {status:false,msg:"",show_msg:false};
		if(dealInfo && dealInfo.length){
			 var current_date = new Date();
			 //var current_date ="Thu Dec 03 2018 12:03:12 GMT+0530 (India Standard Time)";
			if(dealInfo[0].freq_type == 'W' && dealInfo[0].deal_freq.toLowerCase().indexOf($scope.weekdays[current_date.getDay()].toLowerCase()) != -1){
				//Check for cart deal
				var deal_price = 0;
				var cat_exists = $filter('filter')($scope.categories,{slug:dealInfo[0].deal_products},true);
				for(var c=0;c<$scope.cartItems.length;c++){
					if($scope.cartItems[c].categories.length && cat_exists.length && cat_exists[0].name+"###1"==$scope.cartItems[c].categories[0]){
						//Deal product included
						$scope.deal_status = {status:true,msg:"",show_msg:false};
						deal_price = 0;
						break;
					}
					
					if(dealInfo[0].exclude_product_ids.indexOf($scope.cartItems[c].id)<0){
						var quantity = $scope.cartItems[c].quantity;
						if(angular.isDefined($scope.cartItems[c].deal_applied) && $scope.cartItems[c].deal_applied){
							if(($scope.cartItems[c].quantity - $scope.cartItems[c].deal_applied)>0){
								quantity = $scope.cartItems[c].quantity - $scope.cartItems[c].deal_applied;
							}else{
								quantity = 0;
							}
						}
						deal_price+=$scope.cartItems[c].total; //edited by Linu  6-dec-18 
					}
				}
				if(deal_price>parseFloat(dealInfo[0].minimum_amount) && !$scope.deal_status.status){
					$scope.deal_status.msg = "Eligible for "+dealInfo[0].deal_name;
					$scope.deal_status.show_msg = true;
				}
			}
		}
		
		$scope.calculateCartPoints();
	}
	
	$scope.calculateCartPoints = function(){
		if($scope.isPromotionsApplied() || $scope.deal_status.status){
			//Set points to 1 if deal is applied
			for(var c=0;c<$scope.cartItems.length;c++){
				$scope.cartItems[c].points = $scope.cartItems[c].org_points?1:0;
			}
		}else{
			//Revert to original points
			for(var c=0;c<$scope.cartItems.length;c++){
				$scope.cartItems[c].points = $scope.cartItems[c].org_points;
			}
		}
	}
	
	$scope.isPromotionsApplied = function(){
		var exists = $filter('filter')($scope.cartDiscounts,{name:'B1G1'},true);
		if(exists.length){
			return true;
		}
		return false;
	}
	
	$scope.deleteProduct = function(deleteMe) {
		$scope.compulsory_option_mode = false;
		$scope.optionClick = {name:'',count:0};
		
		if(angular.isDefined($scope.cartItems[deleteMe].deal_applied) && $scope.cartItems[deleteMe].deal_applied>0){
			//Reset deal discount
			for(var i=0;i<$scope.cartItems.length;i++){
				$scope.cartItems[i].deal_applied = 0;
			}
			$scope.deal_btn_clicked = {status:true,apply:false};
		}
		
        $scope.cartItems.splice(deleteMe, 1);

        if ($scope.cartItems.length) {
            /*for (var i = 0; i < $scope.cartItems.length; i++) {
                $scope.getTotal($scope.cartItems[i],i);
            };*/
			$scope.getTotal();
			$scope.getDiscount();
			$scope.calculate_cart_tax();
			$scope.setSelectedItem($scope.cartItems.length-1,$scope.cartItems[$scope.cartItems.length-1]);
        } else {
			$scope.DealArr = [];
            $scope.grand.Total = 0;
			$scope.grand.Discount = 0;
			$scope.grand.Quantity = 0;
			$scope.grand.Tax = 0;
			$scope.grand.Weight = 0;
			$scope.grand.Total_tax_percent = 0;
            $localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'cart', $scope.cartItems);
            $localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'grand', $scope.grand);
			$scope.setSelectedItem(null,null);
        }
		$scope.product_show = true;
    }
	
	
	$scope.deleteSub = function(key,product) {
		delete product.sel_variations.attributestoshow[key];
		delete product.sel_variations.attributes[product.sel_variations.attributesLink[key]];
		
		var sel_product_price = get_product_price(product,false);
			
		angular.forEach(product.sel_variations.attributes,function(value,key){
			if (product.sel_variations.attributes.hasOwnProperty(key)) {
				var opt = product.sel_variations.attributes[key];
				var value = opt.match(/\(([^)]+)\)/);
				if(value != null && value.length > 1){	
					value[1] = value[1].replace(/[£+]/g,"");
					sel_product_price+= $scope.parseFloatNoNaN(value[1]);
				}
			}
		});

		product.sel_variations.price = $scope.parseFloatNoNaN(sel_product_price.toFixed(2));
		var indexof= $scope.products.indexOf(product);

		$scope.calculateTotal(product,indexof);
    }
	
	$scope.addQuantity = function(product) {
		console.log(product);
	
			if (angular.isUndefined(product.quantity)) {
				product.quantity = 1;
			} else {
				++product.quantity;
			}
			
			if (angular.isUndefined(product.deltacount)) {
				product.deltacount = 1;
				
			} else {
				++product.deltacount;
				
			}
			
			$scope.pos_input.quantity = $scope.idSelectedItem.item.quantity;
			/*for (var i = 0; i < $scope.cartItems.length; i++) {
				$scope.getTotal($scope.cartItems[i],i);
			};*/
			$scope.getTotal();
			$scope.getDiscount();
			$scope.calculate_cart_tax();
		}

    $scope.subtractQuantity = function(product,index) {
        if (angular.isUndefined(product.quantity) || product.quantity == 0) {
            product.quantity = 0;
			product.deal_applied = 0;
        } else {
            --product.quantity;
			if(angular.isDefined(product.deal_applied) && product.deal_applied>0){
				//--product.deal_applied;
				//Reset deal discount
				for(var i=0;i<$scope.cartItems.length;i++){
					$scope.cartItems[i].deal_applied = 0;
				}
				$scope.deal_btn_clicked = {status:true,apply:false};
			}else{
				product.deal_applied=0;
			}
			
			if(product.quantity == 0) {
				 $scope.cartItems.splice(index, 1);
			}
        }
		
		
		if (angular.isUndefined(product.deltacount) ) {
            product.deltacount = -1;
			
        } else {
            --product.deltacount;
			
			
        }
		
		

        if ($scope.cartItems.length) {
            /*for (var i = 0; i < $scope.cartItems.length; i++) {
                $scope.getTotal($scope.cartItems[i],i);
            };*/
			
			$scope.getTotal();
			
			$scope.getDiscount();
			$scope.calculate_cart_tax();
			if(product.quantity == 0){
				$scope.setSelectedItem($scope.cartItems.length-1,$scope.cartItems[$scope.cartItems.length-1]);
				$scope.compulsory_option_mode = false;
				$scope.optionClick = {name:'',count:0};
			}else{
				$scope.pos_input.quantity = $scope.idSelectedItem.item.quantity;
			}
        } else {
			$scope.DealArr = [];
            $scope.grand.Total = 0;
			$scope.grand.Quantity = 0;
			$scope.grand.Discount = 0;
			$scope.grand.Tax = 0;
			$scope.grand.Weight = 0;
			$scope.grand.Total_tax_percent = 0;
            $localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'cart', $scope.cartItems);
            $localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'grand', $scope.grand)
			$scope.setSelectedItem(null,null);
			$scope.compulsory_option_mode = false;
			$scope.optionClick = {name:'',count:0};
        }
		$scope.product_show = true;
    }
	
	var trashOrder = function(){
		$scope.destoryCart();
		$scope.formCheckout = {
			"pending_data":{"order_id":'',"order_no":'',"order_seq":'',"pending_rev":'',"order_rev":'',"cart":'',"docid":''},
			"shipping_lines": [{
				"method_id": "",
				"method_title": "",
				"total": ""
			}],
			"coupon_lines": [],
			"payment_details": {
			  "method_id": "",
			  "method_title": "",
			  "paid": false,
			  "split":false,
			  "cash":0,
			  "card":0,
			  "voucher":0
			},
			"billing_address": {
				"first_name": "",
				"last_name": "",
				"address_1": "",
				"address_2": "",
				"city": "",
				"state": "",
				"postcode": "",
				"country": $scope.base_country,
				"email": "",
				"phone": "",
				"company": ""
			},
			"customer_id": "guest",
			"sameAddress": true,
			"shipping_address": {
				"first_name": "",
				"last_name": "",
				"address_1": "",
				"address_2": "",
				"city": "",
				"state": "",
				"postcode": "",
				"country": $scope.base_country
			},
			"shipping_note": "",
			"customer_meta":{
				"docid":''
			}
		};
		
		$scope.selected_customer = '';
		$scope.resetLoyaltyFields();
		
		$scope.selected_shipping = {};
		if($scope.terminalData.type == 'FRONT' || $scope.startup.action=='TABLEVIEW'){
			$scope.selected_shipping = {'id':'','title':'Takeaway','method_title':'','method_description':'','fee':''};
		}
		$scope.ship_select = {id : null,err : '',amount:''};
		
		$scope.saveForm();
		$scope.setSelectedItem(null,null);
		$scope.setSelectedSubItem(null,null);
		$scope.exitSub(false);
		
		clear_payment();
	
		$scope.cart_discount = {'disc_num':0,'disc_total':0,'percent_click':true};
		$scope.coupon_lines = [];
		$scope.cartDiscounts = [];
		$scope.deal_status = {status:false,msg:"",show_msg:false};
		$scope.deal_btn_clicked = {status:false,apply:false};
		$scope.DealArr = [];
		
		$scope.edit_order_flags = {
			order_loaded : false,
			order_status : ''
		}
		
		$scope.compulsory_option_mode = false;
		$scope.optionClick = {name:'',count:0};
		$scope.sitin_tables.selected = 0;
		$scope.customer_products = [];
		$scope.formCustomer = {};
		$scope.bagCharges.selected = $scope.bagCharges.charges.length?Number($scope.bagCharges.charges[0]):0;
		$scope.formSales = {
			shop:"",
			user:"",
			date :"",
			cash:"",
			receipt:"",
			total :"",
			card:"",
			sagepay:0,
			created_at:""
		};
		$scope.formPurchase = {
			item:"",
			quantity:"",
			unit:""
			};
		
		$scope.selectedOrders = {sub_total:0,delivery_charge:0,total:0,orders:[],active:false};
		
		var method = $filter('filter')($scope.shipping_methods,{title:$scope.order_type},false);
		if(method.length){
			$scope.changeShipping(method[0]);
			$scope.ship_select.id = $scope.temp_shipping.id;
			$scope.saveShipping(false);
		}
		/*$timeout(function(){
			if($scope.CID_ph_num){
				$scope.callPopup($scope.CID_ph_num);
			}
		},20);*/
	}
	
	var checkEndAction = function(trash){
		if($scope.voucherId.length){
			result = $pouchDB.upsert($scope.voucherId[0]._id,function(doc){
				doc.data.used=true;
				console.log(doc);
				$scope.voucherId=[];
				return doc;
			}).catch(function(error){
			console.log(error);
			});
		}
		if($scope.CID_ph_num){
			if(trash){
				trashOrder();
			}
			$timeout(function(){
				$scope.callPopup($scope.CID_ph_num);
			},20);
		}else{
			$scope.show_login_screen(false);
		}
	}
	//Function to add to purchase list array 
	$scope.addToPurchaseList = function(){
		if($scope.formPurchase.item !="" && $scope.formPurchase.quantity !="" && $scope.formPurchase.unit !=""){
			var data={'item':'','quantity':'','unit':''};
			data.item =$scope.formPurchase.item;
			data.quantity =$scope.formPurchase.quantity;
			data.unit =$scope.formPurchase.unit;
			$scope.purchaseListArray.push(data);
			$scope.purchaseListNameArray.push(data.item);
			$scope.formPurchase.item ="";
			$scope.formPurchase.quantity ="";
			$scope.formPurchase.unit ="";
			console.log($scope.purchaseListArray);
		}else{
			$scope.settings_error.err = "Please fill all the fields...";
		}
	}
	$scope.removePurchaseList =function(index){
		$scope.purchaseListArray.splice(index,1);
	}
	$scope.clearOrder = function(){
	   var confirmPopup = $ionicPopup.confirm({
		 title: 'Warning',
		 template: 'Are you sure you want to clear the order and start from scratch?'
	   });

	   confirmPopup.then(function(res) {
		 if(res) {
			if($rootScope.aiv_info.enable_kitchen == "TRUE" && $scope.edit_order_flags.order_loaded){
				var updateEditStatus = function (doc) {
					if(doc.data.status == "re-opened"){
						doc.data.updated_at = new Date().toISOString();
						doc.data.status = "on-hold";
						return doc;
					}
					return false; // don't update the doc; it's already been "touched"
				}
				
				var splitNameArr = $scope.formCheckout.pending_data.order_id.split('_order_');
				var base_doc_id = '';
				if(splitNameArr.length > 1){
					var splitSeqArr = splitNameArr[1].split('_');
					if(splitSeqArr.length > 0){
						base_doc_id = splitNameArr[0]+'_order_'+splitSeqArr[0];
					}
				}
			
				$pouchDBEtc.upsert(base_doc_id,updateEditStatus).then(function(res){
					console.log("Order closed");
				}).catch(function(error){
					console.error(error);
				});
			}
				
			checkEndAction(true);	
		 }
	   });
	}
	
    $scope.destoryCart = function(item) {
        $scope.cartItems = [];
        $localstorage.destroy(AIV_CONSTANTS.LS_PREFIX+'cart');
		
		$scope.grand = {
			"Total": 0,
			"Weight": 0,
			"Shipping": 0,
			"Discount": 0,
			"Quantity":0,
			"Tax":0,
			"deposit":0,
			"Total_tax_percent":0,
			"loyalty":false,
			"loyalty_amt":0
		}
		$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'grand', $scope.grand);
    }
	
	var phone_template = '<ion-popover-view style="height: 40px;"><ion-header-bar> <h1 class="title">{{aiv_info.phone1}}</h1> </ion-header-bar></ion-popover-view>';
    $scope.phone_popover = $ionicPopover.fromTemplate(phone_template, {
		scope: $scope
	});
	
	$scope.openPhonePopover = function($event) {
		$scope.phone_popover.show($event);
	};

	$scope.showOptions = function(){
		$ionicModal.fromTemplateUrl('options-modal.html', {
			id:'SHOW_OPTIONS',
			scope: $scope,
			backdropClickToClose: false,
			animation: 'none'
		}).then(function(modal) {
			modal.el.className = modal.el.className + " below-modal";
			$scope.modal = modal;
			$scope.openModal('SHOW_OPTIONS');
		});
	}
	
	$scope.onlineOrderInterval = undefined;
	$scope.stopOnlineOrderInterval = function(){
		if ( angular.isDefined($scope.onlineOrderInterval) ){
			$interval.cancel($scope.onlineOrderInterval);
			$scope.onlineOrderInterval = undefined;
		}
	}
	
	var getTimeDiff = function(date1,date2,type){
		var output = 0;
		var diff = new Date(date1) - new Date(date2);
		if(type == "MINUTES"){
			output = Math.round((diff/1000)/60);
		}
		return output;
	}
	
	$scope.showOnlineModal = function(){
	
		$scope.online_order.data.order_meta.delivery_time=null;//disabling delivery time, even if something comes in.
		if($scope.online_order_modal == undefined || !$scope.online_order_modal._isShown){
			$scope.online_proceed = false;
			if(angular.isDefined($scope.online_order.data.order_meta.delivery_time) && $scope.online_order.data.order_meta.delivery_time){
				var duration = getTimeDiff($scope.online_order.data.order_meta.delivery_time,new Date(),"MINUTES");
				$scope.online_order.data.order_meta.delivery_time = new Date($scope.online_order.data.order_meta.delivery_time);
				if(duration>0){
				
					$scope.stopOnlineOrderInterval();
					if($scope.POSSettings.online_default_accept==false){
						
						$scope.onlineOrderInterval = $interval(function() {
							if(angular.isDefined($scope.online_order.data)){
								duration = getTimeDiff($scope.online_order.data.order_meta.delivery_time,new Date(),"MINUTES");
								$scope.online_order.data.order_meta.duration = duration+" Minutes";
								if(duration<=0){
									$scope.stopOnlineOrderInterval();
								}
							}else{
								$scope.stopOnlineOrderInterval();
							}
						}, 60000);
					}
					
					
					
					$scope.online_order.data.order_meta.duration = duration+" Minutes";
				}else{
					duration = 0;
					$scope.online_order.data.order_meta.duration = duration+" Minutes";
				}
			}
			
			if($scope.POSSettings.online_default_accept==false){
					$ionicModal.fromTemplateUrl('online_order-modal.html', {
						id:'ONLINE_ORDER',
						scope: $scope,
						backdropClickToClose: false,
						animation: 'none'
					}).then(function(modal) {
						modal.el.className = modal.el.className + " priority-modal";
						$scope.online_order_modal = modal;
						$scope.openModal('ONLINE_ORDER');
					});
					
					
			}
			else{
			
				$scope.OWOAcceptSilent();
				
			}
			
		}
	}
	
	$scope.showReportModal = function(type){
		$scope.report_terminals = $filter('filter')($scope.aiv_terminals.terminals,{type:"!KITCHEN"},false);
		if((type == 'X' || type == 'Z') && ($scope.report_modal == undefined || !$scope.report_modal._isShown)){
			$ionicModal.fromTemplateUrl('report-modal.html', {
				id:'REPORT_MODAL',
				scope: $scope,
				backdropClickToClose: false,
				animation: 'none'
			}).then(function(modal) {
				modal.el.className = modal.el.className + " report-modal";
				$scope.report_modal = modal;
				$scope.openModal('REPORT_MODAL');
			});
		}else if(type == 'VOID' && ($scope.void_report_modal == undefined || !$scope.void_report_modal._isShown)){
			$ionicModal.fromTemplateUrl('void-report-modal.html', {
				id:'VOID_REPORT_MODAL',
				scope: $scope,
				backdropClickToClose: false,
				animation: 'none'
			}).then(function(modal) {
				modal.el.className = modal.el.className + " report-modal";
				$scope.void_report_modal = modal;
				$scope.openModal('VOID_REPORT_MODAL');
			});
		}else if(type == 'D' && ($scope.void_report_modal == undefined || !$scope.void_report_modal._isShown)){
			$ionicModal.fromTemplateUrl('d-report-modal.html', {
				id:'D_REPORT_MODAL',
				scope: $scope,
				backdropClickToClose: false,
				animation: 'none'
			}).then(function(modal) {
				modal.el.className = modal.el.className + " report-modal";
				$scope.d_report_modal = modal;
				$scope.openModal('D_REPORT_MODAL');
			});
		}
	}
	
	/*$ionicModal.fromTemplateUrl('kitchen-order-modal.html', {
		id:'KITCHEN_ORDER_MODAL',
		scope: $scope,
		backdropClickToClose: false,
		animation: 'none'
	}).then(function(modal) {
		$scope.kitchen_order_modal = modal;
	});*/


	$scope.editOptions= function(product) {
		if(!product)return;
		if(product.type=='simple')
		{
			//$scope.idSelectedItem.item = product;
			//$scope.addInstructions();
		}
		else
		{
			$scope.idSelectedItem.item = product;
			$scope.editProductOptions();
		}
		$scope.show_sub.cook_inst = false;
	}

	$scope.filtered_attributes = {part:{},option:[]};
	$scope.var_copy = {
		current_options:{},
		current_display_options:{},
		display_options_tooptions:{}
	};
	$scope.selectOptions = function(product) {
		$scope.var_copy.current_options = angular.copy($scope.current_options);
		$scope.var_copy.current_display_options = angular.copy($scope.current_display_options);
		$scope.var_copy.display_options_tooptions = angular.copy($scope.display_options_tooptions);
	
		$scope.current_options = {};
		$scope.current_display_options = {};
		$scope.display_options_tooptions={};
		$scope.sel_product = product;
		$scope.sel_variations = {};
		$scope.sel_product_price = get_product_price(product,false);
		$scope.filtered_attributes = {part:{},option:[]};

		var pre_option = '';
		angular.forEach(product.attributes, function(item) {
			var nameArr = item.slug.split(AIV_CONSTANTS.OPTION_SEPARATOR);
			//Check if this option is for POS
			if(nameArr.length > 1 && !nameArr[1].includes("W") ){
				if(nameArr[0].startsWith('-')){
					//Linked option
					var linked = {};
					//linked[nameArr[0].substr(1)] = item.options;
					//$scope.filtered_attributes['part'] = linked;
					$scope.filtered_attributes['option'][$scope.filtered_attributes.option.length-1]['linked'][item.slug] = item.options;
				}else{
					//Normal option
					item['keyhidden']=false;
					if(nameArr[1].includes("H") )
					{
						item.keyhidden = true
					}

					item['linked']={};
					$scope.filtered_attributes['option'].push(item);
				}
			}
		}, $scope.filtered_attributes);
		
		angular.forEach($scope.filtered_attributes.option, function(item) {
			/*var opt = item.options[0];
			$scope.current_options[item.name] = opt;
			var value = opt.match(/\(([^)]+)\)/);
			if(value != null && value.length > 1){
				$scope.sel_product_price+= parseFloat(value[1].match(/[0-9.]+/));
			}*/
			var itemSplit = item.name.split(AIV_CONSTANTS.OPTION_SEPARATOR);
			item["fname"]=item.name;
			if(itemSplit.length > 0){
				item.name = itemSplit[0];
			}
			//$scope.current_options[item.name] = '';
		}, $scope.current_options);
		//console.log(product.productOptions);
		$scope.sel_variations.price = parseFloat($scope.sel_product_price.toFixed(2));

		$scope.sel_variations.attributes = $scope.current_options;
		$scope.sel_option = $scope.filtered_attributes['option'][0];
		//$scope.selected_attr = $scope.sel_option.linked
		var key;

		if($scope.sel_option!=null)
		{
			for (var property in $scope.sel_option.linked ) {
				//$scope.objectHeaders.push(property); 
				$scope.selected_attr = $scope.sel_option.linked[property][0];
				key = property;
				
			}
			$scope.selected_attr_add='';
			if(key != undefined && $scope.selected_attr != undefined){
				$scope.updateAttributeOptions(key,$scope.selected_attr,$scope.sel_option.name);
			}
		}

		$scope.showOptions('SHOW_OPTIONS');
	};
	
	$scope.openModal = function(index){
		if(index == 'SHOW_OPTIONS'){
			$scope.modal.show();
		}else if(index == 'EDIT_PRODUCT'){
			$scope.edit_modal.show();
		}else if(index == 'DEPOSIT'){
			$scope.deposite_modal.show();
		}else if(index == 'VOUCHER'){
			$scope.voucher_modal.show();
		}else if(index == 'VOUCHERFRONT'){
			$scope.voucher_modal_front.show();
		}else if(index == 'PAYOUT'){
			$scope.payout_modal.show();
			var someElement = document.getElementById('payoutamount');
            someElement.focus(true);
		}else if(index == 'PAYOUTFRONT'){
			$scope.payoutfront_modal.show();
		}else if(index == 'ADD_DISCOUNT'){
			$scope.discount_modal.show();
		}else if(index == 'PAYMENT'){
			$scope.pay_modal.show();
		}else if(index == 'SHIPPING'){
			$scope.ship_modal.show();
		}else if(index == 'ORDER_NOTE'){
			$scope.note_modal.show();
		}else if(index == 'CUSTOMER'){
			$scope.customer_modal.show();
		}else if(index == 'CUSTOMER_EDIT'){
			$scope.customer_edit_modal.show();
			$scope.aiv_toggles.show_customer_extra = false;
		}else if(index == 'VIEW_ORDER'){
			$scope.order_modal.show();
		}else if(index == 'POS_SETTINGS'){
			$scope.settings_modal.show();
		}else if(index == 'ONLINE_ORDER'){
			$scope.online_order_modal.show();
		}else if(index == 'VIEW_PENDING_ORDER'){
			$scope.pending_order_modal.show();
		}else if(index == 'VIEW_KITCHEN_ORDER'){
			$scope.kitchen_orderlist_modal.show();
		}else if(index == 'REPORT_MODAL'){
			$scope.report_modal.show();
		}else if(index == 'POS_USERS'){
			$scope.user_modal.show();
		}else if(index == 'CUSTOM_PRODUCT'){
			$scope.open_item_modal.show();
		}else if(index == 'UPDATE_PRODUCT'){
			$scope.update_product_modal.show();
		}else if(index == 'PREVIEW_MODAL'){
			$scope.preview_modal.show();
		}else if(index == 'UPDATE_CATEGORY'){
			$scope.update_category_modal.show();
		}else if(index == 'UPDATE_STOCK'){
			$scope.update_stock_modal.show();
		}else if(index == 'CSR_MODAL'){
			$scope.csr_modal.show();
		}else if(index == 'PSR_MODAL'){
			$scope.psr_modal.show();
		}else if(index == 'CS_MODAL'){
			$scope.cs_modal.show();
		}else if(index == 'DS_MODAL'){
			$scope.ds_modal.show();
		}else if(index == 'OH_MODAL'){
			$scope.oh_modal.show();
		}else if(index == 'AD_MODAL'){
			$scope.ad_modal.show();
		}else if(index == 'OI_MODAL'){
			$scope.oi_modal.show();
		}else if(index == 'UPDATE_EXPENSE'){
			$scope.expense_modal.show();
		}else if(index == 'CASHFLOW_MODAL'){
			$scope.cashflow_modal.show();
		}else if(index == 'OUTOFSTOCK_MODAL'){
			$scope.outofstock_modal.show();
		}else if(index == 'CPL_MODAL'){
			$scope.cpl_modal.show();
		}else if(index == 'PL_MODAL'){
			$scope.pl_modal.show();
		}else if(index == 'PAR_MODAL'){
			$scope.par_modal.show();
		}else if(index == 'CATL_MODAL'){
			$scope.catl_modal.show();
		}else if(index == 'CUSTOM_PL_MODAL'){
			$scope.custom_pl_modal.show();
		}else if(index == 'CUST_LIST_MODAL'){
			$scope.cust_list_modal.show();
		}else if(index == 'KITCHEN_ORDER_MODAL'){
			$scope.kitchen_order_modal.show();
		}else if(index == 'SHOW_INSTRUCTIONS'){
			$scope.instruction_modal.show();
		}else if(index == 'SHOW_OPTIONS_EDIT'){
			$scope.modal.show();
		}else if(index == 'SEND_SMS'){
			$scope.sms_modal.show();
		}else if(index == 'VIEW_TABLE_ORDER'){
			$scope.table_orderlist_modal.show();
		}else if(index == 'CUSTOM_ORDER'){
			$scope.custom_order_modal.show();
		}else if(index == 'VOID_REPORT_MODAL'){
			$scope.void_report_modal.show();
		}else if(index == 'VIEW_CUSTOMER'){
			$scope.view_customer_modal.show();
		}else if(index == 'D_REPORT_MODAL'){
			$scope.d_report_modal.show();
		}
	}
	
	$scope.closeModal = function(index,manual=false){
		if(index == 'SHOW_OPTIONS'){
			$scope.modal.remove();
			$scope.sel_variations = {};
			$scope.sel_option = {};
			$scope.selected_attr={};
			$scope.selected_attr_add="";
			$scope.current_options = angular.copy($scope.var_copy.current_options);
			$scope.current_display_options = angular.copy($scope.var_copy.current_display_options);
			$scope.display_options_tooptions = angular.copy($scope.var_copy.display_options_tooptions);
		}else if(index == 'SHOW_OPTIONS_EDIT'){
			$scope.modal.remove();
			$scope.sel_variations = {};
			$scope.sel_option = {};
			$scope.selected_attr={};
			$scope.selected_attr_add="";
			$scope.current_options = angular.copy($scope.var_copy.current_options);
			$scope.current_display_options = angular.copy($scope.var_copy.current_display_options);
			$scope.display_options_tooptions = angular.copy($scope.var_copy.display_options_tooptions);
		}else if(index == 'EDIT_PRODUCT'){
			$scope.aiv_toggles.assign_price = false;
			$scope.aiv_toggles.assigned_price = 0;
			$scope.aiv_toggles.assign_changed = false;
			$scope.edit_modal.remove();
		}else if(index == 'ADD_DISCOUNT'){
			//$scope.cart_discount.disc_num = 0;
			$scope.coupon = { code : '',err: '' };
			$scope.voucher = { code : '',err: '' };
			$scope.discount_modal.remove();
			$scope.action_auth = {pass:'',err:'',auth:false,reason:''};
			if($scope.pre_loginInfo.user_login){
				$scope.loginInfo = angular.copy($scope.pre_loginInfo);
				$scope.pre_loginInfo = {user_login:'','role':''};
			}
		}else if(index == 'PAYMENT'){
			/*$scope.loyalty_assigned.status = false;
			$scope.loyalty_card.manual_search = false;
			$scope.loyalty_card.reward_amount = 0;
			$scope.loyalty_card.reward_points = 0;
			$scope.loyalty.points_earned = 0;*/
			if($scope.pay_modal != undefined && $scope.pay_modal._isShown){
				$scope.pay_modal.remove();
				if($scope.order_to_pay.type != '' && !$scope.selectedOrders.active){
					//trashOrder();
					clear_payment();
					$scope.selectedOrders = {sub_total:0,delivery_charge:0,total:0,orders:[],active:false};
				}
				
				//clear_payment();
				
			}
			if(!manual && ($scope.startup.action == "PAYOFF" || $scope.startup.action == "LOOK_ORDER") && !$scope.cartItems.length){
				checkEndAction(true);
			}
		}else if(index == 'SHIPPING'){
			$scope.ship_modal.remove();
		}else if(index == 'ORDER_NOTE'){
			$scope.note_modal.remove();
		}else if(index == 'CUSTOMER'){
			
			if($scope.pay_modal != undefined && $scope.pay_modal._isShown){
				$scope.setKeyInput('PAYMENT',$scope.payment_select.amount);
			}
			if($scope.customer_modal != undefined && $scope.customer_modal._isShown){
				$scope.customer_modal.remove();
				$scope.search_inputs.phone = '';
				$scope.quickCustomers = [];
			}
			if($scope.selected_customer && $scope.pay_modal != undefined && $scope.pay_modal._isShown){
				$scope.setKeyInput('PAYMENT',$scope.payment_select.amount);
				$scope.checkLoyaltyCustomer($scope.selected_customer.billing_address.phone);
			}
			if(!$scope.quickCustomerEnable && (($scope.startup.action == "SHIPPING") && !$scope.cartItems.length || $scope.deposit )){

				checkEndAction(true);
			}
			
			
		}else if(index == 'CUSTOMER_EDIT'){
			$scope.customer_edit_modal.remove();
			$scope.customer_edit_close = false;
			$scope.aiv_toggles.show_customer_extra = false;
			if($scope.selected_customer && $scope.pay_modal != undefined && $scope.pay_modal._isShown){
				$scope.setKeyInput('PAYMENT',$scope.payment_select.amount);
			}
			if(!$scope.quickCustomerDisable && (($scope.startup.action == "SHIPPING") && !$scope.cartItems.length || $scope.deposit )){
				checkEndAction(true);
			}
		}else if(index == 'VIEW_ORDER'){
			$scope.shownDetails = null;
			$scope.order_modal.remove();
			if(!$scope.selectedOrders.active){
				$scope.selectedOrders = {sub_total:0,delivery_charge:0,total:0,orders:[],active:false};
			}
			if(manual && ($scope.startup.action == 'LOOK_ORDER' || $scope.startup.action == 'ADD2ORDER' || $scope.startup.action == 'PAYOFF') && !$scope.cartItems.length){
				checkEndAction(true);
			}
		}else if(index == 'POS_SETTINGS'){
			$scope.aiv_reports.selected="";
			$scope.shownDetails = null;
			$scope.settings_modal.remove();
			if($scope.startup.action == 'SETTINGS'){
				$scope.show_login_screen(false);
			}
			if(($scope.startup.action == "REPORTS" ) && !$scope.cartItems.length){
				checkEndAction(true);
			}
		}else if(index == 'ONLINE_ORDER'){
			$scope.online_order = {};
			//$scope.delivery_interval = [];
			$scope.online_order_modal.remove();
			$scope.pos_action.online_action_clicked = false;
			$scope.online_order_audio.pause();
			$scope.stopOnlineOrderInterval();
		}else if(index == 'VIEW_PENDING_ORDER'){
			$scope.pending_order_modal.remove();
		}else if(index == 'VIEW_KITCHEN_ORDER'){
			$scope.kitchen_orderlist_modal.remove();
		}else if(index == 'REPORT_MODAL'){
			$scope.report_modal.remove();
		}else if(index == 'VOID_REPORT_MODAL'){
			$scope.void_report_modal.remove();
		}else if(index == 'POS_USERS'){
			//$scope.qwerty_inputs.pass = '';
			$scope.user_modal.remove();
		}else if(index == 'CUSTOM_PRODUCT'){
			$scope.open_item_modal.remove();
		}else if(index == 'UPDATE_PRODUCT'){
			$scope.update_product_modal.remove();
		}else if(index == 'PREVIEW_MODAL'){
			$scope.preview_modal.remove();
		}else if(index == 'D_REPORT_MODAL'){
			$scope.d_report_modal.remove();
		}else if(index == 'UPDATE_CATEGORY'){
			$scope.update_category_modal.remove();
		}else if(index == 'UPDATE_STOCK'){
			$scope.update_stock_modal.remove();
		}else if(index == 'CSR_MODAL'){
			$scope.csr_modal.remove();
		}else if(index == 'PSR_MODAL'){
			$scope.psr_modal.remove();
		}else if(index == 'CS_MODAL'){
			$scope.cs_modal.remove();
		}else if(index == 'DS_MODAL'){
			$scope.ds_modal.remove();
		}else if(index == 'OH_MODAL'){
			$scope.oh_modal.remove();
		}else if(index == 'AD_MODAL'){
			$scope.ad_modal.hide();
		}else if(index == 'OI_MODAL'){
			$scope.oi_modal.remove();
		}else if(index == 'UPDATE_EXPENSE'){
			$scope.expense_modal.remove();
		}else if(index == 'CASHFLOW_MODAL'){
			$scope.cashflow_modal.hide();
		}else if(index == 'OUTOFSTOCK_MODAL'){
			$scope.outofstock_modal.hide();
		}else if(index == 'CPL_MODAL'){
			$scope.cpl_modal.remove();
		}else if(index == 'PL_MODAL'){
			$scope.pl_modal.remove();
		}else if(index == 'PAR_MODAL'){
			$scope.par_modal.remove();
		}else if(index == 'CATL_MODAL'){
			$scope.catl_modal.remove();
		}else if(index == 'CUSTOM_PL_MODAL'){
			$scope.custom_pl_modal.remove();
		}else if(index == 'CUST_LIST_MODAL'){
			$scope.cust_list_modal.hide();
		}else if(index == 'KITCHEN_ORDER_MODAL'){
			$scope.kitchen_selected_order = '';
			$scope.kitchencart = [];
			$scope.kitchen_order_modal.remove();
		}else if(index == 'SHOW_INSTRUCTIONS'){
			$scope.instruction_modal.remove();
			$scope.current_options = angular.copy($scope.var_copy.current_options);
			$scope.current_display_options = angular.copy($scope.var_copy.current_display_options);
			$scope.display_options_tooptions = angular.copy($scope.var_copy.display_options_tooptions);
		}else if(index == 'SEND_SMS'){
			$scope.sms_customers.selectAll = false;
			$scope.selectAllCustomers();
			$scope.sms_modal.remove();
		}else if(index == 'VIEW_TABLE_ORDER'){
			$scope.table_orderlist_modal.remove();
		}else if(index == 'CUSTOM_ORDER'){
			$scope.custom_order_modal.remove();
			checkEndAction(true);
		}else if(index == 'VIEW_CUSTOMER'){
			$scope.view_customer_modal.remove();
			$scope.selected_customer = '';
			$scope.search_inputs.customer = '';
			checkEndAction(true);
		}else if(index == 'DEPOSIT'){
			$scope.deposite_modal.remove();
			checkEndAction(true);
		}else if(index == 'VOUCHERFRONT'){
			$scope.voucher_modal_front.remove();
			$scope.show_login_screen(true);
		}else if(index == 'VOUCHER'){
			$scope.voucher_modal.remove();
			$scope.show_login_screen(true);
		}else if(index == 'PAYOUT'){
			$scope.payout_modal.remove();
		}else if(index == 'PAYOUTFRONT'){
			$scope.payoutfront_modal.remove();
			$scope.show_login_screen(true);
		}
	}

	$scope.getDiscount = function(){
		$scope.grand.Discount = 0;
		if($scope.settings_data.enable_free_delivery && $scope.grand.Total >$scope.settings_data.free_delivery_amt){
			if($scope.temp_shipping.id ==  "local_delivery")
			{
				$scope.grand.Discount += parseFloat($scope.temp_shipping.fee);
			}
		
		}
		for(var d=0;d<$scope.cartDiscounts.length;d++){
			if($scope.cartDiscounts[d].name == 'COUPON'){
				$scope.cartDiscounts.splice(d,1);
				break;
			}
		}
		
		var coupon_discount = 0;		
		for (var i=0;i<$scope.formCheckout.coupon_lines.length;i++) {
			if($scope.formCheckout.coupon_lines[i].cart == true){
				if($scope.formCheckout.coupon_lines[i].type == true ){
					$scope.formCheckout.coupon_lines[i].amount = ($scope.grand.Total*$scope.formCheckout.coupon_lines[i].rate/100);
					coupon_discount += $scope.formCheckout.coupon_lines[i].amount;
				}else{
					coupon_discount += parseFloat($scope.formCheckout.coupon_lines[i].rate);
				}
			}
        }
		
		if(coupon_discount){
			$scope.cartDiscounts.push({name:'COUPON',amount:coupon_discount});
		}
		
		var user_discount = 0;
		if($scope.cart_discount.percent_click && $scope.cart_discount.disc_total){
			user_discount = ($scope.grand.Total*$scope.cart_discount.disc_total/100);
		}else if(!$scope.cart_discount.percent_click && parseFloat($scope.cart_discount.disc_num)){
			user_discount = parseFloat($scope.cart_discount.disc_num);
		}
		
		if(user_discount){
			for(var d=0;d<$scope.cartDiscounts.length;d++){
				if($scope.cartDiscounts[d].name == 'DISCOUNT'){
					$scope.cartDiscounts[d].amount = user_discount;
					break;
				}
			}
			if(d>=$scope.cartDiscounts.length){
				$scope.cartDiscounts.push({name:'DISCOUNT',amount:user_discount});
			}
		}
		
		for(var d=0;d<$scope.cartDiscounts.length;d++){
			$scope.grand.Discount+=$scope.cartDiscounts[d].amount;
		}
		
		$scope.grand.Discount += $scope.offer_discount;
		
		$scope.grand.Discount = $scope.grand.Total<$scope.grand.Discount?0:$scope.grand.Discount;
		
		$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'formCheckout', $scope.formCheckout);
		$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'grand', $scope.grand);
	}
	
	$scope.showDiscount = function(percent_flg){
		if(percent_flg != undefined){
			$scope.cart_discount.percent_click = percent_flg;
		}
		if($scope.cart_discount.percent_click){
			$scope.cart_discount.disc_total = parseFloat($scope.cart_discount.disc_num);
		}else{
			$scope.cart_discount.disc_total = parseFloat($scope.cart_discount.disc_num)*100/$scope.grand.Total;
		}
	}
	
	$scope.applyDiscount = function(){
		/*$scope.coupon.err = '';
		if($scope.loginInfo.role!='shop_manager' && $scope.user_discounts.indexOf($scope.cart_discount.disc_total)<0){
			$scope.coupon.err = 'Incorrect authorization!!!';
			return;
		}*/
		$scope.formCheckout.coupon_lines = $scope.coupon_lines;
		$scope.getDiscount();
		$scope.calculate_cart_tax();
	}
	
	$scope.removeDiscount = function(){
		$scope.cart_discount = {'disc_num':0,'disc_total':0,'percent_click':true};
		$scope.grand.Discount = 0;
		$scope.grand.loyalty =false;//linu
		$scope.loyalty_card.points_redeem_status =false;//linu
		$scope.formCheckout.coupon_lines = [];
		$scope.coupon_lines = [];
		
		$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'formCheckout', $scope.formCheckout);
		$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'grand', $scope.grand);
	}
	
	$scope.cart_discount = {'disc_num':0,'disc_total':0,'percent_click':true};
	$scope.openDiscountModal = function() {
		if($scope.discount_modal != undefined && $scope.discount_modal._isShown){
			return;
		}
		$scope.coupon.err = '';
		$scope.success_done.coupon_applied = '';
		if($scope.cartItems.length){
			$scope.action_auth = {pass:'',err:'',auth:false,reason:''};
			$scope.coupon_lines = angular.copy($scope.formCheckout.coupon_lines);
			if(!$scope.pos_status.online){
				$scope.coupon.err = "Coupons are not allowed while offline";
			}else if(!$scope.coupon_lines.length){
				for (var j=0;j<$scope.Coupons.coupons.length;j++) {
					if($scope.Coupons.coupons[j].code.substr($scope.Coupons.coupons[j].code.length - 1) == "o"){
						var percent_type = false;
						var cart_type = false;
						if($scope.Coupons.coupons[j].type == "percent" || $scope.Coupons.coupons[j].type == "percent_product" ){
							percent_type = true;
						}
						
						if($scope.Coupons.coupons[j].type == "percent" || $scope.Coupons.coupons[j].type == "fixed_cart" ){
							cart_type = true;
						}
						$scope.coupon_lines.push({
							"code" : $scope.Coupons.coupons[j].code,
							"type" : percent_type,
							"cart" : cart_type,
							"rate" : $scope.Coupons.coupons[j].amount,
							"amount" : $scope.Coupons.coupons[j].amount
						})
						//$localstorage.setObject('formCheckout', $scope.formCheckout);
					}
				}
			}
		
			if($scope.loginInfo.role=='shop_manager'){
				$scope.setKeyInput('DISCOUNT',$scope.cart_discount.disc_num);
			}else{
				$scope.setKeyInput('REQ_PASS',$scope.action_auth.pass);
				//$scope.setKeyInput('COUPON',$scope.cart_discount.disc_num);
			}
			
			$ionicModal.fromTemplateUrl('discount-modal.html', {
				id:'ADD_DISCOUNT',
				backdropClickToClose: false,
				scope: $scope,
				animation: 'none'
			}).then(function(modal) {
				$scope.discount_modal = modal;
				$scope.openModal('ADD_DISCOUNT');
			});
		}else{
			$scope.showCheckoutMsg('Cart is empty','Please add some items to cart first');
		}
	}
	
	$scope.openEditProduct = function(product,index) {
		$scope.edit_product = {};
		angular.copy(product,$scope.edit_product);
		$scope.edit_index = index;
		$ionicModal.fromTemplateUrl('product-edit-modal.html', {
			id:'EDIT_PRODUCT',
			backdropClickToClose: false,
			scope: $scope,
			animation: 'none',
			cache: false
		}).then(function(modal) {
			$scope.edit_modal = modal;
			$scope.openModal('EDIT_PRODUCT');
		});
	};
	
	$scope.saveEditedProduct = function(ed_product){
		$scope.errors.edit_cart_product = '';
		if($scope.edit_product.quantity == '' || !parseInt($scope.edit_product.quantity)){
			$scope.errors.edit_cart_product = 'Please enter quantity...';
			return;
		}else if($scope.edit_product.price == ''){
			$scope.errors.edit_cart_product = 'Please enter valid price...';
			return;
		}else if(parseFloat(ed_product.price) < parseFloat($scope.edit_product.actual_price)){
			$scope.errors.edit_cart_product = 'Price should not be less than actual price...';
			return;
		}
		if($scope.edit_product.attributes.length){
			$scope.edit_product.sel_variations.price = parseFloat($scope.edit_product.sel_variations.price).toFixed(2);
		}
			
		$scope.cartItems[$scope.edit_index] = ed_product;
		$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'cart', $scope.cartItems);
		//$scope.getTotal(ed_product,$scope.edit_index);
		
		$scope.calculateTotal($scope.cartItems[$scope.edit_index],$scope.edit_index);

		$scope.setSelectedItem($scope.edit_index,ed_product);
		$scope.closeModal('EDIT_PRODUCT');
	}
	
	$scope.amount_key = 0;
	var open_payment_modal = function(){
		if($scope.pay_modal != undefined && $scope.pay_modal._isShown){
			return;
		}
		//$state.go('tab.payment');
		var default_method = $filter('filter')($scope.PaymentMethods,{id:'cod'},false);
		if(default_method.length){
			$scope.payment_select.id = default_method[0].id;
			$scope.savePayment(default_method[0]);
		}
		$scope.payment_select.amount = '';
		$scope.payment_select.tender = '';
		if(!$scope.aiv_toggles.show_cash){
			$scope.payment_select.delivery = true;
		}else{
			$scope.payment_select.delivery = false;
		}
		//$scope.setKeyInput('PAYMENT',$scope.payment_select.amount);
		
		if($scope.payment_select.shipping_method=='Takeaway'||$scope.payment_select.shipping_method=='Sit-In'){
			$scope.print_config.receipt = $scope.defaultBtns.default_print_enable_btn;
		}
		
		$ionicModal.fromTemplateUrl('payment-modal.html', {
			id:'PAYMENT',
			backdropClickToClose: false,
			scope: $scope,
			animation: 'none'
		}).then(function(modal) {
			modal.el.className = modal.el.className + " pay-modal";
			$scope.pay_modal = modal;
			$scope.openModal('PAYMENT');
		});
	}
	
	$scope.order_to_pay = {order:'',type:''};
	$scope.openPaymentModal = function(order,type){	
	$scope.voucher_code_area='';
	$scope.voucherId=[];
	 $scope.depositeAmount =0;
	$scope.deposit=false;
	$scope.showSplitPay ={"show":false,"amount":0};
		$scope.aiv_toggles.show_cash = true;
		$scope.aiv_toggles.set_unpaid = false;
		$scope.disable_finish=false;
		if(angular.isDefined(order)){
			$scope.order_to_pay.order = order;
			$scope.order_to_pay.type = type;
			if(type == 'SINGLE'){
				$scope.payment_select.shipping_method = (order.data.shipping_methods=='')?'Takeaway':order.data.shipping_methods;
			}else{
				$scope.payment_select.shipping_method = "";
			}
			$scope.amount_key = '£'+parseFloat($scope.payment_select.to_pay).toFixed(2);
			$scope.payment_select.err = '';
			open_payment_modal();
		}else if($scope.cartItems.length || $scope.online_processing){
			clear_payment();
			//$scope.payment_select.tender = '';
			$scope.payment_select.err = '';
			if($scope.online_processing){
				$scope.payment_select.to_pay = $scope.online_order.data.total;
				$scope.payment_select.shipping_method = $scope.online_order.data.shipping_methods;
				$scope.payment_select.customer_id = $scope.online_order.data.customer_id;
				$scope.amount_key = '£'+parseFloat($scope.payment_select.to_pay).toFixed(2);
				open_payment_modal();
			}else{
				if(!$scope.edit_order_flags.order_loaded && $scope.selected_shipping.id!='sitin' && $scope.selected_shipping.id!='' && $scope.selected_shipping.id!='local_pickup'){
					$scope.aiv_toggles.show_cash = false;
				}
				if($scope.ShowPaymentButtonInCollection){
					if(!$scope.edit_order_flags.order_loaded && $scope.selected_shipping.id!='sitin' && $scope.selected_shipping.id!='' && $scope.selected_shipping.id!='local_pickup'){
						$scope.aiv_toggles.show_cash = false;
					}
				}else{
					if(!$scope.edit_order_flags.order_loaded && $scope.selected_shipping.id!='sitin' && $scope.selected_shipping.id!='' && $scope.selected_shipping.id=='local_pickup'){
							$scope.aiv_toggles.show_cash = false;
						}
				}
				/*if(!$scope.bagCharges.selected && $scope.selected_shipping.id!='sitin'){
					$scope.openBagChargesPopup();
				}else{
					$scope.checkBagCharges();
				}*/
		if($scope.startup.action=='TABLEVIEW'){
					
					var customer = $scope.selectedTable.orders[0].data.customer;
					
					if(customer.first_name!=""){

					if(customer.meta.loyalty_card_id!=0&&customer.meta.loyalty_card_id!="")
					$scope.selected_customer = shareData.getCustomer("LOYALTY_CARD",customer.meta.loyalty_card_id);
				
					if(!angular.isDefined($scope.selected_customer._id))
					$scope.selected_customer = shareData.getCustomer("PHONE",customer.billing_address.phone);
				
					if(angular.isDefined($scope.selected_customer._id))
					{
						$scope.formCheckout.customer_meta = $scope.selected_customer.meta;
					}
					}
					$scope.bagCharges.selected =0;
				}
				
				$scope.show_redeem_btn=false;
				if(!$scope.edit_order_flags.order_loaded && $scope.selected_customer && angular.isDefined($scope.selected_customer.meta.loyalty_card_id) && $scope.selected_customer.meta.loyalty_card_id){
						//Assign loyalty points
						$scope.checkLoyaltyCustomer($scope.selected_customer.billing_address.phone);
				}
				else if(!$scope.edit_order_flags.order_loaded && $scope.selected_customer){
					//Assign loyalty points
					$scope.checkLoyaltyCustomer($scope.selected_customer.billing_address.phone);
				}
				if($scope.startup.action!='TABLEVIEW' && $scope.settings_data.enableDeafalutBagCharge ==true){
					var confirmPopup = $ionicPopup.confirm({
						title: 'Bag Charges',
						template: '<label><span>'+$rootScope.aiv_info.currency_symbol+$scope.bagCharges.selected+'</span> bagcharge is added by default. Do you want to keep it?.</label>',
						cssClass: 'aiv-popup',
						buttons: [{ 
							text: 'NO',
							type: 'button-assertive',
							onTap: function(e) {
								$scope.bagCharges.selected = 0;
								return true;
							}
						},{ 
							text: 'YES',
							type: 'button-positive',
							onTap: function(e) {
								return true;
							}
						}]
					});

					confirmPopup.then(function(res) {
						if(res) {
							if(!$scope.edit_order_flags.order_loaded && $scope.selected_customer && angular.isDefined($scope.selected_customer.meta.loyalty_card_id) && $scope.selected_customer.meta.loyalty_card_id){
								//Assign loyalty points
								$scope.checkLoyaltyCustomer($scope.selected_customer.billing_address.phone);
							}
							$scope.checkBagCharges(true);
						}
					});
				}else{
					$scope.checkBagCharges(true);
				}
				
			}
		}else{
			$scope.showCheckoutMsg('Cart is empty','Please add some items to cart first');
		}
	}
	
	$scope.openShippingModal = function() {
		$scope.quickCustomerEnable =true;
		$scope.quickCustomerDisable =true;
		if($scope.ship_modal == undefined || !$scope.ship_modal._isShown){
			$scope.temp_shipping = angular.copy($scope.selected_shipping);
			$scope.shipping_methods = [];
			if($scope.terminalData.type != 'BACK'){
				if($scope.POSSettings.enable_sitin){
					$scope.shipping_methods.push({'id':'sitin','title':'Sit-In','method_title':'Sit-In','method_description':'','fee':''});
				}
				$scope.shipping_methods.push({'id':'','title':'Takeaway','method_title':'','method_description':'','fee':''});
				
			}
			angular.forEach($scope.ShippingMethods, function(item) {
				$scope.shipping_methods.push({'id':item.id,'title':item.title,'method_title':item.method_title,'method_description':item.method_description,'fee':item.fee});
			}, $scope.shipping_methods);
			
			for(var i=0;i<$scope.shipping_methods.length;i++){
				if($scope.temp_shipping.method_title == $scope.shipping_methods[i].method_title){
					$scope.temp_shipping = {
						'id':$scope.formCheckout.shipping_lines[0].method_id,
						'title':$scope.shipping_methods[i].title,
						'method_title':$scope.formCheckout.shipping_lines[0].method_title,
						'method_description':$scope.shipping_methods[i].method_description,
						'fee':$scope.formCheckout.shipping_lines[0].total
					};
	
					$scope.ship_select.id = $scope.temp_shipping.id;
					break;
				}
			}
	
			$scope.setKeyInput('SHIPPING',$scope.temp_shipping.fee);
			$ionicModal.fromTemplateUrl('shipping-modal.html', {
				id:'SHIPPING',
				backdropClickToClose: false,
				scope: $scope,
				animation: 'none'
			}).then(function(modal) {
				$scope.ship_modal = modal;
				$scope.openModal('SHIPPING');
			});
		}
	}
	
	$scope.note_type = '';
	$scope.openNoteModal = function(type,product){
		if($scope.note_modal != undefined && $scope.note_modal._isShown){
			return;
		}
		var open_modal = false;
		if(type == 'ORDER'){
			if($scope.cartItems.length){
				$scope.order_note = {note:''};
				$scope.order_note.note = $scope.formCheckout.shipping_note;
				open_modal = true;
			}else{
				$scope.showCheckoutMsg('Cart is empty','Please add some items to cart first');
			}
		}else if(type == 'PRODUCT'){
			open_modal = true;
			$scope.order_note = {note:''};
			$scope.order_note.note = angular.isDefined(product.notes)?product.notes:'';
		}
		
		if(open_modal){
			$scope.note_type = type;
			$scope.setKeyInput('ORDER_NOTE',$scope.order_note.note);
			$ionicModal.fromTemplateUrl('note-modal.html', {
				id:'ORDER_NOTE',
				scope: $scope,
				backdropClickToClose: false,
				animation: 'none'
			}).then(function(modal) {
				$scope.note_modal = modal;
				$scope.openModal('ORDER_NOTE');
			});
		}
	}
	
	$scope.openSettingsModal = function(close_btn){
		
		$scope.settings_error = {err:'',pass:''};
		$scope.settings_close = close_btn;
						
		if($scope.loginInfo.role == 'user'||$scope.loginInfo.role=='server'){
			$scope.menu_settings = {active:'Reports',show_save:false};
		}else{
			$scope.menu_settings = {active:'Settings',show_save:true};
		}
		$scope.initalizeTable();
		showSettings(true);
	}
	
	$scope.allCustomers = [];
	$scope.openCustomerModal = function(deposit){ //update on 20-07-2019 to add deposit modal 
		if(deposit==true){
			$scope.setKeyInput('SEARCH_PHONE',$scope.search_inputs.phone)
			$scope.allCustomers = [];
			$scope.allCustomers = shareData.getCustomers();
			$ionicModal.fromTemplateUrl('customer-modal.html', {
				id:'CUSTOMER',
				scope: $scope,
				backdropClickToClose: false,
				animation: 'none'
			}).then(function(modal){
				modal.el.className = modal.el.className + " customer-edit-modal";
				$scope.customer_modal = modal;
				$scope.openModal('CUSTOMER');
				$scope.deposite_modal.remove();
			});
		}else{
			$scope.quickFind=false;
			$scope.showErrCust =false;
			if($scope.ship_select.id != null||$scope.startup.action=='TABLEVIEW'){
				if($scope.customer_modal != undefined && $scope.customer_modal._isShown){
					return;
				}
				$scope.setKeyInput('SEARCH_PHONE',$scope.search_inputs.phone)
				$scope.allCustomers = [];
				$scope.allCustomers = shareData.getCustomers();
					$ionicModal.fromTemplateUrl('customer-modal.html', {
					id:'CUSTOMER',
					scope: $scope,
					backdropClickToClose: false,
					animation: 'none'
				}).then(function(modal) {
					modal.el.className = modal.el.className + " customer-edit-modal";
					$scope.customer_modal = modal;
					$scope.openModal('CUSTOMER');
				});
			}else{
				$scope.showCheckoutMsg('Select order type','Please select order type first');
				//$scope.closeModal('CUSTOMER');
				$scope.openShippingModal();
			}
		}
	}

	/*$scope.openCustomerModal = function(){
		$scope.quickFind=false;
		$scope.showErrCust =false;
		if($scope.ship_select.id != null||$scope.startup.action=='TABLEVIEW'){
			if($scope.customer_modal != undefined && $scope.customer_modal._isShown){
				return;
			}
			$scope.setKeyInput('SEARCH_PHONE',$scope.search_inputs.phone)
			$scope.allCustomers = [];
			$scope.allCustomers = shareData.getCustomers();
			
			$ionicModal.fromTemplateUrl('customer-modal.html', {
				id:'CUSTOMER',
				scope: $scope,
				backdropClickToClose: false,
				animation: 'none'
			}).then(function(modal) {
				modal.el.className = modal.el.className + " customer-edit-modal";
				$scope.customer_modal = modal;
				$scope.openModal('CUSTOMER');
			});
		}else{
			$scope.showCheckoutMsg('Select order type','Please select order type first');
			//$scope.closeModal('CUSTOMER');
			$scope.openShippingModal();
		}
	}*/
	
	$scope.resetViewCustomers = function(){
		$scope.search_inputs.customer='';
		$scope.allCustomers = [];
		$scope.allCustomers = shareData.getCustomers();
		$scope.viewCustomers = $scope.allCustomers.slice(0,30);
	}
	
	$scope.viewCustomerModal = function(){
		if($scope.view_customer_modal != undefined && $scope.view_customer_modal._isShown){
			return;
		}
		$scope.setKeyInput('VIEW_CUSTOMER',$scope.search_inputs.customer)
		$scope.resetViewCustomers();
		$scope.infiniteLimit = 4;
		$ionicModal.fromTemplateUrl('view-customer-modal.html', {
			id:'VIEW_CUSTOMER',
			scope: $scope,
			backdropClickToClose: false,
			animation: 'none'
		}).then(function(modal) {
			$scope.view_customer_modal = modal;
			$scope.openModal('VIEW_CUSTOMER');
		});
	}
	
	$scope.infiniteLimit = 1;
	$scope.loadMore = function() {
		$scope.infiniteLimit += 1;
		$scope.$broadcast('scroll.infiniteScrollComplete');
	 }, 1000;

	 $scope.moreDataCanBeLoaded = function(data) {
		return data.length > $scope.infiniteLimit;
	 }

	$scope.cutomer_edit = false;
	$scope.old_loyalt_card_id = '';
	$scope.openCustomerEditModal = function(edit){
		
		$scope.aiv_toggles.show_customer_extra = true;
		if($scope.customer_edit_modal == undefined || !$scope.customer_edit_modal._isShown){
			$scope.formNotValid = false;
			$scope.spinDisabled = true;
			$scope.cutomer_edit = edit;
			$scope.delivery_areas.value = '';
			$scope.delivery_areas.selected = '';
			$scope.delivery_areas.show = false;
			if(edit && ($scope.formCheckout.customer_id != "guest" || $scope.loyalty_card.id)){
				if($scope.selected_shipping.id == "local_delivery" && angular.isUndefined($scope.formCustomer.del_charge)){
					$scope.selected_shipping.fee = $scope.getDeliveryCharge($scope.formCheckout.shipping_address);
				}
				$scope.formCustomer = {};
				$scope.formCustomer.billing_address = angular.copy($scope.formCheckout.billing_address);
				$scope.formCustomer.shipping_address = angular.copy($scope.formCheckout.shipping_address);
				$scope.formCustomer.customer_id = $scope.formCheckout.customer_id;
				$scope.formCustomer.sameAddress = $scope.formCheckout.sameAddress;
				$scope.formCustomer.del_charge = $scope.selected_shipping.fee;
				if(angular.isUndefined($scope.formCheckout.customer_meta.loyalty_card_id) || !$scope.formCheckout.customer_meta.loyalty_card_id){
					var card_id = $scope.generateLoyaltyCard();
					$scope.loyalty_card.id = card_id?card_id.toString():'';
					$scope.formCheckout.customer_meta.loyalty_card_id = $scope.loyalty_card.id;
					$scope.formCustomer.meta = {"loyalty_card_id": angular.isDefined($scope.formCheckout.customer_meta.loyalty_card_id)?$scope.formCheckout.customer_meta.loyalty_card_id:''};
					$scope.old_loyalt_card_id = '';
				}else{
					$scope.formCustomer.meta = {"loyalty_card_id": angular.isDefined($scope.formCheckout.customer_meta.loyalty_card_id)?$scope.formCheckout.customer_meta.loyalty_card_id:''};
					$scope.old_loyalt_card_id = $scope.formCustomer.meta.loyalty_card_id;
				}
				
				if($scope.formCustomer.billing_address.state){
					for(var i=0;i<$scope.delivery_areas.areas.length;i++){
						if($scope.delivery_areas.areas[i].area == $scope.formCustomer.billing_address.state){
							$scope.delivery_areas.selected = $scope.delivery_areas.areas[i].area;
							$scope.delivery_areas.value = $scope.delivery_areas.areas[i].area+" : "+$rootScope.aiv_info.currency_symbol+$scope.delivery_areas.areas[i].amount;
							break;
						}
					}
				}
				$scope.setKeyInput('CUSTOMER_EDIT_FNAME',$scope.formCustomer.billing_address.first_name);
				
				$scope.post_lookup = {
					billing:true,
					shipping:true,
					billing_street:[],
					shipping_street:[],
					billing_model:'',
					shipping_model:'',
					billing_match:[],
					shipping_match:[],
					show_billing_streets:false,
					show_shipping_streets:false
				};
				$scope.PostcodeLookup(true,false);
			}else if(!edit){
				var card_id = $scope.generateLoyaltyCard();
				$scope.loyalty_card.id = card_id?card_id.toString():'';
				$scope.post_lookup = {
					billing:false,
					shipping:false,
					billing_street:[],
					shipping_street:[],
					billing_model:'',
					shipping_model:'',
					billing_match:[],
					shipping_match:[],
					show_billing_streets:false,
					show_shipping_streets:false
				};
				$scope.formCustomer = {
					"billing_address": {
						"first_name": (/^\d+$/.test($scope.search_inputs.phone))?"":$scope.search_inputs.phone,
						"last_name": "",
						"address_1": "",
						"address_2": "",
						"city": "",
						"state": "",
						"postcode": "",
						"country": $scope.base_country,
						"email": "",
						"phone": $scope.CID_ph_num||((/^\d+$/.test($scope.search_inputs.phone))?$scope.search_inputs.phone:""),
						"company": ""
					},
					"customer_id": "guest",
					"sameAddress": true,
					"shipping_address": {
						"first_name": "",
						"last_name": "",
						"address_1": "",
						"address_2": "",
						"city": "",
						"state": "",
						"postcode": "",
						"country": $scope.base_country
					},
					"del_charge":$scope.selected_shipping.fee,
					meta:{
						"loyalty_card_id":$scope.loyalty_card.id,
						"points_to_unlock":0,
						"points_to_redeem":0,
						"customer_note":""
					}
				};
				$scope.setKeyInput('CUSTOMER_EDIT_FNAME',$scope.formCustomer.billing_address.first_name);
				$ionicModal.fromTemplateUrl('customer-edit-modal.html', {
					id:'CUSTOMER_EDIT',
					scope: $scope,
					backdropClickToClose: false,
					animation: 'none'
				}).then(function(modal) {
					modal.el.className = modal.el.className + " customer-edit-modal";
					$scope.customer_edit_modal = modal;
					$scope.openModal('CUSTOMER_EDIT');
				});
			}
			
			if($scope.CID_ph_num && $scope.call_processed){
				 $scope.CID_ph_num = '';
			}
		}
	}
	
	$scope.order_status = ['All','Pending','Processing','On-hold','Completed','Cancelled','Unpaid'];
	$scope.showOnlineOrders = 'POS';
	$scope.openOrderModal = function(){
		if($scope.order_modal != undefined && $scope.order_modal._isShown){
			return;
		}
		$scope.getAllOrders('POS',true);
		
		$scope.temp_drivers = angular.copy($scope.delivery_drivers.drivers);
		$scope.temp_drivers.unshift({id:-1,name:'--Select driver--',orders:[]});
	}
	
	$scope.kitchenReadyOrders = [];
	var getKitchenReadyOrders = function(loading){
		if($rootScope.aiv_info.enable_kitchen == "TRUE" && $scope.terminalData.type != 'KITCHEN'){
			$scope.kitchenReadyOrders = [];
			
			var find_index = {
				fields: ['data.order_meta.processed_by'],
				name: 'reportindex',
				ddoc: 'reportdesigndoc'
			}

			find_params = {}
			
			var find_selector = {
				$and:[
					{"data.order_meta.processed_by": $scope.terminalData.name},
					{"data.status": "kitchen-ready"}
				]
			}
			
			if(loading){
				$ionicLoading.show({
					template: '<ion-spinner icon="ios"></ion-spinner><br><span class="aiv-loading">Fetching orders<br>Please wait...</span>',
					animation: 'fade-in',
					showBackdrop: true,
					maxWidth: 300,
					showDelay: 0
				});
			}
		
			$pouchDB.find(find_index,find_selector,find_params).then(function (res) {
				angular.forEach(res.docs, function(order) {
					$scope.kitchenReadyOrders.push(order);
					add2Ready(order.data.order_meta.bill_number);
				},$scope.kitchenReadyOrders)
				if(loading){
					$ionicLoading.hide();
				}
			}).catch(function (error) {
				$scope.settings_error.err = 'Oops...An error occurred while retrieving orders!!!';
				console.error(error);
				if(loading){
					$ionicLoading.hide();
				}
			});
		}
	}
	
	$scope.unpaidTableOrders = [];
	var getTableUnpaidOrders = function(){
		if($rootScope.aiv_info.enable_table == "TRUE"){
			$ionicLoading.show({
				template: '<ion-spinner icon="ios"></ion-spinner><br><span>Fetching orders<br>Please wait...</span>',
				animation: 'fade-in',
				showBackdrop: true,
				maxWidth: 300,
				showDelay: 0
			});

			var config = {
				include_docs: true
			}
			
			$pouchDB.bulkFetch(config).then(function(returnData){
				$scope.unpaidTableOrders = [];
				angular.forEach(returnData.rows,function(row){
					if(row.doc._id.includes('_order_')){
						if(angular.isDefined(row.doc.data.order_meta.table_num) && row.doc.data.order_meta.table_num && row.doc.data.status=="on-hold"){
							$scope.unpaidTableOrders.push(row.doc);
							add2Table(row.doc.data.order_meta.bill_number);
						}
					}
				});
				$ionicLoading.hide();
				console.log("Order count : "+$scope.unpaidTableOrders.length+"/"+returnData.rows.length);
			}).catch(function (error) {
				$scope.showCheckoutMsg('Error','An error occurred while retrieving orders');
				console.error(error);
				$ionicLoading.hide();
			});
		}
	}
	
	var getUnpaidCollectionOrders = function(online,loading,create = false){
		$scope.pendingOrders = [];
		var search_start = false;
		var all_orders = shareData.getOrders();
		if(!all_orders.length)return;
	
		if(loading){
			$ionicLoading.show({
				template: '<ion-spinner icon="ios"></ion-spinner><br><span class="aiv-loading">Fetching orders<br>Please wait...</span>',
				animation: 'fade-in',
				showBackdrop: true,
				maxWidth: 300,
				showDelay: 0
			});
		}
		
		if($scope.terminalData.type == 'FRONT'){
			var back_terminals = [];
			for(var i=0;i<$scope.aiv_terminals.terminals.length;i++){
				if($scope.aiv_terminals.terminals[i].type == 'BACK' || $scope.aiv_terminals.terminals[i].name == $scope.terminalData.name){
					back_terminals.push($scope.aiv_terminals.terminals[i]);
				}
			}
			
			if(back_terminals.length){
				search_start = true;
				angular.forEach(back_terminals,function(terminal){
					var docid = terminal.name+'_order_';
					var orders = $filter('filter')(all_orders,{_id:docid},false);
					angular.forEach(orders, function(order) {
						if(angular.isArray(order.data.shipping_lines) && order.data.shipping_lines.length && order.data.shipping_lines[0].method_id=='local_pickup' && (order.data.status=='on-hold'||order.data.status=='kitchen-ready')){
							$scope.pendingOrders.push(order);
							add2Alert(order.data.order_meta.bill_number);
						}
					})
				});
				
				if(loading && !online){
					$ionicLoading.hide();
				}else{
					$timeout(function(){},0);
				}
				/*Promise.all(back_terminals.map(function (terminal) {
					var docid = terminal.name+'_order_';
					return $pouchDB.search(docid,true,true);
				})).then(function(returnData) {
					angular.forEach(returnData, function(data) {
						angular.forEach(data.rows, function(order) {
							//if(angular.isArray(order.doc.data.shipping_lines) && order.doc.data.shipping_lines[0].method_id=='local_pickup' && !order.doc.data.payment_details.paid && (order.doc.data.status=='on-hold'||order.doc.data.status=='kitchen-ready')){
							//if(order.doc.data.order_meta.processed_by != $scope.terminalData.name && angular.isArray(order.doc.data.shipping_lines) && order.doc.data.shipping_lines[0].method_id=='local_pickup' && (order.doc.data.status=='on-hold'||order.doc.data.status=='kitchen-ready')){
							if(angular.isArray(order.doc.data.shipping_lines) && order.doc.data.shipping_lines.length && order.doc.data.shipping_lines[0].method_id=='local_pickup' && (order.doc.data.status=='on-hold'||order.doc.data.status=='kitchen-ready')){
								$scope.pendingOrders.push(order.doc);
								add2Alert(order.doc.data.order_meta.bill_number);
							}
						},$scope.pendingOrders)
					})
					
					if(loading && !online){
						$ionicLoading.hide();
					}else{
						$timeout(function(){},0);
					}
				}).catch(function(error){
					console.log(error);
					if(loading && !online){
						$ionicLoading.hide();
					}
				});*/
			}
		}
		
		var processing_orders = false;
		if(online && $scope.terminalData.type != 'KITCHEN'){
			search_start = true;
			var orders = $filter('filter')(all_orders,{_id:'AIVOOT_order_'},false);
			angular.forEach(orders, function(order) {
				if($scope.terminalData.type != 'FRONT' && (order.data.status == 'processing' || order.data.status == 'pending')){
					$scope.pendingOrders.push(order);
					add2Alert(order.data.order_meta.bill_number);
					if(order.data.status == 'processing'){
						processing_orders = true;
					}
				}else if($scope.terminalData.type == 'FRONT' && order.data.order_meta.processed_by != $scope.terminalData.name && angular.isArray(order.data.shipping_lines) && order.data.shipping_lines.length && order.data.shipping_lines[0].method_id=='local_pickup' && (order.data.status=='on-hold'||order.data.status=='kitchen-ready')){
					$scope.pendingOrders.push(order);
					add2Alert(order.data.order_meta.bill_number);
				}
			})
			
			if(create && ($scope.pending_order_modal==undefined || !$scope.pending_order_modal._isShown)){
				$ionicModal.fromTemplateUrl('view-pending-order-modal.html', {
					id:'VIEW_PENDING_ORDER',
					scope: $scope,
					backdropClickToClose: false,
					animation: 'none'
				}).then(function(modal) {
					$scope.pending_order_modal = modal;
					$scope.openModal('VIEW_PENDING_ORDER');
				});
			}else if(!create && $scope.online_order._id == undefined && $scope.onlineOrder.enable && processing_orders){
				//Show new order
				
				
				
				var doc = $scope.pendingOrders[0];
				if(doc.data.shipping_lines[0].method_id == 'local_delivery'){
					doc.data.order_meta.duration = '40 Minutes';
				}else if(doc.data.shipping_lines[0].method_id == 'local_pickup'){
					doc.data.order_meta.duration = '20 Minutes';
				}
				$scope.online_order = angular.copy(doc);
				$scope.showOnlineModal();
				//Play sound
				$scope.online_order_audio.play();
			}
			if(loading){
				$ionicLoading.hide();
			}else{
				$timeout(function(){},0);
			}
				
			/*$pouchDB.search('AIVOOT_order_',true,true).then(function(returns) {
				angular.forEach(returns.rows, function(order) {
					if($scope.terminalData.type != 'FRONT' && (order.doc.data.status == 'processing' || order.doc.data.status == 'pending')){
						$scope.pendingOrders.push(order.doc);
						add2Alert(order.doc.data.order_meta.bill_number);
						if(order.doc.data.status == 'processing'){
							processing_orders = true;
						}
					}else if($scope.terminalData.type == 'FRONT' && order.doc.data.order_meta.processed_by != $scope.terminalData.name && angular.isArray(order.doc.data.shipping_lines) && order.doc.data.shipping_lines.length && order.doc.data.shipping_lines[0].method_id=='local_pickup' && (order.doc.data.status=='on-hold'||order.doc.data.status=='kitchen-ready')){
					//else if($scope.terminalData.type == 'FRONT' && angular.isArray(order.doc.data.shipping_lines) && order.doc.data.shipping_lines[0].method_id=='local_pickup' && !order.doc.data.payment_details.paid && (order.doc.data.status=='on-hold'||order.doc.data.status=='kitchen-ready')){
						$scope.pendingOrders.push(order.doc);
						add2Alert(order.doc.data.order_meta.bill_number);
					}
				},$scope.pendingOrders)
				
				if(create && ($scope.pending_order_modal==undefined || !$scope.pending_order_modal._isShown)){
					$ionicModal.fromTemplateUrl('view-pending-order-modal.html', {
						id:'VIEW_PENDING_ORDER',
						scope: $scope,
						backdropClickToClose: false,
						animation: 'none'
					}).then(function(modal) {
						$scope.pending_order_modal = modal;
						$scope.openModal('VIEW_PENDING_ORDER');
					});
				}else if(!create && $scope.online_order._id == undefined && $scope.onlineOrder.enable && processing_orders){
					//Show new order
					var doc = $scope.pendingOrders[0];
					if(doc.data.shipping_lines[0].method_id == 'local_delivery'){
						doc.data.order_meta.duration = '40 Minutes';
					}else if(doc.data.shipping_lines[0].method_id == 'local_pickup'){
						doc.data.order_meta.duration = '20 Minutes';
					}
					$scope.online_order = angular.copy(doc);
					$scope.showOnlineModal();
					//Play sound
					$scope.online_order_audio.play();
				}
				if(loading){
					$ionicLoading.hide();
				}else{
					$timeout(function(){},0);
				}
			}).catch(function(error){
				console.log(error);
				if(loading){
					$ionicLoading.hide();
				}
			});*/
		}
		
		if(!search_start && loading){
			$ionicLoading.hide();
		}
	}

	var getPOSCollectionOrders = function(orders){
		var back_terminals = [];
		for(var i=0;i<$scope.aiv_terminals.terminals.length;i++){
			if($scope.aiv_terminals.terminals[i].type == 'BACK'){
				back_terminals.push($scope.aiv_terminals.terminals[i]);
			}
		}
		
		if(back_terminals.length){
			$ionicLoading.show({
				template: '<ion-spinner icon="ios"></ion-spinner><br><span class="aiv-loading">Fetching orders<br>Please wait...</span>',
				animation: 'fade-in',
				showBackdrop: true,
				maxWidth: 300,
				showDelay: 0
			});
			search_start = true;
			Promise.all(back_terminals.map(function (terminal) {
				var docid = terminal.name+'_order_';
				return $pouchDB.search(docid,true,true);
			})).then(function(returnData) {
				angular.forEach(returnData, function(data) {
					angular.forEach(data.rows, function(order) {
						if(angular.isArray(order.doc.data.shipping_lines) && order.doc.data.shipping_lines.length && order.doc.data.shipping_lines[0].method_id=='local_pickup' && (order.doc.data.status=='on-hold' || order.doc.data.status=='kitchen-ready' || order.doc.data.status=='completed')){
							orders.push(order.doc);
						}
					},orders)
				})
				$ionicLoading.hide();
			}).catch(function(error){
				console.log(error);
				$ionicLoading.hide();
			});
		}
	}
	
	$scope.pendingOrders = [];
	$scope.pending_order_status = ['All','Pending','Processing','On-hold'];
	$scope.openPendingOrderModal = function(){
		if(!$scope.onlineOrder.enable && $scope.terminalData.type != 'FRONT'){
			return;
		}
		getUnpaidCollectionOrders(true,true,true);
	}
	
	$scope.openKitchenOrderModal = function(){
		getKitchenReadyOrders(true);

		$ionicModal.fromTemplateUrl('view-kitchen-order-modal.html', {
			id:'VIEW_KITCHEN_ORDER',
			scope: $scope,
			backdropClickToClose: false,
			animation: 'none'
		}).then(function(modal) {
			$scope.kitchen_orderlist_modal = modal;
			$scope.openModal('VIEW_KITCHEN_ORDER');
		});
	}
	
	$scope.openTableOrderModal = function(){
		getTableUnpaidOrders();

		$ionicModal.fromTemplateUrl('view-table-order-modal.html', {
			id:'VIEW_TABLE_ORDER',
			scope: $scope,
			backdropClickToClose: false,
			animation: 'none'
		}).then(function(modal) {
			$scope.table_orderlist_modal = modal;
			$scope.openModal('VIEW_TABLE_ORDER');
		});
	}
	
	$scope.aiv_users = {
		selected : '',
		err : '',
		pass: '',
		login_close:true,
		users:[],
		clock_in:''
	};
	$scope.clock_user = '';
	$scope.selectClockUser = function(user){
		//if(!$scope.aiv_users.clock_in)return;
		$scope.clock_user=user;
		$scope.aiv_users.err = '';
		$scope.clockInOrNot ='';
		$scope.showClockInButton =false;

		//$scope.aiv_toggles.user_view = false;
	}
	$scope.openClockModel =function(){
		$scope.aiv_toggles.user_view = true;
		$scope.setKeyInput('CLOCK_PASS',$scope.qwerty_inputs.clock_pass);
	}
	$scope.exitClockScreen = function(){
		$scope.showClockInButton =false;
		$scope.aiv_toggles.user_view = false;
		$scope.setKeyInput('LOGIN_PASS',$scope.qwerty_inputs.pass);
		$scope.aiv_users.err = '';
		$scope.clock_user = '';
		$scope.aiv_users.clock_in = '';
	}
		
	$scope.reloadUsers = function(close_btn=false){
	
		$scope.aiv_users = {
					selected : '',
					err : '',
					pass: '',
					login_close:close_btn,
					users:[],
					clock_in : ''
				};

				$pouchDB.search('users_',true,false).then(function(returnData) {
					angular.forEach(returnData.rows,function(user){
						$scope.aiv_users.users.push(user.doc);
						/* if(!$scope.user_register.length){
							add2Register(user.doc,true);
						} */
					},$scope.aiv_users.users);

					if(!$scope.aiv_users.users.length){
						$scope.aiv_users.err = 'No users found.Please add a user to continue...';
					}
					$scope.setKeyInput('LOGIN_PASS',$scope.qwerty_inputs.pass);
					
					
				}).catch(function(error) {
					console.log(error);
					$scope.showCheckoutMsg('Error','Unable to retrieve users...');
				});
	
	}
	
	$scope.openUserModal = function(close_btn){
		if($scope.loginInfo.user_login == '' && ($scope.user_modal == undefined || !$scope.user_modal._isShown)){
			/*if($window.innerWidth >=1500 && $scope.terminalData.type!='FRONT'){
				$ionicSideMenuDelegate.toggleRight();
			}*/

			if($scope.aiv_users.users.length){
				//Users already loaded
				$scope.aiv_users.selected = '';
				$scope.aiv_users.err = '';
				$scope.aiv_users.pass = '';
				$scope.aiv_users.login_close = close_btn;
				$scope.aiv_users.clock_in = '';
				$scope.setKeyInput('LOGIN_PASS',$scope.qwerty_inputs.pass);
				$ionicModal.fromTemplateUrl('user-modal.html', {
					id:'POS_USERS',
					scope: $scope,
					backdropClickToClose: false,
					animation: 'none'
				}).then(function(modal) {
					modal.el.className = modal.el.className + " top-modal";
					$scope.user_modal = modal;
					$scope.openModal('POS_USERS');
				});
			}else{
				//Load from database
				$scope.aiv_users = {
					selected : '',
					err : '',
					pass: '',
					login_close:close_btn,
					users:[],
					clock_in : ''
				};

				$pouchDB.search('users_',true,false).then(function(returnData) {
					angular.forEach(returnData.rows,function(user){
						$scope.aiv_users.users.push(user.doc);
						/* if(!$scope.user_register.length){
							add2Register(user.doc,true);
						} */
					},$scope.aiv_users.users);

					if(!$scope.aiv_users.users.length){
						$scope.aiv_users.err = 'No users found.Please add a user to continue...';
					}
					$scope.setKeyInput('LOGIN_PASS',$scope.qwerty_inputs.pass);
					$ionicModal.fromTemplateUrl('user-modal.html', {
						id:'POS_USERS',
						scope: $scope,
						backdropClickToClose: false,
						animation: 'none'
					}).then(function(modal) {
						modal.el.className = modal.el.className + " top-modal";
						$scope.user_modal = modal;
						$scope.openModal('POS_USERS');
					});
					
				}).catch(function(error) {
					console.log(error);
					$scope.showCheckoutMsg('Error','Unable to retrieve users...');
				});
			}
		}
	}
	
	$scope.openItemModal = function(){
		if($scope.open_item_modal != undefined && $scope.open_item_modal._isShown){
			return;
		}
		$scope.custom_product = {
			"id":"",
			"product_id": "",
			"sku": "",
			"price": "",
			"featured_src": "",
			"title": "",
			"categories": ["Open Item###"+$rootScope.aiv_info.shop_id],
			"attributes":[],
			"meta":{
				"wc_productdata_options":[{
					"prdt_dept":[],
					"group":"",
					"types":[]
				}]
			},
			"err":""
		};
		$scope.setKeyInput('OPEN_PRDT_NAME',$scope.custom_product.title);
		$ionicModal.fromTemplateUrl('open_item-modal.html', {
			id:'CUSTOM_PRODUCT',
			scope: $scope,
			backdropClickToClose: false,
			animation: 'none'
		}).then(function(modal) {
			$scope.open_item_modal = modal;
			$scope.openModal('CUSTOM_PRODUCT');
		});
	}
	
	$scope.arraySinglePush = function(array,item){
		if(array.indexOf(item)<0){
			array.push(item);
		}
	}
		
	$scope.updateBagCharge = function(charge,popup){
		$scope.bagCharges.selected = parseFloat(charge);
		if(popup){
			$scope.bagPopup.close();
		}
		if($scope.cartItems.length){
			$scope.checkBagCharges(false);
		}
	}
	
	$scope.openBagChargesPopup = function(){
		$scope.bagPopup = $ionicPopup.show({
			templateUrl: 'bagcharges-popup.html',
			title: 'Bag Charges',
			scope: $scope,
			buttons: [/*{ 
				text: 'Cancel',
				type: 'button-assertive',
				onTap: function(e) {

				}
			}*/]
		});
	}
	
	$scope.checkBagCharges = function(create){
		var bag_charge = false;
		if($scope.split_payment.paid){
			$scope.split_payment.total = $scope.grand.Total + $scope.grand.Shipping - $scope.grand.Discount + $scope.bagCharges.selected;
			$scope.split_payment.to_pay = $scope.split_payment.total-$scope.split_payment.paid;
			$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'split_payment',$scope.split_payment);
			
			$scope.payment_select.to_pay = $scope.split_payment.to_pay;
		}else{
			var total = $scope.grand.Total + $scope.grand.Shipping - $scope.grand.Discount + $scope.payment_fee + $scope.bagCharges.selected;
			if($scope.startup.action=='TABLEVIEW'){
				if($scope.selectedTable.orders[0].split_value){
					total = parseFloat((total/$scope.selectedTable.orders[0].split_value.count).toFixed(2));
				}else if($scope.selectedTable.orders[0].split_unequal_value.length){
					total = $scope.selectedTable.orders[0].data.order_meta.split_unequal_value;
				}
			}
			$scope.payment_select.to_pay = total;

		}
		$scope.amount_key = '£'+parseFloat($scope.payment_select.to_pay).toFixed(2);
		
		if(create){
			$scope.payment_select.shipping_method = $scope.selected_shipping.title;
			$scope.payment_select.customer_id = $scope.formCheckout.customer_id;
			open_payment_modal();
		}
		//bag charges not necessary for collection orders
		/*if(angular.isArray($scope.formCheckout.shipping_lines) && $scope.formCheckout.shipping_lines.length && $scope.formCheckout.shipping_lines[0].method_id == 'local_pickup'){
			open_payment_modal();
		}else{
			//Check if already added
			for(var i=0;i<$scope.cartItems.length;i++){
				if($scope.cartItems[i].categories[0] == 'Bag Charges'){
					bag_charge = true;
					break;
				}
			}
			
			if(!bag_charge){
				var confirmPopup = $ionicPopup.confirm({
					title: 'Bag Charges',
					template: 'Add bag charges?'
				});

				confirmPopup.then(function(res) {
					if(res) {//Load Bag Charges category
						var bag_category = '';
						confirmPopup.close();
						for(var i=0;i<$scope.categories.length;i++){
							if($scope.categories[i].name == 'Bag Charges'){
								bag_category = $scope.categories[i];
							}
						}
						if(bag_category != ''){
							$scope.getProducts(bag_category,false);
						}else{
							open_payment_modal();
							$scope.showCheckoutMsg('Error','No Bag Charges found. Please request your administrator to add Bag Charges category and items.');
						}
					}else{
						open_payment_modal();
					}
				});
			}else{
				open_payment_modal();
			}
		}*/
	}
	
	var createSettingsTemplate = function(){
		if($scope.settings_modal != undefined && $scope.settings_modal._isShown){
			return;
		}
		$ionicModal.fromTemplateUrl('settings-modal.html', {
			id:'POS_SETTINGS',
			scope: $scope,
			backdropClickToClose: false,
			animation: 'none'
		}).then(function(modal) {
			$scope.settings_modal = modal;
			$scope.openModal('POS_SETTINGS');
		});
	}
	
	$scope.kitchenTerminals = [];
	var showSettings = function(create){
		//Terminal settings
		$scope.settings_data.terminal = angular.copy($scope.terminalData);
		$scope.aivTerminals = [];
		$scope.kitchenTerminals = [];
		$scope.settings_data.order_type = $scope.order_type;
		$scope.settings_data.local_ip = $scope.local_ip;
		$scope.settings_data.localdb_ip = $scope.localdb_ip;
		//POS settings
		$scope.settings_data.pos_settings = angular.copy($scope.POSSettings);
		$scope.settings_data.pos_settings.early_takeaway.start = new Date($scope.POSSettings.early_takeaway.start);
		$scope.settings_data.pos_settings.early_takeaway.end = new Date($scope.POSSettings.early_takeaway.end);
		
		$scope.settings_data.default_btns = angular.copy($scope.defaultBtns);
		$scope.settings_data.payment_methods = angular.copy($scope.PaymentMethods);
		$scope.settings_data.dept_receiptCount = angular.copy($scope.dept_receiptCount);
		$scope.settings_data.common_printer_settings = angular.copy($scope.commonPrintSettings);
		$scope.settings_data.other_settings = angular.copy($scope.OtherSettings);

		//Printer settings
		findPrinters();
		
		$scope.settings_data.printers = angular.copy($scope.AIVPrinterSettings);
		$scope.settings_data.kot_printer1 = angular.copy($scope.KOTPrinter1Settings);
		$scope.settings_data.kot_printer2 = angular.copy($scope.KOTPrinter2Settings);
		$scope.settings_data.label_printer = angular.copy($scope.LabelPrinterSettings);
		
		$scope.settings_data.online_order = angular.copy($scope.onlineOrder);
		$scope.settings_data.call_order = angular.copy($scope.callOrder);
		$scope.settings_data.justEat = angular.copy($scope.justEat);
		
		//CallerID settings
		$scope.listSerialPorts();
		$scope.settings_data.callerid = angular.copy($scope.settingsCID);
		//$pouchDB.get('getTerminals').then(function(all_terminals) {
			$scope.aivTerminals = $scope.aiv_terminals.terminals;
			if(create){
				createSettingsTemplate();
			}
		/*}).catch(function(error){
			console.log(error);
			$scope.showCheckoutMsg('Error','An error occurred while retrieving terminal list!!!');
		});*/
		
		if($rootScope.aiv_info.enable_kitchen == "TRUE"){
			//Find all kitchen terminal docs
			$pouchDB.searchText("KITCHEN",['type']).then(function(returnData) {
				for(var i=0;i<returnData.rows.length;i++){
					$scope.kitchenTerminals.push(returnData.rows[i].doc);
				}
			}).catch(function(error) {
				console.log(error);
			});
		}
	}
	//Function to wipe all orders 
	$scope.wipeOrders =function(wipe,deleteDate=false){
		$scope.formSales.created_at =new Date();
		$scope.formSales.user = $scope.loginInfo.user_login;
		$scope.formSales.shop =$rootScope.aiv_info.shop_name;
		$scope.formSales.date =$scope.sales_from_date;
		var dataReturn =false;
		var ids = [];//Get all terminal ids
		var id_count = 0;
		if($scope.orderlistSettings.view_all){ //push all terminals
			for(var i=0;i<$scope.aiv_terminals.terminals.length;i++){
				ids.push($scope.aiv_terminals.terminals[i].name);
			}
			ids.push('AIVOOT'); // push online order terminal
		}else{
		ids.push($scope.terminalData.name); //push current terminal
		ids.push('AIVOOT');
		}
		//Function run reccrusively to orders in all terminals
		var wipeTerminalOrders =function(wipe,deleteDate){
			dataReturn =false;
			var docs = [],orders = [];
			var doc_count = 0;
			var pendingIds = [];
			var pendingIdsDlt =[];
			var unpaidIds = [];
			var kitchenIds = [];
			var requested_docs ;
			//Adding start key and end key 
			if(ids.length){
			$scope.wipeconfig.include_docs=true;
			$scope.wipeconfig.startkey = ids[id_count]+'_order_';
			$scope.wipeconfig.endkey = ids[id_count]+'_order_\ufff0';
			$scope.wipeconfig.limit=10000;
			}
			ids.splice(0,1);
			$ionicLoading.show({
				template : '<h2>Please wait, final process running...</h2>',
				
			});
			var pendingIdsDltDeposit=[]
			var onlineconfig1 = {include_docs:true,startkey : 'depposit_', endkey : 'depposit_\ufff0',limit:500};
			$pouchDB.bulkFetch(onlineconfig1).then(function(docsdeposit){
				angular.forEach(docsdeposit.rows,function(row){					
				$scope.depositInfo.push(row.doc);
				if(row.doc.data.Amount ==0){
					pendingIdsDltDeposit.push({_id : row.id, _rev: row.value.rev, _deleted : true });
				}
				});
				if(pendingIdsDltDeposit.length)
					result = $pouchDB.bulkDocs(pendingIdsDltDeposit);
			}).then(function(resp){
				console.log(resp);
			}).catch(function(error){
				console.log(error);
			});
			//Fetch all data from pouchDb with given start key  and end key
			$pouchDB.bulkFetch($scope.wipeconfig).then(function(pendingDocs){
					requested_docs = pendingDocs;
					if(deleteDate!= false){
					var delete_date =new Date(deleteDate);
						angular.forEach(pendingDocs.rows, function(row) {
						//Looking for any pending order exist
							if(row.hasOwnProperty("doc")&&row.doc.hasOwnProperty("data")){
								if(row.doc.data!=null)
								var created_date = new Date(row.doc.data.created_at);
								if(created_date<=delete_date){
									if(row.id.includes('pending')){
										var term = row.id.split('_')[0];
										if(term != "AIVOOT"){
											pendingIds.push(term+'_pending_'+row.doc.data.pending_data.order_no);
											pendingIdsDlt.push({_id : row.id, _rev: row.value.rev, _deleted : true });
										}
									}
									//Looking for any unpaid order exist
									if(row.doc.data.hasOwnProperty("payment_details")&&row.doc.data.payment_details.paid == false){
										var splitNameArr = row.id.split('_order_');
										if(splitNameArr.length > 1){
											unpaidIds.push({_id : row.id, _rev: row.value.rev, _deleted : true });
										}
									}
									//Push all orders to an array for removing those orders
									var splitNameArr = row.id.split('_order_');
										if(splitNameArr.length > 1){
											docs.push({_id : row.id, _rev: row.value.rev, _deleted : true });
										}
								}
							}
						},docs);
					}else{
							angular.forEach(pendingDocs.rows, function(row) {
						//Looking for any pending order exist
								if(row.hasOwnProperty("doc")&&row.doc.hasOwnProperty("data")&&row.id.includes('pending')){
									var term = row.id.split('_')[0];
									if(term != "AIVOOT"){
										pendingIds.push(term+'_pending_'+row.doc.data.pending_data.order_no);
										pendingIdsDlt.push({_id : row.id, _rev: row.value.rev, _deleted : true });
									}
								}
								//Looking for any unpaid order exist
								if(row.hasOwnProperty("doc")&&row.doc.hasOwnProperty("data")&&row.doc.data != null &&row.doc.data.hasOwnProperty("payment_details")&&row.doc.data.payment_details.paid == false){
									var splitNameArr = row.id.split('_order_');
									if(splitNameArr.length > 1){
										unpaidIds.push({_id : row.id, _rev: row.value.rev, _deleted : true });
									}
								}
								//Push all orders to an array for removing those orders
								var splitNameArr = row.id.split('_order_');
									if(splitNameArr.length > 1){
										docs.push({_id : row.id, _rev: row.value.rev, _deleted : true });
									}
						},docs);
					}	
					$doc_count = pendingDocs.rows.length;
					var result =null;
					dataReturn =true;
					if(docs.length>0){
					//Wipe all orders if there is no pending and unpaid orders
						if((unpaidIds.length==0&&pendingIds.length==0)||wipe==true){
							console.log("Clearing "+docs.length+" Orders");
							result = $pouchDB.bulkDocs(docs);
							if(pendingIdsDlt.length>0&&wipe == true){
								console.log(pendingIdsDlt);					
								result = $pouchDB.bulkDocs(pendingIdsDlt);
							}
						}
					}
			}).then(function(res){
				$scope.allOrders = [];
				return res;
			}).then(function(res){
			//run function to get orders from all terminals
				if(wipe ==false && unpaidIds.length==0 && pendingIds.length==0 && !ids.length){
					if($scope.formSales.date !="" && $scope.formSales.cash !="" &&  $scope.formSales.receipt !="" &&  $scope.formSales.total !="" && $scope.formSales.card !=""){
							$scope.submitSalesSheet();
					}else{
						$scope.formError=true;
					}
				}
				if(ids.length && ((unpaidIds.length==0 && pendingIds.length==0)||wipe==true))
				{
					wipeTerminalOrders(wipe,deleteDate);
				}
				else{
					$ionicLoading.hide();
					//Show error when there is any pending or unpaid orders
					if(wipe==false&&(unpaidIds.length!=0||pendingIds.length!=0))
					{
						$scope.showCheckoutMsg('Error','Please take appropriate action for unpaid & pending orders in history, Please make them paid to go forward');
						dataReturn =false;
					}
					else{
						var current_date = new Date();
						$scope.dailyOrderNo.num = $scope.dailyOrderNo.start;
						$scope.dailyOrderNo.date = yyyymmdd(current_date);
						$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'order_no',$scope.dailyOrderNo);
						resetDailyCommonOrderNumber();
						reloadApp();
					}
				}
			}).catch(function(error){
				dataReturn =false;
				$ionicLoading.show({
				template : '<h2>An error occured during final process...</h2>',
				duration : 1300
				});
				console.error(error);
			});
			return dataReturn;
		}
		wipeTerminalOrders(wipe,deleteDate);
		
	}
	$scope.wipeconfig = {include_docs:true,limit:10000};
	$scope.sales_from_date =new Date();
	$scope.total_doc_count = 0;
	$scope.id_count = 0;
	wipePos = function(wipe=false){
		

			
			$scope.wipeOrders(wipe);
			/* 
			$scope.wipeOrders(wipe).then(function(responce){
					if($scope.formSales.date !="" && $scope.formSales.cash !="" &&  $scope.formSales.receipt !="" &&  $scope.formSales.total !="" && $scope.formSales.card !=""){
						if(responce && wipe==false)
							$scope.submitSalesSheet();
					}else{
						$scope.formError=true;
					}
			}); */
			
		
	/* 	var id_count = 0;
		var ids = [];//Get all terminal ids
		for(var i=0;i<$scope.aiv_terminals.terminals.length;i++){
			ids.push($scope.aiv_terminals.terminals[i].name);
		}
		ids.push('AIVOOT');
			if(ids.length){
				$scope.wipeconfig.startkey = ids[$scope.id_count]+'_order_';
				$scope.wipeconfig.endkey = ids[$scope.id_count]+'_order_\ufff0';
				$scope.wipeconfig.limit=10000;
				
			}
			var newSales ={"_id":"",
			"data":""
			};
			$scope.formSales.created_at =new Date();
			$scope.formSales.user = $scope.loginInfo.user_login;
			$scope.formSales.shop =$rootScope.aiv_info.shop_name;
			$scope.formSales.date =$scope.sales_from_date
	
			$scope.formError=false;
			if(wipe==true||($scope.formSales.date !="" && $scope.formSales.cash !="" &&  $scope.formSales.receipt !="" &&  $scope.formSales.total !="" && $scope.formSales.card !="")){

		
			//$scope.wipeconfig.include_docs = true;
			var docs = [],orders = [];
			var limit = 10000;
			var doc_count = 0;
			var pendingIds = [];
			var pendingIdsDlt =[];
			var unpaidIds = [];

			var kitchenIds = [];
			var requested_docs ;
			
			$scope.total_doc_count=$scope.total_doc_count+limit;
			
			console.log("go through "+$scope.total_doc_count+" Documents");
			
			$ionicLoading.show({
					//template : '<h2>EPOS Set to zero '+$scope.total_doc_count+'...</h2>',
					template : '<h2>Dhillons shop final process running...</h2>',
					
				});
				
				
			
			
			$pouchDB.bulkFetch($scope.wipeconfig).then(function(pendingDocs){
			
				requested_docs = pendingDocs;
				angular.forEach(pendingDocs.rows, function(row) {
				
				
					if(row.hasOwnProperty("doc")&&row.doc.hasOwnProperty("data")&&row.id.includes('pending')){
					var term = row.id.split('_')[0];
						if(term != "AIVOOT"){
							//pendingIds.push(term+'_pending_'+row.doc.data.order_meta.bill_number);
							pendingIds.push(term+'_pending_'+row.doc.data.pending_data.order_no);
							pendingIdsDlt.push({_id : row.id, _rev: row.value.rev, _deleted : true });
						}
					}
					
					
					if(row.hasOwnProperty("doc")&&row.doc.hasOwnProperty("data")&&row.doc.data.hasOwnProperty("payment_details")&&row.doc.data.payment_details.paid == false){
						var splitNameArr = row.id.split('_order_');
						if(splitNameArr.length > 1){
						unpaidIds.push({_id : row.id, _rev: row.value.rev, _deleted : true });
						}
					}
				
					//check pending and nonpaid orders. //if they are, present system will not allow to go forward , until all of them are serviced.
					var splitNameArr = row.id.split('_order_');
					if(splitNameArr.length > 1){
					docs.push({_id : row.id, _rev: row.value.rev, _deleted : true });
					}
				},docs);
				$doc_count = pendingDocs.rows.length;
				
				
				var result=null;
				
				if(docs.length>0){
				
				
				
				if((unpaidIds.length==0&&pendingIds.length==0)||wipe==true){
					console.log("Clearing "+docs.length+" Orders");
					
					result = $pouchDB.bulkDocs(docs);
					//Once every thing is cleared , just submit it to the cloud.
					
					// Linu added on 6-dec-18
					if(pendingIdsDlt.length>0&&wipe == true){
						console.log(pendingIdsDlt);					
						result = $pouchDB.bulkDocs(pendingIdsDlt);
					} else{
					    
					}
				}
				}
				
				
				
				return result;//
			}).then(function(res){
				$scope.allOrders = [];
				return res;
			}).then(function(res){
				var com_res = null;
				if(res  != undefined&&res!=null){
					
					
					var compact_days = (new Date() - new Date($scope.gen_settings.last_compaction)) / (1000 * 60 * 60 * 24);
					if($rootScope.aiv_info.enable_compaction && Math.round(compact_days) > $rootScope.aiv_info.compact_days){
					    console.log("Compacting pouch");
						com_res = $pouchDB.compactDB();
					}
				}
				//else
				//$ionicLoading.hide();
				
				return com_res;
				
			}).then(function(compact_res){
			
			if(compact_res != undefined&&compact_res != null){
			
					$scope.gen_settings.last_compaction = new Date().toISOString();
					$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'GenSettings',$scope.gen_settings);
			}
			
			if($doc_count>=limit&&((unpaidIds.length==0&&pendingIds.length==0)||wipe==true))
			{
				
				$scope.wipeconfig.startkey = requested_docs.rows[requested_docs.rows.length - 1].id;
				wipePos(wipe);
			}if($doc_count>=limit&&((unpaidIds.length==0&&pendingIds.length==0)||wipe==true))
			{
				
				$scope.wipeconfig.startkey = requested_docs.rows[requested_docs.rows.length - 1].id;
				wipePos(wipe);
			}
			else{
			$ionicLoading.hide();
			
			if(wipe==false&&(unpaidIds.length!=0||pendingIds.length!=0))
			{
				$scope.showCheckoutMsg('Error','Please take appropriate action for unpaid & pending orders in history, Please make them paid to go forward');
			}
			else{
			
			
				
			
				var current_date = new Date();
			
				$scope.dailyOrderNo.num = $scope.dailyOrderNo.start;
				$scope.dailyOrderNo.date = yyyymmdd(current_date);
				$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'order_no',$scope.dailyOrderNo);
				
				
				resetDailyCommonOrderNumber();
			
				/*$ionicLoading.show({
						template : '<h2>Dhillons shop, final process finished</h2>',
						duration : 1300
					});*/
			/* }
			//all documents are being checked.
			if((unpaidIds.length==0&&pendingIds.length==0)&&wipe==false)
				$scope.submitSalesSheet();
			}
				
			}).catch(function(error){
				$ionicLoading.show({
					template : '<h2>An error occured during final process...</h2>',
					duration : 1300
				});
				console.error(error);
			});
			
			}else{
			$scope.formError=true;
			}
		 */ 
	
	}
	
	var clearPos = function(doc){
		var docs = [],orders = [];
		var pendingIds = [];
		var kitchenIds = [];
		angular.forEach($scope.all_docs, function(row) {
			if(row.data.status == "pending"){
				var term = row._id.split('_')[0];
				if(term != "AIVOOT"){
					pendingIds.push(term+'_pending_'+row.data.order_meta.bill_number);
				}
			}else if($rootScope.aiv_info.enable_kitchen == "TRUE"){
				var base_doc_id = row._id;
				var splitNameArr = row._id.split('_order_');
				if(splitNameArr.length > 1){
					var splitSeqArr = splitNameArr[1].split('_');
					if(splitSeqArr.length > 0){
						base_doc_id = splitNameArr[0]+'_order_'+splitSeqArr[0];
					}
				}
				kitchenIds.push(base_doc_id);
			}
			docs.push({_id : row._id, _rev: row._rev, _deleted : true });
			if(row.data.id){
				orders.push(row.data.id);
			}
		},docs);
		
		if(pendingIds.length){
			var config = {
				keys:pendingIds,
				include_docs: true
			}
			$pouchDB.bulkFetch(config).then(function(pendingDocs){
				angular.forEach(pendingDocs.rows, function(row) {
					docs.push({_id : row.doc._id, _rev: row.doc._rev, _deleted : true });
				},docs);
				return $pouchDB.bulkDocs(docs);
			}).then(function(res){
				$scope.allOrders = [];
				if($scope.defaultBtns.clear_cloud_orders){
					return $pouchDB.upsert('getChanges',function(doc){
						if(doc != undefined){
							doc.clear_cloud_orders.status = true;
							doc.clear_cloud_orders.orders = orders;
							return doc;
						}
						return false;
					});
				}
			}).then(function(res){
				if(res != undefined){
					console.log("Clearing cloud");
				}
				
				var compact_days = (new Date() - new Date($scope.gen_settings.last_compaction)) / (1000 * 60 * 60 * 24);
				if($rootScope.aiv_info.enable_compaction && Math.round(compact_days) > $rootScope.aiv_info.compact_days){
					return $pouchDB.compactDB();
				}
			}).then(function(compact_res){
				if(compact_res != undefined){
					$scope.gen_settings.last_compaction = new Date().toISOString();
					$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'GenSettings',$scope.gen_settings);
				}
			}).catch(function(error){
				$ionicLoading.show({
					template : '<h2>An error occured while clearing orders...</h2>',
					duration : 1300
				});
				console.error(error);
			})
		}else{
			$pouchDB.bulkDocs(docs).then(function(returnData) {
				$scope.allOrders = [];
				if($scope.defaultBtns.clear_cloud_orders){
					return $pouchDB.upsert('getChanges',function(doc){
						if(doc != undefined){
							doc.clear_cloud_orders.status = true;
							doc.clear_cloud_orders.orders = orders;
							return doc;
						}
						return false;
					});
				}
			}).then(function(res){
				if(res != undefined){
					console.log("Clearing cloud");
				}
				if($rootScope.aiv_info.enable_compaction && Math.round(compact_days) > $rootScope.aiv_info.compact_days){
					return $pouchDB.compactDB();
				}
			}).then(function(compact_res){
				if(compact_res != undefined){
					$scope.gen_settings.last_compaction = new Date().toISOString();
					$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'GenSettings',$scope.gen_settings);
				}
			}).catch(function(error){
				console.error(error);
			});
		}
		
		if(kitchenIds.length){
			var config = {
				keys:kitchenIds,
				include_docs: true
			}
			$pouchDBEtc.bulkFetch(config).then(function(kitchenDocs){
				return Promise.all(kitchenDocs.rows.map(function (row) {
					return $pouchDBEtc.delete(row.doc._id,row.doc._rev);
				}));
			}).then(function(res){
				console.log("Removed kitchen docs");
				return $pouchDBEtc.compactDB();
			}).catch(function(error){
				$ionicLoading.show({
					template : '<h2>An error occured while clearing Kitchen orders...</h2>',
					duration : 1300
				});
				console.error(error);
			})
		}
		/*//Delete all order docs
		$pouchDB.search($scope.terminalData.name+'_order_',false,false).then(function(returnData) {
			var docs = [];
			angular.forEach(returnData.rows, function(row) {
				docs.push({_id : row.id, _rev: row.value.rev, _deleted : true });
			},docs)
			return $pouchDB.bulkDocs(docs);
		}).then(function(returnData) {
			return $pouchDB.search($scope.terminalData.name+'_pending_',false,false);
		}).then(function(returnData) {
			var docs = [];
			angular.forEach(returnData.rows, function(row) {
				docs.push({_id : row.id, _rev: row.value.rev, _deleted : true });
			},docs)
			return $pouchDB.bulkDocs(docs);
		}).then(function(returnData) {
			return $pouchDB.search('AIVOOT_order_',false,false);
		}).then(function(returnData) {
			var docs = [];
			angular.forEach(returnData.rows, function(row) {
				docs.push({_id : row.id, _rev: row.value.rev, _deleted : true });
			},docs)
			return $pouchDB.bulkDocs(docs);
		}).then(function(returnData) {
			$scope.alertArr = [];
			$scope.readyArr = [];
			return $pouchDB.compactDB();
		});*/
	}
	
	$scope.print_reports = function(report){
		/*if($scope.settingsPrinter.type == "Pixel Print" && ($scope.selected_report_type == 'Z' || $scope.selected_report_type == 'X')){
			$scope.showCheckoutMsg('Warning','This report is not configured for Pixel printing yet...');
			return;
		}*/
		
		if($scope.selected_report_type == 'Z'){
			var warning,extra_warning,extra_flag = false;;
			extra_warning = 'There are ';
			var skipBlock =true;
			if($scope.report_order_count.pending){
				extra_warning+=$scope.report_order_count.pending+' pending orders, ';
				extra_flag = true;
				skipBlock=false;
			}
			
			if($scope.report_order_count.processing){
				extra_warning+=$scope.report_order_count.processing+' processing orders, ';
				extra_flag = true;
				skipBlock=false;
			}
			
			if($scope.report_order_count.sent_to_kitchen){
				extra_warning+=$scope.report_order_count.sent_to_kitchen+' orders preparing in kitchen. ';
				extra_flag = true;
				skipBlock=false;
			}
			if($scope.report_order_count.table_order){
				extra_warning+= $scope.report_order_count.table_order+' orders unpaid in table.';
				extra_flag = true;
				skipBlock=false;
			}
			if($scope.report_order_count.unpaid){
				extra_warning+= $scope.report_order_count.unpaid+' orders unpaid in takeaway.';
				extra_flag = true;
				skipBlock=false;
			}
			
			
			
			if($rootScope.aiv_info.block_z_report && !skipBlock){
				warning = 'Please take appropriate action for unpaid & pending orders in history, Please make them paid to go forward'
				if(extra_flag){
					warning = extra_warning+'<br>'+warning;
				}
				var confirmPopup = $ionicPopup.confirm({
					title: 'Warning',
					template: warning
				});
			}else{
				warning = 'Prinitng Z Report will clear your orders. <br>Are you sure want to do this?'
				if(extra_flag){
					warning = extra_warning+'<br>'+warning;
				}
				var confirmPopup = $ionicPopup.confirm({
					title: 'Warning',
					template: warning
				});

				confirmPopup.then(function(res) {
					if(res) {
						$scope.printReport(report);
						var conPopup = $ionicPopup.confirm({
							title: 'Confirm',
							template: 'Make sure that you got the report printed and then click OK to clear the orders.<br>This action is irreversible.'
						});

						conPopup.then(function(res) {
							if(res) {
								//clear POS orders
								$scope.wipeOrders(true);
								//clearPos($scope.aiv_report);
								trashOrder();
							}
						});
					}
				});
			}
		}else{
			$scope.printReport(report);
		}
	}
	
	/* $scope.getSalesReport = function(wipe){
		$posreport = null;
		//$scope.wipeconfig = {include_docs:false,limit:10000};
		$scope.wipeconfig = {include_docs:true,startkey : '', endkey : '',limit:''};
		$scope.total_doc_count = 0;
		$scope.wipeconfig 
		wipePos(wipe);
		
	
		/*$ionicLoading.show({
			template: '<ion-spinner icon="ios"></ion-spinner><br><span class="aiv-loading">Generating report<br>Please wait...</span>',
			animation: 'fade-in',
			showBackdrop: true,
			maxWidth: 300,
			showDelay: 0
		});
		$scope.errors.show_report = "";
		$scope.present_time = new Date();
		var find_index = {
			fields: ['data.order_meta.ordered_at'],
			name: 'reportindex',
			ddoc: 'reportdesigndoc'
		}
		var find_params = {};
		if(type == 'X'){
			if(create){
				var current_date = new Date();
				var current_time = hhmmss(current_date);
				if(current_time>="00:00:00" && current_time<$rootScope.aiv_info.day_ends_at){
					current_date = new Date(current_date.setDate(current_date.getDate() - 1));
				}
				$scope.xr_from_date = new Date(yyyymmdd(current_date)+' '+$rootScope.aiv_info.day_ends_at);
			}
			
			var to_date = angular.copy($scope.xr_from_date);
			to_date = new Date(to_date.setDate(to_date.getDate() + 1));
			var find_selector = {
				$and:[
					{"data.order_meta.ordered_at":{$gt:$scope.xr_from_date.toISOString()}},
					{"data.order_meta.ordered_at":{$lt:to_date.toISOString()}},
					
				]
			}
		}else if(type == 'Z'){
			if(create){
				var current_date = new Date();
				var current_time = hhmmss(current_date);
				if(current_time>="00:00:00" && current_time<$rootScope.aiv_info.day_ends_at){
					current_date = new Date(current_date.setDate(current_date.getDate() - 1));
				}
				$scope.zr_from_date = new Date(yyyymmdd(current_date)+' '+$rootScope.aiv_info.day_ends_at);
			}
			var to_date = angular.copy($scope.zr_from_date);
			to_date = new Date(to_date.setDate(to_date.getDate() + 1));
			
			var find_selector;
			if($scope.report_filters.pos){
				find_selector = {
					$and:[
						{"data.order_meta.processed_by": $scope.report_filters.pos},
						{"data.order_meta.ordered_at":{$gt:$scope.zr_from_date.toISOString()}},
						{"data.order_meta.ordered_at":{$lt:to_date.toISOString()}},
						
					]
				}
			}else{
				find_selector = {
					$and:[
						{"data.order_meta.ordered_at":{$gt:$scope.zr_from_date.toISOString()}},
						{"data.order_meta.ordered_at":{$lt:to_date.toISOString()}},
						
					]
				}
			}
			
			find_params = {
				//sort:[{'data.order_meta.ordered_at': 'desc'}]
			}
		}
		
		$pouchDB.find(find_index,find_selector,find_params).then(function (res) {
			$scope.all_docs = res.docs;
			if(type == 'X' || type == 'Z'){
				$scope.aiv_report = calculateReport(res.docs);
			}
			$scope.settings_error.pass = 'Report generated...';
			$ionicLoading.hide();
			//$scope.closeModal('POS_SETTINGS');
			if(create){
				$scope.showReportModal(type);
			}
		}).catch(function (error) {
			if(create){
				$scope.settings_error.err = 'Oops...An error occurred!!!';
			}else{
				$scope.errors.show_report = "Oops...An error occurred!!!";
			}
			$ionicLoading.hide();
			console.error(error);
		});*/
	/*} */
	$scope.getSalesSheet = function(wipe){
		$posreport = null;
		//$scope.wipeconfig = {include_docs:false,limit:10000};
		$scope.wipeconfig = {include_docs:true,startkey : '', endkey : '',limit:''};
		$scope.total_doc_count = 0;
		$scope.wipeconfig 
		wipePos(wipe);
	}
	$scope.getSalesReport = function(type,create){
		$ionicLoading.show({
			template: '<ion-spinner icon="ios"></ion-spinner><br><span>Generating report<br>Please wait...</span>',
			animation: 'fade-in',
			showBackdrop: true,
			maxWidth: 300,
			showDelay: 0
		});
		$scope.errors.show_report = "";
		$scope.present_time = new Date();
		var find_index = {
			fields: ['data.order_meta.ordered_at'],
			name: 'reportindex',
			ddoc: 'reportdesigndoc'
		}
		var find_params = {};
		if(type == 'X'){
			if(create){
				var current_date = new Date();
				var current_time = hhmmss(current_date);
				if(current_time>="00:00:00" && current_time<"03:00:00"){
					current_date = new Date(current_date.setDate(current_date.getDate() - 1));
				}
				$scope.xr_from_date = new Date(yyyymmdd(current_date)+' 03:00:00');
			}
			
			var to_date = angular.copy($scope.xr_from_date);
			to_date = new Date(to_date.setDate(to_date.getDate() + 1));
			var find_selector = {
				$and:[
					{"data.order_meta.ordered_at":{$gt:$scope.xr_from_date.toISOString()}},
					{"data.order_meta.ordered_at":{$lt:to_date.toISOString()}},
					/*{$or: [
						{"data.status": "on-hold"},
						{"data.status": "kitchen-ready"},
						{"data.status" : "completed"}
					]}*/
				]
			}
		}else if(type == 'Z'){
			if(create){
				var current_date = new Date();
				var current_time = hhmmss(current_date);
				if(current_time>="00:00:00" && current_time<"03:00:00"){
					current_date = new Date(current_date.setDate(current_date.getDate() - 1));
				}
				$scope.zr_from_date = new Date(yyyymmdd(current_date)+' 03:00:00');
			}
			var to_date = angular.copy($scope.zr_from_date);
			to_date = new Date(to_date.setDate(to_date.getDate() + 1));
			
			var find_selector;
			if($scope.report_filters.pos){
				find_selector = {
					$and:[
						{"data.order_meta.processed_by": $scope.report_filters.pos},
						{"data.order_meta.ordered_at":{$gt:$scope.zr_from_date.toISOString()}},
						{"data.order_meta.ordered_at":{$lt:to_date.toISOString()}},
						/*{$or: [
							{"data.status": "on-hold"},
							{"data.status": "kitchen-ready"},
							{"data.status" : "completed"}
						]}*/
					]
				}
			}else{
				find_selector = {
					$and:[
						{"data.order_meta.ordered_at":{$gt:$scope.zr_from_date.toISOString()}},
						{"data.order_meta.ordered_at":{$lt:to_date.toISOString()}},
						/*{$or: [
							{"data.status": "on-hold"},
							{"data.status": "kitchen-ready"},
							{"data.status" : "completed"}
						]}*/
					]
				}
			}
			
			/*find_params = {
				sort:[{'data.order_meta.ordered_at': 'desc'}]
			}*/
		}else if(type == 'VOID'){
			if(create){
				$scope.voidr_from_date = new Date(yyyymmdd(new Date())+' 03:00:00');
			}
			var to_date = angular.copy($scope.voidr_from_date);
			to_date = new Date(to_date.setDate(to_date.getDate() + 1));
			
			var find_selector;
			if($scope.report_filters.pos){
				find_selector = {
					$and:[
						{"data.order_meta.processed_by": $scope.report_filters.pos},
						{"data.order_meta.ordered_at":{$gt:$scope.voidr_from_date.toISOString()}},
						{"data.order_meta.ordered_at":{$lt:to_date.toISOString()}}
					]
				}
			}else{
				find_selector = {
					$and:[
						{"data.order_meta.ordered_at":{$gt:$scope.voidr_from_date.toISOString()}},
						{"data.order_meta.ordered_at":{$lt:to_date.toISOString()}}
					]
				}
			}
			
			/*find_params = {
				sort:[{'data.order_meta.ordered_at': 'desc'}]
			}*/
		}else if(type == 'D'){
			if(create){
				$scope.dr_from_date = new Date(yyyymmdd(new Date())+' 03:00:00');
			}
			var to_date = angular.copy($scope.dr_from_date);
			to_date = new Date(to_date.setDate(to_date.getDate() + 1));
			
			var find_selector;
			if($scope.report_filters.pos){
				find_selector = {
					$and:[
						{"data.order_meta.processed_by": $scope.report_filters.pos},
						{"data.order_meta.ordered_at":{$gt:$scope.dr_from_date.toISOString()}},
						{"data.order_meta.ordered_at":{$lt:to_date.toISOString()}}
					]
				}
			}else{
				find_selector = {
					$and:[
						{"data.order_meta.ordered_at":{$gt:$scope.dr_from_date.toISOString()}},
						{"data.order_meta.ordered_at":{$lt:to_date.toISOString()}}
					]
				}
			}
		}
		aiv_time_start(); 
		$pouchDB.find(find_index,find_selector,find_params).then(function (res) {
			aiv_time_end("REPORT GENERATION");
			$scope.all_docs = res.docs;
			if(type == 'X' || type == 'Z'){
				$scope.aiv_report = calculateReport(res.docs);
			}else if(type == 'D'){
				$scope.aiv_report = calculatDReport(res.docs);
			}else if(type == 'VOID'){
				$scope.aiv_report = calculateVoidReport(res.docs);
			}
			$scope.settings_error.pass = 'Report generated...';
			$ionicLoading.hide();
			//$scope.closeModal('POS_SETTINGS');
			if(create){
				$scope.showReportModal(type);
			}
		}).catch(function (error) {
			if(create){
				$scope.settings_error.err = 'Oops...An error occurred!!!';
			}else{
				$scope.errors.show_report = "Oops...An error occurred!!!";
			}
			$ionicLoading.hide();
			console.error(error);
		});
	}


	$scope.getCashnCarryReport = function(type,create){
		$ionicLoading.show({
			template: '<ion-spinner icon="ios"></ion-spinner><br><span class="aiv-loading">Generating report<br>Please wait...</span>',
			animation: 'fade-in',
			showBackdrop: true,
			maxWidth: 300,
			showDelay: 0
		});
		
		$scope.errors.show_report = '';
		$scope.present_time = new Date();
		$scope.past_time = new Date(yyyymmdd(new Date())+' 00:00:00');
		$scope.past_time.setDate($scope.past_time.getDate() - 30);
		var find_index = {
			fields: ['data.order_meta.processed_by'],
			name: 'reportindex',
			ddoc: 'reportdesigndoc'
		}
		var find_params = {};
		if(type == 'AD'){//Aged Debtors
			if(create){
				$scope.ad_from_date = $scope.past_time;
				$scope.ad_to_date = $scope.present_time;
			}
			find_index = {
				fields: ['data.status'],
				name: 'reportindex',
				ddoc: 'reportdesigndoc'
			}

			var find_selector = {
				$and:[
					{"data.status": "on-hold"},
					{"data.payment_details.paid": false},
					{"data.created_at": {$lte:$scope.ad_to_date.toISOString()}},
					{"data.created_at": {$gte:$scope.ad_from_date.toISOString()}}
				]
			}
		}else if(type == 'CSR'){//Customer Product sales
			if(create){
				$scope.csr_from_date = $scope.past_time;
				$scope.csr_to_date = $scope.present_time;
			}
			var find_selector = {
				$and:[
					{"data.created_at": {$lte:$scope.csr_to_date.toISOString()}},
					{"data.created_at": {$gte:$scope.csr_from_date.toISOString()}},
					{$or: [
						{"data.status": "on-hold"},
						{"data.status" : "completed"}
					]}
				]
			}
		}else if(type == 'PSR'){//Product sales
			if(create){
				$scope.psr_from_date = $scope.past_time;
				$scope.psr_to_date = $scope.present_time;
			}
			var find_selector = {
				$and:[
					{"data.created_at": {$lte:$scope.psr_to_date.toISOString()}},
					{"data.created_at": {$gte:$scope.psr_from_date.toISOString()}},
					/*{"data.order_meta.processed_by":($scope.report_filters.pos=='')?{$ne:''}:$scope.report_filters.pos},*/
					{$or: [
						{"data.status": "on-hold"},
						{"data.status" : "completed"}
					]}
				]
			}
		}else if(type == 'CPL'){//Customer Product list
			if(create){
				$scope.past_time.setDate($scope.past_time.getDate() - 180);
				$scope.cpl_from_date = $scope.past_time;
				$scope.cpl_to_date = $scope.present_time;
			}
			var find_selector = {
				$and:[
					{"data.created_at": {$lte:$scope.cpl_to_date.toISOString()}},
					{"data.created_at": {$gte:$scope.cpl_from_date.toISOString()}},
					{$or: [
						{"data.customer.first_name": $scope.report_filters.customer},
						{"data.customer.billing_address.phone" : $scope.report_filters.customer}
					]},
					{$or: [
						{"data.status": "on-hold"},
						{"data.status" : "completed"}
					]}
				]
			}
		}else if(type == 'CS'){//Customer summary
			if(create){
				$scope.cs_from_date = $scope.past_time;
				$scope.cs_to_date = $scope.present_time;
			}
			var find_selector = {
				$and:[
					{"data.created_at": {$lte:$scope.cs_to_date.toISOString()}},
					{"data.created_at": {$gte:$scope.cs_from_date.toISOString()}},
					{$or: [
						{"data.status": "on-hold"},
						{"data.status" : "completed"}
					]}
				]
			}
		}else if(type == 'DS'){//Debtor summary
			if(create){
				$scope.ds_from_date = $scope.past_time;
				$scope.ds_to_date = $scope.present_time;
			}
			var find_selector = {
				$and:[
					{"data.created_at": {$lte:$scope.ds_to_date.toISOString()}},
					{"data.created_at": {$gte:$scope.ds_from_date.toISOString()}},
					{"data.status": "on-hold"}
				]
			}
		}else if(type == 'OH'){//Order history
			if(create){
				$scope.oh_from_date = $scope.past_time;
				$scope.oh_to_date = $scope.present_time;
			}
			find_index = {
				fields: ['data.created_at'],
				name: 'reportindex',
				ddoc: 'reportdesigndoc'
			}

			find_params = {
				sort:[{'data.created_at': 'desc'}]
			}
			
			var find_selector = {
				$and:[
					/*{"data.order_meta.processed_by": $scope.terminalData.name},*/
					{"data.created_at": {$lte:$scope.oh_to_date.toISOString()}},
					{"data.created_at": {$gte:$scope.oh_from_date.toISOString()}},
					{$or: [
						{"data.status": "on-hold"},
						{"data.status" : "completed"}
						
					]}
				]
			}
		}else if(type == 'OI'){//Overdue invoices
			if(create){
				$scope.oi_from_date = $scope.past_time;
				$scope.oi_to_date = $scope.present_time;
			}
			find_index = {
				fields: ['data.created_at'],
				name: 'reportindex',
				ddoc: 'reportdesigndoc'
			}

			find_params = {
				sort:[{'data.created_at': 'desc'}]
			}
			
			var find_selector = {
				$and:[
					{"data.created_at": {$lte:$scope.oi_to_date.toISOString()}},
					{"data.created_at": {$gte:$scope.oi_from_date.toISOString()}},
					{"data.status": "on-hold"},
					{"data.payment_details.paid": false}
				]
			}
		}else if(type == 'OUTOFSTOCK' || type == 'PL'){//Out of stock products or product list
			if(create){
				$scope.outofstock_from_date = $scope.past_time;
				$scope.outofstock_to_date = $scope.present_time;
			}
			var find_index = {
				fields: ['products'],
				name: 'allcat_index',
				ddoc: 'allcat_designdoc'
			}
			var find_selector = {"products":{'$exists': true}}
		}else if(type == 'PAR'){//Profit analysis
			if(create){
				$scope.par_from_date = $scope.past_time;
				$scope.par_to_date = $scope.present_time;
			}
			find_index = {
				fields: ['data.created_at'],
				name: 'reportindex',
				ddoc: 'reportdesigndoc'
			}

			find_params = {
				sort:[{'data.created_at': 'desc'}]
			}
			
			var find_selector = {
				$and:[
					//{"data.order_meta.processed_by": $scope.terminalData.name},
					{"data.created_at": {$lte:$scope.par_to_date.toISOString()}},
					{"data.created_at": {$gte:$scope.par_from_date.toISOString()}},
					{$or: [
						{"data.status": "on-hold"},
						{"data.status" : "completed"}
						
					]}
				]
			}
		}
		
		$pouchDB.find(find_index,find_selector,find_params).then(function (res) {
			if(type == 'OUTOFSTOCK'){
				$scope.all_docs = res.docs;
				$ionicLoading.hide();
				$scope.calculateOutofstockReport();
			}else if(type == 'PAR'){
				$ionicLoading.hide();
				$scope.all_docs = res.docs;
				$scope.calculateProfitAnalysisReport(res.docs,type,create);
			}else{
				$scope.data_report = callReportGeneration(type,res);
				$scope.settings_error.pass = 'Report generated...';
				$ionicLoading.hide();
				if(create){
					callReportModal(type);
				}
			}
		}).catch(function (error) {
			$scope.settings_error.err = 'Oops...An error occurred!!!';
			console.error(error);
			$ionicLoading.hide();
		});
	}

	$scope.getCashflowReport = function(type,date){
		$scope.errors.show_report = '';
		$ionicLoading.show({
			template: '<ion-spinner icon="ios"></ion-spinner><br><span class="aiv-loading">Generating report<br>Please wait...</span>',
			animation: 'fade-in',
			showBackdrop: true,
			maxWidth: 300,
			showDelay: 0
		});
		
		var find_index = {
			fields: ['date_at'],
			name: 'cashflowindex',
			ddoc: 'cashflowdesigndoc'
		}

		var find_params = {
			sort:[{'date_at': 'desc'}]
		}
			
		var find_selector = {
			$and:[
				//{"terminal": $scope.terminalData.name},
				{"date_at": yyyymmdd($scope.cashflow_from_date)},
				{"type":"Cashflow"}
			]
		}
		
		$ionicLoading.show({
			template: '<ion-spinner icon="ios"></ion-spinner><br><span class="aiv-loading">Generating report<br>Please wait...</span>',
			animation: 'fade-in',
			showBackdrop: true,
			maxWidth: 300,
			showDelay: 0
		});
		
		$pouchDB.find(find_index,find_selector,find_params).then(function (res) {
			$scope.all_cashflow_docs = res.docs;
			$scope.data_report = calculate_cashflow(res.docs);
			$ionicLoading.hide();
			callReportModal(type);
		}).catch(function (error) {
			$scope.errors.show_report = 'No data found!!!';
			$ionicLoading.hide();
			$scope.data_report = {};
			callReportModal(type);
			console.error(error);
		});
	}
	
	var calculate_cashflow = function(docs){
		var reportInfo={};
			
		for(var i=0;i<docs.length;i++){
			var doc = docs[i];
		
			if(!$scope.report_filters.pos || ($scope.report_filters.pos == doc.terminal)){
				var info = {
					'data':doc.data,
					'exp_total':0,
					'inc_total':0
				};
				
				for(var j=0;j<info.data.length;j++){
					if(info.data[j].type == 'EXPENSE'){
						info.exp_total+=parseFloat(info.data[j].amount);
					}else{
						info.inc_total+=parseFloat(info.data[j].amount);
					}
					info.data[j].date = yyyymmdd(new Date(info.data[j].date));
					info.data[j].pending = info.data[j].pending?'Pending':'Paid';
				}
				
				reportInfo[doc.terminal] = info;
			}
		}
		console.log(reportInfo);

		return reportInfo;
	}
	
	var callReportModal = function(type){
		if(type == 'CSR'){
			$ionicModal.fromTemplateUrl('CustomerProductSales-report-modal.html', {
				id:'CSR_MODAL',
				scope: $scope,
				backdropClickToClose: false,
				animation: 'none'
			}).then(function(modal) {
				modal.el.className = modal.el.className + " report-modal";
				$scope.csr_modal = modal;
				$scope.openModal('CSR_MODAL');
			});
		}else if(type == 'PSR'){
			$ionicModal.fromTemplateUrl('ProductSales-report-modal.html', {
				id:'PSR_MODAL',
				scope: $scope,
				backdropClickToClose: false,
				animation: 'none'
			}).then(function(modal) {
				modal.el.className = modal.el.className + " report-modal";
				$scope.psr_modal = modal;
				$scope.openModal('PSR_MODAL');
			});
		}else if(type == 'CPL'){
			$ionicModal.fromTemplateUrl('CustomerProductList-report-modal.html', {
				id:'CPL_MODAL',
				scope: $scope,
				backdropClickToClose: false,
				animation: 'none'
			}).then(function(modal) {
				modal.el.className = modal.el.className + " report-modal";
				$scope.cpl_modal = modal;
				$scope.openModal('CPL_MODAL');
			});
		}else if(type == 'PL'){
			$ionicModal.fromTemplateUrl('ProductList-report-modal.html', {
				id:'PL_MODAL',
				scope: $scope,
				backdropClickToClose: false,
				animation: 'none'
			}).then(function(modal) {
				modal.el.className = modal.el.className + " report-modal";
				$scope.pl_modal = modal;
				$scope.openModal('PL_MODAL');
			});
		}else if (type == 'CS'){
			$ionicModal.fromTemplateUrl('CustomerSales-report-modal.html', {
				id: 'CS_MODAL',
				scope: $scope,
				backdropClickToClose: false,
				animation: 'none'
			}).then(function (modal) {
				modal.el.className = modal.el.className + " report-modal";
				$scope.cs_modal = modal;
				$scope.openModal('CS_MODAL');
			});
		}else if (type == 'DS'){
			$ionicModal.fromTemplateUrl('CustomerDebts-report-modal.html', {
				id: 'DS_MODAL',
				scope: $scope,
				backdropClickToClose: false,
				animation: 'none'
			}).then(function (modal) {
				modal.el.className = modal.el.className + " report-modal";
				$scope.ds_modal = modal;
				$scope.openModal('DS_MODAL');
			});
		}else if(type == 'OH'){
			$ionicModal.fromTemplateUrl('order-profit-report-modal.html', {
				id:'OH_MODAL',
				scope: $scope,
				backdropClickToClose: false,
				animation: 'none'
			}).then(function(modal) {
				modal.el.className = modal.el.className + " report-modal";
				$scope.oh_modal = modal;
				$scope.openModal('OH_MODAL');
			});
		}else if(type == 'AD'){
			$scope.openModal('AD_MODAL');
		}else if(type == 'OI'){
			$ionicModal.fromTemplateUrl('overdue-invoices-report-modal.html', {
				id:'OI_MODAL',
				scope: $scope,
				backdropClickToClose: false,
				animation: 'none'
			}).then(function(modal) {
				modal.el.className = modal.el.className + " report-modal";
				$scope.oi_modal = modal;
				$scope.openModal('OI_MODAL');
			});
		}else if(type == 'CASHFLOW'){
			 $scope.openModal('CASHFLOW_MODAL');
		}else if(type == 'OUTOFSTOCK'){
			 $scope.openModal('OUTOFSTOCK_MODAL');
		}else if(type == 'PAR'){
			$ionicModal.fromTemplateUrl('profit-analysis-report-modal.html', {
				id:'PAR_MODAL',
				scope: $scope,
				backdropClickToClose: false,
				animation: 'none'
			}).then(function(modal) {
				modal.el.className = modal.el.className + " report-modal";
				$scope.par_modal = modal;
				$scope.openModal('PAR_MODAL');
			});
		}
	}


	var callReportGeneration = function(type,res){
		if(type == 'CSR'){
			 return calculateCustomerProductSalesReport(res.docs);
		}else if(type == 'PSR'){
			$scope.all_docs = res.docs;
			return calculateProductSalesReport(res.docs);
		}else if(type == 'CPL'){
			 return calculateCustomerProductListReport(res.docs);
		}else if(type == 'PL'){
			 return getProductListReport(res.docs);
		}else if (type == 'CS'){
			return  calculateCustomerSalesReport(res.docs);
		}else if (type == 'DS'){
			return  calculateCustomerDebtorsReport(res.docs);
		}else if (type == 'OH'){
			$scope.all_docs = res.docs;
			return  $scope.calculateOrderProfitReport(res.docs);
		}else if (type == 'AD'){
			return  calculateAgedDebtorsReport(res.docs);
		}else if(type == 'OI'){
			return calculateOverdueInvoicesReport(res.docs);
		}
	}
	
	$scope.sales_from_date =new Date();
	//Function to save sales sheet to cloud
	$scope.submitSalesSheet =function(){
		$scope.formError =false;
		var newSales ={"_id":"",
		"data":""
		};
		$scope.formSales.created_at =new Date();
		$scope.formSales.user = $scope.loginInfo.user_login;
		$scope.formSales.shop =$rootScope.aiv_info.shop_name;
		$scope.formSales.date =$scope.sales_from_date
			var newDate = new Date();
			newSales.data = $scope.formSales;
			newSales._id = "salesReport_"+newDate.toJSON();
			
			if($scope.formSales.date !="" && $scope.formSales.cash !="" &&  $scope.formSales.receipt !="" &&  $scope.formSales.total !="" && $scope.formSales.card !="" ){
			$scope.formError =false;
			$pouchDB.save(newSales).then(function(res) {
							$ionicLoading.hide();
							$ionicLoading.show({
								template : '<h2>Sales Report Saved...</h2>',
								duration : 1300
							});
							console.log(res);
							checkEndAction(true);	
						}).catch(function(error) {
							$ionicLoading.hide();
							$ionicLoading.show({
								template : 'Failed to save this Sales Report!!!',
								duration : 3000
							});
							console.error(error);
						});
		}else{
		$scope.formError =true;
		}
			console.log("submit reports to cloud");
	}
	//Function to save purchase list to cloud
	$scope.savePurchaseList =function(){
		var newPurchase ={"_id":"",
		"data":""
		};
		if($scope.formPurchase.item !="" && $scope.formPurchase.quantity !="" && $scope.formPurchase.unit !=""){
			var data={'item':'','quantity':'','unit':''};
			data.item =$scope.formPurchase.item;
			data.quantity =$scope.formPurchase.quantity;
			data.unit =$scope.formPurchase.unit;
			$scope.purchaseListArray.push(data);
			$scope.purchaseListNameArray.push(data.item);
			$scope.formPurchase.item ="";
			$scope.formPurchase.quantity ="";
			$scope.formPurchase.unit ="";
			console.log($scope.purchaseListArray);
		}
		if($scope.purchaseListArray.length){
			newPurchase.data ={"date":"","shop":"","purchase_list":""};
			newPurchase.data.date = new Date();
			newPurchase.data.shop = $rootScope.aiv_info.shop_name;
			newPurchase.data.purchase_list = $scope.purchaseListArray;
			var newDate = new Date().toDateString();
			newPurchase._id = "purchaseList_"+newDate;
				$pouchDB.get(newPurchase._id).then(function(res) {
					res.data.purchase_list =res.data.purchase_list.concat(newPurchase.data.purchase_list);
					$pouchDB.upsert('getPurchaseItem',function(doc){
					console.log(doc);
					if($scope.purchaseListNameArray.length){
						if(doc.purchaseItem){
							for(var i=0;i<$scope.purchaseListNameArray.length;i++){
								if(doc.purchaseItem.indexOf($scope.purchaseListNameArray[i] <=-1))
									doc.purchaseItem.push($scope.purchaseListNameArray[i]);
								}
						}else{
							doc.purchaseItem = $scope.purchaseListNameArray;
						}
					}
					return doc;
					}).catch(function(error){
						console.error(error);
					});
					$pouchDB.upsert(newPurchase._id,function(doc){
					doc.data.purchase_list = res.data.purchase_list;
					$scope.purchaseListArray=[];
					$scope.aiv_reports.selected ="";
						$ionicLoading.hide();
						$ionicLoading.show({
							template : '<h2>Purchase List Saved</h2>',
							duration : 1300
						});
					checkEndAction(true);	
					return doc;
					}).catch(function(error){
							console.error(error);
					});
						
				}).catch(function(error) {
						if(error.message == "missing"){
							$pouchDB.save(newPurchase).then(function(res) {
									$pouchDB.upsert('getPurchaseItem',function(doc){
											console.log(doc);
											if($scope.purchaseListNameArray.length){
												if(doc.purchaseItem){
													for(var i=0;i<$scope.purchaseListNameArray.length;i++){
														if(doc.purchaseItem.indexOf($scope.purchaseListNameArray[i] <=-1))
															doc.purchaseItem.push($scope.purchaseListNameArray[i]);
														}
												}else{
													doc.purchaseItem = $scope.purchaseListNameArray;
												}
											}
											return doc;
										}).catch(function(error){
												console.error(error);
											});
										$scope.aiv_reports.selected ="";
										$scope.purchaseListArray=[];
										$ionicLoading.hide();
										$ionicLoading.show({
											template : '<h2>Purchase List Saved</h2>',
											duration : 1300
										});
										console.log(res);
										checkEndAction(true);	
									}).catch(function(error) {
										$ionicLoading.hide();
										$ionicLoading.show({
											template : 'Failed to save this Purchase List!!!',
											duration : 3000
										});
										console.error(error);
									});
						}
				});
					
				console.log("submit purchase list to cloud");
				
	}else{
			$scope.settings_error.err = "Please add some item and continue...";
		}
	}

	$scope.aiv_report = {};
	$scope.selected_report_title = '';
	$scope.selected_report_type = '';
	$scope.z_amount = {'enable':false};
	$scope.showReports = function(type){
		$scope.selected_report_type = type;
		$scope.selected_report_title = type + ' Report';
		$scope.settings_error.err = '';
		$scope.report_filters = {
			"customer":'',
			"show_price":true,
			"category":'',
			"pos":'',
			"z_amount":''
		}
		if(type == 'X'){
			$scope.getSalesReport(type,true);
		}else if(type == 'Z'){
			$scope.getSalesReport(type,true);
		}else if(type == 'D'){
			$scope.getSalesReport(type,true);
			$scope.selected_report_title = 'Daily Product Sales Report';
		}else if(type == 'VOID'){
			$scope.getSalesReport(type,true);
		}else if (type=='AD'){
			$scope.selected_report_title = 'Aged Debtors Report';
			$scope.getCashnCarryReport(type,true);
		}else if (type=='CSR'){
			$scope.selected_report_title = 'Customer Product Sales Report';
			$scope.getCashnCarryReport(type,true);
		}else if (type=='PSR'){
			$scope.selected_report_title = 'Daily Product Sales Report';
			$scope.getCashnCarryReport(type,true);
		}else if (type=='CPL'){
			var find_index = {
				fields: ['products'],
				name: 'allcat_index',
				ddoc: 'allcat_designdoc'
			}
			var find_selector = {"products":{'$exists': true}}
			var find_params = {}
			$ionicLoading.show({
				template: '<ion-spinner icon="ios"></ion-spinner><br><span class="aiv-loading">Retrieving products<br>Please wait...</span>',
				animation: 'fade-in',
				showBackdrop: true,
				maxWidth: 300,
				showDelay: 0
			});
			$pouchDB.find(find_index,find_selector,find_params).then(function (res) {
				$scope.all_docs = res.docs;
				$ionicLoading.hide();
				
				if($scope.all_docs.length){
					$scope.selected_report_title = 'Customer Product List';
					$scope.getCashnCarryReport(type,true);
				}else{
					$scope.settings_error.err = "No products found...";
				}
			}).catch(function (error) {
				$scope.settings_error.err = 'Oops...An error occurred!!!';
				$ionicLoading.hide();
				console.error(error);
			});
		}else if (type=='PL'){
			$scope.selected_report_title = 'Product List';
			$scope.getCashnCarryReport(type,true);
		}else if (type=='CS'){
			$scope.selected_report_title = 'Customer Summary Report';
			$scope.getCashnCarryReport(type,true);
		}else if (type=='DS'){
			$scope.selected_report_title = 'Debtor Summary Report';
			$scope.getCashnCarryReport(type,true);
		}else if (type=='OH'){
			$scope.selected_report_title = 'Order Profit Analysis Report';
			$scope.getCashnCarryReport(type,true);
		}else if (type=='OI'){
			$scope.selected_report_title = 'Overdue Invoices Report';
			$scope.getCashnCarryReport(type,true);
		}else if (type=='CASHFLOW'){
			$scope.present_time = new Date();
			$scope.selected_report_title = 'Expenditure Report';
			$scope.getCashflowReport(type,new Date());
		}else if (type=='OUTOFSTOCK'){
			$scope.selected_report_title = 'Out of stock products';
			$scope.getCashnCarryReport(type,true);
		}else if (type=='PAR'){
			$scope.selected_report_title = 'Daily Profit Analysis Report';
			$scope.getCashnCarryReport(type,true);
		}else if(type == 'CATL'){
			$scope.present_time = new Date();
			$scope.selected_report_title = 'Category List';
			$ionicModal.fromTemplateUrl('CategoryList-report-modal.html', {
				id:'CATL_MODAL',
				scope: $scope,
				backdropClickToClose: false,
				animation: 'none'
			}).then(function(modal) {
				modal.el.className = modal.el.className + " report-modal";
				$scope.catl_modal = modal;
				$scope.openModal('CATL_MODAL');
			});
		}else if(type == 'CART_LIST'){
			$scope.present_time = new Date();
			$scope.selected_report_title = 'Custom Product List';
			$ionicModal.fromTemplateUrl('CustomProductList-report-modal.html', {
				id:'CUSTOM_PL_MODAL',
				scope: $scope,
				backdropClickToClose: false,
				animation: 'none'
			}).then(function(modal) {
				modal.el.className = modal.el.className + " report-modal";
				$scope.custom_pl_modal = modal;
				$scope.openModal('CUSTOM_PL_MODAL');
			});
		}else if(type == 'CUST_LIST'){
			$scope.present_time = new Date();
			$scope.selected_report_title = 'Customer List';
			$scope.allCustomers = [];
			$pouchDB.search('customer#',true,false).then(function(returnData) {
				$scope.allCustomers = returnData.rows;
				if(!returnData.rows.length)
					$scope.settings_error.err = "No customers found...";
			}).catch(function(error){
				$scope.settings_error.err = "Unable to retrieve customers...";
				console.error(error);
			});
			$scope.openModal('CUST_LIST_MODAL');
		}
	}
	
	$scope.posFilter = function(type,docs){
		if(type == 'PAR'){
			return calculate_profit(docs);
		}else if(type == 'PSR'){
			 $scope.data_report = calculateProductSalesReport(docs);
		}else if(type == 'CASHFLOW'){
			$scope.data_report = calculate_cashflow(docs);
		}else if (type == 'OH'){
			$scope.data_report = $scope.calculateOrderProfitReport(docs);
		}else if (type == 'X' || type == 'Z'){
			$scope.aiv_report = calculateReport(docs);
		}else if (type == 'VOID'){
			$scope.aiv_report = calculateVoidReport(docs);
		}
	}
	
	$scope.menu_settings = {active:'Settings',show_save:true};
	$scope.switch_menu = function(item){
		//$scope.getDepositData();
		$scope.settings_error = {err:'',pass:''};
		switch(item){
			case 'Settings':
				$scope.menu_settings.active = item;
				/*if($scope.loginInfo.role!='shop_manager'){
					$scope.showCheckoutMsg('Warning','Please login as Manager to change settings...');
					break;
				}*/
				//showSettings(true);
				$scope.openSettingsModal(true);
				$scope.menu_settings.show_save = true;
				break;
			case 'Reports':
				$scope.payout_details();
				$scope.voucher_details();
				$scope.deposit_details();
				$scope.menu_settings.active = item;
				$scope.menu_settings.show_save = false;
				$scope.settings_close = true;
				createSettingsTemplate();
				break;
			case 'Expenditure':
				$scope.openCashflowModal();
				break;
			case 'Cart list':
				if($scope.cartItems.length){
					$scope.showReports('CART_LIST');
				}else{
					$scope.showCheckoutMsg('Warning','Please add some products to cart...');
				}				
				break;
			default:break;
		}
		$scope.hideDropdown();
	}
	
	$scope.resetSettingsErr = function(){
		$scope.settings_error = {err:'',pass:''};
	}
	
    $scope.onTerminalSelect = function(item){
		$scope.settings_data.terminal.name = item.name;
		$scope.settings_data.terminal.type = item.type;
		$scope.settings_data.terminal.id = item.id;
    }

	$scope.settings_error = {err:'',pass:''};
	$scope.confirmTerminal = function(){
		if($scope.settings_data.terminal.name == ''){
			$scope.settings_error.err = 'Please enter a valid name...'
		}else if($scope.settings_data.terminal.type == ''){
			$scope.settings_error.err = 'Please enter a valid type...'
		}else{
			$scope.settings_error.err = '';
			var confirmPopup = $ionicPopup.confirm({
			 title: 'Confirm',
			 template: 'Are you sure you want to create a new terminal? : '+$scope.settings_data.terminal.name+' ('+$scope.settings_data.terminal.type+')'
		   });

		   confirmPopup.then(function(res) {
			 if(res) {
				$scope.createTerminal($scope.settings_data.terminal);
			 }
		   });
		}
	}
	
	$scope.createTerminal = function(selected_terminal){
		$pouchDB.get('getTerminals').then(function(all_terminals) {
			for(var i=0;i<all_terminals.terminals.length;i++){
				if(selected_terminal.name == all_terminals.terminals[i].name){
					$scope.settings_error.err = 'A terminal with this name already exists...';
					return;
				}
			}
			var new_prefix = 10+all_terminals.terminals.length;
			var new_id = 'TERMINAL_'+selected_terminal.name;
			var new_bill_number = 11111110;
			all_terminals.terminals.push({'name':selected_terminal.name,'id':new_id,'type':selected_terminal.type,});
			$scope.aivTerminals = all_terminals.terminals;
			var new_doc = {
				'_id':new_id,
				'name':selected_terminal.name,
				'id':new_id,
				'prefix':new_prefix,
				'last_bill_number':new_bill_number,
				'last_order_seq':0,
				'type':selected_terminal.type,
				'assigned':false,
				'dept':[],
				'last_customer_seq':0
			};
			$pouchDB.save(all_terminals).then(function(returnData) {
				console.log('New terminal '+selected_terminal.name+' created');
				return $pouchDB.save(new_doc);
			}).then(function(res) {
				if(new_doc.type == "WAITER"){
					var print_doc = {
						'_id':new_doc.name+"_print",
						'data':[]
					}
					return $pouchDB.save(print_doc);
				}
			}).then(function(result) {
				console.log(selected_terminal.name+' details created');
				$scope.settings_data.terminal = new_doc;
			}).catch(function(error) {
				$scope.showCheckoutMsg('Error','Unable to create terminal...');
				console.error(error);
			});
		}).catch(function(error) {
			console.error(error);
		});
	}
	
	function changeDepts(){
		if($scope.dept_changed && $scope.kitchenTerminals.length){
			var updateDept = function (doc) {
				var terminal = $filter('filter')($scope.kitchenTerminals,{_id:doc._id},false);
				if(terminal.length){
					doc.dept = terminal[0].dept;
					return doc;
				}
				return false; // don't update the doc; it's already been "touched"
			}
				
			Promise.all($scope.kitchenTerminals.map(function (row) {
				return $pouchDB.upsert(row._id,updateDept);
			})).then(function (result) {
				$scope.dept_changed = false;
				$pouchDB.sync($scope.couchDBUrl);
			}).catch(function (error) {
				console.log(error);
				$scope.showCheckoutMsg('Error','An error occured while attaching departments');
			});
		}else{
			$pouchDB.sync($scope.couchDBUrl);
		}
	}
	
	function setTerminal(returnData){
		returnData.assigned = true;
		$pouchDB.save(returnData).then(function(res) {//Updating new terminal data
			if($scope.terminalData.id != ''){
				var old_terminal =	$scope.terminalData;
				$pouchDB.get(old_terminal.id).then(function(res_term) {//Getting old terminal data
					res_term.assigned = false;
					$pouchDB.save(res_term).then(function(res) {
						console.log(res_term.name+' details updated');
					})
				});
			}
			changeDepts();
			trashOrder();
			$scope.terminalData = returnData;
			$rootScope.current_terminal = $scope.terminalData.name;
			$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'terminalData',$scope.terminalData);
			$scope.closeModal('POS_SETTINGS');
			getUnpaidCollectionOrders(true,false);
			$ionicLoading.hide();
			console.log($scope.terminalData.name+' details updated');
			reloadApp();
		}).catch(function(error) {
			$scope.showCheckoutMsg('Error','Unable to save terminal settings...');
			$ionicLoading.hide();
			console.error(error);
		});
	}
	
	$scope.saveSettings = function(){
		$scope.settings_error.err = '';
		
		if($scope.settings_data.terminal.name == ''){
			$scope.settings_error.err = 'Please enter terminal name';
			return;
		}else if($scope.settings_data.terminal.type == ''){
			$scope.settings_error.err = 'Please select a terminal type';
			return;
		}else if($scope.settings_data.terminal.id == ''){
			$scope.settings_error.err = 'Please create a terminal';
			return;		
		}else if($scope.settings_data.terminal.type == 'WAITER'){
			$scope.settings_error.err = 'Cannot set for WAITER terminal.';
			return;
		}else if($scope.local_ip != $scope.settings_data.local_ip && !$scope.ip_validated){
			$scope.settings_error.err = 'Please validate Kitchen Monitor IP address';
			return;
		}else if($scope.localdb_ip != $scope.settings_data.localdb_ip && !$scope.ip_validated){
			$scope.settings_error.err = 'Please validate Local Server IP address';
			return;
		}else if($scope.hf_loyalty.enabled){
			if($scope.hf_loyalty.sales.amount == '' || $scope.hf_loyalty.sales.amount == '0'){
				$scope.settings_error.err = "Please enter valid sales amount";
				return;	
			}else if($scope.hf_loyalty.rewards.amount == '' || $scope.hf_loyalty.rewards.amount == '0'){
				$scope.settings_error.err = "Please enter valid reward amount";
				return;	
			}else if($scope.hf_loyalty.sales.points == '' || $scope.hf_loyalty.sales.points == '0'){
				$scope.settings_error.err = "Please enter valid sales points";
				return;	
			}else if($scope.hf_loyalty.rewards.points == '' || $scope.hf_loyalty.rewards.points == '0'){
				$scope.settings_error.err = "Please enter valid reward points";
				return;	
			}else if($scope.hf_loyalty.feedback_points==undefined || $scope.hf_loyalty.feedback_points == ''){
				$scope.settings_error.err = "Please enter valid points for feedback";
				return;	
			}else if($scope.hf_loyalty.signup_points==undefined || $scope.hf_loyalty.signup_points == ''){
				$scope.settings_error.err = "Please enter valid points for signup";
				return;	
			}
		}else if($scope.settings_data.pos_settings.early_takeaway.start > $scope.settings_data.pos_settings.early_takeaway.end){
			$scope.settings_error.err = "Please enter valid start and end time for Early takeaway";
			return;
		}
		
		if(!$scope.receiptCount.collection){
			$scope.receiptCount.collection = 1;
		}
		if(!$scope.receiptCount.delivery){
			$scope.receiptCount.delivery = 1;
		}
		if(!$scope.receiptCount.kot){
			$scope.receiptCount.kot = 1;
		}
		if(!$scope.receiptCount.inshop){
			$scope.receiptCount.inshop = 1;
		}
		if(!$scope.receiptCount.card){
			$scope.receiptCount.card = 0;
		}
		if(!$scope.receiptCount.sitin){
			$scope.receiptCount.sitin = 1;
		}
		for(var i=0;i<$scope.settings_data.dept_receiptCount.length;i++){
			if(!$scope.settings_data.dept_receiptCount[i].copies){
				$scope.settings_data.dept_receiptCount[i].copies = 1;
			}
		}

		if($scope.settings_data.online_order.enable != $scope.onlineOrder.enable){
			$scope.OnlineOrders($scope.settings_data.online_order.enable);
		}
		
		$scope.callOrder.sound = $scope.settings_data.call_order.sound;
		$scope.justEat.orders = $scope.settings_data.justEat.orders;
		$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'receiptCount',$scope.receiptCount);
		$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'configKOT',$scope.print_config.kot);
		$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'configCDR',$scope.print_config.cashdrawer);
		$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'onlineOrder',$scope.onlineOrder);
		$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'callOrder',$scope.callOrder);
		$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'justEat',$scope.justEat);
		$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'enableDeafalutBagCharge',$scope.settings_data.enableDeafalutBagCharge);
		$scope.dept_receiptCount = angular.copy($scope.settings_data.dept_receiptCount);
		$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'dept_receiptCount',JSON.stringify($scope.dept_receiptCount));
		$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'logoInReceipt',$scope.settings_data.logoInReceipt);
		$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'enablePayOff',$scope.settings_data.enablePayOff);
		$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'enable_free_delivery',$scope.settings_data.enable_free_delivery);
		$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'free_delivery_amt',$scope.settings_data.free_delivery_amt);		
		$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'orderlistSettings',$scope.orderlistSettings);
		$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'enableLoginScreen',$scope.enableLoginScreen);
		$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'otherSettings',$scope.otherSettings);
		
		$scope.defaultBtns = angular.copy($scope.settings_data.default_btns);
		$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'defaultBtns',$scope.defaultBtns);
		
		$scope.commonPrintSettings = angular.copy($scope.settings_data.common_printer_settings);
		$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'commonPrintSettings',$scope.commonPrintSettings);
		$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'takeawayKotPrinter',$scope.settings_data.takeawayKotPrinter);
		
		$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'realsePrinter',$scope.settings_data.realsePrinter);
		//Main printer
		$scope.setMainPrinter();
		
		if($scope.settings_data.label_printer.selected ){
			if($scope.settings_data.label_printer.name != ''){
				if($scope.settings_data.label_printer.type == '' || $scope.settings_data.label_printer.type == undefined){
					$scope.settings_error.err = 'Please select label printer type';
					return;		
				}
				$scope.LabelPrinterSettings.name = $scope.settings_data.label_printer.name;
				$scope.LabelPrinterSettings.selected = true;
				if($scope.settings_data.label_printer.lineLength != undefined && $scope.settings_data.label_printer.lineLength != ''){
					$scope.LabelPrinterSettings.lineLength = parseInt($scope.settings_data.label_printer.lineLength);
				}else{
					$scope.LabelPrinterSettings.lineLength = 48;
				}
				
				$scope.LabelPrinterSettings.connected = false;
				$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'LabelPrinterSettings',$scope.LabelPrinterSettings);
			}else{
				$scope.showCheckoutMsg('Error','No label printer selected!!!');
			}
		}else{
			$scope.LabelPrinterSettings.selected = false;
			$scope.settings_data.label_printer.name = '';
			$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'LabelPrinterSettings',$scope.LabelPrinterSettings);
		}
		
		if($scope.terminalData.id != $scope.settings_data.terminal.id){
			$ionicLoading.show({
				template: '<ion-spinner icon="ios"></ion-spinner><br><span class="aiv-loading">Saving settings<br>Please wait...</span>',
				animation: 'fade-in',
				showBackdrop: true,
				maxWidth: 300,
				showDelay: 0
			});
			$pouchDB.get($scope.settings_data.terminal.id).then(function(returnData) {//Getting new terminal data
				if(returnData.type == "KITCHEN"){
					for(var i=0;i<$scope.kitchenTerminals.length;i++){
						if($scope.kitchenTerminals[i]._id == returnData._id){
							returnData.dept = $scope.kitchenTerminals[i].dept;
							$scope.kitchenTerminals[i] = returnData;
							break;
						}
					}
				}
				if(returnData.assigned){
					$ionicLoading.hide();
					var confirmPopup = $ionicPopup.confirm({
						title: 'Warning',
						template: 'This terminal is already assigned somewhere. If you select this, it may lead to conflict. Are you sure you want to continue?'
					});

					confirmPopup.then(function(res) {
						if(res) {
							setTerminal(returnData);
						}
					});
				}else{
					setTerminal(returnData);
				}
			}).catch(function(error){
				$scope.showCheckoutMsg('Error','An error occurred while saving settings!!!');
				$ionicLoading.hide();
				console.error(error);
			});
		}else{
			changeDepts();
			$scope.closeModal('POS_SETTINGS');
			$ionicLoading.show({
				template : '<h2>Settings saved...</h2>',
				duration : 1300
			});
		}
		
		$scope.dailyOrderNo.prefix = $scope.dailyOrderNo.prefix?$scope.dailyOrderNo.prefix:'';
		$scope.dailyOrderNo.start = $scope.dailyOrderNo.start?parseInt($scope.dailyOrderNo.start):1;
		$scope.dailyOrderNo.num = $scope.dailyOrderNo.num?parseInt($scope.dailyOrderNo.num):$scope.dailyOrderNo.start;
		if($scope.dailyOrderNo.num < $scope.dailyOrderNo.start){
			$scope.dailyOrderNo.num = parseInt($scope.dailyOrderNo.start);
		}
		$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'order_no',$scope.dailyOrderNo);
		
		$scope.order_type = $scope.settings_data.order_type;
		$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'order_type',$scope.order_type);
		var method = $filter('filter')($scope.shipping_methods,{title:$scope.order_type},false);
		if(method.length){
			$scope.changeShipping(method[0]);
			$scope.ship_select.id = $scope.temp_shipping.id;
			$scope.saveShipping(false);
		}else if(angular.isUndefined($scope.selected_shipping.id)){
			$scope.selected_shipping = {};
			if($scope.terminalData.type == 'FRONT' || $scope.startup.action=='TABLEVIEW'){
				$scope.selected_shipping = {'id':'','title':'Takeaway','method_title':'','method_description':'','fee':''};
			}
			$scope.ship_select = {id : null,err : '',amount:''};
		}
		
		var restart_required = 0;
		if($scope.settings_data.templates.selected.id != $scope.backTemplate.id){
			//Back terminal type changed
			$scope.backTemplate = $scope.settings_data.templates.selected;
			$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'backTemplate',$scope.backTemplate);
			restart_required++; 
		}

		if($scope.localdb_ip != $scope.settings_data.localdb_ip){
			$scope.localdb_ip = $scope.settings_data.localdb_ip;
			$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'localdb_ip',$scope.localdb_ip);
			restart_required++;
		}
		
		if($scope.dailyOrderNo.common){
			$scope.settings_data.pos_settings.daily_order_no = angular.copy($scope.dailyOrderNo);
		}

		var postData = {};
		postData.type = "UPDATE_ALL";
		postData.loyalty = $scope.hf_loyalty;
		postData.daily_order_no = $scope.dailyOrderNo;
		postData.print_server =$scope.settings_data.pos_settings.print_server;	
		if($scope.local_ip != $scope.settings_data.local_ip){
			postData.local_ip = $scope.settings_data.local_ip;
		}
		if($scope.settings_data.pos_settings.enable_sitin != $scope.POSSettings.enable_sitin){
			postData.enable_sitin = $scope.settings_data.pos_settings.enable_sitin;
		}
		if($scope.settings_data.pos_settings.show_delcharge_report != $scope.POSSettings.show_delcharge_report){
			postData.show_delcharge_report = $scope.settings_data.pos_settings.show_delcharge_report;
		}
		postData.early_takeaway = $scope.settings_data.pos_settings.early_takeaway;
		if($scope.settings_data.pos_settings.master_terminal != $scope.POSSettings.master_terminal){
			postData.master_terminal = $scope.settings_data.pos_settings.master_terminal;
		}
		
		if($scope.settings_data.pos_settings.online_default_accept != $scope.POSSettings.online_default_accept){
			postData.online_default_accept = $scope.settings_data.pos_settings.online_default_accept;
		}
		
		
	
		var temp_sitin = $scope.POSSettings.enable_sitin;
		var temp_show_delcharge_report = $scope.POSSettings.show_delcharge_report;
		$ionicLoading.show({
			template: '<ion-spinner icon="ios"></ion-spinner><br><span class="aiv-loading">Saving settings<br>Please wait...</span>',
			animation: 'fade-in',
			showBackdrop: true,
			maxWidth: 300,
			showDelay: 0
		});
		$scope.httpRequest = dataService.updateDoc($scope.couchDBUrl+"/_design/updategetSettings/_update/settings/getSettings", postData);
		$scope.httpRequest.then(function(returnData) {
			console.log(returnData);
			$ionicLoading.hide();
			if(returnData.Success){
				$scope.settings_error.pass = "Successfully saved...";
				if($scope.local_ip != $scope.settings_data.local_ip){
					$scope.local_ip = $scope.settings_data.local_ip;
					$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'local_ip',$scope.local_ip);
					restart_required++;
				}
				$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'HFLoyaltySettings',$scope.hf_loyalty);
				
				if($scope.settings_data.pos_settings.enable_sitin != temp_sitin){
					if($scope.settings_data.pos_settings.enable_sitin){
						$scope.shipping_methods.unshift({'id':'sitin','title':'Sit-In','method_title':'Sit-In','method_description':'','fee':''});
					}else{
						for(var i=0;i<$scope.shipping_methods.length;i++){
							if($scope.shipping_methods[i].id == 'sitin'){
								$scope.shipping_methods.splice(i,1);
								break;
							}
						}
					}
				}
				
				//Check if Early takeaway started
				if(hhmmss(new Date())>hhmmss($scope.settings_data.pos_settings.early_takeaway.start) && hhmmss(new Date())<hhmmss($scope.settings_data.pos_settings.early_takeaway.end)){
					$scope.aiv_toggles.early_takeaway = true;
				}else{
					$scope.aiv_toggles.early_takeaway = false;
				}
				$scope.POSSettings = angular.copy($scope.settings_data.pos_settings);
				$scope.POSSettings.early_takeaway.start = new Date($scope.settings_data.pos_settings.early_takeaway.start).toISOString();
				$scope.POSSettings.early_takeaway.end = new Date($scope.settings_data.pos_settings.early_takeaway.end).toISOString();
				$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'POSSettings',$scope.POSSettings);
				
				if(restart_required){
					reloadApp();
				}
			}else{
				if(returnData.Message){
					$scope.settings_error.err = returnData.Message;
				}else{
					$scope.settings_error.err = "An error occurred while saving settings...";
				}
			}
		}).catch(function(err){
			var msg = '';
			if(!err){
				$scope.settings_error.err = "No connection to server!!!";
			}else if(angular.isDefined(err.error)){
				if(err.error == "timeout"){
					$scope.settings_error.err = "Failed to save some settings due to slow internet connection";
				}else{
					$scope.settings_error.err = "Failed to save some settings.Request aborted!!!";
				}
			}else{
				$scope.settings_error.err = "Failed to save some settings";
			}
			console.error(err);
			$ionicLoading.hide();
		});
		
		$pouchDB.upsert('getPaymentMethods',function(doc){
			if(doc){
				doc.methods = angular.copy($scope.settings_data.payment_methods);
				return doc;
			}
			return false;
		}).then(function(res){
			$scope.PaymentMethods = angular.copy($scope.settings_data.payment_methods);
			$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'PaymentMethods', $scope.PaymentMethods);
		}).catch(function(error){
			$scope.showCheckoutMsg('Warning','Failed to update payment methods!!!');
			console.error(error);
		});
		
	}

	$scope.loadPendingOrder = function(order){
		if($scope.terminalData.type != 'FRONT'){
			var docid = order._id;
			$pouchDB.get(docid).then(function(returnData) {
				if(returnData.data.shipping_lines[0].method_id == 'local_delivery'){
					returnData.data.order_meta.duration = '40 Minutes';
				}else if(returnData.data.shipping_lines[0].method_id == 'local_pickup'){
					returnData.data.order_meta.duration = '20 Minutes';
				}
				$scope.online_order = angular.copy(returnData);
				$scope.online_processing = true;
				$scope.showOnlineModal();
				$scope.selected_shipping.title = returnData.data.shipping_methods;
			}).catch(function(error){
				$scope.showCheckoutMsg('Error',"Oops...An error occurred!!!");
				console.error(error);
			});
		}else if($scope.terminalData.type == 'FRONT'){
		//else if($scope.terminalData.type == 'FRONT' && !order.data.payment_details.paid){
			$scope.editOrder('EDIT_ORDER',order);
		}
	}
	
	$scope.pagination = {
		current: 1
	};
	$scope.orderFilterArray =[];
	$scope.orderFilterType ='ALL';
	//Function to filter all unpaid orders from orderlist
	$scope.showUnpaidOrders =function(data){
		$scope.orderFilterType ='UNPAID';
		$scope.searchText ='';
		if(data =='Unpaid'){
				$scope.orderFilterArray =[];
			if($scope.allOrders.length){
			//Filter all unpaid orders from order list
				for(var i=0;i<$scope.allOrders.length;i++){
					if(!$scope.allOrders[i].data.payment_details.paid){
						$scope.orderFilterArray.push($scope.allOrders[i]);
					}
				}
			}
		}else if(data =='All'){
		$scope.searchText ='';
		$scope.orderFilterType ='ALL';
		}else{
		$scope.searchText =data;
		$scope.orderFilterType ='ALL';
		}
	}
	
	$scope.getAllOrders = function(online,create = false,refresh = false){
		$scope.showOnlineOrders = online;
		$scope.pagination.current = 1;
		var online_terminal = false;
		if($scope.terminalData.type == 'BACK' && $scope.backTemplate.id=='MPOS'){
			online_terminal = true;
		}
		$ionicLoading.show({
			template: '<ion-spinner icon="ios"></ion-spinner><br><span class="aiv-loading">Fetching orders<br>Please wait...</span>',
			animation: 'fade-in',
			showBackdrop: true,
			maxWidth: 300,
			showDelay: 0
		});
		
		var orders = shareData.getOrders();
		$scope.allOrders = [];
		angular.forEach(orders,function(order){
			if(order._id.includes('_order_') && angular.isDefined(order.data)){
				if(($scope.showOnlineOrders == 'WEB' && order._id.startsWith('AIVOOT_')) ||
					($scope.showOnlineOrders == 'POS' && ($scope.orderlistSettings.view_all || (order._id.startsWith($scope.terminalData.name+'_') || order.data.order_meta.processed_by==$scope.terminalData.name))) ||
					($scope.showOnlineOrders == 'INSHOP' && order.data.shipping_methods == "" && !order._id.startsWith('AIVOOT_') && ($scope.orderlistSettings.view_all || (order._id.startsWith($scope.terminalData.name+'_') || order.data.order_meta.processed_by==$scope.terminalData.name))) || 
					($scope.showOnlineOrders == 'SITIN' && order.data.shipping_methods == "Sit-In" && ($scope.orderlistSettings.view_all || (order._id.startsWith($scope.terminalData.name+'_') || order.data.order_meta.processed_by==$scope.terminalData.name))) || 
					($scope.showOnlineOrders == 'TABLE' && order.data.shipping_methods == "" && order.data.order_meta.order_type == 'TABLE' && ($scope.orderlistSettings.view_all || (order._id.startsWith($scope.terminalData.name+'_') || order.data.order_meta.processed_by==$scope.terminalData.name))) || 
					($scope.showOnlineOrders == 'COLLECTION' && order.data.shipping_methods == "Local Pickup" && ($scope.orderlistSettings.view_all || (online_terminal && order._id.startsWith('AIVOOT_')) || (order._id.startsWith($scope.terminalData.name+'_') || order.data.order_meta.processed_by==$scope.terminalData.name))) ||
					($scope.showOnlineOrders == 'DELIVERY' && order.data.shipping_methods == "Local Delivery" && ($scope.orderlistSettings.view_all || (online_terminal && order._id.startsWith('AIVOOT_')) || (order._id.startsWith($scope.terminalData.name+'_') || order.data.order_meta.processed_by==$scope.terminalData.name)))){
					$scope.allOrders.push(order);
				}
			}
		});
		
		if(!$scope.onlineOrder.enable || $scope.terminalData.type=='FRONT'){
			//Filter out all pending and processing online orders
			for(var i=0;i<$scope.allOrders.length;i++){
				var doc = $scope.allOrders[i];
				if(doc._id.indexOf('AIVOOT_order') > -1 && angular.isDefined(doc.data) && (doc.data.status=='pending' || doc.data.status=='processing')){
					$scope.allOrders.splice(i,1);
				}
			}
		}
		$scope.allOrdersCache = angular.copy($scope.allOrders);
		
		if(create && ($scope.order_modal == undefined || !$scope.order_modal._isShown) && !online_terminal){
			$ionicModal.fromTemplateUrl('view-order-modal.html', {
				id:'VIEW_ORDER',
				scope: $scope,
				backdropClickToClose: false,
				animation: 'none'
			}).then(function(modal) {
				$scope.order_modal = modal;
				$scope.openModal('VIEW_ORDER');
			});
		}
		
		$ionicLoading.hide();
		if(refresh){
			//Stop the ion-refresher from spinning
			$scope.$broadcast('scroll.refreshComplete');
		}
		/*var config = {
			include_docs: true
		}
		aiv_time_start();
		$pouchDB.bulkFetch(config).then(function(returnData){
			aiv_time_end("FETCH ORDERS");
			$scope.allOrders = [];
			angular.forEach(returnData.rows,function(row){
				if(row.doc._id.includes('_order_') && angular.isDefined(row.doc.data)){
					if(($scope.showOnlineOrders == 'WEB' && row.doc._id.startsWith('AIVOOT_')) ||
						($scope.showOnlineOrders == 'POS' && ($scope.orderlistSettings.view_all || (row.doc._id.startsWith($scope.terminalData.name+'_') || row.doc.data.order_meta.processed_by==$scope.terminalData.name))) ||
						($scope.showOnlineOrders == 'INSHOP' && row.doc.data.shipping_methods == "" && !row.doc._id.startsWith('AIVOOT_') && ($scope.orderlistSettings.view_all || (row.doc._id.startsWith($scope.terminalData.name+'_') || row.doc.data.order_meta.processed_by==$scope.terminalData.name))) || 
						($scope.showOnlineOrders == 'SITIN' && row.doc.data.shipping_methods == "Sit-In" && ($scope.orderlistSettings.view_all || (row.doc._id.startsWith($scope.terminalData.name+'_') || row.doc.data.order_meta.processed_by==$scope.terminalData.name))) || 
						($scope.showOnlineOrders == 'TABLE' && row.doc.data.shipping_methods == "" && row.doc.data.order_meta.order_type == 'TABLE' && ($scope.orderlistSettings.view_all || (row.doc._id.startsWith($scope.terminalData.name+'_') || row.doc.data.order_meta.processed_by==$scope.terminalData.name))) || 
						($scope.showOnlineOrders == 'COLLECTION' && row.doc.data.shipping_methods == "Local Pickup" && ($scope.orderlistSettings.view_all || (online_terminal && row.doc._id.startsWith('AIVOOT_')) || (row.doc._id.startsWith($scope.terminalData.name+'_') || row.doc.data.order_meta.processed_by==$scope.terminalData.name))) ||
						($scope.showOnlineOrders == 'DELIVERY' && row.doc.data.shipping_methods == "Local Delivery" && ($scope.orderlistSettings.view_all || (online_terminal && row.doc._id.startsWith('AIVOOT_')) || (row.doc._id.startsWith($scope.terminalData.name+'_') || row.doc.data.order_meta.processed_by==$scope.terminalData.name)))){
						$scope.allOrders.push(row.doc);
					}
				}
			});
			
			if(!$scope.onlineOrder.enable || $scope.terminalData.type=='FRONT'){
				//Filter out all pending and processing online orders
				for(var i=0;i<$scope.allOrders.length;i++){
					var doc = $scope.allOrders[i];
					if(doc._id.indexOf('AIVOOT_order') > -1 && angular.isDefined(doc.data) && (doc.data.status=='pending' || doc.data.status=='processing')){
						$scope.allOrders.splice(i,1);
					}
				}
			}
			$scope.allOrdersCache = angular.copy($scope.allOrders);
			
			if(create && ($scope.order_modal == undefined || !$scope.order_modal._isShown) ){
				$ionicModal.fromTemplateUrl('view-order-modal.html', {
					id:'VIEW_ORDER',
					scope: $scope,
					backdropClickToClose: false,
					animation: 'none'
				}).then(function(modal) {
					$scope.order_modal = modal;
					$scope.openModal('VIEW_ORDER');
				});
			}
			
			$ionicLoading.hide();
			console.log("Order count : "+$scope.allOrders.length+"/"+returnData.rows.length);
			if(refresh){
				//Stop the ion-refresher from spinning
				$scope.$broadcast('scroll.refreshComplete');
			}	
		}).catch(function (error) {
			$scope.showCheckoutMsg('Error','An error occurred while retrieving orders');
			console.error(error);
			$ionicLoading.hide();
			if(refresh){
				//Stop the ion-refresher from spinning
				$scope.$broadcast('scroll.refreshComplete');
			}
		});*/
	}
	
	$scope.loadOrder = function(order){
		trashOrder();
		if(order._id.indexOf('AIVOOT') < 0){
			if($scope.cartItems.length){
				$scope.showCheckoutMsg('Warning','Please Save/Clear your current order and continue');
				return;
			}

			var term = order._id.split('_')[0];
			var docid = term+'_pending_'+order.data.order_meta.bill_number;			
			$pouchDB.get(docid).then(function(returnData) {
				$scope.formCheckout = angular.copy(returnData.data);
				$scope.formCheckout.pending_data.pending_rev = returnData._rev;
				$scope.formCheckout.pending_data.order_rev = order._rev;
				$scope.formCheckout.pending_data.order_id = order.data.id;
				$scope.formCheckout.pending_data.docid = order._id;
				
				//Save shipping
				if(angular.isArray($scope.formCheckout.shipping_lines)){
					$scope.selected_shipping = {
						'id':$scope.formCheckout.shipping_lines[0].method_id,
						'title':order.data.shipping_methods==''?'Takeaway':order.data.shipping_methods,
						'method_title':$scope.formCheckout.shipping_lines[0].method_title,
						'method_description':'',
						'fee':$scope.formCheckout.shipping_lines[0].total
					};
				}else{
					$scope.selected_shipping = {'id':'','title':'Takeaway','method_title':'','method_description':'','fee':''};
				}
				$scope.bagCharges.selected =$scope.formCheckout.pending_data.bagCharge;
				$scope.ship_select.id = $scope.selected_shipping.id;
				$scope.grand.Shipping = ($scope.selected_shipping.fee=='')?0:parseFloat($scope.selected_shipping.fee);
				$scope.grand.Total = parseFloat(order.data.subtotal)+$scope.bagCharges.selected;
		
				$scope.cartItems = $scope.formCheckout.pending_data.cart;
				$scope.sitin_tables.selected = Number(order.data.order_meta.sitin_table);
				
				var deal_discounts = 0,loyalty_discount = 0,coupon_discount = 0,user_discount = 0;
				if(angular.isDefined(order.data.order_meta.discounts_present)){
					var discountArr = order.data.order_meta.discounts_present.split(";");
					for(var d=0;d<discountArr.length;d++){
						var discountTypeArr = discountArr[d].split('#');
						if(discountTypeArr.length){
							if(discountTypeArr[0] == "C"){
								coupon_discount+= parseFloat(discountTypeArr[1]);
							}else if(discountTypeArr[0] == "D"){
								deal_discounts+= parseFloat(discountTypeArr[1]);
								$scope.deal_btn_clicked = {status:true,apply:true};
							}else if(discountTypeArr[0] == "L"){
								loyalty_discount+= parseFloat(discountTypeArr[1]);
								$scope.cartDiscounts.push({name:'LOYALTY',amount:loyalty_discount});
							}else{
								user_discount+= parseFloat(discountTypeArr[1]);
							}
						}
					}
				}
				
				$scope.getDealDiscount(true);
				//get coupon discount
				for (var i=0;i<$scope.formCheckout.coupon_lines.length;i++) {
					$scope.formCheckout.coupon_lines[i].type = false;
					$scope.formCheckout.coupon_lines[i].cart = true;
					$scope.formCheckout.coupon_lines[i].rate = parseFloat($scope.formCheckout.coupon_lines[i].amount);
					$scope.grand.Discount += parseFloat($scope.formCheckout.coupon_lines[i].amount);
				}
				
				//Offer discount
				$scope.grand.Discount += $scope.offer_discount;
				
				//Deal discount
				$scope.grand.Discount += deal_discounts;
				
				//Loyalty discount
				$scope.grand.Discount += loyalty_discount;
			
				//other discounts
				var disc = parseFloat(order.data.total_discount);
				if(disc){
					if(disc-$scope.grand.Discount > 0){
						if(angular.isDefined(order.data.order_meta.discount_pesentage) && !order.data.order_meta.discount_pesentage){
							$scope.cart_discount.percent_click = false;
							$scope.cart_discount.disc_num =order.data.total_discount;
						}else{
							$scope.cart_discount.percent_click = true;
						if(angular.isDefined(order.data.order_meta.discount_value) && order.data.order_meta.discount_value)
							$scope.cart_discount.disc_num = order.data.order_meta.discount_value;
						else
							$scope.cart_discount.disc_num = parseInt(((disc-$scope.grand.Discount)*100)/$scope.grand.Total);
						}
						$scope.cart_discount.disc_total = $scope.cart_discount.disc_num;
					}
					$scope.grand.Discount = disc;
				}
				
				$scope.setSelectedItem($scope.cartItems.length-1,$scope.cartItems[$scope.cartItems.length-1]);
				$ionicScrollDelegate.$getByHandle('cartScroll').scrollBottom();
				
				$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'grand', $scope.grand)
				$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'cart', $scope.cartItems);
				$scope.saveForm();
				if($scope.formCheckout.customer_id != 'guest'){
					var customer = shareData.getCustomer("DOCID",order.data.customer.meta.docid);
					if(angular.isDefined(customer._id)){
						$scope.formCheckout.billing_address = customer.billing_address;
						$scope.formCheckout.customer_id = customer.id;
						$scope.formCheckout.shipping_address = customer.shipping_address;
						$scope.formCheckout.customer_meta = customer.meta;

						$scope.saveForm();
						$scope.setSelectedCustomer(customer);
					}else{
						$scope.showCheckoutMsg('Warning',"The assigned customer doesn't exist OR your system is out of sync.");
					}
				}
				
			}).catch(function(error){
				console.error(error);
			});
		}else{
			trashOrder();
			$scope.loadPendingOrder(order);
		}
	}
	
	$scope.removeOrder = function(order){
		var confirmPopup = $ionicPopup.confirm({
			title: 'Warning',
			template: "Are you sure you want to remove this order permanently?"
		});

		confirmPopup.then(function(res) {
			if(res) {
				$ionicLoading.show({
					template: '<ion-spinner icon="ios"></ion-spinner><br><span class="aiv-loading">Please wait...</span>',
					animation: 'fade-in',
					showBackdrop: true,
					maxWidth: 300,
					showDelay: 0
				});
				$pouchDB.get(order._id).then(function(returnData) {
					return $pouchDB.delete(returnData._id,returnData._rev);
				}).then(function(returnData) {
					var index = $scope.allOrders.indexOf(order);
					if(index>=0)
						$scope.allOrders.splice(index, 1);
					$ionicLoading.hide();
					if($rootScope.aiv_info.enable_kitchen == "TRUE"){
						var base_doc_id = order._id;
						var splitNameArr = order._id.split('_order_');
						if(splitNameArr.length > 1){
							var splitSeqArr = splitNameArr[1].split('_');
							if(splitSeqArr.length > 0){
								base_doc_id = splitNameArr[0]+'_order_'+splitSeqArr[0];
							}
						}
						$pouchDBEtc.get(base_doc_id).then(function(result) {
							$pouchDBEtc.delete(result._id,result._rev);
						});
					}
				}).catch(function(error){//allOrders
					$ionicLoading.hide();
					console.error(error);
					$scope.showCheckoutMsg('Error','Oops..An error occurred...');
				});
			}
		});
	}
	
	$scope.removeSavedOrder = function(order){
		var confirmPopup = $ionicPopup.confirm({
			title: 'Warning',
			template: "Are you sure you want to remove this order permanently?"
		});

		confirmPopup.then(function(res) {
			if(res) {
				if(order._id.indexOf('AIVOOT') < 0){
					$ionicLoading.show({
						template: '<ion-spinner icon="ios"></ion-spinner><br><span class="aiv-loading">Please wait...</span>',
						animation: 'fade-in',
						showBackdrop: true,
						maxWidth: 300,
						showDelay: 0
					});
					var docid = order._id.split('_')[0]+'_pending_'+order.data.order_meta.bill_number;
					$pouchDB.get(docid).then(function(returnData) {
						return $pouchDB.delete(returnData._id,returnData._rev);
					}).then(function(returnData) {
						return $pouchDB.get(order._id);
					}).then(function(returnData) {
						return $pouchDB.delete(returnData._id,returnData._rev);
					}).then(function(returnData) {
						var index = $scope.allOrders.indexOf(order);
						if(index>=0)
							$scope.allOrders.splice(index, 1);
						$ionicLoading.hide();
					}).catch(function(error){//allOrders
						$ionicLoading.hide();
						console.error(error);
						$scope.showCheckoutMsg('Error','Oops..An error occurred...');
					});
				}
			}
		});
	}
	
	$scope.payDisabled = false;
	$scope.updatePaidStatus = function(order,online_count,paid =false){
		$scope.payDisabled = true;
		
		if($scope.order_to_pay.type == 'MULTIPLE'){
			$scope.printPayoffReceipt($scope.selectedOrders.orders,'MULTI_PAY',true);
			Promise.all($scope.selectedOrders.orders.map(function (order) {
				return $pouchDB.upsert(order._id,function(doc){
					if(doc != undefined){
						doc.data.payment_details = order.data.payment_details;
						if(!paid)
							doc.data.payment_details.paid = true;
						doc.data.status = "completed";
						doc.data.order_meta.processed_by = $scope.terminalData.name;
						doc.data.updated_at = new Date().toISOString();
						return doc;
					}
					return false;
				});
			})).then(function (results) {
				$scope.payDisabled = false;
				$scope.closeModal('PAYMENT');
				$scope.showReceiptSlip('PAYOFF');
				//$scope.selectedOrders = {sub_total:0,delivery_charge:0,total:0,orders:[],active:false};
				$ionicLoading.show({
					template : '<h2>Orders updated...</h2>',
					duration : 1300
				});
			}).catch(function(error){
				$scope.showCheckoutMsg('Error',"Failed to update payment status!!!");
				$scope.payDisabled = false;
				$scope.closeModal('PAYMENT');
				console.error(error);
			});
		}else{
			$pouchDB.upsert(order._id,function(doc){
				if(doc != undefined){
					doc.data.payment_details = order.data.payment_details;
					if(!paid)
						doc.data.payment_details.paid = true;
					doc.data.status = "completed";
					doc.data.order_meta.processed_by = $scope.terminalData.name;
					doc.data.updated_at = new Date().toISOString();
					return doc;
				}
				return false;
			}).then(function(returnData){
				$scope.payDisabled = false;
				if(!paid)
					order.data.payment_details.paid = true;
				order.data.status = "completed";
				order.data.order_meta.processed_by = $scope.terminalData.name;
				
				for(var j=0;j<$scope.allOrdersCache.length;j++){
					if(order._id == $scope.allOrdersCache[j]._id){
						$scope.allOrdersCache[j].data.payment_details.paid = true;
						$scope.allOrdersCache[j].data.status = "completed";
						$scope.allOrdersCache[j].data.order_meta.processed_by = $scope.terminalData.name;
						$scope.allOrdersCache[j].data.updated_at = new Date().toISOString();
						break;
					}
				}
				
				removeAlert(order.data.order_meta.bill_number);
				removeReady(order.data.order_meta.bill_number);
				if($scope.order_to_pay.type == 'SINGLE'){
					$scope.printPayoffReceipt(order.data,'SINGLE_PAY',true);
					$scope.closeModal('PAYMENT');
					$scope.showReceiptSlip('PAYOFF');
					$ionicLoading.show({
						template : '<h2>Order updated...</h2>',
						duration : 1300
					});
				}
			}).catch(function(error){
				$scope.showCheckoutMsg('Error',"Failed to update payment status!!!");
				$scope.payDisabled = false;
				console.error(error);
			});
		}
	}
	
	$scope.action_auth = {pass:'',err:'',auth:false,reason:''};
	$scope.updateRefundStatus = function(order,online_count){
		$scope.action_auth = {pass:'',err:'',auth:false,reason:''};
		$scope.setKeyInput('REQ_PASS',$scope.action_auth.pass);
		var passPopup = $ionicPopup.confirm({
			title: 'Enter Manager password',
			templateUrl: 'password-popup.html',
			scope: $scope,
			cssClass:"wide-popup aiv-popup",
			buttons: [
			  { text: 'Cancel' },
			  {
				text: '<b>Refund</b>',
				type: 'button-positive',
				onTap: function(e) {
				  if (!$scope.action_auth.pass) {
					//don't allow the user to close unless he enters password
					$scope.action_auth.err = "Password required!!!";
					$scope.action_auth.auth = false;
					e.preventDefault();
				  } else if(!$scope.action_auth.auth){
					var passed = $scope.isManagerAuthorized($scope.action_auth.pass);
					if(!passed){
						$scope.action_auth.err = "Wrong password!!!";
						$scope.action_auth.auth = false;
						e.preventDefault();
					}
					
					if(passed){
						$scope.action_auth.auth = true;
						if(!$scope.action_auth.reason){
							$scope.setKeyInput('REFUND_NOTE',$scope.action_auth.reason);
							$scope.action_auth.err = "Specify reason!!!";
							e.preventDefault();
						}
					}
				  }else if($scope.action_auth.auth){
					if(!$scope.action_auth.reason){
						$scope.action_auth.err = "Specify reason!!!";
						e.preventDefault();
					}
				  }
				  return true;
				}
			  }
			]
		});
		
		passPopup.then(function(res) {
			//$scope.action_auth = {pass:'',err:'',auth:false,reason:''};
			if(res) {
				$pouchDB.upsert(order._id,function(doc){
					if(doc != undefined){
						//doc.data.payment_details.paid = true;
						doc.data.status = "refunded";
						doc.data.order_meta.processed_by = $scope.terminalData.name;
						doc.data.updated_at = new Date().toISOString();
						doc.data.order_meta.reason = $scope.action_auth.reason;
						return doc;
					}
					return false;
				}).then(function(returnData){
					//order.data.payment_details.paid = true;
					order.data.status = "refunded";
					order.data.order_meta.processed_by = $scope.terminalData.name;
					order.data.order_meta.reason = $scope.action_auth.reason;
					
					for(var j=0;j<$scope.allOrdersCache.length;j++){
						if(order._id == $scope.allOrdersCache[j]._id){
							//$scope.allOrdersCache[j].data.payment_details.paid = true;
							$scope.allOrdersCache[j].data.status = "refunded";
							$scope.allOrdersCache[j].data.order_meta.processed_by = $scope.terminalData.name;
							$scope.allOrdersCache[j].data.updated_at = new Date().toISOString();
							$scope.allOrdersCache[j].data.order_meta.reason = $scope.action_auth.reason;
							break;
						}
					}
					
					removeAlert(order.data.order_meta.bill_number);
					removeReady(order.data.order_meta.bill_number);
					$scope.printPayoffReceipt(order.data,'REFUND_PRINT',true);
					
					if(order.data.order_meta.loyalty_card_id){
						//Refund points
						var refund_points_action = "",points_to_deduct = 0,amount_to_return = 0,points_to_return = 0;
						if(angular.isDefined(order.data.order_meta.earned_points)){
							refund_points_action = "REFUND_POINTS";
							points_to_deduct = Number(order.data.order_meta.earned_points);
						}
						
						if(angular.isDefined(order.data.order_meta.discounts_present) && order.data.order_meta.discounts_present){
							var discountSplit = order.data.order_meta.discounts_present.split(';');
							angular.forEach(discountSplit,function(discount){
								var LDiscountSpit = discount.split('#');
								if(LDiscountSpit.length>1 && LDiscountSpit[0]=='L'){
									//Loyalty discount found
									amount_to_return = Number(LDiscountSpit[1]);
									points_to_return = $scope.rewardConversionInverse(amount_to_return);
									refund_points_action = "REFUND_DISCOUNT";
								}
							});
						}
						
						var customer_doc = {};
						customer_doc = shareData.getCustomer("LOYALTY_CARD",order.data.order_meta.loyalty_card_id);
						if(angular.isUndefined(customer_doc._id)){
							customer_doc = shareData.getCustomer("PHONE",order.data.customer.billing_address.phone);
						}

						if(angular.isDefined(customer_doc._id)){
							if(refund_points_action){
								return $pouchDB.upsert(customer_doc._id,function(doc){
									doc.meta.points_to_unlock = Number(doc.meta.points_to_unlock)+points_to_return-points_to_deduct;
									doc.meta.amount_to_return = amount_to_return;
									doc.meta.points_to_deduct = points_to_deduct;
									doc.action = refund_points_action;
									return doc;
								});
							}
						}else{
							$scope.showCheckoutMsg('Error',"Unable to find customer.Failed to return loyalty points!!!");
						}
					}
					
				}).catch(function(error){
					$scope.showCheckoutMsg('Error',"Failed to update refund status!!!");
					console.error(error);
				});
			
			}else{
				$scope.action_auth = {pass:'',err:'',auth:false,reason:''};
			}
		});
	}
	
	var IsSameAddress = function(bil_address,ship_address){
		angular.forEach(ship_address,function(value,key){
			if(bil_address.hasOwnProperty(key) && bil_address[key]!=value){
				return false;
			}
		});
		return true;
	}
	
	$scope.edit_order_flags = {
		order_loaded : false,
		order_status : ''
	}
	$scope.editOrder = function(action,order){
		$scope.showCODPayment =true;
		if(action == 'MARK_AS_PAID'){
			clear_payment();
			if(angular.isUndefined(order)){
				if($scope.selectedOrders.orders.length){
					
					//Pay off multiple orders
					$scope.payment_fee = 0;
					$scope.payment_select.id = '';
					$scope.bagCharges.selected = 0;
					$scope.payment_select.del_charge = 0;
					$scope.split_payment = {
						'paid':0,
						'to_pay':0,
						'total':0
					};
					for(var i=0;i<$scope.selectedOrders.orders.length;i++){
						order = $scope.selectedOrders.orders[i];
						if(order.data.status == 'pending' || order.data.status == 'processing' || order.data.status == 'cancelled'){
							clear_payment();
							$scope.showCheckoutMsg('Warning','Please unselect PENDING/PROCESSING/CANCELLED orders');
							return;
						}
						
						if(order.data.fee_lines.length){
							for(var f=0;f<order.data.fee_lines.length;f++){
								if(order.data.fee_lines[f].title == 'Bag charges'){
									$scope.bagCharges.selected+=parseFloat(order.data.fee_lines[f].total);
								}else if(order.data.fee_lines[f].title == 'Card charges'){
									$scope.payment_fee+=parseFloat(order.data.fee_lines[f].total);
								}
							}
						}
			
						if(angular.isDefined(order.data.payment_details.method_id)){
							if(order.data.payment_details.paid){
								$scope.split_payment.paid+=parseFloat(order.data.order_meta.paid_amount);
								$scope.split_payment.to_pay+=parseFloat(order.data.order_meta.credit_amount);
								$scope.split_payment.total+=parseFloat(order.data.total);
							}else{
								$scope.payment_select.to_pay+=parseFloat(order.data.total);
							}
						}
						$scope.payment_select.del_charge+=parseFloat(order.data.total_shipping);
					}
					
					$scope.payment_select.del_charge = $filter('number')($scope.payment_select.del_charge,2);
					$scope.payment_select.to_pay-= $scope.payment_fee;
					$scope.split_payment.paid = $scope.split_payment.paid-$scope.payment_fee;
					$scope.split_payment.to_pay = $filter('number')($scope.split_payment.to_pay,2);
					$scope.split_payment.total = $scope.split_payment.total-$scope.payment_fee;
					$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'split_payment',$scope.split_payment);
					
					if(!$scope.payment_select.to_pay){
						clear_payment();
						$scope.showCheckoutMsg('Warning','Some/All of the selected orders are already paid');
						return;
					}
					$scope.selectedOrders.active = true;
					$scope.openPaymentModal('','MULTIPLE');
					$scope.closeModal('VIEW_ORDER');
				}
			}else{
				//Pay off single order
				if(order.data.fee_lines.length){
					for(var f=0;f<order.data.fee_lines.length;f++){
						if(order.data.fee_lines[f].title == 'Bag charges'){
							$scope.bagCharges.selected = parseFloat(order.data.fee_lines[f].total);
						}else if(order.data.fee_lines[f].title == 'Card charges'){
							$scope.payment_fee = parseFloat(order.data.fee_lines[f].total);
						}
					}
				}else{
					$scope.payment_fee = 0;
					$scope.bagCharges.selected = 0;
				}
			
				if(angular.isDefined(order.data.payment_details.method_id)){
					$scope.payment_select.id = '';
					if(order.data.payment_details.paid){
						$scope.split_payment = {
							'paid':parseFloat(order.data.order_meta.paid_amount)-$scope.payment_fee,
							'to_pay':parseFloat(order.data.order_meta.credit_amount).toFixed(2),
							'total':parseFloat(order.data.total)-$scope.payment_fee
						};
						$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'split_payment',$scope.split_payment);
					}else{
						$scope.payment_select.to_pay = order.data.total;
					}
					$scope.payment_select.del_charge = order.data.total_shipping;
				}else{
					$scope.payment_select.id = '';
				}
				$scope.selectedOrders.active = true;
				$scope.openPaymentModal(order,'SINGLE');
				$scope.closeModal('VIEW_ORDER');
			}
		}else if(action == 'EDIT_ORDER'){
			if($scope.cartItems.length){
				$scope.showCheckoutMsg('Warning','Please Save/Clear your current order and continue');
				return;
			}
			
			trashOrder();
			
			if($rootScope.aiv_info.enable_kitchen == "TRUE"){
				var updateEditStatus = function (doc) {
					if(doc.data.status == "on-hold"){
						doc.data.updated_at = new Date().toISOString();
						doc.data.status = "re-opened";
						return doc;
					}
					return false; // don't update the doc; it's already been "touched"
				}
				
				var splitNameArr = order._id.split('_order_');
				var base_doc_id = '';
				if(splitNameArr.length > 1){
					var splitSeqArr = splitNameArr[1].split('_');
					if(splitSeqArr.length > 0){
						base_doc_id = splitNameArr[0]+'_order_'+splitSeqArr[0];
					}
				}
			
				$pouchDBEtc.upsert(base_doc_id,updateEditStatus).then(function(res){
					console.log("Order "+order.data.order_meta.bill_number+" re-opened");
				}).catch(function(error){
					console.error(error);
				});
			}
					
			$scope.edit_order_flags.order_loaded = true;
			$scope.edit_order_flags.order_status = order.data.status;
			$scope.formCheckout.pending_data.order_id = order._id;

			//Save shipping
			$scope.formCheckout.shipping_lines = order.data.shipping_lines;
			if(angular.isArray($scope.formCheckout.shipping_lines) && $scope.formCheckout.shipping_lines.length){
				$scope.selected_shipping = {
					'id':$scope.formCheckout.shipping_lines[0].method_id,
					'title':order.data.shipping_methods,
					'method_title':$scope.formCheckout.shipping_lines[0].method_title,
					'method_description':'',
					'fee':$scope.formCheckout.shipping_lines[0].total
				};
			}else{
				$scope.formCheckout.shipping_lines = [{"method_id": "","method_title": "","total": ""}];
				$scope.selected_shipping = {'id':'','title':'Takeaway','method_title':'','method_description':'','fee':''};
			}
			$scope.ship_select.id = $scope.selected_shipping.id;
			$scope.grand.Shipping = ($scope.selected_shipping.fee=='')?0:parseFloat($scope.selected_shipping.fee);
		
			$scope.sitin_tables.selected = 	Number(order.data.order_meta.sitin_table);

			$scope.formCheckout.shipping_note = order.data.note;
			$scope.grand.Quantity = order.data.total_line_items_quantity;
			$scope.grand.Total = parseFloat(order.data.subtotal);
			
			//Save payment
			$scope.formCheckout.payment_details = order.data.payment_details;
			//$scope.selected_pay = $scope.formCheckout.payment_details;
			if(order.data.fee_lines.length){
				for(var f=0;f<order.data.fee_lines.length;f++){
					if(order.data.fee_lines[f].title == 'Bag charges'){
						$scope.bagCharges.selected = parseFloat(order.data.fee_lines[f].total);
					}else if(order.data.fee_lines[f].title == 'Card charges'){
						$scope.payment_fee = parseFloat(order.data.fee_lines[f].total);
					}
				}
			}else{
				$scope.payment_fee = 0;
				$scope.bagCharges.selected = 0;
			}
			
			if(angular.isDefined($scope.formCheckout.payment_details.method_id)){
				//$scope.payment_select.id = $scope.formCheckout.payment_details.method_id;
				$scope.payment_select.id = '';
				if($scope.formCheckout.payment_details.paid){
					$scope.split_payment = {
						'paid':parseFloat(order.data.total)-$scope.payment_fee,
						'to_pay':0,
						'total':parseFloat(order.data.total)-$scope.payment_fee
					};
					$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'split_payment',$scope.split_payment);
				}
			}else{
				$scope.payment_select.id = '';
			}
			
			$scope.formCheckout.billing_address = order.data.billing_address;
			$scope.formCheckout.customer_id = order.data.customer_id;
			$scope.formCheckout.sameAddress = IsSameAddress(order.data.billing_address,order.data.shipping_address);
			$scope.formCheckout.shipping_address = order.data.shipping_address;
			var docid = order.data.customer.meta.docid;

			if($scope.formCheckout.customer_id != 'guest'){
				var customer = shareData.getCustomer("DOCID",docid);
				if(angular.isDefined(customer._id)){
					$scope.formCheckout.customer_meta = customer.meta;
					$scope.setSelectedCustomer(customer);
				}else if($scope.formCheckout.customer_id){
					$scope.showCheckoutMsg('Warning',"The assigned customer doesn't exist OR your system is out of sync.");
				}
			}
			
			for(var i=0;i<order.data.line_items.length;i++){
				var products = [];
				for (var category in $scope.allProducts) {
					var cat_exists = $filter('filter')($scope.categories,{slug:category},true);
					if(cat_exists.length && !cat_exists[0].children.length && $scope.allProducts.hasOwnProperty(category)){
						var products = $filter('filter')($scope.allProducts[category],{'id': order.data.line_items[i].product_id},true);
						if(products.length){
							break;
						}
					}
				}
				
				var unit_price = parseFloat(order.data.line_items[i].subtotal)/parseInt(order.data.line_items[i].quantity);
				var variation_price = unit_price;
				if(products.length){
					unit_price = unit_price>Number(products[0].price)?Number(products[0].price):unit_price;
				}
				
				
				var product = {
					"id":order.data.line_items[i].product_id,
					"sku": order.data.line_items[i].sku,
					"price": unit_price.toFixed(2),
					"quantity":order.data.line_items[i].quantity,
					"featured_src": "",
					"title": angular.isDefined(order.data.line_items[i].name)?order.data.line_items[i].name:order.data.line_items[i].title,
					"categories": angular.isDefined(order.data.line_items[i].categories)?order.data.line_items[i].categories:[],
					"dept":order.data.line_items[i].dept,
					"group":order.data.line_items[i].group,
					"types": angular.isDefined(order.data.line_items[i].types)?order.data.line_items[i].types:[],
					"attributes":[],
					"notes": angular.isDefined(order.data.line_items[i].notes)?order.data.line_items[i].notes:'',
					"meta":{},
					"edit":false
				};
				if(products.length){
					product.meta = angular.copy(products[0].meta);
				}
				
				if(angular.isDefined(order.data.line_items[i].meta) && order.data.line_items[i].meta.length){
					product.sel_variations = {'attributes':{},'price':variation_price.toFixed(2)};
					for(var j=0;j<order.data.line_items[i].meta.length;j++){
						product.sel_variations.attributes[order.data.line_items[i].meta[j].key] = order.data.line_items[i].meta[j].value;
					}
					product.type = "variable";
				}else if(angular.isDefined(order.data.line_items[i].variations)){
					product.sel_variations = {'attributes':order.data.line_items[i].variations,'price':variation_price.toFixed(2)};
					product.type = "variable";
				}else{
					product.type = "simple";
				}
				
				if(product.type=="variable"&&product.sel_variations.hasOwnProperty("attributes"))
				product.sel_variations["attributestoshow"] = $scope.processDisplay(product.sel_variations.attributes);

				$scope.cartItems.push(product);
				//$scope.getTotal($scope.idSelectedItem.item,$scope.idSelectedItem.index);
			}
			
			var deal_discounts = 0,loyalty_discount = 0,coupon_discount = 0,user_discount = 0;
			if(angular.isDefined(order.data.order_meta.discounts_present)){
				var discountArr = order.data.order_meta.discounts_present.split(";");
				for(var d=0;d<discountArr.length;d++){
					var discountTypeArr = discountArr[d].split('#');
					if(discountTypeArr.length){
						if(discountTypeArr[0] == "C"){
							coupon_discount+= parseFloat(discountTypeArr[1]);
						}else if(discountTypeArr[0] == "D"){
							deal_discounts+= parseFloat(discountTypeArr[1]);
							$scope.deal_btn_clicked = {status:true,apply:true};
						}else if(discountTypeArr[0] == "L"){
							loyalty_discount+= parseFloat(discountTypeArr[1]);
							$scope.cartDiscounts.push({name:'LOYALTY',amount:loyalty_discount});
						}else{
							user_discount+= parseFloat(discountTypeArr[1]);
						}
					}
				}
			}
			
			$scope.getDealDiscount(true);
			
			//get coupon discount
			$scope.formCheckout.coupon_lines = order.data.coupon_lines;
			for (i=0;i<$scope.formCheckout.coupon_lines.length;i++) {
				$scope.formCheckout.coupon_lines[i].type = false;
				$scope.formCheckout.coupon_lines[i].cart = true;
				$scope.formCheckout.coupon_lines[i].rate = parseFloat($scope.formCheckout.coupon_lines[i].amount);
				//$scope.grand.Discount += parseFloat($scope.formCheckout.coupon_lines[i].amount);
			}
			
			//Offer discount
			$scope.grand.Discount += $scope.offer_discount;
			
			//Deal discount
			$scope.grand.Discount += deal_discounts;
			
			//Loyalty discount
			$scope.grand.Discount += loyalty_discount;
			
			//other discounts
			var disc = parseFloat(order.data.total_discount);
			if(disc){
				if(disc-$scope.grand.Discount > 0){
				if(angular.isDefined(order.data.order_meta.discount_pesentage) && !order.data.order_meta.discount_pesentage){
					$scope.cart_discount.percent_click = false;
					$scope.cart_discount.disc_num =order.data.total_discount;
				}else{
					$scope.cart_discount.percent_click = true;
				if(angular.isDefined(order.data.order_meta.discount_value) && order.data.order_meta.discount_value)
					$scope.cart_discount.disc_num = order.data.order_meta.discount_value;
				else
					$scope.cart_discount.disc_num = parseInt(((disc-$scope.grand.Discount)*100)/$scope.grand.Total);
				}
				$scope.cart_discount.disc_total = $scope.cart_discount.disc_num;
			}
			$scope.grand.Discount = disc;
		}
			
			if($scope.cartItems.length){
				$scope.setSelectedItem($scope.cartItems.length-1,$scope.cartItems[$scope.cartItems.length-1]);
				$ionicScrollDelegate.$getByHandle('cartScroll').scrollBottom();
			}
			$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'cart', $scope.cartItems);
			$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'grand', $scope.grand)
			$scope.saveForm();
		}
	}
	
	$scope.shownDetails = null;
	$scope.processOrderOptions = function(order){
		if ($scope.isDetailsShown(order)) {
			$scope.shownDetails = null;
		} else {
			for(var i=0;i<order.data.line_items.length;i++){
				if(angular.isDefined(order.data.line_items[i].variations)){
					order.data.line_items[i].attributestoshow = $scope.processDisplay(order.data.line_items[i].variations);
				}else if(angular.isDefined(order.data.line_items[i].meta)){
					var varoption ={};
					for(var j=0;j<order.data.line_items[i].meta.length;j++){
						var option = order.data.line_items[i].meta[j];
						varoption[option.key] = option.value;
					}
					order.data.line_items[i].attributestoshow = $scope.processDisplay(varoption);
				}
			}
			$scope.shownDetails = order;
		}
	}
	
	$scope.toggleOrderDetails = function(group) {
		if ($scope.isDetailsShown(group)) {
		  $scope.shownDetails = null;
		} else {
		  $scope.shownDetails = group;
		}
	};
	$scope.isDetailsShown = function(group) {
		return $scope.shownDetails === group;
	};
	
	$scope.setSelectedCustomer = function(customer){
		$scope.selected_customer = customer;
	}

	$scope.assignCustomer = function(){
		if($scope.selected_customer == ''){
			return;
		}
		
		var doc_id = $scope.selected_customer._id;
		var customer;
		customer = $scope.selected_customer;
		$scope.formCheckout.billing_address = customer.billing_address;
		$scope.formCheckout.customer_id = customer.id;
		$scope.formCheckout.shipping_address = customer.shipping_address;
		$scope.formCheckout.customer_meta = customer.meta;
		if($scope.loyalty_card.id){
			$scope.aiv_toggles.show_customer_extra = true;
		}else{
			$scope.aiv_toggles.show_customer_extra = false;
			$scope.openCustomerEditModal(true);
		}
		
		$scope.closeModal('CUSTOMER');
		$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'formCheckout', $scope.formCheckout);
	}
	
	$scope.removeUser = function(){
		$scope.formCheckout.billing_address = {
			"first_name": "",
			"last_name": "",
			"address_1": "",
			"address_2": "",
			"city": "",
			"state": "",
			"postcode": "",
			"country": $scope.base_country,
			"email": "",
			"phone": "",
			"company": ""
		};
		$scope.formCheckout.customer_id = "guest";
		$scope.formCheckout.shipping_address = {
			"first_name": "",
			"last_name": "",
			"address_1": "",
			"address_2": "",
			"city": "",
			"state": "",
			"postcode": "",
			"country": $scope.base_country
		};
		$scope.formCheckout.customer_meta = {
			"docid" : "",
			"loyalty_card_id":""
		}
		$scope.formCustomer = {};

		if($scope.selected_shipping.id == 'local_delivery'){
			assignDeliveryCharge($scope.getDeliveryCharge($scope.formCheckout.shipping_address));
		}
		$scope.saveForm();
		$scope.selected_customer = '';
		$scope.resetLoyaltyFields();
	}
	
	$scope.customer_edit_close = false;
	$scope.closeCustomerEdit = function(){
		$scope.customer_edit_close = true;
		$scope.closeModal('CUSTOMER_EDIT');
	}
	
	$scope.saveCustomer = function(form,edit_mode,event,temp=false){
		if($scope.deposit==true)
		{
			open_payment_modal();
		}
		$scope.quickCustomerEnable =true;
		$scope.quickCustomerDisable =true;
		if(!event.currentTarget.className.includes('activated')){
			//Enter key pressed
			return;
		}
		$scope.spinDisabled = false;
		if(!edit_mode || temp){//No changes or temporary address
			if(($scope.startup.action == 'SHIPPING'||$scope.startup.action == 'CALL_ORDER') && $scope.selected_shipping.id == 'local_delivery'){
				$scope.formCustomer.del_charge = $scope.selected_shipping.fee;
				assignDeliveryCharge($scope.selected_shipping.fee);
				//$scope.getDeliveryCharge($scope.formCheckout.shipping_address,true);
			}
			if(temp){
				$scope.formCheckout.billing_address = angular.copy($scope.formCustomer.billing_address);
				$scope.formCheckout.shipping_address = $scope.formCustomer.sameAddress?angular.copy($scope.formCustomer.billing_address):angular.copy($scope.formCustomer.shipping_address);
			}
			if($scope.selected_customer && $scope.selected_customer.meta.loyalty_card_id){
				$scope.LoyaltyCardCheck($scope.selected_customer.billing_address.phone);
			}
			$scope.closeModal('CUSTOMER_EDIT');
		}else if (form.$valid) {
			if($scope.formCustomer.billing_address.phone.length<=10){
				$scope.formCustomer.billing_address.phone = "0"+$scope.formCustomer.billing_address.phone;
			}else{
				$scope.formCustomer.billing_address.phone = "0"+$scope.formCustomer.billing_address.phone.substr(-10);
			}
			if($scope.formCustomer.billing_address.first_name == ''){//Set phone number as first name
				$scope.formCustomer.billing_address.first_name = $scope.formCustomer.billing_address.phone;
			}
			if($scope.formCustomer.billing_address.email == ''){//Generate dummy email
				var d = new Date();
				$scope.formCustomer.billing_address.email = 'dummy'+d.getTime()+'@example.com';
			}
			/*$scope.errors.customer_edit = '';
			if(angular.isArray($scope.formCheckout.shipping_lines) && $scope.formCheckout.shipping_lines.length && $scope.formCheckout.shipping_lines[0].method_id == 'local_delivery'){
				if(!$scope.formCustomer.shipping_address.postcode){
					if($scope.delivery_areas.areas.length){
						$scope.errors.customer_edit = "Please enter a valid delivery area for customer";
					}else{
						$scope.errors.customer_edit = "Please enter a valid post code for customer";
					}
					$ionicScrollDelegate.$getByHandle('customer_edit_Scroll').scrollTop();
					$scope.spinDisabled = true;
					return;
				}
			}*/
			if($scope.startup.action == 'SHIPPING'||$scope.startup.action == 'CALL_ORDER'){
				$scope.actionShipping();
				var del_charge = !$scope.formCustomer.del_charge?0:$scope.formCustomer.del_charge;
			}
			
			$scope.spinDisabled = true;
			var now_date = new Date().toISOString();
			var next_seq = $scope.terminalData.last_customer_seq?(parseInt($scope.terminalData.last_customer_seq)+1):1;
			var docid = "customer_"+$scope.terminalData.prefix+new Date().toISOString();
			var new_customer = {
			   "_id": docid,
			   "id": 'new',
			   "created_at": now_date,
			   "email": $scope.formCustomer.billing_address.email,
			   "first_name": $scope.formCustomer.billing_address.first_name,
			   "last_name": $scope.formCustomer.billing_address.last_name,
			   "username": "",
			   "role": "customer",
			   "last_order_id": "",
			   "last_order_date": "",
			   "orders_count": 0,
			   "total_spent": "",
			   "avatar_url": "",
			   "billing_address": $scope.formCustomer.billing_address,
			   "shipping_address": $scope.formCustomer.sameAddress?$scope.formCustomer.billing_address:$scope.formCustomer.shipping_address,
			   "meta":{
					"loyalty_card_id":$scope.formCustomer.billing_address.phone,
					"points_to_unlock":0,
					"points_to_redeem":0,
					"redeem_amount":0,
					"total_used_points":0,
					"current_redeem_points":0,
					"reward_coupon":"",
					"reward_type":"MONEY",
					"redeem_status":"TRUE",
					"docid":docid,
					"shop_id":$rootScope.aiv_info.shop_id
			    },
				"action":"NO_ACTION"
			}
			$scope.closeModal('CUSTOMER_EDIT');
			$ionicLoading.show({
				template: '<ion-spinner icon="ios"></ion-spinner><br><span class="aiv-loading">Saving customer details<br>Please wait...</span>',
				animation: 'fade-in',
				showBackdrop: true,
				maxWidth: 300,
				showDelay: 0
			});

			if($scope.cutomer_edit){//Edit customer doc
				docid = ($scope.startup.action == 'SHIPPING'||$scope.startup.action == 'CALL_ORDER')?$scope.formCheckout.customer_meta.docid:$scope.selected_customer.meta.docid;
				if(!$scope.selected_customer){
					var exists = shareData.getCustomer("DOCID",docid);
					if(angular.isDefined(exists._id)){
						$scope.setSelectedCustomer(exists);
					}
				}
				if($scope.selected_customer && $scope.selected_customer.meta.loyalty_card_id){
					$scope.LoyaltyCardCheck($scope.selected_customer.billing_address.phone);
				}
				var edit_cust = null;
				edit_cust = $scope.selected_customer;
				edit_cust.email = new_customer.email;
				edit_cust.first_name = new_customer.first_name;
				edit_cust.last_name = new_customer.last_name;
				edit_cust.billing_address = new_customer.billing_address;
				edit_cust.shipping_address = new_customer.shipping_address;
				//edit_cust.meta = edit_cust.meta;
				edit_cust.meta.docid = docid;
				
				if(!$scope.old_loyalt_card_id){
					edit_cust.meta = new_customer.meta;
					edit_cust.action = "LOY_CUST_CREATE";
				}else if($scope.old_loyalt_card_id != new_customer.meta.loyalty_card_id){
					//Update loyalty card
					console.log("Update loyalty card");
					edit_cust.action = "LOY_CUST_UPDATE";
				}else{
					//Update customer info
					edit_cust.action = "WOO_CUST_UPDATE";
				}

				$pouchDB.upsert(edit_cust._id,function(doc){
					if(doc != undefined){
						doc.email = edit_cust.email;
						doc.first_name = edit_cust.first_name;
						doc.last_name = edit_cust.last_name;
						doc.billing_address = edit_cust.billing_address;
						doc.shipping_address = edit_cust.shipping_address;
						doc.meta = edit_cust.meta;
						doc.action = edit_cust.action;
					}
					return doc;
				}).then(function(returnData) {
					if($scope.startup.action == 'SHIPPING'||$scope.startup.action == 'CALL_ORDER'){
						//$scope.updateCustomerList(edit_cust);
						$scope.formCheckout.customer_id = $scope.formCustomer.customer_id;
						$scope.formCheckout.billing_address = angular.copy($scope.formCustomer.billing_address);
						$scope.formCheckout.shipping_address = angular.copy($scope.formCustomer.shipping_address);
						$scope.formCheckout.sameAddress = $scope.formCustomer.sameAddress;
						$scope.formCheckout.customer_meta = angular.copy($scope.selected_customer.meta);
						$scope.saveForm();
						if($scope.selected_shipping.id == 'local_delivery'){
							assignDeliveryCharge(del_charge);
							//$scope.getDeliveryCharge($scope.formCheckout.shipping_address,true);
						}
					}
					$ionicLoading.hide();
				}).catch(function(error){
					$scope.showCheckoutMsg('Error','Failed to save customer details...');
					$ionicLoading.hide();
					console.error(error);
				});
			}else{//New customer
				var exists = shareData.getCustomer("PHONE",new_customer.billing_address.phone);
				if(angular.isDefined(exists._id)){
					//Customer exists
					$scope.showCheckoutMsg('Error','A customer with this phone number already exists...');
					$ionicLoading.hide();
				}else{
					if(new_customer.meta.loyalty_card_id){
						new_customer.meta.points_to_unlock = $scope.loyalty_card.reward_points+Number($scope.hf_loyalty.signup_points);
						new_customer.meta.points_to_redeem = 0;
						new_customer.action = "LOY_CUST_CREATE";
					}
					$pouchDB.save(new_customer).then(function(ret) {
						if(ret != undefined){
							//$scope.updateCustomerList(new_customer);
							$scope.setSelectedCustomer(new_customer);
							console.log("Customer created and assigned");
							if($scope.startup.action == 'SHIPPING'||$scope.startup.action == 'CALL_ORDER'){
								$scope.formCheckout.customer_id = new_customer.id;
								$scope.formCheckout.billing_address = angular.copy(new_customer.billing_address);
								$scope.formCheckout.shipping_address = angular.copy(new_customer.shipping_address);
								$scope.formCheckout.sameAddress = $scope.formCustomer.sameAddress;
								$scope.formCheckout.customer_meta = angular.copy($scope.selected_customer.meta);
								$scope.formCheckout.customer_meta.docid = docid;
								$scope.saveForm();
								if($scope.selected_shipping.id == 'local_delivery'){
									assignDeliveryCharge(del_charge);
									//$scope.getDeliveryCharge($scope.formCheckout.shipping_address,true);
								}
							}
							$ionicLoading.hide();
							return $pouchDB.upsert($scope.terminalData._id,function(doc){
								if(angular.isDefined(doc._id)){
									doc.last_customer_seq = next_seq;
								}
								return doc;
							});
						}else{
							$ionicLoading.hide();
						}
					}).catch(function(error){
						$scope.showCheckoutMsg('Error','Failed to create customer...');
						$ionicLoading.hide();
						console.error(error);
					});
				}
			}
			
		} else {
            console.log('Form is not Valid');
            $scope.formNotValid = true;
			$timeout(function() {$scope.formNotValid = false;},2000);
			$scope.spinDisabled = true;
            $ionicScrollDelegate.$getByHandle('customer_edit_Scroll').scrollTop();
        }
		if($scope.pay_modal != undefined && $scope.pay_modal._isShown){
			$scope.setKeyInput('PAYMENT',$scope.payment_select.amount);
		}
		$scope.getDepositData();
	}
	
	$scope.saveNote = function(){
		if($scope.note_type == 'ORDER'){
			$scope.formCheckout.shipping_note = $scope.order_note.note;
			$scope.saveForm();
		}else if($scope.note_type == 'PRODUCT'){
			if($scope.idSelectedItem.index < $scope.cartItems.length){
				$scope.cartItems[$scope.idSelectedItem.index].notes = $scope.order_note.note;
			}
		}
		$scope.closeModal('ORDER_NOTE');
	}
	
	$scope.sanitizeOptions = function(item){
		var opt_name = item.name;
		var optArr = item.name.split('_');
		if(optArr.length > 1){
			item.name = optArr[0];
		}
		
		return item;
	}
	
	$scope.updateVariationInfo = function(option_select,selectedItem){

		

		var attribute_name = selectedItem.slug;
		var itemSplit = option_select.split(AIV_CONSTANTS.OPTION_SEPARATOR);
		if(itemSplit.length > 0){
			option_select = itemSplit[0];
		}
		
		var i=1,found = true,opt_name = attribute_name;
		while(found){
			found = false;
			angular.forEach($scope.current_options,function(value,key){
				if ($scope.current_options.hasOwnProperty(opt_name)) {
					opt_name = attribute_name;
					opt_name+=i;
					i++;
					found = true;
				}
			});
		}
		
		$scope.current_options[ opt_name ] = option_select+$scope.selected_attr_add+"###T";

		//var option_name = 
		//$scope.current_display_options[ option_name ] = option_select+$scope.selected_attr_add;

		$scope.sel_variations = {};
		$scope.sel_product_price = get_product_price($scope.sel_product,false);
		$scope.filterUnique($scope.current_options);
		$scope.current_display_options= $scope.processDisplay($scope.current_options);
		
		
		
		
		
		angular.forEach($scope.current_options,function(value,key){
			if ($scope.current_options.hasOwnProperty(key)) {
				var opt = $scope.current_options[key];
				var value = opt.match(/\(([^)]+)\)/);
				if(value != null && value.length > 1){
					value[1] = value[1].replace(/[£+]/g,"");
					$scope.sel_product_price+= $scope.parseFloatNoNaN(value[1]);
				}
				
			 }
		});

		$scope.sel_variations.attributes = $scope.current_options;
		//$scope.sel_variations.attributestoshow = $scope.current_display_options;

		//console.log(product.productOptions);
		$scope.sel_variations.price = parseFloat($scope.sel_product_price.toFixed(2));

	};

	$scope.filterFree= function(options,freecount)
	{
		var iteration =0;
		angular.forEach(options,function(value,key){
		
			if(value.substring(0,2).includes("No")||value.substring(0,2).includes("no"))
			{
			}
			else
			{
				if(iteration<freecount)
				{
					//remove price 
					opt=options[key];
					var value = opt.match(/\(([^)]+)\)/);
					
					if(value!=null)
					{
					opt = opt.replace(value[0],'');
					options[key]=opt;
					}
				}
			
				iteration++;
			}
			
		});
	}
	$scope.filterUnique = function(options){
	
		var expensive=0;
		var expensive_key="";
	
		angular.forEach(options,function(value,key){
		
			if (options.hasOwnProperty(key)) {
				var itemSplit = key.split(AIV_CONSTANTS.OPTION_SEPARATOR);
				if(itemSplit.length > 0){
					options_string = itemSplit[1];
					if(options_string.includes('U'))
					{
						var opt = options[key];
						var value = opt.match(/\(([^)]+)\)/);
						if(value != null && value.length > 1){
							value[1] = value[1].replace(/[£+]/g,"");
							var current_price = parseFloat(value[1]);
							if(expensive >current_price)
							{
								//remove price from current ke
								opt=options[key];
								value = opt.match(/\(([^)]+)\)/);
								opt = opt.replace(value[0],'');
								options[key]=opt;
							}
							else if(expensive_key!="")
							{
								//remove price from previous key
								opt=options[expensive_key];
								value = opt.match(/\(([^)]+)\)/);
								opt = opt.replace(value[0],'');
								options[expensive_key]=opt;
								
								expensive = current_price;
								expensive_key = key;
								
							}else if(expensive_key=="")
							{
								expensive = current_price;
								expensive_key = key;
							}
						}
					}
				}
			}
		
		
			
		});
	
	
	}

	$scope.setCookingInstructions = function(option_select){

		

		if($scope.current_options==null)
		{
			$scope.current_options={};

		}
		var attribute_name = "KI###PH";
		var i=1,found = true,opt_name = attribute_name;
		while(found){
			found = false;
			angular.forEach($scope.current_options,function(value,key){
				if ($scope.current_options.hasOwnProperty(opt_name)) {
					opt_name = attribute_name;
					opt_name+=i;
					i++;
					found = true;
				}
			});
		}
		
		$scope.current_options[ opt_name ] = option_select+"###T";

		//var option_name = 
		//$scope.current_display_options[ option_name ] = option_select+$scope.selected_attr_add;

		$scope.sel_variations = {};
		$scope.sel_product_price = get_product_price($scope.sel_product,false);
		$scope.current_display_options= $scope.processDisplay($scope.current_options);
		
		angular.forEach($scope.current_options,function(value,key){
			if ($scope.current_options.hasOwnProperty(key)) {
				var opt = $scope.current_options[key];
				var value = opt.match(/\(([^)]+)\)/);
				if(value != null && value.length > 1){
					value[1] = value[1].replace(/[£+]/g,"");
					$scope.sel_product_price+= $scope.parseFloatNoNaN(value[1]);
				}
				
			 }
		});

		$scope.sel_variations.attributes = $scope.current_options;
		//$scope.sel_variations.attributestoshow = $scope.current_display_options;

		//console.log(product.productOptions);
		$scope.sel_variations.price = parseFloat($scope.sel_product_price.toFixed(2));

	};

	$scope.moveUpOption=function(){
		var previousKey=null;
		var cont = false;
		angular.forEach($scope.current_display_options,function(value,key){

			if(cont==false)
			{
				if($scope.selectattrwindow==key)
				{
					if(previousKey!=null)
					$scope.selectattrwindow = previousKey;
					cont=true;
				}
				previousKey = key;
			}

		});
	}

	$scope.removeOptionAttribute=function(){
		 var deleteentry = $scope.selectattrwindow;
		 $scope.moveDownOption();

		 if(deleteentry==$scope.selectattrwindow)
		  $scope.moveUpOption();

		  //find position of key in current_display_options
		  //find key of that postion in  current options
		  //var position = Object.keys(current_display_options).indexOf(deleteentry);
		 delete $scope.current_options[$scope.display_options_tooptions[deleteentry]];
		  
		 delete $scope.current_display_options[deleteentry];
 
		$scope.sel_product_price = get_product_price($scope.sel_product,false);

		 angular.forEach($scope.current_options,function(value,key){
			if ($scope.current_options.hasOwnProperty(key)) {
				var opt = $scope.current_options[key];
				var value = opt.match(/\(([^)]+)\)/);
				if(value != null && value.length > 1){
					value[1] = value[1].replace(/[£+]/g,"");
				$scope.sel_product_price+= $scope.parseFloatNoNaN(value[1]);
				}
				
			 }
		});

		$scope.sel_variations.price = parseFloat($scope.sel_product_price.toFixed(2));
		// delete $scope.current_display_options[deleteentry];
	}

	$scope.moveDownOption=function(){

		var quitonnext=false;
		var cont = false;
		angular.forEach($scope.current_display_options,function(value,key){

				if(cont==false)
				{
				if(quitonnext==true)
				{
					$scope.selectattrwindow = key;
					cont = true;
				}
				if($scope.selectattrwindow==key)
				{
					
					quitonnext=true;
				}
				}
				

		});
	}
	
	
	$scope.isDefault = function(attribute,attr,freelimit,item){
			var itemname = attribute;
			var params = attribute.split(AIV_CONSTANTS.OPTION_SEPARATOR)[1];
			
			if(params.includes('F')&&freelimit==0)
			{
				if(attr=='No'||attr=='no'||attr=='NOP')
				{
					//reverse price
					var price =0;
					var priceval = attribute.match(/\(([^)]+)\)/);
					
					if(priceval != null && priceval.length > 1){
						priceval[1] = priceval[1].replace(/[£+]/g,"");
						price= parseFloat(priceval[1]);
						itemname=attribute.replace(priceval[0], '');
						if(item.hasOwnProperty("compensation"))
						item.compensation += price;
						else
						{
						item["compensation"] = price;
						}
					}
					else
					{
						itemname=attribute;
					}
				}
				else if(attr=='Extra'||attr=='extra')
				{
					//do nothing let it have the price even if default.
				}
				else {
				
					if(freelimit==0)
					{
				
						var price =0;
						var priceval = attribute.match(/\(([^)]+)\)/);
						
						if(priceval != null && priceval.length > 1){
							priceval[1] = priceval[1].replace(/[£+]/g,"");
							price= parseFloat(priceval[1]);
							itemname=attribute.replace(priceval[0], '');
						}
						else
						{
							itemname=attribute;
						}
					}
				}
			}
			else
			{
				if(attr=='No'||attr=='no'||attr=='NOP')
				{
					//null price
					var price =0;
					var priceval = attribute.match(/\(([^)]+)\)/);
					
					if(priceval != null && priceval.length > 1){
						priceval[1] = priceval[1].replace(/[£+]/g,"");
						price= parseFloat(priceval[1]);
						itemname=attribute.replace(priceval[0], '');
					}
					else
					{
						itemname=attribute;
					}
				}
				else if(item.hasOwnProperty("compensation")&&item.compensation>0)
				{
					var price =0;
					var priceval = attribute.match(/\(([^)]+)\)/);
					
					if(priceval != null && priceval.length > 1){
						priceval[1] = priceval[1].replace(/[£+]/g,"");
						price= parseFloat(priceval[1]);
						
						if(price>=item.compensation)
						{
							price = price - item.compensation;
							item.compensation=0;
						}
						else
						{
							item.compensation = item.compensation- price;
							price = 0;
						}
						
						itemname=attribute.replace(priceval[0], '(+'+price+')');
					}
					else
					{
						itemname=attribute;
					}		
				
				}
			}
			
			
			
			if(attr=='On'||attr=='on')
			{
				//null price
				var price =0;
				var priceval = attribute.match(/\(([^)]+)\)/);
				
				if(priceval != null && priceval.length > 1){
					priceval[1] = priceval[1].replace(/[£+]/g,"");
					price= parseFloat(priceval[1]);
					itemname=attribute.replace(priceval[0], '');
				}
				else
				{
					itemname=attribute;
				}
			}

			return itemname;
	}
	
	$scope.parseFloatNoNaN = function(value){
		price= parseFloat(value);
		if(isNaN(price))
		{
			price = 0;
		}
		
		return price;
	}

	$scope.getShowName = function(attribute){
			var itemname = attribute;
		
			
				var price =0;
				var priceval = attribute.match(/\(([^)]+)\)/);
				
				if(priceval != null && priceval.length > 1){
					priceval[1] = priceval[1].replace(/[£+]/g,"");
					price= parseFloat(priceval[1]);
					itemname=attribute.replace(priceval[0], '');
				}
				else
				{
					itemname=attribute;
				}

			return itemname;
	}

	$scope.processDisplayLink= function(attributes,variations){
	var display_options={};
	variations['attributesLink']={};
		angular.forEach(attributes,function(value,key){
			var linkvalue = key;
			var partSplit = key.split(AIV_CONSTANTS.OPTION_SEPARATOR);
			var valSplit = value.split(AIV_CONSTANTS.OPTION_SEPARATOR);
			var fstring="";
			var lastaddedOption="";
			if(partSplit.length > 1){
				var price =0;
				var priceval = value.match(/\(([^)]+)\)/);
				var itemname = "";
				if(priceval != null && priceval.length > 1){
					priceval[1] = priceval[1].replace(/[£+]/g,"");
					price= $scope.parseFloatNoNaN(priceval[1]);
					
					itemname=value.replace(priceval[0], '');
				}
				else
				{
					itemname=value;
				}
				
				
				

				if(partSplit[1].includes('H'))
				{
					fstring = itemname;
				}
				else
				{
					fstring = partSplit[0]+':'+itemname;
				}
				
				if(valSplit.length > 1 && valSplit[1].includes('H'))
				{
					price =0;
				}
				



				var i=1,found = true,opt_name=fstring;
					while(found){
						found = false;
						angular.forEach(display_options,function(value,key){
							if (display_options.hasOwnProperty(opt_name)) {
								opt_name = fstring;
								opt_name+='###'+i;
								i++;
								found = true;
							}
						});
					}
				fstring = opt_name;



				//var str = itemSplit[0]+' '+item;
				//extract price and forma another key value pair to display.
				console.log(fstring+"-"+price);
				display_options[fstring]=price;
				variations.attributesLink[fstring]=linkvalue;
				lastaddedOption = fstring;
			}

			$scope.selectattrwindow = lastaddedOption;
		});

		return display_options;
	
	}

	$scope.processDisplay = function(attributes){
		var display_options={};
		angular.forEach(attributes,function(value,key){
			var linkvalue = key;
			var partSplit = key.split(AIV_CONSTANTS.OPTION_SEPARATOR);
			var valSplit = value.split(AIV_CONSTANTS.OPTION_SEPARATOR);
			var fstring="";
			var lastaddedOption="";
			if(partSplit.length > 1){
				var price =0;
				var priceval = value.match(/\(([^)]+)\)/);
				var itemname = "";
				if(priceval != null && priceval.length > 1){
					price= parseFloat(priceval[1]);
					itemname=value.replace(priceval[0], '');
				}
				else
				{
					itemname=value;
				}
				
				
				

				if(partSplit[1].includes('H'))
				{
					fstring = itemname;
				}
				else
				{
					fstring = partSplit[0]+':'+itemname;
				}
				
				if(valSplit.length > 1 && valSplit[1].includes('H'))
				{
					price =0;
				}



				var i=1,found = true,opt_name=fstring;
					while(found){
						found = false;
						angular.forEach(display_options,function(value,key){
							if (display_options.hasOwnProperty(opt_name)) {
								opt_name = fstring;
								opt_name+='###'+i;
								i++;
								found = true;
							}
						});
					}
				fstring = opt_name;



				//var str = itemSplit[0]+' '+item;
				//extract price and forma another key value pair to display.
				console.log(fstring+"-"+price);
				display_options[fstring]=price;
				$scope.display_options_tooptions[fstring]=linkvalue;
				lastaddedOption = fstring;
			}

			$scope.selectattrwindow = lastaddedOption;
		});

		return display_options;
	}
	$scope.selectattrwindow='';
	$scope.sel_option = {};
	$scope.selected_attr={};
	$scope.selected_attr_add="";
	$scope.setAttributeOptions = function(item){
		var itemSplit = item.name.split(AIV_CONSTANTS.OPTION_SEPARATOR);
		if(itemSplit.length > 0){
			item.name = itemSplit[0];
		}
		$scope.sel_option = item;


		if($scope.sel_option!=null)
		{
			var exits = false;
			$scope.selected_attr_add='';
			for (var property in $scope.sel_option.linked ) {
				//$scope.objectHeaders.push(property); 
				$scope.selected_attr = $scope.sel_option.linked[property][0];
				key = property;
				exits = true;
				
			}
			
			if(!exits){
				$scope.selected_attr = '';
			}
			else
			{
			
			if(key != undefined && $scope.selected_attr != undefined){
				$scope.updateAttributeOptions(key,$scope.selected_attr,$scope.sel_option.name);
			}
			}
		}

		
	}
	
	$scope.updateAttributeOptions = function(part,item,attribute_name){
		$scope.selected_attr = item;
		var itemSplit = item.split(AIV_CONSTANTS.OPTION_SEPARATOR);
		if(itemSplit.length > 0){
			item = itemSplit[0];
		}
		var partSplit = part.split(AIV_CONSTANTS.OPTION_SEPARATOR);
		if(partSplit.length > 0){
			if(partSplit[1].includes('H'))
			{
				$scope.selected_attr_add =  item;
			}
			else
			{
				$scope.selected_attr_add = partSplit[0]+' '+item;;
			}

			//var str = itemSplit[0]+' '+item;
			
		}

		
		
		/*var opt_value = $scope.current_options[ attribute_name ];
		var checkArr = opt_value.split(part);
		if(checkArr.length > 1){
			opt_value = checkArr[0] + str;
		}else{
			opt_value+=' '+str;
		}
		$scope.current_options[ attribute_name ] = opt_value;
		$scope.sel_variations.attributes = $scope.current_options;*/
	}
	
	$ionicModal.fromTemplateUrl('detail-modal.html', {
        scope: $scope,
        animation: 'none'
    }).then(function(modal) {
        $scope.detail_modal = modal;
    });
    $scope.openDetails = function(product) {
        $scope.currentProduct = product;
        $scope.detail_modal.show();
    };
    $scope.closeDetails = function() {
        $scope.detail_modal.hide();
    };
	
	//Cleanup the modal when we're done with it!
	$scope.$on('$destroy', function() {
		if(angular.isDefined($scope.detail_modal)){
			$scope.detail_modal.remove();
		}
		if(angular.isDefined($scope.report_modal)){
			$scope.report_modal.remove();
		}
		if(angular.isDefined($scope.ad_modal)){
			$scope.ad_modal.remove();
		}
		if(angular.isDefined($scope.cashflow_modal)){
			$scope.cashflow_modal.remove();
		}
		if(angular.isDefined($scope.outofstock_modal)){
			$scope.outofstock_modal.remove();
		}
		if(angular.isDefined($scope.cust_list_modal)){
			$scope.cust_list_modal.remove();
		}
		
		if(angular.isDefined($scope.keypad_popover)){
			$scope.keypad_popover.remove();
		}
		//if(angular.isDefined($scope.phone_popover)){
		//	$scope.phone_popover.remove();
		//}
		if(angular.isDefined($scope.dropdown_popover)){
			$scope.dropdown_popover.remove();
		}
		if(angular.isDefined($scope.kitchen_dropdown)){
			$scope.kitchen_dropdown.remove();
		}
		$scope.stopOnlineOrderInterval();
	});
	
	// Execute action on hide modal
	$scope.$on('modal.hidden', function() {
		// Execute action
		$scope.sel_variations = {};
		$scope.sel_option = {};
		$scope.selected_attr={};
		$scope.selected_attr_add="";
		
	});
	
	// Execute action on remove modal
	$scope.$on('modal.removed', function() {
		// Execute action
		$scope.sel_variations = {};
		$scope.sel_option = {};
		$scope.selected_attr={};
		$scope.selected_attr_add="";
	});
	
	$scope.Coupons = $localstorage.getObject(AIV_CONSTANTS.LS_PREFIX+'Coupons');
	$scope.Coupons.coupons=[];
	$scope.coupon = { code : '',err: '' };
	$scope.voucher = { code : '',err: '',amt:''};
	$scope.statcVoucher =[5,10,15,20,25];
					
	$scope.addCoupon = function() {
		$scope.coupon.err = '';
		$scope.success_done.coupon_applied = '';
		if($scope.coupon.code.substr($scope.coupon.code.length - 1) == "w"){
			$scope.coupon.err = "This coupon is applicable only for orders from website";
			return;
		}

		$ionicLoading.show({
			template: '<ion-spinner icon="ios"></ion-spinner><br><span class="aiv-loading">Looking for Coupon details.<br>Please wait... OR Click cancel</span><button ng-click="abortRequest()" class="button button-full button-assertive">Cancel</button>',
			animation: 'fade-in',
			showBackdrop: true,
			maxWidth: 300,
			showDelay: 0,
			scope: $scope
		});
		//Validate coupon code
		$scope.httpRequest = dataService.validateCoupon($scope.cartItems, $scope.coupon.code, $scope.grand,$scope.coupon_lines);
		$scope.httpRequest.then(function(returnData) {
			console.log(returnData.Coupon);
			$ionicLoading.hide();
			if(returnData.Success){
				var percent_type = false;
				var cart_type = false;
				if(returnData.Coupon.discount_type == "percent" || returnData.Coupon.discount_type == "percent_product" ){
					percent_type = true;
				}
				
				if(returnData.Coupon.discount_type == "percent" || returnData.Coupon.discount_type == "fixed_cart" ){
					cart_type = true;
				}
				$scope.coupon_lines.push({
					"code" : returnData.Coupon.code,
					"type" : percent_type,
					"cart" : cart_type,
					"rate" : returnData.Coupon.coupon_amount,
					"amount" : returnData.Coupon.coupon_amount
				})
				//$localstorage.setObject('formCheckout', $scope.formCheckout);
				//$scope.getDiscount();
				$scope.success_done.coupon_applied = returnData.Message;
			}else{
				$scope.coupon.err = returnData.Message;
			}
		}).catch(function(err){
			var msg = '';
			if(!err){
				$scope.coupon.err = "No internet connection!!!";
			}else if(angular.isDefined(err.error)){
				if(err.error == "timeout"){
					$scope.coupon.err = "Failed to get coupon due to slow internet connection";
				}else{
					$scope.coupon.err = "Failed to get coupon.Request aborted!!!";
				}
			}else{
				$scope.coupon.err = "Failed to get coupon";
			}

			$ionicLoading.hide();
			
		})
	}
	$scope.addVoucher =function(amt){
		if(amt =='FIXED'){
			if($scope.getGlobelVoucher.length){
				for(var i=0;i<$scope.getGlobelVoucher.length;i++){
					if($scope.voucher.code ==$scope.getGlobelVoucher[i].code){
						$scope.voucher.amt =$scope.getGlobelVoucher[i].amt;
				/* 			fee_lines.push({
						   "id":"",
						   "title": "Voucher",
						   "tax_class": "",
						   "total": "-"$scope.voucher.amt,
						   "total_tax": "0.00"
						}) */
						$scope.coupon_lines.push({
						"code" : 'VOUCHER',
						"type" : false,
						"cart" : true,
						"rate" : $scope.voucher.amt,
						"amount" : $scope.voucher.amt
						}) 
					}else{
						$scope.voucher.err = "Please enter a valid coupon code";
					}
				}
			}else{
				$scope.voucher.err = "Shop voucher is empty";
			}
		}else{
			
			$scope.coupon_lines.push({
				"code" : 'VOUCHER',
				"type" : false,
				"cart" : true,
				"rate" : amt,
				"amount" :amt
			}) 
		}
	}
	
	$scope.removeCoupon = function(index,coupon){
		$scope.coupon_lines.splice(index, 1);
		//$localstorage.setObject('formCheckout', $scope.formCheckout);
		//$scope.getDiscount();
	}
	
	$scope.PaymentMethods = $localstorage.getArray(AIV_CONSTANTS.LS_PREFIX+'PaymentMethods');
	$scope.savePayment = function(item) {
		if(item.id =='voucher'){
			$scope.disable_finish =true;
			$scope.setKeyInput('VOUCHERCODE',$scope.voucher_code_area);
		}else{
			$scope.setKeyInput('PAYMENT',$scope.payment_select.amount);
		}
		if(item.id != 'cod'){
			$scope.payment_select.delivery = false;
		}
		if(item.id == 'card'){
			$scope.disable_finish=false;
		}else{
			if(parseFloat($scope.payment_select.amount)< parseFloat($scope.grand.Total))
			{
						$scope.disable_finish=true;
			}
		}
		if($scope.online_processing){
			$scope.online_order.data.payment_details.method_id = item.id;
			$scope.online_order.data.payment_details.method_title = item.method_title;
			if($scope.online_order.data.payment_details.method_id == 'cod' && $scope.payment_select.delivery){
				$scope.online_order.data.payment_details.paid = false;
			}else{
				$scope.online_order.data.payment_details.paid = true;
			}
		}else{
			$scope.formCheckout.payment_details.method_title = item.method_title;
			$scope.formCheckout.payment_details.method_id = item.id;
			$scope.saveForm();
		}
		
		$scope.selected_pay = item;
		
		if(angular.isDefined(item.fee)){
			$scope.payment_fee = $scope.parseFloatNoNaN(item.fee);
		}else{
			$scope.payment_fee = 0;
		}
		
		$scope.payment_select.err = '';
	}
	
	// Saving each Key Stroke into localStorage
    $scope.saveForm = function() {
        $localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'formCheckout', $scope.formCheckout)
    }
	
	$scope.ShippingMethods = $localstorage.getObject(AIV_CONSTANTS.LS_PREFIX+'ShippingMethods');
	$scope.ship_select = {id : null,err : '',amount:''};
	$scope.shipping_methods = [];
	$scope.getDeliveryCharge = function(address){
		var del_charge = 0;
		angular.forEach($scope.ShippingMethods, function(item) {
			var flag = false;
			if(item.id=='local_delivery'){
				if((address.postcode != '' || (address.state != ''&&$scope.delivery_areas.areas.length))){
					var postcodes = [];
					if(angular.isDefined(item.pos_codes) && item.pos_codes.length > 0){
						postcodes = item.pos_codes;
					}else if(angular.isDefined(item.codes) && item.codes.length > 0){
						postcodes = item.codes;
					}
				
					if(postcodes.length){
						var post_up = $scope.delivery_areas.areas.length?address.state:address.postcode.toUpperCase();//.replace(' ','');
						var post_main = $scope.delivery_areas.areas.length?post_up:post_up.slice(0,-3).trim();//post_up.split(' ');
						for(var i=0;i<postcodes.length;i++){
							//var post_up = post_str.toUpperCase();
							for(var j=0;j<postcodes[i].zip.length;j++){
								var zip_main = postcodes[i].zip[j].split(' ');
								//if(post_up.indexOf(postcodes[i].zip[j]) == 0){
								//if(post_main == zip_main[0] && post_up.substr(0,postcodes[i].zip[j].length) == postcodes[i].zip[j]){
								if(post_main == zip_main[0] && post_up.replace(' ','').substr(0,item.codes[i].zip[j].replace(' ','').length) == item.codes[i].zip[j].replace(' ','')){
									//item.fee = postcodes[i].amount;
									del_charge = postcodes[i].amount;
									flag = true;
									break;
								}
							}
							if(flag){
								break;
							}
						}
					}
				}
				
				if(!flag){
					//Default shipping charge
					del_charge = item.fee;
				}
			}
		});
		
		return del_charge;
	}
	
	var assignDeliveryCharge = function(del_charge){
		$scope.selected_shipping.fee = del_charge;
		$scope.grand.Shipping = ($scope.selected_shipping.fee=='')?0:parseFloat($scope.selected_shipping.fee);
		$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'grand', $scope.grand)
		$scope.ship_select.err = '';
		if(angular.isArray($scope.formCheckout.shipping_lines) && $scope.formCheckout.shipping_lines.length && $scope.formCheckout.shipping_lines[0].method_id){
			$scope.formCheckout.shipping_lines[0].total = $scope.selected_shipping.fee;
			$scope.saveForm();
		}
	}

	$scope.checkDeliveryArea = function(address){
		var flag = false;
		var zipArr = [];
		angular.forEach($scope.ShippingMethods, function(item) {
			flag = false;
			var postcodes = [];
			if(angular.isDefined(item.pos_codes) && item.pos_codes.length > 0){
				postcodes = item.pos_codes;
			}else if(angular.isDefined(item.codes) && item.codes.length > 0){
				postcodes = item.codes;
			}
			
			if(postcodes.length){
				var post_up = address.postcode.toUpperCase();//.replace(' ','');
				var post_up = $scope.delivery_areas.areas.length?address.state:address.postcode.toUpperCase();//.replace(' ','');
				var post_main = $scope.delivery_areas.areas.length?post_up:post_up.slice(0,-3).trim();//post_up.split(' ');
				for(var i=0;i<postcodes.length;i++){
					zipArr.push( postcodes[i].areas );
					//var post_up = post_str.toUpperCase();
					for(var j=0;j<postcodes[i].zip.length;j++){
						var zip_main = postcodes[i].zip[j].split(' ');
						//if(post_up.indexOf(postcodes[i].zip[j]) == 0){
						//if(post_main == zip_main[0] && post_up.substr(0,postcodes[i].zip[j].length) == postcodes[i].zip[j]){
						if(post_main == zip_main[0] && post_up.replace(' ','').substr(0,item.codes[i].zip[j].replace(' ','').length) == item.codes[i].zip[j].replace(' ','')){
							flag = true;
							break;
						}
					}
					if(flag){
						break;
					}
				}
			}else flag = true;
		});
		
		if(!flag){
			if($scope.delivery_areas.areas.length){
				$scope.showCheckoutMsg('Warning','The delivery area '+address.state+' is not in delivery area list. Please add it to the list. Current areas are <br>'+zipArr.join(','));
			}else{
				$scope.showCheckoutMsg('Warning','The Postcode '+address.postcode.toUpperCase()+' is not in delivery area. Please add it to the list. Current postcode areas are <br>'+zipArr.join(','));
			}
		}
		return flag;
	}

	$scope.httpRequest = null;
	$scope.abortRequest = function(){
		return( $scope.httpRequest && $scope.httpRequest.abort() );
	}
	
	$scope.post_lookup = {
		billing:false,
		shipping:false,
		billing_street:[],
		shipping_street:[],
		billing_model:'',
		shipping_model:'',
		billing_match:[],
		shipping_match:[],
		show_billing_streets:false,
		show_shipping_streets:false
	};
	$scope.post_codes = [];
	
	$scope.loyalty_dbaccess_status = false;
	$scope.loyalty_dbaccess_points = 0;
	$scope.loyalty_reward_points_pre = 0;
	$scope.LoyaltyCardCheck = function(card){
		//$scope.loyalty_dbaccess_status = true;
		var shop_name = '';
		$scope.loyalty_dbaccess_status = false;
		$scope.show_redeem_btn=false;
		$scope.httpRequest = dataService.getPoints(card,shop_name);
		$scope.httpRequest.then(function(res) {
			console.log(res);
			if(res.Success==1)
			{
				$scope.loyalty_card.reward_points =	Number(res.points_to_redeem)+Number(res.points_to_unlock);
				$scope.loyalty_reward_points_pre = $scope.loyalty_card.reward_points;
				$scope.loyalty_dbaccess_status = true;
				$scope.loyalty_dbaccess_points = res.points_to_unlock;
				$scope.addLoyaltyPointsOrder();
			}
			$scope.httpRequest = null;
		}).catch(function(err){
			var msg = '';
			if(!err){
				msg = "No internet connection!!!";
			}else if(angular.isDefined(err.error)){
				if(err.error == "timeout"){
					msg = "Connection timed out!!!";
				}else{
					msg = "Request aborted!!!";
				}
			}else{
				msg = 'postcode not found!!!';
			}
			
			$scope.loyalty_dbaccess_status = false;

			console.log(msg);
			$scope.httpRequest = null;
		})
		return $scope.loyalty_dbaccess_status;
	}
	
	$scope.PostcodeLookup = function(copy_pc,update) {
		var address;
		var show_customer_edit = true;
		$scope.errors.bill_postcode = '';
		$scope.errors.ship_postcode = '';
		if(copy_pc){
			$scope.post_lookup.billing_street = []; 
			$scope.post_lookup.billing_match = []; 
			address = $scope.formCustomer.billing_address;
		}else{
			$scope.post_lookup.shipping_street = []; 
			$scope.post_lookup.shipping_match = []; 
			address = $scope.formCustomer.shipping_address;
		}
		var line_1 = address.address_1;

		$ionicLoading.show({
			template: '<ion-spinner icon="ios"></ion-spinner><br><span class="aiv-loading">Looking for PostCode details.<br>Please wait... OR Click cancel</span><button ng-click="abortRequest()" class="button button-full button-assertive">Cancel</button>',
			animation: 'fade-in',
			showBackdrop: true,
			maxWidth: 300,
			showDelay: 0,
			scope: $scope
		});
		var postcodes = shareData.getPostcodes();
		if(address.postcode != undefined){
			$scope.post_codes = [];//$filter('filter')(postcodes, {postcode: address.postcode.toUpperCase()}, false);
			for(var p=0;p<postcodes.length;p++){
				if(postcodes[p].postcode.replace(/ /g,'').toUpperCase() == address.postcode.replace(/ /g,'').toUpperCase()){
					$scope.post_codes.push(postcodes[p]);
				}
			}
			address.address_1 = line_1;
			if($scope.post_codes.length){
				parsePostCode(address,copy_pc,update);
				if(update){
				 if(!$scope.post_lookup_return)
						$scope.post_lookup.show_billing_streets = true;
				}
				$ionicLoading.hide();
			}else if(update){
				show_customer_edit = false;
				$scope.httpRequest = dataService.getAddress(address.postcode);
				$scope.httpRequest.then(function(res) {
					postcodes = postcodes.concat(res.result);
					$scope.post_codes = res.result;
					parsePostCode(address,copy_pc,update);
					$scope.post_lookup.show_billing_streets = true;
					$ionicLoading.hide();
					console.log(res);
					$pouchDB.upsert('getUKPostcodes',function(doc){
						doc.postcodes = postcodes;
						return doc;
					}).then(function(result) {
						console.log(result);
						shareData.addPostcodes(postcodes);
					}).catch(function(error){
						console.error(error);
					});
					if($scope.customer_edit_modal == undefined || !$scope.customer_edit_modal._isShown){
						$ionicModal.fromTemplateUrl('customer-edit-modal.html', {
							id:'CUSTOMER_EDIT',
							scope: $scope,
							backdropClickToClose: false,
							animation: 'slide-in-up'
						}).then(function(modal) {
							modal.el.className = modal.el.className + " customer-edit-modal";
							$scope.customer_edit_modal = modal;
							$scope.openModal('CUSTOMER_EDIT');
						});
					}
					$scope.httpRequest = null;
				}).catch(function(err){
					var msg = '';
					if(!err){
						msg = "No internet connection!!!";
					}else if(angular.isDefined(err.error)){
						if(err.error == "timeout"){
							msg = "Connection timed out!!!";
						}else{
							msg = "Request aborted!!!";
						}
					}else{
						msg = 'postcode not found!!!';
					}

					if(copy_pc){
						$scope.errors.bill_postcode = msg;
					}else{
						$scope.errors.ship_postcode = msg;
					}
					$ionicLoading.hide();
					if($scope.customer_edit_modal == undefined || !$scope.customer_edit_modal._isShown){
						$ionicModal.fromTemplateUrl('customer-edit-modal.html', {
							id:'CUSTOMER_EDIT',
							scope: $scope,
							backdropClickToClose: false,
							animation: 'slide-in-up'
						}).then(function(modal) {
							modal.el.className = modal.el.className + " customer-edit-modal";
							$scope.customer_edit_modal = modal;
							$scope.openModal('CUSTOMER_EDIT');
						});
					}
					$scope.httpRequest = null;
				})
			}else{
				$ionicLoading.hide();
			}
		}else{	
			$ionicLoading.hide();
		}
		if(copy_pc && $scope.formCustomer.sameAddress){
			$scope.post_lookup.shipping_model = $scope.post_lookup.billing_model;
			$scope.post_lookup.shipping_street = angular.copy($scope.post_lookup.billing_street);
			if(update){
				$scope.formCustomer.shipping_address = angular.copy($scope.formCustomer.billing_address);
			}
		}
		
		if(show_customer_edit && ($scope.customer_edit_modal == undefined || !$scope.customer_edit_modal._isShown)){
			$ionicModal.fromTemplateUrl('customer-edit-modal.html', {
				id:'CUSTOMER_EDIT',
				scope: $scope,
				backdropClickToClose: false,
				animation: 'slide-in-up'
			}).then(function(modal) {
				modal.el.className = modal.el.className + " customer-edit-modal";
				$scope.customer_edit_modal = modal;
				$scope.openModal('CUSTOMER_EDIT');
			});
		}
	}
	
	$scope.temppost = {postcode:'',count:0}
	var parsePostCode = function(address,copy_pc,update){
		$scope.post_lookup_return =true;
		var post_code = '';
		$scope.temppost = {postcode:'',count:0}
		var request_p = address.address_1.replace(/ /g,'').toLowerCase();
		request_p = request_p.split(',')[0];
		for(var i=0;i<$scope.post_codes.length;i++){
			if(!post_code){
				var current_p = $scope.post_codes[i].premise.replace(/ /g,'').toLowerCase();
				//var request_p = address.address_1.split(' ')[0].toLowerCase();
				var premise_split = current_p.split(',');
				//if(address.address_1 != '' && current_p.indexOf(request_p) > -1){
				//if(address.address_1 != '' && current_p == request_p){
				if(address.address_1 != '' &&  premise_split.length && premise_split[0].includes(request_p)){
					$scope.temppost.postcode = $scope.post_codes[i];
					if(premise_split[0] == request_p){
						post_code = $scope.temppost.postcode;
					}else{
						$scope.temppost.count++;
					}
				}
			}
				
			/*if(copy_pc){
				$scope.post_lookup.billing_street.push($scope.post_codes[i].line_1+', '+$scope.post_codes[i].line_2);
			}else{
				$scope.post_lookup.shipping_street.push($scope.post_codes[i].line_1+', '+$scope.post_codes[i].line_2);
			}*/
			$scope.post_codes.line_2=$scope.post_codes[i].line_2;
			if($scope.post_codes[i].line_2 !="" && $scope.post_codes[i].line_1 !="")
				$scope.post_codes.line_2 = $scope.post_codes[i].line_1+", "+$scope.post_codes[i].line_2;
			if($scope.post_codes[i].line_2 =="")
				$scope.post_codes.line_2 = $scope.post_codes[i].line_1;
			
			if(copy_pc){
				if(!$scope.post_lookup.billing_street.includes($scope.post_codes.line_2))
				$scope.post_lookup.billing_street.push($scope.post_codes.line_2);
			}else{
				if(!$scope.post_lookup.shipping_street.includes($scope.post_codes.line_2))
				$scope.post_lookup.shipping_street.push($scope.post_codes.line_2);
			}
		}
		var postcode_get =[];
		if($scope.post_lookup.billing_street.length){
			for(var k=0;k<$scope.post_lookup.billing_street.length;k++){
				if($scope.formCustomer_find.address_1 !="" && $scope.post_lookup.billing_street[k].includes($scope.formCustomer_find.address_1)){
					postcode_get.push($scope.post_lookup.billing_street[k]);
				}
			}
		}
		if($scope.post_lookup.shipping_street.length){
			for(var k=0;k<$scope.post_lookup.shipping_street.length;k++){
				if($scope.formCustomer_find.address_1 !="" && $scope.post_lookup.shipping_street[k].includes($scope.formCustomer_find.address_1)){
					postcode_get.push($scope.post_lookup.shipping_street[k]);
				}
			}
		}
		if(postcode_get.length){
			if($scope.post_lookup.billing_street.length){
				$scope.post_lookup.billing_street =postcode_get;
				$scope.formCustomer.billing_address.address_1 =$scope.post_lookup.billing_street[0];
				if($scope.formCustomer_find.address_2 !="")
					$scope.formCustomer.billing_address.address_1= $scope.formCustomer_find.address_2 +", "+$scope.formCustomer.billing_address.address_1;
			}
			if($scope.post_lookup.shipping_street.length){
				$scope.post_lookup.shipping_street =postcode_get;
				$scope.formCustomer.billing_address.address_1 =$scope.post_lookup.shipping_street[0];
				if($scope.formCustomer_find.address_2 !="")
					$scope.formCustomer.billing_address.address_1= $scope.formCustomer_find.address_2 +", "+$scope.formCustomer.billing_address.address_1;
			}
		}else{
			$scope.post_lookup_return =false;
			//$scope.post_lookup.show_billing_streets = true;
		}
		if(!post_code && $scope.temppost.postcode){
			post_code = $scope.temppost.postcode;
		}
		
		if(post_code == ''){
			if(copy_pc){
				$scope.post_lookup.billing_model = $scope.post_lookup.billing_street[0];
				$scope.post_lookup.billing_match = angular.copy($scope.post_codes[0]);
			}else{
				$scope.post_lookup.shipping_model = $scope.post_lookup.shipping_street[0];
				$scope.post_lookup.shipping_match = angular.copy($scope.post_codes[0]);
			}
			if(update){
				//address.city = $scope.post_codes[0].post_town;
				//address.address_2 = $scope.post_codes[0].ward;
			}
		}else{
			if(copy_pc){
				$scope.post_lookup.billing_model = post_code.line_1+', '+post_code.line_2;
				if(update){
					address.address_1 = $scope.post_lookup.billing_model;
				}
				$scope.post_lookup.billing_match = angular.copy(post_code);
			}else{
				$scope.post_lookup.shipping_model = post_code.line_1+', '+post_code.line_2;
				if(update){
					address.address_1 = $scope.post_lookup.shipping_model;
				}
				$scope.post_lookup.shipping_match = angular.copy(post_code);
			}
			if(update){
				//address.city = post_code.post_town;
				//address.address_2 = post_code.ward;
			}
		}
	}
	
	$scope.savePostCode = function(postcode,copy_pc) {
		if(copy_pc){
			$scope.post_lookup.billing = false;
		}else{
			$scope.post_lookup.shipping = false;
		}
		$scope.errors.bill_postcode = '';
		$scope.errors.ship_postcode = '';
		
		var error = $scope.UKGovPostcodeRegex.test(postcode);
		if(!error){
			if(copy_pc){
				$scope.errors.bill_postcode = "Invalid PostCode";
			}else{
				$scope.errors.ship_postcode = "Invalid PostCode";
			}
		}else{
			if(copy_pc){
				$scope.post_lookup.billing = true;
			}else{
				$scope.post_lookup.shipping = true;
			}
		}
		if(copy_pc && $scope.formCustomer.sameAddress){
			$scope.formCustomer.shipping_address = angular.copy($scope.formCustomer.billing_address);
		}
		if($scope.selected_shipping.id == 'local_delivery'){
			$scope.formCustomer.del_charge = $scope.getDeliveryCharge($scope.formCustomer.shipping_address);
		}
	}
	
	$scope.toggleStreets = function(is_billing,street){
		if(is_billing){
			$scope.post_lookup.billing_model = street;
			$scope.post_lookup.show_billing_streets = false;
		}else{
			$scope.post_lookup.shipping_model = street;
			$scope.post_lookup.show_shipping_streets = false;
		}
		$scope.changeAddress(is_billing);
	}
	
	$scope.assignDeliveryArea = function(d_area){
		$scope.delivery_areas.show = false;
		$scope.delivery_areas.selected = d_area.area;
		$scope.formCustomer.billing_address.state = d_area.area;
		$scope.formCustomer.shipping_address.state = d_area.area;
		$scope.delivery_areas.value = $scope.formCustomer.billing_address.state+" - "+$rootScope.aiv_info.currency_symbol+d_area.amount;
		if($scope.selected_shipping.id == 'local_delivery'){
			$scope.formCustomer.del_charge = $scope.getDeliveryCharge($scope.formCustomer.shipping_address);
		}
	}
	
	$scope.changeAddress = function(is_billing){
		if(is_billing){
			$scope.formCustomer.billing_address.address_1 = $scope.post_lookup.billing_model;
			if($scope.formCustomer.sameAddress){
				$scope.formCustomer.shipping_address = angular.copy($scope.formCustomer.billing_address);
			}
		}else{
			$scope.formCustomer.shipping_address.address_1 = $scope.post_lookup.shipping_model;
		}
	}
	
	$scope.changeShipping = function(method){
		$scope.formCustomer_find = {
			address_1:"",
			address_2:""
		};
		$scope.temp_shipping = angular.copy(method);
		$scope.ship_select.err = '';
	}
	
	// To calculate the Shipping Cost and Grand Total
	$scope.saveShipping = function(search_customer) {
		$scope.showCODPayment =true;
		if(angular.isUndefined($scope.temp_shipping.title) || $scope.temp_shipping.title == ''){
			$scope.ship_select.err = "Please select a method";
			return;
		}else if($scope.temp_shipping.id == 'sitin' && !$scope.sitin_tables.selected && search_customer){
			$scope.ship_select.err = "Please select a table";
			return;
		}
		/*else if($scope.selected_shipping.id == 'local_delivery' && $scope.selected_shipping.fee == ''){
			$scope.ship_select.err = "Please add a valid amount";
			return;
		}*/
		$scope.selected_shipping = angular.copy($scope.temp_shipping);
		$scope.formCheckout.shipping_lines[0].method_id = $scope.selected_shipping.id;
		$scope.formCheckout.shipping_lines[0].method_title = $scope.selected_shipping.method_title;
		$scope.formCheckout.shipping_lines[0].total = $scope.selected_shipping.fee;
		$scope.grand.Shipping = ($scope.selected_shipping.fee=='')?0:parseFloat($scope.selected_shipping.fee);
		//$scope.grand.Shipping = $scope.grand.Weight * $scope.JNE[$scope.formCheckout.billing_address.province][$scope.formCheckout.billing_address.kota][$scope.formCheckout.billing_address.kecamatan][$scope.formCheckout.shipping_type].harga
	
		if($scope.selected_shipping.id != 'sitin'){
			$scope.sitin_tables.selected = 0;
			$scope.bagCharges.selected = Number($scope.bagCharges.default);
		}else{
			$scope.bagCharges.selected = 0;
		}
	
		$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'grand', $scope.grand)
		console.log($scope.grand)
		$scope.saveForm();
		
		//If Back/Single terminal and Delivery/Collection orders, open customer search
		if(search_customer && $scope.terminalData.type != 'FRONT' && $scope.selected_shipping.id != 'sitin' && $scope.startup.action!='TABLEVIEW' && $scope.selected_shipping.id != '' && $scope.formCheckout.customer_id == 'guest'){
			$scope.openCustomerModal();
		}
		
		$scope.ship_select.err = '';
		if($scope.ship_modal != undefined){
			$scope.closeModal('SHIPPING');
		}
	}

	$scope.actionShipping = function() {
		//$ionicScrollDelegate.$getByHandle('customer_edit_Scroll').resize();
		//$ionicScrollDelegate.$getByHandle('customer_edit_Scroll').scrollBottom();

		if ($scope.formCustomer.sameAddress) {
			$scope.post_lookup.shipping_model = $scope.post_lookup.billing_model;
			$scope.post_lookup.shipping_street = angular.copy($scope.post_lookup.billing_street);
			$scope.formCustomer.shipping_address = angular.copy($scope.formCustomer.billing_address);
		}else if($scope.formCustomer.shipping_address.postcode != ''){
			$scope.post_lookup.shipping = true;
		}
	}
	
	$scope.saveInitialShipping = function(method){
		$scope.ship_select.id = method.id;
		$scope.changeShipping(method);
		$scope.saveShipping(false);
		
		if($scope.user_modal != undefined && $scope.user_modal._isShown){
			if($scope.aiv_users.selected){
				$scope.login($scope.qwerty_inputs.pass);
			}else{
				if($scope.CID_ph_num){
					$scope.aiv_users.err = 'Please login...';
				}
			}
		}
	}
	
	$scope.openMaps = function(address_info,tag){
		var label = encodeURI(address_info.line_1); // encode the label
		var saddr = $rootScope.aiv_info.lat+','+$rootScope.aiv_info.long;
		var daddr = (address_info.line_2?address_info.line_2:address_info.line_1)+','+address_info.postcode;
		daddr = encodeURI(daddr); // encode daddr
		if (ionic.Platform.isAndroid()) {
			window.open('geo:0,0?saddr='+saddr+'&daddr='+daddr+'&z=19(' + label + ')', '_blank');
		}else {
			window.open('https://maps.google.com?saddr='+saddr+'&daddr='+daddr+'&z=19(' + label + ')','_blank',"location=no"); 
		}
	}
	
	$scope.op_data = {
		option_index:'',
		add_product_flag:false,
		add_option_flag:false
	};

	$scope.product_edited = [];
	$scope.product_removed = [];
	$scope.category_removed = [];
	$scope.category_edited = [];
	$scope.sync_pending = false;
	$scope.syncDocsArr = [];
	$scope.sync_upload_clicked = false;
	

	$scope.OpenEditOptionModal = function(item){
		$scope.var_copy.current_options = angular.copy($scope.current_options);
		$scope.var_copy.current_display_options = angular.copy($scope.current_display_options);
		$scope.var_copy.display_options_tooptions = angular.copy($scope.display_options_tooptions);
		$scope.OptionsObj = {
			name:'',
			value:'',
			price:'',
			attribute:{
				options:[]
			},
			index:'',
			error:''
		};
		if(item == undefined){//New option
			$scope.op_data.add_option_flag = true;
		}else{//Existing option
			$scope.op_data.add_option_flag = false;
			$scope.OptionsObj.attribute = angular.copy(item);
			$scope.OptionsObj.name = $filter('split')($scope.OptionsObj.attribute.name,'###',0);
			$scope.OptionsObj.name = $filter('split')($scope.OptionsObj.name,'_',0);
		}
		$ionicModal.fromTemplateUrl('edit-option-modal.html', {
			id:'EDIT_OPTION',
			backdropClickToClose: false,
			scope: $scope,
			animation: 'none',
			cache: false
		}).then(function(modal) {
			modal.el.className = modal.el.className + " edit-option-modal";
			$scope.edit_option_modal = modal;
			$scope.openModal('EDIT_OPTION');
		});
	}
	
	$scope.updateOptionValue = function(){
		$scope.OptionsObj.error = '';
		if($scope.showEditOptionValue){//Update edited option values
			if($scope.OptionsObj.value == ''){
				$scope.OptionsObj.error = 'Fields should not be empty...';
				return;
			}else{
				var hash = '';
				var name2 = $scope.OptionsObj.attribute.options[$scope.OptionsObj.index];
				var nameArr = name2.split('###');
				if(nameArr.length > 1){
					hash = '###'+nameArr[1];
				}
				if($scope.OptionsObj.price == '' || !$scope.OptionsObj.price){
					$scope.OptionsObj.attribute.options[$scope.OptionsObj.index] = $scope.OptionsObj.value+hash;
				}else{
					var value = $scope.OptionsObj.value+' (+'+$rootScope.aiv_info.currency_symbol+$scope.OptionsObj.price+')'+hash;
					$scope.OptionsObj.attribute.options[$scope.OptionsObj.index] = value;
				}
			}
			
			$scope.showEditOptionValue = false;
			$scope.OptionsObj.value = '';
			$scope.OptionsObj.price = '';
		}else{//Create new option value
			if($scope.OptionsObj.value == ''){
				$scope.OptionsObj.error = 'Fields should not be empty...';
				return;
			}else{
				if($scope.OptionsObj.price == '' || !$scope.OptionsObj.price){
					$scope.OptionsObj.attribute.options.push($scope.OptionsObj.value+'###F');
				}else{
					var value = $scope.OptionsObj.value+' (+'+$rootScope.aiv_info.currency_symbol+$scope.OptionsObj.price+')###F';
					$scope.OptionsObj.attribute.options.push(value);
				}
			}
		}
	}
	
	$scope.showEditOptionValue = false;
	$scope.editOptionValue = function(index){
		$scope.showEditOptionValue = true;
		var opt = $scope.OptionsObj.attribute.options[index];
		opt = $filter('split')(opt,'###',0);
		var value = opt.match(/\(([^)]+)\)/);
		if(value != null && value.length > 1){
			value[1] = value[1].replace(/[£+]/g,"");
			$scope.OptionsObj.price = $scope.parseFloatNoNaN(value[1]);
			var optArr = opt.split(value[0]);
			if(optArr.length){
				$scope.OptionsObj.value = optArr[0];
			}else{
				$scope.OptionsObj.value = opt;
			}
		}else{
			$scope.OptionsObj.price = '';
			$scope.OptionsObj.value = opt;
		}
	}

	$scope.removeOptionValue = function(index){
		$scope.OptionsObj.attribute.options.splice(index,1);
	}
	
	$scope.saveEditedOption = function(){
		$scope.OptionsObj.error = '';
		
		if($scope.OptionsObj.name == ''){
			$scope.OptionsObj.error = 'Fields should not be empty...';
			return;
		}else{
			var re = new RegExp("^[a-zA-Z0-9-\s]+$");//Allow only numbers,letters,hyphen and space
			if (!re.test($scope.OptionsObj.name)){
				$scope.OptionsObj.error = 'Only numbers, letters, hyphens and spaces are alloweed...';
				return;
			}
		}
		
		if($scope.op_data.add_option_flag){//Add new option
			var arr = $filter('filter')($scope.update_product.attributes, {name:$scope.OptionsObj.name}, false);
			if(arr.length){//Option name exists
				$scope.OptionsObj.error = 'An option with this name already exists...';
				return;
			}

			$scope.OptionsObj.attribute = {
				name:$scope.OptionsObj.name,
				slug:$scope.OptionsObj.name.replace(/\s+/g, '-'),
				visible:true,
				variation:true,
				options:$scope.OptionsObj.attribute.options
			}

			$scope.update_product.attributes.push($scope.OptionsObj.attribute);
		}else{//Updated edited option
			var underscore = '',hash = '';
			var name1 = $scope.OptionsObj.attribute.name;
			var nameArr = name1.split('_');
			if(nameArr.length > 1){
				underscore = '_';
				for(var i=1;i<nameArr.length;i++){
					underscore+=(nameArr[i]=='')?'_':nameArr[i];
				}
			}
			
			if(underscore == ''){
				nameArr = name1.split('###');
				if(nameArr.length > 1){
					hash = '###'+nameArr[1];
				}
			}
			
			if($scope.OptionsObj.attribute.name != $scope.OptionsObj.name+underscore+hash){
				$scope.OptionsObj.attribute.name = $scope.OptionsObj.name+underscore+hash;
				var arr = $filter('filter')($scope.update_product.attributes, {name:$scope.OptionsObj.attribute.name}, false);
				if(arr.length){//Option name exists
					$scope.OptionsObj.error = 'An option with this name already exists...';
					return;
				}
			}
			
			$scope.update_product.attributes[$scope.op_data.option_index] = $scope.OptionsObj.attribute;
		}
		$scope.closeModal('EDIT_OPTION');
	}
	
	$scope.removeOption = function(index){
		$scope.update_product.attributes.splice(index,1);
	}
	
	var resetDailyCommonOrderNumber = function(){
		var deferred = $q.defer();
		
			if($scope.dailyOrderNo.common){
				var postData = {};
				postData.type = "UPDATE_ALL";
				postData.loyalty = $scope.hf_loyalty;
				postData.daily_order_no = $scope.dailyOrderNo;
				postData.daily_order_no.start = 0; 
				postData.daily_order_no.num = 0;	
				$scope.httpRequest = dataService.updateDoc($scope.couchDBUrl+"/_design/updategetSettings/_update/settings/getSettings", postData);
				$scope.httpRequest.then(function(returnData) {
					if(returnData.Success){
						//show order number reset message.
					}else{
						//unable to reset order number
					}
					deferred.resolve();
				}).catch(function(err){
					
					console.error(err);
					console.log("Unable to reset common order number");
					deferred.resolve();
				})
			}else{
				
				deferred.resolve();
			}
		
		return deferred.promise;
	}
	
	var getDailyOrderNo = function(update){
		var deferred = $q.defer();
		if(update){
			if($scope.dailyOrderNo.common){
				var postData = {};
				postData.type = "UPDATE_ORDERNO";
				
				$scope.httpRequest = dataService.updateDoc($scope.couchDBUrl+"/_design/updategetSettings/_update/settings/getSettings", postData);
				$scope.httpRequest.then(function(returnData) {
					if(returnData.Success){
						var num = $scope.dailyOrderNo.num;
						$scope.dailyOrderNo = angular.copy(returnData.Data.daily_order_no);
						
						if($scope.dailyOrderNo.num<=num)
						{
							$scope.dailyOrderNo.num=num+1;
						}
						
					}else{
						var pre_date = new Date($scope.dailyOrderNo.date+' '+$rootScope.aiv_info.day_ends_at);
						var next_date = angular.copy(pre_date);
						next_date = new Date(next_date.setDate(next_date.getDate() + 1));
						var current_date = new Date();
						$scope.dailyOrderNo.num=$scope.dailyOrderNo.num+1;
						
						if(current_date > next_date){
							//Reset order number
							$scope.dailyOrderNo.num = $scope.dailyOrderNo.start;
							$scope.dailyOrderNo.date = yyyymmdd(current_date);
							$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'order_no',$scope.dailyOrderNo);
						}
						$scope.dailyOrderNo.prefix = $scope.terminalData.prefix;
						console.log("Generating alternate order number");
						
					}
					deferred.resolve();
				}).catch(function(err){
					var pre_date = new Date($scope.dailyOrderNo.date+' '+$rootScope.aiv_info.day_ends_at);
					var next_date = angular.copy(pre_date);
					next_date = new Date(next_date.setDate(next_date.getDate() + 1));
					var current_date = new Date();
					$scope.dailyOrderNo.num=$scope.dailyOrderNo.num+1;
					
					if(current_date > next_date){
						//Reset order number
						$scope.dailyOrderNo.num = $scope.dailyOrderNo.start;
						$scope.dailyOrderNo.date = yyyymmdd(current_date);
						$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'order_no',$scope.dailyOrderNo);
					}
					$scope.dailyOrderNo.prefix = $scope.terminalData.prefix;
					console.error(err);
					console.log("Generating alternate order number");
					deferred.resolve();
				})
			}else{
			
			
				var pre_date = new Date($scope.dailyOrderNo.date+' '+$rootScope.aiv_info.day_ends_at);
				var next_date = angular.copy(pre_date);
				next_date = new Date(next_date.setDate(next_date.getDate() + 1));
				var current_date = new Date();
				
				if(current_date > next_date){
					//Reset order number
					$scope.dailyOrderNo.num = $scope.dailyOrderNo.start;
					$scope.dailyOrderNo.date = yyyymmdd(current_date);
					$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'order_no',$scope.dailyOrderNo);
				}
				deferred.resolve();
			}
		}else{
			deferred.resolve();
		}
		return deferred.promise;
	}
	
	var orderItems2Cart = function(order)	{
		var cartItemdata = [];
		for(var i=0;i<order.data.line_items.length;i++){
			var unit_price = parseFloat(order.data.line_items[i].subtotal)/parseInt(order.data.line_items[i].quantity);
			
			var products = [];
			for (var category in $scope.allProducts) {
				var cat_exists = $filter('filter')($scope.categories,{slug:category},true);
				if(cat_exists.length && !cat_exists[0].children.length && $scope.allProducts.hasOwnProperty(category)){
					var products = $filter('filter')($scope.allProducts[category],{'id': order.data.line_items[i].product_id},true);
					if(products.length){
						break;
					}
				}
			}
				
			var product = {
				"id":order.data.line_items[i].product_id,
				"sku": order.data.line_items[i].sku,
				"price": unit_price.toFixed(2),
				"total":order.data.line_items[i].subtotal,
				"quantity":order.data.line_items[i].quantity,
				"featured_src": "",
				"title": angular.isDefined(order.data.line_items[i].name)?order.data.line_items[i].name:order.data.line_items[i].title,
				"categories": angular.isDefined(order.data.line_items[i].categories)?order.data.line_items[i].categories:[],
				"attributes":[],
				"dash":angular.isDefined(order.data.line_items[i].dash)?order.data.line_items[i].dash:false,
				"meta":{}
			};
			if(products.length){
				product.meta = angular.copy(products[0].meta);
			}
					
			if(angular.isDefined(order.data.line_items[i].variations)){
				product.sel_variations = {'attributes':order.data.line_items[i].variations,'price':unit_price.toFixed(2)};
				product.type = "variable";
			}else{
				product.type = "simple";
			}
			
			if(product.type=="variable"&&product.sel_variations.hasOwnProperty("attributes"))
				product.sel_variations["attributestoshow"] = $scope.processDisplay(product.sel_variations.attributes);

			cartItemdata.push(product);
		}
		return cartItemdata;
	};
	
	var cart2OrderItems = function(cart,type){
		var line_items = [];
		var per_discount = $scope.grand.Discount/$scope.grand.Quantity;
		for (var i = 0; i < cart.length; i++) {
			var prdt_dept = '',prdt_group = '',prdt_types = [];
			if(angular.isDefined(cart[i].meta.wc_productdata_options)){
				if(angular.isDefined(cart[i].meta.wc_productdata_options[0].prdt_dept)){
					prdt_dept = cart[i].meta.wc_productdata_options[0].prdt_dept;
				}
				if(angular.isDefined(cart[i].meta.wc_productdata_options[0].group)){
					prdt_group = cart[i].meta.wc_productdata_options[0].group;
				}
				if(angular.isDefined(cart[i].meta.wc_productdata_options[0].types)){
					prdt_types = cart[i].meta.wc_productdata_options[0].types;
				}
			}
			
			var lineItem=null;
			if (angular.isUndefined(cart[i].sel_variations) || Object.keys(cart[i].sel_variations.attributes).length === 0) {
				lineItem={
					"id":"",
					"product_id": cart[i].id,
					"sku": cart[i].sku,
					"quantity": cart[i].quantity,
					"subtotal": cart[i].total,
					"total": cart[i].total - (per_discount*cart[i].quantity),
					"price": get_product_price(cart[i],true),
					"featured_src": cart[i].featured_src,
					"title": cart[i].title,
					"categories": cart[i].categories,
					"dept" : prdt_dept,
					"status":'',
					"dash": angular.isDefined(cart[i].dash)?cart[i].dash:false,
					"notes": angular.isDefined(cart[i].notes)?cart[i].notes:'',
					"group": prdt_group,
					"types": prdt_types
				};
			}else{
				var varia = {};
				for (var key in cart[i].sel_variations.attributes) {
				  if (cart[i].sel_variations.attributes.hasOwnProperty(key)) {
					varia[key] = cart[i].sel_variations.attributes[key];
				  }
				}
				lineItem={
					"id":"",
					"product_id": cart[i].id,
					"sku": cart[i].sku,
					"quantity": cart[i].quantity,
					"subtotal": cart[i].total,
					"total": cart[i].total - (per_discount*cart[i].quantity),
					"price": get_product_price(cart[i],true),
					"featured_src": cart[i].featured_src,
					"title": cart[i].title,
					"categories": cart[i].categories,
					"variations": varia,
					"dept" : prdt_dept,
					"status":'',
					"dash":angular.isDefined(cart[i].dash)?cart[i].dash:false,
					"notes": angular.isDefined(cart[i].notes)?cart[i].notes:'',
					"group": prdt_group,
					"types": prdt_types
				};
			}
			
			
			
			if(type == "print"&&cart[i].hasOwnProperty("newstatus"))
			{
			lineItem["newstatus"]=cart[i].newstatus;
			}
			
			if(type == "print"&&cart[i].hasOwnProperty("deltacount"))
			{
			lineItem["deltacount"]=cart[i].deltacount;
			
			}
			
			
			
			line_items.push(lineItem);
			
		
		}
		
		return line_items;
	}
	
	var createOrder = function(status,split=false,finalBill=false,card=true,cash=false){
	
		if(split ==true){
			$scope.formCheckout.payment_details.split=true;
			$scope.formCheckout.payment_details.cash=0;
			$scope.formCheckout.payment_details.card=0;
			$scope.formCheckout.payment_details.voucher=0;
			if($scope.selected_pay.id =="voucher")
					$scope.formCheckout.payment_details.voucher =$scope.payment_select.amount;
				else if($scope.selected_pay.id =="cod")
					$scope.formCheckout.payment_details.cash =$scope.payment_select.amount;
				if(card)
					$scope.formCheckout.payment_details.card =$scope.showSplitPay.amount;
				else if(cash)
					$scope.formCheckout.payment_details.cash =$scope.showSplitPay.amount;
			//$scope.formCheckout.payment_details.cash=$scope.payment_select.amount;
			//$scope.formCheckout.payment_details.card=$scope.showSplitPay.amount;
			$scope.split_multiple =true;
		}
		var now_date = new Date().toISOString();
		var fee_lines = [];
		if($scope.payment_fee){
			fee_lines.push({
			   "id":"",
			   "title": "Card charges",
			   "tax_class": "",
			   "total": $filter('number')($scope.payment_fee,2),
			   "total_tax": "0.00"
			})
		}
		
		if($scope.bagCharges.selected){
			fee_lines.push({
			   "id":"",
			   "title": "Bag charges",
			   "tax_class": "",
			   "total": $filter('number')($scope.bagCharges.selected,2),
			   "total_tax": "0.00"
			});
		}
		
		var payment_details;
		if(status=='pending'){
			payment_details = {
			   "method_id": "cod",
			   "method_title": "Cash on Delivery",
			   "paid": false
		    }
		}else{
			payment_details = $scope.formCheckout.payment_details;
		}
		
		var line_items = cart2OrderItems($scope.cartItems,"order");
		var discounts_present = "";
		for(var d=0;d<$scope.cartDiscounts.length;d++){
			if(d){
				discounts_present+=";";
			}
			var discount_letter = ''
			if($scope.cartDiscounts[d].name == 'COUPON'){
				discount_letter = "C";
			}else if($scope.cartDiscounts[d].name == 'B1G1' || $scope.cartDiscounts[d].name == 'B17_99'){
				discount_letter = "D";
			}else if($scope.cartDiscounts[d].name == 'LOYALTY'){
				discount_letter = "L";
			}else{
				discount_letter = "U";
			}
			discounts_present+=discount_letter+"#"+$scope.cartDiscounts[d].amount.toFixed(2);
		}
		if(payment_details.method_id=="card" && parseFloat($scope.payment_select.amount)> $scope.grand.Total){
				$scope.tipData={
					enable:true,
					amount:$scope.payment_select.tender,
					method:'card'
				}
			}else{
				$scope.tipData={
					enable:false,
					amount:'',
					method:''
				}
			}
		if($scope.formCheckout.pending_data.order_no != ''){//Already saved order
			var new_seq = parseInt($scope.formCheckout.pending_data.order_seq);
			var doc_id = $scope.formCheckout.pending_data.docid;
			var shipping_lines = '';
			if($scope.formCheckout.shipping_lines[0].method_id != ''){
				shipping_lines = $scope.formCheckout.shipping_lines;
				shipping_lines.id = '';
			}
			
			var coupon_lines = $scope.formCheckout.coupon_lines;
			for(var c=0;c<coupon_lines.length;c++){
				coupon_lines[c].id = '';
			}
			
			var new_order = {
			   "_id":doc_id,
			   "_rev" : $scope.formCheckout.pending_data.order_rev,
			   "data":{
				   "id": $scope.formCheckout.pending_data.order_id,
				   "order_number": $scope.formCheckout.pending_data.order_no,
				   "order_key": "",
				   "created_at": now_date,
				   "updated_at": now_date,
				   "completed_at": now_date,
				   "status": (status=='pending')?'pending':'on-hold',
				   "currency": "GBP",
				   "total": ($scope.grand.Total + $scope.grand.Shipping - $scope.grand.Discount + $scope.payment_fee + $scope.bagCharges.selected).toFixed(2),
				   "subtotal": $scope.grand.Total.toFixed(2),
				   "total_line_items_quantity": $scope.grand.Quantity,
				   "total_tax": "0.00",
				   "deposit": angular.isDefined($scope.grand.deposit)?$scope.grand.deposit:0,
				   "total_shipping": $scope.grand.Shipping,
				   "cart_tax": "0.00",
				   "shipping_tax": "0.00",
				   "total_discount": $scope.grand.Discount.toFixed(2),
				   "shipping_methods": $scope.formCheckout.shipping_lines[0].method_title,
				   "payment_details": payment_details,
				   "billing_address": $scope.formCheckout.billing_address,
				   "shipping_address": $scope.formCheckout.shipping_address,
				   "note": $scope.formCheckout.shipping_note,
				   "customer_ip": "",
				   "customer_user_agent": "",
				   "view_order_url": "",
				   "line_items": line_items,
				   "shipping_lines": shipping_lines,
				   "tax_lines": [],
				   "fee_lines": fee_lines,
				   "coupon_lines": coupon_lines,
				   "customer_id":$scope.formCheckout.customer_id,
				   "customer": {
					   "id": $scope.formCheckout.customer_id,
					   "email": $scope.formCheckout.billing_address.email,
					   "first_name": $scope.formCheckout.billing_address.first_name,
					   "last_name": $scope.formCheckout.billing_address.last_name,
					   "billing_address": $scope.formCheckout.billing_address,
					   "shipping_address": $scope.formCheckout.shipping_address,
					   "meta":$scope.formCheckout.customer_meta,
					   "orders_count":angular.isDefined($scope.selected_customer.orders_count)?++$scope.selected_customer.orders_count:1
				   },
				   "order_meta": {
					   "bill_number": $scope.formCheckout.pending_data.order_no,
					   "doc_id": doc_id,
					   "wc_pos_order_type": 'POS',
					   "daily_order_no":(status != 'pending')?($scope.dailyOrderNo.prefix+$scope.dailyOrderNo.num):'',
					   "ordered_at":now_date,
					   "customer_docid":$scope.formCheckout.customer_meta.docid,
					   "order_shop_id":$rootScope.aiv_info.shop_id,
					   "order_dbname":$rootScope.aiv_info.dbname,
					   "shop_email":$rootScope.aiv_info.email,
   					   "shop_name":$rootScope.aiv_info.shop_name,
					   "sitin_table":$scope.sitin_tables.selected,
					   "order_type":$scope.posview.type,
					   "discounts_present":discounts_present,
					   "gratuity":$scope.tipData,
					   "loyalty_card_id":$scope.formCheckout.billing_address.phone,
					   "earned_points":$scope.loyalty_card.current_points,
					   "discount_pesentage":$scope.cart_discount.percent_click,
					   "discount_value":$scope.cart_discount.disc_num
				   }
				}
			};
		}else{//New order
			var new_seq = parseInt($scope.terminalData.last_order_seq) + 1;
			var doc_id = $scope.terminalData.name+'_order_'+now_date;
			var new_order = {
			   "_id":doc_id,
			   "data":{
				   "id": "",
				   "order_number": $scope.terminalData.prefix+''+(parseInt($scope.terminalData.last_bill_number)+1),
				   "order_key": "",
				   "created_at": now_date,
				   "updated_at": now_date,
				   "completed_at": now_date,
				   "status": (status=='pending')?'pending':'on-hold',
				   "currency": "GBP",
				   "total": ($scope.grand.Total + $scope.grand.Shipping - $scope.grand.Discount + $scope.payment_fee + $scope.bagCharges.selected).toFixed(2),
				   "subtotal": $scope.grand.Total.toFixed(2),
				   "total_line_items_quantity": $scope.grand.Quantity,
				   "total_tax": "0.00",
				   "deposit": angular.isDefined($scope.grand.deposit)?$scope.grand.deposit:0,
				   "total_shipping": $scope.grand.Shipping,
				   "cart_tax": "0.00",
				   "shipping_tax": "0.00",
				   "total_discount": $scope.grand.Discount.toFixed(2),
				   "shipping_methods": $scope.formCheckout.shipping_lines[0].method_title,
				   "payment_details": payment_details,
				   "billing_address": $scope.formCheckout.billing_address,
				   "shipping_address": $scope.formCheckout.shipping_address,
				   "note": $scope.formCheckout.shipping_note,
				   "customer_ip": "",
				   "customer_user_agent": "",
				   "view_order_url": "",
				   "line_items": line_items,
				   "shipping_lines": ($scope.formCheckout.shipping_lines[0].method_id != '')?$scope.formCheckout.shipping_lines:'',
				   "tax_lines": [],
				   "fee_lines": fee_lines,
				   "coupon_lines": $scope.formCheckout.coupon_lines,
				   "customer_id":$scope.formCheckout.customer_id,
				   "customer": {
					   "id": $scope.formCheckout.customer_id,
					   "email": $scope.formCheckout.billing_address.email,
					   "first_name": $scope.formCheckout.billing_address.first_name,
					   "last_name": $scope.formCheckout.billing_address.last_name,
					   "billing_address": $scope.formCheckout.billing_address,
					   "shipping_address": $scope.formCheckout.shipping_address,
					   "meta":$scope.formCheckout.customer_meta,
					   "orders_count":angular.isDefined($scope.selected_customer.orders_count)?++$scope.selected_customer.orders_count:1
				   },
				   "order_meta": {
					   "bill_number": $scope.terminalData.prefix+''+(parseInt($scope.terminalData.last_bill_number)+1),
					   "doc_id": doc_id,
					   "wc_pos_order_type": 'POS',
					   "daily_order_no":(status != 'pending')?($scope.dailyOrderNo.prefix+$scope.dailyOrderNo.num):'',
					   "ordered_at":now_date,
					   "customer_docid":$scope.formCheckout.customer_meta.docid,
					   "order_shop_id":$rootScope.aiv_info.shop_id,
					   "order_dbname":$rootScope.aiv_info.dbname,
					   "shop_email":$rootScope.aiv_info.email,
   					   "shop_name":$rootScope.aiv_info.shop_name,
					   "sitin_table":$scope.sitin_tables.selected,
					   "discounts_present":discounts_present,
					   "loyalty_card_id":$scope.formCheckout.billing_address.phone,
					   "earned_points":$scope.loyalty_card.current_points,
					   "order_type":$scope.posview.type,
					   "servedby":$scope.aiv_users.selected,
					   "gratuity":$scope.tipData,
					   "discount_pesentage":$scope.cart_discount.percent_click,
					   "discount_value":$scope.cart_discount.disc_num
				   }
				}
			};
		}
		
		if($scope.formCheckout.shipping_lines[0].method_id != ''){
			if(new_order.data.shipping_lines[0].method_id == 'local_delivery'){
				new_order.data.order_meta.duration = '40 Minutes';
			}else if(new_order.data.shipping_lines[0].method_id == 'local_pickup'){
				new_order.data.order_meta.duration = '20 Minutes';
			}
		}
								
		//if(status!='pending'){
			new_order.data.order_meta.processed_by = $scope.terminalData.name;
		//}
		
		if($rootScope.aiv_info.enable_kitchen=="FALSE" && (!$scope.formCheckout.customer_id || $scope.formCheckout.customer_id == 'guest') && status!='pending'){
			new_order.data.status = 'completed';
		}
		
		if($scope.startup.action=='TABLEVIEW'){
			if($scope.selectedTable.orders.length){
				if($scope.selectedTable.orders[0].split_value){
					//Split into equal parts
					new_order.data.order_meta.split_count = $scope.selectedTable.orders[0].split_value.count;
					//new_order.data.total = $filter('number')(new_order.data.total/$scope.selectedTable.orders[0].split_value.count,2);
					//new_order.data.subtotal = $filter('number')(new_order.data.subtotal/$scope.selectedTable.orders[0].split_value.count,2);
					//new_order.data.total_discount = $filter('number')(new_order.data.total_discount/$scope.selectedTable.orders[0].split_value.count,2);
				}else if($scope.selectedTable.orders[0].split_unequal_value.length && $scope.index_get>-1 && $scope.index_get<$scope.selectedTable.orders[0].split_unequal_value.length){
					new_order.data.order_meta.split_unequal_value = $scope.selectedTable.orders[0].split_unequal_value[$scope.index_get].total;
				}
				new_order.data.order_meta.void_reason = $scope.selectedTable.orders[0].data.order_meta.void_reason;
				new_order.void_items = angular.isDefined($scope.selectedTable.orders[0].void_items)?angular.copy($scope.selectedTable.orders[0].void_items):angular.copy($scope.void_items);
			}else{
				new_order.data.order_meta.void_reason = $scope.void_input.reason;
				new_order.void_items = angular.copy($scope.void_items);
			}
			if(angular.isDefined(new_order.data.payment_details.split) && new_order.data.payment_details.split){
				if(angular.isUndefined($scope.selectedTable.orders[0].card)){
					$scope.selectedTable.orders[0].card =0;
					$scope.selectedTable.orders[0].cash=0;
				}
				if(!finalBill){
					$scope.selectedTable.orders[0].card+=new_order.data.payment_details.card;
					$scope.selectedTable.orders[0].cash+=parseFloat(new_order.data.payment_details.cash);
				}
			}
			if(finalBill){
				new_order.data.payment_details.card =$scope.selectedTable.orders[0].card;
				new_order.data.payment_details.cash = $scope.selectedTable.orders[0].cash;
			}
			new_order.data.order_meta.table_num = $scope.selectedTable.number;
			new_order.data.order_meta.table_cover = $scope.selectedTable.cover;
			new_order.data.order_meta.table_server = $scope.selectedTable.server;
		}
					   
		if(status=='completed'){
			if($scope.aiv_toggles.set_unpaid || (new_order.data.payment_details.method_id == 'cod' && $scope.payment_select.delivery)){
				new_order.data.payment_details.paid = false;
				new_order.data.status = 'on-hold';
			}else{
				new_order.data.payment_details.paid = true;
			}
		}

		return new_order;
	}
	var print_slip = function(rec_slip,del_slip){
		var config = QZHelper.getPrintParams();
		config.copies = 1;//$scope.print_config.copies;
		/*config.altPrinting=false;
		config.colorType="color";
		config.copies="1";
		config.density="";
		config.duplex=false;
		config.encoding="";
		config.endOfDoc="";
		config.fallbackDensity=600;
		config.interpolation="";
		config.jobName="";
		config.margins="0";
		config.orientation="";
		config.paperThickness="";
		config.perSpool="1";
		config.printerTray="";
		config.rasterize=true;
		config.rotation="0";
		config.scaleContent=true;
		config.size=null;
		config.units="in";*/
		//printPreview(printData);
		
		var inv_printData = [{
			type: 'pdf',
			format: 'base64',
			data: btoa(rec_slip.output())
		}];
		
		$scope.printPDF(inv_printData,config);
		if($scope.print_config.kot){
			//Print Delivery receipt
			var config = QZHelper.getPrintParams();
			config.copies = 1;
			var del_printData = [{
				type: 'pdf',
				format: 'base64',
				data: btoa(del_slip.output())
			}];
			$scope.printPDF(del_printData,config);
		}

		$scope.print_config = {copies:1,cashdrawer:false,kot:false,label_needed:false,receipt:true};
	}
	
	$scope.printReceipt = function(order,open_cashdrawer,reprintKOT){
		if($scope.settingsPrinter.type == "Receipt Print"){
			$scope.printRawReceipt({'type':'PRINT','order':order},true,open_cashdrawer,reprintKOT);
		}else if($scope.settingsPrinter.type == "Pixel Print"){
			$scope.printPixelReceipt(order);
		}
	}
	
	$scope.printPixelReceipt = function(order){
		var config = QZHelper.getPrintParams();
		config.copies = 1;
		var paper_width = "8.5";
		var paper_height = "11";
		var paper_type = "letter";
		if(config.size != null){
			paper_width = config.size.width * 25.4;//Inch to mm
			paper_height = config.size.height * 25.4;
			
			for(var i=0;i<$scope.aiv_paper_sizes.length;i++){
				if($scope.aiv_paper_sizes[i].width == config.size.width && $scope.aiv_paper_sizes[i].height == config.size.height){
					paper_type = $scope.aiv_paper_sizes[i].type.toLowerCase();
				}
			}
		}
		//$scope.print_config.kot = true;
		var line_height = 5;
		var current_y = 20;
		var x_start = 15;
		var receipt_title = order.order_meta.quotation?'Quotation':'Invoice';
		var del_title = 'Delivery Slip';
						
		var doc = new jsPDF('p','mm',paper_type);
		var del_doc;
		if($scope.print_config.kot){
			del_doc	= new jsPDF('p','mm',paper_type);
		}
		var totalPagesExp = "{total_pages_count_string}";
		var del_totalPagesExp = "{total_pages_count_string}";
		var rec_type = 'INVOICE';
		
		var pdf_header = function (data) {
			var cur_doc,title;
			if(rec_type == 'INVOICE'){
				cur_doc = doc;
				title = receipt_title;
			}else{
				cur_doc = del_doc;
				title = del_title;
			}
			// HEADER
			cur_doc.setFontSize(10);
			cur_doc.setFontStyle('normal');
			//cur_doc.text(title, paper_width/2, 10);
			cur_doc.text(paper_width/2, 10, title, null, null, 'center');

			// FOOTER
			var str = "Page " + data.pageCount;
			// Total page number plugin only available in jspdf v1.0+
			if (typeof cur_doc.putTotalPages === 'function') {
				str = str + " of " + totalPagesExp;
			}
			cur_doc.setFontSize(10);
			cur_doc.text(str, data.settings.margin.left, cur_doc.internal.pageSize.height - 10);
		};
	
		doc.setFontSize(22);
		doc.text(paper_width/2, current_y, receipt_title, null, null, 'center');
		if($scope.print_config.kot){
			del_doc.setFontSize(22);
			del_doc.text(paper_width/2, current_y, del_title, null, null, 'center');
		}
		current_y+=line_height;
		
		doc.setFontSize(12);
		if($scope.print_config.kot){
			del_doc.setFontSize(12);
		}
		
		var shop_info = [
			{id:$rootScope.aiv_info.name},
			{id:$rootScope.aiv_info.address},
			{id:$rootScope.aiv_info.phone1},
			{id:$rootScope.aiv_info.domain}
		];
		doc.autoTable([{dataKey: "id"}], shop_info, {
			startY: current_y,
			theme: 'plain',
			styles :{
				cellPadding: 0
			},
			drawHeaderRow: function (row, data) {return false;}
		});
		if($scope.print_config.kot){
			del_doc.autoTable([{dataKey: "id"}], shop_info, {
				startY: current_y,
				theme: 'plain',
				styles :{
					cellPadding: 0
				},
				drawHeaderRow: function (row, data) {return false;}
			});
		}
		
		var img_width = 80, img_height = 20;
		//var logo ="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAANAAAAA9CAYAAADcfucoAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAgAElEQVR4nO2debTkVXXvP+ec31DDrXtvz0zdBJuxQbqbGWwRGRaEQd4T1BAM0SVE3woBTWISSBNFMKBIRDSvWUSixhCIhoVGRNKtKLAQbaYOgkCTbjBIM/R4h5p+wznvj1On6ld1695bty9keKm9VvWt+tX57e8+57f32fvss0+1Z4wx9KlPfdotkv/ZAvSpT/+dqW9AferTLKhvQH3q0yyob0B96tMsqG9AferTLKhvQH3q0yyob0B96tMsqG9AferTLKhvQH3q0yyob0B96tMsyOu5pTEghP07U3L3CTE9v25tJ7vHmPb7hWi/r5PXbPownWxtYppGc0G2Uir7WXThYYyZcE/2vm73TCVDlpcxBq11WxspZZNnp2yT9WE66ibr7ozHdPILIZqvN1P+XmTLUm8GlBXAKdB0D9MptzEg5eSKm+XnBqib4mevaw1KTS6D1tPjOn69kOtHpyFOQe4BGAxSSLSxMgkh7fVJlAzAYBCICe97E7VdcdI0RSmFlBIpuwccSZI0v3eyZXlorVFKTYmrtUZrjRCiyadzPJwBSCmb7zsVfKbyuzaTyZ/F7JUmk60b9WZAWcVxgkzF2BlEVsm0tvd2GkO2Y+77yYzH8VDKXv/1r+GNN6BeB8+D4WHYe28oFls8s15nMsPspf89eh/bvDULO+WXwvZTG40U3RXMimSabQEEvXufTsURQuB59hG/9NJLPP/88+zatYs0TRkcHORtb3sbhxxySLONU9bs7C+EaF6brK9Am4KnadpmSI6X+15r3Xyf7dtU8m/atInnnnuOkZERPM9jwYIFHHzwwey5557NNo6v45nFcfymG79sP3oZ9949kFP2V1+Fv/1b2Lp1ci8QBFAqwV57wbJlcOSR9t6sEbn3r7wCt90GO3fCeefBqlUtT+RICEhTixdF8KMfwYMPwmuvQa3W+i4MrfEsXQrHHgvHHAO+31J8h/naa/A3fwPbt9v7JiNnNJ4HF14Ihx9ueUzjgZsP0GhuevZzPPjGjzl2/glcfvAnKXjFNiPKKo/zVpvH/o1rf3EVCSlXHXYNBwwe1LxnOupUnG9+85vccsstPPXUU4yPj7e1LRQK7Lffflx44YVceumllEqlrkb0yU9+km9961t4ntcW9gEopSiVSixevJijjjqKM888kxUrVgAthXZ/d+7cySWXXMLDDz/MJZdcwmc+85lm37PyOxkA/v7v/541a9awYcMGKpVKs52UkqGhIQ4//HDOO+88LrjgAubPnz8Bc8uWLXzkIx/hmWeewff9KcfN8b3mmmv4wAc+8CaGcFn6x3+ERx6BwUFIEqvAWS9hpbBG9Nhj8L3vWSP62MesQTkFdPTd78Kjj0IuB3/3d7B8uTW+LE9nIC+9BGvWwMaN1lg8r2XccWzlqVatcT/0ELzznfDxj7d7PoBvfxt+/nPbhzS1905GSlnj3mMPa0A9kEajUNz7yj/zfzd+iZJf4l93Pcm2+jZuPPIrTa8CHTMw9to/vPQNHnjjfgC+sfmrXLvihuZ3k1HnrFsul/mt3/ot7rnnnknvqVQqPPPMM1x55ZV89atf5fbbb+e4444jTVOMMXiex1133cWNN944bZ8fe+wx7r77blavXs3v/u7v8pWvfIVisdgM7aSU3Hrrrdx1110AXHPNNZx11lkce+yxzRAsazyvv/46H/zgB/nhD3/YfYy1ZufOnTzwwAM88MADrFmzhgceeIAFCxagtW6O7w033MB99903rfxZuvHGG/nABz7Qk9fv3YAcs/FxGBiwypvPt8/yxliFHB2FF1+0xuL78ItfwBe+AFdfbY0ja0TVquWTy9l76/WWATmvpZTl99nPwsiIDdWqVWswS5bAvHm2zdiY9ZCjo/a+TZssv3y+vS+jo1AoWNnCEBYubA8lO0lKOOWUnofKGAMCNo2/QKhCcirPHirP91/5DsfOO573/8aFJDrBk1777NsI92IdU/QGAEOko5nhNujDH/4w99xzD0EQEEURSilOPPFEli5dSi6XY+vWrTz11FM8++yzAGzevJmzzz6bJ554giVLlhBFFnfLli0A+L5PHMesWLGCAw44gCiKEEIQxzFbtmzhySeftH0Qgq9//ets3ryZH/7wh/i+T5IkAOzYsQOgKdP27dtbfW8Yv1KKN954gxNPPJGNGzc22wIsWbKEAw44gDAMGRkZ4YUXXuCNN94A4Nlnn2Xbtm0sWLCgbVLaunUrQDPMW7p0KUEQdA1JnQx/9Ed/1BzPNyeEa0exyp0kMHcuXHaZ9TZZSlPYvNl6i1dfhTlz7Ocf/xje8572tYTj1y054YyoUoEvf9kaT6lkDeWgg+C3f9uGa2Fo2yeJbfPCC9ZojznGGk+n13MeKY6t8VxxhTWoztDRyRAErXVXD4tRh6SEQhuDNhqDYcAb4EvP38DR845jv9JSUpOixMT1hUCgaSQdekwgCCFIkgTP81i7di3f/va38TyPKIo4+OCD+eY3v8lRRx3Vdk+lUuHhhx/mc5/7HD/60Y/YtWtXW5gELcVzdPnll/OhD32o7Vq9Xufxxx/nox/9KE8//TS5XI4HH3yQ66+/nquuuqq5KHdhWednaFfWD33oQ2zcuJFcLketVmOvvfbixhtv5IwzzmB4eLjJY+vWrWzYsIG7776bI488kkMOOaS5jnFj6jCSJGF4eJi7776b/fffn2q1OiGxYIwhDMOmgfWSeJi5AbUjWk8QBNZoskZxwAHwO78D113X8kQvvtj6fjJ+WXLe53vfs/fOmWONZ/ly+LM/s17Q3efWKvPm2ddxx7W+myzx4b7L5SZOAp3ULQky3fA0/hVCEKURSihGol1c+/RfcNvxtzeNZ0ImalrOXbAy9//kJz9piGhlvOWWWzjqqKNIkqQtri8UCpx22mmcdtppfO1rX2Pu3LkcfPDBbQvuTuOuVquANRrP8xBCEAQBJ5xwAnfeeSdHH310s83tt9/O6tWrp83ggU08eJ7HHXfcwQ9+8AN836dWq7F48WIeeugh9t1336Y8zlMtWrSI008/ndNPP72rrJ3XhBCUSiV8359yPZRdB2bHsRvNfiPVKWe3zNvixXZR74yr4Yp7Sh8bY41ndNQmDPJ5e3+pBBdfbI0lSbqnuLW2mM7zOAPrpOw90Ep/d3tlZe41/e2MR0fsN/A29szvRaBCfrr1QW594a8BSE3aI6/pyT3okZGRRndsv5YsWdL87Hkevu83FcQZ1Yc//GHOPffcaWdeh+FSy8744zjm0EMPZeXKlc2227dv55VXXplSWcEquTOym2++uXkN4Mtf/jL77rsv9Xq9LSXtDClNU5IkaYaJ04Vcrl2aps31WfbV2f/p+M3egJxiZpXNKWQU2ZdSVtkXLrTXu4VKk/F95hl4/XUbplWrNizbYw9rINnwwhmvlK1Ud9a4p8Oa7OWMqmejaSeBNaC9C4v500P/glQnDPglbn3hKzy180k86ZGatKcF63TklG7+/PlAK/y65ZZbALv20FqTJElTGV2bJElI090z5qzsWWNxCj4dOY/3xBNP8OijjzbD0SOPPJJzzz0XrTVBEDRx3AaqlBKlFJ7nNb3hdOTGqJvxuNdMaHYGJEQr9HEKK2VLse+7zyp6ktgwadWq1n290vPPt94bY8O37OeZ8suSM4xCwf7N9qHTEGeBpZCMxqOsWvguLviNiygn4yQm4dpf/AVRWm+slWb24Dopuyt/2mmnARBFEVJKPv/5z3PxxRezcePGpsJl1wYu49ZLzO8ULE3T5iuKInzfZ/v27Tz33HPNtqVSiUWLFk1rRE6pH3/8cdI0JWjo1EknndTEzBrP7pIQgsHBQcAaujO87KuXcDNLu7cGcoqXJHYzs1RqhUxxbD3Ggw/C44/bNp4Hv/d7dsHfuaCfjFybLVtaqexiseXFsuut3SUprVdbu9ZOBN3CPK3tem7ffWdhRK0N1Y8f8qc8tmM9/za2kadH/pWbnruBPzl09YwrDjrJhR5aa1atWsVll13GzTffjDEG3/e57bbbuP322znxxBM566yzOPnkkznssMPaPJBSatrd92Jjkzp0iRusF6vValx66aW8/vrr5PN5qtUqp556ajMRMJViOqPYuHFjsy8AyxuT5e6UMnWjWq3GrbfeyqJFi5qTS5aSJGHlypUcf/zxPePtfhJBKZvxuu661rU0tSGbM6bhYet1zjnHZuw6F+JTkRO+UmltgubzE1PSu0su6TA2ZjeGJ5MhSWw/Pvc5m5zoRfaJYMjG3k9O5fjzwz7DxT+7kKI3wO0vfZ0TFqxi1cKTiHWEFNMkM6ag7AP/0pe+xL777svVV1/N6OgoYBVo7dq1rF27FqUUxxxzDOeffz4f/OAHWbhwId1KjJo9aPT7vvvuQ2tNuVxGCEGlUmHTpk2sW7eOzZs3EwQB1WqVRYsWcfXVV0+Qayq5XUraYS10k+WbQEopKpUKV1555ZTtpJQ8+uijHHHEEW0bupPR7nsgsEq9Y0f7GsGFPkFg//761zYMO/74qevSOim7wM/ynqGL7akv2WREpwyNReesPB02syaEINEJK+ceycX7/x9ufu5G8l6e656+mjtWrWQwGNpt/tlZ2ingH/7hH3L++eezZs0a7rjjDn71q18126dpyiOPPMIjjzzCddddx6c+9SkuvfRSK2uXsXCh25133smdd945qRxRFLFs2TLuuOMO9t577+YmaS/k9nscBZnM6JuxRuyVZoK1ewbkPEKxCO99r13fuMVXmtpKgMcesx5qwwZYv97uF51ySu8hnEsxu2oDp8xR7xuL0/YhSWw1wkUX2SRFdgHpZNTahp5z5+6m92knJewE8LEDLuPn237KEzse46XyZj7/y2u5dsUNjVa7j5M1oiRJWLJkCddddx2rV6/m/vvv595772XdunVs2rQJsGuBbdu28Qd/8Ads2rSJL37xi5NuMkKr5s218TyPXC5HqVRi2bJlnHfeeVx00UXkcrnmDN7rwryYrWEExsbGJvRrdylNUwqFAldddRULFy4kjuM2fi5x8fa3v52VK1f2VEALszWgQgHOPbc9G+boXe+C669vleHcc4+95gxiOnJthoZa+0Hj4zat/WaR60NjH2Faed6kWdBtoK4+7Bp+56fnk5iE77z8bY6b/w7O3ud/7XZqu1kBnlFul1kqFoucc845nHPOOdTrdR588EG+8IUvsHbt2qaHuOmmmzjllFM4++yzm4mBLG+wXu3CCy9kdHQUpRS+7zM4OMjixYvbDKBzL2Uqcm0WL17chvViY9/wzVj/AORyOT72sY81N2OnkidblDoVzS4LZwyUy/Z9mra/DjzQ1sCNj9twbudOG865+3rhDbDffi3ljSJbD+e+7xYSdqbVp8JzE8H4eCuU6+xHL/tJMySJJNEJ+w8eyGUH/THlZJxQ5fjCs59lV7SzWXA6E+pcv7jPUko8z2t6pDRNCcOQ0047jX/5l3/h8ssvb+4PgS0+hYnl/47vsmXLWLFiBSeeeCLveMc7OOaYYzj44IObdW8uq9er8ThZAQ499NC264888kjXdp2fs5PGVJjGmGY5URRFzf2j7MtVkvcq+5u3kZpN/TraZ5/Wd7UabNvmejI9X2f5y5ZZA9Ta/nWD6pIRWSPKrs3cqxfP4arKu6Wx3ZmiTrlmSa4K4YL9LuLUPc6grutsrb3BXz79aSId2WrtGfLMPniXkXObg+5YgptZ3XrjyiuvZN68ec3PLrSbbOat1WqArURwaexOjLbjHD2MlzPW448/nrlz5zZlWbduHa+99hqe57UpdtZgspupvXgMF5a5lHXnayabqPBmH+nuBFywoKWA9frMwi/H66CDbBrZFZ0+/7w9zuAMx3kI9xdayQZnGNMZUZq285rs9SZ6ISFEs8L6ysM+zcJwIYEMuf+1tfz4tXUUVGFGXqhTabdt29ZUiKyCZT0T2CMNbm8EmDbuz1YiZJWu2wnRXsnJuPfee3PWWWcBNk2+Y8eOZiZPKUUcx02jdf1xHtb3/Z7S3W5PKo7jrh6o0wtN54nemt9EcB0YHm69N8YmFWZCrgTIFaAaYxf73/iGPa6QNZSswbz+Otx1F3z/++2K30kuUTEwYNt43kR+7pX1eG9S1YAUNpTbI78Xf7zsz4m0rZcbT8Yae0K9G2r2YX/2s59ljz324IorrmDbtm3NTUKXAHBKB/Cd73yHF198sZnxcnsvky383+ps2BVXXIHnedTrdZRS3HLLLVx11VVA++an7/tIKXn99de56aabuOKKK9ixYwfZU6jdZHdVGmEYNmviOl8u8fHW7gNZibpfyyYAnOK54waT3dftujvOcNRRdqH/ve/ZbFgcw1//tT3Ts2KFxYkim/3buNF6qZERe23vvW2bbgaklF3Dff/7rSxcN9mMsWeB9thjRskEawTW4CbbW3FVCGfu/R4e3vogd/37PzInmIM2us1L9ULOq9x5552kacr111/Pbbfdxvnnn8+73/1uDjvsMObNm0eSJLz88svcfffdfPGLXwRaKeRLLrmkZ7zZUnZ2V0qRJAmHHHIIN9xwA5/4xCeaa6lrr72WtWvX8v73v58lS5aQpikvv/wy69ev5/7772+ua4rFIqtXr+66fyOEoFqtctNNN3XNwjlK05STTjqJ5cuXtx1MnIxmbkAu3MnukUxGAwOtYwDGtAwoS9l1SmfJR7aDH/mIDQPXrbPp8zC06fGf/ay1Ropji+eygnPn2grubpha23bj4/C1r03eB5e8OOggex4pe8J1EnJqEeu4WWEQd5zr6bZv8yfLVvPkjsf49/JLDAXDpCYlkL1vrDrFueGGGzj33HOJooitW7eyZs0a1qxZQ6FQwPd9jDGUy+VmqOLor/7qrzj66KPb9m5cyONCqJnWinXKBy1Dz2I7Y9Fa8/GPf5zt27dz7bXXAtbzrF+/nvXr10/Jf+nSpU2+bkwdpu/7VKtVPvWpT00r58KFC/nlL3/JvHnzpjWi3kM4N1usXGnf12rw9re3nx515AZm0SI44ghrOEHQfqIzy09K6wkOP9zu9jseTlGdZ/j934ePftTu3ZTLrfR2NlMGdl/qhBPsOR9XgpNV+OOPt/dVKtY4PG/6V2cyYQpyivH24eX4wqOclFk5x57FyXqU5m8FCElqUoaCYa5Z/nnmhfPZFe1kyB/m7H3+t23bA6ZTwDPOOIP169c3y/wdVSoVRkZGGB0dbSqWMYZ99tmH22+/nU984hNNhXFKc9JJJ1EqlajVasyZM6dZnzaTH+lwbc8880x832+eUXLnkzqLRI0xXHPNNXzrW99i6dKlxFOcGBZCsGrVKv7pn/6JCy64oGmIjs477zxg4ibtVOTWU73QzH5UBGxZztKl1htkDaIzU+WU9tJL7dHqefPsfZ3KfMop9tjD6GirUDTbxq1TnMH95m/CO95hj4E//7ythIhjazRz58L++1vDzlZ+dz7sk0+24dirr/Z0QA6Aww5r39SdgiQ203Xqnmdw2/H/wK5oF+9edKodGiaGc61QLuXIecdw5zv/mfXbHuGQoUM5cPBg66mmmeuy2bc0TVm+fDn33XcfGzZs4N5772XDhg1s2bKFsbExPM9jeHiY/fbbj5NPPpn3vOc9DAwMNOP+rDEefvjh/PznP+ehhx7ipJNO4sADD+wptMmS4/Wud72LJ554gmeeeYZTTjmlbYbPpuGNsb+08773vY+zzz6b7373u6xbt46XXnqJ8fFx8vk8e+65JytXruSMM87g8IYeZhMIjud73/tefvazn/HEE09MOBzYjVwIN3fu3N76aXohrVt/3ftu3011rdv9u8MvSSa277xmjDFpal+dON0we6UZ3Ke1Nrqjvfvc7bq7luq07bvOz71iJkli0rT93iRJTKVSMbVabcK9cRy3ydeUp4OH+9zZh+nk6oVXFldrbeI4nsAriqKu/Dvl78SYKfXaz937YUUXB7uM1GQZrs60b2f7XvllPVr2V32glSXrxqcbVhZzJuloF8Jl+U06VJmZtFFVIGkdPuukbMrU/YacWzs1fx+uhz2OLB+3ken2adzZmXyjGNd9Z7smm2FPVnZjWhXe2dCuWx96IZchm4xX5ylYtwGcXYe56ojshq0Qotk2K7/zpu5HUnqlmfRz5iFctzTuVJ+na98Lv27XsskJR51K3g1rMsxeqYf7sjG9YmI2aKp7gK4/X9VrTN7ZzhmHU64sdW56TiqPbP9Rw5mmsrsdhJuKV+c1ZxzQMq5uRy86a9vc35me8ZlKtk6aXRr7P4O6GcRUbf4HUzeFmq7dfzWabmP2P1v2rgbkrLrdwg3dc0H2+mRtp+fxVvGdnsd/NF771mjjepvHfJPxZjD2/3/i9c7D2uHMjXGCAbXFwI3UsLXyTHxqNEI6t2iva50ihGxvi0HrFNnRdnK+BtF071PwNVPwhZ55dO+HbkR4srd+zABPGz3JWHTi0R3PaDAzwJt07P+D8Zpj1FJQrVOEVJmp5a3Am56HaW5/9PZj8p00wYCyluqEqI+OkCYxyg8IS4MgFGkUEVfLGK3x80W8XA6AuDJOEtURQpIbnIOQCpOmRJVxdBKjghxBcQCAaHyMNK6j/IBgYBCEaOMbFAdQQdjgWyap1xBKkRscRogW3zSJ8cM8fsGW0ye1Kkm9ijGQGxhCeqoNT3od/ahVMGlCUBhAhbkWXlTr2o+JeDWSegVjDOHAELKRLo3KY6RRHen5hKUhhFDoOCaultFpgp8fyIxbFm/Y4mlNVB5HJ1Fr3AQk9RpJrYoxmrA4iGwsrKPyOGlUm4AXVcuYNGk8J5tEiKsVO55CkCs5PENUHuuCVyepVSbBqyM9r4WXJMSVcdI0IcjgJdUKcb2GAMLBYav4xuIlcYQXhATFEghIozpxtdLQgRKqUWbUHCPZeCZCodOUuItutXTAEBaHkL59JvWxEdI4Qno+uUFbamawhiRk9x/+n5EBuZujaplnfnAHlfJOxECepFZBKp9AhYh6gg4VsY6sInghvvFJ4xidV8T1ClIofC+HjDRaQeJp0noNzw+hlqC8gDQUJLUKygsIVA5qMTqUxCZCJwm+n8c3HjqOSHMtvoGfR9Y1qWdIVItvIEN0NUIXPOK4Chp8P4eXSlIdk4aSpF5FSZ/As3KkoSRxeF4O33ikcYQp+ET1ChJJ4OeQkSGVJtOPHIEI0PUInVPESQ0M+F4XPOXb/tVjUl+QkKCTGN/P4RsfHUWkeUUcVZFIfD+Higyp0KS+IWn0zxeB5ZFTxGkdUo3v5/FSidYJaU4S18oo5eOrPLKekPqCWMToKMYPWng67xFHFQQC3y+gIk0qDIlvSOtVPC/EVzmo1SfiaYlO4tYzkR6Bl0PUU7QniGWCjqLGGPl2jNrw8qgYUlJSHztGWR3ISaIMHrXYZk1LeaLauNUBh+cLEqlJo7odZxFgohhd8Bs6YPC9EJUINIY0gLheRSkPH5+9DjiCxSvfAVKg0xSR+amu3U4iGGMI8kWWHPFOnv3J3ex4dRNq3hAmTTG1BDEeoRIwcwroQGJqOyFKkWMRIggwc3IYrTGVBFFJkNUEhgqYgoeuj2DqEd72FAohZjBEx6NQTRFjESrN8K1avmosQoQBerjBt7zV8q2lMJhv8iW2Msid0vJQYCrboZ6gxmJEMYceCtFJArUUMR4hYwNziuiw0Y84RY5GyMDHDOfRaEw5RVRi24/BPKYYWLxEI0fr9uhBJ145QeQDixentn8Ob7iAySl0dSfEGjkaIXwP5mTwqjGyMhFPjNWRRliZPTDVHVBvjFE+RA/n0HFi8coxMtIT8cYipOeh5+Ts7FveDtUYVUmglMcMBOgog6cFzC2ifWHxosYY5QP0UB6TJJh6ihiPkXUNw3lM3kPXdrbGSHnoOXmMBFPejqglyHKMKOXRGTw5HiG1sGMfCEx1J7pSRY7HeOVCSwcqKaIcIWsahvKYgo+O49bz2ykxcwtoCaaWQNXiyWIOPdjQgVSz7ad38drGJ1l26vsozltkedMRiU1hSOrTn/70p7MXsuUUhTnzWbJiFbIcs+vFjYgwQOVCRCFE+gFypI4yAlEIEL6HLBWQCajRCBn6iNBH5AJkMWc7VTf23lyIKOZQ1QRZTpCFEOErZDGP8H3krhpKS0QhRPgeolRAxiBHImQYtPgWclYZ6hpRyFkeA3mEUMiRGlJ5iLyPDHzEQAFZS5HjMSJv8UQxhwxD5K46KgVRzLX6kYLcVW/HK+aQYzGiljZlFgM5lLQyS6mQ+RAReIgB6yXleNS45tu+h6Edn5SWzKU8SgvkSB3p+4icjwgtnionyGraGAvbP6k821YoRD5ABo0xqjcmkFxoZW6MtRypI5N2PKEFaiRC+h4i5yMbeNLh5TN4no/aVbe7UvkA6cYoMi08v4GXzzXwTAavgETacfZ8yFndkAMFq9SVpNlWFPOW/0gdZSQUQlQYooaKiNg0dCtAhB4iF2Z0IG08v0b/hELubOhAzkeGvpWjkjaeSa6pA+OVnWx54hFy4QCDey5u7Fe1fvB+Km80wYDaMnCN0o55v3EQwwuWsPP5X1Krl1G5EC01FHxEJUaUYwg9O3sGyir9SA2hwQS2RMUUfEScIkfrGAXGA5P3bL3yrjpCKYwHWhgoBlCJkRm+OpBWMXdVEaaDb2KQo3WE71kv4AH5ADlaQ0QphD6aFJ23P74nd1VtvOsJtNCYYoCsJYjxdjwC37bVYAJp+1fwEalBjtTAVxgp0A5vPELUEkzoYdDonLIL1112bWN8gZbG8qglyPEIAg8tDNoXEHrIkRoiNRPxRuvgKXu/JzB5H1mOrBcOPTsWeVuzJ0fq9vn59je2TTGwRj9eb+KZJl4dkXTgaawcnrLjqYBCA6+atPByHsJT9pkgM3ghot6Op30BucDqRawxjkfBRxiQuyye0wFTCKxxVd0zsTI28ZwO4HSrMUaBZ71OU8tHXnAAAAaqSURBVAfqiCi1z8SkmIJnn8lISweE76HziteefZLq668xf79lKM9HN47TTOWNunqg5vvmokpTnLuQvQ45itqrrzH66r8jCyFIickrJMIKqiT4dtDJB8hKgqomEPogwYQK4Xmk20ftwtBXaF9C6Fs3H2nI+RhhjUsi7YB34SsrCeQyfBuzljRA6NlQoRAgGyGL8D1QsqU4LpxysuV8BAI10uoHCigEyEqMLDf6oSwevrIeyoAJPcuj4COSRkgWZPByvsWLNLi2eVuwKEfqSCUxvmooaoCsJqhKjAh9249AIYJG/1Ig59kxKvjI1CBG6gjfx3gNvLxvZ+VaCrmg0T8PISVyZw0hFAQKI43Fqzc8c+jbCcFNViMRMjWt8cz71nOORghfYTyJ9iyeKieIWuaZ5BRC2jESQiCcYhcCZKRRjckDJS1e6NnnFOsWj7yHNJL0jZ0gQObDhg74Dd1KW+MZKoSnrFdt0wHf4o3FiMDDZJ/JaOOZBB5IgSzl2bn1ZbY9s4HBeXuRnzOvzQN180ITDKgZxtHas7DlHClekGPPQ44gH5TYuWkjcVy1BhEKdKiQYxGmWscogVEGXbA7yHK0jk4TjBJoX1hXO1KDKLZtPTsrk2gYqdpSFiXQocA0lL2TLxjESM2uy5RAewKdV1CNMeN1O4tJ0DmJ8SRitIaux9b7KTBFH5IURmp2JlTCxtw5DzEeYSp1O/tKLJ4QyJEqOkmsB/CE5VFLEGO1Njx8ZfFqUUNmh6dhtGaPQEuLR76FZ6SVTectnhht4WnPKgP1BDrxAotnXP8k6KL1XGI00z9fWKUsxx14EqRAjNTQSdwYzwZeNAneWB1dazwTCWnBQ2hjxzNNMUq28CoxppzBy1nPLUfr6DhuPb+CB1Fq8XA6IO2EV46hnmCksTwKdvkuRqoNPNs/nfesDozVrLeWtn9NHYhiG/00jItEWzyTYiTIYo6qrvLKL9aTjI1RWrg3fpjr3QNlrGhCOYcxGjAM7bkve+6/HMbrxCO78IzClyFCKfIiTyk/D1OPCfBRfoA0gqFwLoHM2TAuNSjlUVKDFIJB21YEKN9HacWc4kJkKpAJNuvX5DsfXY8ICCxfJEPhPAIZIuKUQIZI3yfQPsPFRRAleFrhqRApJSWvA88LUFoyXFiI1CBTga9ChKfIkWewMB9dr+Pj43kZPJVH1BMCESB9H197DBf3gNji+SpAKMWAKlHIDaPrdQIRWjyjmFNYgNISmZgGnkfO5BgquP75qAbeoD+X0CtAPSEQIdL3LF5hISLReKmyPJSiIAYYyM/B1KJW/4xkKDcfDw8RawJl16s5EzJUWICJYgLTwBOSQW+YnFds4AVIz8c3PsP5BQ08afGkpCiKFi/7TIxkuA3P9i/UAUNFi+cbrzGegkF/Djl/AJo6EOBpyXBhD4unpQ1hlUdRFhnIz23g+SgvRGoYCucTyMDiidBui2if4cJCiGM87eF7IUIqqwPhINrhBVYH5hQW2XVvbAj9AioIGPnVZvwgz5x93tY1QoMeSnmyhYXuP8jVOiU/PI9DT38/ab1u93jSBC/IEZQGEUIQl8eJao20ZaGIny9gkoR6eYyoMk6uNEwwUGruPST1GlJKgoFBVBCQRpHdk5iCb1Ao4uULmCSlXh4ljSOU5xOUBpHKI6lViSrjGGPww/wkeCVUEFq8yhg6SeyeRGmogVcmrpUh2480pd7cU/IJBwaRnkdSq1k8rfFzFs/tdcS1djwdR9TLbv8iJBwYREhJXCkTVyfiReUxksguwoOBEtLzSWs1ouo4Ok3xc4UM3jhxvYoQgqBYwgtz6DimXh6zeH5IWHJ4Fds/Y/DzRfxCsQ1PKs8+E98nrdcazzq141kaBGP3uyyeJCgONPGi8ljb/qGQiqRasftSxhDkCvjFAUyqG3i1Bl4J5QdWt6plosoYQX6A/Bx7ViwqjxPXKkgh8Qt2L00nicVr7Cn5xRJSKZJqlag63t6/pg5UkZ5v95p8v13nwrzdKyRbXNDFQKas1e6g9nLz1OgZlIrvTvn7hOszadvH6wFv4vW3FK/L9W4yvJV4u8tjsu9nVEw6wRuRrfCdrBapzVjdGyYWfLbfPxnfSSaBGfHo42XxJiK+pXhdpvGWDJO0nY2+THkkYSb9a3miLM24GnvyCt8ZFOJ1zalPdv9MCvxmwqOP998G77+Avky2D/TW/KxVn/r0P4T6BtSnPs2C+gbUpz7NgvoG1Kc+zYL6BtSnPs2C+gbUpz7NgvoG1Kc+zYL6BtSnPs2C/h86bSjwad0npQAAAhNpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0n77u/JyBpZD0nVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkJz8+Cjx4OnhtcG1ldGEgeG1sbnM6eD0nYWRvYmU6bnM6bWV0YS8nIHg6eG1wdGs9J0ltYWdlOjpFeGlmVG9vbCA5LjcxJz4KPHJkZjpSREYgeG1sbnM6cmRmPSdodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjJz4KCiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0nJwogIHhtbG5zOnBkZj0naHR0cDovL25zLmFkb2JlLmNvbS9wZGYvMS4zLyc+CiAgPHBkZjpBdXRob3I+U2FyaW4gU3VrdW1hciBBPC9wZGY6QXV0aG9yPgogPC9yZGY6RGVzY3JpcHRpb24+CgogPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9JycKICB4bWxuczp4bXA9J2h0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8nPgogIDx4bXA6Q3JlYXRvclRvb2w+Q2FudmE8L3htcDpDcmVhdG9yVG9vbD4KIDwvcmRmOkRlc2NyaXB0aW9uPgo8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSdyJz8+LP/f4wAAAABJRU5ErkJggg==";
		var logo = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAgAAZABkAAD/7AARRHVja3kAAQAEAAAAPAAA/+4ADkFkb2JlAGTAAAAAAf/bAIQABgQEBAUEBgUFBgkGBQYJCwgGBggLDAoKCwoKDBAMDAwMDAwQDA4PEA8ODBMTFBQTExwbGxscHx8fHx8fHx8fHwEHBwcNDA0YEBAYGhURFRofHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8f/8AAEQgAPQDQAwERAAIRAQMRAf/EALwAAAEEAwEAAAAAAAAAAAAAAAACBAcIAwUGAQEBAAIDAQEAAAAAAAAAAAAAAAIFAQMEBgcQAAAEBAMDBwgECwgDAAAAAAECAwQAERIFEwYHITEUQVEi01UXCGFxMrJUlKQVQjOzN4GRsWJyknOTNHUWoaLSIyR0VhhTwyYRAAECAwIHCwoGAwEAAAAAAAEAAhEDBBIFITFBUXETFPBhgaHB0ZJTFQYWkbEiMlJicoLSM+FCoiM0NSQHF/H/2gAMAwEAAhEDEQA/ALTwREEXpYIuezXqBlPKijZO+veEO7A5m4YailQJiAG+rKaUqg3xqmT2M9YqworrqKoEym2rOPCOVaHv50s7Z+HcdXGrbZWdd3hmu6vjbzo7+dLO2fh3HVw22VnTwzXdXxt50d/OlnbPw7jq4bbKzp4Zrur4286O/nSztn4dx1cNtlZ08M13V8bedHfzpZ2z8O46uG2ys6eGa7q+NvOjv50s7Z+HcdXDbZWdPDNd1fG3nR386Wds/DuOrhtsrOnhmu6vjbzo7+dLO2fh3HVw22VnTwzXdXxt50d/OlnbPw7jq4bbKzp4Zrur4286O/nSztn4dx1cNtlZ08M13V8bedHfzpZ2z8O46uG2ys6eGa7q+NvOjv50s7Z+HcdXDbZWdPDNd1fG3nR386Wds/DuOrhtsrOnhmu6vjbzo7+dLO2fh3HVw22VnTwzXdXxt50d/OlnbPw7jq4bbKzp4Zrur4286O/nSztn4dx1cNtlZ08M13V8bedHfzpZ2z8O46uG2ys6eGa7q+NvOtll7VfImYrona7RcuJfKlMYiWCsSYECo3SOQpdwc8TZUseYA4VzVdyVVOy3MZZaN8c666N6qkmCIgiIIiCIgi9LBFXvxT/x+Xf2Tr1koqbyxt4V9A7k+rN0t5Vpm2l2nDXK1jvOZMyubYremwLppgmBy1UlE4FpIcZFrDfEBTSw0FzoRXU++610+ZLkymvEt0N2FdDl/QHT7MNv+YWbMrp4zrMmKpCJhI5d5RAxCmAdvKEbWUMtwiHRVfVd6auQ+xMlNa7h505unhwyXarevcLhmF22ZNiCouucqVJSh5izjLrvYBEkwUJPe6pmPDGS2lxxDDzrSZe0k0lzG/FhZc2unjwqYqikVECiBCiACaZ0yhvMEa5dLKeYNdFdlVf14U7bc2S1rYwx/ilZj0g0oy29TZXvNrpk6VTBZNIyQGEUxESgaZEzBvKMdsq5HTBFsSOBU83v6+WYOawdJan+idCP+cuP3Bupjb4emZncS1/9CPss/Un9k0u0dvlzStlqzi5dP16sJAqNImoKJjbTJFDYUB5Y1zLiewWnRA4FOX3/AHvMGtYT8yw3HTnRW2v3FvfZ0covGqhknCIozEpyjIxZgkIbPJEmXA9wBAMDoWHf7Ac0wLWR+ZNv6J0I/wCcuP3BupiXh6ZmdxKP/Qj7LP1J9ZdL9HL3c0bZa84uXT9xVgoFRpE1JRMbaZIobClEd8QmXC9gtOiBwKbO/wC55gGsj8y9vmlmj1iuatsu2cHLV+iBRVQMjUIAcoGLtKmYNoDzxiXcTni02JHAkzv89hg5rAfmTEMk6EiMv65cfuBD/wBUbPD0zM7iUP8AoR9ln6l1Fl8Pun98a8VZ80Lv0AGRjoCgekR5DAATKPkGOaZdNgwdELoZ34mvEWsYfLzrYf8AVzLXbT39VH/DEOzW5yp+NJ/sM4+dclmDTLRywODNbjnFwDogyO3RIRdQo8xgSIekfPHTKuF8wRbGC5pvf9zMBazjSLDpxoxfHJWrHOTgHRxkmiumRAxhHcBcUhAMPkAYzNuB7BExhwJL/wBgOeYBrONdh/1cy1209/VR/wAMcvZrc5XT40n+wzj51HWgqYJasNUgGYJpuyAI8oFTMEcdEP3fKvQ953RoCd9vnVr4vV8sSYIiCIgiIIiCL0sEVe/FP/H5d/ZOvWSipvLG3hX0DuT6s3S3lWg1V+7XTf8A2SvqIxqqvts0LuuP+bVfEPO5M9EM/nypmcrJ8cSWa7CRNxVsKkoOxJfbybaTDzDPkiNHPsOgcRW7vJdW1SLbPuS8W+Mo5t9dL4ic/muFxJk62HE7dqYqlyEm3EcfQR2bwJOY/neaN9fPibA4VW907rsMNS/G71d4ZTw+bStR4afvDX/ly32iUarv+5wLs74fxB8Y8xTnxOjLO1vHmtpft1Y99c/2z8XIviN7fcGhdZbPDZlJ3bWjo9zflO4RTVMUooyATkAwgE0/LHI+95gJEAull1SyAYldHk/QrLmVsxNb4yfvF3LUFAIksKVA4hBTGdJCjuNzxzz7yfNYWkDCuiRd7Jbg4EphmDw7WC9X1/d1rs8SVfrncKJEKlSUVBmIFmURlE5V6PY0NAGBQm3Yx7i4k4VBllyezuGpJcpncKEaC+XZ8SUC4lKInkaQhTMaIu5k8tk6zLAFU0uQHTrGSMFPuTtBbHlfMbS+tro7cLtK6EVSpAQ2ImZMZ0lAdxoop95PmMLSBhV3Iu5st4cCcCh/XFEq+rz1AwiBVeCTMIbwA6KZRl+OLa7jCnB0qqrxGeRoUjqeF/LAkMCd5fFPLomMCJgAfKAELP8AHFeL4mZgu/slmcqNMjLXXI+ryFpI4rk/C2PsOYEWSUOBAES+SoDBzDFjUhs6ntQyRC4Kcukz7O/BSv4gtQn2X7U2sdqWFC4XQpjruCCIHSbFGQ0CG4yhtk+YBiruulExxc7E3zqyvKpLGhrcZXD6Y6B/1HaEr5f3arRm76bRq3pBVRP/AMhznA1IG5AlMQ2x21l56t1lgiQuOku7WNtPONZdSvD8SxWZe9ZedLO27QoqO2bikVCpF2mUTOQCzp3iAhujFJelt1l4hFZqrtsNtMOJdR4eNRH14auctXVYzh1b0wWYLnGZzN5gQxDGHfhiISHmHyRzXpShhD24jj0rouyqLxYdjCjrQv73kf0XvqGjxlH97yr7R3l/rz8nIrWReL5akwREERBEQREEXpYIq9+Kf+Py7+ydeslFTeWNvCvoHcn1ZulvKtBqr92um/8AslfURjVVfbZoXdcf82q+Iedye5l06G66QZezVbkqrhbmQFuBChtValObp+UyXq+YInMp7UlrhjAWijvbVXjNkPPoPf6O878fOsmiOnp3bK4Z0uhBMkgi4Jain2idagwHXGe+j0S/nT5oUciILzwKPeO9QxzaaXlLbW8Mjefe0rX+Gj7wVv5ct9olELv+5wLp74fxB8Y8xTrxODLO9vEeS2k+3Vj31z/bPxci+I3t9waFgZ+HzUV00QcpP2YJLpkUTAXC4CBTlAwTAE+YYOvSSDCB8gWG3bNIjEKS9GdMc05OuNzcXpygum7RTTRBBVRQQMQwiM6yklvivr6xk0ANEIKwoaV8om0calWKxWKqnlH7/ifzl5+VWPT1H8X5RyLzcj+T8xVrI8wvSKp2up1U9WrgokE1SAzMmEp9IESCXZy7Y9RdojIEd9eavAwnmG8ndz1o1mZJgV+YzAFplTOsxKiIiG+gVCyEQnEGXfTuxYeFTfX1Ax4OBbjRDTm5X2+I55vDgqrRFc66Mzgosu7AwzOpKdIEN0ultEZbJRpvGraxuqaMPItt30pe7WO3FNfE40cEzmwcGAcBe3gRE3JUmqesP74D+GNlzuGrI31C9mnWA7ynfT66MLnkmyOmJgFAWaKdJfoHSIBDkHylMUQijqWFsxwOdXNM8OltIzJ1nC4srdlW7PXxilaotFhUq3DMglAvnMI0hEZDS54AxxUpzg1hJxQVc/Dazcq6gGXIA4TViqK5uTpiQpQ/CP5I9BezgJUM5VFdYJmx3k20L+95H9F76ho+fUf3vKvuneX+vPycitZF4vlqTBEQREERBEQRelgir34p/wCPy7+ydeslFTeWNvCvoHcn1ZulvKtVqPabrcNNtOwt7Jw8FNipicOkdWmoiMqqAGU5RCoYTLZAZF03RUS5dbU23NbFwxkDK5TXpSzWR03sbV4gZJUrWhZBYolMEzGmUxTBP8cWVMISwCvF33MDqyY5piLWMLdvWLNhlpyzZIkbtG7RRNFFMKSkKVMQAAAI2OADYDMuOXMc+cHOMXFww8Krh4aPvBW/ly32iUU93/c4F9F74fxB8Y8xW48R1jvVwzkwVY2507RLbykMogioqUDYygyESFEJyGPdXTNa2WYkD0l8UvSW50wEAnAtW21N12bNkmyLFwCSJCppgNsMMikCkNtHMEbDR0pMYjpLUKupAhA+RdPp5qFq/dM5W1hfWqydpXOcHRzsBRKAAkYxZqCQKekARzVVLTtlktPpaV00tTPdMAcPR0KeIpVcqsWVbBfktcyPFLY7Iz+buz8SZBUEqDCrI1YlpkM9849HPmsNNCIjZHIvPSZThUxgYWirOx5xehVY9X7BfnWrrh01tjtdsJ2Ml0kFTp9FNOrplKJdktseioZrBTwJEcK8/WynGfEAwwKd9QslMs4ZZcWlxIjj61i4HekuUBoN5hnI3kGKWlqDKeHDh0K4qZAmsLSoR0cuOcclZpWs91tL4tneq4DwwN1TpouCjQVcpgKJaOQwhvCQ8kXNe2XOZaaRaG+qihdMlPsuBslTFqhp20zvYODE4N7k1MKtudGARAhxCRinltoOGwfwDyRU0dUZL45DjVrV0wnNhlyKv7BTWDTN2u3btnKDc5pqEwhdMlB3VlMUBKAjzgIDzxeOFPUCJIj5CqRuvpzADBxJVwfaxalrIslmzlZoBgMVIiItWZTB9NQxgAoy/OMPkg1tPT4YiPlKy51RUYIYOJTzpXpu2yRYzoHUK4urwSqXByX0REoSKmnPbQSYynvGYxSVlWZzo/lGJXNHSiS2GU41BOhf3vI/ovfUNHl6P73lX13vL/Xn5ORWsi8Xy1JgiIIiCIgiIIvSwRQF4nmL50/y+LZsquBEnVYpEMeUzJynSAxV3i0kthvr3nc2cxjZtogYW4zpXC2rUnWC1W1tbWCjlJm0TKi3S4EhqSFCQBMyQiP4Y5m1E5ogMWhXU+6btmvL32S5xifT/FOu9zW32hz7gn1UZ2qfuC1dhXX7vTP1LutKs76g5gXvzbMyqp2iNsWURBRsVAMSYF9IpCT6Ijsjqpp0x1q1mVHfd3UcgSzIhaMwR9KODyqFMn3/ADRYrkZ9lsxyPhRFI5k0QXHDMICMyiU4byhtlFbKe5pi3Gva3hTSJ7LM+FmOeGFdj3ua2+0OfcE+qjo2qfuCpuwrr93pn6l73ua2+0OfcE+qhtU/cE7Cuv3emfqXne5rb7Q59wT6qG1T9wTsK6/d6Z+pHe5rb7Q59wT6qG1T9wTsK6/d6Z+pHe5rb7Q59wT6qG1T9wTsK6/d6Z+pHe5rb7Q59wT6qG1T9wTsK6/d6Z+pHe5rb7Q59wT6qG1T9wTsK6/d6Z+pHe5rb7Q59wT6qG1T9wTsK6/d6Z+pHe5rb7Q59wT6qG1T9wTsK6/d6Z+pHe5rb7Q59wT6qG1T9wTsK6/d6Z+pHe5rb7Q59wT6qG1T9wTsK6/d6Z+pHe5rb7Q59wT6qG1T9wTsK6/d6Z5173ua2+0OfcE+qhtU/cE7Cuv3emedZdCLfdU9T2bh00XSKZJ0J1FEjkLUZI3KIAG0YzRNOtBIzqPeafLNC5rXNOFuXfVqIu18wSYIiCIgiIIiCL0sEXsoIiUERKCJvcWx3Nvct0xADrJHTKJpyATlEoT/ABxhwiFslOsvBOQrksm5KtOnmVjptSA4fCUp3zvcZZX0QDlpIUR6IcgeWOCaW0skuAiRxlWl4XjMr58XYG/lGYc66pj80mbjcEQEAEmDUAgPKA1fljdTa/DrbPyx5VVzLH5Y8KZfPQ+ecB0MD6qurp41NUpT9GWzzxx9pf5OqwWcW/ax+SHGt2zft2suPgS7zcnjNRIEilKgYphUcKFOcgCEpFGjaWfOMSvCsmSSLIAblcQSNGDFpWJElrwY483/AKslyuYtG7VcJHTWVIRQxQE3QOAiIlANo7tkbKus1TGOxhzgDlwHMoypNskZglWm4i+4k0pJpKimnsMURLSA9IDbZ7YlQ1evtnI10B5Ak6TYhvhLu74WLBRwQAFQJFTKae0xhluDaPmiddU6mUXjHk0qMiXbcAkWa4i/ZgqcS4oCIHAk5Sn0RkIjKZdsohd9Xr5dowjvcWiIyLM+VYdDIl3V8Zk1xCErVOciSRRGRajjSFQ80TrakyWWgIkkAaTgwrEmXbdA4saWyC4gBweikIgIYZkagmEtswNOJ0+ugdZZ3rMeVYmWPyx4UwaX0F7wqy6GD0iIGAZmE6cq5hPdt2eaOGReVuoMvBZwhueLcf4aFufTWZYdly8OJY7ze3DJ5gpnRITBxQFYDiJjVCFBaR5ZRrvC8XyZlkFoFm16UcJjiEFKnpw9sTHHDAs9yurhtbG7oClSUWMmU4KzEpKw2zlIejG+rrXy5LXgBpcWxtZI8yhKkhzy3HCOLLBKtVwdPmi55J4iZjERWLVhKSCYGAB2ynsGM0VW+fLccEQYA4bJ386xOlNY4DDyhJtVzePljFMiCJG5aHVU5489pSfmgG2fljFFWTJziC2yG4HfFmG8OVJ0lrBjjHFoW1izXOkwREERBEQREEXpYIvYIiCIgiIIsL3heFV4qnhqRxa/Rp5Zxpn2LB1nqQwxzKTLVoWca19k+VVKcHjVyCePizo+jTifR80cF3aiJ1dqOD1rWLJC1kW+ot4LUOCHIsP/AM3gcleP5cfGxP1/S/sjV/h2d+389q10se6Cn+7Hg4IQ8iy3v5TWTjcaqgZ4OL9X9KvD2U88423jqIjWWow/LaxZYwyaVCnt/lhww5U4cfLcJlX9Vip8JTOVcho3cko3zdTZlx9W02zphgUG24uzwMVkY8Hiu+HnXjf6ic/rKQ3T8kt0bKbV2n2Mdr0tMByLEy1ARzYNCReOA4T/AFtWHWXDw6q8SfRop6VXmiFfqtX+5GERCEYxyQhhisyLVr0dw31jsfyrAV+W1Ydf+ZVX6cgn6fLzxru3UWTqcUcOPHw5c6lUW4i3jTi58DwKvHS4aXTq8+yUts57pR0Vmq1Z1vqZVrlWrQs+sm1m+XYS/CY1UwxcfExN3R+s27t0o5qDVWXau1v2rUf1LZPtxFqHBDkTdv8A05hM8CmrEDh6Z4te30/p89VUaJWyWWWcdoWfajhx5c8YqbtbF0c2HMs9x+TY6/Genw3+bOcsGvkly1bpbY3Vez2nazHYw/DHzx4VCVrICz7XGsrngOFacRXh4qWBVVVifQq5fPONk7VatluMLTYZ45I/iostRMMxjoypVs4Clxwc8PFNXvor+lRPZKfNsidHqoO1eK0dEcsPwwLE21gtZkphwdbrhp1YxuInP6yQTlPySiVNq4vse16XxYFiZawRzYNCdx1LWkwREERBF//Z";
		doc.addImage(logo, 'JPEG', paper_width-100, current_y, img_width, img_height);
		if($scope.print_config.kot){
			del_doc.addImage(logo, 'JPEG', paper_width-100, current_y, img_width, img_height);
		}
		if(doc.autoTable.previous.finalY > current_y+img_height){
			current_y = doc.autoTable.previous.finalY+line_height;
		}else{
			current_y+= img_height+line_height;
		}
		
		var customer_info = [];
		var next_y = current_y;
		if(order.customer_id != 0 && order.customer_id != "guest"){
			customer_info.push({id:'ID: '+order.billing_address.phone});
			if(angular.isArray(order.shipping_lines) && order.shipping_lines.length && order.shipping_lines[0].method_id=='local_delivery'){
				customer_info.push(
					{id:order.shipping_address.first_name+' '+order.shipping_address.last_name},
					{id:order.shipping_address.address_1}
				);
				if(order.shipping_address.address_2 != ''){
					customer_info.push({id:order.shipping_address.address_2});
				}
				if(order.shipping_address.city != ''){
					customer_info.push({id:order.shipping_address.city});
				}
				customer_info.push(
					{id:order.shipping_address.postcode},
					{id:order.billing_address.phone}
				);
			}else{
				customer_info.push(
					{id:order.billing_address.first_name+' '+order.billing_address.last_name},
					{id:order.billing_address.address_1}
				);
				if(order.billing_address.address_2 != ''){
					customer_info.push({id:order.billing_address.address_2});
				}
				if(order.billing_address.city != ''){
					customer_info.push({id:order.billing_address.city});
				}
				customer_info.push(
					{id:order.billing_address.postcode},
					{id:order.billing_address.phone}
				);
			}
			
			doc.autoTable([{dataKey: "id"}], customer_info, {
				startY: current_y,
				theme: 'plain',
				styles :{
					cellPadding: 0,
					fontSize: 14,
				},
				drawHeaderRow: function (row, data) {return false;}
			});
			if($scope.print_config.kot){
				del_doc.autoTable([{dataKey: "id"}], customer_info, {
					startY: current_y,
					theme: 'plain',
					styles :{
						cellPadding: 0,
						fontSize: 14,
					},
					drawHeaderRow: function (row, data) {return false;}
				});
			}
			next_y = doc.autoTable.previous.finalY+line_height;
		}
		
		var date_info = [
			{id:"Date",info:$filter('date')(new Date(), "MMM d, y h:mm:ss a")},
			{id:"Login",info:$scope.loginInfo.user_login},
			{id:"Bill No",info:order.order_meta.bill_number}
		];
		
		if(order.id){
			date_info.push({id:"Order No",info:order.id});
		}
		
		if(order.order_meta.delivery_van != '' && order.order_meta.delivery_van != undefined){
			date_info.push({id:"Delivery Van",info:order.order_meta.delivery_van});
		}		
		date_info.push({id:"Wg",info:$filter('number')(order.order_meta.weight,2)+" Kg"});
		date_info.push({id:"Total Qty",info:$filter('number')(order.total_line_items_quantity)});

		doc.autoTable([{dataKey: "id"},{dataKey: "info"}], date_info, {
			startY: current_y,
			theme: 'striped',
			styles :{
				fontSize: 10,
				cellPadding: 1,
			},
			margin: {left: paper_width-100},
			drawHeaderRow: function (row, data) {return false;}
		});
		if($scope.print_config.kot){
			del_doc.autoTable([{dataKey: "id"},{dataKey: "info"}], date_info, {
				startY: current_y,
				theme: 'striped',
				styles :{
					fontSize: 10,
					cellPadding: 1,
				},
				margin: {left: paper_width-100},
				drawHeaderRow: function (row, data) {return false;}
			});
		}
		
		if(next_y < doc.autoTable.previous.finalY+line_height){
			current_y = doc.autoTable.previous.finalY+line_height;
		}else{
			current_y = next_y;
		}
		
		var header_row = [
			{title: "Product",dataKey: "product"},
			{title: "Qty",dataKey: "quantity"},
			{title: "Price("+$rootScope.aiv_info.currency_symbol+")",dataKey: "price"},
			{title: "VAT("+$rootScope.aiv_info.currency_symbol+")",dataKey: "vat"},
			{title: "VAT%",dataKey: "vatper"},
			{title: "Total("+$rootScope.aiv_info.currency_symbol+")",dataKey: "total"}
		]
		var del_header_row = [
			{title: "Qty",dataKey: "quantity"},
			{title: "Product",dataKey: "product"}
		]
			
		var product_info = [];
		var del_product_info = [];
		var out_of_stock = [],pos = 0,sub_total = 0;
		angular.forEach(order.line_items,function(item){
			var prdt_name = angular.isDefined(item.title)?item.title:item.name;
			var vat_per = 0;
			if(parseFloat(item.total_tax)){
				vat_per = parseFloat(item.total_tax)*100/parseFloat(item.total);
				vat_per = Math.round(vat_per);
			}
			var stock_style = '';
			if(order.id == '' && angular.isDefined(order.order_meta.out_of_stock) && order.order_meta.out_of_stock.indexOf(item.product_id)>-1){
				out_of_stock.push(pos);
			}
			var unit_price = parseFloat(item.subtotal)/parseInt(item.quantity);
			product_info.push({
				product:prdt_name,
				quantity:item.quantity,
				price:unit_price.toFixed(2),
				vat:parseFloat(item.total_tax).toFixed(2),
				vatper:vat_per,
				total:parseFloat(item.subtotal).toFixed(2)
			});
			del_product_info.push({
				quantity:item.quantity,
				product:prdt_name
			});
			sub_total+=parseFloat(item.subtotal);
			if(angular.isDefined(item.variations)){
				angular.forEach(item.variations,function(value,key){
					var df_flag = $filter('split')(value,'###',1);
					if(df_flag == 'T'){
						var option_key = $filter('split')(key,'###',0);
						option_key = $filter('split')(option_key,'_',0);
						option_value = $filter('split')(value,'###',0);
						product_info.push({
							product:option_key+':'+option_value,
							quantity:'',
							price:'',
							vat:'',
							vatper:'',
							total:''
						});
						del_product_info.push({
							quantity:'',
							product:option_key+':'+option_value
						});
					}
				});
			}else if(angular.isDefined(item.meta)){
				for(var i=0;i<item.meta.length;i++){
					var option = item.meta[i];
					var df_flag = $filter('split')(option.value,'###',1);
					if(df_flag == 'T'){
						var option_key = $filter('split')(option.key,'###',0);
						option_key = $filter('split')(option_key,'_',0);
						option_value = $filter('split')(option.value,'###',0);
						product_info.push({
							product:option_key+':'+option_value,
							quantity:'',
							price:'',
							vat:'',
							vatper:'',
							total:''
						});
						del_product_info.push({
							quantity:'',
							product:option_key+':'+option_value
						});
					}
				}
			}
			pos++;
		});
		
		doc.autoTable(header_row, product_info, {
			startY: current_y,
			theme: 'grid',
			tableWidth: 'auto',
			tableLineColor:68,
			styles :{
				fontSize: 10,
				cellPadding: 1,
				halign: 'right',
				lineColor: 68,
			},
			headerStyles :{
				halign: 'center',
				columnWidth:'wrap',
				fillColor: 221,
				textColor: 68
			},
			columnStyles: {
				product: {
					halign: 'left',
				}
			},
			addPageContent:pdf_header,
			createdCell: function (cell, data) {
				if(out_of_stock.length && out_of_stock.indexOf(data.row.index)>-1){
					cell.styles.fillColor = 221;
				}
			}
		});
		
		if($scope.print_config.kot){
			rec_type = 'DELIVERY_SLIP';
			del_doc.autoTable(del_header_row, del_product_info, {
				startY: current_y,
				theme: 'grid',
				tableWidth: 'auto',
				tableLineColor:68,
				styles :{
					fontSize: 10,
					cellPadding: 1,
					halign: 'right',
				},
				headerStyles :{
					halign: 'center',
					columnWidth:'wrap',
					fillColor: 221,
					textColor: 68
				},
				columnStyles: {
					product: {
						halign: 'left',
					}
				},
				addPageContent:pdf_header
			});
		}
		current_y = doc.autoTable.previous.finalY+line_height;
		var total_info = [
			{id:"Subtotal",info:$rootScope.aiv_info.currency_symbol+sub_total.toFixed(2)},
		];
	
		if(parseFloat(order.total_discount)){
			total_info.push({id:"Discount",info:$rootScope.aiv_info.currency_symbol+$filter('number')(order.total_discount,2)});
		}
		if(parseFloat(order.total_tax)){
			total_info.push({id:"VAT",info:$rootScope.aiv_info.currency_symbol+$filter('number')(order.total_tax,2)});
		}
		if(parseFloat(order.total_shipping)){
			total_info.push({id:"Delivery",info:$rootScope.aiv_info.currency_symbol+$filter('number')(order.total_shipping,2)});
		}
				
		if(angular.isArray(order.fee_lines)){
			for(var i=0;i<order.fee_lines.length;i++){
				total_info.push({id:order.fee_lines[i].title,info:$rootScope.aiv_info.currency_symbol+$filter('number')(order.fee_lines[i].total,2)});
			}
		}
		
		if($scope.split_payment.paid){
			var total_col = 'Total (By '+order.payment_details.method_title+')';
			total_info.push({id:"Prepaid Amount",info:$rootScope.aiv_info.currency_symbol+$filter('number')($scope.split_payment.paid,2)});
			total_info.push({id:total_col,info:$rootScope.aiv_info.currency_symbol+$filter('number')($scope.split_payment.to_pay,2)});
		}else{
			var total_col = 'Total';
			if(!order.order_meta.quotation){
				var credit_period = '';
				if(angular.isDefined(order.order_meta.credit_period) && order.order_meta.credit_period!=''){
					credit_period = ' in '+order.order_meta.credit_period;
				}
				
				total_col+= ' (By '+order.payment_details.method_title+')'+credit_period;
			}
			total_info.push({id:total_col,info:$rootScope.aiv_info.currency_symbol+$filter('number')(order.total,2)});
		}
		
		if($scope.payment_select.id == 'cash'){
			total_info.push({id:"Tendered",info:$rootScope.aiv_info.currency_symbol+$filter('number')($scope.payment_select.amount,2)});
			total_info.push({id:"Balance",info:$rootScope.aiv_info.currency_symbol+$filter('number')($scope.payment_select.tender,2)});
		}

		var note = [{id:"Note : ",info:order.note}];
		
		if($scope.print_config.kot){
			del_doc.autoTable([{dataKey: "id"},{dataKey: "info"}], note, {
				startY: del_doc.autoTable.previous.finalY+line_height,
				theme: 'plain',
				styles :{
					cellPadding: 0,
					fontSize: 14,
					overflow: 'linebreak',
				},
				columnStyles: {
					id: {fontStyle : 'bold',columnWidth: 20},
				},
				drawHeaderRow: function (row, data) {return false;},
				drawRow: function (row, data) {
					if(row.index === 0){
						var rem_height = paper_height - (data.cursor.y+data.settings.margin.top+data.settings.margin.bottom)
						if( rem_height > data.table.height){
							data.cursor.y = paper_height - (data.table.height+data.settings.margin.bottom);
						}
					}
				}
			});
			if (typeof del_doc.putTotalPages === 'function') {
				del_doc.putTotalPages(totalPagesExp);
			}
			//del_doc.output('dataurlnewwindow');
		}
		
		var on_balance_credit = function(){
			var last_page_footer = false;
			//Only for getting note text height
			doc.autoTable([{dataKey: "id"},{dataKey: "info"}], note, {
				startY: current_y,
				pageBreak: 'avoid',
				theme: 'plain',
				styles :{
					cellPadding: 0,
					fontSize: 12,
					overflow: 'linebreak',
				},
				columnStyles: {
					id: {fontStyle : 'bold',columnWidth: 20},
				},
				drawHeaderRow: function (row, data) {return false;},
				drawRow: function (row, data) {
					note_height = data.table.height;
					if(current_y > data.cursor.y){
						last_page_footer = true;
					}
					current_y = data.cursor.y;
					return false;
				}
			});
			
			doc.autoTable([{dataKey: "id"},{dataKey: "info"}], total_info, {
				startY: current_y,
				theme: 'striped',
				pageBreak: 'avoid',
				styles :{
					fontSize: 12,
					overflow: 'linebreak',
				},
				margin:{left:paper_width*2/3-20},
				columnStyles: {
					info: {halign: "right",columnWidth: 30}
				},
				drawHeaderRow: function (row, data) {return false;},
				drawRow: function (row, data) {
					if(row.index === 0){
						var rem_height = paper_height - (data.cursor.y+data.settings.margin.top+data.settings.margin.bottom+note_height)
						if( rem_height > data.table.height){// && current_y <= data.cursor.y){
							data.cursor.y = paper_height - (data.table.height+data.settings.margin.bottom+note_height+line_height);
						}else{
							last_page_footer = true;
							doc.addPage();
							data.cursor.y = paper_height - (data.table.height+data.settings.margin.bottom+note_height+line_height);
						}
					}
				},
				createdCell: function (cell, data) {
					if(data.row.raw.id.startsWith("Total")){
						cell.styles.fontStyle = 'bold';
					}
				}
			});
			
			current_y = doc.autoTable.previous.finalY+line_height;
		
			doc.autoTable([{dataKey: "id"},{dataKey: "info"}], note, {
				startY: current_y,
				theme: 'plain',
				styles :{
					cellPadding: 0,
					fontSize: 12,
					overflow: 'linebreak',
				},
				columnStyles: {
					id: {fontStyle : 'bold',columnWidth: 30},
				},
				drawHeaderRow: function (row, data) {return false;},
			});
			
			if(last_page_footer){
				// HEADER
				doc.setFontSize(10);
				doc.setFontStyle('normal');
				doc.text(paper_width/2, 10, receipt_title, null, null, 'center');

				// FOOTER
				var str = "Page ";
				// Total page number plugin only available in jspdf v1.0+
				if (typeof doc.putTotalPages === 'function') {
					str = str + totalPagesExp + " of " + totalPagesExp;
				}
				doc.setFontSize(10);
				doc.text(str, 15, doc.internal.pageSize.height - 7);
			}
			
			// Total page number plugin only available in jspdf v1.0+
			if (typeof doc.putTotalPages === 'function') {
				doc.putTotalPages(totalPagesExp);
			}

			//doc.output('dataurlnewwindow');
		}
		
		if(order.customer_id != 0 && order.customer_id != "guest"){
			var find_index = {
				fields: ['data.status'],
				name: 'reportindex',
				ddoc: 'reportdesigndoc'
			}

			var find_selector = {
				$and:[
					{"data.status": "on-hold"},
					{"data.payment_details.paid": false},
					{"data.billing_address.phone" : order.billing_address.phone}
				]
			}
		
			$pouchDB.find(find_index,find_selector).then(function (res) {
				if(res.docs.length){
					var cust_credit = 0;
					for(var j=0;j<res.docs.length;j++){
						cust_credit += parseFloat(res.docs[j].data.total);
					}
					total_info.push({id:"Balance credit",info:$rootScope.aiv_info.currency_symbol+$filter('number')(cust_credit,2)});
				}
				on_balance_credit();
				print_slip(doc,del_doc);
			});
		}else{
			on_balance_credit();
			print_slip(doc,del_doc);
		}

	}
	
	var gen_print_template = function(template,arr,source,printer_settings,fontsize){
		if(fontsize>1){
			arr.push({ type: 'raw', format:'plain', data: gen_print_command(printer_settings.cmd_don) });// double on
		}
		template.setSource(source,printer_settings.lineLength,fontsize);
		template.render();
		var res = template.result();
		
		arr.push(
			{ type: 'raw', data: res }
		);
		if(fontsize>1){
			arr.push({ type: 'raw', format:'plain', data: gen_print_command(printer_settings.cmd_doff) });// double off
		}
	}
		
	$scope.printRawReceipt = function(action,show_dialog=true,open_cashdrawer=false,reprintKOT){
		rec_name = $rootScope.aiv_info.name;
		var addr = $rootScope.aiv_info.address.split(',');
		rec_address = [];
		rec_phone = ["",'Tel : '+$rootScope.aiv_info.phone1,""];
		rec_web = ["",$rootScope.aiv_info.domain.replace('http://','www.'),""];
        headerMap = [["Qty", "Products", "Price("+$rootScope.aiv_info.currency+")"]];
		rec_map1 = [];
        imagePath = ":/pos.png";
        pricesMap = [];
		rec_map2 = [];
		resultMap = [];
		rec_map4 = [];
		rec_map5 = [];
		rec_bagcharges = '';
		orderNumMap = [];
		rec_footer1 = '';
		rec_footer2 = '';
		rec_footer4 = '';
		rec_footer5 = ''
		rec_footer6 = '';
		rec_thanks = '<< Thanks >>';
		rec_header1 = $filter('date')(new Date(), "MMM d, y");
		
		rec_header3 = '';
		rec_header4 = '';
		rec_total = '';
		var labelItems = [];
		
		var dept_items_count = {};
		var get_order_data = function(){
			var output = {items:[],depts:[]};
			dept_items_count = {};
			var order = angular.copy(action.order);
			if(angular.isDefined($scope.loginInfo.user_displayname)){
				rec_header2 = 'Service by: '+$scope.loginInfo.user_displayname+" | "+$filter('date')(new Date(), "hh:mm a d-MMM");
			}else{
				rec_header2 = $filter('date')(new Date(), "hh:mm a d-MMM");
			}
			rec_map3 = [["","Total items",order.total_line_items_quantity]];
			rec_notes = order.note?"NOTE:"+order.note:'';
			var sub_total = parseFloat(order.subtotal) - parseFloat(order.total_discount);
			resultMap = [];
			var loyalty_discount = 0;
			if(angular.isDefined(order.order_meta.discounts_present) && order.order_meta.discounts_present){
				var discountSplit = order.order_meta.discounts_present.split(';');
				angular.forEach(discountSplit,function(discount){
					var LDiscountSpit = discount.split('#');
					if(LDiscountSpit.length>1 && LDiscountSpit[0]=='L'){
						//Loyalty discount found
						loyalty_discount = Number(LDiscountSpit[1]);
					}
				});
			}
			
			if(loyalty_discount){
				resultMap.push(["","Loyalty Discount", "-"+$filter('number')(loyalty_discount, 2)]);
			}
			if(order.deposit){
					resultMap.push(["","By Deposit", "-"+$filter('number')(order.deposit, 2)]);
			}
			if(parseFloat(order.total_discount)){
				var other_discounts = parseFloat(order.total_discount);
				if(loyalty_discount){
					other_discounts-=loyalty_discount;
				}
				
				if(other_discounts>0){
					resultMap.push(["","Other Discounts", "-"+$filter('number')(other_discounts, 2)]);
				}
			} 
			if(angular.isArray(order.fee_lines)){
				for(var i=0;i<order.fee_lines.length;i++){
					resultMap.push(["",order.fee_lines[i].title,$filter('number')(order.fee_lines[i].total, 2)]);
					if(order.fee_lines[i].title == 'Bag charges'){
						sub_total+=parseFloat(order.fee_lines[i].total);
						rec_bagcharges =  "Add Bag Of "+$filter('number')(order.fee_lines[i].total, 2);
						break;
					}
				}
			}
			resultMap.push(["","Sub Total", $filter('number')(sub_total,2)]);
			if(parseFloat(order.total_shipping)){
				resultMap.push(["","Delivery", $filter('number')(order.total_shipping, 2)]);
			}
			
			var total_col = '';
			var splitArr = order.payment_details.method_title.split(' ');
			if(splitArr.length){
				if(splitArr[0] == 'Cash'){
					total_col+='By '+splitArr[0];
				}else{
					total_col+='By '+order.payment_details.method_title;
				}
			}
			
			if(order.payment_details.method_id == 'cod' && !order.payment_details.paid){
				total_col ='By Cash';
			}
			if(angular.isDefined(order.payment_details.split) && order.payment_details.split){
				var cardPrice =-1*$scope.payment_select.tender;
				if(angular.isDefined(order.payment_details.cash) && order.payment_details.cash !=0)
					resultMap.push(["",'by Cash', $filter('number')(order.payment_details.cash, 2)]);
				if(angular.isDefined(order.payment_details.card) && order.payment_details.card !=0)
					resultMap.push(["",'by Card', $filter('number')(order.payment_details.card, 2)]);
				if(angular.isDefined(order.payment_details.cash) && order.payment_details.voucher !=0)
					resultMap.push(["",'by Voucher', $filter('number')(order.payment_details.voucher, 2)]);
				/* resultMap.push(
					["",'by Cash', $filter('number')(order.payment_details.cash, 2)],
					["",'by Card', $filter('number')(order.payment_details.card, 2)]
				); */
			}
			
			if($scope.split_payment.paid){
				resultMap.push(["",'Prepaid Amount', $filter('number')($scope.split_payment.paid, 2)]);
				if(angular.isUndefined(order.payment_details.split) ||(angular.isDefined(order.payment_details.split) && !order.payment_details.split))
					resultMap.push(["",total_col, $filter('number')($scope.split_payment.to_pay, 2)]);
				rec_total = "TOTAL: "+$filter('number')($scope.split_payment.to_pay, 2);
			}else{
				if(angular.isUndefined(order.payment_details.split) || (angular.isDefined(order.payment_details.split) && !order.payment_details.split))
					resultMap.push(["",total_col, $filter('number')(order.total, 2)]);
				rec_total = "TOTAL: "+$filter('number')(order.total, 2);
			}
		
			if($scope.payment_select.tender && order.payment_details.method_id == 'cod' && order.payment_details.paid ){
				if(!$scope.showSplitPay.show){
					resultMap.push(
						["",'Tendered', $filter('number')($scope.payment_select.amount, 2)],
						["",'Balance', $filter('number')($scope.payment_select.tender, 2)]
					);
				}
			}
			
			if(angular.isUndefined(order.order_meta.wc_pos_order_type) && angular.isDefined(order.loyalty)){
				//Online order
				rec_footer6 = [
					["Points Earned Now","",order.loyalty.current_points],
					["Points Remaining","",order.loyalty.reward_points]
				]
				if(order.loyalty.reward_money){
					rec_footer6.push(["Reward amount","",order.loyalty.reward_money]);
				}
			}else if($scope.loyalty_card.id){
				//POS order
				rec_footer6 = [
					["Points Earned Now","",$scope.loyalty_card.current_points],
					["Points Remaining","",$scope.loyalty_card.reward_points]
				]
				if($scope.loyalty_card.reward_money){
					rec_footer6.push(["Reward amount","",$scope.loyalty_card.reward_money]);
				}
			}else 
			
			var customer_info = '';
			if(angular.isArray(order.shipping_lines) && order.shipping_lines.length){
				if(order.shipping_lines[0].method_id=='local_delivery'){
					rec_footer1 = [
						[order.shipping_address.first_name+' '+order.shipping_address.last_name,"",""]
					];
					if(order.shipping_address.address_1 != ''){
						rec_footer1.push([order.shipping_address.address_1,"",""]);
					}
					if(order.shipping_address.address_2 != ''){
						rec_footer1.push([order.shipping_address.address_2,"",""]);
					}
					if(order.shipping_address.city != ''){
						rec_footer1.push([order.shipping_address.city,"",""]);
					}
					if(order.shipping_address.postcode != ''){
						rec_footer1.push([order.shipping_address.postcode,"",""]);
					}
					if(order.shipping_address.state != ''){
						rec_footer1.push([order.shipping_address.state,"",""]);
					}
					rec_footer1.push([order.billing_address.phone,"",""]);
					rec_footer1.push(["Pre-order count:"+(order.customer.orders_count-1),"",""]);
					rec_header3 = 'DELIVERY';
				}else if(order.shipping_lines[0].method_id=='local_pickup'){
					rec_footer1 = [
						[order.billing_address.first_name+' '+order.billing_address.last_name,"",""],
						[order.billing_address.phone,"",""],
						["Pre-order count:"+(order.customer.orders_count-1),"",""]
					];
					rec_header3 = 'COLLECTION';
				}else if(order.shipping_lines[0].method_id=='sitin'){
					rec_header3 = "SIT-IN";
				}
			}else{
				if(order.billing_address.first_name == 'JUST-EAT'){
					rec_footer1 = [[order.billing_address.first_name,"",""]];
				}else{
					rec_footer1 = [
						[order.billing_address.first_name+' '+order.billing_address.last_name,"",""],
						[order.billing_address.phone,"",""]
					];
				}
				rec_header3 = 'TAKEAWAY';
			}
			if(rec_footer1.length){
				var res_data =false;
				for(var i=0;i<rec_footer1.length;i++){
					for(var j=0;j<rec_footer1[i].length;j++){
						if(rec_footer1[i][j] =="" || rec_footer1[i][j] ==" "){
						res_data =true;
						}else{
							res_data =false;
							break;
						}
					}
				}
				if(res_data){
					rec_footer1=[];
				}
			}
			
			var order_id,labelData = [],del_date = new Date(order.created_at);
			if(angular.isDefined(order.order_meta.wc_pos_order_type)){
				//POS order
				order_id = order.order_meta.bill_number;
			}else{
				//Online order
				order_id = order.id;
				rec_header4 = [
					["Order placed at","",$filter('date')(order.created_at, "hh:mm a d-MMM")]
				];
				if(order.status != "pending" && order.status != "processing" && order.status != "cancelled"){
					var accepted_at = '';
					if(angular.isDefined(order.order_meta.accepted_at)){
						accepted_at = $filter('date')(order.order_meta.accepted_at, "hh:mm a d-MMM")
						del_date = new Date(order.order_meta.accepted_at);
					}else{
						accepted_at = $filter('date')(order.updated_at, "hh:mm a d-MMM")
						del_date = new Date(order.updated_at);
					}
					//rec_header4.push(["Order accepted at","",accepted_at]);
				}
			}
		
			if(angular.isDefined(order.order_meta.duration)){
				var time_dur = order.order_meta.duration.split(' ');
				if(time_dur.length){
					del_date.setMinutes(del_date.getMinutes()+parseFloat(time_dur[0]));
				}
			}
			
			if(rec_header4 && rec_header4.length){
				rec_header4.push(["Order accepted for","",$filter('date')(del_date, "hh:mm a d-MMM")]);
			}
			
			if(angular.isDefined(order.order_meta.daily_order_no)){
				orderNumMap.push(["ORDER NO:"+order.order_meta.daily_order_no,"",""]);
				rec_footer2 = order.order_meta.daily_order_no+" | "+$filter('date')(new Date(), "hh:mm a");
				if(order.id && angular.isUndefined(order.order_meta.wc_pos_order_type)){
					rec_footer5+="Ref No : "+order.id;
				}
			}else{
				orderNumMap.push(["ORDER NO:"+order.id,"",""]);
				rec_footer2 = order.id+" | "+$filter('date')(new Date(), "hh:mm a");
			}
		
			rec_footer3 = (order.payment_details.paid)?'ORDER HAS BEEN PAID':'ORDER NOT PAID';
			rec_footer3 = (order.status=='refunded')?'ORDER HAS BEEN REFUNDED':rec_footer3;//ADDED FOR REFUND SUPPORT

			angular.forEach(order.line_items,function(item){
				var prdt_name = angular.isDefined(item.title)?item.title:item.name;
				prdt_name = prdt_name.toUpperCase();
				var opt_arr = [],processed_product = {};
				
				var prdtDepts = ['None'];
				if(angular.isDefined(item.dept)&&item.dept){
					if(angular.isArray(item.dept) && item.dept.length){
						prdtDepts = item.dept;
					}else if(!angular.isArray(item.dept)){
						prdtDepts = [item.dept];
					}
				}
				
				if(angular.isDefined(item.variations)){
					//Check for product name prefix/suffix
					angular.forEach(item.variations,function(value,key){
						var key_split = key.split(AIV_CONSTANTS.OPTION_SEPARATOR);
						var value_split = value.split(AIV_CONSTANTS.OPTION_SEPARATOR);
						if(key_split.length > 1){
							if(key_split[1].includes('S')){
								var price_str = value_split[0].match(/\(([^)]+)\)/);
								if(price_str && price_str.length){
									value_split[0] = value_split[0].replace(price_str[0],'');
								}
								prdt_name = value_split[0].toUpperCase()+" "+prdt_name;
								delete item.variations[key];
							}else if(key_split[1].includes('E')){
								var price_str = value_split[0].match(/\(([^)]+)\)/);
								if(price_str && price_str.length){
									value_split[0] = value_split[0].replace(price_str[0],'');
								}
								prdt_name = prdt_name+" "+value_split[0].toUpperCase();
								delete item.variations[key];
							}
						}
					});
					var variationstoshow = $scope.processDisplay(item.variations);
					angular.forEach(variationstoshow,function(value,key){
						value=value.toFixed(1);
						var option_key = $filter('split')(key,'###',0);
						option_key = $filter('split')(option_key,'_',0);
						opt_arr.push(option_key);
					});
				}else if(angular.isDefined(item.meta)){
					var varoption ={};
					for( var i=0;i<item.meta.length;i++){
						var option = item.meta[i];
						varoption[option.key]=option.value;
					}
					
					//Check for product name prefix/suffix
					angular.forEach(varoption,function(value,key){
						var key_split = key.split(AIV_CONSTANTS.OPTION_SEPARATOR);
						var value_split = value.split(AIV_CONSTANTS.OPTION_SEPARATOR);
						if(key_split.length > 1 && value_split.length){
							if(key_split[1].includes('S')){
								var price_str = value_split[0].match(/\(([^)]+)\)/);
								if(price_str && price_str.length){
									value_split[0] = value_split[0].replace(price_str[0],'');
								}
								prdt_name = value_split[0].toUpperCase()+" "+prdt_name;
								delete varoption[key];
							}else if(key_split[1].includes('E')){
								var price_str = value_split[0].match(/\(([^)]+)\)/);
								if(price_str && price_str.length){
									value_split[0] = value_split[0].replace(price_str[0],'');
								}
								prdt_name = prdt_name+" "+value_split[0].toUpperCase();
								delete varoption[key];
							}
						}
					});
			
					var variationstoshow = $scope.processDisplay(varoption);

					angular.forEach(variationstoshow,function(value,key){
						value=value.toFixed(1);
						var option_key = $filter('split')(key,'###',0);
						option_key = $filter('split')(option_key,'_',0);
						opt_arr.push(option_key);
					});
				}
				
				if(angular.isDefined(item.notes) && item.notes){
					opt_arr.push(item.notes);
				}
				
				if(angular.isDefined(item.dash) && item.dash){
					opt_arr.push('INNER_DASH');
				}
				
				processed_product.name = prdt_name;
				processed_product.quantity = item.quantity;
				processed_product.subtotal = $filter('number')(item.subtotal,2);
				processed_product.options = opt_arr;
				processed_product.depts = prdtDepts;
				
				output.items.push(processed_product);
				for(var d=0;d<prdtDepts.length;d++){
					if(output.depts.indexOf(prdtDepts[d])<0){
						output.depts.push(prdtDepts[d]);
					}
				}
			});
			
			return output;
		}
		
		var kot_needed = $scope.print_config.kot;
		var print_array = [];
		var items = get_order_data();
		if(action.type == 'PRINT'){
			//Template for Main Print (Main printer)
			angular.forEach($scope.AIVPrinterSettings,function(printer){
				if(printer.usage == 'Main' && $scope.print_config.receipt){
					//Print to Main printer
					rec_name = $rootScope.aiv_info.name;
					rec_address = [];
					rec_map5 = [];
					if($rootScope.aiv_info.address.length > printer.lineLength){
						var start = 0,addr = $rootScope.aiv_info.address+","+$rootScope.aiv_info.phone1+","+$rootScope.aiv_info.domain.replace('http://','www.');
						for(var a=0;a<addr.length/printer.lineLength;a++){
							rec_address.push(["",addr.substr(start,printer.lineLength),""]);
							start+=printer.lineLength;
						}
					}else{
						rec_address.push(["",$rootScope.aiv_info.address,""]);
						rec_address.push(["",$rootScope.aiv_info.phone1+","+$rootScope.aiv_info.domain.replace('http://','www.'),""]);
						if($rootScope.aiv_info.vat_no){
							rec_address.push(["",$rootScope.aiv_info.vat_no,""]);
						}					
					}
					
					if($rootScope.aiv_info.fb_url){
						rec_map5.push(["",$rootScope.aiv_info.fb_url.toUpperCase(),""]);
					}
					
					if($rootScope.aiv_info.twitter){
						rec_map5.push(["",$rootScope.aiv_info.twitter.toUpperCase(),""]);
					}
			        
					rec_map2 = [];
					for(var i=0;i<items.items.length;i++){
						rec_map2.push([items.items[i].quantity,items.items[i].name,items.items[i].subtotal]);
						for(var p=0;p<items.items[i].options.length;p++){
							rec_map2.push(['  ',items.items[i].options[p],'']);
						}
						//rec_map2.push(['','','']);
					}
					
					rec_map3 = null;
					var print_margin = {'top':0,'bottom':0};
					var print_object = create_print_template(printer,'TABLE_PRINT',print_margin);
					print_object.device = printer;
					print_object.cashdrawer = false;
					var drawer = false;
					if($scope.print_config.cashdrawer && open_cashdrawer){
						print_object.cashdrawer = true;
					}
					print_array.push(print_object);
					if(action.order.payment_details.method_id == 'card' && $scope.receiptCount.card && !$scope.edit_order_flags.order_loaded){
						var card_copy = angular.copy(print_object);
						card_copy.data.splice(0,0,{ type: 'raw', data: "====HEAD OFFICE COPY====\n\n" });
						for(var i=0;i<$scope.receiptCount.card;i++){
							print_array.push(card_copy);
						}
					}
				}
			})
		}
		
		if(kot_needed && action.type == 'PRINT' && reprintKOT && !$scope.edit_order_flags.order_loaded){
			//Template for KOT (Departments)
			var takeawayPrinter = $scope.settings_data.takeawayKotPrinter;
			if($scope.settings_data.takeawayKotPrinter.includes('(')){
				takeawayPrinter = takeawayPrinter.split('(')[1];
				takeawayPrinter = takeawayPrinter.replace(/[^\w\s]/gi, '');
			}
			angular.forEach(items.depts,function(prdt_dept){
				//Check if dept printer added
					prdt_dept =takeawayPrinter;
				var exists = $filter('filter')($scope.AIVPrinterSettings,{dept:prdt_dept},true);
				if($scope.commonPrintSettings.kot_receipt){
					if(exists.length){
						rec_name = null;
						rec_address = null;
						rec_map5 = [];
						rec_map2 = [];
						for(var i=0;i<items.items.length;i++){
							if(items.items[i].depts.indexOf(prdt_dept) > -1){
								rec_map2.push([items.items[i].quantity,items.items[i].name,items.items[i].subtotal]);
								for(var p=0;p<items.items[i].options.length;p++){
									if(items.items[i].options[p] == "INNER_DASH")
										rec_map2.push(['    ',' ','']);
									rec_map2.push(['    ',items.items[i].options[p],'']);
									if(items.items[i].options[p] == "INNER_DASH")
										rec_map2.push(['    ',' ','']);
								}
							}else{
								rec_map2.push([items.items[i].quantity,items.items[i].name,items.items[i].subtotal]);
								for(var p=0;p<items.items[i].options.length;p++){
									if(items.items[i].options[p] == "INNER_DASH")
										rec_map2.push(['    ',' ','']);
									rec_map2.push(['  ',items.items[i].options[p],'']);
									if(items.items[i].options[p] == "INNER_DASH")
										rec_map2.push(['    ',' ','']);
								}
							}
							rec_map2.push(['','NEWLINE','']);
						}
						//rec_map2 = angular.copy(items[prdt_dept]);
						rec_thanks = null;
						rec_map3 = "Total items : "+action.order.total_line_items_quantity;
						var print_margin = {'top':2,'bottom':0};
						var print_object = create_print_template(exists[0],'TABLE_PRINT',print_margin);
						var dept_exists = $filter('filter')($scope.dept_receiptCount,{dept:prdt_dept},true);
						if(dept_exists.length){
							print_object.conf.copies = dept_exists[0].copies;
						}
						print_object.device = exists[0];
						print_object.cashdrawer = false;
						print_array.push(print_object);
					}else{
						var exists = $filter('filter')($scope.AIVPrinterSettings,{dept:'None'},true);
						if(exists.length){
							//Sent to Main printer if dept printer is not added
							rec_name = null;
							rec_address = null;
							rec_map5 = [];
							rec_map2 = [];
							for(var i=0;i<items.items.length;i++){
								if(items.items[i].depts.indexOf(prdt_dept) > -1){
									rec_map2.push([items.items[i].quantity,items.items[i].name,items.items[i].subtotal]);
									for(var p=0;p<items.items[i].options.length;p++){
										if(items.items[i].options[p] == "INNER_DASH")
											rec_map2.push(['    ',' ','']);
										rec_map2.push(['    ',items.items[i].options[p],'']);
										if(items.items[i].options[p] == "INNER_DASH")
											rec_map2.push(['    ',' ','']);
									}
								}else{
									rec_map2.push([items.items[i].quantity,items.items[i].name,items.items[i].subtotal]);
									for(var p=0;p<items.items[i].options.length;p++){
										if(items.items[i].options[p] == "INNER_DASH")
											rec_map2.push(['    ',' ','']);
										rec_map2.push(['  ',items.items[i].options[p],'']);
										if(items.items[i].options[p] == "INNER_DASH")
											rec_map2.push(['    ',' ','']);
									}
								}
								rec_map2.push(['','NEWLINE','']);
							}
							//rec_map2 = angular.copy(items[prdt_dept]);
							rec_thanks = null;
							rec_map3 = "Total items : "+action.order.total_line_items_quantity;
							var print_margin = {'top':2,'bottom':0};
							var print_object = create_print_template(exists[0],'TABLE_PRINT',print_margin);
							var dept_exists = $filter('filter')($scope.dept_receiptCount,{dept:prdt_dept},true);
							if(dept_exists.length){
								print_object.conf.copies = dept_exists[0].copies;
							}
							print_object.device = exists[0];
							print_object.cashdrawer = false;
							print_array.push(print_object);
							}
					}
				}else{
					if(exists.length){
						//Order has products for this printer
						rec_header1 = prdt_dept!='None'?prdt_dept:'';
						rec_map2 = [];
						for(var i=0;i<items.items.length;i++){
							if(items.items[i].depts.indexOf(prdt_dept) > -1){
								rec_map2.push(['* '+items.items[i].quantity,items.items[i].name,'']);
								for(var p=0;p<items.items[i].options.length;p++){
									rec_map2.push(['    ',items.items[i].options[p],'']);
								}
							}else{
								rec_map2.push(['  '+items.items[i].quantity,items.items[i].name,'']);
								for(var p=0;p<items.items[i].options.length;p++){
									rec_map2.push(['  ',items.items[i].options[p],'']);
								}
							}
							rec_map2.push(['','NEWLINE','']);
						}
						rec_map3 = [["","Total items",action.order.total_line_items_quantity]];
						var print_margin = {'top':5,'bottom':0};
						var print_object = create_print_template(exists[0],'TABLE_KOT',print_margin);
						var dept_exists = $filter('filter')($scope.dept_receiptCount,{dept:prdt_dept},true);
						if(dept_exists.length){
							print_object.conf.copies = dept_exists[0].copies;
						}
						print_object.device = exists[0];
						print_object.cashdrawer = false;
						print_array.push(print_object);
						//console.log("Added to "+prdt_dept+ "printer");
					}else{
						var exists = $filter('filter')($scope.AIVPrinterSettings,{dept:'None'},true);
						if(exists.length){
							//Sent to Main printer if dept printer is not added
							rec_header1 = prdt_dept!='None'?prdt_dept:'';
							rec_map2 = [];
							for(var i=0;i<items.items.length;i++){
								if(items.items[i].depts.indexOf(prdt_dept) > -1){
									rec_map2.push(['* '+items.items[i].quantity,items.items[i].name,'']);
									for(var p=0;p<items.items[i].options.length;p++){
										rec_map2.push(['    ',items.items[i].options[p],'']);
									}
								}else{
									rec_map2.push(['  '+items.items[i].quantity,items.items[i].name,'']);
									for(var p=0;p<items.items[i].options.length;p++){
										rec_map2.push(['  ',items.items[i].options[p],'']);
									}
								}
								rec_map2.push(['','NEWLINE','']);
							}
							rec_map3 = [["","Total items",action.order.total_line_items_quantity]];
							var print_margin = {'top':5,'bottom':0};
							var print_object = create_print_template(exists[0],'TABLE_KOT',print_margin);
							var dept_exists = $filter('filter')($scope.dept_receiptCount,{dept:prdt_dept},true);
							if(dept_exists.length){
								print_object.conf.copies = dept_exists[0].copies;
							}
							print_object.device = exists[0];
							print_object.cashdrawer = false;
							print_array.push(print_object);
							console.log("Added to Main printer");
						}
					}
				}
			})

		}
		
		if(print_array.length){
			//Handle multiple copies
			var final_print_array = [];
			for(var i=0;i<print_array.length;i++){
				if(print_array[i].conf.copies > 1){
					var print_data = angular.copy(print_array[i]);
					var copies = print_data.conf.copies;
					print_array[i].conf.copies = 1;
					final_print_array.push(print_array[i]);
					
					print_data.data.splice(0,0,{ type: 'raw', data: "====REPRINT====\n\n" });
					print_data.conf.copies = copies-1;
					print_data.cashdrawer = false;
					final_print_array.push(print_data);
					i++;
				}else{
					final_print_array.push(print_array[i]);
				}
			}
			multi_print_receipts(final_print_array,show_dialog);
		}
	
		//$scope.print_config = {copies:1,cashdrawer:false,kot:false,label_needed:false,receipt:true};
		$scope.print_config.copies = 1;
		$scope.print_config.label_needed = false;
		$scope.print_config.receipt = true;
	}
	
	$scope.printPayoffReceipt = function(order,action,open_cashdrawer){
	
		if($scope.settingsPrinter.type != "Receipt Print"){
			return;
		}else if(angular.isArray(order) && !order.length){
			return;
		}
		
		var printer_settings = $scope.settingsPrinter;
		rec_name = $rootScope.aiv_info.name;
		rec_address = [];
        headerMap = [["No.", "Cust", "Del Chg.  Price"]];
		rec_map1 = [];
        pricesMap = [];
		rec_map2 = [];
		resultMap = [];
		rec_map3 = [];
		orderNumMap = [];
		rec_footer1 = '';
		rec_footer2 = '';
		rec_footer3 = '';
		rec_footer4 = '';
		rec_thanks = '<<< Thanks >>>';
		rec_header1 = $filter('date')(new Date(), "MMM d, y");
		if(angular.isDefined($scope.loginInfo.user_displayname)){
			rec_header2 = 'Service by: '+$scope.loginInfo.user_displayname+" | "+$filter('date')(new Date(), "MMM d, y");
		}else{
			rec_header2 = $filter('date')(new Date(), "MMM d, y");
		}
		rec_header3 = '';
		rec_total = '';
		
		var template = new EasyPrintTemplate();
		var res;
		var printData = [];
	
		if(action == 'SINGLE_PAY'||action == 'REFUND_PRINT'){
			rec_header3 = 'This order has been PAID';
			rec_header3 = (order.status=='refunded')?'This order has been REFUNDED':rec_header3;//ADDED FOR REFUND SUPPORT
			source = (rec_header3!='')?"{{center:rec_header3}}":"";
			gen_print_template(template,printData,source,printer_settings,1);
			
			if(angular.isDefined(order.order_meta.daily_order_no)){
				rec_footer2 = "Order No : "+order.order_meta.daily_order_no;
			}else{
				rec_footer2 = "Order No : "+order.id;
			}
			source = (rec_footer2!='')?"{{center:rec_footer2}}":"";
			gen_print_template(template,printData,source,printer_settings,2);
			
			if(parseFloat(order.total_shipping)){
				var sub_total = parseFloat(order.total) - parseFloat(order.total_shipping);
				resultMap.push(["","Sub Total", $filter('number')(sub_total,2)]);
				resultMap.push(["","Delivery", $filter('number')(order.total_shipping, 2)]);
				if($scope.showSplitPay.show){
					var cardPrice =-1*$scope.payment_select.tender;
				if(angular.isDefined(order.payment_details.cash) && order.payment_details.cash!=0)
					resultMap.push(["",'by Cash', $filter('number')(order.payment_details.cash, 2)]);
				if(angular.isDefined(order.payment_details.card) && order.payment_details.card!=0)
					resultMap.push(["",'by Card', $filter('number')(order.payment_details.card, 2)]);
				if(angular.isDefined(order.payment_details.voucher) && order.payment_details.voucher!=0)
					resultMap.push(["",'by Voucher', $filter('number')(order.payment_details.voucher, 2)]);
				}
				source = ".hline {{hmap:resultMap}} .hline";
				gen_print_template(template,printData,source,printer_settings,1);
			}else if($scope.showSplitPay.show){
				var sub_total = parseFloat(order.total);
				resultMap.push(["","Sub Total", $filter('number')(sub_total,2)]);
				var cardPrice =-1*$scope.payment_select.tender;
				if(angular.isDefined(order.payment_details.cash) && order.payment_details.cash!=0)
					resultMap.push(["",'by Cash', $filter('number')(order.payment_details.cash, 2)]);
				if(angular.isDefined(order.payment_details.card) && order.payment_details.card!=0)
					resultMap.push(["",'by Card', $filter('number')(order.payment_details.card, 2)]);
				if(angular.isDefined(order.payment_details.voucher) && order.payment_details.voucher!=0)
					resultMap.push(["",'by Voucher', $filter('number')(order.payment_details.voucher, 2)]);
				source = ".hline {{hmap:resultMap}} .hline";
				gen_print_template(template,printData,source,printer_settings,1);
			}
			
			rec_total = "TOTAL: "+$filter('number')(order.total, 2);
			source = "{{center:rec_total}}";
			gen_print_template(template,printData,source,printer_settings,2);
			
			if(order.status=='refunded'){
				rec_footer1 = "Reason:"+order.order_meta.reason;
				source = ".hline {{var:rec_footer1}}";
				gen_print_template(template,printData,source,printer_settings,1);
			}
			
			source = ".hline .style2 {{center:rec_header2}} .hline";
			gen_print_template(template,printData,source,printer_settings,1);
			
			source = "{{center:rec_thanks}} .newline .newline .newline .newline .newline .newline .newline";
			gen_print_template(template,printData,source,printer_settings,1);
		}else{
			if(action == 'MULTI_PAY'){
				rec_header3 = 'Orders(s) PAID by '+$scope.loginInfo.user_displayname+" | "+$filter('date')(new Date(), "MMM d, y");
				source = "{{center:rec_header3}} .hline";
				gen_print_template(template,printData,source,printer_settings,1);
			}else if(action == 'DRIVER_PRINT'){
				rec_header3 = 'Orders(s) assigned to '+order[0].data.order_meta.driver.toUpperCase()+" | "+$filter('date')(new Date(), "MMM d, y");
				source = "{{center:rec_header3}} .hline";
				gen_print_template(template,printData,source,printer_settings,1);
			
			}
				var total_amount = 0;
				var total_del = 0;
				for(var i=0;i<order.length;i++){
					var temp = [];
					if(angular.isDefined(order[i].data.order_meta.daily_order_no)){
						temp.push('#'+order[i].data.order_meta.daily_order_no);
					}else{
						temp.push('#'+order[i].data.id);
					}
					
					if(order[i].data.billing_address.first_name){
						temp.push(order[i].data.billing_address.first_name);
					}else if(order[i].data.billing_address.phone){
						temp.push(order[i].data.billing_address.phone);
					}else{
						temp.push(" ");
					}
					
					/*if(parseFloat(order[i].data.total_shipping)){
						temp.push($filter('number')(order[i].data.total_shipping, 2)+"  "+$filter('number')(order[i].data.total, 2));
						total_del+=parseFloat(order[i].data.total_shipping);
						total_amount+=parseFloat(order[i].data.total);
					}else{
						temp.push("  "+$filter('number')(order[i].data.total, 2));
						total_amount+=parseFloat(order[i].data.total);
					}*/
					total_del+=parseFloat(order[i].data.total_shipping);
					if(!order[i].data.payment_details.paid){
						total_amount+=parseFloat(order[i].data.total);
						temp.push("  "+$filter('number')(order[i].data.total, 2));
					}else{
						temp.push("  "+'0.00');
					}
					
					orderNumMap.push(temp);
				}
			source = "{{map:orderNumMap}}";
			gen_print_template(template,printData,source,printer_settings,1);
			
			resultMap.push(["","Sub Total", $filter('number')(total_amount-total_del,2)]);
			resultMap.push(["","Delivery", $filter('number')(total_del, 2)]);
			resultMap.push(["","Total", $filter('number')(total_amount, 2)]);

			source = ".hline {{hmap:resultMap}} .hline";
			gen_print_template(template,printData,source,printer_settings,1);
			
			source = "{{center:rec_thanks}} .newline .newline .newline .newline .newline .newline .newline";
			gen_print_template(template,printData,source,printer_settings,1);
		}
		var print_array = [];
		angular.forEach($scope.AIVPrinterSettings,function(printer){
			if(printer.usage == 'Main'){
				//Print to Main printer
				var config = {};
				config.copies = 1;
				var print_object = {}
				print_object.conf = config;
				print_object.data = printData;
				print_object.device = printer;
				
				var drawer = false;
				if($scope.print_config.cashdrawer && open_cashdrawer){
					drawer = true;
				}
			
				print_object.cashdrawer = drawer;
				print_array.push(print_object);
			}
		})
		
		if(print_array.length){
			//Handle multiple copies
			var final_print_array = [];
			for(var i=0;i<print_array.length;i++){
				if(print_array[i].conf.copies > 1){
					var print_data = angular.copy(print_array[i]);
					var copies = print_data.conf.copies;
					print_array[i].conf.copies = 1;
					final_print_array.push(print_array[i]);
					
					print_data.data.splice(0,0,{ type: 'raw', data: "====REPRINT====\n\n" });
					print_data.conf.copies = copies-1;
					print_data.cashdrawer = false;
					final_print_array.push(print_data);
					i++;
				}else{
					final_print_array.push(print_array[i]);
				}
			}
			multi_print_receipts(final_print_array,true);
		}
		
		/*var config = QZHelper.getPrintParams();
		config.copies = 1;
		//QZHelper.setPrintParams(config);
		var labelData = [];
		if(printData.length){
			var drawer = false;
			if($scope.print_config.cashdrawer && open_cashdrawer){
				drawer = true;
			}
			$scope.printESCP(printData,drawer,config,printer_settings,labelData).then(function(){

			}).catch(function(err){
			
			});
		}
		
		//$scope.print_config = {copies:1,cashdrawer:false,kot:false,label_needed:false,receipt:true};
		$scope.print_config.copies = 1;
		$scope.print_config.label_needed = false;
		$scope.print_config.receipt = true;*/
	}
	
	var doMutexOperation = function(mutex,action,show_dialog=true,id) {
		return mutex.promise()
			.then(function(mutex){
				mutex.lock();
				if(action.type=="PRINT_TAKEAWAY"){
				$scope.takeAwayId = id;
				getDailyOrderNo(true).then(function(ordernum_data){
					action.order.order_meta.daily_order_no = $scope.dailyOrderNo.prefix+$scope.dailyOrderNo.num;
					$scope.updateDailyOrderNo.push({"id":$scope.takeAwayId,"no":action.order.order_meta.daily_order_no}); 
					if(!$scope.dailyOrderNo.common){
						$scope.dailyOrderNo.num++;
						$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'order_no',$scope.dailyOrderNo);
						}
					return $scope.printReceipt(action.order,false,true);
					
				});
				
				}else
				return $scope.printTableReceipt(action,show_dialog);
			})
			.then(function(res){
				mutex.unlock();
				return res;
			})
			.catch(function(error){
				mutex.unlock();
				console.error(error);
			});
	}
	
	var create_print_template = function(printer_settings,type,print_margin){
		var template = new EasyPrintTemplate();
		var config = {};
		var printData = [];
		if(type == 'TABLE_KOT'){
			//Print template for KOT
			printData = [{ type: 'raw', format:'plain', data: gen_print_command(printer_settings.cmd_bon) }];
		
			//printData.push({ type: 'raw', format:'plain', data: chr(27)+chr(33)+chr(01) });
			//printer_settings.lineLength=64;
			
			if(print_margin.top){
				source = "";
				for(var p=0;p<print_margin.top;p++){
					source+=" .newline";
				}
				gen_print_template(template,printData,source,printer_settings,2);
			}
			
			
				source = "{{hmap:rec_address}} .hline";
				gen_print_template(template,printData,source,printer_settings,2);
		
			if(rec_header1){
				source = "{{var:rec_header1}} .hline";
				gen_print_template(template,printData,source,printer_settings,2);
			}
			
			
			printData.push({ type: 'raw', format:'plain', data: gen_print_command(printer_settings.cmd_bon) })
			//printData.push({ type: 'raw', format:'plain',data: gen_print_command(printer_settings.cmd_lon)});
			printData.push({ type: 'raw', format:'plain', data: chr(27)+chr(51)+chr(70)});
			source = "{{hmap:rec_map2}} .hline";
			if($rootScope.aiv_info.doubble_kot)
			gen_print_template(template,printData,source,printer_settings,2);
			else
			gen_print_template(template,printData,source,printer_settings,1);
			//printData.push({ type: 'raw', format:'plain', data: gen_print_command(printer_settings.cmd_loff)});
			printData.push({ type: 'raw', format:'plain', data: gen_print_command(printer_settings.cmd_boff) });
			//printData.push({ type: 'raw', format:'plain', data: chr(27)+chr(51)+chr(65)});
			
			//printData.push({ type: 'raw', format:'plain', data: chr(27)+chr(33)+chr(00) });
			//printer_settings.lineLength=48;
			source = "{{map:rec_map3}} .newline";
			gen_print_template(template,printData,source,printer_settings,2);

			if(rec_bagcharges && $scope.startup.action!='TABLEVIEW'){
				source = "{{center:rec_bagcharges}} .hline";
				gen_print_template(template,printData,source,printer_settings,2);
			}
			
			source = '';
			if(rec_notes){
				source ="{{var:rec_notes}} .newline";
			}
			gen_print_template(template,printData,source,printer_settings,2);
			
			if(rec_header3){
				source = ".style2 {{center:rec_header3}}";
				gen_print_template(template,printData,source,printer_settings,2);
			}
			
			//source = ".style2 {{center:rec_footer2}}";
			//gen_print_template(template,printData,source,printer_settings,2);
			
			source = "{{center:rec_header2}}";
			gen_print_template(template,printData,source,printer_settings,1);
			
			source =".newline .newline .newline .newline .newline";
			gen_print_template(template,printData,source,printer_settings,1);
			
			if(print_margin.bottom){
				source = "";
				for(var p=0;p<print_margin.top;p++){
					source+=" .newline";
				}
				gen_print_template(template,printData,source,printer_settings,2);
			}
			
			printData.push({ type: 'raw', format:'plain', data: gen_print_command(printer_settings.cmd_boff) });
			
			config.copies = $scope.receiptCount.kot;
		}else if(type == 'TABLE_PRINT'){
			//Print template for Main print
			
			if(print_margin.top){
				source = "";
				for(var p=0;p<print_margin.top;p++){
					source+=" .newline";
				}
				gen_print_template(template,printData,source,printer_settings,2);
			}
			if($scope.settings_data.logoInReceipt){
				 if(printer_settings.lineLength <= 42){
					printData.push({ type: 'raw', format: 'image', data: '../img/receipt_logo58.png', options: { language: 'ESCP', dotDensity: 'single' } });
				}else{
					printData.push({ type: 'raw', format: 'image', data: '../img/receipt_logo80.png', options: { language: 'ESCP', dotDensity: 'single' } });
				} 
			}
			if(rec_name && !$scope.settings_data.logoInReceipt){
				printData.push({ type: 'raw', format:'plain', data: gen_print_command(printer_settings.cmd_bon) });
				source = "{{center:rec_name}} .hline";
				gen_print_template(template,printData,source,printer_settings,2);
				printData.push({ type: 'raw', format:'plain', data: gen_print_command(printer_settings.cmd_boff) });
			}				
			
			if(rec_address){
				if(angular.isArray(rec_address)){
					source = " {{map:rec_address}} .hline";
				}else{
					source = ".hline {{center:rec_address}} .hline";
				}
				
					gen_print_template(template,printData,source,printer_settings,1);
			}
			
			if(rec_header3){
				source = "{{center:rec_header3}}";
				gen_print_template(template,printData,source,printer_settings,2);
				
				//For takeaway
				source = "{{center:rec_footer2}}";
				gen_print_template(template,printData,source,printer_settings,2);
				source = "{{center:rec_footer5}} .hline ";
				gen_print_template(template,printData,source,printer_settings,1);
			}
			
			if(headerMap.length){
				source = "{{hmap:headerMap}} .hline";
				gen_print_template(template,printData,source,printer_settings,1);
			}
			
			if(rec_map2.length){
				printData.push({ type: 'raw', format:'plain', data: gen_print_command(printer_settings.cmd_bon) });			
				//printData.push({ type: 'raw', format:'plain', data: chr(27)+chr(51)+chr(70)});
				source = "{{hmap:rec_map2}}";
				gen_print_template(template,printData,source,printer_settings,1);
				//printData.push({ type: 'raw', format:'plain', data: chr(27)+chr(51)+chr(65)});
				printData.push({ type: 'raw', format:'plain', data: gen_print_command(printer_settings.cmd_boff) });	
			}				
						
			if(resultMap.length){
				source = ".hline {{hmap:resultMap}} .hline";
				gen_print_template(template,printData,source,printer_settings,1);
			}

			if(rec_total){
				printData.push({ type: 'raw', format:'plain', data: gen_print_command(printer_settings.cmd_bon) });
				source = "{{center:rec_total}} .hline";
				gen_print_template(template,printData,source,printer_settings,2);
				printData.push({ type: 'raw', format:'plain', data: gen_print_command(printer_settings.cmd_boff) });
			}
			
			if(angular.isDefined(rec_map3) && rec_map3 && rec_map3.length){
				source = "{{center:rec_map3}} .hline";
				gen_print_template(template,printData,source,printer_settings,2);
			}
			
			if(rec_footer3){
				printData.push({ type: 'raw', format:'plain', data: gen_print_command(printer_settings.cmd_bon) });
				source = "{{center:rec_footer3}}";
				gen_print_template(template,printData,source,printer_settings,2);
				printData.push({ type: 'raw', format:'plain', data: gen_print_command(printer_settings.cmd_boff) });
			}
			
			if(rec_footer1.length){
				printData.push({ type: 'raw', format:'plain', data: gen_print_command(printer_settings.cmd_bon) });
				source = ".hline {{map:rec_footer1}} .newline";
				if($rootScope.aiv_info.doubble_font)
					gen_print_template(template,printData,source,printer_settings,2);
				else
					gen_print_template(template,printData,source,printer_settings,1);
				printData.push({ type: 'raw', format:'plain', data: gen_print_command(printer_settings.cmd_boff) });
			}
			
			if(rec_notes){
				source = ".hline {{var:rec_notes}} .newline ";
				gen_print_template(template,printData,source,printer_settings,2);
			}
			
			if(rec_footer6){
				source = ".hline {{map:rec_footer6}}";
				gen_print_template(template,printData,source,printer_settings,1);
			}
			
			if(rec_header4){
				source = ".hline {{map:rec_header4}}";
				gen_print_template(template,printData,source,printer_settings,1);
			}
			
			if(rec_map1.length){
				source = ".hline {{hmap:rec_map1}}";
				gen_print_template(template,printData,source,printer_settings,1);
			}
			
			if(rec_map4.length){
				source = ".hline {{map:rec_map4}}";
				gen_print_template(template,printData,source,printer_settings,1);
			}
			
			if(rec_footer4){
				source = ".hline .newline {{center:rec_footer4}}";
				gen_print_template(template,printData,source,printer_settings,1);
			}
			
			source = " .newline {{center:rec_header2}} .hline";
			gen_print_template(template,printData,source,printer_settings,1);
			
			if(!rec_header3){
				//For table
				source = ".style2 {{center:rec_footer2}} .hline";
				gen_print_template(template,printData,source,printer_settings,2);
			}

			if(angular.isDefined(rec_map5) && rec_map5.length){
				source = "{{map:rec_map5}}";
				gen_print_template(template,printData,source,printer_settings,1);
			}
			
			if(rec_thanks){
				source = ".newline {{center:rec_thanks}}";
			}else{
				source = "";
			}
			source+=".newline .newline .newline .newline .newline .newline .newline";
			gen_print_template(template,printData,source,printer_settings,1);
			
			if(print_margin.bottom){
				source = "";
				for(var p=0;p<print_margin.top;p++){
					source+=" .newline";
				}
				gen_print_template(template,printData,source,printer_settings,2);
			}
			if($scope.startup.action=='TABLEVIEW')
				if($scope.voidData)
					config.copies ="1";
				else
				config.copies = $scope.receiptCount.sitin;
			else
				config.copies = $scope.receiptCount.inshop;
		}else if(type == 'RELEASE'){
			//Print template for KOT
			printData = [{ type: 'raw', format:'plain', data: gen_print_command(printer_settings.cmd_bon) }];
			
			if(print_margin.top){
				source = "";
				for(var p=0;p<print_margin.top;p++){
					source+=" .newline";
				}
				gen_print_template(template,printData,source,printer_settings,2);
			}
			
			source = "{{center:rec_header3}} .hline";
			gen_print_template(template,printData,source,printer_settings,2);
			
			source = ".style2 {{center:rec_footer2}}";
			gen_print_template(template,printData,source,printer_settings,2);
			
			source = "{{center:rec_header2}}";
			gen_print_template(template,printData,source,printer_settings,1);
			
			source =".newline .newline .newline .newline .newline";
			gen_print_template(template,printData,source,printer_settings,1);
			
			if(print_margin.bottom){
				source = "";
				for(var p=0;p<print_margin.top;p++){
					source+=" .newline";
				}
				gen_print_template(template,printData,source,printer_settings,2);
			}
			printData.push({ type: 'raw', format:'plain', data: gen_print_command(printer_settings.cmd_boff) });
			
			config.copies = $scope.receiptCount.kot;
		}else if(type == 'PAYOFF'){
			//Print template for KOT
			printData = [];
			
			if(print_margin.top){
				source = "";
				for(var p=0;p<print_margin.top;p++){
					source+=" .newline";
				}
				gen_print_template(template,printData,source,printer_settings,2);
			}
			
			source = ".style2 {{center:rec_footer2}}";
			gen_print_template(template,printData,source,printer_settings,2);
			
			source = "{{center:rec_header2}} .hline {{center:rec_header3}}";
			gen_print_template(template,printData,source,printer_settings,1);
			
			source = ".hline {{hmap:resultMap}} .hline";
			gen_print_template(template,printData,source,printer_settings,1);
			
			source = "{{center:rec_total}} .newline";
			gen_print_template(template,printData,source,printer_settings,2);
			
			source = "{{center:rec_thanks}} .newline .newline .newline .newline .newline .newline .newline";
			gen_print_template(template,printData,source,printer_settings,1);
			
			if(print_margin.bottom){
				source = "";
				for(var p=0;p<print_margin.top;p++){
					source+=" .newline";
				}
				gen_print_template(template,printData,source,printer_settings,2);
			}

			config.copies = $scope.receiptCount.inshop;
		}
		
		return {conf:config,data:printData};
	}
	$scope.cartMove = function(direction){
		/*var scroll_element = angular.element(document.querySelector('#cart-scroll')); 
		var scroll_height = 210;
		if(scroll_element.length){
			scroll_height = scroll_element[0].offsetHeight;
		}
		var current_pos = $ionicScrollDelegate.$getByHandle('cartScroll').getScrollPosition();*/

		var scrollpos = 35; //in pixels
		if(direction == "UP"){
			
			if($scope.idSelectedItem.index>0)
			{
				if(angular.isDefined($scope.cartItems[$scope.idSelectedItem.index-1].sel_variations)){
					scrollpos+=(Object.keys($scope.cartItems[$scope.idSelectedItem.index-1].sel_variations).length*scrollpos);
					
					
				}
				
				var temp = $scope.cartItems[$scope.idSelectedItem.index-1];
				$scope.cartItems[$scope.idSelectedItem.index-1] = $scope.cartItems[$scope.idSelectedItem.index];
				$scope.cartItems[$scope.idSelectedItem.index] = temp;
				
				$scope.setSelectedItem($scope.idSelectedItem.index-1,$scope.cartItems[$scope.idSelectedItem.index-1]);
				$ionicScrollDelegate.$getByHandle('cartScroll').scrollBy(0,-(scrollpos));
			}
		}else{
			if($scope.idSelectedItem.index<$scope.cartItems.length-1)
			{
				if(angular.isDefined($scope.cartItems[$scope.idSelectedItem.index].sel_variations)){
					scrollpos+=(Object.keys($scope.cartItems[$scope.idSelectedItem.index].sel_variations).length*scrollpos);
				}
				
				var temp = $scope.cartItems[$scope.idSelectedItem.index+1];
				$scope.cartItems[$scope.idSelectedItem.index+1] = $scope.cartItems[$scope.idSelectedItem.index];
				$scope.cartItems[$scope.idSelectedItem.index] = temp;
				
				
				$scope.setSelectedItem($scope.idSelectedItem.index+1,$scope.cartItems[$scope.idSelectedItem.index+1]);
				$ionicScrollDelegate.$getByHandle('cartScroll').scrollBy(0,scrollpos);
			}
		}
	}
	$scope.printTableReceipt = function(action,show_dialog=true){
		rec_name = $rootScope.aiv_info.name;
		rec_address = [];
		rec_map2 = [];
		rec_map4 = [];
		pricesMap = [];
		rec_header3 = ''; 
		rec_header4 = '';
		rec_total = '';
		rec_footer4 = 'We value your custom. Thank you, Like us on Facebook. Follow us on Twitter. Review us on TripeAdvisor.';
		rec_thanks = '<< Thanks >>';
		rec_map1 = [];
		var prdrGRP=[];
		rec_footer1 = '';
		headerMap = [["Qty", "Products", "Price("+$rootScope.aiv_info.currency+")"]];
		var table_number ='';
		var cover_number='';
		var dept_items_count = {};
		var order_added_total = 0;
		var get_order_data = function(type){
			var output = {};
			dept_items_count = {};
			var order = action.order;
			var void_items = angular.isDefined(action.void_items)?action.void_items:[];
			if(action.type != 'PLACE_ORDER')
				rec_footer2 = "Table "+order.order_meta.table_num+"/"+order.order_meta.table_cover+" cv";
			if(action.type == 'PLACE_ORDER')
				rec_address.push(["Table "+order.order_meta.table_num," ","CV "+order.order_meta.table_cover]);
			rec_header2 = 'Service by: '+order.order_meta.table_server+" | "+$filter('date')(new Date(), "hh:mm a d-MMM");
			rec_map3 = [["","Total items",order.total_line_items_quantity]];
			rec_notes = order.note?"NOTE:"+order.note:'';
			var sub_total = parseFloat(order.subtotal);
			resultMap = [];
			resultMap.push(["","Subtotal", $filter('number')(sub_total,2)]);
			if(parseFloat(order.total_discount)){
				if(order.coupon_lines.length>0)
				{
					var voucher_amt =0;
					angular.forEach(order.coupon_lines,function(item){
						if(item.code =='VOUCHER')
						 voucher_amt += item.amount;
						});
						if(voucher_amt !=0){
							resultMap.push(["","Voucher","-"+$filter('number')(voucher_amt, 2)]);
							order.total_discount -=voucher_amt;
						}
				}
				if(order.total_discount>0)
				resultMap.push(["","Discount", "-"+$filter('number')(order.total_discount, 2)]);
			}
			
			if(parseFloat(order.total_shipping)){
				resultMap.push(["","Delivery", $filter('number')(order.total_shipping, 2)]);
			}
			
			var total_col = '';
			var splitArr = order.payment_details.method_title.split(' ');
			if(splitArr.length){
				total_col+='By '+splitArr[0];
			}
			
			if(order.payment_details.method_id == 'cod' && !order.payment_details.paid){
				total_col ='By Cash';
			}
			
			if($scope.split_payment.paid){
				resultMap.push(["",'Prepaid Amount', $filter('number')($scope.split_payment.paid, 2)]);
				resultMap.push(["",total_col, $filter('number')($scope.split_payment.to_pay, 2)]);
				rec_total = "TOTAL: "+$filter('number')($scope.split_payment.to_pay, 2);
			}else{
				if(angular.isDefined(order.order_meta.split_count) && order.order_meta.split_count){
					resultMap.push(["",'Total', $filter('number')(order.total, 2)]);
					rec_total = "AMOUNT: "+$filter('number')(order.total/order.order_meta.split_count, 2);
				}else if(angular.isDefined(order.order_meta.split_unequal_value) && order.order_meta.split_unequal_value){
					resultMap.push(["",'Total', $filter('number')(order.total, 2)]);
					rec_total = "AMOUNT: "+$filter('number')(order.order_meta.split_unequal_value, 2);
				}else{
					rec_total = "TOTAL: "+$filter('number')(order.total, 2);
				}
				
				if(type != 'MAIN_PRINT'){
					if(angular.isDefined(order.order_meta.split_unequal_value) && order.order_meta.split_unequal_value){
						resultMap.push(["",total_col, $filter('number')(order.order_meta.split_unequal_value, 2)]);
					}else if(angular.isDefined(order.order_meta.split_count) && order.order_meta.split_count){
						resultMap.push(["",total_col, $filter('number')(order.total/order.order_meta.split_count, 2)]);
					}else{
						resultMap.push(["",total_col, $filter('number')(order.total, 2)]);
					}
				}
			}
		
			if($scope.payment_select.tender && order.payment_details.method_id == 'cod' && order.payment_details.paid){
				if(angular.isDefined(order.payment_details.split) && !order.payment_details.split){
					resultMap.push(
						["",'Tendered', $filter('number')($scope.payment_select.amount, 2)],
						["",'Balance', $filter('number')($scope.payment_select.tender, 2)]
					);
				}
			}
			if(angular.isDefined(order.payment_details.split) && order.payment_details.split){
				var cardPrice =-1*$scope.payment_select.tender;
				if(angular.isDefined(order.payment_details.cash) && order.payment_details.cash !=0)
					resultMap.push(["",'by Cash', $filter('number')(order.payment_details.cash, 2)]);
				if(angular.isDefined(order.payment_details.card) && order.payment_details.card !=0)
					resultMap.push(["",'by Card', $filter('number')(order.payment_details.card, 2)]);
				if(angular.isDefined(order.payment_details.cash) && order.payment_details.voucher !=0)
					resultMap.push(["",'by Voucher', $filter('number')(order.payment_details.voucher, 2)]);
				/* resultMap.push(
					["",'by Cash', $filter('number')(order.payment_details.cash, 2)],
					["",'by Card', $filter('number')(order.payment_details.card, 2)]
				); */
			}
			
			rec_footer3 = (order.payment_details.paid)?'ORDER HAS BEEN PAID':'ORDER NOT PAID';

			if(void_items.length){
				rec_map1.push(["","VOID ITEMS",""]);
				rec_map1.push(["","----------",""]);
				var void_total = 0;
				angular.forEach(void_items,function(item){
					var prdt_name = item.title;
					prdt_name = prdt_name.toUpperCase();
					rec_map1.push([item.quantity,prdt_name,$filter('number')(item.total,2)]);
					if(angular.isDefined(item.sel_variations)){
						//var variationstoshow = $scope.processDisplay(item.sel_variations.attributestoshow);
						void_total+=parseFloat(item.sel_variations.price);
						angular.forEach(item.sel_variations.attributestoshow,function(value,key){
							value=value.toFixed(1);
							var option_key = $filter('split')(key,'###',0);
							option_key = $filter('split')(option_key,'_',0);
							rec_map1.push(['','+'+option_key,'']);
						});
					}else{
						void_total+=item.total;
					}
				});
				rec_map4.push(["Total","",$filter('number')(void_total,2)]);
				rec_footer4 = angular.isDefined(order.order_meta.void_reason)?"Reason : "+order.order_meta.void_reason:"";
			}

			if(void_items.length && order.status=="cancelled"){
				//Void table print. Print void items only
				output['None'] = [];
				resultMap = [];
				rec_total = '';
				rec_footer3 = '';
				headerMap = [];
				rec_notes = '';
			}else{
				
				var kot_quantity = 0;
				angular.forEach(order.line_items,function(item){
					var prdt_name = angular.isDefined(item.title)?item.title:item.name;
					prdt_name = prdt_name.toUpperCase();
					
					/* var opt_arr = [],processed_product = {};
				
					var prdtDepts = ['None'];
					if(angular.isDefined(item.dept)&&item.dept){
						if(angular.isArray(item.dept) && item.dept.length){
							prdtDepts = item.dept;
						}else if(!angular.isArray(item.dept)){
							prdtDepts = [item.dept];
						}
					} */
					
					
				/* if(angular.isDefined(item.variations)){
					//Check for product name prefix/suffix
					angular.forEach(item.variations,function(value,key){
						var key_split = key.split(AIV_CONSTANTS.OPTION_SEPARATOR);
						var value_split = value.split(AIV_CONSTANTS.OPTION_SEPARATOR);
						if(key_split.length > 1){
							if(key_split[1].includes('S')){
								var price_str = value_split[0].match(/\(([^)]+)\)/);
								if(price_str && price_str.length){
									value_split[0] = value_split[0].replace(price_str[0],'');
								}
								prdt_name = value_split[0].toUpperCase()+" "+prdt_name;
								arr = [item.quantity,prdt_name,$filter('number')(item.subtotal,2)];
								delete item.variations[key];
							}else if(key_split[1].includes('E')){
								var price_str = value_split[0].match(/\(([^)]+)\)/);
								if(price_str && price_str.length){
									value_split[0] = value_split[0].replace(price_str[0],'');
								}
								prdt_name = prdt_name+" "+value_split[0].toUpperCase();
								arr = [item.quantity,prdt_name,$filter('number')(item.subtotal,2)];
								delete item.variations[key];
							}
						}
					});
					var variationstoshow = $scope.processDisplay(item.variations);
					angular.forEach(variationstoshow,function(value,key){
						value=value.toFixed(1);
						//var opt_arr = [];
						var option_key = $filter('split')(key,'###',0);
						option_key = $filter('split')(option_key,'_',0);
						opt_arr.push(option_key);
					for(var d=0;d<prdtDepts.length;d++){
						var prdt_dept = prdtDepts[d];
						
						
						if(angular.isUndefined(output[prdt_dept])){
							output[prdt_dept] = [];
							dept_items_count[prdt_dept] = 0;
						}
						
						output[prdt_dept].push(opt_arr);
					}
					});
					
				}else if(angular.isDefined(item.meta)){
					var varoption ={};
					for( var i=0;i<item.meta.length;i++){
						var option = item.meta[i];
						varoption[option.key]=option.value;
					}
					
					//Check for product name prefix/suffix
					angular.forEach(varoption,function(value,key){
						var key_split = key.split(AIV_CONSTANTS.OPTION_SEPARATOR);
						var value_split = value.split(AIV_CONSTANTS.OPTION_SEPARATOR);
						if(key_split.length > 1 && value_split.length){
							if(key_split[1].includes('S')){
								var price_str = value_split[0].match(/\(([^)]+)\)/);
								if(price_str && price_str.length){
									value_split[0] = value_split[0].replace(price_str[0],'');
								}
								prdt_name = value_split[0].toUpperCase()+" "+prdt_name;
								delete varoption[key];
							}else if(key_split[1].includes('E')){
								var price_str = value_split[0].match(/\(([^)]+)\)/);
								if(price_str && price_str.length){
									value_split[0] = value_split[0].replace(price_str[0],'');
								}
								prdt_name = prdt_name+" "+value_split[0].toUpperCase();
								delete varoption[key];
							}
						}
					});
			
					var variationstoshow = $scope.processDisplay(varoption);

					angular.forEach(variationstoshow,function(value,key){
						value=value.toFixed(1);
						//var opt_arr = [];
						var option_key = $filter('split')(key,'###',0);
						option_key = $filter('split')(option_key,'_',0);
						opt_arr.push(option_key);
						for(var d=0;d<prdtDepts.length;d++){
							var prdt_dept = prdtDepts[d];
							
							
							
							if(angular.isUndefined(output[prdt_dept])){
							output[prdt_dept] = [];
							dept_items_count[prdt_dept] = 0;
							}
							output[prdt_dept].push(opt_arr);
						}
					});
					
					
				} */
				
				
				var checkPrdtGrp=function(group){
						if(prdrGRP.indexOf(group) ==-1 && type=='KOT' && group !=""){
							prdrGRP.push(group);
							return true
						}else
							return false
					}
				
				
				
					var arr = [item.quantity,prdt_name,$filter('number')(item.subtotal,2)];
					if(type=='KOT'){
						kot_quantity+=item.quantity;
						if((item.hasOwnProperty("newstatus")==true && item.newstatus==true)||action.type == 'MAIN_RELEASE' || action.type == 'AFTERS_RELEASE' || action.type == 'STARTER_RELEASE' ||  action.type == 'DRINKS_RELEASE')
						{
							if($scope.commonPrintSettings.kot_receipt){
								arr = [item.quantity,prdt_name,$filter('number')(item.subtotal,2)];
								order_added_total+=Number(item.subtotal);
							}else{
								arr = [item.quantity,prdt_name,''];
							}
						}
						else if(item.hasOwnProperty("deltacount")==true )
						{
							if(item.deltacount>0){
								if($scope.commonPrintSettings.kot_receipt){
									arr = [item.deltacount,prdt_name,$filter('number')(item.price*item.deltacount,2)];
									order_added_total+=Number(item.price*item.deltacount);
								}else{
									arr = [item.deltacount,prdt_name,''];
								}
							}else if(item.deltacount<0){
								if($scope.commonPrintSettings.kot_receipt){
									arr = [item.deltacount,prdt_name+'(VOID)',$filter('number')(item.price*item.deltacount,2)];
									order_added_total+=Number(item.price*item.deltacount);
								}else{
									arr = [item.deltacount,prdt_name,''];
								}
							}else{
								if($scope.commonPrintSettings.kot_receipt){
									arr = [item.quantity,prdt_name,$filter('number')(item.price*item.quantity,2)];
									order_added_total+=Number(item.price*item.quantity);
								}else{
									arr = [item.deltacount,prdt_name,''];
								}
							}
						}
						else
							return;
						
					}

					//var prdt_dept = (type=='KOT'&&angular.isDefined(item.dept)&&item.dept)?item.dept:'None';
					var prdtDepts = ['None'];
					if(type=='KOT'&&angular.isDefined(item.dept)&&item.dept){
						if(angular.isArray(item.dept) && item.dept.length){
							prdtDepts = item.dept;
						}else if(!angular.isArray(item.dept)){
							prdtDepts = [item.dept];
						}
					}
					
					/*if(type=='KOT'&&$scope.commonPrintSettings.kot_receipt&&prdtDepts.indexOf('None')<0){
						prdtDepts.push('None');
					}*/
					
					
					
					var opt_arr = []
					var showItem =true;
				if(angular.isDefined(item.variations)){
					//Check for product name prefix/suffix
					
					angular.forEach(item.variations,function(value,key){
						var key_split = key.split(AIV_CONSTANTS.OPTION_SEPARATOR);
						var value_split = value.split(AIV_CONSTANTS.OPTION_SEPARATOR);
						if(key_split.length > 1){
							if(key_split[1].includes('S')){
								showItem=false;
								var price_str = value_split[0].match(/\(([^)]+)\)/);
								if(price_str && price_str.length){
									value_split[0] = value_split[0].replace(price_str[0],'');
								}
								prdt_name = value_split[0].toUpperCase()+" "+prdt_name;
								arr = [item.quantity,prdt_name,$filter('number')(item.subtotal,2)];
									for(var d=0;d<prdtDepts.length;d++){
										var prdt_dept = prdtDepts[d];
										if(angular.isUndefined(output[prdt_dept])){
											output[prdt_dept] = [];
											dept_items_count[prdt_dept] = 0;
										}
										if(checkPrdtGrp(item.group)){
											output[prdt_dept].push(['',' ','']);
											output[prdt_dept].push(['*****',item.group.toUpperCase()+' *****',,'']);
											//output[prdt_dept].push(['',' ','']);
										}
										output[prdt_dept].push(arr);
										dept_items_count[prdt_dept]++;
									}
								
								delete item.variations[key];
							}else if(key_split[1].includes('E')){
								showItem=false;
								var price_str = value_split[0].match(/\(([^)]+)\)/);
								if(price_str && price_str.length){
									value_split[0] = value_split[0].replace(price_str[0],'');
								}
								prdt_name = prdt_name+" "+value_split[0].toUpperCase();
								arr = [item.quantity,prdt_name,$filter('number')(item.subtotal,2)];
								for(var d=0;d<prdtDepts.length;d++){
									var prdt_dept = prdtDepts[d];
									if(angular.isUndefined(output[prdt_dept])){
										output[prdt_dept] = [];
										dept_items_count[prdt_dept] = 0;
									}
									if(checkPrdtGrp(item.group)){
										output[prdt_dept].push(['',' ','']);
										output[prdt_dept].push(['*****',item.group.toUpperCase()+' *****','']);
										//output[prdt_dept].push(['',' ','']);
									}
									output[prdt_dept].push(arr);
									dept_items_count[prdt_dept]++;
								}
								delete item.variations[key];
							}else{
								for(var d=0;d<prdtDepts.length;d++){
									var prdt_dept = prdtDepts[d];
									if(angular.isUndefined(output[prdt_dept])){
										output[prdt_dept] = [];
										dept_items_count[prdt_dept] = 0;
									}
									if(showItem){
									if(checkPrdtGrp(item.group)){
											output[prdt_dept].push(['',' ','']);
											output[prdt_dept].push(['*****',item.group.toUpperCase()+' *****',,'']);
											//output[prdt_dept].push(['',' ','']);
										}
										output[prdt_dept].push(arr);
										dept_items_count[prdt_dept]++;
										showItem=false;
									}
								}
							}
						}
					});
					var variationstoshow = $scope.processDisplay(item.variations);
					angular.forEach(variationstoshow,function(value,key){
						value=value.toFixed(1);
						var opt_arr = [];
						var option_key = $filter('split')(key,'###',0);
						option_key = $filter('split')(option_key,'_',0);
						arr = ['',option_key,''];
						//opt_arr.push(option_key);
					for(var d=0;d<prdtDepts.length;d++){
						var prdt_dept = prdtDepts[d];
						if(angular.isUndefined(output[prdt_dept])){
							output[prdt_dept] = [];
							dept_items_count[prdt_dept] = 0;
						}
						output[prdt_dept].push(arr);
					}
					});
					
				}else if(angular.isDefined(item.meta)){
					var varoption ={};
					for( var i=0;i<item.meta.length;i++){
						var option = item.meta[i];
						varoption[option.key]=option.value;
					}
					
					//Check for product name prefix/suffix
					angular.forEach(varoption,function(value,key){
						var key_split = key.split(AIV_CONSTANTS.OPTION_SEPARATOR);
						var value_split = value.split(AIV_CONSTANTS.OPTION_SEPARATOR);
						if(key_split.length > 1 && value_split.length){
							if(key_split[1].includes('S')){
								showItem=false;
								var price_str = value_split[0].match(/\(([^)]+)\)/);
								if(price_str && price_str.length){
									value_split[0] = value_split[0].replace(price_str[0],'');
								}
								prdt_name = value_split[0].toUpperCase()+" "+prdt_name;
								arr = [item.quantity,prdt_name,$filter('number')(item.subtotal,2)];
								for(var d=0;d<prdtDepts.length;d++){
									var prdt_dept = prdtDepts[d];
									if(angular.isUndefined(output[prdt_dept])){
										output[prdt_dept] = [];
										dept_items_count[prdt_dept] = 0;
									}
									if(checkPrdtGrp(item.group)){
										output[prdt_dept].push(['',' ','']);
										output[prdt_dept].push(['*****',item.group.toUpperCase()+' *****',,'']);
										//output[prdt_dept].push(['',' ','']);
									}
									output[prdt_dept].push(arr);
									dept_items_count[prdt_dept]++;
								}
								delete varoption[key];
							}else if(key_split[1].includes('E')){
								showItem=false;
								var price_str = value_split[0].match(/\(([^)]+)\)/);
								if(price_str && price_str.length){
									value_split[0] = value_split[0].replace(price_str[0],'');
								}
								prdt_name = prdt_name+" "+value_split[0].toUpperCase();
								arr = [item.quantity,prdt_name,$filter('number')(item.subtotal,2)];
								for(var d=0;d<prdtDepts.length;d++){
									var prdt_dept = prdtDepts[d];
									if(angular.isUndefined(output[prdt_dept])){
										output[prdt_dept] = [];
										dept_items_count[prdt_dept] = 0;
									}
									if(checkPrdtGrp(item.group)){
										output[prdt_dept].push(['',' ','']);
										output[prdt_dept].push(['*****',item.group.toUpperCase()+' *****',,'']);
										//output[prdt_dept].push(['',' ','']);
									}
									output[prdt_dept].push(arr);
									dept_items_count[prdt_dept]++;
								}
								delete varoption[key];
							}else{
								for(var d=0;d<prdtDepts.length;d++){
									var prdt_dept = prdtDepts[d];
									if(angular.isUndefined(output[prdt_dept])){
										output[prdt_dept] = [];
										dept_items_count[prdt_dept] = 0;
									}
									if(showItem){
										if(checkPrdtGrp(item.group)){
											output[prdt_dept].push(['',' ','']);
											output[prdt_dept].push(['*****',item.group.toUpperCase()+' *****',,'']);
											//output[prdt_dept].push(['',' ','']);
										}
										output[prdt_dept].push(arr);
										dept_items_count[prdt_dept]++;
										showItem =false;
									}
								}
							}
						}
					});
			
					var variationstoshow = $scope.processDisplay(varoption);

					angular.forEach(variationstoshow,function(value,key){
						value=value.toFixed(1);
						var opt_arr = [];
						var option_key = $filter('split')(key,'###',0);
						option_key = $filter('split')(option_key,'_',0);
						arr = ['',option_key,''];
						//opt_arr.push(option_key);
						for(var d=0;d<prdtDepts.length;d++){
							var prdt_dept = prdtDepts[d];
							if(angular.isUndefined(output[prdt_dept])){
							output[prdt_dept] = [];
							dept_items_count[prdt_dept] = 0;
							}
							output[prdt_dept].push(arr);
						}
					});
					
					
				}else{
					for(var d=0;d<prdtDepts.length;d++){
						var prdt_dept = prdtDepts[d];
						if(angular.isUndefined(output[prdt_dept])){
							output[prdt_dept] = [];
							dept_items_count[prdt_dept] = 0;
						}
						if(checkPrdtGrp(item.group)){
							output[prdt_dept].push(['',' ','']);
							output[prdt_dept].push(['*****',item.group.toUpperCase()+' *****',' ']);
							//output[prdt_dept].push(['',' ','']);
						}
						output[prdt_dept].push(arr);
						dept_items_count[prdt_dept]++;
					}
				}
					
					
					/* if(angular.isDefined(item.variations)){
						var variationstoshow = $scope.processDisplay(item.variations);
						angular.forEach(variationstoshow,function(value,key){
							value=value.toFixed(1);
							var option_key = $filter('split')(key,'###',0);
							option_key = $filter('split')(option_key,'_',0);
							arr = ['',option_key,''];
							
							for(var d=0;d<prdtDepts.length;d++){
								var prdt_dept = prdtDepts[d];
								output[prdt_dept].push(arr);
							}
						});
					}else if(angular.isDefined(item.meta)){
						var varoption ={};
						for( var i=0;i<item.meta.length;i++){
							var option = item.meta[i];
							varoption[option.key]=option.value;
						}
						var variationstoshow = $scope.processDisplay(varoption);

						angular.forEach(variationstoshow,function(value,key){
							value=value.toFixed(1);
							var option_key = $filter('split')(key,'###',0);
							option_key = $filter('split')(option_key,'_',0);
							arr = ['',option_key,''];

							for(var d=0;d<prdtDepts.length;d++){
								var prdt_dept = prdtDepts[d];
								output[prdt_dept].push(arr);
							}
						});
					} */ 
					
					if(angular.isDefined(item.notes) && item.notes){
						arr = ['',item.notes,''];
						
						for(var d=0;d<prdtDepts.length;d++){
							var prdt_dept = prdtDepts[d];
							output[prdt_dept].push(arr);
						}
					}
					
					if(angular.isDefined(item.dash) && item.dash){
						arr = ['','INNER_DASH',''];
						for(var d=0;d<prdtDepts.length;d++){
							var prdt_dept = prdtDepts[d];
							output[prdt_dept].push(arr);
						}
					}
					
					rec_map3 = "Total items : "+kot_quantity;
				});
			}
			
			return output;
		}
	
		var print_array = [];
		var kot_needed = $scope.print_config.kot;
		if(action.type == 'PRINT'){
			//Template for Main Print (Full/Split)(Main printer)
			var items = get_order_data('MAIN_PRINT');
			rec_footer3='';
			angular.forEach($scope.AIVPrinterSettings,function(printer){
				if(printer.usage == 'Main'){
					//Print to Main printer
					rec_map5 = [];
					if($rootScope.aiv_info.address.length > printer.lineLength){
						//rec_address = $rootScope.aiv_info.address+","+$rootScope.aiv_info.phone1+","+$rootScope.aiv_info.domain.replace('http://','www.');
						rec_address = [];
						var start = 0,addr = $rootScope.aiv_info.address+","+$rootScope.aiv_info.phone1+","+$rootScope.aiv_info.domain.replace('http://','www.');
						for(var a=0;a<addr.length/printer.lineLength;a++){
							rec_address.push(["",addr.substr(start,printer.lineLength),""]);
							start+=printer.lineLength;
						}
					}else{
						rec_address.push(["",$rootScope.aiv_info.address,""]);
						rec_address.push(["",$rootScope.aiv_info.phone1+","+$rootScope.aiv_info.domain.replace('http://','www.'),""]);
					}
					
					rec_map5 = [];
					if($rootScope.aiv_info.fb_url){
						rec_map5.push(["",$rootScope.aiv_info.fb_url.toUpperCase(),""]);
					}
					
					if($rootScope.aiv_info.twitter){
						rec_map5.push(["",$rootScope.aiv_info.twitter.toUpperCase(),""]);
					}
			        
					rec_map2 = angular.copy(items[printer.dept]);
					rec_map3 = null;
					/*if(angular.isDefined(action.order.order_meta.split_unequal_value) && action.order.order_meta.split_unequal_value){
						var split_data = action.split;
						for(var i=0;i<split_data.length;i++){
							rec_total = "TO PAY: "+$filter('number')(split_data[i].total, 2);
							var print_margin = {'top':0,'bottom':0};
							var print_object = create_print_template(printer,'TABLE_PRINT',print_margin);
							print_object.device = printer;
							print_object.cashdrawer = false;
							print_array.push(print_object);
						}
					}else{
						var print_margin = {'top':0,'bottom':0};
						var print_object = create_print_template(printer,'TABLE_PRINT',print_margin);
						print_object.device = printer;
						print_object.cashdrawer = false;
						
						if(angular.isDefined(action.order.order_meta.split_count) && action.order.order_meta.split_count){
							for(var i=0;i<action.order.order_meta.split_count;i++){
								print_array.push(print_object);
							}
						}else{
							print_array.push(print_object);
						}
					}*/
					var print_margin = {'top':0,'bottom':0};
					if(angular.isDefined(action.void_items) && action.void_items.length)
						$scope.voidData=true;
					else
						$scope.voidData=false;
					var print_object = create_print_template(printer,'TABLE_PRINT',print_margin);
					print_object.device = printer;
					print_object.cashdrawer = false;
					
					if(angular.isDefined(action.order.order_meta.split_count) && action.order.order_meta.split_count){
						for(var i=0;i<action.order.order_meta.split_count;i++){
							var print_object_1 =angular.copy(print_object);
							print_array.push(print_object_1);
						}
					}else{
						print_array.push(print_object);
					}
				}
			})
		}else if(action.type == 'PAYOFF' && $scope.settings_data.enablePayOff){
			//Template for PayOff Print (Full/Split)(Main printer)
			if($scope.print_config.receipt){
				rec_header3 = 'This order has been PAID';
				var items = get_order_data('MAIN_PAY');
				angular.forEach($scope.AIVPrinterSettings,function(printer){
					if(printer.usage == 'Main'){
						//Print to Main printer
						if($rootScope.aiv_info.address.length > printer.lineLength){
							rec_address = $rootScope.aiv_info.address+","+$rootScope.aiv_info.phone1+","+$rootScope.aiv_info.domain.replace('http://','www.');
						}else{
							rec_address.push(["",$rootScope.aiv_info.address,""]);
							rec_address.push(["",$rootScope.aiv_info.phone1+","+$rootScope.aiv_info.domain.replace('http://','www.'),""]);
						}
						var print_margin = {'top':2,'bottom':2};
						var print_object = create_print_template(printer,'PAYOFF',print_margin);
						print_object.device = printer;
						if(action.order.payment_details.method_id == 'cod'){
							print_object.cashdrawer = true;
						}else{
							print_object.cashdrawer = false;
						}
						print_array.push(print_object);
					}
				})
			}
		}else if(action.type == 'PLACE_ORDER' && kot_needed){
			//Template for KOT (Departments)
			//rec_header3 = [["Table "+void_items," ","CV "+cover_number]];
			footer_2 ="";
			var items = get_order_data('KOT');
			if($scope.commonPrintSettings.kot_receipt){
				var dept_products = items['None'];
				resultMap = [];
				rec_total = "TOTAL: "+$filter('number')(action.order.total, 2);
			}
				
			angular.forEach(items,function(item,prdt_dept){
				//Check if dept printer added
				var Disabale = false;
				var exists = $filter('filter')($scope.AIVPrinterSettings,{dept:prdt_dept},true);
				if($scope.commonPrintSettings.kot_receipt  && Disabale){
					if(exists.length){
						rec_name = null;
						rec_address = null;
						rec_map5 = [];
						var data=[];
						//var data = angular.copy(items[prdt_dept]);
						for(var k=0;k<items[prdt_dept].length;k++){
							items[prdt_dept][k][2] ="";
							data.push(items[prdt_dept][k]);
							//data.push(['','NEWLINE',''])
							
						}
						/* for(var i=0;i<data.length;i++){
							data[i][2] ="";
						} */
						//rec_map2 = angular.copy(items[prdt_dept]);
						rec_map2=data;
						rec_thanks = null;
						rec_map3 = "Total items : "+action.order.total_line_items_quantity;
						var print_margin = {'top':2,'bottom':0};
						var print_object = create_print_template(exists[0],'TABLE_PRINT',print_margin);
						print_object.device = exists[0];
						print_object.cashdrawer = false;
						print_array.push(print_object);
					}else{
						var exists = $filter('filter')($scope.AIVPrinterSettings,{dept:'None'},true);
						if(exists.length){
							//Sent to Main printer if dept printer is not added
							rec_name = null;
							rec_address = null;
							rec_map5 = [];
							var data=[];
							//var data = angular.copy(items[prdt_dept]);
							for(var k=0;k<items[prdt_dept].length;k++){
								items[prdt_dept][k][2] ="";
								data.push(items[prdt_dept][k]);
								//data.push(['','NEWLINE',''])
								
							}
							/* for(var i=0;i<data.length;i++){
								data[i][2] ="";
							} */
							//rec_map2 = angular.copy(items[prdt_dept]);
							rec_map2=data;
							rec_thanks = null;
							rec_map3 = "Total items : "+action.order.total_line_items_quantity;
							var print_margin = {'top':6,'bottom':0};
							var print_object = create_print_template(exists[0],'TABLE_PRINT',print_margin);
							print_object.device = exists[0];
							print_object.cashdrawer = false;
							print_array.push(print_object);
						}
					}
				}else{
					if(exists.length){
						//Order has products for this printer
						//var data = angular.copy(items[prdt_dept]);
						/* for(var i=0;i<data.length;i++){
							data[i][2] ="";
							
						} */
						var data=[];
						for(var k=0;k<items[prdt_dept].length;k++){
							items[prdt_dept][k][2] ="";
							data.push(items[prdt_dept][k]);
							data.push(['','NEWLINE',''])
							
						}
						//rec_map2 = angular.copy(items[prdt_dept]);
						rec_map2=data;
						rec_map3 = [["","Total items",dept_items_count[prdt_dept]]];
						var print_margin = {'top':6,'bottom':0};
						var print_object = create_print_template(exists[0],'TABLE_KOT',print_margin);
						var dept_exists = $filter('filter')($scope.dept_receiptCount,{dept:prdt_dept},true);
						if(dept_exists.length){
							print_object.conf.copies = dept_exists[0].copies;
						}
						print_object.device = exists[0];
						print_object.cashdrawer = false;
						print_array.push(print_object);
						//console.log("Added to "+prdt_dept+ "printer");
					}else{
						var exists = $filter('filter')($scope.AIVPrinterSettings,{dept:'None'},true);
						if(exists.length){
							//Sent to Main printer if dept printer is not added
							//var data = angular.copy(items[prdt_dept]);
							/* for(var i=0;i<data.length;i++){
								data[i][2] ="";
							} */
							var data =[];
							for(var k=0;k<items[prdt_dept].length;k++){
								items[prdt_dept][k][2] ="";
								data.push(items[prdt_dept][k]);
								//data.push(['','NEWLINE',''])
								
							}
								//rec_map2 = angular.copy(items[prdt_dept]);
							rec_map2=data;
							rec_map3 = [["","Total items",dept_items_count[prdt_dept]]];
							var print_margin = {'top':6,'bottom':0};
							var print_object = create_print_template(exists[0],'TABLE_KOT',print_margin);
							var dept_exists = $filter('filter')($scope.dept_receiptCount,{dept:prdt_dept},true);
							if(dept_exists.length){
								print_object.conf.copies = dept_exists[0].copies;
							}
							print_object.device = exists[0];
							print_object.cashdrawer = false;
							print_array.push(print_object);
							console.log("Added to Main printer");
						}
					}
				}
			})
		}else if(action.type == 'MAIN_RELEASE' || action.type == 'AFTERS_RELEASE' || action.type == 'STARTER_RELEASE' || action.type == 'DRINKS_RELEASE'){
			//Disable release print to main printer
			
			//Template for Release (Departments)
			var items = get_order_data('KOT');
			if(action.type == 'MAIN_RELEASE'){
				rec_header3 = 'RELEASE MAIN';
			}else if(action.type == 'AFTERS_RELEASE'){
				rec_header3 = 'RELEASE AFTERS';
			}else if(action.type == 'STARTER_RELEASE'){
				rec_header3 = 'RELEASE STARTERS';
			}else if(action.type == 'DRINKS_RELEASE'){
				rec_header3 = 'RELEASE DRINKS';
			}
			if (!angular.isArray($localstorage.getArray(AIV_CONSTANTS.LS_PREFIX+'realsePrinter'))) {
				$scope.settings_data.releasePrinter = $localstorage.getObject(AIV_CONSTANTS.LS_PREFIX+'realsePrinter');
			}
				var relasePrinterData = $scope.settings_data.releasePrinter[action.type];
				if(relasePrinterData.includes('(')){
					relasePrinterData = relasePrinterData.split('(')[1];
					relasePrinterData=relasePrinterData.replace(/[^\w\s]/gi, '');
				}
				var exists = $filter('filter')($scope.AIVPrinterSettings,{dept:relasePrinterData},true);
				if(exists.length){
					//Sent to dept this printer
					var print_margin = {'top':5,'bottom':5};
					var print_object = create_print_template(exists[0],'RELEASE',print_margin);
					print_object.device = exists[0];
					print_object.cashdrawer = false;
					print_array.push(print_object);
					console.log("Added to "+relasePrinterData+ "printer");
				}else if(action.type != 'STARTER_RELEASE'){//Custom logic
					var exists = $filter('filter')($scope.AIVPrinterSettings,{dept:'None'},true);
					if(exists.length){
						//Sent to Main printer if dept printer is not added
						var print_margin = {'top':5,'bottom':5};
						var print_object = create_print_template(exists[0],'RELEASE',print_margin);
						print_object.device = exists[0];
						print_object.cashdrawer = false;
						print_array.push(print_object);
						console.log("Added to Main printer");
					}
				}
			/* angular.forEach(items,function(item,prdt_dept){
				//Check if dept printer added
				var exists = $filter('filter')($scope.AIVPrinterSettings,{dept:prdt_dept},true);
				if(exists.length){
					//Sent to dept this printer
					var print_margin = {'top':5,'bottom':5};
					var print_object = create_print_template(exists[0],'RELEASE',print_margin);
					print_object.device = exists[0];
					print_object.cashdrawer = false;
					print_array.push(print_object);
					console.log("Added to "+prdt_dept+ "printer");
				} *//*else if(action.type != 'STARTER_RELEASE'){//Custom logic
					var exists = $filter('filter')($scope.AIVPrinterSettings,{dept:'None'},true);
					if(exists.length){
						//Sent to Main printer if dept printer is not added
						var print_margin = {'top':5,'bottom':5};
						var print_object = create_print_template(exists[0],'RELEASE',print_margin);
						print_object.device = exists[0];
						print_object.cashdrawer = false;
						print_array.push(print_object);
						console.log("Added to Main printer");
					}
				}*/
			//})
		}
			
		if(print_array.length){
			//Handle multiple copies
			var final_print_array = [];
			for(var i=0;i<print_array.length;i++){
				if(print_array[i].conf.copies > 1){
					var print_data = angular.copy(print_array[i]);
					var copies = print_data.conf.copies;
					print_array[i].conf.copies = 1;
					final_print_array.push(print_array[i]);
					
					print_data.data.splice(0,0,{ type: 'raw', data: "====REPRINT====\n\n" });
					print_data.conf.copies = copies-1;
					print_data.cashdrawer = false;
					final_print_array.push(print_data);
					i++;
				}else{
					final_print_array.push(print_array[i]);
				}
			}
			multi_print_receipts(final_print_array,show_dialog);
		}
		
	}
	
	var multi_print_loop = function(configs,data) {
		var chain = [];

		for(var i = 0; i < data.length; i++) {
			(function(i_) {
				//setup this chain link
				var link = function() {
					return QZHelper.print(configs[i_], data[i_]);
				};

				chain.push(link);
			})(i);
			//closure ensures this promise's concept of `i` doesn't change
		}
		
		//can be .connect or `Promise.resolve()`, etc
		var firstLink = new RSVP.Promise(function(r, e) { r(); });

		var lastLink = null;
		chain.reduce(function(sequence, link) {
			lastLink = sequence.then(link);
			return lastLink;
		}, firstLink);

		//this will be the very last link in the chain
		lastLink.catch(function(err) {
			console.error(err);
		});
	}

	var multi_print_receipts = function(print_array,show_dialog){
		var multi_print_array = {'config':[],'data':[]};
		for(var p=0;p<print_array.length;p++){
			var config = QZHelper.createConfigs(print_array[p].device.name,print_array[p].conf);
			multi_print_array.config.push(config);
			
			if(print_array[p].device.enable_cut){
				print_array[p].data.push({ type: 'raw', format:'plain', data: gen_print_command(print_array[p].device.cmd_cut) });
			}else{
				print_array[p].data.push({ type: 'raw', data: "\n\n\n\n\n" });
			}
			
			if(print_array[p].cashdrawer){
				print_array[p].data.unshift({ type: 'raw', format:'plain', data: gen_print_command(print_array[p].device.cmd_cashdrawer) });
				console.log("Cashdrawer opened");
			}
			
			console.log("Printer "+print_array[p].device.name+" ("+print_array[p].device.usage+"/"+print_array[p].device.dept+"), Copy : "+print_array[p].conf.copies);
			var console_data = "";
			for(var f=0;f<print_array[p].data.length;f++){
				if(print_array[p].data[f].format == undefined){
					console_data+=print_array[p].data[f].data;
				}
			}
			console.log(console_data);
			multi_print_array.data.push(print_array[p].data);
		}
		
		var deferred = $q.defer();

		QZHelper.startConnection().then(function(response){
			if(show_dialog){
				$ionicLoading.show({
					template : 'Printing...',
					duration : 1300
				});
			}
			multi_print_loop(multi_print_array.config,multi_print_array.data);
		}).catch(function(res) {
			$scope.showCheckoutMsg('Error','Unable to connect to printer...<br>Please make sure that QZ Tray is installed and started.');
			QZHelper.handleConnectionError(res.err);
			
			deferred.reject(res.err);
		});
		
		return deferred.promise;
	}
	
	$scope.orderSortFunc = function(order){
		var result = '';
		if(order.data.order_meta.wc_pos_order_type =='POS')
			result = order.data.created_at;
		else{
			if(order.data.order_meta.accepted_at)
				result = order.data.order_meta.accepted_at;
			else
				result = order.data.created_at;
			}
		return result;
		/* var result = 0;
		try {
			result = parseInt(order.data.order_meta.daily_order_no);
		}catch(err)
		{
			console.log(err.message);
		}
		
		return result; */
	};
	/* $scope.orderSortFuncDate = function(order){
		
		
		var time_split = "";
		try {
			time_split=order.data.created_at.split("T")[0];
		}catch(err)
		{
			console.log(err.message);
		}
		
		return time_split;
	}; */
	
	$scope.printReport = function(report){
		if($scope.settingsPrinter.type == "Receipt Print"){
			if($scope.selected_report_type == 'Z' || $scope.selected_report_type == 'X'){
				$scope.printRawReport(report);
			}else if ($scope.selected_report_type == 'VOID' ){
				$scope.printOtherReports(report);
			}else if($scope.selected_report_type == 'D'){
				$scope.printDReports(report);
			}else{
				$scope.showCheckoutMsg('Error','This report cannot be printed using receipt printer. Please select a Pixel printer and try again...');
			}
		}else if($scope.settingsPrinter.type == "Pixel Print"){
			$scope.printPixelReport(report);
		}
	}
	
	$scope.printPixelReport = function(report){
		var config = QZHelper.getPrintParams();
		config.copies = 1;
		var paper_width = "8.5";
		var paper_height = "11";
		var paper_type = "letter";
		if(config.size != null){
			paper_width = config.size.width * 25.4;//Inch to mm
			paper_height = config.size.height * 25.4;
			
			for(var i=0;i<$scope.aiv_paper_sizes.length;i++){
				if($scope.aiv_paper_sizes[i].width == config.size.width && $scope.aiv_paper_sizes[i].height == config.size.height){
					paper_type = $scope.aiv_paper_sizes[i].type.toLowerCase();
				}
			}
		}
		
		var line_height = 5;
		var current_y = 20;
		var x_start = 15;
			
		var doc;
		if($scope.selected_report_type == 'PAR'){
			doc= new jsPDF('l','mm',paper_type);
			config.orientation = "landscape";
			
			//Swap width and height
			var temp = paper_width;
			paper_width = paper_height;
			paper_height = temp;
		}else{
			doc= new jsPDF('p','mm',paper_type);
			config.orientation = "portrait";
		}
		var totalPagesExp = "{total_pages_count_string}";
		var title = $scope.selected_report_title+' at '+$filter('date')(new Date(), "MMM d, y h:mm:ss a");
		
		var pdf_header = function (data) {
			// HEADER
			doc.setFontSize(10);
			doc.setFontStyle('normal');
			//doc.text($scope.selected_report_title, paper_width/2, 10);
			doc.text(paper_width/2, 10, title, null, null, 'center');

			// FOOTER
			var str = "Page " + data.pageCount;
			// Total page number plugin only available in jspdf v1.0+
			if (typeof doc.putTotalPages === 'function') {
				str = str + " of " + totalPagesExp;
			}
			doc.setFontSize(10);
			doc.text(str, data.settings.margin.left, doc.internal.pageSize.height - 10);
		};
	
		doc.setFontSize(22);
		doc.text(paper_width/2, current_y, $scope.selected_report_title, null, null, 'center');
		current_y+=line_height+5;
		
		doc.setFontSize(12);
		doc.text(paper_width/2, current_y, $rootScope.aiv_info.name, null, null, 'center');
		current_y+=line_height;
		doc.text(paper_width/2, current_y, $rootScope.aiv_info.address, null, null, 'center');
		current_y+=line_height;
		doc.text(paper_width/2, current_y, $rootScope.aiv_info.phone1, null, null, 'center');
		current_y+=line_height;
		doc.text(paper_width/2, current_y, $rootScope.aiv_info.domain, null, null, 'center');
		current_y+=line_height;

		var header_row = [];
		var content_info = [];
		var span_rows = [];
		var column_width = 'auto',custom_col_width = 'auto';
		var column_align = 'right';
		if($scope.selected_report_type == 'AD'){
			doc.text(paper_width/2, current_y, yyyymmdd($scope.ad_from_date)+' to '+yyyymmdd($scope.ad_to_date), null, null, 'center');
			current_y+=line_height;
			header_row.push(
				{title: "Customer",dataKey: "col1"},
				{title: "Current("+$rootScope.aiv_info.currency_symbol+")",dataKey: "current"},
				{title: "0 to 30("+$rootScope.aiv_info.currency_symbol+")",dataKey: "upto30"},
				{title: "Over 30("+$rootScope.aiv_info.currency_symbol+")",dataKey: "over30"},
				{title: "Over 60("+$rootScope.aiv_info.currency_symbol+")",dataKey: "over60"},
				{title: "Over 90("+$rootScope.aiv_info.currency_symbol+")",dataKey: "over90"},
				{title: "Amount due("+$rootScope.aiv_info.currency_symbol+")",dataKey: "amount"}
			);

			angular.forEach(report,function(sales,key){
				content_info.push({
					col1:sales.customer,
					current:sales.current.toFixed(2),
					upto30:sales.upto30.toFixed(2),
					over30:sales.over30.toFixed(2),
					over60:sales.over60.toFixed(2),
					over90:sales.over90.toFixed(2),
					amount:sales.amount_due.toFixed(2)
				});
			});
		}else if($scope.selected_report_type == 'CSR'){
			doc.text(paper_width/2, current_y, yyyymmdd($scope.csr_from_date)+' to '+yyyymmdd($scope.csr_to_date), null, null, 'center');
			current_y+=line_height;
			header_row.push(
				{title: "Product",dataKey: "col1"},
				{title: "Qty",dataKey: "qty"},
				{title: "Amount due("+$rootScope.aiv_info.currency_symbol+")",dataKey: "amount"}
			);

			var pos = 0;
			angular.forEach(report,function(products,key){
				if(!$scope.report_filters.customer || $scope.report_filters.customer == key){
					span_rows.push({text:key,align:"left",index:pos});
					angular.forEach(products,function(sales,name){
						content_info.push({
							col1:name,
							qty:sales.quantity,
							amount:sales.sales.toFixed(2)
						});
						pos++;
					});
				}
			});
		}else if($scope.selected_report_type == 'PSR'){
			var pos_term = (!$scope.report_filters.pos)?'All Terminals':$scope.report_filters.pos;
			doc.text(paper_width/2, current_y, yyyymmdd($scope.psr_from_date)+' to '+yyyymmdd($scope.psr_to_date)+' ('+pos_term+')', null, null, 'center');
			current_y+=line_height;
		
			header_row.push(
				{title: "Product",dataKey: "col1"},
				{title: "Qty",dataKey: "qty"},
				{title: "Amount ("+$rootScope.aiv_info.currency_symbol+")",dataKey: "amount"}
			);

			angular.forEach(report,function(product,key){
				content_info.push({
					col1:product.name,
					qty:product.quantity,
					amount:product.amount.toFixed(2)
				});
			});
		}else if($scope.selected_report_type == 'CPL'){
			doc.text(paper_width/2, current_y, yyyymmdd($scope.cpl_from_date)+' to '+yyyymmdd($scope.cpl_to_date), null, null, 'center');
			current_y+=line_height;
			custom_col_width = 15;
			header_row.push({title: "Products",dataKey: "col1"});
			if($scope.report_filters.show_price){
				header_row.push(
					{title: "Price("+$rootScope.aiv_info.currency_symbol+")",dataKey: "price"},
					{title: "",dataKey: "price2"},
					{title: "",dataKey: "price3"},
					{title: "",dataKey: "price4"},
					{title: "",dataKey: "price5"},
					{title: "",dataKey: "price6"},
					{title: "",dataKey: "price7"}
				);
			}

			var pos = 0;
			angular.forEach(report,function(products,key){
				span_rows.push({text:key,align:"left",index:pos});
				angular.forEach(products,function(product,name){
					if($scope.report_filters.show_price){
						content_info.push({
							col1:name,
							price:product.price
						});
					}else{
						content_info.push({
							col1:name,
						});
					}
					pos++;
				});
			});
		}else if($scope.selected_report_type == 'PL'){
			custom_col_width = 15;
			header_row.push({title: "Products",dataKey: "col1"});
			if($scope.report_filters.show_price){
				header_row.push(
					{title: "Price("+$rootScope.aiv_info.currency_symbol+")",dataKey: "price1"},
					{title: "",dataKey: "price2"},
					{title: "",dataKey: "price3"},
					{title: "",dataKey: "price4"},
					{title: "",dataKey: "price5"},
					{title: "",dataKey: "price6"},
					{title: "",dataKey: "price7"}
				);
			}

			var pos = 0;
			angular.forEach(report,function(products,key){
				if(!$scope.report_filters.category || $scope.report_filters.category == key){
					span_rows.push({text:key,align:"left",index:pos});
					angular.forEach(products,function(product){
						if($scope.report_filters.show_price){
							content_info.push({
								col1:product.title,
								price1:angular.isUndefined(product.meta.wc_productdata_options)?product.price:product.meta.wc_productdata_options[0].sales_price,
							});
						}else{
							content_info.push({
								col1:product.title,
							});
						}
						pos++;
					});
				}
			});
		}else if($scope.selected_report_type == 'CATL'){
			header_row.push({title: "Name",dataKey: "col1"},{title: "Code",dataKey: "code"});

			angular.forEach(report,function(category){
				content_info.push({
					col1:category.name,
					code:category.code
				})
			});
		}else if($scope.selected_report_type == 'CS'){
			doc.text(paper_width/2, current_y, yyyymmdd($scope.cs_from_date)+' to '+yyyymmdd($scope.cs_to_date), null, null, 'center');
			current_y+=line_height;
			header_row.push(
				{title: "Customer",dataKey: "col1"},
				{title: "Sales(%)",dataKey: "sales"},
				{title: "Amount("+$rootScope.aiv_info.currency_symbol+")",dataKey: "amount"}
			);

			angular.forEach(report,function(sales,key){
				content_info.push({
					col1:key,
					sales:sales.percentage.toFixed(2),
					amount:sales.sales_total.toFixed(2),
				});
			});
		}else if($scope.selected_report_type == 'DS'){
			doc.text(paper_width/2, current_y, yyyymmdd($scope.ds_from_date)+' to '+yyyymmdd($scope.ds_to_date), null, null, 'center');
			current_y+=line_height;
			header_row.push(
				{title: "Type",dataKey: "col1"},
				{title: "ID",dataKey: "id"},
				{title: "Date",dataKey: "date"},
				{title: "Amount due("+$rootScope.aiv_info.currency_symbol+")",dataKey: "amount"}
			);

			var pos = 0;
			angular.forEach(report,function(customer,key){
				if(!$scope.report_filters.customer || $scope.report_filters.customer == key){
					span_rows.push({text:key,align:"left",index:pos});
					angular.forEach(customer.invoice,function(inv,inv_id){
						content_info.push({
							col1:inv.type,
							id:inv_id,
							date:inv.date,
							amount:inv.debt.toFixed(2)
						});
						pos++;
					});
					span_rows.push({text:'Total : '+$rootScope.aiv_info.currency_symbol+customer.total.toFixed(2),align:"right",index:pos});
				}
			});
		}else if($scope.selected_report_type == 'OH'){
			var pos_term = (!$scope.report_filters.pos)?'All Terminals':$scope.report_filters.pos;
			doc.text(paper_width/2, current_y, yyyymmdd($scope.oh_from_date)+' to '+yyyymmdd($scope.oh_to_date)+' ('+pos_term+')', null, null, 'center');
			current_y+=line_height;
			
			header_row.push(
				{title: "Date",dataKey: "col1"},
				{title: "Bill No.",dataKey: "bill_no"},
				{title: "Order No.",dataKey: "order_no"},
				{title: "Gross Total("+$rootScope.aiv_info.currency_symbol+")",dataKey: "gross_total"},
				{title: "Net Total("+$rootScope.aiv_info.currency_symbol+")",dataKey: "net_total"},
				{title: "Shipping("+$rootScope.aiv_info.currency_symbol+")",dataKey: "shipping"},
				{title: "VAT("+$rootScope.aiv_info.currency_symbol+")",dataKey: "vat"},
				{title: "Profit("+$rootScope.aiv_info.currency_symbol+")",dataKey: "profit"}
			);

			angular.forEach(report.orders,function(sales){
				content_info.push({
					col1:sales.date,
					bill_no:sales.bill_number,
					order_no:sales.order_no,
					gross_total:sales.gross_total.toFixed(2),
					net_total:sales.net_total.toFixed(2),
					shipping:sales.shipping.toFixed(2),
					vat:sales.vat.toFixed(2),
					profit:sales.profit.toFixed(2)
				});
			});

			content_info.push({
				col1:"",
				bill_no:"",
				order_no:"",
				gross_total:$rootScope.aiv_info.currency_symbol+report.total_gross.toFixed(2),
				net_total:$rootScope.aiv_info.currency_symbol+report.total_net.toFixed(2),
				shipping:$rootScope.aiv_info.currency_symbol+report.total_shipping.toFixed(2),
				vat:$rootScope.aiv_info.currency_symbol+report.total_vat.toFixed(2),
				profit:$rootScope.aiv_info.currency_symbol+report.total_profit.toFixed(2)
			});
		}else if($scope.selected_report_type == 'OI'){
			doc.text(paper_width/2, current_y, yyyymmdd($scope.oi_from_date)+' to '+yyyymmdd($scope.oi_to_date), null, null, 'center');
			current_y+=line_height;
			header_row.push(
				{title: "Type",dataKey: "col1"},
				{title: "Invoice No.",dataKey: "invoice_no"},
				{title: "Date",dataKey: "date"},
				{title: "Due Date",dataKey: "due_date"},
				{title: "Days Overdue",dataKey: "due_days"},
				{title: "Outstanding("+$rootScope.aiv_info.currency_symbol+")",dataKey: "amount"}
			);

			var pos = 0;
			angular.forEach(report,function(sales,key){
				if(!$scope.report_filters.customer || $scope.report_filters.customer == key){
					span_rows.push({text:sales.customer,align:"left",index:pos});
					angular.forEach(sales.orders,function(item){
						content_info.push({
							col1:item.type,
							invoice_no:item.bill_number,
							date:item.date,
							due_date:item.due_date,
							due_days:item.due_days,
							amount:item.outstanding.toFixed(2)
						});
						pos++;
					});
					span_rows.push({text:'Total : '+$rootScope.aiv_info.currency_symbol+sales.due_total.toFixed(2),align:"right",index:pos});
				}
			});
		}else if($scope.selected_report_type == 'OUTOFSTOCK'){
			doc.text(paper_width/2, current_y, yyyymmdd($scope.outofstock_from_date)+' to '+yyyymmdd($scope.outofstock_to_date), null, null, 'center');
			current_y+=line_height;
			header_row.push(
				{title: "Products",dataKey: "col1"},
				{title: "Quantity",dataKey: "qty"}
			);
			column_align = 'center';
			angular.forEach(report.products,function(item,key){
				content_info.push({
					col1:item.title,
					qty:item.count
				});
			});
		}else if($scope.selected_report_type == 'CASHFLOW'){
			var pos_term = (!$scope.report_filters.pos)?'All Terminals':$scope.report_filters.pos;
			doc.text(paper_width/2, current_y, 'On '+yyyymmdd($scope.cashflow_from_date)+' ('+pos_term+')', null, null, 'center');
			current_y+=line_height;
			header_row.push(
				{title: "Purpose",dataKey: "col1"},
				{title: "Date",dataKey: "date"},
				{title: "Type",dataKey: "type"},
				{title: "Payment",dataKey: "payment"},
				{title: "Amount("+$rootScope.aiv_info.currency_symbol+")",dataKey: "amount"}
			);

			var pos = 0;
			angular.forEach(report,function(terminal,key){
				span_rows.push({text:key,align:"left",index:pos});
				angular.forEach(terminal.data,function(cashflow){
					content_info.push({
						col1:cashflow.desc,
						date:cashflow.date,
						type:cashflow.type,
						payment:cashflow.pending,
						amount:parseFloat(cashflow.amount).toFixed(2)
					});
					pos++;
				});
				span_rows.push({text:'Total Income : '+$rootScope.aiv_info.currency_symbol+terminal.inc_total.toFixed(2)
					+'    Total Expense : '+$rootScope.aiv_info.currency_symbol+terminal.exp_total.toFixed(2),align:"right",index:pos});
			});
		}else if($scope.selected_report_type == 'PAR'){
			var pos_term = (!$scope.report_filters.pos)?'All Terminals':$scope.report_filters.pos;
			doc.text(paper_width/2, current_y, yyyymmdd($scope.par_from_date)+' to '+yyyymmdd($scope.par_to_date)+' ('+pos_term+')', null, null, 'center');
			current_y+=line_height;
			header_row.push(
				{title: "Date",dataKey: "col1"},
				{title: "Sales Gross Total("+$rootScope.aiv_info.currency_symbol+")",dataKey: "gross_total"},
				{title: "Shipping("+$rootScope.aiv_info.currency_symbol+")",dataKey: "shipping"},
				{title: "VAT("+$rootScope.aiv_info.currency_symbol+")",dataKey: "vat"},
				{title: "Sales Net Total("+$rootScope.aiv_info.currency_symbol+")",dataKey: "net_total"},
				{title: "Other Income("+$rootScope.aiv_info.currency_symbol+")",dataKey: "income"},
				{title: "Other Expenses("+$rootScope.aiv_info.currency_symbol+")",dataKey: "expense"},
				{title: "Profit("+$rootScope.aiv_info.currency_symbol+")",dataKey: "profit"}
			);

			angular.forEach(report.orders,function(sales,key){
				content_info.push({
					col1:sales.date,
					gross_total:sales.gross_total.toFixed(2),
					shipping:sales.shipping.toFixed(2),
					vat:sales.vat.toFixed(2),
					net_total:sales.net_total.toFixed(2),
					income:sales.income.toFixed(2),
					expense:sales.expense.toFixed(2),
					profit:sales.profit.toFixed(2)
				});
			});

			content_info.push({
				col1:"",
				gross_total:$rootScope.aiv_info.currency_symbol+report.total_gross.toFixed(2),
				shipping:$rootScope.aiv_info.currency_symbol+report.total_shipping.toFixed(2),
				vat:$rootScope.aiv_info.currency_symbol+report.total_vat.toFixed(2),
				net_total:$rootScope.aiv_info.currency_symbol+report.total_net.toFixed(2),
				income:$rootScope.aiv_info.currency_symbol+report.other_income.toFixed(2),
				expense:$rootScope.aiv_info.currency_symbol+report.other_expense.toFixed(2),
				profit:$rootScope.aiv_info.currency_symbol+report.total_profit.toFixed(2)
			});
		}else if($scope.selected_report_type == 'X' || $scope.selected_report_type == 'Z'){
			header_row.push(
				{title: "",dataKey: "col1"},
				{title: "Amount("+$rootScope.aiv_info.currency_symbol+")",dataKey: "amount"}
			);
			var pos = 0;
			span_rows.push({text:"Sales",align:"left",index:pos});
			content_info.push(
				{col1:"Sales total",amount:report.by_sales.subtotal.toFixed(2)},
				{col1:"Delivery charges",amount:report.by_sales.total_shipping.toFixed(2)},
				{col1:"Discounts",amount:report.by_sales.total_discount.toFixed(2)}
			);
			pos+=3;
			span_rows.push({text:'Total : '+report.by_sales.total.toFixed(2),align:"right",index:pos});
			
			span_rows.push({text:"By Shipping methods",align:"left",index:pos});
			content_info.push(
				{col1:"Delivery x "+report.by_shipping.local_delivery.count+" items",amount:report.by_shipping.local_delivery.amount.toFixed(2)},
				{col1:"Collection x "+report.by_shipping.local_pickup.count+" items",amount:report.by_shipping.local_pickup.amount.toFixed(2)},
				{col1:"In Shop x "+report.by_shipping.in_shop.count+" items",amount:report.by_shipping.in_shop.amount.toFixed(2)}
			);
			pos+=3;
			span_rows.push({text:'Total : '+report.by_shipping.total.amount.toFixed(2),align:"right",index:pos});

			span_rows.push({text:"By Payment methods",align:"left",index:pos});
			content_info.push(
				{col1:"Cash x "+report.by_payment.cod.count+" items",amount:report.by_payment.cod.amount.toFixed(2)},
				{col1:"Card x "+report.by_payment.card.count+" items",amount:report.by_payment.card.amount.toFixed(2)},
				{col1:"Online Card x "+report.by_payment.stripe.count+" items",amount:report.by_payment.stripe.amount.toFixed(2)},
				{col1:"PayPal x "+report.by_payment.paypal.count+" items",amount:report.by_payment.paypal.amount.toFixed(2)}
			);
			pos+=3;
			span_rows.push({text:'Total : '+report.by_payment.total.amount.toFixed(2),align:"right",index:pos});
			
			span_rows.push({text:"By Order types",align:"left",index:pos});
			content_info.push(
				{col1:"POS Orders x "+report.by_outlet.pos.count+" items",amount:report.by_outlet.pos.amount.toFixed(2)},
				{col1:"Web Orders x "+report.by_outlet.web.count+" items",amount:report.by_outlet.web.amount.toFixed(2)}
			);
			pos+=3;
			span_rows.push({text:'Total : '+report.by_outlet.total.amount.toFixed(2),align:"right",index:pos});
		}else if($scope.selected_report_type == 'CART_LIST'){
			header_row.push({title: "Products",dataKey: "col1"});
			if($scope.report_filters.show_price){
				header_row.push({title: "Price("+$rootScope.aiv_info.currency_symbol+")",dataKey: "price"});
			}
			angular.forEach($scope.cartItems,function(product){
				if($scope.report_filters.show_price){
					content_info.push({
						col1:product.title,
						price:product.price
					})
				}else{
					content_info.push({col1:product.title});
				}
			});
		}else if($scope.selected_report_type == 'CUST_LIST'){
			column_align = 'right';
			column_width = 25;
			header_row.push(
				{title: "Name",dataKey: "col1"},
				{title: "Address",dataKey: "col2"},
				{title: "Phone No.",dataKey: "col3"},
				{title: "Mobile No.",dataKey: "col4"},
				{title: "Email Id",dataKey: "col5"},
				{title: "Price band",dataKey: "col6"},
				{title: "Max Credit Period(in days)",dataKey: "period"},
				{title: "Max Credit Amount("+$rootScope.aiv_info.currency_symbol+")",dataKey: "amount"}
			);

			angular.forEach(report,function(row){
				var address = row.doc.billing_address.address_1;
				address+=(row.doc.billing_address.address_2!="")?","+row.doc.billing_address.address_2:"";
				address+=(row.doc.billing_address.city!="")?","+row.doc.billing_address.city:"";
				address+=","+row.doc.billing_address.postcode;
				content_info.push({
					col1:row.doc.first_name+" "+row.doc.last_name,
					col2:address,
					col3:row.doc.billing_address.phone,
					col4:row.doc.billing_address.phone,
					col5:row.doc.email,
					col6:row.doc.meta.price_band,
					period:row.doc.meta.max_credit_period,
					amount:row.doc.meta.max_credit_amount
				});
			});
		}
		
		doc.autoTable(header_row, content_info, {
			startY: current_y,
			theme: 'grid',
			tableWidth: 'auto',
			tableLineColor: 68,
			styles :{
				fontSize: 10,
				cellPadding: 1,
				halign: column_align,
				lineColor: 68,
				overflow: 'linebreak',
				columnWidth:custom_col_width
			},
			headerStyles :{
				halign: 'center',
				//columnWidth:'wrap',
				fillColor: 221,
				textColor: 68,
			},
			columnStyles: {
				col1: {
					halign: 'left',
					columnWidth:column_width
				},
				col2: {
					halign: 'left',
					columnWidth:35
				},
				col3: {
					halign: 'left',
					columnWidth:column_width
				},
				col4: {
					halign: 'left',
					columnWidth:column_width
				},
				col5: {
					halign: 'left',
					columnWidth:30
				},
				col6: {
					halign: 'left',
					columnWidth:15
				}
			},
			addPageContent:pdf_header,
			drawRow: function (row, data) {
				// Colspan
				for(var i=0;i<span_rows.length;i++){
					if(span_rows[i].index == row.index){
						doc.setFontStyle('bold');
						doc.setFontSize(10);
						if(span_rows[i].align == "right"){
							doc.rect(data.settings.margin.left, row.y, data.table.width, 5);
							var w = doc.getStringUnitWidth(span_rows[i].text) * 10 * 25.6/72; // Where 12 is the chosen font size, 25.6/72 gives mm
							doc.autoTableText(span_rows[i].text, data.settings.margin.left + data.table.width-1, row.y + row.height / 2, {
								halign: span_rows[i].align,
								valign: 'middle'
							});
							data.cursor.y += 5;
						}
						
						if(span_rows[i].align == "left"){
							doc.setFillColor(221,221,221);
							doc.rect(data.settings.margin.left, data.cursor.y, data.table.width, 5, 'FD');
							doc.autoTableText(span_rows[i].text, data.settings.margin.left, data.cursor.y + row.height / 2, {
								halign: span_rows[i].align,
								valign: 'middle'
							});
							data.cursor.y += 5;
						}
					}
				}
			},
			drawCell: function (cell, data) {
				if(data.row.index == content_info.length-1 && ($scope.selected_report_type == 'OH' || $scope.selected_report_type == 'PAR')){
					cell.styles.fontStyle = 'bold';
				}
			},
		});
		
		if(span_rows.length){
			var tb_width = doc.autoTable.previous.width;
			if(span_rows[span_rows.length-1].align == "right"){
				doc.setFontStyle('bold');
				doc.setFontSize(10);
				doc.rect(doc.autoTable.previous.pageStartX, doc.autoTable.previous.finalY, tb_width, 5);
				var w = doc.getStringUnitWidth(span_rows[span_rows.length-1].text) * 10 * 25.6/72; // Where 12 is the chosen font size, 25.6/72 gives mm
				console.log(w);
				doc.text(paper_width-w+10, doc.autoTable.previous.finalY+4, span_rows[span_rows.length-1].text, null, null, 'right');
			}
		}
				
		// Total page number plugin only available in jspdf v1.0+
		if (typeof doc.putTotalPages === 'function') {
			doc.putTotalPages(totalPagesExp);
		}
		//doc.output('dataurlnewwindow');
		$scope.printPDF([{type: 'pdf',format: 'base64',data: btoa(doc.output())}],config);
	}
	
	$scope.printRawReport = function(report){
		var pos_term = (!$scope.report_filters.pos)?'All Terminals':$scope.report_filters.pos;
		if($scope.selected_report_type == 'X'){
			rec_subtitle = $scope.selected_report_title+' On '+yyyymmdd($scope.xr_from_date)+' ('+pos_term+')';
		}else{
			rec_subtitle = $scope.selected_report_title+' On '+yyyymmdd($scope.zr_from_date)+' ('+pos_term+')';
		}		
		
		rec_name = ["",$rootScope.aiv_info.name,""];
		var addr = $rootScope.aiv_info.address.split(',');
		rec_address = [];
		rec_phone = ["",$rootScope.aiv_info.phone1,""];
		rec_web = [["",$rootScope.aiv_info.domain,""]];
		rec_total = '';
		
		rec_address.push(rec_name);
		for(var i=0;i<addr.length;i++){
			rec_address.push(["",addr[i],""]);
		}
		rec_address.push(rec_phone);
		
		rec_header1 = [['Sales :','','('+$rootScope.aiv_info.currency+')']];
		rec_header2 = 'By Delivery methods:';
		rec_header3 = 'By Payment methods:';
		rec_header4 = 'By Order types:';
		rec_thanks = '<<< Thanks >>>';
		rec_header5 = 'By Payment & Delivery:';
		rec_header6 = 'By Gratuity:';
		rec_header7 = 'By Deposit:';
		rec_header8 = 'By Voucher sales:';
		
		rec_map1 = [
			["Sales total     ", "", $scope.aiv_report.by_sales.subtotal.toFixed(2)],
			["Bag charges", "", $scope.aiv_report.by_sales.total_bag.toFixed(2)]
		];
		if($scope.POSSettings.show_delcharge_report){
			rec_map1.push(["Delivery charges", "", $scope.aiv_report.by_sales.total_shipping.toFixed(2)]);
		}
		rec_map1.push(["Discounts       ", "", "-"+$scope.aiv_report.by_sales.total_discount.toFixed(2)]);
		
		rec_map2 = [
			["Delivery  ", $scope.aiv_report.by_shipping.local_delivery.count, $scope.aiv_report.by_shipping.local_delivery.amount.toFixed(2)],
			["Collection", $scope.aiv_report.by_shipping.local_pickup.count, $scope.aiv_report.by_shipping.local_pickup.amount.toFixed(2)],
			["Takeaway  ", $scope.aiv_report.by_shipping.in_shop.count, $scope.aiv_report.by_shipping.in_shop.amount.toFixed(2)],
			["Sit-In    ", $scope.aiv_report.by_shipping.sitin.count, $scope.aiv_report.by_shipping.sitin.amount.toFixed(2)]
		];
		
		rec_map3 = [];
		if($scope.justEat.orders){
			//rec_map3.push(["JustEat    ", $scope.aiv_report.by_payment.custom.count, $scope.aiv_report.by_payment.custom.amount.toFixed(2)]);
		}
		rec_map3.push(
			["Cash       ", $scope.aiv_report.by_payment.cod.count, $scope.aiv_report.by_payment.cod.amount.toFixed(2)],
			["Card       ", $scope.aiv_report.by_payment.card.count, $scope.aiv_report.by_payment.card.amount.toFixed(2)]
			//["Online card", $scope.aiv_report.by_payment.stripe.count, $scope.aiv_report.by_payment.stripe.amount.toFixed(2)],
			//["PayPal     ", $scope.aiv_report.by_payment.paypal.count, $scope.aiv_report.by_payment.paypal.amount.toFixed(2)]
		);
		
		rec_map4 = [];
		if($scope.justEat.orders){
			//rec_map4.push(["JustEat", $scope.aiv_report.by_outlet.custom.count, $scope.aiv_report.by_outlet.custom.amount.toFixed(2)]);
		}
		rec_map4.push(
			["POS    ", $scope.aiv_report.by_outlet.pos.count, $scope.aiv_report.by_outlet.pos.amount.toFixed(2)]
			//["Web    ", $scope.aiv_report.by_outlet.web.count, $scope.aiv_report.by_outlet.web.amount.toFixed(2)]
		);
		
		rec_map6 = [
			["Card     ", $scope.aiv_report.by_gratuity.card.count, $scope.aiv_report.by_gratuity.card.amount.toFixed(2)],
			["Cash   ", $scope.aiv_report.by_gratuity.cash.count, $scope.aiv_report.by_gratuity.cash.amount.toFixed(2)]
		] ;
		rec_map7 = [
			["Card     ", $scope.aiv_report.by_deposit.card.count, $scope.aiv_report.by_deposit.card.amount.toFixed(2)],
			["Cash   ", $scope.aiv_report.by_deposit.cash.count, $scope.aiv_report.by_deposit.cash.amount.toFixed(2)]
		] ;
		rec_map8 = [
			["Card     ", $scope.aiv_report.by_voucher_sale.card.count, $scope.aiv_report.by_voucher_sale.card.amount.toFixed(2)],
			["Cash   ", $scope.aiv_report.by_voucher_sale.cash.count, $scope.aiv_report.by_voucher_sale.cash.amount.toFixed(2)]
		] ;
		
		rec_footer1 = [["Total", "", $scope.aiv_report.by_sales.total.toFixed(2)]];
		rec_notes = "";
		if($scope.aiv_report.by_sales.total_void){
			rec_footer1.push(["VOID", "", $scope.aiv_report.by_sales.total_void.toFixed(2)]);
		}
		if($scope.selected_report_type == 'X' && $scope.aiv_report.by_sales.total_unpaid){
			rec_footer1.push(["UNPAID x "+$scope.aiv_report.by_sales.count_unpaid, "", $scope.aiv_report.by_sales.total_unpaid.toFixed(2)]);
			rec_notes = "Orders "+$scope.aiv_report.by_sales.items_unpaid+" are UNPAID";
		}
		
		rec_footer2 = [["Total", "", $scope.aiv_report.by_shipping.total.amount.toFixed(2)]];
		rec_footer3 = [["Total x "+$scope.aiv_report.by_payment.total.count,"", $scope.aiv_report.by_payment.total.amount.toFixed(2)]];
		rec_footer4 = [["Total", "", $scope.aiv_report.by_outlet.total.amount.toFixed(2)]];
		rec_footer5 = [["Refund x "+$scope.aiv_report.by_payment.refund.count,"", $scope.aiv_report.by_payment.refund.amount.toFixed(2)]];
		rec_footer6 = [["Total x "+$scope.aiv_report.by_gratuity.total.count,"", $scope.aiv_report.by_gratuity.total.amount.toFixed(2)]];
		rec_footer7 = [["Total x "+$scope.aiv_report.by_deposit.total.count,"", $scope.aiv_report.by_deposit.total.amount.toFixed(2)]];
		rec_footer8 = [["Total x "+$scope.aiv_report.by_voucher_sale.total.count,"", $scope.aiv_report.by_voucher_sale.total.amount.toFixed(2)]];
		
		/* rec_map5 = [
			["Cash-Takeaway  ", $scope.aiv_report.by_shipping_payment.takeaway_cod.count, $scope.aiv_report.by_shipping_payment.takeaway_cod.amount.toFixed(2)],
			["Cash-Collection", $scope.aiv_report.by_shipping_payment.collection_cod.count, $scope.aiv_report.by_shipping_payment.collection_cod.amount.toFixed(2)],
			["Cash-Delivery  ", $scope.aiv_report.by_shipping_payment.delivery_cod.count, $scope.aiv_report.by_shipping_payment.delivery_cod.amount.toFixed(2)],
			["Cash-Sitin     ", $scope.aiv_report.by_shipping_payment.sitin_cod.count, $scope.aiv_report.by_shipping_payment.sitin_cod.amount.toFixed(2)],
			["Card-Takeaway  ", $scope.aiv_report.by_shipping_payment.takeaway_card.count, $scope.aiv_report.by_shipping_payment.takeaway_card.amount.toFixed(2)],
			["Card-Collection", $scope.aiv_report.by_shipping_payment.collection_card.count, $scope.aiv_report.by_shipping_payment.collection_card.amount.toFixed(2)],
			["Card-Delivery  ", $scope.aiv_report.by_shipping_payment.delivery_card.count, $scope.aiv_report.by_shipping_payment.delivery_card.amount.toFixed(2)],
			["Card-Sitin     ", $scope.aiv_report.by_shipping_payment.sitin_card.count, $scope.aiv_report.by_shipping_payment.sitin_card.amount.toFixed(2)]
		]; */
		
		rec_total = "Cash On Till : "+$scope.aiv_report.by_sales.total_cash.toFixed(2);

        var source = ".style2 {{map:rec_address}} \
                      {{map:rec_web}} \
                      {{center:rec_subtitle}} .hline \
					  {{map:rec_header1}} .hline \
                      {{map:rec_map1}} .hline \
					  {{map:rec_footer1}}";
		if(rec_notes){
			source+="{{var:rec_notes}} .newline";
		}
		source+=" {{var:rec_header3}} .hline \
				  {{map:rec_map3}} .hline \
				  {{map:rec_footer3}} \
				  {{map:rec_footer5}} .newline\
				  {{var:rec_header4}} .hline \
				  {{map:rec_map4}} .hline \
				  {{map:rec_footer4}} .newline\
				  {{var:rec_header6}} .hline \
				  {{map:rec_map6}} .hline \
				  {{map:rec_footer6}} .newline\
				  {{var:rec_header7}} .hline \
				  {{map:rec_map7}} .hline \
				  {{map:rec_footer7}} .newline\
				  {{var:rec_header8}} .hline \
				  {{map:rec_map8}} .hline \
				  {{map:rec_footer8}} .newline\
				  {{center:rec_total}} .newline\
				  {{center:rec_thanks}} .newline .newline .newline .newline .newline .newline";
					  
		var template = new EasyPrintTemplate();
		template.setSource(source,$scope.settingsPrinter.lineLength);
        template.render();
		var res = template.result();
		console.log(res);
		var printData = [{ type: 'raw', data: res}];
		
		var print_array = [];
		angular.forEach($scope.AIVPrinterSettings,function(printer){
			if(printer.usage == 'Main'){
				//Print to Main printer
				var config = {};
				config.copies = 1;
				var print_object = {}
				print_object.conf = config;
				print_object.data = printData;
				print_object.device = printer;
				print_object.cashdrawer = false;
				print_array.push(print_object);
			}
		})
		
		if(print_array.length){
			//Handle multiple copies
			var final_print_array = [];
			for(var i=0;i<print_array.length;i++){
				if(print_array[i].conf.copies > 1){
					var print_data = angular.copy(print_array[i]);
					var copies = print_data.conf.copies;
					print_array[i].conf.copies = 1;
					final_print_array.push(print_array[i]);
					
					print_data.data.splice(0,0,{ type: 'raw', data: "====REPRINT====\n\n" });
					print_data.conf.copies = copies-1;
					print_data.cashdrawer = false;
					final_print_array.push(print_data);
					i++;
				}else{
					final_print_array.push(print_array[i]);
				}
			}
			multi_print_receipts(final_print_array,true);
		}
		
	}
	$scope.printDReports = function(report){
		var pos_term = (!$scope.report_filters.pos)?'All Terminals':$scope.report_filters.pos;
		if($scope.selected_report_type == 'D'){
			rec_subtitle = $scope.selected_report_title+' ('+pos_term+')';
			rec_header3 = ' On '+yyyymmdd($scope.dr_from_date);
		}		
		
		rec_name = ["",$rootScope.aiv_info.name,""];
		var addr = $rootScope.aiv_info.address.split(',');
		rec_address = [];
		rec_phone = ["",$rootScope.aiv_info.phone1,""];
		rec_web = [["",$rootScope.aiv_info.domain,""]];
		rec_total = '';
		
		rec_address.push(rec_name);
		rec_header2 =[];
		rec_header2.push(["Qty","Product","Price(INR)"]);
		for(var i=0;i<addr.length;i++){
			rec_address.push(["",addr[i],""]);
		}
		rec_address.push(rec_phone);
		
		rec_map1 = [];
		for(var i=0;i<$scope.aiv_report.data.length;i++){
			var void_data = $scope.aiv_report.data[i];
			rec_map1.push([void_data.item_quantity,void_data.order_items,void_data.item_total.toFixed(2)]);
		}

		rec_thanks = '<<< Thanks >>>';
		rec_map3 ="TOTAL QTY :"+$scope.aiv_report.quantity.toFixed(2);
		rec_total = "TOTAL : "+$scope.aiv_report.grand_total.toFixed(2);

        var source = ".style2 {{map:rec_address}} \
                      {{map:rec_web}} \
                      {{center:rec_subtitle}}  \
					  {{center:rec_header3}} .hline \
					  {{hmap:rec_header2}} .hline \
                      {{hmap:rec_map1}} .hline \
					  {{center:rec_map3}} .newline\
					  {{center:rec_total}} .newline\
                      {{center:rec_thanks}} .newline .newline .newline .newline .newline .newline";
					  
		var template = new EasyPrintTemplate();
		template.setSource(source,$scope.settingsPrinter.lineLength);
        template.render();
		var res = template.result();
		console.log(res);
		var printData = [{ type: 'raw', data: res}];
		var config = QZHelper.getPrintParams();
		config.copies = 1;
		//QZHelper.setPrintParams(config);
		$scope.printESCP(printData,false,config,$scope.settingsPrinter);
	}
	$scope.printOtherReports = function(report){
		var pos_term = (!$scope.report_filters.pos)?'All Terminals':$scope.report_filters.pos;
		if($scope.selected_report_type == 'VOID'){
			rec_subtitle = $scope.selected_report_title+' On '+yyyymmdd($scope.voidr_from_date)+' ('+pos_term+')';
		}	
				
		
		rec_name = ["",$rootScope.aiv_info.name,""];
		var addr = $rootScope.aiv_info.address.split(',');
		rec_address = [];
		rec_phone = ["",$rootScope.aiv_info.phone1,""];
		rec_web = [["",$rootScope.aiv_info.domain,""]];
		rec_total = '';
		
		rec_address.push(rec_name);
		for(var i=0;i<addr.length;i++){
			rec_address.push(["",addr[i],""]);
		}
		rec_address.push(rec_phone);
		
		rec_map1 = [];
		for(var i=0;i<$scope.aiv_report.data.length;i++){
			var void_data = $scope.aiv_report.data[i];
			var header = "";
			if(void_data.daily_order_no){
				header+="ORDER : "+void_data.daily_order_no;
			}
			
			if(void_data.table_num){
				header+=" TABLE : "+void_data.table_num+"/"+void_data.table_server;
			}
			rec_map1.push(["",header,""]);
			rec_map1.push(["Reason : ",void_data.void_reason,""]);
			rec_map1.push(["","--------------------",""]);
			for(var p=0;p<void_data.void_items.length;p++){
				var price_total = angular.isDefined(void_data.void_items[p].sel_variations)?void_data.void_items[p].sel_variations.price:void_data.void_items[p].total;
				rec_map1.push([void_data.void_items[p].quantity,void_data.void_items[p].title,price_total]);
			}
			
			if(i<$scope.aiv_report.data.length-1){
				rec_map1.push(["","--------------------\n",""]);
			}
		}

		rec_thanks = '<<< Thanks >>>';
		rec_total = "TOTAL : "+$scope.aiv_report.grand_total.toFixed(2);

        var source = ".style2 {{map:rec_address}} \
                      {{map:rec_web}} \
                      {{center:rec_subtitle}} .hline \
                      {{hmap:rec_map1}} .hline \
					  {{center:rec_total}} .newline\
                      {{center:rec_thanks}} .newline .newline .newline .newline .newline .newline";
					  
		var template = new EasyPrintTemplate();
		template.setSource(source,$scope.settingsPrinter.lineLength);
        template.render();
		var res = template.result();
		console.log(res);
		var printData = [{ type: 'raw', data: res}];
		
		var print_array = [];
		angular.forEach($scope.AIVPrinterSettings,function(printer){
			if(printer.usage == 'Main'){
				//Print to Main printer
				var config = {};
				config.copies = 1;
				var print_object = {}
				print_object.conf = config;
				print_object.data = printData;
				print_object.device = printer;
				print_object.cashdrawer = false;
				print_array.push(print_object);
			}
		})
		
		if(print_array.length){
			//Handle multiple copies
			var final_print_array = [];
			for(var i=0;i<print_array.length;i++){
				if(print_array[i].conf.copies > 1){
					var print_data = angular.copy(print_array[i]);
					var copies = print_data.conf.copies;
					print_array[i].conf.copies = 1;
					final_print_array.push(print_array[i]);
					
					print_data.data.splice(0,0,{ type: 'raw', data: "====REPRINT====\n\n" });
					print_data.conf.copies = copies-1;
					print_data.cashdrawer = false;
					final_print_array.push(print_data);
					i++;
				}else{
					final_print_array.push(print_array[i]);
				}
			}
			multi_print_receipts(final_print_array,true);
		}
		
		/*var config = QZHelper.getPrintParams();
		config.copies = 1;
		//QZHelper.setPrintParams(config);
		$scope.printESCP(printData,false,config,$scope.settingsPrinter);*/
	}

	var calculateReport = function(orders){
		$scope.report_order_count = {
			'pending':0,
			'sent_to_kitchen':0,
			'processing':0,
			'table_order':0,
			'unpaid':0
		}
		
		var doc = {
			"by_sales": {
			   "total": 0,
			   "subtotal":0,
			   "total_shipping": 0,
			   "total_bag":0,
			   "total_payout":0,
			   "total_discount": 0,
			   "total_unpaid":0,
			   "count_unpaid":0,
			   "items_unpaid":"",
			   "total_cash":0,
			   "total_void":0
			},"by_voucher_sale":{	
				"total": {
					   "count": 0,
					   "amount": 0
				   },
			   "cash": {
				   "count": 0,
				   "amount": 0
			   },
			   "card": {
				   "count": 0,
				   "amount": 0
			   }
			
			},"by_shipping": {
			   "total": {
				   "count": 0,
				   "amount": 0
			   },
			   "local_delivery": {
				   "count": 0,
				   "amount": 0
			   },
			   "local_pickup": {
				   "count": 0,
				   "amount": 0
			   },
			   "in_shop": {
				   "count": 0,
				   "amount": 0
			   },
			   "sitin": {
				   "count": 0,
				   "amount": 0
			   }
			},
			"by_payment": {
			   "total": {
				   "count": 0,
				   "amount": 0
			   },
			   "cod": {
				   "count": 0,
				   "amount": 0
			   },
			   "card": {
				   "count": 0,
				   "amount": 0
			   },
			   "voucher": {
				   "count": 0,
				   "amount": 0
			   },
			   "stripe": {
				   "count": 0,
				   "amount": 0
			   },
			   "paypal": {
				   "count": 0,
				   "amount": 0
			   },
			   "custom": {
				   "count": 0,
				   "amount": 0
			   },
			   "refund": {
				   "count": 0,
				   "amount": 0
			   }
			},
			"by_outlet": {
			   "total": {
				   "count": 0,
				   "amount": 0
			   },
			   "pos": {
				   "count": 0,
				   "amount": 0
			   },
			   "web": {
				   "count": 0,
				   "amount": 0
			   },
			   "custom": {
				   "count": 0,
				   "amount": 0
			   }
			},
			"by_shipping_payment": {
			   "total": {
				   "count": 0,
				   "amount": 0
			   },
			   "takeaway_cod": {
				   "count": 0,
				   "amount": 0
			   },
			   "collection_cod": {
				   "count": 0,
				   "amount": 0
			   },
			   "delivery_cod": {
				   "count": 0,
				   "amount": 0
			   },
			   "sitin_cod": {
				   "count": 0,
				   "amount": 0
			   },
			   "takeaway_card": {
				   "count": 0,
				   "amount": 0
			   },
			   "collection_card": {
				   "count": 0,
				   "amount": 0
			   },
			   "delivery_card": {
				   "count": 0,
				   "amount": 0
			   },
			   "sitin_card": {
				   "count": 0,
				   "amount": 0
			   }
			},
			"by_product_type": {
			   "total": {
				   "count": 0,
				   "amount": 0
			   },
			   "hot": {
				   "count": 0,
				   "amount": 0
			   },
			   "cold": {
				   "count": 0,
				   "amount": 0
			   }
			},
			"by_gratuity":{
				"total": {
				   "count": 0,
				   "amount": 0
			   },
			   "cash": {
				   "count": 0,
				   "amount": 0
			   },
			   "card": {
				   "count": 0,
				   "amount": 0
			   },
			},
			"by_deposit":{
				"total": {
				   "count": 0,
				   "amount": 0
			   },
			   "cash": {
				   "count": 0,
				   "amount": 0
			   },
			   "card": {
				   "count": 0,
				   "amount": 0
			   },
			}
		}
		if($scope.payoutdetails.length){
			for(let i=0;i<$scope.payoutdetails.length;i++){
				var nowDate =new Date().toISOString().split("T");
				if($scope.payoutdetails[i].ordercreated.includes(nowDate[0])){
					doc.by_sales.total_payout+=parseFloat($scope.payoutdetails[i].amount);
				}
			}
		}
		if($scope.voucherdetails.length){
			for(let i=0;i<$scope.voucherdetails.length;i++){
				var nowDate =new Date().toISOString().split("T");
				//var date = nowDate.getFullYear()+'-'+(nowDate.getMonth()+1)+'-'+nowDate.getDate();
				if($scope.voucherdetails[i].createdby.includes(nowDate[0])){
					doc.by_voucher_sale.total.count++;
					doc.by_voucher_sale.total.amount+=parseFloat($scope.voucherdetails[i].amount);
					if($scope.voucherdetails[i].payment_type=='cash'){
						doc.by_sales.total_cash+=parseFloat($scope.voucherdetails[i].amount);
						doc.by_voucher_sale.cash.count++;
						doc.by_voucher_sale.cash.amount+=parseFloat($scope.voucherdetails[i].amount);
					}else if($scope.voucherdetails[i].payment_type=='card'){
						doc.by_voucher_sale.card.count++;
						doc.by_voucher_sale.card.amount+=parseFloat($scope.voucherdetails[i].amount);
					}
				}
			}
		}
		if($scope.customerdepositdetails.length){
			for(let i=0;i<$scope.customerdepositdetails.length;i++){
				var nowDate =new Date().toISOString().split("T");
				//var date = nowDate.getFullYear()+'-'+(nowDate.getMonth()+1)+'-'+nowDate.getDate();
				if($scope.customerdepositdetails[i].data.Deposit_date.includes(nowDate[0])){
					doc.by_deposit.total.count++;
					doc.by_deposit.total.amount+=parseFloat($scope.customerdepositdetails[i].data.Amount);
					if($scope.customerdepositdetails[i].data.payment_type=='cod'){
						doc.by_deposit.cash.count++;
						doc.by_sales.total_cash+=parseFloat($scope.customerdepositdetails[i].data.Amount);
						doc.by_deposit.cash.amount+=parseFloat($scope.customerdepositdetails[i].data.Amount);
					}else if($scope.customerdepositdetails[i].data.payment_type=='card'){
						doc.by_deposit.card.count++;
						doc.by_deposit.card.amount+=parseFloat($scope.customerdepositdetails[i].data.Amount);
					}
				}
			}
		}
		for(var i=0;i<orders.length;i++){
			var order = orders[i].data;
			var void_items = angular.isDefined(orders[i].void_items)?orders[i].void_items:[];
			if(!$scope.report_filters.pos || (angular.isDefined(order.order_meta.processed_by) && $scope.report_filters.pos == order.order_meta.processed_by)){
				if(order.status == "pending"){
					$scope.report_order_count.pending++;
					continue;
				}else if(order.status == "sent-to-kitchen"){
					$scope.report_order_count.sent_to_kitchen++;
				}else if(order.status == "processing"){
					$scope.report_order_count.processing++;
					continue;
				}else if(order.status == "cancelled"){
					continue;
				}else if(order.status == "refunded"){
					doc.by_payment.refund.count++;
					doc.by_payment.refund.amount+=parseFloat(order.total);
					continue;
				}else if(order.payment_details.paid == false){
					$scope.report_order_count.unpaid++;
				}
				
				if(void_items.length){
					var void_total = 0;
					angular.forEach(void_items,function(item){
						if(angular.isDefined(item.sel_variations)){
							void_total+=parseFloat(item.sel_variations.price);
						}else{
							void_total+=item.total;
						}
					});
					doc.by_sales.total_void+=void_total;

					if(order.status == "cancelled"){
						continue;
					}
				}
				
				for(var f=0;f<order.fee_lines.length;f++){
					if(order.fee_lines[f].title == 'Bag charges'){
						doc.by_sales.total_bag+=parseFloat(order.fee_lines[f].total);
					}
				}
				doc.by_sales.total+=parseFloat(order.total);
				doc.by_sales.subtotal+=parseFloat(order.subtotal);
				doc.by_sales.total_shipping+=parseFloat(order.total_shipping);
				doc.by_sales.total_discount+=parseFloat(order.total_discount);
				
				if(!order.payment_details.paid){
					doc.by_sales.total_unpaid+=parseFloat(order.total);
					if(!$scope.POSSettings.show_delcharge_report){
						doc.by_sales.total_unpaid-=parseFloat(order.total_shipping);
					}
					doc.by_sales.count_unpaid++;
					doc.by_sales.items_unpaid+=order.order_meta.daily_order_no+", ";
				}
				
				doc.by_payment.total.count++;
				doc.by_payment.total.amount+=parseFloat(order.total);
				if(angular.isDefined(order.order_meta.gratuity)){
					if(order.order_meta.gratuity.enable){
					
						if(order.order_meta.gratuity.method =='cash'){
							doc.by_gratuity.total.count ++;
							doc.by_gratuity.total.amount+=parseFloat(order.order_meta.gratuity.amount);
							doc.by_gratuity.cash.amount+=parseFloat(order.order_meta.gratuity.amount);
							doc.by_gratuity.cash.count++;
						}else{
							doc.by_gratuity.total.count ++;
							doc.by_gratuity.total.amount+=parseFloat(order.order_meta.gratuity.amount);
							doc.by_gratuity.card.amount+=parseFloat(order.order_meta.gratuity.amount);
							doc.by_gratuity.card.count++;
						}
					}
				}
				var cash_order = false;
				if($scope.justEat.orders && order.customer.first_name == 'JUST-EAT'){
					doc.by_payment.custom.count++;
					doc.by_payment.custom.amount+=parseFloat(order.total);
					doc.by_sales.total_cash+=parseFloat(order.total);
					cash_order = true;
				}else if(order.payment_details.method_id=='cod'){
					if(angular.isDefined(order.payment_details.split) && order.payment_details.split){
						doc.by_payment.cod.count++;
						doc.by_payment.card.count++;
						//doc.by_payment.cod.count++;
						doc.by_sales.total_cash+=parseFloat(order.payment_details.cash);
						doc.by_payment.card.amount+=parseFloat(order.payment_details.card);
						doc.by_payment.cod.amount+=parseFloat(order.payment_details.cash);
					}else{
						doc.by_payment.cod.count++;
						doc.by_payment.cod.amount+=parseFloat(order.total);
						doc.by_sales.total_cash+=parseFloat(order.total);
						if(!$scope.POSSettings.show_delcharge_report){
							doc.by_payment.cod.amount-=parseFloat(order.total_shipping);
						}
					}
					cash_order = true;
					
					/* if(order.shipping_lines == ''){
						if(order.order_meta.order_type == "TABLE"){
							doc.by_shipping_payment.sitin_cod.count++;
							doc.by_shipping_payment.sitin_cod.amount+=parseFloat(order.total);
						}else{
							doc.by_shipping_payment.takeaway_cod.count++;
							doc.by_shipping_payment.takeaway_cod.amount+=parseFloat(order.total);
						}
					}else if(order.shipping_lines[0].method_id=='local_delivery'){
						doc.by_shipping_payment.delivery_cod.count++;
						doc.by_shipping_payment.delivery_cod.amount+=parseFloat(order.total);
						if(cash_order && !$scope.POSSettings.show_delcharge_report){
							doc.by_sales.total_cash-=parseFloat(order.total_shipping);
						}
						if(!$scope.POSSettings.show_delcharge_report){
							doc.by_shipping_payment.delivery_cod.amount-=parseFloat(order.total_shipping);
						}
					}else if(order.shipping_lines[0].method_id=='local_pickup'){
						doc.by_shipping_payment.collection_cod.count++;
						doc.by_shipping_payment.collection_cod.amount+=parseFloat(order.total);
					}  */
				}else if(order.payment_details.method_id=='voucher'){
					if(angular.isDefined(order.payment_details.split) && order.payment_details.split){
						doc.by_payment.voucher.count++;
						if(order.payment_details.card !=0)
							doc.by_payment.card.count++;
						if(order.payment_details.cash !=0)
							doc.by_payment.cod.count++;
						doc.by_sales.total_cash+=parseFloat(order.payment_details.cash);
						doc.by_payment.card.amount+=parseFloat(order.payment_details.card);
						doc.by_payment.cod.amount+=parseFloat(order.payment_details.cash);
						doc.by_payment.voucher.amount+=parseFloat(order.payment_details.voucher);
					}else{
						doc.by_payment.voucher.count++;
						doc.by_payment.voucher.amount+=parseFloat(order.total);
						if(!$scope.POSSettings.show_delcharge_report){
							doc.by_payment.voucher.amount-=parseFloat(order.total_shipping);
						}
						
					}
				}else if(order.payment_details.method_id=='card'){
					doc.by_payment.card.count++;
					doc.by_payment.card.amount+=parseFloat(order.total);
					if(!$scope.POSSettings.show_delcharge_report){
						doc.by_payment.card.amount-=parseFloat(order.total_shipping);
					}
					
					 /* if(order.shipping_lines == ''){
						if(order.order_meta.order_type == "TABLE"){
							doc.by_shipping_payment.sitin_card.count++;
							doc.by_shipping_payment.sitin_card.amount+=parseFloat(order.total);
						}else{
							doc.by_shipping_payment.takeaway_card.count++;
							doc.by_shipping_payment.takeaway_card.amount+=parseFloat(order.total);
						}
					}else if(order.shipping_lines[0].method_id=='local_delivery'){
						doc.by_shipping_payment.delivery_card.count++;
						doc.by_shipping_payment.delivery_card.amount+=parseFloat(order.total);
						if(cash_order && !$scope.POSSettings.show_delcharge_report){
							doc.by_sales.total_cash-=parseFloat(order.total_shipping);
						}
						if(!$scope.POSSettings.show_delcharge_report){
							doc.by_shipping_payment.delivery_card.amount-=parseFloat(order.total_shipping);
						}
					}else if(order.shipping_lines[0].method_id=='local_pickup'){
						doc.by_shipping_payment.collection_card.count++;
						doc.by_shipping_payment.collection_card.amount+=parseFloat(order.total);
					}  */
					
				}else if(order.payment_details.method_id=='stripe'){
					doc.by_payment.stripe.count++;
					doc.by_payment.stripe.amount+=parseFloat(order.total);
					if(!$scope.POSSettings.show_delcharge_report){
						doc.by_payment.stripe.amount-=parseFloat(order.total_shipping);
					}
				}else if(order.payment_details.method_id=='paypal'){
					doc.by_payment.paypal.count++;
					doc.by_payment.paypal.amount+=parseFloat(order.total);
					if(!$scope.POSSettings.show_delcharge_report){
						doc.by_payment.paypal.amount-=parseFloat(order.total_shipping);
					}
				}
				
				doc.by_shipping.total.count++;
				doc.by_shipping.total.amount+=parseFloat(order.total);
				
		 	if(order.shipping_lines == ''){
					if(order.order_meta.order_type == "TABLE"){
						doc.by_shipping.sitin.count++;
						doc.by_shipping.sitin.amount+=parseFloat(order.total);
					}else{
						doc.by_shipping.in_shop.count++;
						doc.by_shipping.in_shop.amount+=parseFloat(order.total);
					}
				}else if(order.shipping_lines[0].method_id=='local_delivery'){
					doc.by_shipping.local_delivery.count++;
					doc.by_shipping.local_delivery.amount+=parseFloat(order.total);
					if(cash_order && !$scope.POSSettings.show_delcharge_report){
						doc.by_sales.total_cash-=parseFloat(order.total_shipping);
					}
					if(!$scope.POSSettings.show_delcharge_report){
						doc.by_shipping.local_delivery.amount-=parseFloat(order.total_shipping);
					}
				}else if(order.shipping_lines[0].method_id=='local_pickup'){
					doc.by_shipping.local_pickup.count++;
					doc.by_shipping.local_pickup.amount+=parseFloat(order.total);
				}else if(order.shipping_lines[0].method_id=='sitin'){
					doc.by_shipping.sitin.count++;
					doc.by_shipping.sitin.amount+=parseFloat(order.total);
				} 
				
				doc.by_outlet.total.count++;
				doc.by_outlet.total.amount+=parseFloat(order.total);
				
				if($scope.justEat.orders && order.customer.first_name == 'JUST-EAT'){
					doc.by_outlet.custom.count++;
					doc.by_outlet.custom.amount+=parseFloat(order.total);
				}else if(angular.isDefined(order.order_meta.wc_pos_order_type)){
					doc.by_outlet.pos.count++;
					doc.by_outlet.pos.amount+=parseFloat(order.total);
					if(!$scope.POSSettings.show_delcharge_report){
						doc.by_outlet.pos.amount-=parseFloat(order.total_shipping);
					}
				}else {
					doc.by_outlet.web.count++;
					doc.by_outlet.web.amount+=parseFloat(order.total);
					if(!$scope.POSSettings.show_delcharge_report){
						doc.by_outlet.web.amount-=parseFloat(order.total_shipping);
					}
				}
				
				for(var p=0;p<order.line_items.length;p++){
					if(angular.isDefined(order.line_items[p].types) && angular.isArray(order.line_items[p].types) && order.line_items[p].types.length){
						if(order.line_items[p].types.indexOf("Hot") > -1){
							doc.by_product_type.hot.count++;
							doc.by_product_type.hot.amount+=Number(order.line_items[p].total);
							doc.by_product_type.total.count++;
							doc.by_product_type.total.amount+=Number(order.line_items[p].total);
						}else if(order.line_items[p].types.indexOf("Cold") > -1){
							doc.by_product_type.cold.count++;
							doc.by_product_type.cold.amount+=Number(order.line_items[p].total);
							doc.by_product_type.total.count++;
							doc.by_product_type.total.amount+=Number(order.line_items[p].total);
						}
					}
				}
				
				if(!$scope.POSSettings.show_delcharge_report){
					//Hide delivery charges
					doc.by_sales.total-=parseFloat(order.total_shipping);
					doc.by_payment.total.amount-=parseFloat(order.total_shipping);
					doc.by_shipping.total.amount-=parseFloat(order.total_shipping);
					doc.by_outlet.total.amount-=parseFloat(order.total_shipping);
				}
		
				if($scope.report_filters.z_amount && doc.by_sales.total>=parseFloat($scope.report_filters.z_amount)){
					break;
				}
			}
		}
		for(var j=0;j<$scope.aiv_tables.length;j++){
			if($scope.aiv_tables[j].status != 'empty'){
				$scope.report_order_count.table_order++;
			}
			
		}
		return doc;
	}
	var calculatDReport = function(orders){
		var qty_sum =0;
		var grd_sum =0;
		var grd_tax =0;
		var grd_qty =0;
		var doc = {data:[],grand_total:0,quantity:0,gst:0};
		for(var i=0;i<orders.length;i++){
			var order = orders[i].data;
			var void_items = angular.isDefined(orders[i].void_items)?orders[i].void_items:[];
			if(!$scope.report_filters.pos || (angular.isDefined(order.order_meta.processed_by) && $scope.report_filters.pos == order.order_meta.processed_by)){
				item =order.line_items;
				angular.forEach(order.line_items,function(item){
					var prdt_name = angular.isDefined(item.title)?item.title:item.name;
					var quantity  = item.quantity;
					var price     =item.subtotal/item.quantity;
					var tax 	  =parseFloat(item.total_tax);
					var d_data = {
						"order_items":"",
						"item_quantity":"",
						"item_total":"",
					};
					var set_val =false;
					for(var j=0;j<doc.data.length;j++)
					{
						if(prdt_name ==doc.data[j].order_items)
						{
							doc.data[j].item_quantity+=quantity;
							doc.data[j].item_total+=price;
							qty_sum+=quantity;
							grd_sum+=price;
							grd_tax+=tax;
							set_val =true;
							break;
						}
					}
					if(set_val == false)
					{
						d_data.order_items =prdt_name;
						d_data.item_quantity=quantity;
						d_data.item_total =price;
						qty_sum+=quantity;
						grd_sum+=price;
						grd_tax+=tax;
						doc.data.push(d_data);
					}					 
				});
				
	 		}	
			doc.grand_total =grd_sum;
			doc.quantity =qty_sum;
			doc.gst = grd_tax;
			
		}
	
		return doc;
	}
	
	var calculateVoidReport = function(orders){
		var doc = {data:[],grand_total:0};
		for(var i=0;i<orders.length;i++){
			var order = orders[i].data;
			var void_items = angular.isDefined(orders[i].void_items)?orders[i].void_items:[];
			if(!void_items.length){
				continue;
			}else if(!$scope.report_filters.pos || (angular.isDefined(order.order_meta.processed_by) && $scope.report_filters.pos == order.order_meta.processed_by)){
				var void_data = {
					"status":order.status,
					"void_total":"",
					"void_items":void_items,
					"bill_number":order.order_number,
					"daily_order_no":order.order_meta.daily_order_no,
					"void_reason":order.order_meta.void_reason,
					"table_num":order.order_meta.table_num,
					"table_server":order.order_meta.table_server
				};
				
				var void_total = 0;
				angular.forEach(void_items,function(item){
					if(angular.isDefined(item.sel_variations)){
						void_total+=parseFloat(item.sel_variations.price);
					}else{
						void_total+=item.total;
					}
				});
				void_data.void_total = void_total;
				
				doc.data.push(void_data);
				doc.grand_total+=void_total;
			}
		}
		return doc;
	}
	
	var validate_payment = function(){
		if($scope.payment_select.id == ''){
			$scope.payment_select.err = "Please select a payment method";
			return false;
		}else if($scope.payment_select.id == 'cod' && !$scope.payment_select.delivery && !$scope.aiv_toggles.set_unpaid){
			if($scope.payment_select.amount == ''){
				if($scope.aiv_toggles.show_cash){
					$scope.payment_select.err = "Please enter the amount";
				}else{
					$scope.payment_select.err = "Please select COD method"; 
				}
				return false;
			}else if(parseFloat($scope.payment_select.tender)<0){
				$scope.payment_select.err = "Cash needs to paid in full";
				return false;
			}
		}
		
		if($scope.order_to_pay.type == 'SINGLE'){//Mark as paid option
			$scope.order_to_pay.order.data.payment_details.method_id = $scope.selected_pay.id;
			$scope.order_to_pay.order.data.payment_details.method_title = $scope.selected_pay.method_title;
		}else if($scope.order_to_pay.type == 'MULTIPLE'){//Pay Off multiple orders
			for(var i=0;i<$scope.selectedOrders.orders.length;i++){
				$scope.selectedOrders.orders[i].data.payment_details.method_id = $scope.selected_pay.id;
				$scope.selectedOrders.orders[i].data.payment_details.method_title = $scope.selected_pay.method_title;
			}
		}else if($scope.online_processing){
			$scope.online_order.data.payment_details.method_id = $scope.selected_pay.id;
			$scope.online_order.data.payment_details.method_title = $scope.selected_pay.method_title;
		}else{
			$scope.formCheckout.payment_details.method_title = $scope.selected_pay.method_title;
			$scope.formCheckout.payment_details.method_id = $scope.selected_pay.id;
			$scope.saveForm();
		}
		
		return true;
	}
	
	$scope.getTable2Cart = function(order){
		//Save shipping
		$scope.formCheckout.shipping_lines = [{"method_id": "","method_title": "","total": ""}];
		$scope.selected_shipping = {'id':'','title':'In-Shop','method_title':'','method_description':'','fee':''};
		$scope.ship_select.id = $scope.selected_shipping.id;
		$scope.grand.Shipping = 0;

		//Save payment
		$scope.formCheckout.payment_details = order.data.payment_details;
		$scope.payment_fee = 0;
		$scope.payment_select.id = '';

		$scope.formCheckout.billing_address = order.data.billing_address;
		$scope.formCheckout.customer_id = order.data.customer_id;
		$scope.formCheckout.sameAddress = true;
		$scope.formCheckout.shipping_address = order.data.shipping_address;

		$scope.formCheckout.shipping_note = order.data.note;
		$scope.grand.Quantity = order.data.total_line_items_quantity;
		$scope.grand.Total = parseFloat(order.data.subtotal);

		for(var i=0;i<order.data.line_items.length;i++){
			var unit_price = parseFloat(order.data.line_items[i].subtotal)/parseInt(order.data.line_items[i].quantity);
			
			var products = [];
			for (var category in $scope.allProducts) {
				var cat_exists = $filter('filter')($scope.categories,{slug:category},true);
				if(cat_exists.length && !cat_exists[0].children.length && $scope.allProducts.hasOwnProperty(category)){
					var products = $filter('filter')($scope.allProducts[category],{'id': order.data.line_items[i].product_id},true);
					if(products.length){
						break;
					}
				}
			}
				
			var product = {
				"id":order.data.line_items[i].product_id,
				"sku": order.data.line_items[i].sku,
				"price": unit_price.toFixed(2),
				"total":order.data.line_items[i].subtotal,
				"quantity":order.data.line_items[i].quantity,
				"featured_src": "",
				"title": angular.isDefined(order.data.line_items[i].name)?order.data.line_items[i].name:order.data.line_items[i].title,
				"categories": angular.isDefined(order.data.line_items[i].categories)?order.data.line_items[i].categories:[],
				"attributes":[],
				"dash":angular.isDefined(order.data.line_items[i].dash)?order.data.line_items[i].dash:false,
				//08-04-19
				"meta":{"wc_productdata_options":[{
					"prdt_dept":angular.isDefined(order.data.line_items[i].dept)?order.data.line_items[i].dept:[],
					"group":angular.isDefined(order.data.line_items[i].group)?order.data.line_items[i].group:"",
					"types":[]
				}]}
			};
			if(products.length){
				product.meta = angular.copy(products[0].meta);
			}
					
			if(angular.isDefined(order.data.line_items[i].variations)){
				product.sel_variations = {'attributes':order.data.line_items[i].variations,'price':unit_price.toFixed(2)};
				product.type = "variable";
			}else{
				product.type = "simple";
			}
			
			if(product.type=="variable"&&product.sel_variations.hasOwnProperty("attributes"))
				product.sel_variations["attributestoshow"] = $scope.processDisplay(product.sel_variations.attributes);

			$scope.cartItems.push(product);
		}
		
		$scope.getDealDiscount();
			
		//get coupon discount
		$scope.formCheckout.coupon_lines = order.data.coupon_lines;
		for (i=0;i<$scope.formCheckout.coupon_lines.length;i++) {
			$scope.formCheckout.coupon_lines[i].type = false;
			$scope.formCheckout.coupon_lines[i].cart = true;
			$scope.formCheckout.coupon_lines[i].rate = parseFloat($scope.formCheckout.coupon_lines[i].amount);
			$scope.grand.Discount += parseFloat($scope.formCheckout.coupon_lines[i].amount);
		}
		
		//Offer discount
		$scope.grand.Discount += $scope.offer_discount;
		
		//other discounts
		var disc = parseFloat(order.data.total_discount);
		if(disc){
			if(disc-$scope.grand.Discount > 0){
				if(angular.isDefined(order.data.order_meta.discount_pesentage) && !order.data.order_meta.discount_pesentage){
					$scope.cart_discount.percent_click = false;
					$scope.cart_discount.disc_num =order.data.total_discount;
				}else{
					$scope.cart_discount.percent_click = true;
				if(angular.isDefined(order.data.order_meta.discount_value) && order.data.order_meta.discount_value)
					$scope.cart_discount.disc_num = order.data.order_meta.discount_value;
				else
					$scope.cart_discount.disc_num = parseInt(((disc-$scope.grand.Discount)*100)/$scope.grand.Total);
				}
				$scope.cart_discount.disc_total = $scope.cart_discount.disc_num;
			}
			$scope.grand.Discount = disc;
		}
		
		if($scope.cartItems.length){
			$scope.setSelectedItem($scope.cartItems.length-1,$scope.cartItems[$scope.cartItems.length-1]);
			$ionicScrollDelegate.$getByHandle('cartScroll').scrollBottom();
		}
		$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'cart', $scope.cartItems);
		$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'grand', $scope.grand)
		$scope.saveForm();
	}

	$scope.placeTableOrder = function(status){
		if($scope.pos_action.done_clicked){
			return;
		}else if(!$scope.cartItems.length){
			$scope.showCheckoutMsg('Error','Cart is Empty.Please add some products to cart');
			return;
		}
		$scope.pos_action.done_clicked = true;
		$scope.side_button_view = false;
		$ionicLoading.show({
			template: '<ion-spinner icon="ios"></ion-spinner><br><span>Placing order<br>Please wait...</span>',
			animation: 'fade-in',
			showBackdrop: true,
			maxWidth: 300,
			showDelay: 0
		});
		
		var new_order = createOrder('pending');
		new_order.split_item = [];
		new_order.split_unequal_value =[];
		new_order.split_value = '';
		$scope.selectedTable.orders[0] = new_order;
		
		$scope.selectedTable.status = 'food_ordered';
		$scope.selectedTable.lock =false;
		$scope.setNextStatus($scope.selectedTable,true);
	}
	
	$scope.updateTablePool = function(lock){
		var deferred = $q.defer();
		$ionicLoading.show({
			template: '<ion-spinner icon="ios"></ion-spinner><br><span>Updating status<br>Please wait...</span>',
			animation: 'fade-in',
			showBackdrop: true,
			maxWidth: 300,
			showDelay: 0
		});
		console.log('updating tables status');
		
		var postData = {};
		postData.table = angular.copy($scope.selectedTable);
		if(angular.isUndefined(lock)){
			postData.table.lock = false;
			if($scope.selectedTable.status == 'no_food_ordered'){
				postData.table.lock =true;
			}else if($scope.selectedTable.status == 'food_ordered'){
				var line_items = cart2OrderItems($scope.cartItems,"print");
				
				var action = angular.copy($scope.selectedTable.orders[0].data);
				action.line_items = line_items;
				
				doMutexOperation(print_mutex,{'type':'PLACE_ORDER','order':action,'cart':[]});
			}else if($scope.selectedTable.status == 'main_released'){
				doMutexOperation(print_mutex,{'type':'MAIN_RELEASE','order':$scope.selectedTable.orders[0].data,'cart':[]});
			}else if($scope.selectedTable.status == 'afters_ordered'){
				doMutexOperation(print_mutex,{'type':'AFTERS_RELEASE','order':$scope.selectedTable.orders[0].data,'cart':[]});
			}else if($scope.selectedTable.status == 'drinks_released'){
				doMutexOperation(print_mutex,{'type':'DRINKS_RELEASE','order':$scope.selectedTable.orders[0].data,'cart':[]});
			}else if($scope.selectedTable.status == 'starter_released'){
				doMutexOperation(print_mutex,{'type':'STARTER_RELEASE','order':$scope.selectedTable.orders[0].data,'cart':[]});
			}
			postData.type = "UPDATE";
		}else{
			if(!$scope.selectedTable.lock){
				$scope.selectedTable.server = $scope.loginInfo.user_login;
				postData.table.server = $scope.selectedTable.server;
				postData.type = "LOCK";
			}else{
				if($scope.selectedTable.status == 'empty'){
					$scope.selectedTable.server = '';
					postData.table.server = $scope.selectedTable.server;
				}
				postData.table.lock = false;
				postData.type = "UPDATE";
			}
		}
		
		//Updating table pool
		$scope.httpRequest = dataService.updateDoc($scope.couchDBUrl+"/_design/updategetTables/_update/tables/getTables", postData);
		$scope.httpRequest.then(function(returnData) {
			console.log(returnData);
			$ionicLoading.hide();
			if(returnData.Success){
				if(angular.isUndefined(lock))
				{
					if($scope.selectedTable.status == 'empty'){
						$scope.tableMode();
					}else if($scope.selectedTable.status == 'billed'){
						//$scope.complete('completed');
						$scope.show_button ='BUTTON';
					}else if($scope.selectedTable.status == 'food_ordered'){
						$ionicLoading.show({
							template : '<h2>Order placed...</h2>',
							duration : 1300
						});
						//trashOrder();
					//trashOrder();
						$scope.pos_action.done_clicked = false;
						$scope.switchView('TABLE');
						$scope.show_mode ='LIST';
						//$scope.lockFalse();
					}
				}else{
					$scope.selectedTable.lock = !$scope.selectedTable.lock;
				}
				deferred.resolve(true);
			}else{
				deferred.resolve(false);
				if(returnData.Message){
					$scope.showCheckoutMsg('Error',returnData.Message);
				}
			}
		}).catch(function(err){
			if($scope.selectedTable.status == 'food_ordered'){
				$scope.pos_action.done_clicked = false;
			}
			var msg = '';
			if(!err){
				$scope.showCheckoutMsg('Error',"No connection!!!");
			}else if(angular.isDefined(err.error)){
				if(err.error == "timeout"){
					$scope.showCheckoutMsg('Error',"Failed to update table due to slow internet connection");
				}else{
					$scope.showCheckoutMsg('Error',"Failed to update table.Request aborted!!!");
				}
			}else{
				$scope.showCheckoutMsg('Error',"Failed to update table");
			}
			console.error(err);

			$ionicLoading.hide();
			deferred.resolve(false);
		})
		
		return deferred.promise;

	}
	
	$scope.transferTableOrder = function(source_table,dest_table){
		var deferred = $q.defer();
		$ionicLoading.show({
			template: '<ion-spinner icon="ios"></ion-spinner><br><span>Transferring order<br>Please wait...</span>',
			animation: 'fade-in',
			showBackdrop: true,
			maxWidth: 300,
			showDelay: 0
		});
		
		var postData = {};
		postData.type = "TRANSFER";
		postData.src_table = angular.copy(source_table);
		if($scope.transfer_type != 'PART_TRANSFER'){
			postData.src_table.status = "empty";
			postData.src_table.cover = "";
			postData.src_table.server = "";
			postData.src_table.activity = [];
			postData.src_table.orders = [];
			postData.src_table.lock = false;
		}
		postData.dest_table = angular.copy(dest_table);
		
		//Updating table pool
		$scope.httpRequest = dataService.updateDoc($scope.couchDBUrl+"/_design/updategetTables/_update/tables/getTables", postData);
		$scope.httpRequest.then(function(returnData) {
			console.log(returnData);
			$ionicLoading.hide();
			if(returnData.Success){
				$scope.show_mode = 'TRANSFER_OK';
				$scope.show_button ='NONE';
				$scope.clearTableData();
			}else{
				if(returnData.Message){
					$scope.showCheckoutMsg('Error',returnData.Message);
				}
			}
		}).catch(function(err){
			var msg = '';
			if(!err){
				$scope.showCheckoutMsg('Error',"No connection!!!");
			}else if(angular.isDefined(err.error)){
				if(err.error == "timeout"){
					$scope.showCheckoutMsg('Error',"Failed to transfer order due to slow internet connection");
				}else{
					$scope.showCheckoutMsg('Error',"Failed to transfer order.Request aborted!!!");
				}
			}else{
				$scope.showCheckoutMsg('Error',"Failed to transfer order");
			}
			console.error(err);
			$ionicLoading.hide();
		})
		
	}
	
	var update_last_splitpayoff = function(){
		var split_val = true;
		if(!$scope.selectedTable.orders[0].split_unequal_value.length)
		{
			if($scope.selectedTable.orders[0].split_value ==''){
				if($scope.selectedTable.orders[0].split_item.length>0)
				{
					for(var i=0;i<$scope.selectedTable.orders[0].split_item.length;i++)
	
					{
						if(i == $scope.index_get)
						{
							$scope.selectedTable.orders[0].split_item[i].status ="PAID";
						}
						split_val =false;
					}
					//All split by value bills paid
					resetTable($scope.selectedTable);
					$scope.updateTablePool();
				}
				else
				{		
					resetTable($scope.selectedTable);
					$scope.updateTablePool();
				}
			}
			else
			{
				$scope.selectedTable.orders[0].split_value.paid_count +=1;
				split_val =false;
				
				//All split by value bills paid
				resetTable($scope.selectedTable);
				$scope.updateTablePool();
			}
		}else {
				var table =$scope.selectedTable.orders[0].split_unequal_value;
				for(var i=0;i<table.length;i++)
				{
					if(i == $scope.index_get)
						{
						table[i].status ='PAID';
						split_val =false;
						}
				}
				resetTable($scope.selectedTable);
				$scope.updateTablePool();
		}
		$scope.index_get = -1;	
		
		return split_val;
	}
	
	var is_last_splitpayoff = function(update){
		var final_payoff = true;
		if($scope.selectedTable.orders[0].split_item.length){
			var paid_count = 0;
			for(var i=0;i<$scope.selectedTable.orders[0].split_item.length;i++){
				if(i == $scope.index_get){
					$scope.selectedTable.orders[0].split_item[i].status = "PAID";
				}
				if($scope.selectedTable.orders[0].split_item[i].status == "PAID"){
					paid_count++;
				}
			}
			if(paid_count>=$scope.selectedTable.orders[0].split_item.length){
				final_payoff = true;
			}else{
				final_payoff = false;
			}
		}else if($scope.selectedTable.orders[0].split_value){
			$scope.selectedTable.orders[0].split_value.paid_count +=1;
			if($scope.selectedTable.orders[0].split_value.paid_count>=$scope.selectedTable.orders[0].split_value.count){
				final_payoff = true;
			}else{
				final_payoff = false;
			}
		}else if($scope.selectedTable.orders[0].split_unequal_value.length){
			var paid_count = 0;
			for(var i=0;i<$scope.selectedTable.orders[0].split_unequal_value.length;i++){
				if(i == $scope.index_get){
					$scope.selectedTable.orders[0].split_unequal_value[i].status = "PAID";
				}
				if($scope.selectedTable.orders[0].split_unequal_value[i].status == "PAID"){
					paid_count++;
				}
			}
			if(paid_count>=$scope.selectedTable.orders[0].split_unequal_value.length){
				final_payoff = true;
			}else{
				final_payoff = false;
			}
		}
		if(!final_payoff){
			$scope.updateTablePool();
			$scope.printBillClick('PAYOFFTEST');
			$scope.index_get = -1;			
		}
		
		return final_payoff;
	}

	$scope.completeUnpaid = function(){
		$scope.aiv_toggles.set_unpaid=true;
		$scope.complete('completed');
	}

	// Happens when the Payment Button is pressed
	$scope.pos_action = {'done_clicked':false,'online_action_clicked':false};
   $scope.complete = function(status,split=false,card=true,cash=false,validate=false) {
		$scope.updateDepositeData();
		$scope.showCODPayment =false;
		if($scope.pos_action.done_clicked) return;
		console.log("clicked");
		$scope.pos_action.done_clicked = true;
		
		if($scope.order_to_pay.type != ''){//Payment only
			if(!validate_payment() && !split){
				
				$scope.pos_action.done_clicked = false;
				return;
			}
			if(split){
				$scope.order_to_pay.order.data.payment_details.split =true;
				if($scope.selected_pay.id =="voucher")
					$scope.order_to_pay.order.data.payment_details.voucher =$scope.payment_select.amount;
				else if($scope.selected_pay.id =="cod")
					$scope.order_to_pay.order.data.payment_details.cash =$scope.payment_select.amount;
				if(card)
					$scope.order_to_pay.order.data.payment_details.card =$scope.showSplitPay.amount;
				else if(cash)
					$scope.order_to_pay.order.data.payment_details.cash =$scope.showSplitPay.amount;
				
			}
			$scope.updatePaidStatus($scope.order_to_pay.order);
			$scope.split_multiple= true;
			$scope.pos_action.done_clicked = false;
			return;
		}
		
		if(!$scope.online_processing){//Not a Pending online order
			if($scope.terminalData.type != 'FRONT' && $scope.startup.action!='TABLEVIEW' && $scope.ship_select.id == null){
				$scope.payment_select.err = "Please select a delivery method by clicking 'Delivery' button below cart list";
				$scope.pos_action.done_clicked = false;
				return;
			}else if(angular.isArray($scope.formCheckout.shipping_lines) && $scope.formCheckout.shipping_lines.length&& $scope.formCheckout.shipping_lines[0].method_id != 'sitin' && $scope.formCheckout.shipping_lines[0].method_id != '' && $scope.formCheckout.customer_id == 'guest'){
				$scope.payment_select.err = "Please assign a customer";
				$scope.pos_action.done_clicked = false;
				return;
			}
		}
		
		if(status == 'pending' && $scope.edit_order_flags.order_loaded){
			$scope.showCheckoutMsg('Warning','Please click Payment button to continue');
			$scope.pos_action.done_clicked = false;
			return;
		}
		if(validate){
			$scope.aiv_toggles.set_unpaid =true;
		}
		if(status != 'pending' && status != 'cancelled'){
			if(!validate_payment()){
				if(!$scope.showSplitPay.show){
					$scope.pos_action.done_clicked = false;
					return;
				}
			}
		}

		
		if($scope.online_processing){//Pending online order
			var customer = angular.copy($scope.online_order.data.customer);
			if(customer.id){
				if(customer.billing_address.phone.length<=10){
					customer.billing_address.phone = "0"+customer.billing_address.phone;
				}else{
					customer.billing_address.phone = "0"+customer.billing_address.phone.substr(-10);
				}
				
				var next_seq = '';
				var docid = '';
				if(angular.isDefined(customer.meta) && angular.isDefined(customer.meta.docid) && customer.meta.docid){
					docid = customer.meta.docid;
				}else{
					next_seq = $scope.terminalData.last_customer_seq?(parseInt($scope.terminalData.last_customer_seq)+1):1;
					docid = "customer_"+$scope.terminalData.prefix+next_seq;
					customer.meta = {
						"loyalty_card_id":$scope.online_order.data.order_meta.loyalty_card_id,
						"points_to_unlock":0,
						"points_to_redeem":0,
						"redeem_amount":0,
						"total_used_points":0,
						"current_redeem_points":0,
						"reward_coupon":"",
						"reward_type":"MONEY",
						"redeem_status":"TRUE",
						"docid":docid
					}
				}
				customer._id = docid;
				$pouchDB.putIfNotExists(customer).then(function (res) {
					accept_order();
					
					if(next_seq != ''){
						return $pouchDB.upsert($scope.terminalData._id,function(doc){
							if(angular.isDefined(doc._id)){
								doc.last_customer_seq = next_seq;
							}
							return doc;
						});
					}
				}).catch(function (err) {
					console.log(err);
					accept_order();
				});
			}else{
				accept_order();
			}
			$scope.pos_action.done_clicked = false;
			return;
		}
		
		if(angular.isArray($scope.formCheckout.shipping_lines) && $scope.formCheckout.shipping_lines.length && $scope.formCheckout.shipping_lines[0].method_id == 'local_delivery'){
			var res = false;
			/*if(!$scope.formCheckout.shipping_address.postcode){
				if($scope.delivery_areas.areas.length){
					$scope.payment_select.err = "Please enter a valid delivery area for customer";
				}else{
					$scope.payment_select.err = "Please enter a valid post code for customer";
				}
				$scope.pos_action.done_clicked = false;
				return;
			}*/
			if($scope.formCheckout.sameAddress){
				res = $scope.checkDeliveryArea($scope.formCheckout.billing_address);
			}else{
				res = $scope.checkDeliveryArea($scope.formCheckout.shipping_address);
			}
			
			/*if(!res){
				$scope.pos_action.done_clicked = false;
				return;
			}*/
		}

		if(status != 'cancelled'){
			$ionicLoading.show({
				template: '<ion-spinner icon="ios"></ion-spinner><br><span>Placing order<br>Please wait...</span>',
				animation: 'fade-in',
				showBackdrop: true,
				maxWidth: 300,
				showDelay: 0
			});
		}else{
			$ionicLoading.show({
				template: '<ion-spinner icon="ios"></ion-spinner><br>Please wait...</span>',
				animation: 'fade-in',
				showBackdrop: true,
				maxWidth: 300,
				showDelay: 0
			});
		}
			
		if($scope.edit_order_flags.order_loaded){
			complete_edit_order();
			$scope.pos_action.done_clicked = false;
			return;
		}
		
		var new_order;
		if(status == 'cancelled'){
			new_order = createOrder('pending');
			new_order.data.status = status;
		}else{
			new_order = createOrder(status,split,false,card,cash);
		}
		if(status != 'pending' && status != 'cancelled'){
			$scope.closeModal('PAYMENT');
			//$scope.print_config.kot = true;
			if(angular.isArray(new_order.data.shipping_lines)){
				if(new_order.data.shipping_lines[0].method_id=='local_delivery'){
					$scope.print_config.copies = $scope.receiptCount.delivery;
				}else if(new_order.data.shipping_lines[0].method_id=='local_pickup'){
					$scope.print_config.copies = $scope.receiptCount.collection;
				}else if(new_order.data.shipping_lines[0].method_id=='sitin'){
					$scope.print_config.copies = $scope.receiptCount.sitin;
				}
			}else{
				$scope.print_config.copies = $scope.receiptCount.inshop;
			}
			
			if(new_order.data.shipping_methods){
				$scope.print_config.label_needed = true;
			}
			
			if($scope.startup.action == 'TABLEVIEW'){
				var print_order = angular.copy(new_order);
				doMutexOperation(print_mutex,{'type':'PAYOFF','order':print_order.data,'cart':[]});
				if(!is_last_splitpayoff()){
					$scope.pos_action.done_clicked = false;
					$ionicLoading.hide();
					if(print_order.data.payment_details.method_id == 'cod' && !$scope.payment_select.delivery){
						$scope.showReceiptSlip('',print_order,false);
					}
					return;
				}
				if($scope.showSplitPay.show || angular.isDefined($scope.selectedTable.orders[0].card))
					new_order = recreate_order($scope.cartItems,status,true,true);
				else
					new_order = recreate_order($scope.cartItems,status,false,false);
			}else{
				//Open cash drawer for Cash orders from shop
				if((new_order.data.shipping_methods=='' || (angular.isArray(new_order.data.shipping_lines)&&(new_order.data.shipping_lines.length&&new_order.data.shipping_lines[0].method_id=='sitin'||new_order.data.shipping_lines.length&&new_order.data.shipping_lines[0].method_id=='local_pickup'))) && new_order.data.payment_details.method_id == 'cod' && !$scope.payment_select.delivery && !$scope.aiv_toggles.set_unpaid){
					if(!$scope.print_config.receipt)
						$scope.openCashdrawer();
					$scope.printReceipt(new_order.data,true,true);
					
				}else if(new_order.data.payment_details.method_id == 'voucher' && angular.isDefined(new_order.data.payment_details.cash) && new_order.data.payment_details.cash !=0){
					if(!$scope.print_config.receipt)
						$scope.openCashdrawer();
					$scope.printReceipt(new_order.data,true,true);
					
				}else{
				     $scope.openCashdrawer();
					$scope.printReceipt(new_order.data,false,true);
				}
			}
		}
		
		if(!angular.isDefined(new_order.data.customer.meta.docid))
		{
			new_order.data.customer.meta.docid = $scope.selected_customer._id;
		}

		function conflictFreeOrder(){
			$scope.tipData={
				enable:false,
				amount:'',
				method:''
			}
			$pouchDB.save(new_order).then(function(returnData) {
				console.log(returnData);
				$scope.pos_action.done_clicked = false;
				var customer_actions = {actions:[],data:{}};
				var temp_order = angular.copy(new_order);
				if($scope.formCheckout.pending_data.order_no == ''){//New order
					$scope.terminalData.last_bill_number = parseInt($scope.terminalData.last_bill_number)+1;
					$scope.terminalData.last_order_seq = parseInt($scope.terminalData.last_order_seq)+1;
					$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'terminalData',$scope.terminalData);
					if(temp_order.data.customer_id && temp_order.data.customer_id!="guest"&& temp_order.data.customer.meta.docid){
						customer_actions.actions.push("ORDER_COUNT");
						customer_actions.data._id = temp_order.data.customer.meta.docid;
						customer_actions.data.order_count = temp_order.data.customer.orders_count;
					}
					
					$pouchDB.upsert($scope.terminalData._id,function(doc){
						if(doc != undefined && doc._id != undefined){
							doc.last_bill_number = $scope.terminalData.last_bill_number;
							doc.last_order_seq = $scope.terminalData.last_order_seq;
							return doc;
						}
						return false;
					}).then(function(returnData) {
					
					}).catch(function(error){
						console.error(error);
					});
				}
				
				if(angular.isDefined(returnData.ok)){
					if(!returnData.ok){
						$ionicLoading.hide();
						$scope.showCheckoutMsg('Error',returnData.Message);
					}else{
						if(status != 'pending'){//Place order
							$ionicLoading.hide();
							if(status != 'cancelled'){
								var daily_num = $scope.dailyOrderNo.num;
								$ionicLoading.show({
									template : '<h2>Order '+daily_num+' Placed...</h2>',
									duration : 1300
								});
							}
							
							$scope.dailyOrderNo.num++;
							$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'order_no',$scope.dailyOrderNo);
							
							if($scope.formCheckout.pending_data.pending_rev != ''){
								//Delete doc form on completing saved order
								var pending_doc_id = $scope.terminalData.name+'_pending_'+$scope.formCheckout.pending_data.order_no; 
								$pouchDB.delete(pending_doc_id,$scope.formCheckout.pending_data.pending_rev).then(function(returnData) {
								
								}).catch(function(error){
									console.error(error);
								});
							}
							
							if(status != 'cancelled'){
								var split_val =true;
								if($scope.startup.action == 'TABLEVIEW'){
									split_val = update_last_splitpayoff();
								}
								
								//Store last order
								$scope.lastOrder.order = angular.copy(new_order);
								$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'lastOrder',$scope.lastOrder);
								
								if($scope.loyalty_card.id){
									 
									customer_actions.actions.push("LOYALTY");
									customer_actions.data.loyalty_card = angular.copy($scope.loyalty_card);
									customer_actions.data._id = temp_order.data.customer.meta.docid;
								}else if(temp_order.data.customer.meta.docid){
									customer_actions.actions.push("LOYALTY");
									customer_actions.data.loyalty_card = $scope.loyalty_card;
									customer_actions.data._id = temp_order.data.customer.meta.docid;
								}
								
								if(customer_actions.actions.length){
									$scope.updateCustomerDoc(customer_actions);
								}
							}
					
							if($rootScope.aiv_info.enable_kitchen == "TRUE"){
								//Send to kitchen
								delete new_order._rev;
								new_order.data.order_meta.base_doc = new_order._id;
								$pouchDBEtc.save(new_order).then(function (result) {
									console.log("Order "+new_order.data.id+" Sent to kitchen");
								}).catch(function(error){
									$ionicLoading.show({
										template : '<h2>Uanble to send this order to Kitchen!!!</h2>',
										duration : 1300
									});
									console.error(error);
								});
								//$scope.aiv_logout();
							}
							
							if(status != 'cancelled'){
								if($scope.startup.action != 'TABLEVIEW')
								{
									/*if(new_order.data.payment_details.method_id == 'cod' && !$scope.payment_select.delivery){
										$scope.showReceiptSlip('ORDER');
									}else{
										checkEndAction(true);	
									}*/
									$scope.showReceiptSlip('ORDER');
								}
								else
								{
									if(print_order.data.payment_details.method_id == 'cod' && !$scope.payment_select.delivery){
										$scope.showReceiptSlip('',print_order,true);
									}
								}
							}else{
								trashOrder();
							}

							//DB compaction
							var compact_days = (new Date() - new Date($scope.gen_settings.last_compaction)) / (1000 * 60 * 60 * 24);
							if(Math.round(compact_days) > 1){
								$timeout(function(){
									$pouchDB.compactDB().then(function(compact_res){
										$scope.gen_settings.last_compaction = new Date().toISOString();
										$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'GenSettings',$scope.gen_settings);
									}).catch(function(error){
										console.error(error);
									});
								},100);
							}
							
						}else{//Save order
							$scope.formCheckout.pending_data.order_no = ($scope.formCheckout.pending_data.order_no!='')?$scope.formCheckout.pending_data.order_no:($scope.terminalData.prefix+''+parseInt($scope.terminalData.last_bill_number));
							$scope.formCheckout.pending_data.order_seq = ($scope.formCheckout.pending_data.order_seq!='')?$scope.formCheckout.pending_data.order_seq:parseInt($scope.terminalData.last_order_seq);
							$scope.formCheckout.pending_data.cart = $scope.cartItems;
							$scope.formCheckout.pending_data.bagCharge =$scope.bagCharges.selected;
							var term = ($scope.formCheckout.pending_data.docid!='')?$scope.formCheckout.pending_data.docid.split('_')[0]:$scope.terminalData.name;
							var pending_doc_id = term+'_pending_'+$scope.formCheckout.pending_data.order_no;
							var new_doc = {
								'_id':pending_doc_id,
								'data':$scope.formCheckout
							}
							if($scope.formCheckout.pending_data.pending_rev != ''){
								new_doc._rev = $scope.formCheckout.pending_data.pending_rev;
							}
							$pouchDB.save(new_doc).then(function(res) {
								$ionicLoading.hide();
								$ionicLoading.show({
									template : '<h2>Order Saved...</h2>',
									duration : 1300
								});
								console.log(res);
								checkEndAction(true);	
							}).catch(function(error) {
								$ionicLoading.hide();
								$ionicLoading.show({
									template : 'Failed to save this order!!!',
									duration : 3000
								});
								console.error(error);
							});
						}
						//$ionicLoading.hide();
					}
				}else{
					$ionicLoading.hide();
					$scope.showCheckoutMsg('Error','unable to place your order.Please try again...');
				}
			}).catch(function(error) {
				if(!order_placed){
					//Fix for unable to place order due to same docid
					max_tries++;
					if(max_tries < 10 && angular.isUndefined(new_order._rev)){
						var next_new_seq = parseInt($scope.terminalData.last_order_seq) + max_tries;
						var next_doc_id = $scope.terminalData.name+'_order_'+next_new_seq;
						var next_bill_number = $scope.terminalData.prefix+''+(parseInt($scope.terminalData.last_bill_number)+max_tries);
						new_order._id = next_doc_id;
						new_order.data.order_number = next_bill_number;
						new_order.data.order_meta.bill_number = next_bill_number;
						new_order.data.order_meta.doc_id = next_doc_id;
						conflictFreeOrder();
					}else{
						max_tries = 0;
						$ionicLoading.hide();
						$scope.pos_action.done_clicked = false;
						$scope.showCheckoutMsg('Error','Unable to place your order.An error occurred...');
					}
					console.error('Unable to place order. Try '+max_tries);
					console.error(error);
				}
			});
		}
		
		var new_order;
		var order_placed = false;
		var max_tries = 1;
		conflictFreeOrder();
    }
	
	var complete_edit_order = function(){
		var now_date = new Date().toISOString();
		var line_items = [];
		var cart = $scope.cartItems;
		var per_discount = $scope.grand.Discount/$scope.grand.Quantity;
		for (var i = 0; i < cart.length; i++) {
			var prdt_dept = '',prdt_group = '',prdt_types = [];
			if(angular.isDefined(cart[i].meta.wc_productdata_options)){
				if(angular.isDefined(cart[i].meta.wc_productdata_options[0].prdt_dept)){
					prdt_dept = cart[i].meta.wc_productdata_options[0].prdt_dept;
				}
				if(angular.isDefined(cart[i].meta.wc_productdata_options[0].group)){
					prdt_group = cart[i].meta.wc_productdata_options[0].group;
				}
				if(angular.isDefined(cart[i].meta.wc_productdata_options[0].types)){
					prdt_types = cart[i].meta.wc_productdata_options[0].types;
				}
			}else{
				if(angular.isDefined(cart[i].dept)){
					prdt_dept = cart[i].dept;
				}
				if(angular.isDefined(cart[i].group)){
					prdt_group = cart[i].group;
				}
			}

			if (angular.isUndefined(cart[i].sel_variations)) {
				line_items.push({
					"id":null,
					"product_id": cart[i].id,
					"sku": cart[i].sku,
					"quantity": cart[i].quantity,
					"subtotal": cart[i].total,
					"total": cart[i].total - (per_discount*cart[i].quantity),
					"price": get_product_price(cart[i],true),
					"featured_src": cart[i].featured_src,
					"title": cart[i].title,
					"categories": cart[i].categories,
					"dept" : prdt_dept,
					"status":'',
					"notes": angular.isDefined(cart[i].notes)?cart[i].notes:'',
					"group": prdt_group,
					"types":prdt_types
				})
			}else{
				var varia = {};
				for (var key in cart[i].sel_variations.attributes) {
				  if (cart[i].sel_variations.attributes.hasOwnProperty(key)) {
					varia[key] = cart[i].sel_variations.attributes[key];
				  }
				}
				line_items.push({
					"id":null,
					"product_id": cart[i].id,
					"sku": cart[i].sku,
					"quantity": cart[i].quantity,
					"subtotal": cart[i].total,
					"total": cart[i].total - (per_discount*cart[i].quantity),
					"price": get_product_price(cart[i],true),
					"featured_src": cart[i].featured_src,
					"title": cart[i].title,
					"categories": cart[i].categories,
					"variations": varia,
					"dept" : prdt_dept,
					"status":'',
					"notes": angular.isDefined(cart[i].notes)?cart[i].notes:'',
					"group": prdt_group,
					"types":prdt_types
				})
			}
		};

		var delete_doc = '';
		var new_order = '';
		var base_doc_id = '';
		$pouchDB.get($scope.formCheckout.pending_data.order_id).then(function(order){
			new_order = order;
			base_doc_id = new_order._id;
			if(new_order.data.id != ""){
				delete_doc = {id:new_order._id,rev:new_order._rev};
				var splitNameArr = new_order._id.split('_order_');
				var new_doc_id = '';
				if(splitNameArr.length > 1){
					var splitSeqArr = splitNameArr[1].split('_');
					if(splitSeqArr.length > 0){
						new_doc_id = splitNameArr[0]+'_order_'+splitSeqArr[0]+'_';
						base_doc_id = splitNameArr[0]+'_order_'+splitSeqArr[0];
					}
				}
				new_doc_id+=Date.now();
				new_order._id = new_doc_id;
				delete new_order._rev;
				new_order.data.update = true;
			}
			
			new_order.data.fee_lines = [];
			//card charges
			if($scope.payment_fee){
				new_order.data.fee_lines.push({
				   "id":(new_order.data.id != "")?null:'',
				   "title": "Card charges",
				   "tax_class": "",
				   "total": $filter('number')($scope.payment_fee,2),
				   "total_tax": "0.00"
				})
			}
			
			//Bag charges
			if($scope.bagCharges.selected){
				new_order.data.fee_lines.push({
				   "id":(new_order.data.id != "")?null:'',
				   "title": "Bag charges",
				   "tax_class": "",
				   "total": $filter('number')($scope.bagCharges.selected,2),
				   "total_tax": "0.00"
				})
			}
			
			if(angular.isArray($scope.formCheckout.shipping_lines) && $scope.formCheckout.shipping_lines.length && $scope.formCheckout.shipping_lines[0].method_id != ''){
				new_order.data.shipping_lines = $scope.formCheckout.shipping_lines;
				new_order.data.shipping_lines[0].id = (new_order.data.id != "")?null:'';
				new_order.data.shipping_methods = $scope.formCheckout.shipping_lines[0].method_title;
			}else{
				new_order.data.shipping_lines = '';
				new_order.data.shipping_methods = '';
			}
			
			
			for(var c=0;c<$scope.formCheckout.coupon_lines.length;c++){
				new_order.data.coupon_lines[c].code = $scope.formCheckout.coupon_lines[c].code;
				new_order.data.coupon_lines[c].amount = $scope.formCheckout.coupon_lines[c].amount;
				new_order.data.coupon_lines[c].id = (new_order.data.id != "")?null:'';
			}
			
			//Add payment methods
			new_order.data.status = 'on-hold';
			new_order.data.payment_details = $scope.formCheckout.payment_details;
			if($scope.aiv_toggles.set_unpaid || (new_order.data.payment_details.method_id == 'cod' && $scope.payment_select.delivery)){
				new_order.data.payment_details.paid = false;
			}else{
				new_order.data.payment_details.paid = true;
				if($rootScope.aiv_info.enable_kitchen=="FALSE"){
					new_order.data.status = 'completed';
				}
			}
			
			new_order.data.updated_at = now_date;
			new_order.data.total = ($scope.grand.Total + $scope.grand.Shipping - $scope.grand.Discount + $scope.payment_fee + $scope.bagCharges.selected).toFixed(2),
		    new_order.data.subtotal = $scope.grand.Total.toFixed(2);
			new_order.data.total_line_items_quantity = $scope.grand.Quantity;
			new_order.data.total_shipping = $scope.grand.Shipping;
			new_order.data.total_discount = $scope.grand.Discount.toFixed(2);
		    new_order.data.billing_address = $scope.formCheckout.billing_address;
			new_order.data.shipping_address = $scope.formCheckout.shipping_address;
			new_order.data.note = $scope.formCheckout.shipping_note;
			new_order.data.customer_id = $scope.formCheckout.customer_id;
			new_order.data.line_items = line_items;
		    new_order.data.customer = {
			   "id": $scope.formCheckout.customer_id,
			   "email": $scope.formCheckout.billing_address.email,
			   "first_name": $scope.formCheckout.billing_address.first_name,
			   "last_name": $scope.formCheckout.billing_address.last_name,
			   "billing_address": $scope.formCheckout.billing_address,
			   "shipping_address": $scope.formCheckout.shipping_address
		    };
			if($scope.formCheckout.customer_id != 'guest' && $scope.formCheckout.customer_id){
				new_order.data.customer.meta = $scope.formCheckout.customer_meta;
			}
		    new_order.data.order_meta.doc_id = new_order._id;
		    new_order.data.order_meta.processed_by = $scope.terminalData.name;
			new_order.data.order_meta.customer_docid = $scope.formCheckout.customer_meta.docid;
			new_order.data.order_meta.sitin_table = $scope.sitin_tables.selected;
		    $scope.closeModal('PAYMENT');
		    return $pouchDB.save(new_order);
		}).then(function(returnData) {
			if(delete_doc != ''){//Delete old doc
				$pouchDB.delete(delete_doc.id,delete_doc.rev).then(function(resData) {
					console.log('Old order doc deleted');
					$scope.tipData={
						enable:false,
						amount:'',
						method:''
					}
				}).catch(function(error){
					console.error(error);
				});
			}
			
			//Store last order
			$scope.lastOrder.order = angular.copy(new_order);
			$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'lastOrder',$scope.lastOrder);
			
			if($rootScope.aiv_info.enable_kitchen == "TRUE"){
				new_order.data.order_meta.base_doc = new_order._id;
				var updateEditStatus = function (doc) {
					if(doc.data.status == "re-opened"){
						doc.data.updated_at = new Date().toISOString();
						doc.data = new_order.data;
						return doc;
					}
					return false; // don't update the doc; it's already been "touched"
				}
				$pouchDBEtc.upsert(base_doc_id,updateEditStatus).then(function(res){
					console.log("Order "+new_order.data.order_meta.bill_number+" updated to kitchen");
				}).catch(function(error){
					console.error(error);
				});
			}
			
			if(new_order.data.payment_details.paid){
				removeAlert(new_order.data.order_meta.bill_number);
				removeReady(new_order.data.order_meta.bill_number);
			}
			
			//$scope.print_config.kot = true;
			if(angular.isArray(new_order.data.shipping_lines)){
				if(new_order.data.shipping_lines[0].method_id=='local_delivery'){
					$scope.print_config.copies = $scope.receiptCount.delivery;
				}else if(new_order.data.shipping_lines[0].method_id=='local_pickup'){
					$scope.print_config.copies = $scope.receiptCount.collection;
				}else if(new_order.data.shipping_lines[0].method_id=='sitin'){
					$scope.print_config.copies = $scope.receiptCount.sitin;
				}
			}else{
				$scope.print_config.copies = $scope.receiptCount.inshop;
			}
			
			//Open cash drawer for Cash/Card orders
			if(!$scope.payment_select.delivery && !$scope.aiv_toggles.set_unpaid){
				if(!$scope.print_config.receipt)
					$scope.openCashdrawer();
				$scope.printReceipt(new_order.data,true,false);
				
					
			}else{
				$scope.printReceipt(new_order.data,false,false);
			}
			
			$ionicLoading.hide();
			$ionicLoading.show({
				template : '<h2>Order Updated...</h2>',
				duration : 1300
			});
			$scope.showReceiptSlip('ORDER');
			/* if(new_order.data.payment_details.method_id == 'cod' && !$scope.payment_select.delivery){
				$scope.showReceiptSlip('ORDER');
			}else{
				checkEndAction(true);	
			} */
		}).catch(function(error){
			$ionicLoading.hide();
			$scope.closeModal('PAYMENT');
			$scope.showCheckoutMsg('Error','unable to retrieve order details.Please try again...');
			console.error(error);
		});
	}

	$scope.printData = [];
	function printPreview(printData){
		$scope.printData = printData;
		$ionicModal.fromTemplateUrl('print-preview-modal.html', {
			id:'PREVIEW_MODAL',
			scope: $scope,
			backdropClickToClose: false,
			animation: 'none'
		}).then(function(modal) {
			modal.el.className = modal.el.className + " below-modal";
			$scope.preview_modal = modal;
			$scope.openModal('PREVIEW_MODAL');
		});
	}
	
	//Pixel Printers //
	$scope.printPDF = function(pixel_data,print_params) {
		var printData = pixel_data;
		var copies = print_params.copies;
		if(copies > 1){ 
			print_params.copies = 1;
		}
		QZHelper.setPrintParams(print_params);
		QZHelper.startConnection().then(function(response){
			var config;
			if($scope.settingsPrinter.name != ''){

				config = $scope.setPrinter($scope.settingsPrinter.name);
				
				$ionicLoading.show({
					template : 'Printing...',
					duration : 1300
				});
							
				$scope.settingsPrinter.connected = true;
				$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'PrinterSettings',$scope.settingsPrinter);

				qz.print(config, printData).then(function() {
					console.log("Print success");
				}).catch(function(err){
					console.error(err);
				});
			}else{
				$scope.showCheckoutMsg('Error','No Pixel printer selected...');
			}
		}).catch(function(res) {
			$scope.showCheckoutMsg('Error','Unable to connect to printer '+$scope.settingsPrinter.name+'...<br>Please make sure that QZ Tray is installed and started.');
			QZHelper.handleConnectionError(res.err);
			
			$scope.settingsPrinter.connected = false;
			$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'PrinterSettings',$scope.settingsPrinter);
		});
		
    }
	
    $scope.printHTML = function(pixel_data,print_params) {
		var printData = [];
		if(!angular.isArray(pixel_data)){
			printData.push({
                type: 'html',
                format: 'plain',
                data: pixel_data
			});
		}else{
			printData = pixel_data;
		}

		console.log(pixel_data);
		var copies = print_params.copies;
		if(copies > 1){ 
			print_params.copies = 1;
		}
		QZHelper.setPrintParams(print_params);
		QZHelper.startConnection().then(function(response){
			var config;
			if($scope.settingsPrinter.name != ''){

				config = $scope.setPrinter($scope.settingsPrinter.name);
				
				$ionicLoading.show({
					template : 'Printing...',
					duration : 1300
				});
							
				$scope.settingsPrinter.connected = true;
				$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'PrinterSettings',$scope.settingsPrinter);
				
				qz.print(config, printData).then(function() {
					console.log("Print success");
				}).catch(function(err){
					console.error(err);
				});
			}else{
				$scope.showCheckoutMsg('Error','No printer selected...');
			}
		}).catch(function(res) {
			$scope.showCheckoutMsg('Error','Unable to connect to printer '+$scope.settingsPrinter.name+'...<br>Please make sure that QZ Tray is installed and started.');
			QZHelper.handleConnectionError(res.err);
			
			$scope.settingsPrinter.connected = false;
			$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'PrinterSettings',$scope.settingsPrinter);
		});
		
    }
	
	//Raw Printers
	$scope.printESCP = function (printData,cash_drawer,print_params,printer_settings,labelData = []){
		var deferred = $q.defer();
		var copies = print_params.copies;
		console.log("Final Receipt "+copies+" copies.");
		if(printData.length){
			if(printer_settings.enable_cut){
				printData.push({ type: 'raw', format: 'plain', data: gen_print_command(printer_settings.cmd_cut) });
			}else{
				printData.push({ type: 'raw', data: "\n\n\n\n\n" });
			}
			if(copies > 1){ 
				print_params.copies = 1;
			}
		}else{
			print_params.copies = 1;
			copies = 1;
		}
		
		var console_data = "";
		angular.forEach(printData,function(print){
			if(print.format == undefined)
			console_data+=print.data;
		})
		console.log(console_data);
		
		console.log("=====Labels===========");
		console.log(labelData);
				
		print_params.size = null;
		print_params.orientation = "";
		QZHelper.setPrintParams(print_params);
		QZHelper.startConnection().then(function(response){
			var config;
			if(printer_settings.name != ''){

				config = $scope.setPrinter(printer_settings.name);
				/*
				$ionicLoading.show({
					template : 'Printing...',
					duration : 1300
				});*/
							
				//printer_settings.connected = true;
				//$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'PrinterSettings',printer_settings);
				
				if(cash_drawer){
					printData.unshift({ type: 'raw', data: gen_print_command(printer_settings.cmd_cashdrawer) });
				}
				//printData.unshift({ type: 'raw', data: chr(27)+chr(66)+chr(01)+chr(02) });//printData 1B, 42, 09, 02
				//printData.unshift({ type: 'raw', data: chr(7) });
				if(copies > 1){ 
					qz.print(config, printData).then(function() {
						print_params.copies = copies - 1;
						QZHelper.setPrintParams(print_params);
						config = QZHelper.getUpdatedConfig();
						if(cash_drawer){
							printData.shift();
						}
						//printData.shift();
						printData.splice(0,0,{ type: 'raw', data: "====REPRINT====\n\n" });
						return qz.print(config, printData);
					}).then(function() {
						if(labelData.length){
							print_params.copies = 1;
							config = $scope.setPrinter($scope.LabelPrinterSettings.name);
							QZHelper.setPrintParams(print_params);
							config = QZHelper.getUpdatedConfig();
							$scope.LabelPrinterSettings.connected = true;
							$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'LabelPrinterSettings',$scope.LabelPrinterSettings);
							return qz.print(config, labelData);
						}
					}).then(function(){
						deferred.resolve(true);
					}).catch(function(err){
						console.error(err);
						deferred.reject(err);
					});
				}else if(printData.length){
					qz.print(config, printData).then(function() {
						if(labelData.length){
							print_params.copies = 1;
							config = $scope.setPrinter($scope.LabelPrinterSettings.name);
							QZHelper.setPrintParams(print_params);
							config = QZHelper.getUpdatedConfig();
							$scope.LabelPrinterSettings.connected = true;
							$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'LabelPrinterSettings',$scope.LabelPrinterSettings);
							return qz.print(config, labelData);
						}
					}).then(function() {
						deferred.resolve(true);
					}).catch(function(err){
						console.error(err);
						deferred.reject(err);
					});
				}else if(labelData.length){
					print_params.copies = 1;
					config = $scope.setPrinter($scope.LabelPrinterSettings.name);
					QZHelper.setPrintParams(print_params);
					config = QZHelper.getUpdatedConfig();
					$scope.LabelPrinterSettings.connected = true;
					$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'LabelPrinterSettings',$scope.LabelPrinterSettings);
					qz.print(config, labelData).then(function(){
						deferred.resolve(true);
					}).catch(function(err){
						console.error(err);
						deferred.reject(err);
					});
				}
				
			}else{
				$scope.showCheckoutMsg('Error','No Receipt printer selected...');
				deferred.reject('No Receipt printer selected...');
			}
		}, function(res) {
			$scope.showCheckoutMsg('Error','Unable to connect to printer '+printer_settings.name+'...<br>Please make sure that QZ Tray is installed and started.');
			QZHelper.handleConnectionError(res.err);
			
			//printer_settings.connected = false;
			//$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'PrinterSettings',printer_settings);
			
			deferred.reject(res.err);
		});
		
		return deferred.promise;
    }
	
	$scope.saveOpenItem = function(item){
		if(item.title == ''){
			$scope.custom_product.err = "Product name is required!!!";
			$timeout(function() {$scope.custom_product.err = '';},2000);
			return;
		}else if(item.price == ''){// || !parseFloat(item.price)){
			//$scope.custom_product.err = "Product price is required!!!";
			item.price = 0;
		}else if (isNaN(item.price)){ 
			$scope.custom_product.err = "Product price is not valid!!!";
			return;
		}
		
		item.regular_price = item.price;
		$scope.onClickProduct(item);
		$scope.closeModal('CUSTOM_PRODUCT');
	}
	
	function ascii_to_hexa(str)
	{
		var arr1 = [];
		for (var n = 0, l = str.length; n < l; n ++) 
		{
			var hex = Number(str.charCodeAt(n));
			if(hex > 0x7F){
				hex = (0xFFFF-hex)+0x80;
			}
			hex = hex.toString(16);
			arr1.push(hex);
		}
		return arr1.join(' ');
	}
	
	var CIDResponse = [],CID_length = 0;
	var CID_num_length = null, CID_remaining = 0;
	var CID_WIDTH = 20; //2 bytes
	$scope.CID_ph_num = '';
	
	//Defining commands are responses here, need to shift to proper place later
	$AIV_FID_REG_FAIL =  "03020000000000000000"
	$AIV_FID_REG_1STEP = "03020100000000000000"
	$AIV_FID_REG_2STEP = "03020200000000000000"
	$AIV_FID_REG_3STEP = "03020300000000000000"
	$AIV_FID_REG_4STEP = "03020400000000000000"
	$AIV_FID_REG_SUCC  = "03021100000000000000"
	
	function fidMessages(message,auto)
	{
	 var config = {
					template: '<ion-spinner icon="ios"></ion-spinner><br><span class="aiv-loading">'+message+'</span>',
					animation: 'fade-in',
					showBackdrop: true,
					maxWidth: 300,
					showDelay: 0,
					scope: $scope
				};
	 if(auto==true)
	 {
		config["duration"]=2000;
	 }else{
		config.template+='<button ng-click="cancelRegistration()" class="button button-full button-assertive">Cancel</button>';
	 }
	 $ionicLoading.show(config);
	}
	
	$scope.sendCommData = function (data){
	
	
		if($scope.settingsCID.port != ''){
				qz.serial.sendData($scope.settingsCID.port,data).catch(function(err){
				console.error(err);
				$scope.showCheckoutMsg('Error','Oops...Unable to communicate with fingerprint device!!!');
		});
		}
		
	
	}
	
	$scope.startConnection = function (config) {
		//fidMessages("Testing",true);
		QZHelper.startConnection(config).then(function(response){

			if($scope.settingsCID.port != ''){
				$scope.openSerialPort($scope.settingsCID,true);
			}

			if($scope.terminalData.type == 'BOTH' || ($scope.terminalData.type == 'BACK' && $scope.backTemplate.id != 'MPOS')){
				qz.serial.setSerialCallbacks(function(evt) {
					if (evt.type !== 'ERROR') {
						console.log('Serial', evt.portName, 'received output', evt.output);
						var port =evt.portName ;
						var output= evt.output;
						//FPComms 
						var type = output.substr(0,2);
						if(type == "01"){//Signal
							$scope.settingsCID = $localstorage.getObject(AIV_CONSTANTS.LS_PREFIX+'CIDSettings');
							var connection = output.substr(2,2);
							if(connection == "01"){//Connection alive
								$scope.callerid_status.response = 0;
								$scope.settingsCID.device_connected = true;
								$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'CIDSettings',$scope.settingsCID);
							}else{//Connection not alive
								$scope.callerid_status.response = 0;
								$scope.settingsCID.device_connected = false;
								$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'CIDSettings',$scope.settingsCID);
							}
							
							var connection = output.substr(4,2);
							if(connection == "01"){//Connection alive
								$scope.fid_status.response = 0;
								$scope.settingsCID.fid_connected = true;
								$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'CIDSettings',$scope.settingsCID);
							}else{//Connection not alive
								$scope.fid_status.response = 0;
								$scope.settingsCID.fid_connected = false;
								$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'CIDSettings',$scope.settingsCID);
							}
						}else if(type == "02"){//CallerID
							$scope.callerid_status.response = 0;
							$scope.settingsCID.device_connected = true;
							$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'CIDSettings',$scope.settingsCID);
							//output = "0209895940sadf6~~~740000000000000000000";
							var thenum = output.replace(/\D/g,''); 
							
							$scope.CID_ph_num = thenum.substr(2,11);
							console.log('Call from '+$scope.CID_ph_num);
							
							//Show call popup only if 
							//1.user is logged in,2.user hasn't begin to take another order
							if($scope.CID_ph_num.length>=10 && $scope.formCheckout.customer_id == "guest" && !$scope.cartItems.length && 
								($scope.customer_modal == undefined || !$scope.customer_modal._isShown) && 
								($scope.ship_modal == undefined || !$scope.ship_modal._isShown) && 
								($scope.customer_edit_modal == undefined || !$scope.customer_edit_modal._isShown)){
								$scope.callPopup($scope.CID_ph_num);
							}
						}else if(type == "03"){//Finger print
							$scope.fid_status.response = 0;
							$scope.settingsCID.fid_connected = true;
							$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'CIDSettings',$scope.settingsCID);
							//output = "0209895940sadf6~~~740000000000000000000";
							//var thenum = output.replace(/\D/g,''); 
							var caseOpt = output.substr(2,2);
							switch(caseOpt)
							{
								case "01":
									console.log("validation "+output);
									//check if message contain username then login to that.
									
									for(var i=0;i<$scope.aiv_users.users.length;i++){
										if( output.includes($scope.aiv_users.users[i].user_id))
										{
											if(angular.element('#refund-pass').length || angular.element('#exit-pass').length){
												//Manager permission for refund
												$scope.action_auth.err = "";
												$scope.action_auth.pass = $scope.aiv_users.users[i].user_pass;
											}else if($scope.discount_modal != undefined && $scope.discount_modal._isShown){
												//Add discount as Manager
												$scope.action_auth.pass = $scope.aiv_users.users[i].user_pass;
												$scope.checkDiscountPassword($scope.action_auth.pass);
											}else if($scope.user_modal != undefined && $scope.user_modal._isShown ){
												//Clock action
												$scope.clock_user = $scope.aiv_users.users[i];
												$scope.qwerty_inputs.clock_pass = $scope.aiv_users.users[i].user_pass;
												if($scope.IsPasswordMatching($scope.clock_user._id,$scope.qwerty_inputs.clock_pass)){
													$scope.selectClockUser($scope.clock_user);
													
													$timeout(function() {
														$scope.onKeyPressed("?",'CLOCK_PASS');
													}, 200);
													
													
												}else{
													$scope.aiv_users.err = 'Incorrect password!!!';
												}
											}else{
												//login as that user.
												$scope.aiv_users.selected=$scope.aiv_users.users[i]._id;
												$scope.qwerty_inputs.pass = $scope.aiv_users.users[i].user_pass;
												$scope.login($scope.aiv_users.users[i].user_pass);
												fidMessages( $scope.aiv_users.users[i].user_login+" Bio ID detected",true);//AIV_FID_REG_3STEP
												//$scope.sendCommData("JUST TESTING");
											}
											break;
										}

									}
									break;
								case "00":
									console.log("general message "+output);
									fidMessages( output+" General message",true);
									break;
								case "02":
									console.log("Registration "+output,true);
									if($AIV_FID_REG_FAIL==output)
									{
										fidMessages( "Finger print registration is failed" ,true);
									}
									if($AIV_FID_REG_SUCC==output)
									{
										fidMessages( "Finger print registration is Successful" ,true);
									}
									if($AIV_FID_REG_4STEP==output)
									{
										fidMessages( "4 More Required. Waiting for Finger" ,false);
									}
									if($AIV_FID_REG_3STEP==output)
									{
										fidMessages( "3 More Required. Waiting for Finger" ,false);
									}
									
									if($AIV_FID_REG_2STEP==output)
									{
										fidMessages( "2 More Required. Waiting for Finger" ,false);
									}
									if($AIV_FID_REG_1STEP==output)
									{
										fidMessages( "1 More Required. Waiting for Finger" ,false);
									}
									break;
								case "03":
									console.log("device connection "+output);
									var deviceStatus = output.substr(4,2);
									if(deviceStatus=='01')
									{
										fidMessages( "Fingerprint connection has been successful" ,true);
									}
									else
									{
										fidMessages( "Finger print device connection has failed" ,true);
									}
									break;
							}
						}
						
						//Comet (2 byte reading)
						/*CIDResponse.push(Number(output.charCodeAt(0)));
						CIDResponse.push(Number(output.charCodeAt(1)));

						//console.log(Number(output.charCodeAt(0)).toString(16));
						//console.log(Number(output.charCodeAt(1)).toString(16));
						
						if(CID_remaining && $scope.CID_ph_num!=''){//Flush Residue data from last response
							if(CID_remaining > 1){
								CIDResponse = [];
								CID_remaining-=CID_WIDTH;
							}else{
								CIDResponse = CIDResponse.slice(-1);
								CID_remaining = 0;
							}
						}
						
						if(!CID_remaining){//Reset all variables
							CID_length = 0;
							CID_num_length = null;
							$scope.CID_ph_num = '';
						}
							
						if(!CID_length && CIDResponse.length > 1){
							CID_length = CIDResponse[1]+1;
							CID_remaining = CID_length;
						}
						if(CIDResponse.length >= 17 && CID_length){
							if(CID_num_length == null){
								if(CIDResponse[15] == 0x02){//Number present
									CID_num_length = CIDResponse[16];
								}else{
									CID_num_length = 0;
								}
								CID_remaining = CID_length - CIDResponse.length + 2;
							}else if(CIDResponse.length >= CID_num_length+17 && $scope.CID_ph_num == ''){//Read phone number
								if(CID_num_length){
									var stdph_num = CIDResponse.slice(17,CID_num_length+17);
									$scope.CID_ph_num = '';
									for (i in stdph_num){
										$scope.CID_ph_num+=String.fromCharCode(stdph_num[i]);
									}
									$scope.CID_ph_num = "0"+$scope.CID_ph_num.slice(CID_num_length-10);
								}else{
									$scope.CID_ph_num = 'UNKNOWN';
								}
								console.log('Call from '+$scope.CID_ph_num);
								if($scope.formCheckout.customer_id == "guest" && !$scope.cartItems.length && 
								($scope.customer_modal == undefined || !$scope.customer_modal._isShown) && 
								($scope.ship_modal == undefined || !$scope.ship_modal._isShown) && 
								($scope.customer_edit_modal == undefined || !$scope.customer_edit_modal._isShown)){
									$scope.callPopup($scope.CID_ph_num);
								}
								CID_remaining = CID_length - CIDResponse.length + 2;
							}
							
							if(!CID_remaining){
								CIDResponse = [];
							}
						}*/
						/*if(CIDResponse.length > 1 && CIDResponse[1] <= CIDResponse.length-3){
							console.log("Received output from serial port []: <em>" + CIDResponse + "</em>");
							var num_len = CIDResponse[16];
							var stdph_num = CIDResponse.slice(17,num_len+17);//.join('');
							var ph_num = '';
							for (i in stdph_num){
								ph_num+=String.fromCharCode(stdph_num[i]);
							}
							ph_num = ph_num.slice(num_len-10);
							$scope.callPopup(ph_num);
							CIDResponse = [];
						}*/
						
						if($scope.settingsCID.device_connected && !$scope.callerid_status.online){
							$scope.callerid_status = { 'online':true,'title':'Connected','class':'balanced-imp','response':0};
						}else if(!$scope.settingsCID.device_connected && $scope.callerid_status.online){
							$scope.callerid_status = { 'online':false,'title':'Disconnected','class':'assertive-imp','response':0};
						}
						
						if($scope.settingsCID.fid_connected && !$scope.fid_status.online){
							$scope.fid_status = { 'online':true,'title':'Connected','class':'balanced-imp','response':0};
						}else if(!$scope.settingsCID.fid_connected && $scope.fid_status.online){
							$scope.fid_status = { 'online':false,'title':'Disconnected','class':'assertive-imp','response':0};
						}
						$scope.$digest();
					}else {
						console.error(evt.exception);
					}
					
				});
			}
	
			if(!response.exists){
				if($scope.settingsPrinter.name != ''){
					$scope.findPrinter($scope.settingsPrinter.name,true);
				}
			}
			
			var config = QZHelper.getPrintParams();
			if($scope.settingsPrinter.type == "Pixel Print"){
				var paper_sizes = $filter('filter')($scope.aiv_paper_sizes,{type:$scope.settingsPrinter.paper},false);
				if(paper_sizes.length){
					config.size = {
						'width' : paper_sizes[0].width,
						'height' : paper_sizes[0].height
					}
					QZHelper.setPrintParams(config);
				}
			}
			
			$scope.settingsPrinter.connected = true;
			$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'PrinterSettings',$scope.settingsPrinter);
		}, function(res) {
			$scope.showCheckoutMsg('Error','Unable to connect to printer '+$scope.settingsPrinter.name+'...<br>Please make sure that QZ Tray is installed and started. Restart the application after starting QZTray');
			QZHelper.handleConnectionError(res.err);
			
			$scope.settingsPrinter.connected = false;
			$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'PrinterSettings',$scope.settingsPrinter);
		});
    }

    $scope.endConnection = function () {
        if (qz.websocket.isActive()) {
            qz.websocket.disconnect().then(function() {
				$scope.settingsPrinter.connected = false;
				$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'PrinterSettings',$scope.settingsPrinter);
            }).catch(QZHelper.handleConnectionError);
        } else {
            console.log('No active connection with QZ exists.');
        }
    }

	$scope.findPrinter = function (query, set) {
        qz.printers.find(query).then(function(data) {
            console.log("<strong>Found:</strong> " + data);
            if (set) { $scope.setPrinter(data); }
			
			$scope.settingsPrinter.connected = true;
			$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'PrinterSettings',$scope.settingsPrinter);
        }).catch(function(err){
			console.error(err);
			$scope.settingsPrinter.connected = false;
			$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'PrinterSettings',$scope.settingsPrinter);
		});
    }
	
	$scope.setPrinter = function (printer) {
        var cf = QZHelper.getUpdatedConfig();
        cf.setPrinter(printer);
		return cf;
    }
	
	$scope.aiv_printers = [];
	function findPrinters() {
        qz.printers.find().then(function(data) {
            $scope.aiv_printers = data;
        }).catch(function(err){
			console.error(err);
		});
    }
	
	$scope.listSerialPorts = function() {
        qz.serial.findPorts().then(function(data) {
            $scope.com_ports = data;
        }).catch(function(err){
			console.error(err);
		});
    }
	
	$scope.openSerialPort = function(selected_cid,show_alert){
		var bounds = {
			begin: '0x0002',
			end: '0x000D',
			width: null
		};

		$scope.settings_error.err = '';
		$scope.settings_error.pass = '';
		if(selected_cid.port != ''){
			if(!show_alert){
				$ionicLoading.show({
					template: '<ion-spinner icon="ios"></ion-spinner><br><span class="aiv-loading">Opening port '+selected_cid.port+'<br>Please wait...</span>',
					animation: 'fade-in',
					showBackdrop: true,
					maxWidth: 300,
					showDelay: 0
				});
			}
			qz.serial.openPort(selected_cid.port, bounds).then(function() {
				console.log("Serial port opened");
				if(!show_alert){
					$scope.settings_error.pass = 'Connected to '+selected_cid.port;
					$ionicLoading.hide();
				}
				$scope.settings_data.callerid.connected = true;
				$scope.settingsCID = angular.copy(selected_cid);
				$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'CIDSettings',$scope.settingsCID);
			}).catch(function(err){
				console.error(err);
				$scope.settings_data.callerid.connected = false;
				$scope.settings_data.callerid.device_connected = false;
				$scope.settingsCID = angular.copy($scope.settings_data.callerid);
				$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'CIDSettings',$scope.settingsCID);
				if(show_alert){
					$scope.showCheckoutMsg('Warning',err.message);
				}else{
					$scope.settings_error.err = err.message;
					$ionicLoading.hide();
				}
			});
		}else{
			$scope.settings_error.err = 'Please select a port';
		}
	}
	
	$scope.closeSerialPort = function(selected_cid) {
		if(selected_cid.port != ''){
			$ionicLoading.show({
				template: '<ion-spinner icon="ios"></ion-spinner><br><span class="aiv-loading">Closing port '+selected_cid.port+'<br>Please wait...</span>',
				animation: 'fade-in',
				showBackdrop: true,
				maxWidth: 300,
				showDelay: 0
			});
			qz.serial.closePort(selected_cid.port).then(function() {
				$scope.settings_error.pass = selected_cid.port+' disconnected';
				$scope.settings_data.callerid.connected = false;
				$scope.settings_data.callerid.device_connected = false;
				$scope.settings_data.callerid.port = '';
				$scope.settingsCID = angular.copy(selected_cid);
				$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'CIDSettings',$scope.settingsCID);
				$ionicLoading.hide();
			}).catch(function(err){
				console.error(err);
				$scope.settings_error.err = err.message;
				$ionicLoading.hide();
			});
		}
		
		CID_length = 0;
		CID_num_length = null;
		$scope.CID_ph_num = '';
		CID_remaining = 0;
		CIDResponse = [];
    }
    $scope.addToOrder=function()

	{
		if($scope.lockCheck()==false){
			$scope.lockTrue().then(function(res){
				if(res){
					$scope.switchView('POS');
				}
			}).catch(function(error){
				console.error(error);
			});
		}
	}
	$scope.show_mode = 'TABLE'; 
	$scope.switchView = function(type){
		$scope.posview.type = type;
		loadDefaultProduct();
	}

	$scope.table_selectiom = function(table){
		trashOrder();
		$scope.clearTableData();
		$scope.selectedTable = angular.copy(table);
		
		$scope.side_button_view = true;
		if($scope.lockCheck()==false)
		{
			if(table.status == 'empty')
			{
				$scope.lockTrue().then(function(res){
					if(res){
						$scope.show_mode ='SEAT';
						$scope.show_button ='';
					}
				}).catch(function(error){
					console.error(error);
				});
				
			}else{
				if($scope.selectedTable.orders.length){
					$scope.getTable2Cart($scope.selectedTable.orders[0]);
				}
				$scope.show_button ='BUTTON';
			}
		}
	};
	 
	$scope.clearTableData = function()
	{
		$scope.selectedTable = {number:'',seats:'',shape:'',status:'',cover:'',server:'',table_loc:'',activity:[],orders:[]};
		$scope.void_items = [];
		$scope.void_input.reason = '';
	};
	
	$scope.cover_selection = function(num){
	
		$scope.selectedTable.cover = num;
		$scope.server_selection($scope.loginInfo.user_login,'TABLE');
	};
	
	var temp_server = '';
	$scope.server_selection = function(server,mode){
		$scope.show_mode = mode;
		temp_server =  server;
		$scope.selectedTable.server =server;
		//$scope.setNextStatus($scope.selectedTable,false);
		if($scope.show_mode == 'TABLE'){
			$scope.selectedTable.status = 'no_food_ordered';
			$scope.switchView('POS');
			$scope.setServe(server);
			//$scope.lockTrue();
		}
	};
	$scope.item_rediract =function(type)
	{
		if($scope.lockCheck()==false && $scope.selectedTable.status !='empty')
		{
			if(type == 'SPLITBILL' && $scope.selectedTable.orders.length){
				//Should not split if atleast one bill is paid 
				var block_split = false;
				if($scope.selectedTable.orders[0].split_unequal_value.length){
					for (var i=0;i<$scope.selectedTable.orders[0].split_unequal_value.length;i++){
						if($scope.selectedTable.orders[0].split_unequal_value[i].status == "PAID"){
							block_split = true;
							break;
						}
					}
				}else if($scope.selectedTable.orders[0].split_value){
					if($scope.selectedTable.orders[0].split_value.paid_count>0){
						block_split = true;
					}
				}else if($scope.selectedTable.orders[0].split_item.length){
					for (var i=0;i<$scope.selectedTable.orders[0].split_item.length;i++){
						if($scope.selectedTable.orders[0].split_item[i].status == "PAID"){
							block_split = true;
							break;
						}
					}
				}
				
				if(block_split){
					$scope.showCheckoutMsg('Cannot Split again','This order is already billed and a part of it is already paid');
					return;
				}
			}
			$scope.lockTrue().then(function(res){
				if(res){
					//$scope.show_mode ='SERVER_SELECTION';
					$scope.server_mode ='';
					if(type =='ADDTO')
					{
						
						$scope.server_mode ='addto';
						//$scope.server_selection($scope.loginInfo.user_login,'ADDTO');
						$scope.server_selected($scope.loginInfo.user_login);
					}
					else if(type =='VOID')
					{
						if($scope.selectedTable.status !='no_food_ordered')
						{
							$scope.server_mode = 'voidclick';
							$scope.server_selected($scope.loginInfo.user_login);
							
						}
						else
						{
							$scope.selectedTable.status ='empty';
							$scope.show_mode ='TABLE';
							$scope.side_button_view = false;
							$scope.lockFalse();

						}
					}else if($scope.selectedTable.status !='no_food_ordered'){
						if(type =='SPLITBILL')
						{
							if($scope.selectedTable.orders[0].split_unequal_value.length || $scope.selectedTable.orders[0].split_value || $scope.selectedTable.orders[0].split_item.length)
							{
								$scope.showCheckoutMsg('Warning','Bill is already Split');
								//return;
							}
							
							$scope.server_mode ='splitbill';
							$scope.server_selected($scope.loginInfo.user_login);
						}
						else if(type =='TRANSFER')
						{
							$scope.initalizeTable();
							if($scope.selectedTable.status!='billed')
							{
						
								$scope.server_mode ='transfer';
								$scope.server_selected($scope.loginInfo.user_login);
							}
							else
							{
								$scope.showCheckoutMsg('Error','Cannot transfer, this table is already billed');
								$scope.show_mode='TABLE';
								$scope.lockFalse();
							}
						}
					}
				}
			}).catch(function(error){
				console.error(error);
			});
		}
	};
	$scope.server_selected =function(server)
	{
		if($scope.server_mode =='addto')
		{
			//$scope.addToOrder();
			$scope.selectedTable.server =server;
			$scope.switchView('POS');
			
			
		}
		else if ($scope.server_mode =='splitbill')
		{
			$scope.server_selection(server,'LIST');
			$scope.splitBillClick();
		}
		else if ($scope.server_mode =='transfer')
		{
			$scope.server_selection(server,'LIST');
			$scope.transferClick();
		}
		else if($scope.server_mode == 'voidclick')
		{
			$scope.server_selection(server,'LIST');
			$scope.viodButtonClick('VOID');
		}
	};
	$scope.split ={'value':''};
	$scope.split ={'unequalvalue':''};
	$scope.splitBillAction = function(type){
		if(type == 'ITEM'){
			$scope.index_globel=0;
			$scope.item_new =$scope.cart_copy[0];
			$scope.show_mode = 'BILL_SLIPT_ITEM';
			$scope.cart_copy = angular.copy($scope.cartItems);
		}else if(type == 'VALUE'){
			$scope.split ={'value':''};
			$scope.show_mode = 'BILL_SLIPT_VALUE'; 
			$scope.setKeyInput('SPLIT_VALUE',$scope.split.value);
		}else{
			$scope.total = $scope.grand.Total;
			$scope.unequal_value_data=[];
			$scope.split ={'unequalvalue':''};
			$scope.show_mode = 'BILL_SLIPT_UNEQUVAL_VALUE'; 
			$scope.setKeyInput('SPLIT_UNEQUAL_VALUE',$scope.split.unequalvalue);
			
		}
	}

	$scope.showButtonClick =function()
	{
		$scope.show_service=[]
		$scope.show_service =angular.copy($scope.selectedTable.activity);
		for(var i=0;i<$scope.show_service.length;i++)
		{
			if($scope.show_service[i].toStatus=='empty')
			{
				$scope.show_service[i].toStatus='Table empty';
			}
			if($scope.show_service[i].toStatus=='no_food_ordered')
			{
				$scope.show_service[i].toStatus='Table Opened';
			}
			if($scope.show_service[i].toStatus=='food_ordered')
			{
				$scope.show_service[i].toStatus='Food Order Taken';
			}
			if($scope.show_service[i].toStatus=='main_released')
			{
				$scope.show_service[i].toStatus='Main Course Served';
			}
			if($scope.show_service[i].toStatus=='afters_ordered')
			{
				$scope.show_service[i].toStatus='Afters Served';
			}
			if($scope.show_service[i].toStatus=='drinks_released')
			{
				$scope.show_service[i].toStatus='Drinks Course Served';
			}
			if($scope.show_service[i].toStatus=='starter_released')
			{
				$scope.show_service[i].toStatus='Starters served';
			}
			if($scope.show_service[i].toStatus=='billed')
			{
				$scope.show_service[i].toStatus='BIll Generated';
			}
		}
		
		
		$scope.show_mode = 'SHOW_DATA';
	};
	
	$scope.setServe =function(server)
	{
		$scope.selectedTable.server = server;
		temp_server = '';
		$scope.setNextStatus($scope.selectedTable,true);
	};
	
	$scope.setNextStatus = function(table,update)
	{
		/*if(table.status == 'empty')
		{
			table.status ='no_food_ordered';	
		}
		else if(table.status =='no_food_ordered')
		{
			table.status ='food_ordered';
		}
		else  if(table.status =='food_ordered')
		{
			table.status ='main_released';
		}
		else if(table.status =='main_released')
		{
			table.status ='afters_ordered';
		}
		else if(table.status =='afters_ordered')
		{
			table.status ='billed';
		}*/
		$scope.tableActivity(table,update);
	};
	
	$scope.index_table = -1;
	$scope.showOrder = function()
	{
		if($scope.selectedTable.number!='' && $scope.selectedTable.status != 'no_food_ordered')
		{
			$scope.show_mode='LIST';
		}
	}
	
	$scope.cart_copy_2=[];
	
	$scope.transferTableByOreder= function(product,index)
	{
		$scope.table_new = product; 
		$scope.index_table = index;
		$scope.show_button_split ='VIEW';
	};
	$scope.item_1=[];
	$scope.movePartToTable =function()
	{
		if($scope.table_new == null)
		{
			$scope.index_table=0;
			$scope.table_new=$scope.cart_copy_2[0];
		}
		if($scope.cart_copy_2.length>0 && $scope.table_new!=null)
		{
			$scope.item_1.push($scope.table_new);	
			$scope.table_new=null;
			$scope.show_button_split_to ='VIEW';
		
			for(var i=0;i<$scope.cart_copy_2.length;i++)
			{
				if( i == $scope.index_table)
				{
					$scope.cart_copy_2.splice(i,1);
					$scope.index_table =i;
					$scope.table_new =$scope.cart_copy_2[i];
					break;
				}
			}
		}
		$scope.index_table_1 =0;
		$scope.table_value =$scope.item_1[0];
			
	};
	$scope.tableReverse = function(n,index)
	{
		$scope.table_value = n;
		$scope.index_table_1 = index;
	};
	
	$scope.tableReverseClick =function()
	{
		if($scope.table_value ==null)
		{
			$scope.index_table_1 =0;
			$scope.table_value =$scope.item_1[0];
			
		}
		if($scope.item_1.length>0 && $scope.table_value!=null)
		{
			$scope.cart_copy_2.push($scope.table_value);
			$scope.table_value=null;
		
			for(var i=0;i<$scope.item_1.length;i++)
			{
				if(i==$scope.index_table_1)
				{
					$scope.item_1.splice(i,1);
					$scope.index_table_1 = i;
					$scope.table_value = $scope.item_1[i];
				}
			}
		}
	};
	
	$scope.transferTbaleClickSelect =function()
	{
		$scope.side_button_view = false;
		$scope.show_mode ='TABLE';
	}
	$scope.lockTrue =function()
	{
		var deferred = $q.defer();
		if(!$scope.selectedTable.lock){
			$scope.updateTablePool(true).then(function(res){
				deferred.resolve(res);
			}).catch(function(error){
				console.error(error);
				deferred.reject(error);
			});
			
			console.log("lock true");
		}else{
			deferred.resolve(false);
		}
		return deferred.promise;
	};
	$scope.lockFalse =function()
	{
		var deferred = $q.defer();
		if($scope.selectedTable.lock){
			$scope.updateTablePool(true).then(function(res){
				deferred.resolve(res);
			}).catch(function(error){
				console.error(error);
				deferred.reject(error);
			});
			console.log("lock false");
		}else{
			deferred.resolve(false);
		}
		
		return deferred.promise;
	};
	$scope.lockCheck = function()
	{	
		if($scope.selectedTable.lock){
			$scope.showConfirmReturn();
		}
		return $scope.selectedTable.lock;
	};
	$scope.showConfirmReturn = function() {
	   var confirmPopup = $ionicPopup.confirm({
		 title: 'Locked',
		 template: 'This table is already in use by '+ $scope.selectedTable.server,
		 scope: $scope,
			buttons: [
			  
			  {
				text: '<b>Unlock</b>',
				type: 'button-positive',
				onTap: function(e) {
					return true;
				}
			  },
			  { text: 'Ok' ,
			  type: 'button-assertive'
			  }
			]
	   });

	   confirmPopup.then(function(res) {
		 if(res) {
		   $scope.lockFalse();
		 } 
	   });
	};
	
	$scope.tableActivity = function(table,update)
	{
		var preivous ='';
		 $scope.date = new Date();
		if(table.status=='no_food_ordered')
		{
			preivous = 'empty';
		}
		else if(table.status=='food_ordered')
		{
			preivous ='no_food_ordered';
		}
		else if(table.status=='starter_released')
		{
			preivous = 'food_ordered';
		}
		else if(table.status=='main_released')
		{
			preivous = 'starter_released';
		}
		else if(table.status=='afters_ordered')
		{
			preivous = 'main_released';
		}
		else if(table.status=='billed')
		{
			preivous = 'afters_ordered';
		}
		
		table.activity.push({
			serverName : $scope.loginInfo.user_login,
			fromStatus : preivous,
			toStatus : table.status,
			date :$scope.date
		})
		
		if(update){
			$scope.updateTablePool();
		}
	};
	
	$scope.releaseButton =function()
	{
		if($scope.lockCheck() == false && $scope.selectedTable.status !='empty') 
		{
			if($scope.selectedTable.number!='')
			{
				if($scope.selectedTable.status !='no_food_ordered')  //restrict release only after food order and before billed//
				{
					$scope.lockTrue().then(function(res){
						if(res){
							$scope.show_mode ='RELEASE';
						}
					}).catch(function(error){
						console.error(error);
					});
					
				}		
			}
		}
	};
	
	$scope.relaseButtonServerStarter =function()
	{
		//$scope.show_mode = 'RELEASE_SERVER_MAIN';
		$scope.starter_relase =false;
		for(var i=0;i<$scope.selectedTable.activity.length;i++)
		{
			if($scope.selectedTable.activity[i].toStatus =='starter_released')
			{
				$scope.starter_relase=true;
				$scope.server_name = $scope.selectedTable.activity[i].serverName;
			}
		}
		$scope.server_selection($scope.loginInfo.user_login,'RELEASE_SERVER_STARTER_NEXT');
	};
	$scope.relaseButtonServerDrinks =function()
	{
		//$scope.show_mode = 'RELEASE_SERVER_MAIN';
		$scope.drinks_relase =false;
		for(var i=0;i<$scope.selectedTable.activity.length;i++)
		{
			if($scope.selectedTable.activity[i].toStatus =='drinks_released')
			{
				$scope.drinks_relase=true;
				$scope.server_name = $scope.selectedTable.activity[i].serverName;
			}
		}
		$scope.server_selection($scope.loginInfo.user_login,'RELEASE_SERVER_DRINKS_NEXT');
	};
	
	$scope.relaseButtonServerMain =function()
	{
		//$scope.show_mode = 'RELEASE_SERVER_MAIN';
		$scope.main_relase =false;
		for(var i=0;i<$scope.selectedTable.activity.length;i++)
		{
			if($scope.selectedTable.activity[i].toStatus =='main_released')
			{
				$scope.main_relase=true;
				$scope.server_name = $scope.selectedTable.activity[i].serverName;
			}
		}
		$scope.server_selection($scope.loginInfo.user_login,'RELEASE_SERVER_MAIN_NEXT');
	};
	
	$scope.relaseButtonServerAfter =function()
	{
		//$scope.show_mode = 'RELEASE_SERVER_AFTER';
		//$scope.selectedTable.server = server;
		$scope.after_relase =false;
		for(var i=0;i<$scope.selectedTable.activity.length;i++)
		{
			if($scope.selectedTable.activity[i].toStatus =='afters_ordered')
			{
				$scope.main_after=true;
				$scope.server_name_1 = $scope.selectedTable.activity[i].serverName;
			}
		}
		$scope.server_selection($scope.loginInfo.user_login,'RELEASE_SERVER_AFTER_NEXT');
	};

	$scope.cancelTable =function()
	{
		show_mode ='TABLE';
	};
	$scope.onClickDrinksYes =function()
	{
		//Update status and print
		$scope.side_button_view = false;
		$scope.selectedTable.status = 'drinks_released';
		$scope.selectedTable.lock = false;
		$scope.setServe(temp_server);
		$scope.show_mode = 'TABLE';
		//$scope.lockFalse();
	};
	$scope.onClickStarterYes =function()
	{
		//Update status and print
		$scope.side_button_view = false;
		$scope.selectedTable.status = 'starter_released';
		$scope.selectedTable.lock = false;
		$scope.setServe(temp_server);
		$scope.show_mode = 'TABLE';
		//$scope.lockFalse();
	};
	$scope.onClickMainYes =function()
	{
		//Update status and print
		$scope.side_button_view = false;
		$scope.selectedTable.status = 'main_released';
		$scope.selectedTable.lock = false;
		$scope.setServe(temp_server);
		$scope.show_mode = 'TABLE';
		//$scope.lockFalse();
	};
	
	$scope.onClickAfterYes =function()
	{
		//Update status and print
		$scope.side_button_view = false;
		$scope.selectedTable.status = 'afters_ordered';
		$scope.selectedTable.lock = false;
		$scope.setServe(temp_server);
		$scope.show_mode = 'TABLE';
		//$scope.lockFalse();
	};
	
	$scope.transferClick =function()
	{
		//if($scope.lockCheck() ==false)
		//{
			if($scope.selectedTable.number!='')
			{
				if($scope.selectedTable.status !='no_food_ordered')
				{
					$scope.show_mode ='TABLE_TRANSER_MODE';
					$scope.data = $scope.selectedTable;
					//$scope.lockTrue();
				}
			}
		//}
		
	};
	$scope.transfer_type = '';
	//Process order transfer clicks - Full/Selected/SelectedNext
	$scope.tansferModeClick = function(type,transfer_type)
	{
		if(type == 'TABLE_TANSFER'){
			if($scope.transfer_type == 'PART_TRANSFER' && !$scope.item_1.length)return;
			$scope.show_button ='SELECT_TRANSFER';
		}else if(type == 'TRRANSFER_SELECTED'){
			$scope.index_table=0;
			$scope.table_new=$scope.cart_copy_2[0];
			$scope.cart_copy_2 = angular.copy($scope.cartItems);
			$scope.item_1=[];
		}
		$scope.transfer_type = transfer_type;
		$scope.show_mode = type;
	};
	
	var resetTable = function(table){
		table.status = "empty";
		table.cover = "";
		table.server = "";
		table.activity = [];
		table.orders = [];
		table.lock=false;
	}

	//Action on selecting destination table on order transfer
	$scope.transferTbaleClick = function(table)
	{
		if(table.status =='empty' || table.status =='no_food_ordered' )
		{
			if($scope.transfer_type == 'PART_TRANSFER' && $scope.cart_copy_2.length){
				if ($scope.selectedTable.orders.length>0){
					table.orders = [];
					var order = recreate_order($scope.item_1,'pending');
					order.split_item = [];
					order.split_value = '';
					order.split_unequal_value =[];
					order.void_items = [];
					table.orders.push(order);
					table.status = $scope.selectedTable.status;
					table.cover = $scope.selectedTable.cover;
					table.server = $scope.selectedTable.server;
					table.activity =$scope.selectedTable.activity;
					table.lock = false;
					
					//$scope.selectedTable.lock = false;
					order = recreate_order($scope.cart_copy_2,'pending');
					$scope.selectedTable.orders=[];
					order.split_item = [];
					order.split_value = '';
					order.split_unequal_value =[];
					$scope.selectedTable.orders.push(order);
				}
			}else{
				$scope.transfer_type = 'FULL_TRANSFER';
				table.status = $scope.selectedTable.status;
				table.cover = $scope.selectedTable.cover;
				table.server = $scope.selectedTable.server;
				table.activity = $scope.selectedTable.activity;
				table.orders = $scope.selectedTable.orders;
				table.lock=false;
				
				//resetTable($scope.selectedTable);
			}
			
			$scope.transferTableOrder($scope.selectedTable,table);
		}
		else
		{
			//$scope.showCheckoutMsg('Warning','Table is not empty, please select an empty table to transfer');
			if($scope.transfer_type == 'PART_TRANSFER' && $scope.cart_copy_2.length){
				if($scope.cart_copy_2.length){
					var item =[];
					if ($scope.selectedTable.orders.length>0){
						if(table.orders.length){
							$scope.getLineItem(table.orders[0]);
						}
						for(var i=0;i<$scope.item_1.length;i++)
						{
							$scope.cartItemdata.push($scope.item_1[i]);
						}
						table.orders=[];
						var order = recreate_order($scope.cartItemdata,'pending');
						order.split_item = [];
						order.split_value = '';
						order.split_unequal_value =[];
						order.void_items = [];
						table.orders.push(order)
						table.lock = false;
						
						//$scope.selectedTable.lock = false;
						order = recreate_order($scope.cart_copy_2,'pending');
						$scope.selectedTable.orders=[];
						order.split_item = [];
						order.split_value = '';
						order.split_unequal_value =[];
						$scope.selectedTable.orders.push(order);
					}
				}
			}else{
				//$scope.transfer_type = 'FULL_TRANSFER';
				var table_order=[];
				var selected_table_order=[];
				table_order =$scope.getLineItem(table.orders[0]);
				selected_table_order=$scope.getLineItem( $scope.selectedTable.orders[0]);
				for(var i=0;i<selected_table_order.length;i++){
					table_order.push(selected_table_order[i]);
				}
				var order = recreate_order(table_order,'pending');
				order.split_item = [];
				order.split_value = '';
				order.split_unequal_value =[];
				order.void_items = [];
				table.orders=[];
				table.orders.push(order)
				table.lock=false;
			}
			$scope.transferTableOrder($scope.selectedTable,table);
		}
	};
	
	$scope.getLineItem=function(order)
	{
		$scope.cartItemdata=[];
		for(var i=0;i<order.data.line_items.length;i++){
			var unit_price = parseFloat(order.data.line_items[i].subtotal)/parseInt(order.data.line_items[i].quantity);
			
			var products = [];
			for (var category in $scope.allProducts) {
				var cat_exists = $filter('filter')($scope.categories,{slug:category},true);
				if(cat_exists.length && !cat_exists[0].children.length && $scope.allProducts.hasOwnProperty(category)){
					var products = $filter('filter')($scope.allProducts[category],{'id': order.data.line_items[i].product_id},true);
					if(products.length){
						break;
					}
				}
			}
				
			var product = {
				"id":order.data.line_items[i].product_id,
				"sku": order.data.line_items[i].sku,
				"price": unit_price.toFixed(2),
				"total":order.data.line_items[i].subtotal,
				"quantity":order.data.line_items[i].quantity,
				"featured_src": "",
				"title": angular.isDefined(order.data.line_items[i].name)?order.data.line_items[i].name:order.data.line_items[i].title,
				"categories": angular.isDefined(order.data.line_items[i].categories)?order.data.line_items[i].categories:[],
				"attributes":[],
				"dash":angular.isDefined(order.data.line_items[i].dash)?order.data.line_items[i].dash:false,
				"meta":{}
			};
			if(products.length){
				product.meta = angular.copy(products[0].meta);
			}
					
			if(angular.isDefined(order.data.line_items[i].variations)){
				product.sel_variations = {'attributes':order.data.line_items[i].variations,'price':unit_price.toFixed(2)};
				product.type = "variable";
			}else{
				product.type = "simple";
			}
			
			if(product.type=="variable"&&product.sel_variations.hasOwnProperty("attributes"))
				product.sel_variations["attributestoshow"] = $scope.processDisplay(product.sel_variations.attributes);

			$scope.cartItemdata.push(product);
		}
		return $scope.cartItemdata;
	};
	
	$scope.backFromPayment = function(){
		if($scope.startup.action == "TABLEVIEW"){
			$scope.tableMode();
		}
		$scope.closeModal('PAYMENT');
	}
	
	$scope.backToTableView = function(){
		$scope.side_button_view = false;
		$scope.switchView('TABLE');
		$scope.show_mode='TABLE';
		$scope.lockFalse();
	}
	
	$scope.side_button_view = false;
	$scope.tableMode =function(type)
	{
		$scope.side_button_view = false;
		$scope.show_mode = 'TABLE';
		$scope.show_button ='BUTTON';
		temp_server = '';
		$scope.void_input = {'reason':''};
		$scope.void_items = [];
		$scope.void_condtions.selected = '';
		$scope.lockFalse();
		if(type =='SPLIT_ITEM')
		{
			$scope.selectedTable.orders[0].split_item =[];
			$scope.item =[];
			$scope.cancelSplitBill();
		}
		if(type =='SPLIT_UNEQUAL')
		{
			//$scope.selectedTable.orders[0].split_unequal_value ='';
		}
	};
	
	$scope.void_input = {'reason':''};
	$scope.viodButtonClick =function(mode)
	{
		$scope.type='';
		$scope.void_input.reason = '';
		if(mode == 'VOID')
		{
			$scope.show_mode ='VOID';
		}
		else if(mode == 'TABLE')
		{
			$scope.show_mode ='TABLE_VOID';
			$scope.type = 'TABLE';
			$scope.setKeyInput('VOID_REASON',$scope.void_input.reason);
		}
		else if(mode == 'ITEM')
		{
			$scope.show_mode ='TABLE_VOID';
			$scope.type = 'ITEM';
			$scope.setKeyInput('VOID_REASON',$scope.void_input.reason);
		}
		
	};
	
	$scope.cart_void = [];
	$scope.void_items = [];
	$scope.voidNext =function()
	{
		$scope.side_button_view = false;
		$scope.selectedTable.orders[0].data.order_meta.void_reason = $scope.void_input.reason;
		if($scope.type =='TABLE')
		{
			$scope.void_items = angular.copy($scope.cartItems);
			$scope.selectedTable.orders[0].void_items = $scope.void_items;
			$scope.selectedTable.orders[0].data.status = "cancelled";
			doMutexOperation(print_mutex,{'type':'PRINT','order':$scope.selectedTable.orders[0].data,'cart':[],'void_items':$scope.cartItems});
			$scope.voidClick('TABLE');
			//$scope.showCheckoutMsg('Message','Selected Table is Cleared');
			$scope.show_mode ='TABLE';
		}
		else if($scope.type =='ITEM')
		{
			$scope.void_items = [];
			$scope.show_mode='ITEM_VOID';
			$scope.cart_void = angular.copy($scope.cartItems);
		}
	};
	
	$scope.voidProduct = function(deleteMe){
		if($scope.cart_void.length <= 1) {
			$scope.showCheckoutMsg('Warning','Cannot void all items. Please void table');
			return;
		}
		$scope.void_items.push($scope.cart_void[deleteMe]);
		$scope.cart_void.splice(deleteMe, 1);

        /*if ($scope.cartItems.length) {
            for (var i = 0; i < $scope.cartItems.length; i++) {
                $scope.getTotal($scope.cartItems[i],i);
            };
			$scope.getDiscount();
			$scope.calculate_cart_tax();
			$scope.setSelectedItem($scope.cartItems.length-1,$scope.cartItems[$scope.cartItems.length-1]);
        } else {
            $scope.grand.Total = 0;
			$scope.grand.Discount = 0;
			$scope.grand.Quantity = 0;
			$scope.grand.Tax = 0;
			$scope.grand.Weight = 0;
			$scope.grand.Total_tax_percent = 0;
            $localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'cart', $scope.cartItems);
            $localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'grand', $scope.grand);
			$scope.setSelectedItem(null,null);
        }
		$scope.product_show = true;*/
	}
	
	$scope.finishVoid =function()
	{
		$scope.selectedTable.lock =false;
		$scope.selectedTable.orders=[];
		var order = recreate_order($scope.cart_void,'pending');
		order.split_item = [];
		order.split_value = '';
		order.split_unequal_value =[];
		$scope.selectedTable.orders.push(order);
		$scope.selectedTable.orders[0].void_items = angular.copy($scope.void_items);
		doMutexOperation(print_mutex,{'type':'PRINT','order':$scope.selectedTable.orders[0].data,'cart':[],'void_items':$scope.selectedTable.orders[0].void_items});
		$scope.voidClick('ITEM');
		//$scope.showCheckoutMsg('Message','Selected orders are removed');
		$scope.show_mode ='TABLE';
	};
	
	$scope.void_condtions = {
		values:['Customer Cancelled','Mistake','Other'],
		selected:''
	};
	$scope.updateVoidReason = function(){
		$scope.void_input.reason = $scope.void_condtions.selected!='Other'?$scope.void_condtions.selected:'';
		$scope.errors.void_reason = '';
	}
	
	$scope.voidClick =function(type)
	{
		var postData = {};
		postData.type = "UPDATE";
		postData.table = angular.copy($scope.selectedTable);
		if(type == 'TABLE'){
			//Remove order from table and set empty status
			$ionicLoading.show({
				template: '<ion-spinner icon="ios"></ion-spinner><br><span>Clearing table<br>Please wait...</span>',
				animation: 'fade-in',
				showBackdrop: true,
				maxWidth: 300,
				showDelay: 0
			});
			postData.table.status = "empty";
			postData.table.cover = "";
			postData.table.server = "";
			postData.table.activity = [];
			postData.table.orders = [];
			postData.table.lock = false;
		}else{
			$ionicLoading.show({
				template: '<ion-spinner icon="ios"></ion-spinner><br><span>Processing void<br>Please wait...</span>',
				animation: 'fade-in',
				showBackdrop: true,
				maxWidth: 300,
				showDelay: 0
			});
		}

		//Updating table pool
		$scope.httpRequest = dataService.updateDoc($scope.couchDBUrl+"/_design/updategetTables/_update/tables/getTables", postData);
		$scope.httpRequest.then(function(returnData) {
			console.log(returnData);
			$ionicLoading.hide();
			if(returnData.Success){
				if(type == 'TABLE'){
					$scope.complete('cancelled');
					$scope.clearTableData();
					$scope.show_button ='NONE';
				}
			}else{
				if(returnData.Message){
					$scope.showCheckoutMsg('Error',returnData.Message);
				}
			}
		}).catch(function(err){
			var msg = '';
			if(!err){
				$scope.showCheckoutMsg('Error',"No connection!!!");
			}else if(angular.isDefined(err.error)){
				if(err.error == "timeout"){
					$scope.showCheckoutMsg('Error',"Failed to void due to slow internet connection");
				}else{
					$scope.showCheckoutMsg('Error',"Failed to void.Request aborted!!!");
				}
			}else{
				$scope.showCheckoutMsg('Error',"Failed to void");
			}
			console.error(err);

			$ionicLoading.hide();
		})
		
	};
	
	$scope.splitBillClick = function()
	{
		//if($scope.lockCheck()==false)
		//{
			if($scope.selectedTable.number!='')
			{
				if($scope.selectedTable.status !='no_food_ordered' )
				{
					$scope.show_mode ='SLPIT_BILL_CLICK';
					//$scope.lockTrue();
					
				}
			}
		//}
				
	};
	$scope.cart_copy =[];
	$scope.spiltBillConform =function()
	{
		$scope.show_mode ='BILL_SPLIT_CONFORM';
	
	};
	
	$scope.index_globel = null;
	$scope.item =[];
	$scope.splitBillByValue= function(product,index)
	{
		$scope.item_new = product; 
		$scope.index_globel = index;
		$scope.show_button_split ='VIEW';
	};
	
	$scope.movePartToBill =function()
	{
		if($scope.item_new == null)
		{
			$scope.index_globel=0;
			$scope.item_new =$scope.cart_copy[0];
		}
		if($scope.cart_copy.length>0 && $scope.item_new!=null)
		{	
			$scope.item.push($scope.item_new);	
			$scope.item_new=null;
			$scope.show_button_split_to ='VIEW';
		
			for(var i=0;i<$scope.cart_copy.length;i++)
			{ 
				if( i == $scope.index_globel)
				{
					$scope.cart_copy.splice(i,1);
					$scope.index_globel =i;
					$scope.item_new =$scope.cart_copy[i];
					break;
				}
			}
		}
			$scope.index_value =0;
			$scope.n_value =$scope.item[0];
		
	};
	$scope.splitBillReverse = function(n,index)
	{
		$scope.n_value = n;
		$scope.index_value = index;
	};
	
	$scope.splitbillReverseClick =function()
	{
		if($scope.n_value == null)
		{
			$scope.index_value =0;
			$scope.n_value =$scope.item[0];
			
		}
		
		if($scope.item.length>0 && $scope.n_value!=null)
		{
			$scope.cart_copy.push($scope.n_value);
			$scope.n_value=null;
		
		for(var i=0;i<$scope.item.length;i++)
		{
			if(i==$scope.index_value)
			{
				$scope.item.splice(i,1);
				$scope.index_value = i;
				$scope.n_value = $scope.item[i];
			}
		}
		}
	};
	
	$scope.printBillClick = function(mode)
	{
		if($scope.selectedTable.number!='' && $scope.selectedTable.status != 'no_food_ordered')
		{
			$scope.print_val=[];
			var no_split = true;
			if(!$scope.selectedTable.orders[0].split_unequal_value.length)
			{
				if($scope.selectedTable.orders[0].split_value =='')
				{
					if($scope.selectedTable.orders[0].split_item.length>0)
					{
						//Split item bill
						$scope.print_val.push($scope.selectedTable.orders[0].split_item); 
						no_split = false;
					}
					else
					{
						//Main bill
						$scope.print_val[0] =[];
						$scope.print_val[0].push({"cart":$scope.cartItems,"total":$scope.grand.Total})
					}
				}
				else
				{
					//Split value bill
					var size =$scope.selectedTable.orders[0].split_value.count;
					var count =$scope.selectedTable.orders[0].split_value.paid_count;
					var total_splt = $scope.grand.Total/size;
					$scope.print_val[0] =[];
	
					no_split = false;
					for(var i=0;i<size-count;i++)
					{
						$scope.print_val[0].push({"cart":$scope.cartItems,"total":total_splt,"status":"UNPAID"})
					}
					for(var j=0;j<count;j++)
					{
						$scope.print_val[0].push({"cart":$scope.cartItems,"total":total_splt,"status":"PAID"})
					}
				}
			}else{
				$scope.print_val[0] =[];
				var table =$scope.selectedTable.orders[0].split_unequal_value;
				no_split = false;
				for(var i=0;i<table.length;i++)
				{
					$scope.print_val[0].push({"cart":$scope.cartItems,"total":table[i].total,"status":table[i].status})
				}
				
			}
			if(mode=='PRINT')
			{
				if(no_split){
					doMutexOperation(print_mutex,{'type':'PRINT','order':$scope.selectedTable.orders[0].data,'cart':[]});
					$scope.selectedTable.status='billed';
					$scope.setNextStatus($scope.selectedTable,true);
					//$scope.updateTablePool();
				}
				$scope.show_mode ='PRINT_BILL';
			}
			else if(mode=='PAYOFF')
			{
				if($scope.lockCheck() == false && $scope.selectedTable.status == 'billed'){
					$scope.lockTrue().then(function(res){
						if(res){
							if(no_split){
								$scope.openPaymentModal();
							}else{
								$scope.show_mode ='PAYOFF';
							}
						}
					}).catch(function(error){
						console.error(error);
					});
				}else if($scope.selectedTable.status != 'billed'){
					$scope.showCheckoutMsg('Warning','Please print your bill and then continue');
				}
			}
			else if(mode=='PAYOFFTEST')
			{
				$scope.show_mode ='PAYOFF';
			}

	 }
		
	};

	$scope.index_get = -1;
	$scope.billClick = function(type,item,index)
	{
		if(type == 'PAYOFF'){
			if(item.status !='PAID'){
				$scope.index_get = index;
				var order = recreate_order($scope.print_val[0][index].cart,'pending');
				order.data.order_meta.split_unequal_value = $scope.print_val[0][index].total;
				$scope.selectedTable.orders[0].data.order_meta.split_unequal_value = $scope.print_val[0][index].total;
				$scope.openPaymentModal();
			}
		}else if(type == 'PRINT'){
			$scope.index_get = index;
			var order = recreate_order($scope.print_val[0][index].cart,'pending');
			order.data.order_meta.split_unequal_value = $scope.print_val[0][index].total;
			$scope.selectedTable.orders[0].data.order_meta.split_unequal_value = $scope.print_val[0][index].total;
			doMutexOperation(print_mutex,{'type':'PRINT','order':$scope.selectedTable.orders[0].data,'cart':[]});
		}
	};

	$scope.finishButtonClick =function(mode)
	{
		$scope.side_button_view = false;
		if(mode == 'BILL_SLIPT_VALUE'){
			$scope.selectedTable.status = 'billed';
			$scope.selectedTable.lock =false;
			$scope.setNextStatus($scope.selectedTable,false);
			$scope.makeOrderSplitBill('VALUE');
		
		}else if(mode == 'BILL_SLIPT_UNEQUVAL_VALUE'){
			if($scope.total != 0)
			{
				$scope.unequal_value_data.push({"total":parseFloat($scope.total.toFixed(2)),"status":"UNPAID"})
				var order = angular.copy($scope.selectedTable.orders[0].data);
				order.order_meta.split_unequal_value = $scope.total;
				doMutexOperation(print_mutex,{'type':'PRINT','order':order,'cart':[]});
			}
			$scope.selectedTable.status = 'billed';
			$scope.selectedTable.lock =false;
			$scope.setNextStatus($scope.selectedTable,false);
			$scope.makeOrderSplitBill('UNEQUAL');
			$scope.show_mode ='TABLE';
			
	    }else{
			if(!$scope.cart_copy.length && !$scope.item.length)
			{
				$scope.selectedTable.status = 'billed';
				$scope.selectedTable.lock =false;
				$scope.setNextStatus($scope.selectedTable,true);
				$scope.show_mode ='TABLE';
				//$scope.lockFalse();
			}else{
				$ionicLoading.show({
					template : 'Please print all bills',
					duration : 1300
				});
			}
		}
	};
	$scope.finishUnequalClick =function()
	{
		$scope.side_button_view = false;
		if(!$scope.split.unequalvalue)
			return;
		if($scope.split.unequalvalue<=$scope.total)
		{
			var newtotal = $scope.total.toFixed(2);
			$scope.unequal_value_data.push({"total":parseFloat($scope.split.unequalvalue),"status":"UNPAID"})
			$scope.total =parseFloat(newtotal) - parseFloat($scope.split.unequalvalue);
			var order = angular.copy($scope.selectedTable.orders[0].data);
			order.order_meta.split_unequal_value = $scope.split.unequalvalue;
			doMutexOperation(print_mutex,{'type':'PRINT','order':order,'cart':[]});
			//$scope.total =$filter('number')($scope.total,2);
			$scope.show_button ='SHOW_UNEQUAL_BILL';
			$scope.split.unequalvalue ='';
		}
		else{
			$scope.showCheckoutMsg('Warning','Please enter a value less than '+$scope.total.toFixed(2));
		}
		
	};
		
	$scope.cancelSplitBill = function(){
		$ionicLoading.show({
			template: '<ion-spinner icon="ios"></ion-spinner><br><span>Cancelling<br>Please wait...</span>',
			animation: 'fade-in',
			showBackdrop: true,
			maxWidth: 300,
			showDelay: 0
		});
		$scope.side_button_view = false;
		$scope.selectedTable.orders[0].split_item = [];
		
		var postData = {};
		postData.type = "UPDATE";
		postData.table = angular.copy($scope.selectedTable);
		postData.table.lock = false;
		
		//Updating table pool
		$scope.httpRequest = dataService.updateDoc($scope.couchDBUrl+"/_design/updategetTables/_update/tables/getTables", postData);
		$scope.httpRequest.then(function(returnData) {
			console.log(returnData);
			$ionicLoading.hide();
			if(returnData.Success){
				$scope.item = [];
				$scope.cart_copy = angular.copy($scope.cartItems);
				$ionicLoading.show({
					template : '<h2>Order split cancelled...</h2>',
					duration : 1000
				});
			}else{
				if(returnData.Message){
					$scope.showCheckoutMsg('Error',returnData.Message);
				}
			}
			$scope.tableMode();
		}).catch(function(err){
			var msg = '';
			if(!err){
				$scope.showCheckoutMsg('Error',"No connection!!!");
			}else if(angular.isDefined(err.error)){
				if(err.error == "timeout"){
					$scope.showCheckoutMsg('Error',"Failed to cancel due to slow internet connection");
				}else{
					$scope.showCheckoutMsg('Error',"Failed to cancel.Request aborted!!!");
				}
			}else{
				$scope.showCheckoutMsg('Error',"Failed to cancel");
			}
			console.error(err);
			$scope.tableMode();
			$ionicLoading.hide();
		})

	}
	
	var recreate_order = function(new_cart,status){
		var cart_org = angular.copy($scope.cartItems);
		$scope.cartItems = angular.copy(new_cart);
		$scope.calculateTotal($scope.cartItems[0],0);
		var order = createOrder(status);
		$scope.cartItems = angular.copy(cart_org);
		return order;
	}
	
	$scope.makeOrderSplitBill = function(type){
		$ionicLoading.show({
			template: '<ion-spinner icon="ios"></ion-spinner><br><span>Saving bill<br>Please wait...</span>',
			animation: 'fade-in',
			showBackdrop: true,
			maxWidth: 300,
			showDelay: 0
		});
		
		if(type == 'VALUE'){
			var order = angular.copy($scope.selectedTable.orders[0].data);
			order.order_meta.split_count = $scope.split.value;
			doMutexOperation(print_mutex,{'type':'PRINT','order':order,'cart':[]});
			$scope.selectedTable.orders[0].split_unequal_value=[];
			$scope.selectedTable.orders[0].split_item=[];
			$scope.selectedTable.orders[0].split_value = {"count":$scope.split.value,"paid_count":0};
		}else if(type == 'PART'){
			if($scope.item.length)
			{
				var order = recreate_order($scope.item,'pending');
				doMutexOperation(print_mutex,{'type':'PRINT','order':order.data,'cart':[]});
				
				var total = 0;
				for(var i=0;i<$scope.item.length;i++)
				{
					if(angular.isDefined($scope.item[i].sel_variations))
					{
						total+=$scope.item[i].sel_variations.price*$scope.item[i].quantity;
					}
					else
					{
						total+=get_product_price($scope.item[i],true)*$scope.item[i].quantity;
					} 
				}
				$scope.selectedTable.orders[0].split_value ='';
				$scope.selectedTable.orders[0].split_unequal_value=[];
				$scope.selectedTable.orders[0].split_item.push({"cart":$scope.item,"total":total,"status":"UNPAID"});
				$scope.show_button ='SHOW_BILL';
			}
			else
			{
				$ionicLoading.hide();
				return;
			}
		}else if(type=='UNEQUAL'){
			var order = angular.copy($scope.selectedTable.orders[0].data);
			//order.order_meta.split_count = $scope.split.value;
			//doMutexOperation(print_mutex,{'type':'PRINT','order':order});
			$scope.selectedTable.orders[0].split_value ='';
			$scope.selectedTable.orders[0].split_item=[];
			$scope.selectedTable.orders[0].split_unequal_value = $scope.unequal_value_data;
			//$scope.show_button ='SHOW_UNEQUAL_BILL';
			//$scope.show_mode ='TABLE';
		}else{
			if($scope.cart_copy.length)
			{
			
				var order = recreate_order($scope.cart_copy,'pending');
				doMutexOperation(print_mutex,{'type':'PRINT','order':order.data,'cart':[]});
				
				var total_cart =0;
				for(var j=0;j<$scope.cart_copy.length;j++)
				{
					if(angular.isDefined($scope.cart_copy[j].sel_variations))
					{
						total_cart+=$scope.cart_copy[j].sel_variations.price*$scope.cart_copy[j].quantity;
					}
					else
					{
						total_cart+=get_product_price($scope.cart_copy[j],true)*$scope.cart_copy[j].quantity;
					} 
				}
				$scope.selectedTable.orders[0].split_item.push({"cart":$scope.cart_copy,"total":total_cart,"status":"UNPAID"});
				
				$scope.show_button ='SHOW_BILL';
			}
			else
			{
				$ionicLoading.hide();
				return;
			}
		}
		
		var postData = {};
		postData.type = "UPDATE";
		postData.table = angular.copy($scope.selectedTable);
		postData.table.lock = false;
		
		//Updating table order
		$scope.httpRequest = dataService.updateDoc($scope.couchDBUrl+"/_design/updategetTables/_update/tables/getTables", postData);
		$scope.httpRequest.then(function(returnData) {
			console.log(returnData);
			$ionicLoading.hide();
			if(returnData.Success){
				if(type == 'VALUE'){
					$scope.tableMode();
				}else if(type == 'PART'){
					$scope.item = [];
				}else if(type == 'REST'){
					$scope.cart_copy = [];
				}
				$ionicLoading.show({
					template : '<h2>Order splitted...</h2>',
					duration : 1000
				});
			}else{
				if(returnData.Message){
					$scope.showCheckoutMsg('Error',returnData.Message);
				}
				$scope.tableMode();
			}
			
		}).catch(function(err){
			var msg = '';
			if(!err){
				$scope.showCheckoutMsg('Error',"No connection!!!");
			}else if(angular.isDefined(err.error)){
				if(err.error == "timeout"){
					$scope.showCheckoutMsg('Error',"Failed to split bill due to slow internet connection");
				}else{
					$scope.showCheckoutMsg('Error',"Failed to split bill.Request aborted!!!");
				}
			}else{
				$scope.showCheckoutMsg('Error',"Failed to split bill");
			}
			console.error(err);
			$scope.tableMode();
			$ionicLoading.hide();
		})
	};

	$scope.show_login_screen = function(manual){
		trashOrder();
		if($scope.enableLoginScreen.show || manual){
			$scope.startup.action = null;
			$rootScope.edit_mode = false;
			
			if($scope.user_modal == undefined || !$scope.user_modal._isShown){
				if($scope.aiv_users.users.length){
					//Users already loaded
					$scope.aiv_users.err = '';
					$scope.aiv_users.login_close = false;
					$scope.setKeyInput('LOGIN_PASS',$scope.qwerty_inputs.pass);
					$ionicModal.fromTemplateUrl('user-modal.html', {
						id:'POS_USERS',
						scope: $scope,
						backdropClickToClose: false,
						animation: 'none'
					}).then(function(modal) {
						modal.el.className = modal.el.className + " top-modal";
						$scope.user_modal = modal;
						$scope.openModal('POS_USERS');
					});
				}
			}
			
			loadDefaultProduct();
		}
	}
	
	var loadDefaultProduct = function(){
		var slug = '';
		for(var i=0;i<$scope.categories.length;i++){
			var item = $scope.categories[i];
			if(!item.parent && item.serve_type!='online'){
				if((angular.isDefined($scope.selected_shipping.id)&&$scope.selected_shipping.id=='sitin'&&item.serve_type=='sitin')
					||((angular.isUndefined($scope.selected_shipping.id)||(angular.isDefined($scope.selected_shipping.id)&&$scope.selected_shipping.id!='sitin'))&&item.serve_type!='sitin')){
				if(($scope.startup.action!='TABLEVIEW'&&item.serve_type!='sitin')||($scope.startup.action=='TABLEVIEW'&&item.serve_type!='takeaway')){				
					if(item.children.length){
						for(var c=0;c<item.children.length;c++){
							var child = item.children[c];
							if((angular.isDefined($scope.selected_shipping.id)&&$scope.selected_shipping.id=='sitin'&&item.serve_type=='sitin')
								||((angular.isUndefined($scope.selected_shipping.id)||(angular.isDefined($scope.selected_shipping.id)&&$scope.selected_shipping.id!='sitin'))&&item.serve_type!='sitin')){
								$scope.sub_categories.items = item.children;
								$scope.sub_categories.selected = child.slug;
								$scope.sub_categories.show_as_product = angular.isDefined(item.show_as_product)?item.show_as_product:false
								slug = $scope.sub_categories.selected;
								$scope.sub_categories.subcategory_mode = true;
								break;
							}
						}
					}else{
						$scope.sub_categories.items = [];
						$scope.sub_categories.selected = '';
						$scope.sub_categories.show_as_product = false;
						$scope.sub_categories.subcategory_mode = false;
						slug = item.slug;
					}
					$scope.sel_category = item.slug;
				}
				if(slug)break;
				}
			}
		}
		
		if(slug){
			$scope.products = filter_products($scope.startup.action,$scope.allProducts[slug]);
			$scope.processProducts();
		}
	}
	
	$scope.aiv_logout = function(){
		$scope.aiv_users.clock_in = '';
		$scope.qwerty_inputs.pass = '';
		$scope.loginInfo = {user_login:'','role':''};
		$scope.pre_loginInfo = {user_login:'','role':''};
		$scope.startup.action = null;
		$rootScope.edit_mode = false;
		trashOrder();
		$scope.clearTableData();
		$scope.openUserModal(false);
		loadDefaultProduct();
	}
	
	$scope.aiv_login = function(){
		//Show login screen
		if($scope.loginInfo.user_login == ''){
			$scope.openUserModal(false);
		}else{//Show logout warning
			var confirmPopup = $ionicPopup.confirm({
				title: 'Warning',
				template: 'Are you sure you want to logout?'
			});

			confirmPopup.then(function(res) {
				if(res) {
					$scope.aiv_logout();
				}
			});
		}
	}
	
	$scope.checkLogin = function(){
		$scope.aiv_users.err = '';
		var	pass = '';
		
		if($scope.loginInfo.user_login){
			//Logout already loggedIn user
			$scope.aiv_logout();
		}
		for(var i=0;i<$scope.aiv_users.users.length;i++){
			if($scope.aiv_users.selected == $scope.aiv_users.users[i]._id){
				if($scope.terminalData.name == '' && $scope.aiv_users.users[i].role=='user'){
					$scope.aiv_users.err = 'Please login as Manager to configure settings...';
					return;
				}
				
				$scope.aiv_users.pass = $scope.aiv_users.users[i].user_login+" selected";
				
				if($scope.aiv_users.users[i].user_pass == pass || $scope.master_pass == pass){
					$scope.loginInfo = angular.copy($scope.aiv_users.users[i]);
					//var register = getUserRegister($scope.loginInfo._id);
					//$scope.aiv_users.clock_in = angular.isDefined(register.status)?register.status:false;
					$scope.clockStatus($scope.aiv_users.clock_in,true);
					if($scope.startup.action == null && $scope.aiv_users.users[i].user_pass == '' &&
						($scope.terminalData.type != 'BACK' || ($scope.terminalData.type == 'BACK' && $scope.backTemplate.id != 'MPOS'))){
						$scope.aiv_users.err = "Please select an action";
						return;
					}
					$scope.closeModal('POS_USERS');
					$scope.posview.type = 'POS';
					if($scope.terminalData.name == ''){
						$scope.openSettingsModal(false);
					}else{
						if($scope.terminalData.type == 'KITCHEN' && $scope.aiv_users.users[i].role=='user'){
							var info = {user_login:$scope.aiv_users.users[i].user_login,'role':$scope.aiv_users.users[i].role};
							$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'login', info);
						}
						getUnpaidCollectionOrders(true,false);
						getKitchenReadyOrders(false);
						
						/*$ionicLoading.show({
							template : '<h2>You are logged in as '+$scope.loginInfo.user_login+'...</h2>',
							duration : 700
						});*/
					
						if($scope.startup.action == 'SHIPPING' && $scope.terminalData.type != 'KITCHEN' && !$scope.CID_ph_num){
							if($scope.selected_shipping.id == 'sitin' ){
								$scope.openShippingModal();
							}else if($scope.selected_shipping.id != '' && $scope.formCheckout.customer_id=='guest'){
								$scope.openCustomerModal();
							}
						}else{
							switch($scope.startup.action){
								case 'ADD2ORDER':
								case 'LOOK_ORDER':
								case 'PAYOFF':
									$scope.openOrderModal();break;
								case 'TABLEVIEW':
									$scope.posview.type = 'TABLE';
									$scope.clearTableData();
									break;
								case 'JUSTEAT':
									$scope.showCustomOrderModal();break;
								case 'CALL_ORDER':
									$scope.callAction();break;
								case 'SETTINGS':
									$scope.switch_menu('Settings');break;
								case 'REPORTS':
									$scope.switch_menu('Reports');break;
								case 'CUSTOMERS':
									$scope.viewCustomerModal();break;
								default : break;
							}
						}
					}
				}
				break;
			}
		}
	}
	$scope.aivTableInfo =[];
	$scope.initalizeTable =function(){
	$scope.aivTableInfo =[];
		for(var i=0;i<10;i++){
			var tableInfo =[];
			for(var j=0;j<10;j++){
				var tableDoc = {"number":"","shape":"","status":"","selected":"","lock":false,"index":-1,"orders":[]};
				tableInfo.push(tableDoc);
			}
		$scope.aivTableInfo.push(tableInfo);
		}
		for(var k=0;k<$scope.aiv_tables.length;k++){
			if($scope.aiv_tables[k].orders){
				var order =$scope.aiv_tables[k].orders;
			}else
				var order =[];
			var tableDo_1 = {"number":$scope.aiv_tables[k].number,"shape":$scope.aiv_tables[k].shape,"status":$scope.aiv_tables[k].status,"selected":true,"lock":$scope.aiv_tables[k].lock,"index":k,"table_loc":$scope.aiv_tables[k].table_loc,"orders":order};
			if(angular.isDefined($scope.aiv_tables[k].table_loc))
				$scope.aivTableInfo[$scope.aiv_tables[k].table_loc.row][$scope.aiv_tables[k].table_loc.col] =tableDo_1;
		}
		
		console.log($scope.aivTableInfo);
	}

	$scope.login = function(pass){
		var flag = false;
		$scope.aiv_users.err = '';
		
		/*if(pass == '' || pass==undefined){
			$scope.aiv_users.err = 'Please enter a valid password...';
			return;
		}*/
		
		if(pass==undefined){
			pass = '';
		}
		for(var i=0;i<$scope.aiv_users.users.length;i++){
			if($scope.aiv_users.selected == $scope.aiv_users.users[i]._id){
				if($scope.terminalData.name == '' && $scope.aiv_users.users[i].role=='user'){
					$scope.aiv_users.err = 'Please login as Manager to configure settings...';
					return;
				} 
				
				if($scope.aiv_users.users[i].user_pass == pass || PHPass.CheckPassword(pass, $scope.aiv_users.users[i].user_pass)
					|| PHPass.CheckPassword(pass, $scope.master_pass)){
					$scope.loginInfo = angular.copy($scope.aiv_users.users[i]);
					//var register = getUserRegister($scope.loginInfo._id);
					//$scope.aiv_users.clock_in = angular.isDefined(register.status)?register.status:false;
					$scope.clockStatus($scope.aiv_users.clock_in,true);
					if($scope.startup.action == null &&
						($scope.terminalData.type != 'BACK' || ($scope.terminalData.type == 'BACK' && $scope.backTemplate.id != 'MPOS'))){
						$scope.aiv_users.err = "Please select an action";
						$scope.aiv_users.pass = "Logged in as "+$scope.aiv_users.users[i].user_login;
						return;
					}
					$scope.closeModal('POS_USERS');
					$scope.posview.type = 'POS';
					if($scope.terminalData.name == ''){
						$scope.openSettingsModal(false);
					}else{
						if($scope.terminalData.type == 'KITCHEN' && $scope.aiv_users.users[i].role=='user'){
							var info = {user_login:$scope.aiv_users.users[i].user_login,'role':$scope.aiv_users.users[i].role};
							$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'login', info);
						}
						getUnpaidCollectionOrders(true,false);
						getKitchenReadyOrders(false);
						
						/*$ionicLoading.show({
							template : '<h2>You are logged in as '+$scope.loginInfo.user_login+'...</h2>',
							duration : 700
						});*/
					
						if($scope.startup.action == 'SHIPPING' && $scope.terminalData.type != 'KITCHEN' && !$scope.CID_ph_num){
							if($scope.selected_shipping.id == 'sitin' ){
								$scope.openShippingModal();
							}else if($scope.selected_shipping.id != '' && $scope.formCheckout.customer_id=='guest'){
								$scope.openCustomerModal();
							}
						}else{
							switch($scope.startup.action){
								case 'ADD2ORDER':
								case 'LOOK_ORDER':
								case 'PAYOFF':
									$scope.openOrderModal();break;
								case 'TABLEVIEW':
									$scope.posview.type = 'TABLE';
									$scope.clearTableData();
									break;
								case 'JUSTEAT':
									$scope.showCustomOrderModal();break;
								case 'CALL_ORDER':
									$scope.callAction();break;
								case 'SETTINGS':
									$scope.switch_menu('Settings');break;
								case 'REPORTS':
									$scope.switch_menu('Reports');break;
								case 'CUSTOMERS':
									$scope.viewCustomerModal();break;
								default : break;
							}
						}
					}
					
					flag = true;
				}else{
					$scope.aiv_users.err = 'Incorrect password...';
					if($scope.startup.action == null){
						$scope.aiv_users.pass = $scope.aiv_users.users[i].user_login+" selected";
						return;
					}
				}
				break;
			}
		}
		return flag;
	}
	$scope.disable_finish=false;
	$scope.showSplitPay ={"show":false,"amount":0};
	$scope.calculateTender = function(){
		$scope.showSplitPay ={"show":false,"amount":0};
		if($scope.payment_select.amount != undefined && $scope.payment_select.amount != ''){
			var total = $scope.payment_select.to_pay;
			$scope.payment_select.tender = $filter('number')($scope.payment_select.amount-total, 2);
			if(parseFloat($scope.payment_select.amount)< parseFloat(total))
			{
				for(var i=0;i<$scope.settings_data.payment_methods.length;i++){
					if($scope.settings_data.payment_methods[i].id =="card" && $scope.settings_data.payment_methods[i].enable){
						$scope.showSplitPay.show =true;
						$scope.disable_finish=true;
						$scope.showSplitPay.amount =-1*$scope.payment_select.tender;
					}
						
				}
				
			}else{
			$scope.disable_finish=false;
			}
		}else{
			$scope.payment_select.tender = 0;
		}
	}
	$scope.changeQuantity = function(){
		if($scope.pos_input.quantity != '' && parseInt($scope.pos_input.quantity) != 0){
		
			var deltaqty = $scope.pos_input.quantity - $scope.idSelectedItem.item.quantity;
			
			$scope.idSelectedItem.item.quantity = parseInt($scope.pos_input.quantity);
			$scope.idSelectedItem.item["deltacount"]=deltaqty;
			
			$scope.getTotal($scope.idSelectedItem.item,$scope.idSelectedItem.index);
		}
	}
					
	$scope.aivkeys = [
		1, 2, 3, 'del',
		4, 5, 6, 'clr',
		7, 8, 9, '.',
		0, '00','↵'
	];
	$scope.aivkeys_salt = [
		7, 8, 9, 'del',
		4, 5, 6, 'clr',
		1, 2, 3, '.',
		0, '00','↵'
	];
	$scope.aiv_qwerty_salt = [
		'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 
		'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', '?',
		'z', 'x', 'c', 'v', 'b', 'n', 'm', '.', '/', 'clr'
	];
	$scope.aiv_extra_keys = [
		'£1', '£2', '£5', '£10', '£20'
	];
	/*$scope.aiv_qwerty = [
		1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 
		'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 
		'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', '?',
		'z', 'x', 'c', 'v', 'b', 'n', 'm', '.', 'del', 'clr'
	];*/
	$scope.aiv_qwerty = [
		{value:1,bk_color:'#fff'},
		{value:2,bk_color:'#fff'},
		{value:3,bk_color:'#fff'},
		{value:4,bk_color:'#fff'},
		{value:5,bk_color:'#fff'},
		{value:6,bk_color:'#fff'},
		{value:7,bk_color:'#fff'},
		{value:8,bk_color:'#fff'},
		{value:9,bk_color:'#fff'},
		{value:0,bk_color:'#fff'},
		{value:'q',bk_color:'#fff'},
		{value:'w',bk_color:'#fff'},
		{value:'e',bk_color:'#fff'},
		{value:'r',bk_color:'#fff'},
		{value:'t',bk_color:'#fff'},
		{value:'y',bk_color:'#fff'},
		{value:'u',bk_color:'#fff'},
		{value:'i',bk_color:'#fff'},
		{value:'o',bk_color:'#fff'},
		{value:'p',bk_color:'#fff'},
		{value:'a',bk_color:'#fff'},
		{value:'s',bk_color:'#fff'},
		{value:'d',bk_color:'#fff'},
		{value:'f',bk_color:'#fff'},
		{value:'g',bk_color:'#fff'},
		{value:'h',bk_color:'#fff'},
		{value:'j',bk_color:'#fff'},
		{value:'k',bk_color:'#fff'},
		{value:'l',bk_color:'#fff'},
		{value:'↵',bk_color:'#886aea'},
		{value:'z',bk_color:'#fff'},
		{value:'x',bk_color:'#fff'},
		{value:'c',bk_color:'#fff'},
		{value:'v',bk_color:'#fff'},
		{value:'b',bk_color:'#fff'},
		{value:'n',bk_color:'#fff'},
		{value:'m',bk_color:'#fff'},
		{value:'.',bk_color:'#fff'},
		{value:'del',bk_color:'#fff'},
		{value:'clr',bk_color:'#fff'}
	];
	
	$scope.aiv_qwerty2 = [
		{value:1,bk_color:'#fff'},
		{value:2,bk_color:'#fff'},
		{value:3,bk_color:'#fff'},
		{value:4,bk_color:'#fff'},
		{value:5,bk_color:'#fff'},
		{value:6,bk_color:'#fff'},
		{value:7,bk_color:'#fff'},
		{value:8,bk_color:'#fff'},
		{value:9,bk_color:'#fff'},
		{value:0,bk_color:'#fff'},
		{value:'q',bk_color:'#fff'},
		{value:'w',bk_color:'#fff'},
		{value:'e',bk_color:'#fff'},
		{value:'r',bk_color:'#fff'},
		{value:'t',bk_color:'#fff'},
		{value:'y',bk_color:'#fff'},
		{value:'u',bk_color:'#fff'},
		{value:'i',bk_color:'#fff'},
		{value:'o',bk_color:'#fff'},
		{value:'p',bk_color:'#fff'},
		{value:'a',bk_color:'#fff'},
		{value:'s',bk_color:'#fff'},
		{value:'d',bk_color:'#fff'},
		{value:'f',bk_color:'#fff'},
		{value:'g',bk_color:'#fff'},
		{value:'h',bk_color:'#fff'},
		{value:'j',bk_color:'#fff'},
		{value:'k',bk_color:'#fff'},
		{value:'l',bk_color:'#fff'},
		{value:'_',bk_color:'#fff'},
		{value:'z',bk_color:'#fff'},
		{value:'x',bk_color:'#fff'},
		{value:'c',bk_color:'#fff'},
		{value:'v',bk_color:'#fff'},
		{value:'b',bk_color:'#fff'},
		{value:'n',bk_color:'#fff'},
		{value:'m',bk_color:'#fff'},
		{value:'.',bk_color:'#fff'},
		{value:'@',bk_color:'#fff'},
		{value:',',bk_color:'#fff'}
	];
	
	$scope.aiv_bksp_key = 'bksp';
	$scope.aiv_clear_key = 'clr';
	$scope.aiv_space_key = 'space';
	$scope.aiv_enter_key = '↵';
	$scope.onKeyPressed = function(data,type) {
		switch(type){
			case 'PAYMENT':
				if(data.toString().length>1 && data.startsWith('£')){
					$scope.payment_select.amount = (parseFloat($scope.payment_select.amount?$scope.payment_select.amount:0)+parseFloat(data.substring(1))).toFixed(2);
				}else if (data == 'del') {
					$scope.payment_select.amount = $scope.payment_select.amount.toString().slice(0, $scope.payment_select.amount.toString().length - 1);
				} else if (data == 'clr') {
					$scope.payment_select.amount = '';
				} else if(data == '↵'){
					$scope.closePopover();
				} else {
					$scope.payment_select.amount += data;
				}
				$scope.calculateTender();
				break;
			case 'VOUCHERCODE':
				if (data == 'del') {
					$scope.voucher_code_area = $scope.voucher_code_area.toString().slice(0, $scope.voucher_code_area.toString().length - 1);
				} else if (data == 'clr') {
					$scope.voucher_code_area = '';
				} else if(data == '↵'){
					$scope.closePopover();
				} else {
					$scope.voucher_code_area += data;
				}
				break;
			case 'SHIPPING':
				if (data == 'del') {
					$scope.temp_shipping.fee = $scope.temp_shipping.fee.toString().slice(0, $scope.temp_shipping.fee.toString().length - 1);
				} else if (data == 'clr') {
					$scope.temp_shipping.fee = '';
				} else if(data == '↵'){
					$scope.closePopover();
				} else {
					$scope.temp_shipping.fee += data;
				}
				break;
			case 'DISCOUNT':
				if (data == 'del') {
					$scope.cart_discount.disc_num = $scope.cart_discount.disc_num.toString().slice(0, $scope.cart_discount.disc_num.toString().length - 1);
				} else if (data == 'clr') {
					$scope.cart_discount.disc_num = '';
				} else if(data == '↵'){
					$scope.closePopover();
				} else {
					$scope.cart_discount.disc_num += ''+data;
				}
				$scope.showDiscount();
				break;
			case 'VOUCHER_AMOUNT':
				if(data.toString().length>1 && data.startsWith('£')){
					$scope.input_voucheramount = (parseFloat($scope.input_voucheramount?$scope.input_voucheramount:0)+parseFloat(data.substring(1))).toFixed(2);
				}
				else if(data == 'del')
				{
					$scope.input_voucheramount = $scope.input_voucheramount.toString().slice(0, $scope.input_voucheramount.toString().length - 1);
				}
				else if (data == 'clr') {
					$scope.input_voucheramount = '';
				} 
				else if(data == '↵'){
					$scope.closePopover();
				}
				else {
					$scope.input_voucheramount += data;
				}
				break;
			case 'VOUCHER_EMAIL':
				$scope.email_voucher=$("#email_voucher").val();
				
				 if(data == 'del')
				{
					$scope.email_voucher = $scope.email_voucher.toString().slice(0, $scope.email_voucher.toString().length - 1);
				}
				else if (data == 'clr') {
					$scope.email_voucher = '';
				} 
				else if(data == '↵'){
					$scope.closePopover();
				}
				else {
					$scope.email_voucher += data;
				}
				break;
			case 'PRDT_QTY':
				if (data == 'del') {
					$scope.edit_product.quantity = $scope.edit_product.quantity.toString().slice(0, $scope.edit_product.quantity.toString().length - 1);
				} else if (data == 'clr') {
					$scope.edit_product.quantity = '';
				} else if(data == '↵'){
					if($scope.edit_product.quantity != '' && parseInt($scope.edit_product.quantity) != 0){
						$scope.closePopover();
					}
				} else {
					$scope.edit_product.quantity += ''+data;
				}
				break;
			case 'PRDT_ATTR_PRICE':
				if (data == 'del') {
					$scope.edit_product.sel_variations.price = $scope.edit_product.sel_variations.price.toString().slice(0, $scope.edit_product.sel_variations.price.toString().length - 1);
				} else if (data == 'clr') {
					$scope.edit_product.sel_variations.price = '';
				} else if(data == '↵'){
					$scope.edit_product.sel_variations.price = parseFloat($scope.edit_product.sel_variations.price).toFixed(2);
					$scope.closePopover();
				} else {
					$scope.edit_product.sel_variations.price += ''+data;
				}
				break;
			case 'PRDT_PRICE':
				if (data == 'del') {
					$scope.edit_product.price = $scope.edit_product.price.toString().slice(0, $scope.edit_product.price.toString().length - 1);
				} else if (data == 'clr') {
					$scope.edit_product.price = '';
				} else if(data == '↵'){
					$scope.closePopover();
				} else {
					$scope.edit_product.price += ''+data;
				}
				break;
			case 'CUST_PHONE':
				if (data == 'del' || data == $scope.aiv_bksp_key) {
					$scope.formCustomer.billing_address.phone = $scope.formCustomer.billing_address.phone.slice(0, $scope.formCustomer.billing_address.phone.length - 1);
				} else if (data == 'clr' || data == $scope.clear_key) {
					$scope.formCustomer.billing_address.phone = '';
				} else if(data == $scope.aiv_space_key){
					//$scope.formCustomer.billing_address.phone += ' ';
				} else if(data == '↵'){
					//$scope.closePopover();
				} else {
					$scope.formCustomer.billing_address.phone += ''+data;
				}
				break;
			case 'PAYOUT_NOTE':
				if (data == 'del') {
					var text = document.getElementById( 'payoutnote' );
					var index = text.selectionStart;
					text.value = text.value.slice(0,index-1) + text.value.slice(index);
					$scope.setSelectionRange(text,index-1,index-1);
					$scope.payoutnote = text.value;
				} else if (data == 'clr') {
					$scope.payoutnote = '';
				} else if(data == '↵'){
					$scope.createproductpayout();
				} else {
					if(data == 'space')
						data = ' ';
					var text = document.getElementById( 'payoutnote' );
					var index = text.selectionStart;
					text.value = text.value.slice(0,index) + ''+ data + text.value.slice(index);
					$scope.setSelectionRange(text,index+1,index+1);
					$scope.payoutnote = text.value;
				}
				break;
			case 'PAYOUT':
				if (data == 'del' || data == $scope.aiv_bksp_key) {
					$scope.payoutamount = $scope.payoutamount.toString().slice(0, $scope.payoutamount.toString().length - 1);
				} else if (data == 'clr' || data == $scope.clear_key) {
					$scope.payoutamount = '';
				} else if(data == '↵'){
					$scope.createproductpayout();
				} else {
					$scope.payoutamount += data;
				}
				break;
			case 'TIP':
				if (data == 'del' || data == $scope.aiv_bksp_key) {
					$scope.tipData.amount = $scope.tipData.amount.toString().slice(0, $scope.tipData.amount.toString().length - 1);
				} else if (data == 'clr' || data == $scope.clear_key) {
					$scope.tipData.amount = '';
				} else if(data == $scope.aiv_space_key){

				} else if(data == '↵'){
					
				} else {
					$scope.tipData.amount += ''+data;
				}
				break;
			case 'EDIT_PRDT_QTY':
				if($scope.idSelectedItem.item!=null){
					if (data == 'del') {
						$scope.pos_input.quantity = $scope.pos_input.quantity.toString().slice(0, $scope.pos_input.quantity.toString().length - 1);
					} else if (data == 'clr') {
						$scope.pos_input.quantity = '';
					} else if(data == '↵'){
						if($scope.pos_input.quantity != '' && parseInt($scope.pos_input.quantity) != 0){
							$scope.idSelectedItem.item.quantity = parseInt($scope.pos_input.quantity);
							$scope.getTotal($scope.idSelectedItem.item,$scope.idSelectedItem.index);
							$scope.closePopover();
						}
					} else {
						$scope.pos_input.quantity += ''+data;
					}
				}else{
					$scope.closePopover();
				}
				break;
			case 'OPEN_PRDT_PRICE':
				if (data == 'del') {
					$scope.custom_product.price = $scope.custom_product.price.toString().slice(0, $scope.custom_product.price.toString().length - 1);
				} else if (data == 'clr') {
					$scope.custom_product.price = '';
				} else if(data == '↵'){
					/*if($scope.custom_product.price != '' && parseFloat($scope.custom_product.price) != 0){
						$scope.closePopover();
					}*/
				} else {
					$scope.custom_product.price += ''+data;
				}
				break;
			case 'UPDATE_PRDT_PRICE':
				if (data == 'del') {
					$scope.update_product.price = $scope.update_product.price.toString().slice(0, $scope.update_product.price.toString().length - 1);
				} else if (data == 'clr') {
					$scope.update_product.price = '';
				} else if(data == '↵'){
					$scope.updateBandPrices(true);
					$scope.closePopover();
				} else {
					$scope.update_product.price += ''+data;
				}
				break;
			case 'UPDATE_STOCK_QTY':
				if (data == 'del') {
					$scope.product_stock.new_quantity = $scope.product_stock.new_quantity.toString().slice(0, $scope.product_stock.new_quantity.toString().length - 1);
				} else if (data == 'clr') {
					$scope.product_stock.new_quantity = '';
				} else if(data == '↵'){
					$scope.updateStockQuantity();
					$scope.closePopover();
				} else {
					$scope.product_stock.new_quantity += ''+data;
				}
				break;
			case 'SUPP_PHONE':
				if (data == 'del') {
					$scope.stock_supplier.phone = $scope.stock_supplier.phone.slice(0, $scope.stock_supplier.phone.length - 1);
				} else if (data == 'clr') {
					$scope.stock_supplier.phone = '';
				} else if(data == '↵'){
					$scope.closePopover();
				} else {
					$scope.stock_supplier.phone += ''+data;
				}
				break;
			case 'UPDATE_PRDT_SALE_PRICE':
				if (data == 'del') {
					$scope.update_product.meta.wc_productdata_options[0].sales_price = $scope.update_product.meta.wc_productdata_options[0].sales_price.toString().slice(0, $scope.update_product.meta.wc_productdata_options[0].sales_price.toString().length - 1);
				} else if (data == 'clr') {
					$scope.update_product.meta.wc_productdata_options[0].sales_price = '';
				} else if(data == '↵'){
					$scope.updateBandPrices(false);
					$scope.closePopover();
				} else {
					$scope.update_product.meta.wc_productdata_options[0].sales_price += ''+data;
				}
				break;
			case 'UPDATE_PRDT_WEIGHT':
				if (data == 'del') {
					$scope.update_product.weight = $scope.update_product.weight.toString().slice(0, $scope.update_product.weight.toString().length - 1);
				} else if (data == 'clr') {
					$scope.update_product.weight = '';
				} else if(data == '↵'){
					$scope.closePopover();
				} else {
					$scope.update_product.weight=($scope.update_product.weight==null)?'':$scope.update_product.weight;
					$scope.update_product.weight += ''+data;
				}
				break;
			case 'CASHFLOW_AMT':
				if (data == 'del') {
					$scope.update_expense.amount = $scope.update_expense.amount.toString().slice(0, $scope.update_expense.amount.toString().length - 1);
				} else if (data == 'clr') {
					$scope.update_expense.amount = '';
				} else if(data == '↵'){
					$scope.closePopover();
				} else {
					$scope.update_expense.amount += ''+data;
				}
				break;
			case 'CUST_CREDIT_AMT':
				if (data == 'del') {
					$scope.formCustomer.max_credit_amount = $scope.formCustomer.max_credit_amount.toString().slice(0, $scope.formCustomer.max_credit_amount.toString().length - 1);
				} else if (data == 'clr') {
					$scope.formCustomer.max_credit_amount = '';
				} else if(data == '↵'){
					$scope.closePopover();
				} else {
					$scope.formCustomer.max_credit_amount += ''+data;
				}
				break;
			case 'CUST_CREDIT_PERIOD':
				if (data == 'del') {
					$scope.formCustomer.max_credit_period = $scope.formCustomer.max_credit_period.toString().slice(0, $scope.formCustomer.max_credit_period.toString().length - 1);
				} else if (data == 'clr') {
					$scope.formCustomer.max_credit_period = '';
				} else if(data == '↵'){
					$scope.closePopover();
				} else {
					$scope.formCustomer.max_credit_period += ''+data;
				}
				break;
			case 'MAX_CREDIT_AMT':
				if (data == 'del') {
					$scope.settings_data.credits.max_credit_amount = $scope.settings_data.credits.max_credit_amount.toString().slice(0, $scope.settings_data.credits.max_credit_amount.toString().length - 1);
				} else if (data == 'clr') {
					$scope.settings_data.credits.max_credit_amount = '';
				} else if(data == '↵'){
					$scope.closePopover();
				} else {
					$scope.settings_data.credits.max_credit_amount += ''+data;
				}
				break;
			case 'MAX_CREDIT_PERIOD':
				if (data == 'del') {
					$scope.settings_data.credits.max_credit_period = $scope.settings_data.credits.max_credit_period.toString().slice(0, $scope.settings_data.credits.max_credit_period.toString().length - 1);
				} else if (data == 'clr') {
					$scope.settings_data.credits.max_credit_period = '';
				} else if(data == '↵'){
					$scope.closePopover();
				} else {
					$scope.settings_data.credits.max_credit_period += ''+data;
				}
				break;
			case 'UPDATE_PRDT_STOCK_PRICE':
				if (data == 'del') {
					$scope.product_stock.price = $scope.product_stock.price.toString().slice(0, $scope.product_stock.price.toString().length - 1);
				} else if (data == 'clr') {
					$scope.product_stock.price = '';
				} else if(data == '↵'){
					$scope.closePopover();
				} else {
					$scope.product_stock.price += ''+data;
				}
				break;
			case 'LOGIN_PASS':
				if (data == 'del') {
					$scope.qwerty_inputs.pass = $scope.qwerty_inputs.pass.toString().slice(0, $scope.qwerty_inputs.pass.toString().length - 1);
				} else if (data == 'clr') {
					$scope.qwerty_inputs.pass = '';
				} else if(data == '↵'){
					$scope.login($scope.qwerty_inputs.pass);
				} else {
					$scope.qwerty_inputs.pass += ''+data;
				}
				break;
			case 'CLOCK_PASS':
				if (data == 'del') {
					$scope.qwerty_inputs.clock_pass = $scope.qwerty_inputs.clock_pass.toString().slice(0, $scope.qwerty_inputs.clock_pass.toString().length - 1);
				} else if (data == 'clr') {
					$scope.qwerty_inputs.clock_pass = '';
				} else if(data == '↵'){
				$scope.clockInOrNot ='';
			//	if($scope.clock_user){
					
					if($scope.IsPasswordMatchingClockStatus($scope.qwerty_inputs.clock_pass)){
						var login_info = $scope.clock_user;
						var register = getUserRegister(login_info._id);
						if(angular.isDefined(register.status) && register.status){
							register.clock_in = moment(register.clock_in, "DD/MM/YYYY, HH:mm:ss").toDate();
							$scope.clockInOrNot = $filter('date')(new Date(register.clock_in),'hh:mm a');
						}
						$scope.showClockInButton =true;
						}else{
							$scope.aiv_users.err = 'Incorrect password!!!';
						}
				//}else{
				//	$scope.aiv_users.err = 'Please select a user!!!';
				//}
			/* 		if($scope.clock_user){
						if($scope.IsPasswordMatching($scope.clock_user._id,$scope.qwerty_inputs.clock_pass)){
							$scope.clockStatus($scope.aiv_users.clock_in,false);
						}else{
							$scope.aiv_users.err = 'Incorrect password!!!';
						}
					}else{
						$scope.aiv_users.err = 'Please select a user!!!';
					}*/
				} else {
					$scope.qwerty_inputs.clock_pass += ''+data;
				} 
				break;
			
			
			case 'COUPON':
				if (data == 'del') {
					$scope.coupon.code = $scope.coupon.code.toString().slice(0, $scope.coupon.code.toString().length - 1);
				} else if (data == 'clr') {
					$scope.coupon.code = '';
				} else if(data == '↵'){
					$scope.addCoupon();
				} else {
					$scope.coupon.code += ''+data;
				}
				break;
				case 'VOUCHER':
				if (data == 'del') {
					$scope.voucher.code = $scope.voucher.code.toString().slice(0, $scope.voucher.code.toString().length - 1);
				} else if (data == 'clr') {
					$scope.voucher.code = '';
				} else if(data == '↵'){
					$scope.addVoucher();
				} else {
					$scope.voucher.code += ''+data;
				}
				break;
			case 'ORDER_NOTE':
				if (data == 'del') {
					var text = document.getElementById( 'aiv-note' );
					var index = text.selectionStart;
					text.value = text.value.slice(0,index-1) + text.value.slice(index);
					$scope.setSelectionRange(text,index-1,index-1);
					$scope.order_note.note = text.value;
				} else if (data == 'clr') {
					$scope.order_note.note = '';
				} else if(data == '↵'){
					$scope.saveNote();
				} else {
					if(data == 'space')
						data = ' ';
					var text = document.getElementById( 'aiv-note' );
					var index = text.selectionStart;
					text.value = text.value.slice(0,index) + ''+ data + text.value.slice(index);
					$scope.setSelectionRange(text,index+1,index+1);
					$scope.order_note.note = text.value;
				}
				break;
			case 'REFUND_NOTE':
				if (data == 'del') {
					var text = document.getElementById( 'aiv-refundnote' );
					var index = text.selectionStart;
					text.value = text.value.slice(0,index-1) + text.value.slice(index);
					$scope.setSelectionRange(text,index-1,index-1);
					$scope.action_auth.reason = text.value;
				} else if (data == 'clr') {
					$scope.action_auth.reason = '';
				} else if(data == '↵'){
					//$scope.saveNote();
				} else {
					if(data == 'space')
						data = ' ';
					var text = document.getElementById( 'aiv-refundnote' );
					var index = text.selectionStart;
					text.value = text.value.slice(0,index) + ''+ data + text.value.slice(index);
					$scope.setSelectionRange(text,index+1,index+1);
					$scope.action_auth.reason = text.value;
				}
				break;
			case 'POINTS_EARNED':
				if (data == 'del') {
					$scope.loyalty_card.order_amount = $scope.loyalty_card.order_amount.toString().slice(0, $scope.loyalty_card.order_amount.toString().length - 1);
				} else if (data == 'clr') {
					$scope.loyalty_card.order_amount = '';
				} else if(data == '↵'){
					if($scope.loyalty_card.order_amount != ''){
						$scope.addLoyaltyPoints();
					}
				} else {
					$scope.loyalty_card.order_amount += ''+data;
				}
				break;
			case 'MANUAL_CARD_ID':
				if (data == 'del') {
					$scope.loyalty_card.id = $scope.loyalty_card.id.toString().slice(0, $scope.loyalty_card.id.toString().length - 1);
				} else if (data == 'clr') {
					$scope.loyalty_card.id = '';
				} else if(data == '↵'){
					$scope.loyalty_card.manual_search = true;
					$scope.searchLoyaltyCustomer($scope.loyalty_card.id);
				} else {
					$scope.loyalty_card.id += ''+data;
				}
				break;
			case 'LOYALTY_SALE_AMT':
				if (data == 'del') {
					$scope.hf_loyalty.sales.amount = $scope.hf_loyalty.sales.amount.toString().slice(0, $scope.hf_loyalty.sales.amount.toString().length - 1);
				} else if (data == 'clr') {
					$scope.hf_loyalty.sales.amount = '';
				} else if(data == '↵'){
					
				} else {
					$scope.hf_loyalty.sales.amount += ''+data;
				}
				break;
			case 'LOYALTY_SALE_PTS':
				if (data == 'del') {
					$scope.hf_loyalty.sales.points = $scope.hf_loyalty.sales.points.toString().slice(0, $scope.hf_loyalty.sales.points.toString().length - 1);
				} else if (data == 'clr') {
					$scope.hf_loyalty.sales.points = '';
				} else if(data == '↵'){
					
				} else {
					$scope.hf_loyalty.sales.points += ''+data;
				}
				break;
			case 'LOYALTY_REWARD_AMT':
				if (data == 'del') {
					$scope.hf_loyalty.rewards.amount = $scope.hf_loyalty.rewards.amount.toString().slice(0, $scope.hf_loyalty.rewards.amount.toString().length - 1);
				} else if (data == 'clr') {
					$scope.hf_loyalty.rewards.amount = '';
				} else if(data == '↵'){
					
				} else {
					$scope.hf_loyalty.rewards.amount += ''+data;
				}
				break;
			case 'LOYALTY_REWARD_PTS':
				if (data == 'del') {
					$scope.hf_loyalty.rewards.points = $scope.hf_loyalty.rewards.points.toString().slice(0, $scope.hf_loyalty.rewards.points.toString().length - 1);
				} else if (data == 'clr') {
					$scope.hf_loyalty.rewards.points = '';
				} else if(data == '↵'){

				} else {
					$scope.hf_loyalty.rewards.points += ''+data;
				}
				break;
			case 'LOYALTY_FEEDABCK_POINTS':
				if (data == 'del') {
					$scope.hf_loyalty.feedback_points = $scope.hf_loyalty.feedback_points.toString().slice(0, $scope.hf_loyalty.feedback_points.toString().length - 1);
				} else if (data == 'clr') {
					$scope.hf_loyalty.feedback_points = '';
				} else if(data == '↵'){

				} else {
					if($scope.hf_loyalty.feedback_points == undefined)
						$scope.hf_loyalty.feedback_points = '';
					$scope.hf_loyalty.feedback_points += ''+data;
				}
				break;
			case 'LOYALTY_SIGNUP_POINTS':
				if (data == 'del') {
					$scope.hf_loyalty.signup_points = $scope.hf_loyalty.signup_points.toString().slice(0, $scope.hf_loyalty.signup_points.toString().length - 1);
				} else if (data == 'clr') {
					$scope.hf_loyalty.signup_points = '';
				} else if(data == '↵'){

				} else {
					if($scope.hf_loyalty.signup_points == undefined)
						$scope.hf_loyalty.signup_points = '';
					$scope.hf_loyalty.signup_points += ''+data;
				}
				break;
			case 'SEARCH_PHONE':
				if (data == 'del') {
					$scope.search_inputs.phone = $scope.search_inputs.phone.slice(0, $scope.search_inputs.phone.length - 1);
				} else if (data == 'clr') {
					$scope.search_inputs.phone = '';
				} else if(data == '↵'){
					$scope.quickSearchCustomer($scope.search_inputs.phone,'PHONE',true);
				}else if(data == $scope.aiv_space_key){
					$scope.search_inputs.phone += ' ';
				}else {
					if($scope.search_inputs.phone.length < 11)
						$scope.search_inputs.phone += ''+data;
				}
				break;
			case 'CUSTOMER_EDIT_FNAME':
				if (data == 'del' || data == $scope.aiv_bksp_key) {
					$scope.formCustomer.billing_address.first_name = $scope.formCustomer.billing_address.first_name.slice(0, $scope.formCustomer.billing_address.first_name.length - 1);
				} else if (data == 'clr' || data == $scope.clear_key) {
					$scope.formCustomer.billing_address.first_name = '';
				} else if(data == $scope.aiv_space_key){
					$scope.formCustomer.billing_address.first_name += ' ';
				} else if(data == '↵'){
					//$scope.closePopover();
				} else {
					$scope.formCustomer.billing_address.first_name += ''+data;
				}
				break;
			case 'CUSTOMER_EDIT_LNAME':
				if (data == 'del' || data == $scope.aiv_bksp_key) {
					$scope.formCustomer.billing_address.last_name = $scope.formCustomer.billing_address.last_name.slice(0, $scope.formCustomer.billing_address.last_name.length - 1);
				} else if (data == 'clr' || data == $scope.clear_key) {
					$scope.formCustomer.billing_address.last_name = '';
				} else if(data == $scope.aiv_space_key){
					$scope.formCustomer.billing_address.last_name += ' ';
				} else if(data == '↵'){
					//$scope.closePopover();
				} else {
					$scope.formCustomer.billing_address.last_name += ''+data;
				}
				break;
			case 'CUST_EDIT_EMAIL':
				if (data == 'del' || data == $scope.aiv_bksp_key) {
					$scope.formCustomer.billing_address.email = $scope.formCustomer.billing_address.email.slice(0, $scope.formCustomer.billing_address.email.length - 1);
				} else if (data == 'clr' || data == $scope.clear_key) {
					$scope.formCustomer.billing_address.email = '';
				} else if(data == $scope.aiv_space_key){
					$scope.formCustomer.billing_address.email += ' ';
				} else if(data == '↵'){
					//$scope.closePopover();
				} else {
					$scope.formCustomer.billing_address.email += ''+data;
				}
				break;
			case 'CUST_EDIT_BILLSTREET':
				if (data == 'del' || data == $scope.aiv_bksp_key) {
					$scope.formCustomer.billing_address.address_1 = $scope.formCustomer.billing_address.address_1.slice(0, $scope.formCustomer.billing_address.address_1.length - 1);
				} else if (data == 'clr' || data == $scope.clear_key) {
					$scope.formCustomer.billing_address.address_1 = '';
				} else if(data == $scope.aiv_space_key){
					$scope.formCustomer.billing_address.address_1 += ' ';
				} else if(data == '↵'){
					//$scope.closePopover();
				} else {
					$scope.formCustomer.billing_address.address_1 += ''+data;
				}
				break;
			case 'CUST_EDIT_BILLAREA':
				if (data == 'del' || data == $scope.aiv_bksp_key) {
					$scope.formCustomer_find.address_2 = $scope.formCustomer_find.address_2.slice(0, $scope.formCustomer_find.address_2.length - 1);
				} else if (data == 'clr' || data == $scope.clear_key) {
					$scope.formCustomer_find.address_2 = '';
				} else if(data == $scope.aiv_space_key){
					$scope.formCustomer_find.address_2 += ' ';
				} else if(data == '↵'){
					//$scope.closePopover();
				} else {
					$scope.formCustomer_find.address_2 += ''+data;
				}
				break;
			case 'CUST_EDIT_BILLCITY':
				if (data == 'del' || data == $scope.aiv_bksp_key) {
					$scope.formCustomer_find.address_1 = $scope.formCustomer_find.address_1.slice(0, $scope.formCustomer_find.address_1.length - 1);
				} else if (data == 'clr' || data == $scope.clear_key) {
					$scope.formCustomer_find.address_1 = '';
				} else if(data == $scope.aiv_space_key){
					$scope.formCustomer_find.address_1 += ' ';
				} else if(data == '↵'){
					//$scope.closePopover();
				} else {
					$scope.formCustomer_find.address_1 += ''+data;
				}
				break;
			case 'CUST_EDIT_BILLCODE':
				$scope.errors.bill_postcode = '';
				if (data == 'del' || data == $scope.aiv_bksp_key) {
					$scope.formCustomer.billing_address.postcode = $scope.formCustomer.billing_address.postcode.slice(0, $scope.formCustomer.billing_address.postcode.length - 1);
					$scope.savePostCode($scope.formCustomer.billing_address.postcode,true);
				} else if (data == 'clr' || data == $scope.clear_key) {
					$scope.formCustomer.billing_address.postcode = '';
				} else if(data == $scope.aiv_space_key){
					$scope.formCustomer.billing_address.postcode += ' ';
					$scope.savePostCode($scope.formCustomer.billing_address.postcode,true);
				} else if(data == '↵'){
					//$scope.closePopover();
				} else {
					$scope.formCustomer.billing_address.postcode += ''+data;
					$scope.savePostCode($scope.formCustomer.billing_address.postcode,true);
				}
				break;
			case 'CUST_EDIT_SHIPFNAME':
				if (data == 'del' || data == $scope.aiv_bksp_key) {
					$scope.formCustomer.shipping_address.first_name = $scope.formCustomer.shipping_address.first_name.slice(0, $scope.formCustomer.shipping_address.first_name.length - 1);
				} else if (data == 'clr' || data == $scope.clear_key) {
					$scope.formCustomer.shipping_address.first_name = '';
				} else if(data == $scope.aiv_space_key){
					$scope.formCustomer.shipping_address.first_name += ' ';
				} else if(data == '↵'){
					//$scope.closePopover();
				} else {
					$scope.formCustomer.shipping_address.first_name += ''+data;
				}
				break;
			case 'CUST_EDIT_SHIPLNAME':
				if (data == 'del' || data == $scope.aiv_bksp_key) {
					$scope.formCustomer.shipping_address.last_name = $scope.formCustomer.shipping_address.last_name.slice(0, $scope.formCustomer.shipping_address.last_name.length - 1);
				} else if (data == 'clr' || data == $scope.clear_key) {
					$scope.formCustomer.shipping_address.last_name = '';
				} else if(data == $scope.aiv_space_key){
					$scope.formCustomer.shipping_address.last_name += ' ';
				} else if(data == '↵'){
					//$scope.closePopover();
				} else {
					$scope.formCustomer.shipping_address.last_name += ''+data;
				}
				break;
			case 'CUST_EDIT_SHIPSTREET':
				if (data == 'del' || data == $scope.aiv_bksp_key) {
					$scope.formCustomer.shipping_address.address_1 = $scope.formCustomer.shipping_address.address_1.slice(0, $scope.formCustomer.shipping_address.address_1.length - 1);
				} else if (data == 'clr' || data == $scope.clear_key) {
					$scope.formCustomer.shipping_address.address_1 = '';
				} else if(data == $scope.aiv_space_key){
					$scope.formCustomer.shipping_address.address_1 += ' ';
				} else if(data == '↵'){
					//$scope.closePopover();
				} else {
					$scope.formCustomer.shipping_address.address_1 += ''+data;
				}
				break;
			case 'CUST_EDIT_SHIPAREA':
				if (data == 'del' || data == $scope.aiv_bksp_key) {
					$scope.formCustomer.shipping_address.address_2 = $scope.formCustomer.shipping_address.address_2.slice(0, $scope.formCustomer.shipping_address.address_2.length - 1);
				} else if (data == 'clr' || data == $scope.clear_key) {
					$scope.formCustomer.shipping_address.address_2 = '';
				} else if(data == $scope.aiv_space_key){
					$scope.formCustomer.shipping_address.address_2 += ' ';
				} else if(data == '↵'){
					//$scope.closePopover();
				} else {
					$scope.formCustomer.shipping_address.address_2 += ''+data;
				}
				break;
			case 'CUST_EDIT_SHIPCITY':
				if (data == 'del' || data == $scope.aiv_bksp_key) {
					$scope.formCustomer.shipping_address.city = $scope.formCustomer.shipping_address.city.slice(0, $scope.formCustomer.shipping_address.city.length - 1);
				} else if (data == 'clr' || data == $scope.clear_key) {
					$scope.formCustomer.shipping_address.city = '';
				} else if(data == $scope.aiv_space_key){
					$scope.formCustomer.shipping_address.city += ' ';
				} else if(data == '↵'){
					//$scope.closePopover();
				} else {
					$scope.formCustomer.shipping_address.city += ''+data;
				}
				break;
			case 'CUST_EDIT_SHIPCODE':
				$scope.errors.ship_postcode = '';
				if (data == 'del' || data == $scope.aiv_bksp_key) {
					$scope.formCustomer.shipping_address.postcode = $scope.formCustomer.shipping_address.postcode.slice(0, $scope.formCustomer.shipping_address.postcode.length - 1);
					$scope.savePostCode($scope.formCustomer.shipping_address.postcode,false);
				} else if (data == 'clr' || data == $scope.clear_key) {
					$scope.formCustomer.shipping_address.postcode = '';
				} else if(data == $scope.aiv_space_key){
					$scope.formCustomer.shipping_address.postcode += ' ';
					$scope.savePostCode($scope.formCustomer.shipping_address.postcode,false);
				} else if(data == '↵'){
					//$scope.closePopover();
				} else {
					$scope.formCustomer.shipping_address.postcode += ''+data;
					$scope.savePostCode($scope.formCustomer.shipping_address.postcode,false);
				}
				break;
			case 'OPEN_PRDT_NAME':
				if (data == 'del' || data == $scope.aiv_bksp_key) {
					$scope.custom_product.title = $scope.custom_product.title.slice(0, $scope.custom_product.title.length - 1);
				} else if (data == 'clr' || data == $scope.clear_key) {
					$scope.custom_product.title = '';
				} else if(data == $scope.aiv_space_key){
					$scope.custom_product.title += ' ';
				} else if(data == '↵'){
					//$scope.closePopover();
				} else {
					$scope.custom_product.title += ''+data;
				}
				break;
			case 'CUST_EDIT_SHIPCHARGE':
				if (data == 'del' || data == $scope.aiv_bksp_key) {
					$scope.formCustomer.del_charge = $scope.formCustomer.del_charge.slice(0, $scope.formCustomer.del_charge.length - 1);
				} else if (data == 'clr' || data == $scope.clear_key) {
					$scope.formCustomer.del_charge = '';
				} else if(data == $scope.aiv_space_key){
					$scope.formCustomer.del_charge += ' ';
				} else if(data == '↵'){
					//$scope.closePopover();
				} else {
					$scope.formCustomer.del_charge += ''+data;
				}
			case 'SMS_CONTENT':
				if (data == $scope.aiv_bksp_key) {
					var text = document.getElementById( 'aiv-recipients' );
					var index = text.selectionStart;
					text.value = text.value.slice(0,index-1) + text.value.slice(index);
					$scope.setSelectionRange(text,index-1,index-1);
					$scope.sms.content = text.value;
				} else if (data == 'clr') {
					$scope.sms.content = '';
				} else if(data == '↵'){
					
				} else {
					if(data == 'space')
						data = ' ';
					var text = document.getElementById( 'aiv-recipients' );
					var index = text.selectionStart;
					text.value = text.value.slice(0,index) + ''+ data + text.value.slice(index);
					$scope.setSelectionRange(text,index+1,index+1);
					$scope.sms.content = text.value;
				}
				break;
			case 'SMS_SEARCH':
				if (data == $scope.aiv_bksp_key) {
					$scope.sms.searchCust = $scope.sms.searchCust.slice(0, $scope.sms.searchCust.length - 1);
				} else if (data == 'clr' || data == $scope.clear_key) {
					$scope.sms.searchCust = '';
				} else if(data == $scope.aiv_space_key){
					$scope.sms.searchCust += ' ';
				} else if(data == '↵'){
					//$scope.closePopover();
				} else {
					$scope.sms.searchCust += ''+data;
				}
				break;
			case 'SMS_RECIPIENTS':
				if (data == $scope.aiv_bksp_key) {
					$scope.sms.recipients = $scope.sms.recipients.slice(0, $scope.sms.recipients.length - 1);
				} else if (data == 'clr' || data == $scope.clear_key) {
					$scope.sms.recipients = '';
				} else if(data == $scope.aiv_space_key){
					$scope.sms.recipients += ' ';
				} else if(data == '↵'){
					//$scope.closePopover();
				} else {
					$scope.sms.recipients += ''+data;
				}
				break;
			case 'VOID_REASON':
				if (data == $scope.aiv_bksp_key) {
					$scope.void_input.reason = $scope.void_input.reason.slice(0, $scope.void_input.reason.length - 1);
				} else if (data == 'clr' || data == $scope.clear_key) {
					$scope.void_input.reason = '';
				} else if(data == $scope.aiv_space_key){
					$scope.void_input.reason += ' ';
				} else if(data == '↵'){
					if($scope.void_input.reason){
						$scope.voidNext();
					}else{
						$scope.errors.void_reason = "Please specify a reason...";
					}
				} else {
					$scope.errors.void_reason = '';
					$scope.void_input.reason += ''+data;
				}
				break;
			case 'SPLIT_VALUE':
				if (data == 'del' || data == $scope.aiv_bksp_key) {
					$scope.split.value = $scope.split.value.slice(0, $scope.split.value.length - 1);
				} else if (data == 'clr' || data == $scope.clear_key) {
					$scope.split.value = '';
				} else if(data == $scope.aiv_space_key){
					$scope.split.value += ' ';
				} else if(data == '↵'){
					if(!$scope.split.value){
						$scope.split.value = 1;
					}
					$scope.finishButtonClick('BILL_SLIPT_VALUE');
				} else {
					$scope.split.value += ''+data;
				}
				break;
			case 'SPLIT_UNEQUAL_VALUE':
				if (data == 'del' || data == $scope.aiv_bksp_key) {
					$scope.split.unequalvalue = $scope.split.unequalvalue.slice(0, $scope.split.unequalvalue.length - 1);
				} else if (data == 'clr' || data == $scope.clear_key) {
					$scope.split.unequalvalue = '';
				} else if(data == $scope.aiv_space_key){
					$scope.split.unequalvalue += ' ';
				} else if(data == '↵'){
					$scope.finishUnequalClick();
				} else {
					$scope.split.unequalvalue += ''+data;
				}
				break;
			case 'INIT_IP':
				if (data == 'del' || data == $scope.aiv_bksp_key) {
					$scope.settings_data.localdb_ip = $scope.settings_data.localdb_ip.toString().slice(0, $scope.settings_data.localdb_ip.toString().length - 1);
				} else if (data == 'clr' || data == $scope.clear_key) {
					$scope.settings_data.localdb_ip = '';
				} else if(data == $scope.aiv_space_key){

				} else if(data == '↵'){
					if($scope.settings_data.localdb_ip && $scope.setLocalIp('PRIMARY')){
						$scope.dbPopup.close();
					}
				} else {
					$scope.settings_data.localdb_ip += ''+data;
				}
				break;
			case 'CUSTOM_ORDER_AMT':
				if (data == 'del' || data == $scope.aiv_bksp_key) {
					$scope.custom_order_product.price = $scope.custom_order_product.price.toString().slice(0, $scope.custom_order_product.price.toString().length - 1);
				} else if (data == 'clr' || data == $scope.clear_key) {
					$scope.custom_order_product.price = '';
				} else if(data == '↵'){
					
				} else {
					$scope.custom_order_product.price += data;
				}
				break;
			case 'VIEW_CUSTOMER':
				if (data == $scope.aiv_bksp_key) {
					$scope.search_inputs.customer = $scope.search_inputs.customer.slice(0, $scope.search_inputs.customer.length - 1);
					$scope.quickSearchCustomer($scope.search_inputs.customer,'PHONE',false);
				} else if (data == 'clr' || data == $scope.clear_key) {
					$scope.resetViewCustomers();
				} else if(data == $scope.aiv_space_key){
					$scope.search_inputs.customer += ' ';
				} else if(data == '↵'){
					//$scope.closePopover();
					$scope.quickSearchCustomer($scope.search_inputs.customer,'PHONE',false);
				} else {
					$scope.search_inputs.customer += ''+data;
					$scope.quickSearchCustomer($scope.search_inputs.customer,'PHONE',false);
				}
				break;
			case 'CUSTOMER_LOYCARD':
				if (data == 'del' || data == $scope.aiv_bksp_key) {
					$scope.formCustomer.meta.loyalty_card_id = $scope.formCustomer.meta.loyalty_card_id.slice(0, $scope.formCustomer.meta.loyalty_card_id.length - 1);
				} else if (data == 'clr' || data == $scope.clear_key) {
					$scope.formCustomer.meta.loyalty_card_id = '';
				} else if(data == $scope.aiv_space_key){
					$scope.formCustomer.meta.loyalty_card_id += ' ';
				} else if(data == '↵'){
					//$scope.closePopover();
				} else {
					$scope.formCustomer.meta.loyalty_card_id += ''+data;
				}
				break;
			case 'REQ_PASS':
				if (data == 'del' || data == $scope.aiv_bksp_key) {
					$scope.action_auth.pass = $scope.action_auth.pass.toString().slice(0, $scope.action_auth.pass.toString().length - 1);
				} else if (data == 'clr' || data == $scope.clear_key) {
					$scope.action_auth.pass = '';
				} else if(data == $scope.aiv_space_key){

				} else if(data == '↵'){
					
				} else {
					$scope.action_auth.pass += ''+data;
				}
				break;
			case "SALES_EDIT_CASH":
				if (data == 'del' || data == $scope.aiv_bksp_key) {
					$scope.formSales.cash = $scope.formSales.cash.toString().slice(0, $scope.formSales.cash.toString().length - 1);
				} else if (data == 'clr' || data == $scope.clear_key) {
					$scope.formSales.cash = '';
				} else if(data == $scope.aiv_space_key){

				} else if(data == '↵'){
					
				} else {
					$scope.formSales.cash += ''+data;
				}
				break;
			case "SALES_EDIT_RECEIPT":
				if (data == 'del' || data == $scope.aiv_bksp_key) {
					$scope.formSales.receipt = $scope.formSales.receipt.toString().slice(0, $scope.formSales.receipt.toString().length - 1);
				} else if (data == 'clr' || data == $scope.clear_key) {
					$scope.formSales.receipt = '';
				} else if(data == $scope.aiv_space_key){

				} else if(data == '↵'){
					
				} else {
					$scope.formSales.receipt += ''+data;
				}
				break;
			case "SALES_EDIT_TOTAL":
				if (data == 'del' || data == $scope.aiv_bksp_key) {
					$scope.formSales.total = $scope.formSales.total.toString().slice(0, $scope.formSales.total.toString().length - 1);
				} else if (data == 'clr' || data == $scope.clear_key) {
					$scope.formSales.total = '';
				} else if(data == $scope.aiv_space_key){

				} else if(data == '↵'){
					
				} else {
					$scope.formSales.total += ''+data;
				}
				break;
				
			case "SALES_EDIT_CARD":
				if (data == 'del' || data == $scope.aiv_bksp_key) {
					$scope.formSales.card = $scope.formSales.card.toString().slice(0, $scope.formSales.card.toString().length - 1);
				} else if (data == 'clr' || data == $scope.clear_key) {
					$scope.formSales.card = '';
				} else if(data == $scope.aiv_space_key){

				} else if(data == '↵'){
					
				} else {
					$scope.formSales.card += ''+data;
				}
				break;
				
			case "SALES_EDIT_SAGEPAY":
				if (data == 'del' || data == $scope.aiv_bksp_key) {
					$scope.formSales.sagepay = $scope.formSales.sagepay.toString().slice(0, $scope.formSales.sagepay.toString().length - 1);
				} else if (data == 'clr' || data == $scope.clear_key) {
					$scope.formSales.sagepay = '';
				} else if(data == $scope.aiv_space_key){

				} else if(data == '↵'){
					
				} else {
					$scope.formSales.sagepay += ''+data;
				}
				break;
			case "PURCHASE_ITEM":
				if (data == 'del' || data == $scope.aiv_bksp_key) {
					$scope.formPurchase.item =$scope.formPurchase.item.toString().slice(0, $scope.formPurchase.item.toString().length - 1);
				} else if (data == 'clr' || data == $scope.clear_key) {
					$scope.formPurchase.item = '';
					$scope.viewListSearch=[];
					$scope.showList =false;
				} else if(data == $scope.aiv_space_key){
					$scope.formPurchase.item += ' ';
				} else if(data == '↵'){
					$scope.quickSearchItems($scope.formPurchase.item);
				} else {
					$scope.formPurchase.item += ''+data;
					$scope.quickSearchItems($scope.formPurchase.item);
				}
				break;
			case "PURCHASE_QTY":
				if (data == 'del' || data == $scope.aiv_bksp_key) {
					$scope.formPurchase.quantity =$scope.formPurchase.quantity.toString().slice(0, $scope.formPurchase.quantity.toString().length - 1);
				} else if (data == 'clr' || data == $scope.clear_key) {
					$scope.formPurchase.quantity = '';
					
				} else if(data == $scope.aiv_space_key){
					$scope.formPurchase.quantity += ' ';
				} else if(data == '↵'){
					$scope.quickSearchItemsUnset();
				} else {
					$scope.formPurchase.quantity += ''+data;
					$scope.quickSearchItemsUnset();
				}
				break;
			case "PURCHASE_UNIT":
				if (data == 'del' || data == $scope.aiv_bksp_key) {
					$scope.formPurchase.unit =$scope.formPurchase.unit.toString().slice(0, $scope.formPurchase.unit.toString().length - 1);
				} else if (data == 'clr' || data == $scope.clear_key) {
					$scope.formPurchase.unit = '';
				} else if(data == $scope.aiv_space_key){
					$scope.formPurchase.unit += ' ';
				} else if(data == '↵'){
					
				} else {
					$scope.formPurchase.unit += ''+data;
				}
				break;
		}
	}
	
	$scope.setSelectionRange = function(input, selectionStart, selectionEnd) {
		if (input.setSelectionRange) {
		  input.focus();
		  input.setSelectionRange(selectionStart, selectionEnd);
		}
		else if (input.createTextRange) {
		  var range = input.createTextRange();
		  range.collapse(true);
		  range.moveEnd('character', selectionEnd);
		  range.moveStart('character', selectionStart);
		  range.select();
		}
	};

	$scope.setKeyInput = function(type,input){
		$scope.keypad.type = type;
		$scope.keypad.data = input;
	}
	
	$scope.onBarcodeKeyPressed = function(data,type){
		if (data == 'del') {
			$scope.layout_inputs.barcode = $scope.layout_inputs.barcode.toString().slice(0, $scope.layout_inputs.barcode.toString().length - 1);
		} else if (data == 'clr') {
			$scope.layout_inputs.barcode = '';
		} else if(data == '↵'){
			$scope.barcodeScanned($scope.layout_inputs.barcode,true);
			$scope.layout_inputs.barcode = '';
		} else {
			$scope.layout_inputs.barcode += ''+data;
		}
	}
	//linu to add clock in fuction 
	$scope.clockInUser = function(type){
		if(type =='CLOCKIN')
			$scope.aiv_users.clock_in = 'CLOCKIN';
		else if(type =='CLOCKOUT')
			 $scope.aiv_users.clock_in = 'CLOCKOUT';
		 $scope.clockStatus($scope.aiv_users.clock_in,false);
	}
	
	$scope.onQtyKeyPressed = function(data,type){
		if (data == 'del') {
			$scope.layout_inputs.qty = $scope.layout_inputs.qty.toString().slice(0, $scope.layout_inputs.qty.toString().length - 1);
		} else if (data == 'clr') {
			$scope.layout_inputs.qty = '';
		} else if(data == '↵'){
			if($scope.idSelectedItem.item!=null){
				$scope.pos_input.quantity = $scope.layout_inputs.qty;
				if($scope.pos_input.quantity != '' && parseInt($scope.pos_input.quantity) != 0){
					$scope.idSelectedItem.item.quantity = parseInt($scope.pos_input.quantity);
					$scope.getTotal($scope.idSelectedItem.item,$scope.idSelectedItem.index);
				}
				$scope.layout_inputs.qty = '';
			}
		} else {
			$scope.layout_inputs.qty += ''+data;
		}
	}
	
	$ionicPopover.fromTemplateUrl('keypad-popover.html', {
		scope: $scope,
		backdropClickToClose:false
	}).then(function(popover) {
		$scope.keypad_popover = popover;
	});
	$scope.keypad = {'type':'','data':''};
	$scope.openPopover = function($event,type,data) {
		if($rootScope.virtual_key_enable==true)
		{
			$scope.setKeyInput(type,data);
			$scope.keypad_popover.show($event);
		}
	};	
	$scope.closePopover = function() {
		$scope.keypad_popover.hide();
	};

	$ionicPopover.fromTemplateUrl('dropdown.html', {
		scope: $scope,
	}).then(function(popover) {
		$scope.dropdown_popover = popover;
	});

	$scope.showDropdown = function($event) {
		$scope.dropdown_popover.show($event);
	}
	
	$scope.hideDropdown = function() {
		$scope.dropdown_popover.hide();
	}
	
	$ionicPopover.fromTemplateUrl('kitchen-dropdown.html', {
		scope: $scope,
	}).then(function(popover) {
		$scope.kitchen_dropdown = popover;
	});

	$scope.showKitchenDropdown = function($event) {
		$scope.kitchen_dropdown.show($event);
	}
	
	$scope.hideKitchenDropdown = function() {
		$scope.kitchen_dropdown.hide();
	}
	
	// Execute action on hide popover
	$scope.$on('popover.hidden', function() {
		// Execute action
		//$scope.keypad_popover.remove();
	});
	// Execute action on remove popover
	$scope.$on('popover.removed', function() {
		// Execute action
	});
  
	$scope.kb_config={
		layout: 'qwerty',
		usePreview: false,
		autoAccept: true,
		autoUpdateModel: true,
		openOn:'focus',
		css:{
			popup:'aiv-keyboard',
			input: '',
		},
		accepted : function(event, keyboard, el) {
			if(el.id == "aiv-scan-input"){
				$scope.barcodeScanned(el.value,false,true);
			}
		}
	}
	
	$scope.kb_settings_config={
		layout: 'qwerty',
		usePreview: false,
		autoAccept: true,
		autoUpdateModel: true,
		openOn:'focus',
		css:{
			popup:'aiv-keyboard',
			input: ''
		},
		position:{
			of: 'body',
			my: 'center top',
			at: 'center bottom',
			at2: 'center bottom'
		}
	}
	
	$scope.kb_custom_config={
		layout: 'qwerty',
		usePreview: false,
		autoAccept: true,
		autoUpdateModel: true,
		openOn:'focus',
		css:{
			popup:'aiv-keyboard',
			input: ''
		},
		position:{
			of: $(window),
			my: 'center bottom',
			at: 'center bottom',
			at2: 'center bottom'
		}
	}
	$scope.CIDnew_customer = true;
	$scope.CIDCustomer = {};
	$scope.callPopup = function(phone_num){
		if($scope.callOrder.sound){
			$scope.cid_order_audio.play();
		}
		$scope.CIDnew_customer = true;
		$scope.CIDCustomer = {};
		$scope.call_processed = false;
		//Find and assign customer by phone number
		var customer_doc = shareData.getCustomer("PHONE",phone_num);
		if(angular.isDefined(customer_doc._id)){
			$scope.CIDCustomer = angular.copy(customer_doc);
			$scope.CIDnew_customer = false;
		}
		if($scope.CIDPopup){
			$scope.CIDPopup.close();
		}
		$scope.CIDPopup = $ionicPopup.show({
			templateUrl: 'call-popup.html',
			title: phone_num,
			scope: $scope
		});
	}
	
	$scope.showCallPopup = function(){
		if($scope.CID_ph_num){
			if($scope.loginInfo.user_login && $scope.formCheckout.customer_id == "guest" && !$scope.cartItems.length &&
				($scope.customer_modal == undefined || !$scope.customer_modal._isShown) &&
				($scope.ship_modal == undefined || !$scope.ship_modal._isShown) && 
				($scope.customer_edit_modal == undefined || !$scope.customer_edit_modal._isShown)){
				$scope.callPopup($scope.CID_ph_num);
			}else{
				$scope.showCheckoutMsg('Warning','Please save/clear current order to continue');
			}
		}
	}
	
	$scope.CIDHold = function(){
		$scope.CIDCustomer = {};
		$scope.CIDPopup.close();
		if($scope.callOrder.sound){
			$scope.cid_order_audio.pause();
		}
	}
		
	$scope.call_processed = false;
	$scope.callAction = function(){
		if($scope.CID_ph_num && !$scope.call_processed){
			$scope.call_processed = true;
			$scope.aiv_toggles.show_customer_extra = false;
			if($scope.CIDnew_customer){
				$scope.openCustomerEditModal(false);
			}else{		
				//Assign customer
				$scope.setSelectedCustomer($scope.CIDCustomer);
				$scope.formCheckout.billing_address = angular.copy($scope.CIDCustomer.billing_address);
				$scope.formCheckout.customer_id = $scope.CIDCustomer.id;
				$scope.formCheckout.shipping_address = angular.copy($scope.CIDCustomer.shipping_address);
				$scope.formCheckout.customer_meta = angular.copy($scope.CIDCustomer.meta);
				$scope.formCheckout.customer_meta.customer_note = angular.isDefined($scope.CIDCustomer.customer_note)?$scope.CIDCustomer.customer_note:'';
				$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'formCheckout', $scope.formCheckout);		
				$scope.openCustomerEditModal(true);
			}
			//$scope.cid_order_audio.pause();
			//$scope.callPopup($scope.CID_ph_num);
		}
	}
	
	$scope.CIDAccept = function(method){
		//Set shipping method
		$scope.saveInitialShipping(method);
		
		if(!$scope.startup.action){
			$scope.startAction('CALL_ORDER');
		}

		if($scope.callOrder.sound){
			$scope.cid_order_audio.pause();
		}
		if($scope.CIDPopup){
			$scope.CIDPopup.close();
		}
		
		if($scope.loginInfo.user_login){
			$scope.callAction();
		}
	}
	
	$scope.CIDIgnore = function(){
		$scope.CID_ph_num = '';
		if($scope.callOrder.sound){
			$scope.cid_order_audio.pause();
		}
		if($scope.CIDPopup){
			$scope.CIDPopup.close();
			$scope.CIDCustomer = {};
		}
	}
	
	$scope.manual_sync = false;
	$scope.syncDB = function(){
		$scope.manual_sync = true;
		$pouchDB.sync($scope.couchDBUrl);
		$timeout(function() {
			$scope.manual_sync = false;
		}, 5000);
	}
	
	var updateOrder = function (doc) {
		if (doc.data.status == 'processing' || doc.data.status == 'pending') {
			doc = angular.copy($scope.online_order);
			doc.data.updated_at = new Date().toISOString();
			return doc;
		}
		return false; // don't update the doc; it's already been "touched"
	}
	
	var accept_order = function(){
		if($scope.POSSettings.online_default_accept==false && $scope.pos_action.online_action_clicked)return;
		$scope.pos_action.online_action_clicked = true;
		
		var acceptOrder = function(){
			$scope.online_processing = false;
			$scope.online_order.data.status = 'on-hold';
			$scope.online_order.data.updated_at = new Date().toISOString();
			$scope.online_order.data.order_meta.accepted_at = new Date().toISOString();
			$scope.online_order.data.order_meta.processed_by = $scope.terminalData.name;
			$scope.online_order.data.order_meta.ordered_at = new Date().toISOString();
			$scope.online_order.data.order_meta.daily_order_no = $scope.dailyOrderNo.prefix+$scope.dailyOrderNo.num;
			
			if(!$scope.dailyOrderNo.common){
				$scope.dailyOrderNo.num++;
				$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'order_no',$scope.dailyOrderNo);
			}

			loyalty_card.order_amount = $scope.online_order.data.total;
			if(angular.isDefined($scope.online_order.data.payment_details) && $scope.online_order.data.payment_details.method_id =="stripe"){
				$scope.online_order.data.payment_details.paid =true;
			}
			var customer_phone = $scope.online_order.data.billing_address.phone;
			var order_customer = angular.copy($scope.online_order.data.customer);
			var customer_doc = {};
			if(loyalty_card.id!=''){
				//customer_doc = shareData.getCustomer("LOYALTY_CARD",loyalty_card.id);
				//if(angular.isUndefined(customer_doc._id)){
					customer_doc = shareData.getCustomer("PHONE",customer_phone);
				//}
				$scope.loyalty_card.current_points = $scope.salesConversion($scope.online_order.data.line_items,$scope.grand.Discount,true);
				if(shop_loyalty.redeem_amount){
					loyalty_card.reward_points = loyalty_card.current_points+shop_loyalty.points_to_unlock+shop_loyalty.points_to_redeem;
				}else{
					if(angular.isDefined(customer_doc.meta)&&angular.isDefined(customer_doc.meta.loyalty_card_id)){
						if(angular.isDefined(customer_doc.meta.points_to_unlock)){
							loyalty_card.reward_points = loyalty_card.current_points+Number(customer_doc.meta.points_to_redeem)+Number(customer_doc.meta.points_to_unlock);
						}else{
							loyalty_card.reward_points = loyalty_card.current_points;
						}
					}
				}
			}else if(angular.isDefined(order_customer.meta)&&order_customer.meta.docid){
				customer_doc._id = order_customer.meta.docid;
			}
			
			//$scope.print_config.kot = true;
			if(angular.isArray($scope.online_order.data.shipping_lines) && $scope.online_order.data.shipping_lines[0].method_id=='local_delivery'){
				$scope.print_config.copies = $scope.receiptCount.delivery;
			}else{
				$scope.print_config.copies = $scope.receiptCount.collection;
			}
			$scope.print_config.label_needed = true;
			
			$scope.online_order.data.order_meta.earned_points = loyalty_card.current_points;
			$scope.online_order.data.loyalty = {
				current_points : loyalty_card.current_points,
				reward_points : loyalty_card.reward_points,
				reward_money : shop_loyalty.redeem_amount
			}
			
			$scope.printReceipt($scope.online_order.data,false,true);
		
			$pouchDB.upsert($scope.online_order._id,updateOrder).then(function (res) {
				//Store last order
				$scope.lastOrder.order = angular.copy($scope.online_order);
				$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'lastOrder',$scope.lastOrder);

				removeAlert($scope.online_order.data.order_meta.bill_number);
				updateOrderArray($scope.online_order);
				if($rootScope.aiv_info.enable_kitchen == "TRUE"){
					//Sent to kitchen
					delete $scope.online_order["_rev"];
					$scope.online_order.data.order_meta.base_doc = $scope.online_order._id;
					$pouchDBEtc.save($scope.online_order).then(function (result) {
						console.log("Order "+result._id+" Sent to kitchen");
					}).catch(function(error){
						$scope.showCheckoutMsg('Error','Uanble to send this order to Kitchen!!!');
						console.error(error);
					});
				}
				
				//trashOrder();
				if($scope.POSSettings.online_default_accept==false){
				$scope.closeModal('ONLINE_ORDER');
				
				$ionicLoading.show({
					template : '<h2>Order Accepted...</h2>',
					duration : 1300
				});
				}
				else{
				//resetting variables
				$scope.online_order = {};
				
				$scope.pos_action.online_action_clicked = false;
				$scope.online_order_audio.pause();
				$scope.stopOnlineOrderInterval();
				}
				//$scope.closeModal('PAYMENT');
				
				
				
				if(angular.isDefined(customer_doc._id)){
					if(loyalty_card.id && loyalty_card.current_points){
						return $pouchDB.upsert(customer_doc._id,function(doc){
							doc.orders_count = order_customer.orders_count;
							//Add points
							if(angular.isUndefined(doc.meta.points_to_unlock)){
								doc.meta = {
									"loyalty_card_id":loyalty_card.id,
									"points_to_unlock":0,
									"points_to_redeem":0,
									"redeem_amount":0,
									"total_used_points":0,
									"current_redeem_points":0,
									"reward_coupon":"",
									"reward_type":"MONEY",
									"redeem_status":"TRUE",
									"docid":customer_doc._id,
									"shop_id":$rootScope.aiv_info.shop_id
								}
							}else if(!doc.meta.loyalty_card_id){
								doc.meta.loyalty_card_id = loyalty_card.id;
							}
							
							if(shop_loyalty.redeem_amount){
								doc.meta.points_to_unlock = shop_loyalty.points_to_unlock+loyalty_card.current_points;
								doc.meta.points_to_redeem = shop_loyalty.points_to_redeem;
								doc.meta.redeem_amount = shop_loyalty.redeem_amount;
								doc.meta.total_used_points = shop_loyalty.total_used_points;
							}else{
								doc.meta.points_to_unlock = parseInt(doc.meta.points_to_unlock)+loyalty_card.current_points;
							}
							doc.action = "LOY_ADD_PTS";
							return doc;
						});
					}else if(loyalty_card.id && !customer_doc.meta.loyalty_card_id){
						return $pouchDB.upsert(customer_doc._id,function(doc){
							doc.orders_count = order_customer.orders_count;
							//Attach loyalty card to customer
							//Add points
							if(angular.isUndefined(doc.meta.points_to_unlock)){
								doc.meta = {
									"loyalty_card_id":loyalty_card.id,
									"points_to_unlock":0,
									"points_to_redeem":0,
									"redeem_amount":0,
									"total_used_points":0,
									"current_redeem_points":0,
									"reward_coupon":"",
									"reward_type":"MONEY",
									"redeem_status":"TRUE",
									"docid":customer_doc._id,
									"shop_id":$rootScope.aiv_info.shop_id
								}
							}
							if(shop_loyalty.redeem_amount){
								doc.meta.points_to_unlock = shop_loyalty.points_to_unlock+loyalty_card.current_points;
								doc.meta.points_to_redeem = shop_loyalty.points_to_redeem;
								doc.meta.redeem_amount = shop_loyalty.redeem_amount;
								doc.meta.total_used_points = shop_loyalty.total_used_points;
							}else{
								doc.meta.points_to_unlock = parseInt(doc.meta.points_to_unlock)+loyalty_card.current_points;
							}
							doc.meta.loyalty_card_id = loyalty_card.id;
							doc.action = "NO_ACTION";
							return doc;
						});
					}else{
						//Update order count
						return $pouchDB.upsert(customer_doc._id,function(doc){
							doc.orders_count = order_customer.orders_count;
							doc.action = "NO_ACTION";
							return doc;
						});
					}
				}
			}).then(function (res) {
				setTimeout(function() { moreOnlineOrders(); }, 5000);//linu : to delay accepting order for 10s
			}).catch(function (error) {
				// error
				$scope.pos_action.online_action_clicked = false;
				console.error(error);
				$scope.showCheckoutMsg('Error','Oops...An error occurred!!!');
			});
		}
		
		
		var shop_loyalty = {
			points_to_unlock:0,
			points_to_redeem:0,
			redeem_amount:0,
			total_used_points:0
		}
		var loyalty_card = {
			id:'',
			manual_search:false,
			points_added_status:false,
			points_redeem_status:false,
			order_amount:0,
			current_points:0,
			points_to_redeem:0,
			reward_points:0,
			reward_amount:0,
			reward_money:0,
			redeem_status:true,
			assigned:false,
			error:''
		};
		
		if($scope.hf_loyalty.enabled && angular.isDefined($scope.online_order.data.order_meta.loyalty_card_id) && $scope.online_order.data.order_meta.loyalty_card_id!=''){
			loyalty_card.id = $scope.online_order.data.order_meta.loyalty_card_id;
			loyalty_card.current_points = $scope.salesConversion($scope.online_order.data.line_items,$scope.online_order.data.total_discount,true);

			if(angular.isDefined($scope.online_order.data.order_meta.discounts_present) && $scope.online_order.data.order_meta.discounts_present){
				var discountSplit = $scope.online_order.data.order_meta.discounts_present.split(';');
				angular.forEach(discountSplit,function(discount){
					var LDiscountSpit = discount.split('#');
					if(LDiscountSpit.length>1 && LDiscountSpit[0]=='L'){
						//Loyalty discount found
						shop_loyalty.redeem_amount = Number(LDiscountSpit[1]);
					}
				});
			}
		}
		
		if(shop_loyalty.redeem_amount||true){//default true because every accept should follow this , else problem between shops.
			//Has loyalty discount. Fetch shop loyalty from backend
			//Success==false and catch conditions may result in points mismatch
			$scope.show_redeem_btn=false;
			var customer_phone = $scope.online_order.data.billing_address.phone;
			$scope.httpRequest = dataService.getPoints(customer_phone);
			$scope.httpRequest.then(function(res) {
				if(res.Success==1)
				{
					shop_loyalty.points_to_unlock = Number(res.points_to_unlock);
					shop_loyalty.points_to_redeem = Number(res.points_to_redeem);
					shop_loyalty.total_used_points = Number(res.total_used_points);
				}
				
				$scope.httpRequest = null;
				
				getDailyOrderNo(true).then(function(ordernum_data){
					acceptOrder();
				});
			}).catch(function(err){
				$scope.httpRequest = null;
				getDailyOrderNo(true).then(function(ordernum_data){
					acceptOrder();
				});
			})
		}else{
			getDailyOrderNo(true).then(function(ordernum_data){
				acceptOrder();
			});
		}
	}
	$scope.checkDefaultClick = function(needDClick){
		angular.forEach(needDClick, function(item) {
			$scope.onClickOthers(item);
		});
	}
	var proceedOnline = function(){
		$scope.online_order_audio.pause();
		if($scope.online_order.data.status == 'pending'){
			$scope.openPaymentModal();
		}else{
			var customer = angular.copy($scope.online_order.data.customer);
			if(customer.id){
				if(customer.billing_address.phone.length<=10){
					customer.billing_address.phone = "0"+customer.billing_address.phone;
				}else{
					customer.billing_address.phone = "0"+customer.billing_address.phone.substr(-10);
				}
				
				var next_seq = '';
				var docid = '';
				if(angular.isDefined(customer.meta) && angular.isDefined(customer.meta.docid) && customer.meta.docid){
					docid = customer.meta.docid;
				}else{
					next_seq = $scope.terminalData.last_customer_seq?(parseInt($scope.terminalData.last_customer_seq)+1):1;
					docid = "customer_"+$scope.terminalData.prefix+next_seq;
					customer.meta = {
						"loyalty_card_id":$scope.online_order.data.order_meta.loyalty_card_id,
						"points_to_unlock":0,
						"points_to_redeem":0,
						"redeem_amount":0,
						"total_used_points":0,
						"current_redeem_points":0,
						"reward_coupon":"",
						"reward_type":"MONEY",
						"redeem_status":"TRUE",
						"docid":docid,
						"shop_id":$rootScope.aiv_info.shop_id
					}
					customer.action = "WOO_CUST_UPDATE";
				/* 	$pouchDB.upsert($scope.online_order._id,function(doc){
						if(angular.isDefined(doc._id)){
							doc.data.customer.meta= customer.meta;
						}
						return doc;
					}).then(function (res) {
						for(var i=0;i<$scope.allOrders.length;i++){
							if($scope.allOrders[i]._id ==$scope.online_order._id){
								$scope.allOrders[i].data.customer.meta=customer.meta;
							}
						}
					}).catch(function (err) {
						console.log(err);
					}); */
				}
				customer._id = docid;
				$pouchDB.putIfNotExists(customer).then(function (res) {
					accept_order();
					
					if(next_seq != ''){
						return $pouchDB.upsert($scope.terminalData._id,function(doc){
							if(angular.isDefined(doc._id)){
								doc.last_customer_seq = next_seq;
							}
							return doc;
						});
					}
				}).catch(function (err) {
					console.log(err);
					accept_order();
				});
			}else{
				accept_order();
			}
		}
	}
	
	$scope.online_processing = false;
	$scope.online_proceed = false;
	$scope.OWOAccept = function($event){
		var ship_method = '';
		if(!$scope.online_proceed && angular.isDefined($scope.online_order.data.order_meta.delivery_time) && $scope.online_order.data.order_meta.delivery_time){
			var duration = Number($scope.online_order.data.order_meta.duration.split(' ')[0]);
			if($scope.online_order.data.shipping_lines[0].method_id=='local_delivery'){
				ship_method = 'delivery';
				if(duration >= $scope.defaultDuration.delivery){
					$scope.online_proceed = true;
				}
			}else if($scope.online_order.data.shipping_lines[0].method_id=='local_pickup'){
				ship_method = 'collection';
				if(duration >= $scope.defaultDuration.collection){
					$scope.online_proceed = true;
				}
			}
		}else{
			$scope.online_proceed = true;
		}
		
		if(!$scope.online_proceed){
			if($scope.online_order.data.shipping_lines[0].method_id=='local_pickup'){
				var confirmPopup = $ionicPopup.confirm({
					title: 'Select duration',
					cssClass: 'aiv-popup',
					template: '<label>Customer has requested '+ship_method+' at <span>'+$filter('date')(new Date($scope.online_order.data.order_meta.delivery_time),'h:mm a')+'</span> ('+$scope.online_order.data.order_meta.duration+' remaining) which is less than default '+ship_method+' time. Set default duration of '+$scope.defaultDuration.collection+' Minutes OR proceed with this<label>',
					buttons: [{ 
						text: 'Set Default',
						type: 'button-assertive',
						onTap: function(e) {
							return false;
						}
					},{ 
						text: 'Continue',
						type: 'button-positive',
						onTap: function(e) {
							return true;
						}
					}]
				});

				confirmPopup.then(function(res) {
					if(!res) {
						$scope.online_order.data.order_meta.duration = $scope.defaultDuration.collection+' Minutes';
					}
					proceedOnline();
				})
			}else{
				var confirmPopup = $ionicPopup.confirm({
					title: 'Select duration',
					cssClass: 'aiv-popup',
					template: '<label>Customer has requested '+ship_method+' at <span>'+$filter('date')(new Date($scope.online_order.data.order_meta.delivery_time),'h:mm a')+'</span> ('+$scope.online_order.data.order_meta.duration+' remaining) which is less than default '+ship_method+' time. Cancel and select a duration OR proceed with this<label>'
				});

				confirmPopup.then(function(res) {
					if(res) {
						proceedOnline();
					}
				})
			}
		}else{
			proceedOnline();
		}

	}
	
	
	$scope.OWOAcceptSilent = function($event){
		var ship_method = '';
		if(!$scope.online_proceed && angular.isDefined($scope.online_order.data.order_meta.delivery_time) && $scope.online_order.data.order_meta.delivery_time){
			var duration = Number($scope.online_order.data.order_meta.duration.split(' ')[0]);
			if($scope.online_order.data.shipping_lines[0].method_id=='local_delivery'){
				ship_method = 'delivery';
				if(duration >= $scope.defaultDuration.delivery){
					$scope.online_proceed = true;
				}
			}else if($scope.online_order.data.shipping_lines[0].method_id=='local_pickup'){
				ship_method = 'collection';
				if(duration >= $scope.defaultDuration.collection){
					$scope.online_proceed = true;
				}
			}
		}else{
			$scope.online_proceed = true;
		}
		
		if(!$scope.online_proceed){
			 if($scope.online_order.data.shipping_lines[0].method_id=='local_pickup'){
				
				$scope.online_order.data.order_meta.duration = $scope.defaultDuration.collection+' Minutes';
						
				
			}else{
				$scope.online_order.data.order_meta.duration = $scope.defaultDuration.delivery+' Minutes';
				
			}
		}
		proceedOnline();
		

	}
	
	$scope.OWOReject = function(){
		if($scope.pos_action.online_action_clicked)return;
		$scope.pos_action.online_action_clicked = true;
		var confirmPopup = $ionicPopup.confirm({
			title: 'Confirm',
			template: 'Are you sure you want to reject this order?.'
		});

		confirmPopup.then(function(res) {
			if(res) {
				getDailyOrderNo(true).then(function(ordernum_data){
					$scope.online_processing = false;
					$scope.online_order_audio.pause();
					$scope.online_order.data.status = 'cancelled';
					$scope.online_order.data.order_meta.processed_by = $scope.terminalData.name;
					$scope.online_order.data.order_meta.daily_order_no = $scope.dailyOrderNo.prefix+$scope.dailyOrderNo.num;
					$scope.online_order.data.order_meta.accepted_at = new Date().toISOString();
					
					if(!$scope.dailyOrderNo.common){
						$scope.dailyOrderNo.num++;
						$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'order_no',$scope.dailyOrderNo);
					}
					$pouchDB.upsert($scope.online_order._id,updateOrder).then(function (res) {
						removeAlert($scope.online_order.data.order_meta.bill_number);
						updateOrderArray($scope.online_order);
						//trashOrder();
						$scope.closeModal('ONLINE_ORDER');
						$ionicLoading.show({
							template : '<h2>Order Rejected...</h2>',
							duration : 1300
						});
						moreOnlineOrders();
					}).catch(function (error) {
						// error
						console.error(error);
						$scope.pos_action.online_action_clicked = false;
						$scope.showCheckoutMsg('Error','Oops...An error occurred!!!');
					});
				});
			}else{
				$scope.pos_action.online_action_clicked = false;
			}
		});
	}
	
	var moreOnlineOrders = function(force_load = false){
		//$scope.resetLoyaltyFields();
		if($scope.alertArr.length || force_load){
			var find_index = {
				fields: ['data.created_at'],
				name: 'reportindex',
				ddoc: 'reportdesigndoc'
			}

			var find_params = {
				//sort:[{'data.created_at': 'desc'}],
				limit:1
			}
			var find_selector = {
				$and:[
					{"data.created_at": {$lte:new Date().toISOString()}},
					{"data.order_meta.processed_by": "AIVOOT"},
					{"data.status": "processing"}
				]
			}
		/* 	$ionicLoading.show({
				template: '<ion-spinner icon="ios"></ion-spinner><br><span class="aiv-loading">Fetching next order<br>Please wait...</span>',
				animation: 'fade-in',
				showBackdrop: true,
				maxWidth: 300,
				showDelay: 0
			}) */;		
			
			var onlineconfig = {include_docs:true,startkey : 'AIVOOT_', endkey : 'AIVOOT_\ufff0',limit:500};
			$pouchDB.bulkFetch(onlineconfig).then(function(returnData) {
					$ionicLoading.hide();
					if(returnData.rows.length){
					var extractRow =[];
						angular.forEach(returnData.rows,function(row){
							if(row.doc._id.startsWith('AIVOOT_')&&row.doc.data.status==="processing"){
								//$scope.allCustomers.push(row.doc);
								var createdat = new Date(row.doc.data.created_at);
								var start = new Date();
								start.setHours(0,0,0,0);
											
								if(createdat>start)
								{
									extractRow.push(row);
									add2Alert(row.doc.data.order_meta.bill_number);
								}
							}
						});
						var doc = extractRow[0].doc;
						//Show next online order
						if(doc.data.shipping_lines[0].method_id == 'local_delivery'){
							doc.data.order_meta.duration = '40 Minutes';
						}else if(doc.data.shipping_lines[0].method_id == 'local_pickup'){
							doc.data.order_meta.duration = '20 Minutes';
						}
						$scope.online_order = angular.copy(doc);
						//Play soun
						$scope.online_order_audio.play();
						$scope.showOnlineModal();
					}
			}).catch(function (error) {
				console.error(error);
				$ionicLoading.hide();
				$ionicLoading.show({
					template : '<h2>Failed to retrieve next order...</h2>',
					duration : 1300
				});
			});
/* 			$pouchDB.find(find_index,find_selector,find_params).then(function (return_data) {
				$ionicLoading.hide();
				if(return_data.docs.length){
					if(force_load){
						for(var i=0;i<return_data.docs.length;i++){
							add2Alert(return_data.docs[i].data.order_meta.bill_number);
						}
					}
					var doc = return_data.docs[0];
					//Show next online order
					if(doc.data.shipping_lines[0].method_id == 'local_delivery'){
						doc.data.order_meta.duration = '40 Minutes';
					}else if(doc.data.shipping_lines[0].method_id == 'local_pickup'){
						doc.data.order_meta.duration = '20 Minutes';
					}
					$scope.online_order = angular.copy(doc);
					//Play sound
					$scope.online_order_audio.play();
					$scope.showOnlineModal();
				}
			}).catch(function (error) {
				console.error(error);
				$ionicLoading.hide();
				$ionicLoading.show({
					template : '<h2>Failed to retrieve next order...</h2>',
					duration : 1300
				});
			}); */
		}else if(!$scope.CID_ph_num && ($scope.terminalData.type != 'BACK' || ($scope.terminalData.type == 'BACK' && $scope.backTemplate.id != 'MPOS'))){
			//Check if an order is in progress
			if($scope.formCheckout.customer_id == "guest" && !$scope.cartItems.length && 
				($scope.customer_modal == undefined || !$scope.customer_modal._isShown) && 
				($scope.ship_modal == undefined || !$scope.ship_modal._isShown) && 
				($scope.customer_edit_modal == undefined || !$scope.customer_edit_modal._isShown) &&
				($scope.pay_modal == undefined || !$scope.pay_modal._isShown)){
					$scope.show_login_screen(false);
			}
							
		}

	}
	
	$scope.idSelectedItem = {item:null,index:null};
	$scope.pos_input = {quantity : ''};
    $scope.setSelectedItem = function(idSelectedItem,item) {
		if($scope.compulsory_option_mode)return;
		$scope.idSelectedItem.index = idSelectedItem;
		$scope.idSelectedItem.item = item;
		$scope.pos_input.quantity = (item!=null)?item.quantity:'';
    }
	
	$scope.idSelectedSubItem = {item:null,index:null};
	$scope.setSelectedSubItem = function(productIndex,optionIndex,product,key) {
		if($scope.compulsory_option_mode)return;
		$scope.setSelectedItem(productIndex,product);
		$scope.idSelectedSubItem.index = optionIndex;
		$scope.idSelectedSubItem.item = key;
    }
	
	$scope.checkSetSelectedItem = function(idSelectedItem,item) {
		if($scope.compulsory_option_mode)return;
		$scope.setSelectedItem(idSelectedItem,item);
		$scope.exitSub(false);
	}
	$scope.quickSearchItemsUnset = function(){
	$scope.showList =false;
	}
	//Function to search item name from purchase list
	$scope.quickList =[];
	$scope.viewListSearch = [];
	$scope.quickListSearch=[];
	$scope.viewList= angular.copy($scope.getPurchaseItemName);
	 $scope.quickSearchItems = function(input){
	 $scope.viewListSearch =[];
		var result =false;
		if(input.length > 1 && $scope.getPurchaseItemName.length){
		
			for(var i=0;i<$scope.globelPurchseList.length;i++){
				if($scope.globelPurchseList[i].data.purchase_list.length && input.length > 1 && $scope.globelPurchseList.length){
				var itemGet =$scope.globelPurchseList[i].data.purchase_list;
					$scope.quickListSearch = $filter('filter')(itemGet, function(list){
						if(list.item){
							if(list.item.indexOf(input)!=-1){
								$scope.viewListSearch.push({"item":list.item,"quantity":list.quantity,"unit":list.unit,"date":$scope.globelPurchseList[i].data.date});
								$scope.showList =true;
							}
						}else{
							result = false;
						}	
						return result;
					});
					//$scope.viewListSearch.push($scope.quickListSearch);
				}
			}
			
			$scope.quickList = $filter('filter')($scope.getPurchaseItemName, function(list){
			if(list!=null){
				result =  list.indexOf(input)>-1;
				$scope.showList =true;
				}else{
					result = false;
					}	
					return result;
				});
			$scope.viewList = angular.copy($scope.quickList);
			$scope.viewList =$scope.viewList.splice(0,3);
		}
	}
	$scope.showList =false;
	$scope.quickCustomers = [];
	//function to assign search value to variable
	$scope.actionPurchaseList =function(list){
	$scope.formPurchase.item =list;
	}
	$scope.showErrCust =false;
	$scope.quickSearchCustomer = function(input,in_type,assign){
	
	$scope.showErrCust =false;
		$scope.quickCustomers = [];
		//$scope.selected_customer = '';
		var test =(/^\d+$/.test(input))?(input.length ==11):(input.length >2);
		
		if(input.length >2){
			
			if(in_type == 'LOYALTY_CARD'){
				$scope.quickCustomers = $filter('filter')($scope.allCustomers, function(customer){
					return angular.isDefined(customer.meta.loyalty_card_id) && customer.meta.loyalty_card_id && customer.meta.loyalty_card_id==input;
				});
			}else{
				$scope.quickCustomers = $filter('filter')($scope.allCustomers, function(customer){
					//console.log(customer._id);
					var result =false;
					if(customer!=null&&customer.hasOwnProperty('billing_address')&&customer.billing_address.hasOwnProperty('phone')&&customer.hasOwnProperty('first_name'))
					result =  customer.billing_address.phone.indexOf(input)>-1 || customer.first_name.toLowerCase().indexOf(input.toLowerCase())>-1;
					else{
					result = false;
					}
					
					return result;
				});
			}

			if(assign){
				if($scope.quickCustomers.length>1){
			
					//More than 1 matching customer
				}else if($scope.quickCustomers.length){
					//Found matching customer
					$scope.resetLoyaltyFields();
					$scope.actionSearchCustomer(angular.copy($scope.quickCustomers[0]),'CART');
				}else{
					//No customers found
					var customerPopup = $ionicPopup.show({
						template: 'Create new customer?',
						title: 'No customers found',
						scope: $scope,
						buttons: [
						  { text: 'Cancel' },
						  {
							text: '<b>Ok</b>',
							type: 'button-positive',
							onTap: function(e) {
								return true;
							}
						  }
						]
					});

					customerPopup.then(function(res) {
						if(res){
							$scope.quickCustomerEnable =true;
							$scope.aiv_toggles.show_customer_extra = false;
							$scope.openCustomerEditModal(false);
							$scope.closeModal('CUSTOMER');
						}
					});
				}
			}else{
				$scope.viewCustomers = angular.copy($scope.quickCustomers);
			}
		}else{
		 $scope.showErrCust =true;
		}
	}
	
	$scope.dbAccessMsg = "Getting points from cloud...";
	$scope.actionSearchCustomer = function(customer,type){
		$scope.quickCustomerEnable =true;
		$scope.setSelectedCustomer(customer);
		if(type == 'CART'){
			$scope.assignCustomer();
		}else if(type == 'REPORT'){
			$scope.report_filters.customer = customer.first_name;
			$scope.getCashnCarryReport($scope.selected_report_type,false);
		}else if(type == 'VIEW'){
			$scope.selected_customer.reward_points = parseInt($scope.selected_customer.meta.points_to_redeem)+parseInt($scope.selected_customer.meta.points_to_unlock);
			$scope.selected_customer.reward_amount = $scope.rewardConversion($scope.selected_customer.reward_points);
			var shop_name = '';
			$scope.loyalty_dbaccess_status = false;
			$scope.show_redeem_btn=false;
			$scope.httpRequest = dataService.getPoints($scope.selected_customer.billing_address.phone,shop_name);
			$scope.httpRequest.then(function(res) {
				
				if(res.Success==1)
				{
					$scope.loyalty_dbaccess_status = true;
					$scope.selected_customer.reward_points =Number(res.points_to_redeem)+Number(res.points_to_unlock);
					$scope.selected_customer.reward_amount = $scope.rewardConversion($scope.selected_customer.reward_points);
				}
				else
				{
				$scope.dbAccessMsg = "Error in point retrieval!!!";
				}
				$scope.httpRequest = null;
			}).catch(function(err){
				var msg = '';
				if(!err){
					$scope.dbAccessMsg = "No internet connection!!!";
				}else if(angular.isDefined(err.error)){
					if(err.error == "timeout"){
						$scope.dbAccessMsg = "Connection timed out!!!";
					}else{
						$scope.dbAccessMsg = "Request aborted!!!";
					}
				}else{
					$scope.dbAccessMsg = 'postcode not found!!!';
				}
				
				$scope.loyalty_dbaccess_status = false;

				console.log(msg);
				$scope.httpRequest = null;
			})
			
			
			
		}
	}
	
	$scope.product_search = false;
	$scope.product_search_start = false;
	$scope.barcodeScanned = function(input,isbarcode,enterPressedLast){
		var is_number = /^\d+$/.test(input);
		if(input.length > 2 && !is_number){
			$scope.product_search = true;
			$scope.product_search_start = true;
			$scope.aiv_scan_input = input.trim();
			$scope.sel_category = '';
			$scope.sub_categories = {selected:'',items:[],show_as_product:false,subcategory_mode:false};
			$scope.products = [];
			//var dups = [];
			var index = '';
			var search_input = $scope.aiv_scan_input;
			if(isbarcode){
				index = 'barcodeindex';
			}else{
				index = 'productsindex';
				search_input = $scope.aiv_scan_input.toLowerCase();
			}
			
			$pouchDB.query(index,search_input).then(function (res) {
				console.log(res);
				if(!res.rows.length && isbarcode){
					$scope.showCheckoutMsg('No Results','No products found for this barcode');
				}else{
					var temp_products = [];
					angular.forEach(res.rows,function(elems){
						var dups = $filter('filter')(temp_products, {id: elems.value}, false);
						if(!dups.length && angular.isDefined(elems.doc)){
							var products = $filter('filter')(elems.doc.products, {id: elems.value}, false);
							temp_products = temp_products.concat(products);
						}
					});
					
					$scope.products = filter_products($scope.startup.action,temp_products);
					if(isbarcode){
						$scope.onClickProduct($scope.products[0]);
					}
				}
				$scope.product_search_start = false;
				$scope.product_show = true;
				$timeout(function () {},0);
			}).catch(function (error) {
				console.error(error);
				$scope.product_search_start = false;
				$scope.showCheckoutMsg('Error','Oops...An error occurred!!!');
			});
		}
	}
	
	$scope.changeMode = function(edit){
		$rootScope.edit_mode = edit;
	}

	 var switchKeyboard = function(){
		if($rootScope.virtual_key_enable==false)
		{
			$scope.kb_settings_config.openOn = '';
			$scope.kb_config.openOn = '';
			$scope.kb_custom_config.openOn = '';
		}
		else
		{
			$scope.kb_settings_config.openOn = 'focus';
			$scope.kb_config.openOn = 'focus';
			$scope.kb_custom_config.openOn = 'focus';
		}
		return 0;
	}


	if (!angular.isArray($localstorage.getArray(AIV_CONSTANTS.LS_PREFIX+'KeyboardSettings'))) {
		$rootScope.virtual_key_enable = $localstorage.getObject(AIV_CONSTANTS.LS_PREFIX+'KeyboardSettings');
		
	}else {
		$rootScope.virtual_key_enable = true;
		$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'KeyboardSettings',$rootScope.virtual_key_enable);
	}

	switchKeyboard();


	$scope.changeKeyboard = function(edit)
	{
		$rootScope.virtual_key_enable = edit;
		$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'KeyboardSettings',edit);
		switchKeyboard();
		
	}
	var getPurchaseList = function(){
		var config = {include_docs:true,endkey : 'purchaseList_', startkey : 'purchaseList_\ufff0',descending:true};
		$pouchDB.bulkFetch(config).then(function(returnData){
			angular.forEach(returnData.rows,function(data){
				getDBChanges(data.doc,true);
			});
		});
	}
		$timeout(function () {
			getPurchaseList();
		}, 3000);
	
	var getInitialData = function(docs,init){
		var config = {
			keys:docs,
			include_docs: true
		}
		$pouchDB.bulkFetch(config).then(function(returnData){
			angular.forEach(returnData.rows,function(data){
				getDBChanges(data.doc,true);
			});
			
			var docs = [];
			for(var i=0;i<$scope.aiv_terminals.terminals.length;i++){
				docs.push($scope.aiv_terminals.terminals[i].id);
			}
			for(var i=0;i<$scope.all_users.length;i++){
				docs.push($scope.all_users[i]);
			}
			for(var i=0;i<$scope.categories.length;i++){
				if($scope.categories[i].children.length){
					for(var j=0;j<$scope.categories[i].children.length;j++){
						docs.push($scope.categories[i].children[j].slug);
					}
				}else{
					docs.push($scope.categories[i].slug);
				}
			}
			
			if(docs.length){
				options = {
					live: false,
					retry: true,
					doc_ids:docs
				}
				$pouchDB.sync($scope.couchDBUrl,options);
				$pouchDB.startListening();
			}
						
		}).catch(function(error){
			$scope.showCheckoutMsg('Error',"An error occurred while retrieving data");
			console.error(error);
		})
	}
	
	$scope.set_product_color = function(product){
		for(var i=0;i<$scope.cartItems.length;i++){
			if(product.id == $scope.cartItems[i].id){
				return true;//{'background-color':'#e53935'};
			}
		}
		return false;//'';
	}

	$scope.set_options_color = function(item){
		
			if(item.name == $scope.sel_option.name){
				return true;//{'background-color':'#e53935'};
			}
		
		return false;//'';
	}

	$scope.set_attrlinked_color = function(item){
		
			if(item == $scope.selected_attr){
				return true;//{'background-color':'#e53935'};
			}
		
		return false;//'';
	}
	
	
	$scope.createDept = function(dept){
		$scope.settings_error.err = '';
		if(!dept){
			$scope.settings_error.err = "Please enter department name..";
			return;
		}else{
			if($scope.product_depts.indexOf(dept) > -1){
				$scope.settings_error.err = "A department with this name already exists...";
				return;
			}
		}
		$ionicLoading.show({
			template: '<ion-spinner icon="ios"></ion-spinner><br><span class="aiv-loading">Creating product department<br>Please wait...</span>',
			animation: 'fade-in',
			showBackdrop: true,
			maxWidth: 300,
			showDelay: 0
		});
		var depts;
		$pouchDB.get('getDepts').then(function(returnData){
			returnData.data.push(dept);
			depts = returnData.data;
			$scope.dept_receiptCount = [];
			return $pouchDB.save(returnData);
		}).then(function(result){
			$scope.product_depts = angular.copy(depts);
			$ionicLoading.hide();
		}).catch(function(error){
			$scope.settings_error.err = "An error occurred while adding new department...";
			$ionicLoading.hide();
			console.error(error);
		});
	}
	
	$scope.removeDept = function(dept){
		var confirmPopup = $ionicPopup.confirm({
			title: 'Confirm',
			template: 'Are you sure you want to remove this department?.'
		});

		confirmPopup.then(function(res) {
			if(res) {
				$ionicLoading.show({
					template: '<ion-spinner icon="ios"></ion-spinner><br><span class="aiv-loading">Removing product department<br>Please wait...</span>',
					animation: 'fade-in',
					showBackdrop: true,
					maxWidth: 300,
					showDelay: 0
				});
				var depts;
				$pouchDB.get('getDepts').then(function(returnData){
					var index = returnData.data.indexOf(dept);
					if(index > -1)
						returnData.data.splice(index,1);
					depts = returnData.data;
					$scope.dept_receiptCount = [];
					return $pouchDB.save(returnData);
				}).then(function(result){
					$scope.product_depts = angular.copy(depts);
					$ionicLoading.hide();
				}).catch(function(error){
					$scope.settings_error.err = "An error occurred while removing department...";
					$ionicLoading.hide();
					console.error(error);
				});
			}
		});
	}
	
	$scope.createGroup = function(group){
		$scope.settings_error.err = '';
		if(!group){
			$scope.settings_error.err = "Please enter group name..";
			return;
		}else{
			if($scope.product_groups.indexOf(group) > -1){
				$scope.settings_error.err = "A group with this name already exists...";
				return;
			}
		}
		$ionicLoading.show({
			template: '<ion-spinner icon="ios"></ion-spinner><br><span class="aiv-loading">Creating product group<br>Please wait...</span>',
			animation: 'fade-in',
			showBackdrop: true,
			maxWidth: 300,
			showDelay: 0
		});
		var groups;
		$pouchDB.get('getProductGroups').then(function(returnData){
			returnData.data.push(group);
			groups = returnData.data;
			return $pouchDB.save(returnData);
		}).then(function(result){
			$scope.product_groups = angular.copy(groups);
			$ionicLoading.hide();
		}).catch(function(error){
			$scope.settings_error.err = "An error occurred while adding new department...";
			$ionicLoading.hide();
			console.error(error);
		});
	}
	
	$scope.removeGroup = function(group){
		var confirmPopup = $ionicPopup.confirm({
			title: 'Confirm',
			template: 'Are you sure you want to remove this group?.'
		});

		confirmPopup.then(function(res) {
			if(res) {
				$ionicLoading.show({
					template: '<ion-spinner icon="ios"></ion-spinner><br><span class="aiv-loading">Removing product group<br>Please wait...</span>',
					animation: 'fade-in',
					showBackdrop: true,
					maxWidth: 300,
					showDelay: 0
				});
				var groups;
				$pouchDB.get('getProductGroups').then(function(returnData){
					var index = returnData.data.indexOf(group);
					if(index > -1)
						returnData.data.splice(index,1);
					group = returnData.data;
					return $pouchDB.save(returnData);
				}).then(function(result){
					$scope.product_groups = angular.copy(group);
					$ionicLoading.hide();
				}).catch(function(error){
					$scope.settings_error.err = "An error occurred while removing group...";
					$ionicLoading.hide();
					console.error(error);
				});
			}
		});
	}
	
	$scope.createDriver = function(driver_name){
		$scope.settings_error.err = '';
		if(!driver_name){
			$scope.settings_error.err = "Please enter a name...";
			return;
		}else{
			var exists = $filter('filter')($scope.delivery_drivers.drivers,{name:driver_name},true);
			if(exists.length){
				$scope.settings_error.err = "A driver with this name already exists...";
				return;
			}
		}
		$ionicLoading.show({
			template: '<ion-spinner icon="ios"></ion-spinner><br><span class="aiv-loading">Creating driver<br>Please wait...</span>',
			animation: 'fade-in',
			showBackdrop: true,
			maxWidth: 300,
			showDelay: 0
		});
		var drivers = angular.copy($scope.delivery_drivers.drivers);
		$pouchDB.upsert('getDeliveryDrivers',function(doc){
			if(doc != undefined){
				doc.last_id++;
				var driver = {
					name:driver_name,
					id:doc.last_id,
					orders:[]
				};
				doc.drivers.push(driver);
				drivers = angular.copy(doc.drivers);
				return doc;
			}
			return {};
		}).then(function(result){
			$scope.delivery_drivers.drivers = angular.copy(drivers);
			$ionicLoading.hide();
		}).catch(function(error){
			$scope.settings_error.err = "An error occurred while adding new driver...";
			$ionicLoading.hide();
			console.error(error);
		});
	}
	
	$scope.removeDriver = function(driver){
		var confirmPopup = $ionicPopup.confirm({
			title: 'Confirm',
			template: 'Are you sure you want to remove this driver?.'
		});

		confirmPopup.then(function(res) {
			if(res) {
				$ionicLoading.show({
					template: '<ion-spinner icon="ios"></ion-spinner><br><span class="aiv-loading">Removing driver<br>Please wait...</span>',
					animation: 'fade-in',
					showBackdrop: true,
					maxWidth: 300,
					showDelay: 0
				});
				var drivers = angular.copy($scope.delivery_drivers.drivers);
				$pouchDB.upsert('getDeliveryDrivers',function(doc){
					if(doc != undefined){
						for(var i=0;i<doc.drivers.length;i++){
							if(doc.drivers[i].id == driver.id){
								doc.drivers.splice(i,1);
								drivers = angular.copy(doc.drivers);
								break;
							}
						}
						return doc;
					}
					return {};
				}).then(function(result){
					$scope.delivery_drivers.drivers = angular.copy(drivers);
					$ionicLoading.hide();
				}).catch(function(error){
					$scope.settings_error.err = "An error occurred while removing driver...";
					$ionicLoading.hide();
					console.error(error);
				});
			}
		});
	}
	
	$scope.createUserDiscount = function(discount){
		$scope.settings_error.err = '';
		if(!discount){
			$scope.settings_error.err = "Please enter discount value...";
			return;
		}else if($scope.user_discounts.indexOf(discount)>-1){
			$scope.settings_error.err = "This value already exists...";
			return;
		}
		$ionicLoading.show({
			template: '<ion-spinner icon="ios"></ion-spinner><br><span class="aiv-loading">Creating discount<br>Please wait...</span>',
			animation: 'fade-in',
			showBackdrop: true,
			maxWidth: 300,
			showDelay: 0
		});
		var discounts = angular.copy($scope.user_discounts);
		$pouchDB.upsert('getDiscounts',function(doc){
			if(doc != undefined){
				doc.per_discount.push(discount);
				discounts = angular.copy(doc.per_discount);
				return doc;
			}
			return false;
		}).then(function(result){
			$scope.user_discounts = angular.copy(discounts);
			$ionicLoading.hide();
		}).catch(function(error){
			$scope.settings_error.err = "An error occurred while adding new discount...";
			$ionicLoading.hide();
			console.error(error);
		});
	}
	
	$scope.removeUserDiscount = function(discount){
		var confirmPopup = $ionicPopup.confirm({
			title: 'Confirm',
			template: 'Are you sure you want to remove this value?.'
		});

		confirmPopup.then(function(res) {
			if(res) {
				$ionicLoading.show({
					template: '<ion-spinner icon="ios"></ion-spinner><br><span class="aiv-loading">Removing discount<br>Please wait...</span>',
					animation: 'fade-in',
					showBackdrop: true,
					maxWidth: 300,
					showDelay: 0
				});
				var discounts = angular.copy($scope.user_discounts);
				$pouchDB.upsert('getDiscounts',function(doc){
					if(doc != undefined){
						for(var i=0;i<doc.per_discount.length;i++){
							if(doc.per_discount[i] == discount){
								doc.per_discount.splice(i,1);
								discounts = angular.copy(doc.per_discount);
								break;
							}
						}
						return doc;
					}
					return false;
				}).then(function(result){
					$scope.user_discounts = angular.copy(discounts);
					$ionicLoading.hide();
				}).catch(function(error){
					$scope.settings_error.err = "An error occurred while removing discount...";
					$ionicLoading.hide();
					console.error(error);
				});
			}
		});
	}

	$scope.createSMSTemplate = function(template){
		$scope.settings_error.err = '';
		if(!template){
			$scope.settings_error.err = "Please enter message content ..";
			return;
		}else{
			if($scope.SMSTemplates.indexOf(template) > -1){
				$scope.settings_error.err = "A template with this content already exists...";
				return;
			}
		}
		$ionicLoading.show({
			template: '<ion-spinner icon="ios"></ion-spinner><br><span class="aiv-loading">Creating template<br>Please wait...</span>',
			animation: 'fade-in',
			showBackdrop: true,
			maxWidth: 300,
			showDelay: 0
		});

		var templates = angular.copy($scope.SMSTemplates);
		$pouchDB.upsert('getSMSTemplates',function(doc){
			if(doc != undefined){
				doc.templates.push(template);
				templates = angular.copy(doc.templates);
				return doc;
			}
			return {};
		}).then(function(result){
			$scope.SMSTemplates = angular.copy(templates);
			$ionicLoading.hide();
		}).catch(function(error){
			console.error(error);
			$scope.settings_error.err = "An error occurred while adding new template...";
			$ionicLoading.hide();
		});
	}
	
	$scope.removeSMSTemplate = function(msg){
		var confirmPopup = $ionicPopup.confirm({
			title: 'Confirm',
			template: 'Are you sure you want to remove this template?.'
		});

		confirmPopup.then(function(res) {
			if(res) {
				$ionicLoading.show({
					template: '<ion-spinner icon="ios"></ion-spinner><br><span class="aiv-loading">Removing template<br>Please wait...</span>',
					animation: 'fade-in',
					showBackdrop: true,
					maxWidth: 300,
					showDelay: 0
				});
				var templates = angular.copy($scope.SMSTemplates);
				$pouchDB.upsert('getSMSTemplates',function(doc){
					if(doc != undefined){
						var index = doc.templates.indexOf(msg);
						if(index > -1){
							doc.templates.splice(index,1);
							templates = angular.copy(doc.templates);
						}
						return doc;
					}
					return {};
				}).then(function(result){
					$scope.SMSTemplates = angular.copy(templates);
					$ionicLoading.hide();
				}).catch(function(error){
					$scope.settings_error.err = "An error occurred while removing template...";
					$ionicLoading.hide();
					console.error(error);
				});
			}
		});
	}

	$scope.createTable = function(table){
		$scope.settings_error.err = '';
		if(!table.number){
			$scope.settings_error.err = "Please enter table number..";
			return;
		}else if(!table.seats){
			$scope.settings_error.err = "Please enter seating capacity..";
			return;
		}else if(table.shape =='--select options--'){
			$scope.settings_error.err = "Please select  table shape..";
			return;
		}else if(!table.table_loc ){
			$scope.settings_error.err = "Please select  table layout..";
			$scope.table_view='LAYOUT';
			return;
		}else{
			var exists = $filter('filter')($scope.aiv_tables,{number:table.number},true);
			if(exists.length){
				$scope.settings_error.err = "A table with this number already exists...";
				return;
			}
		}
		
		$ionicLoading.show({
			content: '<ion-spinner icon="ios"></ion-spinner><br><span>Creating table<br>Please wait...</span>',
			animation: 'fade-in',
			showBackdrop: true,
			maxWidth: 300,
			showDelay: 0
		});
		
		var postData = {};
		postData.type = "CREATE";
		postData.table = angular.copy(table);
		
		//Updating table pool
		$scope.httpRequest = dataService.updateDoc($scope.couchDBUrl+"/_design/updategetTables/_update/tables/getTables", postData);
		$scope.httpRequest.then(function(returnData) {
			console.log(returnData);
			$ionicLoading.hide();
			if(returnData.Success){
				// var index = returnData.Data.tables.length-1;
				//$scope.aivTableInfo[$scope.aiv_table.table_loc.row][$scope.aiv_table.table_loc.col] = {"number":$scope.aiv_table.number,"shape":$scope.aiv_table.shape,"status":$scope.aiv_table.status,"selected":true,"lock":$scope.aiv_table.lock,"index":index};
				$scope.aiv_tables = angular.copy(returnData.Data.tables);
				$scope.aiv_table = {number:'',seats:'',shape:$scope.table_shape[0],status:'empty',cover:'',server:'',table_loc:'',activity:[],orders:[],lock:false};
				$scope.initalizeTable();
			}else{
				if(returnData.Message){
					$scope.settings_error.err = returnData.Message;
				}else{
					$scope.settings_error.err = "An error occurred while adding new table...";
				}
			}
			$scope.table_view='LAYOUT';
		}).catch(function(err){
			var msg = '';
			if(!err){
				$scope.settings_error.err = "No connection!!!";
			}else if(angular.isDefined(err.error)){
				if(err.error == "timeout"){
					$scope.settings_error.err = "Failed to create table due to slow internet connection";
				}else{
					$scope.settings_error.err = "Failed to create table.Request aborted!!!";
				}
			}else{
				$scope.settings_error.err = "Failed to create table";
			}
			console.error(err);
			$scope.table_view='LAYOUT';
			$ionicLoading.hide();
		})
	}
	
	$scope.deleteTable = function(table,row,col){
		var confirmPopup = $ionicPopup.confirm({
			title: 'Confirm',
			template: 'Are you sure you want to remove this table?.'
		});

		confirmPopup.then(function(res) {
			if(res) {
				$ionicLoading.show({
					content: '<ion-spinner icon="ios"></ion-spinner><br><span>Removing table<br>Please wait...</span>',
					animation: 'fade-in',
					showBackdrop: true,
					maxWidth: 300,
					showDelay: 0
				});
				
				var postData = {};
				postData.type = "DELETE";
				postData.table = angular.copy(table);
				
				//Updating table pool
				$scope.httpRequest = dataService.updateDoc($scope.couchDBUrl+"/_design/updategetTables/_update/tables/getTables", postData);
				$scope.httpRequest.then(function(returnData) {
					console.log(returnData);
					$ionicLoading.hide();
					if(returnData.Success){
						//$scope.aivTableInfo[row][col] = {"number":"","shape":"","status":"","selected":"","lock":false,"index":-1};
						$scope.aiv_tables = angular.copy(returnData.Data.tables);
						$scope.initalizeTable();
					}else{
						if(returnData.Message){
							$scope.settings_error.err = returnData.Message;
						}else{
							$scope.settings_error.err = "An error occurred while removing table...";
						}
					}
				}).catch(function(err){
					var msg = '';
					if(!err){
						$scope.settings_error.err = "No connection!!!";
					}else if(angular.isDefined(err.error)){
						if(err.error == "timeout"){
							$scope.settings_error.err = "Failed to remove table due to slow internet connection";
						}else{
							$scope.settings_error.err = "Failed to remove table.Request aborted!!!";
						}
					}else{
						$scope.settings_error.err = "Failed to remove table";
					}
					console.error(err);
					$ionicLoading.hide();
				})
			}
		});
	}
	
	$scope.kitchencart = [];
	$scope.add2action = function(sel_order){
		var order = angular.copy(sel_order);
		var index = -1;
		for(var i=0;i<$scope.kitchencart.length;i++){
			if(order.data.order_meta.bill_number == $scope.kitchencart[i].data.order_meta.bill_number){
				index = i;
				break;
			}
		}
		
		if(index > -1){
			$scope.kitchencart.splice(index,1);
		}else{
			$scope.kitchencart.push(order);
		}
		
		if($scope.kitchencart.length){
			$scope.kitchen_selected_order = $scope.kitchencart[$scope.kitchencart.length-1];
		}else{
			$scope.kitchen_selected_order = '';
		}
	}
	
	$scope.set_order_color = function(order){
		for(var i=0;i<$scope.kitchencart.length;i++){
			if(order.data.order_meta.bill_number == $scope.kitchencart[i].data.order_meta.bill_number){
				return {'border': '2px solid #ff9b93'};
			}
		}
		return '';
	}
	
	$scope.set_order_selected = function(order){
		for(var i=0;i<$scope.kitchencart.length;i++){
			if(order.data.order_meta.bill_number == $scope.kitchencart[i].data.order_meta.bill_number){
				return true;
			}
		}
		return false;
	}
	
	var aiv_colors = ['#E040FB','#2196F3','#EF5350','#EC407A','#43A047','#EF6C00','#5F52B7','#0BABB8'];
	$scope.set_label_color = function(index){
		var color = aiv_colors[Math.floor(Math.random()*aiv_colors.length)];
		return {'background-color': '2px solid '+color};
	}
	
	$scope.setCookingStatus = function(){
		var reopened = [];
		if($scope.kitchencart.length){
			for(var i=0;i<$scope.kitchencart.length;i++){
				if($scope.kitchencart[i].data.status == "re-opened"){
					reopened.push($scope.kitchencart[i].data.order_meta.bill_number);
					$scope.kitchencart.splice(i,1);
					i--;
				}
			}
			$ionicLoading.show({
				template: '<ion-spinner icon="ios"></ion-spinner><br><span class="aiv-loading">Updating cooking status<br>Please wait...</span>',
				animation: 'fade-in',
				showBackdrop: true,
				maxWidth: 300,
				showDelay: 0
			});
			
			var setprocessing = function (doc) {
				if (doc.data.status == 'on-hold') {
					doc.data.updated_at = new Date().toISOString();
					doc.data.status = "sent-to-kitchen";
					return doc;
				}
				return false; // don't update the doc; it's already been "touched"
			}
		
			Promise.all($scope.kitchencart.map(function (row) {
				return $pouchDBEtc.upsert(row._id,setprocessing);
			})).then(function (result) {
				for(var i=0;i<$scope.kitchencart.length;i++){
					for(var j=0;j<$scope.kitchenOrders.length;j++){
						if($scope.kitchencart[i].data.order_meta.bill_number == $scope.kitchenOrders[j].data.order_meta.bill_number){
							$scope.kitchenOrders[j].data.status = "sent-to-kitchen";
							break;
						}
					}
				}
				$scope.kitchencart = [];
				$ionicLoading.hide();
			}).catch(function (error) {
				console.log(error);
				$scope.showCheckoutMsg('Error','An error occured while updating orders');
				$ionicLoading.hide();
			});
			
			if(reopened.length){
				if(reopened.length > 1){
					$scope.showCheckoutMsg('Warning','Orders '+reopened.join()+' are locked for editing from POS. Please save edited orders from POS and continue');
				}else{
					$scope.showCheckoutMsg('Warning','Order '+reopened.join()+' is locked for editing from POS. Please save edited order from POS and continue');
				}
			}
			
		}else{
			$ionicLoading.show({
				template : '<h2>Please select an order...</h2>',
				duration : 500
			});
		}
	}
	
	$scope.kitchen_selected_order = '';
	$scope.viewKitchenOrder = function(){
		if($scope.kitchen_selected_order){
			switch($scope.kitchen_selected_order.data.status){
				case 'completed':$scope.kitchen_selected_order.data.status_text="Completed";break;
				case 'on-hold':$scope.kitchen_selected_order.data.status_text="Waiting for Chef";break;
				case 'sent-to-kitchen':$scope.kitchen_selected_order.data.status_text="Cooking";break;
				case 're-opened':$scope.kitchen_selected_order.data.status_text="Editing from POS";break;
			}
			
			$ionicModal.fromTemplateUrl('kitchen-order-modal.html', {
				id:'KITCHEN_ORDER_MODAL',
				scope: $scope,
				backdropClickToClose: false,
				animation: 'none'
			}).then(function(modal) {
				$scope.kitchen_order_modal = modal;
				$scope.openModal('KITCHEN_ORDER_MODAL');
			});
		}else{
			$ionicLoading.show({
				template : '<h2>Please select an order...</h2>',
				duration : 500
			});
		}
	}
	
	$scope.setReadyStatus = function(){
		var not_ready = false;
		var reopened = [];
		var orders = [];
		if($scope.kitchencart.length){
			for(var i=0;i<$scope.kitchencart.length;i++){
				if($scope.kitchencart[i].data.status == "sent-to-kitchen" || $scope.kitchencart[i].data.status == "on-hold"){
					$scope.kitchencart[i].data.status = "kitchen-ready";
				}else if($scope.kitchencart[i].data.status == "re-opened"){
					reopened.push($scope.kitchencart[i].data.order_meta.bill_number);
					$scope.kitchencart.splice(i,1);
					i--;
				}else{
					$scope.kitchencart.splice(i,1);
					not_ready = true;
					i--;
				}
			}
			
			var setready = function (doc) {
				if (doc.data.status == 'sent-to-kitchen' || doc.data.status == "on-hold" || doc.data.status == "kitchen-ready") {
					doc.data.updated_at = new Date().toISOString();
					doc.data.status = "kitchen-ready";
					for(var j=0;j<doc.data.line_items.length;j++){
						if(angular.isDefined(doc.data.line_items[j].dept) && $scope.terminalData.dept.indexOf(doc.data.line_items[j].dept)>-1){
							doc.data.line_items[j].status = "READY";
						}
					}
					return doc;
				}
				return false; // don't update the doc; it's already been "touched"
			}

			if($scope.kitchencart.length){
				$ionicLoading.show({
					template: '<ion-spinner icon="ios"></ion-spinner><br><span class="aiv-loading">Updating status<br>Please wait...</span>',
					animation: 'fade-in',
					showBackdrop: true,
					maxWidth: 300,
					showDelay: 0
				});
				Promise.all($scope.kitchencart.map(function (row) {
					return $pouchDBEtc.upsert(row._id,setready);
				})).then(function (result) {
					for(var i=0;i<$scope.kitchencart.length;i++){
						for(var j=0;j<$scope.kitchenOrders.length;j++){
							if($scope.kitchencart[i].data.order_meta.bill_number == $scope.kitchenOrders[j].data.order_meta.bill_number){
								for(var k=0;k<$scope.kitchencart[i].data.line_items.length;k++){
									var prdt_name = $scope.kitchencart[i].data.line_items[k].title || $scope.kitchencart[i].data.line_items[k].name;
									if($scope.kitchenProducts[prdt_name] != undefined){
										$scope.kitchenProducts[prdt_name]-=$scope.kitchencart[i].data.line_items[k].quantity;
									}
									if($scope.kitchenProducts[prdt_name]<=0){
										delete $scope.kitchenProducts[prdt_name];
									}
								}
								
								removeAlert($scope.kitchencart[i].data.order_meta.bill_number);
								$scope.kitchenOrders.splice(j,1);
								break;
							}
						}
					}

					$scope.kitchencart = [];
					$ionicLoading.hide();
				}).catch(function (error) {
					console.log(error);
					$scope.showCheckoutMsg('Error','An error occured while updating orders');
					$ionicLoading.hide();
				});
			}
			
			if(not_ready){
				$ionicLoading.show({
					template : '<h2>Some orders are not selected for cooking...</h2>',
					duration : 700
				});
			}
			
			if(reopened.length){
				if(reopened.length > 1){
					$scope.showCheckoutMsg('Warning','Orders '+reopened.join()+' are locked for editing from POS. Please save edited orders from POS and continue');
				}else{
					$scope.showCheckoutMsg('Warning','Order '+reopened.join()+' is locked for editing from POS. Please save edited order from POS and continue');
				}
			}
		}else{
			$ionicLoading.show({
				template : '<h2>Please select an order...</h2>',
				duration : 500
			});
		}
	}
	
	$scope.readyAllOrders = function(){
		var confirmPopup = $ionicPopup.confirm({
			title: 'Warning',
			template: 'Are you sure you want to mark all orders as READY? Please restart this terminal after this operation'
		});

		confirmPopup.then(function(res) {
			if(res) {
				var setready = function (doc) {
					if (doc.data.status == 'sent-to-kitchen' || doc.data.status == "on-hold" || doc.data.status == "kitchen-ready") {
						var count = 0;
						for(var j=0;j<doc.data.line_items.length;j++){
							if(angular.isDefined(doc.data.line_items[j].dept) && $scope.terminalData.dept.indexOf(doc.data.line_items[j].dept)>-1 && !doc.data.line_items[j].status){
								doc.data.line_items[j].status = "READY";
								count++;
							}
						}
						
						if(count){
							doc.data.updated_at = new Date().toISOString();
							doc.data.status = "kitchen-ready";
							return doc;
						}else{
							return false;
						}
					}
					return false; // don't update the doc; it's already been "touched"
				}
				
				var find_index = {
					fields: ['data.updated_at'],
					name: 'reportindex',
					ddoc: 'reportdesigndoc'
				}

				find_params = {}
				
				var find_selector = {
					$and:[
						{"data.updated_at": {$lte:new Date().toISOString()}},
						{$or: [
							{"data.status": "sent-to-kitchen"},
							{"data.status": "on-hold"},
							{"data.status": "kitchen-ready"}
						]}
					]
				}

				$ionicLoading.show({
					template: '<ion-spinner icon="ios"></ion-spinner><br><span class="aiv-loading">Updating status<br>Please wait...</span>',
					animation: 'fade-in',
					showBackdrop: true,
					maxWidth: 300,
					showDelay: 0
				});
						
				$pouchDBEtc.find(find_index,find_selector,find_params).then(function (res) {
					return Promise.all(res.docs.map(function (row) {
						return $pouchDBEtc.upsert(row._id,setready);
					}));
				}).then(function (result) {
					$scope.kitchenOrders = [];
					$scope.kitchenProducts = {};
					$scope.alertArr = [];
					$ionicLoading.hide();
				}).catch(function (error) {
					$scope.settings_error.err = 'Oops...An error occurred!!!';
					console.error(error);
					$ionicLoading.hide();
				});
			}
	   });
		
	}
	
	$scope.scrollTo = function(id,type){
		$location.hash('order_'+id);
		if(type == 'KITCHEN_TOP'){
			$ionicScrollDelegate.$getByHandle('topKitchenScroll').anchorScroll(true);
		}else if(type == 'KITCHEN_BOTTOM'){
			$ionicScrollDelegate.$getByHandle('bottomKitchenScroll').anchorScroll(true);
		}
	}
	
	$scope.onPriority = function(order){
		order.data.order_meta.on_priority = true;
		add2Alert(order.data.order_meta.bill_number);
		//console.log("Order "+order.data.order_meta.bill_number+" on priority");
	}
	
	$scope.$on('timer-tick', function (event, args) {
		var timeCount = args.timerElement.innerText || args.timerElement.textContent;
		var mnts = timeCount.split(':'); // split it at the colons
		if(mnts.length > 2){
			// minutes are worth 60 seconds. Hours are worth 60 minutes.
			var seconds = (+mnts[0]) * 60 * 60 + (+mnts[1]) * 60 + (+mnts[2]);
			if(seconds <= 120){//Order deadline alert
				var order_num = args.timerElement.id.split('_');
				if(order_num.length){
					for(var j=0;j<$scope.kitchenOrders.length;j++){
						if(order_num[1] == $scope.kitchenOrders[j].data.order_meta.bill_number){
							$scope.kitchenOrders[j].data.order_meta.on_priority = true;
							add2Alert(order_num[1]);
							$timeout(function(){},0);
							break;
						}
					}
				}
			}
		}
	});
	
	$scope.kitchen_menu = {products : false};
	$scope.showPriorityOrders = function(item){
		/*for(var j=0;j<$scope.kitchenOrders.length;j++){
			if(item == $scope.kitchenOrders[j].data.order_meta.bill_number){
				if(!$scope.kitchenOrders[j].data.shipping_methods){
					$scope.scrollTo(item,'KITCHEN_TOP');
				}else{
					$scope.scrollTo(item,'KITCHEN_BOTTOM');
				}
				break;
			}
		}*/
		$scope.scrollTo(item,'KITCHEN_BOTTOM');
		
		$scope.hideKitchenDropdown();
		removeAlert(item);
	}
	
	$scope.dept_changed = false;
	$scope.toggleDept = function(dept,terminal){
		var idx = terminal.dept.indexOf(dept);
		if(idx > -1){
			terminal.dept.splice(idx, 1);
		}else{
			terminal.dept.push(dept);
		}
		$scope.dept_changed = true;
	}
			
	$scope.ip_validated = true;
	$scope.setLocalIp = function(type){
		$scope.ip_validated = false;
		$scope.settings_error.err = $scope.settings_error.pass = '';
		var ip_regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
		var ip = '',db = '';
		if(type == "PRIMARY"){
			ip = $scope.settings_data.localdb_ip;
			db = AIV_CONSTANTS.REMOTE_DB;
		}else{
			ip = $scope.settings_data.local_ip;
			db = AIV_CONSTANTS.SECOND_DB;
		}
		if(!ip || !ip_regex.test(ip)){
			$scope.settings_error.err = "Please enter a valid IP address...";
			return false;
		}
						
		$ionicLoading.show({
			template: '<ion-spinner icon="ios"></ion-spinner><br><span class="aiv-loading">Trying to connect.Please wait...</span>',
			animation: 'fade-in',
			showBackdrop: true,
			maxWidth: 300,
			showDelay: 0
		});
		
		var db_url = createDBUrl(ip,db);
		dataService.checkUrl(db_url).then(function(res) {
			$ionicLoading.hide();
			console.log(res);
			$scope.ip_validated = true;
			if(type == "PRIMARY"){
				$scope.localdb_ip = ip;
				$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'localdb_ip',$scope.localdb_ip);
				reloadApp();
			}else{
				$scope.settings_error.pass = "Connection is good...Please save settings";
			}
		}).catch(function(error){
			if(type == "PRIMARY"){
				$scope.settings_error.err = "Unable to find this address!!!";
				$scope.showdbPopup();
			}else{
				$scope.showCheckoutMsg('Not Found','Unable to find this address!!!');
			}
			$ionicLoading.hide();
			console.error(error);
		})
		
		return true;
	}
	
	$scope.loginEnter = function(event,pass){
		/*if(event.keyCode==13 && $scope.login(pass)){
			$scope.onKeyboardClick('pass');
			//Enter key pressed
		}*/
		if(event.keyCode==13){
			$scope.login(pass);
			//Enter key pressed
		}
	}
	
	$scope.clock_loginEnter = function(event,pass){
		if(event.keyCode==13){
			if($scope.clock_user){
				if($scope.IsPasswordMatching(clock_user._id,pass)){
					$scope.clockStatus($scope.aiv_users.clock_in,false);
				}else{
					$scope.aiv_users.err = 'Incorrect password!!!';
				}
			}else{
				$scope.aiv_users.err = 'Please select a user!!!';
			}
			//Enter key pressed
		}
	}
	
	
	
	$scope.onKeyboardClick = function(id){
		var keyboard = ngVirtualKeyboardService.getKeyboardById(id);
		if (keyboard) {
			if (keyboard.isOpen) {
				keyboard.close();
			} else {
				keyboard.reveal();
			}
		}
	};
	
	$scope.show_sub = {'cook_inst':false};
	$scope.addInstructions = function(){
		if($scope.idSelectedItem.index == null){
			$ionicLoading.show({
				template : '<h2>Please add items to cart...</h2>',
				duration : 700
			});
		}else{
			$scope.show_sub.cook_inst = true;
			$scope.var_copy.current_options = angular.copy($scope.current_options);
			$scope.var_copy.current_display_options = angular.copy($scope.current_display_options);
			$scope.var_copy.display_options_tooptions = angular.copy($scope.display_options_tooptions);
			$scope.current_options = {};
			$scope.current_display_options = {};
			$scope.display_options_tooptions={};
			$scope.sel_product = $scope.idSelectedItem.item;
			var product = $scope.idSelectedItem.item;
			$scope.sel_variations = {};
			$scope.sel_product_price = parseFloat(product.price);
		    $scope.filtered_attributes = {part:{},option:[]};
			if($scope.sel_product.hasOwnProperty("sel_variations"))
			{
				if($scope.sel_product.sel_variations.hasOwnProperty("attributes"))
				{
					$scope.current_options = angular.copy($scope.sel_product.sel_variations.attributes);
					$scope.sel_variations = angular.copy($scope.sel_product.sel_variations);
					if($scope.sel_product.sel_variations.hasOwnProperty("attributestoshow"))
					{
						
						
					}
					$scope.current_display_options = $scope.processDisplay($scope.sel_product.sel_variations.attributes);
					
				}
				$scope.sel_product_price = parseFloat(product.sel_variations.price);
			}
			
			
			
			//cook_instructions
			var needDClick =[];
			$scope.otheroptions=[];
			arraytofill=$scope.otheroptions;
			
			var parentki = {"slug":"KI###PH","title":"CookInst"};
			
			angular.forEach($scope.cook_instructions, function(item) {
				
				var itemdetails = {}; 
				itemdetails["title"]= item.split(AIV_CONSTANTS.OPTION_SEPARATOR)[0];
				itemdetails["stitle"]= $scope.getShowName(itemdetails.title);
				itemdetails["color"]= $scope.getColor(item.split(AIV_CONSTANTS.OPTION_SEPARATOR)[1]);
				itemdetails["type"]= "SUB";
				itemdetails["raw"]=item;
				itemdetails["parent"]=parentki;
				arraytofill.push(itemdetails);
				if(item.split(AIV_CONSTANTS.OPTION_SEPARATOR)[1].includes('D'))
				{
					needDClick.push(itemdetails);
				}
				
				//$scope.current_options[item.name] = '';
			}, $scope.current_options);
			
			
			
			$scope.checkDefaultClick(needDClick);
			$scope.product_show = false;
			
			
		}
	}
	
	$scope.clickParent= function(category,navigate)
	{
		$scope.otheroptions=[];
		angular.forEach(category.children, function(item) {
				/*var opt = item.options[0];
				$scope.current_options[item.name] = opt;
				var value = opt.match(/\(([^)]+)\)/);
				if(value != null && value.length > 1){
					$scope.sel_product_price+= parseFloat(value[1]);
				}*/
				var itemdetails = {}; 
				itemdetails["title"]= item.name;
				itemdetails["stitle"]= item.name;
				itemdetails["color"]= $scope.getColor('B');
				itemdetails["type"]= "CAT";
				itemdetails["raw"]=item;
				itemdetails["parent"]=category;
				$scope.otheroptions.push(itemdetails);
				//$scope.current_options[item.name] = '';
			}, $scope.current_options);
	}
	
	$scope.getColor = function(colorstr){
	var color ="#3949AB";
		if(colorstr.includes("G") )
		{
		//green
			color = "#1B5E20";
		}
		if(colorstr.includes("O") )
		{
		//Orange
			color = "#BF360C";
		}
		if(colorstr.includes("V") )
		{
		//Violet
			color = "#512DA8";
		}
		if(colorstr.includes("B") )
		{
		//blue
			color = "#3949AB";
		}
		if(colorstr.includes("R") )
		{
		//brown
			color = "#73160f";
		}
		if(colorstr.includes("P") )
		{
		//pink
			color = "#f17676";
		}
		if(colorstr.includes("Y"))
		{
			//light brown
			color = "#795548";
		}
		
		//default options
		if(colorstr.includes("F") )
		{
		//dark gray
		 color = "#BF360C";
		}
		
		return color;
		
	}

	$scope.compulsory_option_mode = false;
	$scope.editProductOptions = function(){
		if($scope.idSelectedItem.index == null){
			$ionicLoading.show({
				template : '<h2>Please add items to cart...</h2>',
				duration : 700
			});
		}else{
			$scope.var_copy.current_options = angular.copy($scope.current_options);
			$scope.var_copy.current_display_options = angular.copy($scope.current_display_options);
			$scope.var_copy.display_options_tooptions = angular.copy($scope.display_options_tooptions);
			$scope.current_options = {};
			$scope.current_display_options = {};
			$scope.display_options_tooptions={};
			$scope.selected_attr_add='';
			$scope.sel_product = $scope.idSelectedItem.item;
			var product = $scope.idSelectedItem.item;
			$scope.sel_variations = {};
			$scope.sel_product_price = get_product_price(product,false);
		    $scope.filtered_attributes = {part:{},option:[]};
			if($scope.sel_product.hasOwnProperty("sel_variations"))
			{
				if($scope.sel_product.sel_variations.hasOwnProperty("attributes"))
				{
					$scope.current_options = angular.copy($scope.sel_product.sel_variations.attributes);
					$scope.sel_variations = angular.copy($scope.sel_product.sel_variations);
					if($scope.sel_product.sel_variations.hasOwnProperty("attributestoshow"))
					{
						
						
					}
					$scope.current_display_options = $scope.processDisplay($scope.sel_product.sel_variations.attributes);
					
				}
				$scope.sel_product_price = parseFloat(product.sel_variations.price);
			}
			
			var pre_option = '';
			angular.forEach(product.attributes, function(item) {
				var nameArr = item.slug.split(AIV_CONSTANTS.OPTION_SEPARATOR);
				//Check if this option is for POS
				if(nameArr.length > 1 && !nameArr[1].includes("W") ){
					if(nameArr[0].startsWith('-')){
						//Linked option
						var linked = {};
						//linked[nameArr[0].substr(1)] = item.options;
						//$scope.filtered_attributes['part'] = linked;
						$scope.filtered_attributes['option'][$scope.filtered_attributes.option.length-1]['linked'][item.slug] = item.options;
					}else{
						//Normal option
						item['keyhidden']=false;
						if(nameArr[1].includes("H") )
						{
							item.keyhidden = true
						}

						item['linked']={};
						$scope.filtered_attributes['option'].push(item);
					}
				}
			}, $scope.filtered_attributes);
			
			angular.forEach($scope.filtered_attributes.option, function(item) {
				/*var opt = item.options[0];
				$scope.current_options[item.name] = opt;
				var value = opt.match(/\(([^)]+)\)/);
				if(value != null && value.length > 1){
					$scope.sel_product_price+= parseFloat(value[1]);
				}*/
				var itemSplit = item.name.split(AIV_CONSTANTS.OPTION_SEPARATOR);
				item["fname"]=item.name;
				if(itemSplit.length > 0){
					item.name = itemSplit[0];
				}
				//$scope.current_options[item.name] = '';
			}, $scope.current_options);
			//console.log(product.productOptions);
			$scope.sel_variations.price = parseFloat($scope.sel_product_price.toFixed(2));

			$scope.sel_variations.attributes = $scope.current_options;
			
			
			//$scope.otheroptions = filtered_attributes.option[0].options;
			$scope.otheroptions=[];
			var arraytofill=[];
			arraytofill['prev']=null;
			var needDClick =[];
			
			
			angular.forEach($scope.filtered_attributes.option, function(option) {
			
			if(arraytofill.length==0)
			{
				arraytofill=$scope.otheroptions;
			}
			else
			{
				arraytofill['next']=[];			
				arraytofill.next['prev']=arraytofill
				arraytofill=arraytofill.next;
				
			}
			
			
			angular.forEach(option.options, function(item) {
				/*var opt = item.options[0];
				$scope.current_options[item.name] = opt;
				var value = opt.match(/\(([^)]+)\)/);
				if(value != null && value.length > 1){
					$scope.sel_product_price+= parseFloat(value[1]);
				}*/
				var itemdetails = {}; 
				itemdetails["title"]= item.split(AIV_CONSTANTS.OPTION_SEPARATOR)[0];
				
				if(!itemdetails.title.includes("None"))
				{
				itemdetails["stitle"]= $scope.getShowName(itemdetails.title);
				itemdetails["color"]= $scope.getColor(item.split(AIV_CONSTANTS.OPTION_SEPARATOR)[1]);
				itemdetails["type"]= "SUB";
				itemdetails["raw"]=item;
				itemdetails["parent"]=option;
				arraytofill.push(itemdetails);
				if(item.split(AIV_CONSTANTS.OPTION_SEPARATOR)[1].includes('D'))
				{
					needDClick.push(itemdetails);
				}
				}
				
				//$scope.current_options[item.name] = '';
			}, $scope.current_options);
			angular.forEach(option.linked,function(value,key){
						angular.forEach(option.linked[key], function(item) {
							/*var opt = item.options[0];
							$scope.current_options[item.name] = opt;
							var value = opt.match(/\(([^)]+)\)/);
							if(value != null && value.length > 1){
								$scope.sel_product_price+= parseFloat(value[1]);
								}*/
						var itemdetails = {}; 
						
						itemdetails["title"]= item.split(AIV_CONSTANTS.OPTION_SEPARATOR)[0];
						itemdetails["stitle"]= $scope.getShowName(itemdetails.title);
						itemdetails["color"]= $scope.getColor(item.split(AIV_CONSTANTS.OPTION_SEPARATOR)[1]);
						itemdetails["type"]= "PRE";
						itemdetails["raw"]=item;
						itemdetails["parent"]=key;
						arraytofill.push(itemdetails);
						
						if(item.split(AIV_CONSTANTS.OPTION_SEPARATOR)[1].includes('D'))
						{
							needDClick.push(itemdetails);
						}
						//$scope.current_options[item.name] = '';
					}, $scope.current_options);
					
				});
			
			});
			$scope.otheroptionsstart=$scope.otheroptions;
			
			$scope.sel_option = $scope.filtered_attributes['option'][0];

			$scope.checkDefaultClick(needDClick);
			$scope.product_show = false;
			
			//$scope.selected_attr = $scope.sel_option.linked
			var key;

			if($scope.sel_option!=null)
			{
				for (var property in $scope.sel_option.linked ) {
					//$scope.objectHeaders.push(property); 
					$scope.selected_attr = $scope.sel_option.linked[property][0];
					key = property;
					
				}
				$scope.selected_attr_add='';
				if(key != undefined && $scope.selected_attr != undefined){
					$scope.updateAttributeOptions(key,$scope.selected_attr,$scope.sel_option.name);
				}
			}

			var fixed_options = false;
			for(var i=0;i<$scope.otheroptions.length;i++){
				var nameSplitArr = $scope.otheroptions[i].parent.fname.split(AIV_CONSTANTS.OPTION_SEPARATOR);
				if(nameSplitArr.length>1 && nameSplitArr[1].includes("Y")){
					fixed_options = true;
					//Add default options to cart
					$scope.onClickOthers($scope.otheroptions[i]);
				}
			}
			if($scope.otheroptions.length&&fixed_options){
				if($scope.otheroptions.next!=null)//(str && str.includes("X"))
				{
					//check next action.
					$scope.nextSub($scope.otheroptions.next!=null&&$scope.otheroptions.next.length>0);
					//$scope.processNext($scope.otheroptions[i]);
				}else{
					//Exit suboptions
					$scope.exitSub(false);
				}
			}else if($scope.otheroptions.length){
				var nameSplitArr = $scope.otheroptions[0].parent.fname.split(AIV_CONSTANTS.OPTION_SEPARATOR);
				if(nameSplitArr.length>1 && nameSplitArr[1].includes("Z")){
					//Compulsory options--disable buttons
					$scope.compulsory_option_mode = true;
				}else{
					$scope.compulsory_option_mode = false;
				}
			}else{
				$scope.compulsory_option_mode = false;
			}
		}
	}
	
	$scope.checkDefaultClick = function(needDClick){
		angular.forEach(needDClick, function(item) {
			$scope.onClickOthers(item);
		});
	}
	
	$scope.set_Sub_color = function(product){
		var col = '#'+product.color;
		return {'background-color':col};
	}

	$scope.printLastOrder = function(){
		var pre_date = new Date($scope.lastOrder.date+' '+$rootScope.aiv_info.day_ends_at);
		var next_date = angular.copy(pre_date);
		next_date = new Date(next_date.setDate(next_date.getDate() + 1));
		var current_date = new Date();
		if(current_date > next_date){
			//Reset last order
			$scope.lastOrder = {order:{},date:yyyymmdd(new Date())};
			$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'lastOrder',$scope.lastOrder);
		}
			
		if(angular.isDefined($scope.lastOrder.order.data)){
			$scope.printReceipt($scope.lastOrder.order.data,false,false);
		}else{
			$ionicLoading.show({
				template : '<h2>No orders found...</h2>',
				duration : 1300
			});
		}
	}
	
	$scope.clearKitchenDB = function(){
	    var confirmPopup = $ionicPopup.confirm({
		 title: 'Warning',
		 template: 'Are you sure you want to clear the database?'
	   });

	   confirmPopup.then(function(res) {
		 if(res) {
		    $ionicLoading.show({
				template: '<ion-spinner icon="ios"></ion-spinner><br><span class="aiv-loading">Clearing kitchen database<br>Please wait...</span>',
				animation: 'fade-in',
				showBackdrop: true,
				maxWidth: 300,
				showDelay: 0
			});
			$pouchDBEtc.clearDB().then(function (response) {
				return $pouchDBEtc.compactDB();
			}).then(function (response) {
				$ionicLoading.hide();
			}).catch(function (error) {
				$scope.showCheckoutMsg('Error','Failed to clear database');
				console.error(error);
				$ionicLoading.hide();
			});
		 }
	   });
	   
	    
	}

	$scope.openCashdrawer = function(){
		var printer_settings = $scope.settingsPrinter;
		var print_params = QZHelper.getPrintParams();
		print_params.size = null;
		print_params.orientation = "";
		QZHelper.setPrintParams(print_params);
		QZHelper.startConnection().then(function(response){
			var config;
			if(printer_settings.name != ''){

				config = $scope.setPrinter(printer_settings.name);
				var printData = [{ type: 'raw', data: gen_print_command(printer_settings.cmd_cashdrawer) }];
				
				qz.print(config, printData).then(function() {
				
				}).catch(function(err){
					console.error(err);
				});
			}else{
				$scope.showCheckoutMsg('Error','No Receipt printer/cashdrawer selected...');
			}
		}, function(res) {
			$scope.showCheckoutMsg('Error','Unable to connect to cashdrawer...<br>Please make sure that QZ Tray is installed and started.');
			QZHelper.handleConnectionError(res.err);
		});
	}
	
	$scope.openLoyaltyPopup = function(){
		if($scope.LoyaltyPopup){
			$scope.LoyaltyPopup.close();
		}
		$scope.loyalty_card.order_amount = '';
		$scope.loyalty_card.error = '';
		
		if(angular.isDefined($scope.loyaltyCustomer._id)){
			$scope.setKeyInput('POINTS_EARNED',$scope.loyalty_card.order_amount);
		}else{
			$scope.setKeyInput('MANUAL_CARD_ID',$scope.loyalty_card.id);
		}
		$scope.LoyaltyPopup = $ionicPopup.show({
			templateUrl: 'loyalty-popup.html',
			title: "Loyalty",
			scope: $scope,
			cssClass: 'wide-popup loyalty-popup',
			buttons: [{
				text: 'Add',
				type: 'button-royal',
				onTap: function(e) {
					e.preventDefault();
					if($scope.loyaltyCustomer._id){
						$scope.addLoyaltyPoints();
					}
				}
			},
			{
				text: 'Redeem',
				type: 'button-positive',
				onTap: function(e) {
					e.preventDefault();
					if($scope.loyaltyCustomer._id){
						$scope.redeemLoyaltyPoints();
					}
				}
			},
			{
				text: 'Cancel',
				type: 'button-assertive',
				onTap: function(e) {
					$scope.resetLoyaltyFields();
					$scope.loyaltyCustomer = {};
					$scope.LoyaltyPopup.close();
				}
			}]
		});
	}
	
	$scope.loyaltyCustomer = {};
	$scope.resetLoyaltyFields();
	$scope.checkLoyaltyCustomer = function(card_id){
		var cardid = card_id.replace(/[\n\r]/g, '').trim();
		var is_number = /^\d+$/.test(cardid);
		if(!is_number || cardid.length<10 || !$scope.loginInfo.user_login || ($scope.customer_edit_modal != undefined && $scope.customer_edit_modal._isShown)){
			return;
		}else{//Add points if order is in progress
			$scope.loyalty_card.id = cardid;
			$scope.loyalty_card.error = '';
			var pay_total = Number($scope.grand.Total + $scope.grand.Shipping - $scope.grand.Discount + $scope.bagCharges.selected);
			if($scope.selected_customer && pay_total){
				var exists = shareData.getCustomer("PHONE",$scope.loyalty_card.id);
				if(angular.isDefined(exists._id)){
					if($scope.selected_customer._id == exists._id){
						//Matching customer add points
						$scope.loyalty_card.order_amount = pay_total;
						$scope.loyalty_card.current_points = $scope.salesConversion($scope.cartItems,$scope.grand.Discount,false);
						
						$scope.addLoyaltyPointsOrder();
						$scope.loyalty_dbaccess_status = false;
						$scope.show_redeem_btn = false;
						$scope.httpRequest = dataService.getPoints($scope.loyalty_card.id,$rootScope.aiv_info.shop_name);
							$scope.httpRequest.then(function(res) {
								if(res.Success==1)
								{

									$scope.loyalty_card.reward_points = parseInt(res.points_to_unlock)+parseInt(res.points_to_redeem);
									$scope.loyalty_card.reward_amount = $scope.rewardConversion($scope.loyalty_card.reward_points);
								
									
									$scope.loyalty_dbaccess_status = true;
									
									
									if($scope.loyalty_card.reward_points>=parseInt($scope.hf_loyalty.rewards.points) && $scope.loyalty_card.order_amount>$scope.loyalty_card.reward_amount){
										$scope.show_redeem_btn = true;
									}
								
								
									
								}
								else
								

								$scope.httpRequest = null;

								
							}).catch(function(err){
								$scope.httpRequest = null;
								
								
							})


						
					}else{
						$scope.showCheckoutMsg('Warning','This card is attached to another customer <strong>'+$scope.selected_customer.billing_address.phone+'('+$scope.selected_customer.first_name+')</strong>');
					}
				}else{
					//No customers found for this card
					if($scope.selected_customer.meta.loyalty_card_id && $scope.selected_customer.meta.loyalty_card_id!=$scope.loyalty_card.id){
						//This user's card is different
						$scope.showCheckoutMsg('Warning','This customer has attached a different card. if you wish to change the card, please edit the customer details with new card.');
						$scope.closeModal('PAYMENT');
						$scope.aiv_toggles.show_customer_extra = true;
						$scope.openCustomerEditModal(true);
					}else{
						var confirmPopup = $ionicPopup.confirm({
							title: 'Warning',
							template: 'No customer attached to this loyalty card. Assign card <strong>'+$scope.loyalty_card.id+'<strong> to '+$scope.selected_customer.billing_address.phone+'('+$scope.selected_customer.first_name+')</strong>?'
						});

						confirmPopup.then(function(res) {
							if(res) {
								//Attach card to customer
								$scope.formCheckout.customer_meta.loyalty_card_id = $scope.loyalty_card.id;
								$scope.loyalty_card.order_amount = pay_total;
								$scope.loyalty_card.current_points = $scope.salesConversion($scope.cartItems,$scope.grand.Discount,false);
								$scope.loyalty_card.reward_points = 0;//$scope.loyalty_card.current_points;
								$scope.loyalty_card.reward_amount = 0;//$scope.rewardConversion($scope.loyalty_card.reward_points);
								$ionicLoading.show({
									template: '<ion-spinner icon="ios"></ion-spinner><br><span class="aiv-loading">Adding card to customer<br>Please wait...</span>',
									animation: 'fade-in',
									showBackdrop: true,
									maxWidth: 300,
									showDelay: 0
								});
								$pouchDB.upsert($scope.selected_customer._id,function(doc){
									if(doc != undefined){
										doc.meta = {
											"loyalty_card_id":$scope.loyalty_card.id,
											"points_to_unlock":$scope.loyalty_card.reward_points,
											"points_to_redeem":$scope.loyalty_card.reward_points,
											"redeem_amount":0,
											"total_used_points":0,
											"current_redeem_points":0,
											"reward_coupon":"",
											"reward_type":"MONEY",
											"redeem_status":"TRUE",
											"docid":$scope.selected_customer._id,
											"shop_id":$rootScope.aiv_info.shop_id
										};
										doc.action = "LOY_CUST_CREATE"
									}
									return doc;
								}).then(function(returnData) {
									$scope.loyalty_card.id = $scope.loyalty_card.id;
									$scope.loyalty_card.assigned = true;
									$ionicLoading.hide();
									$ionicLoading.show({
										template : '<h2>Card attached and points added</h2>',
										duration : 1000
									});
								}).catch(function(error){
									$ionicLoading.hide();
									$scope.resetLoyaltyFields();
									$ionicLoading.show({
										template : '<h2>Unable to link this card to this customer</h2>',
										duration : 1300
									});
								});
							}else{
								$scope.resetLoyaltyFields();
							}
						})
					}
				}
			}else{
				$scope.loyalty_card.order_amount = pay_total;
				$scope.loyalty_card.current_points = $scope.salesConversion($scope.cartItems,$scope.grand.Discount,false);
				var exists = shareData.getCustomer("LOYALTY_CARD",$scope.loyalty_card.id);
				if(angular.isDefined(exists._id)){
					//Show customer details
					$scope.actionSearchCustomer(angular.copy(exists),'CART');

					//Add points
					$scope.addLoyaltyPointsOrder();
				}else{
					$scope.loyalty_card.reward_points = 0;//$scope.loyalty_card.current_points;
					$scope.loyalty_card.reward_amount = 0;//$scope.rewardConversion($scope.loyalty_card.reward_points);
					//New customer
					$scope.formCheckout.customer_meta.loyalty_card_id = $scope.loyalty_card.id;
					$scope.aiv_toggles.show_customer_extra = true;
					$scope.openCustomerEditModal(false);
				}
			}
		}
		
	}
	
	$scope.searchLoyaltyCustomer = function(card_id){
		if(!$scope.loginInfo.user_login){
			return;
		}
		$scope.resetLoyaltyFields();
		$scope.loyalty_card.id = card_id.replace(/[\n\r]/g, '').trim();
		$scope.loyalty_card.error = '';
		if(!$scope.loyalty_card.manual_search){
			$ionicLoading.show({
				template: '<ion-spinner icon="ios"></ion-spinner><br><span class="aiv-loading">Searching customer<br>Please wait...</span>',
				animation: 'fade-in',
				showBackdrop: true,
				maxWidth: 300,
				showDelay: 0
			});
		}
		
		$scope.quickCustomers = $filter('filter')($scope.allCustomers, function(customer){
			return angular.isDefined(customer.meta.loyalty_card_id) && customer.meta.loyalty_card_id && customer.meta.loyalty_card_id==$scope.loyalty_card.id;
		});
		
		//$scope.loyaltyCustomer = {};
		var customer = {};
		$ionicLoading.hide();
		if($scope.quickCustomers.length){
			customer = angular.copy($scope.quickCustomers[0]);
			$scope.quickCustomers = [];
			if($scope.pay_modal != undefined && $scope.pay_modal._isShown){
				//Scan for points
				$scope.loyaltyCustomer = customer;
				$scope.checkLoyaltyCustomer($scope.loyalty_card.id);
				
			}else if($scope.customer_edit_modal == undefined || !$scope.customer_edit_modal._isShown){
			
				$scope.loyaltyCustomer = customer;
				$scope.checkLoyaltyCustomer($scope.loyalty_card.id);
				$scope.aiv_toggles.show_customer_extra = true;
				$scope.openCustomerEditModal(true);
				//$scope.search_inputs.customer = customer.billing_address.phone;
				//$scope.startAction('CUSTOMERS');
				//$scope.actionSearchCustomer(customer,'VIEW');
			}
		}else{
			$ionicLoading.show({
				template : '<h2>No customers found for this card</h2>',
				duration : 1000
			});
			$scope.aiv_toggles.show_customer_extra = true;
			$scope.openCustomerEditModal(false);
		}
		$scope.loyalty_card.manual_search = false;
	}
	
	$scope.toggleLoyalty = function(enable){
		$scope.hf_loyalty.enabled = enable;
	}
	
	$scope.addLoyaltyPointsOrder = function(){
		if($scope.loyalty_card.current_points){
			//$scope.loyalty_card.reward_points = parseInt($scope.selected_customer.meta.points_to_redeem)+parseInt($scope.selected_customer.meta.points_to_unlock);//+$scope.loyalty_card.current_points;
			//$scope.loyalty_card.reward_amount = $scope.rewardConversion($scope.loyalty_card.reward_points);
			$scope.loyalty_card.reward_amount = $scope.rewardConversion(Number($scope.hf_loyalty.rewards.points));
						
			$scope.show_redeem_btn = false;
			//edited by linu to avoid redeem button display while back click
			if($scope.loyalty_card.reward_points>=parseInt($scope.hf_loyalty.rewards.points) && $scope.loyalty_card.order_amount>$scope.loyalty_card.reward_amount && !$scope.loyalty_card.points_redeem_status){
				$scope.show_redeem_btn = true;
			}
			$scope.loyalty_card.assigned = true;
			$scope.loyalty_card.points_added_status = true;
			
			//TODO get total points from cloud//if not there just say not available.
			
		}
	}
	
	$scope.updateCustomerDoc = function(actions){
		var customer_actions = angular.copy(actions);
		var proceed = true;
		if(customer_actions.actions.indexOf("LOYALTY")>-1){
			
			if(!customer_actions.data.loyalty_card.points_added_status){// || customer_actions.data.loyalty_card.points_redeem_status){
				proceed = false;
			}
			$scope.loyalty_card.error = '';
		}
		
		if(customer_actions.actions.indexOf("ORDER_COUNT")>-1){
			proceed = true;
		}
		
		if(proceed){
			var current_points = customer_actions.data.loyalty_card.current_points;
			$pouchDB.upsert(customer_actions.data._id,function(doc){
				var action = "NO_ACTION";
				if(customer_actions.actions.indexOf("LOYALTY")>-1){
					if(customer_actions.data.loyalty_card.points_redeem_status){
						doc.meta.points_to_unlock = current_points;
						doc.meta.points_to_redeem = customer_actions.data.loyalty_card.reward_points;
					}else{
						doc.meta.points_to_unlock = parseInt(doc.meta.points_to_unlock)+current_points;
					}
					//doc.meta.points_to_unlock = parseInt(doc.meta.points_to_unlock)+current_points+doc.meta.points_to_redeem;
					//doc.meta.points_to_redeem=0;
					action = "LOY_ADD_PTS";
				}
				if(customer_actions.actions.indexOf("ORDER_COUNT")>-1){
					doc.orders_count = customer_actions.data.order_count;
				}
				doc.action = action;
				return doc;
			}).then(function(){
				console.log("Points added");
			}).catch(function(error){
				console.error(error);
			});
		}
	}
	
	/*$scope.redeemLoyaltyPointsOrder = function(){
		if(!$scope.pos_status.online){
			$ionicLoading.show({
				template : '<h2>Cannot redeem points. No internet connection...</h2>',
				duration : 1300
			});
			return;
		}
		$scope.loyalty_card.points_redeem_status = false;
		var next_points_to_redeem = parseInt($scope.loyalty_card.reward_points%parseInt($scope.hf_loyalty.rewards.points));
		$scope.loyalty_card.reward_money = $scope.rewardConversion($scope.loyalty_card.reward_points);
		var confirmPopup = $ionicPopup.confirm({
			title: 'Confirm',
			template: 'Reward amount is £'+$scope.loyalty_card.reward_money+'.<br>Are you sure you want to redeem points now?'
		});

		confirmPopup.then(function(res) {
			if(res) {
				$ionicLoading.show({
					template: '<ion-spinner icon="ios"></ion-spinner><br><span class="aiv-loading">Redeeming points</span>',
					animation: 'fade-in',
					showBackdrop: true,
					maxWidth: 300,
					showDelay: 0
				});
				
				$pouchDB.upsert($scope.selected_customer._id,function(doc){
					doc.action = "LOY_REDEEM_PTS";
					doc.meta.total_used_points+=$scope.loyalty_card.reward_points-next_points_to_redeem;
					doc.meta.current_redeem_points = $scope.loyalty_card.reward_points-next_points_to_redeem;
					doc.meta.points_to_unlock = 0;
					doc.meta.points_to_redeem = next_points_to_redeem;
					doc.meta.redeem_amount = $scope.loyalty_card.reward_money;
					return doc;
				}).then(function(){
					var red_amount = (Number($scope.payment_select.to_pay)>$scope.loyalty_card.reward_money)?$scope.loyalty_card.reward_money:Number($scope.payment_select.to_pay);
					
					for(var d=0;d<$scope.cartDiscounts.length;d++){
						if($scope.cartDiscounts[d].name == 'LOYALTY'){
							$scope.cartDiscounts[d].amount = red_amount;
							break;
						}
					}
					if(d>=$scope.cartDiscounts.length){
						$scope.cartDiscounts.push({name:'LOYALTY',amount:red_amount});
					}
					
					$scope.grand.Discount+=red_amount;
					$scope.payment_select.to_pay-=red_amount;
					$scope.amount_key = '£'+parseFloat($scope.payment_select.to_pay).toFixed(2);
					
					//Recalculate points
					$scope.loyalty_card.current_points = $scope.salesConversion($scope.cartItems,$scope.grand.Discount,false);
					$scope.addLoyaltyPointsOrder();
						
					$ionicLoading.hide();
					$ionicLoading.show({
						template : '<h2>This customer has redeemed £'+$scope.loyalty_card.reward_money+'...</h2>',
						duration : 1300
					});
					$scope.loyalty_card.points_redeem_status = true;
					//$scope.loyalty_card.manual_search = false;
					//$scope.loyalty_card.reward_amount = 0;
					$scope.loyalty_card.reward_points = next_points_to_redeem;
					//$scope.loyalty_card.order_amount = 0;
					$scope.show_redeem_btn = false;
				}).catch(function(error){
					$ionicLoading.hide();
					$ionicLoading.show({
						template : '<h2>Failed to redeem points...</h2>',
						duration : 1300
					});
					console.error(error);
					
				});
			}else{
				$scope.loyalty_card.reward_money = 0;
			}
		});
	}*/
	
	$scope.redeemLoyaltyLocally = function(){
		if(!$scope.pos_status.online){
			$ionicLoading.show({
				template : '<h2>Cannot redeem points. No internet connection...</h2>',
				duration : 1300
			});
			return;
		}
		$scope.loyalty_card.points_redeem_status = false;
		//var next_points_to_redeem = parseInt($scope.loyalty_card.reward_points%parseInt($scope.hf_loyalty.rewards.points));
		//$scope.loyalty_card.reward_money = $scope.rewardConversion($scope.loyalty_card.reward_points);
		
		var next_points_to_redeem = Number($scope.loyalty_card.reward_points) - Number($scope.hf_loyalty.rewards.points);
		$scope.loyalty_card.reward_money = $scope.rewardConversion(Number($scope.hf_loyalty.rewards.points));
		
		var confirmPopup = $ionicPopup.confirm({
			title: 'Confirm',
			template: 'Reward amount is £'+$scope.loyalty_card.reward_money+'.<br>Are you sure you want to redeem points now?'
		});

		confirmPopup.then(function(res) {
			if(res) {
				var red_amount = (Number($scope.payment_select.to_pay)>$scope.loyalty_card.reward_money)?$scope.loyalty_card.reward_money:Number($scope.payment_select.to_pay);
								
				for(var d=0;d<$scope.cartDiscounts.length;d++){
					if($scope.cartDiscounts[d].name == 'LOYALTY'){
						$scope.cartDiscounts[d].amount = red_amount;
						break;
					}
				}
				if(d>=$scope.cartDiscounts.length){
					$scope.cartDiscounts.push({name:'LOYALTY',amount:red_amount});
				}
				$scope.grand.loyalty =true;
				$scope.grand.loyalty_amt =red_amount;
				$scope.grand.Discount+=red_amount;
				$scope.payment_select.to_pay-=red_amount;
				$scope.amount_key = '£'+parseFloat($scope.payment_select.to_pay).toFixed(2);
				
				//Recalculate points
				$scope.loyalty_card.current_points = $scope.salesConversion($scope.cartItems,$scope.grand.Discount,false);
				$scope.addLoyaltyPointsOrder();
					
				$scope.loyalty_card.points_redeem_status = true;
				$scope.loyalty_card.reward_points = next_points_to_redeem;
				$scope.show_redeem_btn = false;
			}else{
				$scope.loyalty_card.reward_money = 0;
			}
		});
	}
	
	$scope.cartDiscounts = [];
	$scope.redeemLoyaltyPointsOrder = function(){
		if(!$scope.pos_status.online){
			$ionicLoading.show({
				template : '<h2>Cannot redeem points. No internet connection...</h2>',
				duration : 1300
			});
			return;
		}
		$scope.loyalty_card.points_redeem_status = false;
		var next_points_to_redeem = parseInt($scope.loyalty_card.reward_points%parseInt($scope.hf_loyalty.rewards.points));
		$scope.loyalty_card.reward_money = $scope.rewardConversion($scope.loyalty_card.reward_points);
		var confirmPopup = $ionicPopup.confirm({
			title: 'Confirm',
			template: 'Reward amount is £'+$scope.loyalty_card.reward_money+'.<br>Are you sure you want to redeem points now?'
		});

		confirmPopup.then(function(res) {
			if(res) {
				$ionicLoading.show({
					template: '<ion-spinner icon="ios"></ion-spinner><br><span class="aiv-loading">Redeeming points<br>Please wait... OR Click cancel</span><button ng-click="abortRequest()" class="button button-full button-assertive">Cancel</button>',
					animation: 'fade-in',
					showBackdrop: true,
					maxWidth: 300,
					showDelay: 0
				});
				
				$scope.httpRequest = dataService.redeemHFPoints($scope.selected_customer.billing_address.phone);
				$scope.httpRequest.then(function(result) {
					if(result.Success){
						var red_amount = (Number($scope.payment_select.to_pay)>$scope.loyalty_card.reward_money)?$scope.loyalty_card.reward_money:Number($scope.payment_select.to_pay);
						
						for(var d=0;d<$scope.cartDiscounts.length;d++){
							if($scope.cartDiscounts[d].name == 'LOYALTY'){
								$scope.cartDiscounts[d].amount = red_amount;
								break;
							}
						}
						if(d>=$scope.cartDiscounts.length){
							$scope.cartDiscounts.push({name:'LOYALTY',amount:red_amount});
						}
						
						$scope.grand.Discount+=red_amount;
						$scope.payment_select.to_pay-=red_amount;
						$scope.amount_key = '£'+parseFloat($scope.payment_select.to_pay).toFixed(2);
						
						//Recalculate points
						$scope.loyalty_card.current_points = $scope.salesConversion($scope.cartItems,$scope.grand.Discount,false);
						$scope.addLoyaltyPointsOrder();
							
						$ionicLoading.hide();
						$ionicLoading.show({
							template : '<h2>This customer has redeemed £'+$scope.loyalty_card.reward_money+'...</h2>',
							duration : 1300
						});
						$scope.loyalty_card.points_redeem_status = true;
						//$scope.loyalty_card.manual_search = false;
						//$scope.loyalty_card.reward_amount = 0;
						$scope.loyalty_card.reward_points = result.unlock_points;
						//$scope.loyalty_card.order_amount = 0;
						$scope.show_redeem_btn = false;
					}else{
						$ionicLoading.hide();
						$scope.payment_select.err = "Network error, unable to redeem points now!!";
						$ionicLoading.show({
							template : '<h2>Network error, unable to redeem points now!!</h2>',
							duration : 1300
						});
					}
					$scope.httpRequest = null;
				}).catch(function(err){
					var msg = '';
					if(!err){
						msg = "No internet connection!!!";
					}else if(angular.isDefined(err.error)){
						if(err.error == "timeout"){
							msg = "Connection timed out!!!";
						}else{
							msg = "Request aborted!!!";
						}
					}else{
						msg = 'An error occurred!!!';
					}
					$scope.payment_select.err = msg;
					$ionicLoading.hide();
					$scope.httpRequest = null;
				})
			}else{
				$scope.loyalty_card.reward_money = 0;
			}
		});
	}
	
	$scope.addLoyaltyPoints = function(){
		$scope.loyalty_card.error = '';
		var sale_points = $scope.salesConversion($scope.loyalty_card.order_amount);
		if(!sale_points){
			$scope.loyalty_card.error = "Not enough order amount";
		}else{
			$pouchDB.upsert($scope.loyaltyCustomer._id,function(doc){
				//doc.meta.points_to_redeem = sale_points;
				doc.meta.points_to_unlock = parseInt(doc.meta.points_to_unlock)+sale_points+doc.meta.points_to_redeem;
				doc.meta.points_to_redeem =0;
				doc.action = "LOY_ADD_PTS";
				return doc;
			}).then(function(){
				if($scope.LoyaltyPopup){
					$scope.LoyaltyPopup.close();
					//$scope.loyalty_card = {id:'',manual_search:false,reward_amount:0,reward_points:0};
					//$scope.loyaltyCustomer = {};
				}
				
			}).catch(function(error){
				$scope.loyalty_card.error = "Oops...an error occurred!!!";
				console.error(error);
			});
		}
	}
	
	$scope.redeemLoyaltyPoints = function(){
		$scope.loyalty_card.error = '';
		var reward_points = parseInt($scope.loyaltyCustomer.meta.points_to_redeem)+parseInt($scope.loyaltyCustomer.meta.points_to_unlock);
		var next_points_to_redeem = parseInt(reward_points%parseInt($scope.hf_loyalty.rewards.points));
		var reward_money = $scope.rewardConversion(reward_points);
		if(!reward_money){
			$scope.loyalty_card.error = "Not enough points to redeem";
		}else{
			if($scope.LoyaltyPopup){
				$scope.LoyaltyPopup.close();
			}
			var confirmPopup = $ionicPopup.confirm({
				title: 'Confirm',
				template: 'Reward amount is £'+reward_money+'.<br>Are you sure you want to redeem points now?'
			});

			confirmPopup.then(function(res) {
				if(res) {
					$pouchDB.upsert($scope.loyaltyCustomer._id,function(doc){
						doc.action = "LOY_REDEEM_PTS";
						doc.meta.total_used_points+=reward_points-next_points_to_redeem;
						doc.meta.current_redeem_points = reward_points-next_points_to_redeem;
						doc.meta.points_to_unlock = 0;
						doc.meta.points_to_redeem = next_points_to_redeem;
						doc.meta.redeem_amount = reward_money;
						return doc;
					}).then(function(){
						$scope.resetLoyaltyFields();
						$scope.loyaltyCustomer = {};
						$scope.showCheckoutMsg('Reward amount','This customer has redeemed £'+reward_money);
					}).catch(function(error){
						$ionicLoading.show({
							template : '<h2>An error occured...</h2>',
							duration : 1300
						});
						console.error(error);
					});
				}else{
					$scope.resetLoyaltyFields();
					$scope.loyaltyCustomer = {};
				}
			});
		}
	}
	
	/* $scope.rewardConversion = function(reward_points){
		if(reward_points >= parseInt($scope.hf_loyalty.rewards.points)){
			return 5.00;//it is always 5 that can be redeemed.(reward_points/parseInt($scope.hf_loyalty.rewards.points))*parseInt($scope.hf_loyalty.rewards.amount);
		}
		return 0;
	} */
	
	/*$scope.rewardConversionInverse = function(reward_amount){
		if(reward_amount){
			return (reward_points/parseInt($scope.hf_loyalty.rewards.points))*parseInt($scope.hf_loyalty.rewards.amount);
		}
		return 0;
	}
	
	$scope.rewardConversion = function(amount){
		if(parseInt(amount) >= parseInt($scope.hf_loyalty.sales.amount)){

			return parseInt((parseInt(amount)/parseFloat($scope.hf_loyalty.sales.amount))*parseInt($scope.hf_loyalty.sales.points));
		}
		return 0;
	}*/
	
	$scope.rewardConversion = function(reward_points){
		if(reward_points >= parseInt($scope.hf_loyalty.rewards.points)){
			return 5.00;//it is always 5 that can be redeemed.(reward_points/parseInt($scope.hf_loyalty.rewards.points))*parseInt($scope.hf_loyalty.rewards.amount);
		}
		return 0;
	}
	
	$scope.rewardConversionInverse = function(reward_amount){
		if(reward_amount){
			return parseInt(reward_amount*parseInt($scope.hf_loyalty.rewards.points))/parseInt($scope.hf_loyalty.rewards.amount);
		}
		return 0;
	}
	
	
	$scope.salesConversion = function(items,total_discount,online){
		//Find point group
		var points_group = [];
		for(var i=0;i<items.length;i++){
			items[i].points  = Number(items[i].points);
			if(angular.isDefined(items[i].points) && items[i].points && points_group.indexOf(Number(items[i].points))<0){
				points_group.push(Number(items[i].points));
			}
			else{
			points_group.push(5);
			}
		}
		
		//Round group amounts for point calculation
		var points = 0,amount = 0;
		for(var g=0;g<points_group.length;g++){
			amount = 0;
			var group_points = items;//$filter('filter')(items,{points:points_group[g]},true);
			for(var i=0;i<group_points.length;i++){
				amount+=Number(group_points[i].total);
			}
			points+=points_group[g]*parseInt(amount);
			break;
		}
		
		/*var points = 0;
		for(var i=0;i<items.length;i++){
			if(angular.isDefined(items[i].points)){
				points+=(Number(items[i].points)*parseInt(items[i].total));
			}
		}*/
		
		//Deduct points from discount
		if(Number(total_discount) && points){
			if(online){
				/*for(var i=0;i<items.length;i++){
					if(angular.isDefined(items[i].points)){
						points-=(Number(items[i].subtotal)-Number(items[i].total))*Number(items[i].points);
					}
				}*/
			}else{
				/*var per_discount = $scope.grand.Discount/$scope.grand.Quantity;
				for(var i=0;i<items.length;i++){
					if(angular.isDefined(items[i].points)){
						points-=(per_discount*Number(items[i].quantity))*Number(items[i].points);
					}
				}*/
				if($scope.isPromotionsApplied()){
					points-=parseInt(total_discount);
				}else{
					var per_discount = $scope.grand.Discount/$scope.grand.Quantity;
					for(var i=0;i<items.length;i++){
						if(angular.isDefined(items[i].points)){
							points-=(per_discount*Number(items[i].quantity))*Number(items[i].points);
						}
					}
					//points-=(parseInt(total_discount)*parseInt($scope.hf_loyalty.sales.points));
				}
			}
			
			points=points>0?points:0;
		}
		
		return parseInt(points);
	}
	
	$scope.startup = {action:null};
	$scope.startAction = function(action,method = null){
		$scope.tipData={
			enable:false,
			amount:'',
			method:''
		}
		$scope.quickCustomerDisable =false;
		$scope.quickCustomerEnable =false;
		$scope.deposit=false;
		$scope.startup.action = action;
		switch(action){
			case 'SHIPPING':
				$scope.saveInitialShipping(method);break;
			case 'PRINT_LAST_ORDER':
				$scope.printLastOrder();break;
			case 'TABLEVIEW':
				$scope.show_mode ="TABLE";
				$scope.initalizeTable();
				if($scope.loginInfo.user_login != ''){
					$scope.login($scope.qwerty_inputs.pass);
				}
				break;
			case 'SETTINGS':
				//$scope.openModal('POS_SETTINGS');
				$scope.closeModal('POS_USERS');
				$scope.switch_menu('Settings');
				break;
			case 'DEPOSIT':
			   $scope.deposit=true;
			   if($scope.loginInfo.user_login != ''){
				$scope.login($scope.qwerty_inputs.pass);
				}
			   $scope.deposittemplat();
				break;
			case 'VOUCHERFRONT':
		       $scope.voucher=true;
		       if($scope.loginInfo.user_login != ''){
					$scope.login($scope.qwerty_inputs.pass);
				}
		       $scope.vouchertemplatefront();
				break;
			case 'PAYOUTFRONT':
		       $scope.payout=true;
		       if($scope.loginInfo.user_login != ''){
			 	$scope.login($scope.qwerty_inputs.pass);
				}
		       $scope.payoutfronttemplate();
				break;
			case 'PAYOUT':
		       if($scope.loginInfo.user_login != ''){
			 	$scope.login($scope.qwerty_inputs.pass);
				}
		       $scope.payouttemplate();
				break;
			case 'ADD2ORDER':
			case 'LOOK_ORDER':
			case 'PAYOFF':
			case 'JUSTEAT':
			case 'CALL_ORDER':
			case 'REPORTS':
			case 'CUSTOMERS':
				$scope.quickFind=true;
				
				if($scope.loginInfo.user_login != ''){
					$scope.login($scope.qwerty_inputs.pass);
				}
				break;
			default:
				/*if(!$scope.loginInfo.user_login){
					$scope.aiv_users.err = 
				}*/
				break;
		}
	}
	
	$scope.clockStatus = function(status,login){
		$scope.aiv_users.err = '';
		$scope.aiv_users.clock_in = status;
		var proceed = false;
		var login_info = '';
		if(login){
			login_info = $scope.loginInfo;
		}else{
			login_info = $scope.clock_user;
		}
		if(!login_info.user_login){
			$scope.aiv_users.err = "Please authorize to "+(status=="CLOCKIN"?"CLOCK IN":"CLOCK OUT");
			return;
		}
		
		var register = getUserRegister(login_info._id);
		if(!$scope.aiv_users.clock_in && (angular.isUndefined(register.enrolled) || !register.enrolled)){
			//User not clocked in
			proceed = true;
		}else if($scope.aiv_users.clock_in == "CLOCKIN"){
			//Check if user already clocked in
			if(angular.isDefined(register.status) && register.status){
				register.clock_in = moment(register.clock_in, "DD/MM/YYYY, HH:mm:ss").toDate();
				$scope.showCheckoutMsg('Already Clocked In',"You have already clocked in at "+$filter('date')(new Date(register.clock_in),'hh:mm a'));
				$scope.aiv_users.clock_in = '';
				if(!login){
					 $scope.clock_user = '';
					 $scope.qwerty_inputs.clock_pass = '';
				}
				return;
			}
			proceed = true;
		}else if($scope.aiv_users.clock_in == "CLOCKOUT"){
			if(angular.isUndefined(register.enrolled) || !register.enrolled){
				$scope.showCheckoutMsg('Not Clocked In',"You haven't clocked-in yet");
				$scope.aiv_users.clock_in = '';
				if(!login){
					 $scope.clock_user = '';
					 $scope.qwerty_inputs.clock_pass = '';
				}
				return;
			}else if(angular.isUndefined(register.status) || !register.status){
				$scope.showCheckoutMsg('Already Clocked In',"You have already clocked-out at "+$filter('date')(new Date(register.clock_out),'hh:mm a'));
				$scope.aiv_users.clock_in = '';
				if(!login){
					 $scope.clock_user = '';
					 $scope.qwerty_inputs.clock_pass = '';
				}
				return;
			}
			proceed = true;
		}
		
		if(proceed){
			//Proceed to clockin/clockout
			var content,header;
			if(!$scope.aiv_users.clock_in){
				header = "Not Clocked In";
				content = "You haven't Clocked In yet. Clock In now?"
				$scope.aiv_users.clock_in = "CLOCKIN";
			}else{
				header = $scope.aiv_users.clock_in=="CLOCKOUT"?'CLOCK OUT':'CLOCK IN',
				content = 'Are you sure you want to '+($scope.aiv_users.clock_in=="CLOCKOUT"?'CLOCK OUT':'CLOCK IN')+'?'
			}
			var confirmPopup = $ionicPopup.confirm({
				title: header,
				template: content
			});

			confirmPopup.then(function(res) {
				if(res) {
					var clock_doc = 'clock_'+getWorkingDate();
					var register = '';
					$pouchDB.upsert(clock_doc,function(doc){
						if (!doc.data) {
							//New entry
							doc.data = $scope.user_register;
						}
						if( $scope.aiv_users.clock_in =="CLOCKOUT"){
							var user_index = -1;
							var previousDate ="";
							for(var i=0;i<doc.data.length;i++){
							
								if(doc.data[i]._id == login_info._id ){
								if(previousDate =="" ||(previousDate<doc.data[i].created_at)){
										user_index = i
										previousDate =doc.data[i].created_at;
									}
								}
							}
							
							if(user_index > -1){
								//Update user register
								if(!doc.data[user_index].enrolled && $scope.aiv_users.clock_in=="CLOCKIN"){
									doc.data[user_index].clock_in = new Date().toLocaleString('en-US',{ hour12: false });
									doc.data[user_index].enrolled = true;
								}
								
								if($scope.aiv_users.clock_in=="CLOCKIN"){
									doc.data[user_index].status = true;
								}else if($scope.aiv_users.clock_in=="CLOCKOUT"){
									doc.data[user_index].clock_out = new Date().toLocaleString('en-US',{ hour12: false });
									doc.data[user_index].status = false;
								}
								register = doc.data[user_index];
							}
						}else{
							//New user
							var date_string = new Date().toLocaleString('en-US',{ hour12: false });
							register = {
								"id":login_info.user_id,
								"name":login_info.user_login,
								"created_at": new Date().toLocaleString('en-US',{ hour12: false }),
								"role":login_info.role,
								"clock_in":date_string,
								"clock_out":"",
								"enrolled":true,
								"status":true,
								"_id":login_info._id
							}
							doc.data.push(register);
						}
						doc.current_user = login_info.user_id;
						return doc;
					}).then(function(result){
						add2Register(register,false);
						$scope.aiv_users.clock_in = '';
						$scope.showClockInButton=false;
						if(!register.status && login){
							$scope.aiv_logout();
						}
						if(!login){
							 $scope.clock_user = '';
							 $scope.qwerty_inputs.clock_pass = '';
						}
					}).catch(function(error){
						console.error(error);
						$scope.aiv_users.clock_in = '';
						$scope.showCheckoutMsg('Error',"Failed to "+($scope.aiv_users.clock_in=="CLOCK OUT"?'CLOCK OUT':'CLOCK IN'));
					})
				}else{
					$scope.aiv_users.clock_in = '';
				}
			});
		}
	}
	/*$scope.clockStatus = function(){
		var confirmPopup = $ionicPopup.confirm({
			title: $scope.aiv_users.clock_in?'CLOCK OUT':'CLOCK IN',
			template: 'Are you sure you want to '+($scope.aiv_users.clock_in?'CLOCK OUT':'CLOCK IN')+'?'
		});

		confirmPopup.then(function(res) {
			if(res) {
				var clock_doc = 'clock_'+getWorkingDate();
				var register = '';
				$pouchDB.upsert(clock_doc,function(doc){
					if (!doc.data) {
						//New entry
						doc.data = $scope.user_register;
					}
					var user_index = -1;
					for(var i=0;i<doc.data.length;i++){
						if(doc.data[i]._id == $scope.loginInfo._id){
							user_index = i;
							break;
						}
					}
					
					if(user_index > -1){
						//Update user register
						if(!doc.data[user_index].enrolled && !$scope.aiv_users.clock_in){
							doc.data[user_index].clock_in = new Date().toISOString();
							doc.data[user_index].enrolled = true;
						}
						
						if(!$scope.aiv_users.clock_in){
							doc.data[user_index].status = true;
						}else if($scope.aiv_users.clock_in){
							doc.data[user_index].clock_out = new Date().toISOString();
							doc.data[user_index].status = false;
						}
						register = doc.data[user_index];
					}else{
						//New user
						var date_string = new Date().toISOString();
						register = {
							"id":$scope.loginInfo.user_id,
							"name":$scope.loginInfo.user_login,
							"role":$scope.loginInfo.role,
							"clock_in":date_string,
							"clock_out":date_string,
							"enrolled":true,
							"status":true,
							"_id":$scope.loginInfo._id
						}
						doc.data.push(register);
					}
					return doc;
				}).then(function(result){
					$scope.aiv_users.clock_in = register.status;
					add2Register(register,false);
					if(!register.status){
						$scope.aiv_logout();
					}
				}).catch(function(error){
					console.error(error);
					$scope.showCheckoutMsg('Error',"Failed to "+($scope.aiv_users.clock_in?'CLOCK OUT':'CLOCK IN'));
				})
			}
		});
	}*/
	
	var cacheInitialData = function(){
		$scope.allCustomers = [];
		$scope.cacheOrders = [];
		
		var ids = [];//Get all terminal ids
		for(var i=0;i<$scope.aiv_terminals.terminals.length;i++){
			ids.push($scope.aiv_terminals.terminals[i].name);
		}
		ids.push('AIVOOT');	
		var current_date = new Date();
		var current_time = hhmmss(current_date);
		var begin_date;
		if(current_time>$rootScope.aiv_info.day_ends_at){
			current_date = new Date(current_date.setDate(current_date.getDate() - 3));
			//Daytime//Show today's orders
			begin_date = new Date(yyyymmdd(current_date)+' '+$rootScope.aiv_info.day_ends_at);
		}else{
			//Midnight//Show yesterday's and today's orders
			current_date = new Date(current_date.setDate(current_date.getDate() - 1));
			begin_date = new Date(yyyymmdd(current_date)+' '+$rootScope.aiv_info.day_ends_at);
		}
		$ionicLoading.show({
			template: '<ion-spinner icon="ios"></ion-spinner><br><span class="aiv-loading">Almost there...<br>Fetching Orders and Customers</span>',
			animation: 'fade-in',
			showBackdrop: true,
			maxWidth: 300,
			showDelay: 0
		});
			
		var type = "CUSTOMER",id_count = 0,limit = 10000;
		var config = {include_docs:true,startkey : 'customer_', endkey : 'customer_\ufff0',limit:limit};
		var fetchInitDocs = function(){
			$pouchDB.bulkFetch(config).then(function(returnData) {
				//$ionicLoading.hide();
				if(type == "CUSTOMER"){
					$ionicLoading.show({
						template: '<ion-spinner icon="ios"></ion-spinner><br><span class="aiv-loading">Almost there...<br>Fetching Customers '+$scope.allCustomers.length+'</span>',
						animation: 'fade-in',
						showBackdrop: true,
						maxWidth: 300,
						showDelay: 0
					});
					if(returnData.rows.length){
						angular.forEach(returnData.rows,function(row){
							if(row.doc._id.startsWith('customer_')){
								$scope.allCustomers.push(row.doc);
							}
						});
						console.log("GOT "+returnData.rows.length+" CUSTOMERS");
						
						//Uncomment this to retrieve only first few customers for testing
						returnData.rows.length = limit-1;
						
						if(returnData.rows.length < limit){
							//Finished reading customers//Skip next empty call
							shareData.addCustomers($scope.allCustomers);
							if(ids.length){
								type = "ORDER";
								config.skip = 0;
								config.startkey = ids[id_count]+'_order_';
								config.endkey = ids[id_count]+'_order_\ufff0';
								fetchInitDocs();
								
							}else{
								//Finished reading
								$ionicLoading.hide();
								aiv_time_end("INITIAL DATA");
								//DB compaction
								/*var compact_days = (new Date() - new Date($scope.gen_settings.last_compaction)) / (1000 * 60 * 60 * 24);
								if($rootScope.aiv_info.enable_compaction && Math.round(compact_days) > $rootScope.aiv_info.compact_days){
									return $pouchDB.compactDB();
								}*/
							}
						}else{
							config.startkey = returnData.rows[returnData.rows.length - 1].id;
							//$ionicLoading.hide();
							//aiv_time_end("INITIAL DATA");
							config.skip = 1;
							fetchInitDocs(); 
							
						}
					}else{
						if(type == "CUSTOMER"){
							shareData.addCustomers($scope.allCustomers);
						}
						if(ids.length){
							type = "ORDER";
							config.skip = 0;
							config.startkey = ids[id_count]+'_order_';
							config.endkey = ids[id_count]+'_order_\ufff0';
							fetchInitDocs();
						}else{
							//Finished reading
							$ionicLoading.hide();
							aiv_time_end("INITIAL DATA");
							//DB compaction
							/*var compact_days = (new Date() - new Date($scope.gen_settings.last_compaction)) / (1000 * 60 * 60 * 24);
							if($rootScope.aiv_info.enable_compaction && Math.round(compact_days) > $rootScope.aiv_info.compact_days){
								return $pouchDB.compactDB();
							}*/
						}
					}
					
				}else if(type == "ORDER"){
					$ionicLoading.show({
						template: '<ion-spinner icon="ios"></ion-spinner><br><span class="aiv-loading">Almost there...<br>Fetching todays orders '+$scope.cacheOrders.length+'</span>',
						animation: 'fade-in',
						showBackdrop: true,
						maxWidth: 300,
						showDelay: 0
					});
					if(returnData.rows.length){
						angular.forEach(returnData.rows,function(row){
							if(row.doc._id.includes('_order_') && angular.isDefined(row.doc.data) && row.doc.data != null && new Date(row.doc.data.created_at)>=begin_date){
								//Last 1 days order
								$scope.cacheOrders.push(row.doc);
							}
						});
						console.log("GOT "+returnData.rows.length+" "+ids[id_count]+" ORDERS");
						if(returnData.rows.length < limit){
							//Finished reading this terminal//Skip next empty call
							if(id_count < ids.length-1){
								id_count++;
								config.skip = 0;
								config.startkey = ids[id_count]+'_order_';
								config.endkey = ids[id_count]+'_order_\ufff0';
								fetchInitDocs();
							}else{
								//Finished reading
								//Last 1 days order
								shareData.addOrders($scope.cacheOrders);
								$ionicLoading.hide();
								aiv_time_end("INITIAL DATA");
								//DB compaction
								/*var compact_days = (new Date() - new Date($scope.gen_settings.last_compaction)) / (1000 * 60 * 60 * 24);
								if($rootScope.aiv_info.enable_compaction && Math.round(compact_days) > $rootScope.aiv_info.compact_days){
									return $pouchDB.compactDB();
								}*/
							}
						}else{
							config.startkey = returnData.rows[returnData.rows.length - 1].id;
							config.skip = 1;
							fetchInitDocs();
						}
					}else if(id_count < ids.length-1){
						id_count++;
						config.skip = 0;
						config.startkey = ids[id_count]+'_order_';
						config.endkey = ids[id_count]+'_order_\ufff0';
						fetchInitDocs();
					}else{
						//Finished reading
						//Last 1 days order
						shareData.addOrders($scope.cacheOrders);
						$ionicLoading.hide();
						aiv_time_end("INITIAL DATA");
						//DB compaction
						/*var compact_days = (new Date() - new Date($scope.gen_settings.last_compaction)) / (1000 * 60 * 60 * 24);
						if($rootScope.aiv_info.enable_compaction && Math.round(compact_days) > $rootScope.aiv_info.compact_days){
							return $pouchDB.compactDB();
						}*/
					}
				}
				//$ionicLoading.hide();
			}).then(function(compact_res){
				if(compact_res != undefined){
					$scope.gen_settings.last_compaction = new Date().toISOString();
					$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'GenSettings',$scope.gen_settings);
				}
			}).catch(function(error){
				$ionicLoading.hide();
				console.error(error);
				$scope.showCheckoutMsg('Error','An error occurred while reading customer data!!!Try restarting application');
			});
		}
		aiv_time_start();
		fetchInitDocs();
	}

	var getAllCustomers = function(){
		$scope.allCustomers = [];
		$ionicLoading.show({
			template: '<ion-spinner icon="ios"></ion-spinner><br><span class="aiv-loading">Almost there...<br>Fetching Customers</span>',
			animation: 'fade-in',
			showBackdrop: true,
			maxWidth: 300,
			showDelay: 0
		});
		$pouchDB.search('customer_',true,false).then(function(returnData) {
			angular.forEach(returnData.rows, function(customer) {
				$scope.allCustomers.push(customer.doc);
			},$scope.allCustomers);
			//$scope.allCustomers = $filter('orderBy')($scope.allCustomers, 'first_name');
			shareData.addCustomers($scope.allCustomers);
			$ionicLoading.hide();
		}).catch(function(error){
			$ionicLoading.hide();
			console.error(error);
		});
	}
	
	$scope.updateCustomerList = function(customer){
		$scope.allCustomers = shareData.getCustomers();
		shareData.addCustomer(customer);
		//$scope.allCustomers = $filter('orderBy')($scope.allCustomers, 'first_name');
	}
	
	$scope.selectedOrders = {sub_total:0,delivery_charge:0,total:0,orders:[],active:false};
	$scope.showTotal = function(type,input){
		if(type == "TOTAL"){
			//Set total only
			$scope.selectedOrders.total = 0;
			if(input.id>-1){
				for(var i=0;i<$scope.allOrders.length;i++){
					if(angular.isDefined($scope.allOrders[i].data.order_meta.driver) && $scope.allOrders[i].data.order_meta.driver == input.name){
						$scope.selectedOrders.total+=parseFloat($scope.allOrders[i].data.total);
					}
				}
				$scope.selectedOrders.total = $filter('number')($scope.selectedOrders.total,2);
			}
		}else{
			var exists = false;
			var index = -1;
			for(var i=0;i<$scope.selectedOrders.orders.length;i++){
				if($scope.selectedOrders.orders[i].data.order_meta.bill_number == input.data.order_meta.bill_number){
					exists = true;
					index = i;
					break;
				}
			}
			if(input.selected && !exists){
				//Add on check
				$scope.selectedOrders.orders.push(input);
			}else if(!input.selected && exists){//Remove on uncheck
				$scope.selectedOrders.orders.splice(index,1);
			}
			$scope.selectedOrders.total = 0;
			for(var i=0;i<$scope.selectedOrders.orders.length;i++){
				$scope.selectedOrders.total+=parseFloat($scope.selectedOrders.orders[i].data.total);
			}
			$scope.selectedOrders.total = $filter('number')($scope.selectedOrders.total,2);
		}
	}
	
	$scope.showReceiptSlip = function(action,order,trash){
		var receiptPopup = null;
		var print_order = $scope.lastOrder.order;
		if(angular.isDefined(order)){
			print_order = order;
		}
		
		if(action == 'ORDER'){
			receiptPopup = $ionicPopup.show({
				templateUrl: 'order-slip-popup.html',
				title: 'ORDER SLIP',
				scope: $scope,
				buttons: [
				  { text: 'Close',
					type: 'button-positive',
				  },
				  {
					text: '<b>PRINT</b>',
					type: 'button-balanced',
					onTap: function(e) {
						return true;
					}
				  }
				]
			});
		}else{
			receiptPopup = $ionicPopup.show({
				templateUrl: 'order-slip-popup.html',
				title: 'ORDER SLIP',
				scope: $scope,
				buttons: [
				  { text: 'Close',
					type: 'button-positive',
				  }
				]
			});
		}

		receiptPopup.then(function(res) {
			if(action == 'ORDER'){
				if(res){
					$scope.print_config.receipt = true;
					$scope.printReceipt(print_order.data,false,false);
				}
				
				checkEndAction(true);
				
			}else if(action == 'PAYOFF'){
				clear_payment();
				$scope.selectedOrders = {sub_total:0,delivery_charge:0,total:0,orders:[],active:false};
				checkEndAction(false);	
			}else{
				if(angular.isDefined(trash)&&trash){
					trashOrder();
				}else{
					clear_payment();
				}
			}
		});
	}

	$scope.sms_customers = {customers:[],selectAll:false};
	$scope.openSMSModal = function(){
		$scope.sms = {
			'content':'',
			'searchCust':'',
			'recipients':'',
			'template_view':false
		};
		$scope.spinDisabled = true;
		$scope.sms_customers.customers = shareData.getCustomers();
		$scope.sms_customers.selectAll = false;
		if($scope.sms_modal == undefined || !$scope.sms_modal._isShown){
			$scope.setKeyInput('SMS_CONTENT',$scope.sms.content);
			$ionicModal.fromTemplateUrl('sms-modal.html', {
				id:'SEND_SMS',
				scope: $scope,
				backdropClickToClose: false,
				animation: 'slide-in-up'
			}).then(function(modal) {
				$scope.sms_modal = modal;
				$scope.openModal('SEND_SMS');
			});
		}
	}
	
	$scope.selectAllCustomers = function(){
		$scope.errors.sms = '';
		for(var i=0;i<$scope.sms_customers.customers.length;i++){
			if($scope.sms_customers.selectAll){
				var phone = $scope.sms_customers.customers[i].billing_address.phone;
				if(phone>=10){
					$scope.sms_customers.customers[i].selected = $scope.sms_customers.selectAll;
					$scope.sms.recipients+= phone+",";
				}else{
					$scope.errors.sms = "Phone numbers should be at least 10 digits.Invalid phone numbers not added";
				}
			}else{
				$scope.sms_customers.customers[i].selected = $scope.sms_customers.selectAll;
				$scope.sms.recipients = '';
			}
		}
	}
	
	$scope.addSMSCustomer = function(phone,email,selected){
		$scope.errors.sms = '';
		if(selected){
			if(phone>=10){
				$scope.sms.recipients+= phone+",";
			}else{
				$scope.errors.sms = "Phone numbers should be at least 10 digits.";
			}
		}else{
			$scope.sms.recipients = $scope.sms.recipients.replace(phone+",","")
		}
	}
	
	$scope.sms = {
		'content':'',
		'searchCust':'',
		'recipients':'',
		'template_view':false
	};
	$scope.sendSMS = function(message){
		$scope.errors.sms = "";
		$scope.success_done.sms = "";
		
		var phone_numbers = $scope.sms.recipients.split(",");
		var recipients = [];
		for(var i=0;i<$scope.sms_customers.customers.length;i++){
			if($scope.sms_customers.customers[i].selected && $scope.sms_customers.customers[i].email){
				recipients.push({mail:$scope.sms_customers.customers[i].email,phone:$scope.sms_customers.customers[i].billing_address.phone});
				for(var j=0;j<phone_numbers.length;j++){
					var org_num = $scope.sms_customers.customers[i].billing_address.phone.substr(-10);
					var edited_num = phone_numbers[j].substr(-10);
					if(org_num == edited_num){
						phone_numbers.splice(j,1);
						break;
					}
				}
			}
		}
		
		for(var j=0;j<phone_numbers.length;j++){
			if(phone_numbers[j]>=10){
				var d = new Date();
				recipients.push({mail:'dummy'+d.getTime()+''+j+'@example.com',phone:phone_numbers[j]});
			}
		}
		
		if(!recipients.length){
			$scope.errors.sms = "Please select atleast one recipient!!!";
			return;
		}else if(!message){
			$scope.errors.sms = "Please add message content!!!";
			return;
		}
		
		var confirmPopup = $ionicPopup.confirm({
		 title: 'Warning',
		 template: 'Are you sure you want to send this message?'
	   });

	   confirmPopup.then(function(res) {
		 if(res) {
			$scope.spinDisabled = false;
			$ionicLoading.show({
				template : '<h2>Processing Message...</h2>',
				duration : 1000
			});
			$scope.httpRequest = dataService.sendSMS(message,recipients);
			$scope.httpRequest.then(function(result) {
				if(result.Success){
					$scope.success_done.sms = "Last message campaign was successful...";
					console.log(result.data);
					$scope.sms_customers.selectAll = false;
					$scope.selectAllCustomers();
				}else{
					$scope.errors.sms = "Last message campaign failed..."
					console.error(result.error);
				}
				$scope.spinDisabled = true;
				//$ionicLoading.hide();
			}).catch(function(error){
				$scope.spinDisabled = true;
				//$ionicLoading.hide();
				console.error(error);
				
				var msg = '';
				if(!err){
					$scope.errors.sms = "No internet connection!!!";
				}else if(angular.isDefined(err.error)){
					if(err.error == "timeout"){
						$scope.errors.sms = "Failed to send message due to slow internet connection";
					}else{
						$scope.errors.sms = "Failed to send message.Request aborted!!!";
					}
				}else{
					$scope.errors.sms = "Failed to send message..."
				}
			});
		 }
		});
	}

	$scope.showCustomerInfo = function(){
		if($scope.delivery_areas.show){
			$scope.delivery_areas.show = false;
		}
		
		if($scope.post_lookup.show_billing_streets){
			$scope.post_lookup.show_billing_streets = false;
		}
	}
	
	$scope.showDeliveryDrivers = function(){
		if(!$scope.selectedOrders.orders.length){
			$scope.showCheckoutMsg('Warning','Please select atleast one delivery order with on-hold/kitchen-ready/completed status');
			return;
		}
		
		$scope.spinDisabled = true;
		var proceed = {shipping:true,status:true};
		for(var i=0;i<$scope.selectedOrders.orders.length;i++){
			if(angular.isArray($scope.selectedOrders.orders[i].data.shipping_lines) && $scope.selectedOrders.orders[i].data.shipping_lines.length && $scope.selectedOrders.orders[i].data.shipping_lines[0].method_id == 'local_delivery'){
				//Do nothing
			}else{
				proceed.shipping = false;
				break;
			}
			
			if($scope.selectedOrders.orders[i].data.status != "on-hold" && $scope.selectedOrders.orders[i].data.status != "completed" 
				&& $scope.selectedOrders.orders[i].data.status != "kitchen-ready"){
				proceed.status = false;
				break;
			}
		}
		
		if(!proceed.shipping){
			$scope.showCheckoutMsg('Warning','Only delivery orders can be assigned to driver');
		}else if(!proceed.status){
			$scope.showCheckoutMsg('Warning','Only orders with status as on-hold,kitchen-ready and completed status can be assigned');
		}else{
			$scope.order_view.view = 'DRIVER_LIST';
		}
	}
	
	$scope.setSelectedDriver = function(driver){
		$scope.delivery_drivers.selected = driver.name;
		$scope.spinDisabled = false;
	}
	
	$scope.back2Order = function(action){
		if(action == 'ORDERS'){
			$scope.delivery_drivers.selected = '';
		}
		$scope.order_view.view = action;
	}
	
	$scope.assignDeliveryDriver = function(){
		$scope.spinDisabled = true;
		$ionicLoading.show({
			template: '<ion-spinner icon="ios"></ion-spinner><br><span class="aiv-loading">Assigning driver...<br>Please wait</span>',
			animation: 'fade-in',
			showBackdrop: true,
			maxWidth: 300,
			showDelay: 0
		});
		
		var selected_del_orders = [];
		for(var i=0;i<$scope.selectedOrders.orders.length;i++){
			var order = angular.copy($scope.selectedOrders.orders[i]);
			if(angular.isArray(order.data.shipping_lines) && order.data.shipping_lines.length && order.data.shipping_lines[0].method_id == 'local_delivery'){
				order.data.order_meta.driver = $scope.delivery_drivers.selected;
				//order.data.status = "completed";
				order.data.order_meta.processed_by = $scope.terminalData.name;
				order.data.updated_at = new Date().toISOString();
				selected_del_orders.push(order);
			}
		}
		
		$scope.printPayoffReceipt(selected_del_orders,'DRIVER_PRINT',false);
		Promise.all(selected_del_orders.map(function (order) {
			return $pouchDB.upsert(order._id,function(doc){
				if(doc != undefined){
					doc.data.order_meta.driver = $scope.delivery_drivers.selected;
					//doc.data.status = "completed";
					doc.data.order_meta.processed_by = $scope.terminalData.name;
					doc.data.updated_at = new Date().toISOString();
					return doc;
				}
				return false;
			});
		})).then(function (results) {
			$scope.spinDisabled = false;
			$scope.order_view.view = 'ORDERS';
			//$scope.showReceiptSlip('PAYOFF');
			for(var i=0;i<selected_del_orders.length;i++){
				for(var j=0;j<$scope.allOrders.length;j++){
					$scope.allOrders[j].selected = false;
					if(selected_del_orders[i]._id == $scope.allOrders[j]._id && 
						angular.isArray($scope.allOrders[j].data.shipping_lines) && $scope.allOrders[j].data.shipping_lines.length && $scope.allOrders[j].data.shipping_lines[0].method_id == 'local_delivery'){
						$scope.allOrders[j].data.order_meta.driver = $scope.delivery_drivers.selected;
						//$scope.allOrders[j].data.status = "completed";
						$scope.allOrders[j].data.order_meta.processed_by = $scope.terminalData.name;
						$scope.allOrders[j].data.updated_at = new Date().toISOString();
						break;
					}
				}
				
				for(var j=0;j<$scope.allOrdersCache.length;j++){
					$scope.allOrdersCache[j].selected = false;
					if(selected_del_orders[i]._id == $scope.allOrdersCache[j]._id && 
						angular.isArray($scope.allOrdersCache[j].data.shipping_lines) && $scope.allOrdersCache[j].data.shipping_lines.length && $scope.allOrdersCache[j].data.shipping_lines[0].method_id == 'local_delivery'){
						$scope.allOrdersCache[j].data.order_meta.driver = $scope.delivery_drivers.selected;
						//$scope.allOrdersCache[j].data.status = "completed";
						$scope.allOrdersCache[j].data.order_meta.processed_by = $scope.terminalData.name;
						$scope.allOrdersCache[j].data.updated_at = new Date().toISOString();
						break;
					}
				}
			}
			$scope.selectedOrders = {sub_total:0,delivery_charge:0,total:0,orders:[],active:false};
			$scope.delivery_drivers.selected = '';
			$ionicLoading.hide();
			$ionicLoading.show({
				template : '<h2>Assigned driver '+$scope.delivery_drivers.selected+'...</h2>',
				duration : 1300
			});
		}).catch(function(error){
			$scope.showCheckoutMsg('Error',"Failed to assign driver!!!");
			$scope.spinDisabled = false;
			$scope.order_view.view = 'ORDERS';
			$scope.delivery_drivers.selected = '';
			console.error(error);
			$ionicLoading.hide();
		});
	}
	
	$scope.allOrdersCache = [];
	$scope.getDriverOrders = function(driver){
		if(driver.id == -1){
			if($scope.allOrdersCache.length != $scope.allOrders.length){
				$scope.allOrders = angular.copy($scope.allOrdersCache);
			}
			$scope.selectedOrders.total = 0;
		}else{
			$scope.allOrders = [];
			for(var j=0;j<$scope.allOrdersCache.length;j++){
				if(angular.isDefined($scope.allOrdersCache[j].data.order_meta.driver) && $scope.allOrdersCache[j].data.order_meta.driver == driver.name){
					$scope.allOrders.push($scope.allOrdersCache[j]);
				}
			}
			$scope.showTotal('TOTAL',driver);
		}
	}

	$scope.row_col_2=[];
	$scope.table_view='LAYOUT';
	$scope.layout =[];
	$scope.tableLayout = function(item){
		
		for(var i=0;i<$scope.aiv_tables.length;i++)
		{
			if($scope.aiv_tables[i].table_loc)
			{
				$scope.layout.push($scope.aiv_tables[i].table_loc);
			}
		}
		if(item =='LAYOUT')
		{
			$scope.table_view ='LAYOUT';
		}
		else if(item =='LAYOUT1')
		{
			$scope.table_view ='LAYOUT1';
		}
	};

	$scope.row_colClick = function(){
		$scope.row_mode ='ROW_COL';
	};
	
	$scope.rowColColor =function(rowindex,colindex){
		var selectedTabele =''; 
		var exists = false;
		$scope.settings_error.err = '';
		for(var j=0;j<$scope.aivTableInfo.length;j++)
		{
			for(var i=0;i<$scope.aivTableInfo[j].length;i++)
			{
				if(i==colindex && j==rowindex)
				{
					exists = false;
					for(var a=0;a<$scope.aiv_tables.length;a++)
					{
						if(colindex == $scope.aiv_tables[a].table_loc.col && rowindex== $scope.aiv_tables[a].table_loc.row)
						{
							$scope.settings_error.err = "Table already allocated in this location.Please select another location";
							exists = true;
							break;
						}
					}
					
					if(!exists){
						if($scope.aiv_table.table_loc!='')
						$scope.aivTableInfo[$scope.aiv_table.table_loc.row][$scope.aiv_table.table_loc.col].selected=false;
						$scope.aivTableInfo[j][i].selected =true;
						$scope.aiv_table.table_loc={row:j,col:i};
					}else{
						break;
					}
					console.log("Selected location "+j+","+i);
				}
				else
				{
					$scope.row_col_2[j][i].selected =false;
				}
			}
			if(exists){
				break;
			}
		}
	};
	
	$scope.isIndex = function(table,index){
		return table.table_loc.row==parseInt(index/$scope.table_matrix.col) && table.table_loc.col==index%$scope.table_matrix.col;
	}
	
	$scope.resetPrinterFields = function(printer){
		if(printer.id){
			$scope.settings_data.printers = angular.copy($scope.AIVPrinterSettings);
		}else{
			printer.name = '';
			printer.lineLength = 48;
			printer.cmd_cut = default_print_cmds.cut;
			printer.cmd_don = default_print_cmds.don;
			printer.cmd_doff = default_print_cmds.doff;
			printer.cmd_bon = default_print_cmds.bon;
			printer.cmd_boff = default_print_cmds.boff;
			printer.cmd_lon=default_print_cmds.lon,
		    printer.cmd_loff=default_print_cmds.loff,
			printer.cmd_cashdrawer = default_print_cmds.cashdrawer;
			printer.enable_cut = true;
			printer.usage = 'Main';
			printer.dept = 'None';
		}
	}
	
	$scope.savePrinter = function(printer,add){
		if(add){
			var id = 0,i = 1;
			do{
				var exists = $filter('filter')($scope.settings_data.printers,{id:i},true);
				if(!exists.length){
					//Got new id...exit
					id = i;
					break;
				}
				i++;
			}while(!id);
			var new_printer = angular.copy(printer);
			new_printer.id = i;
			$scope.settings_data.printers.push(new_printer);
			$scope.resetPrinterFields(printer);
		}
		$scope.AIVPrinterSettings = angular.copy($scope.settings_data.printers);
		$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'AIVPrinterSettings',$scope.AIVPrinterSettings);
	}
	
	$scope.removePrinter = function(printer){
		for(var p=0;p<$scope.settings_data.printers.length;p++){
			if($scope.settings_data.printers[p].id == printer.id){
				$scope.settings_data.printers.splice(p,1);
			}
		}
		$scope.AIVPrinterSettings = angular.copy($scope.settings_data.printers);
		$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'AIVPrinterSettings',$scope.AIVPrinterSettings);
	}

	$scope.showCustomOrderModal = function(){
		if($scope.custom_order_modal == undefined || !$scope.custom_order_modal._isShown){
			var method = {'id':'','title':'Takeaway','method_title':'','method_description':'','fee':''};
			$scope.saveInitialShipping(method);
			$scope.custom_order_product = {
				"id":"",
				"product_id": "",
				"sku": "",
				"price": "",
				"featured_src": "",
				"title": "JustEat Order",
				"categories": ["Open Item"],
				"attributes":[],
				"meta":"",
				"err":""
			};
			$scope.order_note = {note:''};
			$scope.order_note.note = $scope.formCheckout.shipping_note;
			$scope.setKeyInput('CUSTOM_ORDER_AMT',$scope.custom_order_product.price);
			$ionicModal.fromTemplateUrl('custom-order-modal.html', {
				id:'CUSTOM_ORDER',
				scope: $scope,
				backdropClickToClose: false,
				animation: 'none'
			}).then(function(modal) {
				$scope.custom_order_modal = modal;
				$scope.openModal('CUSTOM_ORDER');
			});
			
			$scope.quickCustomers = [];
			var first_name = "JUST-EAT";
			$scope.quickCustomers = $filter('filter')($scope.allCustomers, function(customer){
				return customer.first_name.toLowerCase().indexOf(first_name.toLowerCase())>-1;
			});
			if($scope.quickCustomers.length){
				//Found customer
				$scope.selected_customer = angular.copy($scope.quickCustomers[0]);
				$scope.quickCustomers = [];
				$scope.formCheckout.billing_address = $scope.selected_customer.billing_address;
				$scope.formCheckout.customer_id = $scope.selected_customer.id;
				$scope.formCheckout.shipping_address = $scope.selected_customer.shipping_address;
				$scope.formCheckout.customer_meta = $scope.selected_customer.meta;
				$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'formCheckout', $scope.formCheckout);
			}else{
				//Create customer
				$scope.formCheckout.billing_address.phone = "01111111111";
				$scope.formCheckout.billing_address.first_name = first_name;
				$scope.formCheckout.shipping_address.first_name = first_name;
				var now_date = new Date().toISOString();
				var next_seq = $scope.terminalData.last_customer_seq?(parseInt($scope.terminalData.last_customer_seq)+1):1;
				var docid = "customer_"+$scope.terminalData.prefix+next_seq;
				var new_customer = {
				   "_id": docid,
				   "id": 'new',
				   "created_at": now_date,
				   "email": 'justeat11111@example.com',
				   "first_name": first_name,
				   "last_name": '',
				   "username": "",
				   "role": "customer",
				   "last_order_id": "",
				   "last_order_date": "",
				   "orders_count": 0,
				   "total_spent": "",
				   "avatar_url": "",
				   "billing_address": $scope.formCheckout.billing_address,
				   "shipping_address": $scope.formCheckout.shipping_address,
				   "meta":{
						"loyalty_card_id":"",
						"points_to_unlock":0,
						"points_to_redeem":0,
						"redeem_amount":0,
						"total_used_points":0,
						"current_redeem_points":0,
						"reward_coupon":"",
						"reward_type":"MONEY",
						"redeem_status":"TRUE",
						"docid":docid
					}
				}
				$scope.selected_customer = new_customer;
				$pouchDB.save(new_customer).then(function(ret) {
					if(ret != undefined){
						$scope.formCheckout.customer_id = new_customer.id;
						$scope.formCheckout.billing_address = angular.copy(new_customer.billing_address);
						$scope.formCheckout.shipping_address = angular.copy(new_customer.shipping_address);
						$scope.formCheckout.sameAddress = $scope.formCustomer.sameAddress;
						$scope.formCheckout.customer_meta.docid = docid;
						$scope.saveForm();

						return $pouchDB.upsert($scope.terminalData._id,function(doc){
							if(angular.isDefined(doc._id)){
								doc.last_customer_seq = next_seq;
							}
							return doc;
						});
					}
				}).catch(function(error){
					$scope.custom_order_product.err = 'Failed to create customer...';
				});
			}
		}
	}
	$scope.assignBagChargeCustomOrder =function(item){
		var confirmPopup = $ionicPopup.confirm({
			title: 'Bag Charges',
			template: '<label><span>'+$rootScope.aiv_info.currency_symbol+$scope.bagCharges.selected+'</span> bagcharge is added by default. Do you want to keep it?.</label>',
			cssClass: 'aiv-popup',
			buttons: [{ 
				text: 'NO',
				type: 'button-assertive',
				onTap: function(e) {
					$scope.bagCharges.selected = 0;
					$scope.createCustomOrder(item);
					return true;
				}
			},{ 
				text: 'YES',
				type: 'button-positive',
				onTap: function(e) {
					return true;
				}
			}]
		});

		confirmPopup.then(function(res) {
			if(res) {
				//$scope.checkBagCharges(true);
				$scope.createCustomOrder(item);
			}
		});
	}	
	
	$scope.createCustomOrder = function(item){
		$scope.custom_order_product.err = '';
		if(!item.price || !parseFloat(item.price)){
			$scope.custom_order_product.err = "Amount is required!!!";
			item.price = 0;
			return;
		}
		
			
		
		//Assign note
		$scope.formCheckout.shipping_note = $scope.order_note.note;
		
		//Add custom product to cart
		item.regular_price = item.price;
		$scope.onClickProduct(item);
		$scope.calculateTotal($scope.cartItems[0],0);
		
		//Set payment method
		$scope.payment_select.to_pay = $scope.grand.Total + $scope.grand.Shipping - $scope.grand.Discount + $scope.payment_fee + $scope.bagCharges.selected;
		var default_method = $filter('filter')($scope.PaymentMethods,{id:'cod'},false);
		if(default_method.length){
			$scope.payment_select.id = default_method[0].id;
			$scope.savePayment(default_method[0]);
		}
		$scope.payment_select.amount = '';
		$scope.payment_select.tender = '';
		$scope.payment_select.delivery = false;

		if($scope.pos_action.done_clicked) return;
		$scope.pos_action.done_clicked = true;

		$scope.formCheckout.payment_details.method_title = $scope.selected_pay.method_title;
		$scope.formCheckout.payment_details.method_id = $scope.selected_pay.id;
		$scope.saveForm();

		$ionicLoading.show({
			template: '<ion-spinner icon="ios"></ion-spinner><br><span class="aiv-loading">Placing order<br>Please wait...</span>',
			animation: 'fade-in',
			showBackdrop: true,
			maxWidth: 300,
			showDelay: 0
		});
		getDailyOrderNo(true).then(function(ordernum_data){
			var new_order = createOrder('completed');
			new_order.data.status = 'completed';
			
			$scope.print_config.copies = 1;
			$scope.print_config.kot = false;
			//Open cash drawer
			if(!$scope.print_config.receipt)
				$scope.openCashdrawer();	
			$scope.printReceipt(new_order.data,true,false);
				
			//Place order
			$pouchDB.save(new_order).then(function(returnData) {
				$scope.pos_action.done_clicked = false;
					
				$scope.terminalData.last_bill_number = parseInt($scope.terminalData.last_bill_number)+1;
				$scope.terminalData.last_order_seq = parseInt($scope.terminalData.last_order_seq)+1;
				$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'terminalData',$scope.terminalData);
				$pouchDB.upsert($scope.terminalData._id,function(doc){
					if(doc != undefined && doc._id != undefined){
						doc.last_bill_number = $scope.terminalData.last_bill_number;
						doc.last_order_seq = $scope.terminalData.last_order_seq;
						return doc;
					}
					return false;
				}).then(function(returnData) {
				}).catch(function(error){
					console.error('Unable to update billnumber '+error);
				});
					
				if(angular.isDefined(returnData.ok)){
					if(!returnData.ok){
						$ionicLoading.hide();
						$scope.custom_order_product.err = returnData.Message;
					}else{
						$ionicLoading.hide();
						var daily_num = ($scope.dailyOrderNo.prefix+$scope.dailyOrderNo.num);
						$ionicLoading.show({
							template : '<h2>Order '+daily_num+' Placed...</h2>',
							duration : 1300
						});
						
						if(!$scope.dailyOrderNo.common){
							$scope.dailyOrderNo.num++;
							$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'order_no',$scope.dailyOrderNo);
						}
						
						$scope.closeModal('CUSTOM_ORDER');

						//DB compaction
						var compact_days = (new Date() - new Date($scope.gen_settings.last_compaction)) / (1000 * 60 * 60 * 24);
						if($rootScope.aiv_info.enable_compaction && Math.round(compact_days) > $rootScope.aiv_info.compact_days){
							$pouchDB.compactDB().then(function(compact_res){
								$scope.gen_settings.last_compaction = new Date().toISOString();
								$localstorage.setObject(AIV_CONSTANTS.LS_PREFIX+'GenSettings',$scope.gen_settings);
							});
						}
					}
				}else{
					$ionicLoading.hide();
					$scope.custom_order_product.err = 'Unable to place your order.Please try again...';
				}
			}).catch( function(error) {
				$ionicLoading.hide();
				$scope.pos_action.done_clicked = false;
				$scope.custom_order_product.err = 'Unable to place your order.Please contact the administrator...';
			});
		});
	}
	
	$scope.updateDash = function(add,index){
		if(add && $scope.idSelectedItem.index!=null && $scope.idSelectedItem.index<$scope.cartItems.length){
			//Add dash
			$scope.cartItems[$scope.idSelectedItem.index].dash = true;
		}else if(!add && index<$scope.cartItems.length){
			//Remove dash
			$scope.cartItems[index].dash = false;
		}
	}
	
	$scope.cartNavigation = function(direction){
		/*var scroll_element = angular.element(document.querySelector('#cart-scroll')); 
		var scroll_height = 210;
		if(scroll_element.length){
			scroll_height = scroll_element[0].offsetHeight;
		}
		var current_pos = $ionicScrollDelegate.$getByHandle('cartScroll').getScrollPosition();*/

		var scrollpos = 35; //in pixels
		if(direction == "UP"){
			
			if($scope.idSelectedItem.index>0)
			{
				if(angular.isDefined($scope.cartItems[$scope.idSelectedItem.index-1].sel_variations)){
					scrollpos+=(Object.keys($scope.cartItems[$scope.idSelectedItem.index-1].sel_variations).length*scrollpos);
				}
				$scope.setSelectedItem($scope.idSelectedItem.index-1,$scope.cartItems[$scope.idSelectedItem.index-1]);
				$ionicScrollDelegate.$getByHandle('cartScroll').scrollBy(0,-(scrollpos));
			}
		}else{
			if($scope.idSelectedItem.index<$scope.cartItems.length-1)
			{
				if(angular.isDefined($scope.cartItems[$scope.idSelectedItem.index].sel_variations)){
					scrollpos+=(Object.keys($scope.cartItems[$scope.idSelectedItem.index].sel_variations).length*scrollpos);
				}
				$scope.setSelectedItem($scope.idSelectedItem.index+1,$scope.cartItems[$scope.idSelectedItem.index+1]);
				$ionicScrollDelegate.$getByHandle('cartScroll').scrollBy(0,scrollpos);
			}
		}
	}
	
	$scope.generateLoyaltyCard = function(){
		var card_id = 0,count = 0,card_id_true = false,customer_doc;
		do{
			card_id = randomIntFromInterval(8700000000,8799999999);
			count++;
			if(count >= 99999999){
				break;
			}
			card_id_true = true;
			customer_doc = shareData.getCustomer("LOYALTY_CARD",card_id);
			if(angular.isDefined(customer_doc._id)){
				//Card number exists and assigned to customer
				card_id_true = false;
			}
			console.log("repateing customers");
		}while(!card_id_true);
		
		if(!card_id){
			console.error("Failed to generate loyalty card");
			$scope.showCheckoutMsg('Warning',"Failed to generate loyalty card");
		}
		return card_id;
	}
	
	var randomIntFromInterval = function(min,max){
		return Math.floor(Math.random()*(max-min+1)+min);
	}
		
	var testOrders = function(){
		/*$ionicLoading.show({
			template: '<ion-spinner icon="ios"></ion-spinner><br><span>Placing order<br>Please wait...</span>',
			animation: 'fade-in',
			showBackdrop: true,
			maxWidth: 300,
			showDelay: 0
		});*/
		var new_seq = parseInt($scope.terminalData.last_order_seq) + 1;
		var doc_id = $scope.terminalData.name+'_order_'+new_seq;
		var last_bill_number = $scope.terminalData.last_bill_number;
		var now_date = new Date().toISOString();
		var order_num = 0;
		
		var place_test_orders = function(){
			var rand_cat = $scope.allProducts[$scope.categories[randomIntFromInterval(0,$scope.categories.length-1)].slug];
			var item = rand_cat[randomIntFromInterval(0,rand_cat.length-1)];
			var line_items = [{
				"id":"",
				"product_id": item.id,
				"sku": item.sku,
				"quantity": 1,
				"subtotal": item.price,
				"total": item.price,
				"price": item.price,
				"featured_src": item.featured_src,
				"title": item.title,
				"categories": item.categories,
				"dept" : "",
				"status":'',
				"notes": ''
			}]
					
			var new_order = {
			   "_id":doc_id,
			   "data":{
				   "id": "",
				   "order_number": $scope.terminalData.prefix+''+last_bill_number,
				   "order_key": "",
				   "created_at": now_date,
				   "updated_at": now_date,
				   "completed_at": now_date,
				   "status": 'completed',
				   "currency": "GBP",
				   "total": line_items[0].total,
				   "subtotal": line_items[0].total,
				   "total_line_items_quantity": line_items[0].quantity,
				   "total_tax": "0.00",
				   "total_shipping": 0,
				   "cart_tax": "0.00",
				   "shipping_tax": "0.00",
				   "total_discount": 0,
				   "shipping_methods": "",
				   "payment_details": {
					   "method_id": "cod",
					   "method_title": "Cash on Delivery",
					   "paid": true
					},
				   "billing_address": {
						"first_name": "",
						"last_name": "",
						"address_1": "",
						"address_2": "",
						"city": "",
						"state": "",
						"postcode": "",
						"country": "GB",
						"email": "",
						"phone": "",
						"company": ""
					},
				   "shipping_address": {
						"first_name": "",
						"last_name": "",
						"address_1": "",
						"address_2": "",
						"city": "",
						"state": "",
						"postcode": "",
						"country": "GB",
						"email": "",
						"phone": "",
						"company": ""
					},
				   "note": "",
				   "customer_ip": "",
				   "customer_user_agent": "",
				   "view_order_url": "",
				   "line_items": line_items,
				   "shipping_lines": '',
				   "tax_lines": [],
				   "fee_lines": [],
				   "coupon_lines": [],
				   "customer_id":"guest",
				   "order_meta": {
					   "bill_number": $scope.terminalData.prefix+''+last_bill_number,
					   "doc_id": doc_id,
					   "wc_pos_order_type": 'POS',
					   "daily_order_no":order_num,
					   "ordered_at":now_date,
					   "customer_docid":"",
					   "order_shop_id":$rootScope.aiv_info.shop_id,
					   "order_dbname":$rootScope.aiv_info.dbname,
					   "shop_email":$rootScope.aiv_info.email,
					   "shop_name":$rootScope.aiv_info.shop_name,
					   "sitin_table":""
				   }
				}
			};
			
			new_seq++;
			doc_id = $scope.terminalData.name+'_order_'+new_seq;
			last_bill_number++;
			now_date = new Date().toISOString();
			order_num++;
			
			//Place order
			$pouchDB.save(new_order).then(function(returnData) {
				if(angular.isDefined(returnData.ok)){
					if(!returnData.ok){
						//$ionicLoading.hide();
					}else{
						//$ionicLoading.hide();
						$ionicLoading.show({
							template : '<h2>Order '+order_num+' Placed...</h2>',
							duration : 500
						});
						if(order_num<500){
							place_test_orders();
						}
					}
				}else{
					//$ionicLoading.hide();
				}
			}).catch( function(error) {
				//$ionicLoading.hide();
				console.error(error);
			});
		}
		
		place_test_orders();
	}
	
	var time_start,time_end;
	var aiv_time_start = function(){
		//Execution time---start
		time_start = performance.now();
		time_end = time_start;
	}
	
	var aiv_time_end = function(message){
		//Execution time---end
		time_end = performance.now();
		console.info("EXECUTION TIME "+message+" : "+(time_end-time_start)+" milliseconds");
	}
	
	var getTimeDiff = function(date1,date2,type){
		var output = 0;
		var diff = new Date(date1) - new Date(date2);
		if(type == "MINUTES"){
			output = Math.round((diff/1000)/60);
		}
		return output;
	}

	$scope.scroll_height = '1024px';
	$scope.sms_cust_list_height = '1024px';
	$scope.sms_cust_edit_hide_height = '1024px';
	$scope.calculateDimensions = function(gesture) {
		$scope.dev_width = $window.innerWidth;
		$scope.dev_height = $window.innerHeight;
		//Header+footer+keyboard+padding-bottom
		$scope.scroll_height = ($scope.dev_height-(325+45+45))+'px';
		$scope.sms_cust_list_height = ($scope.dev_height-170)+'px';
		$scope.sms_cust_edit_hide_height  = ($scope.dev_height-90)+'px';
	}
		 
	angular.element($window).bind('resize', function(){
		$scope.$apply(function() {
		  $scope.calculateDimensions();    
		})       
	});
		 
	$scope.calculateDimensions();
	
	var reloadApp = function(){
		$ionicLoading.show({
			template : '<h2>Application need a restart.Restarting in 3 seconds...</h2>',
		});
		$timeout(function () {
			$window.location.reload(true);
		}, 3000);
	}
	
	var getDataOffline = function(){
		var clock_doc = 'clock_'+getWorkingDate();
		var docs = [
			'getNotifications','getShopInfo','getCerts',
			'getCountries','getPaymentMethods',
			'getShippingDetails','getTerminals','getUsers',
			'getSettings','getUKPostcodes',
			'getSMSTemplates',$scope.terminalData._id,clock_doc,'getPurchaseItem','updateHeartBeat'
		];
		
		if($scope.terminalData.type != 'BACK' || ($scope.terminalData.type == 'BACK' && $scope.backTemplate.id != 'MPOS')){
			docs.push('getCoupons','getCategory','getDepts','cook_inst','getTables','getBagCharges','getDeliveryDrivers','getDiscounts','getProductGroups');
		}
		
		var config = {
			keys:docs,
			include_docs: true
		}
		$ionicLoading.show({
			template: '<ion-spinner icon="ios"></ion-spinner><br><span class="aiv-loading">Initial loading...<br>Please wait</span>',
			animation: 'fade-in',
			showBackdrop: true,
			maxWidth: 300,
			showDelay: 0
		});
		$pouchDB.bulkFetch(config).then(function(initial_docs){
			angular.forEach(initial_docs.rows,function(data){
				getDBChanges(data.doc,true);
			});
			
			var docs = [];
			for(var i=0;i<$scope.aiv_terminals.terminals.length;i++){
				docs.push($scope.aiv_terminals.terminals[i].id);
			}
			for(var i=0;i<$scope.all_users.length;i++){
				docs.push($scope.all_users[i]);
			}
			for(var i=0;i<$scope.categories.length;i++){
				docs.push($scope.categories[i].slug);
			}
			
			config = {
				keys:docs,
				include_docs: true
			}
			return $pouchDB.bulkFetch(config);
		}).then(function(secondary_docs){
			$ionicLoading.hide();
			$rootScope.$broadcast('aiv.pos_initialized');
		}).catch(function(error){
			$ionicLoading.hide();
			$scope.showCheckoutMsg('Error',"An error occurred while retrieving data");
			console.error(error);
		})
	}
	
	$scope.sitin_tables = {tables:[],selected:0};
	$scope.dbPopup = null;
	$scope.showdbPopup = function(){
		$scope.setKeyInput('INIT_IP',$scope.settings_data.localdb_ip);
		$scope.dbPopup = $ionicPopup.show({
			templateUrl: 'db-popup.html',
			title: 'Set local server ip',
			scope: $scope,
			cssClass: 'wide-popup',
			buttons: [
			  {
				text: '<b>Save</b>',
				type: 'button-positive',
				onTap: function(e) {
				  if (!$scope.settings_data.localdb_ip) {
					//don't allow the user to close unless ip is entered
					e.preventDefault();
				  } else {
					if($scope.setLocalIp('PRIMARY')){
						return true;
					}else{
						e.preventDefault();
					}
				  }
				}
			  }
			]
		});

		$scope.dbPopup.then(function(res) {
			console.log('Tapped!', res);
		});
	}
	
	$scope.checkDiscountPassword = function(pass){
		if($scope.isManagerAuthorized(pass)){
			$scope.pre_loginInfo = angular.copy($scope.loginInfo);
			$scope.loginInfo.role = "shop_manager";
			$scope.setKeyInput('DISCOUNT',$scope.cart_discount.disc_num);
		}else{
			$ionicLoading.show({
				template : '<h2>Wrong password!!!</h2>',
				duration : 800
			});
		}
	}
	
	$scope.isManagerAuthorized = function(pass){
		var passed = false;
		//Check if master password
		if(PHPass.CheckPassword(pass, $scope.master_pass)){
			passed = true;
		}else{
			//Check for Manager password 
			for(var u=0;u<$scope.aiv_users.users.length;u++){
				if($scope.aiv_users.users[u].role == 'shop_manager' && 
					(pass == $scope.aiv_users.users[u].user_pass || PHPass.CheckPassword(pass, $scope.aiv_users.users[u].user_pass))){
					passed = true;
					break;
				}
			}
		}
		return passed;
	}
	$scope.IsPasswordMatchingClockStatus = function(pass){
		var passed = false;
		for(var u=0;u<$scope.aiv_users.users.length;u++){
			if(PHPass.CheckPassword(pass, $scope.aiv_users.users[u].user_pass)){
				$scope.selectClockUser($scope.aiv_users.users[u]);
				passed = true;
				break;
			}
		}
		return passed;
	}
	$scope.IsPasswordMatching = function(id,pass){
	
		var passed = false;
		//Check if master password
		if(PHPass.CheckPassword(pass, $scope.master_pass)){
			passed = true;
		}else{
			for(var u=0;u<$scope.aiv_users.users.length;u++){
				if(id == $scope.aiv_users.users[u]._id && (pass == $scope.aiv_users.users[u].user_pass || PHPass.CheckPassword(pass, $scope.aiv_users.users[u].user_pass))){
					passed = true;
					break;
				}
			}
		}
		
		return passed;
	}
	
	$scope.isShopOpen = function(){
		var timing = $filter('filter')($scope.shop_timings,{day:$scope.getWorkingDay()},true);
		if(timing.length){
		
		}
		
	}
	$scope.tipData={
		enable:false,
		amount:'',
		method:''
	}
	$scope.tipPayMode=function(mode){
			$scope.tipData.method =mode;
	}
	$scope.tipPopUp = function(){
		$scope.action_auth = {pass:'',err:'',auth:false,reason:''};
		if($scope.tipData.enable){
			$scope.setKeyInput('TIP',$scope.tipData.amount);
			var passPopup = $ionicPopup.confirm({
				title: 'Enter Gratuity',
				templateUrl: 'tip-popup.html',
				scope: $scope,
				cssClass:"wide-popup aiv-popup exit-popup",
				buttons: [
				  { text: 'Cancel',
					onTap: function(e) {
						$scope.tipData.enable=false;
						$scope.setKeyInput('PAYMENT',$scope.payment_select.amount);
						}				  
					},
				  
				  {
					text: '<b>Proceed</b>',
					type: 'button-assertive',
					onTap: function(e) {
					  if (!$scope.tipData.amount) {
						//don't allow the user to close unless he enters password
						$scope.action_auth.err = "Amount Required!!!";
						e.preventDefault();
					  }else if(!$scope.tipData.method){
						$scope.action_auth.err = "Method Required!!!";
						e.preventDefault();
					  }
					  $scope.setKeyInput('PAYMENT',$scope.payment_select.amount);
					  return true;
					}
				  }
				]
			});
		}
		/* passPopup.then(function(res) {
			if(res) {
				$scope.setKeyInput('LOGIN_PASS',$scope.qwerty_inputs.pass);
				ipcRenderer.send('button-click', 'EXIT');
			}else{
				$scope.action_auth = {pass:'',err:'',auth:false,reason:''};
			}
		}); */
	}
	$scope.exitApp = function(){
		$scope.action_auth = {pass:'',err:'',auth:false,reason:''};
		$scope.setKeyInput('REQ_PASS',$scope.action_auth.pass);
		var passPopup = $ionicPopup.confirm({
			title: 'Enter Manager password',
			templateUrl: 'exit-popup.html',
			scope: $scope,
			cssClass:"wide-popup aiv-popup exit-popup",
			buttons: [
			  { text: 'Cancel' },
			  {
				text: '<b>EXIT</b>',
				type: 'button-assertive',
				onTap: function(e) {
				  if (!$scope.action_auth.pass) {
					//don't allow the user to close unless he enters password
					$scope.action_auth.err = "Password required!!!";
					e.preventDefault();
				  } else{
					var passed = $scope.isManagerAuthorized($scope.action_auth.pass);
					if(!passed){
						$scope.action_auth.err = "Wrong password!!!";
						e.preventDefault();
					}
				  }
				  return true;
				}
			  }
			]
		});
		
		passPopup.then(function(res) {
			if(res) {
				$scope.setKeyInput('LOGIN_PASS',$scope.qwerty_inputs.pass);
				ipcRenderer.send('button-click', 'EXIT');
			}else{
				$scope.action_auth = {pass:'',err:'',auth:false,reason:''};
			}
		});
	}
	
	var fullScreen = function(exit){
		var isInFullScreen = (document.fullscreenElement && document.fullscreenElement !== null) ||
		(document.webkitFullscreenElement && document.webkitFullscreenElement !== null) ||
		(document.mozFullScreenElement && document.mozFullScreenElement !== null) ||
		(document.msFullscreenElement && document.msFullscreenElement !== null);

		var docElm = document.documentElement;
		if (!isInFullScreen && !exit) {
			if (docElm.requestFullscreen) {
				docElm.requestFullscreen();
			} else if (docElm.mozRequestFullScreen) {
				docElm.mozRequestFullScreen();
			} else if (docElm.webkitRequestFullScreen) {
				docElm.webkitRequestFullScreen();
			} else if (docElm.msRequestFullscreen) {
				docElm.msRequestFullscreen();
			}
		} else if(exit){
			if(isInFullScreen){
				if (document.exitFullscreen) {
					document.exitFullscreen();
				} else if (document.webkitExitFullscreen) {
					document.webkitExitFullscreen();
				} else if (document.mozCancelFullScreen) {
					document.mozCancelFullScreen();
				} else if (document.msExitFullscreen) {
					document.msExitFullscreen();
				}
			}else{
				if (docElm.requestFullscreen) {
					docElm.requestFullscreen();
				} else if (docElm.mozRequestFullScreen) {
					docElm.mozRequestFullScreen();
				} else if (docElm.webkitRequestFullScreen) {
					docElm.webkitRequestFullScreen();
				} else if (docElm.msRequestFullscreen) {
					docElm.msRequestFullscreen();
				}
				$timeout(function(){
					if (document.exitFullscreen) {
						document.exitFullscreen();
					} else if (document.webkitExitFullscreen) {
						document.webkitExitFullscreen();
					} else if (document.mozCancelFullScreen) {
						document.mozCancelFullScreen();
					} else if (document.msExitFullscreen) {
						document.msExitFullscreen();
					}
				},500);
			}
		}
	}

	var interval_fn = function(){
		$scope.callerid_status.response++;
		$scope.fid_status.response++;
		var digest_call = false;
		if($scope.callerid_status.response > 2){
			//No signals from callerID
			if($scope.callerid_status.online){
				$scope.callerid_status = { 'online':false,'title':'Disconnected','class':'assertive-imp','response':0};
				$scope.settingsCID.device_connected = false;
				$localstorage.getObject(AIV_CONSTANTS.LS_PREFIX+'CIDSettings',$scope.settingsCID);
				digest_call = true;
			}
		}
		if($scope.fid_status.response > 2){
			//No signals from FID
			if($scope.fid_status.online){
				$scope.fid_status = { 'online':false,'title':'Disconnected','class':'assertive-imp','response':0};
				$scope.settingsCID.fid_connected = false;
				$localstorage.getObject(AIV_CONSTANTS.LS_PREFIX+'CIDSettings',$scope.settingsCID);
				digest_call = true;
			}
		}
		
		//Check if Early takeaway started
		if(hhmmss(new Date())>hhmmss(new Date($scope.POSSettings.early_takeaway.start)) && hhmmss(new Date())<hhmmss(new Date($scope.POSSettings.early_takeaway.end))){
			$scope.aiv_toggles.early_takeaway = true;
		}else{
			$scope.aiv_toggles.early_takeaway = false;
		}
		
		if(digest_call){
			$scope.$digest();
		}
	}
	var print_mutex;
	$scope.table_matrix = {row:10,col:10};
	var dummyZReport = function(){
		var doc = {
			"by_sales": {
			   "total": 1616.08,
			   "subtotal":1553.58,
			   "total_shipping": 62.5,
			   "total_bag":0,
			   "total_discount": 0,
			   "total_unpaid":0,
			   "count_unpaid":0,
			   "items_unpaid":"",
			   "total_cash":1553.58
			},
			"by_shipping": {
			   "total": {
				   "count": 120,
				   "amount": 1616.08
			   },
			   "local_delivery": {
				   "count": 21,
				   "amount": 509.2
			   },
			   "local_pickup": {
				   "count": 9,
				   "amount": 118.74
			   },
			   "in_shop": {
				   "count": 90,
				   "amount": 988.14
			   },
			   "sitin": {
				   "count": 0,
				   "amount": 0
			   }
			},
			"by_payment": {
			   "total": {
				   "count": 120,
				   "amount": 1616.08
			   },
			   "cod": {
				   "count": 120,
				   "amount": 1616.08
			   },
			   "card": {
				   "count": 0,
				   "amount": 0
			   },
			   "stripe": {
				   "count": 0,
				   "amount": 0
			   },
			   "paypal": {
				   "count": 0,
				   "amount": 0
			   },
			   "custom": {
				   "count": 0,
				   "amount": 0
			   },
			   "refund": {
				   "count": 0,
				   "amount": 0
			   }
			},
			"by_outlet": {
			   "total": {
				   "count": 120,
				   "amount": 1616.08
			   },
			   "pos": {
				   "count": 110,
				   "amount": 1402.53
			   },
			   "web": {
				   "count": 10,
				   "amount": 213.55
			   },
			   "custom": {
				   "count": 0,
				   "amount": 0
			   }
			}	
		}
		
		$scope.selected_report_title = "Z Report";
		$scope.zr_from_date = new Date("2018-07-21");
		$scope.aiv_report = doc;
		$scope.printRawReport(doc);
	}
		$scope.zreportPOSAdmin = function(data){
		var shop = data.shop
		var doc = {
			"by_sales": {
			   "total": data.total_sales_sum,
			   "subtotal":data.sales_total,
			   "total_shipping": data.delivery_charges,
			   "total_bag":data.bag_charges,
			   "total_discount": data.discounts,
			   "total_unpaid":data.unpaid_sum,
			   "count_unpaid":data.unpaid_count,
			   "items_unpaid":"",
			   "total_cash":data.cashtill
			},
			"by_shipping": {
			   "total": {
				   "count":0 ,
				   "amount":data.sales_total
			   },
			   "local_delivery": {
				   "count":data.delivery_count,
				   "amount": data.delivery_sum
			   },
			   "local_pickup": {
				   "count": data.collection_count,
				   "amount":data.collection_sum
			   },
			   "in_shop": {
				   "count": data.inshop_count,
				   "amount": data.inshop_sum
			   },
			   "sitin": {
				   "count": 0,
				   "amount": 0
			   }
			},
			"by_payment": {
			   "total": {
				   "count": data.pay_count,
				   "amount": data.pay_sum
			   },
			   "cod": {
				   "count": data.cash_count,
				   "amount": data.cash_sum
			   },
			   "card": {
				   "count": data.card_count,
				   "amount": data.card_sum
			   },
			   "stripe": {
				   "count": data.sagepay_count,
				   "amount": data.sagepay_sum
			   },
			   "paypal": {
				   "count": 0,
				   "amount": 0
			   },
			   "custom": {
				   "count": 0,
				   "amount": 0
			   },
			   "refund": {
				   "count": 0,
				   "amount": 0
			   }
			},
			"by_outlet": {
			   "total": {
				   "count": data.pay_count,
				   "amount": data.pay_sum
			   },
			   "pos": {
				   "count": data.pos_count,
				   "amount": data.pos_sum
			   },
			   "web": {
				   "count": data.web_count,
				   "amount": data.web_sum
			   },
			   "android":{
					"count": data.android_count,
				   "amount": data.android_sum
			   },
			   "IOS":{
					"count": data.ios_count,
				   "amount": data.ios_sum
			   },
			   "custom": {
				   "count": 0,
				   "amount": 0
			   }
			},
			"by_gratuity":{
				"total": {
				   "count": 0,
				   "amount": 0
			   },
			   "cash": {
				   "count": 0,
				   "amount": 0
			   },
			   "card": {
				   "count": 0,
				   "amount": 0
			   },
			}			
		}
	/* 	if(data.unpaid_orders_list.length){
			var list ='';
			var type =false;
			for(var i=0;i<data.unpaid_orders_list.length;i++){
			var shop = data.unpaid_orders_list[0].shop;
				if(shop == data.unpaid_orders_list[i].shop){
					type =true;
				}else{
					type =false;
					break;
				}
					
			}
			if(type){
				for(var i=0;i<data.unpaid_orders_list.length;i++){
					list +=data.unpaid_orders_list[i].bill_no+',';
				}
				doc.by_sales.items_unpaid = list;
			}else if(!type){
				for(var i=0;i<data.unpaid_orders_list.length;i++){
				list +=data.unpaid_orders_list[i].shop +':'+data.unpaid_orders_list[i].bill_no+',';
				}
				doc.by_sales.items_unpaid = list;
			} */
			
			$scope.selected_report_title = "Z Report";
			$scope.zr_from_date = new Date(data.date);
			$scope.aiv_report = doc;
			$scope.printRawReport(doc,shop);
	}
	$ionicPlatform.ready(function() {
		if(!$scope.localdb_ip){
			$scope.showdbPopup();
			return;
		}
		
		if(!$scope.terminalData.type){
			var clock_doc = 'clock_'+getWorkingDate();
			var docs = [
				'getNotifications','getShopInfo','getCerts',
				'getCountries','getPaymentMethods',
				'getShippingDetails','getTerminals','getUsers',
				'getSettings','getUKPostcodes',
				'getSMSTemplates',$scope.terminalData._id,clock_doc
			];

			var options = {
				live: false,
				retry: true,
				doc_ids:docs
			}
			
			$pouchDB.sync($scope.couchDBUrl,options);
			
			$rootScope.$on("$pouchDB:sync_complete", function(event, data) {
				if(!$scope.initial_loading){
					getInitialData(docs);
					if( data.status ){
						//Initial sync success
						$scope.initial_loading = 1;
					}else{
						//Initial sync failed...Continue normal operations...
						options = {
							live: true,
							retry: true,
						}
						$pouchDB.sync($scope.couchDBUrl,options);
						$scope.init_success = true;
						$pouchDB.startListening();
					}
				}else if($scope.initial_loading == 1){
					//Initial sync success
					$scope.initial_loading = 2;
					$scope.init_success = true;
					$rootScope.$broadcast('aiv.pos_initialized');
				}
			});
		}else{
			$scope.init_success = true;
			$ionicLoading.hide();
			$scope.initial_loading = 2;
			getDataOffline();
		}
		
		$rootScope.$on("$pouchDB:change", function(event, data) {
			getDBChanges(data.doc,false);
		});
		
		$rootScope.$on("$pouchDB:delete", function(event, data) {
			getDBDeletes(data.doc,false);
		});
		
		/*for(var d=20;d<70;d=d+10){
			$scope.delivery_interval.collection.push(d+' Minutes');
		}*/
		
		for(var d=40;d<70;d=d+10){
			$scope.delivery_interval.delivery.push(d+' Minutes');
		}
		
		for(var t=1;t<=20;t++){
			$scope.sitin_tables.tables.push(t);
		}
		
		$scope.online_order_audio = new Audio('audio/audio.mp3');
		$scope.online_order_audio.loop = true;
		
		$scope.cid_order_audio = new Audio('audio/call.mp3');
		$scope.cid_order_audio.loop = true;

		trashOrder();
		$scope.clearTableData();
		if($scope.cartItems.length){
			$scope.setSelectedItem(0,$scope.cartItems[0]);
		}
		
		if($scope.terminalData.type == "KITCHEN"){
			$scope.kitchen_order_audio = new Audio('audio/kitchen.mp3');
			$state.go('tab.kitchen');
		}else if($scope.terminalData.type == "BACK"){
			if($scope.backTemplate.id == 'MPOS'){
				$state.go('tab.back');
			}else{
				$state.go('tab.front');
			}
		}else{
			$state.go('tab.front');
		}

		for(var i=0;i<10;i++)
		{
			var array =[];
			for(var j=0;j<10;j++)
			{
				array.push({selected:false});
			}
			$scope.row_col_2.push(array);	
		}
		print_mutex = new MutexPromise('print_mutex',{interval:100});
	
		$scope.string = $scope.localdb_ip+';'+AIV_CONSTANTS.CUSER+';'+AIV_CONSTANTS.CPASS+';'+AIV_CONSTANTS.REMOTE_DB;
		$scope.user_qr =AIV_CONSTANTS.CUSER;
		$scope.password_qr =AIV_CONSTANTS.CPASS;
		$scope.db_name_qr =AIV_CONSTANTS.REMOTE_DB;

		interval_fn();
		if($scope.terminalData.type != 'KITCHEN' && ($scope.terminalData.type != 'BACK' || ($scope.terminalData.type == 'BACK' && $scope.backTemplate.id != 'MPOS'))){
			setInterval(interval_fn, 60000);
		}
	});
	
//------------------start code for deposit module------------------------------------------ //
	
	 $scope.depositfinish =function(){	 //saving deposit to pouch db 
		$scope.payment_select.err='';
	  if($scope.payment_select.amount =='' || $scope.payment_select.amount==0){
		$scope.payment_select.err ="Please enter a valid amount";
		return
	  }
		var now_date = new Date().toISOString();
		$scope.paymentdeposit= $("#paymentdeposit").val();
		$scope.customerphonenumber=$scope.formCustomer.billing_address.phone;
		$scope.documentname="depposit_"+$scope.customerphonenumber+now_date;
		var paymentdata={
			'id':$scope.documentname,
			'Customer_id':"customer_"+$scope.terminalData.prefix+new Date().toISOString(),
			'Customer_name':$scope.formCustomer.billing_address.first_name,
			'Deposit_date':now_date,
			'Amount':$scope.paymentdeposit,
			'Lastupdate':now_date,
			'payment_type':$scope.payment_select.id,
			'mail':$scope.formCustomer.billing_address.email,
			'phone':$scope.formCustomer.billing_address.phone,
			'served_by':$scope.loginInfo.user_login
			}
		$pouchDB.upsert($scope.documentname,function(doc){
			if(angular.isDefined(doc.data)){
				doc.data.Amount=paymentdata.Amount;
				doc.data.Lastupdate=now_date;
				console.log(doc.data.Lastupdate);
				$scope.printDepositData(doc);
			}
			else{
				doc.data = paymentdata;
				console.log(doc.data);
				$scope.printDepositData(doc);
			}
			return doc;
		}).then(function(resp){
			$scope.depositpoup('Message','Deposit accepted successfully');
		}).catch(function(error){
			console.log(error);
		});
	 }
	$scope.deposittemplat =function(){ //calling deposit ui
		$ionicModal.fromTemplateUrl('deposit-modal.html', {
			id:'DEPOSIT',
			scope: $scope,
			backdropClickToClose: false,
			animation:'none'
		  }).then(function(modal) {
			$scope.deposite_modal = modal;
			$scope.openModal('DEPOSIT');
			$scope.deposit_details();
		});
	 }
	$scope.deposit_details =function(){ // fetching all deposit details from pouch db
		$scope.customerdepositdetails=[];
		var onlineconfig1 = {include_docs:true,startkey : 'depposit_', endkey : 'depposit_\ufff0',limit:500};
		$pouchDB.bulkFetch(onlineconfig1).then(function(docsdeposit){
			angular.forEach(docsdeposit.rows,function(row){					
			$scope.customerdepositdetails.push(row.doc);
			console.log(row.doc.data)
			});
		}).catch(function(error){
			console.log(error);
		});
	}
	$scope.getDepositData =function(){ // fetching all deposit details for a customer from pouch db
	 $scope.depositInfo =[];
	 $scope.depositeAmount =0;
		var onlineconfig1 = {include_docs:true,startkey : 'depposit_'+$scope.formCustomer.billing_address.phone, endkey : 'depposit_'+$scope.formCustomer.billing_address.phone+'\ufff0',limit:500};
		$pouchDB.bulkFetch(onlineconfig1).then(function(docsdeposit){
			angular.forEach(docsdeposit.rows,function(row){					
				$scope.depositInfo.push(row.doc);
				console.log(row.doc.data)
			});
		}).then(function(resp){
			if($scope.depositInfo.length){
				for(var i=0;i<$scope.depositInfo.length;i++){
					$scope.depositeAmount +=parseFloat($scope.depositInfo[i].data.Amount);
				}
			}
		}).catch(function(error){
			console.log(error);
		});
	 }
	 $scope.redeemDepositData =function(){ // redeem deposit amount 
		$scope.depositeAmount=0;
		var total = $scope.grand.Total;
		if($scope.depositInfo.length){
			for(var i=0;i<$scope.depositInfo.length;i++){	
				if(total>=parseFloat($scope.depositInfo[i].data.Amount)){
					total-=parseFloat($scope.depositInfo[i].data.Amount);
					$scope.depositInfo[i].data.Amount =0;
					var discount =(total==0)?$scope.grand.Total:($scope.grand.Total-total);
					$scope.amount_key = (total==0)?'0.00':total.toFixed(2);
					$scope.grand.Total-=discount;
					$scope.grand.deposit=discount;
					$scope.depositInfo[i].data.used =true;
					
				}else if(parseFloat($scope.depositInfo[i].data.Amount)>total){
					$scope.depositInfo[i].data.Amount-= total;
					total=0;
					var discount =(total==0)?$scope.grand.Total:($scope.grand.Total-total);
					//$scope.depositInfo[0].data.Amount -=$scope.grand.Total;
					$scope.amount_key = (total==0)?'0.00':toFixed(2);
					$scope.grand.Total-=discount;
					$scope.grand.deposit=discount;
					$scope.depositInfo[i].data.used =true;
				}
				$scope.depositeAmount+=parseFloat($scope.depositInfo[i].data.Amount);
			}
		}
	 }
	 $scope.updateDepositeData =function(){ //update deposit data to database
		if($scope.depositInfo.length){
			for(var i=0;i<$scope.depositInfo.length;i++){
				if($scope.depositInfo[i].data.used){
					var amount = 
					$pouchDB.upsert($scope.depositInfo[i]._id,function(doc){
						for(j=0;j<$scope.depositInfo.length;j++){
							if(doc._id ==$scope.depositInfo[j]._id){
								doc.data.Amount =$scope.depositInfo[j].data.Amount;
								doc.data.Deposit_date =new Date().toISOString();
								console.log(doc);
								return doc;
							}
						}
							return false;
					}).catch(function(error){
						console.log(error);
					});
				}
				
			}
		}
	 }
	$scope.depositpoup =function(tit_txt,msg) { //popup to show deposit info
	   var alertPopup = $ionicPopup.alert({
		 title: tit_txt,
		 template: msg
	   });
		alertPopup.then(function(res) {
			$scope.closeModal('PAYMENT');
			$scope.deposittemplat();
		});
	}
	$scope.printDepositData =function(doc){
		if($scope.settingsPrinter.type != "Receipt Print"){
		return;
		}
		var printer_settings = $scope.settingsPrinter;
		rec_name = $rootScope.aiv_info.name;
		rec_address = [];
		headerMap = [["No.", "Cust", "Del Chg.  Price"]];
		rec_map1 = [];
		pricesMap = [];
		rec_map2 = [];
		resultMap = [];
		rec_map3 = [];
		orderNumMap = [];
		rec_footercard='';
		rec_footercardaccnt='';
		rec_footer1 = 'From '+doc.data.phone;
		rec_footer2 = '';
		rec_footer3 = '';
		rec_footer4 = '';
		rec_thanks = '<<< Thanks >>>';
		rec_header1 = $filter('date')(new Date(), "MMM d, y");
		if(angular.isDefined($scope.loginInfo.user_displayname)){
			rec_header2 = 'Service by: '+$scope.loginInfo.user_displayname+" | "+$filter('date')(new Date(), "MMM d, y");
		}else{
			rec_header2 = $filter('date')(new Date(), "MMM d, y");
		}
		rec_header3 = '';
		rec_total = '';
		var template = new EasyPrintTemplate();
		var res;
		var printData = [];
			rec_address.push(["",$rootScope.aiv_info.address,""]);
			rec_address.push(["",$rootScope.aiv_info.phone1+","+$rootScope.aiv_info.domain.replace('http://','www.'),""]);
			if($rootScope.aiv_info.vat_no)
				rec_address.push(["",$rootScope.aiv_info.vat_no,""]);
		rec_header3 = 'PAID';
		rec_header3 = 'Deposit has been accepted';
		if($scope.settings_data.logoInReceipt){
			if(printer_settings.lineLength <= 42){
			printData.push({ type: 'raw', format: 'image', data: '../img/receipt_logo58.png', options: { language: 'ESCP', dotDensity: 'single' } });
			}else{
			printData.push({ type: 'raw', format: 'image', data: '../img/receipt_logo80.png', options: { language: 'ESCP', dotDensity: 'single' } });
			} 
		}
		if(rec_name && !$scope.settings_data.logoInReceipt){
			printData.push({ type: 'raw', format:'plain', data: gen_print_command(printer_settings.cmd_bon) });
			source = "{{center:rec_name}}";
			gen_print_template(template,printData,source,printer_settings,2);
			printData.push({ type: 'raw', format:'plain', data: gen_print_command(printer_settings.cmd_boff) });
		}
		if(rec_address){
			if(angular.isArray(rec_address)){
				source = ".hline {{map:rec_address}} .hline";
			}else{
				source = ".hline {{center:rec_address}} .hline";
			}
				gen_print_template(template,printData,source,printer_settings,1);
		}
		source = (rec_header3!='')?"{{center:rec_header3}}":"";
		gen_print_template(template,printData,source,printer_settings,1);
		source = (rec_header3!='')?"{{center:rec_footer1}} .newline":"";
		gen_print_template(template,printData,source,printer_settings,1);
		source = (rec_footer2!='')?"{{center:rec_footer2}}":"";
		gen_print_template(template,printData,source,printer_settings,2);
		rec_total = "TOTAL: "+$filter('number')(doc.data.Amount, 2);
		source = "{{center:rec_total}}";
		gen_print_template(template,printData,source,printer_settings,2);
		source = ".hline .style2 {{center:rec_header2}} .hline";
		gen_print_template(template,printData,source,printer_settings,1);
		source = "{{center:rec_thanks}} .newline .newline .newline .newline .newline .newline .newline";
		gen_print_template(template,printData,source,printer_settings,1);
		var print_array = [];
		angular.forEach($scope.AIVPrinterSettings,function(printer){
			if(printer.usage == 'Main'){
				//Print to Main printer
				var config = {};
				config.copies = 1;
				var print_object = {}
				print_object.conf = config;
				print_object.data = printData;
				print_object.device = printer;
				var drawer = false;
				if($scope.print_config.cashdrawer && open_cashdrawer){
					drawer = true;
				}
				print_object.cashdrawer = drawer;
				print_array.push(print_object);
			}
		})
		if(print_array.length){
		//Handle multiple copies
			var final_print_array = [];
			for(var i=0;i<print_array.length;i++){
			if(print_array[i].conf.copies > 1){
			var print_data = angular.copy(print_array[i]);
			var copies = print_data.conf.copies;
			print_array[i].conf.copies = 1;
			final_print_array.push(print_array[i]);

			print_data.data.splice(0,0,{ type: 'raw', data: "====REPRINT====\n\n" });
			print_data.conf.copies = copies-1;
			print_data.cashdrawer = false;
			final_print_array.push(print_data);
			i++;
			}else{
			final_print_array.push(print_array[i]);
			}
			}
			multi_print_receipts(final_print_array,true);
		}
	}
	$scope.exitPayment =function(){
		$scope.closeModal('PAYMENT');
		$scope.deposittemplat();
	}
//------------------end code for deposit module------------------------------------------ //	
//---------------------start of voucher module------------------------------------------- //
	$scope.voucher_details =function(){
		$scope.voucherdetails=[];
		var onlineconfigvoucherdoc = {include_docs:true,startkey : 'Vocherdetails_', endkey : 'Vocherdetails_\ufff0',limit:500};
		$pouchDB.bulkFetch(onlineconfigvoucherdoc).then(function(voucherdetailsdoc){
			angular.forEach(voucherdetailsdoc.rows,function(row){					
				$scope.voucherdetails.push(row.doc.data);
				console.log(row.doc.data)
			});
		}).catch(function(error){
			console.log(error);
		});
	}
	 function voucher_code_gennarate() { //create unique voucher code 
		 let code_length = 5;
		 let timestamp = +new Date();
		 var _getRandomInt = function( min, max ) {
			return Math.floor( Math.random() * ( max - min + 1 ) ) + min;
		 }
		 this.generate = function() {
			 var ts = timestamp.toString();
			 var parts = ts.split( "" ).reverse();
			 var id = "";
			 for( var i = 0; i < code_length; ++i ) {
				var index = _getRandomInt( 0, parts.length - 1 );
				id += parts[index];	 
			 }
			 return id;
		 } 
	 }

	$scope.print_voucher =function(){
		$scope.input_voucheramount=$("#input_voucheramount").val();
		$scope.email_voucher=$("#email_voucher").val();
		if($scope.input_voucheramount==""){
			$scope.errorvoucher="Please Enter Amount!!!";
			return;
		}else if($scope.voucher_pay_type ==''){
			$scope.errorvoucher="Please select payment method!!!";
			return;
		}else{
			var generator = new voucher_code_gennarate();
			var coupen_code= generator.generate();
			$scope.documentnamevocher="Vocherdetails_"+coupen_code+'_'+new Date().toISOString();
			var voucherdetails={
				'id':$scope.documentnamevocher,
				'createdby':new Date().toISOString(),
				'code':coupen_code,
				'email':$scope.email_voucher,
				'servedby':$scope.aiv_users.selected,
				'used':false,
				'payment_type':$scope.voucher_pay_type,
				'amount':$scope.input_voucheramount,
				'used_date':''
			}
			$pouchDB.upsert($scope.documentnamevocher,function(doc){
				if(angular.isDefined(doc.data)){	
					doc.data=voucherdetails;
					console.log(doc.data);
					$scope.printVoucherData(doc);
					
				}else{
					doc.data=voucherdetails;
					console.log(doc.data);
					$scope.printVoucherData(doc);
				}
				return doc;
			}).then(function(resp){
				$scope.vocherpopup('Message','Voucher accepted successfully');	
			}).catch(function(error){
				console.log(error);
			});                 
		}
	}
	$scope.validatevouchercode=function(){   
		$scope.voucherId=[];
		if($scope.voucher_code_area==""){
			$scope.messagevouchercode="Enter Voucher Code";
			return false;
		}else{
			$scope.amountorder=parseFloat($scope.payment_select.to_pay).toFixed(2);
			var onlineconfigvoucherdoc = {include_docs:true,startkey : 'Vocherdetails_'+$scope.voucher_code_area, endkey : 'Vocherdetails_'+$scope.voucher_code_area+'\ufff0',limit:500};
			$pouchDB.bulkFetch(onlineconfigvoucherdoc).then(function(docvocher){
			if(docvocher.rows.length){
					angular.forEach(docvocher.rows,function(row){	
						if(row.doc.data.code==$scope.voucher_code_area && !row.doc.data.used){   
							flagcheck=true;
							$scope.voucherId.push({_id : row.doc._id, _rev: row.doc._rev, _deleted : true });
							//$scope.voucherId.push({row.doc._id;
							if(row.doc.data.used==false){
								$scope.voucheramountretrive=row.doc.data.amount;
								if(parseFloat($scope.voucheramountretrive)>=parseFloat($scope.amountorder)){
									$scope.messagevouchercode="Voucher Applied Successeully";
									$scope.disable_finish=false;
									return true;
								}else{  
									$scope.payment_select.amount=parseFloat($scope.voucheramountretrive);
									$scope.calculateTender();
									return false;
								}
							}else{
							$scope.messagevouchercode="This Voucher is already used";
							return false;
							}
						}else{
							$scope.messagevouchercode="Voucher already used or not available";
						}
					});
				}else{
					$scope.messagevouchercode="Voucher code invalid";
				}
			}).catch(function(error){
			console.log(error);
			return false;
			});
		}
	};
	$scope.vouchertemplatefront =function(){ //open voucher modal
	$ionicModal.fromTemplateUrl('voucher-moda-front.html', {
			id:'VOUCHERFRONT',
			scope: $scope,
			backdropClickToClose: false,
			animation:'none'
		}).then(function(modal) {
			$scope.voucher_modal_front = modal;
			$scope.openModal('VOUCHERFRONT');
			$scope.voucher_details();
		});
	};
	$scope.vocherpopup =function(tit_txt,msg){ // popup to show voucher details
		var alertPopup = $ionicPopup.alert({
			title: tit_txt,
			template: msg
		});
		alertPopup.then(function(res) {
			$scope.closeModal('VOCHER');
			$scope.voucher_modal.remove();
			$scope.vouchertemplatefront();
		});
	};
	 $scope.vouchertemplate =function(){ //voucher template 
		$ionicModal.fromTemplateUrl('voucher-modal.html', {
			id:'VOUCHER',
			scope: $scope,
			backdropClickToClose: false,
			animation:'none'
		  }).then(function(modal) {
			$scope.voucher_modal = modal;
			$scope.input_voucheramount='';
			$scope.email_voucher='';
			$scope.openModal('VOUCHER');
			$scope.voucher_modal_front.remove();
			var someElement = document.getElementById('input_voucheramount');
			someElement.focus(true);
			//$scope.voucher_details();
		});
	 };
	$scope.printVoucherData =function(doc){
		if($scope.settingsPrinter.type != "Receipt Print"){
		return;
		}
		var printer_settings = $scope.settingsPrinter;
		rec_name = $rootScope.aiv_info.name;
		rec_address = [];
		headerMap = [["No.", "Cust", "Del Chg.  Price"]];
		rec_map1 = [];
		pricesMap = [];
		rec_map2 = [];
		resultMap = [];
		rec_map3 = [];
		orderNumMap = [];
		rec_footercard='';
		rec_footercardaccnt='';
		rec_footer1 = '';
		rec_footer2 = '';
		rec_footer3 = '';
		rec_footer4 = '';
		rec_thanks = '<<< Thanks >>>';
		rec_header1 = $filter('date')(new Date(), "MMM d, y");
		if(angular.isDefined($scope.loginInfo.user_displayname)){
			rec_header2 = 'Service by: '+$scope.loginInfo.user_displayname+" | "+$filter('date')(new Date(), "MMM d, y");
		}else{
			rec_header2 = $filter('date')(new Date(), "MMM d, y");
		}
		rec_header3 = '';
		rec_total = '';
		var template = new EasyPrintTemplate();
		var res;
		var printData = [];
			rec_address.push(["",$rootScope.aiv_info.address,""]);
			rec_address.push(["",$rootScope.aiv_info.phone1+","+$rootScope.aiv_info.domain.replace('http://','www.'),""]);
			if($rootScope.aiv_info.vat_no)
				rec_address.push(["",$rootScope.aiv_info.vat_no,""]);
		rec_header3 = 'PAID';
		rec_header3 = 'VOUCHER - ' + doc.data.amount;
		if($scope.settings_data.logoInReceipt){
			if(printer_settings.lineLength <= 42){
			printData.push({ type: 'raw', format: 'image', data: '../img/receipt_logo58.png', options: { language: 'ESCP', dotDensity: 'single' } });
			}else{
			printData.push({ type: 'raw', format: 'image', data: '../img/receipt_logo80.png', options: { language: 'ESCP', dotDensity: 'single' } });
			} 
		}
		if(rec_name && !$scope.settings_data.logoInReceipt){
			printData.push({ type: 'raw', format:'plain', data: gen_print_command(printer_settings.cmd_bon) });
			source = "{{center:rec_name}}";
			gen_print_template(template,printData,source,printer_settings,2);
			printData.push({ type: 'raw', format:'plain', data: gen_print_command(printer_settings.cmd_boff) });
		}
		if(rec_address){
			if(angular.isArray(rec_address)){
				source = ".hline {{map:rec_address}} .hline";
			}else{
				source = ".hline {{center:rec_address}} .hline";
			}
				gen_print_template(template,printData,source,printer_settings,1);
		}
		source = (rec_header3!='')?"{{center:rec_header3}} .hline":"";
		gen_print_template(template,printData,source,printer_settings,2);
		rec_total = doc.data.code;
		source = " .newline {{center:rec_total}} .newline ";
		gen_print_template(template,printData,source,printer_settings,2);
		source = ".hline .style2 {{center:rec_header2}} .hline";
		gen_print_template(template,printData,source,printer_settings,1);
		source = "{{center:rec_thanks}} .newline .newline .newline .newline .newline .newline .newline";
		gen_print_template(template,printData,source,printer_settings,1);
		var print_array = [];
		angular.forEach($scope.AIVPrinterSettings,function(printer){
			if(printer.usage == 'Main'){
				//Print to Main printer
				var config = {};
				config.copies = 1;
				var print_object = {}
				print_object.conf = config;
				print_object.data = printData;
				print_object.device = printer;
				var drawer = false;
				if($scope.print_config.cashdrawer && open_cashdrawer){
					drawer = true;
				}
				print_object.cashdrawer = drawer;
				print_array.push(print_object);
			}
		})
		if(print_array.length){
		//Handle multiple copies
			var final_print_array = [];
			for(var i=0;i<print_array.length;i++){
			if(print_array[i].conf.copies > 1){
			var print_data = angular.copy(print_array[i]);
			var copies = print_data.conf.copies;
			print_array[i].conf.copies = 1;
			final_print_array.push(print_array[i]);

			print_data.data.splice(0,0,{ type: 'raw', data: "====REPRINT====\n\n" });
			print_data.conf.copies = copies-1;
			print_data.cashdrawer = false;
			final_print_array.push(print_data);
			i++;
			}else{
			final_print_array.push(print_array[i]);
			}
			}
			multi_print_receipts(final_print_array,true);
		}
	};
	$scope.changeMethod =function(method){
		$scope.voucher_pay_type =method;
	}
//---------------------end of voucher module----------------------------------------------- //
//---------------------start of payout module ----------------------------------------------//
	$scope.payouttemplate=function(){  // open payout template 
		$scope.payoutamount='';
		$scope.payoutnote='';
		payout_order_product_sec=false;
		$ionicModal.fromTemplateUrl('payout-modal.html', {
			id:'PAYOUT',
			scope: $scope,
			backdropClickToClose: false,
			animation:'none'
		}).then(function(modal) {
			$scope.payout_modal = modal;
			$scope.openModal('PAYOUT');
		});
	}
	$scope.payoutfronttemplate=function(){ // open payout front template
		$ionicModal.fromTemplateUrl('payout-front-modal.html', {
			id:'PAYOUTFRONT',
			scope: $scope,
			backdropClickToClose: false,
			animation:'none'
		}).then(function(modal) {
			$scope.payoutfront_modal = modal;
			$scope.openModal('PAYOUTFRONT');
			$scope.payout_details();
		});
	}
	$scope.payout_details=function(){ // fetch payout data from pouch db
		$scope.payoutdetails=[];
		var pouchdocdetails = {include_docs:true,startkey : 'payoutdetails_', endkey : 'payoutdetails_\ufff0',limit:500};
		$pouchDB.bulkFetch(pouchdocdetails).then(function(payoutdetailsdoc){						
			angular.forEach(payoutdetailsdoc.rows,function(row){					
			$scope.payoutdetails.push(row.doc.data);
			});
		}).catch(function(error){
			console.log(error);
		});
	}
	$scope.createproductpayout=function(){   //create payout data and and save to pouch db
		$scope.payout_order_productr="";
		if($scope.payoutamount==""){
			$scope.payout_order_product_sec=true;
			$scope.payout_order_product = "Amount is required!!!";
			var someElement = document.getElementById('payoutamount');
			someElement.focus(true);
			return false;
		}else if($scope.payoutnote==""){
			$scope.payout_order_product_sec=true;
			$scope.payout_order_product = "Note is required!!!";
			var someElement = document.getElementById('payoutnote');
			someElement.focus(true);
			return false;
		}else{
			$scope.payoutdocname='payoutdetails_'+new Date().toISOString();
			var payoutdetails={
			'id':$scope.payoutdocname,
			'ordercreated':new Date().toISOString(),
			'servedby':$scope.aiv_users.selected,
			'amount':$scope.payoutamount,
			'item':$scope.payoutnote
			}	
			
			$pouchDB.upsert($scope.payoutdocname,function(doc){
			if(angular.isDefined(doc.data)){
			doc.data=payoutdetails;
			}else{
			doc.data=payoutdetails;
			}
			return doc;
			}).then(function(resp){
				$ionicLoading.show({
					template : '<h2>PAYOUT ADDED...</h2>',
					duration : 1300
				});
				var confirmPopup = $ionicPopup.confirm({
					title: 'Print Payout',
					template: '<div style="text-align:center;width:100%">PRINT PAYOUT</div>',
					cssClass: 'aiv-popup',
					buttons: [{ 
						text: 'CANCEL',
						type: 'button-assertive',
						onTap: function(e) {
							return false;
						}
					},{ 
						text: 'PRINT',
						type: 'button-positive',
						onTap: function(e) {
						return true;
						}
					}]
				});
				confirmPopup.then(function(res) {
					if(res){
					$scope.printPayoutData('PAYOUT');
					$scope.closeModal('PAYOUT');
					$scope.payout_details();
					}else{	 
						$scope.closeModal('PAYOUT');
						$scope.payout_details();
					}
				});
			}).catch(function(error){
				console.log(error);
			});
		}
	}
	$scope.printPayoutData = function(type){ // print payout data
		var printer_settings = $scope.settingsPrinter;
		rec_name = $rootScope.aiv_info.name;
		rec_address = [];
		headerMap = [["No.", "Cust", "Del Chg.  Price"]];
		rec_map1 = [];
		pricesMap = [];
		rec_map2 = [];
		resultMap = [];
		rec_map3 = [];
		orderNumMap = [];
		rec_footercard='';
		rec_footercardaccnt='';
		rec_footer1 = '';
		rec_footer2 = '';
		rec_footer3 = '';
		rec_footer4 = '';
		rec_thanks = '<<< Thanks >>>';
		rec_header1 = $filter('date')(new Date(), "MMM d, y");
		if(angular.isDefined($scope.loginInfo.user_displayname)){
			rec_header2 = 'Service by: '+$scope.loginInfo.user_displayname+" | "+$filter('date')(new Date(), "MMM d, y");
		}else{
			rec_header2 = $filter('date')(new Date(), "MMM d, y");
		}
		rec_header3 = '';
		rec_total = '';
		var template = new EasyPrintTemplate();
		var res;
		var printData = [];
		rec_address.push(["",$rootScope.aiv_info.address,""]);
		rec_address.push(["",$rootScope.aiv_info.phone1+","+$rootScope.aiv_info.domain.replace('http://','www.'),""]);
		if($rootScope.aiv_info.vat_no)
			rec_address.push(["",$rootScope.aiv_info.vat_no,""]);
		rec_header3 = 'PAID';
		rec_header3 = type ;
		if($scope.settings_data.logoInReceipt){
			if(printer_settings.lineLength <= 42){
				printData.push({ type: 'raw', format: 'image', data: '../img/receipt_logo58.png', options: { language: 'ESCP', dotDensity: 'single' } });
			}else{
				printData.push({ type: 'raw', format: 'image', data: '../img/receipt_logo80.png', options: { language: 'ESCP', dotDensity: 'single' } });
			} 
		}
		if(rec_name && !$scope.settings_data.logoInReceipt){
			printData.push({ type: 'raw', format:'plain', data: gen_print_command(printer_settings.cmd_bon) });
			source = "{{center:rec_name}}";
			gen_print_template(template,printData,source,printer_settings,2);
			printData.push({ type: 'raw', format:'plain', data: gen_print_command(printer_settings.cmd_boff) });
		}
		if(rec_address){
			if(angular.isArray(rec_address)){
				source = ".hline {{map:rec_address}} .hline";
			}else{
				source = ".hline {{center:rec_address}} .hline";
			}
			gen_print_template(template,printData,source,printer_settings,1);
		}
		source = (rec_header3!='')?"{{center:rec_header3}} .hline":"";
		gen_print_template(template,printData,source,printer_settings,2);
		rec_total = $scope.payoutamount;
		source = " .newline {{center:rec_total}} .newline ";
		gen_print_template(template,printData,source,printer_settings,2);
		source = ".hline .style2 {{center:rec_header2}} .hline";
		gen_print_template(template,printData,source,printer_settings,1);
		source = "{{center:rec_thanks}} .newline .newline .newline .newline .newline .newline .newline";
		gen_print_template(template,printData,source,printer_settings,1);
		var print_array = [];
		angular.forEach($scope.AIVPrinterSettings,function(printer){
			if(printer.usage == 'Main'){
				//Print to Main printer
				var config = {};
				config.copies = 1;
				var print_object = {}
				print_object.conf = config;
				print_object.data = printData;
				print_object.device = printer;
				var drawer = false;
				if($scope.print_config.cashdrawer && open_cashdrawer){
					drawer = true;
				}
				print_object.cashdrawer = drawer;
				print_array.push(print_object);
			}
		})
		if(print_array.length){
		//Handle multiple copies
		var final_print_array = [];
		for(var i=0;i<print_array.length;i++){
			if(print_array[i].conf.copies > 1){
				var print_data = angular.copy(print_array[i]);
				var copies = print_data.conf.copies;
				print_array[i].conf.copies = 1;
				final_print_array.push(print_array[i]);
				print_data.data.splice(0,0,{ type: 'raw', data: "====REPRINT====\n\n" });
				print_data.conf.copies = copies-1;
				print_data.cashdrawer = false;
				final_print_array.push(print_data);
				i++;
			}else{
				final_print_array.push(print_array[i]);
			}
		}
			multi_print_receipts(final_print_array,true);
		}
	}
//---------------------end of payout module -------------------------------------------------//	
	

		
	
});

