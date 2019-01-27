using Microsoft.AspNetCore.Http;
using System.Collections.Generic;

namespace AggregatedWebServiceQualityEstimation.Utils.Interfaces
{
    public interface ITestDataManager
    {
        void WriteTestData(string webServiceId);
        void WriteTestData(string testData, string webServiceId);
        string ReadTestData(string webServiceId, bool fromFile);
        string UploadTestData(IFormFile file);
        void SaveUsedMetrics(Dictionary<string, bool> metricsInfo);
        IList<string[]> GetMetricsData(string webServiceId, bool byRow = true, bool fromFile = true, bool isFiltered = true);
    }
}