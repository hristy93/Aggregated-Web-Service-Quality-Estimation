namespace AggregatedWebServiceQualityEstimation.Utils.Interfaces
{
    public interface ITestModifier
    {
        void EditUrl(string url, bool isPost);
        void EditRequestBodyData(string data);

        bool EditDuration(string duration);
    }
}