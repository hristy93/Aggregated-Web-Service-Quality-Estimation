using AggregatedWebServiceQualityEstimation.Estimators;
using AggregatedWebServiceQualityEstimation.Estimators.Interfaces;
using AggregatedWebServiceQualityEstimation.Models;
using AggregatedWebServiceQualityEstimation.Utils.Interfaces;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using Xunit;

namespace Backend.UnitTests.Estimators
{
    public class StatisticalEstimatorTests
    {
        private Mock<ITestDataIOManager> _loadTestDataManager;
        private Mock<ITestDataPrepocessor> _loadTestDataPreprocessor;
        private Mock<IMetricsData> _metricsDataManager;
        private IList<string[]> _metricsData = new List<string[]>()
        {
            new string[] { "IntervalStartTime", "15:55:38", "15:55:43", "15:55:48", "15:55:53", "15:55:58" },
            new string[] { "IntervalEndTime", "15:55:43", "15:55:48", "15:55:53", "15:55:58", "15:56:03" },
            new string[] { "ResponseTime", "0.9735", "0.6745715", "0.6522857", "0.6421428", "0.7731667" },
            new string[] { "SuccessfulRequestsPerSecond", "0.8", "1.4", "1.4", "1.4", "1.2" },
            new string[] { "FailedRequestsPerSecond", "0", "0", "0", "0", "0"},
            new string[] { "SentKilobytesPerSecond", "3.025", "3.025", "3.025", "3.025", "3.025"},
        };

        public StatisticalEstimatorTests()
        {
            _loadTestDataPreprocessor = new Mock<ITestDataPrepocessor>();
            _metricsDataManager = new Mock<IMetricsData>();
            _loadTestDataManager = new Mock<ITestDataIOManager>();
        }

        [Fact]
        public void GetMetricsData_Success()
        {
            const string webServiceId = "first";
            const bool byRow = false;
            const bool fromFile = true;
            const string filePath = "";

            _loadTestDataManager
                .Setup(testDataManager => testDataManager.ReadTestData(webServiceId, fromFile, filePath))
                .Returns(_metricsData.ToString());
            _loadTestDataPreprocessor
                .Setup(loadTestDataPreprocessor => loadTestDataPreprocessor.PreprocessMetricsData(_metricsData.ToString(), webServiceId, byRow, fromFile, true))
                .Returns(_metricsData);

            var statisticalEstimator = new StatisticalEstimator(_loadTestDataManager.Object, _loadTestDataPreprocessor.Object);
            statisticalEstimator.GetMetricsData(webServiceId, fromFile, byRow);
            var result = statisticalEstimator.MetricsData;

            Assert.IsType<List<string[]>>(result);
            Assert.Equal(_metricsData.Skip(2).ToList(), result);
        }

        [Fact]
        public void GetStatisticalData_Success_FromFile()
        {
            const string webServiceId = "first";
            const bool byRow = false;
            const bool fromFile = true;
            const string filePath = "";
            IEnumerable<StatisticalEstimation> expectedResult = new List<StatisticalEstimation>()
            {
                new StatisticalEstimation()
                {
                    MetricName = "ResponseTime",
                    Min = 0.6421428,
                    LowerQuartile = 0.64890473333333332,
                    Median = 0.6745715,
                    UpperQuartile = 0.83994446666666667,
                    Max = 0.9735,
                    Mean = 0.74313334,
                    Variance = 0.019280977379922987,
                    Percentile95 = 0.9735,
                    Percentile99= 0.9735,
                    PercentageAbovePercentile95 = 0.2,
                    PercentageAbovePercentile99 = 0.2
                },
                new StatisticalEstimation()
                {
                    MetricName = "SuccessfulRequestsPerSecond",
                    Min = 0.8,
                    LowerQuartile = 1.0666666666666667,
                    Median = 1.4,
                    UpperQuartile = 1.4,
                    Max = 1.4,
                    Mean = 1.24,
                    Variance =  0.0679999999999999,
                    Percentile95 = 1.4,
                    Percentile99 = 1.4,
                    PercentageAbovePercentile95 = 0.6,
                    PercentageAbovePercentile99 = 0.6
                },
                new StatisticalEstimation()
                {
                    MetricName = "FailedRequestsPerSecond",
                    Min = 0,
                    LowerQuartile = 0,
                    Median = 0,
                    UpperQuartile = 0,
                    Max = 0,
                    Mean = 0,
                    Variance = 0,
                    Percentile95 = 0,
                    Percentile99 = 0,
                    PercentageAbovePercentile95 = 1,
                    PercentageAbovePercentile99 = 1
                },
                new StatisticalEstimation()
                {   
                    MetricName = "SentKilobytesPerSecond",
                    Min = 3.025,
                    LowerQuartile = 3.025,
                    Median = 3.025,
                    UpperQuartile = 3.025,
                    Max = 3.025,
                    Mean = 3.025,
                    Variance = 0,
                    Percentile95 = 3.025,
                    Percentile99 = 3.025,
                    PercentageAbovePercentile95 = 1,
                    PercentageAbovePercentile99 = 1
                }
            };

            _loadTestDataManager
               .Setup(testDataManager => testDataManager.ReadTestData(webServiceId, fromFile, filePath))
               .Returns(_metricsData.ToString());
            _loadTestDataPreprocessor
                .Setup(loadTestDataPreprocessor => loadTestDataPreprocessor.PreprocessMetricsData(_metricsData.ToString(), webServiceId, byRow, fromFile, true))
                .Returns(_metricsData);

            var statisticalEstimator = new StatisticalEstimator(_loadTestDataManager.Object, _loadTestDataPreprocessor.Object);
            statisticalEstimator.GetMetricsData(webServiceId, fromFile, byRow);
            var result = statisticalEstimator.GetStatisticalData();

            Assert.IsAssignableFrom<IEnumerable<StatisticalEstimation>>(result);
            Assert.Equal<IEnumerable<StatisticalEstimation>>(expectedResult, result);
        }

