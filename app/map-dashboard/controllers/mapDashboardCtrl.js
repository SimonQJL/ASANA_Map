'use strict';
var bookList =[];
angular.module('app.home').controller('mapDashboardCtrl', ['$scope','selectedItemCORecord', function($scope,selectedItemCORecord) {
    //Change status button color in map filter
    $scope.selectStatus = function() {
        jQuery('.btn-normal').click(function() {
            jQuery(this).toggleClass('btn-selected');
        });
    };
    $scope.selectStatus();

    //Datepicker
    $scope.pickeddate = new Date();
    jQuery("#datepicker").datepicker({
        //changeMonth: true, 
        //changeYear: true,
        prevText: '<i class="fa fa-chevron-left"></i>',
        nextText: '<i class="fa fa-chevron-right"></i>',
        onSelect: function() {
            $scope.pickeddate = $(this).datepicker('getDate');
        }
    });

    //search record data
    $('#btn_RegisterGuest').click(function(){
		$.ajax({
                type: "Get",
                url: ServerUrl+"base/list",
                dataType: "json",
				data:{ t: new Date() },
                success: function (records) {
			     for(var i in records){
				   getMember(records[i]);
				   	}
				 $scope.booking = records;
                }, error: function () {
                    layer.alert("The system is busy. Please try again later");
                }
            });
    });
    function getMember(record){
		$.ajax({
                type: "Get",
                url: ServerUrl+"guest/byID",
                dataType: "json",
				data:{ ID:record.mbr_code},
                success: function (data) { 
					   record.mbr_name=data.name;
					   record.mbr_phone=data.mobile;
						  for(var o in record.items){
							  var time_length =record.items[o].to_date-record.items[o].from_date;
							  var str_time_length=(time_length/3600000).toFixed(1)+"h";
							  var from_date_minutes =new Date(record.items[o].from_date).getMinutes();
							  var to_date_minutes =new Date(record.items[o].to_date).getMinutes();
							  if(from_date_minutes<10){
							     from_date_minutes="0"+from_date_minutes.toString();
							  }
							  if(to_date_minutes<10){
							     to_date_minutes="0"+to_date_minutes.toString();
							  }
							  record.items[o].from_date=new Date(record.items[o].from_date).getHours()+":"+from_date_minutes ;
							  record.items[o].to_date=new Date(record.items[o].to_date).getHours()+":"+to_date_minutes;
							  record.items[o].str_time_length=str_time_length;
						  }
						  bookList.push(record);
                }, error: function () {
                    layer.alert("The system is busy. Please try again later");
                }
            }); 
       }
    //Display Tier's icon according to member's tier
    $scope.tierClass = function(record) {
        switch (record.tier) {
            case 'VVIP':
                return 'fa fa-trophy';
                break;
            case 'VIP':
                return 'fa fa-star-half-o';
                break;
            default:
                return 'fa fa-user-secret';
        }
    };

    //Select booking record and display it by directive selectedRecords
    $scope.enableSelectedRecords = false;
    $scope.selectRecord = function(i) {
        $scope.enableSelectedRecords = true;
        $scope.currentIdx = $scope.booking[i];
    };

   //Hand Band ID and locker
   selectedItemCORecord.success(function(selectrecords) {   
     $scope.handBandLocker =selectrecords;
	 $scope.selectedItem = $scope.handBandLocker[0];
    $scope.selectedItemCO = $scope.handBandLocker[0];
   });


    $scope.selectedHandBand = false;
    $scope.selectHandBand = function() {
        $scope.selectedHandBand = true;
    };

}]);







