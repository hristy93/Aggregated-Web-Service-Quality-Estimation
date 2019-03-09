using AggregatedWebServiceQualityEstimation.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Xunit;

namespace Backend.UnitTests.Utils
{
    public class LoadTestDataPrepocessorTests
    {
        private LoadTestDataPrepocessor _loadTestDataPrepocessor;
        private Dictionary<string, bool> _metricsUsed;
        private IList<string[]> _metricsDataByColumns = new List<string[]>()
        {
            new string[] { "IntervalStartTime", "15:55:38", "15:55:43", "15:55:48", "15:55:53", "15:55:58" },
            new string[] { "IntervalEndTime", "15:55:43", "15:55:48", "15:55:53", "15:55:58", "15:56:03" },
            new string[] { "ResponseTime", "0.9735", "0.6745715", "0.6522857", "0.6421428", "0.7731667" },
            new string[] { "SuccessfulRequestsPerSecond", "0.8", "1.4", "1.4", "1.4", "1.2" },
            new string[] { "FailedRequestsPerSecond", "0", "0", "0", "0", "0"},
            new string[] { "ReceivedKilobytesPerSecond", "3.025", "3.025", "3.025", "3.025", "3.025"},
        };
        private IList<string[]> _metricsDataByRows = new List<string[]>()
        {
            new string[] { "IntervalStartTime", "IntervalEndTime", "ResponseTime", "SuccessfulRequestsPerSecond", "FailedRequestsPerSecond", "ReceivedKilobytesPerSecond"},
            new string[] { "15:55:38", "15:55:43", "0.9735", "0.8", "0", "3.025"},
            new string[] { "15:55:43", "15:55:48", "0.6745715", "1.4", "0", "3.025" },
            new string[] { "15:55:48", "15:55:53", "0.6522857", "1.4", "0", "3.025" },
            new string[] { "15:55:53", "15:55:58", "0.6421428", "1.4", "0", "3.025" },
            new string[] { "15:55:58", "15:56:03", "0.7731667", "1.2", "0", "3.025" },
        };
        private string _metricsDataInFileFromat = "IntervalStartTime,IntervalEndTime,ResponseTime,SuccessfulRequestsPerSecond,FailedRequestsPerSecond," +
            "ReceivedKilobytesPerSecond\r\n15:55:38,15:55:43,0.9735,0.8,0,3.025\r\n15:55:43,15:55:48,0.6745715,1.4,0,3.025\r\n15:55:48,15:55:53,0.6522857," +
            "1.4,0,3.025\r\n15:55:53,15:55:58,0.6421428,1.4,0,3.025\r\n15:55:58,15:56:03,0.7731667,1.2,0,3.025\r\n";
        private string _metricsDataInFileFormatDirtyValue = "IntervalStartTime,IntervalEndTime,ResponseTime,SuccessfulRequestsPerSecond,FailedRequestsPerSecond," +
           "ReceivedKilobytesPerSecond\r\n15:55:38,15:55:43,0.9735,0.8,%,ab\r\n15:55:43,15:55:48,0.6745715,1.4,0,\r\n15:55:48,15:55:53,0.6522857," +
           "1.4,na,3.025\r\n15:55:53,15:55:58,0.6421428,1.4,nan,3.025\r\n15:55:58,15:56:03,0.7731667,1.2,0,null\r\n";
        private string _metricsDataInFileFromatDirtyMetricsNames = "IntervalStartTime,IntervalEndTime,ResponsTime,SuccessfullRequestsPerSecond,FailedRequestsPerSecond," +
    "ReceivedKilobytesPerSecond\r\n";
        private string _metricsDataInFileFromatDirtyIntervals = "IntervalStartTime,IntervalEndTime,ResponseTime,SuccessfulRequestsPerSecond,FailedRequestsPerSecond," +
"ReceivedKilobytesPerSecond\r\n15:5:38,15::43,0.9735,0.8,0,3.025\r\n";

        public LoadTestDataPrepocessorTests()
        {
            _loadTestDataPrepocessor = new LoadTestDataPrepocessor();
            _metricsUsed = new Dictionary<string, bool>()
            {
                ["ResponseTime"] = true,
                ["SuccessfulRequestsPerSecond"] = true,
                ["FailedRequestsPerSecond"] = true,
                ["ReceivedKilobytesPerSecond"] = true,
            };
        }

        [Fact]
        public void TransformMetricsData_InputListOutputListAndByColumns_Success()
        {
            const string webServiceId = "first";
            const bool byRow = false;
            const bool fromFile = true;
            const bool isFiltered = true;

            _loadTestDataPrepocessor.SaveUsedMetrics(_metricsUsed);
            IList<string[]> actualResult = _loadTestDataPrepocessor.TransformMetricsData(_metricsDataByRows, webServiceId, byRow, fromFile, isFiltered);

            Assert.Equal<IList<string[]>>(_metricsDataByColumns, actualResult);
        }

