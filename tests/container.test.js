'use strict'

const { getDefaultConf, testExecutor } = require('miningos-tpl-wrk-container/tests/container.test')
const Container = require('../workers/lib/container')
const MQTTFacility = require('svc-facs-mqtt')
const { promiseSleep: sleep } = require('@bitfinex/lib-js-util-promise')
const aedes = require('aedes')()
const server = require('net').createServer(aedes.handle)

let mockClient

const conf = getDefaultConf()
server.listen(conf.settings.port)

if (!conf.settings.live) {
  conf.settings.host = '127.0.0.1'
  const srv = require('../mock/server')
  mockClient = srv.createClient({
    host: conf.settings.host,
    port: conf.settings.port,
    type: 'D40_M56',
    id: 'C024_D40'
  })
}

const fac = new MQTTFacility({ ctx: { env: 'test', root: '.' } }, { port: conf.settings.port }, { env: 'test', root: '.' })
const container = new Container({
  server: aedes,
  containerId: 'C024_D40',
  type: 'm56',
  conf
})

conf.cleanup = () => {
  if (mockClient) {
    if (typeof mockClient.stop === 'function') {
      mockClient.stop()
    } else if (typeof mockClient.exit === 'function') {
      mockClient.exit()
    } else if (typeof mockClient.end === 'function') {
      mockClient.end()
    }
  }
  server.close()
  aedes.close()
  fac.stop()
}

async function execute () {
  await sleep(6000)
  await testExecutor(container, conf)
}

execute()
