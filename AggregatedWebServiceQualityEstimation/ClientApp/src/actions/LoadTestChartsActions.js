import alt from '../alt';

class LoadTestChartsActions {
    constructor() {
        this.generateActions("setBrushPosition", "setAllReferenceLinesVisibility", "setReferenceLinesVisibility",
            "setChartsSync", "setLineVisibility", "setChartsPanelVisibility");
    }
}

export default alt.createActions(LoadTestChartsActions);