import alt from '../alt';
import LoadTestActions from '../actions/LoadTestActions';

class LoadTestStore {
    constructor() {
        this.bindActions(LoadTestActions);

        this.state = {
            csvData: []
        };
    }

    readLoadTestData(result) {
        this.setState({
            csvData: result
        })
    }

    static getCsvData() {
        return this.state.csvData;
    }
}

export default alt.createStore(LoadTestStore);