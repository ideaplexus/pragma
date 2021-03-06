import { Map } from 'immutable';
const httpClient = {request: require('request')};

class Response {
  body:?string;
  headers:Map;
  status:number;
  statusText:string;
  responseTimeMs:number;

  constructor(body, headers, status, statusText, responseTimeMs) {
    this.body = body;
    this.headers = new Map(headers);
    this.status = status;
    this.statusText = statusText;
    this.responseTimeMs = responseTimeMs;
  }
}

export class Request {
  method:string;
  url:string;
  headers:Object;
  body:?string;

  constructor(method, url, headers, body) {
    this.method = method;
    this.url = url;
    this.headers = headers;
    this.body = body;
  }
}

export function execute(request:Request, callback) {
  const requestStart = performance.now();

  const sentRequest = httpClient.request({
    method: request.method,
    url: request.url,
    headers: request.headers,
    body: request.body,
    followRedirect: false
  }, (error, response) => {
    if (error) return callback(error, null);

    const requestEnd = performance.now();
    const responseTimeMs = Math.round(requestEnd - requestStart);

    callback(null, new Response(response.body, response.headers, response.statusCode, response.statusMessage, responseTimeMs));
  });

  return function cancel() {
    sentRequest.abort();
  };
}
