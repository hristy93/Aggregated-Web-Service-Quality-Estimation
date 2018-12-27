using AggregatedWebServiceQualityEstimation.Models;
using AggregatedWebServiceQualityEstimation.Utils.Interfaces;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;

namespace AggregatedWebServiceQualityEstimation.Estimators
{
    public class ApdexScoreEstimator : Estimator
    {
        private ApdexScoreEstimatorResult _apdexScoreEstimatorResult;

        public ApdexScoreEstimator(ITestDataManager loadTestDataManager) : base(loadTestDataManager)
        {
            //GetMetricsData(byRow: false);
        }

        public IEnumerable<ApdexScoreEstimatorResult> FindApdexScore(double apdexScoreLimit, bool fromFile)
        {
            var result = new List<ApdexScoreEstimatorResult>();
            GetMetricsData(byRow: false, fromFile: fromFile);
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