using AggregatedWebServiceQualityEstimation.Estimators.Interfaces;
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
    }
}
