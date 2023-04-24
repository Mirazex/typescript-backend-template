import ApplicationError from '@/core/ApplicationError';

export default class Env {
    private static _cache = new Map();

    static get(key: string) {
        if (this._cache.has(key)) {
            return this._cache.get(key);
        }

        const env = process.env[key];
        if (env) {
            this._cache.set(key, env);
            return this._cache.get(key);
        }

        throw ApplicationError.EnvironmentNotFound(key);
    }
}
