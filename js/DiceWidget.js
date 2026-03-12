import BaseWidget from "./BaseWidget.js";

export default class DiceWidget extends BaseWidget {
  constructor() {
    super("dice");
    this.rollTimer = null;
    this.roll = this.roll.bind(this);
    this.render();
  }

  render() {
    this.result = document.createElement("div");
    this.result.classList.add("dice");
    this.result.textContent = "1";

    this.btn = document.createElement("button");
    this.btn.textContent = "Roll";
    this.btn.addEventListener("click", this.roll);

    this.element.append(this.result, this.btn);
  }

  roll() {
    if (this.rollTimer) return;

    this.btn.disabled = true;
    this.result.classList.add("rolling");

    this.rollTimer = setTimeout(() => {
      const value = Math.floor(Math.random() * 6) + 1;
      this.result.textContent = value;
      this.result.classList.remove("rolling");
      this.btn.disabled = false;
      this.rollTimer = null;

      if (value === 6) {
        window.dispatchEvent(new CustomEvent("game:win"));
      }
    }, 240);
  }

  removeListeners() {
    this.btn?.removeEventListener("click", this.roll);
    if (this.rollTimer) {
      clearTimeout(this.rollTimer);
      this.rollTimer = null;
    }
  }
}
