using Microsoft.Extensions.Configuration;
using System;
using System.Data.SqlClient;
using System.Globalization;
using System.IO;

namespace AggregatedWebServiceQualityEstimation.Utils
{
    public class LoadTestDataManager
    {
        public readonly string ResponceTimeQuery = "select distinct ComputedValue, IntervalStartTime, IntervalEndTime "
            + "from LoadTestComputedCounterSample where LoadTestRunId = (select max(LoadTestRunId) from LoadTestComputedCounterSample) "
            + "and CategoryName = 'LoadTest:Request' "
            + "and CounterName = 'Avg. Response Time'";

        public readonly string SuccessfullRequestPerSecondQuery = "select distinct ComputedValue, IntervalStartTime, IntervalEndTime "
            + "from LoadTestComputedCounterSample where LoadTestRunId = (select max(LoadTestRunId) from LoadTestComputedCounterSample) "
            + "and CategoryName = 'LoadTest:Request' "
            + "and CounterName = 'Passed Requests/Sec'";

        private IConfiguration _configuration;

        public LoadTestDataManager(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public void GetLoadTestData()
        {
            string connectionString = _configuration.GetValue<string>("ConnectionString");
            using (StreamWriter myFile = new StreamWriter(@"fileCSharp.txt"))
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    SqlCommand command = new SqlCommand(ResponceTimeQuery, connection);

                    connection.Open();
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        try
                        {
                            while (reader.Read())
                            {
                                var startTime = DateTime.ParseExact(reader["IntervalStartTime"].ToString(), "dd.mm.YY HH:mm:ss",
                                        CultureInfo.CurrentCulture);
                                var computedValue = reader["ComputedValue"].ToString().Replace(',', '.');
                                var result = String.Format("{0}, {1}, {2}",
                                computedValue, reader["IntervalStartTime"], reader["IntervalEndTime"]);

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
    }
}
