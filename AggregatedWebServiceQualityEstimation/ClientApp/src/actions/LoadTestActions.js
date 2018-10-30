import alt from '../alt';
import LoadTestServices from '../services/LoadTestServices';
import Papa from 'papaparse';

class LoadTestActions {
    constructor() {
        this.generateActions("setUrl");
    }

    runLoadTest() {
        return (dispatch) => {
            LoadTestServices.runLoadTest()
                .then((response) => {
                    // handle success
                    console.log(response);
                    alert(response.data)
                })
                .catch((error) => {
                    // handle error
                    console.log(error);
                    alert(error)
                });
        }
    }

    readLoadTestData() {
        return (dispatch) => {
            LoadTestServices.readLoadTestData()
                .then((response) => {
                    // handle success
                    console.log(response);
                    const result = response.data;
                    let parsedResult = Papa.parse(result, {
                        header: true
                    });
                    let parsedResultData = parsedResult.data;
                    parsedResultData.sort(function (a, b) {
                        return new Date('1970/01/01 ' + a.IntervalStartTime) - new Date('1970/01/01 ' + b.IntervalStartTime);
                    });
                    console.log(parsedResultData);
                    parsedResultData = parsedResultData.filter(item => item.IntervalStartTime !== "");
                    dispatch(parsedResultData);
                })
                .catch((error) => {
                    // handle error
                    console.log(error);
                    alert(error)
                });
        }
    }

    writeLoadTestData() {
        return (dispatch) => {
            LoadTestServices.writeLoadTestData()
                .then((response) => {
                    // handle success
                    console.log(response);
                    alert(response.data)
                })
                .catch((error) => {
                    // handle error
                    console.log(error);
                    alert(error)
                });
        }
    }
}

export default alt.createActions(LoadTestActions);