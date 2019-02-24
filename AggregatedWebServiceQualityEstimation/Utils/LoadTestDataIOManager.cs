using AggregatedWebServiceQualityEstimation.Utils.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Text;

namespace AggregatedWebServiceQualityEstimation.Utils
{
    public class LoadTestDataIOManager : ITestDataIOManager
    {
        public readonly string loadTestFirstServiceFilePath = "loadTestResults-1.csv";
        public readonly string loadTestSecondServiceFilePath = "loadTestResults-2.csv";

        private readonly string _combinedQuery = @"select ResponseTime, SuccessfulRequestsPerSecond, FailedRequestsPerSecond, ReceivedKilobytesPerSecond, 
            IntervalStartTime, IntervalEndTime from LoadTestDataForAllChartsDualServices";
        private IConfiguration _configuration;
        private static Dictionary<string, bool> _metricsUsed = new Dictionary<string, bool>()
        {
            ["ResponseTime"] = true,
            ["SuccessfulRequestsPerSecond"] = true,
            ["FailedRequestsPerSecond"] = true,
            ["ReceivedKilobytesPerSecond"] = true,
        };

        public LoadTestDataIOManager(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public void WriteTestData(string webServiceId)
        {
            var testData = GetTestDataFromDatabase(webServiceId);
            WriteTestData(testData, webServiceId);
        }

        public void WriteTestData(string testData, string webServiceId)
        {
            var loadTestFilePath = webServiceId == "first" ? loadTestFirstServiceFilePath : loadTestSecondServiceFilePath;
            File.WriteAllText(loadTestFilePath, testData);
        }

        public string ReadTestData(string webServiceId, bool fromFile = true)
        {
            string result = "";

            try
            {
                if (fromFile)
                {
                    var loadTestFilePath = webServiceId == "first" ? loadTestFirstServiceFilePath : loadTestSecondServiceFilePath;
                    using (StreamReader myFile = new StreamReader(loadTestFilePath))
                    {
                        result = myFile.ReadToEnd();
                    }
                }
                else
                {
                    result = GetTestDataFromDatabase(webServiceId);
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }

            return result;
        }

        public string UploadTestData(IFormFile file)
        {
            string fileContent = null;

            using (MemoryStream data = new MemoryStream())
            {
                using (Stream fileStream = file.OpenReadStream())
                {
                    fileStream.CopyTo(data);
                    var buffer = data.ToArray();
                    fileContent = Encoding.UTF8.GetString(buffer, 0, buffer.Length);
                }
            }

            return fileContent;
        }

        private string GetTestDataFromDatabase(string webServiceId)
        {
            StringBuilder testDataBuilder = new StringBuilder();
            string connectionString = _configuration.GetValue<string>("ConnectionString");
            string headers;
            string result;
            string webServiceName = webServiceId == "first" ? "FirstWebService" : "SecondWebService";
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();

                SqlCommand command = new SqlCommand(_combinedQuery + $" where RequestUri = '{webServiceName}'", connection)
                {
                    CommandTimeout = 200
                };

                using (SqlDataReader reader = command.ExecuteReader())
                {
                    try
                    {
                        headers = "IntervalStartTime,IntervalEndTime,ResponseTime,SuccessfulRequestsPerSecond,FailedRequestsPerSecond"
                            + ",ReceivedKilobytesPerSecond";
                        testDataBuilder.AppendLine(headers);

                        while (reader.Read())
                        {
                            var startTime = GetTimeFromDataTimeString(reader["IntervalStartTime"].ToString());
                            var endTime = GetTimeFromDataTimeString(reader["IntervalEndTime"].ToString());
                            var responseTime = FixDecimalNumberSeparator(reader["ResponseTime"].ToString());
                            var successfulRequestsPerSecond = FixDecimalNumberSeparator(reader["SuccessfulRequestsPerSecond"].ToString());
                            var failedRequestsPerSecond = FixDecimalNumberSeparator(reader["FailedRequestsPerSecond"].ToString());
                            var receivedKilobytesPerSecond = FixDecimalNumberSeparator(reader["ReceivedKilobytesPerSecond"].ToString());
                            result = $"{startTime}, {endTime}, {responseTime}, {successfulRequestsPerSecond}, {failedRequestsPerSecond}," +
                                $" {receivedKilobytesPerSecond}";

                            testDataBuilder.AppendLine(result);
                        }
                    }
                    catch (Exception ex)
                    {
                        throw ex;
                    }
                }
            }

            string testData = testDataBuilder.ToString();
            return testData;
        }

        private string GetTimeFromDataTimeString(string dateTime)
        {
            var startOfTimeIndex = dateTime.IndexOf('г') + 3;
            var dateTimeAsTime = dateTime.Substring(startOfTimeIndex);
            return dateTimeAsTime;
        }

        private string FixDecimalNumberSeparator(string decimalNumber)
        {
            return decimalNumber.Replace(',', '.');
        }
    }
}
