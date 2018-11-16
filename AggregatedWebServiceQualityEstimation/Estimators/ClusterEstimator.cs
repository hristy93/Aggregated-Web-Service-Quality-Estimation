using AggregatedWebServiceQualityEstimation.Utils;
using AggregatedWebServiceQualityEstimation.Utils.Interfaces;
using MathNet.Numerics;
using MathNet.Numerics.LinearAlgebra;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;

namespace AggregatedWebServiceQualityEstimation.Estimators
{
    public class ClusterEstimator : Estimator
    {
        public double DensestClusterCenterPotential { get; private set; }
        public double DensestClusterDensity { get; private set; }
        public double DensestClusterEstimation => DensestClusterCenterPotential / MetricsData.Count;

        private Vector<double> _clusterCenter;

        public ClusterEstimator(IConfiguration configuration) : base(configuration)
        {
            GetMetricsData();
        }

        public void FindClusterCenter()
        {
            try
            {
                IList<double> potentials = new List<double>();
                const double radius = 0.5;

                foreach (var metrics1 in MetricsData)
                {
                    double potentialSum = 0;
                    foreach (var metrics2 in MetricsData)
                    {
                        if (metrics1[0] != metrics2[0] && metrics1.Count() > 1 && metrics2.Count() > 1)
                        {
                            Vector<double> v1 = Vector<double>.Build.DenseOfEnumerable(metrics1.Skip(2).Select(x => Double.Parse(x.Replace('.', ','))));
                            v1 = v1.Normalize(2);
                            Vector<double> v2 = Vector<double>.Build.DenseOfEnumerable(metrics2.Skip(2).Select(x => Double.Parse(x.Replace('.', ','))));
                            v2 = v2.Normalize(2);
                            double distance = Distance.Euclidean(v1, v2);
                            var partialPotentialSum = Math.Exp(4 / (radius * radius) * distance * distance);
                            potentialSum += 1.0 / partialPotentialSum;
                        }
                    }

                    potentials.Add(potentialSum);
                }

                DensestClusterCenterPotential = potentials.Max();
                var maxPotentialIndex = potentials.IndexOf(DensestClusterCenterPotential);
                _clusterCenter = Vector<double>.Build.DenseOfEnumerable(MetricsData[maxPotentialIndex].Skip(2).Select(x => Double.Parse(x.Replace('.', ','))));
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public void FindClusterDensity()
        {
            try
            {
                double distanceSum = 0;

                foreach (var metrics1 in MetricsData)
                {
                    if (metrics1[0] != _clusterCenter[0].ToString() && metrics1.Count() > 1)
                    {
                        Vector<double> metricsVector1 = Vector<double>.Build.DenseOfEnumerable(metrics1.Skip(2).Select(x => Double.Parse(x.Replace('.', ','))));
                        metricsVector1 = metricsVector1.Normalize(2);
                        Vector<double> metricsVector2 = _clusterCenter.Normalize(2);
                        double distance = Distance.Manhattan(metricsVector1, metricsVector2);
                        distanceSum += distance;
                    }
                }

                DensestClusterDensity = distanceSum / MetricsData.Count;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
