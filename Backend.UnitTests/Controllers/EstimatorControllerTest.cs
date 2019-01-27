using AggregatedWebServiceQualityEstimation.Controllers;
using AggregatedWebServiceQualityEstimation.Utils.Interfaces;
using AggregatedWebServiceQualityEstimation.Estimators.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Moq;
using Xunit;
using AggregatedWebServiceQualityEstimation.Models;
using System.Collections.Generic;

namespace Backend.UnitTests.Controllers
{
    public class EstimatorControllerTest
    {
        private Mock<ITestDataManager> _loadTestDataManager;
        private Mock<IMetricsData> _metricsDataManager;
        private Mock<IApdexScoreEstimator> _apdexScoreEstimator;
        private Mock<IClusterEstimator> _clusterEstimator;
        private Mock<IFuzzyLogicEstimator> _fuzzyLogicEstimator;
        private Mock<IStatisticalEstimator> _statisticalEstimator;

        public EstimatorControllerTest()
        {
            _loadTestDataManager = new Mock<ITestDataManager>();
            _metricsDataManager = new Mock<IMetricsData>();
            _apdexScoreEstimator = new Mock<IApdexScoreEstimator>();
            _clusterEstimator = new Mock<IClusterEstimator>();
            _fuzzyLogicEstimator = new Mock<IFuzzyLogicEstimator>();
            _statisticalEstimator = new Mock<IStatisticalEstimator>();
        }

