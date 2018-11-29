import alt from '../alt';

class LoadTestChartsActions {
    constructor() {
        this.generateActions("setBrushPosition", "showReferenceLines");
    }
}

export default alt.createActions(LoadTestChartsActions);