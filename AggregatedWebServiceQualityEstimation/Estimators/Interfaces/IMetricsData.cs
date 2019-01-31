using System.Collections.Generic;

namespace AggregatedWebServiceQualityEstimation.Estimators.Interfaces
{
    public interface IMetricsData
    {
        void GetMetricsData(string webServiceId, bool fromFile, bool byRow);

        IList<string[]> MetricsData { get; set; }
    }
}