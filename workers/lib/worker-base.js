'use strict'

const WrkRack = require('miningos-tpl-wrk-container/workers/rack.container.wrk')
const Container = require('./container')
const async = require('async')

const DEFAULT_MQTT_PORT = 10883

class WrkContainerRack extends WrkRack {
  init () {
    super.init()

    this.setInitFacs([
      ['fac', 'svc-facs-mqtt', 'm0', 'm0', {
        port: this.ctx.mqttPort || DEFAULT_MQTT_PORT
      }, 0]
    ])
  }

  _start (cb) {
    async.series([
      next => { super._start(next) },
      async () => {
        await this.mqtt_m0.startServer()
      },
      (next) => {
        this.miningosThgWriteCalls_0.whitelistActions([
          ['setTankEnabled', 1],
          ['setAirExhaustEnabled', 1],
          ['resetAlarm', 1],
          ['setTemperatureSettings', 2]
        ])
        next()
      }
    ], cb)
  }

  getThingType () {
    return super.getThingType() + '-bd'
  }

  selectThingInfo (thg) {
    return {
      containerId: thg.opts?.containerId
    }
  }

  getThingTags () {
    return ['bitdeer']
  }

  getSpecTags () {
    return ['container']
  }

  async collectThingSnap (thg) {
    return thg.ctrl.getSnap()
  }

  _validateRegisterThing (data) {
    super._validateRegisterThing(data)
    if (!data.opts) {
      throw new Error('ERR_THING_VALIDATE_OPTS_INVALID')
    }
  }

  async _connectThing (thg, model) {
    if (!thg.opts.containerId || !this.mqtt_m0.aedes) {
      return 0
    }

    const container = new Container({
      ...thg.opts,
      type: model,
      server: this.mqtt_m0.aedes,
      conf: this.conf.thing.container || {}
    })

    container.on('error', e => {
      this.debugThingError(thg, e)
    })

    thg.ctrl = container

    return 1
  }
}

module.exports = WrkContainerRack
