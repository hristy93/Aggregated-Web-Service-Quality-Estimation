import alt from '../alt';
import LoadTestChartsActions from '../actions/LoadTestChartsActions';
import immutable from 'alt-utils/lib/ImmutableUtil';
import Immutable from 'immutable';

class LoadTestChartsStore {
    constructor() {
        this.bindActions(LoadTestChartsActions);

        this.state = Immutable.Map({
            brushStartIndex: null,
            brushEndIndex: null,
            areReferenceLinesVisible: false,
            syncCharts: false
        })
    }

    setBrushPosition = ({ brushStartIndex, brushEndIndex }) => {
        this.setState(
            this.state
                .set("brushStartIndex", brushStartIndex)
                .set("brushEndIndex", brushEndIndex)
        );
    }

    setReferenceLinesVisibility = (areReferenceLinesVisible) => {
        this.setState(this.state.set("areReferenceLinesVisible", areReferenceLinesVisible));
    }

    setChartsSync(syncCharts) {
        this.setState(this.state.set("syncCharts", syncCharts));
    }

    static getBrushStartIndex() {
        return this.state.get("brushStartIndex");
    }

    static getBrushEndIndex() {
        return this.state.get("brushEndIndex");
    }

    static getReferenceLinesVisibility() {
        return this.state.get("areReferenceLinesVisible");
    }

    static getSyncCharts() {
        return this.state.get("syncCharts");
    }
}

export default alt.createStore(immutable(LoadTestChartsStore));