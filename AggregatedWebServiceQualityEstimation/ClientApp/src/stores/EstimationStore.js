import alt from '../alt';
import EstimationActions from '../actions/EstimationActions';
import immutable from 'alt-utils/lib/ImmutableUtil';
import Immutable from 'immutable';
import isNil from 'lodash/isNil';

class EstimationStore {
    constructor() {
        this.bindActions(EstimationActions);

        this.state = Immutable.Map({
            statisticalData: [],
            apdexScoreData: [],
            apdexScoreLimit: 0.05,
            clusterData: {}
        });
    }

    getStatisticalEstimatorResult = (statisticalData) => {
        this.setState(this.state.set("statisticalData", statisticalData));
    }

    clearApdexScoreData = () => {
        this.setState(this.state.set("apdexScoreData", []));
    }

    setApdexScoreLimit = (apdexScoreLimit) => {
        this.setState(this.state.set("apdexScoreLimit", apdexScoreLimit));
    }

    getApdexScoreEstimatorResult = (apdexScoreData) => {
        if (!isNil(apdexScoreData)) {
            //const currentApdexScoreData = this.state.get("apdexScoreData");

            //for (let apdexScoreItem of apdexScoreData) {
            //    currentApdexScoreData.push(apdexScoreItem);
            //    this.setState(this.state.set("apdexScoreData", currentApdexScoreData));
            //    console.log(currentApdexScoreItem);
            //}

        this.setState(this.state.set("apdexScoreData", apdexScoreData));
        }
    }

    getClusterEstimatorResult = (clusterData) => {
        if (!isNil(clusterData)) {
            this.setState(this.state.set("clusterData", clusterData));
        }
    }

    static getStatisticalData() {
        return this.state.get("statisticalData");
    }

    static getApdexScoreData() {
        return this.state.get("apdexScoreData");
    }

    static getApdexScoreLimit() {
        return this.state.get("apdexScoreLimit");
    }

    static getClusterData() {
        return this.state.get("clusterData");
    }
}

export default alt.createStore(immutable(EstimationStore));