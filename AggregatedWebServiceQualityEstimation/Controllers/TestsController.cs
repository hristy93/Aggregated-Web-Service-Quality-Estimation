using AggregatedWebServiceQualityEstimation.Estimators;
using AggregatedWebServiceQualityEstimation.Models;
using AggregatedWebServiceQualityEstimation.Utils;
using AggregatedWebServiceQualityEstimation.Utils.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;

namespace AggregatedWebServiceQualityEstimation.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TestController : ControllerBase
    {
        private ITestRunner _loadTestRunner;
        private ITestDataManager _loadTestDataManager;
        private IConfiguration _configuration;
        private ITestModifier _loadTestModifier;

        public TestController(IConfiguration configuration)
        {
            _configuration = configuration;
            _loadTestRunner = new LoadTestRunner();
            _loadTestDataManager = new LoadTestDataManager(_configuration);
            _loadTestModifier = new LoadTestModifier();
        }

        [HttpPost("run")]
        public IActionResult StartTest(string duration, [FromBody] List<WebServiceData> data)
        {
            try
            {
                foreach (var webServiceItem in data)
                {
                    var webServiceId = webServiceItem.WebServiceId;
                    var url = webServiceItem.Url;
                    if (url == null)
                    {
                        return BadRequest("The url of the request is invalid!");
                    }

                    var requestPostData = webServiceItem.Body;
                    var isPostRequest = requestPostData != null;

                    _loadTestModifier.EditRequestBodyData(requestPostData?.ToString(), isPostRequest, webServiceId);
                    _loadTestModifier.EditUrl(url, isPostRequest, webServiceId); 
                }

                if (duration != null)
                {
                    var isDurationValid = _loadTestModifier.EditDuration(duration);

                    if (!isDurationValid)
                    {
                        return BadRequest("The duration of the test is invalid!");
                    }
                }
                else
                {
                    return BadRequest("The duration of the request is missing!");
                }

                _loadTestRunner.InitiateTest();

                return Ok("The load test finished successfully!");
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        [HttpGet("cancel")]
        public IActionResult CancelTest()
        {
            int retries = 0;
            do
            {
                _loadTestRunner.CancelTest();
                retries += 1;
            }
            while (_loadTestRunner.IsTestRunning() && retries < 5);

            if (retries >= 5)
            {
                throw new Exception("The load test was not cancelled after 5 retries!");
            }

            return Ok("The load test was canceled!");
        }


        [HttpGet("status")]
        public IActionResult CheckTestStatus()
        {
            var isTestRunning = _loadTestRunner.IsTestRunning();
            var status = isTestRunning ? "running" : "stopped";
            return Ok(status);
        }

        [HttpGet("data/write")]
        public IActionResult WriteTestData(string webServiceId)
        {
            try
            {
                _loadTestDataManager.WriteTestData(webServiceId);
                return Ok("The load test data was written successfully!");
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        [HttpGet("data/read")]
        public IActionResult ReadTestData(bool fromFile, string webServiceId)
        {
            try
            {
                var result = _loadTestDataManager.ReadTestData(webServiceId, fromFile);
                return Ok(result);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        [HttpPost("data/upload")]
        public IActionResult UploadTestData(string webServiceId)
        {
            IFormFile file = Request.Form.Files.FirstOrDefault();
            string fileContent = null;

            if (file == null)
            {
                return BadRequest("The file is invalid!");
            }

            using (MemoryStream data = new MemoryStream())
            {
                using (Stream fileStream = file.OpenReadStream())
                {
                    fileStream.CopyTo(data);
                    var buffer = data.ToArray();
                    fileContent = Encoding.UTF8.GetString(buffer, 0, buffer.Length);
                }
            }

            if (fileContent == null)
            {
                throw new InvalidOperationException("The file is not processed correctly!");
            }

            _loadTestDataManager.WriteTestData(fileContent, webServiceId);

            return Ok("The file is uploaded successfully!");
        }

        [HttpGet("estimator/cluster")]
        public IActionResult GetClusterEstimatorResult(string webServiceId)
        {
            try
            {
                var clusterEstimator = new ClusterEstimator(_loadTestDataManager, webServiceId);
                clusterEstimator.FindClusterCenter();
                clusterEstimator.FindClusterDensity();
                var clusterEstimatorResult = new ClusterEstimatorResult()
                {
                    DensestClusterCenterPotential = clusterEstimator.DensestClusterCenterPotential,
                    DensestClusterDensity = clusterEstimator.DensestClusterDensity,
                    DensestClusterEstimation = clusterEstimator.DensestClusterEstimation
                };

                return Ok(clusterEstimatorResult);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        [HttpGet("estimator/statistics")]
        public IActionResult GetStatisticalEstimatorResult(string webServiceId)
        {
            try
            {
                var statisticalEstimator = new StatisticalEstimator(_loadTestDataManager, webServiceId);
                statisticalEstimator.GetFiveNumberSummaries();
                var fiveNumberSummaries = statisticalEstimator.statisticalData;
                return Ok(fiveNumberSummaries);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        [HttpGet("estimator/fuzzy-logic")]
        public IActionResult GetFuzzyLogicEstimatorResult(string webServiceId)
        {
            try
            {
                var fuzzyLogicEstimator = new FuzzyLogicEstimator(_loadTestDataManager, webServiceId);
                fuzzyLogicEstimator.GetAggregatedQualityMembershipFunction();
                var aggregatedQualityMembershipFunction =
                    fuzzyLogicEstimator.AggregatedQualityMembershipFunction;
                return Ok(aggregatedQualityMembershipFunction);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }


        [HttpGet("estimator/apdex-score")]
        public IActionResult GetApdexScoreResult(double apdexScoreLimit, string webServiceId, bool fromFile = true)
        {
            try
            {
                var apdexScoreEstimator = new ApdexScoreEstimator(_loadTestDataManager, webServiceId);
                var currentApdexScoreInfo = apdexScoreEstimator.FindApdexScore(apdexScoreLimit, fromFile, webServiceId);

                return Ok(currentApdexScoreInfo);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        [HttpPost("metrics")]
        public IActionResult SaveUsedMetrics([FromBody] Dictionary<string, bool> metricsUsabilityInfo)
        {
            try
            {
                _loadTestDataManager.SaveUsedMetrics(metricsUsabilityInfo);

                return Ok("The used metrics are saved successfully!");
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}