import { fontData } from "../../assets/cartoon_sunset_font";
import { getRawImageData } from "../../Demos";

export async function createTextScrollEffect(canvas: HTMLCanvasElement) {
  // sine scroll effect init
  const rowWidth = canvas.width * 4;
  const scrollText = (
    "        HELLO EVERYONE!        " +
    "LET'S WISH A HAPPY BIRTHDAY TO GERION!" +
    "                " +
    'ASIMOV OF MAD DOGS PROUDLY PRESENTS "PI/4+1"!' +
    "                " +
    "THIS IS NOT 1995 ANYMORE ... TODAY IS THE 16TH OF OCTOBER 2022! " +
    "THIS IS MY FIRST NEW PRODUCTION AFTER 27 YEARS AND I CODED IT ESPECIALLY FOR THE BIRTHDAY OF GERION. " +
    "I HAVE BEEN WANTING TO DO THIS KIND OF THING FOR A LONG TIME TO SEND TO FAMILY AND FRIENDS FOR BIRTHDAYS, CHRISTMAS AND NEW YEAR, INSTEAD OF SENDING RANDOM INSPIRATIONAL PICS OR ANIMATIONS COPY PASTED FROM THE INTERNET ... " +
    "AND RECENTLY GERION STARTED TALKING (A LOT) ABOUT THE APOLLO VAMPIRE V4 STANDALONE, AND THE OLD DAYS "+
    "IT GOT ME A BIT NOSTALGIC ABOUT AMIGA AND DEMOS." +
    "        ( T _ T )        " +
    "BUT I SOLD MY LAST AMIGA A LONG TIME AGO AND I HAVE FORGOTTEN THE LITTLE M68K ASSEMBLY I KNEW BACK IN THE DAY, SO I CODED THIS LITTLE DEMO IN TYPESCRIPT ... " +
    "STAY TUNED BECAUSE MORE ARE TO FOLLOW ..." +
    "        :-)        " +
    "IN TS ... OR M68K ASM! (OR EVEN OTHER PLATFORMS IF THE OCCASION PRESENTS ITSELF) " +
    "                " +
    "SO NOW I HAVE TO CONTINUE TYPING BECAUSE THIS MODULE IS SO GOOD I WANT YOU TO ENJOY IT UNTIL THE END :-P " +
    "                " +
    "ANYWAY, YOU CAN SKIP TO THE NEXT PART AT ANY TIME BY RIGHT CLICKING ... BUT THIS AWESOME MODULE IS ALREADY OVER, SO I'LL SEE YOU IN THE NEXT PART ..."
  ).toUpperCase();
  const scrollTextYOffset = 735;
  let scrollTextPosition = 0;
  let scrollPixelPosition = canvas.width;
  // load font
  let charactersDataMap: { [key: string]: (number[] | undefined)[][] } =
    await getRawImageData(fontData.data).then(
      (fontRawData: Uint8ClampedArray) => {
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
          const mapIndex = characterMap.indexOf(
            characterMap[characterMapIndex]
          );
          const characterColumn = (mapIndex % 8) * 64;
          const characterRow = Math.floor(mapIndex / 8) * fontData.width * 64;
          for (
            let pixelColumnIndex = 0;
            pixelColumnIndex < 64;
            pixelColumnIndex += 1
          ) {
            const pixelColumn = [];
            const columnPosition =
              characterColumn * 4 + characterRow * 4 + pixelColumnIndex * 4;
            for (
              let pixelIndex = 0;
              pixelIndex < fontData.width * 4 * 64;
              pixelIndex += fontData.width * 4
            ) {
              const pixelPosition = columnPosition + pixelIndex;
              if (
                (fontRawData[pixelPosition] === 255 &&
                  fontRawData[pixelPosition + 1] === 0 &&
                  fontRawData[pixelPosition + 2] === 255) ||
                fontRawData[pixelPosition + 3] === 0
              ) {
                pixelColumn.push(undefined);
              } else {
                pixelColumn.push([
                  fontRawData[pixelPosition],
                  fontRawData[pixelPosition + 1],
                  fontRawData[pixelPosition + 2],
                ]);
              }
            }
            table.push(pixelColumn);
          }
          charactersDataMap[characterMap[characterMapIndex]] = table;
        }
        return charactersDataMap;
      }
    );

  return (_time: number, data: Uint8ClampedArray): boolean => {
    let isEffectDone = false;
    // draw scrolltext
    if (charactersDataMap) {
      for (
        let x = 0;
        x < (canvas.width - scrollPixelPosition) / (64 + 8);
        x += 1
      ) {
        if (scrollTextPosition + x >= scrollText.length) {
          break;
        }
        const currentCharacter = scrollText[scrollTextPosition + x];
        if (currentCharacter !== " ") {
          const characterPixelData = charactersDataMap[currentCharacter];
          const characterX = scrollPixelPosition + x * (64 + 8);
          for (
            let characterPixelColumnIndex = 0;
            characterPixelColumnIndex < 64;
            characterPixelColumnIndex += 1
          ) {
            if (
              characterX + characterPixelColumnIndex > 0 &&
              characterX + characterPixelColumnIndex < canvas.width
            ) {
              const characterY = scrollTextYOffset;
              let drawingPosition =
                (characterX + characterPixelColumnIndex) * 4 +
                characterY * rowWidth;
              const columnPixelData =
                characterPixelData[characterPixelColumnIndex];
              for (let pixelIndex = 0; pixelIndex < 64; pixelIndex += 1) {
                const pixelData = columnPixelData[pixelIndex];
                if (pixelData) {
                  data[drawingPosition] = pixelData[0];
                  data[drawingPosition + 1] = pixelData[1];
                  data[drawingPosition + 2] = pixelData[2];
                }
                drawingPosition += rowWidth;
              }
            }
          }
        }
      }
      scrollPixelPosition -= 8;
      if (scrollPixelPosition < -64) {
        scrollTextPosition += 1;
        scrollPixelPosition = 0;
      }
      if (scrollTextPosition >= scrollText.length) {
        isEffectDone = true;
      }
    }

    return isEffectDone;
  };
}
