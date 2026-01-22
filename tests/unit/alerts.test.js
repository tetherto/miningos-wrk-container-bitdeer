'use strict'

const test = require('brittle')
const libAlerts = require('../../workers/lib/alerts')

test('libAlerts - module structure', (t) => {
  t.ok(libAlerts)
  t.ok(typeof libAlerts === 'object')
  t.ok(libAlerts.specs)
  t.ok(typeof libAlerts.specs === 'object')
  t.ok(libAlerts.specs.container)
  t.ok(typeof libAlerts.specs.container === 'object')
})

test('libAlerts - container specs structure', (t) => {
  const containerSpecs = libAlerts.specs.container

  t.ok(containerSpecs.oil_min_inlet_temp_warn)
  t.ok(typeof containerSpecs.oil_min_inlet_temp_warn === 'object')
  t.ok(typeof containerSpecs.oil_min_inlet_temp_warn.valid === 'function')
  t.ok(typeof containerSpecs.oil_min_inlet_temp_warn.probe === 'function')
})

test('libAlerts - oil_min_inlet_temp_warn valid function', (t) => {
  const validFn = libAlerts.specs.container.oil_min_inlet_temp_warn.valid

  // Test with valid snap and configuration
  const ctx = {
    conf: {
      oil_min_inlet_temp_warn: {
        params: { temp: 20 }
      }
    }
  }

  const validSnap = {
    stats: {
      status: 'running', // isOffline checks for status field
      container_specific: {
        cooling_system: {
          oil_pump: [
            { cold_temp_c: 25 },
            { cold_temp_c: 30 }
          ]
        }
      }
    },
    config: {} // libUtils.isValidSnap requires both stats and config
  }

  t.ok(validFn(ctx, validSnap))
})

test('libAlerts - oil_min_inlet_temp_warn valid function with invalid snap', (t) => {
  const validFn = libAlerts.specs.container.oil_min_inlet_temp_warn.valid

  const ctx = {
    conf: {
      oil_min_inlet_temp_warn: {
        params: { temp: 20 }
      }
    }
  }

  // Test with null snap - this will throw an error, so we need to catch it
  try {
    validFn(ctx, null)
    t.fail('Expected error for null snap')
  } catch (err) {
    t.ok(err instanceof TypeError)
  }

  // Test with undefined snap - this will throw an error, so we need to catch it
  try {
    validFn(ctx, undefined)
    t.fail('Expected error for undefined snap')
  } catch (err) {
    t.ok(err instanceof TypeError)
  }

  // Test with snap missing stats
  const invalidSnap1 = {}
  t.ok(!validFn(ctx, invalidSnap1))

  // Test with snap missing container_specific
  const invalidSnap2 = { stats: {}, config: {} }
  t.ok(!validFn(ctx, invalidSnap2))

  // Test with snap missing cooling_system
  const invalidSnap3 = {
    stats: {
      container_specific: {}
    },
    config: {}
  }
  t.ok(!validFn(ctx, invalidSnap3))

  // Test with snap missing oil_pump
  const invalidSnap4 = {
    stats: {
      container_specific: {
        cooling_system: {}
      }
    },
    config: {}
  }
  t.ok(!validFn(ctx, invalidSnap4))

  // Test with empty oil_pump array
  const invalidSnap5 = {
    stats: {
      container_specific: {
        cooling_system: {
          oil_pump: []
        }
      }
    },
    config: {}
  }
  t.ok(!validFn(ctx, invalidSnap5))
})

test('libAlerts - oil_min_inlet_temp_warn valid function with missing config', (t) => {
  const validFn = libAlerts.specs.container.oil_min_inlet_temp_warn.valid

  const ctx = {
    conf: {}
  }

  const validSnap = {
    stats: {
      container_specific: {
        cooling_system: {
          oil_pump: [
            { cold_temp_c: 25 },
            { cold_temp_c: 30 }
          ]
        }
      }
    },
    config: {}
  }

  t.ok(!validFn(ctx, validSnap))
})

test('libAlerts - oil_min_inlet_temp_warn probe function', (t) => {
  const probeFn = libAlerts.specs.container.oil_min_inlet_temp_warn.probe

  const ctx = {
    conf: {
      oil_min_inlet_temp_warn: {
        params: { temp: 20 }
      }
    }
  }

  // Test with temperatures above threshold
  const snap1 = {
    stats: {
      container_specific: {
        cooling_system: {
          oil_pump: [
            { cold_temp_c: 25 },
            { cold_temp_c: 30 }
          ]
        }
      }
    }
  }

  t.ok(!probeFn(ctx, snap1))

  // Test with temperatures below threshold
  const snap2 = {
    stats: {
      container_specific: {
        cooling_system: {
          oil_pump: [
            { cold_temp_c: 15 },
            { cold_temp_c: 18 }
          ]
        }
      }
    }
  }

  t.ok(probeFn(ctx, snap2))

  // Test with mixed temperatures (one below threshold)
  const snap3 = {
    stats: {
      container_specific: {
        cooling_system: {
          oil_pump: [
            { cold_temp_c: 25 },
            { cold_temp_c: 15 }
          ]
        }
      }
    }
  }

  t.ok(probeFn(ctx, snap3))
})

