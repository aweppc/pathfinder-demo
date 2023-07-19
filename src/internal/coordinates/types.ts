import type { DIRECTION_DISTANCES } from './direction';

export type Direction = keyof typeof DIRECTION_DISTANCES;

export type AdjacencyType = 'cardinal' | 'diagonal' | 'not adjacent';

export type Coordinates = [number, number];