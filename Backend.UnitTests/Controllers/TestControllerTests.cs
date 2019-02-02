using AggregatedWebServiceQualityEstimation.Controllers;
using AggregatedWebServiceQualityEstimation.Models;
using AggregatedWebServiceQualityEstimation.Utils.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Internal;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Primitives;
using Moq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using Xunit;

namespace Backend.UnitTests.Controllers
{
    public class TestControllerTests
    {
        private IConfiguration _configuration;
        private Mock<ITestRunner> _loadTestRunner;
        private Mock<ITestDataIOManager> _loadTestDataManager;
        private Mock<ITestDataPrepocessor> _loadTestDataPreprocessor;
        private Mock<ITestModifier> _loadTestModifier;

        public TestControllerTests()
        {
            IConfigurationBuilder configurationBuilder = new ConfigurationBuilder();
            //configurationBuilder.AddJsonFile("AppSettings.json");
            _configuration = configurationBuilder.Build();
            _loadTestRunner = new Mock<ITestRunner>();
            _loadTestDataManager = new Mock<ITestDataIOManager>();
            _loadTestDataPreprocessor = new Mock<ITestDataPrepocessor>();
            _loadTestModifier = new Mock<ITestModifier>();
        }

        [Fact]
        public void CheckTestStatus_ReturnsRunning()
        {
            const string expectedResult = "running";

            _loadTestRunner.Setup(testRunner => testRunner.IsTestRunning()).Returns(true);

            var testController = new TestController(_configuration, _loadTestRunner.Object, _loadTestDataManager.Object,
                _loadTestDataPreprocessor.Object, _loadTestModifier.Object);

            var actualResult = testController.CheckTestStatus();

            var okResult = Assert.IsType<OkObjectResult>(actualResult);
            var returnValue = Assert.IsType<string>(okResult.Value);
            Assert.Equal(expectedResult, returnValue);
        }

        [Fact]
        public void CheckTestStatus_ReturnsStopped()
        {
            const string expectedResult = "stopped";

            _loadTestRunner.Setup(testRunner => testRunner.IsTestRunning()).Returns(false);

            var testController = new TestController(_configuration, _loadTestRunner.Object, _loadTestDataManager.Object,
                 _loadTestDataPreprocessor.Object, _loadTestModifier.Object);

            var actualResult = testController.CheckTestStatus();

            var okResult = Assert.IsType<OkObjectResult>(actualResult);
            var returnValue = Assert.IsType<string>(okResult.Value);
            Assert.Equal(expectedResult, returnValue);
        }

        [Fact]
        public void ReadTestData_ReturnLoadTestData()
        {
            const string expectedValue = "loadTestData";
            const string webServiceId = "first";
            const bool fromFile = true;

            _loadTestDataManager.Setup(testDataManager => testDataManager.ReadTestData(webServiceId, fromFile)).Returns(expectedValue);

            var testController = new TestController(_configuration, _loadTestRunner.Object, _loadTestDataManager.Object,
                  _loadTestDataPreprocessor.Object, _loadTestModifier.Object);

            var actualResult = testController.ReadTestData(fromFile, webServiceId);

            var okResult = Assert.IsType<OkObjectResult>(actualResult);
            var returnValue = Assert.IsType<string>(okResult.Value);
            Assert.Equal(expectedValue, returnValue);
        }

        //[Fact(Skip = "Not needed")]
        //public void ReadTestData_Failure_ThrowsException()
        //{
        //    const string webServiceId = "first";
        //    const bool fromFile = true;

        //    _loadTestDataManager.Setup(testDataManager => testDataManager.ReadTestData(webServiceId, fromFile)).Throws(new Exception());

        //    var testController = new TestController(_configuration, _loadTestRunner.Object, _loadTestDataManager.Object, _loadTestModifier.Object);

        //    Assert.Throws<Exception>(() => testController.ReadTestData(fromFile, webServiceId));
        //}

