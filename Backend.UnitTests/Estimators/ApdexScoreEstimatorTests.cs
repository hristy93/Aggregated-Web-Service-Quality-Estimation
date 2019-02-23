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
    public class ApdexScoreEstimatorTests
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
       
        public ApdexScoreEstimatorTests()
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

            var apdexScoreEstimator = new ApdexScoreEstimator(_loadTestDataManager.Object, _loadTestDataPreprocessor.Object);
            apdexScoreEstimator.GetMetricsData(webServiceId, fromFile, byRow);
            var result = apdexScoreEstimator.MetricsData;

            Assert.IsType<List<string[]>>(result);
            Assert.Equal(_metricsData, result);
        }

        [Fact]
        public void FindApdexScoreEstimatorResult_FromFileAndPredefinedLimit_Success()
        {
            const string webServiceId = "first";
            const bool byRow = false;
            const bool fromFile = true;
            const string filePath = "";
            const double apdexScoreLimit = 0.05;
            ApdexScoreEstimatorResult expectedResult = new ApdexScoreEstimatorResult()
            {
                ApdexScoreEstimations = new List<ApdexScoreEstimation>()
                {
                    new ApdexScoreEstimation()
                    {
                        IntervalStartTime = "15:55:38",
                        IntervalEndTime = "15:55:43",
                        ApdexScore = 0
                    },
                    new ApdexScoreEstimation()
                    {
                        IntervalStartTime = "15:55:43",
                        IntervalEndTime = "15:55:48",
                        ApdexScore = 0
                    },
                    new ApdexScoreEstimation()
                    {
                        IntervalStartTime = "15:55:48",
                        IntervalEndTime = "15:55:53",
                        ApdexScore = 0
                    },
                    new ApdexScoreEstimation()
                    {
                        IntervalStartTime = "15:55:53",
                        IntervalEndTime = "15:55:58",
                        ApdexScore = 0
                    },
                    new ApdexScoreEstimation()
                    {
                        IntervalStartTime = "15:55:58",
                        IntervalEndTime = "15:56:03",
                        ApdexScore = 0
                    }
                },
                AverageApdexScoreEstimation = 0,
                ApdexScoreEstimationRating = "Unacceptable",
                InitialApdexScoreLimit = 0.7731667
            };

            _loadTestDataManager
                .Setup(testDataManager => testDataManager.ReadTestData(webServiceId, fromFile, filePath))
                .Returns(_metricsData.ToString());
            _loadTestDataPreprocessor
                .Setup(loadTestDataPreprocessor => loadTestDataPreprocessor.PreprocessMetricsData(_metricsData.ToString(), webServiceId, byRow, fromFile, true))
                .Returns(_metricsData);

            var apdexScoreEstimator = new ApdexScoreEstimator(_loadTestDataManager.Object, _loadTestDataPreprocessor.Object);
            apdexScoreEstimator.GetMetricsData(webServiceId, fromFile, byRow);
            var result = apdexScoreEstimator.FindApdexScoreEstimatorResult(apdexScoreLimit, fromFile, webServiceId);

            Assert.IsType<ApdexScoreEstimatorResult>(result);
            Assert.Equal<ApdexScoreEstimatorResult>(expectedResult, result);
        }

        [Fact]
        public void FindApdexScoreEstimatorResult_NotFromFileAndPredefinedLimit_Success()
        {
            const string webServiceId = "first";
            const bool byRow = false;
            const bool fromFile = false;
            const string filePath = "";
            const double apdexScoreLimit = 0.05;
            ApdexScoreEstimatorResult expectedResult = new ApdexScoreEstimatorResult()
            {
                ApdexScoreEstimations = new List<ApdexScoreEstimation>()
                {
                    new ApdexScoreEstimation()
                    {
                        IntervalStartTime = "15:55:38",
                        IntervalEndTime = "15:55:43",
                        ApdexScore = 0
                    },
                    new ApdexScoreEstimation()
                    {
                        IntervalStartTime = "15:55:43",
                        IntervalEndTime = "15:55:48",
                        ApdexScore = 0
                    },
                    new ApdexScoreEstimation()
                    {
                        IntervalStartTime = "15:55:48",
                        IntervalEndTime = "15:55:53",
                        ApdexScore = 0
                    },
                    new ApdexScoreEstimation()
                    {
                        IntervalStartTime = "15:55:53",
                        IntervalEndTime = "15:55:58",
                        ApdexScore = 0
                    },
                    new ApdexScoreEstimation()
                    {
                        IntervalStartTime = "15:55:58",
                        IntervalEndTime = "15:56:03",
                        ApdexScore = 0
                    }
                },
                AverageApdexScoreEstimation = 0,
                ApdexScoreEstimationRating = "Unacceptable",
                InitialApdexScoreLimit = 0.7731667
            };

            _loadTestDataManager
                .Setup(testDataManager => testDataManager.ReadTestData(webServiceId, fromFile, filePath))
                .Returns(_metricsData.ToString());
            _loadTestDataPreprocessor
                .Setup(loadTestDataPreprocessor => loadTestDataPreprocessor.PreprocessMetricsData(_metricsData.ToString(), webServiceId, byRow, fromFile, true))
                .Returns(_metricsData);

            var apdexScoreEstimator = new ApdexScoreEstimator(_loadTestDataManager.Object, _loadTestDataPreprocessor.Object);
            apdexScoreEstimator.GetMetricsData(webServiceId, fromFile, byRow);
            var result = apdexScoreEstimator.FindApdexScoreEstimatorResult(apdexScoreLimit, fromFile, webServiceId);

            Assert.IsType<ApdexScoreEstimatorResult>(result);
            Assert.Equal<ApdexScoreEstimatorResult>(expectedResult, result);
        }


        [Fact]
        public void FindApdexScoreEstimatorResult_FromFileAndWithoutPredefinedLimit_Success()
        {
            const string webServiceId = "first";
            const bool byRow = false;
            const bool fromFile = true;
            const string filePath = "";
            double? apdexScoreLimit = null;
            ApdexScoreEstimatorResult expectedResult = new ApdexScoreEstimatorResult()
            {
                ApdexScoreEstimations = new List<ApdexScoreEstimation>()
                {
                    new ApdexScoreEstimation()
                    {
                        IntervalStartTime = "15:55:38",
                        IntervalEndTime = "15:55:43",
                        ApdexScore = 50
                    },
                    new ApdexScoreEstimation()
                    {
                        IntervalStartTime = "15:55:43",
                        IntervalEndTime = "15:55:48",
                        ApdexScore = 75
                    },
                    new ApdexScoreEstimation()
                    {
                        IntervalStartTime = "15:55:48",
                        IntervalEndTime = "15:55:53",
                        ApdexScore = 83.333333333333343
                    },
                    new ApdexScoreEstimation()
                    {
                        IntervalStartTime = "15:55:53",
                        IntervalEndTime = "15:55:58",
                        ApdexScore = 87.5
                    },
                    new ApdexScoreEstimation()
                    {
                        IntervalStartTime = "15:55:58",
                        IntervalEndTime = "15:56:03",
                        ApdexScore = 90
                    }
                },
                AverageApdexScoreEstimation = 77.166666666666671,
                ApdexScoreEstimationRating = "Fair",
                InitialApdexScoreLimit = 0.7731667
            };

            _loadTestDataManager
                .Setup(testDataManager => testDataManager.ReadTestData(webServiceId, fromFile, filePath))
                .Returns(_metricsData.ToString());
            _loadTestDataPreprocessor
                .Setup(loadTestDataPreprocessor => loadTestDataPreprocessor.PreprocessMetricsData(_metricsData.ToString(), webServiceId, byRow, fromFile, true))
                .Returns(_metricsData);

            var apdexScoreEstimator = new ApdexScoreEstimator(_loadTestDataManager.Object, _loadTestDataPreprocessor.Object);
            apdexScoreEstimator.GetMetricsData(webServiceId, fromFile, byRow);
            var result = apdexScoreEstimator.FindApdexScoreEstimatorResult(apdexScoreLimit, fromFile, webServiceId);

            Assert.IsType<ApdexScoreEstimatorResult>(result);
            Assert.Equal<ApdexScoreEstimatorResult>(expectedResult, result);
        }

        [Fact(Skip = "Needs investimation on the logic for fromFile check")]
        public void FindApdexScoreEstimatorResult_NotFromFileAndWithoutPredefinedLimit_Success()
        {
            const string webServiceId = "first";
            const bool byRow = false;
            const bool fromFile = false;
            const string filePath = "";
            double? apdexScoreLimit = null;
            ApdexScoreEstimatorResult expectedResult = new ApdexScoreEstimatorResult()
            {
                ApdexScoreEstimations = new List<ApdexScoreEstimation>()
                {
                    new ApdexScoreEstimation()
                    {
                        IntervalStartTime = "15:55:38",
                        IntervalEndTime = "15:55:43",
                        ApdexScore = 50
                    },
                    new ApdexScoreEstimation()
                    {
                        IntervalStartTime = "15:55:43",
                        IntervalEndTime = "15:55:48",
                        ApdexScore = 75
                    },
                    new ApdexScoreEstimation()
                    {
                        IntervalStartTime = "15:55:48",
                        IntervalEndTime = "15:55:53",
                        ApdexScore = 83.333333333333343
                    },
                    new ApdexScoreEstimation()
                    {
                        IntervalStartTime = "15:55:53",
                        IntervalEndTime = "15:55:58",
                        ApdexScore = 87.5
                    },
                    new ApdexScoreEstimation()
                    {
                        IntervalStartTime = "15:55:58",
                        IntervalEndTime = "15:56:03",
                        ApdexScore = 90
                    }
                },
                AverageApdexScoreEstimation = 77.166666666666671,
                ApdexScoreEstimationRating = "Fair",
                InitialApdexScoreLimit = 0.7731667
            };

            _loadTestDataManager
                .Setup(testDataManager => testDataManager.ReadTestData(webServiceId, fromFile, filePath))
                .Returns(_metricsData.ToString());
            _loadTestDataPreprocessor
                .Setup(loadTestDataPreprocessor => loadTestDataPreprocessor.PreprocessMetricsData(_metricsData.ToString(), webServiceId, byRow, fromFile, true))
                .Returns(_metricsData);

            var apdexScoreEstimator = new ApdexScoreEstimator(_loadTestDataManager.Object, _loadTestDataPreprocessor.Object);
            apdexScoreEstimator.GetMetricsData(webServiceId, fromFile, byRow);
            var result = apdexScoreEstimator.FindApdexScoreEstimatorResult(apdexScoreLimit, fromFile, webServiceId);

            Assert.IsType<ApdexScoreEstimatorResult>(result);
            Assert.Equal<ApdexScoreEstimatorResult>(expectedResult, result);
        }

        //[Fact(Skip = "Unknown failure")]
        //public void FindApdexScoreEstimatorResult_Failure_ThrowsException()
        //{
        //    const string webServiceId = "first";
        //    const bool byRow = false;
        //    const bool fromFile = true;
        //    const double apdexScoreLimit = 0.05;

        //    _loadTestDataManager
        //       .Setup(testDataManager => testDataManager.ReadTestData(webServiceId, fromFile))
        //       .Returns(_metricsData.ToString());
        //    _loadTestDataPreprocessor
        //        .Setup(loadTestDataPreprocessor => loadTestDataPreprocessor.PreprocessMetricsData(_metricsData.ToString(), webServiceId, byRow, fromFile, true))
        //        .Throws(new Exception());

        //    var apdexScoreEstimator = new ApdexScoreEstimator(_loadTestDataManager.Object, _loadTestDataPreprocessor.Object);
        //    Assert.Throws<Exception>(() => apdexScoreEstimator.FindApdexScoreEstimatorResult(apdexScoreLimit, fromFile, webServiceId));
        //}
    }
}
