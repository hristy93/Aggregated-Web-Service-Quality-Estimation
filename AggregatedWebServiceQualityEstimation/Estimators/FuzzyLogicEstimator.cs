using AggregatedWebServiceQualityEstimation.Estimators.Interfaces;
using AggregatedWebServiceQualityEstimation.Utils.Interfaces;
using MathNet.Numerics.Distributions;
using MathNet.Numerics.LinearAlgebra;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Globalization;
using System.Linq;

namespace AggregatedWebServiceQualityEstimation.Estimators
{
    [ExcludeFromCodeCoverage]
    public class FuzzyLogicEstimator : IFuzzyLogicEstimator, IMetricsData
    {
        private readonly IDictionary<string, bool> isGreaterBetter = new Dictionary<string, bool> {
            ["ResponseTime"] = false,
            ["SuccessfulRequestsPerSecond"] = true,
            ["FailedRequestsPerSecond"] = false,
            ["ReceivedKilobytesPerSecond"] = true,
        };

        public IList<double> AggregatedQualityMembershipFunction { get; set; }

        private readonly CultureInfo _cultureInfo = new CultureInfo("en");
        private ITestDataIOManager _loadTestDataIOManager;
        private ITestDataPrepocessor _loadTestDataPreprocessor;

        public IList<string[]> MetricsData { get; set; }

        public FuzzyLogicEstimator(ITestDataIOManager loadTestDataIOManager, ITestDataPrepocessor loadTestDataPreprocessor)
        {
            AggregatedQualityMembershipFunction = new List<double>();
            _loadTestDataIOManager = loadTestDataIOManager;
            _loadTestDataPreprocessor = loadTestDataPreprocessor;
        }

        public void GetMetricsData(string webServiceId, bool fromFile, bool byRow)
        {
            var initialMetricsData = _loadTestDataIOManager.ReadTestData(webServiceId, fromFile);
            var preprocessedMetricsData = _loadTestDataPreprocessor.PreprocessMetricsData(initialMetricsData, webServiceId, byRow, fromFile);
            MetricsData = preprocessedMetricsData?.Skip(2).ToList();
        }

        public void GetAggregatedQualityMembershipFunction()
        {
            try
            {
                int distinctValuesCount;
                int index = 0;
                int inverseValue;
                double probability;
                string columnName;
                IEnumerable<int> metricsVectorDistinctGroupCount;

                foreach (var metrics in MetricsData)
                {
                    Vector<double> metricsVector = Vector<double>.Build.DenseOfEnumerable(metrics
                        .Skip(1)
                        .Select(x => double.Parse(x, _cultureInfo)));

                    columnName = metrics[0];
                    if (isGreaterBetter[columnName])
                    {
                        inverseValue = 0;
                    }
                    else
                    {
                        inverseValue = metrics.Count() - 1;
                    }

                    metricsVectorDistinctGroupCount = metricsVector
                        .GroupBy(x => x)
                        .Select(group => Math.Abs(inverseValue - group.Count()))
                        .OrderBy(x => x);
                       
                    probability = (double) metricsVectorDistinctGroupCount.FirstOrDefault() 
                        / metrics.Count();

                    distinctValuesCount = metricsVector.Distinct().Count();
                    AggregatedQualityMembershipFunction.Add(probability);
                    index++;
                }
            }
            catch (Exception ex)
            {
                throw;
            }
        }
    }
}
