using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AggregatedWebServiceQualityEstimation.Utils;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AggregatedWebServiceQualityEstimation.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TestController : ControllerBase
    {
        private ITestRunner _loadTestRunner;
        public TestController()
        {
            _loadTestRunner = new LoadTestRunner();
        }

        [HttpGet("run")]
        public IActionResult StartTests()
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
    }
}