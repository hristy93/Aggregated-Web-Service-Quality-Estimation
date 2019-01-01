using Newtonsoft.Json;

namespace AggregatedWebServiceQualityEstimation.Models
{
    public class WebServiceData
    {
        [JsonProperty(PropertyName = "webServiceId")]
        public string WebServiceId { get; set; }

        [JsonProperty(PropertyName = "url")]
        public string Url { get; set; }

        [JsonProperty(PropertyName = "body")]
        public object Body { get; set; }
    }
}