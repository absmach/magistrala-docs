# title: Kubernetes Secret Management using OpenBao

Kubernetes includes a Secret object to separate sensitive data from application code. However, the default implementation of Kubernetes Secrets has limitations for production environments, which introduce security risks. The security risks primarily stem from misconfigurations and the inherent limitations of the Secret object itself.

## Limitations of Native Kubernetes Secrets

To build a secure system, it is important to understand the limitations of existing tools. While Kubernetes Secret objects provide a way to avoid hard-coding credentials into application code or container images, their default implementation has several shortcomings. Relying on these native objects without additional configuration and external tooling can result in a system that is difficult to audit and operationally complex.

### Base64 is Not Encryption

A common misconception about Kubernetes Secrets is that they are encrypted by default.   nThe data within a Secret object is only encoded using Base64. Base64 is an encoding scheme, not an encryption algorithm; its purpose is to ensure that binary data can be transmitted as text. It can be reversed by anyone with access to the manifest file or API object. For example, a password of `my-super-secret` becomes `bXktc3VwZXItc2VjcmV0` when Base64 encoded. This can be reversed with a command-line tool:

```bash
$ echo 'bXktc3VwZXItc2VjcmV0' | base64 --decode
my-super-secret
```

This lack of encryption extends to how secrets are stored. Kubernetes uses `etcd`, a distributed key-value store, for all cluster state, including Secret objects. In a default configuration, these secrets are stored in `etcd` as Base64-encoded text. This means any user or process with read access to the etcd database - or access to a backup of etcd - can read every secret in the cluster. While Kubernetes offers a mechanism to enable encryption at rest for `etcd` data, it is not enabled by default and requires manual configuration. Without this step, the cluster's sensitive data is not protected.

### Access Control with RBAC

Kubernetes uses Role-Based Access Control (RBAC) to govern actions on cluster resources. While useful for general authorization, the RBAC model is not granular enough for secrets management. The issue is that RBAC permissions operate on resource types within a namespace, not individual resources. A `Role` can grant a user or service account permissions like `get`, `list`, or `watch` on all secrets within a namespace, but it cannot restrict that access to a specific secret. For an application that needs credentials for one database, an administrator must grant it access to every secret in its namespace. This practice increases the impact of a potential compromise; a breach of a single pod could lead to the exposure of credentials for every service in its environment.

This problem is amplified because any user or service account with permission to create a pod that uses a secret can also view the value of that secret, even if the user's RBAC roles do not grant them get access to the Secret object. A user could create a pod that mounts the secret as an environment variable and then prints that variable to the logs. This creates a privilege escalation path.

At scale, managing these broad RBAC policies becomes difficult. Attempting to create fine-grained access by defining numerous specific roles leads to a "role explosion," where the number of Roles and RoleBindings becomes hard to manage and audit, increasing the likelihood of misconfiguration.

### Operational Burden: Rotation, Scalability, and Auditing

Native Kubernetes Secrets also introduce operational challenges that make them less suitable for large-scale environments.

- Manual Rotation: Security practices require regular rotation of credentials. Kubernetes has no built-in feature for automating secret rotation. The process is manual: an operator must generate a new secret value, update the Secret object, and coordinate the restart of all application pods that use it. This process is complex and often neglected, leading to the use of long-lived static credentials.
- Lack of Centralization: In an organization with multiple teams and clusters, managing secrets can become difficult. Without a central management plane, each cluster is a silo, leading to secret sprawl and inconsistent policies. This decentralized approach does not scale and increases both operational overhead and security risk.
- Limited Auditing: Another limitation is the lack of detailed audit logging for secret access. While Kubernetes can generate audit logs for API server events, it does not, by default, provide a clear trail of who accessed a specific secret and when. Answering this question is important for incident response and regulatory compliance. Without robust auditing, it is difficult to detect unauthorized access or satisfy the requirements of standards like GDPR, HIPAA, or PCI-DSS.

These limitations are interconnected. The lack of granular RBAC leads to over-permissioning. This risk is compounded by the absence of detailed auditing. The difficulty of rotation ensures that these credentials remain valid for long periods. This shows that enabling etcd encryption alone is not a sufficient fix; a purpose-built solution is required. Kubernetes provides basic primitives but relies on the ecosystem to deliver implementations for specialized concerns like secrets management.

## OpenBao for Secrets Management

To address the weaknesses of native Kubernetes Secrets, organizations can use external, dedicated secrets management solutions. OpenBao is one such option, offering a platform for securing, storing, and controlling access to sensitive data. It is a community-driven, open-source fork of HashiCorp's Vault project, managed by the Linux Foundation. The project was started in late 2023 after HashiCorp relicensed its products, including Vault, from the Mozilla Public License 2.0 (MPL 2.0) to the Business Source License (BSL) 1.1. The BSL is not an OSI-approved open-source license as it restricts commercial use. OpenBao was created to ensure a secrets manager remains available under an open-source license (MPL 2.0) and open governance.

