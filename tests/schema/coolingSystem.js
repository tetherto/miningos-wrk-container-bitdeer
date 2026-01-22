'use strict'

function coolingSystemValidateGenerator (state) {
  return {
    type: 'object',
    children: {
      cooling_system: {
        type: 'object',
        children: {
          dry_cooler: {
            type: 'array',
            children: {
              enabled: { type: 'boolean' },
              fans: {
                type: 'array',
                children: {
                  enabled: { type: 'boolean', enum: [state] }
                }
              }
            }
          }
        }
      }
    }
  }
}

module.exports = (v) => {
  v.cooling_system_on_validate.schema.stats.children.container_specific = coolingSystemValidateGenerator(true)
  v.cooling_system_off_validate.schema.stats.children.container_specific = coolingSystemValidateGenerator(false)
}
