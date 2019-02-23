using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Threading.Tasks;

namespace AggregatedWebServiceQualityEstimation.Models
{
    public class ApdexScoreEstimatorResult
    {
        public IEnumerable<ApdexScoreEstimation> ApdexScoreEstimations { get; set; }
        public double AverageApdexScoreEstimation { get; set; }
        public string ApdexScoreEstimationRating { get; set; }
        public double InitialApdexScoreLimit { get; set; }

        [ExcludeFromCodeCoverage]
        public override bool Equals(object obj)
        {
            var result = obj as ApdexScoreEstimatorResult;
            return result != null &&
                   Enumerable.SequenceEqual(ApdexScoreEstimations, result.ApdexScoreEstimations) &&
                   AverageApdexScoreEstimation == result.AverageApdexScoreEstimation &&
                   ApdexScoreEstimationRating == result.ApdexScoreEstimationRating &&
                   InitialApdexScoreLimit == result.InitialApdexScoreLimit;
        }

        [ExcludeFromCodeCoverage]
        public override int GetHashCode()
        {
            return HashCode.Combine(ApdexScoreEstimations, AverageApdexScoreEstimation, ApdexScoreEstimationRating, InitialApdexScoreLimit);
        }
    }
}
