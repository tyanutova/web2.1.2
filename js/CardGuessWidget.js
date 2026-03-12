import BaseWidget from "./BaseWidget.js";

const SUITS = [
  { name: "HEARTS", label: "♥", color: "red" },
  { name: "DIAMONDS", label: "♦", color: "red" },
  { name: "CLUBS", label: "♣", color: "black" },
  { name: "SPADES", label: "♠", color: "black" }
];

export default class CardGuessWidget extends BaseWidget {
  constructor() {
    super("card");
    this.currentColor = null;
    this.currentSuitLabel = "?";

    this.guessRed = this.guessRed.bind(this);
    this.guessBlack = this.guessBlack.bind(this);
    this.loadCard = this.loadCard.bind(this);

    this.render();
    this.loadCard();
  }

  render() {
    const title = document.createElement("h3");
    title.textContent = "Угадай цвет карты";

    const text = document.createElement("p");
    text.className = "muted";
    text.textContent = "Угадай цвет карты.";

    this.card = document.createElement("div");
    this.card.className = "card-preview";

    const controls = document.createElement("div");
    controls.className = "widget-controls";

    this.redBtn = document.createElement("button");
    this.redBtn.type = "button";
    this.redBtn.textContent = "Красная";
    this.redBtn.addEventListener("click", this.guessRed);

    this.blackBtn = document.createElement("button");
    this.blackBtn.type = "button";
    this.blackBtn.textContent = "Чёрная";
    this.blackBtn.addEventListener("click", this.guessBlack);

    this.nextBtn = document.createElement("button");
    this.nextBtn.type = "button";
    this.nextBtn.textContent = "Новая карта";
    this.nextBtn.addEventListener("click", this.loadCard);

    this.result = document.createElement("p");
    this.result.className = "rps-result";

    controls.append(this.redBtn, this.blackBtn, this.nextBtn);
    this.element.append(title, text, this.card, controls, this.result);
  }

  getRandomCard() {
    return SUITS[Math.floor(Math.random() * SUITS.length)];
  }

  loadCard() {
    this.currentColor = null;
    this.currentSuitLabel = "?";
    this.result.textContent = "";
    this.card.textContent = this.currentSuitLabel;

    this.redBtn.disabled = true;
    this.blackBtn.disabled = true;
    this.nextBtn.disabled = true;

    const cardData = this.getRandomCard();
    this.currentColor = cardData.color;
    this.currentSuitLabel = cardData.label;
    this.card.style.color = "whitesmoke";
    this.redBtn.disabled = false;
    this.blackBtn.disabled = false;
    this.nextBtn.disabled = true;
  }

  checkGuess(color) {
    if (!this.currentColor) return;

    this.card.textContent = this.currentSuitLabel;
    this.card.style.color = this.currentColor === "red" ? "tomato" : "whitesmoke";

    if (color === this.currentColor) {
      this.result.textContent = "Победа";
      window.dispatchEvent(new CustomEvent("game:win"));
    } else {
      this.result.textContent = "Проигрыш";
    }

    this.redBtn.disabled = true;
    this.blackBtn.disabled = true;
    this.nextBtn.disabled = false;
  }

  guessRed() {
    this.checkGuess("red");
  }

  guessBlack() {
    this.checkGuess("black");
  }

  removeListeners() {
    this.redBtn?.removeEventListener("click", this.guessRed);
    this.blackBtn?.removeEventListener("click", this.guessBlack);
    this.nextBtn?.removeEventListener("click", this.loadCard);
  }
}
