var Point_Img = [];//保存座標數據
var Point_Lable = [];
var Point_Icon = [];
var isShowAllIcon=true;
var ServerUrl ="http://52.76.160.92/";
//var ServerUrl="http://localhost:80/";
//var ServerUrl ="http://innosrc.cn:8889/";
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
        if (poi.name) {
	    $('#RoomName-detail').html("Room Details:"+poi.name);
        $('.CoverModal').show();
	    $('.alert-room-detail').show();
		$(document.body).css({"overflow-x":"hidden","overflow-y":"hidden"});
		return false;	
        }
        });

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
                    if (Point_Img.length < josnobj.length) {
                        createPoint(josnobj);//創建點座標 	
                    }
                    else if (Point_Img.length == josnobj.length) {
                        reloadPoint(josnobj);//刷新點座標				  
                    }
                    else if (Point_Img.length > josnobj.length) {
                        removePoint(josnobj);//移除點座標					  
                    }
					setTimeout(getGuestList, 500);//0.5刷新一次坐标
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
                        case "Guest": Icon_class = "fa fa-circle fa-fw";
                            break;
                        case "VIP": Icon_class = "fa fa-circle fa-fw txt-color-red";
                            break;
						case "VVIP": Icon_class = "fa fa-circle fa-fw txt-color-magenta";
						    break;
					    case "Escort": Icon_class = "fa fa-bookmark fa-fw";
                            break;
                        case "Maid": Icon_class = "fa fa-shopping-basket fa-fw txt-color-blue";
                            break;
						case "Therapist": Icon_class = "fa fa-heart-o fa-fw";
						    break;
						case "Cleaning Machines": Icon_class = "fa fa-cog fa-fw txt-color-green";
                            break;
                        case "Theraphy Machines": Icon_class = "fa fa-cog fa-fw txt-color-red";
                            break;
						case "Treatment Machines": Icon_class = "fa fa-cog fa-fw";
						    break;
						case "Available": Icon_class = "fa fa-star fa-fw";
                            break;
                        case "Ready for Clean": Icon_class = "fa fa-paint-brush fa-fw";
                            break;
						case "Occupied": Icon_class = "fa fa-ban fa-fw txt-color-red";
						    break;
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
                        fonsSize: 12,
                        offsetY: 20,
                        color: "#FF3300",
                    }).addTo(map);								
					Point_Lable.push(myLabel);//將對象加入Point_Img數組
                    Point_Img.push(image);
                    Point_Img[Point_Img.length - 1].id = point[i].beacon_id;
					Point_Img[Point_Img.length - 1].kind = point[i].kind;
                    Point_Img[Point_Img.length - 1].x = point[i].x;
                    Point_Img[Point_Img.length - 1].y = point[i].y;						 
					//循環綁定click事件，
                    $(Point_Img[Point_Img.length - 1].domNode).on('click', { coustomerid: point[i].id }, GetCustomerInfomation);			
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
                    $(Point_Img[i].domNode).on('click', { coustomerid: point[o].id }, GetCustomerInfomation);//循環綁定click事件，	
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
		$('.CoverModal').hide();
		$('.roomInfomationModal').hide();
		$('.customerInfomationModal').hide();
		$('.alert-enquiries').hide();
		$('.alert-room-detail').hide();
		$(document.body).css({"overflow-x":"auto","overflow-y":"auto"});
  
	});
	
     
}

   
   //獲取客戶信息
   function GetCustomerInfomation(event){									        
		 for(var i in ConfirmedBookingList){
					    if(ConfirmedBookingList[i].id==event.data.coustomerid)
						{
						 $('#CustomerName').html(ConfirmedBookingList[i].name+"("+ConfirmedBookingList[i].mobile+")");
						}
					 }
                     showCustomerInfomation();	
			return false;
   }
   
   	//用戶信息彈窗
    function showCustomerInfomation() {
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
   
   // function showTips(beacon_id){
	 // var domNode;
	 // for(var i in Point_Img){
	    // if(Point_Img[i].id==beacon_id){
		    // domNode=Point_Img[i].domNode
		// }
	 // }
     // layer.tips('客戶johnson在廁所呆超過5分鐘',domNode, {
    // tips: [1, '#812990'],
    // time: 10000
   // });
	 
   // }
   
   
   
   
