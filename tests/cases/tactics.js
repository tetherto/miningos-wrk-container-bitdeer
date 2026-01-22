'use strict'

const path = require('path')
const { getSchema } = require(path.join(process.cwd(), 'tests/utils'))
const { setTacticsExecutor } = require('../executors')
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
  setTactics: {
    stages: [
      {
        name: 'setTactics',
        executor: setTacticsExecutor({
          start: {
            tacticType: 'coin',
            startPrice: 10,
            currentPrice: 20
          },
          stop: {
            tacticType: 'coin',
            stopPrice: 30,
            currentPrice: 20
          }
        }),
        validate: defaults.success_validate
      },
      {
        name: 'check if tactics are set',
        wait: 5000,
        executor: typeof getConfigExecutor === 'function' ? getConfigExecutor : async ({ dev }) => await dev.getSnap(),
        validate: defaults.tactics_validate
      }
    ]
  }
})
