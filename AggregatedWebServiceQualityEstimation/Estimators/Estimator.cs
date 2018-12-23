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

        public Estimator(IConfiguration configuration)
        {
            _loadTestDataManager = new LoadTestDataManager(configuration);
        }

        protected void GetMetricsData(bool byRow = true, bool fromFile = true)
        {
            var fileOutput = _loadTestDataManager.ReadTestData(fromFile);
            var fileLines = fileOutput.Split(Environment.NewLine);
            var fileLinesTransformed = fileLines.Select(x => x.Split(','));
            if (byRow)
            {
                MetricsData = fileLinesTransformed.Skip(1).ToList();
            }
            else
            {
                MetricsData = fileLinesTransformed
                    .SelectMany(inner => inner.Select((item, index) => new { item, index }))
                    .GroupBy(i => i.index, i => i.item)
                    .Select(g => g.ToArray())
                    .ToList();
            }
        }
    }
}
