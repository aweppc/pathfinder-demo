export const createGridPainter = (ctx: CanvasRenderingContext2D, pixelRatio: number, dimensions: [number, number]) => {
    const applyPixelRatio = (coordinate: number) => Math.floor(coordinate * pixelRatio);
    const drawLine = (
        {
            from: [fromX, fromY],
            to: [toX, toY],
            color,
        }: {
            from: [number, number];
            to: [number, number];
            color: string;
        },
    ) => {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.moveTo(
            applyPixelRatio(fromX),
            applyPixelRatio(fromY)
        );
        ctx.lineTo(
            applyPixelRatio(toX),
            applyPixelRatio(toY)
        );
        ctx.stroke();
    };

    const drawRect = (
        {
            topLeft: [topLeftX, topLeftY],
            bottomRight: [bottomRightX, bottomRightY],
            color,
            margin = 0,
        }: {
            topLeft: [number, number];
            bottomRight: [number, number];
            color: string;
            margin?: number;
        }
    ) => {
        // eslint-disable-next-line no-self-compare
        const clampedMargin = margin === margin ? Math.min(1, Math.max(0, margin)) : 0;
        ctx.fillStyle = color;
        ctx.fillRect(
            applyPixelRatio(topLeftX) + Math.round(pixelRatio * clampedMargin),
            applyPixelRatio(topLeftY) + Math.round(pixelRatio * clampedMargin),
            applyPixelRatio(bottomRightX) - Math.round(2 * pixelRatio * clampedMargin),
            applyPixelRatio(bottomRightY) - Math.round(2 * pixelRatio * clampedMargin)
        );
    };

    const clearRect = (
        {
            topLeft,
            bottomRight,
            margin = 0,
        }: {
            topLeft: [number, number];
            bottomRight: [number, number];
            margin?: number;
        }
    ) => {
        drawRect({ topLeft, bottomRight, margin, color: 'white' })
    };

    const drawGrid = () => {
        drawRect({
            topLeft: [0, 0],
            bottomRight: dimensions,
            color: 'white',
        });
        for (let i = 1; i < dimensions[0]; i++) {
            drawLine({
                from: [i, 0],
                to: [i, dimensions[1]],
                color: 'black',
            })
        }
        for (let i = 1; i < dimensions[1]; i++) {
            drawLine({
                from: [0, i],
                to: [dimensions[0], i],
                color: 'black',
            });
        }
    };

    const clearGrid = () => {
        clearRect({ topLeft: [0, 0], bottomRight: dimensions });
    };

    const drawTile = ({ x, y, color }: { x: number; y: number; color: string }) => {
        drawRect({
            topLeft: [x, y],
            bottomRight: [1, 1],
            color,
            margin: .15
        });
    };

    const clearTile = ({ x, y }: { x: number, y: number }) => {
        clearRect({
            topLeft: [x, y],
            bottomRight: [1, 1],
            margin: .15
        });
    };

    const drawPath = ({ from, to }: { from: [number, number]; to: [number, number] }) => {
        ctx.beginPath();
        ctx.strokeStyle = 'red';
        ctx.moveTo(applyPixelRatio(from[0] + .5), applyPixelRatio(from[1] + .5));
        ctx.lineTo(applyPixelRatio(to[0] + .5), applyPixelRatio(to[1] + .5));
        ctx.stroke();
    };

    // const drawCircle = (
    //     {
    //         center: [centerX, centerY],
    //         radius,
    //         color,
    //     }: {
    //         center: [number, number];
    //         radius: number;
    //         color: string;
    //     }
    // ) => {
    //     ctx.beginPath();
    //     ctx.strokeStyle = color;
    //     ctx.fillStyle = color;
    //     ctx.arc(
    //         applyPixelRatio(centerX),
    //         applyPixelRatio(centerY),
    //         radius,
    //         0, 2 * Math.PI
    //     );
    //     ctx.fill();
    // }

    return {
        clearGrid,
        drawGrid,
        drawTile,
        drawPath,
        clearTile,
    };
}

export type GridPainter = ReturnType<typeof createGridPainter>;