let currentState = {
    RPM_preset: undefined,
    Immobolize: undefined,
    MotorType: undefined,
    devMode: undefined
};

function updateState(partialUpdate) {
    let hasChanges = false;
    for (const key in partialUpdate) {
        if (partialUpdate[key] !== undefined && partialUpdate[key] !== currentState[key]) {
            currentState[key] = partialUpdate[key];
            hasChanges = true;
        }
    }

    return hasChanges ? { ...currentState } : null; // null means no update
}

function getState() {
    return { ...currentState };
}

module.exports = {
    updateState,
    getState
};
