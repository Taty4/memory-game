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
      text: "Close",
    });
    btn.addEventListener("click", () => this.close());
    return btn;
  }

  renderBtnNewGame() {
    const btn = createElement({
      tag: "button",
      className: "btn-new-game",
      text: "Play again",
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
      text: "Congratulations! You won!",
    });

    const moveInfo = createElement({
      tag: "p",
      className: "result-modal",
      text: `Number of moves: ${data.count}`,
    });

    const timeInfo = createElement({
      tag: "p",
      className: "result-modal",
      text: `Playtime: ${data.time}`,
    });

    const offer = createElement({
      tag: "p",
      className: "offer-modal",
      text: `Do you want to play again?`,
    });

    const blockControlModal = createElement({
      tag: "div",
      className: "controls-modal",
    });

    blockControlModal.append(
      this.renderBtnNewGame(),
      this.renderBtnCloseModal(),
    );
    this.modalContent.append(
      title,
      moveInfo,
      timeInfo,
      offer,
      blockControlModal,
    );
  }

  openLeaders(data) {
    this.modalContent.replaceChildren();
    this.open();

    const title = createElement({
      tag: "p",
      className: "title-modal",
      text: "Leaderboard",
    });

    const table = createElement({
      tag: "div",
      className: "table-modal",
    });

    const tableHeader = createElement({
      tag: "div",
      className: "table-header modal-stroke",
    });

    tableHeader.append(
      this.createCell("Number"),
      this.createCell("Moves"),
      this.createCell("Time"),
      this.createCell("Date"),
    );

    table.append(tableHeader);

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

    const noLeadersInfo = createElement({
      tag: "p",
      className: "modal-no-leeders",
      text: "Complete your first game to see your score here!",
    });

    if (data.length === 0) {
      this.modalContent.append(
        title,
        noLeadersInfo,
        this.renderBtnCloseModal(),
      );
    } else {
      this.modalContent.append(title, table, this.renderBtnCloseModal());
    }
  }
}
