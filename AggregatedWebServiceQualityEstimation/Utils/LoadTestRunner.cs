using AggregatedWebServiceQualityEstimation.Utils.Interfaces;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace AggregatedWebServiceQualityEstimation.Utils
{
    [ExcludeFromCodeCoverage]
    public class LoadTestRunner : ITestRunner
    {
        private const string CMD_PROCESS_NAME = "cmd.exe";
        private const string MSTEST_PROCESS_NAME = "MSTest";
        private const string LOAD_TEST_CMD_ARGUMENTS = @"mstest /TestContainer:../PerformanceAndLoadTests/WebServiceLoadTest.loadtest";

        public void InitiateTest()
        {
            Process cmd = new Process();
            cmd.StartInfo.FileName = CMD_PROCESS_NAME;
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

        public void CancelTest()
        {
            try
            {
                var testProcess = GetTestProcess();
                testProcess?.Kill();
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public bool IsTestRunning() => GetTestProcess() != null;

        private Process GetTestProcess() => Process.GetProcessesByName(MSTEST_PROCESS_NAME).FirstOrDefault();
    }
}
