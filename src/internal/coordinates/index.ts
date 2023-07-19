import { Predicate } from '../types';
import { ADJACENT_DIRECTIONS, CARDINAL_DIRECTIONS, DIAGONAL_DIRECTIONS, DIRECTION_DISTANCES } from './direction';
import { AdjacencyType, Coordinates, Direction } from './types';

export type { Coordinates } from './types';

const equals = (a: Coordinates, b: Coordinates) => {
    const [ax, ay] = a;
    const [bx, by] = b;
    return ax === bx && ay === by;
};

const getDifference = (from: Coordinates, to: Coordinates): Coordinates => {
    const [fromX, fromY] = from;
    const [toX, toY] = to;
    return [toX - fromX, toY - fromY];
};

const getDistance = (from: Coordinates, to: Coordinates): Coordinates => {
    const [x, y] = getDifference(from, to);
    return [Math.abs(x), Math.abs(y)]
};

const isDiagonal = (from: Coordinates, to: Coordinates) => {
    const distance = getDifference(from, to);
    return !!DIAGONAL_DIRECTIONS
        .find((direction) => equals(DIRECTION_DISTANCES[direction], distance));
};

const isCardinal = (from: Coordinates, to: Coordinates) => {
    const distance = getDifference(from, to);
    return !!CARDINAL_DIRECTIONS
        .find((direction) => equals(DIRECTION_DISTANCES[direction], distance));
};

const getDirection = (from: Coordinates, to: Coordinates): Direction | null => {
    const distance = getDifference(from, to);
    return ADJACENT_DIRECTIONS
        .find((direction) => equals(DIRECTION_DISTANCES[direction], distance))
        ?? null;
};

const getAdjacencyType = (from: Coordinates, to: Coordinates): AdjacencyType => {
    switch (true) {
        case isCardinal(from, to):
            return 'cardinal';
        case isDiagonal(from, to):
            return 'diagonal';
        default:
            return 'not adjacent';
    }
};

const getAdjacent = (from: Coordinates, direction: Direction): Coordinates => {
    const [diffX, diffY] = DIRECTION_DISTANCES[direction];
    const [fromX, fromY] = from;
    return [fromX + diffX, fromY + diffY];
};

const getAllAdjacent = (from: Coordinates, predicate?: Predicate<Coordinates>): Coordinates[] => {
    let result: Coordinates[] = [];
    for (let i = 0; i < ADJACENT_DIRECTIONS.length; i++) {
        const coordinates = getAdjacent(from, ADJACENT_DIRECTIONS[i]);
        if (!predicate || predicate(...coordinates)) {
            result.push(coordinates);
        }
    }
    return result;
};

// линейная интерполяция
const lerp = (from: Coordinates, to: Coordinates, factor: number): Coordinates => {
    const [fromX, fromY] = from;
    const [toX, toY] = to;
    return [fromX + (toX - fromX) * factor, fromY + (toY - fromY) * factor];
};

const shift = (from: Coordinates, x: number, y: number): Coordinates => {
    const [fromX, fromY] = from;
    return [fromX + x, fromY + y];
};

const toString = (coords: Coordinates) => {
    const [x, y] = coords;
    return `[${x}:${y}]`;
};

export const coordinateUtils = {
    equals,
    getDifference,
    getDistance,
    isDiagonal,
    isCardinal,
    getDirection,
    getAdjacencyType,
    getAdjacent,
    getAllAdjacent,
    lerp,
    shift,
    toString,
};
