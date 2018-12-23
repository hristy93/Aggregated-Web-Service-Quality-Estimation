import React, { Component } from 'react';
import connectToStores from 'alt-utils/lib/connectToStores';
import { Button } from 'react-bootstrap';
import isNil from 'lodash/isNil';
import LineChart from '../common/LineChart/LineChart';
import EstimationActions from '../../actions/EstimationActions';
import EstimationStore from '../../stores/EstimationStore';
import LoadTestChartsStore from '../../stores/LoadTestChartsStore';

const decimalPlacePrecision = 3;

class ApdexScoreEstimation extends Component {
    static getStores() {
        return [LoadTestChartsStore, EstimationStore];
    }

    static getPropsFromStores() {
        return ({
            apdexScoreLimit: EstimationStore.getApdexScoreLimit(),
            apdexScoreData: EstimationStore.getApdexScoreData(),
            chartsLinesData: LoadTestChartsStore.getChartsLinesData(),
            brushStartIndex: LoadTestChartsStore.getBrushStartIndex(),
            brushEndIndex: LoadTestChartsStore.getBrushEndIndex(),
            areReferenceLinesVisible: LoadTestChartsStore.getReferenceLinesVisibility(),
            syncCharts: LoadTestChartsStore.getSyncCharts(),
        });
    }

    handleApdexScoreLimitChange = (event) => {
        const inputValue = event.target.value;

        EstimationActions.setApdexScoreLimit(inputValue);
    }

    render() {
        const {
            apdexScoreLimit,
            apdexScoreData,
            chartsLinesData,
            brushStartIndex,
            brushEndIndex,
            brushOnChange,
            syncCharts
        } = this.props;

        const averageApdexScore = (apdexScoreData.map((apdexScoreItem) => apdexScoreItem.ApdexScore)
            .reduce((a, b) => a + b, 0) / apdexScoreData.length).toFixed(decimalPlacePrecision);

        return (
            <div>
                <Button
                    id="get-apdex-estimation-button"
                    disabled={isNil(apdexScoreLimit)}
                    onClick={() => EstimationActions.getApdexScoreEstimatorResult(apdexScoreLimit)}
                >
                    Get Apdex Score Data
                </Button>
                <h4> Apdex Score Limit: {apdexScoreLimit} </h4>
                { apdexScoreData.length !== 0 && <h4> Average Apdex Score: {averageApdexScore} </h4> }
                <LineChart
                    axisXKey="IntervalStartTime"
                    data={apdexScoreData}
                    lines={chartsLinesData['apdexScore']}
                    brushOnChange={brushOnChange}
                    brushStartIndex={brushStartIndex}
                    brushEndIndex={brushEndIndex}
                    syncChart={syncCharts}
                />
            </div>    
            );
        }
    }
    
export default connectToStores(ApdexScoreEstimation);