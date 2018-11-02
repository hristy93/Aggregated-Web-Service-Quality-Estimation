using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AggregatedWebServiceQualityEstimation.Utils;
using AggregatedWebServiceQualityEstimation.Utils.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

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
        public IActionResult StartTest([FromBody] string url)
        {
            try
            {
                _loadTestModifier.EditUrl(url);
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
                return Ok(result);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}