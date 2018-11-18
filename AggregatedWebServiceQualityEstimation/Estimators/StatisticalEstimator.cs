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
        public IList<IEnumerable<double>> FiveNumberSummaries { get; private set; }

        public StatisticalEstimator(IConfiguration configuration) : base(configuration)
        {
            FiveNumberSummaries = new List<IEnumerable<double>>();
            GetMetricsData(byRow: false);
        }

        public void GetFiveNumberSummaries()
        {
            try
            {
                foreach (var metrics in MetricsData)
                {
                    Vector<double> metricsVector = Vector<double>.Build.DenseOfEnumerable(metrics
                        .Skip(1)
                        .Select(x => Double.Parse(x.Replace('.', ','))));
                        //.Select(x => Math.Round(x, 3)));
                    var distinctValuesCount = metricsVector.Distinct();
                    var fiveNumberSummary = Statistics.FiveNumberSummary(metricsVector.ToArray());
                    FiveNumberSummaries.Add(fiveNumberSummary);
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
