# web-client
This repository contains the user-facing frontend service for the minireipaz project. 

## Repo Structure

```
├── definitionsapi ##### OpenAPI
│   └── openapi.yaml
│
├── api #### vercel function dep api
│   └── index.go
│
├── internal
│   ├── common
│   │   └── ping.go
│   ├── config
│   │   └── envs.go ### load, set envs
│   ├── honeycomb
│   │   ├── honey_setup.go ##### initial setup
│   │   └── otel_setup.go
│   ├── middlewares
│   │   └── middle.go ## register middlewares
│   ├── routes
│   │   └── routes.go
│   ├── users
│   │   └── name.go
│   └── vaults
│       ├── setup_vaults.go
│       ├── vault_hashi.go
│       └── vault_redis.go
│
├── scripts ### scripts to automate tasks
│   ├── lint.sh
│   ├── openapi-http.sh
│   ├── run_code.sh
│   └── test.sh
│
├── tests ### testing for vercel function
│   ├── name_test.go
│   └── ping_test.go
│
├── go.mod ### for vercel function
├── go.sum ### for vercel function
│
├── gover.coverprofile
│
├── localmain.go
├── Makefile
│
│
│ ################### react ######################
├── dist ####### DIST react
│   ├── assets
│   │   ├── index-DiwrgTda.css
│   │   ├── index-DVoHNO1Y.js
│   │   └── react-CHdo91hT.svg
│   ├── index.html
│   └── vite.svg
│
├── src
│   ├── App.css
│   ├── App.tsx
│   ├── assets
│   │   └── react.svg
│   ├── authConfig.ts ####### config auth provider
│   ├── components
│   │   ├── AuthProvider
│   │   │   └── indexAuthProvider.tsx ### Context
│   │   ├── Callback
│   │   │   └── indexCallback.tsx 
│   │   ├── Dashboard
│   │   │   └── indexDashboard.tsx
│   │   ├── Header
│   │   │   └── indexHeader.tsx
│   │   ├── Login
│   │   │   └── indexLogin.tsx
│   │   └── Logout
│   │       └── indexLogout.tsx
│   ├── index.css
│   ├── main.tsx
│   └── vite-env.d.ts
│
├── index.html
├── package.json
├── pnpm-lock.yaml
├── public
│   └── vite.svg
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── vercel.json
├── vite.config.ts
│ ################ docs ############
├── LICENSE
├── README.md
└── code-of-conduct.md
```

## Why We Use Zitadel as Identity And Access Management

Zitadel is a modern identity and access management solution designed to provide enhanced security and flexibility. Here are the key reasons for using Zitadel in our authorization process:

- Security: Zitadel implements robust security protocols, including PKCE (show notes above), which mitigates the risk of authorization code interception. By requiring a code_verifier and code_challenge, it ensures that the authorization code can only be exchanged by the legitimate client.

- Scalability: Zitadel is built to handle a large number of authentication requests, making it suitable for applications with high traffic. Its architecture supports scalability without compromising performance.

- User Experience: Zitadel provides a seamless user experience with customizable login pages and multi-factor authentication options. This helps in maintaining a consistent and secure user interface across applications.

- Compliance: Zitadel ensures compliance with various regulations and standards, such as GDPR and OpenID Connect. This is crucial for applications dealing with sensitive user data and operating in regulated environments.

- Integration: Zitadel offers easy integration with various applications and APIs. Its comprehensive documentation and support for standard protocols like OAuth 2.0 and OpenID Connect make it straightforward to implement in different environments.

- Administration: Zitadel includes powerful administrative tools for managing users, roles, and permissions. This simplifies the process of maintaining and auditing access controls within the application.

- Self-Hosted: By self-hosting Zitadel, organizations retain full control over their identity management system. Also allows for extensive customization to meet specific organizational needs, including custom login pages, workflows, and policies.

