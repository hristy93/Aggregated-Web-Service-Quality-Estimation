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
        private ITestDataManager _loadTestDataManager;

        public EstimatorController(ITestDataManager loadTestDataManager, IApdexScoreEstimator apdexScoreEstimator,
            IFuzzyLogicEstimator fuzzyLogicEstimator, IStatisticalEstimator statisticalEstimator)
        {
            _loadTestDataManager = loadTestDataManager;
            _apdexScoreEstimator = apdexScoreEstimator;
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

                _clusterEstimator = new ClusterEstimator(_loadTestDataManager, webServiceId);
                (_clusterEstimator as IMetricsData)?.GetMetricsData(webServiceId);

                _clusterEstimator.FindClusterCenter();
                _clusterEstimator.FindClusterDensity();

                var clusterEstimatorResult = new ClusterEstimatorResult()
                {
                    DensestClusterCenterPotential = _clusterEstimator.DensestClusterCenterPotential,
                    DensestClusterDensity = _clusterEstimator.DensestClusterDensity,
                    DensestClusterEstimation = _clusterEstimator.DensestClusterEstimation
                };

                return Ok(clusterEstimatorResult);
            }
            catch (Exception ex)
            {
                throw ex;
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

                _statisticalEstimator = new StatisticalEstimator(_loadTestDataManager);
                (_statisticalEstimator as IMetricsData)?.GetMetricsData(webServiceId);

                _statisticalEstimator.GetFiveNumberSummaries();
                var fiveNumberSummaries = _statisticalEstimator.StatisticalData;
                return Ok(fiveNumberSummaries);
            }
            catch (Exception ex)
            {
                throw ex;
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

                _fuzzyLogicEstimator = new FuzzyLogicEstimator(_loadTestDataManager);
                (_fuzzyLogicEstimator as IMetricsData)?.GetMetricsData(webServiceId);

                _fuzzyLogicEstimator.GetAggregatedQualityMembershipFunction();
                var aggregatedQualityMembershipFunction =
                    _fuzzyLogicEstimator.AggregatedQualityMembershipFunction;
                return Ok(aggregatedQualityMembershipFunction);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }


        [HttpGet("apdex-score")]
        public IActionResult GetApdexScoreResult([Required] double apdexScoreLimit, [Required] string webServiceId,
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

                _apdexScoreEstimator = new ApdexScoreEstimator(_loadTestDataManager);
                (_apdexScoreEstimator as IMetricsData)?.GetMetricsData(webServiceId, fromFile);

                var currentApdexScoreInfo = _apdexScoreEstimator.FindApdexScore(apdexScoreLimit, fromFile, webServiceId);

                return Ok(currentApdexScoreInfo);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}