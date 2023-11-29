enum ConverMethod {
    GET = 'get',
    POST = 'post',
    PUT = 'put',
}
export default class BunServe {
    static instance: BunServe

    constructor() {}

    static get getInstance(): BunServe {
        if (!BunServe.instance) {
            BunServe.instance = new BunServe()
        }

        return BunServe.instance
    }

    handleRequest(method: ConverMethod, callback: Function): void {
        const methodHandlers: {
            [key in ConverMethod]: (callback: Function) => void
        } = {
            [ConverMethod.GET]: (callback) => callback(),
            [ConverMethod.POST]: (callback) => callback(),
            [ConverMethod.PUT]: (callback) => callback(),
        }
        return methodHandlers[method](callback)
    }

    get(callback: Function): void {
        return this.handleRequest(ConverMethod.GET, callback)
    }

    post(callback: Function) {
        return this.handleRequest(ConverMethod.POST, callback)
    }

    put(callback: Function) {
        return this.handleRequest(ConverMethod.PUT, callback)
    }
}
