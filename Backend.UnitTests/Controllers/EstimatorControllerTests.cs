using AggregatedWebServiceQualityEstimation.Controllers;
using AggregatedWebServiceQualityEstimation.Utils.Interfaces;
using AggregatedWebServiceQualityEstimation.Estimators.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Moq;
using Xunit;
using AggregatedWebServiceQualityEstimation.Models;
using System.Collections.Generic;
using System;

namespace Backend.UnitTests.Controllers
{
    public class EstimatorControllerTest
    {
        private Mock<ITestDataIOManager> _loadTestDataManager;
        private Mock<IMetricsData> _metricsDataManager;
        private Mock<IApdexScoreEstimator> _apdexScoreEstimator;
        private Mock<IClusterEstimator> _clusterEstimator;
        private Mock<IFuzzyLogicEstimator> _fuzzyLogicEstimator;
        private Mock<IStatisticalEstimator> _statisticalEstimator;

        public EstimatorControllerTest()
        {
            _loadTestDataManager = new Mock<ITestDataIOManager>();
            _metricsDataManager = new Mock<IMetricsData>();
            _apdexScoreEstimator = new Mock<IApdexScoreEstimator>();
            _clusterEstimator = new Mock<IClusterEstimator>();
            _fuzzyLogicEstimator = new Mock<IFuzzyLogicEstimator>();
            _statisticalEstimator = new Mock<IStatisticalEstimator>();
        }

