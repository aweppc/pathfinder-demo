import { PathNode } from './types';
import { Map } from '../../map';
import { Coordinates, coordinateUtils } from '../../coordinates';
import { ScoreFirstList } from '../../score-first-list';
import { not } from '../../utils';
import { AdjacencyType } from '../../coordinates/types';
import { CoordinateSet } from '../../coordinate-set';

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

const heuristic = (start: Coordinates, end: Coordinates) => {
    const [x, y] = coordinateUtils.getDistance(end, start);
    const diagTraverse = Math.min(x, y);
    const cardinalTraverse = Math.max(x - diagTraverse, y - diagTraverse);
    return diagTraverse * WEIGHTS.DIAGONAL + cardinalTraverse * WEIGHTS.CARDINAL;
}

class PathNodeList extends ScoreFirstList<PathNode> {
    protected getScore(value: PathNode): number {
        return value.transitionWeight + value.heuristicWeight;
    }
    protected getId(value: PathNode): string {
        const [x, y] = value.coordinates;
        return `x:${x}|y:${y}`;
    }
}

export const findPath = (start: Coordinates, end: Coordinates, map: Map) => {
    const unprocessedNodes = new PathNodeList();
    // создаём корневой узел для поиска
    const rootNode: PathNode = {
        coordinates: start,
        transitionWeight: 0,
        heuristicWeight: heuristic(start, end),
        parentCoordinates: null,
    };
    unprocessedNodes.add(rootNode);
    // создаём структуру для хранения уже обработанной информации
    const traversedNodes = new CoordinateSet<PathNode>();

    const getParent = (node: PathNode) => {
        if (!node.parentCoordinates) {
            return null;
        }
        const parent = traversedNodes.get(...node.parentCoordinates);
        if (!parent) {
            return null;
        }
        return parent;
    }

    // ищем, пока есть где искать
    while (unprocessedNodes.hasNext()) {
        const parentNode = unprocessedNodes.pop();
        if (!parentNode) {
            break;
        }
        const adjacentCoordinates = map.getAdjacentCoordinates(
            parentNode.coordinates,
            not(map.isWall)
        );
        for (let i = 0; i < adjacentCoordinates.length; i++) {
            const coordinates = adjacentCoordinates[i];
            if (coordinateUtils.equals(coordinates, end)) {
                const path: [Coordinates, Coordinates][] = [];
                let lastCoords: Coordinates = end;
                let current: PathNode | null = parentNode;
                while (current) {
                    const currentCoords: Coordinates = current.coordinates;
                    path.unshift([currentCoords, lastCoords]);
                    lastCoords = currentCoords;
                    current = getParent(current);
                }
                return { path, traversedNodes };
            }
            const adjacencyType = coordinateUtils
                .getAdjacencyType(coordinates, parentNode.coordinates);
            const addedWeight = getWeightForAdjacencyType(adjacencyType);
            const nextNode: PathNode = {
                coordinates,
                transitionWeight: parentNode.transitionWeight + addedWeight,
                heuristicWeight: heuristic(coordinates, end),
                parentCoordinates: parentNode.coordinates
            };
            const existingNode = traversedNodes.get(...nextNode.coordinates);
            // если эту ноду не обследовали, то добавляем в очередь
            if (!existingNode) {
                unprocessedNodes.add(nextNode);
            // если эту ноду обследовали, но найденный путь короче, то перезаписываем
            } else if (existingNode.transitionWeight > nextNode.transitionWeight) {
                traversedNodes.set(...nextNode.coordinates, nextNode);
            }
        }
        traversedNodes.set(...parentNode.coordinates, parentNode);
    }
    return { path: null, traversedNodes };
};
