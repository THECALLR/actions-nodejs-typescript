const apiUrl = "https://api.callr.com/json-rpc/v1.1/";
const authTypeApiKey = "Api-Key";
const delayBetweenRequests = 1000; // ms
const defaultHeaders = {
  "Content-Type": "application/json-rpc",
};

let bucket: number[] = [];
let counter = 42;

export class ApiException extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ApiException";
  }
}

export class ApiHttpException extends Error {
  code: number;

  constructor(message: string, code: number) {
    super(message);
    this.code = code;
    this.name = "ApiHttpException";
  }
}

export interface App {
  hash: string;
  name: string;
  p: {
    format: string;
    script: string;
  };
  did: Number[];
  package: {
    name: string;
    type: string;
    has_did: boolean;
  };
  date_creation: string;
  date_update: string;
}

export interface SearchResult<T> {
  hits: T[];
  total: number;
  offset: number;
  has_more: boolean;
}

export interface Number {
  hash: string;
  class: string;
  type: string;
  local_number: string;
  local_number_f: string;
  intl_number: string;
  country_code: string;
  third_party: {
    who: {
      hash: string;
      name: string;
      country: string;
      type: string;
    };
    compliance: {
      is_compliant: boolean;
      compliance_status: string;
    };
    itemCompliance: boolean;
    state: {
      category: string;
      required_documents: any[];
      third_party_documents: any[];
      required_countries: any[];
      third_party_country: string;
    };
    blocking: {
      is_blocked: boolean;
      blocked_at: string;
      remaining_days: number;
    };
  };
  contract_auto_renew: boolean;
  assigned_at: string;
  is_used: boolean;
  date_end_contract: string;
  compliance: {
    state: string;
    switch_at: string;
    switch_remaining_days: number;
  };
  not_compliant_after: string;
  is_compliant: boolean;
  pricing: {
    nrc: number;
    mrc: number;
    minute: string;
    setup: string;
    increment: number;
    min_duration: number;
  };
  app: {
    hash: string;
    name: string;
    package: {
      name: string;
      type: string;
    };
  };
}

interface NumberCost {
  amount_unit: string;
  quantity: number;
  quantity_paying: number;
  discount_percent: number;
  first_month_remaining_days: number;
  amount_assignment: string;
  amount_first_month: string;
  amount_per_month: string;
  amount_prepaid_debit: string;
}

interface NumberContract {
  billing_mode: string;
  duration_month: number;
  end_date: string;
}

export interface StoreReservation {
  token: string;
  expire: string;
  items: [
    {
      hash: string;
      intl_number: string;
      local_number: string;
    }
  ];
  cost: NumberCost;
  contract: NumberContract;
}

export interface StoreOrder {
  success: [
    {
      hash: string;
      intl_number: string;
      local_number: string;
    }
  ];
  cost: NumberCost;
  contract: NumberContract;
  customer_debit: string;
}

class JsonRpcRequest {
  jsonrpc: string;
  method: string;
  params: unknown[];
  id: number;

  constructor(method: string, params: unknown[], id: number) {
    this.jsonrpc = "2.0";
    this.method = method;
    this.params = params;
    this.id = id;
  }

  json(): string {
    return JSON.stringify(this);
  }
}

interface JsonRpcResponse<T> {
  id: number;
  jsonrpc: string;
  result?: T;
  error?: {
    code: number;
    message: string;
  };
}

export async function Request<T>(
  method: string,
  params: unknown[] = [],
  apiKey: string
): Promise<T> {
  const id = counter++;

  let runAtMs = Date.now();

  if (bucket.length > 0) {
    runAtMs = bucket[0] + delayBetweenRequests;
  }

  // indicate when we will run
  bucket.unshift(runAtMs);

  try {
    const sleep = new Promise<void>((resolve) => {
      const wait = runAtMs - Date.now();

      if (wait > 0) {
        setTimeout(resolve, wait);
      } else {
        resolve();
      }
    });

    // sleeps
    await sleep;

    const headers: Record<string, string> = {
      ...defaultHeaders,
      ...{
        Authorization: `${authTypeApiKey} ${apiKey}`,
      },
    };

    const requestOptions = {
      method: "POST",
      headers,
      body: new JsonRpcRequest(method, params, id).json(),
    };

    let response: Response;
    try {
      response = await fetch(apiUrl, requestOptions);
    } catch (e) {
      throw new ApiHttpException((e as Error).message, 0);
    }

    let responseBody: JsonRpcResponse<T> | null = null;
    try {
      responseBody = (await response.json()) as JsonRpcResponse<T>;
    } catch (_) {
      //
    }

    if (response.status !== 200) {
      throw new ApiHttpException(
        responseBody?.error?.message ??
          `${response.status} ${response.statusText}`,
        response.status
      );
    }
    if (responseBody?.error?.message) {
      throw new ApiException(responseBody.error.message);
    }
    if (responseBody instanceof Object === false) {
      throw new ApiHttpException(
        `${response.status} ${response.statusText}`,
        500
      );
    }
    if (!responseBody?.result) {
      throw new ApiHttpException(
        "Invalid response from API, please try again later.",
        500
      );
    }

    return responseBody.result;
  } finally {
    // remove me!
    bucket = bucket.filter((v) => v !== runAtMs);
  }
}

export default class Api {
  apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  Request<T>(method: string, params: unknown[] = []): Promise<T> {
    return Request(method, params, this.apiKey);
  }
}
