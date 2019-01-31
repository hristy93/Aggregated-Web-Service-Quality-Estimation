using System.Collections.Generic;

namespace AggregatedWebServiceQualityEstimation.Utils.Interfaces
{
    public interface ITestDataPrepocessor
    {
        IList<string[]> CleanUpMetricsData(string metricsData);
        IList<string[]> TransformMetricsData(string metricsData, string webServiceId, bool byRow = true, bool fromFile = true, bool isFiltered = true);
        IList<string[]> PreprocessMetricsData(string metricsData, string webServiceId, bool byRow = true, bool fromFile = true, bool isFiltered = true);
        void SaveUsedMetrics(Dictionary<string, bool> metricsInfo);
    }
}