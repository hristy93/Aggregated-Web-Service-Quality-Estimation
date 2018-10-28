using Microsoft.Extensions.Configuration;
using System;
using System.Data.SqlClient;
using System.Globalization;
using System.IO;

namespace AggregatedWebServiceQualityEstimation.Utils
{
    public class LoadTestDataManager : ITestDataManager
    {
        public readonly string ResponceTimeQuery = "select distinct ComputedValue, IntervalStartTime, IntervalEndTime "
            + "from LoadTestComputedCounterSample where LoadTestRunId = (select max(LoadTestRunId) from LoadTestComputedCounterSample) "
            + "and CategoryName = 'LoadTest:Request' "
            + "and CounterName = 'Avg. Response Time' "
            + "and IntervalStartTime <> IntervalEndTime";

        public readonly string SuccessfullRequestPerSecondQuery = "select distinct ComputedValue, IntervalStartTime, IntervalEndTime "
            + "from LoadTestComputedCounterSample where LoadTestRunId = (select max(LoadTestRunId) from LoadTestComputedCounterSample) "
            + "and CategoryName = 'LoadTest:Request' "
            + "and CounterName = 'Passed Requests/Sec' "
            + "and IntervalStartTime <> IntervalEndTime";

        private IConfiguration _configuration;

        public LoadTestDataManager(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public void WriteTestData()
        {
            string connectionString = _configuration.GetValue<string>("ConnectionString");
            using (StreamWriter myFile = new StreamWriter(@"loadTestResults.csv"))
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    SqlCommand command = new SqlCommand(ResponceTimeQuery, connection);

                    connection.Open();
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        try
                        {
                            var headers = "ResponseTime,IntervalStartTime,IntervalEndTime";
                            myFile.WriteLine(headers);
                            while (reader.Read())
                            {
                                //var startTime = DateTime.ParseExact(reader["IntervalStartTime"].ToString(), "dd.mm.YY г. HH:mm:ss",
                                //        CultureInfo.CurrentCulture);

                                var startTime = GetTimeFromDataTimeString(reader["IntervalStartTime"].ToString());
                                var endTime = GetTimeFromDataTimeString(reader["IntervalEndTime"].ToString());
                                var computedValue = FixDecimalNumberSeparator(reader["ComputedValue"].ToString());
                                var result = String.Format("{0}, {1}, {2}", computedValue, startTime, endTime);

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

        public string ReadTestData()
        {
            using (StreamReader myFile = new StreamReader(@"loadTestResults.csv"))
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

        private string FixDecimalNumberSeparator(string decimalNumer)
        {
            return decimalNumer.Replace(',', '.');
        }
    }
}
