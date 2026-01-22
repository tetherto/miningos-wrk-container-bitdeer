'use strict'

const test = require('brittle')
const { createMockServer, createTestContainer } = require('../utils')

test('D40Container - constructor and initialization', (t) => {
  const mockServer = createMockServer()
  const container = createTestContainer({ server: mockServer })

  t.ok(container.server === mockServer)
  t.ok(container.opts.containerId === 'test-container')
  t.ok(container.opts.type === 'm56')
  t.ok(container.lastMessageCache)
  t.ok(container._queue)
  t.ok(typeof mockServer.subscribe === 'function')
})

test('D40Container - _handleMessage with RunningInfo topic', (t) => {
  const container = createTestContainer()

  const packet = {
    topic: 'test-containerRunningInfo',
    payload: JSON.stringify({
      AlarmState: '1',
      AlarmInfo: ['OilPump1 error'],
      RunningState: '1',
      DeviceInfo: {
        OilPump1: '1',
        OilPump2: '0',
        WaterPump1: '1',
        WaterPump2: '0',
        DryCooler: [{
          CoolerIndex: '0',
          MainContactor: '1',
          FansStatus: ['1', '0', '1']
        }]
      }
    })
  }

  const cb = () => {}
  container._handleMessage(packet, cb)

  t.ok(container.lastMessageCache.alarmState === true)
  t.ok(container.lastMessageCache.alarmInfo[0] === 'OilPump1 error')
  t.ok(container.lastMessageCache.runningState === true)
  t.ok(container.lastMessageCache.deviceInformation.oilPump1RunningStatus === true)
  t.ok(container.lastMessageCache.deviceInformation.oilPump2RunningStatus === false)
  t.ok(container.lastMessageCache.deviceInformation.dryCoolerStatus[0].index === 0)
  t.ok(container.lastMessageCache.deviceInformation.dryCoolerStatus[0].mainContactorStatus === true)
  t.ok(typeof cb === 'function')
})

test('D40Container - _handleMessage with PDUData topic', (t) => {
  const container = createTestContainer()

  const packet = {
    topic: 'test-containerPDUData',
    payload: JSON.stringify({
      PDUData: [{
        PDUIndex: '1-1',
        SocketStatus: ['1', '0', '1', '0'],
        PowerData: ['100.5', '200.3', '150.7', '75.2'],
        CurrentData: ['2.1', '4.2', '3.1', '1.5']
      }]
    })
  }

  const cb = () => {}
  container._handleMessage(packet, cb)

  t.ok(container.lastMessageCache.PDUSocketInformation)
  t.ok(container.lastMessageCache.PDUSocketInformation[0].index === 1) // '1-1' maps to index 1
  t.ok(container.lastMessageCache.PDUSocketInformation[0].socketStatus[0] === true)
  t.ok(container.lastMessageCache.PDUSocketInformation[0].socketStatus[1] === false)
  t.ok(container.lastMessageCache.PDUSocketInformation[0].powerValues[0] === 100.5)
  t.ok(container.lastMessageCache.PDUSocketInformation[0].currentValues[0] === 2.1)
  t.ok(typeof cb === 'function')
})

