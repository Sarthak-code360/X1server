let currentState = {
    RPM_preset: undefined,
    Immobolize: undefined,
    MotorType: undefined,
    devMode: undefined
};

function updateState(partialUpdate) {
    for (const key in partialUpdate) {
        if (partialUpdate[key] !== undefined) {
            currentState[key] = partialUpdate[key];
        }
    }
    return { ...currentState }; // return full updated state
}

module.exports = {
    updateState,
    getState: () => ({ ...currentState }),
};
