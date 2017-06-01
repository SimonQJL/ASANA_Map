'use strict';
   var unbind_beacon_list=[];//未被使用的beacon list
   var bind_beacon_list=[];//被使用的beacon list
   var MessageList =[{"id":-1}];
   var lastnowtime =new Date().getTime();
   var UnReadMessageCount =0;
   var Room_name;
   var ConfirmedBkRoomList =[];//CONFIRMEDBOOKING
   var OccupiedRmList = [];//OCCUPIEDROOM
   var notAvailableRmList=[];//NOT AVAILABLEROOM
   var availableRmList=['vip_rm1','vip_rm2','vip_rm3','vip_rm4','vip_rm5','vvip_rm1','vvip_rm2', 'vvip_rm3', 'vvip_rm4', 'vvip_rm5','vvip_rm6',
	'vvip_rm7','vvip_rm8','vvip_rm9','rm1','rm2','rm3','rm4','rm5','rm6','rm7','rm8','rm9','rm10','rm11','rm12','rm13','rm14','rm15','rm16','rm17',
	'rm18','rm19','rm20','rm21','rm22','rm23','rm24','rm25','rm26','rm27','rm28','rm29','rm30','rm31','rm32','rm33','rm34','rm35','rm36','rm37','rm38',
	'rm39','rm40','rm41','rm42','rm43','rm44','rm45','rm46','rm47','rm48','rm49','rm50','rm51','rm52','rm53','rm54','rm55','rm56'];//AVAILABLEROOM
