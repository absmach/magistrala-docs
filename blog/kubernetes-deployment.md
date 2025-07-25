# Kubernetes Deployment

## Introduction

Modern software teams deploy new versions of applications faster than ever, making reliability during deployments critical. Customers are quick to leave if they encounter issues – according to research, 32% of customers will abandon a liked company after a single bad experience. To maintain uptime and trust, Kubernetes provides multiple deployment strategies that balance rollout velocity against the risk of failure.

The significance of this choice is not theoretical. In 2012, financial services firm Knight Capital Group lost $440 million in 45 minutes due to a deployment failure. A manual deployment process accidentally activated a dormant, high-risk feature in their trading system, triggering millions of erroneous trades that spiraled out of control. The firm was bankrupted by a single flawed release. and in October 2021, Facebook suffered a global outage that lasted over 6 hours. The root cause was a faulty configuration update to backbone routers. Although this was not strictly a Kubernetes workload, the event highlighted the consequences of deploying changes across all infrastructure at once without staging, traffic segmentation, or rollback mechanisms. Billions of users were unable to access Facebook, Instagram, or WhatsApp, and the company lost an estimated $100 million in revenue, with broader reputational damage.

By contrast, Google deploys thousands of production changes per day using progressive delivery techniques such as canary and A/B testing. A 2021 post by the Waze team (a Google subsidiary) described how automated canary analysis across over 1000 pipelines allowed them to catch performance regressions in less than 10 minutes, before they reached general users. This approach reduced incident rates and enabled daily deployments of backend and frontend services across a global user base.

At Abstract Machines, SuperMQ processes millions of messages per second across distributed environments. Every deployment has the potential to impact throughput, latency, delivery guarantees, or integration behavior across thousands of connected clients. To reduce risk and maintain platform stability during continuous delivery, we evaluated all major Kubernetes deployment strategies — including Recreate, Rolling Update, Blue/Green, Canary, Shadow, and A/B Testing. This post outlines the operational characteristics of each approach and explains why we selected A/B Testing as the default deployment strategy for SuperMQ’s control plane and user-facing services.

## Kubernetes Deployment Strategies: A Comparative Overview

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
