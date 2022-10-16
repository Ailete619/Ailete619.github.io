import { createScreen } from "./Demos";
import { create3DVectorsStarfieldScrollScreen } from "./screens/3DVectorsStarfieldScroll/3DVectorsStarfieldScrollScreen";
import { createCopperBarsSineScrollScreen } from "./screens/CopperBarsSineScroll/SineScrollCopperBarsScreen";
import { createMappedTwisterBitplaneCirclesCreditScrollScreen } from "./screens/MappedTwisterCreditScrollrBitplaneCircles/MappedTwisterBitplaneCirclesCreditScrollScreen";
import "./style.css";

interface DocumentElementWithFullscreen extends HTMLElement {
  msRequestFullscreen?: () => void;
  mozRequestFullScreen?: () => void;
  webkitRequestFullscreen?: () => void;
}

const canvas = document.createElement("canvas");
document.getElementById("demo")?.appendChild(canvas);
const context = canvas.getContext("2d");
if (context) {
  canvas.width = 1280; // window.innerWidth;
  canvas.height = 800; // window.innerHeight;
}

document
  .getElementById("start-button")
  ?.addEventListener("click", async (_event) => {
    const welcomeScreen = document.getElementById("welcome-screen");
    if (!welcomeScreen) {
      console.error('"#welcome-screen" element not found.');
      return;
    }
    welcomeScreen.style.display = "none";
    const demo = document.getElementById(
      "demo"
    ) as DocumentElementWithFullscreen;
    if (!demo) {
      console.error('"#demo" element not found.');
      return;
    }
    demo.style.display = "grid";
    document.body.style.backgroundColor = "#000000";
    if (demo.requestFullscreen) {
      demo.requestFullscreen();
    } else if (demo.webkitRequestFullscreen) {
      demo.webkitRequestFullscreen();
    } else if (demo.mozRequestFullScreen) {
      demo.mozRequestFullScreen();
    } else if (demo.msRequestFullscreen) {
      demo.msRequestFullscreen();
    } else {
      console.warn("Cannot request fullscreen on this device.");
    }
    const demoCanvas = document.querySelector(
      "#demo canvas"
    ) as HTMLCanvasElement;
    if (!demoCanvas) {
      console.error('"#demo canvas" element not found.');
      return;
    }
    const dx = window.innerWidth / canvas.width;
    const dy = window.innerHeight / canvas.height;
    if (dx > dy) {
      demoCanvas.style.transform = `scale(${dy})`;
    } else {
      demoCanvas.style.transform = `scale(${dx})`;
    }
    const startFirstScreen = createScreen(
      await create3DVectorsStarfieldScrollScreen(canvas),
      50
    );
    const isFirstScreenFinished = await startFirstScreen();
    if (isFirstScreenFinished === true) {
      const startSecondScreen = createScreen(
        await createCopperBarsSineScrollScreen(canvas),
        50
      );
      const isSecondScreenFinished = await startSecondScreen();
      if (isSecondScreenFinished === true) {
        const startThirdScreen = createScreen(
          await createMappedTwisterBitplaneCirclesCreditScrollScreen(canvas),
          50
        );
        const isThirdScreenFinished = await startThirdScreen();
        if (isThirdScreenFinished === true) {
          document.body.style.backgroundColor = "#ffffff";
          welcomeScreen.style.display = "block";
          demo.style.display = "none";
        }
      }
    }
  });
