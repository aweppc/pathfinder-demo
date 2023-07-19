import { CoordinateSet } from '../../coordinate-set';
import { Coordinates, coordinateUtils } from '../../coordinates';
import { DIRECTION_DISTANCES } from '../../coordinates/direction';
import { AdjacencyType } from '../../coordinates/types';
import { Map } from '../../map';
import { ScoreFirstList } from '../../score-first-list';
import { Predicate } from '../../types';
import { composePredicates, not } from '../../utils';
import { VectorField, VectorFieldMeta } from './types';

const WEIGHTS = {
    CARDINAL: 1000,
    DIAGONAL: 1414,
};

const getWeightForAdjacencyType = (type: AdjacencyType) => {
    switch (type) {
        case 'cardinal':
            return WEIGHTS.CARDINAL;
        case 'diagonal':
            return WEIGHTS.DIAGONAL;
        default:
            throw new Error('Cannot get weight for non-adjacent coordinates');
    }
}

const createVectorField = (meta: CoordinateSet<VectorFieldMeta>): VectorField => {
    const findPath = (from: Coordinates): [Coordinates, Coordinates][] | null => {
        const result: [Coordinates, Coordinates][] = [];
        let lastMeta: VectorFieldMeta | null = null;
        let currentMeta = meta.get(...from);
        if (!currentMeta) {
            return null;
        }
        let iteration = 0;
        while (currentMeta.travelWeight > 0) {
            const { coordinates, direction } = currentMeta;
            const shiftValue = DIRECTION_DISTANCES[direction];
            const nextCoordinates = coordinateUtils.shift(coordinates, ...shiftValue);
            const nextMeta = meta.get(...nextCoordinates);
            if (!nextMeta) {
                return null;
            }
            lastMeta = currentMeta;
            currentMeta = nextMeta;
            result.push([lastMeta.coordinates, currentMeta.coordinates]);
            if (iteration++ > meta.size()) {
                return null;
            }
        }
        return result;
    }
    return { findPath };
};


class VectorMetaList extends ScoreFirstList<VectorFieldMeta> {
    protected getScore(value: VectorFieldMeta): number {
        return value.travelWeight;
    }
    protected getId(value: VectorFieldMeta): string {
        const [x, y] = value.coordinates;
        return `x:${x}|y:${y}`;
    }
}

export const buildVectorField = (x: number, y: number, map: Map) => {
    const vectorFieldMetaSet = new CoordinateSet<VectorFieldMeta>();
    const destinationMeta: VectorFieldMeta = {
        coordinates: [x, y],
        direction: 'NONE',
        travelWeight: 0,
    };
    vectorFieldMetaSet.set(x, y, destinationMeta);
    const hasMetadata: Predicate<Coordinates> = (x, y) => {
        return !!vectorFieldMetaSet.get(x, y);
    }
    const unporcessedNodes = new VectorMetaList();
    unporcessedNodes.add(destinationMeta);
    const nodeDiscoverPredicate = composePredicates(not(hasMetadata), not(map.isWall));
    while (unporcessedNodes.hasNext()) {
        const currentNodeMeta = unporcessedNodes.pop();
        if (!currentNodeMeta) {
            // условие while не позволяет
            throw new Error('should not happen - coordinate list exhausted');
        }
        const {
            travelWeight: currentTravelWeight,
            coordinates: currentCoordinates
        } = currentNodeMeta;
        map
            .getAdjacentCoordinates(currentCoordinates, nodeDiscoverPredicate)
            .forEach((nextCoordinates) => {
                const adjacencyType = coordinateUtils
                    .getAdjacencyType(currentCoordinates, nextCoordinates);
                const addedWeight = getWeightForAdjacencyType(adjacencyType);
                const nextNodeMeta: VectorFieldMeta = {
                    coordinates: nextCoordinates,
                    direction: 'NONE',
                    travelWeight: currentTravelWeight + addedWeight,
                };
                unporcessedNodes.add(nextNodeMeta);
                vectorFieldMetaSet.set(...nextCoordinates, nextNodeMeta);
            });
    }

    const nodeDirectionPredicate = composePredicates(hasMetadata, not(map.isWall));

    vectorFieldMetaSet.getAll().forEach(({
        coordinates,
        value: { travelWeight },
    }) => {
        if (coordinateUtils.equals(coordinates, [x, y])) {
            return;
        }
        const adjacentCoordinates = map.getAdjacentCoordinates(
            coordinates,
            nodeDirectionPredicate
        );
        let bestAvailable: Coordinates | null = null;
        let bestWeight: number | null = null;
        for (let i = 0; i < adjacentCoordinates.length; i++) {
            const candidate = adjacentCoordinates[i];
            const candidateTravelWeight = vectorFieldMetaSet
                .get(...candidate)
                ?.travelWeight;
            if (typeof candidateTravelWeight === 'undefined') {
                continue;
            }
            if (bestWeight === null || candidateTravelWeight < bestWeight) {
                bestWeight = candidateTravelWeight;
                bestAvailable = candidate;
            }
        }
        if (!bestAvailable) {
            return;
        }
        const direction = coordinateUtils.getDirection(coordinates, bestAvailable);
        if (!direction) {
            return;
        }
        vectorFieldMetaSet.set(...coordinates, { coordinates, direction, travelWeight });
    });

    return createVectorField(vectorFieldMetaSet);
}