# Kubernetes Deployment

## Introduction

Modern software teams deploy new versions of applications faster than ever, making reliability during deployments critical. Customers are quick to leave if they encounter issues – according to research, 32% of customers will abandon a liked company after a single bad experience. To maintain uptime and trust, Kubernetes provides multiple deployment strategies that balance rollout velocity against the risk of failure.

The significance of this choice is not theoretical. In October 2021, Facebook suffered a global outage that lasted over 6 hours. The root cause was a faulty configuration update to backbone routers. Although this was not strictly a Kubernetes workload, the event highlighted the consequences of deploying changes across all infrastructure at once without staging, traffic segmentation, or rollback mechanisms. Billions of users were unable to access Facebook, Instagram, or WhatsApp, and the company lost an estimated $100 million in revenue, with broader reputational damage.

In 2023, Rivian deployed an update to a small cohort of vehicle infotainment systems as part of a rollout. However, an engineer mistakenly selected the wrong security certificate during packaging. This error disabled the speedometer and battery range displays in 3% of production vehicles. Although the technical blast radius was small, the company failed to communicate transparently through official channels. Instead, a Reddit post by a VP served as the initial source of truth, increasing user frustration and reputational cost.

In 2024, CrowdStrike issued a global security update that lacked sufficient regression testing for edge cases. The update was rolled out broadly rather than incrementally, affecting over 8 million systems worldwide and disrupting services in airlines, banks, hospitals, and governments. Estimated financial damages exceeded $10 billion. Had the update been rolled out via a progressive strategy such as canary or blue/green, the error would likely have been contained.

By contrast, Google deploys thousands of production changes per day using progressive delivery techniques. A 2021 post by the Waze team (a Google subsidiary) described how automated canary analysis across over 1000 pipelines allowed them to catch performance regressions in less than 10 minutes, before they reached general users. This approach reduced incident rates and enabled daily deployments of backend and frontend services across a global user base.

At Abstract Machines, SuperMQ processes millions of messages per second across distributed environments. Every deployment has the potential to impact throughput, latency, delivery guarantees, or integration behavior across thousands of connected clients. To reduce risk and maintain platform stability during continuous delivery, we evaluated all major Kubernetes deployment strategies — including Recreate, Rolling Update, Blue/Green, Canary, Shadow, and A/B Testing. This post outlines the operational characteristics of each approach and explains why we selected A/B Testing as the default deployment strategy for SuperMQ’s control plane and user-facing services

## Kubernetes Deployment Strategies

### 1. Recreate

The **Recreate** deployment strategy in Kubernetes involves terminating all existing pods in a deployment before launching the new version. It is a **stop-then-start** model. During the window between shutdown and readiness of new pods, the application is entirely unavailable.

This strategy is supported natively in Kubernetes by configuring the `strategy.type` field in a Deployment object to `"Recreate"`.

#### Operational Impact in Real-Time Systems

In a stateless web application, this momentary downtime may be acceptable under controlled conditions. In **real-time, stateful, or latency-sensitive systems like SuperMQ**, the impact is more severe:

- All live connections to broker nodes are dropped
- Message queues are interrupted mid-delivery
- Client retries increase dramatically, causing backlog and pressure on the queue
- Monitoring systems register false-positive alerts complicating triage

If even a few seconds of downtime violate SLAs or message integrity contracts, this strategy is unsuitable.

#### Industry Usage and Decline

Recreate is mostly used in early-stage development, CI testing, or non-critical workloads. According to a **2023 CNCF deployment report**, fewer than **7% of production workloads** in surveyed organizations used recreate as a deployment strategy. Additionally, Google’s SRE book advises avoiding deployment patterns that require full application downtime, especially in distributed systems with external dependencies.

#### Performance Characteristics

A 2022 Kubernetes deployment benchmark by Codefresh evaluated the time-to-recovery and user impact of five strategies under failure conditions. Recreate had the **highest Mean Time to Recovery (MTTR)** due to the complete shutdown of all pods:

| Strategy      | Average Downtime (seconds) | MTTR (seconds) | Error Rate During Deployment (%) |
| ------------- | -------------------------- | -------------- | -------------------------------- |
| Recreate      | 11.6                       | 16.3           | 100%                             |
| RollingUpdate | 1.8                        | 3.0            | 8–15%                            |
| Blue/Green    | 0.7                        | 1.2            | 0%                               |
| Canary        | 0.5                        | 1.0            | <5% (canary only)                |

The 100% error rate in Recreate is expected — during deployment, the service endpoint becomes completely unreachable. In SuperMQ, this means all connected clients — whether using **MQTT, WebSocket, or HTTP APIs** — experience **connection timeouts**, **subscription drops**, and **unacknowledged message failures**. Since SuperMQ handles continuous message streams across thousands of persistent sessions, this interruption can trigger downstream retries, duplicate delivery attempts, or failed handshakes with device clients.

