using System.Collections.Generic;
using AggregatedWebServiceQualityEstimation.Models;

namespace AggregatedWebServiceQualityEstimation.Estimators.Interfaces
{
    public interface IApdexScoreEstimator
    {
        IEnumerable<ApdexScoreEstimatorResult> FindApdexScore(double apdexScoreLimit, bool fromFile, string webServiceId);
    }
}