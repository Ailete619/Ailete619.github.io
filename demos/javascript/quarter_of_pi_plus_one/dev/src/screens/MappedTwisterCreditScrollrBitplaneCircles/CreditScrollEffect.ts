import { getRawImageData } from "../../Demos";
import { fontData } from "../../assets/data-70_font";
export async function createCreditScrollEffect(canvas: HTMLCanvasElement) {
  const fontWidth = 16;
  const fontHeight = 32;
  const fontSpace = 2;
  const lineSpace = 2;
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
        const characterRow =
          Math.floor(mapIndex / 8) * fontData.width * fontHeight;
        for (
          let pixelRowIndex = 0;
          pixelRowIndex < fontHeight;
          pixelRowIndex += 1
        ) {
          const pixelRow = [];
          const rowPosition =
            characterColumn * 4 +
            characterRow * 4 +
            pixelRowIndex * fontData.width * 4;

          for (
            let pixelIndex = 0;
            pixelIndex < fontWidth * 4;
            pixelIndex += 4
          ) {
            const pixelPosition = rowPosition + pixelIndex;
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
    'THIS WAS "PI/4+1"',
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
    "YOU HAVE NOW REACHED THE END CREDITS OF",
    "GERION BIRTHDAYTRO!",
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
    "+-------------------( GREETINGS:  )-------------------+",
    "",
    "I DID NOT KNOW LOTS OF DEMOSCENE PEOPLE 27 YEARS AGO",
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
    "",
    "CODAC",
    "",
    "DARKEN",
    "",
    "RAHOW/REBELS",
    "",
    "UNBORN(BAB)",
    "",
    "VASKOR",
    "",
    "ALL FORMER MEMBERS OF APEX & SYNDROME",
    "",
    "ALL FORMER MEMBERS OF MAD DOGS",
    "",
    "ALL PRESENT AND FORMER MEMBERS OF THE AMIGA DEMOSCENE",
    "",
    "ALL THE PEOPLE MAKING DEMOS AROUND THE WORLD",
    "",
    "ALL THE PEOPLE ENJOYING DEMOS AROUND THE WORLD",
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
    "+---------------( PERSONAL MESSAGES:  )---------------+",
    "",
    "@GERION: I HOPE YOU LIKE YOUR LITTLE BIRTHDAY PRESENT",
    "         EVEN THOUGH IT IS NOT M68K ASM ... YET :-P  ",
    "         WHAT DO YOU THINK BRO?                      ",
    "",
    "@RAHOW/REBELS: STILL IN THE SCENE I SEE :-)          ",
    "",
    "@DARKEN: WE HAVEN'T SPOKEN RECENTLY,                 ",
    "         WHAT ARE YOU DOING THESE DAYS?              ",
    "",
    "@VASKOR: THANKS FOR THE SONGS ALL THESE YEARS AGO,   ",
    "         I HOPE YOU GET TO SEE THIS!                 ",
    "",
    "@BOSCO: I HOPE YOU DON'T MIND ME REUSING SONGS       ",
    "        FROM GUDULE ...                              ",
    "",
    "",
    "",
    "+----------------( ABOUT THIS DEMO:  )----------------+",
    "",
    "Gerion birthdaytro consists of 3 screens",
    "",
    "All coded by me (Asimov)",
    "In Typescript, using VSCode & Vite,",
    "Except for the \"funkymed-flod-module-player\"",
    "Created by Christian Corti Neoart Costa Rica",
    "And updated to ES6 by Cyril Pereira",
    "",
    "I draw everything on a canvas element byte by byte,",
    "Without using the available drawing methods,",
    "To get a more retro programming feeling :-)",
    "",
    "I drew all the logos and fonts used in this demo",
    "Myself, using Gimp.",
    "",
    "This started as a simple intro to make a twister effect",
    "",
    "Then as Gerion's birthay was coming up,",
    'I thought: "well let\'s make him a birthday present!"',
    "",
    "Then the screen count increased",
    "To have copper bars,",
    "And a starfield,",
    "Because you can't have a proper old school demo",
    "Without any of these right? :-P",
    "",
    "No planning, no graphic artist, no music artist, ...",
    "Feature creep and Trigonometry Failings,",
    " I was afraid I would not make it in time!",
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
    "Title screen:",
    "~~~~~~~~~~~~~",
    "Code: ..................... Asimov          ",
    "Gfx: ...................... Asimov          ",
    "Music: .................... Captain / F-Team",
    "Text: ..................... Asimov          ",
    "",
    "The first screen was the last I worked on :-P",
    "",
    "It started as a starfield with a logo and",
    "A simple left-to-right scroll text,",
    "But that felt a bit empty.",
    "",
    "So I decided to add some old school wireframe vectors",
    "",
    "For the starfield,",
    "I used the old x and y divided by z trick,",
    "But for the vectors I had to look up a proper",
    "perspective projection formula :-P",
    "",
    "Still, it is a bit tilted, so I'll need to improve",
    "That in a future production ...",
    "",
    "The 3D coordinate typing for the letters was tedious!",
    "",
    'I borrowed the famous "space debris" song by Captain',
    "To spice it up! (Captain, I hope you don't mind)",
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
    "Middle screen:",
    "~~~~~~~~~~~~~~~~~",
    "Code: ..................... Asimov",
    "Gfx: ...................... Asimov",
    "Music: .................... Vaskor",
    "Text: ..................... Asimov",
    "",
    "This is the first screen I started working on.",
    "",
    "It was inspired by an old Slipstream intro:",
    "I copied the logo style,",
    "But I changed the sine scroll font style.",
    "",
    'I reused the "taboo" song,',
    "Written by our music artist Vaskor",
    'From the "no requiem" music disk',
    "",
    "I tried to match the copper bars effect,",
    "But it is in fact a bit different.",
    "",
    "The sine scroll is simple but does the job ...",
    "",
    "It is a simple screen overall",
    "That's why I called it the middle screen",
    "Instead of the main screen.",
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
    "Credit screen:",
    "~~~~~~~~~~~~~~",
    "Code: ..................... Asimov                 ",
    "Gfx: ...................... Asimov & Gerion        ",
    "Music: .................... Bosco / Syndrome & Apex",
    "Text: ..................... Asimov                 ",
    "",
    "The busiest screen of this demo I think!",
    "",
    "It all started because ...",
    "I wanted to make a mapped twister effect!",
    "",
    "Then, I though I'd add a vertical credit scroll,",
    "and call it a day, but the screen felt a bit empty",
    "",
    "And as I was watching a lot of Amiga demos on YouTube,",
    "State of the art kept coming up on my feed :-P",
    "",
    "So, I decided to make the bitplane circle effect",
    "To fill the background:",
    "I use a mid point circle algorithm to first draw",
    "Circles then I fill every other circle to get",
    "The pattern for the effect",
    "",
    "There are a few corner cases as I discovered ... ",
    "I did not cover them all,",
    "So I stopped trying to make the pattern thinner :-P",
    "",
    "It was surprisingly easier to do the mapping than",
    "To get the right twisting formula ...",
    "That is why the twister has kind of a big stutter",
    "While rotating ...",
    "",
    "I'll get it right next time!",
    "I guess I need to brush up on my trigonometry :-P",
    "Anyone willing to mentor me?",
    "",
    "The twister's Amiga red and white checkboard pattern",
    "Is also drawn algorithmically.",
    "",
    "To decorate it, I borrowed Gerion's contribution to",
    "THE PARTY 5",
    "His Claudia Schiffer caricature to decorate the twister",
    "",
    'For the music I reused the "critical" song,',
    "Written by Bosco of Syndrome & Apex",
    'From the "Gudule" music disk I coded 27 years ago.',
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
    "+-----------------------------------------------------+",
    "",
    "Thank you if you have read so far,",
    "I did a lot of typing alone,",
    "Without any idea of what to say",
    "But I made it through!",
    "",
    "Thanks to Machi for her patience and support.",
    "",
    "Now, we finally reached the end of this text,",
    "It will loop back unless ...",
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
    "Click to exit the demo!",
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
    "",
    "",
    "",
    "",
    "Click to exit the demo!",
  ];
  let scrollTextPosition = 0;
  let scrollPixelPosition = canvas.height;
  return (_time: number, data: Uint8ClampedArray): boolean => {
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
      const line = scrollText[scrollTextPosition + i].toUpperCase();
      const width = line.length * (fontWidth + fontSpace);
      let lineX = (4 * (canvas.width - (width + 300))) / 2;
      const lineY =
        (scrollPixelPosition + i * (fontHeight + lineSpace)) * canvas.width * 4;
      for (let c of line) {
        const charData = charactersDataMap[c];
        if (c !== " ") {
          for (let row = 0; row < fontHeight; row += 1) {
            const rowPos = lineY + lineX + row * canvas.width * 4;

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
        lineX += (fontWidth + fontSpace) * 4;
      }
    }

    scrollPixelPosition -= 1;
    if (scrollPixelPosition < -(fontHeight + lineSpace)) {
      scrollPixelPosition += fontHeight + lineSpace;
      scrollTextPosition += 1;
      if (scrollTextPosition > scrollText.length) {
        scrollTextPosition = 0;
        scrollPixelPosition = canvas.height;
      }
    }

    return isEffectFinished;
  };
}