Recreate provides **no rollback window**. If a new version fails, the previous version must be manually redeployed from scratch. If the container image has already been garbage collected or configuration mismatches arise, recovery may take additional time.

The strategy also assumes the application supports zero-state startup - meaning it can be safely restarted with no in-memory state, active socket sessions, or attached ephemeral volumes. In SuperMQ, which is built on NATS-based messaging infrastructure, this assumption does not hold. NATS JetStream provides message persistence, stream ordering, and durable consumer state, all of which require coordinated state recovery during pod restarts. When a Recreate deployment is triggered, all active connections and in-flight state are lost simultaneously. This includes unacknowledged messages, durable stream offsets, and delivery guarantees managed through NATS’s at-least-once semantics.

During the restart window, consumer group leadership must be reassigned, stream replicas re-elected, and JetStream metadata resynchronized across the SuperMQ cluster. If this process is interrupted or rushed, clients may experience out-of-order message delivery, missed acknowledgments, or dropped sessions - all of which compromise SuperMQ’s platform guarantees around delivery integrity and continuity. Because Recreate does not permit a phased switchover, the risks apply to every tenant and queue simultaneously, making the approach operationally unsafe for SuperMQ’s deployment model.

| Attribute           | Recreate                                    |
| ------------------- | ------------------------------------------- |
| Downtime            | 100% during rollout                         |
| Resource Overhead   | Minimal                                     |
| Rollback Time       | Slow – redeployment needed                  |
| Observability       | Low                                         |
| Version Coexistence | No                                          |
| Suitability         | Limited to dev/test or pre-approved outages |
| Industry Adoption   | <7% of prod workloads (CNCF, 2023)          |

### 1. Recreate

Recreate deployment replaces the current application version by terminating all running pods and then launching new ones. It results in a full outage during the transition window. For a real-time system like SuperMQ, this would cause message loss or backlog growth, violating platform guarantees on delivery continuity. Recreate is resource-efficient and operationally simple but provides no uptime protection. According to Kubernetes documentation and SRE practice guides, recreate is rarely used in production systems where availability is critical.

| Attribute           | Recreate                   |
| ------------------- | -------------------------- |
| Downtime            | 100% during rollout        |
| Resource Overhead   | Minimal                    |
| Rollback Time       | Slow – redeployment needed |
| Observability       | Low                        |
| Version Coexistence | No                         |

### 2. Rolling Update

Rolling updates incrementally replace old pods with new ones while maintaining service availability. In Kubernetes, this is handled by adjusting `maxUnavailable` and `maxSurge` parameters in the Deployment object. Rolling updates are the default in Kubernetes and are widely used for general-purpose web services.

However, in SuperMQ’s architecture, rolling updates introduce version skew across pods serving clustered brokers. If a new pod introduces schema or protocol changes incompatible with older clients, the resulting hybrid state can break delivery flows. Coordination between control and data planes also becomes more complex if versions are inconsistent. According to AWS and Datadog studies, rolling updates work best when backward compatibility is guaranteed and inter-service contracts are loose.

| Attribute           | Rolling Update           |
| ------------------- | ------------------------ |
| Downtime            | None to low              |
| Resource Overhead   | Low to moderate          |
| Rollback Time       | Fast – revert ReplicaSet |
| Observability       | Moderate                 |
| Version Coexistence | Yes – during rollout     |

### 3. Blue/Green

Blue/Green deployment provisions an entirely new environment (Green) while the existing one (Blue) remains live. Traffic is switched to Green only after validation. Rollback is instant — just switch back to Blue. This is effective for stateful workloads or major version upgrades.

SuperMQ considered this model for broker node updates but found the duplication cost high for clusters with hundreds of clients. Maintaining dual environments temporarily doubles infrastructure consumption. In addition, SuperMQ’s distributed quorum services require consistent cluster state. Cutting over between isolated environments requires precise control of replication and state sync, which increases complexity.

| Attribute           | Blue/Green                              |
| ------------------- | --------------------------------------- |
| Downtime            | None                                    |
| Resource Overhead   | High                                    |
| Rollback Time       | Immediate – switch traffic back         |
| Observability       | Low (no live user feedback pre-cutover) |
| Version Coexistence | No – traffic is switched fully          |

### 4. Canary

Canary deployments route a small percentage of production traffic to the new version. Kubernetes does not natively support traffic splitting; service meshes such as Istio or tools like Flagger are required to manage gradual rollout and rollback.

In SuperMQ, canary releases were evaluated for API gateway and monitoring components. Canary routing enables real workload validation, but for messaging brokers, partial rollout introduces unpredictability due to tight coupling with clients. Maintaining message ordering, exactly-once delivery, and in-flight state across mixed versions risks regression unless full compatibility is guaranteed.

Industry studies by Google and Booking.com show that automated canary analysis (ACA) improves release confidence, but also note false positives in rollback triggers when test cohorts are small or usage patterns are non-uniform.

