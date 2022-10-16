import { getRawImageData } from "../../Demos";
import { caricatureData } from "../../assets/gerion-caricature-slim";
import { logoData } from "../../assets/mad-dogs-flat-gray-V_logo";

function createAmigaCheckboard(
  width: number,
  height: number,
  cols: number,
  _rows: number
): Uint8ClampedArray {
  const data = new Uint8ClampedArray(height * width * 4);
  const size = width / cols;
  const endPos = data.length;
  let dPos = 0;
  while (dPos < endPos) {
    const col = Math.floor(dPos / (4 * size)) % cols;
    const row = Math.floor(dPos / (4 * width * size)) % (height / size);
    if (col % 2 === 0) {
      if (row % 2 === 0) {
        data[dPos] = 255;
        data[dPos + 1] = 255;
        data[dPos + 2] = 255;
        data[dPos + 3] = 255;
      } else {
        data[dPos] = 255;
        data[dPos + 1] = 0;
        data[dPos + 2] = 0;
        data[dPos + 3] = 255;
      }
    } else {
      if (row % 2 === 0) {
        data[dPos] = 255;
        data[dPos + 1] = 0;
        data[dPos + 2] = 0;
        data[dPos + 3] = 255;
      } else {
        data[dPos] = 255;
        data[dPos + 1] = 255;
        data[dPos + 2] = 255;
        data[dPos + 3] = 255;
      }
    }
    dPos += 4;
  }
  return data;
}
function drawMappedLine(
  source: number[][][],
  sourceWidth: number,
  destination: Uint8ClampedArray | number[],
  destinationWidth: number,
  xOffset: number,
  yOffset: number,
  xStart: number,
  xEnd: number
) {
  let width = xEnd - xStart;
  if (width <= sourceWidth) {
    let shrinkRatio = sourceWidth / width;
    let pixelStartRatio = 0;
    let ratioRemainder = 0;
    const sourcePixelRow = source[yOffset];
    ratioRemainder = shrinkRatio;
    let destinationPosition =
      (yOffset * destinationWidth + xStart + xOffset) * 4;

    for (let x = 0; x < sourceWidth; ) {
      let red = 0;
      let green = 0;
      let blue = 0;
      while (ratioRemainder >= 1) {
        const sourcePixel = sourcePixelRow[x];
        if (pixelStartRatio > 0) {
          const factor = 1 - pixelStartRatio;
          red += sourcePixel[0] * factor;
          green += sourcePixel[1] * factor;
          blue += sourcePixel[2] * factor;
          ratioRemainder -= factor;
          pixelStartRatio = 0;
        } else {
          red += sourcePixel[0];
          green += sourcePixel[1];
          blue += sourcePixel[2];
          ratioRemainder -= 1;
        }
        x += 1;
        if (x >= sourceWidth) {
          break;
        }
      }
      if (ratioRemainder > 0 && x < sourceWidth) {
        const pixel = sourcePixelRow[x];
        red += pixel[0] * ratioRemainder;
        green += pixel[1] * ratioRemainder;
        blue += pixel[2] * ratioRemainder;
        pixelStartRatio = ratioRemainder;
      }
      destination[destinationPosition] = red / shrinkRatio;
      destination[destinationPosition + 1] = green / shrinkRatio;
      destination[destinationPosition + 2] = blue / shrinkRatio;
      destination[destinationPosition + 3] = 255;
      destinationPosition += 4;
      ratioRemainder = shrinkRatio;
    }
  } else {
    let expansionFactor = width / sourceWidth;
    let remainder = expansionFactor;
    const sourceRow = source[yOffset];
    let destinationPosition =
      (yOffset * destinationWidth + xStart + xOffset) * 4;
    const start = destinationPosition;
    let dx = start;

    for (let sx = 0; sx < sourceRow.length; ) {
      let red = 0;
      let green = 0;
      let blue = 0;

      let pixel = sourceRow[sx];
      while (remainder >= 1) {
        remainder -= 1;
        destination[dx] = pixel[0];
        destination[dx + 1] = pixel[1];
        destination[dx + 2] = pixel[2];
        destination[dx + 3] = 255;
        dx += 4;
      }
      if (remainder > 0) {
        let startOffset = 1 - remainder;
        red = pixel[0] * remainder;
        green = pixel[1] * remainder;
        blue = pixel[2] * remainder;
        remainder = 0;
        sx += 1;
        if (sx >= sourceWidth) {
          destination[dx] = red;
          destination[dx + 1] = green;
          destination[dx + 2] = blue;
          destination[dx + 3] = 255;
          dx += 4;
          break;
        }
        pixel = sourceRow[sx];
        red += pixel[0] * startOffset;
        green += pixel[1] * startOffset;
        blue += pixel[2] * startOffset;
        remainder = expansionFactor - startOffset;
        destination[dx] = red;
        destination[dx + 1] = green;
        destination[dx + 2] = blue;
        destination[dx + 3] = 255;
        dx += 4;
      } else {
        sx += 1;
        remainder = expansionFactor;
      }
    }
  }
}

