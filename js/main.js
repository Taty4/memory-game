import { GameState } from "./state.js";
import { View } from "./view.js";

const UNIQUE_IMAGES = [
  { id: "mercury", imgSrc: "./assets/images/planet_1.webp" },
  { id: "venus", imgSrc: "./assets/images/planet_2.webp" },
  { id: "earth", imgSrc: "./assets/images/planet_3.webp" },
  { id: "jupiter", imgSrc: "./assets/images/planet_4.webp" },
  { id: "uranus", imgSrc: "./assets/images/planet_5.webp" },
  { id: "saturn ", imgSrc: "./assets/images/planet_6.webp" },
  { id: "mars", imgSrc: "./assets/images/planet_7.webp" },
  { id: "neptune", imgSrc: "./assets/images/planet_8.webp" },
];

const state = new GameState(UNIQUE_IMAGES);
const view = new View();

state.on("flip-card", view.flipCard);
state.on("close-card", view.closeCard);
state.on("statistic-change", view.updateStatistic);
state.on("time-change", view.updateTime);
state.on("init-game", view.renderGame);
state.on("win", view.openModalWin);
state.on("valid-pairs", view.validPairs);
state.on("invalid-pairs", view.invalidPairs);

view.on("leaders-clicked", () => view.openModalLeaders(state.leaders));
view.on("card-clicked", state.checkClickedCard);
view.on("reset-clicked", state.initGame);

state.initGame();
