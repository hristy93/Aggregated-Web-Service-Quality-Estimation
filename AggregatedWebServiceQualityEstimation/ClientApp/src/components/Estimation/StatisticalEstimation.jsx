import React, { Component } from 'react';
import { Table } from 'react-bootstrap';
import startCase from 'lodash/startCase';
import { toPercentage } from '../../utils/displayData';

const decimalPlacePrecision = 2;

class StatisticalEstimation extends Component {

    render() {
        const {
            webServiceId,
            statisticalData,
            loadTestData,
            metricsInfo
        } = this.props;

        const statisticMetricNames = statisticalData.length === 0 ? [] : statisticalData[0];
        const failedRequestCount = loadTestData.filter(item => parseInt(item.FailedRequestsPerSecond) !== 0).length;
        const requestsSuccessRate = (loadTestData.length - failedRequestCount) / loadTestData.length;

        return (
            <div
                id={`statistical-estimation-${webServiceId}-web-service`}
                style={{ marginTop: "2rem" }}
            >
                <div
                    id={`statistical-data-${webServiceId}-web-service`}
                    style={{ marginTop: "1rem" }}
                >
                    {   
                        (metricsInfo['SuccessfulRequestsPerSecond'] || metricsInfo['FailedRequestsPerSecond']) &&
                        <div
                            id={`requests-statistical-data-${webServiceId}-web-service`}
                            style={{ marginBottom: '2rem' }}
                        >
                            <h4>Requests Statistical Data</h4>
                            {
                                metricsInfo['SuccessfulRequestsPerSecond'] &&
                                <p> Success Rate: {toPercentage(requestsSuccessRate, decimalPlacePrecision)} </p>
                            }
                            {
                                metricsInfo['FailedRequestsPerSecond'] &&
                                <p> Failure Rate: {toPercentage((1 - requestsSuccessRate), decimalPlacePrecision)} </p>
                            }
                        </div>
                    }
                    <div
                        id={`full-statistical-data-${webServiceId}-web-service`}
                        style={{ marginBottom: '2rem' }}
                    >
                        <h4> Full Statistical Data </h4>
                        <Table
                            id={`table-${webServiceId}-web-service-statistical-estimation`}
                            responsive
                            striped
                            bordered
                            condensed
                            hover
                        >
                            <thead id={`table-header-${webServiceId}-web-service-statistical-estimation`}>
                                <tr>
                                {
                                    Object.keys(statisticMetricNames).map((item) => {
                                        if (!item.toLocaleLowerCase().includes("percentile")) {
                                            return (
                                                <th key={item}>
                                                    {item.toLocaleLowerCase().includes('name') ? `${startCase(item)} / Statistic Measure` : startCase(item)}
                                                </th>
                                            );
                                        }
                                    })
                                }
                                </tr>
                            </thead>
                            <tbody id={`table-body-${webServiceId}-web-service-statistical-estimation`}>
                            {
                                    statisticalData.map((item) => {
                                    return (
                                        <tr key={item.metricName}>
                                            <td sm={2}>
                                                <b>{startCase(item.metricName)}</b>
                                            </td>
                                            <td sm={2}>
                                                {Number(item.min.toFixed(decimalPlacePrecision))}
                                            </td>
                                            <td sm={2}>
                                                {Number(item.lowerQuartile.toFixed(decimalPlacePrecision))}
                                            </td>
                                            <td sm={2}>
                                                {Number(item.median.toFixed(decimalPlacePrecision))}
                                            </td>
                                            <td sm={2}>
                                                {Number(item.upperQuartile.toFixed(decimalPlacePrecision))}
                                            </td>
                                            <td sm={2}>
                                                {Number(item.max.toFixed(decimalPlacePrecision))}
                                            </td>
                                            <td sm={2}>
                                                {Number(item.mean.toFixed(decimalPlacePrecision))}
                                            </td>
                                            <td sm={2}>
                                                {Number(item.variance.toFixed(decimalPlacePrecision))}
                                            </td>
                                        </tr>
                                    );
                                })
                            }
                            </tbody>
                        </Table>
                    </div>
                </div>
            </div>
        );
    }
}

export default StatisticalEstimation;
export { StatisticalEstimation };