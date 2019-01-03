using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace AggregatedWebServiceQualityEstimation.Models
{
    public class WebServiceData
    {
        [JsonProperty(PropertyName = "webServiceId")]
        [Required]
        public string WebServiceId { get; set; }

        [JsonProperty(PropertyName = "url")]
        [Required]
        public string Url { get; set; }

        [JsonProperty(PropertyName = "body")]
        public object Body { get; set; }
    }
}