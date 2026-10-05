export class View {
  constructor() {
    this.app = this.createElement({ tag: "div", className: "app" });
    document.body.prepend(this.app);
    this.listeners = {};
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

    this.board = this.createElement({
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

    this.modal = this.renderModal();

    this.app.append(header, scoreBlock, this.board, this.modal);
  };

  renderModal() {
    const modal = this.createElement({ tag: "dialog", className: "modal" });

    this.modalContent = this.createElement({
      tag: "div",
      className: "modal-content",
    });

    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        modal.close();
      }
    });

    modal.append(this.modalContent);
    return modal;
  }

  renderBtnCloseModal() {
    const closeModal = this.createElement({
      tag: "button",
      className: "close-modal",
      text: "Close",
    });

    closeModal.addEventListener("click", () => this.modal.close());

    return closeModal;
  }

  closeCard = (indexes) => {
    indexes.forEach((index) => {
      this.cards[index]?.classList.remove("flipped");
    });
  };

  flipCard = (index) => {
    this.cards[index]?.classList.add("flipped");
  };

  updateStatistic = (data) => {
    this.pairsValue.textContent = `${data.pairs} / ${data.totalPairs}`;
    this.scoreValue.textContent = data.counter;
  };

  updateTime = (data) => {
    this.timeValue.textContent = data;
  };

  createCard(card, index) {
    const cardWrapper = this.createElement({ tag: "div", className: "card" });
    cardWrapper.dataset.id = card.id;
    cardWrapper.dataset.index = index;

    const cardFront = this.createElement({
      tag: "div",
      className: "card-front",
    });
    const img = this.createElement({ tag: "img", className: "card-img" });
    img.src = card.imgSrc;
    cardFront.append(img);

    const cardBack = this.createElement({
      tag: "div",
      className: "card-back",
      text: "back",
    });

    cardWrapper.append(cardFront, cardBack);

    return cardWrapper;
  }

  renderHeader() {
    const element = this.createElement({ tag: "header", className: "header" });
    const nameGame = this.createElement({
      tag: "h1",
      className: "header-name",
      text: "Memory Game",
    });
    const controls = this.createElement({
      tag: "div",
      className: "header-controls",
    });
    const btnNewGame = this.renderBtnNewGame();
    const btnLeader = this.createElement({
      tag: "button",
      className: "header-btn header-btn-leader",
      text: "Leaderboard",
    });

    btnLeader.type = "button";

    btnLeader.addEventListener("click", () => this.emit("leaders-clicked"));

    controls.append(btnNewGame, btnLeader);
    element.append(nameGame, controls);
    return element;
  }

  renderBtnNewGame() {
    const btn = this.createElement({
      tag: "button",
      className: "header-btn btn-new-game",
      text: "New Game",
    });

    btn.type = "button";

    btn.addEventListener("click", () => this.emit("reset-clicked"));

    return btn;
  }

  renderScoreBlock() {
    const block = this.createElement({
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

  createStatisticRow(labelText, initialValue, className) {
    const row = this.createElement({
      tag: "p",
      className: `statistic-${className}`,
      text: labelText,
    });

    const valueSpan = this.createElement({
      tag: "span",
      className: `${className}-value`,
      text: initialValue,
    });

    row.append(valueSpan);

    return { row, valueSpan };
  }

  openModalWin = (data) => {
    this.modalContent.replaceChildren();
    this.modal.showModal();

    const title = this.createElement({
      tag: "p",
      className: "title-modal",
      text: "Поздравляю! Ты выиграл!",
    });

    const res = this.createElement({
      tag: "p",
      className: "result-modal",
      text: `Тебе понадобилось ходов: ${data.count}, а время игры составило: ${data.time}`,
    });

    const offer = this.createElement({
      tag: "p",
      className: "offer-modal",
      text: `Хочешь сыграть еще раз?`,
    });

    const blockControlModal = this.createElement({
      tag: "div",
      className: "controls-modal",
    });

    blockControlModal.append(
      this.renderBtnNewGame(),
      this.renderBtnCloseModal(),
    );
    this.modalContent.append(title, res, offer, blockControlModal);
  };

  openModalLeaders = (data) => {
    this.modalContent.replaceChildren();
    this.modal.showModal();

    const title = this.createElement({
      tag: "p",
      className: "title-modal",
      text: "Таблица победителей!",
    });

    const table = this.createElement({
      tag: "div",
      className: "table-modal",
    });

    data.forEach(({ count, time, date }, index) => {
      const stroke = this.createElement({
        tag: "div",
        className: "modal-stroke",
      });

      stroke.append(
        this.createCell(index + 1),
        this.createCell(count),
        this.createCell(time),
        this.createCell(date),
      );

      table.append(stroke);
    });

    this.modalContent.append(title, table, this.renderBtnCloseModal());
  };

  createCell(text) {
    return this.createElement({
      tag: "p",
      className: "modal-ceil",
      text: String(text),
    });
  }

  createElement(options) {
    const element = document.createElement(options.tag);

    if (options.className) element.className = options.className;
    if (options.text) element.textContent = options.text;

    const { tag, className, text, ...attrs } = options;
    Object.assign(element, attrs);

    return element;
  }
}
