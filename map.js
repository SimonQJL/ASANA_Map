
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

        setTimeout(getPoint, 2000);//两秒刷新一次坐标

        function getPoint() {
            $.ajax({
                type: "Get",
                url: "/Home/GetPoint",
                data: { t: new Date() },
                dataType: "json",
                success: function (data) {
                    setTimeout(getPoint, 500);
                    setTimeout(reload(data), 500);//两秒刷新一次地图
                    console.log(data);
                }, error: function () {
                    alert("智石返回空數據，無法繪點");
                }
            });
        }

            
        function reload(data) {
            var obj = eval(data);
            var obj_point = $("path[stroke='#aaaaaa']");
            var obj_user = $(".User");
            obj_point.remove();//移除圆点
            obj_user.remove();//移除label
            for (var i in obj) {
                var point1 = new BRTSymbol.Circle([obj[i].x, obj[i].y], {
                    radius: 5, //半径  像素
                    color: "#aaaaaa"
                }).addTo(map);//添加圆圈标记
                var myLabel = new BRTSymbol.divIcon([obj[i].x, obj[i].y], {
                    html: obj[i].ble_addr,
                    className: 'User',
                    //id: obj[i].id,
                    fonsSize: 12,
                    offsetY: 10,
                    color: "#FF3300",
                }).addTo(map);	//添加文字
                //获取当前房间名字
                var xy = { "x": obj[i].x, "y": obj[i].y };
                var shop = map.getShop(xy);
                console.log(shop.name);
            }

        }
    });
  
});



