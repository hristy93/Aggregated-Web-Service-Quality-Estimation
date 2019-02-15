import alt from '../alt';
import LoadTestChartsActions from '../actions/LoadTestChartsActions';
import immutable from 'alt-utils/lib/ImmutableUtil';
import Immutable from 'immutable';
import isNil from 'lodash/isNil';

class LoadTestChartsStore {
    constructor() {
        this.bindActions(LoadTestChartsActions);

        this.state = Immutable.Map({
            chartsLinesData: {
                responseTime: [{
                    axisYKey: "ResponseTime",
                    color: "#00BFFF",
                    isLineVisible: true,
                    areReferenceLinesVisible: true
                }],
                requests: [{
                    axisYKey: "SuccessfulRequestsPerSecond",
                    color: "#32CD32",
                    isLineVisible: true,
                    areReferenceLinesVisible: true
                }, {
                    axisYKey: "FailedRequestsPerSecond",
                    color: "#F31111",
                    isLineVisible: true,
                    areReferenceLinesVisible: true
                }],
                throughput: [{
                    axisYKey: "ReceivedKilobytesPerSecond",
                    color: "#6319FF",
                    isLineVisible: true,
                    areReferenceLinesVisible: true
                }],
                apdexScore: [{
                    axisYKey: "ApdexScore",
                    color: "#00FFFF",
                    isLineVisible: true,
                    areReferenceLinesVisible: true
                }]
            },
            brushStartIndex: null,
            brushEndIndex: null,
            first: Immutable.Map({
                areReferenceLinesVisible: false,
                syncCharts: false,
                isPanelVisible: false
            }),
            second: Immutable.Map({
                areReferenceLinesVisible: false,
                syncCharts: false,
                isPanelVisible: false
            })
        });
    }

    setBrushPosition = ({ brushStartIndex, brushEndIndex }) => {
        this.setState(
            this.state
                .set("brushStartIndex", brushStartIndex)
                .set("brushEndIndex", brushEndIndex)
        );
    }

    setAllReferenceLinesVisibility = ({ areReferenceLinesVisible, webServiceId }) => {
        this.setState(this.state.setIn([webServiceId, "areReferenceLinesVisible"], areReferenceLinesVisible));
    }

    setLineVisibility = (lineName) => {
        const chartsLinesData = this.state.get("chartsLinesData");
        const chartsLinesDataItem = Object.keys(chartsLinesData)
            .map(key => chartsLinesData[key].find(lines => lines.axisYKey === `${lineName}`))
            .filter(item => !isNil(item))[0];
        //const chartsLinesDataItem = chartsLinesData[`${chartName}`].find(lines => lines.axisYKey === `${lineName}`);
        chartsLinesDataItem['isLineVisible'] = !chartsLinesDataItem['isLineVisible'];
        this.setState(this.state.set("chartsLinesData", chartsLinesData));
    }

    setReferenceLinesVisibility = (lineName) => {
        const chartsLinesData = this.state.get("chartsLinesData");
        const chartsLinesDataItem = Object.keys(chartsLinesData)
            .map(key => chartsLinesData[key].find(lines => lines.axisYKey === `${lineName}`))
            .filter(item => !isNil(item))[0];
        //const chartsLinesDataItem = chartsLinesData[`${chartName}`].find(lines => lines.axisYKey === `${lineName}`);
        chartsLinesDataItem['areReferenceLinesVisible'] = !chartsLinesDataItem['areReferenceLinesVisible'];
        this.setState(this.state.set("chartsLinesData", chartsLinesData));
    }

    setChartsSync = ({ syncCharts, webServiceId }) => {
        this.setState(this.state.setIn([webServiceId, "syncCharts"], syncCharts));
    }

    setChartsPanelVisibility = ({ isPanelVisible, webServiceId }) => {
        this.setState(this.state.setIn([webServiceId, "isPanelVisible"], isPanelVisible));
    }

    static getChartsLinesData() {
        return this.state.get("chartsLinesData");
    }

    static getBrushStartIndex() {
        return this.state.get("brushStartIndex");
    }

    static getBrushEndIndex() {
        return this.state.get("brushEndIndex");
    }

    static getFirstWebServiceChartsData() {
        const props =   {
            syncCharts: this.state.getIn(["first", "syncCharts"]),
            areReferenceLinesVisible: this.state.getIn(["first", "areReferenceLinesVisible"]),
            isPanelVisible: this.state.getIn(["first", "isPanelVisible"])
        };

        return props;
    }

    static getSecondWebServiceChartsData() {
        const props =  {
            syncCharts: this.state.getIn(["second", "syncCharts"]),
            areReferenceLinesVisible: this.state.getIn(["second", "areReferenceLinesVisible"]),
            isPanelVisible: this.state.getIn(["second", "isPanelVisible"])
        };

        return props;
    }
}

export default alt.createStore(immutable(LoadTestChartsStore));