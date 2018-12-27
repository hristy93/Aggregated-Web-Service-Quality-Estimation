using System.Collections.Generic;

namespace AggregatedWebServiceQualityEstimation.Utils.Interfaces
{
    public interface ITestDataManager
    {
        void WriteTestData();
        void WriteTestData(string testData);
        string ReadTestData(bool fromFile);
        void SaveUsedMetrics(Dictionary<string, bool> metricsInfo);
    }
}