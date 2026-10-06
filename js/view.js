import { createElement } from "./utils.js";
import { GameModal } from "./modal.js";
import { SoundFX } from "./sound.js";

export class View {
  constructor() {
    this.app = createElement({ tag: "div", className: "app" });
    document.body.prepend(this.app);
    this.listeners = {};
    this.modalComponent = new GameModal({
      onNewGame: () => this.emit("reset-clicked"),
    });
  }

  on(eventName, callback) {
    if (!this.listeners[eventName]) {
      this.listeners[eventName] = [];
    }
    this.listeners[eventName].push(callback);
  }

  emit(eventName, ...args) {
    this.listeners[eventName]?.forEach((callback) => callback(...args));
  }

  renderGame = (cards) => {
    this.app.replaceChildren();

    this.cards = [];

    const header = this.renderHeader();
    const scoreBlock = this.renderScoreBlock();
    const controlsBlock = this.renderControlsButtons();

    this.board = createElement({
      tag: "div",
      className: "game-board",
    });

    cards.forEach((card, index) => {
      const cardElement = this.createCard(card, index);

      this.cards.push(cardElement);
      this.board.append(cardElement);
    });

    this.board.addEventListener("click", (event) => {
      const clickedCard = event.target.closest(".card");

      if (clickedCard && !clickedCard.classList.contains("flipped")) {
        console.log(clickedCard);
        this.emit("card-clicked", Number(clickedCard.dataset.index));
      }
    });

    this.modal = this.modalComponent.getElement();

    this.app.append(header, scoreBlock, controlsBlock, this.board, this.modal);
  };

  renderHeader() {
    const element = createElement({ tag: "header", className: "header" });
    const nameGame = createElement({
      tag: "h1",
      className: "header-name",
      text: "Memory Game",
    });

    element.append(nameGame);
    return element;
  }

  renderControlsButtons() {
    const controls = createElement({
      tag: "div",
      className: "header-controls",
    });
    const btnNewGame = createElement({
      tag: "button",
      className: "header-btn btn-new-game",
      text: "New Game",
      type: "button",
    });

    const btnLeader = createElement({
      tag: "button",
      className: "header-btn header-btn-leader",
      text: "Leaderboard",
      type: "button",
    });

    btnNewGame.addEventListener("click", () => this.emit("reset-clicked"));
    btnLeader.addEventListener("click", () => this.emit("leaders-clicked"));

    controls.append(btnNewGame, btnLeader);
    return controls;
  }

  createCard(card, index) {
    const cardWrapper = createElement({ tag: "div", className: "card" });
    cardWrapper.dataset.id = card.id;
    cardWrapper.dataset.index = index;

    const cardFront = createElement({
      tag: "div",
      className: "card-front",
    });
    const img = createElement({
      tag: "img",
      className: "card-img",
      src: card.imgSrc,
      alt: "img planet",
      draggable: false,
    });
    cardFront.append(img);

    const cardBack = createElement({
      tag: "div",
      className: "card-back",
    });
    const imgBack = createElement({
      tag: "img",
      className: "card-img",
      src: "./assets/images/back.webp",
      alt: "card back",
      draggable: false,
    });

    cardBack.append(imgBack);

    cardWrapper.append(cardFront, cardBack);

    return cardWrapper;
  }

  closeCard = (indexes) => {
    indexes.forEach((index) => {
      this.cards[index]?.classList.remove("flipped");
    });
  };

  flipCard = (index) => {
    SoundFX.play("click");
    this.cards[index]?.classList.add("flipped");
  };

  validPairs = (indexes) => {
    SoundFX.play("success");
    indexes.forEach((index) => {
      this.cards[index]?.classList.add("success");
      setTimeout(() => {
        this.cards[index]?.classList.remove("success");
      }, 400);
    });
  };

  invalidPairs = (indexes) => {
    SoundFX.play("error");
    indexes.forEach((index) => {
      this.cards[index]?.classList.add("error");
      setTimeout(() => {
        this.cards[index]?.classList.remove("error");
      }, 400);
    });
  };

  renderScoreBlock() {
    const block = createElement({
      tag: "div",
      className: "game-statistic",
    });

    const pairsData = this.createStatisticRow(
      "Pairs Found: ",
      "0 / 8",
      "pairs",
    );
    const timeData = this.createStatisticRow("Time: ", "00:00", "time");
    const scoreData = this.createStatisticRow("Score: ", "0", "score");

    this.pairsValue = pairsData.valueSpan;
    this.timeValue = timeData.valueSpan;
    this.scoreValue = scoreData.valueSpan;

    block.append(pairsData.row, timeData.row, scoreData.row);

    return block;
  }

  updateStatistic = (data) => {
    this.pairsValue.textContent = `${data.pairs} / ${data.totalPairs}`;
    this.scoreValue.textContent = data.counter;
  };

  updateTime = (data) => {
    this.timeValue.textContent = data;
  };

  createStatisticRow(labelText, initialValue, className) {
    const row = createElement({
      tag: "p",
      className: `statistic-${className}`,
      text: labelText,
    });

    const valueSpan = createElement({
      tag: "span",
      className: `${className}-value`,
      text: initialValue,
    });

    row.append(valueSpan);

    return { row, valueSpan };
  }

  openModalWin = (data) => {
    this.modalComponent.openWin(data);
  };

  openModalLeaders = (data) => {
    this.modalComponent.openLeaders(data);
  };
}
