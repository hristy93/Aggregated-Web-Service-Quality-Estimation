using Newtonsoft.Json;

namespace AggregatedWebServiceQualityEstimation.Models
{
    public class PostData
    {
        [JsonProperty(PropertyName = "url")]
        public string Url { get; set; }

        [JsonProperty(PropertyName = "body")]
        public object Value { get; set; }

        [JsonProperty(PropertyName = "duration")]
        public string Duration { get; set; }
    }
}