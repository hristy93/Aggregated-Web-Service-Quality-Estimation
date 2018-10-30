import alt from '../alt';
import LoadTestActions from '../actions/LoadTestActions';
import immutable from 'alt-utils/lib/ImmutableUtil';
import Immutable from 'immutable';

class LoadTestStore {
    constructor() {
        this.bindActions(LoadTestActions);

        this.state = Immutable.Map({
            csvData: []
        })
    }

    readLoadTestData(result) {
        this.setState(this.state.set("csvData", result))
    }

    static getCsvData() {
        return this.state.get("csvData");
    }
}

export default alt.createStore(immutable(LoadTestStore));