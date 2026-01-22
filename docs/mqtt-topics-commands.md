# MQTT Topics and Commands Reference

This document lists all MQTT topics and commands used in the Bitdeer D40 container communication system.


## Data Topics (Published by Container, Subscribed by Worker)

These topics are published by the container at regular intervals and subscribed to by the worker.

### 1. `RunningInfo`
**Direction:** Container → Worker  
**Frequency:** Every 5000ms  
**Purpose:** Running state and device information

**Payload Structure:**
```json
{
  "AlarmState": "0" | "1",
  "AlarmInfo": ["alarm1", "alarm2", ...],
  "RunningState": "0" | "1",
  "DeviceInfo": {
    "OilPump1": "0" | "1",
    "OilPump2": "0" | "1",
    "WaterPump1": "0" | "1",
    "WaterPump2": "0" | "1",
    "DryCooler": [
      {
        "CoolerIndex": "0" | "1",
        "MainContactor": "0" | "1",
        "FansStatus": ["0" | "1", ...]
      }
    ]
  }
}
```

### 2. `PDUData`
**Direction:** Container → Worker  
**Frequency:** Every 5000ms  
**Purpose:** PDU (Power Distribution Unit) socket status and power data

**Payload Structure:**
```json
{
  "PDUData": [
    {
      "PDUIndex": "0" | "1" | ...,
      "SocketStatus": ["0" | "1", ...],
      "PowerData": ["0.0", "1.5", ...],
      "CurrentData": ["0.0", "2.3", ...]
    }
  ]
}
```

### 3. `MainData`
**Direction:** Container → Worker  
**Frequency:** Every 5000ms  
**Purpose:** Main power, temperature, and UPS data

**Payload Structure:**
```json
{
  "PowerData": {
    "TotalPower": "100.5",
    "PowerA": "33.5",
    "PowerB": "33.5",
    "PowerC": "33.5",
    "VoltageA": "220.0",
    "VoltageB": "220.0",
    "VoltageC": "220.0",
    "CurrentA": "0.5",
    "CurrentB": "0.5",
    "CurrentC": "0.5"
  },
  "TemperatureData": {
    "ContainerTemperature": "25.5",
    "ContainerHumidity": "60.0",
    "Tank1OilH": "45.0",
    "Tank1OilL": "35.0",
    "Tank2OilH": "45.0",
    "Tank2OilL": "35.0",
    "Tank1WaterH": "40.0",
    "Tank1WaterL": "30.0",
    "Tank2WaterH": "40.0",
    "Tank2WaterL": "30.0",
    "Tank1Pressure": "1.5",
    "Tank2Pressure": "1.5"
  },
  "UPSData": {
    "InputVoltage": "220.0",
    "InputFrequency": "50.0",
    "OutputVoltage": "220.0",
    "OutputFrequency": "50.0",
    "Temperature": "30.0",
    "BatteryStatus": "100.0"
  }
}
```

### 4. `TacticsData`
**Direction:** Container → Worker  
**Frequency:** Every 5000ms  
**Purpose:** Mining tactics configuration (start/stop policies)

**Payload Structure:**
```json
{
  "Tactics": {
    "RunTactics": {
      "TacticsType": "0" | "1" | "2",  // 0=disabled, 1=electricity, 2=coin
      "ElectricityPrice": {
        "RunPrice": "0.10",
        "CurrentPrice": "0.12"
      },
      "CoinPrice": {
        "RunPrice": "50000.00",
        "CurrentPrice": "52000.00"
      }
    },
    "StopTactics": {
      "TacticsType": "0" | "1" | "2",
      "ElectricityPrice": {
        "StopPrice": "0.15",
        "CurrentPrice": "0.12"
      },
      "CoinPrice": {
        "StopPrice": "48000.00",
        "CurrentPrice": "52000.00"
      }
    }
  }
}
```

### 5. `ParameterData`
**Direction:** Container → Worker  
**Frequency:** Every 5000ms  
**Purpose:** Running parameters including temperature settings and tank status

**Payload Structure:**
```json
{
  "RunningParameter": {
    "CoolOilAlarmTemp": "30.0",
    "HotOilAlarmTemp": "50.0",
    "CoolWaterAlarmTemp": "25.0",
    "HotWaterAlarmTemp": "45.0",
    "CoolOilSettingTemp": "35.0",
    "ExhausFansRunTemp": "40.0",
    "PressureAlarmValue": "2.0",
    "Tank1Enable": "0" | "1",
    "Tank2Enable": "0" | "1",
    "AirExhaustEnable": "0" | "1"
  }
}
```

## Command Topics (Published by Worker, Subscribed by Container)

These topics are used by the worker to send commands to the container.

### 1. `PumpOperate`
**Direction:** Worker → Container  
**Purpose:** Control oil or water pumps

**Payload Structure:**
```json
{
  "Type": "OilPump" | "WaterPump",
  "Index": "1" | "2",
  "Operate": "0" | "1"  // 0=off, 1=on
}
```

**Example:**
```json
{
  "Type": "OilPump",
  "Index": "1",
  "Operate": "1"
}
```

