﻿using AggregatedWebServiceQualityEstimation.Estimators.Interfaces;
using AggregatedWebServiceQualityEstimation.Models;
using AggregatedWebServiceQualityEstimation.Utils.Interfaces;
using MathNet.Numerics;
using MathNet.Numerics.LinearAlgebra;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;

namespace AggregatedWebServiceQualityEstimation.Estimators
{
    public class ClusterEstimator : IClusterEstimator, IMetricsData
    {
        private IList<double> _clustersCentersPotentials;
        private IList<IList<double>> _clustersCenters;
        private IList<double> _clustersDensities;
        private IList<double> _clustersSpreads;

        public IList<string[]> MetricsData { get; set; }

        private Vector<double> _densestClusterCenter;
        private IList<double> _potentials;
        private Dictionary<IList<double>, double> _clusterDensitiesCandidates;
        private Dictionary<(IList<double> firstVector, IList<double> secondVector), double> _vectorsDistances;
        private double _radius;
        private double _densestClusterPotential;
        private int _metricsCount;

        private ITestDataIOManager _loadTestDataIOManager;
        private ITestDataPrepocessor _loadTestDataPreprocessor;
        private readonly CultureInfo _cultureInfo = new CultureInfo("en");
        private readonly double _epsilon = Math.Pow(10, -4);
        private readonly double _lowerEpsilon = 0.15;
        private readonly double _uppperEpsilon = 0.5;
        private readonly double _initialRadius = 0.5;

        public ClusterEstimator(ITestDataIOManager loadTestDataIOManager, ITestDataPrepocessor loadTestDataPreprocessor)
        {
            _loadTestDataIOManager = loadTestDataIOManager;
            _loadTestDataPreprocessor = loadTestDataPreprocessor;
            _clusterDensitiesCandidates = new Dictionary<IList<double>, double>();
            _vectorsDistances = new Dictionary<(IList<double> firstVector, IList<double> secondVector), double>();
            _clustersCentersPotentials = new List<double>();
            _clustersDensities = new List<double>();
            _clustersCenters = new List<IList<double>>();
            _clustersSpreads = new List<double>();
        }

        public void GetMetricsData(string webServiceId, bool fromFile, bool byRow)
        {
            var initialMetricsData = _loadTestDataIOManager.ReadTestData(webServiceId, fromFile);
            MetricsData = _loadTestDataPreprocessor.PreprocessMetricsData(initialMetricsData, webServiceId, byRow, fromFile);
            _metricsCount = MetricsData.Count;
        }

        public IList<ClusterEstimation> FindClusterEstimatorResult()
        {
            FindDensestCluster();
            FindClustersDensities();
            var clusterEstimatorResult = new List<ClusterEstimation>();

            for (int i = 0; i < _clustersCenters.Count; i++)
            {
                var clusterEstimation = new ClusterEstimation()
                {
                    Center = _clustersCenters[i],
                    Potential = _clustersCentersPotentials[i],
                    Density = _clustersDensities[i],
                    Spread = _clustersSpreads[i]
                };

                clusterEstimatorResult.Add(clusterEstimation);
            }

            return clusterEstimatorResult;
        }

