using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;

namespace AggregatedWebServiceQualityEstimation.Utils
{
    public class LoadTestRunner : ITestRunner
    {
        private const string LOAD_TEST_CMD_ARGUMENTS = @"mstest /TestContainer:../PerformanceAndLoadTests/WebServiceLoadTest.loadtest";

        public void InitiateTest()
        {
            Process cmd = new Process();
            cmd.StartInfo.FileName = "cmd.exe";
            cmd.StartInfo.RedirectStandardInput = true;
            cmd.StartInfo.RedirectStandardOutput = true;
            cmd.StartInfo.CreateNoWindow = true;
            cmd.StartInfo.UseShellExecute = false;
            cmd.Start();

            cmd.StandardInput.WriteLine(LOAD_TEST_CMD_ARGUMENTS);
            cmd.StandardInput.Flush();
            cmd.StandardInput.Close();
            cmd.WaitForExit();
        }
    }
}
