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
                }, {
                    axisYKey: "SentKilobytesPerSecond",
                    color: "#E85D18",
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
                areReferenceLinesVisible: false
            }),
            second: Immutable.Map({
                areReferenceLinesVisible: false
            }),
            syncCharts: false
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

    setChartsSync(syncCharts) {
        this.setState(this.state.set("syncCharts", syncCharts));
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

    static getFirstWebServiceLinesData() {
        return {
            areReferenceLinesVisible: this.state.getIn(["first", "areReferenceLinesVisible"])
        };
    }

    static getSecondWebServiceLinesData() {
        return {
            areReferenceLinesVisible: this.state.getIn(["second", "areReferenceLinesVisible"])
        };
    }

    static getSyncCharts() {
        return this.state.get("syncCharts");
    }
}

export default alt.createStore(immutable(LoadTestChartsStore));