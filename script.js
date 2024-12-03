// script.js

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
      results.forEach(({ img, part }) => {
        // Adjust positions and sizes based on part for 1080x1080 canvas
        switch (part) {
          case "torso":
            ctx.drawImage(img, 315, 540, 450, 450); // Adjusted to position torso correctly
            break;
          case "head":
            ctx.drawImage(img, 340, 400, 400, 400); // Position head above torso
            break;
          case "hair":
            ctx.drawImage(img, 315, 350, 450, 390); // Position hair above head
            break;
          case "eyebrows":
            ctx.drawImage(img, 380, 420, 320, 290); // Position eyebrows on head
            break;
          case "eyes":
            ctx.drawImage(img, 380, 470, 320, 290); // Position eyes below eyebrows
            break;
          case "eyewear":
            ctx.drawImage(img, 380, 460, 320, 320); // Position eyewear overlapping eyes
            break;
          case "mouth":
            ctx.drawImage(img, 440, 550, 200, 250); // Position mouth below eyes
            break;
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