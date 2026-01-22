'use strict'

function setTacticsExecutor (tactics) {
  return async ({ dev }) => {
    return await dev.setTactics(tactics)
  }
}

function setTemperatureSettingsExecutor (temperatureSettings) {
  return async ({ dev }) => {
    return await dev.setTemperatureSettings(temperatureSettings)
  }
}

module.exports = {
  setTacticsExecutor,
  setTemperatureSettingsExecutor
}
