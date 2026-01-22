'use strict'

const { switchSocketExecutor } = require('miningos-tpl-wrk-container/tests/executors')

module.exports = (v) => {
  if (v.switchCoolingSystemOn?.stages?.[1]) {
    v.switchCoolingSystemOn.stages[1].wait = 5000
  }
  if (v.switchCoolingSystemOff?.stages?.[1]) {
    v.switchCoolingSystemOff.stages[1].wait = 5000
  }
  if (v.switchSocketOnSingle?.stages?.[0]) {
    v.switchSocketOnSingle.stages[0].executor = switchSocketExecutor('-1', '-1', true)
  }
  if (v.switchSocketOnSingle?.stages?.[1]) {
    v.switchSocketOnSingle.stages[1].wait = 5000
  }
  if (v.switchSocketOnBatch?.stages?.[0]) {
    v.switchSocketOnBatch.stages[0].executor = switchSocketExecutor([['1-1', '2', true], ['1-2', '3', true]])
  }
  if (v.switchSocketOnBatch?.stages?.[1]) {
    v.switchSocketOnBatch.stages[1].wait = 5000
  }
  if (v.switchSocketOffSingle?.stages?.[0]) {
    v.switchSocketOffSingle.stages[0].executor = switchSocketExecutor('-1', '-1', false)
  }
  if (v.switchSocketOffSingle?.stages?.[1]) {
    v.switchSocketOffSingle.stages[1].wait = 5000
  }
  if (v.switchSocketOffBatch?.stages?.[0]) {
    v.switchSocketOffBatch.stages[0].executor = switchSocketExecutor([['1-1', '2', false], ['1-2', '3', false]])
  }
  if (v.switchSocketOffBatch.stages[1]) {
    v.switchSocketOffBatch.stages[1].wait = 5000
  }
}
