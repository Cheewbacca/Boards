const layouts = Array.from(document.querySelectorAll(".layout__container"));
const dimensionsContent = document.getElementById("dimensions");

let currentLayout, lastLayout;

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
  });
};

layouts.map(changeLayout);
