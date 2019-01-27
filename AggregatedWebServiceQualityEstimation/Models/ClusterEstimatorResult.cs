using Newtonsoft.Json;
using System;

namespace AggregatedWebServiceQualityEstimation.Models
{
    public class ClusterEstimatorResult
    {
        public double DensestClusterCenterPotential { get; set; }
        public double DensestClusterDensity { get; set; }
        public double DensestClusterEstimation { get; set; }

        public override bool Equals(object obj)
        {
            var result = obj as ClusterEstimatorResult;
            return result != null &&
                   DensestClusterCenterPotential == result.DensestClusterCenterPotential &&
                   DensestClusterDensity == result.DensestClusterDensity &&
                   DensestClusterEstimation == result.DensestClusterEstimation;
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(DensestClusterCenterPotential, DensestClusterDensity, DensestClusterEstimation);
        }
    }
}