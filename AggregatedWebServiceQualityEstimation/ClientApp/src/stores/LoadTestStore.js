import alt from '../alt';
import LoadTestActions from '../actions/LoadTestActions';
import immutable from 'alt-utils/lib/ImmutableUtil';
import Immutable from 'immutable';

class LoadTestStore {
    constructor() {
        this.bindActions(LoadTestActions);

        this.state = Immutable.Map({
            loadTestData: [],
            url: "https://jsonplaceholder.typicode.com/todos/1"
        })
    }

    readLoadTestData(result) {
        this.setState(this.state.set("loadTestData", result));
    }

    setUrl(url) {
        this.setState(this.state.set("url", url));
    }

    static getLoadTestData() {
        return this.state.get("loadTestData");
    }

    static getUrl() {
        return this.state.get("url");
    }
}

export default alt.createStore(immutable(LoadTestStore));