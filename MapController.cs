using ASANA_Map.Help;
using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Mvc;

namespace ASANA_Map.Controllers
{
    public class HomeController : Controller
    {
        LogHelper log = new LogHelper();
        public static byte[] tags_byts;//智石返回的tags數據
        public static byte[] data_byts;//智石返回的座標數據
        public static string tags = "";//未序列化的tags
        public static string jsondata = "";//序列化後的tags
        public static ArrayList tags_arrys= new ArrayList();
        // GET: Home
        public ActionResult Index()
        {
            
            return View();
        }
        public void Doit()
        {
            byte[] byts = new byte[Request.InputStream.Length];
            Request.InputStream.Read(byts, 0, byts.Length);
            tags_byts = byts;
            Hashtable result = new Hashtable();
            ArrayList list = new ArrayList();
            if (tags_byts != null)
            {
                tags = Encoding.UTF8.GetString(tags_byts);
                Json json = new Json();
                string new_jsondata = "DFC0F1FF6013,FFD1E8A36720,C4082A2B432B,F741B7FE8FA4";
                //new_jsondata = json.Analytic_Json(tags);
                //log.Write("未處理的tags：" + new_jsondata + "\r\n");
                string[] sArray = Regex.Split(new_jsondata,",", RegexOptions.IgnoreCase);//切割字符串
                foreach (string i in sArray)
                {
                    if (!tags_arrys.Contains(i))//判斷tags_arrys是否有新增的tags
                    {
                        tags_arrys.Add(i);//將新增的tags加入tags_arrys數組
                        jsondata = "";
                        for(int o = 0; o < tags_arrys.Count; o++)
                        {
                          jsondata+= "\"" + tags_arrys[o].ToString() + "\"" + ",";
                        }
                        jsondata = jsondata.Substring(0, jsondata.Length - 1);
                        GetData();
                        log.Write("Post的tags：" + jsondata + "\r\n");
                    }                   
                }              
            }
            
        }
        public string GetData()
        {
            string Url = "http://cb.api.brtbeacon.net/lbs/v011/service/logon.do";
            string jsonresult = HttpGet(Url, "Post");
            return jsonresult;
        }
        private string HttpGet(string url, string method)
        {
            string data="";
            data += "{\"appkey\":\"36e7136904744807a832bbae8c6f2b4a\",\"buildingID\":\"H8520002\",\"token\":\"b19e33ecb39848f9ab2a7b43517f662e\",\"navigate_url\":" + "\"http://cn02.innosrc.cn/Home/AccPoint\"" + ",\"tags\":["+jsondata+"]}";
            //log.Write("返回的Tags：" + jsondata + "\r\n");
            //log.Write("发送的data數據：" + data + "\r\n");
            writeLog();
            byte[] byteArray = Encoding.UTF8.GetBytes(data);
            //初始化新的webRequst
            //1． 创建httpWebRequest对象
            HttpWebRequest webRequest = (HttpWebRequest)WebRequest.Create(new Uri(url));
            //2． 初始化HttpWebRequest对象
            webRequest.Method = "POST";
            webRequest.ContentType = "application/json";
            webRequest.ContentLength = byteArray.Length;
            //3． 附加要POST给服务器的数据到HttpWebRequest对象(附加POST数据的过程比较特殊，它并没有提供一个属性给用户存取，需要写入HttpWebRequest对象提供的一个stream里面。)
            Stream newStream = webRequest.GetRequestStream();//创建一个Stream,赋值是写入HttpWebRequest对象提供的一个stream里面
            newStream.Write(byteArray, 0, byteArray.Length);
            newStream.Close();
            HttpWebResponse response = (HttpWebResponse)webRequest.GetResponse();
            StreamReader php = new StreamReader(response.GetResponseStream(), Encoding.UTF8);
            string phpend = php.ReadToEnd();
            return phpend;
        }

        public int AccPoint()
        {


            byte[] byts = new byte[Request.InputStream.Length];
            Request.InputStream.Read(byts, 0, byts.Length);
            data_byts = byts;
            //log.Write("返回的座標數據：" + Encoding.UTF8.GetString(data_byts) + "\r\n");
            return 1;
        }

        public JsonResult GetPoint()
        {
            var res = new JsonResult();
            if (data_byts != null) {   
            res.Data = Encoding.UTF8.GetString(data_byts);
            }
            res.JsonRequestBehavior = JsonRequestBehavior.AllowGet;//允许使用GET方式获取，否则用GET获取是会报错。 
            return res;
        }
        public void writeLog()
        {
            StreamReader sr = new StreamReader(LogHelper.logFile, Encoding.UTF8);
            sr.Close();
        }

        //将错误信息写入日志
    }
}
