import BaseWidget from "./BaseWidget.js";

const CHOICES = ["Камень", "Ножницы", "Бумага"];

export default class RpsWidget extends BaseWidget {
  constructor() {
    super("rps");
    this.playRound = this.playRound.bind(this);
    this.render();
  }

  render() {
    const title = document.createElement("h3");
    title.textContent = "Камень-Ножницы-Бумага";

    this.info = document.createElement("p");
    this.info.classList.add("muted");
    this.info.textContent = "Победа даёт +1 к счёту.";

    this.controls = document.createElement("div");
    this.controls.classList.add("widget-controls", "rps-controls");

    this.buttons = CHOICES.map((choice) => {
      const btn = document.createElement("button");
      btn.textContent = choice;
      btn.dataset.choice = choice;
      btn.addEventListener("click", this.playRound);
      this.controls.appendChild(btn);
      return btn;
    });

    this.result = document.createElement("p");
    this.result.classList.add("rps-result");

    this.element.append(title, this.info, this.controls, this.result);
  }

  playRound(e) {
    const userChoice = e.currentTarget.dataset.choice;
    const botChoice = CHOICES[Math.floor(Math.random() * CHOICES.length)];

    if (userChoice === botChoice) {
      this.result.textContent = `Ничья: ${userChoice} = ${botChoice}`;
      return;
    }

    const win =
      (userChoice === "Камень" && botChoice === "Ножницы") ||
      (userChoice === "Ножницы" && botChoice === "Бумага") ||
      (userChoice === "Бумага" && botChoice === "Камень");

    if (win) {
      this.result.textContent = `Победа: ${userChoice} vs ${botChoice}`;
      window.dispatchEvent(new CustomEvent("game:win"));
    } else {
      this.result.textContent = `Поражение: ${userChoice} vs ${botChoice}`;
    }
  }

  removeListeners() {
    this.buttons?.forEach((btn) => btn.removeEventListener("click", this.playRound));
  }
}
