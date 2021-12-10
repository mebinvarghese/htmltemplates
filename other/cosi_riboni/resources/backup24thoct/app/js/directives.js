angular.module('aiv-pos.directives', [])

.directive('barcodeScanner', function() {
  return {
    restrict: 'A',    
    scope: {
        callback: '=barcodeScanner', 
		ngModel: '=ngModel',		
      },      
    link:    function postLink(scope, iElement, iAttrs){       
        // Settings
        var zeroCode = 48;
        var nineCode = 57;
        var enterCode = 13;    
        var minLength = 3;
        var delay = 300; // ms
        
        // Variables
        var pressed = false; 
        var chars = []; 
		var keychars = [];
        var enterPressedLast = false;
        
        // Timing
        var startTime = undefined;
        var endTime = undefined;
		var element_id = "";

        jQuery(document).keypress(function(e) {  
			element_id = e.target.id;
            if (chars.length === 0) {
                startTime = new Date().getTime();
            } else {
                endTime = new Date().getTime();
            }
            
            // Register characters and enter key
            //if (e.which >= zeroCode && e.which <= nineCode) {
                chars.push(String.fromCharCode(e.which));
           // }
            
            enterPressedLast = (e.which === enterCode);
            
            if (pressed == false) {
                setTimeout(function(){
                    if (chars.length >= minLength && enterPressedLast) {
                        var barcode = chars.join('');                                                
                        //console.log('barcode : ' + barcode + ', scan time (ms): ' + (endTime - startTime));
                                                
                        if (angular.isFunction(scope.callback)) {
                            scope.$apply(function() {
								scope.ngModel = barcode;
                                scope.callback(barcode,true,enterCode);    
                            });
                        }
                    }else if(element_id == 'aiv-scan-input'){
						keychars = document.getElementById('aiv-scan-input').value;
						if(keychars.length >= minLength || (keychars.length&&enterPressedLast)){
							if (angular.isFunction(scope.callback)) {
								scope.$apply(function() {
									scope.callback(keychars,false,enterCode);    
								});
							}
						}
					}
                    chars = [];
                    pressed = false;
                },delay);
            }
            pressed = true;
        });
    }
  };
})

.directive('bindCompileHtml', ['$compile', function ($compile) {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
        scope.$watch(function () {
            return scope.$eval(attrs.bindCompileHtml);
        }, function (value) {

            element.html(value && value.toString());
            var compileScope = scope;
            if (attrs.bindCompileHtml) {
                compileScope = scope.$eval(attrs.bindCompileHtml);
            }
            $compile(element.contents())(compileScope);
        });
    }
 };
}]);