test('D40Container - _handleMessage with MainData topic', (t) => {
  const container = createTestContainer()

  const packet = {
    topic: 'test-containerMainData',
    payload: JSON.stringify({
      PowerData: {
        TotalPower: '1000.5',
        PowerA: '333.3',
        PowerB: '333.3',
        PowerC: '333.9',
        VoltageA: '220.1',
        VoltageB: '220.2',
        VoltageC: '220.0',
        CurrentA: '1.5',
        CurrentB: '1.5',
        CurrentC: '1.5'
      },
      TemperatureData: {
        ContainerTemperature: '25.5',
        ContainerHumidity: '60.0',
        Tank1OilH: '45.0',
        Tank1OilL: '35.0',
        Tank2OilH: '46.0',
        Tank2OilL: '36.0',
        Tank1WaterH: '40.0',
        Tank1WaterL: '30.0',
        Tank2WaterH: '41.0',
        Tank2WaterL: '31.0',
        Tank1Pressure: '2.5',
        Tank2Pressure: '2.6'
      },
      UPSData: {
        InputVoltage: '220.0',
        InputFrequency: '50.0',
        OutputVoltage: '220.0',
        OutputFrequency: '50.0',
        Temperature: '30.0',
        BatteryStatus: '95.0'
      }
    })
  }

  const cb = () => {}
  container._handleMessage(packet, cb)

  t.ok(container.lastMessageCache.containerPowerInformation.totalPower === 1000.5)
  t.ok(container.lastMessageCache.containerPowerInformation.APhasePower === 333.3)
  t.ok(container.lastMessageCache.temperatureInformation.containerTemperature === 25.5)
  t.ok(container.lastMessageCache.temperatureInformation.containerHumidity === 60.0)
  t.ok(container.lastMessageCache.temperatureInformation.oilTank1.hotTemperature === 45.0)
  t.ok(container.lastMessageCache.temperatureInformation.oilTank1.coldTemperature === 35.0)
  t.ok(container.lastMessageCache.UPSInformation.inputVoltage === 220.0)
  t.ok(container.lastMessageCache.UPSInformation.batteryLevel === 95.0)
  t.ok(typeof cb === 'function')
})

test('D40Container - _handleMessage with TacticsData topic', (t) => {
  const container = createTestContainer()

  const packet = {
    topic: 'test-containerTacticsData',
    payload: JSON.stringify({
      Tactics: {
        RunTactics: {
          TacticsType: '1',
          ElectricityPrice: {
            RunPrice: '0.10',
            CurrentPrice: '0.12'
          },
          CoinPrice: {
            RunPrice: '50000.00',
            CurrentPrice: '52000.00'
          }
        },
        StopTactics: {
          TacticsType: '2',
          ElectricityPrice: {
            StopPrice: '0.15',
            CurrentPrice: '0.12'
          },
          CoinPrice: {
            StopPrice: '45000.00',
            CurrentPrice: '52000.00'
          }
        }
      }
    })
  }

  const cb = () => {}
  container._handleMessage(packet, cb)

  t.ok(container.lastMessageCache.tactics.startPolicy.tactic === 'electricity')
  t.ok(container.lastMessageCache.tactics.startPolicy.electricityParameters.runPrice === 0.10)
  t.ok(container.lastMessageCache.tactics.startPolicy.electricityParameters.currentPrice === 0.12)
  t.ok(container.lastMessageCache.tactics.stopPolicy.tactic === 'coin')
  t.ok(container.lastMessageCache.tactics.stopPolicy.coinPriceParameters.stopPrice === 45000.00)
  t.ok(container.lastMessageCache.tactics.stopPolicy.coinPriceParameters.currentPrice === 52000.00)
  t.ok(typeof cb === 'function')
})

test('D40Container - _handleMessage with ParameterData topic', (t) => {
  const container = createTestContainer()

  const packet = {
    topic: 'test-containerParameterData',
    payload: JSON.stringify({
      RunningParameter: {
        CoolOilAlarmTemp: '30.0',
        HotOilAlarmTemp: '60.0',
        CoolWaterAlarmTemp: '25.0',
        HotWaterAlarmTemp: '55.0',
        CoolOilSettingTemp: '35.0',
        ExhausFansRunTemp: '40.0',
        PressureAlarmValue: '3.0',
        Tank1Enable: '1',
        Tank2Enable: '0',
        AirExhaustEnable: '1'
      }
    })
  }

  const cb = () => {}
  container._handleMessage(packet, cb)

  t.ok(container.lastMessageCache.alarmTemperatures.coldOil === 30.0)
  t.ok(container.lastMessageCache.alarmTemperatures.hotOil === 60.0)
  t.ok(container.lastMessageCache.setTemperatures.coldOil === 35.0)
  t.ok(container.lastMessageCache.setTemperatures.exhaustFan === 40.0)
  t.ok(container.lastMessageCache.tankStatus.tank1Enabled === true)
  t.ok(container.lastMessageCache.tankStatus.tank2Enabled === false)
  t.ok(container.lastMessageCache.exhaustFanStatus.airExhaustEnabled === true)
  t.ok(typeof cb === 'function')
})