angular.module('app.home').controller('mapDashboardCtrl', ['$scope', function($scope) {
    //Change status button color in map filter
         $scope.selectStatus = function() {
		 //獲取所有beacon
		 getBeaconList();
		 //綁定手環
		 $scope.confirmedBkCount = ConfirmedBkRoomList.length;
         $scope.occupiedRmCount = OccupiedRmList.length;
		 $scope.availableRmCount=availableRmList.length;
		 $scope.notavailableRmCount=0;
		 changeallstatusdata();
	 	$('#btn_SendGuestInfomation').on('click',function(){RegisterCustomerInfomation();});
		$('#btn_RegisterGuest').on('click',RegisterGuest);
	     //解除綁定
	    $('#btn_Check-out').on('click',function(){CheckOutBeacon();});
		
		//获取綁定beacon客戶的信息
		$('#select-hb-co').on('change',function(){GetBindCustomerInfomation();});
        				
    	//加載消息
		reloadmessageRecived();
		setTimeout(function(){$('#activity').on('click',function(){reloadMoreMessageRecived();})},500);//加載歷史消息
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
   function changeallstatusdata(){
     RegisterGuest();
	 doingItemsBooking();
   }
	 
   function RegisterGuest(event){
		$.ajax({
                type: "Get",
                url: ServerUrl+"booking/listByStatus",
                dataType: "json",
				data:{ t: new Date(),status:"M"},
                success: function (records) {
					ConfirmedBkRoomList.length=0;
					 for(var i in records){
					 getTimeLength(records[i])
				     getMember(records[i],"M");
				   	} 			 
				 $scope.booking = records;
                }, error: function () {
                    layer.alert("The system is busy. Please try again later");
                }
            });
			// return false;
   }
	
		   //查詢正在進行的訂單
	
	$('#btn_CheckoutGuest').click(function(){
		doingItemsBooking();
	});
    
	function doingItemsBooking(){
		$.ajax({
                type: "Get",
                url: ServerUrl+"booking/listByStatus",
                dataType: "json",
				data:{ t: new Date(),status:"S"},
                success: function (data) {
				 OccupiedRmList.length =0;
				 if(data.length<=0){
				 CalculateavailableRm();
				 }
			     for(var i in data){
				   getMember(data[i],"S");
				   	}   
				 $scope.booking_finish =data;
                }, error: function () {
                    layer.alert("The system is busy. Please try again later");
                }
            });
	}
	
	function getTimeLength(records){
	  for(var o in records.items){
		  var time_length =records.items[o].to_date-records.items[o].from_date;
		  var str_time_length=(time_length/3600000).toFixed(1)+"h";
		  var from_date_minutes =new Date(records.items[o].from_date).getMinutes();
		  var to_date_minutes =new Date(records.items[o].to_date).getMinutes();
		  if(from_date_minutes<10){
			 from_date_minutes="0"+from_date_minutes.toString();
		  }
		  if(to_date_minutes<10){
			 to_date_minutes="0"+to_date_minutes.toString();
		  }
		  records.items[o].from_date=new Date(records.items[o].from_date).getHours()+":"+from_date_minutes ;
		  records.items[o].to_date=new Date(records.items[o].to_date).getHours()+":"+to_date_minutes;
		  records.items[o].str_time_length=str_time_length;
	  } 
	}
	
 function getMember(records,type){
		$.ajax({
                type: "Get",
                url: ServerUrl+"guest/byCode",
                dataType: "json",
				data:{t: new Date(), code:records.mbr_code},
                success: function (data) { 
					   records.mbr_name=data.name;
					   records.mbr_phone=data.mobile;
                       for(var o in records.items){					   
						  var roomnamelist="";
					      for(var i in records.items[o].room_id){
							    roomnamelist=roomnamelist+","+records.items[o].room_id[i]
							 }
						  records.items[o].room_name=roomnamelist.replace(",","");
						  getRoomName(records.items[o],type);
					   }					   
                }, error: function () {
                    layer.alert("cann't find the member information");
                }
            }); 
       }
	   	 function getRoomName(records,type){
                 for(var i in records.room_id){	
                 var mapRoomName=records.room_id[i].toLowerCase();
				 if(mapRoomName.indexOf('v')!=-1){
					mapRoomName=mapRoomName.replace(0,"_rm");
					mapRoomName=mapRoomName.replace('a','');
				    mapRoomName=mapRoomName.replace('b','');
				 }
				 else{
              	    mapRoomName=mapRoomName.replace(0,"");	
				 }				 
				 if(type=="M"){
					 if(ConfirmedBkRoomList.indexOf(mapRoomName)==-1){
					  ConfirmedBkRoomList.push(mapRoomName);
					 }
					  $scope.confirmedRmCount=ConfirmedBkRoomList.length;								 
				 }
				 else{
				   if(OccupiedRmList.indexOf(mapRoomName)==-1){
					  OccupiedRmList.push(mapRoomName);
					 }
				   $scope.occupiedRmCount=OccupiedRmList.length;							 
				 }	
				}
				CalculateavailableRm();//過濾房間類型的房間名字	 
		 }
	   
    //Display different color according to member's grading
    // $scope.gradingClass = function(record) {
        // switch (record.customer.mbr_group) {
            // case 'DCC19':
                // return 'txt-color-red';
                // break;
            // case 'DCC17':
                // return 'txt-color-orange';
                // break;
            // default:
                // return 'txt-color-magenta';
        // }
    // };

    //Select booking record and display it by directive selectedRecords
    $scope.enableSelectedRecords = false;
    $scope.selectRecord = function(i) {
        $scope.enableSelectedRecords = true;
        //$scope.currentIdx = $scope.booking[i];
    };

    //Select all
    $scope.toggleAll = function() {
        var toggleStatus = $scope.isAllSelected;
        angular.forEach($scope.booking, function(itm) { itm.selected = toggleStatus; });
    }

    $scope.optionToggled = function() {
        $scope.isAllSelected = $scope.booking.every(function(itm) {
            return itm.selected;
        })
    }

    //Mark as friend
    $scope.markAsFriendBtn = "Mark as friend";
    $scope.markAsFriend = function() {
        var input = jQuery('#name-on-map');
        var text = input.val();

        if (text && text.indexOf("(friend)") < 0) {
            input.val(text + " (friend)");
            $scope.markAsFriendBtn = "Remove friend";
        } else {
            input.val(text.replace(" (friend)", ""));
            $scope.markAsFriendBtn = "Mark as friend";
        }

    };

    // //Hand Band ID and locker
    // $scope.handBandLocker = [{
        // "handBandId": "Please Select",
        // "lockerId": ""
    // }, {
        // "handBandId": "BBtest1",
        // "lockerId": "01"
    // }];
    // $scope.selectedItem = $scope.handBandLocker[0];
    // $scope.selectedItemCO = $scope.handBandLocker[0];

    // $scope.selectedHandBand = false;
    // $scope.selectHandBand = function() {
        // $scope.selectedHandBand = true;
    // };

   

    //Map filter pop-up and assign ID to the room
    $scope.filterPopup = function() {
        jQuery('.map-filter-container').toggle();
        $('.leaflet-marker-icon').each(function() {
            var rmID = $("span:contains('Rm')", this).text().toLowerCase().replace(" ", "_");
            $(this).attr('id', rmID);
        });
    }

    //Display booking number in front of the room name, assume no bookings there 
    $scope.addBookingNo = function() {
		var dom=".leaflet-marker-icon span:contains('Rm')";
		if($(dom).hasClass('selected')){
        $('.rm-booking-number').remove();
		$('.leaflet-marker-icon br').remove();
		$(dom).removeClass('selected');
		}
		else{
		$("<span class='rm-booking-number'>" + 0 + "</span><br>").insertBefore(dom);
		$(dom).addClass('selected');   
		}
    }
  
  
  //Room type data
	 function CalculateavailableRm(){
		   availableRmList= ['vip_rm1','vip_rm2','vip_rm3','vip_rm4','vip_rm5','vvip_rm1','vvip_rm2', 'vvip_rm3', 'vvip_rm4', 'vvip_rm5','vvip_rm6',
			'vvip_rm7','vvip_rm8','vvip_rm9','rm1','rm2','rm3','rm4','rm5','rm6','rm7','rm8','rm9','rm10','rm11','rm12','rm13','rm14','rm15','rm16','rm17',
			'rm18','rm19','rm20','rm21','rm22','rm23','rm24','rm25','rm26','rm27','rm28','rm29','rm30','rm31','rm32','rm33','rm34','rm35','rm36','rm37','rm38',
			'rm39','rm40','rm41','rm42','rm43','rm44','rm45','rm46','rm47','rm48','rm49','rm50','rm51','rm52','rm53','rm54','rm55','rm56'];
		 Removeroomname(ConfirmedBkRoomList);
		 Removeroomname(OccupiedRmList);
		 Removeroomname(notAvailableRmList);
		 $scope.confirmedBkCount = ConfirmedBkRoomList.length;
         $scope.occupiedRmCount = OccupiedRmList.length;
		 $scope.availableRmCount=availableRmList.length;
		 $scope.notavailableRmCount=notAvailableRmList.length;
		 //$scope.notavailableRmCount=notavailableRmList.length;
	 }
	 function Removeroomname(list){
	    for(var i in list){
	      if(availableRmList.indexOf(list[i])!=-1){
		    availableRmList.splice(availableRmList.indexOf(list[i]),1);
		  }
		 } 
	 }
    //Show selected room type
    $scope.showOccupied = function() {
        $('#' + OccupiedRmList.join(',#')).toggleClass('rmOccupied-sel');
    }
    $scope.showConfirmed = function() {
        $('#' + ConfirmedBkRoomList.join(',#')).toggleClass('rmConfirmed-sel');
    }
    $scope.showAvailableRm = function() {
        $('#' + availableRmList.join(',#')).toggleClass('rmAvailable-sel');
    }
    $scope.showNotAvailableRm = function() {
        $('#' + notAvailableRmList.join(',#')).toggleClass('rmNotAvailable-sel');
    }

    //Toggle collapse
    $scope.toggleCol = function() {
        $('.panel-collapse').collapse('toggle');
    }

    //Validate Booking record mbr_code
    $scope.validSelectedBk = function() {
        var init;
        var notSel = 0;

        for (var i = 0; i < $scope.booking.length; i++) {

            if (!$scope.booking[i].selected) {
                notSel += 1;
            }
            if (notSel === $scope.booking.length) {
                layer.alert("Please select booking record(s)");
                return;
            }

            if ($scope.booking[i].selected) {
                if (!init) {
                    init = $scope.booking[i];
                } 
				else if (init.mbr_code !== $scope.booking[i].mbr_code) 
				{
                    layer.alert("Please select booking records of same member!");
                    return;
                }
            }

        }
        $scope.toggleCol();
    }
	
	
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
					  if(data[i].bind_staff_id==null||data[i].bind_staff_id==""){
							if(!data[i].bind_guest_id){ 
							  unbind_beacon_list.push(data[i]);
							}
							else{
							  bind_beacon_list.push(data[i]);
							}
					  }
				  }				   
				 $scope.unbecaon_List=unbind_beacon_list;
				 $scope.becaon_List=bind_beacon_list;
				 $scope.lockeCount=bind_beacon_list.length;
                }, error: function () {
                    layer.alert("The system is busy. Please try again later");
                }
            });	 
	 }

	//綁定手環
   function RegisterCustomerInfomation(){
	    var memberID = $('#member_id').attr("o-data-id");
		var cbID = $('#select-hb option:selected').html();
		var booking_no =$('#booking_no').attr("o-data-id");
       $.ajax({
                type: "Post",
                url: ServerUrl+"beacon/association",
                dataType: "json",
				data:{t: new Date(),cbID:cbID,UID:memberID,target_type:1},//
                success: function (data) {
					     var str_show="Bind successfully";
						 UpdateBookingStatus(booking_no,"S",str_show);//修改訂單狀態為S
                         $('#register-guest-accordion > div:nth-child(1) > div.panel-heading > h4 > a').click();
                         $('#pairing > div > div.searching-result > selected-records > div > div > div.table-cell.booking-info > div:nth-child(2) > div.booking-room.ng-binding');
                          getBeaconList();						 
                }, error: function () {
                    layer.alert("Have not any booking was selected");
                }
            });
   }
    //解除手環綁定
	function CheckOutBeacon(){	  
         var booking_no =$('#unbind_booking_code').attr("o-data-id");
         var cbID  =$('#select-hb-co option:selected').html();			 
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
                       getBeaconList();					  
                }, error: function () {
                    layer.alert("The system is busy. Please try again later");
                }
            });
	}
	
	 //修改訂單狀態
   function  UpdateBookingStatus(booking_no,bk_status,str_show){	   
       $.ajax({
                type: "GET",
                url: ServerUrl+"booking/updateBookingStatus",
                dataType: "json",
				data:{t: new Date(),bookingNo:booking_no,status:bk_status},
                success: function (data) {	
                       $('.close').click();
						layer.msg(str_show);
                        
						 changeallstatusdata();
						 //重新獲取房間狀態數據						
                }, error: function () {
                    layer.alert("The system is busy. Please try again later");
                }
            });
   }
	
	
	//獲取綁定Beacon的客戶信息
	function GetBindCustomerInfomation(){
	   var bindbeaconId =$('#select-hb-co option:selected').html();
	   if(bindbeaconId=="Please Select"){
		   $('#check-out > div > div > div.modal-body > div.selectedItemCO > div').css("display","none");
	   }
	   else{
		  $('#check-out > div > div > div.modal-body > div.selectedItemCO > div').css("display","block"); 
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
	}
	
	
	 //alert box
	function alert_box(content){
           $.smallBox({
            title: "Warning!",
            content: "<div class='alert-box'>"+content+"</div",
            color: "#C79121",
            //timeout: 8000,
            icon: "fa fa-bell swing animated"
           });
	 }
	//消息通知
   function reloadmessageRecived(){
		 $.ajax({
                type: "Get",
                url: ServerUrl+"notification/byTimeQuantum",
                dataType: "json",
				data:{from:lastnowtime-5000,to:lastnowtime},
                success: function (data) {
				  msgShow(data);				  	    
                  setTimeout(reloadmessageRecived,5000);				  
                }, error: function () {
                    layer.alert("The system is busy. Please try again later");
                }
            });
    }
	
	function msgShow(data){
     var obj = eval(data);
	   for(var i in obj){	 
		  var jsonobj = obj[i];	  
		  for(var o in jsonobj) {
          if(jsonobj[o].type.indexOf(5)!=-1){			  
		   var b = true;
		   var time_length =(obj.server_time-jsonobj[o].create_time)/1000;//計算時間差
		     for(var j in MessageList){
                 if(MessageList.length>0){  			
			        if(MessageList[j].id==jsonobj[o].id){	
				        b = false;
				        break;
			        }
			        if(MessageList[0].id==-1){MessageList.splice(0, 1);}
			     }
			   }
              if(b){     
				  MessageList.push({"id":jsonobj[o].id,"content":jsonobj[o].content,"create_time":jsonobj[o].create_time,"time_length":time_length}); //創建新的消息
				  var time_str =changTimetype(time_length);//轉換時間格式
				  $('#message-box').prepend('<li class="message"><img src="styles/img/avatars/sunny.png" class="online" alt="sunny" height="42" width="42"><span class="message-text"> <a href-void class="username">Message:<small class="text-muted pull-right ultra-light"> '+time_str+'</small></a>'+jsonobj[o].content+'</span></li>');										 			
                  // alert_box(jsonobj[o].content.replace('/n','<br>'));
				  alert_box(jsonobj[o].content);
				  UnReadMessageCount++;
                  $('#activity > b').addClass('bg-color-red');
                  $('#activity > b').html(UnReadMessageCount);				  
		       }							
		  } 	
		 }
	   }
          lastnowtime =obj.server_time;
          reloadTime(obj.server_time);		  
   }
   
	   function reloadMoreMessageRecived(){
		 $.ajax({
                type: "Get",
                url: ServerUrl+"notification/byTimeQuantum",
                dataType: "json",
				data:{from:lastnowtime-86400000,to:lastnowtime},
				beforeSend:function(){$('#div_loading').addClass('layui-layer-loading1');},
                success: function (data) {
                  if(data.data.length==0){
				    layer.msg('Have no mroe notification');
					$('#div_loading').removeClass('layui-layer-loading1')
				  }
				  else{
				  $('#div_loading').removeClass('layui-layer-loading1')
				    msgMoreShow(data);
				  }			  
                }, error: function () {
                    layer.alert("The system is busy. Please try again later");
                }
            });
    }
	
	
	
	function msgMoreShow(data){
     var obj = eval(data);
	   for(var i in obj){	 
		  var jsonobj = obj[i];	
		  for(var o=jsonobj.length-1;o>=0;o--) {
          if(jsonobj[o].type.indexOf(5)!=-1){	 		
			   var b = true;
			   var time_length =(obj.server_time-jsonobj[o].create_time)/1000;//計算時間差
				 for(var j in MessageList){
					 if(MessageList.length>0){  			
						if(MessageList[j].id==jsonobj[o].id){	
							b = false;
							break;
						}
						if(MessageList[0].id==-1){MessageList.splice(0, 1);}
					 }
				   }
				  if(b){     
					  MessageList.splice(0,0,{"id":jsonobj[o].id,"content":jsonobj[o].content,"create_time":jsonobj[o].create_time,"time_length":time_length}); //創建新的消息
					  var time_str =changTimetype(time_length);//轉換時間格式
					   $('#message-box').prepend('<li class="message"><img src="styles/img/avatars/sunny.png" class="online" alt="sunny" height="42" width="42"><span style="display:block" class="message-text"> <a href-void class="username">Message:<small class="text-muted pull-right ultra-light"> '+time_str+'</small></a>'+jsonobj[o].content+'</span></li>');												 			
				   }
              }							
			 	
		 }
	   }
          lastnowtime =obj.server_time;
          reloadTime(obj.server_time);		   
   }
 
    //刷新時間
    function reloadTime(server_time){
	   for(var i in MessageList){
		MessageList[i].time_length =(server_time-MessageList[i].create_time)/1000;//更新數組時間
        var time_str =changTimetype(MessageList[i].time_length);//轉換時間格式	
        var index=MessageList.length-1-i;		
	    $('#message-box li a small:eq('+index+')').html(time_str);										 			
	   }   
	}
	   //轉換時間格式
    function changTimetype(time_length){
	      var time_str;
	      if(time_length>60&&time_length<3600){
			 time_str = (time_length/60).toFixed(0)+"m"//分
		 }	
         else if(time_length>3600){
			 time_str = (time_length/3600).toFixed(1)+"h"//小時
		 }	
         else{
             time_str = (time_length).toFixed(0)+"s"//秒
		 }
		 return time_str;
   }
	
	
    // 更新狀態數據
	
	
	
	
	
	
}]);