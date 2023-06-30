import React from 'react';
// import logo from './logo.svg';
import './App.css';
// import { Map } from './internal/map';
// import { findPath } from './internal/pathfinder';
// import { Coordinates } from './internal/coordinates';
import { AStarDemo } from './a-star-demo';

// const dimensions = [10, 10] as const;
// const map = new Map(...dimensions);
// const pixelRatio = 50;

// map.setWall(Coordinates.create(0, 4));
// map.setWall(Coordinates.create(2, 4));
// map.setWall(Coordinates.create(1, 4));
// map.setWall(Coordinates.create(2, 5));
// map.setWall(Coordinates.create(3, 5));
// map.setWall(Coordinates.create(4, 5));
// map.setWall(Coordinates.create(5, 5));
// map.setWall(Coordinates.create(6, 5));
// map.setWall(Coordinates.create(7, 5));
// map.setWall(Coordinates.create(8, 5));
// map.setWall(Coordinates.create(8, 4));
// map.setWall(Coordinates.create(8, 3));
// // map.setWall(Coordinates.create(2, 9));

// const start = Coordinates.create(2, 0)
// const end = Coordinates.create(2, 9);
// const { path, traversedNodes: hints } = findPath(start, end, map);

function App() {
//   const drawLine = useCallback((ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, color: string) => {
//     ctx.beginPath();
//     ctx.strokeStyle = color;
//     ctx.moveTo(x1, y1);
//     ctx.lineTo(x2, y2);
//     ctx.stroke();
//   }, []);
//   const drawRect = useCallback((ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, color: string) => {
//     ctx.fillStyle = color;
//     ctx.fillRect(x1, y1, x2, y2);
//   }, []);
//   const drawCircle = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, color: string) => {
//     ctx.beginPath();
//     ctx.strokeStyle = color;
//     ctx.fillStyle = color;
//     ctx.arc(x, y, Math.max(1, Math.round(pixelRatio / 15)), 0, 2 * Math.PI);
//     ctx.fill();
//   }, [])
//   useEffect(() => {
//     const canvas = document.getElementById('test-canvas') as HTMLCanvasElement;
//     const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
//     // background
//     drawRect(ctx, 0, 0, pixelRatio * dimensions[0] - 1, pixelRatio * dimensions[1] - 1, 'white');
//     // grid
//     for (let i = 1; i < dimensions[0]; i++) {
//       drawLine(ctx, i * pixelRatio, 0, i * pixelRatio, dimensions[1] * pixelRatio, 'black');
//     }
//     for (let i = 1; i < dimensions[1]; i++) {
//       drawLine(ctx, 0, i * pixelRatio, dimensions[0] * pixelRatio, i * pixelRatio, 'black');
//     }
//     // start
//     drawRect(ctx, start.x * pixelRatio, start.y * pixelRatio, pixelRatio, pixelRatio, 'green');
//     // end
//     drawRect(ctx, end.x * pixelRatio, end.y * pixelRatio, pixelRatio, pixelRatio, 'cyan');
//     // walls
//     map.getWalls().forEach((wall) => {
//       drawRect(ctx, wall.x * pixelRatio, wall.y * pixelRatio, pixelRatio, pixelRatio, 'black');
//     })
//     // path
//     if (path) {
//       const { segments } = path.reduce((result, coordinate) => {
//         if (result.prev) {
//           result.segments.push([result.prev[0], result.prev[1], coordinate.x, coordinate.y]);
//         }
//         result.prev = [coordinate.x, coordinate.y];
//         return result;
//       }, {
//         prev: null as [number, number] | null,
//         segments: [] as [number, number, number, number][],
//       });
//       segments.forEach(([x1, y1, x2, y2]) => {
//         drawLine(
//           ctx,
//           Math.round((x1 + .5) * pixelRatio),
//           Math.round((y1 + .5) * pixelRatio),
//           Math.round((x2 + .5) * pixelRatio),
//           Math.round((y2 + .5) * pixelRatio),
//           'red'
//         );
//       });
//     }
//     // hints
//     hints.getAll().map(({ value }) => value).forEach(({ coordinates, parentCoordinates }) => {
//       if (!parentCoordinates) {
//         return;
//       }
//       const pin = parentCoordinates.lerpTo(coordinates, .3).shift(.5, .5);
//       const needle = coordinates.lerpTo(parentCoordinates, .3).shift(.5, .5);
//       drawCircle(ctx, pin.x * pixelRatio, pin.y * pixelRatio, 3, 'magenta');
//       drawLine(ctx, pin.x * pixelRatio, pin.y * pixelRatio, needle.x * pixelRatio, needle.y * pixelRatio, 'magenta');
//     });
// }, [drawCircle, drawLine, drawRect]);
  return (
    <div className="App">
      <div className="App-header">
        <AStarDemo />
      </div>
    </div>
  );
}

export default App;
