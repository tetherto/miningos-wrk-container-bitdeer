'use strict'

const path = require('path')
const { getSchema } = require(path.join(process.cwd(), 'tests/utils'))
const { setTemperatureSettingsExecutor } = require('../executors')
let getConfigExecutor
try {
  getConfigExecutor = require('miningos-tpl-wrk-container/tests/executors').getConfigExecutor
} catch (e) {
  // Fallback if getConfigExecutor is not available
  getConfigExecutor = async ({ dev }) => {
    return await dev.getSnap()
  }
}
const defaults = getSchema()

module.exports = () => ({
  setTemperatureSettings: {
    stages: [
      {
        name: 'setTemperatureSettings',
        executor: setTemperatureSettingsExecutor({
          coldOil: 20,
          hotOil: 60,
          coldWater: 20,
          hotWater: 60,
          coldOilSet: 20,
          exhaustFan: 50
        }),
        validate: defaults.success_validate
      },
      {
        name: 'check if temperature settings are set',
        wait: 5000,
        executor: typeof getConfigExecutor === 'function' ? getConfigExecutor : async ({ dev }) => await dev.getSnap(),
        validate: defaults.temperature_validate
      }
    ]
  }
})
