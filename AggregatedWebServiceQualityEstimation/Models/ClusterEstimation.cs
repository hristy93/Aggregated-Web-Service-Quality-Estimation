using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;

namespace AggregatedWebServiceQualityEstimation.Models
{
    public class ClusterEstimation
    {
        public double Potential { get; set; }
        public IList<double> Center { get; set; }
        public double Density { get; set; }
        public double Spread { get; set; }

        [ExcludeFromCodeCoverage]
        public override bool Equals(object obj)
        {
            var result = obj as ClusterEstimation;
            return result != null &&
                   Potential == result.Potential &&
                   Enumerable.SequenceEqual(Center, result.Center) &&
                   Density == result.Density &&
                   Spread == result.Spread;
        }

        [ExcludeFromCodeCoverage]
        public override int GetHashCode()
        {
            return HashCode.Combine(Potential, Center, Density, Spread);
        }
    }
}