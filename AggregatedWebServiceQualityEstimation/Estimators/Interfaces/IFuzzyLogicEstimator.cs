using System.Collections.Generic;

namespace AggregatedWebServiceQualityEstimation.Estimators.Interfaces
{
    public interface IFuzzyLogicEstimator
    {
        void GetAggregatedQualityMembershipFunction();
        IList<double> AggregatedQualityMembershipFunction { get; set; }
    }
}