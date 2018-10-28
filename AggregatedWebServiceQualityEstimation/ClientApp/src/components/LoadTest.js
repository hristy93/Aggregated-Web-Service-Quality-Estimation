import React, { Component } from 'react';
import axios from 'axios';

class LoadTest extends Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        axios.get("https://localhost:44342/api/test/run")
            .then(function (response) {
                // handle success
                console.log(response);
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            });
    }

    render() {
        return (
            <div>
                <button onClick={this.handleClick}>Run Load Test</button>
            </div>
        );
    }
}

export default LoadTest;