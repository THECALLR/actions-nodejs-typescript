# actions-nodejs-typescript

This project allows you to create and manage Callr Actions scenarios using Node.js and TypeScript.

Actions are a powerful feature of the Callr API that allow you to create complex call flows.

In this example, we create a scenario that forwards calls to a target phone number, and records the call.
We receive the call metadata (CDR) and data (audio recording + insights) via an ngrok tunnel.


## Table Of Contents

- [Pre-requisites](#pre-requisites)
- [Installation](#installation)
- [Usage](#usage)
  - [Run ngrok locally](#run-ngrok-locally)
  - [Create a new scenario (call forwarding with recording enabled)](#create-a-new-scenario-call-forwarding-with-recording-enabled)
  - [Buy a new phone number (production accounts only)](#buy-a-new-phone-number-production-accounts-only)
  - [Attach the new number to the previously created scenario (production accounts only)](#attach-the-new-number-to-the-previously-created-scenario-production-accounts-only)
  - [Receive call data and metadata](#receive-call-data-and-metadata)
  - [List your current numbers](#list-your-current-numbers)
  - [List your scenarios](#list-your-scenarios)
  - [Delete a scenario](#delete-a-scenario)
  - [Remove a phone number from your account](#remove-a-phone-number-from-your-account)

## Pre-requisites

- Node.js 22.X
- A Callr account
- A Callr API key

## Installation

Please create an `.env` file with the following content:

```
CALLR_API_KEY=your-callr-api-key
```

You may create API keys from https://app.callr.com/api/keys.

Then run:

```shell
npm install
npm run build
npm run ping
```

It should output something like this:

```shell
$ npm run build && npm run ping

> actions-nodejs-typescript@1.0.0 build
> tsc


> actions-nodejs-typescript@1.0.0 ping
> node dist/ping.js

PING OK, timestamp: 1735562976
```

## Usage

### Run ngrok locally

We will use [ngrok](https://download.ngrok.com/) to create a tunnel to our local server, so that Callr can send us the call data.

```shell
ngrok http 3030
```

Note the ngrok "forwarding" URL, you will need it in the next step.

### Create a new scenario (call forwarding with recording enabled)

This will create a new Actions scenario that:
- forwards calls to a target phone number
- records the call
- sends the call data to the ngrok URL

The "template" scenario is available in `src/scenarios/forwarding-record.yaml`.

```shell
# npm run create-scenario-target [phone-target] [url]
npm run create-scenario-target +1234567890 https://0296-92-169-244-111.ngrok-free.app 
```

This will output the scenario ID:

```
> actions-nodejs-typescript@1.0.0 build
> rm -fr dist/* && tsc


> actions-nodejs-typescript@1.0.0 create-scenario-target
> node dist/create-scenario-target.js +1234567890 https://0296-92-169-244-111.ngrok-free.app 

┌─────────┬────────────┬──────────────────────────────────┬───────────────────────┐
│ (index) │ id         │ name                             │ created               │
├─────────┼────────────┼──────────────────────────────────┼───────────────────────┤
│ 0       │ '3TXTPS65' │ 'Call Forwarding to +1234567890' │ '2024-12-30 15:24:22' │
└─────────┴────────────┴──────────────────────────────────┴───────────────────────┘
```

Take note of the scenario ID, it will be required later.

**IMPORTANT**: For customers in BUILD MODE, you need to approve the target phone number as a 
"testing number". You can do this from the Callr dashboard: https://app.callr.com/numbers/testing-numbers.

### Buy a new phone number (production accounts only)

```shell
npm run buy-number [area-code-id]
```

You may use the API method `did/areacode.get_list` to get the area code IDs.

This will buy a French +331 phone number:

```shell
npm run buy-number 1

> actions-nodejs-typescript@1.0.0 build
> rm -fr dist/* && tsc


> actions-nodejs-typescript@1.0.0 buy-number
> node dist/buy-number.js 1

┌─────────┬────────────────────────────────────────────┬────────────┬────────────────┐
│ (index) │ token                                      │ id         │ number         │
├─────────┼────────────────────────────────────────────┼────────────┼────────────────┤
│ 0       │ '1DRXUfFGXfHiriY0hWBmsq6QKMk8mwmahNQOyYqM' │ 'LXLGRVDT' │ '+33186611221' │
└─────────┴────────────────────────────────────────────┴────────────┴────────────────┘

You may now run attach-number-to-scenario.js
```

If you get the following error: `ApiException: TRIAL_MODE`, it means you are in BUILD MODE and 
cannot purchase phone numbers. In this case, you may use the Callr dashboard to request a temporary
number for testing purposes: https://api.callr.com/actions.

### Attach the new number to the previously created scenario (production accounts only)

```shell
# npm run attach-number-to-scenario [number-id] [scenario-id]
npm run attach-number-to-scenario LXLGRVDT 3TXTPS65
                                  ^^^^^^^^ ^^^^^^^^
                                   number  scenario
```

Now, you may call the new number, and it will forward the call to the target phone number. You can
access the Actions logs from the Callr dashboard: https://app.callr.com/logs/actions.

### Receive call data and metadata

Run the local server:

```shell
npm run server-receive-data
```

Should output:
```
> actions-nodejs-typescript@1.0.0 build
> rm -fr dist/* && tsc


> actions-nodejs-typescript@1.0.0 server-receive-data
> node dist/server-receive-data.js

Example app listening on port 3030
```

Open the ngrok tunnel overview: http://localhost:4040.

Now, you may call the phone number purchased in the previous step, or the temporary number if you are in BUILD MODE. 
After the call ends, you will receive the call data and metadata in the local server!

You can customize the HTTP push in the scenario template: `src/scenarios/forwarding-record.yaml`.


### List your current numbers

This will list your first 50 numbers, with their assigned scenarios:

```shell
npm run list-numbers
```

### List your scenarios

```shell
npm run list-scenarios
```

### Delete a scenario

```shell
npm run delete-scenario [scenario-id]
```

### Remove a phone number from your account

```shell
npm run remove-number [number-id]
```