export async function createMappedTwisterEffect(canvas: HTMLCanvasElement) {
  const checkerboard = createAmigaCheckboard(100, canvas.height, 5, 160);
  const checkboardPixelData: number[][][] = [];
  for (
    let y = 0;
    y < logoData.height * logoData.width * 4;
    y += logoData.width * 4
  ) {
    const row = [];
    for (let x = y; x < y + logoData.width * 4; x += 4) {
      row.push([checkerboard[x], checkerboard[x + 1], checkerboard[x + 2]]);
    }
    checkboardPixelData.push(row);
  }

  let caricaturePixelData: number[][][];
  let logoPixelData: number[][][];
  const imageLoadingPromises = [];
  // load caricature
  imageLoadingPromises.push(
    getRawImageData(caricatureData.data)
      .then((textureRawData: Uint8ClampedArray) => {
        const checkerboard = createAmigaCheckboard(
          caricatureData.width,
          canvas.height,
          5,
          160
        );

        const textureOffset =
          (canvas.height - caricatureData.height) * caricatureData.width * 4;
        const rows: number[][][] = [];
        for (
          let y = 0;
          y < checkerboard.length;
          y += caricatureData.width * 4
        ) {
          const row = [];
          for (let x = y; x < y + caricatureData.width * 4; x += 4) {
            if (y < textureOffset) {
              row.push([
                checkerboard[x],
                checkerboard[x + 1],
                checkerboard[x + 2],
              ]);
            } else {
              const textureX = x - textureOffset;
              if (
                textureRawData[textureX] === 0 &&
                textureRawData[textureX + 1] === 255 &&
                textureRawData[textureX + 2] === 0
              ) {
                row.push([
                  checkerboard[x],
                  checkerboard[x + 1],
                  checkerboard[x + 2],
                ]);
              } else {
                row.push([
                  textureRawData[textureX],
                  textureRawData[textureX + 1],
                  textureRawData[textureX + 2],
                ]);
              }
            }
          }
          rows.push(row);
        }
        return rows;
      })
      .catch((error) => {
        console.error(error);
        return [] as number[][][];
      })
  );
  // load logo
  imageLoadingPromises.push(
    getRawImageData(logoData.data)
      .then((textureRawData: Uint8ClampedArray) => {
        const rows: number[][][] = [];
        for (
          let y = 0;
          y < logoData.height * logoData.width * 4;
          y += logoData.width * 4
        ) {
          const row = [];
          for (let x = y; x < y + logoData.width * 4; x += 4) {
            if (
              (textureRawData[x] === 0 &&
                textureRawData[x + 1] === 0 &&
                textureRawData[x + 2]) ||
              textureRawData[x + 3] === 0
            ) {
              row.push([
                checkerboard[x],
                checkerboard[x + 1],
                checkerboard[x + 2],
              ]);
            } else {
              row.push([
                textureRawData[x],
                textureRawData[x + 1],
                textureRawData[x + 2],
              ]);
            }
          }
          rows.push(row);
        }
        return rows;
      })
      .catch((error) => {
        console.error(error);
        return [] as number[][][];
      })
  );
  await Promise.all(imageLoadingPromises).then((loadedAndProcessedData) => {
    caricaturePixelData = loadedAndProcessedData[0] as number[][][];
    logoPixelData = loadedAndProcessedData[1] as number[][][];
    logoPixelData = loadedAndProcessedData[1] as number[][][];
  });

  let rotation = 0;

  return (_time: number, data: Uint8ClampedArray): boolean => {
    let isEffectFinished = false;
    // draw twister
    for (let y = 0; y < canvas.height; y += 1) {
      let aa =
        Math.sin(rotation - 2 * Math.PI) * 32 -
        Math.sin(y * 2 * Math.PI) * 16 +
        192;
      const seed = y / aa + rotation;
      let x1 = Math.round(Math.sin(seed) * 100);
      let x2 = Math.round(Math.sin(seed + Math.PI / 2) * 100);
      let x3 = Math.round(Math.sin(seed + Math.PI) * 100);
      let x4 = Math.round(Math.sin(seed + (3 * Math.PI) / 2) * 100);

      if (x1 < x2) {
        drawMappedLine(
          logoPixelData,
          logoData.width,
          data,
          canvas.width,
          canvas.width - 200,
          y,
          x1,
          x2
        );
      }
      if (x2 < x3) {
        drawMappedLine(
          caricaturePixelData,
          caricatureData.width,
          data,
          canvas.width,
          canvas.width - 200,
          y,
          x2,
          x3
        );
      }
      if (x3 < x4) {
        drawMappedLine(
          logoPixelData,
          logoData.width,
          data,
          canvas.width,
          canvas.width - 200,
          y,
          x3,
          x4
        );
      }
      if (x4 < x1) {
        drawMappedLine(
          caricaturePixelData,
          caricatureData.width,
          data,
          canvas.width,
          canvas.width - 200,
          y,
          x4,
          x1
        );
      }
      rotation += Math.PI * 0.00002;
      if (rotation > 2 * Math.PI) {
        rotation -= 2 * Math.PI;
      }
    }

    return isEffectFinished;
  };
}
