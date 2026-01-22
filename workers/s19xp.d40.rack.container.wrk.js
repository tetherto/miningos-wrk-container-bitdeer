'use strict'

const WrkContainerRack = require('./lib/worker-base.js')

class WrkContainerRackD40S19XP extends WrkContainerRack {
  getThingType () {
    return super.getThingType() + '-d40-s19xp'
  }

  async connectThing (thg) {
    return this._connectThing(thg, 's19xp')
  }
}

module.exports = WrkContainerRackD40S19XP
