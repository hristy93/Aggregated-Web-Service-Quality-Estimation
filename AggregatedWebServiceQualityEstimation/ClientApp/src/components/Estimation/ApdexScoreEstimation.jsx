import React, { Component } from 'react';
import connectToStores from 'alt-utils/lib/connectToStores';
import { Button } from 'react-bootstrap';
import LineChart from '../common/LineChart/LineChart';
import EstimationActions from '../../actions/EstimationActions';
import EstimationStore from '../../stores/EstimationStore';
import LoadTestChartsStore from '../../stores/LoadTestChartsStore';
import LoadTestMetricsStore from '../../stores/LoadTestMetricsStore';

const decimalPlacePrecision = 2;

class ApdexScoreEstimation extends Component {
    //static getStores() {
    //    return [LoadTestChartsStore, EstimationStore];
    //}

    //static getPropsFromStores() {
    //    return ({
    //        apdexScoreLimit: EstimationStore.getApdexScoreLimit(),
    //        apdexScoreData: EstimationStore.getApdexScoreData(),
    //        chartsLinesData: LoadTestChartsStore.getChartsLinesData(),
    //        brushStartIndex: LoadTestChartsStore.getBrushStartIndex(),
    //        brushEndIndex: LoadTestChartsStore.getBrushEndIndex(),
    //        areReferenceLinesVisible: LoadTestChartsStore.getReferenceLinesVisibility(),
    //        syncCharts: LoadTestChartsStore.getSyncCharts(),
    //        metricsInfo: LoadTestMetricsStore.getMetricsInfo()
    //    });
    //}

    handleApdexScoreLimitChange = (event) => {
        const apdexScoreLimit = event.target.value;
        const { webServiceId } = this.props;

        EstimationActions.setApdexScoreLimit({ apdexScoreLimit, webServiceId});
    }

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

        const averageApdexScore = (apdexScoreData.map((apdexScoreItem) => apdexScoreItem.ApdexScore)
            .reduce((a, b) => a + b, 0) / apdexScoreData.length).toFixed(decimalPlacePrecision);
        const isApdexScoreChartVisible = apdexScoreData.length !== 0 && metricsInfo["ResponseTime"];
        const isApdexScoreButtonDisabled = !apdexScoreLimit || !metricsInfo["ResponseTime"];

        return (
            <div id="apdex-estimation" style={{ marginTop: "2rem" }}>
                <Button
                    id="get-apdex-estimation-button"
                    disabled={isApdexScoreButtonDisabled}
                    onClick={() => EstimationActions.getApdexScoreEstimatorResult({ apdexScoreLimit, webServiceId })}
                >
                    Get Apdex Score Data
                </Button>
                <div id="apdex-estimation-header">
                    <h4><b>Apdex Estimaton Data</b></h4>
                </div>
                {
                    isApdexScoreChartVisible &&
                    <div id="apdex-estimation-summary">
                        <h4> Apdex Score Limit: {apdexScoreLimit} </h4>
                        <h4> Average Apdex Score: {averageApdexScore}% </h4>
                    </div>
                }
                <div id="apdex-estimation-data" style={{ marginTop: "1rem" }}>
                    <LineChart
                        axisXKey="IntervalStartTime"
                        //axisXLabel="Time Intervals"
                        data={apdexScoreData}
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