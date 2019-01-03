namespace AggregatedWebServiceQualityEstimation.Estimators.Interfaces
{
    public interface IClusterEstimator
    {
        double DensestClusterCenterPotential { get; }
        double DensestClusterDensity { get; }
        double DensestClusterEstimation { get; }

        void FindClusterCenter();
        void FindClusterDensity();
    }
}