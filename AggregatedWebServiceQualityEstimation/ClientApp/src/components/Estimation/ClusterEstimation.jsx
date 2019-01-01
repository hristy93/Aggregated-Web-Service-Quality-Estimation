import React, { Component } from 'react';
import connectToStores from 'alt-utils/lib/connectToStores';
import { Button } from 'react-bootstrap';
import isNil from 'lodash/isNil';
import isEmpty from 'lodash/isEmpty';
import EstimationActions from '../../actions/EstimationActions';
import EstimationStore from '../../stores/EstimationStore';

const decimalPlacePrecision = 3;

class ClusterEstimation extends Component {
    //static getStores() {
    //    return [EstimationStore];
    //}

    //static getPropsFromStores() {
    //    return ({
    //        clusterData: EstimationStore.getClusterData()
    //    });
    //}

    render() {
        const {
            webServiceId,
            clusterData,
            areOperationsDenied
       } = this.props;

        const isClusterDataVisible = !isNil(clusterData) && !isEmpty(clusterData);

        return (
            <div id="cluster-estimation" style={{ marginTop: "2rem" }}>
                <Button
                    id="get-cluster-estimation-button"
                    disabled={areOperationsDenied}
                    onClick={() => EstimationActions.getClusterEstimatorResult(webServiceId)}
                >
                    Get Cluster Data
                </Button> 
                <div id="cluster-estimation-header">
                    <h4><b>Cluster Estimaton Data</b></h4>
                </div>
                {
                    isClusterDataVisible && 
                    <div id="cluster-estimation-data" style={{ marginTop: "1rem" }}>
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