import BaseWidget from "./BaseWidget.js";

export default class WordleWidget extends BaseWidget {
  constructor() {
    super("wordle");
    this.secretWord = "";
    this.attempts = 0;
    this.isReady = false;
    this.resetTimer = null;

    this.handleSubmit = this.handleSubmit.bind(this);
    this.render();
    this.loadWord();
  }

  async fetchWord() {
    const res = await fetch("https://fish-text.ru/get?format=json&type=word&number=120");
    const data = await res.json();
    const text = String(data.text || "").toLowerCase();

    return text
      .replace(/[.,!?;:()\-]/g, " ")
      .split(/\s+/)
      .find((word) => /^[а-яё]{5}$/i.test(word));
  }

  async loadWord() {
    this.isReady = false;
    this.input.disabled = true;
    this.submitBtn.disabled = true;


    try {
      const word = await this.fetchWord();
      if (!word) throw new Error("no-word");

      this.secretWord = word;
      this.isReady = true;
      this.feedback.textContent = "";
      this.input.disabled = false;
      this.submitBtn.disabled = false;
      this.input.focus();
    } catch (_) {
    }
  }

  render() {
    const title = document.createElement("h3");
    title.textContent = "Вордли";

    const hint = document.createElement("p");
    hint.classList.add("muted");
    hint.textContent = "Угадайте слово из 5 букв. 6 попыток.";

    this.form = document.createElement("form");
    this.form.classList.add("wordle-form");

    this.input = document.createElement("input");
    this.input.type = "text";
    this.input.maxLength = 5;
    this.input.placeholder = "Введите 5 букв";
    this.input.autocomplete = "off";

    this.submitBtn = document.createElement("button");
    this.submitBtn.type = "submit";
    this.submitBtn.textContent = "Проверить";

    this.feedback = document.createElement("p");
    this.feedback.classList.add("wordle-feedback");

    this.list = document.createElement("div");
    this.list.classList.add("wordle-attempts");

    this.form.append(this.input, this.submitBtn);
    this.element.append(title, hint, this.form, this.feedback, this.list);
    this.form.addEventListener("submit", this.handleSubmit);
  }

  handleSubmit(e) {
    e.preventDefault();
    if (!this.isReady) return;

    const guess = this.input.value.trim().toLowerCase();
    if (!/^[а-яё]{5}$/i.test(guess)) {
      this.feedback.textContent = "Нужно 5 русских букв.";
      return;
    }

    this.attempts += 1;
    const row = document.createElement("div");
    row.className = "attempt-row";

    for (let i = 0; i < 5; i += 1) {
      const cell = document.createElement("span");
      cell.className = "attempt-cell";
      cell.textContent = guess[i];

      if (guess[i] === this.secretWord[i]) {
        cell.classList.add("correct");
      } else if (this.secretWord.includes(guess[i])) {
        cell.classList.add("present");
      } else {
        cell.classList.add("absent");
      }

      row.appendChild(cell);
    }

    this.list.appendChild(row);

    if (guess === this.secretWord) {
      this.feedback.textContent = "Победа";
      window.dispatchEvent(new CustomEvent("game:win"));
      this.resetSoon(900);
      return;
    }

    if (this.attempts >= 6) {
      this.feedback.textContent = `Слово: ${this.secretWord}`;
      this.resetSoon(1400);
      return;
    }

    this.feedback.textContent = `Осталось: ${6 - this.attempts}`;
    this.input.value = "";
    this.input.focus();
  }

  resetSoon(delay) {
    this.input.disabled = true;
    this.submitBtn.disabled = true;

    this.resetTimer = setTimeout(() => {
      this.attempts = 0;
      this.list.innerHTML = "";
      this.input.value = "";
      this.loadWord();
    }, delay);
  }

  removeListeners() {
    this.form?.removeEventListener("submit", this.handleSubmit);
    if (this.resetTimer) clearTimeout(this.resetTimer);
  }
}
