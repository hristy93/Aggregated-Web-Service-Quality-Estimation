using System.Collections.Generic;
using AggregatedWebServiceQualityEstimation.Models;

namespace AggregatedWebServiceQualityEstimation.Estimators.Interfaces
{
    public interface IApdexScoreEstimator
    {
        ApdexScoreEstimatorResult FindApdexScoreEstimatorResult(double apdexScoreLimit, bool fromFile, string webServiceId);
    }
}