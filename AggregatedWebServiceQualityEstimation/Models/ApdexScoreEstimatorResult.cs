using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AggregatedWebServiceQualityEstimation.Models
{
    public class ApdexScoreEstimatorResult
    {
        public IEnumerable<ApdexScoreEstimation> ApdexScoreEstimations { get; set; }
        public double AverageApdexScoreEstimation { get; set; }
        public string ApdexScoreEstimationRating { get; set; }
    }
}
