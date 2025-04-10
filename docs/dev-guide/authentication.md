---
title: Authentication
---


## User authentication

For user authentication Magistrala uses **Authentication** keys. There are two types of authentication keys:

- `User key` - Access Token or keys issued to the user upon login request
- `Recovery key` - Refresh Token or password recovery key

Authentication keys are represented and distributed by the corresponding [JWT][jwt]. User keys are issued when user logs in. Each user request (other than registration and login) contains user key that is used to authenticate the user.

Recovery key is the password recovery key. It's short-lived token used for password recovery process.

The following actions are supported:

- create (all key types)
- verify (all key types)

**Example of the tokens:**

```json
{
  "access_token": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MzkyOTQxMjcsImlhdCI6MTczOTI5MDUyNywiaXNzIjoic3VwZXJtcS5hdXRoIiwidHlwZSI6MCwidXNlciI6IjZjY2FmMTNjLWVmODgtNGNmMi04ZTNhLWM3YzA0YzVlYWY5YiJ9.Qot3ZoqC1enhAS3YEJY3WJioMAJnr98laBGsJzSgF2Zege5pVqILVLcPZzRBmHdIPys4diAGbqRQQzfW_k_Huw",
  "refresh_token": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MzkzNzY5MjcsImlhdCI6MTczOTI5MDUyNywiaXNzIjoic3VwZXJtcS5hdXRoIiwidHlwZSI6MSwidXNlciI6IjZjY2FmMTNjLWVmODgtNGNmMi04ZTNhLWM3YzA0YzVlYWY5YiJ9.EcRH3DUZcplHz-9Ry_90kSQKLwAWXPww9XfMZ9beoEJItpY39g5-n7vnTyLkRhOp6Pw6aZbfuhOL3TWIE-Q13A"
}
```

## Federated authentication

Federated authentication is a process of authenticating users using external identity providers. Magistrala supports federated authentication using [OpenID Connect][oidc] protocol. Magistrala is a resource provider and it uses [Google Identity Platform][google-identity-platform] as an identity provider. To use federated authentication, you need to create a project in Google Cloud Platform and enable Google Identity Platform API. After that, you need to create OAuth 2.0 credentials and configure the consent screen. This can be done by following Google's [documentation][google-identity-platform-docs]. Once you have created OAuth 2.0 credentials, you need to set the following environment variables:

```bash
MG_GOOGLE_CLIENT_ID=985229335584-m2mft8lqbgfn5gfw9ftrm3r2sgu4tsrw.apps.googleusercontent.com
MG_GOOGLE_CLIENT_SECRET=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YUIpw
MG_GOOGLE_REDIRECT_URL=http://localhost:3000/oauth/callback/google
MG_GOOGLE_STATE=pGXVNhEeKfycuBzk5InlSfMlEU9UrhlkTUOSqhsgDzXP2Y4RsN
MG_USERS_UI_REDIRECT_URL=http://localhost:9090
```

1. `MG_GOOGLE_CLIENT_ID` - Google OAuth 2.0 client ID
2. `MG_GOOGLE_CLIENT_SECRET` - Google OAuth 2.0 client secret
3. `MG_GOOGLE_REDIRECT_URL` - Google OAuth 2.0 redirect URL to handle callback after successful authentication. This URL must be registered in the Google Cloud Platform.
4. `MG_GOOGLE_STATE` - Random string used to protect against cross-site request forgery attacks.
5. `MG_USERS_UI_REDIRECT_URL` - URL to redirect user after successful authentication. This can be your Magistrala UI URL.

Magistrala handles the authentication callback at `<MG_BASE_URL>/google-callback` endpoint, where `<MG_BASE_URL>` is the base URL of your Magistrala instance. This endpoint needs to be registered in the Google Cloud Platform and it must match the value of `MG_GOOGLE_REDIRECT_URL` environment variable. If an error occurs, the error message is sent from the backend using a query paramters with the key `error`. The UI will read the error message from the query parameter and display it to the user. When a user signs up, Magistrala creates a local copy of the user with an ID provided by Google, the name and email address provided by Google and the password is left empty as the user is authenticated using Google, i.e. external user. The user can be created only once, so if the user already exists, the error will be sent to the UI via the error cookie. Finally, the user is redirected to the URL provided in `MG_USERS_UI_REDIRECT_URL` environment variable upon successful authentication. This should be the base URL of your UI.