        private void FindDensestCluster()
        {
            try
            {
                _potentials = new List<double>();
                Vector<double> initialFirstVector = null;
                Vector<double> firstVector;
                Vector<double> initialSecondVector = null;
                Vector<double> secondVector;
                double potentialSum;
                double distanceSum;
                double distance;
                double clusterCandidateDensity;
                int maxPotentialIndex;
                _radius = _initialRadius;

                foreach (var firstMetrics in MetricsData)
                {
                    potentialSum = 0;
                    distanceSum = 0;

                    if (!firstMetrics.All(s => s == string.Empty))
                    {
                        firstVector = Vector<double>.Build.DenseOfEnumerable(firstMetrics.Skip(2)
                            .Select(x => Double.Parse(x, _cultureInfo)));

                        initialFirstVector = firstVector.Clone();
                        firstVector = firstVector.Normalize(2);

                        foreach (var secondMetrics in MetricsData)
                        {
                            if (firstMetrics != secondMetrics && firstMetrics.Count() > 1 && secondMetrics.Count() > 1)
                            {
                                secondVector = Vector<double>.Build.DenseOfEnumerable(secondMetrics.Skip(2)
                                    .Select(x => Double.Parse(x, _cultureInfo)));

                                initialSecondVector = secondVector.Clone();
                                secondVector = secondVector.Normalize(2);

                                distance = Distance.Euclidean(firstVector, secondVector);
                                potentialSum += Math.Exp(-4 / (_radius * _radius) * distance * distance);
                                distanceSum += distance;
                                _vectorsDistances[(initialFirstVector, initialSecondVector)] = distance;
                            }
                        }

                        _potentials.Add(potentialSum);
                        clusterCandidateDensity = distanceSum / _metricsCount;
                        _clusterDensitiesCandidates[initialFirstVector] = clusterCandidateDensity;
                    }
                }

                _densestClusterPotential = _potentials.Max();
                _clustersCentersPotentials.Add(_densestClusterPotential);

                maxPotentialIndex = _potentials.IndexOf(_densestClusterPotential);
                _densestClusterCenter = Vector<double>.Build.DenseOfEnumerable(MetricsData[maxPotentialIndex].Skip(2)
                    .Select(x => Double.Parse(x, _cultureInfo)));
                _clustersCenters.Add(_densestClusterCenter);

                var pointsInCluster = _vectorsDistances
                    .Where(s => Object.Equals(s.Key.firstVector, _densestClusterCenter) && s.Value.CompareTo(_radius, _epsilon) < 0)
                    .Select(t => t.Key.secondVector);
                var numberOfPointInCluseter = pointsInCluster.Count();

                numberOfPointInCluseter++;
                _clustersSpreads.Add((double) numberOfPointInCluseter / _metricsCount);                

                FindOtherClusters();
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        private void FindOtherClusters()
        {
            try
            {
                IList<double> newPotentials = new List<double>();
                var newClustersCandidates = new Dictionary<Vector<double>, IList<Vector<double>>>();
                Vector<double> firstVector;
                Vector<double> secondVector;
                _radius = _radius * 1.5;
                double potentialSum;
                double distance;
                double gaussianComponent;
                string[] firstMetrics;
                var densestClusterPotential = _potentials.Max();

                for (int i = 0; i < MetricsData.Count; i++)
                {
                    firstMetrics = MetricsData[i];

                    if (firstMetrics.Count() > 1 && _densestClusterCenter.Count() > 1)
                    {
                        firstVector = Vector<double>.Build.DenseOfEnumerable(firstMetrics.Skip(2)
                            .Select(x => Double.Parse(x, _cultureInfo)));

                        firstVector = firstVector.Normalize(2);

                        secondVector = _densestClusterCenter;
                        secondVector = secondVector.Normalize(2);

                        distance = Distance.Euclidean(firstVector, secondVector);
                        gaussianComponent = Math.Exp(-4 / (_radius * _radius) * distance * distance);
                        potentialSum = _potentials[i] - densestClusterPotential * gaussianComponent;

                        newPotentials.Add(potentialSum);
                    }
                }

                CheckClusterCenter(newPotentials);
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        private void FindClustersDensities()
        {
            try
            {
                foreach (var clusterCenter in _clustersCenters)
                {
                    var clusterDensisty = _clusterDensitiesCandidates[clusterCenter];
                    _clustersDensities.Add(clusterDensisty);
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        private void CheckClusterCenter(IList<double> newPotentials)
        {
            var newDensestClusterCenterPotential = newPotentials.Max();
            int maxPotentialIndex = newPotentials.IndexOf(newDensestClusterCenterPotential);
            var newClusterCenter = Vector<double>.Build.DenseOfEnumerable(MetricsData[maxPotentialIndex].Skip(2)
                .Select(x => Double.Parse(x, _cultureInfo)));

            if (newDensestClusterCenterPotential.CompareTo((_densestClusterPotential * _uppperEpsilon), _epsilon) > 0)
            {
                AddOtherClustersData(newPotentials, newDensestClusterCenterPotential, newClusterCenter);
                _potentials = newPotentials;

                //Find other clusters
                FindOtherClusters();
            }
            else if (newDensestClusterCenterPotential.CompareTo((_densestClusterPotential * _lowerEpsilon), _epsilon) < 0)
            {
                return;
            }
            else
            {
                var distanceToClosestCluster = _clustersCenters
                    .Select(c => Distance.Euclidean(Vector<double>.Build.DenseOfEnumerable(c), newClusterCenter))
                    .Min();
                if ((distanceToClosestCluster / _initialRadius)
                    + (newDensestClusterCenterPotential / _densestClusterPotential) >= 1)
                {
                    AddOtherClustersData(newPotentials, newDensestClusterCenterPotential, newClusterCenter);
                    _potentials = newPotentials;

                    //Find other clusters
                    FindOtherClusters();
                }
                else
                {
                    newPotentials.RemoveAt(maxPotentialIndex);

                    //Retest with the next max potential for cluster center
                    CheckClusterCenter(newPotentials);
                }
            }
        }

        private void AddOtherClustersData(IList<double> newPotentials, double newDensestClusterCenterPotential,
            Vector<double> newClusterCenter)
        {
            _clustersCenters.Add(newClusterCenter);
            _clustersCentersPotentials.Add(newDensestClusterCenterPotential);
            _densestClusterCenter = newClusterCenter;

            var numberOfPointsInCluster = _vectorsDistances
                .Where(s => Object.Equals(s.Key.firstVector, _densestClusterCenter) && s.Value.CompareTo(_radius, _epsilon) < 0)
                .Count();

            // Add the cluster center
            numberOfPointsInCluster++;
            _clustersSpreads.Add((double)numberOfPointsInCluster / _metricsCount);
        }
    }
}
