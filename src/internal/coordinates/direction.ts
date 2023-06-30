import { Direction } from './types'

export const DIRECTION_DISTANCES = {
    NONE: [0, 0] as [number, number],
    UP: [0, 1] as [number, number],
    UP_LEFT: [1, 1] as [number, number],
    LEFT: [1, 0] as [number, number],
    DOWN_LEFT: [1, -1] as [number, number],
    DOWN: [0, -1] as [number, number],
    DOWN_RIGHT: [-1, -1] as [number, number],
    RIGHT: [-1, 0] as [number, number],
    UP_RIGHT: [-1, 1] as [number, number],
};

export const ADJACENT_DIRECTIONS: Direction[] = [
    'UP',
    'UP_LEFT',
    'LEFT',
    'DOWN_LEFT',
    'DOWN',
    'DOWN_RIGHT',
    'RIGHT',
    'UP_RIGHT',
];

export const CARDINAL_DIRECTIONS: Direction[] = [
    'UP',
    'LEFT',
    'DOWN',
    'RIGHT',
];

export const DIAGONAL_DIRECTIONS: Direction[] = [
    'UP_LEFT',
    'DOWN_LEFT',
    'DOWN_RIGHT',
    'UP_RIGHT',
];

export const distancesAreEqual = (d1: [number, number], d2: [number, number]) => {
    return d1[0] === d2[0] && d1[1] === d2[1];
}