The `MG_GOOGLE_CLIENT_ID`, `MG_GOOGLE_CLIENT_SECRET`, `MG_GOOGLE_REDIRECT_URL` and `MG_GOOGLE_STATE` environment variables should be the same for the UI and users service. The `MG_USERS_UI_REDIRECT_URL` environment variable should be the URL of your UI which is used to redirect the user after successful authentication.

Magistrala uses the `access_token` provided by Google only to fetch user information which includes user id, name, given name, family name, picture and locale. The `access_token` is not stored in the database and it's not used for any other purpose. The `id_token` is not used as it presents challenges on refreshing it, thus Magistrala issues its own `access_token` and `refresh_token` stored in the HTTP-only cookie and it's used to authenticate the user in the subsequent requests.

## Authentication with Magistrala keys

By default, Magistrala uses Magistrala Client secret for authentication. The Client secret is a secret key that's generated at the Client creation. In order to authenticate, the Client needs to send its secret with the message. The way the secret is passed depends on the protocol used to send a message and differs from adapter to adapter. For more details on how this secret is passed around, please check out [messaging section][messaging]. This is the default Magistrala authentication mechanism and this method is used if the composition is started using the following command:

```bash
docker-compose -f docker/docker-compose.yml up
```

## Mutual TLS Authentication with X.509 Certificates

In most of the cases, HTTPS, WSS, MQTTS or secure CoAP are secure enough. However, sometimes you might need an even more secure connection. Magistrala supports mutual TLS authentication (_mTLS_) based on [X.509 certificates][rf5280]. By default, the TLS protocol only proves the identity of the server to the client using the X.509 certificate and the authentication of the client to the server is left to the application layer. TLS also offers client-to-server authentication using client-side X.509 authentication. This is called two-way or mutual authentication. Magistrala currently supports mTLS over HTTP, WS, MQTT and MQTT over WS protocols. In order to run Docker composition with mTLS turned on, you can execute the following command from the project root:

```bash
AUTH=x509 docker-compose -f docker/docker-compose.yml up -d
```

Mutual authentication includes client-side certificates. Certificates can be generated using the simple script provided [here][ssl-makefile]. In order to create a valid certificate, you need to create Magistrala client using the process described in the [provisioning section][provision]. After that, you need to fetch created client secret. Client secret will be used to create x.509 certificate for the corresponding client. To create a certificate, execute the following commands:

```bash
cd docker/ssl
make ca CN=<common_name> O=<organization> OU=<organizational_unit> emailAddress=<email_address>
make server_cert CN=<common_name> O=<organization> OU=<organizational_unit> emailAddress=<email_address>
make client_cert CLIENT_SECRET=<client_secret> CRT_FILE_NAME=<cert_name> O=<organization> OU=<organizational_unit> emailAddress=<email_address>
```

These commands use [OpenSSL][openssl] tool, so please make sure that you have it installed and set up before running these commands. The default values for Makefile variables are

```env
CRT_LOCATION = certs
CLIENT_SECRET = d7cc2964-a48b-4a6e-871a-08da28e7883d
O = Magistrala
OU = magistrala
EA = info@magistrala.com
CN = localhost
CRT_FILE_NAME = client
```

Normally, in order to get clients running, you will need to specify only `CLIENT_SECRET`. The other variables are not mandatory and the termination should work with the default values.

- Command `make ca` will generate a self-signed certificate that will later be used as a CA to sign other generated certificates. CA will expire in 3 years.
- Command `make server_cert` will generate and sign (with previously created CA) server cert, which will expire after 1000 days. This cert is used as a Magistrala server-side certificate in usual TLS flow to establish HTTPS or MQTTS connection.
- Command `make client_cert` will finally generate and sign a client-side certificate and private key for the client.

