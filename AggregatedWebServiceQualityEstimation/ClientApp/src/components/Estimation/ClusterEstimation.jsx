import React, { Component } from 'react';
import connectToStores from 'alt-utils/lib/connectToStores';
import { Button } from 'react-bootstrap';
import isNil from 'lodash/isNil';
import isEmpty from 'lodash/isEmpty';
import startCase from 'lodash/startCase';
import EstimationActions from '../../actions/EstimationActions';
import EstimationStore from '../../stores/EstimationStore';
import isNumber from 'lodash/isNumber';

const decimalPlacePrecision = 2;

class ClusterEstimation extends Component {

    clusterEstimatonRenderer = (clusterData) => {
        const result = clusterData.map((item, index) => {
            const cluster = Object.keys(item).map((key, index) => {
                const value = item[key];
                if (isNumber(value)) {
                    return (
                            <h4 key={`${key}-${index}`}>
                            {`${startCase(key)}: `}
                            {
                                key !== 'spread' ?
                                   value.toFixed(decimalPlacePrecision) :
                                   `${(value * 100).toFixed(decimalPlacePrecision)}%`
                            }
                            </h4>
                    );
                } else {
                    return (
                        <>
                            <h4 key={`${key}-${index}`}>
                                {startCase(key)} Coordinates:
                            </h4>
                            {
                                value.map((item, index) => {
                                    return (
                                        <h5 key={`${key}-value-${index}`}> {item} </h5>
                                    ); 
                                })
                            }
                        </>
                    );
                }
            });

            return (
                <div id="cluster-data">
                    <h4><b> Cluster {index + 1} </b></h4>
                    {cluster}
                    <br />
                </div>
            );
        });

        return result;
    }

    render() {
        const {
            webServiceId,
            clusterData,
            areOperationsDenied
       } = this.props;

        let outliersPercentage;
        const isClusterDataVisible = !isNil(clusterData) && !isEmpty(clusterData);
        if (isClusterDataVisible) {
            outliersPercentage = (1 - clusterData
                .map(item => item.spread)
                .reduce((sum, item) => sum += item, 0)) * 100;
        }

        return (
            <div
                id={`cluster-estimation-${webServiceId}-web-service`}
                style={{ marginTop: "2rem" }}
            >
                <Button
                    id={`button-get=cluster-estimation-${webServiceId}-web-service`}
                    disabled={areOperationsDenied}
                    onClick={() => EstimationActions.getClusterEstimatorResult(webServiceId)}
                >
                    Get Cluster Data
                </Button> 
                {
                    isClusterDataVisible && 
                    <div id="cluster-estimation-data" style={{ marginTop: "1rem" }}>
                        {this.clusterEstimatonRenderer(clusterData)}
                        <div id="outliers-data">
                            <h4>
                                <b>Data not in a cluster: </b>
                                {outliersPercentage.toFixed(decimalPlacePrecision)}%
                            </h4>
                        </div>
                    </div>
                }
            </div> 
            );
        }
    }
    
export default ClusterEstimation;