using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Threading.Tasks;

namespace AggregatedWebServiceQualityEstimation.Models
{
    public class ApdexScoreEstimation
    {
        [JsonProperty(PropertyName = "IntervalStartTime")]
        public string IntervalStartTime { get; set; }

        [JsonProperty(PropertyName = "IntervalEndTime")]
        public string IntervalEndTime { get; set; }

        [JsonProperty(PropertyName = "ApdexScore")]
        public double ApdexScore { get; set; }

        [ExcludeFromCodeCoverage]
        public override bool Equals(object obj)
        {
            var estimation = obj as ApdexScoreEstimation;
            return estimation != null &&
                   IntervalStartTime == estimation.IntervalStartTime &&
                   IntervalEndTime == estimation.IntervalEndTime &&
                   ApdexScore == estimation.ApdexScore;
        }

        [ExcludeFromCodeCoverage]
        public override int GetHashCode()
        {
            return HashCode.Combine(IntervalStartTime, IntervalEndTime, ApdexScore);
        }
    }
}
