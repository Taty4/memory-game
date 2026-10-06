import { createElement } from "./utils.js";

export class GameModal {
  constructor({ onNewGame }) {
    this.onNewGame = onNewGame;

    this.modal = null;
    this.modalContent = null;
    this.modalTimeout = null;
    this.init();
  }

  init() {
    this.modal = createElement({ tag: "dialog", className: "modal" });
    this.modalContent = createElement({
      tag: "div",
      className: "modal-content",
    });

    this.modal.addEventListener("click", (event) => {
      if (event.target === this.modal) {
        this.close();
      }
    });

    this.modal.append(this.modalContent);
  }

  getElement() {
    return this.modal;
  }

  open() {
    this.modal.showModal();
  }

  close() {
    this.modal.close();
  }

  createCell(text) {
    return createElement({
      tag: "p",
      className: "modal-ceil",
      text: String(text),
    });
  }

  renderBtnCloseModal() {
    const btn = createElement({
      tag: "button",
      className: "btn-close",
      text: "Закрыть",
    });
    btn.addEventListener("click", () => this.close());
    return btn;
  }

  renderBtnNewGame() {
    const btn = createElement({
      tag: "button",
      className: "btn-new-game",
      text: "Играть снова",
    });
    btn.addEventListener("click", () => {
      this.close();
      if (this.modalTimeout) clearTimeout(this.modalTimeout);
      this.onNewGame();
    });
    return btn;
  }

  openWin(data) {
    this.modalContent.replaceChildren();
    this.modalTimeout = setTimeout(() => {
      this.open();
    }, 400);

    const title = createElement({
      tag: "p",
      className: "title-modal",
      text: "Поздравляю! Ты выиграл!",
    });

    const res = createElement({
      tag: "p",
      className: "result-modal",
      text: `Тебе понадобилось ходов: ${data.count}, а время игры составило: ${data.time}`,
    });

    const offer = createElement({
      tag: "p",
      className: "offer-modal",
      text: `Хочешь сыграть еще раз?`,
    });

    const blockControlModal = createElement({
      tag: "div",
      className: "controls-modal",
    });

    blockControlModal.append(
      this.renderBtnNewGame(),
      this.renderBtnCloseModal(),
    );
    this.modalContent.append(title, res, offer, blockControlModal);
  }

  openLeaders(data) {
    this.modalContent.replaceChildren();
    this.open();

    const title = createElement({
      tag: "p",
      className: "title-modal",
      text: "Таблица победителей!",
    });

    const table = createElement({
      tag: "div",
      className: "table-modal",
    });

    data.forEach(({ count, time, date }, index) => {
      const stroke = createElement({ tag: "div", className: "modal-stroke" });

      stroke.append(
        this.createCell(index + 1),
        this.createCell(count),
        this.createCell(time),
        this.createCell(date),
      );

      table.append(stroke);
    });

    this.modalContent.append(title, table, this.renderBtnCloseModal());
  }
}
