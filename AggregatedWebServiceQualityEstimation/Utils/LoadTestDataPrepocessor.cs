using AggregatedWebServiceQualityEstimation.Utils.Interfaces;
using MathNet.Numerics.LinearAlgebra;
using MathNet.Numerics.Statistics;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;

namespace AggregatedWebServiceQualityEstimation.Utils
{
    public class LoadTestDataPrepocessor : ITestDataPrepocessor
    {
        private const string INTERVAL_REGEX = @"^(?:(?:([01]?\d|2[0-3]):)?([0-5]?\d):)?([0-5]?\d)$";
        private const string INTERVAL_START_TIME = "IntervalStartTime";
        private const string INTERVAL_END_TIME = "IntervalEndTime";

        private readonly CultureInfo _cultureInfo = new CultureInfo("en");
        private readonly IEnumerable<string> MissingValuesNomenclature = new List<string>()
        {
            "nan",
            "na",
            "?"
        };

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

        #region PublicMethods
        public void SaveUsedMetrics(Dictionary<string, bool> metricsInfo)
        {
            _metricsUsed = metricsInfo;
        }

        public IList<string[]> PreprocessMetricsData(string metricsData, string webServiceId, bool byRow = true, bool fromFile = true, bool isFiltered = true)
        {
            var cleanedUpMetricsData = CleanUpMetricsData(metricsData);
            var transformedMetricsData = TransformMetricsData(cleanedUpMetricsData, webServiceId, byRow, fromFile, isFiltered);

            return transformedMetricsData;
        }

        public IList<string[]> TransformMetricsData(string metricsData, string webServiceId, bool byRow = true,
            bool fromFile = true, bool isFiltered = true)
        {
            //var fileOutput = ReadTestData(webServiceId, fromFile);
            var fileLines = metricsData.Split(Environment.NewLine);
            var filteredFileLines = fileLines.Where(s => !String.IsNullOrWhiteSpace(s));
            var transformedFileLines = filteredFileLines.Select(x => x.Split(','));
            var trasformedMetricsData = HandleMetricsDataTransformation(transformedFileLines, webServiceId, byRow, fromFile,
                isFiltered);

            return trasformedMetricsData;
        }

        public IList<string[]> TransformMetricsData(IList<string[]> metricsData, string webServiceId, bool byRow = true,
            bool fromFile = true, bool isFiltered = true)
        {
            var transformedMetricsData = HandleMetricsDataTransformation(metricsData.AsEnumerable(), webServiceId, byRow, fromFile,
                isFiltered);
            return transformedMetricsData;
        }

        public string TransformMetricsData(IList<string[]> metricsData, string webServiceId, bool byRow = true,
            bool fromFile = true, bool isFiltered = true, bool toFileFormat = true)
        {
            //var transformedMetricsData = HandleMetricsDataTransformation(metricsData.AsEnumerable(), webServiceId, byRow, fromFile,
            //    isFiltered);
            var metricsDataInFileFormat = TranformToFileFormat(metricsData);

            return metricsDataInFileFormat;
        }

