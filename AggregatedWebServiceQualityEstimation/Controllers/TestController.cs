using AggregatedWebServiceQualityEstimation.Estimators;
using AggregatedWebServiceQualityEstimation.Models;
using AggregatedWebServiceQualityEstimation.Utils.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;

namespace AggregatedWebServiceQualityEstimation.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TestController : ControllerBase
    {
        private ITestRunner _loadTestRunner;
        private ITestDataIOManager _loadTestDataIOManager;
        private ITestDataPrepocessor _loadTestDataPreprocessor;
        private IConfiguration _configuration;
        private ITestModifier _loadTestModifier;

        public TestController(IConfiguration configuration, ITestRunner testRunner,
            ITestDataIOManager testDataIOManager, ITestDataPrepocessor loadTestDataPreprocessor, ITestModifier testModifier)
        {
            _configuration = configuration;
            _loadTestRunner = testRunner;
            _loadTestDataIOManager = testDataIOManager;
            _loadTestDataPreprocessor = loadTestDataPreprocessor;
            _loadTestModifier = testModifier;
        }

        [HttpPost("run")]
        public IActionResult StartTest([Required] string duration,
            [Required][FromBody] List<WebServiceData> data)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                if (duration == null)
                {
                    return BadRequest("The duration of the tests is invalid or missing!");
                }

                if (data == null)
                {
                    return BadRequest("The data for the web services is invalid or missing!");
                }


                foreach (var webServiceItem in data)
                {
                    var webServiceId = webServiceItem.WebServiceId;
                    var url = webServiceItem.Url;

                    if (url == null)
                    {
                        return BadRequest($"The URL of the {webServiceId} web serviceurl is invalid!");
                    }

                    var requestPostData = webServiceItem.Body;
                    var isPostRequest = requestPostData != null;

                    _loadTestModifier.EditRequestBodyData(requestPostData?.ToString(), isPostRequest, webServiceId);
                    _loadTestModifier.EditUrl(url, isPostRequest, webServiceId);
                }

                var isDurationFormatValid = _loadTestModifier.EditDuration(duration);

                if (!isDurationFormatValid)
                {
                    return BadRequest("The duration of the tests is in invalid format!");
                }

                _loadTestRunner.InitiateTest();

                return Ok("The performance and load tests finished successfully!");
            }
            catch (Exception ex)
            {
                throw;
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
                throw new Exception("The performance and load tests were not cancelled after 5 retries!");
            }

            return Ok("The performance and load tests were canceled!");
        }


        [HttpGet("status")]
        public IActionResult CheckTestStatus()
        {
            var isTestRunning = _loadTestRunner.IsTestRunning();
            var status = isTestRunning ? "running" : "stopped";
            return Ok(status);
        }

        [HttpGet("data/write")]
        public IActionResult WriteTestData([Required] string webServiceId)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                if (webServiceId == null)
                {
                    return BadRequest("The webServiceId is invalid or missing!");
                }

                _loadTestDataIOManager.WriteTestData(webServiceId);
                return Ok($"The {webServiceId} web service's metrics data was written successfully!");
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        [HttpGet("data/read")]
        public IActionResult ReadTestData([Required] bool fromFile, [Required] string webServiceId)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                if (webServiceId == null)
                {
                    return BadRequest("The webServiceId is invalid or missing!");
                }

                var result = _loadTestDataIOManager.ReadTestData(webServiceId, fromFile);
                return Ok(result);
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        [HttpPost("data/upload")]
        public IActionResult UploadTestData([Required] string webServiceId)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (webServiceId == null)
            {
                return BadRequest("The webServiceId is invalid or missing!");
            }

            IFormFile file = Request?.Form?.Files?.FirstOrDefault();

            if (file == null)
            {
                return BadRequest($"The {webServiceId} web service's file is invalid!");
            }

            var fileContent = _loadTestDataIOManager.UploadTestData(file);
          
            if (fileContent == null)
            {
                throw new InvalidOperationException($"The {webServiceId} web service's file was not processed correctly!");
            }

            var fileContentLines = Regex.Matches(fileContent, Environment.NewLine).Count - 1;

            var cleanedUpMetricsData = _loadTestDataPreprocessor.CleanUpMetricsData(fileContent);
            var transfromedFileContent = _loadTestDataPreprocessor.TransformMetricsData(cleanedUpMetricsData, webServiceId, toFileFormat: true);

            _loadTestDataIOManager.WriteTestData(transfromedFileContent, webServiceId);

            return Ok(fileContentLines);
        }

        [HttpPost("metrics")]
        public IActionResult SaveUsedMetrics([Required][FromBody] Dictionary<string, bool> metricsUsabilityInfo)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                if (metricsUsabilityInfo == null)
                {
                    return BadRequest("The metricsUsabilityInfo is invalid or missing!");
                }

                _loadTestDataPreprocessor.SaveUsedMetrics(metricsUsabilityInfo);

                return Ok("The used metrics are saved successfully!");
            }
            catch (Exception ex)
            {
                throw;
            }
        }
    }
}