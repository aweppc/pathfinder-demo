import { Coordinates, Direction } from '../../coordinates/types';

export type VectorFieldMeta = {
    coordinates: Coordinates;
    travelWeight: number;
    direction: Direction;
};

export type VectorField = {
    findPath(from: Coordinates): [Coordinates, Coordinates][] | null;
}