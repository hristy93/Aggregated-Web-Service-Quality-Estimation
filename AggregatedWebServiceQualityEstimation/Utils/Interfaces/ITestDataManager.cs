using System.Collections.Generic;

namespace AggregatedWebServiceQualityEstimation.Utils.Interfaces
{
    public interface ITestDataManager
    {
        void WriteTestData(string webServiceId);
        void WriteTestData(string testData, string webServiceId);
        string ReadTestData(string webServiceId, bool fromFile);
        void SaveUsedMetrics(Dictionary<string, bool> metricsInfo);
    }
}