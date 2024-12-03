// Initialize indices for each body part
const indices = {
  torso: 0,
  head: 0,
  hair: 0,
  eyebrows: 0,
  eyes: 0,
  eyewear: 0,
  mouth: 0,
};

// Initialize positions for movable body parts
const positions = {
  torso: { top: 55 },
  head: { top: 100 },
  hair: { top: 50 },
  eyebrows: { top: 70 },
  eyes: { top: 90 },
  eyewear: { top: 95 },
  mouth: { top: 145 },
};

// Image sources for each body part
const images = {
  torso: Array.from({ length: 9 }, (_, i) => `assets/Torso/Torso${i + 1}.png`),
  head: Array.from({ length: 9 }, (_, i) => `assets/Heads/Head${i + 1}.png`),
  hair: Array.from({ length: 8 }, (_, i) => `assets/Hair/Hair${i + 1}.png`),
  eyebrows: Array.from(
    { length: 4 },
    (_, i) => `assets/Eyebrows/Eyebrow${i + 1}.png`
  ),
  eyes: Array.from({ length: 7 }, (_, i) => `assets/Eyes/Eyes${i + 1}.png`),
  eyewear: Array.from(
    { length: 4 },
    (_, i) => `assets/Eyewear/Eyewear${i + 1}.png`
  ),
  mouth: Array.from({ length: 8 }, (_, i) => `assets/Mouth/Mouth${i + 1}.png`),
};

// Update the image displayed for a body part
function updateImage(part) {
  const imgElement = document.getElementById(`${part}-image`);
  imgElement.src = images[part][indices[part]];
}

// Update the position of a body part
function updatePosition(part) {
  const imgElement = document.getElementById(`${part}-image`);
  imgElement.style.top = `${positions[part].top}px`;
}

// Add event listeners to navigation buttons
Object.keys(indices).forEach((part) => {
  document.getElementById(`prev-${part}`).addEventListener("click", () => {
    indices[part] =
      (indices[part] - 1 + images[part].length) % images[part].length;
    updateImage(part);
  });

  document.getElementById(`next-${part}`).addEventListener("click", () => {
    indices[part] = (indices[part] + 1) % images[part].length;
    updateImage(part);
  });
});

// Add event listeners for position control buttons
Object.keys(positions).forEach((part) => {
  document.getElementById(`up-${part}`).addEventListener("click", () => {
    positions[part].top -= 10; // Move up by 10 pixels
    updatePosition(part);
  });

  document.getElementById(`down-${part}`).addEventListener("click", () => {
    positions[part].top += 10; // Move down by 10 pixels
    updatePosition(part);
  });
});

document.getElementById("download-character").addEventListener("click", () => {
  const canvas = document.getElementById("hidden-canvas");
  const ctx = canvas.getContext("2d");

  // Set canvas dimensions to 1080x1080
  canvas.width = 1080;
  canvas.height = 1080;

  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Load images and draw them in the correct order
  const drawOrder = [
    "torso",
    "head",
    "hair",
    "eyebrows",
    "eyes",
    "eyewear",
    "mouth",
  ];
  const imagePromises = drawOrder.map((part) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = images[part][indices[part]];
      img.onload = () => resolve({ img, part });
      img.onerror = (err) => reject(err);
    });
  });

  Promise.all(imagePromises)
    .then((results) => {
      // Draw torso first
      const torso = results.find(({ part }) => part === "torso");
      ctx.drawImage(torso.img, 315, 429 + positions.torso.top - 55, 450, 450);

      // Draw head behind torso
      const head = results.find(({ part }) => part === "head");
      ctx.globalCompositeOperation = "destination-over";
      ctx.drawImage(head.img, 340, 400 + positions.head.top - 100, 400, 400);
      ctx.globalCompositeOperation = "source-over";

      // Draw other elements
      results.forEach(({ img, part }) => {
        if (part !== "torso" && part !== "head") {
          switch (part) {
            case "hair":
              ctx.drawImage(img, 315, 350 + positions.hair.top - 50, 450, 390);
              break;
            case "eyebrows":
              ctx.drawImage(img, 380, 420 + positions.eyebrows.top - 70, 320, 290);
              break;
            case "eyes":
              ctx.drawImage(img, 380, 470 + positions.eyes.top - 90, 320, 290);
              break;
            case "eyewear":
              ctx.drawImage(img, 380, 460 + positions.eyewear.top - 95, 320, 320);
              break;
            case "mouth":
              ctx.drawImage(img, 440, 550 + positions.mouth.top - 145, 200, 250);
              break;
          }
        }
      });

      // Trigger the download
      const link = document.createElement("a");
      link.download = "custom-character.png";
      link.href = canvas.toDataURL();
      link.click();
    })
    .catch((error) => {
      console.error("Error loading images:", error);
    });
});
