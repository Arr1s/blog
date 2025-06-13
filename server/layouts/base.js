console.log("base.js loaded");

const cursor = document.querySelector(".cursor");

document.addEventListener("mousemove", (e) => {
  // cursor.style.left = e.clientX;
  // cursor.style.top = e.clientY;
  
  cursor.style.setProperty("--cursor-x", e.clientX);
  cursor.style.setProperty("--cursor-y", e.clientY);
});

document.addEventListener("mousedown", () => {
  cursor.classList.add("click");
});
document.addEventListener("mouseup", () => {
  cursor.classList.remove("click");
});

const items = document.querySelectorAll("a, button");
items.forEach((item) => {
  item.addEventListener("mouseover", () => {
    cursor.classList.add("pressable");
  });

  item.addEventListener("mouseleave", () => {
    cursor.classList.remove("pressable");
  });
});