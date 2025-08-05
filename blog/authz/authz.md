# SuperMQ Security Deep Dive: Authentication, Authorization, and TLS

## Introduction

Security is the backbone of any IoT platform. With millions of devices potentially connecting to your system, you need rock-solid authentication, fine-grained authorization, and encrypted communication. SuperMQ takes security seriously, implementing multiple layers of protection to keep your IoT ecosystem safe.

Think about it - your IoT devices might be collecting sensitive data, controlling critical infrastructure, or handling personal information. One weak link in the security chain could expose everything. That's why SuperMQ uses a multi-layered approach: strong authentication to verify who's connecting, detailed authorization to control what they can do, and TLS encryption to protect data in transit.

In this post, we'll walk through SuperMQ's security architecture, show you how to set up different authentication methods, and explain how to use Personal Access Tokens (PATs) for secure automation. We'll also cover TLS configuration and certificate management.

## System Architecture

SuperMQ's security architecture is built around three core principles: authenticate everything, authorize carefully, and encrypt always. Let's see how this works in practice.

### Authentication Layer

Authentication in SuperMQ happens at multiple levels:

**User Authentication**: When users log in, they get JWT tokens with configurable expiration times. These tokens contain user identity and role information.

**Device Authentication**: IoT devices authenticate using client secrets or certificates. Client secrets are generated during device creation and provide long-term authentication without requiring database lookups for validation, making them perfect for resource-constrained devices.

**Service Authentication**: Internal SuperMQ services authenticate with each other using mutual TLS (mTLS) and service-specific credentials.

### Authorization Engine

SuperMQ uses SpiceDB for fine-grained authorization. This isn't just simple role-based access control - it's a relationship-based system that can handle complex permissions like "Alice can edit channels in the Manufacturing domain" or "Device X can publish to channels that are shared with its group."

The system supports these authorization patterns:
- **Domain-based isolation**: Users and devices belong to domains, and permissions are scoped to domains
- **Hierarchical permissions**: Groups can contain other groups, inheriting permissions
- **Resource-specific access**: Fine-grained control over individual channels, clients, or data streams
- **Time-based access**: Tokens can have expiration times for temporary access

### Token Types

SuperMQ uses different token types for different use cases:

1. **Access Tokens**: Short-lived tokens (default 1 hour) for user sessions
2. **Refresh Tokens**: Longer-lived tokens (default 24 hours) to get new access tokens
3. **Client Secrets**: Long-lived credentials for device authentication, generated during client creation
4. **Recovery Tokens**: Short-lived tokens (5 minutes) for password reset
5. **Invitation Tokens**: Time-limited tokens (default 168 hours) for user invitations
6. **Personal Access Tokens (PATs)**: Scoped tokens for secure automation

## Authentication Examples

Let's look at practical examples of how authentication works in SuperMQ.

### User Login and Token Management

Here's how a typical user authentication flow works:

```bash
# User login - get access and refresh tokens
curl -X POST http://localhost:9001/users/tokens/issue \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "12345678"
  }'
```

Response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

When the access token expires, use the refresh token to get a new one:

```bash
# Refresh access token
curl -X POST http://localhost:9001/users/tokens/refresh \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <refresh_token>"
```

### Device Authentication with Client Secrets

IoT devices authenticate using client secrets that are generated during client creation. When you create a client, SuperMQ generates a secret that the device uses for authentication:

```bash
# Create a client/device with authentication credentials
curl -X POST http://localhost:9006/{{domain_id}}/clients \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <access_token>" \
  -d '{
    "name": "Temperature Sensor 001",
    "credentials": {
      "identity": "temp-sensor-001",
      "secret": "secret"
    },
    "status": "enabled"
  }'
```

You can either let SuperMQ generate the secret automatically (by omitting the `secret` field) or provide your own. The generated secret is returned in the response and should be securely stored on the device.

Response includes the client credentials:
```json
{
  "id": "{{client_id}}",
  "name": "Temperature Sensor 001",
  "credentials": {
    "identity": "temp-sensor-001",
    "secret": "secret"
  },
  "status": "enabled",
  "created_at": "2025-08-01T10:00:00Z"
}
```

The device then uses these credentials to authenticate with SuperMQ services like MQTT, HTTP, or CoAP adapters.

### Certificate-based Authentication

For high-security environments, SuperMQ supports certificate-based authentication:

```bash
# Create a certificate for a client
curl -X POST http://localhost:9019/{{domain_id}}/certs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <access_token>" \
  -d '{
    "client_id": "{{client_id}}",
    "ttl": "8760h"
  }'
```

