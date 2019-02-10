import React, { Component } from 'react';
import {
    Button,
    ListGroup,
    ListGroupItem
} from 'react-bootstrap';
import isNil from 'lodash/isNil';
import isEmpty from 'lodash/isEmpty';
import startCase from 'lodash/startCase';
import EstimationActions from '../../actions/EstimationActions';
import isNumber from 'lodash/isNumber';
import { toPercentage } from '../../utils/displayData';

const decimalPlacePrecision = 2;

const clusterEstimatorResultMetricsMapping = {
    "potential": "Average consistent metrics data",
    "center": "Center",
    "density": "Consistency",
    "spread": "Scope"
};

class ClusterEstimation extends Component {

    clusterEstimatonRenderer = (
        clusterData,
        metricsInfo,
        loadTestDataSize,
        webServiceId
    ) => {
        const metricsUsed = Object.keys(metricsInfo).filter((key) => metricsInfo[key]);
        const result = clusterData.map((item, index) => {
            const cluster = Object.keys(item).map((key, index) => {
                const value = item[key];
                let formattedValue;

                if (isNumber(value)) {
                    if (key === 'spread') {
                        formattedValue = toPercentage(value, decimalPlacePrecision);
                    } else if (key === 'density') {
                        formattedValue = toPercentage(1 - value, decimalPlacePrecision);
                    } else if (key === 'potential') {
                        formattedValue = `${value.toFixed(decimalPlacePrecision)} / ${loadTestDataSize}`;
                    }

                    return (
                            <h4
                                key={`cluster-${index}-info-${key}`}
                                id={`${webServiceId}-web-service-cluster-${index}-info-${key}`}
                            >
                            {`${clusterEstimatorResultMetricsMapping[key]}: ${formattedValue}`}
                            </h4>
                    );
                } else {
                    return (
                        <React.Fragment key={`${key}-${index}`}>
                            <h4
                                key={`${key}-${index}`}
                                id={`${webServiceId}-web-service-cluster-${index}-info-${key}`}
                            >
                                {clusterEstimatorResultMetricsMapping[key]} Coordinates:
                            </h4>
                            {
                                value.map((item, index) => {
                                    return (
                                        <h5
                                            key={`${key}-value-${index}`}
                                            id={`${webServiceId}-web-service-cluster-${index}-info-${key}-${item}`}
                                            style={{ marginLeft: '1rem' }}
                                        >
                                            {`${startCase(metricsUsed[index])}: ${item}`}
                                        </h5>
                                    ); 
                                })
                            }
                        </React.Fragment>
                    );
                }
            });

            return (
                <ListGroupItem
                    key={`cluster-${index}-data`}
                    id={`${webServiceId}-web-service-cluster-${index}-data`}
                    style={{ marginBottom: '2rem' }}
                >
                    <h4><b> Metrics Grouping {index + 1} </b></h4>
                    {cluster}
                    <br />
                </ListGroupItem>
            );
        });

        return result;
    }

    render() {
        const {
            webServiceId,
            clusterData,
            metricsInfo,
            loadTestDataSize,
            areOperationsDenied
       } = this.props;

        let outliersPercentage;
        const isClusterDataVisible = !isNil(clusterData) && !isEmpty(clusterData);
        if (isClusterDataVisible) {
            outliersPercentage = (1 - clusterData
                .map(item => item.spread)
                .reduce((sum, item) => sum += item, 0));
        }

        return (
            <div
                id={`cluster-estimation-${webServiceId}-web-service`}
                style={{ marginTop: "2rem" }}
            >
                {/*<Button
                    id={`button-get=cluster-estimation-${webServiceId}-web-service`}
                    disabled={areOperationsDenied}
                    onClick={() => EstimationActions.getClusterEstimatorResult(webServiceId)}
                >
                    Get Metrics Consistency Data
                </Button>*/} 
                {
                    isClusterDataVisible && 
                    <div id="cluster-estimation-data" style={{ marginTop: "1rem" }}>
                        <ListGroup>
                            {this.clusterEstimatonRenderer(clusterData, metricsInfo, loadTestDataSize, webServiceId)}
                        
                            <ListGroupItem
                                id="outliers-data"
                                style={{ backgroundColor: 'rgba(0,0,0,.03)'}}
                            >
                                <h4>
                                    <b>Data not in a group: </b>
                                    {toPercentage(outliersPercentage, decimalPlacePrecision)}
                                </h4>
                            </ListGroupItem>
                        </ListGroup>
                    </div>
                }
            </div> 
            );
        }
    }
    
export default ClusterEstimation;