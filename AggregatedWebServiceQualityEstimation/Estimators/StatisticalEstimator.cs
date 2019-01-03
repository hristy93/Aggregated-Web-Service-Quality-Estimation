using AggregatedWebServiceQualityEstimation.Estimators.Interfaces;
using AggregatedWebServiceQualityEstimation.Models;
using AggregatedWebServiceQualityEstimation.Utils.Interfaces;
using MathNet.Numerics.LinearAlgebra;
using MathNet.Numerics.Statistics;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AggregatedWebServiceQualityEstimation.Estimators
{
    public class StatisticalEstimator : IStatisticalEstimator, IMetricsData
    {
        private readonly ITestDataManager _loadTestDataManager;

        public IList<StatisticalEstimatorResult> StatisticalData { get; private set; }
        public IList<string[]> MetricsData { get; set; }

        public StatisticalEstimator(ITestDataManager loadTestDataManager) 
        {
            StatisticalData = new List<StatisticalEstimatorResult>();
            _loadTestDataManager = loadTestDataManager;
        }

        public void GetMetricsData(string webServiceId, bool fromFile, bool byRow)
        {
            MetricsData = _loadTestDataManager.GetMetricsData(webServiceId, byRow: false)?.Skip(2).ToList();
        }

        public void GetFiveNumberSummaries()
        {
            try
            {
                Vector<double> metricsVector;
                double[] fiveNumberSummary;
                double mean;
                double variance;
                StatisticalEstimatorResult statisticalEstimatorResult;
                foreach (var metrics in MetricsData)
                {
                    metricsVector = Vector<double>.Build.DenseOfEnumerable(metrics
                        .Skip(1)
                        .Select(x => Double.Parse(x.Replace('.', ','))));
                        //.Select(x => Math.Round(x, 3)));

                    fiveNumberSummary = Statistics.FiveNumberSummary(metricsVector.ToArray());
                    mean = Statistics.Mean(metricsVector);
                    variance = Statistics.Variance(metricsVector);

                    statisticalEstimatorResult = new StatisticalEstimatorResult()
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

                    StatisticalData.Add(statisticalEstimatorResult);
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
