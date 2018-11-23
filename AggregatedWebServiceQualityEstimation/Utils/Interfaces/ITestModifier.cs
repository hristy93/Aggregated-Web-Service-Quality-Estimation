namespace AggregatedWebServiceQualityEstimation.Utils.Interfaces
{
    public interface ITestModifier
    {
        void EditUrl(string url, bool isPost);
        void AddRequestBodyData(string data);
    }
}