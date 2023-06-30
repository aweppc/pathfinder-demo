import { CoordinateSet } from '../coordinates/coordinate-set';
import { Coordinates } from '../coordinates';
import { Predicate } from '../types';
import { composePredicates } from '../utils';
import { TileDetails } from './types';

export class Map {
    private details: CoordinateSet<TileDetails> = new CoordinateSet();

    constructor(private width: number, private height: number) {}

    getHeight = () => {
        return this.height;
    }

    getWidth = () => {
        return this.width;
    }

    clamp = (width: number, height: number) => {
        this.width = width;
        this.height = height;
        this.details.clamp(width, height);
    }

    isWall = (coordinates: Coordinates): boolean => {
        return !!this.details.get(coordinates)?.blocksPathfinding;
    }

    clearWall = (x: number, y: number) => {
        const coordinates = Coordinates.create(x, y);
        const current = this.details.get(coordinates);
        this.details.set(coordinates, { ...current, blocksPathfinding: false });
    }

    toggleWall = (x: number, y: number) => {
        const coordinates = Coordinates.create(x, y);
        const current = this.details.get(coordinates);
        this.details.set(coordinates, { ...current, blocksPathfinding: !current?.blocksPathfinding });
        return !current?.blocksPathfinding;
    }

    getWalls = () => {
        return this.details.getAll()
            .filter(({ value: { blocksPathfinding }}) => blocksPathfinding)
            .map(({ coordinates: { x, y } }) => ({ x, y }));
    }

    private isInBounds = (coordinates: Coordinates): boolean => {
        const { x, y } = coordinates;
        const xInBounds = x >= 0 && x < this.width;
        const yInBounds = y >= 0 && y < this.height;
        return xInBounds && yInBounds;
    }

    getAdjacentCoordinates = (
        coordinates: Coordinates,
        predicate?: Predicate<Coordinates>
    ) => {
        const finalPredicate = composePredicates(this.isInBounds, predicate)
        return coordinates.getAllAdjacent(finalPredicate);
    }
}