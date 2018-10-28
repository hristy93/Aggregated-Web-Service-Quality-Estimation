using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AggregatedWebServiceQualityEstimation.Utils;
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

        public TestController(IConfiguration configuration)
        {
            _configuration = configuration;
            _loadTestRunner = new LoadTestRunner();
            _loadTestDataManager = new LoadTestDataManager(_configuration);
        }

        [HttpGet("run")]
        public IActionResult StartTest()
        {
            try
            {
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