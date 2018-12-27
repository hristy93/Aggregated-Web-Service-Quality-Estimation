import isNil from 'lodash/isNil';
import isObjectLike from 'lodash/isObjectLike';
import isString from 'lodash/isString';

const displayFailureMessage = (alertMessage, error = null) => {
    if (!isNil(error) && isObjectLike(error)) {
        if (!isNil(error.response)) {
            if (!isNil(error.request)) {
                console.log(`Error with status ${error.response.status} with message '${error.message}'` +
                    ` and data: \n ${ error.response.data }`);
            } else {
                console.log(`Error with status ${error.response.status} and data:\n ${error.response.data}`);
            }
        } else if (!isNil(error.request)) {
            console.log(error.request);
        } else {
            console.log(`Error with message: ${error.message}!`);
        }
    } else if (!isNil(error) && isString(error)) {
        console.log(error);
    } else {
        console.log("Error with no info!");
    }
  
    alert(alertMessage);
};

const displaySuccessMessage = (alertMessage, logMessage = null) => {
    if (!isNil(logMessage)) {
        console.log(logMessage);
    }

    alert(alertMessage);
};

const logActivity = (logMessage) => {
    if (!isNil(logMessage)) {
        console.log(logMessage);
    }
};


export { displayFailureMessage, displaySuccessMessage, logActivity};