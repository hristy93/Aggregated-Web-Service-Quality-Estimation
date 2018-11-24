namespace AggregatedWebServiceQualityEstimation.Utils.Interfaces
{
    public interface ITestDataManager
    {
        void WriteTestData();
        void WriteTestData(string testData);
        string ReadTestData();
    }
}