In this example `<client_secret>` represents secret of the client and `<cert_name>` represents the name of the certificate and key file which will be saved in `docker/ssl/certs` directory. Generated Certificate will expire after 2 years. The key must be stored in the x.509 certificate `CN` field. This script is created for testing purposes and is not meant to be used in production. We strongly recommend avoiding self-signed certificates and using a certificate management tool such as [Vault][vault] for the production.

Once you have created CA and server-side cert, you can spin the composition using:

```bash
AUTH=x509 docker-compose -f docker/docker-compose.yml up -d
```

Then, you can create user and provision clients and channels. Now, in order to send a message from the specific client to the channel, you need to connect client to the channel and generate corresponding client certificate using aforementioned commands. To publish a message to the channel, client should send following request:

### WSS

```javascript
const WebSocket = require("ws");
// Do not verify self-signed certificates if you are using one.
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
// Replace <channel_id> and <client_secret> with real values.
const ws = new WebSocket(
  "wss://localhost/ws/m/<domain_id>/c/<channel_id>?authorization=<client_secret>",
  // This is ClientOptions object that contains client cert and client key in the form of string. You can easily load these strings from cert and key files.
  {
    cert: `-----BEGIN CERTIFICATE-----....`,
    key: `-----BEGIN RSA PRIVATE KEY-----.....`,
  }
);
ws.on("open", () => {
  ws.send("someclient");
});
ws.on("message", (data) => {
  console.log(data);
});
ws.on("error", (e) => {
  console.log(e);
});
```

As you can see, `Authorization` header does not have to be present in the HTTP request, since the secret is present in the certificate. However, if you pass `Authorization` header, it _must be the same as the key in the cert_. In the case of MQTTS, `password` filed in CONNECT message _must match the key from the certificate_. In the case of WSS, `Authorization` header or `authorization` query parameter _must match cert key_.

### HTTPS

```bash
curl -s -S -i --cacert docker/ssl/certs/ca.crt --cert docker/ssl/certs/<client_cert_name>.crt --key docker/ssl/certs/<client_cert_key>.key -X POST -H "Content-Type: application/senml+json" https://localhost/http/m/<domain_id>/c/<channel_id> -d '[{"bn":"some-base-name:","bt":1.276020076001e+09, "bu":"A","bver":5, "n":"voltage","u":"V","v":120.1}, {"n":"current","t":-5,"v":1.2}, {"n":"current","t":-4,"v":1.3}]'
```

### MQTTS

#### Publish

```bash
mosquitto_pub -u <client_id> -P <client_secret> -t m/<domain_id>/c/<channel_id> -h localhost -p 8883  --cafile docker/ssl/certs/ca.crt --cert docker/ssl/certs/<client_cert_name>.crt --key docker/ssl/certs/<client_cert_key>.key -m '[{"bn":"some-base-name:","bt":1.276020076001e+09, "bu":"A","bver":5, "n":"voltage","u":"V","v":120.1}, {"n":"current","t":-5,"v":1.2}, {"n":"current","t":-4,"v":1.3}]'
```

#### Subscribe

```bash
mosquitto_sub -u <client_id> -P <client_secret> --cafile docker/ssl/certs/ca.crt --cert docker/ssl/certs/<client_cert_name>.crt --key docker/ssl/certs/<client_cert_key>.key -t m/<domain_id>/c/<channel_id> -h localhost -p 8883
```

[jwt]: https://jwt.io/
[messaging]: ./messaging.md
[rf5280]: https://tools.ietf.org/html/rfc5280
[ssl-makefile]: https://github.com/absmach/magistrala/blob/main/docker/ssl/Makefile
[provision]: ./provision.md
[openssl]: https://www.openssl.org/
[vault]: https://www.vaultproject.io/
[oidc]: https://openid.net/connect/
[google-identity-platform]: https://cloud.google.com/identity-platform/docs/
[google-identity-platform-docs]: https://support.google.com/cloud/answer/6158849?hl=en
