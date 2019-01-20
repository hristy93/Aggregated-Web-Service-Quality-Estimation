using System.Collections.Generic;

namespace AggregatedWebServiceQualityEstimation.Estimators.Interfaces
{
    public interface IClusterEstimator
    {
        IList<double> ClustersCentersPotentials { get; }
        IList<IList<double>> ClustersCenters { get; }
        IList<double> ClustersDensities { get; }
        IList<double> ClustersSpreads { get; }
        //double DensestClusterEstimation { get; }

        void FindDensestClusterCenter();
        void FindClustersDensities();
    }
}