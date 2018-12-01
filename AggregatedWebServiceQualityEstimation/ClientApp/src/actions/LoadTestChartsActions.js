import alt from '../alt';

class LoadTestChartsActions {
    constructor() {
        this.generateActions("setBrushPosition", "setAllReferenceLinesVisibility", "setReferenceLinesVisibility",
            "setChartsSync", "setLineVisibility");
    }
}

export default alt.createActions(LoadTestChartsActions);