import { Request as ExpressRequest } from 'express';
import * as http from "http";
import { get } from 'radash';

export class Request {
    public _body: Record<string, any> = {};
    public _query: Record<string, any> = {};
    public readonly _params: Record<string, any> = {};
    public readonly cookies: Record<string, string>;
    private readonly _headers: http.IncomingHttpHeaders;

    constructor(request: ExpressRequest) {
        this._body = request.body;
        this._query = request.query;
        this._params = request.params;
        this.cookies = request.cookies;
        this._headers = request.headers;
    }

    /**
     * Returns reference to the merged copy of request body
     * and query string
     */
    public all(): Record<string, any> {
        return { ...this._body, ...this._query };
    }

    /**
     * Returns value for a given key from the request body or query string.
     * The `defaultValue` is used when original value is `undefined`.
     */
    public input(key?: string, defaultValue?: any): any {
        if (!key) return this._body;
        return get(this._body, key, defaultValue || null);
    }

    public qs(key?: string) {
        if (!key) return this._query;
        return get(this._query, key, null);
    }

    public params() {
        return this._params;
    }
    
    public param(key: string, defaultValue?: any) {
        return get(this._params, key, defaultValue || null);
    }
    
    public headers() {
        return this._headers
    }
    
    public header(key: string, defaultValue?: any): string | undefined {
        key = key.toLowerCase()
        const headers = this.headers()
        
        switch (key) {
            case 'referer':
            case 'referrer':
                return headers.referrer || headers.referer || defaultValue
            default:
                return headers[key] || defaultValue
        }
    }
}
