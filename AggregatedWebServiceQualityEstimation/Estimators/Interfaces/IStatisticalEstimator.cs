using System.Collections.Generic;
using AggregatedWebServiceQualityEstimation.Models;

namespace AggregatedWebServiceQualityEstimation.Estimators.Interfaces
{
    public interface IStatisticalEstimator
    {
        IEnumerable<StatisticalEstimation> GetStatisticalData();
    }
}