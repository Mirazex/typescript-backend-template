export default class Singleton {
    private static _instance: Singleton;

    public static getInstance<T extends typeof Singleton>(this: T, ...args: ConstructorParameters<typeof this>): InstanceType<T> {
        if (!this._instance) {
            this._instance = new this(...args);
        }

        return this._instance as InstanceType<T>;
    }

    constructor(..._args: unknown[]) {}
}
