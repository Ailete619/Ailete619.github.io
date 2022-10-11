import { fadeScreen, getRawImageData } from "../../Demos";
import { createBitplaneCirclesEffect } from "./BitplaneCirclesEffect";
import { createCreditScrollEffect } from "./CreditScrollEffect";
import { createMappedTwisterEffect } from "./MappedTwisterEffect";

export async function createMappedTwisterBitplaneCirclesCreditScrollScreen(
  canvas: HTMLCanvasElement
) {
  const context = canvas.getContext("2d");
  if (!context) {
    console.error("Error: canvas's context not found");
    return () => {
      return true;
    };
  }
  // copper bars effect init
  const drawBitplaneCircles = await createBitplaneCirclesEffect(canvas);
  // sine scroll effect init
  const drawCreditScroll = await createCreditScrollEffect(canvas);
  // sine scroll effect init
  const drawMappedTwister = await createMappedTwisterEffect(canvas);
  // * * * * loading operations * * * *
  const imageLoadingPromises = [];
  // fade in and out
  let fadeOpacity = 255;
  // * * * * steps * * *
  let step = 0;
  document.addEventListener("click", (event) => {
    step = 4;
  });
  return (time: number): boolean => {
    let isScreenFinished = false;
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    // draw bitplane circles
    const isBitplaneCirclesFinished = drawBitplaneCircles(time, data);
    // draw twister
    const isTwisterFinished = drawMappedTwister(time, data);
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
      // draw credit scroll
      const isCreditScrollFinished = drawCreditScroll(time, data);
      if (isCreditScrollFinished) {
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
        isScreenFinished = true;
      }
    }
    context.putImageData(imageData, 0, 0);
    return isScreenFinished;
  };
}
