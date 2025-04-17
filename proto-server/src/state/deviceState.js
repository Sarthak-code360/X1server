let deviceState = {
    RPM_preset: 0,
    Immobolize: false,
    MotorType: false,
    devMode: 0
};

function updateState(partial) {
    deviceState = { ...deviceState, ...partial };
    return deviceState;
}

function getState() {
    return deviceState;
}

module.exports = {
    updateState,
    getState,
};
