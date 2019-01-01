namespace AggregatedWebServiceQualityEstimation.Utils.Interfaces
{
    public interface ITestModifier
    {
        void EditUrl(string url, bool isPost, string webServiceId);
        void EditRequestBodyData(string data, bool isPostRequest, string webServiceId);
        bool EditDuration(string duration);
    }
}