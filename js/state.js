export class GameState {
  constructor(images) {
    this.spaceImages = images;
    this.counter = 0;
    this.pairs = 0;
    this.firstCard = null;
    this.isBlockFlip = false;
    this.cards = [];
    this.listeners = {};
    this.timerID = null;
    this.leaders = JSON.parse(localStorage.getItem("leaders-taty4")) || [];
    this.timerTimeID = null;
    this.time = 0;
  }

  saveLeaders(data) {
    this.leaders.push(data);
    localStorage.setItem("leaders-taty4", JSON.stringify(this.leaders));
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

  initGame = () => {
    const doubleImages = [...this.spaceImages, ...this.spaceImages];
    this.cards = this.shuffle(doubleImages);

    this.counter = 0;
    this.pairs = 0;
    this.firstCard = null;
    this.isBlockFlip = false;
    clearTimeout(this.timerID);
    clearInterval(this.timerTimeID);
    this.timerID = null;
    this.timerTimeID = null;
    this.time = 0;
    this.date = this.getCurrentDate();
    this.timerTimeID = setInterval(() => {
      this.time++;
      const formatedTime = this.formatTime();
      this.emit("time-change", formatedTime);
    }, 1000);

    this.emit("init-game", this.cards);
  };

  formatTime() {
    const min = Math.floor(this.time / 60);
    const sec = min === 0 ? this.time : this.time % min;

    return `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  }

  getCurrentDate() {
    const currentDate = new Date();
    return currentDate
      .toLocaleString("ru-RU", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
      .replace("г.", "");
  }

  shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  checkClickedCard = (card) => {
    if (this.isBlockFlip) return;

    this.emit("flip-card", card);

    if (!this.firstCard) {
      this.firstCard = card;
    } else {
      this.isBlockFlip = true;

      if (this.firstCard.dataset.id === card.dataset.id) {
        this.isBlockFlip = false;
        this.firstCard = null;
        this.pairs++;
        this.checkWin();
      } else {
        this.timerID = setTimeout(() => {
          this.emit("close-card", [this.firstCard, card]);
          this.isBlockFlip = false;
          this.firstCard = null;
        }, 1000);
      }
      this.counter++;
      this.emit("statistic-change", {
        counter: this.counter,
        pairs: this.pairs,
      });
    }
  };

  checkWin() {
    if (this.pairs === 8) {
      const dataResult = {
        count: this.counter,
        date: this.date,
        time: this.formatTime(),
      };
      this.saveLeaders(dataResult);
      this.emit("win", dataResult);
    }
  }
}
