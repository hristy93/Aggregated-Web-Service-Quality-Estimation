import React, { Component } from 'react';
import connectToStores from 'alt-utils/lib/connectToStores';
import { Button } from 'react-bootstrap';
import isNil from 'lodash/isNil';
import isEmpty from 'lodash/isEmpty';
import EstimationActions from '../../actions/EstimationActions';
import EstimationStore from '../../stores/EstimationStore';

const decimalPlacePrecision = 3;

class ClusterEstimation extends Component {
    render() {
        const {
            webServiceId,
            clusterData,
            areOperationsDenied
       } = this.props;

        const isClusterDataVisible = !isNil(clusterData) && !isEmpty(clusterData);

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
                    <div
                        id={`cluster-estimation-data-${webServiceId}-web-service`}
                        style={{ marginTop: "1rem" }}
                    >
                        {
                            Object.keys(clusterData).map((key, index) => {
                                return (
                                    <h4 key={index}> {key} : {clusterData[key].toFixed(decimalPlacePrecision)} </h4>
                                );
                            })
                        }
                    </div>
                }
            </div> 
            );
        }
    }
    
export default ClusterEstimation;