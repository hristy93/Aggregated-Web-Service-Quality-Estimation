import alt from '../alt';
import EstimationActions from '../actions/EstimationActions';
import immutable from 'alt-utils/lib/ImmutableUtil';
import Immutable from 'immutable';
import isNil from 'lodash/isNil';

class EstimationStore {
    constructor() {
        this.bindActions(EstimationActions);

        this.state = Immutable.Map({
            first: Immutable.Map({
                statisticalData: [],
                apdexScoreData: {},
                apdexScoreLimit: undefined,
                clusterData: {},
                isPanelVisible: false
            }),
            second: Immutable.Map({
                statisticalData: [],
                apdexScoreData: {},
                apdexScoreLimit: undefined,
                clusterData: {},
                isPanelVisible: false
            })
        });
    }

    getStatisticalEstimatorResult = ({ statisticalData, webServiceId }) => {
        this.setState(this.state.setIn([webServiceId, "statisticalData"], statisticalData));
    }

    clearApdexScoreData = (webServiceId) => {
        this.setState(this.state.set([webServiceId, "apdexScoreData"], []));
    }

    setApdexScoreLimit = ({ apdexScoreLimit, webServiceId }) => {
        this.setState(this.state.setIn([webServiceId, "apdexScoreLimit"], apdexScoreLimit));
    }

    getApdexScoreEstimatorResult = ({ apdexScoreData, webServiceId }) => {
        if (!isNil(apdexScoreData)) {
            this.setState(this.state.setIn([webServiceId, "apdexScoreData"], apdexScoreData));
        }
    }

    getClusterEstimatorResult = ({ clusterData, webServiceId }) => {
        if (!isNil(clusterData)) {
            this.setState(this.state.setIn([webServiceId, "clusterData"], clusterData));
        }
    }

    setEstimationsPanelVisibility = ({ isPanelVisible, webServiceId }) => {
        const test = this.state.getIn([webServiceId, "isPanelVisible"]);
        this.setState(this.state.setIn([webServiceId, "isPanelVisible"], isPanelVisible));
    }

    static getFirstWebServiceEstimationData() {
        return this.state.get("first").toJS();
    }

    static getSecondWebServiceEstimationData() {
        return this.state.get("second").toJS();
    }

}

export default alt.createStore(immutable(EstimationStore));