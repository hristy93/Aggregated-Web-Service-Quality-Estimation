using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AggregatedWebServiceQualityEstimation.Estimators;
using AggregatedWebServiceQualityEstimation.Models;
using AggregatedWebServiceQualityEstimation.Utils;
using AggregatedWebServiceQualityEstimation.Utils.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;

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
        public IActionResult StartTest([FromBody] PostData data)
        {
            try
            {
                var deserializedData = data;

                var url = deserializedData.Url;
                if (url == null)
                {
                    return BadRequest("The url of the request is invalid!");
                }

                var requestPostData = deserializedData.Value;
                var isPostRequest = requestPostData != null;
                if (isPostRequest)
                {
                    _loadTestModifier.AddRequestBodyData(requestPostData.ToString());
                }

                _loadTestModifier.EditUrl(url, isPostRequest);

                _loadTestRunner.InitiateTest();
                return Ok("The load test finished sucessfully!");
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        [HttpGet("data/write")]
        public IActionResult WriteTestData()
        {
            try
            {
                _loadTestDataManager.WriteTestData();
                return Ok("The load test data was written sucessfully!");
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        [HttpGet("data/read")]
        public IActionResult ReadTestData()
        {
            try
            {
                var result = _loadTestDataManager.ReadTestData();
                var clusterEstimator = new ClusterEstimator(_configuration);
                clusterEstimator.FindClusterCenter();
                clusterEstimator.FindClusterDensity();
                var statisticalEstimator = new StatisticalEstimator(_configuration);
                statisticalEstimator.GetFiveNumberSummaries();
                var fuzzyLogicEstimator = new FuzzyLogicEstimator(_configuration);
                fuzzyLogicEstimator.GetAggregatedQualityMembershipFunction();
                return Ok(result);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        [HttpPost("data/upload")]
        public async Task<IActionResult> UploadTestData()
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

            _loadTestDataManager.WriteTestData(fileContent);

            return Ok("The file is uploaded successfully!");
        }
    }
}