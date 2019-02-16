import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import LineChart from '../common/LineChart/LineChart';
import EstimationActions from '../../actions/EstimationActions';
import isNil from 'lodash/isNil';
import isEmpty from 'lodash/isEmpty';

const decimalPlacePrecision = 2;

class ApdexScoreEstimation extends Component {
    render() {
        const {
            webServiceId,
            apdexScoreLimit,
            apdexScoreData,
            chartsLinesData,
            metricsInfo,
            brushStartIndex,
            brushEndIndex,
            brushOnChange,
            syncCharts
        } = this.props;

        const isApdexScoreChartVisible = !isEmpty(apdexScoreData) && metricsInfo["ResponseTime"];
        const isApdexScoreButtonDisabled = !apdexScoreLimit || !metricsInfo["ResponseTime"];
        const isApdexScoreLimitSet = !isNil(apdexScoreLimit);

        let newApdexScoreLimit;
        if (!isApdexScoreLimitSet && !isEmpty(apdexScoreData)) {
            newApdexScoreLimit = apdexScoreData.initialApdexScoreLimit.toFixed(decimalPlacePrecision);
            EstimationActions.setApdexScoreLimit.defer({
                apdexScoreLimit: newApdexScoreLimit,
                webServiceId
            });
        }

        return (
            <div id="apdex-estimation" style={{ marginTop: "2rem" }}>
                {
                    !isEmpty(apdexScoreData) &&
                    <Button
                        id={`button-get-apdex-estimation-${webServiceId}-web-service`}
                        disabled={isApdexScoreButtonDisabled}
                        onClick={() => EstimationActions.getApdexScoreEstimatorResult({
                            apdexScoreLimit: isApdexScoreLimitSet ? apdexScoreLimit : newApdexScoreLimit,
                            webServiceId
                        })}
                    >
                        Get Apdex Score Data
                    </Button>
                }
                {
                    isApdexScoreChartVisible && !isEmpty(apdexScoreData) &&
                    <div id={`apdex-estimation-summary-${webServiceId}-web-service`}>
                        <h4> Apdex Score Limit: {apdexScoreLimit} </h4>
                        <h4> Average Apdex Score: {apdexScoreData.averageApdexScoreEstimation.toFixed(decimalPlacePrecision)}% </h4>
                        <h4> Apdex Score Rating: {apdexScoreData.apdexScoreEstimationRating} </h4>
                    </div>
                }
                <div id="apdex-estimation-data" style={{ marginTop: "1rem" }}>
                    <LineChart
                        id={`apdex-estimation-chart-${webServiceId}-web-service`}
                        axisXKey="IntervalStartTime"
                        //axisXLabel="Time Intervals"
                        data={!isNil(apdexScoreData.apdexScoreEstimations) ? apdexScoreData.apdexScoreEstimations : []}
                        //axisYLabel="Apdex Score"
                        axisYUnit="%"
                        lines={chartsLinesData['apdexScore']}
                        brushOnChange={brushOnChange}
                        brushStartIndex={brushStartIndex}
                        brushEndIndex={brushEndIndex}
                        syncChart={syncCharts}
                        isVisible={isApdexScoreChartVisible}
                    />
                </div>
            </div>    
            );
        }
    }
    
export default ApdexScoreEstimation;
export { ApdexScoreEstimation };