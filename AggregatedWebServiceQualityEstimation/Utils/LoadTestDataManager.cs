using AggregatedWebServiceQualityEstimation.Utils.Interfaces;
using Microsoft.Extensions.Configuration;
using System;
using System.Data.SqlClient;
using System.IO;

namespace AggregatedWebServiceQualityEstimation.Utils
{
    public class LoadTestDataManager : ITestDataManager
    {
        public readonly string combinedQuery = @"select distinct ComputedValue AS ResponseTime, RequestsPerSecond, A.IntervalStartTime, A.IntervalEndTime 
 from LoadTestComputedCounterSample AS B join (
  select distinct ComputedValue AS RequestsPerSecond, IntervalStartTime, IntervalEndTime 
 from LoadTestComputedCounterSample
 where LoadTestRunId = (select max(LoadTestRunId)
						 from LoadTestComputedCounterSample) 
and CategoryName = 'LoadTest:Request'
and CounterName = 'Passed Requests/Sec') AS A ON B.IntervalStartTime = A.IntervalStartTime and B.IntervalEndTime = A.IntervalEndTime
 where LoadTestRunId = (select max(LoadTestRunId)
						 from LoadTestComputedCounterSample) 
and CategoryName = 'LoadTest:Request'
and CounterName = 'Avg. Response Time'
and A.IntervalStartTime <> A.IntervalEndTime
order by IntervalStartTime";

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
            string headers;
            string result;

            using (StreamWriter myFile = new StreamWriter(@"loadTestResults.csv"))
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    connection.Open();

                    SqlCommand responceTimeCommand = new SqlCommand(combinedQuery, connection);

                    using (SqlDataReader reader = responceTimeCommand.ExecuteReader())
                    {
                        try
                        {
                            headers = "IntervalStartTime,IntervalEndTime,ResponseTime,RequestsPerSecond";
                            myFile.WriteLine(headers);
                            while (reader.Read())
                            {
                                //var startTime = DateTime.ParseExact(reader["IntervalStartTime"].ToString(), "dd.mm.YY г. HH:mm:ss",
                                //        CultureInfo.CurrentCulture);

                                var startTime = GetTimeFromDataTimeString(reader["IntervalStartTime"].ToString());
                                var endTime = GetTimeFromDataTimeString(reader["IntervalEndTime"].ToString());
                                var responseTime = FixDecimalNumberSeparator(reader["ResponseTime"].ToString());
                                var requestsPerSecond = FixDecimalNumberSeparator(reader["RequestsPerSecond"].ToString());
                                result = $"{startTime}, {endTime}, {responseTime}, {requestsPerSecond}";

                                myFile.WriteLine(result);
                            }
                        }
                        catch (Exception ex)
                        {
                            throw ex;
                        }
                    }

                    //SqlCommand successfullRequestPerSecondCommand = new SqlCommand(SuccessfullRequestPerSecondQuery, connection);

                    //using (SqlDataReader reader = successfullRequestPerSecondCommand.ExecuteReader())
                    //{
                    //    try
                    //    {
                    //        headers += ",RequestPerSecondCommand";
                    //        myFile.WriteLine(headers);
                    //        while (reader.Read())
                    //        {
                    //            //var startTime = DateTime.ParseExact(reader["IntervalStartTime"].ToString(), "dd.mm.YY г. HH:mm:ss",
                    //            //        CultureInfo.CurrentCulture);

                    //            var startTime = GetTimeFromDataTimeString(reader["IntervalStartTime"].ToString());
                    //            var endTime = GetTimeFromDataTimeString(reader["IntervalEndTime"].ToString());
                    //            var computedValue = FixDecimalNumberSeparator(reader["ComputedValue"].ToString());
                    //            result += "endTime);

                    //            myFile.WriteLine(result);
                    //        }
                    //    }
                    //    catch (Exception ex)
                    //    {
                    //        throw ex;
                    //    }
                    //}
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