        public IList<string[]> CleanUpMetricsData(string metricsData)
        {
            try
            {
                var fileLines = metricsData.Split(Environment.NewLine);
                var fileLinesTransformed = fileLines.Select(x => x.Split(',')).ToList();

                CheckMetricsNames(fileLinesTransformed[0]);
                CheckIntervals(fileLinesTransformed);
                HandleDirtyValues(fileLinesTransformed);

                return fileLinesTransformed.ToList();
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        #endregion

        #region PrivateMethods
        private void HandleDirtyValues(List<string[]> fileLinesTransformed)
        {
            Dictionary<int, List<int>> dirtyValuesIndeces;
            Dictionary<int, List<double>> markeFileLines;

            FindDirtyValues(fileLinesTransformed, out dirtyValuesIndeces, out markeFileLines);
            ReplaceDirtyValues(fileLinesTransformed, dirtyValuesIndeces, markeFileLines);
        }

        private void FindDirtyValues(List<string[]> fileLinesTransformed, out Dictionary<int, List<int>> dirtyValuesIndeces, out Dictionary<int, List<double>> markeFileLines)
        {
            //List<double[]> fileLinesTranformed = new List<double[]>();
            //fileLinesParsed.Add(fileLinesTransformed.ElementAt(0));

            dirtyValuesIndeces = new Dictionary<int, List<int>>();
            markeFileLines = new Dictionary<int, List<double>>();
            double doubleFileLineValue;
            int intFileLineValue;
            string[] fileLine;
            string fileLineValue;
            double fileLineValueParsed = -1;

            for (int outerIndex = 1; outerIndex < fileLinesTransformed.Count(); outerIndex++)
            {
                fileLine = fileLinesTransformed[outerIndex];
                if (fileLine.Length <= 2)
                {
                    fileLinesTransformed.RemoveAt(outerIndex);
                    break;
                }
                //var fileLineTranformed = new double[fileLine.Length];
                //fileLineParesed[0] = fileLine[0];
                //fileLineParesed[1] = fileLine[1];

                for (int innerIndex = 2; innerIndex < fileLine.Length; innerIndex++)
                {
                    fileLineValue = fileLine[innerIndex].Trim();
                    doubleFileLineValue = -1;
                    intFileLineValue = -1;

                    //TODO: handle data like 12.3r56

                    if (
                        String.IsNullOrWhiteSpace(fileLineValue)
                        || MissingValuesNomenclature.Contains(fileLineValue.ToLower())
                        || fileLineValue.Any(c => Char.IsLetter(c))
                        || fileLineValue.Any(c => Char.IsSymbol(c))
                        || (!Double.TryParse(fileLineValue, NumberStyles.AllowDecimalPoint, _cultureInfo, out doubleFileLineValue)
                        && !Int32.TryParse(fileLineValue, NumberStyles.None, _cultureInfo, out intFileLineValue))
                       )
                    {
                        if (!dirtyValuesIndeces.ContainsKey(innerIndex))
                        {
                            dirtyValuesIndeces[innerIndex] = new List<int>();
                        }

                        dirtyValuesIndeces[innerIndex].Add(outerIndex);
                        fileLineValueParsed = -1;
                    } 
                    else
                    {
                        if (doubleFileLineValue != -1)
                        {
                            fileLineValueParsed = doubleFileLineValue;
                        }
                        else if (intFileLineValue != -1)
                        {
                            fileLineValueParsed = intFileLineValue;
                        }
                    }

                    if (!markeFileLines.ContainsKey(innerIndex))
                    {
                        markeFileLines[innerIndex] = new List<double>();
                    }

                    markeFileLines[innerIndex].Add(fileLineValueParsed);
                    //fileLineTranformed[outerIndex - 1] = fileLineValueParsed;
                }

                //fileLinesTranformed.Add(fileLineTranformed);
            }
        }

        private void ReplaceDirtyValues(List<string[]> fileLinesTransformed, Dictionary<int, List<int>> dirtyValuesIndeces, Dictionary<int, List<double>> markeFileLines)
        {
            foreach (var (key, value) in dirtyValuesIndeces)
            {
                var metricsVector = Vector<double>
                    .Build.DenseOfEnumerable(markeFileLines[key])
                    .Where(s => s != -1);

                var mean = Statistics.Mean(metricsVector);
                var standardDeviation = Statistics.StandardDeviation(metricsVector);

                double randomDouble;
                double sign;
                double replacement;
                bool isDouble = false;

                foreach (var item in value)
                {
                    randomDouble = StaticRandom.Instance.NextDouble();
                    sign = StaticRandom.Instance.Next(0, 2) == 0 ? -1 : 1;
                    replacement = mean + sign * randomDouble * standardDeviation;
                    isDouble = fileLinesTransformed.Select(line => line[key]).Any(lineValue => lineValue.Contains('.'));
                    if (!isDouble)
                    {
                        replacement = (int) replacement;
                    }
                    fileLinesTransformed[item][key] = replacement.ToString(_cultureInfo);
                }
            }
        }

        private void CheckMetricsNames(string[] metricsNames)
        {
            if (metricsNames[0] != INTERVAL_START_TIME || metricsNames[1] != INTERVAL_END_TIME
                || metricsNames.Skip(2).Any(metricName => !_metricsUsed.Keys.Contains(metricName)))
            {
                var metricsUsed = String.Join(", ", _metricsUsed.Keys.ToList());
                throw new Exception($"One or more metrics are not acceptable! The allowed metrics are {metricsUsed}.");
            }
        }

        private void CheckIntervals(List<string[]> fileLinesTransformed)
        {
            string[] fileLine;
            for (int i = 1; i < fileLinesTransformed.Count(); i++)
            {
                fileLine = fileLinesTransformed[i];

                if ((!Regex.IsMatch(fileLine[0].Trim(), INTERVAL_REGEX) || !Regex.IsMatch(fileLine[1].Trim(), INTERVAL_REGEX))
                    && fileLine.Count() > 2)
                {
                    throw new Exception($"The the value of the start or end interval on line {i + 1} is invalid! " +
                        "The accepted format is: HH:MM:SS where HH are hours (00-24), MM are minutes (00-59) and SS are minutes (00-59)");
                }
            }
        }

        private IList<string[]> HandleMetricsDataTransformation(IEnumerable<string[]> transformedFileLines,
            string webServiceId, bool byRow = true, bool fromFile = true, bool isFiltered = true)
        {
            ////var fileOutput = ReadTestData(webServiceId, fromFile);
            //var fileLines = metricsData.Split(Environment.NewLine);
            //var transformedFileLines = fileLines.Select(x => x.Split(','));
            IList<string[]> trasformedMetricsData;
            if (byRow)
            {
                trasformedMetricsData = TransformMetricsDataByRows(transformedFileLines, isFiltered);
            }
            else
            {
                trasformedMetricsData = TransformMetricsDataByColumns(transformedFileLines, isFiltered);
            }

            return trasformedMetricsData;
        }

        private static IList<string[]> TransformMetricsDataByColumns(IEnumerable<string[]> transformedFileLines, bool isFiltered)
        {
            IList<string[]> trasformedMetricsData = transformedFileLines
                .SelectMany(inner => inner.Select((item, index) => new { item, index }))
                .GroupBy(i => i.index, i => i.item)
                .Select(g => g.ToArray())
                .ToList();
            if (isFiltered && _metricsUsed != null)
            {
                var filteredMetricsData = trasformedMetricsData
                    .Where(metric => metric[0] == INTERVAL_START_TIME || metric[0] == INTERVAL_END_TIME ||
                    (_metricsUsed.ContainsKey(metric[0]) && _metricsUsed[metric[0]]))
                    .ToList();
                trasformedMetricsData = filteredMetricsData;
            }

            return trasformedMetricsData;
        }

        private static IList<string[]> TransformMetricsDataByRows(IEnumerable<string[]> transformedFileLines, bool isFiltered)
        {
            IList<string[]> trasformedMetricsData;
            if (isFiltered && _metricsUsed.Count != 0)
            {
                var metricsNames = transformedFileLines.ToList()[0];
                //if (metricsNames != _metricsUsed.Keys.ToArray())
                //{
                //    throw new ArgumentException("The inputed metrics data is in invalid format for transformation by rows!");
                //}

                var metricsIndeces = metricsNames
                    .Where(item => item == INTERVAL_START_TIME || item == INTERVAL_END_TIME ||
                    (_metricsUsed.ContainsKey(item) && _metricsUsed[item]))
                    .Select(item => metricsNames.ToList().IndexOf(item));
                var filteredMetricsData = transformedFileLines
                    .Select(metricsInfo => metricsInfo
                    .Where(item => metricsIndeces.Contains(metricsInfo.ToList().IndexOf(item))).ToArray())
                    .ToList();
                trasformedMetricsData = filteredMetricsData.Skip(1).ToList();
            }
            else
            {
                trasformedMetricsData = transformedFileLines.Skip(1).ToList();
            }

            return trasformedMetricsData;
        }

        private string TranformToFileFormat(IList<string[]> metricsData)
        {
            string fileLineFormatted;
            var metricsDataStringBuilder = new StringBuilder();

            foreach (var fileLine in metricsData)
            {
                fileLineFormatted = String.Join(",", fileLine);
                metricsDataStringBuilder.AppendLine(fileLineFormatted);
            }

            var metricsDataInFileFormat = metricsDataStringBuilder.ToString();

            return metricsDataInFileFormat;
        }
        #endregion
    }
}
