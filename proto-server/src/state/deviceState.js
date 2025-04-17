let deviceState = {
    RPM_preset: 0,
    Immobolize: false,
    MotorType: false,
    devMode: 0,

    // HWToApp additions
    Bus_Current: 0,
    RPM: 0,
    Torque: 0,
    GPS: "",
    GPS_size: 0,
    SOC: 0,
    Net_Strength: 0,
    Device_Temp: 0,
    Motor_Temp: 0,
    Bus_Voltage: 0,
    Throttle: 0
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
