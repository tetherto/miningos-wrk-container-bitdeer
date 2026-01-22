'use strict'

module.exports = () => ({
  temperature_validate: {
    type: 'schema',
    schema: {
      success: { type: 'boolean', enum: [true] },
      config: {
        type: 'object',
        children: {
          container_specific: {
            type: 'object',
            children: {
              alarms: {
                type: 'object',
                children: {
                  oil_temp: {
                    type: 'object',
                    children: {
                      high_c: { type: 'number' },
                      low_c: { type: 'number' }
                    }
                  },
                  water_temp: {
                    type: 'object',
                    children: {
                      high_c: { type: 'number' },
                      low_c: { type: 'number' }
                    }
                  }
                }
              },
              set_temps: {
                type: 'object',
                children: {
                  cold_oil_temp_c: { type: 'number' },
                  exhaust_fan_temp_c: { type: 'number' }
                }
              }
            }
          }
        }
      }
    }
  }
})