This creates a client certificate valid for one year (8760 hours). The device can then use this certificate for mTLS authentication.

## Personal Access Tokens (PATs)

PATs are SuperMQ's answer to secure automation. They're like API keys but with fine-grained scopes that limit exactly what they can do.

### Creating and Managing PATs

Here's how to create a PAT for automation:

```bash
# Create a PAT for CI/CD pipeline
curl -X POST http://localhost:9001/pats \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <access_token>" \
  -d '{
    "name": "CI/CD Pipeline",
    "description": "For automated testing and deployment",
    "duration": "720h"
  }'
```

Response:
```json
{
  "id": "{{pat_id}}",
  "user_id": "{{user_id}}",
  "name": "CI/CD Pipeline",
  "description": "For automated testing and deployment",
  "secret": "pat_dXNlcjEyMw==_randomstringhere",
  "issued_at": "2025-08-01T10:00:00Z",
  "expires_at": "2025-08-31T10:00:00Z"
}
```

**Important**: Save that secret! You won't see it again.

### Adding Scopes to PATs

The real power of PATs comes from scoped permissions. Here's how to add specific permissions:

```bash
# Add scopes for specific operations
curl -X PATCH http://localhost:9001/pats/{{pat_id}}/scope/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <access_token>" \
  -d '{
    "scopes": [
      {
        "optional_domain_id": "{{domain_id}}",
        "entity_type": "clients",
        "operation": "create",
        "entity_id": "*"
      },
      {
        "optional_domain_id": "{{domain_id}}",
        "entity_type": "channels",
        "operation": "read",
        "entity_id": "{{channel_id}}"
      },
      {
        "entity_type": "dashboards",
        "optional_domain_id": "{{domain_id}}",
        "operation": "read",
        "entity_id": "*"
      }
    ]
  }'
```

This PAT can now:
- Create any client in the specified domain
- Read one specific channel
- Read all dashboards in the domain

### Using PATs for Automation

Once you have a scoped PAT, use it like any other token:

```bash
# Create a client using the PAT
curl -X POST http://localhost:9006/{{domain_id}}/clients \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {{pat_secret}}" \
  -d '{
    "name": "Automated Test Client",
    "status": "enabled"
  }'
```

If the PAT doesn't have the right scope, you'll get a 403 Forbidden error.

### PAT Security Best Practices

1. **Minimal Scopes**: Only give PATs the permissions they absolutely need
2. **Short Lifespans**: Use reasonable expiration times, not years
3. **Regular Rotation**: Reset PAT secrets periodically
4. **Audit Trail**: Monitor when and how PATs are used
5. **Revoke Unused**: Remove PATs that are no longer needed

```bash
# Revoke a PAT when it's no longer needed
curl -X PATCH http://localhost:9001/pats/{{pat_id}}/revoke \
  -H "Authorization: Bearer <access_token>"

# Reset a PAT secret (generates new secret)
curl -X PATCH http://localhost:9001/pats/{{pat_id}}/reset \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <access_token>" \
  -d '{"duration": "168h"}'
```

## TLS and Certificate Management

SuperMQ supports comprehensive TLS and mTLS (mutual TLS) configuration for secure communication between all components. You can run SuperMQ in different security modes depending on your requirements.

### TLS vs mTLS

**TLS (Transport Layer Security)**: Provides one-way authentication where clients verify the server's identity. This is suitable for most client-server communications where you want to encrypt traffic and ensure you're connecting to the legitimate server.

**mTLS (Mutual TLS)**: Provides two-way authentication where both client and server verify each other's identities using certificates. This is ideal for service-to-service communication where you need to ensure both parties are trusted.

### TLS Configuration Types

**HTTP Services with TLS**: All SuperMQ HTTP services can run with TLS for encrypted client connections:

```bash
# Enable TLS for the auth service
SMQ_AUTH_HTTP_SERVER_CERT="/path/to/server.crt"
SMQ_AUTH_HTTP_SERVER_KEY="/path/to/server.key"
```

**gRPC Services with mTLS**: Internal service communication uses mTLS for maximum security:

```bash
# Enable mTLS for gRPC communication
SMQ_AUTH_GRPC_SERVER_CERT="/path/to/auth-grpc-server.crt"
SMQ_AUTH_GRPC_SERVER_KEY="/path/to/auth-grpc-server.key"
SMQ_AUTH_GRPC_SERVER_CA_CERTS="/path/to/ca.crt"
SMQ_AUTH_GRPC_CLIENT_CA_CERTS="/path/to/ca.crt"

# Client certificates for mTLS
SMQ_AUTH_GRPC_CLIENT_CERT="/path/to/auth-grpc-client.crt"
SMQ_AUTH_GRPC_CLIENT_KEY="/path/to/auth-grpc-client.key"
```

