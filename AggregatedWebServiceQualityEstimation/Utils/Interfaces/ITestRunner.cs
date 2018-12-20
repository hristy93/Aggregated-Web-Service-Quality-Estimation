namespace AggregatedWebServiceQualityEstimation.Utils.Interfaces
{
    public interface ITestRunner
    {
        void InitiateTest();
        void CancelTest();
        bool IsTestRunning();
    }
}