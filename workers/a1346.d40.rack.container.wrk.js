'use strict'

const WrkContainerRack = require('./lib/worker-base.js')

class WrkContainerRackD40A1346 extends WrkContainerRack {
  getThingType () {
    return super.getThingType() + '-d40-a1346'
  }

  async connectThing (thg) {
    return this._connectThing(thg, 'a1346')
  }
}

module.exports = WrkContainerRackD40A1346
