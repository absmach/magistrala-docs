---

## title: Kubernetes

Magistrala can be easily deployed on the Kubernetes platform using Helm Charts from the official [Magistrala DevOps GitHub repository](https://github.com/absmach/devops).

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

## Deploying Magistrala (Manual Local Deployment)

This method involves **manually deploying Magistrala** by cloning the Helm chart repository to your local machine, making any necessary customizations, and installing the chart from the local directory.

### Deploy Use Case

This approach is useful if you want to:

- Directly interact with the chart source files.
- Modify the chart before installation.
- Perform development or testing on the chart.

### Steps

#### 1. Clone Magistrala Helm Chart Repository

```bash
git clone https://github.com/absmach/devops.git
cd devops/charts/magistrala
```

#### 2. Add Required Helm Repositories

```bash
helm repo add nats https://nats-io.github.io/k8s/helm/charts/
helm repo add jaegertracing https://jaegertracing.github.io/helm-charts
helm repo add hashicorp https://helm.releases.hashicorp.com
helm repo add grafana https://grafana.github.io/helm-charts
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo add fluent https://fluent.github.io/helm-charts
helm repo update
```

This ensures that all necessary repositories are available for dependencies.

#### 3. Update Dependencies

Once the repositories have been added, update the on-disk dependencies to match the `Chart.yaml` file by running:

```bash
helm dependency update
```

If the repositories are set up correctly, this will resolve and download all chart dependencies to `charts/magistrala/charts`.

### 4. Create a Namespace (if needed)

```bash
kubectl create namespace mg
```

---

### 5. Install Loki Manually

Instead of managing Loki as a dependency in the Helm chart, install it separately using the following command:

```bash
helm upgrade --install supermq \
  grafana/loki \
  --version=6.27.0 \
  --values=loki-override.yaml \
  --namespace loki \
  --create-namespace
```

#### Verify Loki Deployment

After installing Loki, check that it is running correctly:

```bash
kubectl get pods -n loki
kubectl get services -n loki
```

To check logs for any errors:

```bash
kubectl logs -l app.kubernetes.io/name=loki -n loki
```

To verify Loki’s ingestion and querying, **use port-forwarding** in a separate terminal:

```bash
kubectl port-forward -n loki svc/supermq-loki 3100:3100
```

Then, in another terminal, send test logs:

```bash
curl -H "Content-Type: application/json" -XPOST -s "http://127.0.0.1:3100/loki/api/v1/push" \
--data-raw '{"streams": [{"stream": {"job": "test"}, "values": [["'"$(date +%s)000000000"'", "test log message"]]}]}'
```

Finally, verify the logs in Loki:

```bash
curl "http://127.0.0.1:3100/loki/api/v1/query_range" --data-urlencode 'query={job="test"}'
```

You should get something like:

```bash
{"status":"success","data":{"resultType":"streams","result":[{"stream":{"detected_level":"unknown","job":"test","service_name":"test"},"values":[["1739616166000000000","test
log message"]]}],"stats":{"summary":{"bytesProcessedPerSecond":597,"linesProcessedPerSecond":24,"totalBytesProcessed":24,"totalLinesProcessed":1,"execTime":0.040156,"queueTime":0.000814,
"subqueries":0,"totalEntriesReturned":1,"splits":5,"shards":5,"totalPostFilterLines":1,"totalStructuredMetadataBytesProcessed":8},"querier":{"store":{"totalChunksRef":0,"totalChunksDownloaded":0,"
chunksDownloadTime":0,"queryReferencedStructuredMetadata":false,"chunk":{"headChunkBytes":0,"headChunkLines":0,"decompressedBytes":0,"decompressedLines":0,"compressedBytes":0,"totalDuplicates":0,
"postFilterLines":0,"headChunkStructuredMetadataBytes":0,"decompressedStructuredMetadataBytes":0},"chunkRefsFetchTime":0,"congestionControlLatency":0,"pipelineWrapperFilteredLines":0}},
"ingester":{"totalReached":5,"totalChunksMatched":1,"totalBatches":6,"totalLinesSent":1,"store":{"totalChunksRef":0,"totalChunksDownloaded":0,"chunksDownloadTime":0,"queryReferencedStructuredMetadata":false,
"chunk":{"headChunkBytes":24,"headChunkLines":1,"decompressedBytes":0,"decompressedLines":0,"compressedBytes":0,"totalDuplicates":0,"postFilterLines":1,"headChunkStructuredMetadataBytes":8,
"decompressedStructuredMetadataBytes":0},"chunkRefsFetchTime":880885,"congestionControlLatency":0,"pipelineWrapperFilteredLines":0}},"cache":{"chunk":{"entriesFound":0,"entriesRequested":0,
"entriesStored":0,"bytesReceived":0,"bytesSent":0,"requests":0,"downloadTime":0,"queryLengthServed":0},"index":{"entriesFound":0,"entriesRequested":0,"entriesStored":0,"bytesReceived":0,
"bytesSent":0,"requests":0,"downloadTime":0,"queryLengthServed":0},"result":{"entriesFound":0,"entriesRequested":0,"entriesStored":0,"bytesReceived":0,"bytesSent":0,"requests":0,
"downloadTime":0,"queryLengthServed":0},"statsResult":{"entriesFound":3,"entriesRequested":4,"entriesStored":4,"bytesReceived":525,"bytesSent":0,"requests":8,"downloadTime":9907901,
"queryLengthServed":90000000000},"volumeResult":{"entriesFound":0,"entriesRequested":0,"entriesStored":0,"bytesReceived":0,"bytesSent":0,"requests":0,"downloadTime":0,"queryLengthServed":0},
"seriesResult":{"entriesFound":0,"entriesRequested":0,"entriesStored":0,"bytesReceived":0,"bytesSent":0,"requests":0,"downloadTime":0,"queryLengthServed":0},"labelResult":{"entriesFound":0,
"entriesRequested":0,"entriesStored":0,"bytesReceived":0,"bytesSent":0,"requests":0,"downloadTime":0,"queryLengthServed":0},"instantMetricResult":{"entriesFound":0,"entriesRequested":0,
"entriesStored":0,"bytesReceived":0,"bytesSent":0,"requests":0,"downloadTime":0,"queryLengthServed":0}},"index":{"totalChunks":0,"postFilterChunks":0,"shardsDuration":0,"usedBloomFilters":false}}}}
```

### 6. Deploy Magistrala

Deploy the Magistrala Helm chart into the `mg` namespace:

```bash
helm install magistrala . -n mg
```

If you encounter an error related to snippet annotations in Nginx, enable them with:

```bash
helm upgrade ingress-nginx ingress-nginx/ingress-nginx -n ingress-nginx --set controller.allowSnippetAnnotations=true
```

Ensure you have the Nginx Ingress repository added:

```bash
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
```

### 7. Verifying Magistrala the Deployment

After deploying Magistrala, verify the services and pods using `kubectl` commands:

**List all pods:**

```bash
kubectl get pods -n mg
```

**List all services:**

```bash
kubectl get services -n mg
```

**View logs of a pod:**

```bash
kubectl logs <pod-name> -n mg
```

**View Logs in Grafana**

To visualize logs in Grafana, follow these steps:

#### **1. Port-Forward Grafana**

Since Grafana is running inside the Kubernetes cluster, you need to expose it locally using port forwarding:

```bash
kubectl port-forward -n smq svc/supermq-grafana 3000:80
```

#### **2. Log in to Grafana**

1. Open a web browser and go to **http://127.0.0.1:3000**.
2. Enter the login credentials:
   - **Username:** `admin`
   - **Password:** `12345678` (or your configured password).
3. Click **Login**.
4. On the left sidebar, click **Explore**.
5. In the **Data Source** dropdown at the top-right, select **Loki**.

#### **3. Apply Filters and Customize View**

- Use **Labels** like `service_name="fluent-bit"` to refine results.
- Select different time ranges to analyze logs over specific periods.
- Click **Run Query** to refresh the results.

You should see a log volume graph and structured log entries

### Interacting with Magistrala Services After Deployment

Once you have successfully deployed Magistrala, there are three primary ways you can interact with its services:

- web-based User Interface (UI)
- Magistrala CLI tool (learn more in the [CLI Documentation](https://docs.magistrala.abstractmachines.fr/cli/))
- HTTP API Clients (e.g., cURL, Postman)

The ingress-nginx-controller handles the routing for your deployed services using Kubernetes Ingress resources. To interact with your Magistrala UI or any other service exposed through this load balancer, the first step is to retrieve the Public IP address of this load balancer.

You can usually find this IP address in your DigitalOcean dashboard under the "Networking" or "Load Balancers" section, or by using the following command in your terminal:

```bash
    kubectl get svc -A | grep LoadBalancer
```

This command searches all namespaces for services of type `LoadBalancer`. The output looks something like this:

```plaintext
    ingress-nginx           ingress-nginx-controller                         LoadBalancer   10.245.192.202   138.68.126.8   80:30424/TCP,443:31752/TCP                        64d
```

NOTE: The Public IP in this case is `138.68.126.8`.

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

## Install Magistrala Charts (From Published Helm Repository)

This method is the **standard installation** approach, where you install the Magistrala chart directly from a Helm repository. This is quicker and ideal for end-users who do not need to modify the chart manually.

### Install Use Case

This approach is suitable for:

- End-users who simply want to install Magistrala without modifying the source code.
- Production environments where the chart is deployed directly from a hosted Helm repository.

### Install Steps

#### 1. Add the Magistrala Helm Repository

The Helm charts are published via GitHub Pages. After installing Helm, add the Magistrala DevOps Helm repository by running:

```bash
helm repo add magistrala-devops https://absmach.github.io/devops/
helm repo update
```

For a complete list of all available flags to use with the `helm repo add [NAME] [URL] [flags]` command, run `helm repo add --help`

#### 2. Install the Magistrala Chart

```bash
helm install <release-name> magistrala-devops/magistrala [flags]
```

Replace `<release-name>` with your desired release name. For the complete list of available flags to use with the above command, run `helm install --help`.

Example with release name and flag:

```bash
helm install my-magistrala magistrala-devops/magistrala --version 0.14.0
```

---

#### 3. Upgrading the Magistrala Chart

To upgrade the chart to a new version or update configurations:

```bash
helm upgrade <release-name> magistrala-devops/magistrala
```

---

#### 4. Uninstalling Magistrala

To uninstall the Magistrala release:

```bash
helm uninstall <release-name> -n mg
```

This will remove the Magistrala release from the previously created `mg` namespace. Use the `--dry-run` flag to see which releases will be uninstalled without actually uninstalling them.

To delete all data and resources from your cluster (or at least from the target namespace), the following two options are available:

##### Option 1: Delete the Entire Namespace

Deleting the entire namespace will remove all resources contained within it in one go. Later you can recreate the namespace.

```sh
kubectl delete namespace mg

# Wait for deletion to complete (you can check the status with "kubectl get ns")
# Then recreate the namespace:
kubectl create namespace mg
```

##### Option 2: Delete All Resources Within the Namespace

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

#### Step 1. Force-Delete All Pods

Force-delete all pods in the namespace to remove any that might be stuck:

```sh
kubectl delete pods --all --force --grace-period=0 -n mg
```

#### Step 2. Remove Finalizers from PersistentVolumeClaims (PVCs)

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

#### Step 3. Delete All Remaining Resources (Optional)

To ensure no lingering resources remain:

```sh
kubectl delete all --all --force --grace-period=0 -n mg
kubectl delete configmap --all -n mg
kubectl delete secret --all -n mg
kubectl delete serviceaccount --all -n mg
```

#### Step 4. Remove Finalizers from the Namespace

Patch the namespace to remove its finalizers so that it can be fully deleted:

```sh
kubectl patch namespace mg -p '{"spec":{"finalizers":[]}}'
```

#### Step 5. Verify and Recreate the Namespace

Check that the namespace is deleted:

```sh
kubectl get namespace mg
```

Once deleted, recreate the namespace:

```sh
kubectl create namespace mg
```

---

## Final Step: Reinstall Your Helm Release

After clearing the namespace (using any of the options above), you can now install your Helm release into a fresh `mg` namespace:

```sh
helm install magistrala . -n mg
```

---

### Customizing Magistrala Installation

To override values in the chart, use either the `--values` flag and pass in a file or use the `--set` flag and pass configuration from the command line, to force a string value use `--set-string`. You can use `--set-file` to set individual values from a file when the value itself is too long for the command line or is dynamically generated. You can also use `--set-json` to set json values (scalars/objects/arrays) from the command line.

For example, if you want to set a custom hostname for the ingress (like `example.com`) and ensure you're using the latest version of the `users` image, you can do this during installation with the following command::

```bash
helm install magistrala -n mg --set ingress.hostname='example.com' --set users.image.tag='latest'
```

If Magistrala is already installed and you want to update it with new settings (for example, changing the ingress hostname or image tag), you can use the `helm upgrade` command:

```bash
helm upgrade magistrala -n mg --set ingress.hostname='example.com' --set users.image.tag='latest'
```

This will apply your changes to the existing installation. For a complete table of the configurable parameters and their default values, see [configurable parameters and their default values](https://github.com/absmach/devops/blob/master/charts/magistrala/README.md). For changes to any of the configurable parameters, equally update the documentation at `charts/magistrala/README.md` using `helm-docs` as described in [Autogenerating Helm Chart Documentation](https://github.com/absmach/devops/blob/master/README.md).

### Magistrala Core

The Magistrala Core includes the essential services that are installed by default:

- authn
- users
- things
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

By default, the MQTT adapter, Things, Envoy, Authn, and the Message Broker services are set to scale with a replica count of 3. It’s recommended to set these values according to the number of nodes in your Kubernetes cluster. For example, you can adjust the replica count with the following command:

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
make thing_cert KEY=<thing_secret>
```

This will generate the following certificates in the `certs` folder, which you’ll use to set up TLS and mTLS:

```bash
ca.crt
ca.key
ca.srl
magistrala-server.crt
magistrala-server.key
thing.crt
thing.key
```

### Creating Kubernetes Secrets

Create kubernetes secrets using those certificates by running commands from [secrets script][secrets]. In this example secrets are created in `mg` namespace:

```bash
kubectl -n mg create secret tls magistrala-server --key magistrala-server.key --cert magistrala-server.crt

kubectl -n mg create secret generic ca --from-file=ca.crt
```

You can check if they are succesfully created:

```bash
kubectl get secrets -n mg
```

### Configuring Ingress for TLS

To secure your ingress with a TLS certificate, set the following values in your Helm configuration:

- `ingress.hostname` to your hostname
- `ingress.tls.hostname` to your hostname
- `ingress.tls.secret` to `magistrala-server`

After updating your Helm chart, your ingress will be secured with the TLS certificate.

### Configuring Ingress for mTLS

For mTLS you need to set `nginx_internal.mtls.tls="magistrala-server"` and `nginx_internal.mtls.intermediate_crt="ca"`.

### Testing MQTT with mTLS

You can test sending an MQTT message with the following command:

```bash
mosquitto_pub -d -L mqtts://<thing_id>:<thing_secret>@example.com:8883/channels/<channel_id>/messages  --cert  thing.crt --key thing.key --cafile ca.crt  -m "test-message"
```

# **Setting Up Metric and Logging in Kubernetes**

## **1. Setting Up Helm Repositories**

Before installing the logging and monitoring stack, add the necessary Helm repositories:

```sh
helm repo add grafana https://grafana.github.io/helm-charts
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo add fluent https://fluent.github.io/helm-charts
helm repo update
```

This command adds:

- **Grafana** for visualization
- **Prometheus** for metrics collection
- **Fluent Bit** for log forwarding

---

## **2. Configuring `values.yaml`**

The `values.yaml` file defines configurations for **Loki, Fluent Bit, and Prometheus**.

**Location:** `helm/<your-chart>/values.yaml`

Modify the configuration:

```yaml
loki:
  enabled: true
  serviceMonitor:
    enabled: true
  persistence:
    enabled: true
    size: 10Gi
  config:
    auth_enabled: false
    storage_config:
      boltdb_shipper:
        active_index_directory: /data/loki/index
        cache_location: /data/loki/cache
        shared_store: filesystem
      filesystem:
        directory: /data/loki/chunks
    schema_config:
      configs:
        - from: 2024-01-01
          store: boltdb-shipper
          object_store: filesystem
          schema: v11
          index:
            prefix: index_
            period: 24h
    limits_config:
      retention_period: 168h # 7 days retention

fluent-bit:
  enabled: true
  image: fluent/fluent-bit:latest
  resources:
    limits:
      memory: 200Mi
    requests:
      cpu: 100m
      memory: 100Mi

prometheus:
  enabled: true
  serviceMonitor:
    enabled: true
  scrapeInterval: 30s
```

This configuration:

- Enables **Loki** with a 7-day log retention period
- Configures **Fluent Bit** as a lightweight log forwarder
- Sets up **Prometheus** to scrape metrics every 30 seconds

---

## **3. Deploying Fluent Bit**

Fluent Bit collects logs from all Kubernetes nodes.

**Location:** `helm/<your-chart>/templates/deployment-fluentbit.yaml`

Create a file named `deployment-fluentbit.yaml` with the following configuration:

```yaml
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: fluent-bit
  labels:
    app: fluent-bit
spec:
  selector:
    matchLabels:
      app: fluent-bit
  template:
    metadata:
      labels:
        app: fluent-bit
      annotations:
        prometheus.io/scrape: "true"
        prometheus.io/port: "2020"
    spec:
      serviceAccountName: fluent-bit
      containers:
        - name: fluent-bit
          image: "{{ .Values.fluent-bit.image }}"
          resources:
            limits:
              memory: "{{ .Values.fluent-bit.resources.limits.memory }}"
            requests:
              cpu: "{{ .Values.fluent-bit.resources.requests.cpu }}"
              memory: "{{ .Values.fluent-bit.resources.requests.memory }}"
          volumeMounts:
            - name: varlog
              mountPath: /var/log
            - name: varlibdockercontainers
              mountPath: /var/lib/docker/containers
              readOnly: true
      volumes:
        - name: varlog
          hostPath:
            path: /var/log
        - name: varlibdockercontainers
          hostPath:
            path: /var/lib/docker/containers
```

This configuration:

- Deploys **Fluent Bit** as a **DaemonSet** to collect logs from all nodes
- Mounts log directories for access
- Exposes metrics for Prometheus on port 2020

---

## **4. Creating a Loki Service**

Loki stores and serves logs.

**Location:** `helm/<your-chart>/templates/service-loki.yaml`

Create a file named `service-loki.yaml` with the following configuration:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: loki
spec:
  selector:
    app: loki
  ports:
    - name: http
      protocol: TCP
      port: 3100
      targetPort: 3100
```

This exposes Loki’s HTTP API for log retrieval.

---

## **5. Installing Loki, Fluent Bit, Prometheus, and Grafana**

Deploy all components using Helm:

```sh
helm install loki grafana/loki-stack --set promtail.enabled=false
helm install fluent-bit fluent/fluent-bit
helm install prometheus prometheus-community/kube-prometheus-stack
helm install grafana grafana/grafana
```

This installs:

- **Loki** for log aggregation
- **Fluent Bit** for log collection and forwarding
- **Prometheus** for monitoring
- **Grafana** for visualization

---

## **6. Common Error: Fluent Bit Fails to Connect to Loki**

After deploying Fluent Bit, you might see errors in the logs:

```plaintext
[error] [output:loki:loki.0] no upstream connections available
[warn] [net] getaddrinfo(host='loki', err=4): Domain name not found
```

This indicates that Fluent Bit **cannot reach Loki**.

### **Cause**

Fluent Bit is configured with an incorrect **Host** value. The default setting:

```yaml
[OUTPUT]
    Name         loki
    Match        *
    Host         loki
    Port         3100
```

assumes that the Loki service is simply `loki`. However, when Loki is installed via Helm, the service name might be prefixed, such as `loki-gateway` or `supermq-loki-gateway`.

To find the correct service name, run:

```sh
kubectl get svc -n smq | grep loki
```

If the output shows:

```plaintext
supermq-loki-gateway   ClusterIP   10.1.1.10   3100/TCP
```

then Fluent Bit should be configured with:

```yaml
Host         supermq-loki-gateway
```

---

## **7. Fixing the Fluent Bit ConfigMap**

To fix this issue, update the Fluent Bit ConfigMap.

### **Step 1: Edit the ConfigMap**

Run:

```sh
kubectl edit cm supermq-fluent-bit -n smq
```

### **Step 2: Update the Loki Host**

Find the following section:

```yaml
[OUTPUT]
    Name         loki
    Match        *
    Host         loki  # Incorrect
    Port         3100
```

Modify `Host` to match the correct **Loki Gateway service name**:

```yaml
Host         supermq-loki-gateway # Correct
```

### **Step 3: Save and Exit**

- Press `ESC`
- Type `:wq` and press `ENTER`

### **Step 4: Restart Fluent Bit Pods**

Since ConfigMaps **do not auto-reload**, restart Fluent Bit pods:

```sh
kubectl delete pods -l app.kubernetes.io/name=fluent-bit -n smq
```

Kubernetes will automatically recreate the pods with the updated configuration.

### **Step 5: Verify the Fix**

Monitor Fluent Bit logs:

```sh
kubectl logs -l app.kubernetes.io/name=fluent-bit -n smq --tail=50 -f
```

If the issue is resolved, logs should start flowing into Loki.

[ingress-yaml]: https://github.com/absmach/devops/blob/master/charts/mainflux/templates/ingress.yaml#L141
[ingress-controller-args]: https://kubernetes.github.io/ingress-nginx/user-guide/cli-arguments/
[ingress-controller-tcp-udp]: https://kubernetes.github.io/ingress-nginx/user-guide/exposing-tcp-udp-services/
[authentication]: ./authentication.md
[makefile]: https://github.com/absmach/magistrala/blob/master/docker/ssl/Makefile
[secrets]: https://github.com/absmach/devops/blob/master/charts/mainflux/secrets/secrets.sh
