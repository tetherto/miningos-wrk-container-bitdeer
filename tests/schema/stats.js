'use strict'

module.exports = (v) => {
  if (v.stats_validate?.schema?.stats?.children) {
    if (v.stats_validate.schema.stats.children.power_kw) {
      delete v.stats_validate.schema.stats.children.power_kw
    }
    v.stats_validate.schema.stats.children.power_w = { type: 'number', min: 0 }
  }
  v.stats_validate.schema.stats.children.container_specific = {
    type: 'object',
    children: {
      phase_data: {
        type: 'object',
        children: {
          a: {
            type: 'object',
            children: {
              voltage_v: { type: 'number', min: 0 },
              current_a: { type: 'number', min: 0 },
              power_w: { type: 'number', min: 0 }
            }
          },
          b: {
            type: 'object',
            children: {
              voltage_v: { type: 'number', min: 0 },
              current_a: { type: 'number', min: 0 },
              power_w: { type: 'number', min: 0 }
            }
          },
          c: {
            type: 'object',
            children: {
              voltage_v: { type: 'number', min: 0 },
              current_a: { type: 'number', min: 0 },
              power_w: { type: 'number', min: 0 }
            }
          }
        }
      },
      pdu_data: {
        type: 'array',
        children: {
          pdu: { type: 'string' },
          power_w: { type: 'number', min: 0 },
          current_a: { type: 'number', min: 0 },
          sockets: {
            type: 'array',
            children: {
              socket: { type: 'string' },
              enabled: { type: 'boolean' },
              power_w: { type: 'number', min: 0 },
              current_a: { type: 'number', min: 0 }
            }
          }
        }
      },
      cooling_system: {
        type: 'object',
        children: {
          oil_pump: {
            type: 'array',
            children: {
              index: { type: 'number', min: 0 },
              enabled: { type: 'boolean' },
              hot_temp_c: { type: 'number' },
              cold_temp_c: { type: 'number' },
              tank: { type: 'boolean' }
            }
          },
          water_pump: {
            type: 'array',
            children: {
              index: { type: 'number', min: 0 },
              enabled: { type: 'boolean' },
              hot_temp_c: { type: 'number' },
              cold_temp_c: { type: 'number' }
            }
          },
          dry_cooler: {
            type: 'array',
            children: {
              index: { type: 'number', min: 0 },
              enabled: { type: 'boolean' },
              fans: {
                type: 'array',
                children: {
                  index: { type: 'number', min: 0 },
                  enabled: { type: 'boolean' }
                }
              }
            }
          },
          exhaust_fan_enabled: { type: 'boolean' }
        }
      },
      ups: {
        type: 'object',
        children: {
          battery_percent: { type: 'number', min: 0 },
          temp_c: { type: 'number', min: 0 },
          input: {
            type: 'object',
            children: {
              voltage_v: { type: 'number', min: 0 },
              freq_hz: { type: 'number', min: 0 }
            }
          },
          output: {
            type: 'object',
            children: {
              voltage_v: { type: 'number', min: 0 },
              freq_hz: { type: 'number', min: 0 }
            }
          }
        }
      }
    }
  }
  v.config_validate.schema.config.children.container_specific = {
    type: 'object',
    children: {
      mqtt_url: { type: 'string' },
      tactics: {
        type: 'object',
        children: {
          start_policy: {
            type: 'object',
            children: {
              type: { type: 'string', optional: true },
              coin: {
                type: 'object',
                children: {
                  start_price: { type: 'number' },
                  current_price: { type: 'number' }
                }
              },
              electricity: {
                type: 'object',
                children: {
                  start_price: { type: 'number' },
                  current_price: { type: 'number' }
                }
              }
            }
          },
          stop_policy: {
            type: 'object',
            children: {
              type: { type: 'string' },
              coin: {
                type: 'object',
                children: {
                  stop_price: { type: 'number' },
                  current_price: { type: 'number' }
                }
              },
              electricity: {
                type: 'object',
                children: {
                  stop_price: { type: 'number' },
                  current_price: { type: 'number' }
                }
              }
            }
          }
        }
      },
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
