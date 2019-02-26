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
    public class ClusterEstimatorTests
    {
        private Mock<ITestDataIOManager> _loadTestDataManager;
        private Mock<ITestDataPrepocessor> _loadTestDataPreprocessor;
        private Mock<IMetricsData> _metricsDataManager;
        private IList<string[]> _oneClusterMetricsData = new List<string[]>()
        {
            new string[] { "15:55:38", "15:55:43", "0.9735", "0.8", "0", "3.025"},
            new string[] { "15:55:43", "15:55:48", "0.6745715", "1.4", "0", "3.025" },
            new string[] { "15:55:48", "15:55:53", "0.6522857", "1.4", "0", "3.025" },
            new string[] { "15:55:53", "15:55:58", "0.6421428", "1.4", "0", "3.025" },
            new string[] { "15:55:58", "15:56:03", "0.7731667", "1.2", "0", "3.025" },
        };
        private IList<string[]> _twoClustersMetricsData = new List<string[]>()
        {
            new string[] { "18:00:42", "18:00:47", "0.00775", "8", "0", "1.28276" },
            new string[] { "18:00:47", "18:00:52", "0.00685", "8", "0", "1.25411" },
            new string[] { "18:00:52", "18:00:57", "0.01617949", "7.8", "0", "1.38623" },
            new string[] { "18:00:57", "18:01:02", "0.0080", "8", "0", "1.29132" },
            new string[] { "18:01:37", "18:01:42", "33.99356098", "18.2", "0", "16.855"},
            new string[] { "18:01:42", "18:01:47", "30.99323077", "22.8", "0", "14.07118" },
            new string[] { "18:01:47", "18:01:52", "31.994375", "18", "0", "15.43064" },
            new string[] { "18:01:52", "18:01:57", "32.99287805", "18.2", "0", "14.79406" },
        };

        public ClusterEstimatorTests()
        {
            _loadTestDataPreprocessor = new Mock<ITestDataPrepocessor>();
            _metricsDataManager = new Mock<IMetricsData>();
            _loadTestDataManager = new Mock<ITestDataIOManager>();
        }

        [Fact]
        public void GetMetricsData_Success_OneCluster()
        {
            const string webServiceId = "first";
            const bool byRow = true;
            const bool fromFile = true;
            const string filePath = "";

            _loadTestDataManager
                .Setup(testDataManager => testDataManager.ReadTestData(webServiceId, fromFile, filePath))
                .Returns(_oneClusterMetricsData.ToString());
            _loadTestDataPreprocessor
                .Setup(loadTestDataPreprocessor => loadTestDataPreprocessor.PreprocessMetricsData(_oneClusterMetricsData.ToString(), webServiceId, byRow, fromFile, true))
                .Returns(_oneClusterMetricsData);

            var clusterEstimator = new ClusterEstimator(_loadTestDataManager.Object, _loadTestDataPreprocessor.Object);
            clusterEstimator.GetMetricsData(webServiceId, fromFile, byRow);
            var result = clusterEstimator.MetricsData;

            Assert.IsType<List<string[]>>(result);
            Assert.Equal(_oneClusterMetricsData, result);
        }

        [Fact]
        public void GetMetricsData_Success_TwoClusters()
        {
            const string webServiceId = "first";
            const bool byRow = true;
            const bool fromFile = true;
            const string filePath = "";

            _loadTestDataManager
                .Setup(testDataManager => testDataManager.ReadTestData(webServiceId, fromFile, filePath))
                .Returns(_twoClustersMetricsData.ToString());
            _loadTestDataPreprocessor
                .Setup(loadTestDataPreprocessor => loadTestDataPreprocessor.PreprocessMetricsData(_oneClusterMetricsData.ToString(), webServiceId, byRow, fromFile, true))
                .Returns(_twoClustersMetricsData);

            var clusterEstimator = new ClusterEstimator(_loadTestDataManager.Object, _loadTestDataPreprocessor.Object);
            clusterEstimator.GetMetricsData(webServiceId, fromFile, byRow);
            var result = clusterEstimator.MetricsData;

            Assert.IsType<List<string[]>>(result);
            Assert.Equal(_twoClustersMetricsData, result);
        }

        [Fact]
        public void FindClusterEstimatorResult_Success_OneCluster()
        {
            const string webServiceId = "first";
            const bool byRow = true;
            const bool fromFile = true;
            const string filePath = "";
            var expectedResult = new List<ClusterEstimation>()
            {
                new ClusterEstimation()
                {
                    Center = new List<double>()
                    {
                        0.7731667, 1.2, 0, 3.025
                    },
                    Density = 0.066917659056544315,
                    Potential = 3.5435429288924456,
                    Spread = 1
                }
            };


            _loadTestDataManager
                .Setup(testDataManager => testDataManager.ReadTestData(webServiceId, fromFile, filePath))
                .Returns(_oneClusterMetricsData.ToString());
            _loadTestDataPreprocessor
                .Setup(loadTestDataPreprocessor => loadTestDataPreprocessor.PreprocessMetricsData(_oneClusterMetricsData.ToString(), webServiceId, byRow, fromFile, true))
                .Returns(_oneClusterMetricsData);

            var clusterEstimator = new ClusterEstimator(_loadTestDataManager.Object, _loadTestDataPreprocessor.Object);
            clusterEstimator.GetMetricsData(webServiceId, fromFile, byRow);

            var result = clusterEstimator.FindClusterEstimatorResult();

            Assert.IsType<List<ClusterEstimation>>(result);
            Assert.Equal(expectedResult, result);
        }

        [Fact]
        public void FindClusterEstimatorResult_Success_TwoClusters()
        {
            const string webServiceId = "first";
            const bool byRow = true;
            const bool fromFile = true;
            const string filePath = "";
            var expectedResult = new List<ClusterEstimation>()
            {
                new ClusterEstimation()
                {
                    Center = new List<double>()
                    {
                         0.008, 8, 0, 1.29132
                    },
                    Density = 0.48838259233869064,
                    Potential = 2.9956271341667708,
                    Spread = 0.5
                },
                  new ClusterEstimation()
                {
                    Center = new List<double>()
                    {
                          31.994375, 18, 0, 15.43064
                    },
                    Density = 0.51655634484497237,
                    Potential = 2.7640230334912923,
                    Spread = 0.5
                }
            };


            _loadTestDataManager
                .Setup(testDataManager => testDataManager.ReadTestData(webServiceId, fromFile, filePath))
                .Returns(_twoClustersMetricsData.ToString());
            _loadTestDataPreprocessor
                .Setup(loadTestDataPreprocessor => loadTestDataPreprocessor.PreprocessMetricsData(_oneClusterMetricsData.ToString(), webServiceId, byRow, fromFile, true))
                .Returns(_twoClustersMetricsData);

            var clusterEstimator = new ClusterEstimator(_loadTestDataManager.Object, _loadTestDataPreprocessor.Object);
            clusterEstimator.GetMetricsData(webServiceId, fromFile, byRow);

            var result = clusterEstimator.FindClusterEstimatorResult();

            Assert.IsType<List<ClusterEstimation>>(result);
            Assert.Equal(expectedResult, result);
        }
    }
}
