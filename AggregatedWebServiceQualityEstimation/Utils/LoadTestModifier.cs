using AggregatedWebServiceQualityEstimation.Utils.Interfaces;
using Newtonsoft.Json.Linq;
using System;
using System.Xml;

namespace AggregatedWebServiceQualityEstimation.Utils
{
    public class LoadTestModifier : ITestModifier
    {
        readonly string WebServicePerformanceTestDocumentPath = @"../PerformanceAndLoadTests/WebServicePerformanceTest.webtest";
        readonly string WebServiceLoadTestDocumentPath = @"../PerformanceAndLoadTests/WebServiceLoadTest.loadtest";

        public void EditUrl(string url, bool isPost)
        {

            XmlDocument document = new XmlDocument();
            document.Load(WebServicePerformanceTestDocumentPath);

            XmlNode node = document.LastChild.FirstChild.FirstChild;
            node.Attributes["Url"].Value = url;

            if (isPost)
            {
                node.Attributes["Method"].Value = "POST";
            }
            else
            {
                node.Attributes["Method"].Value = "GET";
            }

            document.Save(WebServicePerformanceTestDocumentPath);
        }

        public void EditRequestBodyData(string data)
        {
            XmlDocument document = new XmlDocument();
            document.Load(WebServicePerformanceTestDocumentPath);
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
            document.Save(WebServicePerformanceTestDocumentPath);
        }

        public bool EditDuration(string duration)
        {

            XmlDocument document = new XmlDocument();
            document.Load(WebServiceLoadTestDocumentPath);

            XmlNode node = document.LastChild.LastChild.LastChild;

            var splittedDuration = duration.Split(':');
            if (splittedDuration == null
                || !Int32.TryParse(splittedDuration[2], out int seconds)
                || !Int32.TryParse(splittedDuration[1], out int minutes)
                || !Int32.TryParse(splittedDuration[0], out int hours))
            {
                return false;
            }

            var parsedDuration = seconds + minutes * 60 + hours * 60 * 60;
            node.Attributes["RunDuration"].Value = parsedDuration.ToString();
            document.Save(WebServiceLoadTestDocumentPath);

            return true;
        }
    }
}
