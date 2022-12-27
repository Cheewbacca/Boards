const layouts = Array.from(document.querySelectorAll(".layout__container"));
const dimensionsContent = document.getElementById("dimensions");

let currentLayout, lastLayout;

let sidesAmount = document.querySelectorAll(
  "#dimensions .layout__container .side__input input"
).length;

let result = {};

const updateResult = () => {
  const newResult = Object.values(result).reduce((acc, el) => (acc += el), 0);
  document.getElementById("result").innerHTML = newResult;
};

const changeLayout = (radio) => {
  radio.addEventListener("click", (e) => {
    const layoutName = `input#${e.currentTarget.dataset.attr}`;

    if (lastLayout === layoutName) {
      return;
    }

    lastLayout = layoutName;

    layouts.map((layout) => layout.classList.remove("active"));

    const radioInput = document.querySelector(layoutName);

    radioInput.click();

    currentLayout = radio.cloneNode(true);
    dimensionsContent.innerHTML = "";
    dimensionsContent.appendChild(currentLayout);
    radio.classList.add("active");
    currentLayout.classList.add("active");
    currentLayout.classList.add("layout_preview");
    dimensionsContent.scrollIntoView({ behavior: "smooth" });

    const slides = document.getElementById("additional_sides");
    while (slides.firstChild) {
      slides.removeChild(slides.firstChild);
    }

    sidesAmount = document.querySelectorAll(
      "#dimensions .layout__container .side__input input"
    ).length;
  });
};

layouts.map(changeLayout);

function createNewInput() {
  const template = document.createElement("template");
  const html = `<div class="side static_side">
    <div>
      <div>Side ${sidesAmount + 1}</div>
      <div class="side__input">
        <input type="number" min="0" value="0" name="side_add_${
          sidesAmount + 1
        }" />
        <p>Feet</p>
      </div>
    </div>
    <button class="remove_btn" onclick="removeButton(event)" data-attr="${
      sidesAmount + 1
    }">Remove</button>
  </div>`;
  template.innerHTML = html;
  sidesAmount += 1;
  return template.content.firstChild;
}

const addButton = document.querySelector('button[name="add_side"]');

addButton.addEventListener("click", (e) => {
  e.preventDefault();
  const newInput = createNewInput();
  document.getElementById("additional_sides").appendChild(newInput);
});

function removeButton(e) {
  e.preventDefault();

  const ele = document.querySelectorAll(".static_side");
  const lastEle = ele[ele.length - 1];
  lastEle.remove();
  sidesAmount -= 1;
}

document.getElementById("installation").addEventListener("change", (e) => {
  result.installation = +e.target.options[e.target.selectedIndex].dataset.cost;
  updateResult();
});

document.getElementById("gates").addEventListener("change", (e) => {
  result.gates = +e.target.value * 800;
  updateResult();
});
