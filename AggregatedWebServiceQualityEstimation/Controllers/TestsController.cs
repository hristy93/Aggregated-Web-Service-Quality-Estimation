using AggregatedWebServiceQualityEstimation.Estimators;
using AggregatedWebServiceQualityEstimation.Models;
using AggregatedWebServiceQualityEstimation.Utils;
using AggregatedWebServiceQualityEstimation.Utils.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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
                    _loadTestModifier.EditRequestBodyData(requestPostData.ToString());
                }

                _loadTestModifier.EditUrl(url, isPostRequest);

                var duration = data.Duration;
                if (duration != null)
                {
                    var isDurationValid = _loadTestModifier.EditDuration(duration);

                    if (!isDurationValid)
                    {
                        return BadRequest("The duration of the test is invalid!");
                    }
                }

                _loadTestRunner.InitiateTest();

                return Ok("The load test finished successfully!");
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
                return Ok("The load test data was written successfully!");
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        [HttpGet("data/read")]
        public IActionResult ReadTestData(bool fromFile)
        {
            try
            {
                var result = _loadTestDataManager.ReadTestData(fromFile);
                return Ok(result);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }


        [HttpGet("estimator/cluster")]
        public IActionResult GetClusterEstimatorResult()
        {
            try
            {
                _loadTestDataManager.ReadTestData(fromFile: true);
                var clusterEstimator = new ClusterEstimator(_configuration);
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
        public IActionResult GetStatisticalEstimatorResult()
        {
            try
            {
                _loadTestDataManager.ReadTestData(fromFile: true);
                var statisticalEstimator = new StatisticalEstimator(_configuration);
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
        public IActionResult GetFuzzyLogicEstimatorResult()
        {
            try
            {
                _loadTestDataManager.ReadTestData(fromFile: true);
                var fuzzyLogicEstimator = new FuzzyLogicEstimator(_configuration);
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