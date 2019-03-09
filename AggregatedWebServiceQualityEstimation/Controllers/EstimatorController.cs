using AggregatedWebServiceQualityEstimation.Estimators;
using AggregatedWebServiceQualityEstimation.Estimators.Interfaces;
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
    public class EstimatorController : ControllerBase
    {
        private IApdexScoreEstimator _apdexScoreEstimator;
        private IClusterEstimator _clusterEstimator;
        private IFuzzyLogicEstimator _fuzzyLogicEstimator;
        private IStatisticalEstimator _statisticalEstimator;
        private ITestDataIOManager _loadTestDataManager;

        public EstimatorController(ITestDataIOManager loadTestDataManager, IApdexScoreEstimator apdexScoreEstimator,
            IClusterEstimator clusterEstimator, IFuzzyLogicEstimator fuzzyLogicEstimator, IStatisticalEstimator statisticalEstimator)
        {
            _loadTestDataManager = loadTestDataManager;
            _apdexScoreEstimator = apdexScoreEstimator;
            _clusterEstimator = clusterEstimator;
            _fuzzyLogicEstimator = fuzzyLogicEstimator;
            _statisticalEstimator = statisticalEstimator;
        }

        [HttpGet("cluster")]
        public IActionResult GetClusterEstimatorResult([Required] string webServiceId)
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

                IList<ClusterEstimation> clusterEstimatorResult = new List<ClusterEstimation>();
                (_clusterEstimator as IMetricsData)?.GetMetricsData(webServiceId, fromFile: true, byRow: true);

                if ((_clusterEstimator as IMetricsData)?.MetricsData[0].Skip(2).Count() > 1)
                {
                    clusterEstimatorResult = _clusterEstimator.FindClusterEstimatorResult();
                    //_clusterEstimator.FindDensestCluster();
                    //_clusterEstimator.FindClustersDensities();

                    //for (int i = 0; i < _clusterEstimator.ClustersCenters.Count; i++)
                    //{
                    //    var clusterData = new ClusterEstimation()
                    //    {
                    //        Potential = _clusterEstimator.ClustersCentersPotentials[i],
                    //        Center = _clusterEstimator.ClustersCenters[i],
                    //        Density = _clusterEstimator.ClustersDensities[i],
                    //        Spread = _clusterEstimator.ClustersSpreads[i],
                    //    };

                    //    clusterEstimatorResult.Add(clusterData);
                    //}
                }

                return Ok(clusterEstimatorResult);
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        [HttpGet("statistics")]
        public IActionResult GetStatisticalEstimatorResult([Required] string webServiceId)
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

                (_statisticalEstimator as IMetricsData)?.GetMetricsData(webServiceId, fromFile: true, byRow: false);

                var statisticalData = _statisticalEstimator.FindStatisticalEstimatorResult();
                return Ok(statisticalData);
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        [HttpGet("fuzzy-logic")]
        public IActionResult GetFuzzyLogicEstimatorResult([Required] string webServiceId)
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

                (_fuzzyLogicEstimator as IMetricsData)?.GetMetricsData(webServiceId, fromFile: true, byRow: false);

                _fuzzyLogicEstimator.GetAggregatedQualityMembershipFunction();
                var aggregatedQualityMembershipFunction =
                    _fuzzyLogicEstimator.AggregatedQualityMembershipFunction;
                return Ok(aggregatedQualityMembershipFunction);
            }
            catch (Exception ex)
            {
                throw;
            }
        }


        [HttpGet("apdex-score")]
        public IActionResult GetApdexScoreResult(double? apdexScoreLimit, [Required] string webServiceId,
            bool fromFile = true)
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

                (_apdexScoreEstimator as IMetricsData)?.GetMetricsData(webServiceId, fromFile, byRow: false);

                var apdexScoreEstimatorResult = _apdexScoreEstimator.FindApdexScoreEstimatorResult(apdexScoreLimit, fromFile, webServiceId);

                return Ok(apdexScoreEstimatorResult);
            }
            catch (Exception ex)
            {
                throw;
            }
        }
    }
}