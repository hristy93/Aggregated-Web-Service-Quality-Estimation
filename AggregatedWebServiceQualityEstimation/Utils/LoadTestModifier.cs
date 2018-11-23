using AggregatedWebServiceQualityEstimation.Utils.Interfaces;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Xml;

namespace AggregatedWebServiceQualityEstimation.Utils
{
    public class LoadTestModifier : ITestModifier
    {
        readonly string DocumentPath = @"../PerformanceAndLoadTests/WebServicePerformanceTest.webtest";

        public void EditUrl(string url, bool isPost)
        {
           
            XmlDocument document = new XmlDocument();
            document.Load(DocumentPath);

            XmlNode node = document.FirstChild.FirstChild.FirstChild;
            node.Attributes["Url"].Value = url;

            if (isPost)
            {
                node.Attributes["Method"].Value = "POST";
            }
            else
            {
                node.Attributes["Method"].Value = "GET";
            }

            document.Save(DocumentPath);
        }

        public void AddRequestBodyData(string data)
        {
            XmlDocument document = new XmlDocument();
            document.Load(DocumentPath);
            XmlNode node = document.LastChild.LastChild;
            XmlElement postBodyElement = document.CreateElement("FormPostHttpBody");
            XmlElement formPostParameterElement;

            JObject jsonObject = JObject.Parse(data);
            foreach (JProperty jsonProperty in (JToken)jsonObject)
            { 
                var name = jsonProperty.Name;
                var value = jsonProperty.Value.ToString();
                formPostParameterElement = document.CreateElement("FormPostParameter");
                formPostParameterElement.SetAttribute("Name", name);
                formPostParameterElement.SetAttribute("Value", value);
                formPostParameterElement.SetAttribute("RecordedValue", "");
                formPostParameterElement.SetAttribute("CorrelationBinding", "");
                formPostParameterElement.SetAttribute("UrlEncode", "True");
                postBodyElement.AppendChild(formPostParameterElement);
            }
         
            node.AppendChild(postBodyElement);
            document.Save(DocumentPath);
        }
    }
}
