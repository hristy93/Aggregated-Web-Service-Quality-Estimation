using AggregatedWebServiceQualityEstimation.Utils.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AggregatedWebServiceQualityEstimation.Utils
{
    public class LoadTestDataPrepocessor : ITestDataPrepocessor
    {
        private static Dictionary<string, bool> _metricsUsed = new Dictionary<string, bool>()
        {
            ["ResponseTime"] = true,
            ["SuccessfulRequestsPerSecond"] = true,
            ["FailedRequestsPerSecond"] = true,
            ["ReceivedKilobytesPerSecond"] = true,
        };

        public LoadTestDataPrepocessor()
        {
        }

        public void SaveUsedMetrics(Dictionary<string, bool> metricsInfo)
        {
            _metricsUsed = metricsInfo;
        }

        public IList<string[]> PreprocessMetricsData(string metricsData, string webServiceId, bool byRow = true, bool fromFile = true, bool isFiltered = true)
        {
            var cleanedUpMetricsData = CleanUpMetricsData(metricsData);
            var transformedMetricsData = TransformMetricsData(metricsData, webServiceId, byRow, fromFile, isFiltered);
            return transformedMetricsData;
        }

        public IList<string[]> TransformMetricsData(string metricsData, string webServiceId, bool byRow = true, bool fromFile = true, bool isFiltered = true)
        {
            //var fileOutput = ReadTestData(webServiceId, fromFile);
            var fileLines = metricsData.Split(Environment.NewLine);
            var transformedFileLines = fileLines.Select(x => x.Split(','));
            IList<string[]> trasformedMetricsData;

            if (byRow)
            {
                if (isFiltered && _metricsUsed.Count != 0)
                {
                    var metricsNames = transformedFileLines.ToList()[0];
                    var metricsIndexes = metricsNames
                        .Where(item => item.StartsWith("Interval") ||
                        (_metricsUsed.ContainsKey(item) && _metricsUsed[item]))
                        .Select(item => metricsNames.ToList().IndexOf(item));
                    var filteredMetricsData = transformedFileLines
                        .Select(metricsInfo => metricsInfo
                        .Where(item => metricsIndexes.Contains(metricsInfo.ToList().IndexOf(item))).ToArray())
                        .ToList();
                    trasformedMetricsData = filteredMetricsData.Skip(1).ToList();
                }
                else
                {
                    trasformedMetricsData = transformedFileLines.Skip(1).ToList();
                }
            }
            else
            {
                trasformedMetricsData = transformedFileLines
                    .SelectMany(inner => inner.Select((item, index) => new { item, index }))
                    .GroupBy(i => i.index, i => i.item)
                    .Select(g => g.ToArray())
                    .ToList();

                if (isFiltered && _metricsUsed != null)
                {
                    var filteredMetricsData = trasformedMetricsData
                        .Where(metric => metric[0].StartsWith("Interval") ||
                        (_metricsUsed.ContainsKey(metric[0]) && _metricsUsed[metric[0]]))
                        .ToList();
                    trasformedMetricsData = filteredMetricsData;
                }
            }

            return trasformedMetricsData;
        }

        public IList<string[]> CleanUpMetricsData(string metricsData)
        {
            var fileLines = metricsData.Split(Environment.NewLine);
            var fileLinesTransformed = fileLines.Select(x => x.Split(','));
            return fileLinesTransformed.ToList();
        }
    }
}
