using AggregatedWebServiceQualityEstimation.Utils;
using AggregatedWebServiceQualityEstimation.Utils.Interfaces;
using MathNet.Numerics.LinearAlgebra;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;

namespace AggregatedWebServiceQualityEstimation.Estimators
{
    public class Estimator
    {
        private ITestDataManager _loadTestDataManager;

        public IList<String[]> MetricsData { get; protected set; }

        public Estimator(ITestDataManager loadTestDataManager)
        {
            _loadTestDataManager = loadTestDataManager;
        }

        protected void GetMetricsData(bool byRow = true, bool fromFile = true, bool isFiltered = true)
        {
            var fileOutput = _loadTestDataManager.ReadTestData(fromFile);
            var fileLines = fileOutput.Split(Environment.NewLine);
            var fileLinesTransformed = fileLines.Select(x => x.Split(','));
            var metricsUsed = LoadTestDataManager.MetricsUsed;

            if (byRow)
            {
                if (isFiltered && metricsUsed.Count != 0)
                {
                    var metricsNames = fileLinesTransformed.ToList()[0];
                    var metricsIndexes = metricsNames
                        .Where(item => item.StartsWith("Interval") || metricsUsed[item])
                        .Select(item => metricsNames.ToList().IndexOf(item));
                    var filteredMetricsData = fileLinesTransformed
                        .Select(metricsInfo => metricsInfo
                        .Where(item => metricsIndexes.Contains(metricsInfo.ToList().IndexOf(item))).ToArray())
                        .ToList();
                    MetricsData = filteredMetricsData.Skip(1).ToList();
                }
                else
                {
                    MetricsData = fileLinesTransformed.Skip(1).ToList();
                }
            }
            else
            {
                MetricsData = fileLinesTransformed
                    .SelectMany(inner => inner.Select((item, index) => new { item, index }))
                    .GroupBy(i => i.index, i => i.item)
                    .Select(g => g.ToArray())
                    .ToList();

                if (isFiltered && metricsUsed != null)
                {
                    var filteredMetricsData = MetricsData
                        .Where(metric => metric[0].StartsWith("Interval") || metricsUsed[metric[0]])
                        .ToList();
                    MetricsData = filteredMetricsData;
                } 
            }
        }
    }
}
