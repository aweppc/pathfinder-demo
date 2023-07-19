import React, { useCallback, useRef, useState } from 'react';
import { v4 as createId } from 'uuid';
import { Grid } from '../grid';
import { Map } from '../internal/map';
import { buildVectorField } from '../internal/pathfinding/verctor-field';
import { GridPainter } from '../grid-painter';
import { classname } from '../utils';
import './styles.css';
import { coordinateUtils } from '../internal/coordinates';

type Mode = 'start' | 'end' | 'wall';

const cn = classname('vector-field-demo');

export const VectorFieldDemo = React.memo(() => {
    const formId = useRef(createId());
    const startId = useRef(`${formId.current}-${createId()}`);
    const endId = useRef(`${formId.current}-${createId()}`);
    const wallId = useRef(`${formId.current}-${createId()}`);
    const modeRef = useRef<Mode>('wall');
    const startsRef = useRef<[number, number][]>([]);
    const endRef = useRef<[number, number] | null>(null);
    const painterRef = useRef<GridPainter | null>(null);
    const mapRef = useRef<Map | null>(null);
    const drawnRef = useRef(false);
    const [, setDummy] = useState(0);
    const forceUpdate = useCallback(() => setDummy((value) => (value + 1) % 100), []);
    const clearPath = useCallback(() => {
        const map = mapRef.current;
        const painter = painterRef.current;
        const starts = startsRef.current;
        const end = endRef.current;
        if (!drawnRef.current || !map || !painter) {
            return;
        }
        painter.clearGrid();
        painter.drawGrid();
        starts.forEach((start) => {
            painter.drawTile({ x: start[0], y: start[1], color: 'green' });
        });
        if (end) {
            painter.drawTile({ x: end[0], y: end[1], color: 'cyan' });
        }
        map.getWalls().forEach(([x, y]) => {
            painter.drawTile({ x, y, color: 'black' });
        });
        drawnRef.current = false;
    }, []);
    const handleGrid = useCallback((width: number, height: number, painter: GridPainter) => {
        if (!mapRef.current) {
            mapRef.current = new Map(width, height);
        } else {
            mapRef.current.clamp(width, height);
        }
        painterRef.current = painter;
        clearPath();
    }, [clearPath]);
    const handleMapClick = useCallback((x: number, y: number) => {
        const map = mapRef.current;
        const painter = painterRef.current;
        if (!map || !painter) {
            return;
        }
        clearPath();
        const starts = startsRef.current;
        const end = endRef.current;
        switch (modeRef.current) {
            case 'start': {
                if (end && end[0] === x && end[1] === y) {
                    endRef.current = null;
                }
                map.clearWall(x, y);
                const exists = !!starts.find((start) => coordinateUtils.equals(start, [x, y]));
                if (exists) {
                    painter.clearTile({ x, y });
                    startsRef.current = starts.filter((start) => !coordinateUtils.equals(start, [x, y]));
                } else {
                    painter.drawTile({ x, y, color: 'green' });
                    startsRef.current = [...starts, [x, y]];
                }
                break;
            }
            case 'end': {
                if (end) {
                    painter.clearTile({ x: end[0], y: end[1] });
                }
                startsRef.current = starts.filter((start) => !coordinateUtils.equals(start, [x, y]));
                endRef.current = [x, y];
                map.clearWall(x, y);
                painter.drawTile({ x, y, color: 'cyan' });
                break;
            }
            case 'wall': {
                startsRef.current = starts.filter((start) => !coordinateUtils.equals(start, [x, y]));
                if (end && end[0] === x && end[1] === y) {
                    endRef.current = null;
                }
                if (map.toggleWall(x, y)) {
                    painter.drawTile({ x, y, color: 'black' });
                } else {
                    painter.clearTile({ x, y });
                }
                break;
            }
        }
        forceUpdate();
    }, [clearPath, forceUpdate]);
    const handleWallClick = useCallback(() => {
        modeRef.current = 'wall';
        forceUpdate();
    }, [forceUpdate]);
    const handleStartClick = useCallback(() => {
        modeRef.current = 'start';
        forceUpdate();
    }, [forceUpdate]);
    const handleEndClick = useCallback(() => {
        modeRef.current = 'end';
        forceUpdate();
    }, [forceUpdate]);
    const handleFindPathClick = useCallback(() => {
        const map = mapRef.current;
        const starts = startsRef.current;
        const end = endRef.current;
        const painter = painterRef.current;
        if (!map || !starts.length || !end || !painter) {
            return;
        }
        const vectorField = buildVectorField(end[0], end[1], map);
        starts.forEach((start) => {
            const path = vectorField.findPath(start);
            if (!path) {
                return;
            }
            path.forEach(([from, to]) => {
                painter.drawPath({ from, to });
            });
        });
        drawnRef.current = true;
        forceUpdate();
    }, [forceUpdate]);
    return (
        <div className={cn()}>
            <div className={cn('controls')}>
                <fieldset className={cn('mode-select')}>
                    <div>
                        <label htmlFor={wallId.current}>Стенки</label>
                        <input
                            id={wallId.current}
                            type='radio'
                            checked={modeRef.current === 'wall'}
                            onClick={handleWallClick}
                        />
                    </div>
                    <div>
                        <label htmlFor={startId.current}>Начало</label>
                        <input
                            id={startId.current}
                            type='radio'
                            checked={modeRef.current === 'start'}
                            onClick={handleStartClick}
                        />
                    </div>
                    <div>
                        <label htmlFor={endId.current}>Конец</label>
                        <input
                            id={endId.current}
                            type='radio'
                            checked={modeRef.current === 'end'}
                            onClick={handleEndClick}
                        />
                    </div>
                </fieldset>
                <button
                    disabled={!startsRef.current.length || !endRef.current || !mapRef.current || drawnRef.current}
                    onClick={handleFindPathClick}
                >
                    Нарисовать путь
                </button>
            </div>
            <Grid
                onGrid={handleGrid}
                onCellClick={handleMapClick}
            />
        </div>
    )
});
