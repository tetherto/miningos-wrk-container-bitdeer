'use strict'

/*
tactics: {
          start_policy: {
            type: this.lastMessageCache.tactics.startPolicy.tactic,
            coin_price_usd: this.lastMessageCache.tactics.startPolicy.coinPriceParameters.coinPrice, // in USD
            electricity_usd: this.lastMessageCache.tactics.startPolicy.electricityParameters.startPrice // in USD
          },
          stop_policy: {
            type: this.lastMessageCache.tactics.stopPolicy.tactic,
            coin_price_usd: this.lastMessageCache.tactics.stopPolicy.coinPriceParameters.coinPrice, // in USD
            electricity_usd: this.lastMessageCache.tactics.stopPolicy.electricityParameters.stopPrice // in USD
          }
        },
        */

module.exports = () => ({
  tactics_validate: {
    type: 'schema',
    schema: {
      success: { type: 'boolean', enum: [true] },
      config: {
        type: 'object',
        children: {
          container_specific: {
            type: 'object',
            children: {
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
                      }
                    }
                  },
                  stop_policy: {
                    type: 'object',
                    children: {
                      type: { type: 'string', optional: true },
                      coin: {
                        type: 'object',
                        children: {
                          stop_price: { type: 'number' },
                          current_price: { type: 'number' }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
})