test('D40Container - _handleMessage with unknown topic', (t) => {
  const container = createTestContainer()

  const packet = {
    topic: 'test-containerUnknownTopic',
    payload: JSON.stringify({ test: 'data' })
  }

  const cb = () => {}
  container._handleMessage(packet, cb)

  // Should not update cache for unknown topic
  t.ok(Object.keys(container.lastMessageCache).length === 0)
  t.ok(typeof cb === 'function')
})

test('D40Container - getDeviceInformation', async (t) => {
  const container = createTestContainer()

  container.lastMessageCache.deviceInformation = { test: 'data' }
  const result = await container.getDeviceInformation()
  t.ok(JSON.stringify(result) === JSON.stringify({ test: 'data' }))
})

test('D40Container - setPumpState', async (t) => {
  const mockServer = createMockServer()
  const container = createTestContainer({ server: mockServer })

  const result = await container.setPumpState('oil', 1, true)
  t.ok(result.success === true)
  t.ok(typeof mockServer.publish === 'function')
})

test('D40Container - switchSocket', async (t) => {
  const mockServer = createMockServer()
  const container = createTestContainer({ server: mockServer })

  // Mock PDU socket information
  container.lastMessageCache.PDUSocketInformation = [{
    index: 0,
    socketStatus: [false, false, false, false],
    powerValues: [0, 0, 0, 0],
    currentValues: [0, 0, 0, 0]
  }]

  const result = await container.switchSocket([['1-1', '1', true]])
  t.ok(result.success === true)
  t.ok(typeof mockServer.publish === 'function')
})

test('D40Container - setDryCoolerState', async (t) => {
  const mockServer = createMockServer()
  const container = createTestContainer({ server: mockServer })

  const result = await container.setDryCoolerState(0, 1, true)
  t.ok(result.success === true)
  t.ok(typeof mockServer.publish === 'function')
})

test('D40Container - setTactics', async (t) => {
  const mockServer = createMockServer()
  const container = createTestContainer({ server: mockServer })

  // Mock tactics base data
  container.lastMessageCache._tacticsBase = {
    RunTactics: {},
    StopTactics: {}
  }

  const tactics = {
    start: {
      tacticType: 'electricity',
      startPrice: 0.10,
      currentPrice: 0.12
    },
    stop: {
      tacticType: 'coin',
      stopPrice: 50000,
      currentPrice: 52000
    }
  }

  const result = await container.setTactics(tactics)
  t.ok(result.success === true)
  t.ok(typeof mockServer.publish === 'function')
})

test('D40Container - setTemperatureSettings', async (t) => {
  const container = createTestContainer()

  // Mock required cache data
  container.lastMessageCache.alarmTemperatures = {
    coldOil: 30.0,
    hotOil: 60.0,
    coldWater: 25.0,
    hotWater: 55.0,
    pressure: 3.0
  }
  container.lastMessageCache.setTemperatures = {
    coldOil: 35.0,
    exhaustFan: 40.0
  }
  container.lastMessageCache.tankStatus = {
    tank1Enabled: true,
    tank2Enabled: false
  }
  container.lastMessageCache.exhaustFanStatus = {
    airExhaustEnabled: true
  }

  const settings = {
    coldOil: 32.0,
    hotOil: 65.0,
    coldWater: 28.0,
    hotWater: 58.0,
    coldOilSet: 38.0,
    exhaustFan: 42.0,
    pressureAlarm: 3.5
  }

  const result = await container.setTemperatureSettings(settings)
  t.ok(result.success === true)
  t.ok(typeof container.server.publish === 'function')
})