### 2. `PDUOperate`
**Direction:** Worker → Container  
**Purpose:** Control PDU sockets (power on/off individual sockets)

**Payload Structure:**
```json
{
  "PDUIndex": "0" | "1" | ... | "-1",  // -1 = all PDUs
  "SocketIndex": "0" | "1" | ... | "-1",  // -1 = all sockets
  "Operate": "0" | "1"  // 0=off, 1=on
}
```

**Example:**
```json
{
  "PDUIndex": "0",
  "SocketIndex": "5",
  "Operate": "1"
}
```

### 3. `CoolerOperate`
**Direction:** Worker → Container  
**Purpose:** Control dry cooler fans

**Payload Structure:**
```json
{
  "CoolerIndex": "0" | "1" | ...,
  "FansIndex": "0" | "1" | ... | "-1",  // -1 = all fans
  "Operate": "0" | "1"  // 0=off, 1=on
}
```

**Example:**
```json
{
  "CoolerIndex": "0",
  "FansIndex": "-1",
  "Operate": "1"
}
```

### 4. `ParameterSet`
**Direction:** Worker → Container  
**Purpose:** Set running parameters (temperatures, tank status, exhaust fan)

**Payload Structure:**
```json
{
  "TimeStamp": "yyyy-MM-dd HH:mm:ss",
  "RunningParameter": {
    "CoolOilAlarmTemp": "30.0",  // Optional
    "HotOilAlarmTemp": "50.0",  // Optional
    "CoolWaterAlarmTemp": "25.0",  // Optional
    "HotWaterAlarmTemp": "45.0",  // Optional
    "CoolOilSettingTemp": "35.0",  // Optional
    "ExhausFansRunTemp": "40.0",  // Optional
    "PressureAlarmValue": "2.0",  // Optional
    "Tank1Enable": "0" | "1",  // Optional
    "Tank2Enable": "0" | "1",  // Optional
    "AirExhaustEnable": "0" | "1"  // Optional
  }
}
```

**Note:** Only include fields you want to update. All fields are optional.

**Example:**
```json
{
  "TimeStamp": "2023-06-16 19:33:00",
  "RunningParameter": {
    "CoolOilAlarmTemp": "30.0",
    "Tank1Enable": "1",
    "AirExhaustEnable": "1"
  }
}
```

### 5. `RunningOperate`
**Direction:** Worker → Container  
**Purpose:** Control container running state and reset alarms

**Payload Structure:**
```json
{
  "TimeStamp": "yyyy-MM-dd HH:mm:ss",
  "Operate": "AlarmReset" | "AutoRun" | "AutoStop"
}
```

**Operations:**
- `AlarmReset`: Reset all alarms
- `AutoRun`: Start container in auto mode
- `AutoStop`: Stop container

**Example:**
```json
{
  "TimeStamp": "2023-06-16 19:33:00",
  "Operate": "AutoRun"
}
```

### 6. `TacticsSet`
**Direction:** Worker → Container  
**Purpose:** Set mining tactics (start/stop policies)

**Payload Structure:**
```json
{
  "Tactics": {
    "RunTactics": {
      "TacticsType": "0" | "1" | "2",  // 0=disabled, 1=electricity, 2=coin
      "ElectricityPrice": {
        "RunPrice": "0.10",
        "CurrentPrice": "0.12"
      },
      "CoinPrice": {
        "RunPrice": "50000.00",
        "CurrentPrice": "52000.00"
      }
    },
    "StopTactics": {
      "TacticsType": "0" | "1" | "2",
      "ElectricityPrice": {
        "StopPrice": "0.15",
        "CurrentPrice": "0.12"
      },
      "CoinPrice": {
        "StopPrice": "48000.00",
        "CurrentPrice": "52000.00"
      }
    }
  }
}
```

**Tactics Types:**
- `"0"`: Disabled
- `"1"`: Electricity price-based
- `"2"`: Coin price-based

**Example:**
```json
{
  "Tactics": {
    "RunTactics": {
      "TacticsType": "2",
      "CoinPrice": {
        "RunPrice": "50000.00",
        "CurrentPrice": "52000.00"
      }
    },
    "StopTactics": {
      "TacticsType": "2",
      "CoinPrice": {
        "StopPrice": "48000.00",
        "CurrentPrice": "52000.00"
      }
    }
  }
}
```

## Summary Table

| Topic | Direction | Type | Purpose |
|-------|-----------|------|---------|
| `RunningInfo` | Container → Worker | Data | Running state and device status |
| `PDUData` | Container → Worker | Data | PDU socket status and power |
| `MainData` | Container → Worker | Data | Power, temperature, UPS data |
| `TacticsData` | Container → Worker | Data | Mining tactics configuration |
| `ParameterData` | Container → Worker | Data | Running parameters |
| `PumpOperate` | Worker → Container | Command | Control pumps |
| `PDUOperate` | Worker → Container | Command | Control PDU sockets |
| `CoolerOperate` | Worker → Container | Command | Control dry cooler fans |
| `ParameterSet` | Worker → Container | Command | Set running parameters |
| `RunningOperate` | Worker → Container | Command | Control container state |
| `TacticsSet` | Worker → Container | Command | Set mining tactics |




