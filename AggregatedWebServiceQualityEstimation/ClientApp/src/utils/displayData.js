const toPercentage = (value, decimalPlacePrecision) => {
    let valueToPercentage = value * 100;

    if (valueToPercentage % 100 !== 0) {
        valueToPercentage = valueToPercentage.toFixed(decimalPlacePrecision);
    }

    return `${valueToPercentage}%`;
};

export { toPercentage };