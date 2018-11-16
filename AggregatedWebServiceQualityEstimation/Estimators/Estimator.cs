using AggregatedWebServiceQualityEstimation.Utils;
using AggregatedWebServiceQualityEstimation.Utils.Interfaces;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AggregatedWebServiceQualityEstimation.Estimators
{
    public class Estimator
    {
        private ITestDataManager _loadTestDataManager;

        protected IList<String[]> MetricsData { get; private set; }

        public Estimator(IConfiguration configuration)
        {
            _loadTestDataManager = new LoadTestDataManager(configuration);
        }

        protected void GetMetricsData()
        {
            var fileOutput = _loadTestDataManager.ReadTestData();
            var fileLines = fileOutput.Split(Environment.NewLine);
            MetricsData = fileLines.Select(x => x.Split(',')).Skip(1).ToList();
        }
    }
}