test('D40Container - setTankEnabled', async (t) => {
  const container = createTestContainer()

  // Mock required cache data
  container.lastMessageCache.alarmTemperatures = {
    coldOil: 30.0,
    hotOil: 60.0,
    coldWater: 25.0,
    hotWater: 55.0,
    pressure: 3.0
  }
  container.lastMessageCache.setTemperatures = {
    coldOil: 35.0,
    exhaustFan: 40.0
  }
  container.lastMessageCache.tankStatus = {
    tank1Enabled: true,
    tank2Enabled: false
  }
  container.lastMessageCache.exhaustFanStatus = {
    airExhaustEnabled: true
  }

  const result = await container.setTankEnabled(1, true)
  t.ok(result.success === true)
  t.ok(typeof container.server.publish === 'function')
})

test('D40Container - setAirExhaustEnabled', async (t) => {
  const container = createTestContainer()

  // Mock required cache data
  container.lastMessageCache.alarmTemperatures = {
    coldOil: 30.0,
    hotOil: 60.0,
    coldWater: 25.0,
    hotWater: 55.0,
    pressure: 3.0
  }
  container.lastMessageCache.setTemperatures = {
    coldOil: 35.0,
    exhaustFan: 40.0
  }
  container.lastMessageCache.tankStatus = {
    tank1Enabled: true,
    tank2Enabled: false
  }
  container.lastMessageCache.exhaustFanStatus = {
    airExhaustEnabled: true
  }

  const result = await container.setAirExhaustEnabled(false)
  t.ok(result.success === true)
  t.ok(typeof container.server.publish === 'function')
})

test('D40Container - switchCoolingSystem', async (t) => {
  const container = createTestContainer()

  // Mock required cache data
  container.lastMessageCache.alarmTemperatures = {
    coldOil: 30.0,
    hotOil: 60.0,
    coldWater: 25.0,
    hotWater: 55.0,
    pressure: 3.0
  }
  container.lastMessageCache.setTemperatures = {
    coldOil: 35.0,
    exhaustFan: 40.0
  }
  container.lastMessageCache.tankStatus = {
    tank1Enabled: true,
    tank2Enabled: false
  }
  container.lastMessageCache.exhaustFanStatus = {
    airExhaustEnabled: true
  }

  const result = await container.switchCoolingSystem(true)
  t.ok(result.success === true)
  t.ok(typeof container.server.publish === 'function')
})

test('D40Container - resetAlarm', async (t) => {
  const mockServer = createMockServer()
  const container = createTestContainer({ server: mockServer })

  const result = await container.resetAlarm()
  t.ok(result.success === true)
  t.ok(typeof mockServer.publish === 'function')
})

test('D40Container - switchContainer', async (t) => {
  const mockServer = createMockServer()
  const container = createTestContainer({ server: mockServer })

  const result = await container.switchContainer(true)
  t.ok(result.success === true)
  t.ok(typeof mockServer.publish === 'function')
})

test('D40Container - _prepErrors with alarm info', (t) => {
  const container = createTestContainer()

  container.lastMessageCache.alarmInfo = ['OilPump1 error', 'WaterPump1 error']
  container._errorLog = []

  const result = container._prepErrors()
  t.ok(result.isErrored === true)
  t.ok(result.errors.length === 2)
  t.ok(result.errors[0].name === 'oil_pump_error')
  t.ok(result.errors[0].message === 'Oil pump #1 has an error')
})

test('D40Container - _prepErrors with unknown error', (t) => {
  const container = createTestContainer()

  container.lastMessageCache.alarmInfo = ['Unknown error']
  container._errorLog = []

  const result = container._prepErrors()
  t.ok(result.isErrored === true)
  t.ok(result.errors.length === 1)
  t.ok(result.errors[0].name === 'unknown')
  t.ok(result.errors[0].message === 'Unknown error')
})

test('D40Container - _prepErrors with no alarm info', (t) => {
  const container = createTestContainer()

  container.lastMessageCache.alarmInfo = undefined
  container._errorLog = []

  const result = container._prepErrors()
  t.ok(result.isErrored === false)
  t.ok(result.errors.length === 0)
})

test('D40Container - _prepSnap when offline', (t) => {
  const container = createTestContainer()

  // Mock offline state
  container.isThingOnline = () => false

  try {
    container._prepSnap()
    t.fail('Expected error for offline state')
  } catch (err) {
    t.ok(err.message.includes('ERR_OFFLINE'))
  }
})

