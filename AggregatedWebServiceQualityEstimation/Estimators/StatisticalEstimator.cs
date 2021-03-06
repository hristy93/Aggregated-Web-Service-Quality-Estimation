﻿using AggregatedWebServiceQualityEstimation.Estimators.Interfaces;
using AggregatedWebServiceQualityEstimation.Models;
using AggregatedWebServiceQualityEstimation.Utils.Interfaces;
using MathNet.Numerics.LinearAlgebra;
using MathNet.Numerics.Statistics;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;

namespace AggregatedWebServiceQualityEstimation.Estimators
{
    public class StatisticalEstimator : IStatisticalEstimator, IMetricsData
    {
        private readonly CultureInfo _cultureInfo = new CultureInfo("en");
        private ITestDataIOManager _loadTestDataIOManager;
        private ITestDataPrepocessor _loadTestDataPreprocessor;

        public IList<StatisticalEstimation> StatisticalData { get; private set; }
        public IList<string[]> MetricsData { get; set; }

        public StatisticalEstimator(ITestDataIOManager loadTestDataIOManager, ITestDataPrepocessor loadTestDataPreprocessor) 
        {
            StatisticalData = new List<StatisticalEstimation>();
            _loadTestDataIOManager = loadTestDataIOManager;
            _loadTestDataPreprocessor = loadTestDataPreprocessor;
        }

        public void GetMetricsData(string webServiceId, bool fromFile, bool byRow)
        {
            var initialMetricsData = _loadTestDataIOManager.ReadTestData(webServiceId, fromFile);
            var preprocessedMetricsData = _loadTestDataPreprocessor.PreprocessMetricsData(initialMetricsData, webServiceId, byRow, fromFile);
            MetricsData = preprocessedMetricsData?.Skip(2).ToList();
        }

        public IEnumerable<StatisticalEstimation> FindStatisticalEstimatorResult()
        {
            try
            {
                Vector<double> metricsVector;
                double[] fiveNumberSummary;
                double mean;
                double variance;
                StatisticalEstimation statisticalEstimation;
                IList<StatisticalEstimation> statisticalEstimatorResult = new List<StatisticalEstimation>();

                foreach (var metrics in MetricsData)
                {
                    metricsVector = Vector<double>.Build.DenseOfEnumerable(metrics
                        .Skip(1)
                        .Select(x => Double.Parse(x, _cultureInfo)));

                    fiveNumberSummary = Statistics.FiveNumberSummary(metricsVector.ToArray());
                    mean = Statistics.Mean(metricsVector);
                    variance = Statistics.Variance(metricsVector);

                    statisticalEstimation = new StatisticalEstimation()
                    {
                        MetricName = metrics.Take(1).ToList()[0],
                        Min = fiveNumberSummary[0],
                        LowerQuartile = fiveNumberSummary[1],
                        Median = fiveNumberSummary[2],
                        UpperQuartile = fiveNumberSummary[3],
                        Max = fiveNumberSummary[4],
                        Mean = mean,
                        Variance = variance
                    };

                    statisticalEstimatorResult.Add(statisticalEstimation);
                }

                return statisticalEstimatorResult;
            }
            catch (Exception ex)
            {
                throw;
            }
        }
    }
}
