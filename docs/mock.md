# Mock Server Documentation

This document gives a quickstart for running the mock server

## Todo
- [ ] Implement temperature increase and decrease depending on sockets and cooling systems.
- [ ] Power increase due to cooling system change is not implemented. There is a fixed power consumption of 5kW.
- [x] Currently M56 is the only mock impl, will add others once more info

## Running the mock server

The mock server can be run using the following command:

```bash
node mock/server.js --type D40_M56 --id bitdeer-9a
```

The MQTT server port `-p, --port` argument is optional and defaults to `10883`

The MQTT server host `-h, --host` argument is optional and defaults to `127.0.0.1`

The `--error` flag can be used to make the mock server send errored data

The Container ID `--id` arguement is optional and defaults to `C024_D40`

The `--type` argument is required. The following types are supported:
- [x] D40_M56
- [x] D40_M30
- [x] D40_A1346
- [x] D40_S19xp
