'use strict'
const utils = require('miningos-tpl-wrk-container/tests/utils')
const path = require('path')
const { MAPPINGS } = require('../workers/lib/utils/constants')

utils.SCHEMA_PATHS.push(path.join(__dirname, 'schema'))
utils.TEST_PATHS.push(path.join(__dirname, 'cases'))

const getSocketCount = (type, pduKey) => {
  return MAPPINGS[type]?.[pduKey]?.length || 0
}

const getDefaultSocketCount = (type) => {
  const pduKeys = Object.keys(MAPPINGS[type] || {})
  if (pduKeys.length === 0) return 0
  return getSocketCount(type, pduKeys[0])
}

const createPDUState = (index, socketCount, socketStatus = false) => {
  const statusArray = Array.isArray(socketStatus)
    ? socketStatus
    : Array(socketCount).fill(socketStatus)
  return {
    index,
    socketStatus: statusArray
  }
}

const createPDUStates = (type, count, socketStatus = false) => {
  const socketCount = getDefaultSocketCount(type)
  return Array.from({ length: count }, (_, i) =>
    createPDUState(i, socketCount, socketStatus)
  )
}

const createMockServer = () => {
  return {
    subscribe: () => {},
    publish: () => {}
  }
}

const createTestContainer = (opts = {}) => {
  const D40Container = require('../workers/lib/container')
  const mockServer = opts.server || createMockServer()
  return new D40Container({
    server: mockServer,
    containerId: opts.containerId || 'test-container',
    type: opts.type || 'm56',
    conf: opts.conf || { delay: 100 },
    ...opts
  })
}

const createAllSocketOps = (pduKey, type, enabled) => {
  const socketCount = getSocketCount(type, pduKey)
  return Array.from({ length: socketCount }, (_, i) => [
    pduKey,
    String(i + 1),
    enabled
  ])
}

module.exports = {
  ...utils,
  getSocketCount,
  getDefaultSocketCount,
  createPDUState,
  createPDUStates,
  createMockServer,
  createTestContainer,
  createAllSocketOps
}
