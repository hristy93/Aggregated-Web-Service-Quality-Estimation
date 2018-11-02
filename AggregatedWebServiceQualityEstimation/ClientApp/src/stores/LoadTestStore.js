import alt from '../alt';
import LoadTestActions from '../actions/LoadTestActions';
import immutable from 'alt-utils/lib/ImmutableUtil';
import Immutable from 'immutable';

class LoadTestStore {
    constructor() {
        this.bindActions(LoadTestActions);

        this.state = Immutable.Map({
            loadTestData: [],
            url: "https://jsonplaceholder.typicode.com/todos/1",
            isUrlValid: false
        })
    }

    readLoadTestData(loadTestData) {
        this.setState(this.state.set("loadTestData", loadTestData));
    }

    setUrl(url) {
        this.setState(this.state.set("url", url));
    }

    setUrlValidity(isUrlValid) {
        this.setState(this.state.set("isUrlValid", isUrlValid));
    }

    static getLoadTestData() {
        return this.state.get("loadTestData");
    }

    static getUrl() {
        return this.state.get("url");
    }

    static getUrlValidity() {
        return this.state.get("isUrlValid");
    }
}

export default alt.createStore(immutable(LoadTestStore));