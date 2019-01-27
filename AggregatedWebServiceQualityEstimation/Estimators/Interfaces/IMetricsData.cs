using System.Collections.Generic;

namespace AggregatedWebServiceQualityEstimation.Estimators.Interfaces
{
    public interface IMetricsData
    {
        void GetMetricsData(string webServiceId, bool fromFile = false, bool byRow = false);

        IList<string[]> MetricsData { get; set; }
    }
}