import { getRawImageData } from "../../Demos";
import { fontData } from "../../assets/data-70_font";
export async function createCreditScrollEffect(canvas: HTMLCanvasElement) {
  const fontWidth = 16
  const fontHeight = 32
  const fontSpace = 2
  const lineSpace = 2
const imageLoadingPromises = [];
    imageLoadingPromises.push(
      getRawImageData(fontData.data).then((fontRawData: Uint8ClampedArray) => {
        const charactersDataMap: { [key: string]: (number[] | undefined)[][] } =
          {};
        const characterMap =
          "!\"#$%&'()*+,-./0123456789:?@ABCDEFGHIJKLMNOPQRSTUVWXYZ_~";
        for (
          let characterMapIndex = 0;
          characterMapIndex < 56;
          characterMapIndex += 1
        ) {
          const table = [];
          const mapIndex = characterMap.indexOf(characterMap[characterMapIndex]);
          const characterColumn = (mapIndex % 8) * fontWidth;
          const characterRow = Math.floor(mapIndex / 8) * fontData.width * fontHeight;
          for (let pixelRowIndex = 0; pixelRowIndex < fontHeight; pixelRowIndex += 1) {
            const pixelRow = [];
            const rowPosition =
              characterColumn * 4 +
              characterRow * 4 +
              pixelRowIndex * fontData.width * 4;
  
            for (let pixelIndex = 0; pixelIndex < fontWidth * 4; pixelIndex += 4) {
              //console.log(characterMapIndex, characterMap[characterMapIndex], characterColumn/64, (characterRow/(fontData.width * 64)),pixelIndex/4, pixelRowIndex)
              const pixelPosition = rowPosition + pixelIndex;
              //console.log(pixelPosition, rowPosition)
              if (
                (fontRawData[pixelPosition] === 0 &&
                  fontRawData[pixelPosition + 1] === 255 &&
                  fontRawData[pixelPosition + 2] === 0) ||
                fontRawData[pixelPosition + 3] === 0
              ) {
                pixelRow.push(undefined);
              } else {
                pixelRow.push([
                  fontRawData[pixelPosition],
                  fontRawData[pixelPosition + 1],
                  fontRawData[pixelPosition + 2],
                ]);
              }
            }
            table.push(pixelRow);
          }
          charactersDataMap[characterMap[characterMapIndex]] = table;
        }
        return charactersDataMap;
      })
    );
    let charactersDataMap: { [key: string]: (number[] | undefined)[][] } = {};
    await Promise.all(imageLoadingPromises).then((loadedAndProcessedData) => {
      charactersDataMap = loadedAndProcessedData[0] as {
        [key: string]: (number[] | undefined)[][];
      };
    });
    const scrollText = [
      "THIS WAS \"PI/4+1\"",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "YOU HAVE NOW REACHED THE END OF GERION BIRTHDAYTRO!",
      "",
      "I HAD A GREAT TIME MAKING THIS FUN PROJECT",
      "AND I LEARNED A LOT WHILE MAKING THE DIFFERENT EFFECTS",
      "",
      "I STILL HAVE A LOT TO LEARN AS THE CODE IS NOT WELL",
      "OPTIMISED NOR IS IT PACKED ...",
      "",
      "ALSO, I AM LEARNING M68K ASSEMBLY ONCE AGAIN.",
      "SO, I SHOULD BE ABLE TO PRODUCE DEMOS BOTH FOR ",
      "THE WEB AND AMIGA/APOLLO IN THE NEAR FUTURE ...",
      "",
      "I CAN'T AFFORD AN APOLLO STANDALONE AT THE MOMENT,",
      "ESPECIALLY WITH THE 150% MARKUP DUE TO THE WEAK YEN.",
      "",
      "I WILL HAVE TO MAKE DO WITH UAE AND VASM FOR NOW,",
      "AND HAVE GERION TEST MY CODE :-P",
      "",
      "+-------------------( GREETINGS:  )-------------------+",
      "",
      "I DID NOT KNOW LOTS OF PEOPLE IN THE SCENE 27 YEARS AGO",
      "AND MOST OF THEM ARE NOT IN THE SCENE ANYMORE ...",
      "SO THIS WILL BE SHORT :-P",
      "",
      "ASIMOV'S GREETINGS GO TO:",
      "",
      "GERION (THE BIRTHDAY BOY!)",
      "",
      "(AND IN NO SPECIAL ORDER)",
      "",
      "BOSCO",
      "CODAC",
      "DARKEN",
      "RAHOW/REBELS",
      "UNBORN(BAB)",
      "VASKOR",
      "ALL FORMER MEMBERS OF APEX & SYNDROME",
      "ALL FORMER MEMBERS OF MAD DOGS",
      "",
      "+---------------( PERSONAL MESSAGES:  )---------------+",
      "",
      "@GERION: I HOPE YOU LIKE YOUR LITTLE BIRTHDAY PRESENT",
      "         EVEN THOUGH IT IS NOT M68K ASM ... YET :-P  ",
      "         WHAT DO YOU THINK BRO?                      ",
      "",
      "@RAHOW/REBELS: STILL IN THE SCENE I SEE :-)",
      "",
      "@DARKEN: WE HAVEN'T SPOKEN RECENTLY,   ",
      "         WHAT ARE YOU DOING THESE DAYS?",
      "",
      "+----------------( ABOUT THIS DEMO:  )----------------+",
      "",
      "Gerion birthdaytro consists of 3 screens",
      "all coded by me (Asimov)",
      "in Typescript, using VSCode & Vite",
      "I drew all the logos and fonts used in this demo.",
      "I borrowed Gerion's pixel art babe to add to decorate the twister texture",
      "",
      "Starfield screen:",
      "~~~~~~~~~~~~~~~~~",
      "Code: ..................... Asimov",
      "Gfx: ...................... Asimov",
      "Music: .................... ",
      "Text: .....................Asimov",
      "",
      "Sine Scroll screen:",
      "~~~~~~~~~~~~~~~~~",
      "Code: ..................... Asimov",
      "Gfx: ...................... Asimov",
      "Music: .................... ",
      "Text: ..................... Asimov",
      "",
      "Mapped Twister screen:",
      "~~~~~~~~~~~~~~~~~",
      "Code: ..................... Asimov         ",
      "Gfx: ...................... Asimov & Gerion",
      "Music: .................... ",
      "Text: ..................... Asimov         ",
      "",
      "+-----------------------------------------------------+",
      "",
      "Thank you if you have read so far, click to exit the demo",
      "",
    ];
    let scrollTextPosition = 0;
    let scrollPixelPosition = canvas.height;
    return (time: number, data: Uint8ClampedArray): boolean => {
      let isEffectFinished = false;
      // draw credit scrolltext
      for (
        let i = 0;
        i < (canvas.height - scrollPixelPosition) / (fontHeight + lineSpace);
        i += 1
      ) {
        if (scrollTextPosition + i >= scrollText.length) {
          break;
        }
        const line = scrollText[scrollTextPosition+i].toUpperCase();
        const width = line.length * (fontWidth + fontSpace);
        let lineX = (4 * (canvas.width - (width+300))) / 2;
        const lineY = (scrollPixelPosition + i * (fontHeight + lineSpace)) * canvas.width * 4;
        // console.log(line, lineX,lineY);
        for (let c of line) {
          // console.log(c);
          const charData = charactersDataMap[c];
//          console.log(c, charData);
          if (c !== " ") {
            for (let row = 0; row < fontHeight; row += 1) {
              const rowPos = lineY + lineX+row*canvas.width*4;

              for (let col = 0; col < fontWidth; col += 1) {
                const pixel = charData[row][col];
                if (pixel) {
                  const dPos = rowPos + col * 4;
                  data[dPos] = pixel[0];
                  data[dPos + 1] = pixel[1];
                  data[dPos + 2] = pixel[2];
                  data[dPos + 3] = 255;
                }
              }
            }
          }
          lineX += (fontWidth + fontSpace)*4;
        }
      }

      scrollPixelPosition-=2
      if(scrollPixelPosition<-(fontHeight+lineSpace)) {
        scrollPixelPosition +=fontHeight+lineSpace
        scrollTextPosition+=1
      }

    return isEffectFinished;
  };
}
