function rotate(points: number[][], rotations: number[]) {
  const newPoints = [];
  for (const point of points) {
    newPoints.push([
      Math.floor(
        Math.cos(rotations[0]) * point[0] + Math.sin(rotations[0]) * point[2]
      ),
      point[1],
      Math.floor(
        Math.cos(rotations[0]) * point[2] - Math.sin(rotations[0]) * point[0]
      ),
    ]);
  }
  return newPoints;
}

function translate(points: number[][], translations: number[]) {
  const newPoints = [];
  for (const point of points) {
    newPoints.push([
      point[0] + translations[0],
      point[1] + translations[1],
      point[2] + translations[2],
    ]);
  }
  return newPoints;
}

function project(points: number[][]) {
  const newPoints = [];
  for (const point of points) {
    const t = 1024 / (1024 - point[2]);
    newPoints.push([
      Math.floor(640 + (point[0] - 640) * t),
      Math.floor(400 + (point[1] - 400) * t),
      point[2],
    ]);
  }
  return newPoints;
}

export async function create3DVectorsEffect(canvas: HTMLCanvasElement) {
  function drawLine(
    data: Uint8ClampedArray,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    color: number[]
  ) {
    // Iterators, counters required by algorithm
    let x, y, dx, dy, dx1, dy1, px, py, xe, ye, i;
    // Calculate line deltas
    dx = x2 - x1;
    dy = y2 - y1;
    // Create a positive copy of deltas (makes iterating easier)
    dx1 = Math.abs(dx);
    dy1 = Math.abs(dy);
    // Calculate error intervals for both axis
    px = 2 * dy1 - dx1;
    py = 2 * dx1 - dy1;

    const w = canvas.width * 4;
    let dPos;

    // The line is X-axis dominant
    if (dy1 <= dx1) {
      // Line is drawn left to right
      if (dx >= 0) {
        x = x1;
        y = y1;
        xe = x2;
      } else {
        // Line is drawn right to left (swap ends)
        x = x2;
        y = y2;
        xe = x1;
      }
      const start = y * w + x * 4;
      dPos = start;
      data[dPos] = color[0];
      data[dPos + 1] = color[1];
      data[dPos + 2] = color[2];
      data[dPos + 3] = 255;
      // Rasterize the line
      for (i = 0; x < xe; i++) {
        x = x + 1;
        dPos += 4;
        // Deal with octants...
        if (px < 0) {
          px = px + 2 * dy1;
        } else {
          if ((dx < 0 && dy < 0) || (dx > 0 && dy > 0)) {
            y = y + 1;
            dPos += w;
          } else {
            y = y - 1;
            dPos -= w;
          }
          px = px + 2 * (dy1 - dx1);
        }
        // Draw pixel from line span at
        // currently rasterized position
        data[dPos] = color[0];
        data[dPos + 1] = color[1];
        data[dPos + 2] = color[2];
        data[dPos + 3] = 255;
      }
    } else {
      // The line is Y-axis dominant
      // Line is drawn bottom to top
      if (dy >= 0) {
        x = x1;
        y = y1;
        ye = y2;
      } else {
        // Line is drawn top to bottom
        x = x2;
        y = y2;
        ye = y1;
      }
      const start = y * w + x * 4;
      dPos = start;
      data[dPos] = color[0];
      data[dPos + 1] = color[1];
      data[dPos + 2] = color[2];
      data[dPos + 3] = 255;
      // Rasterize the line
      for (i = 0; y < ye; i++) {
        y = y + 1;
        dPos += w;
        // Deal with octants...
        if (py <= 0) {
          py = py + 2 * dx1;
        } else {
          if ((dx < 0 && dy < 0) || (dx > 0 && dy > 0)) {
            x = x + 1;
            dPos += 4;
          } else {
            x = x - 1;
            dPos -= 4;
          }
          py = py + 2 * (dx1 - dy1);
        }
        // Draw pixel from line span at
        // currently rasterized position
        data[dPos] = color[0];
        data[dPos + 1] = color[1];
        data[dPos + 2] = color[2];
        data[dPos + 3] = 255;
      }
    }
  }
  const edgeColors: number[][] = [];
  let red = 255;
  let green = 0;
  let blue = 0;
  for (let i = 0; i < 102; i += 1) {
    if (green < 255) {
      green += 5;
    } else {
      blue += 5;
    }
    edgeColors.push([red,green,blue])
  }
  function draw(
    data: Uint8ClampedArray,
    points: number[][],
    edges: number[][],
    width: number
  ) {
    const projectedPointList = project(points);
    const edgeDataList: number[][] = [];
    for (const edge of edges) {
      const p1 = projectedPointList[edge[0]];
      const p2 = projectedPointList[edge[1]];
      const edgeZ = Math.floor((p1[2] + p2[2]) / 2);
      edgeDataList.push([
        edgeZ,
        p1[0] + 700,
        p1[1] + 550,
        p2[0] + 700,
        p2[1] + 550,
      ]);
    }
    edgeDataList.sort((a, b) => a[0] - b[0]);
    for (const edgeData of edgeDataList) {
      const colorIndex = Math.floor(edgeData[0]* (1.5*edgeColors.length/2) / width +(edgeColors.length/2))
      drawLine(
        data,
        edgeData[1],
        edgeData[2],
        edgeData[3],
        edgeData[4],
        edgeColors[colorIndex]
      );
    }
  }

  const letters3D: {
    [key: string]: {
      points: number[][];
      edges: number[][];
    };
  } = {
    A: {
      points: [
        [-40, 50, 0],
        [-40, -30, 0],
        [-20, -50, 0],
        [-20, -30, 0],
        [-20, 10, 0],
        [-20, 30, 0],
        [-20, 50, 0],
        [20, 50, 0],
        [20, 30, 0],
        [20, 10, 0],
        [20, -30, 0],
        [20, -50, 0],
        [40, -30, 0],
        [40, 50, 0],
        [-40, 50, 20],
        [-40, -30, 20],
        [-20, -50, 20],
        [-20, -30, 20],
        [-20, 10, 20],
        [-20, 30, 20],
        [-20, 50, 20],
        [20, 50, 20],
        [20, 30, 20],
        [20, 10, 20],
        [20, -30, 20],
        [20, -50, 20],
        [40, -30, 20],
        [40, 50, 20],
      ],
      edges: [
        [0, 1],
        [1, 2],
        [2, 11],
        [11, 12],
        [12, 13],
        [13, 7],
        [7, 8],
        [8, 5],
        [5, 6],
        [6, 0],
        [3, 10],
        [10, 9],
        [9, 4],
        [4, 3],
        [0, 14],
        [1, 15],
        [2, 16],
        [3, 17],
        [4, 18],
        [5, 19],
        [6, 20],
        [7, 21],
        [8, 22],
        [9, 23],
        [10, 24],
        [11, 25],
        [12, 26],
        [13, 27],
        [14, 15],
        [15, 16],
        [16, 25],
        [25, 26],
        [26, 27],
        [27, 21],
        [21, 22],
        [22, 19],
        [19, 20],
        [20, 14],
        [17, 24],
        [24, 23],
        [23, 18],
        [18, 17],
      ],
    },
    D: {
      points: [
        [-40, 50, 0],
        [-40, -50, 0],
        [-20, -30, 0],
        [-20, 30, 0],
        [20, -50, 0],
        [20, -30, 0],
        [20, 30, 0],
        [20, 50, 0],
        [40, -30, 0],
        [40, 30, 0],
        [-40, 50, 20],
        [-40, -50, 20],
        [-20, -30, 20],
        [-20, 30, 20],
        [20, -50, 20],
        [20, -30, 20],
        [20, 30, 20],
        [20, 50, 20],
        [40, -30, 20],
        [40, 30, 20],
      ],
      edges: [
        [0, 1],
        [1, 4],
        [4, 8],
        [8, 9],
        [9, 7],
        [7, 0],
        [3, 2],
        [2, 5],
        [5, 6],
        [6, 3],
        [0, 10],
        [1, 11],
        [2, 12],
        [3, 13],
        [4, 14],
        [5, 15],
        [6, 16],
        [7, 17],
        [8, 18],
        [9, 19],
        [10, 11],
        [11, 14],
        [14, 18],
        [18, 19],
        [19, 17],
        [17, 10],
        [13, 12],
        [12, 15],
        [15, 16],
        [16, 13],
      ],
    },
    E: {
      points: [
        [-40, 50, 0],
        [-40, -50, 0],
        [40, -50, 0],
        [40, -30, 0],
        [-20, -30, 0],
        [-20, -10, 0],
        [20, -10, 0],
        [20, 10, 0],
        [-20, 10, 0],
        [-20, 30, 0],
        [40, 30, 0],
        [40, 50, 0],
        [-40, 50, 20],
        [-40, -50, 20],
        [40, -50, 20],
        [40, -30, 20],
        [-20, -30, 20],
        [-20, -10, 20],
        [20, -10, 20],
        [20, 10, 20],
        [-20, 10, 20],
        [-20, 30, 20],
        [40, 30, 20],
        [40, 50, 20],
      ],
      edges: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 4],
        [4, 5],
        [5, 6],
        [6, 7],
        [7, 8],
        [8, 9],
        [9, 10],
        [10, 11],
        [11, 0],
        [0, 12],
        [1, 13],
        [2, 14],
        [3, 15],
        [4, 16],
        [5, 17],
        [6, 18],
        [7, 19],
        [8, 20],
        [9, 21],
        [10, 22],
        [11, 23],
        [12, 13],
        [13, 14],
        [14, 15],
        [15, 16],
        [16, 17],
        [17, 18],
        [18, 19],
        [19, 20],
        [20, 21],
        [21, 22],
        [22, 23],
        [23, 12],
      ],
    },
    G: {
      points: [
        [-40, 30, 0],
        [-40, -30, 0],
        [-20, -50, 0],
        [-20, -30, 0],
        [-20, 30, 0],
        [-20, 50, 0],
        [0, -10, 0],
        [0, 10, 0],
        [20, 10, 0],
        [20, 30, 0],
        [40, -50, 0],
        [40, -30, 0],
        [40, -10, 0],
        [40, 50, 0],
        [-40, 30, 20],
        [-40, -30, 20],
        [-20, -50, 20],
        [-20, -30, 20],
        [-20, 30, 20],
        [-20, 50, 20],
        [0, -10, 20],
        [0, 10, 20],
        [20, 10, 20],
        [20, 30, 20],
        [40, -50, 20],
        [40, -30, 20],
        [40, -10, 20],
        [40, 50, 20],
      ],
      edges: [
        [0, 1],
        [1, 2],
        [2, 10],
        [10, 11],
        [11, 3],
        [3, 4],
        [4, 9],
        [9, 8],
        [8, 7],
        [7, 6],
        [6, 12],
        [12, 13],
        [13, 5],
        [5, 0],
        [0, 14],
        [1, 15],
        [2, 16],
        [3, 17],
        [4, 18],
        [5, 19],
        [6, 20],
        [7, 21],
        [8, 22],
        [9, 23],
        [10, 24],
        [11, 25],
        [12, 26],
        [13, 27],
        [14, 15],
        [15, 16],
        [16, 24],
        [24, 25],
        [25, 17],
        [17, 18],
        [18, 23],
        [23, 22],
        [22, 21],
        [21, 20],
        [20, 26],
        [26, 27],
        [27, 19],
        [19, 14],
      ],
    },
    I: {
      points: [
        [-10, 50, 0],
        [-10, -50, 0],
        [10, -50, 0],
        [10, 50, 0],
        [-10, 50, 20],
        [-10, -50, 20],
        [10, -50, 20],
        [10, 50, 20],
      ],
      edges: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 0],
        [0, 4],
        [1, 5],
        [2, 6],
        [3, 7],
        [4, 5],
        [5, 6],
        [6, 7],
        [7, 4],
      ],
    },
    M: {
      points: [
        [-40, 50, 0],
        [-40, -50, 0],
        [-20, -50, 0],
        [-20, -30, 0],
        [-20, 50, 0],
        [0, -30, 0],
        [0, -10, 0],
        [20, 50, 0],
        [20, -30, 0],
        [20, -50, 0],
        [40, -50, 0],
        [40, 50, 0],
        [-40, 50, 20],
        [-40, -50, 20],
        [-20, -50, 20],
        [-20, -30, 20],
        [-20, 50, 20],
        [0, -30, 20],
        [0, -10, 20],
        [20, 50, 20],
        [20, -30, 20],
        [20, -50, 20],
        [40, -50, 20],
        [40, 50, 20],
      ],
      edges: [
        [0, 1],
        [1, 2],
        [2, 5],
        [5, 9],
        [9, 10],
        [10, 11],
        [11, 7],
        [7, 8],
        [8, 6],
        [6, 3],
        [3, 4],
        [4, 0],
        [0, 12],
        [1, 13],
        [2, 14],
        [3, 15],
        [4, 16],
        [5, 17],
        [6, 18],
        [7, 19],
        [8, 20],
        [9, 21],
        [10, 22],
        [11, 23],
        [12, 13],
        [13, 14],
        [14, 17],
        [17, 21],
        [21, 22],
        [22, 23],
        [23, 19],
        [19, 20],
        [20, 18],
        [18, 15],
        [15, 16],
        [16, 12],
      ],
    },
    N: {
      points: [
        [-40, 50, 0],
        [-40, -50, 0],
        [-20, -50, 0],
        [-20, -30, 0],
        [-20, 50, 0],
        [20, 50, 0],
        [20, 30, 0],
        [20, -50, 0],
        [40, -50, 0],
        [40, 50, 0],
        [-40, 50, 20],
        [-40, -50, 20],
        [-20, -50, 20],
        [-20, -30, 20],
        [-20, 50, 20],
        [20, 50, 20],
        [20, 30, 20],
        [20, -50, 20],
        [40, -50, 20],
        [40, 50, 20],
      ],
      edges: [
        [0, 1],
        [1, 2],
        [2, 6],
        [6, 7],
        [7, 8],
        [8, 9],
        [9, 5],
        [5, 3],
        [3, 4],
        [4, 0],
        [0, 10],
        [1, 11],
        [2, 12],
        [3, 13],
        [4, 14],
        [5, 15],
        [6, 16],
        [7, 17],
        [8, 18],
        [9, 19],
        [10, 11],
        [11, 12],
        [12, 16],
        [16, 17],
        [17, 18],
        [18, 19],
        [19, 15],
        [15, 13],
        [13, 14],
        [14, 10],
      ],
    },
    O: {
      points: [
        [-40, 30, 0],
        [-40, -30, 0],
        [-20, -50, 0],
        [-20, -30, 0],
        [-20, 30, 0],
        [-20, 50, 0],
        [20, -50, 0],
        [20, -30, 0],
        [20, 30, 0],
        [20, 50, 0],
        [40, -30, 0],
        [40, 30, 0],
        [-40, 30, 20],
        [-40, -30, 20],
        [-20, -50, 20],
        [-20, -30, 20],
        [-20, 30, 20],
        [-20, 50, 20],
        [20, -50, 20],
        [20, -30, 20],
        [20, 30, 20],
        [20, 50, 20],
        [40, -30, 20],
        [40, 30, 20],
      ],
      edges: [
        [0, 1],
        [1, 2],
        [2, 6],
        [6, 10],
        [10, 11],
        [11, 9],
        [9, 5],
        [5, 0],
        [4, 3],
        [3, 7],
        [7, 8],
        [8, 4],
        [0, 12],
        [1, 13],
        [2, 14],
        [3, 15],
        [4, 16],
        [5, 17],
        [6, 18],
        [7, 19],
        [8, 20],
        [9, 21],
        [10, 22],
        [11, 23],
        [12, 13],
        [13, 14],
        [14, 18],
        [18, 22],
        [22, 23],
        [23, 21],
        [21, 17],
        [17, 12],
        [16, 15],
        [15, 19],
        [19, 20],
        [20, 16],
      ],
    },
    R: {
      points: [
        [-40, 50, 0],
        [-40, -50, 0],
        [-20, -30, 0],
        [-20, -10, 0],
        [-20, 10, 0],
        [-20, 50, 0],
        [0, 10, 0],
        [20, -50, 0],
        [20, -30, 0],
        [20, -10, 0],
        [20, 10, 0],
        [20, 50, 0],
        [40, -30, 0],
        [40, -10, 0],
        [40, 50, 0],
        [-40, 50, 20],
        [-40, -50, 20],
        [-20, -30, 20],
        [-20, -10, 20],
        [-20, 10, 20],
        [-20, 50, 20],
        [0, 10, 20],
        [20, -50, 20],
        [20, -30, 20],
        [20, -10, 20],
        [20, 10, 20],
        [20, 50, 20],
        [40, -30, 20],
        [40, -10, 20],
        [40, 50, 20],
      ],
      edges: [
        [0, 1],
        [1, 7],
        [7, 12],
        [12, 13],
        [13, 10],
        [10, 14],
        [14, 11],
        [11, 6],
        [6, 4],
        [4, 5],
        [5, 0],
        [3, 2],
        [2, 8],
        [8, 9],
        [9, 3],
        [0, 15],
        [1, 16],
        [2, 17],
        [3, 18],
        [4, 19],
        [5, 20],
        [6, 21],
        [7, 22],
        [8, 23],
        [9, 24],
        [10, 25],
        [11, 26],
        [12, 27],
        [13, 28],
        [14, 29],
        [15, 16],
        [16, 22],
        [22, 27],
        [27, 28],
        [28, 25],
        [25, 29],
        [29, 26],
        [26, 21],
        [21, 19],
        [19, 20],
        [20, 15],
        [18, 17],
        [17, 23],
        [23, 24],
        [24, 18],
      ],
    },
    S: {
      points: [
        [-40, 50, 0],
        [-40, 30, 0],
        [-40, -10, 0],
        [-40, -30, 0],
        [-20, 10, 0],
        [-20, -10, 0],
        [-20, -30, 0],
        [-20, -50, 0],
        [20, 50, 0],
        [20, 30, 0],
        [20, 10, 0],
        [20, -10, 0],
        [40, 30, 0],
        [40, 10, 0],
        [40, -30, 0],
        [40, -50, 0],
        [-40, 50, 20],
        [-40, 30, 20],
        [-40, -10, 20],
        [-40, -30, 20],
        [-20, 10, 20],
        [-20, -10, 20],
        [-20, -30, 20],
        [-20, -50, 20],
        [20, 50, 20],
        [20, 30, 20],
        [20, 10, 20],
        [20, -10, 20],
        [40, 30, 20],
        [40, 10, 20],
        [40, -30, 20],
        [40, -50, 20],
      ],
      edges: [
        [0, 1],
        [1, 9],
        [9, 10],
        [10, 4],
        [4, 2],
        [2, 3],
        [3, 7],
        [7, 15],
        [15, 14],
        [14, 6],
        [6, 5],
        [5, 11],
        [11, 13],
        [13, 12],
        [12, 8],
        [8, 0],
        [0, 16],
        [1, 17],
        [2, 18],
        [3, 19],
        [4, 20],
        [5, 21],
        [6, 22],
        [7, 23],
        [8, 24],
        [9, 25],
        [10, 26],
        [11, 27],
        [12, 28],
        [13, 29],
        [14, 30],
        [15, 31],
        [16, 17],
        [17, 25],
        [25, 26],
        [26, 20],
        [20, 18],
        [18, 19],
        [19, 23],
        [23, 31],
        [31, 30],
        [30, 22],
        [22, 21],
        [21, 27],
        [27, 29],
        [29, 28],
        [28, 24],
        [24, 16],
      ],
    },
    V: {
      points: [
        [-40, -30, 0],
        [-40, -50, 0],
        [-20, -50, 0],
        [-20, -30, 0],
        [-10, 50, 0],
        [0, 30, 0],
        [10, 50, 0],
        [20, -30, 0],
        [20, -50, 0],
        [40, -50, 0],
        [40, -30, 0],
        [-40, -30, 20],
        [-40, -50, 20],
        [-20, -50, 20],
        [-20, -30, 20],
        [-10, 50, 20],
        [0, 30, 20],
        [10, 50, 20],
        [20, -30, 20],
        [20, -50, 20],
        [40, -50, 20],
        [40, -30, 20],
      ],
      edges: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 5],
        [5, 7],
        [7, 8],
        [8, 9],
        [9, 10],
        [10, 6],
        [6, 4],
        [4, 0],
        [0, 11],
        [1, 12],
        [2, 13],
        [3, 14],
        [4, 15],
        [5, 16],
        [6, 17],
        [7, 18],
        [8, 19],
        [9, 20],
        [10, 21],
        [11, 12],
        [12, 13],
        [13, 14],
        [14, 16],
        [16, 18],
        [18, 19],
        [19, 20],
        [20, 21],
        [21, 17],
        [17, 15],
        [15, 11],
      ],
    },
  };
  function compose(
    dict: { [x: string]: { points: number[][]; edges: number[][] } },
    word: string
  ) {
    const compoundObject: {
      points: number[][];
      edges: number[][];
      width:number;
    } = {
      points: [],
      edges: [],
      width: 0
    };
    let pointIndex = 0;
    let width = 0;
    for (const letter of word) {
      if (letter === " ") {
        width += 20 + 80 + 20;
        continue;
      }
      const object3D = dict[letter];
      for (const edge of object3D.edges) {
        compoundObject.edges.push([edge[0] + pointIndex, edge[1] + pointIndex]);
      }
      let minX = Infinity;
      let maxX = 0;
      for (const point of object3D.points) {
        if (point[0] < minX) {
          minX = point[0];
        } else if (point[0] > maxX) {
          maxX = point[0];
        }
        pointIndex += 1;
      }
      for (const point of translate(object3D.points, [width - minX, 0, 0])) {
        compoundObject.points.push(point);
      }
      width += maxX - minX + 20;
    }
    width -= 20;
    compoundObject.width = width
    compoundObject.points = translate(compoundObject.points, [
      -Math.floor(width / 2),
      0,
      0,
    ]);
    return compoundObject;
  }
  const logos = [
    compose(letters3D, "GERION"),
    compose(letters3D, "ASIMOV"),
    compose(letters3D, "MAD DOGS"),
  ];
  let rotation = 5 * Math.PI;
  let currentLogo = 0;
  return (_time: number, data: Uint8ClampedArray): boolean => {
    let isEffectDone = false;
    // draw credit scrolltext
    const logo = logos[currentLogo];
    const points = rotate(logo.points, [rotation, 1, 1]);
    draw(data, points, logo.edges, logo.width);
    rotation -= Math.PI / 200;
    if (rotation < 0) {
      rotation += 6 * Math.PI;
      currentLogo += 1;
      currentLogo %= 3;
    }

    return isEffectDone;
  };
}
