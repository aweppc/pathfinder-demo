import { Predicate } from '../types';
import { ADJACENT_DIRECTIONS, CARDINAL_DIRECTIONS, DIAGONAL_DIRECTIONS, DIRECTION_DISTANCES, distancesAreEqual } from './direction';
import { AdjacencyType, Direction } from './types';

export class Coordinates {
    static create(x: number, y: number) {
        return new Coordinates(x, y);
    }

    private constructor(private _x: number, private _y: number) {}

    get x() {
        return this._x;
    }

    get y() {
        return this._y;
    }

    getDifferenceTo = (other: Coordinates): [number, number] => {
        return [other._x - this._x, other._y - this._y];
    }

    getDistanceTo = (other: Coordinates): [number, number] => {
        const [x, y] = this.getDifferenceTo(other);
        return [Math.abs(x), Math.abs(y)]
    }

    isDiagonalTo = (other: Coordinates) => {
        const distance = this.getDifferenceTo(other);
        return !!DIAGONAL_DIRECTIONS
            .find((direction) => distancesAreEqual(DIRECTION_DISTANCES[direction], distance));
    }

    isCardinalTo = (other: Coordinates) => {
        const distance = this.getDifferenceTo(other);
        return !!CARDINAL_DIRECTIONS
            .find((direction) => distancesAreEqual(DIRECTION_DISTANCES[direction], distance));
    }

    getAdjacencyTypeFor = (other: Coordinates): AdjacencyType => {
        switch (true) {
            case this.isCardinalTo(other):
                return 'cardinal';
            case this.isDiagonalTo(other):
                return 'diagonal';
            default:
                return 'not adjacent';
        }
    }

    getAdjacent = (direction: Direction) => {
        const [x, y] = DIRECTION_DISTANCES[direction];
        return new Coordinates(this._x + x, this._y + y);
    }

    getAllAdjacent = (predicate?: Predicate<Coordinates>) => {
        let result: Coordinates[] = [];
        for (let i = 0; i < ADJACENT_DIRECTIONS.length; i++) {
            const coordinate = this.getAdjacent(ADJACENT_DIRECTIONS[i]);
            if (!predicate || predicate(coordinate)) {
                result.push(coordinate);
            }
        }
        return result;
    }

    // линейная интерполяция
    lerpTo = (other: Coordinates, factor: number) => {
        return new Coordinates(
            this._x + (other._x - this._x) * factor,
            this._y + (other._y - this._y) * factor
        );
    }

    shift = (x: number, y: number) => {
        return new Coordinates(
            this._x + x,
            this._y + y
        );
    }

    equals(other: Coordinates) {
        return this._x === other._x && this._y === other._y;
    }

    toString() {
        return `[${this._x}:${this._y}]`;
    }
}