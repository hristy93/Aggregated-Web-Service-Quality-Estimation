﻿import React, { Component } from 'react';
import { Button, Table } from 'react-bootstrap';
import connectToStores from 'alt-utils/lib/connectToStores';
import EstimationStore from '../../stores/EstimationStore';
import EstimationActions from '../../actions/EstimationActions';
import startCase from 'lodash/startCase';

const decimalPlacePrecision = 3;

class StatisticalEstimation extends Component {
    //static getStores() {
    //    return [EstimationStore];
    //}

    //static getPropsFromStores() {
    //    return ({
    //        statisticalData: EstimationStore.getStatisticalData()
    //    });
    //}

    render() {
        const {
            webServiceId,
            statisticalData,
            areOperationsDenied
        } = this.props;

        const statisticMetricNames = statisticalData.length === 0 ? [] : statisticalData[0];

        return (
            <div
                id={`statistical-estimation-${webServiceId}-web-service`}
                style={{ marginTop: "2rem" }}
            >
                <Button
                    id={`button-get-statistical-estimation-data-${webServiceId}-web-service`}
                    disabled={areOperationsDenied}
                    onClick={() => EstimationActions.getStatisticalEstimatorResult(webServiceId)}
                >
                    Get Statistical Data
                 </Button>
                <div
                    id={`statistical-estimation-data-${webServiceId}-web-service`}
                    style={{ marginTop: "1rem" }}>
                    <Table
                        id={`table-statistical-estimation-${webServiceId}-web-service`}
                        responsive
                        striped
                        bordered
                        condensed
                        hover
                    >
                        <thead id={`table-head-statistical-estimation-${webServiceId}-web-service`}>
                            <tr>
                            {
                                Object.keys(statisticMetricNames).map((item) => {
                                        return (
                                            <th key={item}>
                                                {startCase(item)}
                                            </th>
                                        );
                                })
                            }
                            </tr>
                        </thead>
                        <tbody id={`table-body-statistical-estimation-${webServiceId}-web-service`}>>
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
        );
    }
}

export default StatisticalEstimation;