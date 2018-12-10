using AggregatedWebServiceQualityEstimation.Utils.Interfaces;
using Microsoft.Extensions.Configuration;
using System;
using System.Data.SqlClient;
using System.IO;

namespace AggregatedWebServiceQualityEstimation.Utils
{
    public class LoadTestDataManager : ITestDataManager
    {
        public readonly string loadTestFilePath = "loadTestResults.csv";

        private readonly string _combinedQuery = @"select ResponseTime, SuccessfulRequestsPerSecond, FailedRequestsPerSecond, ReceivedKilobytesPerSecond,
            SentKilobytesPerSecond, IntervalStartTime, IntervalEndTime from LoadTestDataForAllCharts";

        private readonly string _responceTimeQuery = "select distinct ComputedValue as ResponceTime, IntervalStartTime, IntervalEndTime "
            + "from LoadTestComputedCounterSample where LoadTestRunId = (select max(LoadTestRunId) from LoadTestComputedCounterSample) "
            + "and CategoryName = 'LoadTest:Request' "
            + "and CounterName = 'Avg. Response Time' "
            + "and IntervalStartTime <> IntervalEndTime";

        private readonly string _successfulRequestsPerSecondQuery = "select distinct ComputedValue as SuccessfulRequestsPerSecond, IntervalStartTime, IntervalEndTime "
            + "from LoadTestComputedCounterSample where LoadTestRunId = (select max(LoadTestRunId) from LoadTestComputedCounterSample) "
            + "and CategoryName = 'LoadTest:Request' "
            + "and CounterName = 'Passed Requests/Sec' "
            + "and IntervalStartTime <> IntervalEndTime";

        private readonly string _sentBytesPerSecondQuery = "select distinct ComputedValue AS SentBytesPerSecond, IntervalStartTime, IntervalEndTime "
            + "from LoadTestComputedCounterSample where LoadTestRunId = (select max(LoadTestRunId) from LoadTestComputedCounterSample) "
            + "and CategoryName = 'Network Interface' "
            + "and CounterName = 'Bytes Sent/sec' "
            + "and ComputedValue<> 0";

        private readonly string _receivedBytesPerSecondQuery = "select distinct ComputedValue AS ReceivedBytesPerSecond, IntervalStartTime, IntervalEndTime "
            + "from LoadTestComputedCounterSample where LoadTestRunId = (select max(LoadTestRunId) from LoadTestComputedCounterSample) "
            + "and CategoryName = 'Network Interface' "
            + "and CounterName = 'Bytes Received/sec' "
            + "and ComputedValue<> 0";

        private IConfiguration _configuration;

        public LoadTestDataManager(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public void WriteTestData()
        {
            string connectionString = _configuration.GetValue<string>("ConnectionString");
            string headers;
            string result;

            using (StreamWriter myFile = new StreamWriter(loadTestFilePath))
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    connection.Open();

                    SqlCommand command = new SqlCommand(_combinedQuery, connection)
                    {
                        CommandTimeout = 200
                    };

                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        try
                        {
                            headers = "IntervalStartTime,IntervalEndTime,ResponseTime,SuccessfulRequestsPerSecond,FailedRequestsPerSecond"
                                + ",SentKilobytesPerSecond,ReceivedKilobytesPerSecond";
                            myFile.WriteLine(headers);
                            while (reader.Read())
                            {
                                //var startTime = DateTime.ParseExact(reader["IntervalStartTime"].ToString(), "dd.mm.YY г. HH:mm:ss",
                                //        CultureInfo.CurrentCulture);

                                var startTime = GetTimeFromDataTimeString(reader["IntervalStartTime"].ToString());
                                var endTime = GetTimeFromDataTimeString(reader["IntervalEndTime"].ToString());
                                var responseTime = FixDecimalNumberSeparator(reader["ResponseTime"].ToString());
                                var successfulRequestsPerSecond = FixDecimalNumberSeparator(reader["SuccessfulRequestsPerSecond"].ToString());
                                var failedRequestsPerSecond = FixDecimalNumberSeparator(reader["FailedRequestsPerSecond"].ToString());
                                var sentKilobytesPerSecond = FixDecimalNumberSeparator(reader["SentKilobytesPerSecond"].ToString());
                                var receivedKilobytesPerSecond = FixDecimalNumberSeparator(reader["ReceivedKilobytesPerSecond"].ToString());                     
                                result = $"{startTime}, {endTime}, {responseTime}, {successfulRequestsPerSecond}, {failedRequestsPerSecond}," +
                                    $" {sentKilobytesPerSecond}, {receivedKilobytesPerSecond}";

                                myFile.WriteLine(result);
                            }
                        }
                        catch (Exception ex)
                        {
                            throw ex;
                        }
                    }
                }
            }
        }

        public void WriteTestData(string testData)
        {
            File.WriteAllText(loadTestFilePath, testData);
        }

        public string ReadTestData()
        {
            using (StreamReader myFile = new StreamReader(loadTestFilePath))
            {
                var result = myFile.ReadToEnd();
                return result;
            }
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
