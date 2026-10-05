export class GameState {
  constructor(images) {
    this.spaceImages = images;
    this.listeners = {};
    this.leaders = JSON.parse(localStorage.getItem("leaders-taty4")) || [];

    this.timerID = null;
    this.timerTimeID = null;
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

  emit(eventName, ...args) {
    this.listeners[eventName]?.forEach((callback) => callback(...args));
  }

  resetState() {
    this.counter = 0;
    this.pairs = 0;
    this.firstCard = null;
    this.isBlockFlip = false;
    this.cards = [];
    this.time = 0;
    this.date = this.getCurrentDate();

    clearTimeout(this.timerID);
    clearInterval(this.timerTimeID);

    this.timerID = null;
    this.timerTimeID = null;
  }

  initGame = () => {
    this.resetState();

    const doubleImages = [...this.spaceImages, ...this.spaceImages];
    this.cards = this.shuffle(doubleImages);

    this.timerTimeID = setInterval(() => {
      this.time++;
      const formatedTime = this.formatTime();
      this.emit("time-change", formatedTime);
    }, 1000);

    this.emit("init-game", this.cards);
  };

  formatTime() {
    const min = Math.floor(this.time / 60);
    const sec = this.time % 60;

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

  checkClickedCard = (index) => {
    if (this.isBlockFlip) return;

    this.emit("flip-card", index);

    if (this.firstCard === null) {
      this.firstCard = index;
    } else {
      this.isBlockFlip = true;

      const firstCardData = this.cards[this.firstCard];
      const secondCardData = this.cards[index];

      if (firstCardData.id === secondCardData.id) {
        this.isBlockFlip = false;
        this.firstCard = null;
        this.pairs++;
        this.checkWin();
      } else {
        this.timerID = setTimeout(() => {
          this.emit("close-card", [this.firstCard, index]);
          this.isBlockFlip = false;
          this.firstCard = null;
        }, 1000);
      }
      this.counter++;
      this.emit("statistic-change", {
        counter: this.counter,
        pairs: this.pairs,
        totalPairs: this.spaceImages.length,
      });
    }
  };

  checkWin() {
    if (this.pairs === this.spaceImages.length) {
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
