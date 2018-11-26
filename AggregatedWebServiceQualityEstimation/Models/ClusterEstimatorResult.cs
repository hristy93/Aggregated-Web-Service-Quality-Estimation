using Newtonsoft.Json;

namespace AggregatedWebServiceQualityEstimation.Models
{
    public class ClusterEstimatorResult
    {
        public double DensestClusterCenterPotential { get; set; }
        public double DensestClusterDensity { get; set; }
        public double DensestClusterEstimation { get; set; }
    }
}