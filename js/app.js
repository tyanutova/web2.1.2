import WordleWidget from "./WordleWidget.js";
import DiceWidget from "./DiceWidget.js";
import RpsWidget from "./RpsWidget.js";
import ScoreWidget from "./ScoreWidget.js";
import CardGuessWidget from "./CardGuessWidget.js";

const dashboard = document.querySelector(".dashboard");
const widgetSelect = document.querySelector("#addWidget");

const widgets = {
  dice: DiceWidget,
  rps: RpsWidget,
  score: ScoreWidget,
  wordle: WordleWidget,
  card: CardGuessWidget
};

const labels = {
  dice: "Кубик",
  rps: "КНБ",
  score: "Счёт",
  wordle: "Вордли (API)",
  card: "Карты (API)"
};

const allTypes = Object.keys(widgets);
let active = JSON.parse(localStorage.getItem("widgets") || "null");

if (!Array.isArray(active)) {
  active = [...allTypes];
}

active = active.filter((type) => widgets[type]);
if (active.length !== allTypes.length) {
  active = [...allTypes];
}

const mounted = {};

function save() {
  localStorage.setItem("widgets", JSON.stringify(active));
}

function renderSelect() {
  widgetSelect.innerHTML = "<option value=''>Добавить виджет</option>";

  for (const type of allTypes) {
    if (active.includes(type)) continue;

    const option = document.createElement("option");
    option.value = type;
    option.textContent = labels[type];
    widgetSelect.appendChild(option);
  }
}

function mount(type) {
  if (mounted[type]) return;

  const Widget = widgets[type];
  if (!Widget) return;

  const instance = new Widget();
  instance.element.classList.add(`widget--${type}`);
  dashboard.appendChild(instance.element);
  mounted[type] = instance;
}

window.removeWidget = function(type) {
  delete mounted[type];
  active = active.filter((x) => x !== type);
  save();
  renderSelect();
};

widgetSelect.addEventListener("change", (e) => {
  const type = e.target.value;
  if (!type || !widgets[type] || active.includes(type)) return;

  active.push(type);
  save();
  mount(type);
  renderSelect();
  widgetSelect.value = "";
});

for (const type of active) {
  mount(type);
}

save();
renderSelect();