### General Secret Storage

Modern infrastructure increasingly relies on short-lived, ephemeral workloads, making long-lived static credentials a serious risk. If these credentials are accidentally leaked — whether through version control, misconfigured access, or something as simple as a note left behind by a departing employee — the consequences can be severe. OpenBao helps mitigate this by allowing you to generate short-lived, just-in-time credentials that are automatically revoked once they expire. This removes the burden of manual rotation and reduces the window of vulnerability.

### Static and Dynamic Secrets

OpenBao supports both static and dynamic secrets. Static secrets are useful for credentials that change infrequently — such as API keys or certificates — and are stored behind OpenBao's cryptographic barrier. Clients request them as needed in a controlled, auditable manner.

More powerfully, OpenBao can generate **dynamic secrets** on demand. These are created only when a client needs access — for example, to a database, cloud provider, or Active Directory resource — and are automatically revoked after a predefined lease period. This lifecycle management greatly reduces the surface area exposed by persistent credentials.

### Encryption as a Service

For teams that need to encrypt application data but don't want to build and manage cryptographic infrastructure, OpenBao provides encryption as a service. This allows developers to offload encryption and decryption operations to OpenBao using a centralized key management system. Sensitive data can be encrypted before being written to persistent storage — even if that storage system is not trusted — while the encryption keys themselves remain protected and governed within OpenBao.

### Identity-Based Access

Managing access across multiple clouds, services, and identity providers is complex. OpenBao supports a unified access control system that merges identities across providers and allows you to enforce policies based on trusted sources — such as cloud IAM, LDAP, GitHub, or Kubernetes Service Accounts. This helps mitigate identity sprawl and makes it easier to standardize authentication and authorization across diverse systems.

## Deploying OpenBao on Kubernetes with Helm

### Helm Chart Overview

The OpenBao Helm chart supports multiple deployment modes:

- **Dev mode**: In-memory only, suitable for demos.
- **Standalone mode** (default): Single instance with file storage backend.
- **HA mode**: Replicated OpenBao servers with an HA storage backend.
- **External mode**: Injector runs in-cluster but relies on an externally hosted OpenBao server.

Install the chart using:

```bash
helm repo add openbao https://openbao.github.io/openbao-helm
helm install openbao openbao/openbao
```

You can specify the version or override values:

```bash
helm install openbao openbao/openbao --version 0.4.0 \
  --set server.dev.enabled=true
```

> **Note**: The default standalone mode is not suitable for production. Use HA mode and secure storage backends for resilient setups.

### Unsealing and Initializing OpenBao

For standalone or HA deployments, OpenBao must be initialized and unsealed after installation:

```bash
kubectl exec -ti openbao-0 -- bao operator init
kubectl exec -ti openbao-0 -- bao operator unseal
```

Repeat unseal steps until the threshold is met. For HA mode, ensure all pods are unsealed and quorum is maintained.

### Auto-Unseal with Cloud KMS

To avoid manual unsealing, OpenBao supports auto-unseal with cloud providers:

#### Google Cloud KMS Example

```yaml
server:
  ha:
    enabled: true
  extraEnvironmentVars:
    GOOGLE_PROJECT: "<project>"
  volumes:
    - name: userconfig-kms-creds
      secret:
        secretName: kms-creds
```

Create the secret first:

```bash
kubectl create secret generic kms-creds --from-file=credentials.json
```

#### AWS KMS Example

```yaml
server:
  extraSecretEnvironmentVars:
    - envName: AWS_ACCESS_KEY_ID
      secretName: kms-creds
      secretKey: AWS_ACCESS_KEY_ID
```

And create the secret:

```bash
kubectl create secret generic kms-creds \
  --from-literal=AWS_ACCESS_KEY_ID=... \
  --from-literal=AWS_SECRET_ACCESS_KEY=...
```

### Exposing the UI (Optional)

To access the OpenBao UI locally:

```bash
kubectl port-forward openbao-0 8200:8200
```

For permanent exposure, use a service or ingress, but only with TLS and access controls.

### Securing Sensitive Configuration

If your OpenBao configuration includes secrets (e.g., database credentials), avoid plaintext ConfigMaps. Instead, store configs in a Kubernetes Secret and mount them:

```bash
kubectl create secret generic openbao-storage-config --from-file=config.hcl
```

And mount it with:

```bash
--set server.volumes[0].name=userconfig \
--set server.volumeMounts[0].mountPath=/openbao/userconfig \
--set server.extraArgs=-config=/openbao/userconfig/config.hcl
```

### Production Considerations

- **Enable audit logging** with persistent storage.
- **Always use TLS** to secure traffic.
- **Use single tenancy** per pod where possible.
- **Upgrade frequently** to apply security patches.
- **Use immutable infrastructure** practices for safer upgrades.
