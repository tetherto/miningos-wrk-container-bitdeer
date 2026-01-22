'use strict'

const test = require('brittle')
const libStats = require('../../workers/lib/stats')

test('libStats - module structure', (t) => {
  t.ok(libStats)
  t.ok(typeof libStats === 'object')
  t.ok(libStats.specs)
  t.ok(typeof libStats.specs === 'object')
  t.ok(libStats.specs.container)
  t.ok(typeof libStats.specs.container === 'object')
})

test('libStats - container specs structure', (t) => {
  const containerSpecs = libStats.specs.container

  t.ok(containerSpecs.ops)
  t.ok(typeof containerSpecs.ops === 'object')
  t.ok(containerSpecs.ops.container_specific_stats_group)
  t.ok(typeof containerSpecs.ops.container_specific_stats_group === 'object')
})

test('libStats - container_specific_stats_group operation', (t) => {
  const groupOp = libStats.specs.container.ops.container_specific_stats_group

  t.ok(groupOp.op === 'group_multiple_stats')
  t.ok(Array.isArray(groupOp.srcs))
  t.ok(groupOp.srcs.length > 0)
  t.ok(typeof groupOp.group === 'function')
})

test('libStats - container_specific_stats_group sources', (t) => {
  const sources = libStats.specs.container.ops.container_specific_stats_group.srcs

  // Check that we have the expected temperature sources
  const expectedSources = [
    'cold_temp_c_1_group',
    'cold_temp_c_2_group',
    'hot_temp_c_1_group',
    'hot_temp_c_2_group',
    'cold_temp_c_w_1_group',
    'cold_temp_c_w_2_group',
    'hot_temp_c_w_1_group',
    'hot_temp_c_w_2_group',
    'tank1_bar_group',
    'tank2_bar_group'
  ]

  const sourceNames = sources.map(src => src.name)
  t.ok(JSON.stringify(sourceNames) === JSON.stringify(expectedSources))
})

test('libStats - source path validation', (t) => {
  const sources = libStats.specs.container.ops.container_specific_stats_group.srcs

  for (const source of sources) {
    t.ok(source.name)
    t.ok(source.src)
    t.ok(typeof source.name === 'string')
    t.ok(typeof source.src === 'string')
    t.ok(source.src.startsWith('last.snap.stats.container_specific.cooling_system.'))
  }
})

test('libStats - oil pump temperature sources', (t) => {
  const sources = libStats.specs.container.ops.container_specific_stats_group.srcs

  const oilPumpSources = sources.filter(src =>
    (src.name.includes('cold_temp_c_') || src.name.includes('hot_temp_c_')) && !src.name.includes('_w_')
  )

  t.ok(oilPumpSources.length === 4) // 2 cold + 2 hot

  const coldOilSources = oilPumpSources.filter(src => src.name.includes('cold_temp_c_'))
  const hotOilSources = oilPumpSources.filter(src => src.name.includes('hot_temp_c_'))

  t.ok(coldOilSources.length === 2)
  t.ok(hotOilSources.length === 2)

  // Check specific paths
  t.ok(coldOilSources.some(src => src.src === 'last.snap.stats.container_specific.cooling_system.oil_pump[0].cold_temp_c'))
  t.ok(coldOilSources.some(src => src.src === 'last.snap.stats.container_specific.cooling_system.oil_pump[1].cold_temp_c'))
  t.ok(hotOilSources.some(src => src.src === 'last.snap.stats.container_specific.cooling_system.oil_pump[0].hot_temp_c'))
  t.ok(hotOilSources.some(src => src.src === 'last.snap.stats.container_specific.cooling_system.oil_pump[1].hot_temp_c'))
})

test('libStats - water pump temperature sources', (t) => {
  const sources = libStats.specs.container.ops.container_specific_stats_group.srcs

  const waterPumpSources = sources.filter(src =>
    src.name.includes('_w_')
  )

  t.ok(waterPumpSources.length === 4) // 2 cold + 2 hot

  const coldWaterSources = waterPumpSources.filter(src => src.name.includes('cold_temp_c_w_'))
  const hotWaterSources = waterPumpSources.filter(src => src.name.includes('hot_temp_c_w_'))

  t.ok(coldWaterSources.length === 2)
  t.ok(hotWaterSources.length === 2)

  // Check specific paths
  t.ok(coldWaterSources.some(src => src.src === 'last.snap.stats.container_specific.cooling_system.water_pump[0].cold_temp_c'))
  t.ok(coldWaterSources.some(src => src.src === 'last.snap.stats.container_specific.cooling_system.water_pump[1].cold_temp_c'))
  t.ok(hotWaterSources.some(src => src.src === 'last.snap.stats.container_specific.cooling_system.water_pump[0].hot_temp_c'))
  t.ok(hotWaterSources.some(src => src.src === 'last.snap.stats.container_specific.cooling_system.water_pump[1].hot_temp_c'))
})

test('libStats - tank pressure sources', (t) => {
  const sources = libStats.specs.container.ops.container_specific_stats_group.srcs

  const tankSources = sources.filter(src =>
    src.name.includes('tank') && src.name.includes('_bar_')
  )

  t.ok(tankSources.length === 2)

  // Check specific paths
  t.ok(tankSources.some(src => src.src === 'last.snap.stats.container_specific.cooling_system.tank1_bar'))
  t.ok(tankSources.some(src => src.src === 'last.snap.stats.container_specific.cooling_system.tank2_bar'))
})

test('libStats - group function', (t) => {
  const groupFn = libStats.specs.container.ops.container_specific_stats_group.group

  t.ok(typeof groupFn === 'function')

  // Test that it's a function that can be used for grouping
  // The groupBy function returns a grouping configuration when called with a field
  const groupByContainer = groupFn('info.container')
  t.ok(groupByContainer !== undefined)
})

test('libStats - inherits from container_default', (t) => {
  const containerSpecs = libStats.specs.container

  // Check that it has the expected structure from container_default
  t.ok(containerSpecs.ops)

  // The container_specific_stats_group should be in addition to default ops
  t.ok(containerSpecs.ops.container_specific_stats_group)
})

test('libStats - source naming convention', (t) => {
  const sources = libStats.specs.container.ops.container_specific_stats_group.srcs

  for (const source of sources) {
    // All source names should end with '_group'
    t.ok(source.name.endsWith('_group'))

    // All source names should be snake_case (allowing numbers)
    t.ok(/^[a-z0-9_]+$/.test(source.name))
  }
})

test('libStats - temperature source indexing', (t) => {
  const sources = libStats.specs.container.ops.container_specific_stats_group.srcs

  // Check that oil pump sources use [0] and [1] indexing
  const oilPumpSources = sources.filter(src =>
    src.src.includes('oil_pump[')
  )

  t.ok(oilPumpSources.length === 4)
  t.ok(oilPumpSources.some(src => src.src.includes('oil_pump[0]')))
  t.ok(oilPumpSources.some(src => src.src.includes('oil_pump[1]')))

  // Check that water pump sources use [0] and [1] indexing
  const waterPumpSources = sources.filter(src =>
    src.src.includes('water_pump[')
  )

  t.ok(waterPumpSources.length === 4)
  t.ok(waterPumpSources.some(src => src.src.includes('water_pump[0]')))
  t.ok(waterPumpSources.some(src => src.src.includes('water_pump[1]')))
})

test('libStats - module exports', (t) => {
  // Check that the module exports the expected structure
  t.ok(libStats.specs)
  t.ok(libStats.specs.container)
  t.ok(libStats.specs.container.ops)
  t.ok(libStats.specs.container.ops.container_specific_stats_group)
})
