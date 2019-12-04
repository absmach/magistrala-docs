Agent is application that is used to administer gateways that are connected to Mainflux. It provides a way to send commands to gateway and receive response via mqtt.
There are two type of channels used for ***Agent*** DATA and CONTROL.
Over the control we are sending commands and recieving response from commands
Data channel is used for collecting data from sensors connected to gateway.
Agent is able to configure itself provided that [bootsrap server](./bootstrap.md) is running, actually it will retrieve configuration from bootstrap server.

# Run Agent 

Before running agent we need to provision a thing and DATA and CONTROL channel. Thing that will be used as gateway representation and make bootstrap configuration.
If using UI this is done automatically.


To create a bootstrap config you will need the get the users token

```
curl -S -i -H "Content-Type: application/json" -X POST http://mainflux_host/tokens -d '{"email":"nostalgic_bell@email.com", "password":"123"}'
HTTP/1.1 201 Created
Content-Type: application/json
Date: Wed, 04 Dec 2019 17:50:15 GMT
Content-Length: 208

{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NzU1MTc4MTUsImlhdCI6MTU3NTQ4MTgxNSwiaXNzIjoibWFpbmZsdXgiLCJzdWIiOiJub3N0YWxnaWNfYmVsbEBlbWFpbC5jb20ifQ.3ccEQD2CoJf5QirCef1k_9Q065TLQ8TbUhweTEVXNHs"}
```

then use this token to create bootstrap configuration

```

curl -s -S -i -X POST -H "Authorization: TOKEN" -H "Content-Type: application/json" \
http://mainflux_host/bs/things/configs -d `{ \
    "external_id":"34:e1:2d:e6:cf:03",\
    "thing_id": "4a437f46-da7b-4469-96b7-be754b5e8d36", \
    "external_key":"agent", \
    "name":"agent-bootstrap", \
    "channels":[ "4c66a785-1900-4844-8caa-56fb8cfd61eb", "0c9272a5-16d0-44aa-a7d8-a97a1a6acf25" ], \
,
    "content" : "{\"log_level\":\"debug\", \"http_port\":\"9000\", \\"mqtt_url\":\"tcp://localhost:18831\",\"edgex_url\":\"http://localhost:48090/api/v1/\" }"
    }'

```


- external_id is usually MAC address 
- external_key is key that will be provided to agent process
- thing_id is mainflux thing id 
- channels is 2-element array where first channel is CONTROL and second is DATA, both channels should be assigned to thing
- content is used for configuring parameters of agent service 


Then to start the agent service you can do it like this

```
git clone https://github.com/mainflux/agent
make
cd build

MF_AGENT_LOG_LEVEL=debug \
MF_AGENT_BOOTSTRAP_KEY=edged \
MF_AGENT_BOOTSTRAP_ID=34:e1:2d:e6:cf:03 ./mainflux-agent
```

 - MF_AGENT_BOOTSTRAP_KEY - is external_key in bootstrap configuration
 - MF_AGENT_BOOSTRAP_ID - is external_id in boostrap configuration 
