using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AggregatedWebServiceQualityEstimation.Models
{
    public class StatisticalEstimatorResult
    {
        public string MetricName { get; set; }
        public double Min { get; set; }
        public double LowerQuartile { get; set; }
        public double Median { get; set; }
        public double UpperQuartile { get; set; }
        public double Max { get; set; }
        public double Mean { get; set; }
        public double Variance { get; set; }
        public double Percentile95 { get; set; }
        public double Percentile99 { get; set; }
        public double PercentageAbovePercentile95 { get; set; }
        public double PercentageAbovePercentile99 { get; set; }
    }
}
