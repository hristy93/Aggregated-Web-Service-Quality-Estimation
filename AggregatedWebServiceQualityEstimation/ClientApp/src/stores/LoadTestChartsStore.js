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
            showReferenceLines: true
        })
    }

    setBrushPosition = ({ brushStartIndex, brushEndIndex }) => {
        this.setState(
            this.state
                .set("brushStartIndex", brushStartIndex)
                .set("brushEndIndex", brushEndIndex)
        );
    }

    setShowReferenceLines = (showReferenceLines) => {
        this.setState(this.state.set("showReferenceLines", showReferenceLines));
    }

    static getBrushStartIndex() {
        return this.state.get("brushStartIndex");
    }

    static getBrushEndIndex() {
        return this.state.get("brushEndIndex");
    }

    static getShowReferenceLines() {
        return this.state.get("showReferenceLines");
    }
}

export default alt.createStore(immutable(LoadTestChartsStore));