test('libAlerts - oil_min_inlet_temp_warn probe function with different threshold', (t) => {
  const probeFn = libAlerts.specs.container.oil_min_inlet_temp_warn.probe

  const ctx = {
    conf: {
      oil_min_inlet_temp_warn: {
        params: { temp: 30 }
      }
    }
  }

  // Test with temperatures above higher threshold
  const snap1 = {
    stats: {
      container_specific: {
        cooling_system: {
          oil_pump: [
            { cold_temp_c: 35 },
            { cold_temp_c: 40 }
          ]
        }
      }
    }
  }

  t.ok(!probeFn(ctx, snap1))

  // Test with temperatures below higher threshold
  const snap2 = {
    stats: {
      container_specific: {
        cooling_system: {
          oil_pump: [
            { cold_temp_c: 25 },
            { cold_temp_c: 28 }
          ]
        }
      }
    }
  }

  t.ok(probeFn(ctx, snap2))
})

test('libAlerts - oil_min_inlet_temp_warn probe function with single pump', (t) => {
  const probeFn = libAlerts.specs.container.oil_min_inlet_temp_warn.probe

  const ctx = {
    conf: {
      oil_min_inlet_temp_warn: {
        params: { temp: 20 }
      }
    }
  }

  // Test with single pump below threshold
  const snap1 = {
    stats: {
      container_specific: {
        cooling_system: {
          oil_pump: [
            { cold_temp_c: 15 }
          ]
        }
      }
    }
  }

  t.ok(probeFn(ctx, snap1))

  // Test with single pump above threshold
  const snap2 = {
    stats: {
      container_specific: {
        cooling_system: {
          oil_pump: [
            { cold_temp_c: 25 }
          ]
        }
      }
    }
  }

  t.ok(!probeFn(ctx, snap2))
})

test('libAlerts - oil_min_inlet_temp_warn probe function with multiple pumps', (t) => {
  const probeFn = libAlerts.specs.container.oil_min_inlet_temp_warn.probe

  const ctx = {
    conf: {
      oil_min_inlet_temp_warn: {
        params: { temp: 20 }
      }
    }
  }

  // Test with multiple pumps, all above threshold
  const snap1 = {
    stats: {
      container_specific: {
        cooling_system: {
          oil_pump: [
            { cold_temp_c: 25 },
            { cold_temp_c: 30 },
            { cold_temp_c: 35 }
          ]
        }
      }
    }
  }

  t.ok(!probeFn(ctx, snap1))

  // Test with multiple pumps, some below threshold
  const snap2 = {
    stats: {
      container_specific: {
        cooling_system: {
          oil_pump: [
            { cold_temp_c: 25 },
            { cold_temp_c: 15 },
            { cold_temp_c: 35 }
          ]
        }
      }
    }
  }

  t.ok(probeFn(ctx, snap2))
})

test('libAlerts - inherits from container_default', (t) => {
  const containerSpecs = libAlerts.specs.container

  // Check that it has the expected structure from container_default
  t.ok(containerSpecs.oil_min_inlet_temp_warn)

  // The oil_min_inlet_temp_warn should be in addition to default alerts
  t.ok(typeof containerSpecs.oil_min_inlet_temp_warn === 'object')
})

test('libAlerts - alert configuration structure', (t) => {
  const alert = libAlerts.specs.container.oil_min_inlet_temp_warn

  // Check that the alert has the required properties
  t.ok(alert.valid)
  t.ok(alert.probe)
  t.ok(typeof alert.valid === 'function')
  t.ok(typeof alert.probe === 'function')
})

test('libAlerts - alert name convention', (t) => {
  const alertNames = Object.keys(libAlerts.specs.container)

  for (const name of alertNames) {
    // Alert names should be snake_case
    t.ok(/^[a-z_]+$/.test(name))
  }
})

test('libAlerts - module exports', (t) => {
  // Check that the module exports the expected structure
  t.ok(libAlerts.specs)
  t.ok(libAlerts.specs.container)
  t.ok(libAlerts.specs.container.oil_min_inlet_temp_warn)
})
