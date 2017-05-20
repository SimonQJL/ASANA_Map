'use strict';
   var unbind_beacon_list=[];
   var bind_beacon_list=[];
angular.module('app.home').controller('mapDashboardCtrl', ['$scope','selectedItemCORecord', function($scope,selectedItemCORecord) {
    //Change status button color in map filter
    $scope.selectStatus = function() {
		
		 //獲取所有beacon
		 getBeaconList();
		 //綁定手環
	 	$('#btn_SendGuestInfomation').on('click',function(){RegisterCustomerInfomation();});
		
	     //解除綁定
	    $('#btn_Check-out').on('click',function(){CheckOutBeacon();});
		//获取綁定beacon客戶的信息
		$('#select-hb-co').on('change',function(){GetBindCustomerInfomation();});
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
                url: ServerUrl+"base/listByStatus",
                dataType: "json",
				data:{ t: new Date(),status:"M"},
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
				data:{t: new Date(), ID:record.mbr_code},
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

   	//查詢已經完成的訂單
	
	$('#btn_CheckoutGuest').click(function(){
		$.ajax({
                type: "Get",
                url: ServerUrl+"base/listByStatus",
                dataType: "json",
				data:{ t: new Date(),status:"S"},
                success: function (data) {
			     for(var i in data){
				   getMember(data[i]);
				   	}   
				 $scope.booking_finish =data;
                }, error: function () {
                    layer.alert("The system is busy. Please try again later");
                }
            });
    });
   // selectedItemCORecord.success(function(selectrecords) {   
     // $scope.handBandLocker =selectrecords;
	 // $scope.selectedItem = $scope.handBandLocker[0];
    // $scope.selectedItemCO = $scope.handBandLocker[0];
   // });
   

   //獲取beaconlist
     function getBeaconList(){      
		$.ajax({
                type: "Get",
                url: ServerUrl+"beacon/list",
                dataType: "json",
				data:{ t: new Date()},
                success: function (data) {
				 unbind_beacon_list.length=0;
				 bind_beacon_list.length=0;
                 for(var i in data){
					if(!data[i].bind_guest_id){ 
				     unbind_beacon_list.push(data[i]);
					}
					else{
					 bind_beacon_list.push(data[i]);
					}
				 }					 
				 $scope.unbecaon_List=unbind_beacon_list;
				 $scope.becaon_List=bind_beacon_list;
                }, error: function () {
                    layer.alert("The system is busy. Please try again later");
                }
            });	 
	 }

    $scope.selectedHandBand = false;
    $scope.selectHandBand = function() {
        $scope.selectedHandBand = true;
    };

	 //綁定手環
   function RegisterCustomerInfomation(){
	    var memberID = $('#member_id').attr("o-data-id");
		var cbID = $('#select-hb option:selected').html();
		var booking_no =$('#booking_no').attr("o-data-id");
		getBeaconList();
       $.ajax({
                type: "Post",
                url: ServerUrl+"beacon/association",
                dataType: "json",
				data:{t: new Date(),cbID:'DFC0F1FF6013',UID:memberID,target_type:1},//
                success: function (data) {
					     var str_show="Bind successfully";
						 UpdateBookingStatus(booking_no,"S",str_show);//修改訂單狀態為S
                         $('#oneofCheck-in').click();						 
                }, error: function () {
                    layer.alert("Have not any booking was selected");
                }
            });
   }
    //解除手環綁定
	function CheckOutBeacon(){	  
         var booking_no =$('#unbind_booking_no').attr("o-data-id");
         var cbID  =$('#select-hb-co option:selected').html();	
          getBeaconList();		 
	     $.ajax({
                type: "Post",
                url: ServerUrl+"beacon/unbind",
                dataType: "json",
				data:{cbID:cbID },//需要解除綁定的手環ID
                success: function (data) {
					  var str_show="Unbind successfully";				   
                      UpdateBookingStatus(booking_no,"P",str_show);//修改訂單狀態為P
                      var i =bind_beacon_list.indexOf(cbID)
                      bind_beacon_list.splice(i, 1);
					  $scope.booking_BindCustomerInfomation=bind_beacon_list;	
                      console.log($scope.booking_BindCustomerInfomation);					  
                }, error: function () {
                    layer.alert("The system is busy. Please try again later");
                }
            });
	}
	
	 //修改訂單狀態
   function  UpdateBookingStatus(booking_no,bk_status,str_show){
	   
       $.ajax({
                type: "GET",
                url: ServerUrl+"base/updateBookingStatus",
                dataType: "json",
				data:{t: new Date(),bookingNo:booking_no,status:bk_status},
                success: function (data) {	
                       $('.close').click();
						layer.msg(str_show);
                        getBeaconList();							
                }, error: function () {
                    layer.alert("The system is busy. Please try again later");
                }
            });
   }
	
	
	//獲取綁定Beacon的客戶信息
	function GetBindCustomerInfomation(){
	   var bindbeaconId =$('#select-hb-co option:selected').html();
	   var bind_guest_id="";
	   for(var i in  bind_beacon_list){
	      if( bind_beacon_list[i].ble_addr==bindbeaconId){
			  bind_guest_id=bind_beacon_list[i].bind_guest_id;
		  }  
	    
	   }
	  if(bind_guest_id!=""&&bind_guest_id!=null){
		   for(var i in $scope.booking_finish){
			   if($scope.booking_finish[i].mbr_code==bind_guest_id){
				  $scope.booking_BindCustomerInfomation=$scope.booking_finish[i];
			   }
		   }
		   $scope.booking_BindCustomerInfomation
	  }
	 }
	
	
}]);







