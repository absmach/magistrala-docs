---
title: Kubernetes
---

Magistrala can be easily deployed on the Kubernetes platform using Helm Charts from the official [Magistrala DevOps GitHub repository](https://github.com/absmach/magistrala-devops).

## Prerequisites

### 1. Install Docker

K3d requires Docker to run Kubernetes clusters inside Docker containers. Follow the official [Docker installation guide](https://docs.docker.com/get-docker/) to install Docker.

Once installed, verify the installation:

```bash
docker --version
```

### 2. Install Kubernetes via K3d

K3d is a lightweight Kubernetes distribution that runs inside Docker, ideal for local development.

```bash
curl -s https://raw.githubusercontent.com/k3d-io/k3d/main/install.sh | bash
```

For more information on K3d, refer to the official [K3d documentation](https://k3d.io/).

### 3. Install kubectl

`kubectl` is the command-line tool used to interact with your Kubernetes cluster.

```bash
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
```

Verify the installation:

```bash
kubectl version --client
```

### 4. Install Helm v3

Helm is a package manager for Kubernetes, simplifying application installation and management.

```bash
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
```

Verify the installation:

```bash
helm version
```

### 5. Add Helm Repositories

The **Helm stable repository** contains Helm charts that you can use to install applications on Kubernetes.

```bash
helm repo add stable https://charts.helm.sh/stable
helm repo update
```

Bitnami offers a collection of popular Helm charts for various applications.

```bash
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update
```

### 6. Install Nginx Ingress Controller

The Nginx Ingress Controller manages external access to services within your Kubernetes cluster.

```bash
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update

kubectl create namespace ingress-nginx

helm install ingress-nginx ingress-nginx/ingress-nginx --version 3.26.0 --create-namespace -n ingress-nginx
```

Verify the installation:

```bash
kubectl get pods -n ingress-nginx
```

---

## Deploying Magistrala

There are two primary ways to deploy Magistrala, depending on your needs:

### 1. Manual Local Deployment

This method involves **cloning the chart source code** and installing Magistrala from disk.

This approach is useful if you want to:

- Directly interact with the chart source files.
- Modify the chart before installation.
- Perform development or testing on the chart.

#### 1. Clone Magistrala Helm Chart Repository

```bash
git clone https://github.com/absmach/magistrala-devops.git
cd magistrala-devops/charts/magistrala # Ensure you're in the directory containing Chart.yaml
```

#### 2. Add Required Helm Repositories

```bash
helm repo add nats https://nats-io.github.io/k8s/helm/charts/
helm repo add jaegertracing https://jaegertracing.github.io/helm-charts
helm repo add hashicorp https://helm.releases.hashicorp.com
helm repo update
```

This ensures that all necessary repositories are available for dependencies.

#### 3. Authenticate with Private Registry

Magistrala includes **SuperMQ** as a chart dependency, and SuperMQ is hosted in a private OCI registry. This means you must **authenticate with the OCI registry before running `helm dependency update`**, or the SuperMQ chart will not be pulled correctly.

To do so, run:

```bash
# Replace 'magistrala.example.com' with your actual Private OCI Registry registry IP or domain
helm registry login magistrala.example.com
```

#### 4. Update Dependencies

Once the repositories have been added, update the on-disk dependencies to match the `Chart.yaml` file by running:

```bash
helm dependency update
```

If the repositories are set up correctly, this will resolve and download all chart dependencies to `charts/magistrala/charts`.

> **Note**: Make sure you're running this command from within the `charts/magistrala/` directory — the one containing the `Chart.yaml` file.

You can confirm the dependencies were fetched correctly by listing the contents of the `charts/` directory:

```bash
ls charts/
```

#### 5. Create Namespace

First, create a namespace for Magistrala (if it doesn’t already exist):

```bash
kubectl create namespace mg
```

---

#### 6. Provide RE Email Configuration

##### **Option 1: Using a Kubernetes Secret (Recommended)**

1. Create a `.env` file with the required email credentials:

   ```env
   MG_EMAIL_HOST=smtp.example.com
   MG_EMAIL_PORT=587
   MG_EMAIL_USERNAME=user@example.com
   MG_EMAIL_PASSWORD=yourpassword
   MG_EMAIL_FROM_ADDRESS=noreply@example.com
   MG_EMAIL_FROM_NAME=Example Team
   ```

2. Reference the secret in `values.yaml`:

   ```yaml
   re:
     secrets:
       names:
         - "re-email-secret"
   ```

3. Create the Kubernetes Secret:

   ```bash
   kubectl create secret generic re-email-secret --from-env-file=.env
   ```

---

##### **Option 2: Inline Configuration (For Dev/Testing Only)**

Define email credentials inline under `re.email`:

```yaml
re:
  email:
    host: smtp.example.com
    port: 587
    username: user@example.com
    password: yourpassword
    fromAddress: noreply@example.com
    fromName: Example Team
```

> **Important**: If `re.secrets.names` is defined as an empty list (i.e., `[]`) and `re.email` is also empty, no email configuration will be applied and the deployment will fail.

---
#### 7. Deploy Magistrala

Then deploy the Magistrala Helm chart into the `mg` namespace:

```bash
helm install magistrala . -n mg
```

> **Note**: Make sure you're in the `charts/magistrala/` directory containing the `Chart.yaml` when running the install command.

If you encounter an error related to **snippet annotations** when using the NGINX Ingress Controller, you can enable them by upgrading the controller with the following flag:

```bash
helm upgrade ingress-nginx ingress-nginx/ingress-nginx -n ingress-nginx --set controller.allowSnippetAnnotations=true
```

Make sure the NGINX Ingress repository is added:

```bash
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update
```

### **Post-Deployment Verification**

Once the chart is installed, you can verify that Magistrala is running correctly:

#### View all resources in the `mg` namespace

```bash
kubectl get all -n mg
```

#### List all running pods

```bash
kubectl get pods -n mg
```

#### List all services

```bash
kubectl get services -n mg
```

#### View logs from a specific pod

```bash
kubectl logs <pod-name> -n mg
```

Replace `<pod-name>` with the actual name of the pod you want to inspect.

### Interacting with Magistrala Services After Deployment

Once Magistrala is successfully deployed, you can interact with its services in the following ways:

- **Web-based User Interface (UI)**
- **Magistrala CLI tool** (see the [CLI Documentation](https://docs.magistrala.abstractmachines.fr/cli/))
- **HTTP API Clients** (e.g., `curl`, Postman)

#### Accessing Services via Ingress

Magistrala uses the `ingress-nginx-controller` to expose services through Kubernetes Ingress resources. Depending on where you're running your cluster, the method for accessing the services differs slightly.

#### **DigitalOcean (DO) Deployment**

If you're deploying on DigitalOcean, a LoadBalancer service is automatically provisioned. To find the public IP address:

```bash
kubectl get svc -A | grep LoadBalancer
```

This command searches all namespaces for services of type `LoadBalancer`. The output looks like this:

```plaintext
ingress-nginx   ingress-nginx-controller   LoadBalancer   10.245.192.202   138.68.126.8   80:30424/TCP,443:31752/TCP   64d
```

Here, the public IP is **`138.68.126.8`** — this is the address you'll use to access Magistrala services via the web UI, CLI, or API clients.

---

#### **Local Deployment (e.g., with `kind`, `minikube`, or `k3d`)**

If you're running locally, a LoadBalancer may not be automatically available. You can use one of the following approaches:

- **Minikube:**

  ```bash
  minikube tunnel
  ```

  This exposes LoadBalancer services on your host network.

- **Kind or k3d:**
  Port-forward directly to the ingress controller:

  ```bash
  kubectl port-forward -n ingress-nginx svc/ingress-nginx-controller 8080:80
  ```

  Then access Magistrala at [http://localhost:8080](http://localhost:8080).

#### Using the Web-Based UI

- Once you have the Public IP address, open your web browser.
- In the address bar, enter the IP address followed by `/ui/login` as shown below:

```plaintext
  http://138.68.126.8/ui/login
```

#### Using Postman

If you prefer working with APIs, you can also interact with Magistrala services using Postman by sending requests to the Public IP address of your load balancer. For example, to create a user:

##### 1. Set Up the Postman Request

- **Method:** `POST`
- **URL:** `http://138.68.126.8/users`

This URL points to the endpoint that handles user creation on your Magistrala deployment. Replace `138.68.126.8` with the actual IP address or domain of your deployment if it differs.

##### 2. Set Up the Request Body

Switch to the `Body` tab in Postman and select `raw` as the format. Choose `JSON` from the dropdown menu, and then enter the following JSON structure in the text area:

```json
{
  "name": "user1",
  "tags": ["tag1", "tag2"],
  "credentials": {
    "identity": "user1@email.com",
    "secret": "12345678"
  },
  "metadata": {
    "domain": "domain1"
  }
}
```

`Send` the request. If successful, the server will respond with the details of the newly created user.

For more examples, refer to this [Postman Collection](https://elements.getpostman.com/redirect?entityId=38532610-ef9a0562-b353-4d2c-8aca-a5fae35ad0ad&entityType=collection).

---

## Installing Magistrala from Published Chart (with SuperMQ Dependency)

The Magistrala Helm chart — along with its dependency, **SuperMQ** — is published to a secure, private OCI registry. This installation method is recommended for **production environments** and **CI/CD pipelines**, offering authentication, RBAC, and chart signature verification.

Since both charts are stored in the **same Private OCI Registry**, you must authenticate to the registry **before attempting to install or upgrade** Magistrala. Helm will otherwise fail to pull the SuperMQ dependency.

### 1. Authenticate with the Private OCI Registry

Replace the domain or IP with your actual Private OCI Registry address:

```bash
helm registry login magistrala.example.com
```

> Use your Private OCI Registry username/password or a robot account with appropriate project permissions.

### 2. Install Magistrala (Pick One Method)

> This step will automatically pull the `supermq` chart as a dependency. Ensure authentication is done first.

#### **Option A — Pull and install locally**

```bash
helm pull oci://magistrala.example.com/magistrala --version 0.16.7
helm install magistrala ./magistrala-0.16.7.tgz -n mg
```

#### **Option B — Install directly from OCI**

```bash
helm install magistrala oci://magistrala.example.com/magistrala \
  --version 0.16.7 \
  -f custom-values.yaml \
  -n mg
```

### 3. Verify the Installation

```bash
helm list -n mg
kubectl get pods -n mg
```

## Upgrading the Magistrala Chart

To upgrade your Magistrala deployment — whether you're:

- updating to a **newer chart version**,
- applying changes to your `values.yaml`, or
- overriding individual parameters via `--set` —  
  use the following command:

```bash
helm upgrade <release-name> <repo-name>/<chart-name> -f custom-values.yaml
```

> **Replace `<release-name>`** with the name of your existing Helm release (e.g., `magistrala`), and  
> **`custom-values.yaml`** with your configuration file (if applicable).

For a complete table of configurable parameters and their default values, see the [configurable parameters reference](https://github.com/absmach/magistrala-devops/blob/master/charts/magistrala/README.md).

> **Note:** You only need to update the documentation at `charts/magistrala/README.md` if you’re making changes to the chart source (e.g., adding or modifying parameters in `values.yaml` or templates).  
> In such cases, regenerate the docs using `helm-docs` as outlined in [Autogenerating Helm Chart Documentation](https://github.com/absmach/magistrala-devops/blob/master/README.md).

### Optional: Upgrade to a Specific Version

If you want to upgrade to a particular chart version:

```bash
helm upgrade <release-name> <repo-name>/<chart-name> --version 0.14.0 -f custom-values.yaml
```

> Use `helm search repo <repo-name>/<chart-name> --versions` to view all available versions.

### Verify the Upgrade

Once the upgrade command runs successfully, verify that your deployment is up-to-date:

```bash
helm list -n <namespace>
kubectl get pods -n <namespace>
```

## Uninstalling Magistrala

To uninstall the Magistrala release:

```bash
helm uninstall <release-name> -n mg
```

This will remove the Magistrala release from the previously created `mg` namespace. Use the `--dry-run` flag to see which releases will be uninstalled without actually uninstalling them.

To delete all data and resources from your cluster (or at least from the target namespace), the following two options are available:

### Option 1: Delete the Entire Namespace

Deleting the entire namespace will remove all resources contained within it in one go. Later you can recreate the namespace.

```sh
kubectl delete namespace mg

# Wait for deletion to complete (you can check the status with "kubectl get ns")
# Then recreate the namespace:
kubectl create namespace mg
```

### Option 2: Delete All Resources Within the Namespace

If you prefer to keep the namespace and simply clear out all the resources, run these commands:

```sh
# Delete all workloads and services (Deployments, Pods, Services, etc.)
kubectl delete all --all -n mg

# Delete all PersistentVolumeClaims in the namespace
kubectl delete pvc --all -n mg

# Optionally, delete other resource types if needed (e.g., ConfigMaps, Secrets, ServiceAccounts)
kubectl delete configmap --all -n mg
kubectl delete secret --all -n mg
kubectl delete serviceaccount --all -n mg
```

If your cluster is dynamically provisioning persistent volumes, the associated PVs may be automatically deleted (if their reclaim policy is set to `Delete`). If you need to manually remove all PVs (and you’re sure no other namespace depends on them), run:

```sh
kubectl delete pv --all
```

### Option 3: Force Clear a Stuck Namespace

Sometimes the namespace may be stuck in the **Terminating** phase because some resources (such as pods or PVCs) still have finalizers. If you encounter an error like:

> `secrets "sh.helm.release.v1.magistrala.v1" is forbidden: unable to create new content in namespace mg because it is being terminated`
>
> follow these steps to force-clear the namespace:

#### 1. Force-Delete All Pods

Force-delete all pods in the namespace to remove any that might be stuck:

```sh
kubectl delete pods --all --force --grace-period=0 -n mg
```

#### 2. Remove Finalizers from PersistentVolumeClaims (PVCs)

List the PVCs in the namespace:

```sh
kubectl get pvc -n mg
```

For each PVC that is preventing deletion (they often have a finalizer like `kubernetes.io/pvc-protection`), remove the finalizer using:

```sh
kubectl patch pvc <pvc-name> -p '{"metadata":{"finalizers":null}}' -n mg
```

For example, if you have PVCs named `pvc-1` and `pvc-2`:

```sh
kubectl patch pvc pvc-1 -p '{"metadata":{"finalizers":null}}' -n mg
kubectl patch pvc pvc-2 -p '{"metadata":{"finalizers":null}}' -n mg
```

To patch all the stuck PVCs in one go, run the follwing command:

```sh
NAMESPACE="mg"

# Get all Terminating PVCs
kubectl get pvc -n $NAMESPACE | grep Terminating | awk '{print $1}' | while read pvc; do
    echo "Patching and deleting PVC: $pvc"

    # Patch to remove finalizers
    kubectl patch pvc $pvc -n $NAMESPACE --type=json -p '[{"op": "remove", "path": "/metadata/finalizers"}]'

    # Force delete the PVC
    kubectl delete pvc $pvc -n $NAMESPACE --force --grace-period=0
done
```

#### 3. Delete All Remaining Resources (Optional)

To ensure no lingering resources remain:

```sh
kubectl delete all --all --force --grace-period=0 -n mg
kubectl delete configmap --all -n mg
kubectl delete secret --all -n mg
kubectl delete serviceaccount --all -n mg
```

#### 4. Remove Finalizers from the Namespace

Patch the namespace to remove its finalizers so that it can be fully deleted:

```sh
kubectl patch namespace mg -p '{"spec":{"finalizers":[]}}'
```

#### 5. Verify

Check that the namespace is deleted:

```sh
kubectl get namespace mg
```

After clearing the namespace (using any of the options above), you can recreate the namespace and install your Helm release into a fresh `mg` namespace:

---

## Customizing Magistrala Installation

To override values in the chart, use either the `--values` flag and pass in a file or use the `--set` flag and pass configuration from the command line, to force a string value use `--set-string`. You can use `--set-file` to set individual values from a file when the value itself is too long for the command line or is dynamically generated. You can also use `--set-json` to set json values (scalars/objects/arrays) from the command line.

For example, if you want to set a custom hostname for the ingress (like `example.com`) and ensure you're using the latest version of the `users` image, you can do this during installation with the following command::

```bash
helm install magistrala -n mg --set ingress.hostname='example.com' --set users.image.tag='latest'
```

If Magistrala is already installed and you want to update it with new settings (for example, changing the ingress hostname or image tag), you can use the `helm upgrade` command:

---

## Magistrala Add-ons

Magistrala provides a set of **optional services** designed to extend the capabilities of the [**SuperMQ**](https://github.com/absmach/supermq) IoT platform. These services are **not installed by default** and are treated as **add-ons**, each packaged as a sub-chart within the SuperMQ Helm chart.

To enable any add-on, pass the appropriate `--set` flags when installing or upgrading the SuperMQ chart.

> **Note:** Magistrala add-ons **cannot run standalone**. They depend on the core services provided by the `supermq` base chart (e.g., authentication, messaging, internal APIs).

Example: Enabling InfluxDB Reader and Writer

```bash
helm install supermq . -n mg \
  --set influxdb.reader.enabled=true \
  --set influxdb.writer.enabled=true
```

## Available Add-ons

### 1. **Bootstrap Service**

Provides initial configuration for newly connected devices and services.

- Generates bootstrap tokens
- Applies provisioning templates
- Integrates with the provisioning service

```bash
--set bootstrap.enabled=true
```

### 2. **InfluxDB Integration**

Stores and retrieves time-series telemetry using InfluxDB.

- **Writer**
  - Consumes data and writes to InfluxDB.

  ```bash
  --set influxdb.writer.enabled=true
  ```

- **Reader**
  - Serves historical time-series queries.

  ```bash
  --set influxdb.reader.enabled=true
  ```

### 3. **Protocol Adapters**

Adapters ingest data from external protocols and systems.

- **OPC-UA Adapter**  
  Integrates with industrial machines using the OPC-UA protocol.

  ```bash
  --set adapter.opcua.enabled=true
  ```

- **LoRa Adapter**  
  


  ```bash
  --set adapter.lora.enabled=true
  ```

> _Note: Some adapters may require external credentials or broker configuration._

### 4. **Twins Service**

Creates and manages digital twins of physical devices.

- Tracks device state
- Simulates device behavior
- Supports virtual device interactions

```bash
--set twins.enabled=true
```

### 5. **PostgreSQL / TimescaleDB Integration**

Support for structured and time-series storage using PostgreSQL or TimescaleDB.

- **Writer**

  ```bash
  --set postgres.writer.enabled=true
  ```

- **Reader**


  ```bash
  --set postgres.reader.enabled=true
  ```

### 6. **Notifier Services**

Delivers alerts or notifications based on system events or rules.

- **SMTP (Email) Notifier**

  ```bash
  --set notifiers.smtp.enabled=true
  ```

- **SMPP (SMS) Notifier**


  ```bash
  --set notifiers.smpp.enabled=true
  ```

### 7. **Rule Engine (RE)**

Evaluates conditions and executes automated actions based on incoming data.

```bash
--set ruleengine.enabled=true
```

---

## Scaling Services

By default, the MQTT adapter, Clients, Envoy, Authn, and the Message Broker services are set to scale with a replica count of 3. It’s recommended to set these values according to the number of nodes in your Kubernetes cluster. For example, you can adjust the replica count with the following command:

```bash
helm install magistrala . -n mg --set defaults.replicaCount=3 --set messageBroker.replicaCount=3
```

This ensures that your services scale appropriately for your environment.

## Additional Steps to Configure Ingress Controller

To allow your host to send MQTT messages on ports `1883` and `8883`, you need to configure the NGINX Ingress Controller with some additional steps.

### 1. Configure TCP and UDP Services

The NGINX Ingress Controller uses ConfigMaps to expose TCP and UDP services. The necessary ConfigMaps are included in the Helm chart in the [ingress.yaml][ingress-yaml] file assuming that location of ConfigMaps should be `ingress-nginx/tcp-services` and `ingress-nginx/udp-services`. These locations are set with `--tcp-services-configmap` and `--udp-services-configmap` flags and you can check it in deployment of Ingress Controller or add it there in [args section for nginx-ingress-controller][ingress-controller-args] if it's not already specified. This is explained in [NGINX Ingress documentation][ingress-controller-tcp-udp]

### 2. Expose the Required Ports in the Ingress Service

You need to expose the MQTT ports (`1883` for unencrypted and `8883` for encrypted messages) and the CoAP port (`5683` for UDP) in the NGINX Ingress Controller service. You can do that with the following command that edits your service:

`kubectl edit svc -n ingress-nginx nginx-ingress-ingress-nginx-controller`

and add in spec->ports:

```yaml
- name: mqtt
  port: 1883
  protocol: TCP
  targetPort: 1883
- name: mqtts
  port: 8883
  protocol: TCP
  targetPort: 8883
- name: coap
  port: 5683
  protocol: UDP
  targetPort: 5683
```

## Configuring TLS & mTLS

### 1. Generating Certificates

For testing purposes, you can generate the necessary TLS certificates. Detailed instructions are provided in the [authentication][authentication] chapter of this document. You can use [this script][makefile] to generate the certificates. After replacing all instances of `localhost` with your actual hostname, run the following commands:

```bash
make ca
make server_cert
make client_cert KEY=<client_secret>
```

This will generate the following certificates in the `certs` folder, which you’ll use to set up TLS and mTLS:

```bash
ca.crt
ca.key
ca.srl
magistrala-server.crt
magistrala-server.key
client.crt
client.key
```

### 2. Creating Kubernetes Secrets

Create kubernetes secrets using those certificates by running commands from [secrets script][secrets]. In this example secrets are created in `mg` namespace:

```bash
kubectl -n mg create secret tls magistrala-server --key magistrala-server.key --cert magistrala-server.crt

kubectl -n mg create secret generic ca --from-file=ca.crt
```

You can check if they are succesfully created:

```bash
kubectl get secrets -n mg
```

### 3. Configuring Ingress for TLS

To secure your ingress with a TLS certificate, set the following values in your Helm configuration:

- `ingress.hostname` to your hostname
- `ingress.tls.hostname` to your hostname
- `ingress.tls.secret` to `magistrala-server`

After updating your Helm chart, your ingress will be secured with the TLS certificate.

### 4. Configuring Ingress for mTLS

For mTLS you need to set `nginx_internal.mtls.tls="magistrala-server"` and `nginx_internal.mtls.intermediate_crt="ca"`.

### 5. Testing MQTT with mTLS

You can test sending an MQTT message with the following command:

```bash
mosquitto_pub -d -L mqtts://<client_id>:<client_secret>@example.com:8883/m/<domain_id>/c/<channel_id>  --cert  client.crt --key client.key --cafile ca.crt  -m "test-message"
```

[ingress-yaml]: https://github.com/absmach/devops/blob/master/charts/mainflux/templates/ingress.yaml#L141
[ingress-controller-args]: https://kubernetes.github.io/ingress-nginx/user-guide/cli-arguments/
[ingress-controller-tcp-udp]: https://kubernetes.github.io/ingress-nginx/user-guide/exposing-tcp-udp-services/
[authentication]: ./authentication.md
[makefile]: https://github.com/absmach/magistrala/blob/master/docker/ssl/Makefile
[secrets]: https://github.com/absmach/devops/blob/master/charts/mainflux/secrets/secrets.sh
