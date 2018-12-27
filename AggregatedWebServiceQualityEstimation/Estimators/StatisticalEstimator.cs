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
    public class StatisticalEstimator : Estimator
    {
        public IList<StatisticalEstimatorResult> statisticalData { get; private set; }

        public StatisticalEstimator(ITestDataManager loadTestDataManager) : base(loadTestDataManager)
        {
            statisticalData = new List<StatisticalEstimatorResult>();
            GetMetricsData(byRow: false);
            MetricsData = MetricsData.Skip(2).ToList();
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

                    statisticalData.Add(statisticalEstimatorResult);
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
