const clusterEstimatorResult = [
    {
        "potential": 56.53,
        "center": [
            0.06,
            7,
            0,
            13.06
        ],
        "density": 0.02,
        "spread": 1
    }
];

const statisticalEstimatorResult = [{
    "metricName": "ResponseTime",
    "min": 0.66,
    "lowerQuartile": 0.68,
    "median": 0.72,
    "upperQuartile": 0.82,
    "max": 3.90,
    "mean": 0.80,
    "variance": 0.10,
    "percentile95": 1.15,
    "percentile99": 2.65,
    "percentageAbovePercentile95": 0.05,
    "percentageAbovePercentile99": 0.01
}];

const apdexScoreEstimatorResult = {
    "apdexScoreEstimations": [
        {
            "IntervalStartTime": "15:55:38",
            "IntervalEndTime": "15:55:43",
            "ApdexScore": 50
        },
        {
            "IntervalStartTime": "15:55:43",
            "IntervalEndTime": "15:55:48",
            "ApdexScore": 75
        },
    ],
    "averageApdexScoreEstimation": 92.34,
    "apdexScoreEstimationRating": "Good",
    "initialApdexScoreLimit": 0.08
};

const metricsUsabilityInfo = {
    "ResponseTime": true,
    "SuccessfulRequestsPerSecond": false,
    "FailedRequestsPerSecond": true,
    "ReceivedKilobytesPerSecond": true
};

const runTestsGetArgs = [
    {
        "webServiceId": "first",
        "url": "https://jsonplaceholder.typicode.com/todos/111"
    },
    {
        "webServiceId": "second",
        "url": "https://jsonplaceholder.typicode.com/todos/222"
    }
];

const runTestsPostArgs = [
    {
        "webServiceId": "first",
        "url": "https://jsonplaceholder.typicode.com/posts",
        "body": {
            "title": "foo1",
            "body": "bar1",
            "userId": 1
		}
    },
    {
        "webServiceId": "second",
        "url": "https://jsonplaceholder.typicode.com/posts",
        "body": {
            "title": "foo2",
            "body": "bar2",
            "userId": 1
		}
    }
];

const testsData = [
    {
        FailedRequestsPerSecond: "0",
        IntervalEndTime: "21:20:09",
        IntervalStartTime: "21:20:04",
        ReceivedKilobytesPerSecond: "3.025",
        ResponseTime: "1.04075",
        SuccessfulRequestsPerSecond:  "0.8"
    },
    {
        FailedRequestsPerSecond: "0",
        IntervalEndTime: "21:20:14",
        IntervalStartTime: "21:20:09",
        ReceivedKilobytesPerSecond: "3.025",
        ResponseTime: "0.7015",
        SuccessfulRequestsPerSecond: "1.2"
    }
];

const chartsLinesData = {
    responseTime: [{
        axisYKey: "ResponseTime",
        color: "#00BFFF",
        isLineVisible: true,
        areReferenceLinesVisible: true
    }],
    requests: [{
        axisYKey: "SuccessfulRequestsPerSecond",
        color: "#32CD32",
        isLineVisible: true,
        areReferenceLinesVisible: true
    }, {
        axisYKey: "FailedRequestsPerSecond",
        color: "#F31111",
        isLineVisible: true,
        areReferenceLinesVisible: true
    }],
    throughput: [{
        axisYKey: "ReceivedKilobytesPerSecond",
        color: "#6319FF",
        isLineVisible: true,
        areReferenceLinesVisible: true
    }],
    apdexScore: [{
        axisYKey: "ApdexScore",
        color: "#00FFFF",
        isLineVisible: true,
        areReferenceLinesVisible: true
    }]
};

const getFakeUploadedFile = (contentSize) => {
    const name = "metrics.csv";
    const mimeType = 'text/csv';

    const getFileContent = (count) => {
        var output = "";
        for (var i = 0; i < count; i++) {
            output += "a";
        }
        return output;
    };

    let blob = new Blob([getFileContent(contentSize)], { type: mimeType });
    blob.lastModifiedDate = new Date();
    blob.name = name;

    return blob;
};

const metricsInfo = {
    "ResponseTime": true,
    "SuccessfulRequestsPerSecond": true,
    "FailedRequestsPerSecond": true,
    "ReceivedKilobytesPerSecond": true
};

export {
    clusterEstimatorResult,
    statisticalEstimatorResult,
    apdexScoreEstimatorResult,
    metricsUsabilityInfo,
    runTestsGetArgs,
    runTestsPostArgs,
    testsData,
    chartsLinesData,
    metricsInfo,
    getFakeUploadedFile
};