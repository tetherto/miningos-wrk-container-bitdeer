# Bitdeer APIs

This document describes the functions exposed by the `container.js` library for Bitdeer. Below are functions common to all containers. Look at individual container documentation for specific changes if any. As of now we are not aware of any container specific changes

## Container specific documentation

- [D40](./bitdeer-d40.md)

## Common Functions
- [Bitdeer APIs](#bitdeer-apis)
  - [`constructor (containerId, containerName, mqttConnectionUrl)` -\> `D40Container`](#constructor-containerid-containername-mqttconnectionurl---d40container)
    - [Parameters](#parameters)
  - [`getDeviceInformation()` -\> `Object`](#getdeviceinformation---object)
    - [Returns](#returns)
  - [`getPDUSocketInformation()` -\> `Array<Object>`](#getpdusocketinformation---arrayobject)
    - [Returns](#returns-1)
  - [`getContainerPowerInformation()` -\> `Object`](#getcontainerpowerinformation---object)
    - [Returns](#returns-2)
  - [`getTemperatureInformation()` -\> `Object`](#gettemperatureinformation---object)
    - [Returns](#returns-3)
  - [`getUPSInformation()` -\> `Object`](#getupsinformation---object)
    - [Returns](#returns-4)
  - [`getTactics()` -\> `Object`](#gettactics---object)
    - [Returns](#returns-5)
  - [`getAlarmTemperatures()` -\> `Object`](#getalarmtemperatures---object)
    - [Returns](#returns-6)
  - [`getSetTemperatures()` -\> `Object`](#getsettemperatures---object)
    - [Returns](#returns-7)
  - [`getTankStatus()` -\> `Object`](#gettankstatus---object)
    - [Returns](#returns-8)
  - [`getExhaustFanStatus()` -\> `Object`](#getexhaustfanstatus---object)
    - [Returns](#returns-9)
  - [`setPumpState(pumpType, index, status)` -\> `void`](#setpumpstatepumptype-index-status---void)
    - [Parameters](#parameters-1)
  - [`setPDUSocketState(PDUIndex, socketIndex, status)` -\> `void`](#setpdusocketstatepduindex-socketindex-status---void)
    - [Parameters](#parameters-2)
  - [`setDryCoolerState(dryCoolerIndex, fanIndex, status)` -\> `void`](#setdrycoolerstatedrycoolerindex-fanindex-status---void)
    - [Parameters](#parameters-3)
  - [`setStopTactic(tacticType, stopPrice, currentPrice)` -\> `void`](#setstoptactictactictype-stopprice-currentprice---void)
    - [Parameters](#parameters-4)
  - [`setStartTactic(tacticType, startPrice, currentPrice)` -\> `void`](#setstarttactictactictype-startprice-currentprice---void)
    - [Parameters](#parameters-5)
  - [`setHotOilAlarmTemperature(temperature)` -\> `void`](#sethotoilalarmtemperaturetemperature---void)
    - [Parameters](#parameters-6)
  - [`setHotWaterAlarmTemperature(temperature)` -\> `void`](#sethotwateralarmtemperaturetemperature---void)
    - [Parameters](#parameters-7)
  - [`setColdOilAlarmTemperature(temperature)` -\> `void`](#setcoldoilalarmtemperaturetemperature---void)
    - [Parameters](#parameters-8)
  - [`setColdWaterAlarmTemperature(temperature)` -\> `void`](#setcoldwateralarmtemperaturetemperature---void)
    - [Parameters](#parameters-9)
  - [`setColdOilTemperature(temperature)` -\> `void`](#setcoldoiltemperaturetemperature---void)
    - [Parameters](#parameters-10)
  - [`setExhaustFanTemperature(fanTemperature)` -\> `void`](#setexhaustfantemperaturefantemperature---void)
    - [Parameters](#parameters-11)
  - [`setTankEnabled(tankIndex, status)` -\> `void`](#settankenabledtankindex-status---void)
    - [Parameters](#parameters-12)
  - [`setAirExhaustEnabled(status)` -\> `void`](#setairexhaustenabledstatus---void)
    - [Parameters](#parameters-13)
  - [`resetAlarm()` -\> `void`](#resetalarm---void)
  - [`setAutoRun(state)` -\> `void`](#setautorunstate---void)
    - [Parameters](#parameters-14)


## `constructor (containerId, containerName, mqttConnectionUrl)` -> `D40Container`
Creates a new `D40Container` instance.

### Parameters
| Param  | Type | Description | Default |
| -- | -- | -- | -- |
| containerId | `string` | ID of the container (for identification purposes). | |
| containerName | `string` | Name of the container (for identification purposes). | |
| mqttConnectionUrl | `string` | Connection URL for MQTT server | |

## `getDeviceInformation()` -> `Object`
Get the cooling system status of the container.

### Returns
| Key | Type | Description |
| -- | -- | -- |
| oilPump1RunningStatus | `bool` | Running status of Oil Pump 1 |
| oilPump2RunningStatus | `bool` | Running status of Oil Pump 2 |
| waterPump1RunningStatus | `bool` | Running status of Water Pump 1 |
| waterPump2RunningStatus | `bool` | Running status of Water Pump 2 |
| dryCoolerStatus | `Array<Object>` | Status of the dry cooler fans |
| dryCoolerStatus.index | `Number` | Index of the dry cooler |
| dryCoolerStatus.mainContactorStatus | `bool` | Main contactor status |
| dryCoolerStatus.fanRunningStatus | `Array<bool>` | Status of the fans of the dry cooler |

## `getPDUSocketInformation()` -> `Array<Object>`
Get the status of the PDU sockets.

### Returns
| Key | Type | Description |
| -- | -- | -- |
| index | `Number` | Index of the PDU |
| socketStatus | `Array<bool>` | Status of the sockets |
| powerValues | `Array<Number>` | Power values of the sockets |
| currentValues | `Array<Number>` | Current values of the sockets |

## `getContainerPowerInformation()` -> `Object`
Get the power information of the container.

### Returns
| Key | Type | Description |
| -- | -- | -- |
| totalPower | `Number` | Total power of the container |
| APhasePower | `Number` | Power of the A phase |
| BPhasePower | `Number` | Power of the B phase |
| CPhasePower | `Number` | Power of the C phase |
| APhaseVoltage | `Number` | Voltage of the A phase |
| BPhaseVoltage | `Number` | Voltage of the B phase |
| CPhaseVoltage | `Number` | Voltage of the C phase |
| APhaseCurrent | `Number` | Current of the A phase |
| BPhaseCurrent | `Number` | Current of the B phase |
| CPhaseCurrent | `Number` | Current of the C phase |

## `getTemperatureInformation()` -> `Object`
Get the temperature information of the container.

### Returns
| Key | Type | Description |
| -- | -- | -- |
| containerTemperature | `Number` | Temperature of the container |
| containerHumidity | `Number` | Humidity of the container |
| oilTank1 | `Object` | Temperature information of Oil Tank 1 |
| oilTank1.hotTemperature | `Number` | Hot temperature of Oil Tank 1 |
| oilTank1.coldTemperature | `Number` | Cold temperature of Oil Tank 1 |
| oilTank2 | `Object` | Temperature information of Oil Tank 2 |
| oilTank2.hotTemperature | `Number` | Hot temperature of Oil Tank 2 |
| oilTank2.coldTemperature | `Number` | Cold temperature of Oil Tank 2 |
| waterTank1 | `Object` | Temperature information of Water Tank 1 |
| waterTank1.hotTemperature | `Number` | Hot temperature of Water Tank 1 |
| waterTank1.coldTemperature | `Number` | Cold temperature of Water Tank 1 |
| waterTank2 | `Object` | Temperature information of Water Tank 2 |
| waterTank2.hotTemperature | `Number` | Hot temperature of Water Tank 2 |
| waterTank2.coldTemperature | `Number` | Cold temperature of Water Tank 2 |

## `getUPSInformation()` -> `Object`
Get the UPS information of the container.

### Returns
| Key | Type | Description |
| -- | -- | -- |
| inputVoltage | `Number` | Input voltage of the UPS |
| inputFrequency | `Number` | Input frequency of the UPS |
| outputVoltage | `Number` | Output voltage of the UPS |
| outputFrequency | `Number` | Output frequency of the UPS |
| temperature | `Number` | Temperature of the UPS |
| batteryLevel | `Number` | Battery level of the UPS |

## `getTactics()` -> `Object`
Get the performance tactics of the container.

### Returns
| Key | Type | Description |
| -- | -- | -- |
| stopPolicy | `Object` | Stop policy of the container |
| stopPolicy.tactic | `string` | Tactic of the stop policy (one of `disabledPolicy`, `electricityPolicy`, `coinPricePolicy`) |
| stopPolicy.electricityParameters | `Object` | Electricity parameters of the stop policy |
| stopPolicy.electricityParameters.stopPrice | `Number` | Electricity stop price |
| stopPolicy.electricityParameters.currentPrice | `Number` | Current electricity price |
| stopPolicy.coinPriceParameters | `Object` | Coin price parameters of the stop policy |
| stopPolicy.coinPriceParameters.coinPrice | `Number` | Coin price of the stop policy |
| stopPolicy.coinPriceParameters.currentPrice | `Number` | Current coin price |
| startPolicy | `Object` | Start policy of the container |
| startPolicy.tactic | `string` | Tactic of the start policy (one of `disabledPolicy`, `electricityPolicy`, `coinPricePolicy`) |
| startPolicy.electricityParameters | `Object` | Electricity parameters of the start policy |
| startPolicy.electricityParameters.startPrice | `Number` | Electricity start price |
| startPolicy.electricityParameters.currentPrice | `Number` | Current electricity price |
| startPolicy.coinPriceParameters | `Object` | Coin price parameters of the start policy |
| startPolicy.coinPriceParameters.coinPrice | `Number` | Coin price of the start policy |
| startPolicy.coinPriceParameters.currentPrice | `Number` | Current coin price |

## `getAlarmTemperatures()` -> `Object`
Get the alarm temperatures of the container.

### Returns
| Key | Type | Description |
| -- | -- | -- |
| coldOil | `Number` | Cold oil alarm temperature |
| hotOil | `Number` | Hot oil alarm temperature |
| coldWater | `Number` | Cold water alarm temperature |
| hotWater | `Number` | Hot water alarm temperature |


## `getSetTemperatures()` -> `Object`
Get the set temperatures of the container.

### Returns
| Key | Type | Description |
| -- | -- | -- |
| coldOil | `Number` | Cold oil set temperature |
| exhaustFan | `Number` | Exhaust fan set temperature |


## `getTankStatus()` -> `Object`
Get the tank status of the container.

### Returns
| Key | Type | Description |
| -- | -- | -- |
| tank1Enabled | `bool` | Tank 1 enabled |
| tank2Enabled | `bool` | Tank 2 enabled |


## `getExhaustFanStatus()` -> `Object`
Get the exhaust fan status of the container.

### Returns
| Key | Type | Description |
| -- | -- | -- |
| airExhaustEnabled | `bool` | Air exhaust enabled |

## `setPumpState(pumpType, index, status)` -> `void`
Set the state of a pump.

### Parameters
| Param  | Type | Description | Default |
| -- | -- | -- | -- |
| pumpType | `string` | Type of the pump (one of `oilPump`, `waterPump`) | |
| index | `Number` | Index of the pump | |
| status | `bool` | Status of the pump to be set | |


## `setPDUSocketState(PDUIndex, socketIndex, status)` -> `void`
Set the state of a PDU socket.

### Parameters
| Param  | Type | Description | Default |
| -- | -- | -- | -- |
| PDUIndex | `Number` | Index of the PDU | |
| socketIndex | `Number` | Index of the socket | |
| status | `bool` | Status of the socket to be set | |


## `setDryCoolerState(dryCoolerIndex, fanIndex, status)` -> `void`
Set the state of a dry cooler fan.

### Parameters
| Param  | Type | Description | Default |
| -- | -- | -- | -- |
| dryCoolerIndex | `Number` | Index of the dry cooler | |
| fanIndex | `Number` | Index of the fan | |
| status | `bool` | Status of the fan to be set | |


## `setStopTactic(tacticType, stopPrice, currentPrice)` -> `void`
Set the stop tactic of the container.

### Parameters
| Param  | Type | Description | Default |
| -- | -- | -- | -- |
| tacticType | `string` | Type of the tactic (one of `disabledPolicy`, `electricityPolicy`, `coinPricePolicy`) | |
| stopPrice | `Number` | Stop price of the tactic | |
| currentPrice | `Number` | Current price of the tactic | |


## `setStartTactic(tacticType, startPrice, currentPrice)` -> `void`
Set the start tactic of the container.

### Parameters
| Param  | Type | Description | Default |
| -- | -- | -- | -- |
| tacticType | `string` | Type of the tactic (one of `disabledPolicy`, `electricityPolicy`, `coinPricePolicy`) | |
| startPrice | `Number` | Start price of the tactic | |
| currentPrice | `Number` | Current price of the tactic | |


## `setHotOilAlarmTemperature(temperature)` -> `void`
Set the hot oil alarm temperature of the container.

### Parameters
| Param  | Type | Description | Default |
| -- | -- | -- | -- |
| temperature | `Number` | Hot oil alarm temperature | |


## `setHotWaterAlarmTemperature(temperature)` -> `void`
Set the hot water alarm temperature of the container.

### Parameters
| Param  | Type | Description | Default |
| -- | -- | -- | -- |
| temperature | `Number` | Hot water alarm temperature | |


## `setColdOilAlarmTemperature(temperature)` -> `void`
Set the cold oil alarm temperature of the container.

### Parameters
| Param  | Type | Description | Default |
| -- | -- | -- | -- |
| temperature | `Number` | Cold oil alarm temperature | |


## `setColdWaterAlarmTemperature(temperature)` -> `void`
Set the cold water alarm temperature of the container.

### Parameters
| Param  | Type | Description | Default |
| -- | -- | -- | -- |
| temperature | `Number` | Cold water alarm temperature | |


## `setColdOilTemperature(temperature)` -> `void`
Set the cold oil temperature of the container.

### Parameters
| Param  | Type | Description | Default |
| -- | -- | -- | -- |
| temperature | `Number` | Cold oil temperature | |


## `setExhaustFanTemperature(fanTemperature)` -> `void`
Set the exhaust fan temperature of the container.

### Parameters
| Param  | Type | Description | Default |
| -- | -- | -- | -- |
| fanTemperature | `Number` | Exhaust fan temperature | |


## `setTankEnabled(tankIndex, status)` -> `void`
Set the tank status of the container.

### Parameters
| Param  | Type | Description | Default |
| -- | -- | -- | -- |
| tankIndex | `Number` | Index of the tank | |
| status | `bool` | Status of the tank to be set | |


## `setAirExhaustEnabled(status)` -> `void`
Set the exhaust fan status of the container.

### Parameters
| Param  | Type | Description | Default |
| -- | -- | -- | -- |
| status | `bool` | Status of the exhaust fan to be set | |


## `resetAlarm()` -> `void`
Reset the alarm of the container.

## `setAutoRun(state)` -> `void`
Set the auto run state of the container.

### Parameters
| Param  | Type | Description | Default |
| -- | -- | -- | -- |
| state | `bool` | State of the auto run to be set | |

