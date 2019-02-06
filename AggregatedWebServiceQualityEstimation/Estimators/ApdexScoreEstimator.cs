using AggregatedWebServiceQualityEstimation.Estimators.Interfaces;
using AggregatedWebServiceQualityEstimation.Models;
using AggregatedWebServiceQualityEstimation.Utils.Interfaces;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;

namespace AggregatedWebServiceQualityEstimation.Estimators
{
    public class ApdexScoreEstimator : IApdexScoreEstimator, IMetricsData
    {
        private readonly CultureInfo _cultureInfo = new CultureInfo("en");
        private readonly Dictionary<double, string> _apdexScoreEstimationRatingMapping = new Dictionary<double, string>()
        {
            [94] = "Excellent",
            [85] = "Good",
            [70] = "Fair",
            [50] = "Poor",
            [0] = "Unacceptable"
        };

        private ITestDataIOManager _loadTestDataIOManager;
        private ITestDataPrepocessor _loadTestDataPreprocessor;
      

        public IList<string[]> MetricsData { get; set; }

        public ApdexScoreEstimator(ITestDataIOManager loadTestDataIOManager, ITestDataPrepocessor loadTestDataPreprocessor)
        {
            _loadTestDataIOManager = loadTestDataIOManager;
            _loadTestDataPreprocessor = loadTestDataPreprocessor;
        }

        public void GetMetricsData(string webServiceId, bool fromFile, bool byRow)
        {
            var initialMetricsData = _loadTestDataIOManager.ReadTestData(webServiceId, fromFile);
            MetricsData = _loadTestDataPreprocessor.PreprocessMetricsData(initialMetricsData, webServiceId, byRow, fromFile: fromFile);
        }

        public ApdexScoreEstimatorResult FindApdexScoreEstimatorResult(double apdexScoreLimit, bool fromFile, string webServiceId)
        {
            var apdexScoreEstimations = FindApdexScoreEstimations(apdexScoreLimit, fromFile, webServiceId);
            var averageApdexScore = FindAverageApdexScoreEstimation(apdexScoreEstimations);
            var apdexScoreEstimationRating = FindApdexScoreEstimationRating(averageApdexScore);

            var apdexScoreEstimatorResult = new ApdexScoreEstimatorResult()
            {
                ApdexScoreEstimations = apdexScoreEstimations,
                AverageApdexScoreEstimation = averageApdexScore,
                ApdexScoreEstimationRating = apdexScoreEstimationRating
            };

            return apdexScoreEstimatorResult;
        }

        private IEnumerable<ApdexScoreEstimation> FindApdexScoreEstimations(double apdexScoreLimit, bool fromFile, string webServiceId)
        {
            var result = new List<ApdexScoreEstimation>();
            var intervals = MetricsData.Take(2).ToList();
            var responseTimeData = MetricsData[2]?.Skip(1).ToList();

            if (!fromFile)
            {
                var intervalStartTime = intervals?[0]?[1]?.Trim();
                var intervalEndTime = intervals?[1]?[1]?.Trim();

                var apdexScoreEstimatorResult = GetApdexScoreEstimation(responseTimeData, apdexScoreLimit, intervalStartTime, intervalEndTime);

                result.Add(apdexScoreEstimatorResult);
            }
            else
            {
                for (int i = 0; i < responseTimeData.Count; i++)
                {
                    var intervalStartTime = intervals?[0]?[i + 1]?.Trim();
                    var intervalEndTime = intervals?[1]?[i + 1]?.Trim();
                    var currentResponseTimeData = responseTimeData.Take(i + 1).ToList();

                    var apdexScoreEstimatorResult = GetApdexScoreEstimation(currentResponseTimeData, apdexScoreLimit, intervalStartTime, intervalEndTime);

                    result.Add(apdexScoreEstimatorResult);
                }
            }

            return result;
        }

        private double FindAverageApdexScoreEstimation(IEnumerable<ApdexScoreEstimation> apdexScoreEstimations)
        {
            var averageApdexScoreEstimation = apdexScoreEstimations.Select(s => s.ApdexScore).Sum() / apdexScoreEstimations.Count();
            return averageApdexScoreEstimation;
        }

        private string FindApdexScoreEstimationRating(double averageApdexScore)
        {
            string apdexScoreEstimationRating = _apdexScoreEstimationRatingMapping.Last().Value;

            foreach (var keyValuePair in _apdexScoreEstimationRatingMapping)
            {
                if (averageApdexScore >= keyValuePair.Key)
                {
                    apdexScoreEstimationRating = keyValuePair.Value;
                    break;
                }
            }
            
            return apdexScoreEstimationRating;
        }

        private ApdexScoreEstimation GetApdexScoreEstimation(List<string> responseTimeData, double apdexScoreLimit,
            string intervalStartTime, string intervalEndTime)
        {
            ApdexScoreEstimation apdexScoreEstimation = null;
            int satisfiedResponseTimeValuesCount = 0;
            int toleratedResponseTimeValuesCount = 0;

            if (responseTimeData.Count != 0)
            {
                foreach (var item in responseTimeData)
                {
                    if (Double.TryParse(item, NumberStyles.Float, _cultureInfo, out double parsedItem))
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
                apdexScoreEstimation = new ApdexScoreEstimation()
                {
                    IntervalStartTime = intervalStartTime,
                    IntervalEndTime = intervalEndTime,
                    ApdexScore = apdexScore * 100
                };
            }

            return apdexScoreEstimation;
        }
    }
}