export function createScreen(screen: (time: number) => boolean, fps: number) {
  const intervalTime = 1000 / fps;
  let previousTime: number;
  let screenFinished = false;
return ():Promise<boolean> => {
    return new Promise((resolve, reject) => {
      function nextTick(time: number) {
        if (time - previousTime > intervalTime) {
          previousTime = time;
          screenFinished = screen(time);
        }
        if (!screenFinished) {
          window.requestAnimationFrame(nextTick);
        } else {
          resolve(true);
        }
      }
      window.requestAnimationFrame((time: number) => {
        previousTime = time;
        window.requestAnimationFrame(nextTick);
      });  
    });
  };
}
export function fadeScreen(rawBytes: Uint8ClampedArray, opacity: number) {
  for (let i = 3; i < rawBytes.length; i += 4) {
    rawBytes[i] = opacity;
  }
}

export async function getRawImageData(
  imageData: string
): Promise<Uint8ClampedArray> {
  const imageLoadingElement = document.createElement("img") as HTMLImageElement;
  return new Promise((resolve, reject) => {
    imageLoadingElement.onload = (event) => {
      const imageLoadingCanvas: HTMLCanvasElement = document.createElement(
        "canvas"
      ) as HTMLCanvasElement;
      imageLoadingCanvas.width = imageLoadingElement.width;
      imageLoadingCanvas.height = imageLoadingElement.height;
      const imageLoadingContext = imageLoadingCanvas.getContext("2d");
      if (!imageLoadingContext) {
        reject("no context found.");
      }
      imageLoadingContext?.drawImage(imageLoadingElement, 0, 0);
      const loadedImageData = imageLoadingContext?.getImageData(
        0,
        0,
        imageLoadingCanvas.width,
        imageLoadingCanvas.height
      );
      const rawData: Uint8ClampedArray | undefined = loadedImageData?.data;
      if (rawData) {
        resolve(rawData);
      } else {
        reject("no raw data extracted.");
      }
    };
    imageLoadingElement.src = imageData;
  });
}
