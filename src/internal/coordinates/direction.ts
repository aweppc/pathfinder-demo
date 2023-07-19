import { Coordinates, Direction } from './types'

export const DIRECTION_DISTANCES = {
    NONE: [0, 0] as Coordinates,
    UP: [0, -1] as Coordinates,
    UP_LEFT: [1, -1] as Coordinates,
    LEFT: [1, 0] as Coordinates,
    DOWN_LEFT: [1, 1] as Coordinates,
    DOWN: [0, 1] as Coordinates,
    DOWN_RIGHT: [-1, 1] as Coordinates,
    RIGHT: [-1, 0] as Coordinates,
    UP_RIGHT: [-1, -1] as Coordinates,
};

export const ADJACENT_DIRECTIONS = [
    'UP',
    'UP_LEFT',
    'LEFT',
    'DOWN_LEFT',
    'DOWN',
    'DOWN_RIGHT',
    'RIGHT',
    'UP_RIGHT',
] satisfies Direction[];

export const CARDINAL_DIRECTIONS = [
    'UP',
    'LEFT',
    'DOWN',
    'RIGHT',
] satisfies Direction[];

export const DIAGONAL_DIRECTIONS = [
    'UP_LEFT',
    'DOWN_LEFT',
    'DOWN_RIGHT',
    'UP_RIGHT',
] satisfies Direction[];
