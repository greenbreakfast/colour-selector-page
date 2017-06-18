# colour-selector-page
An HTML5 colour selector that publishes the HSV colour value to a MQTT topic (through a websocket)

## TODO:

* convert style to bootstrap

## Operation

Once connected to a *MQTT broker on a websocket*, it will publish the HSV colour value from the colour wheel to a topic named `color`


## Running on the Omega2

This can be run on the Onion Omega2

### Installation

Install packages:
```
opkg update
opkg install mosquitto-ssl mosquitto-client-ssl
```

### Configuration

Edit the Mosquitto configuration file, `/etc/mosquitto/mosquitto.conf` and add:

```
bind_address 0.0.0.0
port 1883
protocol mqtt

log_type information
log_type websockets
websockets_log_level 0

listener 9001 0.0.0.0
protocol websockets
```

Soft link the `www` directory to `/www/jevois`

TODO: indtructions for bower...

### Operation

Browse to `http://omega-xxxx.local/jevois`

To connect to the Omega's MQTT broker, connect to: `ws://omega-xxxx.local/mqtt`

