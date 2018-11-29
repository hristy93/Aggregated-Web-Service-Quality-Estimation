import alt from '../alt';

class LoadTestChartsActions {
    constructor() {
        this.generateActions("setBrushPosition", "setReferenceLinesVisibility", "setChartsSync");
    }
}

export default alt.createActions(LoadTestChartsActions);