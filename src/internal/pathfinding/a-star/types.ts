import { Coordinates } from '../../coordinates';

export type PathNode = {
    coordinates: Coordinates;
    transitionWeight: number;
    heuristicWeight: number;
    parentCoordinates: Coordinates | null;
}
