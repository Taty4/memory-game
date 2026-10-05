export class View {
  constructor() {
    this.cards = [];
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

  emit(eventName, data) {
    if (this.listeners[eventName]) {
      this.listeners[eventName].forEach((callback) => {
        callback(data);
      });
    }
  }

  renderGame = (cards) => {
    this.cards = cards;
    this.app.replaceChildren();

    const header = this.renderHeader();
    const scoreBlock = this.renderScoreBlocke();

    this.board = this.createElement({
      tag: "div",
      className: "game-board",
    });

    this.cards.forEach((card) => {
      this.board.append(this.createCard(card));
    });

    this.board.addEventListener("click", (event) => {
      const clickedCard = event.target.closest(".card");

      if (clickedCard && !clickedCard.classList.contains("flipped")) {
        this.emit("card-clicked", clickedCard);
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

  closeCard = (cards) => {
    cards.forEach((card) => {
      card.classList.remove("flipped");
    });
  };

  flipCard = (card) => {
    card.classList.add("flipped");
  };

  updateStatistic = (data) => {
    this.pairsValue.textContent = `${data.pairs} / 8`;
    this.scoreValue.textContent = data.counter;
  };

  updateTime = (data) => {
    this.timeValue.textContent = data;
  };

  createCard(card) {
    const cardWrapper = this.createElement({ tag: "div", className: "card" });
    cardWrapper.dataset.id = card.id;

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
      className: "hrader-controls",
    });
    const btnNewGame = this.renderBtnNewGame();
    const btnLeader = this.createElement({
      tag: "button",
      className: "header-btn header-btn-Leader",
      text: "Leaderboard",
    });

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

    btn.addEventListener("click", () => this.emit("reset-clicked"));

    return btn;
  }

  renderScoreBlocke() {
    const block = this.createElement({
      tag: "div",
      className: "game-statistic",
    });

    const pairs = this.createElement({
      tag: "p",
      className: "statistic-pairs",
      text: "Pairs Found: ",
    });

    this.pairsValue = this.createElement({
      tag: "span",
      className: "pairs-value",
      text: "0 / 8",
    });

    pairs.append(this.pairsValue);

    const time = this.createElement({
      tag: "p",
      className: "statistic-time",
      text: "Time: ",
    });

    this.timeValue = this.createElement({
      tag: "span",
      className: "time-value",
      text: "00:00",
    });

    time.append(this.timeValue);

    const score = this.createElement({
      tag: "p",
      className: "statistic-score",
      text: "Score: ",
    });

    this.scoreValue = this.createElement({
      tag: "span",
      className: "score-value",
      text: "0",
    });

    score.append(this.scoreValue);

    block.append(pairs, time, score);
    return block;
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
      text: `Тебе понадобилось ${data.counter} ходов и столько минут для победы`,
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
      text: "Таблица пебедителей!",
    });

    this.modalContent.append(title);

    const table = this.createElement({
      tag: "div",
      className: "table-modal",
    });

    data.forEach((res, index) => {
      const stroke = this.createElement({
        tag: "div",
        className: "modal-stroke",
      });

      const ceilNumber = this.createElement({
        tag: "p",
        className: "modal-ceil",
        text: `${index + 1}`,
      });

      const ceilCount = this.createElement({
        tag: "p",
        className: "modal-ceil",
        text: res.count,
      });
      const ceilTime = this.createElement({
        tag: "p",
        className: "modal-ceil",
        text: res.time,
      });
      const ceilDate = this.createElement({
        tag: "p",
        className: "modal-ceil",
        text: res.date,
      });
      stroke.append(ceilNumber, ceilCount, ceilTime, ceilDate);
      table.append(stroke);
    });

    this.modalContent.append(table);
  };

  createElement(options) {
    const element = document.createElement(options.tag);
    element.className = options.className;
    if (options.text) {
      element.textContent = options.text;
    }

    return element;
  }
}
