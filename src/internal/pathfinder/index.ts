import { PathNode } from './types';
import { Map } from '../map';
import { Coordinates } from '../coordinates';
import { ScoreFirstList } from './score-first-list';
import { not } from '../utils';
import { AdjacencyType } from '../coordinates/types';
import { CoordinateSet } from '../coordinates/coordinate-set';

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
    const [x, y] = end.getDistanceTo(start);
    const diagTraverse = Math.min(x, y);
    const cardinalTraverse = Math.max(x - diagTraverse, y - diagTraverse);
    return diagTraverse * WEIGHTS.DIAGONAL + cardinalTraverse * WEIGHTS.CARDINAL;
}

class PathNodeList extends ScoreFirstList<PathNode> {
    protected getScore(value: PathNode): number {
        return value.transitionWeight + value.heuristicWeight;
    }
    protected getId(value: PathNode): string {
        return `x:${value.coordinates.x}|y:${value.coordinates.y}`;
    }
}

export const findPath = (start: [number, number], end: [number, number], map: Map) => {
    const startCoords = Coordinates.create(...start);
    const endCoords = Coordinates.create(...end);
    const nodeLinkedList = new PathNodeList();
    // создаём корневой узел для поиска
    const rootNode: PathNode = {
        coordinates: startCoords,
        transitionWeight: 0,
        heuristicWeight: heuristic(startCoords, endCoords),
        parentCoordinates: null,
    };
    nodeLinkedList.add(rootNode);
    // создаём структуру для хранения уже обработанной информации
    const traversedNodes = new CoordinateSet<PathNode>();

    const getParent = (node: PathNode) => {
        if (!node.parentCoordinates) {
            return null;
        }
        const parent = traversedNodes.get(node.parentCoordinates);
        if (!parent) {
            return null;
        }
        return parent;
    }

    // ищем, пока есть где искать
    while (nodeLinkedList.hasNext()) {
        const parentNode = nodeLinkedList.pop();
        if (!parentNode) {
            break;
        }
        const adjacentCoordinates = map.getAdjacentCoordinates(
            parentNode.coordinates,
            not(map.isWall)
        );
        for (let i = 0; i < adjacentCoordinates.length; i++) {
            const coordinates = adjacentCoordinates[i];
            if (coordinates.equals(endCoords)) {
                const path: [[number, number], [number, number]][] = [];
                let lastCoords: [number, number] = [endCoords.x, endCoords.y]
                let current: PathNode | null = parentNode;
                while (current) {
                    const currentCoords: [number, number] = [current.coordinates.x, current.coordinates.y];
                    path.unshift([currentCoords, lastCoords]);
                    lastCoords = currentCoords;
                    current = getParent(current);
                }
                return { path, traversedNodes };
            }
            const adjacencyType = coordinates
                .getAdjacencyTypeFor(parentNode.coordinates);
            const addedWeight = getWeightForAdjacencyType(adjacencyType);
            const nextNode: PathNode = {
                coordinates,
                transitionWeight: parentNode.transitionWeight + addedWeight,
                heuristicWeight: heuristic(coordinates, endCoords),
                parentCoordinates: parentNode.coordinates
            };
            const existingNode = traversedNodes.get(nextNode.coordinates);
            // если эту ноду не обследовали, то добавляем в очередь
            if (!existingNode) {
                nodeLinkedList.add(nextNode);
            // если эту ноду обследовали, но найденный путь короче, то перезаписываем
            } else if (existingNode.transitionWeight > nextNode.transitionWeight) {
                traversedNodes.set(nextNode.coordinates, nextNode);
            }
        }
        traversedNodes.set(parentNode.coordinates, parentNode);
    }
    return { path: null, traversedNodes };
};
