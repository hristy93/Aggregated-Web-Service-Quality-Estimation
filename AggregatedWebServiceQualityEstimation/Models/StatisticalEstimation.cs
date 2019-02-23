using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Threading.Tasks;

namespace AggregatedWebServiceQualityEstimation.Models
{
    public class StatisticalEstimation
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

        [ExcludeFromCodeCoverage]
        public override bool Equals(object obj)
        {
            var estimation = obj as StatisticalEstimation;
            return estimation != null &&
                   MetricName == estimation.MetricName &&
                   Min == estimation.Min &&
                   LowerQuartile == estimation.LowerQuartile &&
                   Median == estimation.Median &&
                   UpperQuartile == estimation.UpperQuartile &&
                   Max == estimation.Max &&
                   Mean == estimation.Mean &&
                   Variance == estimation.Variance &&
                   Percentile95 == estimation.Percentile95 &&
                   Percentile99 == estimation.Percentile99 &&
                   PercentageAbovePercentile95 == estimation.PercentageAbovePercentile95 &&
                   PercentageAbovePercentile99 == estimation.PercentageAbovePercentile99;
        }

        [ExcludeFromCodeCoverage]
        public override int GetHashCode()
        {
            var hash = new HashCode();
            hash.Add(MetricName);
            hash.Add(Min);
            hash.Add(LowerQuartile);
            hash.Add(Median);
            hash.Add(UpperQuartile);
            hash.Add(Max);
            hash.Add(Mean);
            hash.Add(Variance);
            hash.Add(Percentile95);
            hash.Add(Percentile99);
            hash.Add(PercentageAbovePercentile95);
            hash.Add(PercentageAbovePercentile99);
            return hash.ToHashCode();
        }
    }
}
