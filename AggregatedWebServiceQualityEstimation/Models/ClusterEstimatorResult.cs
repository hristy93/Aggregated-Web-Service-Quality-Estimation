using Newtonsoft.Json;
using System;
using System.Collections.Generic;

namespace AggregatedWebServiceQualityEstimation.Models
{
    public class ClusterEstimatorResult
    {
        public double Potential { get; set; }
        public IList<double> Center { get; set; }
        public double Density { get; set; }
        public double Spread { get; set; }

        public override bool Equals(object obj)
        {
            var result = obj as ClusterEstimatorResult;
            return result != null &&
                   Potential == result.Potential &&
                   EqualityComparer<IList<double>>.Default.Equals(Center, result.Center) &&
                   Density == result.Density &&
                   Spread == result.Spread;
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(Potential, Center, Density, Spread);
        }

        //public IEnumerable<double> ClustersCentersPotentials { get; set; }
        //public IEnumerable<List<double>> ClustersCenters { get; set; }
        //public IEnumerable<double> ClustersDensities { get; set; }
        //public IEnumerable<double> DensestClusterEstimation { get; set; }
    }
}