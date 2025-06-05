---
title: Getting Started
---


Welcome to the **Magistrala Developer Guide**! This guide provides comprehensive instructions for installing, building, running, and interacting with Magistrala, an advanced messaging platform. Follow the steps below to get started with Magistrala development, understand its architecture, and interact with the system using the **Magistrala CLI**.

## Fast Start

To spin up magistrala and start using its messaging platform and dashboard UI, run the following commands:

```bash
git clone https://github.com/absmach/magistrala.git
cd magistrala
export MG_UI_DOCKER_ACCEPT_EULA=yes
make run args=-d
```

Once the services are running, open [http://localhost:3000](http://localhost:3000) in your browser.

This is the Magistrala web-based platform, where you can manage clients, channels, messages, and view system activity in real time.

> This runs Magistrala with the UI using prebuilt Docker images.

You can now continue below to:

- [Provision the system](#step-6---provision-the-system)
- [Send messages](#send-messages)
- [Use the CLI](#step-5---install-the-cli)

If you're interested in building from source, see [Developer Setup](#developer-setup) section below.

## Developer Setup

### Step 1 - Install Magistrala

#### Clone the Repository

Magistrala source can be found in the official [Magistrala GitHub repository][magistrala-repo]. You should fork this repository in order to make changes to the project. The forked version of the repository should be cloned using the following:

```bash
git clone <forked repository> $SOMEPATH/magistrala
cd $SOMEPATH/magistrala
```

**Note:** If your `$SOMEPATH` is equal to `$GOPATH/src/github.com/absmach/magistrala`, make sure that your `$GOROOT` and `$GOPATH` do not overlap (otherwise, go modules won't work).

### Step 2 - Prerequisites

Before building Magistrala, install the following tools:

- [Docker][docker] (version 20.10.16 or later)
- [Docker compose][docker-compose] (version 1.29.2 or later)
- [Go][go-install] (version 1.19.4 or higher)
- [Go Protobuf][golang-protobuf] whose installation instructions are [here][protobuf-install]
- [C++ protobuf][protobuf] since Go Protobuf uses C bindings
- **GNU Make** (for build automation)

**Environment Setup**:  
Ensure that `$GOPATH/bin` is added to your system’s `$PATH`.

### Step 3 - Build Magistrala

#### Build All Services

Use the _GNU Make_ tool to build all Magistrala services:

```bash
make
```

The response will be:

```bash
CGO_ENABLED=0 GOOS= GOARCH=amd64 GOARM= go build -tags nats --tags nats -ldflags "-s -w -X 'github.com/absmach/magistrala.BuildTime=2025-02-11_14:51:59' -X 'github.com/absmach/magistrala.Version=unknown' -X 'github.com/absmach/magistrala.Commit=ddc43c482f6c98f3a4d49aa1d609bfae9e0e7d34'" -o build/bootstrap cmd/bootstrap/main.go
CGO_ENABLED=0 GOOS= GOARCH=amd64 GOARM= go build -tags nats --tags nats -ldflags "-s -w -X 'github.com/absmach/magistrala.BuildTime=2025-02-11_14:52:10' -X 'github.com/absmach/magistrala.Version=unknown' -X 'github.com/absmach/magistrala.Commit=ddc43c482f6c98f3a4d49aa1d609bfae9e0e7d34'" -o build/provision cmd/provision/main.go
CGO_ENABLED=0 GOOS= GOARCH=amd64 GOARM= go build -tags nats --tags nats -ldflags "-s -w -X 'github.com/absmach/magistrala.BuildTime=2025-02-11_14:52:11' -X 'github.com/absmach/magistrala.Version=unknown' -X 'github.com/absmach/magistrala.Commit=ddc43c482f6c98f3a4d49aa1d609bfae9e0e7d34'" -o build/re cmd/re/main.go
CGO_ENABLED=0 GOOS= GOARCH=amd64 GOARM= go build -tags nats --tags nats -ldflags "-s -w -X 'github.com/absmach/magistrala.BuildTime=2025-02-11_14:52:14' -X 'github.com/absmach/magistrala.Version=unknown' -X 'github.com/absmach/magistrala.Commit=ddc43c482f6c98f3a4d49aa1d609bfae9e0e7d34'" -o build/postgres-writer cmd/postgres-writer/main.go
CGO_ENABLED=0 GOOS= GOARCH=amd64 GOARM= go build -tags nats --tags nats -ldflags "-s -w -X 'github.com/absmach/magistrala.BuildTime=2025-02-11_14:52:15' -X 'github.com/absmach/magistrala.Version=unknown' -X 'github.com/absmach/magistrala.Commit=ddc43c482f6c98f3a4d49aa1d609bfae9e0e7d34'" -o build/postgres-reader cmd/postgres-reader/main.go
CGO_ENABLED=0 GOOS= GOARCH=amd64 GOARM= go build -tags nats --tags nats -ldflags "-s -w -X 'github.com/absmach/magistrala.BuildTime=2025-02-11_14:52:16' -X 'github.com/absmach/magistrala.Version=unknown' -X 'github.com/absmach/magistrala.Commit=ddc43c482f6c98f3a4d49aa1d609bfae9e0e7d34'" -o build/timescale-writer cmd/timescale-writer/main.go
CGO_ENABLED=0 GOOS= GOARCH=amd64 GOARM= go build -tags nats --tags nats -ldflags "-s -w -X 'github.com/absmach/magistrala.BuildTime=2025-02-11_14:52:17' -X 'github.com/absmach/magistrala.Version=unknown' -X 'github.com/absmach/magistrala.Commit=ddc43c482f6c98f3a4d49aa1d609bfae9e0e7d34'" -o build/timescale-reader cmd/timescale-reader/main.go
CGO_ENABLED=0 GOOS= GOARCH=amd64 GOARM= go build -tags nats --tags nats -ldflags "-s -w -X 'github.com/absmach/magistrala.BuildTime=2025-02-11_14:52:18' -X 'github.com/absmach/magistrala.Version=unknown' -X 'github.com/absmach/magistrala.Commit=ddc43c482f6c98f3a4d49aa1d609bfae9e0e7d34'" -o build/cli cmd/cli/main.go
```

Build artifacts will be put in the `build` directory.

> N.B. All Magistrala services are built as a statically linked binaries. This way they can be portable (transferred to any platform just by placing them there and running them) as they contain all needed libraries and do not relay on shared system libraries. This helps creating [FROM scratch][scratch-docker] dockers.

#### Build Individual Microservice

Individual microservices can be built with:

```bash
make <microservice_name>
```

For example:

```bash
make bootstrap
```

will build the Bootstrap microservice.

The response will be:

```bash
CGO_ENABLED=0 GOOS= GOARCH=amd64 GOARM= go build -tags nats --tags nats -ldflags "-s -w -X 'github.com/absmach/magistrala.BuildTime=2025-02-11_14:54:15' -X 'github.com/absmach/magistrala.Version=unknown' -X 'github.com/absmach/magistrala.Commit=ddc43c482f6c98f3a4d49aa1d609bfae9e0e7d34'" -o build/bootstrap cmd/bootstrap/main.go
```

#### Build Dockers

Dockers can be built with:

```bash
make dockers
```

or individually with:

```bash
make docker_<microservice_name>
```

For example:

```bash
make docker_bootstrap
```

> N.B. Magistrala creates `FROM scratch` docker containers which are compact and small in size.
>
> N.B. The `clients-db` and `users-db` containers are built from a vanilla PostgreSQL docker image downloaded from docker hub which does not persist the data when these containers are rebuilt. Thus, **rebuilding of all docker containers with `make dockers` or rebuilding the `clients-db` and `users-db` containers separately with `make docker_clients-db` and `make docker_users-db` respectively, will cause data loss. All your users, clients, channels and connections between them will be lost!** As we use this setup only for development, we don't guarantee any permanent data persistence. Though, in order to enable data retention, we have configured persistent volumes for each container that stores some data. If you want to update your Magistrala dockerized installation and want to keep your data, use `make cleandocker` to clean the containers and images and keep the data (stored in docker persistent volumes) and then `make run` to update the images and the containers. Check the [Cleaning up your dockerized Magistrala setup][cleanup-docker] section for details. Please note that this kind of updating might not work if there are database changes.

#### Building Docker images for development

In order to speed up build process, you can use commands such as:

```bash
make dockers_dev
```

or individually with

```bash
make docker_dev_<microservice_name>
```

Commands `make dockers` and `make dockers_dev` are similar. The main difference is that building images in the development mode is done on the local machine, rather than an intermediate image, which makes building images much faster. Before running this command, corresponding binary needs to be built in order to make changes visible. This can be done using `make` or `make <service_name>` command. Commands `make dockers_dev` and `make docker_dev_<service_name>` should be used only for development to speed up the process of image building. **For deployment images, commands from section above should be used.**

### Step 4 – Run Magistrala

To run Magistrala with its UI components, you must accept the [Absmach End User License Agreement (EULA)](https://github.com/absmach/eula).

This EULA applies **only to the Magistrala UI services**.

**The Magistrala core remains free and open-source, licensed under the Apache 2.0 License.**

> This step is optional and only required if you want to use the UI services.

To accept the UI EULA, set the following environment variable:

```bash
export MG_UI_DOCKER_ACCEPT_EULA=yes
```

Once everything is installed and built, execute the following command from the project root:

```bash
make run
```

Or, to prevent Docker logs from flooding the terminal:

```bash
make run args=-d
```

### Quick summary

Assuming all required tools are installed and the necessary ports are available, you can run Magistrala with just four commands:

```bash
git clone https://github.com/absmach/magistrala.git
cd magistrala
export MG_UI_DOCKER_ACCEPT_EULA=yes
make run args=-d
```

Go to [http://localhost:3000](http://localhost:3000) to start using UI.

### Suggested workflow

When the project is first cloned to your system, you will need to make sure and build all of the Magistrala services.

```bash
make
make dockers_dev
```

As you develop and test changes, only the services related to your changes will need to be rebuilt. This will reduce compile time and create a much more enjoyable development experience.

```bash
make <microservice_name>
make docker_dev_<microservice_name>
make run
```

### Overriding the default docker-compose configuration

Sometimes, depending on the use case and the user's needs it might be useful to override or add some extra parameters to the docker-compose configuration. These configuration changes can be done by specifying multiple compose files with the [docker-compose command line option -f][docker-compose-ref] as described [here][docker-compose-extend].
The following format of the `docker-compose` command can be used to extend or override the configuration:

```bash
docker-compose -f docker/docker-compose.yml -f docker/docker-compose.custom1.yml -f docker/docker-compose.custom2.yml up [-d]
```

In the command above each successive file overrides the previous parameters.

A practical example in our case would be to enable debugging and tracing in NATS so that we can see better how are the messages moving around.

`docker-compose.nats-debugging.yml`

```yaml
version: "3"

services:
  nats:
    command: --debug -DV
```

When we have the override files in place, to compose the whole infrastructure including the persistent volumes we can execute:

```bash
docker-compose -f docker/docker-compose.yml -f docker/docker-compose.nats-debugging.yml up -d
```

>**Note:** Please store your customizations to some folder outside the Magistrala's source folder and maybe add them to some other git repository. You can always apply your customizations by pointing to the right file using `docker-compose -f ...`.

### Cleaning up your dockerized Magistrala setup

If you want to clean your whole dockerized Magistrala installation you can use the `make pv=true cleandocker` command. Please note that **by default the `make cleandocker` command will stop and delete all of the containers and images, but NOT DELETE persistent volumes**. If you want to delete the gathered data in the system (the persistent volumes) please use the following command `make pv=true cleandocker` (pv = persistent volumes). This form of the command will stop and delete the containers, the images and will also delete the persistent volumes.

### Step 5 - Install the CLI

The **Magistrala CLI** is the primary interface for interacting with the system.

Open a new terminal from which you can interact with the running Magistrala system. The easiest way to do this is by using the Magistrala CLI, which can be downloaded as a tarball from GitHub (here we use release `0.14.0` but be sure to use the [latest CLI release][mg-releases]):

```bash
wget -O- https://github.com/absmach/magistrala/releases/download/0.14.0/magistrala-cli_0.14.0_linux-amd64.tar.gz | tar xvz -C $GOBIN
```

> Make sure that `$GOBIN` is added to your `$PATH` so that `magistrala-cli` command can be accessible system-wide

#### Build magistrala-cli

Build `magistrala-cli` if the pre-built CLI is not compatible with your OS, i.e MacOS. Please see the [CLI][cli] for further details.

### Step 6 - Provision the System

Once installed, you can use the CLI to quick-provision the system for testing:

```bash
magistrala-cli provision test
```

This command actually creates a temporary testing user, logs it in, then creates two clients and two channels on behalf of this user.
This quickly provisions a Magistrala system with one simple testing scenario.

You can read more about system provisioning in the dedicated [Provisioning][provisioning] chapter

Output of the command follows this pattern:

```json
{
  "created_at": "2023-04-04T08:02:47.686337Z",
  "credentials": {
    "identity": "crazy_feistel@email.com",
    "secret": "12345678"
  },
  "id": "0216df07-8f08-40ef-ba91-ff0e700f387a",
  "name": "crazy_feistel",
  "status": "enabled",
  "updated_at": "2023-04-04T08:02:47.686337Z"
}


{
  "access_token": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODA1OTYyNjcsImlhdCI6MTY4MDU5NTM2NywiaWRlbnRpdHkiOiJjcmF6eV9mZWlzdGVsQGVtYWlsLmNvbSIsImlzcyI6ImNsaWVudHMuYXV0aCIsInN1YiI6IjAyMTZkZjA3LThmMDgtNDBlZi1iYTkxLWZmMGU3MDBmMzg3YSIsInR5cGUiOiJhY2Nlc3MifQ.EpaFDcRjYAHwqhejLfay5ju8L1a7VdhXKohUlwTv7YTeOK-ClfNNx6KznV05Swdj6lgvbmVAfe0wz2JMpfMjdw",
  "access_type": "Bearer",
  "refresh_token": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODA2ODE3NjcsImlhdCI6MTY4MDU5NTM2NywiaWRlbnRpdHkiOiJjcmF6eV9mZWlzdGVsQGVtYWlsLmNvbSIsImlzcyI6ImNsaWVudHMuYXV0aCIsInN1YiI6IjAyMTZkZjA3LThmMDgtNDBlZi1iYTkxLWZmMGU3MDBmMzg3YSIsInR5cGUiOiJyZWZyZXNoIn0.3xcrkIBbi2a8firNHtnK6I8sBBOgrQ6XBa3x7cybKc6omOuqrkkNjXGjKU9tgShvjpfCWT48AR1VqO_VxJxL8g"
}


[
  {
    "created_at": "2023-04-04T08:02:47.81865461Z",
    "credentials": {
      "secret": "fc9473d8-6756-4fcc-968f-ea43cd0b803b"
    },
    "id": "5d5e593b-7629-4cc3-bebc-b20d8ab9dbef",
    "name": "d0",
    "owner": "0216df07-8f08-40ef-ba91-ff0e700f387a",
    "status": "enabled",
    "updated_at": "2023-04-04T08:02:47.81865461Z"
  },
  {
    "created_at": "2023-04-04T08:02:47.818661382Z",
    "credentials": {
      "secret": "56a4b1bd-9750-42b3-a3cb-cf5ee2b86fe4"
    },
    "id": "45048a8e-c602-4e91-9556-a9d3af6617fb",
    "name": "d1",
    "owner": "0216df07-8f08-40ef-ba91-ff0e700f387a",
    "status": "enabled",
    "updated_at": "2023-04-04T08:02:47.818661382Z"
  }
]


[
  {
    "created_at": "2023-04-04T08:02:47.857619Z",
    "id": "a31e16f8-343c-4366-8b4f-c95e190937f4",
    "name": "c0",
    "owner_id": "0216df07-8f08-40ef-ba91-ff0e700f387a",
    "status": "enabled",
    "updated_at": "2023-04-04T08:02:47.857619Z"
  },
  {
    "created_at": "2023-04-04T08:02:47.867336Z",
    "id": "e20ad0bb-c490-47dd-9366-fb8ffd56c5dc",
    "name": "c1",
    "owner_id": "0216df07-8f08-40ef-ba91-ff0e700f387a",
    "status": "enabled",
    "updated_at": "2023-04-04T08:02:47.867336Z"
  }
]

```

In the Magistrala system terminal (where docker compose is running) you should see following logs:

```bash
...
magistrala-users  | {"level":"info","message":"Method register_client with id 0216df07-8f08-40ef-ba91-ff0e700f387a using token  took 87.335902ms to complete without errors.","ts":"2023-04-04T08:02:47.722776862Z"}
magistrala-users  | {"level":"info","message":"Method issue_token of type Bearer for client crazy_feistel@email.com took 55.342161ms to complete without errors.","ts":"2023-04-04T08:02:47.783884818Z"}
magistrala-users  | {"level":"info","message":"Method identify for token eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODA1OTYyNjcsImlhdCI6MTY4MDU5NTM2NywiaWRlbnRpdHkiOiJjcmF6eV9mZWlzdGVsQGVtYWlsLmNvbSIsImlzcyI6ImNsaWVudHMuYXV0aCIsInN1YiI6IjAyMTZkZjA3LThmMDgtNDBlZi1iYTkxLWZmMGU3MDBmMzg3YSIsInR5cGUiOiJhY2Nlc3MifQ.EpaFDcRjYAHwqhejLfay5ju8L1a7VdhXKohUlwTv7YTeOK-ClfNNx6KznV05Swdj6lgvbmVAfe0wz2JMpfMjdw with id 0216df07-8f08-40ef-ba91-ff0e700f387a took 1.389463ms to complete without errors.","ts":"2023-04-04T08:02:47.817018631Z"}
magistrala-clients | {"level":"info","message":"Method create_clients 2 clients using token eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODA1OTYyNjcsImlhdCI6MTY4MDU5NTM2NywiaWRlbnRpdHkiOiJjcmF6eV9mZWlzdGVsQGVtYWlsLmNvbSIsImlzcyI6ImNsaWVudHMuYXV0aCIsInN1YiI6IjAyMTZkZjA3LThmMDgtNDBlZi1iYTkxLWZmMGU3MDBmMzg3YSIsInR5cGUiOiJhY2Nlc3MifQ.EpaFDcRjYAHwqhejLfay5ju8L1a7VdhXKohUlwTv7YTeOK-ClfNNx6KznV05Swdj6lgvbmVAfe0wz2JMpfMjdw took 48.137759ms to complete without errors.","ts":"2023-04-04T08:02:47.853310066Z"}
magistrala-users  | {"level":"info","message":"Method identify for token eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODA1OTYyNjcsImlhdCI6MTY4MDU5NTM2NywiaWRlbnRpdHkiOiJjcmF6eV9mZWlzdGVsQGVtYWlsLmNvbSIsImlzcyI6ImNsaWVudHMuYXV0aCIsInN1YiI6IjAyMTZkZjA3LThmMDgtNDBlZi1iYTkxLWZmMGU3MDBmMzg3YSIsInR5cGUiOiJhY2Nlc3MifQ.EpaFDcRjYAHwqhejLfay5ju8L1a7VdhXKohUlwTv7YTeOK-ClfNNx6KznV05Swdj6lgvbmVAfe0wz2JMpfMjdw with id 0216df07-8f08-40ef-ba91-ff0e700f387a took 302.571µs to complete without errors.","ts":"2023-04-04T08:02:47.856820523Z"}
magistrala-clients | {"level":"info","message":"Method create_channel for 2 channels using token eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODA1OTYyNjcsImlhdCI6MTY4MDU5NTM2NywiaWRlbnRpdHkiOiJjcmF6eV9mZWlzdGVsQGVtYWlsLmNvbSIsImlzcyI6ImNsaWVudHMuYXV0aCIsInN1YiI6IjAyMTZkZjA3LThmMDgtNDBlZi1iYTkxLWZmMGU3MDBmMzg3YSIsInR5cGUiOiJhY2Nlc3MifQ.EpaFDcRjYAHwqhejLfay5ju8L1a7VdhXKohUlwTv7YTeOK-ClfNNx6KznV05Swdj6lgvbmVAfe0wz2JMpfMjdw took 15.340692ms to complete without errors.","ts":"2023-04-04T08:02:47.872089509Z"}
magistrala-users  | {"level":"info","message":"Method identify for token eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODA1OTYyNjcsImlhdCI6MTY4MDU5NTM2NywiaWRlbnRpdHkiOiJjcmF6eV9mZWlzdGVsQGVtYWlsLmNvbSIsImlzcyI6ImNsaWVudHMuYXV0aCIsInN1YiI6IjAyMTZkZjA3LThmMDgtNDBlZi1iYTkxLWZmMGU3MDBmMzg3YSIsInR5cGUiOiJhY2Nlc3MifQ.EpaFDcRjYAHwqhejLfay5ju8L1a7VdhXKohUlwTv7YTeOK-ClfNNx6KznV05Swdj6lgvbmVAfe0wz2JMpfMjdw with id 0216df07-8f08-40ef-ba91-ff0e700f387a took 271.162µs to complete without errors.","ts":"2023-04-04T08:02:47.875812318Z"}
magistrala-clients | {"level":"info","message":"Method add_policy for client with id 5d5e593b-7629-4cc3-bebc-b20d8ab9dbef using token eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODA1OTYyNjcsImlhdCI6MTY4MDU5NTM2NywiaWRlbnRpdHkiOiJjcmF6eV9mZWlzdGVsQGVtYWlsLmNvbSIsImlzcyI6ImNsaWVudHMuYXV0aCIsInN1YiI6IjAyMTZkZjA3LThmMDgtNDBlZi1iYTkxLWZmMGU3MDBmMzg3YSIsInR5cGUiOiJhY2Nlc3MifQ.EpaFDcRjYAHwqhejLfay5ju8L1a7VdhXKohUlwTv7YTeOK-ClfNNx6KznV05Swdj6lgvbmVAfe0wz2JMpfMjdw took 28.632906ms to complete without errors.","ts":"2023-04-04T08:02:47.904041832Z"}
magistrala-users  | {"level":"info","message":"Method identify for token eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODA1OTYyNjcsImlhdCI6MTY4MDU5NTM2NywiaWRlbnRpdHkiOiJjcmF6eV9mZWlzdGVsQGVtYWlsLmNvbSIsImlzcyI6ImNsaWVudHMuYXV0aCIsInN1YiI6IjAyMTZkZjA3LThmMDgtNDBlZi1iYTkxLWZmMGU3MDBmMzg3YSIsInR5cGUiOiJhY2Nlc3MifQ.EpaFDcRjYAHwqhejLfay5ju8L1a7VdhXKohUlwTv7YTeOK-ClfNNx6KznV05Swdj6lgvbmVAfe0wz2JMpfMjdw with id 0216df07-8f08-40ef-ba91-ff0e700f387a took 269.959µs to complete without errors.","ts":"2023-04-04T08:02:47.906989497Z"}
magistrala-clients | {"level":"info","message":"Method add_policy for client with id 5d5e593b-7629-4cc3-bebc-b20d8ab9dbef using token eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODA1OTYyNjcsImlhdCI6MTY4MDU5NTM2NywiaWRlbnRpdHkiOiJjcmF6eV9mZWlzdGVsQGVtYWlsLmNvbSIsImlzcyI6ImNsaWVudHMuYXV0aCIsInN1YiI6IjAyMTZkZjA3LThmMDgtNDBlZi1iYTkxLWZmMGU3MDBmMzg3YSIsInR5cGUiOiJhY2Nlc3MifQ.EpaFDcRjYAHwqhejLfay5ju8L1a7VdhXKohUlwTv7YTeOK-ClfNNx6KznV05Swdj6lgvbmVAfe0wz2JMpfMjdw took 6.303771ms to complete without errors.","ts":"2023-04-04T08:02:47.910594262Z"}
magistrala-users  | {"level":"info","message":"Method identify for token eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODA1OTYyNjcsImlhdCI6MTY4MDU5NTM2NywiaWRlbnRpdHkiOiJjcmF6eV9mZWlzdGVsQGVtYWlsLmNvbSIsImlzcyI6ImNsaWVudHMuYXV0aCIsInN1YiI6IjAyMTZkZjA3LThmMDgtNDBlZi1iYTkxLWZmMGU3MDBmMzg3YSIsInR5cGUiOiJhY2Nlc3MifQ.EpaFDcRjYAHwqhejLfay5ju8L1a7VdhXKohUlwTv7YTeOK-ClfNNx6KznV05Swdj6lgvbmVAfe0wz2JMpfMjdw with id 0216df07-8f08-40ef-ba91-ff0e700f387a took 364.448µs to complete without errors.","ts":"2023-04-04T08:02:47.912905436Z"}
magistrala-clients | {"level":"info","message":"Method add_policy for client with id 45048a8e-c602-4e91-9556-a9d3af6617fb using token eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODA1OTYyNjcsImlhdCI6MTY4MDU5NTM2NywiaWRlbnRpdHkiOiJjcmF6eV9mZWlzdGVsQGVtYWlsLmNvbSIsImlzcyI6ImNsaWVudHMuYXV0aCIsInN1YiI6IjAyMTZkZjA3LThmMDgtNDBlZi1iYTkxLWZmMGU3MDBmMzg3YSIsInR5cGUiOiJhY2Nlc3MifQ.EpaFDcRjYAHwqhejLfay5ju8L1a7VdhXKohUlwTv7YTeOK-ClfNNx6KznV05Swdj6lgvbmVAfe0wz2JMpfMjdw took 7.73352ms to complete without errors.","ts":"2023-04-04T08:02:47.920205467Z"}
...

```

This proves that these provisioning commands were sent from the CLI to the Magistrala system.

### Step 7 - Interact with Magistrala

With Magistrala running, you can now send messages.

#### Send Messages

Once system is provisioned, a `client` can start sending messages on a `channel`:

```bash
magistrala-cli messages send <channel_id> <JSON_string> <client_secret>
```

For example:

```bash
magistrala-cli messages send a31e16f8-343c-4366-8b4f-c95e190937f4 '[{"bn":"some-base-name:","bt":1.276020076001e+09, "bu":"A","bver":5, "n":"voltage","u":"V","v":120.1}, {"n":"current","t":-5,"v":1.2}, {"n":"current","t":-4,"v":1.3}]' fc9473d8-6756-4fcc-968f-ea43cd0b803b
```

In the Magistrala system terminal you should see following logs:

```bash
...
magistrala-clients | {"level":"info","message":"Method authorize_by_key for channel with id a31e16f8-343c-4366-8b4f-c95e190937f4 by client with secret fc9473d8-6756-4fcc-968f-ea43cd0b803b took 7.048706ms to complete without errors.","ts":"2023-04-04T08:06:09.750992633Z"}
magistrala-broker | [1] 2023/04/04 08:06:09.753072 [TRC] 192.168.144.11:60616 - cid:10 - "v1.18.0:go" - <<- [PUB channels.a31e16f8-343c-4366-8b4f-c95e190937f4 261]
magistrala-broker | [1] 2023/04/04 08:06:09.754037 [TRC] 192.168.144.11:60616 - cid:10 - "v1.18.0:go" - <<- MSG_PAYLOAD: ["\n$a31e16f8-343c-4366-8b4f-c95e190937f4\x1a$5d5e593b-7629-4cc3-bebc-b20d8ab9dbef\"\x04http*\xa6\x01[{\"bn\":\"some-base-name:\",\"bt\":1.276020076001e+09, \"bu\":\"A\",\"bver\":5, \"n\":\"voltage\",\"u\":\"V\",\"v\":120.1}, {\"n\":\"current\",\"t\":-5,\"v\":1.2}, {\"n\":\"current\",\"t\":-4,\"v\":1.3}]0\xd9\xe6\x8b\xc9Ø\xab\xa9\x17"]
magistrala-broker | [1] 2023/04/04 08:06:09.755550 [TRC] 192.168.144.13:58572 - cid:8 - "v1.18.0:go" - ->> [MSG channels.a31e16f8-343c-4366-8b4f-c95e190937f4 1 261]
magistrala-http   | {"level":"info","message":"Method publish to channel a31e16f8-343c-4366-8b4f-c95e190937f4 took 15.979094ms to complete without errors.","ts":"2023-04-04T08:06:09.75232571Z"}
...
```

This proves that messages have been correctly sent through the system via the protocol adapter (`magistrala-http`).

## Managing Microservices

Running of the Magistrala microservices can be tricky, as there is a lot of them and each demand configuration in the form of environment variables.

The whole system (set of microservices) can be run with one command:

```bash
make rundev
```

which will properly configure and run all microservices.

Please assure that MQTT microservice has `node_modules` installed.

> N.B. `make rundev` actually calls helper script `scripts/run.sh`, so you can inspect this script for the details.

## Testing

To run all of the tests you can execute:

```bash
make test
```

Dockertest is used for the tests, so to run them, you will need the Docker daemon/service running.

## Installing

Installing Go binaries is simple: just move them from `build` to `$GOBIN` (do not fortget to add `$GOBIN` to your `$PATH`).

You can execute:

```bash
make install
```

which will do this copying of the binaries.

> N.B. Only Go binaries will be installed this way. The MQTT broker is a written in Erlang and its build scripts can be found in `docker/vernemq` dir.

## Cross-compiling for ARM

Magistrala can be compiled for ARM platform and run on Raspberry Pi or other similar IoT gateways, by following the instructions [here][go-cross-compile] or [here][go-arm] as well as information found [here][wiki-go-arm]. The environment variables `GOARCH=arm` and `GOARM=7` must be set for the compilation.

Cross-compilation for ARM with Magistrala make:

```bash
GOOS=linux GOARCH=arm GOARM=7 make
```

## Message Broker

Magistrala uses NATS as it's default central message bus. For development purposes (when not run via Docker), it expects that NATS is installed on the local system.

To do this execute:

```bash
go install github.com/nats-io/nats-server/v2@latest
```

This will install `nats-server` binary that can be simply run by executing:

```bash
nats-server
```

### Switching Brokers

To use an alternative broker (e.g., RabbitMQ or VerneMQ) you need to set the env variable:

- `MG_BROKER_TYPE=<broker_name>`

**Supported Brokers:**  

- `nats` (default)  
- `rabbitmq`  
- `vernemq`

```bash
MG_BROKER_TYPE=<broker-type> make
MG_BROKER_TYPE=<broker-type> make run
```

### MQTT Broker

To build Magistrala MQTT message broker Docker image, use the following commands:

```bash
cd docker/vernemq
docker build --no-cache . -t magistrala/vernemq
```

The Magistrala uses the [VerneMQ][vernemq] for implementation of the MQTT messaging. Therefore, for some questions or problems you can also check out the VerneMQ documentation or reach out its contributors.

## Database Configuration

### PostgreSQL

Magistrala uses PostgreSQL to store metadata (`users`, `clients` and `channels` entities alongside with authorization tokens). It expects that PostgreSQL DB is installed, set up and running on the local system.

Information how to set-up (prepare) PostgreSQL database can be found [here][postgres-roles], and it is done by executing following commands:

```bash
# Create `users` and `clients` databases
sudo -u postgres createdb users
sudo -u postgres createdb clients

# Set-up Postgres roles
sudo su - postgres
psql -U postgres
postgres=# CREATE ROLE magistrala WITH LOGIN ENCRYPTED PASSWORD 'magistrala';
postgres=# ALTER USER magistrala WITH LOGIN ENCRYPTED PASSWORD 'magistrala';
```

## Deployment

### Deployment Prerequisites

Magistrala depends on several infrastructural services, notably the default message broker, [NATS][nats] and [PostgreSQL][postgresql] database.

## Troubleshooting

### Common Issues

1. **Docker Containers Not Starting**  
   - Ensure Docker and Docker Compose are installed and running.

2. **CLI Commands Not Recognized**  
   - Confirm that `$GOBIN` is in your system's `$PATH`.

3. **Database Connection Issues**  
   - Verify PostgreSQL is running and the `magistrala` role exists.

## Conclusion

With Magistrala installed and running, you can now explore its messaging capabilities, test interactions, and extend the system as needed

[docker]: https://docs.docker.com/install/
[docker-compose]: https://docs.docker.com/compose/install/
[mg-releases]: https://github.com/absmach/magistrala/releases
[cli]: ./cli/introduction-to-cli.md
[provisioning]: ./cli/provision-cli.md
[magistrala-repo]: https://github.com/absmach/magistrala
[golang-protobuf]: https://github.com/golang/protobuf
[protobuf-install]: https://github.com/golang/protobuf#installation
[protobuf]: https://github.com/google/protobuf
[go-install]: https://golang.org/doc/install
[scratch-docker]: https://hub.docker.com/_/scratch/
[cleanup-docker]: #cleaning-up-your-dockerized-magistrala-setup
[docker-compose-ref]: https://docs.docker.com/compose/reference/overview/
[docker-compose-extend]: https://docs.docker.com/compose/extends/
[go-cross-compile]: https://dave.cheney.net/2015/08/22/cross-compilation-with-go-1-5
[go-arm]: https://www.alexruf.net/golang/arm/raspberrypi/2016/01/16/cross-compile-with-go-1-5-for-raspberry-pi.html
[wiki-go-arm]: https://go.dev/wiki/GoArm
[vernemq]: https://vernemq.com/downloads/
[postgres-roles]: https://support.rackspace.com/how-to/postgresql-creating-and-dropping-roles/
[nats]: https://www.nats.io/
[postgresql]: https://www.postgresql.org/