> Notes:
> The authorization code protocol is part of OAuth 2.0 (defined in [OAuth 2.0 RFC 7636](https://tools.ietf.org/html/rfc7636)). It involves the exchange of an authorization code for a token. This is the recommended authorization code flow in the [OAuth 2.1 draft](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-v2-1-07#section-10).
> 
>
> ```mermaid
> ---
> title: Authorization Code Grant with Proof Key for Code Exchange (PKCE)
> ---
> sequenceDiagram
>   actor User
>   User->>App: Click sign-in link (1)
> 
>   activate App
>   Note right of App: Generate code_verifier and<br/>code_challenge
>   App->>Identity Provider: Authorization code request & code_challenge (2)
>   deactivate App
> 
>   Identity Provider-->>User: Redirect to login/authorization prompt (3)
>   User-->>Identity Provider: Authenticate (3)
>   Identity Provider->>App: Authorization code (3)
> 
>   activate App
>   App->>Identity Provider: Authorization code & code verifier (4)
>   Note right of Identity Provider: Validate authorization code &<br/>code_verifier
>   Identity Provider->>App: Access token and ID token (4)
>   deactivate App
> 
>   App->>Your API: Request protected data with access token (5)
> ```


## Notes on Choosing Confluent Cloud Kafka over Upstash Kafka

- Triggers to Vercel Functions:

  <b>Upstash Kafka:</b> Does not support direct triggers to Vercel Functions.
  <b>Confluent Kafka:</b> Offers an HTTP connector that can send data directly to Vercel Functions, enabling real-time processing and more efficient workflows.

- Polling Interval:

  <b>Upstash Kafka:</b> Uses a service called QStash, which has a minimum polling interval of 1 minute. This delay is not suitable for use cases that require more immediate data processing.
  
  <b>Confluent Kafka:</b> The HTTP connector allows for near-instantaneous data transmission to Vercel Functions, ensuring timely processing without the limitations of a minimum polling interval.
  
## Reasons for Choosing Double-Writing Over CDC with Debezium or similar for Kafka Integration

When integrating event-driven systems like Apache Kafka with databases, the "double-writing" approach—writing data both to the database and Kafka—can lead to potential consistency issues. However, in certain scenarios, such as relying on free SaaS (Software as a Service) solutions, double-writing might be the practical choice. Here are the reasons why double-writing is preferred in our situation:

- Free SaaS Solutions: We depend on free SaaS offerings which provide necessary services at no cost. These services often do not support advanced features like change data capture (CDC) directly from their databases, limiting our ability to use solutions like Debezium.

- Infrastructure Limitations: Running a CDC tool like Debezium requires dedicated infrastructure and resources to manage and maintain the setup. Given our current limitations in infrastructure and resource availability, double-writing becomes a more feasible option.

- Quicker Implementation: Double-writing can be implemented more quickly compared to setting up a full CDC pipeline with Debezium. This allows us to achieve our integration goals faster, meeting immediate project deadlines and requirements.

- Simplicity: Double-writing involves straightforward code changes to ensure data is written to both the database and Kafka, simplifying the implementation process without needing in-depth CDC expertise.
Flexibility:

- Adaptable to SaaS Limitations: Many free SaaS platforms have limitations on direct access to their databases or transaction logs. Double-writing allows us to bypass these limitations by writing data to Kafka directly from our application layer.

- Custom Workflows: Double-writing enables us to create custom workflows tailored to our specific needs, which might not be fully supported by a standard CDC tool.

- Short-Term Viability: Double-writing serves as a viable interim solution while we assess and plan for a more robust CDC implementation in the future. It allows us to meet current project requirements and maintain progress.

- Evaluation Phase: This approach provides us with the opportunity to evaluate the actual requirements and benefits of a full CDC setup, ensuring that any future investment in Debezium or similar tools is well-justified.

## Code Scanning CodeQL Analysis

To ensure the security and quality of the code, it is crucial to enable code scanning in the repository settings

```
  Error: Code scanning is not enabled for this repository. Please enable code scanning in the repository settings.
```

## Notes for Using .env Files in GitHub Actions (needs improve)
To properly run tests and other workflows in GitHub Actions, it is essential to use environment variables stored in a .env file. There are a couple of methods to securely manage these environment variables in your GitHub Actions workflows.

1. Generating .env from Repository Secrets
GitHub allows you to store secrets securely in your repository settings. These secrets can then be used to generate a .env file within your GitHub Actions workflows.

```yaml
- name: Set up environment variables
  run: |
    echo "REDIS_VAULT_URI=${{ secrets.REDIS_VAULT_URI }}" >> .env
    echo "VAULT_KEY_FRONTEND_ENVS=${{ secrets.VAULT_KEY_FRONTEND_ENVS }}" >> .env
    echo "FRONTEND_ADDR=${{ secrets.FRONTEND_ADDR }}" >> .env
    echo "BACKEND_ADDR=${{ secrets.BACKEND_ADDR }}" >> .env
    echo "USERS_ADDR=${{ secrets.USERS_ADDR }}" >> .env
    echo "VITE_AUTHORITY=${{ secrets.VITE_AUTHORITY }}" >> .env
    echo "VITE_CLIENT_ID=${{ secrets.VITE_CLIENT_ID }}" >> .env
    echo "VITE_REDIRECT_URI=${{ secrets.VITE_REDIRECT_URI }}" >> .env
    echo "VITE_RESPONSE_TYPE=${{ secrets.VITE_RESPONSE_TYPE }}" >> .env
    echo "VITE_SCOPE=${{ secrets.VITE_SCOPE }}" >> .env
    echo "VITE_POST_LOGOUT_REDIRECT_URI=${{ secrets.VITE_POST_LOGOUT_REDIRECT_URI }}" >> .env
    echo "VITE_RESPONSE_MODE=${{ secrets.VITE_RESPONSE_MODE }}" >> .env
```

2. Using Encrypted .env Files

If you prefer to use an encrypted .env file, you can encrypt it locally and decrypt it during the GitHub Actions workflow.

Steps:
- Encrypt .env File:
Use a tool like gpg to encrypt your .env file.
  ```sh
  gpg --symmetric --cipher-algo AES256 .env
  ```
- Add Encrypted File and Passphrase as Secrets:

  Add the encrypted file to your repository.
  Store the passphrase as a secret in your GitHub repository settings.

- Decrypt and Use .env File in Workflow:
  Modify your GitHub Actions workflow YAML file to decrypt the .env file during the workflow.
```sh
- name: Decrypt .env file
  run: |
    gpg --quiet --batch --yes --decrypt --passphrase="${{ secrets.ENV_PASSPHRASE }}" --output .env .env.gpg
```

## Makefile

This project utilizes a Makefile to automate common development and testing tasks.
Available commands are:

```
make openapi_http
make lint
make test
make fmt
```

`make openapi_http`: Generates HTTP API client code from the OpenAPI specification.
`make lint`: Analyzes the source code to identify and report stylistic errors and programming mistakes.
`make test`: Runs the test suite to ensure that the code is functioning correctly.
`make fmt`: Formats the source code according to the project's style.


### openapi_http

To generate the OpenAPI documentation, simply run the following command:

```
make openapi_http
```

makefile details:

```
.PHONY: openapi_http
openapi_http:
	@echo "Generating OpenAPI documentation for the HTTP API..."
	@./scripts/generate_openapi.sh
```

### lint

Lints the Go codebase using golangci-lint.

Installation (optional):

If you need to install `golangci-lint` and `go-cleanarch`, run the script with the -install option:
```
./scripts/lint.sh -install
```

This will:
- Download and install `golangci-lint` version v1.59.1.
- Display the installed version of `golangci-lint`.
- Install the `go-cleanarch` tool.

Script details:

This will execute `golangci-lint` with the specified options:
-v: Enable verbose output.
--tests=false: Exclude tests from linting.
--timeout=2m: Set the timeout to 2 minutes.
--config ./.golangci.yaml: Use the specified configuration file for `golangci-lint`.


### fmt
This command will format all Go files in the current directory and its subdirectories using `goimports`.
```
make fmt
```

makefile details:

```
goimports -l -w -d -v ./
```

-l: Lists the files that would be formatted.
-w: Writes the formatted content directly to the files.
-d: Displays the diffs instead of applying them.
-v: Verbose mode, providing detailed output.


### test

By running the make test command, both the unit and E2E test suites will be executed sequentially. 

To run the tests, execute the following command. The tests will automatically retrieve the necessary environment variables:
```
make test
```

makefile details:

```
test:
	@./scripts/test.sh .env
	@./scripts/test.sh .e2e.env
```

Environment Variables:

.env: This file contains the environment variables for the main test suite.
.e2e.env: This file contains the environment variables for the end-to-end (E2E) test suite.

`./scripts/test.sh`: This script is responsible for executing the tests. It reads the environment variables from the specified files and runs the tests accordingly.