        [Fact]
        public void GetStatisticalData_Success_NotFromFile()
        {
            const string webServiceId = "first";
            const bool byRow = false;
            const bool fromFile = false;
            const string filePath = "";
            IEnumerable<StatisticalEstimation> expectedResult = new List<StatisticalEstimation>()
            {
                new StatisticalEstimation()
                {
                    MetricName = "ResponseTime",
                    Min = 0.6421428,
                    LowerQuartile = 0.64890473333333332,
                    Median = 0.6745715,
                    UpperQuartile = 0.83994446666666667,
                    Max = 0.9735,
                    Mean = 0.74313334,
                    Variance = 0.019280977379922987,
                    Percentile95 = 0.9735,
                    Percentile99= 0.9735,
                    PercentageAbovePercentile95 = 0.2,
                    PercentageAbovePercentile99 = 0.2
                },
                new StatisticalEstimation()
                {
                    MetricName = "SuccessfulRequestsPerSecond",
                    Min = 0.8,
                    LowerQuartile = 1.0666666666666667,
                    Median = 1.4,
                    UpperQuartile = 1.4,
                    Max = 1.4,
                    Mean = 1.24,
                    Variance =  0.0679999999999999,
                    Percentile95 = 1.4,
                    Percentile99 = 1.4,
                    PercentageAbovePercentile95 = 0.6,
                    PercentageAbovePercentile99 = 0.6
                },
                new StatisticalEstimation()
                {
                    MetricName = "FailedRequestsPerSecond",
                    Min = 0,
                    LowerQuartile = 0,
                    Median = 0,
                    UpperQuartile = 0,
                    Max = 0,
                    Mean = 0,
                    Variance = 0,
                    Percentile95 = 0,
                    Percentile99 = 0,
                    PercentageAbovePercentile95 = 1,
                    PercentageAbovePercentile99 = 1
                },
                new StatisticalEstimation()
                {
                    MetricName = "SentKilobytesPerSecond",
                    Min = 3.025,
                    LowerQuartile = 3.025,
                    Median = 3.025,
                    UpperQuartile = 3.025,
                    Max = 3.025,
                    Mean = 3.025,
                    Variance = 0,
                    Percentile95 = 3.025,
                    Percentile99 = 3.025,
                    PercentageAbovePercentile95 = 1,
                    PercentageAbovePercentile99 = 1
                }
            };

            _loadTestDataManager
               .Setup(testDataManager => testDataManager.ReadTestData(webServiceId, fromFile, filePath))
               .Returns(_metricsData.ToString());
            _loadTestDataPreprocessor
                .Setup(loadTestDataPreprocessor => loadTestDataPreprocessor.PreprocessMetricsData(_metricsData.ToString(), webServiceId, byRow, fromFile, true))
                .Returns(_metricsData);

            var statisticalEstimator = new StatisticalEstimator(_loadTestDataManager.Object, _loadTestDataPreprocessor.Object);
            statisticalEstimator.GetMetricsData(webServiceId, fromFile, byRow);
            var result = statisticalEstimator.GetStatisticalData();

            Assert.IsAssignableFrom<IEnumerable<StatisticalEstimation>>(result);
            Assert.Equal<IEnumerable<StatisticalEstimation>>(expectedResult, result);
        }
    }
}
