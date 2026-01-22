'use strict'

const WrkContainerRack = require('./lib/worker-base.js')

class WrkContainerRackD40M30 extends WrkContainerRack {
  getThingType () {
    return super.getThingType() + '-d40-m30'
  }

  async connectThing (thg) {
    return this._connectThing(thg, 'm30')
  }
}

module.exports = WrkContainerRackD40M30
