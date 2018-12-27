using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AggregatedWebServiceQualityEstimation.Models
{
    public class ApdexScoreEstimatorResult
    {
        [JsonProperty(PropertyName = "IntervalStartTime")]
        public string IntervalStartTime { get; set; }

        [JsonProperty(PropertyName = "IntervalEndTime")]
        public string IntervalEndTime { get; set; }

        [JsonProperty(PropertyName = "ApdexScore")]
        public double ApdexScore { get; set; }
    }
}
