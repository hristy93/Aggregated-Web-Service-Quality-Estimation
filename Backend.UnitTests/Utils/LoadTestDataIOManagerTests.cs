using AggregatedWebServiceQualityEstimation.Utils;
using AggregatedWebServiceQualityEstimation.Utils.Interfaces;
using Microsoft.Extensions.Configuration;
using Moq;
using System;
using System.Collections.Generic;
using System.Text;
using Xunit;

namespace Backend.UnitTests.Utils
{
    public class LoadTestDataIOManagerTests
    {
        private IConfiguration _configuration;
        private readonly string _filePath = "../../../../AggregatedWebServiceQualityEstimation/loadTestResults-test.csv";
        private string _metricsDataInFileFromat = "IntervalStartTime,IntervalEndTime,ResponseTime,SuccessfulRequestsPerSecond,FailedRequestsPerSecond," +
       "ReceivedKilobytesPerSecond\r\n15:55:38,15:55:43,0.9735,0.8,0,3.025\r\n15:55:43,15:55:48,0.6745715,1.4,0,3.025\r\n15:55:48,15:55:53,0.6522857," +
       "1.4,0,3.025\r\n15:55:53,15:55:58,0.6421428,1.4,0,3.025\r\n15:55:58,15:56:03,0.7731667,1.2,0,3.025\r\n";

        public LoadTestDataIOManagerTests()
        {
            IConfigurationBuilder configurationBuilder = new ConfigurationBuilder();
            _configuration = configurationBuilder.Build();
        }

        [Fact]
        public void ReadTestData_FromFile_Success()
        {
            const string webServiceId = "first";
            const bool fromFile = true;

            var _loadTestDataIOManager = new LoadTestDataIOManager(_configuration);

            var actualResult = _loadTestDataIOManager.ReadTestData(webServiceId, fromFile, _filePath);
            Assert.Equal(_metricsDataInFileFromat, actualResult);
        }

        [Fact(Skip = "Not mocked method from the same class")]
        public void ReadTestData_NotFromFile_Success()
        {
            const string webServiceId = "first";
            const bool fromFile = false;

            var mockedLoadTestDataIOManager = new Mock<ITestDataIOManager>();
            mockedLoadTestDataIOManager
                .Setup(loadTestDataIOManager => loadTestDataIOManager.GetTestDataFromDatabase(webServiceId))
                .Returns(_metricsDataInFileFromat);
                
            var _loadTestDataIOManager = new LoadTestDataIOManager(_configuration);

            var actualResult = _loadTestDataIOManager.ReadTestData(webServiceId, fromFile, _filePath);
            Assert.Equal(_metricsDataInFileFromat, actualResult);
        }
    }
}
