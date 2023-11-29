import { SystemProperties } from './models/interfaces'

export default class SystemItem implements SystemProperties {
    constructor(
        public id: number,
        public name: string,
        public coverage: number
    ) {
        this.id = id
        this.name = name
        this.coverage = coverage
    }
}

