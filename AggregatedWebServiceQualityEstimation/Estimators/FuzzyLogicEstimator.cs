using AggregatedWebServiceQualityEstimation.Utils.Interfaces;
using MathNet.Numerics.LinearAlgebra;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;

namespace AggregatedWebServiceQualityEstimation.Estimators
{
    public class FuzzyLogicEstimator : Estimator
    {
        private readonly IDictionary<string, bool> isGreaterBetter = new Dictionary<string, bool> {
            ["ResponseTime"] = false,
            ["SuccessfulRequestsPerSecond"] = true,
            ["FailedRequestsPerSecond"] = false,
            ["SentKilobytesPerSecond"] = true,
            ["ReceivedKilobytesPerSecond"] = true,
        };

        public IList<double> AggregatedQualityMembershipFunction;

        public FuzzyLogicEstimator(ITestDataManager loadTestDataManager, string webServiceId) : base(loadTestDataManager)
        {
            AggregatedQualityMembershipFunction = new List<double>();
            GetMetricsData(webServiceId, byRow: false);
            MetricsData = MetricsData.Skip(2).ToList();
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
                        .Select(x => double.Parse(x.Replace('.', ',')))
                        .Select(x => Math.Round(x, 3)));

                    columnName = metrics[0];
                    if (isGreaterBetter[columnName])
                    {
                        inverseValue = 0;
                    }
                    else
                    {
                        inverseValue = metrics.Count();
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
                throw ex;
            }
        }
    }
}