        [Fact]
        public void ReadTestData_Failure_InvalidWebServiceId()
        {
            const string webServiceId = null;
            const bool fromFile = true;

            var testController = new TestController(_configuration, _loadTestRunner.Object, _loadTestDataManager.Object,
                  _loadTestDataPreprocessor.Object, _loadTestModifier.Object);

            var result = testController.ReadTestData(fromFile, webServiceId);
            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public void WriteTestData_Success()
        {
            const string webServiceId = "first";

            _loadTestDataManager.Setup(testDataManager => testDataManager.WriteTestData(webServiceId));

            var testController = new TestController(_configuration, _loadTestRunner.Object, _loadTestDataManager.Object,
                 _loadTestDataPreprocessor.Object, _loadTestModifier.Object);

            var actualResult = testController.WriteTestData(webServiceId);

            var okResult = Assert.IsType<OkObjectResult>(actualResult);
            var returnValue = Assert.IsType<string>(okResult.Value);
        }

        [Fact]
        public void WriteTestData_Failure_ThrowsException()
        {
            const string webServiceId = "first";

            _loadTestDataManager.Setup(testDataManager => testDataManager.WriteTestData(webServiceId)).Throws(new Exception());

            var testController = new TestController(_configuration, _loadTestRunner.Object, _loadTestDataManager.Object,
                 _loadTestDataPreprocessor.Object, _loadTestModifier.Object);

            Assert.Throws<Exception>(() => testController.WriteTestData(webServiceId));
        }

        [Fact]
        public void CancelTest_Success()
        {
            _loadTestRunner.Setup(testRunner => testRunner.IsTestRunning()).Returns(false);

            var testController = new TestController(_configuration, _loadTestRunner.Object, _loadTestDataManager.Object,
                  _loadTestDataPreprocessor.Object, _loadTestModifier.Object);

            var actualResult = testController.CancelTest();

            var okResult = Assert.IsType<OkObjectResult>(actualResult);
            var returnValue = Assert.IsType<string>(okResult.Value);
        }

        [Fact]
        public void CancelTest_Failure_ThrowsException()
        {
            _loadTestRunner.Setup(testRunner => testRunner.IsTestRunning()).Returns(true);

            var testController = new TestController(_configuration, _loadTestRunner.Object, _loadTestDataManager.Object,
                   _loadTestDataPreprocessor.Object, _loadTestModifier.Object);

            Assert.Throws<Exception>(() => testController.CancelTest());
        }

        [Fact]
        public void StartTest_Success()
        {
            string duration = "00:00:30";
            bool isPostRequest = false;
            List<WebServiceData> webServicesData = new List<WebServiceData>()
            {
                new WebServiceData()
                {
                    WebServiceId = "first",
                    Url = "https://jsonplaceholder.typicode.com/todos/1"
                }
            };

            _loadTestModifier.Setup(testModifier => testModifier.EditUrl(webServicesData[0].Url, isPostRequest, webServicesData[0].WebServiceId));
            _loadTestModifier.Setup(testModifier => testModifier.EditRequestBodyData(webServicesData[0].Body as String, isPostRequest, webServicesData[0].WebServiceId));
            _loadTestModifier.Setup(testModifier => testModifier.EditDuration(duration)).Returns(true);
            _loadTestRunner.Setup(testRunner => testRunner.InitiateTest());

            var testController = new TestController(_configuration, _loadTestRunner.Object, _loadTestDataManager.Object,
                _loadTestDataPreprocessor.Object, _loadTestModifier.Object);

            var result = testController.StartTest(duration, webServicesData);
            var resultValue = Assert.IsType<OkObjectResult>(result);
        }

        [Fact]
        public void StartTest_Failure_InvalidDurationFormat()
        {
            string duration = "00:00:30";
            bool isPostRequest = false;
            List<WebServiceData> webServicesData = new List<WebServiceData>()
            {
                new WebServiceData()
                {
                    WebServiceId = "first",
                    Url = "https://jsonplaceholder.typicode.com/todos/1"
                }
            };

            _loadTestModifier.Setup(testModifier => testModifier.EditRequestBodyData(webServicesData[0].Body as string, isPostRequest, webServicesData[0].WebServiceId));
            _loadTestModifier.Setup(testModifier => testModifier.EditUrl(webServicesData[0].Url, isPostRequest, webServicesData[0].WebServiceId));
            _loadTestModifier.Setup(testModifier => testModifier.EditDuration(duration)).Returns(false);
            _loadTestRunner.Setup(testRunner => testRunner.InitiateTest());

            var testController = new TestController(_configuration, _loadTestRunner.Object, _loadTestDataManager.Object,
                 _loadTestDataPreprocessor.Object, _loadTestModifier.Object);

            var result = testController.StartTest(duration, webServicesData);
            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public void StartTest_Failure_InvalidDuration()
        {
            string duration = null;
            List<WebServiceData> webServicesData = new List<WebServiceData>()
            {
                new WebServiceData()
                {
                    WebServiceId = "first",
                    Url = "https://jsonplaceholder.typicode.com/todos/1"
                }
            };

            var testController = new TestController(_configuration, _loadTestRunner.Object, _loadTestDataManager.Object,
                 _loadTestDataPreprocessor.Object, _loadTestModifier.Object);

            var result = testController.StartTest(duration, webServicesData);
            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public void StartTest_Failure_InvalidWebServicesData()
        {
            string duration = "00:00:30";
            List<WebServiceData> webServicesData = null;

            var testController = new TestController(_configuration, _loadTestRunner.Object, _loadTestDataManager.Object,
                 _loadTestDataPreprocessor.Object, _loadTestModifier.Object);

            var result = testController.StartTest(duration, webServicesData);
            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public void StartTest_Failure_InvalidWebServiceUrl()
        {
            string duration = "00:00:30";
            List<WebServiceData> webServicesData = new List<WebServiceData>()
            {
                new WebServiceData()
                {
                    WebServiceId = "first",
                    Url = null
                }
            };

            var testController = new TestController(_configuration, _loadTestRunner.Object, _loadTestDataManager.Object,
                 _loadTestDataPreprocessor.Object, _loadTestModifier.Object);

            var result = testController.StartTest(duration, webServicesData);
            Assert.IsType<BadRequestObjectResult>(result);
        }

        //[Fact(Skip = "Not needed")]
        //public void StartTest_Failure_ThrowsException()
        //{
        //    string duration = "00:00:30";
        //    List<WebServiceData> webServicesData = new List<WebServiceData>()
        //    {
        //        new WebServiceData()
        //        {
        //            WebServiceId = "first",
        //            Url = null
        //        }
        //    };

        //    _loadTestModifier.Setup(testModifier => testModifier.EditRequestBodyData(It.IsAny<string>(), It.IsAny<bool>(), It.IsAny<string>())).Throws(new Exception());
        //    var testController = new TestController(_configuration, _loadTestRunner.Object, _loadTestDataManager.Object,
        //       _loadTestDataPreprocessor.Object, _loadTestModifier.Object);

        //    Assert.Throws<Exception>(() => testController.StartTest(duration, webServicesData));
        //}

        [Fact]
        public void UploadTestData_Success()
        {
            string fileContent = "header" + Environment.NewLine  + "line1" + Environment.NewLine + "line2" + Environment.NewLine;
            int actualResultValue = 2;
            string webServiceId = "test";
            IList<string[]> cleanedUpMetricsData = new List<string[]>()
            {
                new string[1]
                {
                    fileContent
                }
            };

            _loadTestDataPreprocessor.Setup(testDataPrepocessor => testDataPrepocessor.CleanUpMetricsData(fileContent)).Returns(cleanedUpMetricsData);
            _loadTestDataPreprocessor.Setup(testDataPrepocessor => testDataPrepocessor.TransformMetricsData(cleanedUpMetricsData, webServiceId, true, true, true, true)).Returns(fileContent);
            _loadTestDataManager.Setup(testDataManager => testDataManager.UploadTestData(It.IsAny<IFormFile>())).Returns(fileContent);

            var testController = new TestController(_configuration, _loadTestRunner.Object, _loadTestDataManager.Object,
                  _loadTestDataPreprocessor.Object, _loadTestModifier.Object)
            {
                ControllerContext = RequestWithFile(fileContent)
            };

            var result = testController.UploadTestData(webServiceId);
            var resultValue = result as OkObjectResult;
            Assert.IsType<OkObjectResult>(result);
            Assert.Equal(actualResultValue, resultValue.Value);
        }

        [Fact]
        public void UploadTestData_Failure_InvalidWebServiceId()
        {
            string webServiceId = null;

            var testController = new TestController(_configuration, _loadTestRunner.Object, _loadTestDataManager.Object,
                _loadTestDataPreprocessor.Object, _loadTestModifier.Object);

            var result = testController.UploadTestData(webServiceId);
            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public void UploadTestData_Failure_InvalidFile()
        {
            string webServiceId = "first";

            var testController = new TestController(_configuration, _loadTestRunner.Object, _loadTestDataManager.Object,
                 _loadTestDataPreprocessor.Object, _loadTestModifier.Object);

            var result = testController.UploadTestData(webServiceId);
            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public void UploadTestData_Failure_InvalidFileContent()
        {
            string fileContent = null;
            string webServiceId = "first";

            _loadTestDataManager.Setup(testDataManager => testDataManager.UploadTestData(It.IsAny<IFormFile>())).Returns(fileContent);
            var testController = new TestController(_configuration, _loadTestRunner.Object, _loadTestDataManager.Object,
                  _loadTestDataPreprocessor.Object, _loadTestModifier.Object)
            {
                ControllerContext = RequestWithFile("")
            };

            Assert.Throws<InvalidOperationException>(() => testController.UploadTestData(webServiceId));
            
        }

        private ControllerContext RequestWithFile(string fileContent)
        {
            string fileName = "data.csv";
            var httpContext = new DefaultHttpContext();
            httpContext.Request.Headers.Add("Content-Type", "multipart/form-data");
            var file = new FormFile(new MemoryStream(Encoding.UTF8.GetBytes(fileContent)), 0, fileContent.Length, fileName, fileName);
            httpContext.Request.Form = new FormCollection(new Dictionary<string, StringValues>(), new FormFileCollection { file });
            var actx = new ActionContext(httpContext, new RouteData(), new ControllerActionDescriptor());
            return new ControllerContext(actx);
        }

        [Fact]
        public void SaveUsedMetrics_Success()
        {
            Dictionary<string, bool> metricsUsabilityInfo = new Dictionary<string, bool>()
            {
                ["ResponseTime"] = true
            };

            _loadTestDataPreprocessor.Setup(testDataPreprocessor => testDataPreprocessor.SaveUsedMetrics(metricsUsabilityInfo));
            var testController = new TestController(_configuration, _loadTestRunner.Object, _loadTestDataManager.Object,
                 _loadTestDataPreprocessor.Object, _loadTestModifier.Object);

            var result = testController.SaveUsedMetrics(metricsUsabilityInfo);
            Assert.IsType<OkObjectResult>(result);
        }

        [Fact]
        public void SaveUsedMetrics_Failure_InvalidMetricsUsabilityInfo()
        {
            Dictionary<string, bool> metricsUsabilityInfo = null;

            var testController = new TestController(_configuration, _loadTestRunner.Object, _loadTestDataManager.Object,
                _loadTestDataPreprocessor.Object, _loadTestModifier.Object);

            var result = testController.SaveUsedMetrics(metricsUsabilityInfo);
            Assert.IsType<BadRequestObjectResult>(result);
        }
    }
}
