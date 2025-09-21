
document.addEventListener("DOMContentLoaded", () => {
  const menuBtn = document.getElementById("menu-btn");
  const navList = document.querySelector("nav ul");

  menuBtn.addEventListener("click", () => {
    navList.classList.toggle("active");
  });
});


const typingText = ["Frontend Developer", "UI Designer", "Web Enthusiast"];
let typingIndex = 0;
let charIndex = 0;
const typingElement = document.getElementById("typing");

function typeEffect() {
  if (charIndex < typingText[typingIndex].length) {
    typingElement.textContent += typingText[typingIndex].charAt(charIndex);
    charIndex++;
    setTimeout(typeEffect, 100);
  } else {
    setTimeout(eraseEffect, 1500);
  }
}

function eraseEffect() {
  if (charIndex > 0) {
    typingElement.textContent = typingText[typingIndex].substring(0, charIndex - 1);
    charIndex--;
    setTimeout(eraseEffect, 50);
  } else {
    typingIndex = (typingIndex + 1) % typingText.length;
    setTimeout(typeEffect, 500);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(typeEffect, 500);
});