        [Fact]
        public void TransformMetricsData_InputListOutputStringAndByColumns_Success()
        {
            const string webServiceId = "first";
            const bool byRow = false;
            const bool fromFile = true;
            const bool isFiltered = true;
            const bool toFileFormat = true;

            _loadTestDataPrepocessor.SaveUsedMetrics(_metricsUsed);
            string actualResult = _loadTestDataPrepocessor.TransformMetricsData(_metricsDataByRows, webServiceId, byRow, fromFile, isFiltered, toFileFormat);

            Assert.Equal(_metricsDataInFileFromat, actualResult);
        }

        [Fact]
        public void TransformMetricsData_InputStringOutputListAndByColumns_Success()
        {
            const string webServiceId = "first";
            const bool byRow = false;
            const bool fromFile = true;
            const bool isFiltered = true;

            _loadTestDataPrepocessor.SaveUsedMetrics(_metricsUsed);
            IList<string[]> actualResult = _loadTestDataPrepocessor.TransformMetricsData(_metricsDataInFileFromat, webServiceId, byRow, fromFile, isFiltered);

            Assert.Equal<IList<string[]>>(_metricsDataByColumns, actualResult);
        }

        [Fact]
        public void TransformMetricsData_InputListOutputListAndByRows_Success()
        {
            const string webServiceId = "first";
            const bool byRow = true;
            const bool fromFile = true;
            const bool isFiltered = true;

            _loadTestDataPrepocessor.SaveUsedMetrics(_metricsUsed);
            IList<string[]> actualResult = _loadTestDataPrepocessor.TransformMetricsData(_metricsDataByRows, webServiceId, byRow, fromFile, isFiltered);

            Assert.Equal<IList<string[]>>(_metricsDataByRows.Skip(1).ToList(), actualResult);
        }

        [Fact]
        public void PreprocessMetricsData_ByColumns_Success()
        {
            const string webServiceId = "first";
            const bool byRow = false;
            const bool fromFile = true;
            const bool isFiltered = true;

            _loadTestDataPrepocessor.SaveUsedMetrics(_metricsUsed);
            IList<string[]> actualResult = _loadTestDataPrepocessor.PreprocessMetricsData(_metricsDataInFileFromat, webServiceId, byRow, fromFile, isFiltered);

            Assert.Equal<IList<string[]>>(_metricsDataByColumns, actualResult);
        }

        [Fact]
        public void PreprocessMetricsData_ByRows_Success()
        {
            const string webServiceId = "first";
            const bool byRow = true;
            const bool fromFile = true;
            const bool isFiltered = true;

            _loadTestDataPrepocessor.SaveUsedMetrics(_metricsUsed);
            IList<string[]> actualResult = _loadTestDataPrepocessor.PreprocessMetricsData(_metricsDataInFileFromat, webServiceId, byRow, fromFile, isFiltered);

            Assert.Equal<IList<string[]>>(_metricsDataByRows.Skip(1).ToList(), actualResult);
        }

        [Fact]
        public void CleanUpMetricsData_CleanMetricsData_Success()
        {
            _loadTestDataPrepocessor.SaveUsedMetrics(_metricsUsed);
            IList<string[]> actualResult = _loadTestDataPrepocessor.CleanUpMetricsData(_metricsDataInFileFromat);

            Assert.Equal<IList<string[]>>(_metricsDataByRows, actualResult);
        }

        [Fact]
        public void CleanUpMetricsData_DirtyMetricsData_Success()
        {
            _loadTestDataPrepocessor.SaveUsedMetrics(_metricsUsed);
            IList<string[]> actualResult = _loadTestDataPrepocessor.CleanUpMetricsData(_metricsDataInFileFormatDirtyValue);

            Assert.Equal<IList<string[]>>(_metricsDataByRows, actualResult);
        }

        [Fact]
        public void CleanUpMetricsData_DirtyMetricsNames_Failure_ThrowsException()
        {
            _loadTestDataPrepocessor.SaveUsedMetrics(_metricsUsed);
            Assert.Throws<Exception>(() => _loadTestDataPrepocessor.CleanUpMetricsData(_metricsDataInFileFromatDirtyMetricsNames));
        }

        [Fact]
        public void CleanUpMetricsData_DirtyIntervals_Failure_ThrowsException()
        {
            _loadTestDataPrepocessor.SaveUsedMetrics(_metricsUsed);
            Assert.Throws<Exception>(() => _loadTestDataPrepocessor.CleanUpMetricsData(_metricsDataInFileFromatDirtyIntervals));
        }
    }
}