        [Fact]
        public void GetApdexScoreResult_Failure_InvalidWebServiceId()
        {
            const string webServiceId = null;
            const double apdexScoreLimit = 0.05;

            var estimatorController = new EstimatorController(_loadTestDataManager.Object, _apdexScoreEstimator.Object,
                _clusterEstimator.Object, _fuzzyLogicEstimator.Object, _statisticalEstimator.Object);

            var result = estimatorController.GetApdexScoreResult(apdexScoreLimit, webServiceId);
            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public void GetApdexScoreResult_Success()
        {
            const string webServiceId = "first";
            const double apdexScoreLimit = 0.05;
            const bool byRow = false;
            const bool fromFile = true;
            List<ApdexScoreEstimatorResult> expectedResult = new List<ApdexScoreEstimatorResult>()
            { 
                new ApdexScoreEstimatorResult()
                {
                    IntervalStartTime = "15:04:41",
                    IntervalEndTime = "15:04:46",
                    ApdexScore = 0.95
                }
            };

            _metricsDataManager.Setup(metricsDataManager => metricsDataManager.GetMetricsData(webServiceId, fromFile, byRow));
            _apdexScoreEstimator.Setup(apdexScoreEstimator => apdexScoreEstimator.FindApdexScore(apdexScoreLimit, fromFile, webServiceId))
                .Returns(expectedResult);

            var estimatorController = new EstimatorController(_loadTestDataManager.Object, _apdexScoreEstimator.Object,
                _clusterEstimator.Object, _fuzzyLogicEstimator.Object, _statisticalEstimator.Object);

            var actualResult = estimatorController.GetApdexScoreResult(apdexScoreLimit, webServiceId);
            var okResult = Assert.IsType<OkObjectResult>(actualResult);
            var returnValue = Assert.IsType<List<ApdexScoreEstimatorResult>>(okResult.Value);
            Assert.Equal(expectedResult, returnValue);
        }

        [Fact]
        public void GetClusterEstimatorResult_Success()
        {
            const string webServiceId = "first";
            const bool byRow = false;
            const bool fromFile = true;
            const double densestClusterDensity = 0.03;
            const double densestClusterEstimation = 0.90;
            const double densestClusterCenterPotential = 0.90;
            var expectedResult = new ClusterEstimatorResult()
            {
                DensestClusterCenterPotential = densestClusterCenterPotential,
                DensestClusterDensity = densestClusterDensity,
                DensestClusterEstimation = densestClusterEstimation 
            };

            _metricsDataManager.Setup(metricsDataManager => metricsDataManager.GetMetricsData(webServiceId, fromFile, byRow));
            _clusterEstimator.Setup(clusterEstimator => clusterEstimator.FindClusterCenter());
            _clusterEstimator.Setup(clusterEstimator => clusterEstimator.FindClusterDensity());
            _clusterEstimator.Setup(clusterEstimator => clusterEstimator.DensestClusterDensity)
                .Returns(densestClusterDensity);
            _clusterEstimator.Setup(clusterEstimator => clusterEstimator.DensestClusterCenterPotential)
               .Returns(densestClusterCenterPotential);
            _clusterEstimator.Setup(clusterEstimator => clusterEstimator.DensestClusterEstimation)
                .Returns(densestClusterEstimation);

            var estimatorController = new EstimatorController(_loadTestDataManager.Object, _apdexScoreEstimator.Object,
                _clusterEstimator.Object, _fuzzyLogicEstimator.Object, _statisticalEstimator.Object);

            var actualResult = estimatorController.GetClusterEstimatorResult(webServiceId);
            var okResult = Assert.IsType<OkObjectResult>(actualResult);
            var returnValue = Assert.IsType<ClusterEstimatorResult> (okResult.Value);
            Assert.Equal(expectedResult, returnValue);
        }

        [Fact]
        public void GetClusterEstimatorResult_Failure_InvalidWebServiceId()
        {
            const string webServiceId = null;

            var estimatorController = new EstimatorController(_loadTestDataManager.Object, _apdexScoreEstimator.Object,
                _clusterEstimator.Object, _fuzzyLogicEstimator.Object, _statisticalEstimator.Object);

            var result = estimatorController.GetClusterEstimatorResult(webServiceId);
            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public void GetFuzzyLogicEstimatorResult_Success()
        {
            const string webServiceId = "first";
            const bool byRow = false;
            const bool fromFile = false;
            IList<double> expectedResult = new List<double>()
            {
               0.4565,
               0.2345
            };

            _metricsDataManager.Setup(metricsDataManager => metricsDataManager.GetMetricsData(webServiceId, fromFile, byRow));
            _fuzzyLogicEstimator.Setup(fuzzyLogicEstimator => fuzzyLogicEstimator.GetAggregatedQualityMembershipFunction());
            _fuzzyLogicEstimator.Setup(fuzzyLogicEstimator => fuzzyLogicEstimator.AggregatedQualityMembershipFunction).Returns(expectedResult);

            var estimatorController = new EstimatorController(_loadTestDataManager.Object, _apdexScoreEstimator.Object,
                _clusterEstimator.Object, _fuzzyLogicEstimator.Object, _statisticalEstimator.Object);

            var actualResult = estimatorController.GetFuzzyLogicEstimatorResult(webServiceId);
            var okResult = Assert.IsType<OkObjectResult>(actualResult);
            var returnValue = Assert.IsType<List<double>>(okResult.Value);
            Assert.Equal(expectedResult, returnValue);
        }

        [Fact]
        public void GetFuzzyLogicEstimatorResult_Failure_InvalidWebServiceId()
        {
            const string webServiceId = null;

            var estimatorController = new EstimatorController(_loadTestDataManager.Object, _apdexScoreEstimator.Object,
                _clusterEstimator.Object, _fuzzyLogicEstimator.Object, _statisticalEstimator.Object);

            var result = estimatorController.GetFuzzyLogicEstimatorResult(webServiceId);
            Assert.IsType<BadRequestObjectResult>(result);
        }


        [Fact]
        public void GetStatisticalEstimatorResult_Success()
        {
            const string webServiceId = "first";
            const bool byRow = false;
            const bool fromFile = false;
            List<StatisticalEstimatorResult> expectedResult = new List<StatisticalEstimatorResult>()
            {
               new StatisticalEstimatorResult()
               {
                   MetricName = "test",
                   Min = 0,
                   Max = 50,
                   Median = 25,
                   Mean = 25,
                   Variance = 0,
                   LowerQuartile = 15,
                   UpperQuartile = 35,
               }
            };

            _metricsDataManager.Setup(metricsDataManager => metricsDataManager.GetMetricsData(webServiceId, fromFile, byRow));
            _statisticalEstimator.Setup(statisticalEstimator => statisticalEstimator.GetStatisticalData());
            _statisticalEstimator.Setup(statisticalEstimator => statisticalEstimator.StatisticalData).Returns(expectedResult);

            var estimatorController = new EstimatorController(_loadTestDataManager.Object, _apdexScoreEstimator.Object,
                _clusterEstimator.Object, _fuzzyLogicEstimator.Object, _statisticalEstimator.Object);

            var actualResult = estimatorController.GetStatisticalEstimatorResult(webServiceId);
            var okResult = Assert.IsType<OkObjectResult>(actualResult);
            var returnValue = Assert.IsType<List<StatisticalEstimatorResult>>(okResult.Value);
            Assert.Equal(expectedResult, returnValue);
        }

        [Fact]
        public void GetStatisticalEstimatorResult_Failure_InvalidWebServiceId()
        {
            const string webServiceId = null;

            var estimatorController = new EstimatorController(_loadTestDataManager.Object, _apdexScoreEstimator.Object,
                _clusterEstimator.Object, _fuzzyLogicEstimator.Object, _statisticalEstimator.Object);

            var result = estimatorController.GetStatisticalEstimatorResult(webServiceId);
            Assert.IsType<BadRequestObjectResult>(result);
        }
    }
}
