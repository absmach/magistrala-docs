## Kubernetes

Supermq can be easily deployed on the Kubernetes platform using Helm Charts from the official [Supermq DevOps GitHub repository](https://github.com/absmach/supermq-devops).

## Prerequisites

### 1. Install Docker

K3d requires Docker to run Kubernetes clusters inside Docker containers. Follow the official [Docker installation guide](https://docs.docker.com/get-docker/) to install Docker.

Once installed, verify the installation:

```bash
docker --version
```

---

### 2. Install Kubernetes via K3d

K3d is a lightweight Kubernetes distribution that runs inside Docker, ideal for local development.

#### Steps to install K3d

```bash
curl -s https://raw.githubusercontent.com/k3d-io/k3d/main/install.sh | bash
```

For more information on K3d, refer to the official [K3d documentation](https://k3d.io/).

### 3. Install kubectl

`kubectl` is the command-line tool used to interact with your Kubernetes cluster.

#### Steps to install kubectl

```bash
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
```

Verify the installation:

```bash
kubectl version --client
```

---

### 4. Install Helm v3

Helm is a package manager for Kubernetes, simplifying application installation and management.

#### Steps to install Helm

```bash
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
```

Verify the installation:

```bash
helm version
```

---

### 5. Add Helm Repositories

#### Add Stable Helm Repository

The **Helm stable repository** contains Helm charts that you can use to install applications on Kubernetes.

```bash
helm repo add stable https://charts.helm.sh/stable
helm repo update
```

#### Add Bitnami Helm Repository

Bitnami offers a collection of popular Helm charts for various applications.

```bash
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update
```

---

### 6. Install Nginx Ingress Controller

The Nginx Ingress Controller manages external access to services within your Kubernetes cluster.

#### Install Nginx Ingress Controller using Helm

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

### Deploying Supermq

There are two primary ways to deploy Supermq, depending on your needs:

---

#### 1. Manual Local Deployment

This method involves **cloning the chart source code**, modifying it locally, and installing Supermq from disk.

This approach is useful if you want to:

- Directly interact with the chart source files.
- Modify the chart before installation.
- Perform development or testing on the chart.

### Steps

#### 1. Clone Supermq Helm Chart Repository

```bash
git clone https://github.com/absmach/supermq-devops.git
cd supermq-devops/charts/supermq # Ensure you're in the directory containing Chart.yaml
```

#### 2. Add Required Helm Repositories

```bash
helm repo add nats https://nats-io.github.io/k8s/helm/charts/
helm repo add jaegertracing https://jaegertracing.github.io/helm-charts
helm repo add hashicorp https://helm.releases.hashicorp.com
helm repo add grafana https://grafana.github.io/helm-charts
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update
```

This ensures that all necessary repositories are available for dependencies.

#### 3. Update Dependencies

Once the repositories have been added, update the on-disk dependencies to match the `Chart.yaml` file by running:

```bash
helm dependency update
```

If the repositories are set up correctly, this will resolve and download all chart dependencies to `charts/supermq/charts`.

> **Note**: Make sure you're running this command from within the `charts/supermq/` directory — the one containing the `Chart.yaml` file.

You can confirm the dependencies were fetched correctly by listing the contents of the `charts/` directory:

```bash
ls charts/
```

Here’s a cleaner, more structured, and slightly more explanatory version of that section:

---

### **4. Create Namespace and Deploy Supermq**

First, create a namespace for Supermq (if it doesn’t already exist):

```bash
kubectl create namespace smq
```

Then deploy the Supermq Helm chart into the `smq` namespace:

```bash
helm install supermq . -n smq
```

> **Note**: Make sure you're in the `charts/supermq/` directory containing the `Chart.yaml` when running the install command.

---

### **Troubleshooting Ingress Annotations**

If you encounter an error related to **snippet annotations** when using the NGINX Ingress Controller, you can enable them by upgrading the controller with the following flag:

```bash
helm upgrade ingress-nginx ingress-nginx/ingress-nginx -n ingress-nginx --set controller.allowSnippetAnnotations=true
```

Make sure the NGINX Ingress repository is added:

```bash
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update
```

---

### **Post-Deployment Verification**

Once the chart is installed, you can verify that Supermq is running correctly:

#### View all resources in the `smq` namespace:

```bash
kubectl get all -n smq
```

#### List all running pods:

```bash
kubectl get pods -n smq
```

#### List all services:

```bash
kubectl get services -n smq
```

#### View logs from a specific pod:

```bash
kubectl logs <pod-name> -n smq
```

Replace `<pod-name>` with the actual name of the pod you want to inspect.

### Interacting with Supermq Services After Deployment

Once Supermq is successfully deployed, you can interact with its services in the following ways:

- **Web-based User Interface (UI)**
- **Supermq CLI tool** (see the [CLI Documentation](https://docs.supermq.abstractmachines.fr/cli/))
- **HTTP API Clients** (e.g., `curl`, Postman)

#### Accessing Services via Ingress

Supermq uses the `ingress-nginx-controller` to expose services through Kubernetes Ingress resources. Depending on where you're running your cluster, the method for accessing the services differs slightly.

##### **DigitalOcean (DO) Deployment**

If you're deploying on DigitalOcean, a LoadBalancer service is automatically provisioned. To find the public IP address:

```bash
kubectl get svc -A | grep LoadBalancer
```

This command searches all namespaces for services of type `LoadBalancer`. The output looks like this:

```plaintext
ingress-nginx   ingress-nginx-controller   LoadBalancer   10.245.192.202   138.68.126.8   80:30424/TCP,443:31752/TCP   64d
```

Here, the public IP is **`138.68.126.8`** — this is the address you'll use to access Supermq services via the web UI, CLI, or API clients.

---

##### **Local Deployment (e.g., with `kind`, `minikube`, or `k3d`)**

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

  Then access Supermq at [http://localhost:8080](http://localhost:8080).

#### Using the Web-Based UI

- Once you have the Public IP address, open your web browser.
- In the address bar, enter the IP address followed by `/ui/login` as shown below:

```plaintext
  http://138.68.126.8/ui/login
```

#### Using Postman

If you prefer working with APIs, you can also interact with Supermq services using Postman by sending requests to the Public IP address of your load balancer. For example, to create a user:

##### 1. Set Up the Postman Request

- **Method:** `POST`
- **URL:** `http://138.68.126.8/users`

This URL points to the endpoint that handles user creation on your Supermq deployment. Replace `138.68.126.8` with the actual IP address or domain of your deployment if it differs.

###### 2. Set Up the Request Body

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

## Installing from the Published Helm Repository

This method uses the hosted Helm chart — no cloning or manual editing required.

### Use Case

Ideal for:

- Quick deployments.
- Production environments.
- Users who don’t need to modify the chart.

> While you won’t be editing the chart source code, you can still customize nearly every aspect of the deployment using a custom `values.yaml` file.
> This includes changing service settings, enabling/disabling components, overriding resource limits, configuring secrets, and much more — all without touching the chart itself.

### Install Steps

#### 1. Add the Supermq Helm Repository (Private Access)

The Supermq Helm charts are hosted via a private registry protected by an authentication layer.

To add the repository:

```bash
helm repo add Supermq-devops https://absmach.github.io/devops/ \
  --username <your-username> \
  --password <your-personal-access-token>
helm repo update
```

> **Important:** Replace `<your-username>` and `<your-personal-access-token>` with your actual credentials or token.

#### 2. Install the Supermq Chart

```bash
helm install <release-name> Supermq-devops/Supermq [flags]
```

> **Important:** Replace `<release-name>` with your desired release name. For the complete list of available flags to use with the above command, run `helm install --help`.

Example with release name and flag:

```bash
helm install my-Supermq Supermq-devops/Supermq --version 0.14.0
```

#### 3. Upgrading the Supermq Chart

To upgrade your Supermq deployment — whether you're:

- updating to a **newer chart version**,
- applying changes to your `values.yaml`, or
- overriding individual parameters via `--set` —  
  use the following command:

```bash
helm upgrade <release-name> Supermq-devops/Supermq -f custom-values.yaml
```

> **Replace `<release-name>`** with the name of your existing Helm release (e.g., `supermq`), and  
> **`custom-values.yaml`** with your configuration file (if applicable).

For a complete table of configurable parameters and their default values, see the [configurable parameters reference](https://github.com/absmach/supermq-devops/blob/master/charts/Supermq/README.md).

> **Note:** You only need to update the documentation at `charts/Supermq/README.md` if you’re making changes to the chart source (e.g., adding or modifying parameters in `values.yaml` or templates).  
> In such cases, regenerate the docs using `helm-docs` as outlined in [Autogenerating Helm Chart Documentation](https://github.com/absmach/supermq-devops/blob/master/README.md).

---

Let me know if you'd like this added to the deployment guide `.md` file too.

##### Optional: Upgrade to a Specific Version

If you want to upgrade to a particular chart version:

```bash
helm upgrade <release-name> Supermq-devops/Supermq --version 0.14.0 -f custom-values.yaml
```

> Use `helm search repo Supermq-devops/Supermq --versions` to view all available versions.

##### Verify the Upgrade

Once the upgrade command runs successfully, verify that your deployment is up-to-date:

```bash
helm list -n <namespace>
kubectl get pods -n <namespace>
```

#### 4. Uninstalling Supermq

To uninstall the Supermq release:

```bash
helm uninstall <release-name> -n smq
```

This will remove the Supermq release from the previously created `smq` namespace. Use the `--dry-run` flag to see which releases will be uninstalled without actually uninstalling them.

To delete all data and resources from your cluster (or at least from the target namespace), the following two options are available:

##### Option 1: Delete the Entire Namespace

Deleting the entire namespace will remove all resources contained within it in one go. Later you can recreate the namespace.

```sh
kubectl delete namespace smq

# Wait for deletion to complete (you can check the status with "kubectl get ns")
# Then recreate the namespace:
kubectl create namespace smq
```

##### Option 2: Delete All Resources Within the Namespace

If you prefer to keep the namespace and simply clear out all the resources, run these commands:

```sh
# Delete all workloads and services (Deployments, Pods, Services, etc.)
kubectl delete all --all -n smq

# Delete all PersistentVolumeClaims in the namespace
kubectl delete pvc --all -n smq

# Optionally, delete other resource types if needed (e.g., ConfigMaps, Secrets, ServiceAccounts)
kubectl delete configmap --all -n smq
kubectl delete secret --all -n smq
kubectl delete serviceaccount --all -n smq
```

If your cluster is dynamically provisioning persistent volumes, the associated PVs may be automatically deleted (if their reclaim policy is set to `Delete`). If you need to manually remove all PVs (and you’re sure no other namespace depends on them), run:

```sh
kubectl delete pv --all
```

### Option 3: Force Clear a Stuck Namespace

Sometimes the namespace may be stuck in the **Terminating** phase because some resources (such as pods or PVCs) still have finalizers. If you encounter an error like:

> `secrets "sh.helm.release.v1.Supermq.v1" is forbidden: unable to create new content in namespace smq because it is being terminated`
>
> follow these steps to force-clear the namespace:

#### Step 1. Force-Delete All Pods

Force-delete all pods in the namespace to remove any that might be stuck:

```sh
kubectl delete pods --all --force --grace-period=0 -n smq
```

#### Step 2. Remove Finalizers from PersistentVolumeClaims (PVCs)

List the PVCs in the namespace:

```sh
kubectl get pvc -n smq
```

For each PVC that is preventing deletion (they often have a finalizer like `kubernetes.io/pvc-protection`), remove the finalizer using:

```sh
kubectl patch pvc <pvc-name> -p '{"metadata":{"finalizers":null}}' -n smq
```

For example, if you have PVCs named `pvc-1` and `pvc-2`:

```sh
kubectl patch pvc pvc-1 -p '{"metadata":{"finalizers":null}}' -n smq
kubectl patch pvc pvc-2 -p '{"metadata":{"finalizers":null}}' -n smq
```

Tp patch all the stuck PVCs in one go, run the follwing command:

```sh
NAMESPACE="smq"

# Get all Terminating PVCs
kubectl get pvc -n $NAMESPACE | grep Terminating | awk '{print $1}' | while read pvc; do
    echo "Patching and deleting PVC: $pvc"

    # Patch to remove finalizers
    kubectl patch pvc $pvc -n $NAMESPACE --type=json -p '[{"op": "remove", "path": "/metadata/finalizers"}]'

    # Force delete the PVC
    kubectl delete pvc $pvc -n $NAMESPACE --force --grace-period=0
done
```

#### Step 3. Delete All Remaining Resources (Optional)

To ensure no lingering resources remain:

```sh
kubectl delete all --all --force --grace-period=0 -n smq
kubectl delete configmap --all -n smq
kubectl delete secret --all -n smq
kubectl delete serviceaccount --all -n smq
```

#### Step 4. Remove Finalizers from the Namespace

Patch the namespace to remove its finalizers so that it can be fully deleted:

```sh
kubectl patch namespace smq -p '{"spec":{"finalizers":[]}}'
```

#### Step 5. Verify

Check that the namespace is deleted:

```sh
kubectl get namespace smq
```

After clearing the namespace (using any of the options above), you can recreate the namespace and install your Helm release into a fresh `smq` namespace:

---

### Customizing Supermq Installation

To override values in the chart, use either the `--values` flag and pass in a file or use the `--set` flag and pass configuration from the command line, to force a string value use `--set-string`. You can use `--set-file` to set individual values from a file when the value itself is too long for the command line or is dynamically generated. You can also use `--set-json` to set json values (scalars/objects/arrays) from the command line.

For example, if you want to set a custom hostname for the ingress (like `example.com`) and ensure you're using the latest version of the `users` image, you can do this during installation with the following command::

```bash
helm install Supermq -n smq --set ingress.hostname='example.com' --set users.image.tag='latest'
```

If Supermq is already installed and you want to update it with new settings (for example, changing the ingress hostname or image tag), you can use the `helm upgrade` command:

---

## 🔧 Supermq Core

The **Supermq Core** consists of the essential services needed to run a functional deployment of the Supermq platform. These services are enabled by default and can be customized through the `values.yaml` file.

### Core Services Overview

| Service        | Description                                                          |
| -------------- | -------------------------------------------------------------------- |
| `auth`         | Handles user authentication and token generation via gRPC and HTTP.  |
| `users`        | Manages user registration, password policies, and account lifecycle. |
| `clients`      | Registers and manages clients (devices, apps) and their credentials. |
| `adapter_http` | HTTP protocol adapter for interacting with Supermq over REST APIs.   |
| `adapter_mqtt` | MQTT protocol adapter + broker integration for real-time messaging.  |
| `adapter_coap` | Lightweight CoAP protocol adapter for constrained devices.           |
| `ui`           | Web-based User Interface for managing Supermq and its services.      |

These services are enabled and configured out of the box in the default Helm chart configuration.

### Supermq Add-ons

Supermq Add-ons are optional services that are not installed by default. To enable an add-on, you need to specify it during installation using the following command:

```bash
helm upgrade magistrala -n mg --set ingress.hostname='example.com' --set users.image.tag='latest'
```

This will apply your changes to the existing installation. For a complete table of the configurable parameters and their default values, see [configurable parameters and their default values](https://github.com/absmach/devops/blob/master/charts/magistrala/README.md). For changes to any of the configurable parameters, equally update the documentation at `charts/magistrala/README.md` using `helm-docs` as described in [Autogenerating Helm Chart Documentation](https://github.com/absmach/devops/blob/master/README.md).

### Magistrala Core

The Magistrala Core includes the essential services that are installed by default:

- authn
- users
- clients
- adapter_http
- adapter_mqtt
- adapter_coap
- ui

These are the minimum required services to run Magistrala.

### Magistrala Add-ons

Magistrala Add-ons are optional services that are not installed by default. To enable an add-on, you need to specify it during installation. For example, to enable the InfluxDB reader and writer, you would use the following command:

```bash
helm install magistrala . -n mg --set influxdb=true
```

Here’s a list of available add-ons:

- bootstrap
- influxdb.writer
- influxdb.reader
- adapter_opcua
- adapter_lora
- twins

### Scaling Services

By default, the MQTT adapter, Clients, Envoy, Authn, and the Message Broker services are set to scale with a replica count of 3. It’s recommended to set these values according to the number of nodes in your Kubernetes cluster. For example, you can adjust the replica count with the following command:

```bash
helm install magistrala . -n mg --set defaults.replicaCount=3 --set messageBroker.replicaCount=3
```

This ensures that your services scale appropriately for your environment.

### Additional Steps to Configure Ingress Controller

To allow your host to send MQTT messages on ports `1883` and `8883`, you need to configure the NGINX Ingress Controller with some additional steps.

#### Step 1: Configure TCP and UDP Services

The NGINX Ingress Controller uses ConfigMaps to expose TCP and UDP services. The necessary ConfigMaps are included in the Helm chart in the [ingress.yaml][ingress-yaml] file assuming that location of ConfigMaps should be `ingress-nginx/tcp-services` and `ingress-nginx/udp-services`. These locations are set with `--tcp-services-configmap` and `--udp-services-configmap` flags and you can check it in deployment of Ingress Controller or add it there in [args section for nginx-ingress-controller][ingress-controller-args] if it's not already specified. This is explained in [NGINX Ingress documentation][ingress-controller-tcp-udp]

#### Step 2: Expose the Required Ports in the Ingress Service

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

### Generating Certificates

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

### Creating Kubernetes Secrets

Create kubernetes secrets using those certificates by running commands from [secrets script][secrets]. In this example secrets are created in `smq` namespace:

```bash
kubectl -n smq create secret tls Supermq-server --key Supermq-server.key --cert Supermq-server.crt

kubectl -n smq create secret generic ca --from-file=ca.crt
```

You can check if they are succesfully created:

```bash
kubectl get secrets -n smq
```

### Configuring Ingress for TLS

To secure your ingress with a TLS certificate, set the following values in your Helm configuration:

- `ingress.hostname` to your hostname
- `ingress.tls.hostname` to your hostname
- `ingress.tls.secret` to `Supermq-server`

After updating your Helm chart, your ingress will be secured with the TLS certificate.

### Configuring Ingress for mTLS

For mTLS you need to set `nginx_internal.mtls.tls="Supermq-server"` and `nginx_internal.mtls.intermediate_crt="ca"`.

### Testing MQTT with mTLS

You can test sending an MQTT message with the following command:

```bash
mosquitto_pub -d -L mqtts://<client_id>:<client_secret>@example.com:8883/m/<domain_id>/c/<channel_id>  --cert  client.crt --key client.key --cafile ca.crt  -m "test-message"
```

[ingress-yaml]: https://github.com/absmach/devops/blob/master/charts/mainflux/templates/ingress.yaml#L141
[ingress-controller-args]: https://kubernetes.github.io/ingress-nginx/user-guide/cli-arguments/
[ingress-controller-tcp-udp]: https://kubernetes.github.io/ingress-nginx/user-guide/exposing-tcp-udp-services/
[authentication]: ./authentication.md
[makefile]: https://github.com/absmach/Supermq/blob/master/docker/ssl/Makefile
[secrets]: https://github.com/absmach/devops/blob/master/charts/mainflux/secrets/secrets.sh
