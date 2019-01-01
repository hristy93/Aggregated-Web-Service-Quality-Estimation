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

        public void EditUrl(string url, bool isPost, string webServiceId)
        {

            XmlDocument document = new XmlDocument();
            document.Load(WebServicePerformanceTestDocumentPath);

            XmlNode requestNode = webServiceId == "first" ?
                document.LastChild.FirstChild.FirstChild :
                document.LastChild.FirstChild.ChildNodes[1];

            requestNode.Attributes["Url"].Value = url;

            if (isPost)
            {
                requestNode.Attributes["Method"].Value = "POST";
            }
            else
            {
                requestNode.Attributes["Method"].Value = "GET";
            }

            document.Save(WebServicePerformanceTestDocumentPath);
        }

        public void EditRequestBodyData(string data, bool isPostRequest, string webServiceId)
        {
            XmlDocument document = new XmlDocument();
            document.Load(WebServicePerformanceTestDocumentPath);

            XmlElement postBodyElement;
            XmlNode requestNode = webServiceId == "first" ?
                document.LastChild.FirstChild.FirstChild :
                document.LastChild.FirstChild.ChildNodes[1];
            //document.LastChild.FirstChild :
            //document.LastChild.LastChild;

            if (isPostRequest)
            {
                XmlElement formPostParameterElement = null;
                if (requestNode.ChildNodes.Count == 0)
                {
                    postBodyElement = document.CreateElement("FormPostHttpBody");
                }
                else
                {
                    postBodyElement = requestNode.FirstChild as XmlElement;
                }

                int childNodeIndex = 0;
                JObject jsonObject = JObject.Parse(data);
                foreach (JProperty jsonProperty in (JToken)jsonObject)
                {
                    var name = jsonProperty.Name;
                    var value = jsonProperty.Value.ToString();

                    if (requestNode.ChildNodes.Count == 0)
                    {
                        formPostParameterElement = document.CreateElement("FormPostParameter");
                    }
                    else
                    {
                        formPostParameterElement = postBodyElement.ChildNodes[childNodeIndex] as XmlElement;
                    }

                    formPostParameterElement.SetAttribute("Name", name);
                    formPostParameterElement.SetAttribute("Value", value);
                    formPostParameterElement.SetAttribute("RecordedValue", "");
                    formPostParameterElement.SetAttribute("CorrelationBinding", "");
                    formPostParameterElement.SetAttribute("UrlEncode", "True");

                    childNodeIndex += 1;

                    if (requestNode.ChildNodes.Count == 0)
                    {
                        postBodyElement.AppendChild(formPostParameterElement);
                    }
                }

                if (requestNode.ChildNodes.Count == 0)
                {
                    requestNode.AppendChild(postBodyElement);
                }
            }
            else
            {
                var postBodyNode = requestNode.FirstChild;
                if (postBodyNode?.Name == "FormPostHttpBody")
                {
                    requestNode.RemoveChild(postBodyNode);
                }     
            }
           
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
