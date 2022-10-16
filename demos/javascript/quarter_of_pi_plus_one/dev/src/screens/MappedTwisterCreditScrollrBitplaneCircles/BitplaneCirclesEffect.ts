function drawCircle(
  canvas: HTMLCanvasElement,
  data: Uint8ClampedArray,
  centerX: number,
  centerY: number,
  radius: number
) {
  let x = radius,
    y = 0;

  // Printing the initial point
  // on the axes after translation
  const centerPos = centerY * canvas.width * 4 + centerX * 4;
  const dX = x * 4;
  const dY = y * 4;
  let dPos = centerPos + dY * canvas.width + dX;
  if (dPos >= 0 && dPos < data.length) {
    data[dPos] = 255;
    data[dPos + 1] = 0;
    data[dPos + 2] = 0;
    data[dPos + 3] = 255;
  }

  // When radius is zero only a single
  // point will be printed
  if (radius > 0) {
    dPos = centerPos + dY * canvas.width - dX;
    if (dPos >= 0 && dPos < data.length) {
      data[dPos] = 255;
      data[dPos + 1] = 0;
      data[dPos + 2] = 0;
      data[dPos + 3] = 255;
    }
    dPos = centerPos + dY + dX * canvas.width;
    if (dPos >= 0 && dPos < data.length) {
      data[dPos] = 255;
      data[dPos + 1] = 0;
      data[dPos + 2] = 0;
      data[dPos + 3] = 255;
    }
    dPos = centerPos + dY - dX * canvas.width;
    if (dPos >= 0 && dPos < data.length) {
      data[dPos] = 255;
      data[dPos + 1] = 0;
      data[dPos + 2] = 0;
      data[dPos + 3] = 255;
    }
  }

  // Initialising the value of P
  var P = 1 - radius;
  while (x > y) {
    y++;

    // Mid-point is inside or on the perimeter
    if (P <= 0) P = P + 2 * y + 1;
    // Mid-point is outside the perimeter
    else {
      x--;
      P = P + 2 * y - 2 * x + 1;
    }
    if (centerX + x < 0 || centerX + x >= canvas.width) {
      continue;
    }
    if (centerY + y < 0 || centerY + y >= canvas.height) {
      continue;
    }
    // All the perimeter points have already
    // been printed
    if (x < y) {
      break;
    }

    // Printing the generated point and its
    // reflection in the other octants after
    // translation
    const dX = x * 4;
    const dY = y * 4;
    let dPos = centerPos + dY * canvas.width + dX;
    data[dPos] = 255;
    data[dPos + 1] = 0;
    data[dPos + 2] = 0;
    data[dPos + 3] = 255;
    dPos = centerPos + dY * canvas.width - dX;
    data[dPos] = 255;
    data[dPos + 1] = 0;
    data[dPos + 2] = 0;
    data[dPos + 3] = 255;
    dPos = centerPos - dY * canvas.width + dX;
    data[dPos] = 255;
    data[dPos + 1] = 0;
    data[dPos + 2] = 0;
    data[dPos + 3] = 255;
    dPos = centerPos - dY * canvas.width - dX;
    data[dPos] = 255;
    data[dPos + 1] = 0;
    data[dPos + 2] = 0;
    data[dPos + 3] = 255;
    // document.write("(" + (-x + x_centre) + ", " + (-y + y_centre) + ")<br/>");

    // If the generated point is on the
    // line x = y then the perimeter points
    // have already been printed
    if (x != y) {
      dPos = centerPos + dX * canvas.width + dY;
      data[dPos] = 255;
      data[dPos + 1] = 0;
      data[dPos + 2] = 0;
      data[dPos + 3] = 255;
      dPos = centerPos + dX * canvas.width - dY;
      data[dPos] = 255;
      data[dPos + 1] = 0;
      data[dPos + 2] = 0;
      data[dPos + 3] = 255;
      dPos = centerPos - dX * canvas.width + dY;
      data[dPos] = 255;
      data[dPos + 1] = 0;
      data[dPos + 2] = 0;
      data[dPos + 3] = 255;
      dPos = centerPos - dX * canvas.width - dY;
      data[dPos] = 255;
      data[dPos + 1] = 0;
      data[dPos + 2] = 0;
      data[dPos + 3] = 255;
    }
  }
}
export async function createBitplaneCirclesEffect(canvas: HTMLCanvasElement) {
  const context = canvas.getContext("2d");
  if (!context) {
    console.error("Error: canvas's context not found");
    return () => {
      return true;
    };
  }
  // create the bitplane circle image
  const circleCanvas = document.createElement("canvas");
  circleCanvas.width = 1280 * 2;
  circleCanvas.height = 800 * 2;
  const circleContext = circleCanvas.getContext("2d");
  if (!circleContext) {
    return (_time: number): boolean => true;
  }
  const circleImageData = circleContext?.getImageData(
    0,
    0,
    circleCanvas.width,
    circleCanvas.height
  );
  const circleData = circleImageData?.data;
  if (circleData) {
    for (
      let radius = 8;
      radius < circleCanvas.width + circleCanvas.height;
      radius += 16
    ) {
      drawCircle(
        circleCanvas,
        circleData,
        circleCanvas.width / 2 - 1,
        circleCanvas.height / 2 - 1,
        radius
      );
    }
    let isYLinePixel = false;
    let colorYPixels = true;
    let isXLinePixel = false;
    let colorXPixels = true;
    let dPos = 0;
    for (let row = 0; row < circleCanvas.height; row += 1) {
      //debugger
      if (
        circleData[dPos] === 0 &&
        circleData[dPos + 1] === 0 &&
        circleData[dPos + 2] === 0
      ) {
        if (isYLinePixel) {
          isYLinePixel = false;
          isXLinePixel = false;
          colorYPixels = !colorYPixels;
        }
        isXLinePixel = isYLinePixel;
        colorXPixels = colorYPixels;
      } else {
        if (!isYLinePixel) {
          isYLinePixel = true;
          isXLinePixel = true;
          if (row > circleCanvas.height / 2 - 1) {
            colorXPixels = !colorYPixels;
          } else {
            colorXPixels = colorXPixels;
          }
        }
      }

      for (let col = 0; col < circleCanvas.width; col += 1) {
        if (
          circleData[dPos] === 0 &&
          circleData[dPos + 1] === 0 &&
          circleData[dPos + 2] === 0
        ) {
          if (isXLinePixel) {
            isXLinePixel = false;
            colorXPixels = !colorXPixels;
          }
          if (colorXPixels) {
            circleData[dPos] = 255;
            circleData[dPos + 1] = 255;
            circleData[dPos + 2] = 255;
            circleData[dPos + 3] = 255;
          }
        } else {
          if (!isXLinePixel) {
            isXLinePixel = true;
          }
          if (col === circleCanvas.width / 2 - 1) {
            colorXPixels = !colorXPixels;
          }
        }
        dPos += 4;
      }
    }
  }
  // using the image created to generate simple boolean data for the pixels
  const pixelData: boolean[][] = [];
  let dPos = 0;
  for (let y = 0; y < circleCanvas.height; y += 1) {
    const row: boolean[] = [];
    for (let x = 0; x < circleCanvas.width; x += 1) {
      if (
        circleData[dPos] === 0 &&
        circleData[dPos + 1] === 0 &&
        circleData[dPos + 2] === 0
      ) {
        row.push(false);
      } else {
        row.push(true);
      }
      dPos += 4;
    }
    pixelData.push(row);
  }
  let x1Offset = 32;
  let y1Offset = 32;
  let x2Offset = canvas.width - 32;
  let y2Offset = canvas.height - 32;
  let x1Inc = -16;
  let y1Inc = -8;
  let x2Inc = -8;
  let y2Inc = -16;
  return (_time: number, data: Uint8ClampedArray): boolean => {
    let isEffectFinished = false;
    // draw 2 overlapping sets of circles
    let dPos = 0;
    for (let y = 0; y < canvas.height; y += 1) {
      for (let x = 0; x < canvas.width; x += 1) {
        if (pixelData[y + y1Offset][x + x1Offset] === false) {
          if (pixelData[y + y2Offset][x + x2Offset] === false) {
            data[dPos] = 0;
            data[dPos + 1] = 0;
            data[dPos + 2] = 0;
            data[dPos + 3] = 255;
          } else {
            data[dPos] = 128;
            data[dPos + 1] = 128;
            data[dPos + 2] = 0;
            data[dPos + 3] = 255;
          }
        } else {
          if (pixelData[y + y2Offset][x + x2Offset] === false) {
            data[dPos] = 128;
            data[dPos + 1] = 0;
            data[dPos + 2] = 0;
            data[dPos + 3] = 255;
          } else {
            data[dPos] = 128;
            data[dPos + 1] = 64;
            data[dPos + 2] = 0;
            data[dPos + 3] = 255;
          }
        }
        dPos += 4;
      }
    }
    x1Offset += x1Inc;
    if (x1Offset < 32) {
      x1Inc = -x1Inc;
      x1Offset += x1Inc;
    } else if (x1Offset > canvas.width - 32) {
      x1Inc = -x1Inc;
      x1Offset += x1Inc;
    }
    y1Offset += y1Inc;
    if (y1Offset < 32) {
      y1Inc = -y1Inc;
      y1Offset += y1Inc;
    } else if (y1Offset > canvas.height - 32) {
      y1Inc = -y1Inc;
      y1Offset += y1Inc;
    }
    x2Offset += x2Inc;
    if (x2Offset < 32) {
      x2Inc = -x2Inc;
      x2Offset += x2Inc;
    } else if (x2Offset > canvas.width - 32) {
      x2Inc = -x2Inc;
      x2Offset += x2Inc;
    }
    y2Offset += y2Inc;
    if (y2Offset < 32) {
      y2Inc = -y2Inc;
      y2Offset += y2Inc;
    } else if (y2Offset > canvas.height - 32) {
      y2Inc = -y2Inc;
      y2Offset += y2Inc;
    }
    return isEffectFinished;
  };
}
