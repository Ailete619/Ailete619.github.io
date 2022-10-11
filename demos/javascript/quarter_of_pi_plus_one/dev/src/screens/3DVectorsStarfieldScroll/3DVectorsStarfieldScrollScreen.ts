import { logoData } from "../../assets/mad-dogs-flat-gray_logo";
import { fadeScreen, getRawImageData } from "../../Demos";
import { createStarfieldEffect } from "./StarfleldEffect";
import { createTextScrollEffect } from "./TextScrollEffect";

export async function create3DVectorsStarfieldScrollScreen(
  canvas: HTMLCanvasElement
) {
  const context = canvas.getContext("2d");
  if (!context) {
    console.error("Error: canvas's context not found");
    return () => {
      return true;
    };
  }
  // starfield effect init
  const drawStarfield = await createStarfieldEffect(canvas);
  // sine scroll effect init
  const drawTextScroll = await createTextScrollEffect(canvas);
  // * * * * loading operations * * * *
  const imageLoadingPromises = [];
  // load logo
  imageLoadingPromises.push(
    getRawImageData(logoData.data)
      .then((logoRawData: Uint8ClampedArray) => {
        const pixels: (number[] | undefined)[] = [];
        for (let i = 0; i < logoData.width * logoData.height * 4; i += 4) {
          if (
            logoRawData[i] === 255 &&
            logoRawData[i + 1] === 0 &&
            logoRawData[i + 2] === 255
          ) {
            pixels.push(undefined);
          } else {
            pixels.push([
              logoRawData[i],
              logoRawData[i + 1],
              logoRawData[i + 2],
            ]);
          }
        }
        return pixels;
      })
      .catch((error) => {
        console.log(error);
        return [] as (number[] | undefined)[];
      })
  );
  let logoPixelData: (number[] | undefined)[];
  await Promise.all(imageLoadingPromises).then((loadedAndProcessedData) => {
    logoPixelData = loadedAndProcessedData[0] as (number[] | undefined)[];
  });
  // fade in and out
  let fadeOpacity = 255;
  // * * * * steps * * *
  let step = 0;
  document.addEventListener("click", (event) => {
    step = 4;
  });

  return (time: number): boolean => {
    let isEffectFinished = false;
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    // draw starfield
    const isStarfieldFinished = drawStarfield(time, data);
    // draw logo
    let sourcePos = 0;
    let destPos =
      canvas.width * 4 * 100 + ((canvas.width - logoData.width) * 4) / 2;
    for (let y = 0; y < logoData.height; y += 1) {
      for (let x = 0; x < logoData.width; x += 1) {
        const pix: number[] | undefined =
          (logoPixelData && logoPixelData[sourcePos]) ?? undefined;

        if (pix) {
          data[destPos] = pix[0];
          data[destPos + 1] = pix[1];
          data[destPos + 2] = pix[2];
          data[destPos + 3] = 255;
        }
        sourcePos += 1;
        destPos += 4;
      }
      destPos += (canvas.width - logoData.width) * 4;
    }
    if (step === 0) {
      fadeOpacity = 0;
      step = 1;
    }
    if (step === 1) {
      fadeScreen(data, fadeOpacity);
      fadeOpacity += 1;
      if (fadeOpacity > 255) {
        step = 2;
      }
    }
    if (step === 2) {
      // draw text scroll
      const isTextScrollFinished = drawTextScroll(time, data);
      if (isTextScrollFinished) {
        step = 3;
      }
    }
    if (step === 3) {
      fadeOpacity = 255;
      step = 4;
    }
    if (step === 4) {
      fadeScreen(data, fadeOpacity);
      fadeOpacity -= 1;
      if (fadeOpacity < 0) {
        isEffectFinished = true;
      }
    }
    context.putImageData(imageData, 0, 0);
    return isEffectFinished;
  };
}
