import BaseWidget from "./BaseWidget.js";

export default class ScoreWidget extends BaseWidget {
  constructor() {
    super("score");
    this.score = Number(localStorage.getItem("score") || "0");
    if (!Number.isFinite(this.score) || this.score < 0) {
      this.score = 0;
    }

    this.onWin = this.onWin.bind(this);
    this.onReset = this.onReset.bind(this);
    this.render();

    window.addEventListener("game:win", this.onWin);
  }

  render() {
    const title = document.createElement("h3");
    title.textContent = "Счёт";

    this.text = document.createElement("p");
    this.text.classList.add("score-value");
    this.text.textContent = `Побед: ${this.score}`;

    this.resetBtn = document.createElement("button");
    this.resetBtn.type = "button";
    this.resetBtn.textContent = "Сброс";
    this.resetBtn.addEventListener("click", this.onReset);

    this.element.append(title, this.text, this.resetBtn);
  }

  onWin() {
    this.score += 1;
    localStorage.setItem("score", String(this.score));
    this.text.textContent = `Побед: ${this.score}`;
  }

  onReset() {
    this.score = 0;
    localStorage.setItem("score", "0");
    this.text.textContent = "Побед: 0";
  }

  removeListeners() {
    window.removeEventListener("game:win", this.onWin);
    this.resetBtn?.removeEventListener("click", this.onReset);
  }
}
