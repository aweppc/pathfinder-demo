import React, {
    ChangeEventHandler,
    MouseEventHandler,
    TouchEventHandler,
    useCallback,
    useEffect,
    useRef,
    useState
 } from 'react';
import { v4 as createId } from 'uuid';
import { GridPainter, createGridPainter } from '../grid-painter';
import { classname } from '../utils';
import './styles.css';

const isValidDimension = (value: number) => {
    // eslint-disable-next-line no-self-compare
    return value === value && value > 0;
}

const cn = classname('grid');

type Props = {
    onCellClick?: (x: number, y: number) => void;
    onGrid?: (width: number, height: number, painter: GridPainter) => void;
};

export const Grid = React.memo(({ onCellClick, onGrid }: Props) => {
    const formId = useRef(createId());
    const widthId = useRef(`${formId.current}-${createId()}`);
    const heightId = useRef(`${formId.current}-${createId()}`);
    const pixelRatioId = useRef(`${formId.current}-${createId()}`);
    const heightRef = useRef<number | null>(null);
    const widthRef = useRef<number | null>(null);
    const pixelRatioRef = useRef<number | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const lastDragRef = useRef<[number, number] | null>(null);
    const mouseIsDownRef = useRef(false);
    const [, setDummy] = useState(0);
    const forceUpdate = useCallback(() => {
        setDummy((value) => value + 1 % 100);
    }, []);
    useEffect(() => {
        const handleMouseDown = (e: MouseEvent) => {
            if (e.button === 0) {
                mouseIsDownRef.current = true;
            }
        };
        const handleMouseUp = (e: MouseEvent) => {
            if (e.button === 0) {
                mouseIsDownRef.current = false;
                lastDragRef.current = null;
            }
        };
        const handleTouchDown = () => {
            mouseIsDownRef.current = true;
        };
        const handleTouchUp = () => {
            mouseIsDownRef.current = false;
            lastDragRef.current = null;
        };
        document.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('touchstart', handleTouchDown);
        document.addEventListener('touchend', handleTouchUp);
        return () => {
            document.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('touchstart', handleTouchDown);
            document.removeEventListener('touchend', handleTouchUp);
        }
    }, []);
    const handleWidthChange = useCallback<ChangeEventHandler<HTMLInputElement>>((e) => {
        const value = Number(e.currentTarget.value);
        if (isValidDimension(value) && widthRef.current !== value) {
            widthRef.current = Math.round(value);
            forceUpdate();
        }
    }, [forceUpdate]);
    const handleHeightChange = useCallback<ChangeEventHandler<HTMLInputElement>>((e) => {
        const value = Number(e.currentTarget.value);
        if (isValidDimension(value) && heightRef.current !== value) {
            heightRef.current = Math.round(value);
            forceUpdate();
        }
    }, [forceUpdate]);
    const handlePixelRatioChange = useCallback<ChangeEventHandler<HTMLInputElement>>((e) => {
        const value = Number(e.currentTarget.value);
        if (isValidDimension(value) && pixelRatioRef.current !== value) {
            pixelRatioRef.current = Math.round(value);
            forceUpdate();
        }
    }, [forceUpdate]);
    const handleCanvasMouseOver = useCallback<MouseEventHandler<HTMLCanvasElement>>((e) => {
        if (!mouseIsDownRef.current) {
            return;
        }
        const canvas = canvasRef.current;
        const pixelRatio = pixelRatioRef.current;
        if (!canvas || !pixelRatio) {
            return;
        }
        const rect = canvas.getBoundingClientRect();
        const x = Math.floor((e.clientX - rect.left) / pixelRatio);
        const y = Math.floor((e.clientY - rect.top) / pixelRatio);
        if (lastDragRef.current && lastDragRef.current[0] === x && lastDragRef.current[1] === y) {
            return;
        }
        lastDragRef.current = [x, y];
        onCellClick?.(x, y);
    }, [onCellClick]);
    const handleCanvasTouchMove = useCallback<TouchEventHandler<HTMLCanvasElement>>((e) => {
        if (!mouseIsDownRef.current) {
            return;
        }
        const canvas = canvasRef.current;
        const pixelRatio = pixelRatioRef.current;
        if (!canvas || !pixelRatio) {
            return;
        }
        const rect = canvas.getBoundingClientRect();
        const x = Math.floor((e.touches[0].clientX - rect.left) / pixelRatio);
        const y = Math.floor((e.touches[0].clientY - rect.top) / pixelRatio);
        if (lastDragRef.current && lastDragRef.current[0] === x && lastDragRef.current[1] === y) {
            return;
        }
        lastDragRef.current = [x, y];
        onCellClick?.(x, y);
    }, [onCellClick]);
    useEffect(() => {
        const ctx = canvasRef.current?.getContext('2d') ?? null;
        const pixelRatio = pixelRatioRef.current;
        const width = widthRef.current;
        const height = heightRef.current;
        if (!ctx || !pixelRatio || !width || !height) {
            return;
        }
        const gridPainter = createGridPainter(ctx, pixelRatio, [width, height]);
        gridPainter.clearGrid();
        gridPainter.drawGrid();
        onGrid?.(width, height, gridPainter);
    });
    const pixelRatio = pixelRatioRef.current;
    const height = heightRef.current;
    const width = widthRef.current;
    return (
        <div className={cn()}>
            <div className={cn('controls')}>
                <div className={cn('control')}>
                    <label htmlFor={widthId.current}>Ширина</label>
                    <input type='number' id={widthId.current} onChange={handleWidthChange} />
                </div>
                <div className={cn('control')}>
                    <label htmlFor={heightId.current}>Высота</label>
                    <input type='number' id={heightId.current} onChange={handleHeightChange} />
                </div>
                <div className={cn('control')}>
                    <label htmlFor={pixelRatioId.current}>Размер сетки</label>
                    <input type='number' id={pixelRatioId.current} onChange={handlePixelRatioChange} />
                </div>
            </div>
            {width && height && pixelRatio && (
                <div className={cn('canvas')}>
                    <canvas
                        ref={canvasRef}
                        onMouseMove={handleCanvasMouseOver}
                        onTouchMove={handleCanvasTouchMove}
                        width={width * pixelRatio}
                        height={height * pixelRatio}
                    />
                </div>
            )}
        </div>
    );
});
