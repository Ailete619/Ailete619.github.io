export async function createStarfieldEffect(canvas: HTMLCanvasElement) {
  let starTable: number[][] = [];
  for (let starIndex = 0; starIndex < 4096; starIndex += 1) {
    let newStar: number[] = [
      Math.random() * 4096 - 2048,
      Math.random() * 4096 - 2048,
      Math.random() * 4096,
    ];
    while (
      starTable.find((item) => JSON.stringify(newStar) === JSON.stringify(item))
    ) {
      newStar = [
        Math.random() * 4096 - 2048,
        Math.random() * 4096 - 2048,
        Math.random() * 4096,
      ];
    }
    starTable.push(newStar);
  }
  starTable = starTable.sort((a, b) => {
    return a[2] - b[2];
  });
  return (time: number, data: Uint8ClampedArray): boolean => {
    let isEffectDone = false;
    // draw starfield
    for (let i = 0; i < data.length; i += 4) {
      data[i] = 0;
      data[i + 1] = 0;
      data[i + 2] = 0;
    }
    for (let star of starTable) {
      const z = star[2];
      const row = Math.floor((star[1] / z) * 1024) + 400;
      const col = Math.floor((star[0] / z) * 1024) + 640;
      if (row >= 0 && row < canvas.height && col >= 0 && col < canvas.width) {
        const size = Math.ceil((4096 - z) / 1024);
        const color = Math.floor(63 + (192 / z) * 4096);
        let pos = (row - size + 1) * canvas.width * 4 + (col - size + 1) * 4;
        // console.log(row,col,size,color)
        if (size === 1) {
          data[pos] = color;
          data[pos + 1] = color;
          data[pos + 2] = color;
          data[pos + 3] = 255;
        } else {
          const endStar = pos + size * canvas.width * 4 + size * 4;
          for (; pos < endStar; pos += (canvas.width - size) * 4) {
            const endLine = pos + size * 4;
            for (; pos < endLine; pos += 4) {
              data[pos] = 255;
              data[pos + 1] = 255;
              data[pos + 2] = 255;
              data[pos + 3] = 255;
            }
          }
        }
      }
      star[0] += 0;
      star[0] %= 4096;
      star[1] += 0;
      star[1] %= 4096;
      star[2] -= 128;
      if (star[2] < 0) {
        star[2] += 4096;
      }
    }
    return isEffectDone;
  };
}
