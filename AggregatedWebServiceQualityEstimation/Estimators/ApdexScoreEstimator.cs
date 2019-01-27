using AggregatedWebServiceQualityEstimation.Estimators.Interfaces;
using AggregatedWebServiceQualityEstimation.Models;
using AggregatedWebServiceQualityEstimation.Utils.Interfaces;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;

namespace AggregatedWebServiceQualityEstimation.Estimators
{
    public class ApdexScoreEstimator : IApdexScoreEstimator, IMetricsData
    {
        private ApdexScoreEstimatorResult _apdexScoreEstimatorResult;
        private ITestDataManager _loadTestDataManager;

        public IList<string[]> MetricsData { get; set; }

        public ApdexScoreEstimator(ITestDataManager loadTestDataManager)
        {
            _loadTestDataManager = loadTestDataManager;
        }

        public void GetMetricsData(string webServiceId, bool fromFile, bool byRow)
        {
            MetricsData = _loadTestDataManager.GetMetricsData(webServiceId, byRow: false, fromFile: fromFile);
        }

        public IEnumerable<ApdexScoreEstimatorResult> FindApdexScore(double apdexScoreLimit, bool fromFile, string webServiceId)
        {
            var result = new List<ApdexScoreEstimatorResult>();
            var intervals = MetricsData.Take(2).ToList();
            var responseTimeData = MetricsData[2]?.Skip(1).ToList();

            if (!fromFile)
            {
                var intervalStartTime = intervals?[0]?[1]?.Trim();
                var intervalEndTime = intervals?[1]?[1]?.Trim();

                var apdexScoreEstimatorResult = GetApdexScoreItem(responseTimeData, apdexScoreLimit, intervalStartTime, intervalEndTime);

                result.Add(apdexScoreEstimatorResult);
            }
            else
            {
                for (int i = 0; i < responseTimeData.Count; i++)
                {
                    var intervalStartTime = intervals?[0]?[i + 1]?.Trim();
                    var intervalEndTime = intervals?[1]?[i + 1]?.Trim();
                    var currentResponseTimeData = responseTimeData.Take(i + 1).ToList();

                    var apdexScoreEstimatorResult = GetApdexScoreItem(currentResponseTimeData, apdexScoreLimit, intervalStartTime, intervalEndTime);

                    result.Add(apdexScoreEstimatorResult);
                }
            }

            return result;
        }

        private ApdexScoreEstimatorResult GetApdexScoreItem(List<string> responseTimeData, double apdexScoreLimit, string intervalStartTime, string intervalEndTime)
        {
            ApdexScoreEstimatorResult apdexScoreEstimatorResult = null;
            int satisfiedResponseTimeValuesCount = 0;
            int toleratedResponseTimeValuesCount = 0;

            if (responseTimeData.Count != 0)
            {
                foreach (var item in responseTimeData)
                {
                    if (Double.TryParse(item.Replace('.', ','), out double parsedItem))
                    {
                        if (parsedItem <= apdexScoreLimit)
                        {
                            satisfiedResponseTimeValuesCount += 1;
                        }
                        else if (parsedItem <= apdexScoreLimit * 4)
                        {
                            toleratedResponseTimeValuesCount += 1;
                        }
                    }
                }

                var apdexScore = (satisfiedResponseTimeValuesCount +
                  toleratedResponseTimeValuesCount / 2.0) / (responseTimeData.Count);
                apdexScoreEstimatorResult = new ApdexScoreEstimatorResult()
                {
                    IntervalStartTime = intervalStartTime,
                    IntervalEndTime = intervalEndTime,
                    ApdexScore = apdexScore
                };
            }

            return apdexScoreEstimatorResult;
        }
    }
}