        [Fact]
        public void GetApdexScoreResult_Success()
        {
            const string webServiceId = "first";
            const double apdexScoreLimit = 0.05;
            const bool byRow = false;
            const bool fromFile = true;
            ApdexScoreEstimatorResult expectedResult = new ApdexScoreEstimatorResult()
            {
                ApdexScoreEstimations = new List<ApdexScoreEstimation>()
                {
                    new ApdexScoreEstimation() {
                        IntervalStartTime = "15:04:41",
                        IntervalEndTime = "15:04:46",
                        ApdexScore = 0.95
                    }
                },
                AverageApdexScoreEstimation = 0.95,
                ApdexScoreEstimationRating = "Excellent",
                InitialApdexScoreLimit = 0.545
            };

            _metricsDataManager.Setup(metricsDataManager => metricsDataManager.GetMetricsData(webServiceId, fromFile, byRow));
            _apdexScoreEstimator.Setup(apdexScoreEstimator => apdexScoreEstimator.FindApdexScoreEstimatorResult(apdexScoreLimit, fromFile, webServiceId))
                .Returns(expectedResult);

            var estimatorController = new EstimatorController(_loadTestDataManager.Object, _apdexScoreEstimator.Object,
                _clusterEstimator.Object, _fuzzyLogicEstimator.Object, _statisticalEstimator.Object);

            var actualResult = estimatorController.GetApdexScoreResult(apdexScoreLimit, webServiceId);
            var okResult = Assert.IsType<OkObjectResult>(actualResult);
            var returnValue = Assert.IsType<ApdexScoreEstimatorResult>(okResult.Value);
            Assert.Equal(expectedResult, returnValue);
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
        public void GetApdexScoreResult_Failure_MissingWebServiceId()
        {
            const string webServiceId = "first";
            const double apdexScoreLimit = 0.05;

            var estimatorController = new EstimatorController(_loadTestDataManager.Object, _apdexScoreEstimator.Object,
                _clusterEstimator.Object, _fuzzyLogicEstimator.Object, _statisticalEstimator.Object);
            estimatorController.ModelState.AddModelError("webServiceId", "missing webServiceId");

            var result = estimatorController.GetApdexScoreResult(apdexScoreLimit, webServiceId);
            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public void GetApdexScoreResult_Failure_ThrowsException()
        {
            const string webServiceId = "first";
            const double apdexScoreLimit = 0.05;
            const bool byRow = false;
            const bool fromFile = true;

            _metricsDataManager.Setup(metricsDataManager => metricsDataManager.GetMetricsData(webServiceId, fromFile, byRow));
            _apdexScoreEstimator.Setup(apdexScoreEstimator => apdexScoreEstimator.FindApdexScoreEstimatorResult(apdexScoreLimit, fromFile, webServiceId))
                .Throws(new Exception());

            var estimatorController = new EstimatorController(_loadTestDataManager.Object, _apdexScoreEstimator.Object,
                _clusterEstimator.Object, _fuzzyLogicEstimator.Object, _statisticalEstimator.Object);

            Assert.Throws<Exception>(() => estimatorController.GetApdexScoreResult(apdexScoreLimit, webServiceId));
        }

        [Fact]
        public void GetClusterEstimatorResult_MoreThanOneMetric_Success()
        {
            const string webServiceId = "first";
            const bool byRow = false;
            const bool fromFile = true;
            const double densestClusterDensity = 0.03;
            const double densestClusterCenterPotential = 0.90;
            const double densestClusterSpread = 0.95;

            List<double> densestClusterCenter = new List<double>() { 0.8, 34.5, 0.32 };
            List<string[]> metrics = new List<string[]>()
            {
                new string[]
                {
                    "15:00:10",
                    "15:00:15",
                    "30.5",
                    "0"
                }
            };

           var expectedResult = new List<ClusterEstimation>()
            {
                new ClusterEstimation()
                {
                    Potential = densestClusterCenterPotential,
                    Density =  densestClusterDensity,
                    Center = densestClusterCenter,
                    Spread = densestClusterSpread
                }
            };

            _metricsDataManager.Setup(metricsDataManager => metricsDataManager.GetMetricsData(webServiceId, fromFile, byRow));
            _clusterEstimator.Setup(clusterEstimator => clusterEstimator.FindClusterEstimatorResult()).Returns(expectedResult);
            _clusterEstimator.As<IMetricsData>().Setup(metricsData => metricsData.MetricsData).Returns(metrics);

            var estimatorController = new EstimatorController(_loadTestDataManager.Object, _apdexScoreEstimator.Object,
                _clusterEstimator.Object, _fuzzyLogicEstimator.Object, _statisticalEstimator.Object);

            var actualResult = estimatorController.GetClusterEstimatorResult(webServiceId);
            var okResult = Assert.IsType<OkObjectResult>(actualResult);
            var returnValue = Assert.IsType<List<ClusterEstimation>> (okResult.Value);
            Assert.Equal(expectedResult, returnValue);
        }

        [Fact]
        public void GetClusterEstimatorResult_OneMetric_Success()
        {
            const string webServiceId = "first";
            const bool byRow = false;
            const bool fromFile = true;
            const double densestClusterDensity = 0.03;
            const double densestClusterCenterPotential = 0.90;
            const double densestClusterSpread = 0.95;

            List<double> densestClusterCenter = new List<double>() { 0.8, 34.5, 0.32 };
            List<string[]> metrics = new List<string[]>()
            {
                new string[]
                {
                    "15:00:10",
                    "15:00:15",
                    "30.5"
                }
            };

            var expectedResult = new List<ClusterEstimation>();
            var inputData = new List<ClusterEstimation>()
            {
                new ClusterEstimation()
                {
                    Potential = densestClusterCenterPotential,
                    Density = densestClusterDensity,
                    Center = densestClusterCenter,
                    Spread = densestClusterSpread
                }
            };

            _metricsDataManager.Setup(metricsDataManager => metricsDataManager.GetMetricsData(webServiceId, fromFile, byRow));
            _clusterEstimator.As<IMetricsData>().Setup(metricsData => metricsData.MetricsData).Returns(metrics);

            var estimatorController = new EstimatorController(_loadTestDataManager.Object, _apdexScoreEstimator.Object,
                _clusterEstimator.Object, _fuzzyLogicEstimator.Object, _statisticalEstimator.Object);

            var actualResult = estimatorController.GetClusterEstimatorResult(webServiceId);
            var okResult = Assert.IsType<OkObjectResult>(actualResult);
            var returnValue = Assert.IsType<List<ClusterEstimation>>(okResult.Value);
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
        public void GetClusterEstimatorResult_Failure_MissingWebServiceId()
        {
            const string webServiceId = "first";

            var estimatorController = new EstimatorController(_loadTestDataManager.Object, _apdexScoreEstimator.Object,
                _clusterEstimator.Object, _fuzzyLogicEstimator.Object, _statisticalEstimator.Object);
            estimatorController.ModelState.AddModelError("webServiceId", "missing webServiceId");

            var result = estimatorController.GetClusterEstimatorResult(webServiceId);
            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public void GetClusterEstimatorResult_Failure_ThrowsException()
        {
            const string webServiceId = "first";

            _clusterEstimator.As<IMetricsData>()
                .Setup(metricsData => metricsData.MetricsData)
                .Throws(new Exception());

            var estimatorController = new EstimatorController(_loadTestDataManager.Object, _apdexScoreEstimator.Object,
                _clusterEstimator.Object, _fuzzyLogicEstimator.Object, _statisticalEstimator.Object);

            Assert.Throws<Exception>(() => estimatorController.GetClusterEstimatorResult(webServiceId));
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
        public void GetFuzzyLogicEstimatorResult_Failure_ThrowsException()
        {
            const string webServiceId = "first";
            const bool byRow = false;
            const bool fromFile = false;


            _metricsDataManager.Setup(metricsDataManager => metricsDataManager.GetMetricsData(webServiceId, fromFile, byRow));
            _fuzzyLogicEstimator.Setup(fuzzyLogicEstimator => fuzzyLogicEstimator.GetAggregatedQualityMembershipFunction());
            _fuzzyLogicEstimator
                .Setup(fuzzyLogicEstimator => fuzzyLogicEstimator.AggregatedQualityMembershipFunction)
                .Throws(new Exception());

            var estimatorController = new EstimatorController(_loadTestDataManager.Object, _apdexScoreEstimator.Object,
                _clusterEstimator.Object, _fuzzyLogicEstimator.Object, _statisticalEstimator.Object);

            Assert.Throws<Exception>(() => estimatorController.GetFuzzyLogicEstimatorResult(webServiceId));
        }

        [Fact]
        public void GetFuzzyLogicEstimatorResult_Failure_MissingWebServiceId()
        {
            const string webServiceId = "first";

            var estimatorController = new EstimatorController(_loadTestDataManager.Object, _apdexScoreEstimator.Object,
                _clusterEstimator.Object, _fuzzyLogicEstimator.Object, _statisticalEstimator.Object);
            estimatorController.ModelState.AddModelError("webServiceId", "missing webServiceId");

            var result = estimatorController.GetFuzzyLogicEstimatorResult(webServiceId);
            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public void GetStatisticalEstimatorResult_Success()
        {
            const string webServiceId = "first";
            const bool byRow = false;
            const bool fromFile = false;
            List<StatisticalEstimation> expectedResult = new List<StatisticalEstimation>()
            {
               new StatisticalEstimation()
               {
                   MetricName = "test",
                   Min = 0,
                   Max = 50,
                   Median = 25,
                   Mean = 25,
                   Variance = 0,
                   LowerQuartile = 15,
                   UpperQuartile = 35,
                   Percentile95 = 45,
                   Percentile99 = 50,
                   PercentageAbovePercentile95 = 0.2,
                   PercentageAbovePercentile99 = 0.5
               }
            };

            _metricsDataManager.Setup(metricsDataManager => metricsDataManager.GetMetricsData(webServiceId, fromFile, byRow));
            _statisticalEstimator.Setup(statisticalEstimator => statisticalEstimator.FindStatisticalEstimatorResult()).Returns(expectedResult);

            var estimatorController = new EstimatorController(_loadTestDataManager.Object, _apdexScoreEstimator.Object,
                _clusterEstimator.Object, _fuzzyLogicEstimator.Object, _statisticalEstimator.Object);

            var actualResult = estimatorController.GetStatisticalEstimatorResult(webServiceId);
            var okResult = Assert.IsType<OkObjectResult>(actualResult);
            var returnValue = Assert.IsType<List<StatisticalEstimation>>(okResult.Value);
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

        [Fact]
        public void GetStatisticalEstimatorResult_Failure_MissingWebServiceId()
        {
            const string webServiceId = null;

            var estimatorController = new EstimatorController(_loadTestDataManager.Object, _apdexScoreEstimator.Object,
                _clusterEstimator.Object, _fuzzyLogicEstimator.Object, _statisticalEstimator.Object);
            estimatorController.ModelState.AddModelError("webServiceId", "missing webServiceId");

            var result = estimatorController.GetStatisticalEstimatorResult(webServiceId);
            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public void GetStatisticalEstimatorResult_Failure_ThrowsException()
        {
            const string webServiceId = "first";
            const bool byRow = false;
            const bool fromFile = false;

            _metricsDataManager.Setup(metricsDataManager => metricsDataManager.GetMetricsData(webServiceId, fromFile, byRow));
            _statisticalEstimator
                .Setup(statisticalEstimator => statisticalEstimator.FindStatisticalEstimatorResult())
                .Throws(new Exception());

            var estimatorController = new EstimatorController(_loadTestDataManager.Object, _apdexScoreEstimator.Object,
                _clusterEstimator.Object, _fuzzyLogicEstimator.Object, _statisticalEstimator.Object);

            Assert.Throws<Exception>(() => estimatorController.GetStatisticalEstimatorResult(webServiceId));
        }
    }
}
