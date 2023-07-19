import { Coordinates } from './coordinates';

export class CoordinateSet<T> {
    private internalSet: { [key: number]: { [key: number]: T; }; } = {};

    constructor() {
        this.set = this.set.bind(this);
        this.get = this.get.bind(this);
    };

    set(x: number, y: number, attributes: T) {
        if (!this.internalSet[x]) {
            this.internalSet[x] = {};
        }
        this.internalSet[x][y] = attributes;
        return this;
    }

    get(x: number, y: number) {
        return this.internalSet[x]?.[y] ?? null;
    }

    clamp(width: number, height: number) {
        Object.keys(this.internalSet)
            .filter((x) => Number(x) >= width)
            .forEach((x) => {
                delete this.internalSet[Number(x)];
            });
        Object.keys(this.internalSet).forEach((x) => {
            Object.keys(this.internalSet[Number(x)])
                .filter((y) => Number(y) >= height)
                .forEach((y) => {
                    delete this.internalSet[Number(x)][Number(y)];
                });
        });
    }

    getAll() {
        type Result = {
            coordinates: Coordinates;
            value: T;
        };
        const results: Result[] = [];
        const xKeys = Object.keys(this.internalSet);
        for (let i = 0; i < xKeys.length; i++) {
            const x = Number(xKeys[i]);
            const values = this.internalSet[x];
            const yKeys = Object.keys(values);
            for (let j = 0; j < yKeys.length; j++) {
                const y = Number(yKeys[j]);
                results.push({
                    coordinates: [x, y],
                    value: values[y]
                })
            }
        }
        return results;
    }

    size() {
        return Object.keys(this.internalSet).reduce((result, key) =>
            result + Object.keys(this.internalSet[Number(key)]).length,
            0
        );
    }
}