
const BASE_URL: string = "http://localhost:8032";

enum Code {
  OK = 0,
  Canceled = 1,
  Unknown = 2,
  InvalidArgument = 3,
  DeadlineExceeded = 4,
  NotFound = 5,
  AlreadyExists = 6,
  PermissionDenied = 7,
  ResourceExhausted = 8,
  FailedPrecondition = 9,
  Aborted = 10,
  OutOfRange = 11,
  Unimplemented = 12,
  Internal = 13,
  Unavailable = 14,
  DataLoss = 15,
  Unauthenticated = 16,
  _maxCode = 17
}

const strToCode = new Map<string, Code>([
  ["OK", Code.OK],
  ["CANCELLED", Code.Canceled],
  ["UNKNOWN", Code.Unknown],
  ["INVALID_ARGUMENT", Code.InvalidArgument],
  ["DEADLINE_EXCEEDED", Code.DeadlineExceeded],
  ["NOT_FOUND", Code.NotFound],
  ["ALREADY_EXISTS", Code.AlreadyExists],
  ["PERMISSION_DENIED", Code.PermissionDenied],
  ["RESOURCE_EXHAUSTED", Code.ResourceExhausted],
  ["FAILED_PRECONDITION", Code.FailedPrecondition],
  ["ABORTED", Code.Aborted],
  ["OUT_OF_RANGE", Code.OutOfRange],
  ["UNIMPLEMENTED", Code.Unimplemented],
  ["INTERNAL", Code.Internal],
  ["UNAVAILABLE", Code.Unavailable],
  ["DATA_LOSS", Code.DataLoss],
  ["UNAUTHENTICATED", Code.Unauthenticated]
]);

function getCodeString(code: Code): string | Error {
  const entry = Array.from(strToCode.entries()).find(([_, value]) => value === code);
  if (entry) {
    return entry[0];
  } else {
    return new Error("Invalid code");
  }
}

export class HttpClient {
  private readonly baseUrl: string;
  private headers: HeadersInit = {};
  private readonly timeout: number;
  private params: any = {};

  constructor(baseUrl: string = BASE_URL, timeout: number = 5000) {
    this.baseUrl = baseUrl;
    this.timeout = timeout;
  }

  setHeaders(headers: HeadersInit) {
    this.headers = headers;
  }

  setHeaderToken(token:string) {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`)
    this.headers = myHeaders
  }

  setParams(params: any) {
    this.params = params;
  }

  private async fetch(method: string, endpoint: string, body?: any, headers?: HeadersInit) {
    const url = new URL(this.baseUrl + endpoint);
    Object.keys(this.params).forEach(key => url.searchParams.append(key, this.params[key]));

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), this.timeout);

    const response = await fetch(url.toString(), {
      method,
      headers: headers || this.headers,
      body: JSON.stringify(body),
      signal: controller.signal
    });

    clearTimeout(id);

    if (!response.ok) {
      const res = await response.json();
      try {
        const codeString = getCodeString(res.code);
        alert(`${codeString}: ${res.message}`);
        return
      } catch (error) {
        throw new Error(`HttpClient error: ${response.statusText}`);
      }
    }

    return await response.json();
  }

  get(endpoint: string, headers?: HeadersInit) {
    return this.fetch('GET', endpoint, undefined, headers);
  }

  post(endpoint: string, body: any, headers?: HeadersInit) {
    return this.fetch('POST', endpoint, body, headers);
  }

  put(endpoint: string, body: any, headers?: HeadersInit) {
    return this.fetch('PUT', endpoint, body, headers);
  }

  patch(endpoint: string, body: any, headers?: HeadersInit) {
    return this.fetch('PATCH', endpoint, body, headers);
  }

  delete(endpoint: string, body: any, headers?: HeadersInit) {
    return this.fetch('DELETE', endpoint, undefined, headers);
  }
}