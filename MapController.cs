using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Web;
using System.Web.Mvc;
using TagReceiver;

namespace ASANA_Map.Controllers
{
    public class HomeController : Controller
    {
        public static byte[] tags_byts;
        public static byte[] data_byts;
        // GET: Home
        public ActionResult Index()
        {
            GetData();
            
            return View();
        }
        public string GetData()
        {
            byte[] byts = new byte[Request.InputStream.Length];
            Request.InputStream.Read(byts, 0, byts.Length);
            tags_byts = byts;
            string Url = "http://cb.api.brtbeacon.net/lbs/v011/service/logon.do";
            string jsonresult = HttpGet(Url, "Post");
            return jsonresult;
        }
        private string HttpGet(string url, string method)
        {
            
            Hashtable result = new Hashtable();
            ArrayList list = new ArrayList();
            if (tags_byts != null)
            {
                string tags = Encoding.UTF8.GetString(tags_byts);
            } 
            string data="";
            data += "{\"appkey\":\"36e7136904744807a832bbae8c6f2b4a\",\"buildingID\":\"H8520002\",\"token\":\"b19e33ecb39848f9ab2a7b43517f662e\",\"navigate_url\":" + "\"http://cn02.innosrc.cn/Home/AccPoint\"" + ",\"tags\":"+  + "}";
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
            return 1;
        }

        public JsonResult GetPoint()
        {
            var res = new JsonResult();
            Hashtable result = new Hashtable();
            ArrayList list = new ArrayList();
            if (data_byts != null) {   
            res.Data = Encoding.UTF8.GetString(data_byts);
            }
            res.JsonRequestBehavior = JsonRequestBehavior.AllowGet;//允许使用GET方式获取，否则用GET获取是会报错。  
            return res;
        }
        //public void writeLog()
        //{
        //    StreamReader sr = new StreamReader(LogHelper.logFile, Encoding.UTF8); 
        //    sr.Close();
        //}

        //将错误信息写入日志
    }
}
