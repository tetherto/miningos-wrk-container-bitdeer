'use strict'

const WrkContainerRack = require('./lib/worker-base.js')

class WrkContainerRackD40M56 extends WrkContainerRack {
  getThingType () {
    return super.getThingType() + '-d40-m56'
  }

  async connectThing (thg) {
    return this._connectThing(thg, 'm56')
  }
}

module.exports = WrkContainerRackD40M56
