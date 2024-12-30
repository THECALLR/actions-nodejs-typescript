# actions-nodejs-typescript

## Table Of Contents

- [Pre-requisites](#pre-requisites)
- [Installation](#installation)
- [Usage](#usage)
  - [List your current numbers](#list-your-current-numbers)
  - [List your scenarios](#list-your-scenarios)
  - [Delete a scenario](#delete-a-scenario)
  - [Remove a phone number from your account](#remove-a-phone-number-from-your-account)
  - [Create a new scenario (call forwarding with recording enabled)](#create-a-new-scenario-call-forwarding-with-recording-enabled)
  - [Buy a new phone number](#buy-a-new-phone-number)
  - [Attach the new number to the previously created scenario](#attach-the-new-number-to-the-previously-created-scenario)

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

### Create a new scenario (call forwarding with recording enabled)

This will create a new Actions scenario that forwards calls to a target phone number,
specified as a command line argument. The "template" scenario is available in
`src/scenarios/forwarding-record.yaml`.

```shell
# npm run create-scenario-target [phone-target]
npm run create-scenario-target +1234567890
```

This will output the scenario ID:

```
> actions-nodejs-typescript@1.0.0 build
> rm -fr dist/* && tsc


> actions-nodejs-typescript@1.0.0 create-scenario-target
> node dist/create-scenario-target.js +1234567890

┌─────────┬────────────┬──────────────────────────────────┬───────────────────────┐
│ (index) │ id         │ name                             │ created               │
├─────────┼────────────┼──────────────────────────────────┼───────────────────────┤
│ 0       │ '3TXTPS65' │ 'Call Forwarding to +1234567890' │ '2024-12-30 15:24:22' │
└─────────┴────────────┴──────────────────────────────────┴───────────────────────┘
```

Take note of the scenario ID, it will be required later.

### Buy a new phone number

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

### Attach the new number to the previously created scenario

```shell
# npm run attach-number-to-scenario [number-id] [scenario-id]
npm run attach-number-to-scenario LXLGRVDT 3TXTPS65
                                  ^^^^^^^^ ^^^^^^^^
                                   number  scenario
```

Now, you may call the new number, and it will forward the call to the target phone number. You can
access the Actions logs from the Callr dashboard: https://app.callr.com/logs/actions.
