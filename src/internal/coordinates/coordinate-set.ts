import { Coordinates } from '.';

export class CoordinateSet<T> {
    private coordinates: { [key: number]: { [key: number]: T; }; } = {};

    constructor() {
        this.set = this.set.bind(this);
        this.get = this.get.bind(this);
    };

    set(coordinates: Coordinates, attributes: T) {
        if (!this.coordinates[coordinates.x]) {
            this.coordinates[coordinates.x] = {};
        }
        this.coordinates[coordinates.x][coordinates.y] = attributes;
        return this;
    }

    get(coordinates: Coordinates) {
        return this.coordinates[coordinates.x]?.[coordinates.y] ?? null;
    }

    clamp(width: number, height: number) {
        Object.keys(this.coordinates)
            .filter((x) => Number(x) >= width)
            .forEach((x) => {
                delete this.coordinates[Number(x)];
            });
        Object.keys(this.coordinates).forEach((x) => {
            Object.keys(this.coordinates[Number(x)])
                .filter((y) => Number(y) >= height)
                .forEach((y) => {
                    delete this.coordinates[Number(x)][Number(y)];
                });
        });
    }

    getAll() {
        type Result = {
            coordinates: Coordinates;
            value: T;
        };
        const results: Result[] = [];
        const xKeys = Object.keys(this.coordinates);
        for (let i = 0; i < xKeys.length; i++) {
            const x = Number(xKeys[i]);
            const values = this.coordinates[x];
            const yKeys = Object.keys(values);
            for (let j = 0; j < yKeys.length; j++) {
                const y = Number(yKeys[j]);
                results.push({
                    coordinates: Coordinates.create(x, y),
                    value: values[y]
                })
            }
        }
        return results;
    }
}