test('D40Container - _prepSnap when online', (t) => {
  const container = createTestContainer()

  // Mock online state and required cache data
  container.isThingOnline = () => true
  container.lastMessageCache.runningState = true
  container.lastMessageCache.alarmState = false
  container.lastMessageCache.containerPowerInformation = {
    totalPower: 1000.5,
    APhaseVoltage: 220.1,
    BPhaseVoltage: 220.2,
    CPhaseVoltage: 220.0,
    APhaseCurrent: 1.5,
    BPhaseCurrent: 1.5,
    CPhaseCurrent: 1.5,
    APhasePower: 333.3,
    BPhasePower: 333.3,
    CPhasePower: 333.9
  }
  container.lastMessageCache.temperatureInformation = {
    containerTemperature: 25.5,
    containerHumidity: 60.0,
    tank1Pressure: 2.5,
    tank2Pressure: 2.6,
    oilTank1: { hotTemperature: 45.0, coldTemperature: 35.0 },
    oilTank2: { hotTemperature: 46.0, coldTemperature: 36.0 },
    waterTank1: { hotTemperature: 40.0, coldTemperature: 30.0 },
    waterTank2: { hotTemperature: 41.0, coldTemperature: 31.0 }
  }
  container.lastMessageCache.deviceInformation = {
    oilPump1RunningStatus: true,
    oilPump2RunningStatus: false,
    waterPump1RunningStatus: true,
    waterPump2RunningStatus: false,
    dryCoolerStatus: [{
      index: 0,
      mainContactorStatus: true,
      fanRunningStatus: [true, false, true]
    }]
  }
  container.lastMessageCache.tankStatus = {
    tank1Enabled: true,
    tank2Enabled: false
  }
  container.lastMessageCache.exhaustFanStatus = {
    airExhaustEnabled: true
  }
  container.lastMessageCache.UPSInformation = {
    batteryLevel: 95.0,
    temperature: 30.0,
    inputVoltage: 220.0,
    inputFrequency: 50.0,
    outputVoltage: 220.0,
    outputFrequency: 50.0
  }
  container.lastMessageCache.tactics = {
    startPolicy: {
      tactic: 'electricity',
      electricityParameters: { runPrice: 0.10, currentPrice: 0.12 },
      coinPriceParameters: { runPrice: 50000, currentPrice: 52000 }
    },
    stopPolicy: {
      tactic: 'coin',
      electricityParameters: { stopPrice: 0.15, currentPrice: 0.12 },
      coinPriceParameters: { stopPrice: 45000, currentPrice: 52000 }
    }
  }
  container.lastMessageCache.alarmTemperatures = {
    coldOil: 30.0,
    hotOil: 60.0,
    coldWater: 25.0,
    hotWater: 55.0,
    pressure: 3.0
  }
  container.lastMessageCache.setTemperatures = {
    coldOil: 35.0,
    exhaustFan: 40.0
  }
  container.lastMessageCache.PDUSocketInformation = [{
    index: 0,
    socketStatus: [true, false, true, false],
    powerValues: [100.5, 0, 150.7, 0],
    currentValues: [2.1, 0, 3.1, 0]
  }]
  container.lastMessageCache.alarmInfo = []

  const result = container._prepSnap()
  t.ok(result.stats.status === 'running')
  t.ok(result.stats.power_w === 1000500) // 1000.5 * 1000
  t.ok(result.stats.alarm_status === false)
  t.ok(result.stats.ambient_temp_c === 25.5)
  t.ok(result.stats.humidity_percent === 60.0)
  t.ok(result.stats.container_specific.cooling_system.oil_pump[0].enabled === true)
  t.ok(result.stats.container_specific.cooling_system.oil_pump[0].hot_temp_c === 45.0)
  t.ok(result.stats.container_specific.cooling_system.oil_pump[0].cold_temp_c === 35.0)
  t.ok(result.stats.container_specific.ups.battery_percent === 95.0)
  t.ok(result.config.container_specific.mqtt_url === 'mqtt://undefined:undefined')
})
