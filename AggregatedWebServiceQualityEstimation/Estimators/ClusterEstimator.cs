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
                Vector<double> firstVector;
                Vector<double> secondVector;
                double radius = 0.5;
                double potentialSum;
                double distance;
                int maxPotentialIndex;

                foreach (var firstMetrics in MetricsData)
                {
                    potentialSum = 0;

                    foreach (var secondMetrics in MetricsData)
                    {
                        if (firstMetrics[0] != secondMetrics[0] && firstMetrics.Count() > 1 && secondMetrics.Count() > 1)
                        {
                            firstVector = Vector<double>.Build.DenseOfEnumerable(firstMetrics.Skip(2)
                                .Select(x => Double.Parse(x.Replace('.', ','))));
                                //.Select(x => Math.Round(x, 3)));
                            firstVector = firstVector.Normalize(2);

                            secondVector = Vector<double>.Build.DenseOfEnumerable(secondMetrics.Skip(2)
                                .Select(x => Double.Parse(x.Replace('.', ','))));
                                //.Select(x => Math.Round(x, 3)));
                            secondVector = secondVector.Normalize(2);

                            distance = Distance.Euclidean(firstVector, secondVector);
                            potentialSum += Math.Exp(-4 / (radius * radius) * distance * distance);
                        }
                    }

                    potentials.Add(potentialSum);
                }

                DensestClusterCenterPotential = potentials.Max();
                maxPotentialIndex = potentials.IndexOf(DensestClusterCenterPotential);
                _clusterCenter = Vector<double>.Build.DenseOfEnumerable(MetricsData[maxPotentialIndex].Skip(2)
                    .Select(x => Double.Parse(x.Replace('.', ','))));
                    //.Select(x => Math.Round(x, 3)));
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
                Vector<double> firstMetricsVector;
                Vector<double> secondMetricsVector;
                double distanceSum = 0;
                double distance;

                foreach (var metrics in MetricsData)
                {
                    if (metrics[0] != _clusterCenter[0].ToString() && metrics.Count() > 1)
                    {
                        firstMetricsVector = Vector<double>.Build.DenseOfEnumerable(metrics.Skip(2)
                            .Select(x => Double.Parse(x.Replace('.', ','))));
                            //.Select(x => Math.Round(x, 3)));

                        firstMetricsVector = firstMetricsVector.Normalize(2);
                        secondMetricsVector = _clusterCenter.Normalize(2);

                        distance = Distance.Manhattan(firstMetricsVector, secondMetricsVector);
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