**MQTT/CoAP Adapters with TLS**: Protocol adapters support TLS for secure device communication:

```bash
# Enable TLS for MQTT adapter
SMQ_MQTT_ADAPTER_WS_TLS_CERT="/path/to/mqtt-server.crt"
SMQ_MQTT_ADAPTER_WS_TLS_KEY="/path/to/mqtt-server.key"

# Enable TLS for CoAP adapter  
SMQ_COAP_ADAPTER_DTLS_CERT="/path/to/coap-server.crt"
SMQ_COAP_ADAPTER_DTLS_KEY="/path/to/coap-server.key"
```

**Database Connections with TLS**: Even database connections can be encrypted:

```bash
# Enable TLS for database connections
SMQ_AUTH_DB_SSL_MODE="require"
SMQ_AUTH_DB_SSL_CERT="/path/to/client.crt"
SMQ_AUTH_DB_SSL_KEY="/path/to/client.key"
SMQ_AUTH_DB_SSL_ROOT_CERT="/path/to/ca.crt"
```

### Certificate Generation

SuperMQ provides tools for generating both TLS and mTLS certificates. For development and testing, you can use the included certificate generation scripts:

```bash
# Generate CA certificate and all service certificates
make -C docker/ssl all

# Generate only specific service certificates
make -C docker/ssl auth_grpc_certs
make -C docker/ssl clients_grpc_certs
make -C docker/ssl server_cert
```

This generates:
- **CA certificate**: Used to sign all other certificates
- **Server certificates**: For TLS-enabled HTTP services
- **gRPC mTLS certificates**: Both server and client certificates for each service
- **Client certificates**: For mTLS authentication

### TLS Security Modes

You can run SuperMQ in different security configurations:

**1. No TLS (Development Only)**
- All communication is unencrypted
- Suitable only for local development

**2. TLS for External APIs**
- HTTP APIs use TLS for encrypted client connections
- Internal gRPC communication remains unencrypted
- Good for basic production setups

**3. Full mTLS (Recommended for Production)**
- All HTTP APIs use TLS
- All internal gRPC communication uses mTLS
- Maximum security with mutual authentication
- Required for high-security environments

### Certificate Management with OpenBao

For production environments, SuperMQ integrates with OpenBao for automated certificate management. The OpenBao integration is configured internally by the SuperMQ certificate service.

You can issue certificates programmatically through the SuperMQ certificate API:

```bash
# Issue a certificate for a device
curl -X POST http://localhost:9019/{{domain_id}}/certs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <access_token>" \
  -d '{
    "client_id": "{{client_id}}",
    "ttl": "8760h"
  }'
```

### Certificate Revocation

When devices are compromised or decommissioned, revoke their certificates:

```bash
# Revoke a certificate
curl -X DELETE http://localhost:9019/certs/revoke \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <access_token>" \
  -d '{"client_id": "{{client_id}}"}'
```

## Authorization Examples

SuperMQ's authorization system is powerful and flexible, but it works through gRPC calls rather than direct HTTP endpoints. This means authorization checks happen internally between SuperMQ services, not through external API calls.

### How Authorization Works

When you make a request to any SuperMQ service (like creating a client or publishing to a channel), that service internally calls the auth service via gRPC to check if you're authorized. Here's what happens behind the scenes:

1. **User makes HTTP request** to a SuperMQ service (like clients service)
2. **Service extracts token** from the Authorization header
3. **Service calls auth service** via gRPC to check permissions
4. **Auth service responds** with authorized/unauthorized
5. **Original service** either processes the request or returns 403 Forbidden

### Internal gRPC Authorization Flow

The auth service exposes these gRPC methods for authorization:

- `Authenticate` - Validates regular user tokens
- `AuthenticatePAT` - Validates Personal Access Tokens
- `Authorize` - Checks if a user/token has permission for an action
- `AuthorizePAT` - Checks if a PAT has permission for an action (with scope validation)

### Testing Authorization

Since authorization happens internally, you test it by making requests to the actual services and seeing if they succeed or fail:

```bash
# This will internally trigger authorization checks
# If successful, the client gets created
# If unauthorized, you get 403 Forbidden
curl -X POST http://localhost:9006/{{domain_id}}/clients \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_token>" \
  -d '{
    "name": "Test Client",
    "status": "enabled"
  }'
```

