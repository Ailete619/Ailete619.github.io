export async function createCopperBarsEffect(canvas: HTMLCanvasElement) {
  const context = canvas.getContext("2d");
  if (!context) {
    console.error("Error: canvas's context not found");
    return () => {
      return true;
    };
  }
  // copper bars effect init
  const barHeight = 40;
  const shadeRange = 2 * barHeight;
  const barNumber = Math.ceil(canvas.height / barHeight);
  const shadeHalf = [];
  for (let shadeIndex = 0; shadeIndex < barHeight; shadeIndex += 1) {
    shadeHalf.push(
      Math.floor(
        Math.cos((shadeIndex * Math.PI) / (shadeRange + 12) + Math.PI / 2) *
          barHeight
      )
    );
  }
  const shadeTable = [...[...shadeHalf].reverse(), ...shadeHalf];
  const colorTable: any[] = [];
  for (const color of [
    [255, 0, 0],
    [0, 255, 0],
    [0, 0, 255],
    [255, 255, 0],
    [255, 0, 255],
    [0, 255, 255],
    [255, 255, 255],
  ]) {
    const colorShadeTable = [];
    for (const shade of shadeTable) {
      const colorShade = [];
      for (const colorComponent of color) {
        if (colorComponent > 0) {
          colorShade.push(colorComponent + shade * 6);
        } else {
          colorShade.push(colorComponent);
        }
      }
      colorShadeTable.push(colorShade);
    }
    colorTable.push(colorShadeTable);
  }
  const colorProgram = [0, 3, 1, 5, 2, 6, 4];
  let colorIndex = 0;
  let newColorIndex = -1;
  let newColorOffset = barHeight;
  let shadeIndex = 0;
  return (time: number, data: Uint8ClampedArray): boolean => {
    let isEffectFinished = false;
    // draw copper bars
    newColorIndex = Math.floor((time / 10000) % colorProgram.length);
    if (newColorIndex === colorIndex) {
      newColorIndex = -1;
    } else {
      newColorOffset -= 1;
      if (newColorOffset < 0 && shadeIndex >= barHeight) {
        newColorOffset = barHeight;
        colorIndex = newColorIndex;
        newColorIndex = -1;
      }
    }
    if (shadeIndex >= barHeight) {
      shadeIndex -= barHeight;
    }
    let destinationPosition = 0;
    for (let y = 0; y < canvas.height; y += 1) {
      let colorShades = colorTable[colorProgram[colorIndex]];
      const shadeOffset = Math.floor(y / barNumber);
      if (
        newColorIndex > -1 &&
        (newColorOffset - shadeIndex < 0 ||
          (newColorOffset - shadeIndex < 0 &&
            Math.floor(y / barHeight) - newColorOffset < 0))
      ) {
        colorShades = colorTable[colorProgram[newColorIndex]];
      }
      shadeIndex += 1;
      if (shadeIndex >= barHeight) {
        shadeIndex = 0;
      }
      const shade = colorShades[shadeIndex + shadeOffset];
      for (let x = 0; x < canvas.width; x += 1) {
        data[destinationPosition] = shade[0];
        data[destinationPosition + 1] = shade[1];
        data[destinationPosition + 2] = shade[2];
        destinationPosition += 4;
      }
    }
    shadeIndex += 2;
    return isEffectFinished;
  };
}
