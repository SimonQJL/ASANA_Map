var Point_Img = [];
var Point_Lable = [];
$(function () {
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
    testMap = map;
    //由于地图数据使用了异步加载，为避免出错请把所有的逻辑放在 mapready 事件内
    map.on("mapready", function (e) {
        map.on("click", function (e) {
            var poi = map.getShop(e.mapPoint);
            if (poi.name) {
                map.infoPopup({
                    minWidth: 100,
                    maxWidth: 500
                }).setContent(poi.name).setPoint(e.mapPoint);
            }
        });

        setTimeout(getPoint, 1000);//两秒刷新一次坐标

        function getPoint() {
            $.ajax({
                type: "Get",
                url: "/Home/GetPoint",
                data: { t: new Date() },
                dataType: "json",
                success: function (data) {
                    var obj = eval(data);
                    if (Point_Img.length < obj.length) {
                        createPoint(obj);//創建點座標 	
                    }
                    else if (Point_Img.length == obj.length) {
                        reloadPoint(obj);//刷新點座標				  
                    }
                    else if (Point_Img.length > obj.length) {
                        removePoint(obj);//移除點座標					  
                    }
                    setTimeout(getPoint, 500);
                }, error: function () {
                    alert("智石返回空數據，無法繪點");
                }
            });
        }


        function createPoint(point) {

            if (Point_Img.length <= 0) {
                Point_Img.push({ id: -1 });
                Point_Lable.push({ id: -1 });
            }
            for (var i in point) {
                var b = true;
                for (var o in Point_Img) {
                    if (point[i].ble_addr == Point_Img[o].id) {
                        b = false;
                        break;
                    }
                }
                if (b) {
                    var image = new BRTSymbol.Icon([point[i].x, point[i].y], {
                        url: '../../Img/me_point.png',
                        width: 20,
                        height: 30,
                        offsetY: 0
                    }).addTo(map); //添加圖片
                    Point_Img.push(image);//將對象加入Point_Img數組
                    Point_Img[Point_Img.length - 1].id = point[i].ble_addr;
                    var myLabel = new BRTSymbol.divIcon([point[i].x, point[i].y], {
                        html: point[i].ble_addr,
                        className: 'User',
                        fonsSize: 12,
                        offsetY: 20,
                        color: "#FF3300",
                    }).addTo(map);	//添加文字
                    Point_Lable.push(myLabel);//將對象加入Point_Img數組			
                    //获取当前房间名字
                    // var xy = { "x": point.x, "y": point.y };
                    // var shop = map.getShop(xy);
                    // console.log(shop.name);
                }

            }
        }


        function reloadPoint(point) {
            for (var i in Point_Img) {
                if (Point_Img[i].id == point[i].ble_addr) {
                    Point_Img[i].setPoint([point[i].x, point[i].y]);
                    Point_Lable[i].setPoint([point[i].x, point[i].y]);
                }
            }

        }

        function removePoint(point) {
            for (var i in Point_Img) {
                var b = true;
                for (var o in point) {
                    if (Point_Img[i].id == point[o].ble_addr) {
                        b = false;
                        break;
                    }
                }
                if (b) {
                    Point_Img.splice(i, 1);
                    Point_Lable.splice(i, 1);
                }

            }
        }

    });

});