### Authorization Patterns in Action

**Domain-based Access Control**: When you try to create a client in a domain, the clients service checks if your token has the right permissions in that domain.

**Channel Publishing**: When a device publishes to a channel via MQTT/HTTP/CoAP, the adapter checks if the device token can publish to that specific channel.

**Group Management**: When you add users to a group, the groups service verifies you have admin permissions on that group.

### PAT Authorization Flow

PATs have an additional authorization layer with scoped permissions:

1. **PAT is presented** to any SuperMQ service
2. **Service calls AuthenticatePAT** to validate the token
3. **Service calls AuthorizePAT** with the specific action being attempted
4. **Auth service checks** if the PAT's scopes allow this action
5. **Service proceeds** only if both authentication and scope authorization pass

## Security Best Practices

Based on real-world deployments, here are the security practices that matter:

### 1. Token Hygiene
- Use short-lived access tokens (1 hour max)
- Implement proper token refresh flows
- Store tokens securely (encrypted at rest)
- Never log tokens or put them in URLs

### 2. Network Security
- Always use TLS in production
- Implement certificate pinning for critical connections
- Use mTLS for service-to-service communication
- Regularly rotate certificates

### 3. Access Control
- Follow the principle of least privilege
- Use PATs for automation instead of user tokens
- Implement domain isolation for multi-tenant scenarios
- Regularly audit permissions

### 4. Monitoring and Alerting
- Log all authentication attempts
- Monitor for unusual access patterns
- Set up alerts for failed authorization attempts
- Track certificate expiration dates

### 5. Incident Response
- Have procedures for token revocation
- Know how to quickly revoke certificates
- Plan for credential rotation
- Keep audit logs for forensics

## Common Security Scenarios

### Scenario 1: Compromised Device

```bash
# 1. Revoke the device's API key
curl -X DELETE http://localhost:8189/keys/device_key_id \
  -H "Authorization: Bearer <admin_token>"

# 2. Revoke the device's certificate  
curl -X DELETE http://localhost:9019/certs/revoke \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin_token>" \
  -d '{"client_id": "compromised_device_id"}'

# 3. Remove device from all groups
curl -X DELETE http://localhost:9005/groups/{{group_id}}/members \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin_token>" \
  -d '{"members": ["{{client_id}}"]}'
```

### Scenario 2: Employee Leaving

```bash
# 1. Disable the user account
curl -X PATCH http://localhost:9001/users/{{user_id}}/enable \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin_token>" \
  -d '{"enabled": false}'

# 2. Revoke all their PATs
curl -X DELETE http://localhost:9001/pats \
  -H "Authorization: Bearer user_access_token"

# 3. Remove from all groups and domains
# (specific calls depend on your group structure)
```

### Scenario 3: Bulk Certificate Rotation

```bash
# Script to rotate certificates for all devices in a domain
for device_id in $(curl -s "http://localhost:9006/{{domain_id}}/clients" \
  -H "Authorization: Bearer <admin_token>" | jq -r '.clients[].id')
do
  # Issue new certificate
  curl -X POST http://localhost:9019/{{domain_id}}/certs \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer <admin_token>" \
    -d "{\"client_id\": \"$device_id\", \"ttl\": \"8760h\"}"
    
  # Revoke old certificate (after device updates)
  sleep 300  # Give device time to update
  curl -X DELETE http://localhost:9019/certs/revoke \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer <admin_token>" \
    -d "{\"client_id\": \"$device_id\"}"
done
```

## Conclusion

Security in IoT isn't just about strong passwords and encrypted connections (though those are important). It's about building defense in depth - multiple layers that protect your system even when individual components are compromised.

SuperMQ's security architecture gives you the tools to build that defense:

- **Strong authentication** with multiple token types for different use cases
- **Fine-grained authorization** that scales from simple permissions to complex relationship-based access control  
- **Comprehensive TLS support** for encrypting all communications
- **Certificate management** integrated with enterprise PKI systems
- **Personal Access Tokens** for secure automation without compromising user credentials

The key is using these tools correctly. Start with the principle of least privilege, implement proper token hygiene, and always encrypt communications. Monitor everything, plan for incidents, and regularly review your security posture.

Remember: security is not a destination, it's a journey. As your IoT deployment grows and evolves, so should your security practices. The examples and patterns in this post give you a solid foundation, but adapt them to your specific needs and threat model.

Ready to secure your IoT infrastructure? Check out the [SuperMQ documentation](https://docs.supermq.abstractmachines.fr/) for detailed setup guides and security configuration options.
