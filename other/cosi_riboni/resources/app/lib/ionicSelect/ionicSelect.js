var ionicSelect = angular.module('ionicSelect',[]);

ionicSelect.directive('ionSelect',function(){
    'use strict';
    return{
        restrict: 'EAC',
        scope: {
            label:'@',
            labelField:'@',
			placeholder:'@',
			placeholderIcon:'@',
            provider:'=',
            ngModel: '=?',
            ngValue: '=?',
			onIonselect: '&',
			config:'=?',
			onIonchange: '&',
			ngId:'=?'
        },
         require: '?ngModel',
         transclude : false,
         replace: false,
         template:
                    '<div class="selectContainer">'
                            +'<span class="input-label" style="width:100%;">{{label}}</span>'
                            +'<div class="item item-input-inset">'
                                +'<label class="item-input-wrapper">'
                                    +'<i class="icon {{placeholderIcon}} placeholder-icon"></i>'
                                    +'<input ng-show="ngId==1" placeholder="{{placeholder}}" style="width:100%;" id="filtro" class="aiv-autocomplete" type="search" ng-virtual-keyboard="config" ng-model="ngModel" ng-value="ngValue" ng-change="onChange(ngModel)"/>'
									+'<input ng-show="ngId==2" placeholder="{{placeholder}}" style="width:100%;" id="aiv-normal" class="aiv-autocomplete" type="search" ng-virtual-keyboard="config" ng-model="ngModel" ng-value="ngValue" ng-change="onChange(ngModel)"/>'
                                +'</label>'
                                +'<button class="button button-stable button-small button-clear" ng-click="open()">'
                                    +'<i class="icon ion-chevron-down"></i>'
                                +'</button>'
                            +'</div>' 
                        +'<div class="optionList padding-left padding-right" ng-show="showHide">'
							+'<ion-scroll>'
								+'<ul class="list" style="border: 1px solid #ddd;">'
									+'<li class="item" ng-click="selecionar(item)" ng-repeat="item in provider | filter:ngModel">{{item[labelField]}}</li>'                    
								+'</ul>'
							+'</ion-scroll>'
                        +'</div>'    
                    +'</div>'
             ,
        link: function (scope, element, attrs,ngModel) {
            scope.ngValue = scope.ngValue !== undefined ? scope.ngValue :'';
            scope.selecionar = function(item){
                scope.ngModel = item[scope.labelField];
                scope.showHide = false;
				scope.onIonselect({args: item});
            };
            
            element.bind('click',function(){
                //element.find('input').focus();
            });
            
            scope.open = function(){
                scope.ngModel = "";  
                return scope.showHide=!scope.showHide;
            };
            
            scope.onKeyDown = function(){
                scope.showHide = true;
                if(!scope.ngModel){
                     scope.showHide = false;
                }
            }
            
			scope.onChange = function(input){
				scope.onIonchange({args: input});
				scope.showHide = true;
                if(!scope.ngModel){
                    scope.showHide = false;
                }
			}
            /*scope.$watch('ngModel',function(newValue){
                if(newValue)
           element.find('input').val(newValue[scope.labelField]);
               
            });*/
        },
    };
});

