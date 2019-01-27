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

        public TestController(IConfiguration configuration, ITestRunner testRunner,
            ITestDataManager testDataManager, ITestModifier testModifier)
        {
            _configuration = configuration;
            _loadTestRunner = testRunner;
            _loadTestDataManager = testDataManager;
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
                    return BadRequest("The duration of the test is invalid or missing!");
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
                        return BadRequest("The url of the request is invalid!");
                    }

                    var requestPostData = webServiceItem.Body;
                    var isPostRequest = requestPostData != null;

                    _loadTestModifier.EditRequestBodyData(requestPostData?.ToString(), isPostRequest, webServiceId);
                    _loadTestModifier.EditUrl(url, isPostRequest, webServiceId);
                }

                var isDurationFormatValid = _loadTestModifier.EditDuration(duration);

                if (!isDurationFormatValid)
                {
                    return BadRequest("The duration of the test is in invalid format!");
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

                _loadTestDataManager.WriteTestData(webServiceId);
                return Ok("The load test data was written successfully!");
            }
            catch (Exception ex)
            {
                throw ex;
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

                var result = _loadTestDataManager.ReadTestData(webServiceId, fromFile);
                return Ok(result);
            }
            catch (Exception ex)
            {
                throw ex;
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
            string fileContent = null;

            if (file == null)
            {
                return BadRequest("The file is invalid!");
            }

            fileContent = _loadTestDataManager.UploadTestData(file);

            if (fileContent == null)
            {
                throw new InvalidOperationException("The file is not processed correctly!");
            }

            _loadTestDataManager.WriteTestData(fileContent, webServiceId);

            return Ok("The file is uploaded successfully!");
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