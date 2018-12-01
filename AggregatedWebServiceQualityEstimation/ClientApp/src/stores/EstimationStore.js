import alt from '../alt';
import EstimationActions from '../actions/EstimationActions';
import immutable from 'alt-utils/lib/ImmutableUtil';
import Immutable from 'immutable';
import isNil from 'lodash/isNil';
import { displayFailureMessage } from '../utils/displayInformation';

class EstimationStore {
    constructor() {
        this.bindActions(EstimationActions);

        this.state = Immutable.Map({
            statisticalData: []
        });
    }

    getStatisticalEstimatorResult(statisticalData) {
        this.setState(this.state.set("statisticalData", statisticalData));
    }

    static getStatisticalData() {
        return this.state.get("statisticalData");
    }
}

export default alt.createStore(immutable(EstimationStore));