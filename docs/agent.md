Agent is application that is used to administer gateways that are connected to Mainflux.

# Run Agent 

Agent
```
git clone https://github.com/mainflux/agent
make
cd build

MF_AGENT_LOG_LEVEL=debug MF_AGENT_MQTT_URL=tcp://localhost:18831 MF_AGENT_THING_ID=4a437f46-da7b-4469-96b7-be754b5e8d36 MF_AGENT_THING_KEY=ac6b57e0-9b70-45d6-94c8-e67ac9086165
MF_AGENT_CONTROL_CHANNEL=4c66a785-1900-4844-8caa-56fb8cfd61eb
MF_AGENT_BOOTSTRAP_KEY=edged
MF_AGENT_BOOTSTRAP_ID=34:e1:2d:e6:cf:03 ./mainflux-agent
```