// =====================
// Fake Progress Bar
// =====================

let model = null;

async function loadModelWithProgress() {
  const container = document.getElementById("progressContainer");
  const bar = document.getElementById("progressBar");
  container.style.display = "block";

  //TensorFlow.js gives no real progress events
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 15;
    if (progress > 90) progress = 90;
    bar.style.width = progress + "%";
  }, 200);

  model = await mobilenet.load();

  // Finish progress bar
  clearInterval(interval);
  bar.style.width = "100%";

  setTimeout(() => {
    container.style.display = "none";
  }, 400);

  document.getElementById("result").textContent =
    "Model ready — drop or choose an image.";
}

window.addEventListener("DOMContentLoaded", loadModelWithProgress);

// =====================
// Analyze Image
// =====================
async function analyzeImage() {
  const img = document.getElementById("preview");
  const result = document.getElementById("result");

  if (!model) {
    result.textContent = "Model is still loading...";
    return;
  }

  if (!img.src) {
    result.textContent = "Please load an image first.";
    return;
  }

  result.textContent = "Analyzing...";
  const predictions = await model.classify(img);

  if (predictions.length > 0) {
    const top = predictions[0];
    result.textContent =
      `Subject: ${top.className} (confidence: ${(top.probability * 100).toFixed(1)}%)`;
  } else {
    result.textContent = "Could not determine the subject.";
  }
}


// =====================
// Load Selected Image
// =====================
function loadImageFromFile(file) {
  const img = document.getElementById("preview");
  img.src = URL.createObjectURL(file);
  img.style.display = "block";

  // Wait briefly for image to render before analysis
  img.onload = () => analyzeImage();
}


// =====================
// Drag-and-Drop
// =====================
const dropzone = document.getElementById("dropzone");
const fileInput = document.getElementById("imageInput");

dropzone.addEventListener("click", () => fileInput.click());

dropzone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropzone.classList.add("hover");
});

dropzone.addEventListener("dragleave", () => {
  dropzone.classList.remove("hover");
});

dropzone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropzone.classList.remove("hover");

  const file = e.dataTransfer.files[0];
  if (file) loadImageFromFile(file);
});


// =====================
// Select File
// =====================
fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (file) loadImageFromFile(file);
});
