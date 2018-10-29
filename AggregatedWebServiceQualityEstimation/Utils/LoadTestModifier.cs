using AggregatedWebServiceQualityEstimation.Utils.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Xml;

namespace AggregatedWebServiceQualityEstimation.Utils
{
    public class LoadTestModifier : ITestModifier
    {
        public void EditUrl(string url)
        {
            const string documentPath = @"../PerformanceAndLoadTests/WebServicePerformanceTest.webtest";
            XmlDocument doc = new XmlDocument();
            doc.Load(documentPath);
            XmlNode node = doc.LastChild.LastChild.LastChild;
            node.Attributes["Url"].Value = url;
            doc.Save(documentPath);
        }
    }
}
