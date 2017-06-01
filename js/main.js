var Point_Img = [];//保存座標數據
var Point_Lable = [];
var Point_Icon = [];
var isShowAllIcon=true;
//var ServerUrl ="http://52.76.160.92/";
//var ServerUrl="http://localhost:80/";
var ServerUrl ="http://10.0.0.188/";
var testmap;
function loadmap () {
    //绘制地图
    var map = new BRTMap("mapContainer", {
        token: 'b19e33ecb39848f9ab2a7b43517f662e',
        buildingID: 'H8520002',
        ShowZoomBar: true,
        showFloorBar: true,
        highLightBlockClick: true,
        highLightBlockStyle: {
            color: '#FF3300', //默认 #0099FF
            opacity: 0.8 //默认 0.6
        }
    });
	//顯示房間信息
	   map.on("click", function (e) {
		    var poi = map.getShop(e.mapPoint);	
				if (poi.name){
					$.ajax({
					type: "Get",
					url: ServerUrl+"room/getByRoomName",
					dataType: "json",
					data:{t: new Date(), roomName:poi.name},
					success: function (data) { 
					         if(data.length<=0){
							   layer.msg("The Room have not any booking infomation");
							   return false;
							 }
						     for(var i in data){
								 for(var o in data[i].items){
									  var time_length =(data[i].items[o].from_date-new Date().getTime())/1000;
									  if(time_length<0){
										  layer.msg("The Room have not any booking infomation");
										  return false;
									  }
									  else{        
									 getMemberinfomation(data[i],data[i].items[o]);
									}
								}
							 }
							$('#RoomName-detail').html("Room Details:"+poi.name);
							$('.CoverModal').show();
							$('.alert-room-detail').show();
							$(document.body).css({"overflow-x":"hidden","overflow-y":"hidden"});	
					}, error: function () {
						layer.msg("The Room have not any booking infomation");
					}
				}); 
			  }	  	   
      });
	  
	   function getMemberinfomation(data,items){
		$.ajax({
                type: "Get",
                url: ServerUrl+"guest/byCode",
                dataType: "json",
				data:{t: new Date(), code:data.mbr_code},
                success: function (data) { 
					  mbr_name=data.name;
					  mbr_phone=data.mobile;
					  var time_length =(items.from_date-new Date().getTime())/1000;
					  var str_time_length=changTimetype(time_length);
					  str_time_length=str_time_length+" later"
					  var from_date_minutes = new Date(items.from_date).getMinutes();
					  var to_date_minutes = new Date(items.to_date).getMinutes();
					  var from_date_hours = new Date(items.from_date).getHours();
					  var to_date_hours = new Date(items.from_date).getHours();
					  if(from_date_minutes<10){
						 from_date_minutes="0"+from_date_minutes.toString();
					  }
					  if(to_date_minutes<10){
						 to_date_minutes="0"+to_date_minutes.toString();
					  }
                      $('#RoomBoodkingDetails').append('<div class=" Bookingitems event col-lg-12"><div class="col-lg-3"><span class="col-lg-12">'+from_date_hours+':'+from_date_minutes+'</span><span class="col-lg-12">'+from_date_hours+':'+to_date_minutes+'</span><span class="time-his col-lg-12">'+str_time_length+'</span></div><div class="col-lg-6"><span class="col-lg-12">'+items.item_name+'</span><span class="col-lg-12">'+items.staff_name+'</span><span class="col-lg-12">Machine:Trearment Machine</span></div><i style="color: transparent;" class="col-lg-1 fa fa-trophy" aria-hidden="true"></i><div class="col-lg-2"> <span class="col-lg-12">'+mbr_name+'</span><span class="col-lg-12">'+mbr_phone+'</span></div></div>')
					   
                }, error: function () {
                    layer.msg("cann't find the member information");
                }
            }); 
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

    //由于地图数据使用了异步加载，为避免出错请把所有的逻辑放在 mapready 事件内
    map.on("mapready", function (e) {
		getGuestList();//獲取座標數據
		function getGuestList() {
            $.ajax({
                type: "Get",
                url:ServerUrl+"base/all",
                //url:ServerUrl+"base.all",
                data: { t: new Date() },
                dataType: "json",
                success: function (data) {
					 var obj = eval(data);
					 var josnobj =[];
					 for(var i in obj.guests){
						 if(obj.guests[i].beacon_id!=""&&obj.guests[i].x!=0.0&&obj.guests[i].y!=0.0){
						switch (obj.guests[i].type) {
                        case 1: obj.guests[i].kind="Guest";
                            break;
                        case 2: obj.guests[i].kind="VIP";
                            break;
						case 3: obj.guests[i].kind="VVIP";
						    break;
						}	
                        josnobj.push(obj.guests[i]);	
						 }						
					 }
					 for(var i in obj.staffs){
						 if(obj.staffs[i].beacon_id!=""&&obj.staffs[i].x!=0.0&&obj.staffs[i].y!=0.0){
						switch (obj.staffs[i].type) {
                        case 1: obj.staffs[i].kind="Escort";
                            break;
                        case 2: obj.staffs[i].kind="Maid";
                            break;
						case 3: obj.staffs[i].kind="Therapist";
						    break;
						}	
                        josnobj.push(obj.staffs[i])
                         
						 }						 
					 }
					 // for(var i in obj.machine){
						 // if(obj.machine[i].beacon_id!=""&&obj.machine[i].x!=0.0&&obj.machine[i].y!=0.0){
						// switch (obj.machine[i].type) {
                        // case 1: obj.machine[i].kind="Cleaning Machines";
                            // break;
                        // case 2: obj.machine[i].kind="Theraphy Machines";
                            // break;
						// case 3: obj.machine[i].kind="Treatment Machines";
						    // break;
						// }	
                        // josnobj.push(obj.machine[i])
                         
						 // }						 
					 // }
                    if (Point_Img.length < josnobj.length) {
                        createPoint(josnobj);//創建點座標 	
                    }
                    else if (Point_Img.length == josnobj.length) {
                        reloadPoint(josnobj);//刷新點座標				  
                    }
                    else if (Point_Img.length > josnobj.length) {
                        removePoint(josnobj);//移除點座標					  
                    }
					setTimeout(getGuestList,500);//0.5刷新一次坐标
                }, error: function () {
                    layer.alert("The system is busy. Please try again later");
                }
            });
        }
		
        //創建點座標
        function createPoint(point) {
            if (Point_Img.length <= 0) {
                Point_Img.push({ id: -1 });
                Point_Lable.push({ id: -1 });
            }
            for (var i in point) {
                var b = true;
                for (var o in Point_Img) {
                    if (point[i].beacon_id == Point_Img[o].id) {
                        b = false;
                        break;
                    }
                }
                if (b) {
				  if(point[i].x!=null&&point[i].y!=null&&point[i].x!=0.0&&point[i].y!=0.0&&point[i].beacon_id!=""){
                    var Icon_class = "";//Icon ClassNmae
                    switch (point[i].kind) {
                        case "Guest": {Icon_class = "fa fa-circle fa-fw";point[i].url="guest/list";}
                            break;
                        case "VIP": {Icon_class = "fa fa-circle fa-fw txt-color-red";point[i].url="guest/list";}
                            break;
						case "VVIP": {Icon_class = "fa fa-circle fa-fw txt-color-magenta";point[i].url="guest/list";}
						    break;
					    case "Escort": {Icon_class = "fa fa-bookmark fa-fw";point[i].url="staff/list";}
                            break;
                        case "Maid": {Icon_class = "fa fa-shopping-basket fa-fw txt-color-blue";point[i].url="staff/list";}
                            break;
						case "Therapist": {Icon_class = "fa fa-heart-o fa-fw";point[i].url="staff/list";}
						    break;
						case "Cleaning Machines": {Icon_class = "fa fa-cog fa-fw txt-color-green";point[i].url="";}
                            break;
                        case "Theraphy Machines": {Icon_class = "fa fa-cog fa-fw txt-color-red";point[i].url="";}
                            break;
						case "Treatment Machines": {Icon_class = "fa fa-cog fa-fw";point[i].url="";}
						    break;
						// case "Available": {Icon_class = "fa fa-star fa-fw";point[i].url="";}
                            // break;
                        // case "Ready for Clean": {Icon_class = "fa fa-paint-brush fa-fw";point[i].url="";}
                            // break;
						// case "Occupied": {Icon_class = "fa fa-ban fa-fw txt-color-red";point[i].url="";}
						    // break;
                    }
                    if (!isShowAllIcon) {
						
						if(Point_Icon.length==0){
							
						  Point_Img[i].x = point[i].x;
                          Point_Img[i].y = point[i].y;
						}
						
						else{
							
                          if (Point_Icon.indexOf(point[i].kind)==-1) {
                            point[i].x = 0.0;
                            point[i].y = 0.0;
                          }
                          else {
							Point_Img[i].x = point[i].x;
                            Point_Img[i].y = point[i].y;

                           }
						}
                    }
					else{
						
						 Point_Img[i].x = point[i].x;
                         Point_Img[i].y = point[i].y;
					   
					}
					//將對象加入Point_Img數組
                    var image = new BRTSymbol.divIcon([point[i].x,point[i].y],{
                                html:'<i style="width:30px;height:30px;" class="'+Icon_class+'"></i>',
                                className:'divIcon',
                                }).addTo(map);	
								
					var myLabel = new BRTSymbol.divIcon([point[i].x, point[i].y], {
                        html: point[i].name,
                        className: 'User',
						width:80,
                        fontSize:20,
                        offsetY: 25,
						offsetX: -20,
                        color: "#FF3300",
						autoCenter:true

                    }).addTo(map);								
					Point_Lable.push(myLabel);//將對象加入Point_Img數組
                    Point_Img.push(image);
                    Point_Img[Point_Img.length - 1].id = point[i].beacon_id;
					Point_Img[Point_Img.length - 1].kind = point[i].kind;
                    Point_Img[Point_Img.length - 1].x = point[i].x;
                    Point_Img[Point_Img.length - 1].y = point[i].y;	
                    Point_Img[Point_Img.length - 1].url = point[i].url;					
					//循環綁定click事件，
                    $(Point_Img[Point_Img.length - 1].domNode).on('click', { coustomerid: point[i].id,url:point[i].url}, GetMemberInfomation);					
					}					

                }

            }

        }

       //刷新點座標
        function reloadPoint(point) {
            for (var i in Point_Img) {
				for (var o in point) {
                if (Point_Img[i].id == point[o].beacon_id) {
                    if (!isShowAllIcon) {
						
						if(Point_Icon.length==0){
							
						  Point_Img[i].x = point[o].x;
                          Point_Img[i].y = point[o].y;
						}
						
						else{
							
                          if (Point_Icon.indexOf(Point_Img[i].kind)==-1) {
                            point[o].x = 0.0;
                            point[o].y = 0.0;
                          }
                          else {
							Point_Img[i].x = point[o].x;
                            Point_Img[i].y = point[o].y;

                           }
						}
                    }
					else{
						
						 Point_Img[i].x = point[o].x;
                         Point_Img[i].y = point[o].y;
					   
					}
                    Point_Img[i].setPoint([point[o].x, point[o].y]);//重設座標
                    Point_Lable[i].setPoint([point[o].x, point[o].y]);
                    // var xy = { "x": point[o].x, "y": point[o].y };
                    // var shop = map.getShop(xy);
                    $(Point_Img[i].domNode).off('click');//解除舊的绑定事件
                    $(Point_Img[i].domNode).on('click', { coustomerid: point[o].id,url:Point_Img[i].url }, GetMemberInfomation);//循環綁定click事件，	
                 break;
				}
				
            }
			
			}

        }
       
	   //移除點座標	
        function removePoint(point) {
            for (var i in Point_Img) {
                var b = true;
                for (var o in point) {
                    if (Point_Img[i].id == point[o].beacon_id) {
                        b = false;
                        break;
                    }
                }
                if (b) {
                    $(Point_Img[i].domNode).remove();
                    $(Point_Lable[i].domNode).remove()
                    Point_Img.splice(i, 1);
                    Point_Lable.splice(i, 1);
                }

            }
        }

    });
	
	
	//關閉彈窗
	$('.btn_Close').on('click',
	function(){
		$('#RoomBoodkingDetails .Bookingitems').remove();
		$('.CoverModal').hide();
		$('.roomInfomationModal').hide();
		$('.customerInfomationModal').hide();
		$('.alert-enquiries').hide();
		$('.alert-room-detail').hide();
		$(document.body).css({"overflow-x":"auto","overflow-y":"auto"});
  
	});
	
     
}

   
   //獲取人員信息
   function GetMemberInfomation(event){	
		  $.ajax({
                type: "Get",
                url: ServerUrl+event.data.url,
                dataType: "json",
				data:{time:lastnowtime},
                success: function (data) {
                     switch (event.data.url){
					   case "guest/list":showCustomerInfomation(data,event);
					   break;
					   case "staff/list":showStaffInfomation(data,event);
					   break;
					 }						 
                }, error: function () {
                    layer.alert("The system is busy. Please try again later");
                }
            });
			return false;
   }
   
   	//用戶信息彈窗
    function showCustomerInfomation(data,event) {
	    for(var i in data){
			if(data[i].id==event.data.coustomerid){
			   getCustomerBookingInfomation(event.data.coustomerid);
			 $('.alert-enquiries .user-name').html(data[i].name+"("+data[i].mobile+")");
			}
		 }
        $('.CoverModal').show();
	    $('.alert-enquiries').show();
		$(document.body).css({"overflow-x":"hidden","overflow-y":"hidden"});
    }
     	//員工信息彈窗
    function showStaffInfomation(data,event) {
		for(var i in data){
			if(data[i].id==event.data.coustomerid){
			 $('.alert-enquiries .user-name').html(data[i].name+"("+data[i].mobile+")");
			}
		 }
        $('.CoverModal').show();
	    $('.alert-enquiries').show();
		$(document.body).css({"overflow-x":"hidden","overflow-y":"hidden"});
    }

   //過濾點類型
    function showIcon(obj){
        isShowAllIcon=false;
		var value =$(obj).html();
		if(!$(obj).hasClass('btn-selected')){	
			 switch (value) {
                        case "Member": Point_Icon.push("VIP","VVIP","Guest");
                            break;
                        case "Therapist": Point_Icon.push("Maid","Therapist","Escort");
                            break;
						case "Equipment": Point_Icon.push("Theraphy Machines","Treatment Machines","Cleaning Machines");
						    break;
			 }	
		}
		else{
             switch (value) {
                        case "Member":Point_Icon.splice(Point_Icon.indexOf("VIP"),3);
                            break;
                        case "Therapist": Point_Icon.splice(Point_Icon.indexOf("Maid"),3);
                            break;
						case "Equipment": Point_Icon.splice(Point_Icon.indexOf("Theraphy Machines"),3);
						    break;
			 }	
		}	
	}
      
	 function getCustomerBookingInfomation(id){
		 $.ajax({
                type: "Get",
                url: ServerUrl+"base/findByGuestId",
                dataType: "json",
				data:{t: new Date(), id:id},
                success: function (data) { 
					   records.mbr_name=data.name;
					   records.mbr_phone=data.mobile;
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
                }, error: function () {
                    layer.alert("The system is busy. Please try again later");
                }
            }); 
	       
	 }
   
   
   
   
