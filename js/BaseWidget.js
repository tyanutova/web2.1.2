export default class BaseWidget {
  constructor(type) {
    this.type = type;
    this.element = document.createElement("div");
    this.element.className = "widget";

    this.onDelete = () => this.destroy();

    this.deleteBtn = document.createElement("button");
    this.deleteBtn.textContent = "X";
    this.deleteBtn.className = "delete";
    this.deleteBtn.addEventListener("click", this.onDelete);

    this.element.appendChild(this.deleteBtn);
  }

  destroy() {
    this.deleteBtn.removeEventListener("click", this.onDelete);
    this.removeListeners?.();
    this.element.remove();
    window.removeWidget(this.type);
  }
}
