Agent is application that is used to administer gateways that are connected to Mainflux. It provides a way to send commands to gateway and receive response via mqtt.
There are two type of channels used for ***Agent*** DATA and CONTROL.
Over the control we are sending commands and recieving response from commands
Data channel is used for collecting data from sensors connected to gateway.
Agent is able to configure itself provided that [bootsrap server](./bootstrap.md) is running.

# Run Agent 

Before running agent we need to make bootstrap configuration

Agent

Before running agent you need to create a bootstrap configuration
```
git clone https://github.com/mainflux/agent
make
cd build

MF_AGENT_LOG_LEVEL=debug \
MF_AGENT_MQTT_URL=tcp://localhost:18831 \
MF_AGENT_BOOTSTRAP_KEY=edged \
MF_AGENT_BOOTSTRAP_ID=34:e1:2d:e6:cf:03 ./mainflux-agent
```

 - MF_AGENT_MQTT_URL - is address of mainflux mqtt broker
 - MF_AGENT_BOOTSTRAP_KEY edged
 - MF_AGENT_BOOSTRAP_ID - 
, MF_AGENT_THING_KEY and MF_AGENT_CONTROL_CHANNEL are mainflux thing id, thing key and channel respectively that 