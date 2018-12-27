﻿import React, { Component } from 'react';
import { Button, Table } from 'react-bootstrap';
import connectToStores from 'alt-utils/lib/connectToStores';
import EstimationStore from '../../stores/EstimationStore';
import EstimationActions from '../../actions/EstimationActions';
import startCase from 'lodash/startCase';

const decimalPlacePrecision = 3;

class StatisticalEstimation extends Component {
    static getStores() {
        return [EstimationStore];
    }

    static getPropsFromStores() {
        return ({
            statisticalData: EstimationStore.getStatisticalData()
        });
    }

    render() {
        const { statisticalData } = this.props;
        const statisticMetricNames = statisticalData.length === 0 ? [] : statisticalData[0];

        return (
            <div id="statistical-estimation" style={{ marginTop: "2rem" }}>
                <Button
                    id="get-statistical-estimation-button"
                    //disabled={areOperationsDenied}
                    onClick={EstimationActions.getStatisticalEstimatorResult}
                >
                    Get Statistical Data
                 </Button>
                <div id="statistical-header">
                    <h4><b>Statistical Data</b></h4>
                </div>
                <div id="statistical-data" style={{ marginTop: "1rem" }}>
                    <Table
                        responsive
                        striped
                        bordered
                        condensed
                        hover
                    >
                        <thead>
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
                        <tbody>
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

export default connectToStores(StatisticalEstimation);