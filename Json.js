using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;

namespace ASANA_Map.Help
{
    public class Json
    {
        public struct ToJson
        {
            public List<beacon> beacons;
        }
        public struct beacon
        {
            public string ble_addr { get; set; }
            public string addr_type { get; set; }
        };
        public  string  Analytic_Json(string data)
        {
            string str = "";
            if (data != "" && data != null)
            {
                JavaScriptSerializer js = new JavaScriptSerializer();   //实例化一个能够序列化数据的类
                ToJson list = js.Deserialize<ToJson>(data);    //将json数据转化为对象类型并赋值给list
                
                foreach (var i in list.beacons)
                {
                    //addr_type值為1的時候才是beacon的ble_addr，為0是cloud_beacon
                    if (i.addr_type=="1") { 
                    str += i.ble_addr+",";
                    }
                }

                str = str.Substring(0, str.Length - 1);
            }
            return str;
        }
    }
}
