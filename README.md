# web-client
This repository contains the user-facing frontend service for the minireipaz project. 


# TODO:
- ACL client frontend 

## Testing users

Username: ayilezt485@nic.edu.pl
Password: 123


## Repo Structure

```
├── definitionsapi ##### OpenAPI
│   └── openapi.yaml
│
├── api #### vercel function dep api
│   └── index.go
│
├── pkg
│   ├── auth
│   │   ├── jwt.generator.go
│   │   └── token_client.go
│   ├── common
│   │   ├── ping.go
│   │   └── randnum.go
│   ├── config
│   │   ├── envs.go
│   │   └── zitadel.go
│   ├── di
│   │   └── di.go
│   ├── domain
│   │   ├── models
│   │   │   ├── dashboard.go
│   │   │   ├── general.go
│   │   │   ├── token.go
│   │   │   ├── users.go
│   │   │   └── workflows.go
│   │   └── services
│   │       ├── auth_service.go
│   │       ├── dashboard.go
│   │       ├── users.go
│   │       └── workflow_service.go
│   ├── honeycomb
│   │   ├── honey_setup.go
│   │   └── otel_setup.go
│   ├── infra
│   │   ├── httpclient
│   │   │   ├── client.go
│   │   │   ├── dashboard.go
│   │   │   ├── user.go
│   │   │   ├── workflow_repo.go
│   │   │   └── zitadel.go
│   │   ├── redisclient
│   │   │   └── redisclient.go
│   │   └── tokenrepo
│   │       └── token_repository.go
│   ├── interfaces
│   │   ├── controllers
│   │   │   ├── auth.go
│   │   │   ├── dashboard.go
│   │   │   ├── users.go
│   │   │   └── workflow.go
│   │   ├── middlewares
│   │   │   ├── auth.go
│   │   │   ├── func_errors.go
│   │   │   ├── middle.go
│   │   │   └── validations.go
│   │   └── routes
│   │       └── routes.go
│   └── vaults
│       ├── setup_vaults.go
│       ├── vault_hashi.go
│       └── vault_redis.go
│
│ ################ SCRIPTS ############
├── scripts
│   ├── lint.sh
│   ├── openapi-http.sh
│   ├── run_code.sh
│   └── test.sh
├── Makefile
│
│ ################ TESTS ############
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
│   ├── App.tsx
│   ├── assets
│   │   └── react.svg
│   ├── authConfig.ts
│   ├── components
│   │   ├── AuthProvider
│   │   │   ├── Approuter.tsx
│   │   │   └── indexAuthProvider.tsx
│   │   ├── Callback
│   │   │   ├── authUserBackend.ts
│   │   │   └── indexCallback.tsx
│   │   ├── Cards
│   │   │   ├── FailedWorkflows.tsx
│   │   │   ├── PendingWorkflows.tsx
│   │   │   ├── QuickActions.tsx
│   │   │   ├── RecentActivity.tsx
│   │   │   ├── RecentWorkflows.tsx
│   │   │   ├── SuccessWorkflows.tsx
│   │   │   └── TotalWorkflows.tsx
│   │   ├── Dashboard
│   │   │   ├── ContentDashboard.tsx
│   │   │   ├── HeaderDashboard.tsx
│   │   │   └── NavDashboard.tsx
│   │   ├── Header
│   │   │   └── indexHeader.tsx
│   │   ├── Login
│   │   │   └── indexLogin.tsx
│   │   ├── Logout
│   │   │   └── indexLogout.tsx
│   │   ├── MyAccount
│   │   │   └── indexMyaccount.tsx
│   │   └── Workflow
│   │       ├── ButtonEdge.tsx
│   │       ├── DetailWorkflow.tsx
│   │       ├── HeaderWorkflow.tsx
│   │       ├── WorkflowDrawer.tsx
│   │       └── WrapperNode.tsx
│   ├── index.css
│   ├── main.tsx
│   ├── models
│   │   ├── Dashboard.ts
│   │   ├── QuickActions.ts
│   │   ├── Users.ts
│   │   └── Workflow.ts
│   ├── Pages
│   │   ├── indexDashboard.tsx
│   │   ├── indexdashboard.tsx.local
│   │   ├── indexWorkflowDetail.tsx
│   │   └── indexWorkflows.tsx
│   ├── utils
│   │   └── getUriFrontend.ts
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
│
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



## Flow in Quick action new workflow

```
graph TD
    A[Start] --> B[User clicks Create New Workflow]
    B --> C[Modal Opens]
    C --> D[User Enters Workflow Name]
    D --> E[User Clicks Create]
    E --> F{Is Workflow Name Valid?}
    F -- Yes --> G[Send POST Request to /api/create-workflow]
    G --> H{Request Successful?}
    H -- Yes --> I[Receive Workflow Data]
    I --> J[Close Modal]
    J --> K[Redirect to New Workflow Page]
    H -- No --> L[Show Error Message]
    F -- No --> M[Show Alert for Missing Name]
    L --> C
    M --> C
    K --> N[Fill Information on New Page]
    N --> O[End]
```

###### Explanation

1. **Start**: The process begins.
2. **User clicks Create New Workflow**: The user initiates the creation of a new workflow by clicking a button.
3. **Modal Opens**: A modal window opens up.
4. **User Enters Workflow Name**: The user enters the name of the workflow in the provided input field.
5. **User Clicks Create**: The user clicks the "Create" button to proceed.
6. **Is Workflow Name Valid?**: The system checks if the entered workflow name is valid.
    - **Yes**: If the name is valid, proceed to send a POST request to the API endpoint `/api/workflows`.
    - **No**: If the name is not valid, show an alert indicating the name is missing or invalid and return to the modal.
7. **Send POST Request to /api/workflows**: The system sends a request to create the workflow.
8. **Request Successful?**: The system checks if the request was successful.
    - **Yes**: If the request is successful, receive the workflow data.
    - **No**: If the request fails, show an error message and return to the modal.
9. **Receive Workflow Data**: The system receives the data of the newly created workflow.
10. **Close Modal**: The modal window closes.
11. **Redirect to New Workflow Page**: The system redirects the user to the page for the new workflow.
12. **Show Alert for Missing Name**: If the workflow name was not provided, show an alert to the user and return to the modal.
13. **Fill Information on New Page**: Populate the new workflow page with the received workflow information.
14. **End**: The process ends.


## Flow within selected types of nodes and display information about each node
![](./images/node_worflow.svg)

###### Notes:

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
    echo "VAULT_URI=${{ secrets.VAULT_URI }}" >> .env
    echo "VAULT_REST_URL=${{ secrets.VAULT_REST_URL }}" >> .env
    echo "VAULT_REST_TOKEN=${{ secrets.VAULT_REST_TOKEN }}" >> .env
    echo "VAULT_KEY_FRONTEND_ENVS=${{ secrets.VAULT_KEY_FRONTEND_ENVS }}" >> .env
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
