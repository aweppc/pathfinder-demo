import { CoordinateSet } from '../coordinate-set';
import { coordinateUtils } from '../coordinates';
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

    isWall = (x: number, y: number): boolean => {
        return !!this.details.get(x, y)?.blocksPathfinding;
    }

    clearWall = (x: number, y: number) => {
        const current = this.details.get(x, y);
        this.details.set(x, y, { ...current, blocksPathfinding: false });
    }

    toggleWall = (x: number, y: number) => {
        const current = this.details.get(x, y);
        this.details.set(x, y, { ...current, blocksPathfinding: !current?.blocksPathfinding });
        return !current?.blocksPathfinding;
    }

    getWalls = () => {
        return this.details.getAll()
            .filter(({ value: { blocksPathfinding }}) => blocksPathfinding)
            .map(({ coordinates }) => coordinates);
    }

    isInBounds = (x: number, y: number): boolean => {
        const xInBounds = x >= 0 && x < this.width;
        const yInBounds = y >= 0 && y < this.height;
        return xInBounds && yInBounds;
    }

    getAdjacentCoordinates = (
        from: [number, number],
        predicate?: Predicate<[number, number]>
    ) => {
        const finalPredicate = composePredicates(this.isInBounds, predicate)
        return coordinateUtils.getAllAdjacent(from, finalPredicate);
    }
}