| Attribute           | Canary                     |
| ------------------- | -------------------------- |
| Downtime            | None                       |
| Resource Overhead   | Moderate                   |
| Rollback Time       | Fast – traffic redirection |
| Observability       | High – real user metrics   |
| Version Coexistence | Yes                        |

### 5. Shadow Deployment

Shadow deployments mirror real user traffic to the new version without exposing its output. This allows testing at full production load without affecting users. Shadowing is used by platforms like Netflix for validating system behavior under scale.

SuperMQ’s messaging plane tested this for protocol upgrades. Mirrored traffic provided insight into performance and resource usage. However, shadowing doubles the load on ingress and queue systems. In a message queue system, it can also lead to side effects if not properly sandboxed — for instance, duplicate writes to backend systems if shadows are not isolated.

The complexity of maintaining strict idempotence and cost of full duplication make shadowing effective only for high-risk components prior to formal rollout.

| Attribute           | Shadow                        |
| ------------------- | ----------------------------- |
| Downtime            | None                          |
| Resource Overhead   | High                          |
| Rollback Time       | Not applicable                |
| Observability       | High – technical metrics only |
| Version Coexistence | Yes (mirrored traffic)        |

### 6. A/B Testing

A/B testing deploys multiple versions in parallel, each exposed to a defined subset of users. The routing decision can be based on HTTP headers, cookies, IP ranges, or feature flags. Unlike canary, the goal is not to promote a single version gradually but to **evaluate and compare** multiple alternatives.

At SuperMQ, we selected A/B testing for all user-facing API services and admin interfaces. Each deployment can be evaluated against real user traffic with minimal risk. For example, version A may retain the current message retention behavior, while version B introduces compression. Only users routed to version B experience the change. By comparing metrics such as end-to-end latency, error rates, and retry behavior, the better version can be identified based on statistical evidence.

The platform uses feature flag systems to define segment routing, and Prometheus + ClickHouse to collect version-specific metrics. Experiment durations are configured based on a threshold for statistical significance (e.g. 95% confidence with minimum 1M messages processed).

A/B testing provides a clean separation between deployment and release. Code can be deployed to production but held inactive until metrics show positive performance. This aligns with SuperMQ’s architecture principle: safe delivery under continuous change.

| Attribute           | A/B Testing                    |
| ------------------- | ------------------------------ |
| Downtime            | None                           |
| Resource Overhead   | Moderate                       |
| Rollback Time       | Instant – route all to control |
| Observability       | High – user and system metrics |
| Version Coexistence | Yes – deliberate split         |

---

## Comparison Table

| Strategy       | Downtime | Resource Overhead | Rollback Time         | Observability        | Version Coexistence |
| -------------- | -------- | ----------------- | --------------------- | -------------------- | ------------------- |
| Recreate       | High     | Low               | Slow – redeploy       | Low                  | No                  |
| Rolling Update | Low      | Low               | Moderate – revert RS  | Moderate             | Yes (short term)    |
| Blue/Green     | None     | High              | Immediate switch      | Low (pre-cutover)    | No                  |
| Canary         | None     | Moderate          | Fast                  | High (real users)    | Yes                 |
| Shadow         | None     | High              | N/A                   | High (system only)   | Yes                 |
| A/B Testing    | None     | Moderate          | Instant (route shift) | High (user + system) | Yes                 |

---

## Why A/B Testing Was Selected for SuperMQ

A/B testing was selected for SuperMQ's deployments based on the following criteria:

1. **User Impact Measurement**: SuperMQ routes message traffic across diverse regions and user types. A/B testing enables measurement of impact on key metrics (latency, retries, throughput) per cohort.

2. **Zero Downtime**: Both control and test versions run concurrently. Clients are always served by a live version, ensuring uninterrupted message delivery.

3. **Rollout Control**: Exposure of changes can be limited to internal tenants or specific customers. If a regression is detected, routing can be switched immediately without redeployment.

4. **Data-Driven Decisions**: Decisions to promote a release are based on performance data, not assumptions. This supports platform objectives around reliability and cost predictability.

5. **Supports Parallel Experiments**: Multiple A/B experiments can run concurrently across different services. Each change is isolated and independently validated.

6. **Decoupled Deployment and Release**: Code can be deployed behind feature flags, enabling safe testing in production without full exposure.

7. **Alignment with SuperMQ Design Goals**: The platform emphasizes throughput, low latency, and message integrity. A/B testing allows validation of these metrics under real-world load without compromising availability.

## Conclusion

SuperMQ’s adoption of A/B testing as the default deployment strategy reflects the platform’s operational goals: availability, performance, and safety at scale. While Kubernetes supports multiple deployment models, not all are equally suitable for stateful, latency-sensitive workloads like messaging. By adopting A/B testing, Abstract Machines ensures every change is validated under real traffic, measured for impact, and released with confidence.

This strategy enables high-frequency deployments with minimal user risk — an essential capability for a distributed messaging platform operating at global scale.
