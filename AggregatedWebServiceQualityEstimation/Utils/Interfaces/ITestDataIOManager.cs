using Microsoft.AspNetCore.Http;
using System.Collections.Generic;

namespace AggregatedWebServiceQualityEstimation.Utils.Interfaces
{
    public interface ITestDataIOManager
    {
        void WriteTestData(string webServiceId);
        void WriteTestData(string testData, string webServiceId);
        string ReadTestData(string webServiceId, bool fromFile, string filepath="");
        string UploadTestData(IFormFile file);
        string GetTestDataFromDatabase(string webServiceId);
    }
}