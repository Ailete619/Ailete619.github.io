import { fontData } from "../../assets/cartoon_sunset_font";
import { getRawImageData } from "../../Demos";
export async function createSineScrollEffect(canvas: HTMLCanvasElement) {
  const context = canvas.getContext("2d");
  if (!context) {
    console.error("Error: canvas's context not found");
    return () => {
      return true;
    };
  }
  // sine scroll effect init
  const rowWidth = canvas.width * 4;
  const scrollText =
  "        WELCOME BACK!        "+
  "GERION DID ALSO SELL HIS LAST AMIGA SOME TIME AGO ... "+
  "BUT I GUESS HE FELT HE NEEDED ONE AGAIN BECAUSE AFTER TELLING ME ABOUT IT FOR SOME TIME, "+
  "HE FINALLY BOUGHT HIMSELF A VAMPIRE STANDALONE FOR HIS BIRTHDAY! " +
  "                " +
  "BUYING AN ORIGINAL AMIGA AND BOOSTING IT WITH ACCELERATION CARDS AND GRAPHIC CARDS IS QUITE EXPENSIVE, AND REQUIRE A LOT OF MAINTENANCE ... " +
  "AND THE VAMPIRE STANDALONE IMPROVES ON THE CHIPSET AND THE OLD M68K PROCESSOR, WHILE BEING CHEAPER. " +
  "I KNOW THIS IS A SENSITIVE TOPIC FOR A LOT OF PEOPLE WHO FEEL THAT THE NEW FUNCTIONALITIES BEING SPECIFIC TO THE APOLLO CORE AND NOT BACKWARD COMPATIBLE WITH CLASSIC AMIGAS ARE NOT NEEDED, " +
  "BUT FOR ME, MY NEXT AMIGA WILL BE A VAMPIRE STANDALONE BECAUSE I FEEL IT MAKES THE PLATFORM EVOLVE WHILE MAINTAINING THE M68K HERITAGE. " +
  "BUT THAT IS JUST MY FEELING, I AM NOT A PURIST AND I DON'T WANT TO START AN ARGUMENT :-P " +
  "                " +
  "GERION WANTS TO FIT HIS STANDALONE IN AN A1200 SHELL, SO HE'LL BE BUSY WITH THIS HARDWARE PROJECT. "+
  "I HOPE HE STILL GETS THE TIME TO DO SOME GRAPHICS TOO! " +
  "                " +
  "HE HAS SOME AMBITIOUS DEMO IDEAS TOO, SO I NEED TO STEP UP MY GAME TOO! " +
  "                " +
  "NOWDAYS WE ARE BUSY WITH WORK AND FAMILY, I WISH I HAD CODED MORE IN 1995 AND PLAYED LESS!" +
  "        :-P        " +
  "NO REGRETS, I LOVED GAMES. I REMEMBER PLAYING POWERMONGER, SYNDICATE, DUNE, ... I WISH I HAD THE TIME TO PLAY SOME GAMES NOW!" +
  "                " +
  "GERION WAS INTO SOCCER GAMES LIKE KICK OFF ..." +
  "                " +
  "MY MOM WOULD COOK FOR ALL OF US, WHEN WE HAD AN AMIGA MEETUP AT OUR HOUSE TO TALK, SWAP DEMOS AND GAMES ..." +
  "                " +
  "FUN TIMES! :-)" +
  "                " +
  "STILL READING? I DON'T KOW WHAT TO WRITE ABOUT ..." +
  "                " +
  "OH YES! THERE IS A BUG IN THE PREVIOUS SCREEN, THE LOGO SHOULD BE GRAY AND NOT PURPLE, BEFORE THAT IT WAS GREEN ... "+
  "MUST BE THE LOADING ROUTINE BUT IT IS FINE WITH THE FONTS AND THE LOGO IN THS SCREEN ... I HAD NO TIME TO DEBUG IT AS I MUST RELEASE!" +
  "                " +
  "STILL READING? WELL LET'S GO TO THE NEXT PART ..." +
  "                ";
  let sineXOffset = 0;
  const sineYOffset = 496;
  const sineAmplitude = 240;
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
    if (charactersDataMap) {
      // draw sine scroll
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
              const characterY =
                Math.floor(
                  Math.sin(
                    ((sineXOffset +
                      scrollPixelPosition +
                      characterPixelColumnIndex) /
                      (64 + 8) +
                      x) /
                      Math.PI
                  ) * sineAmplitude
                ) + sineYOffset;
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
      scrollPixelPosition -= 12;
      if (scrollPixelPosition < -64) {
        scrollTextPosition += 1;
        scrollPixelPosition = 0;
      }
      sineXOffset -= (64 + 8) / (2 * Math.PI);
      if (sineXOffset < 0) {
        sineXOffset += 2 * Math.PI;
      }
      if (scrollTextPosition >= scrollText.length) {
        isEffectDone = true;
      }
    }
    return isEffectDone;
  };
}
