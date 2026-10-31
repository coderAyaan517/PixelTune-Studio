const imageInput = document.querySelector("#imageInput");
const resetBtn = document.querySelector("#resetBtn");
const downloadBtn = document.querySelector("#downloadBtn");

const placeholder = document.querySelector(".placeholder");
const imageCanvas = document.querySelector("#imageCanvas");
const canvasCtx = imageCanvas.getContext("2d");
let file = null;
let image = null;

const filtersContainer = document.querySelector(".filters");
const presetsContainer = document.querySelector(".presets");

let filters = {
    brightness: { value: 100, min: 0, max: 200, unit: "%" },
    contrast: { value: 100, min: 0, max: 200, unit: "%" },
    saturation: { value: 100, min: 0, max: 200, unit: "%" },
    hueRotation: { value: 0, min: 0, max: 360, unit: "deg" },
    blur: { value: 0, min: 0, max: 20, unit: "px" },
    grayscale: { value: 0, min: 0, max: 100, unit: "%" },
    sepia: { value: 0, min: 0, max: 100, unit: "%" },
    opacity: { value: 100, min: 0, max: 100, unit: "%" },
    invert: { value: 0, min: 0, max: 100, unit: "%" }
};

const presets = {
    drama: { brightness: 110, contrast: 130, saturation: 120, hueRotation: 0, blur: 0, grayscale: 10, sepia: 0, opacity: 100, invert: 0 },
    vintage: { brightness: 90, contrast: 110, saturation: 80, hueRotation: 15, blur: 0, grayscale: 20, sepia: 40, opacity: 100, invert: 0 },
    oldSchool: { brightness: 95, contrast: 120, saturation: 60, hueRotation: 0, blur: 0, grayscale: 50, sepia: 30, opacity: 100, invert: 0 },
    cyberpunk: { brightness: 110, contrast: 140, saturation: 160, hueRotation: 290, blur: 0, grayscale: 0, sepia: 0, opacity: 100, invert: 0 },
    softGlow: { brightness: 120, contrast: 90, saturation: 110, hueRotation: 0, blur: 2, grayscale: 0, sepia: 10, opacity: 100, invert: 0 },
    noir: { brightness: 80, contrast: 130, saturation: 0, hueRotation: 0, blur: 0, grayscale: 100, sepia: 10, opacity: 100, invert: 0 },
    warmSunset: { brightness: 105, contrast: 115, saturation: 120, hueRotation: 20, blur: 0, grayscale: 0, sepia: 30, opacity: 100, invert: 0 },
    coolTone: { brightness: 100, contrast: 110, saturation: 90, hueRotation: 200, blur: 0, grayscale: 5, sepia: 0, opacity: 100, invert: 0 },
    faded: { brightness: 105, contrast: 80, saturation: 70, hueRotation: 0, blur: 0, grayscale: 10, sepia: 20, opacity: 100, invert: 0 },
    retroPop: { brightness: 115, contrast: 130, saturation: 150, hueRotation: 45, blur: 0, grayscale: 0, sepia: 0, opacity: 100, invert: 0 }
};

appendFilters();

Object.keys(presets).forEach(presetName => {
    const presetBtn = document.createElement("button");
    presetBtn.className = "preset-btn btn";
    presetBtn.textContent = presetName;

    presetsContainer.appendChild(presetBtn);

    presetBtn.addEventListener("click", () => {
        filtersContainer.innerHTML = "";

        const preset = presets[presetName];

        Object.keys(preset).forEach(filter => {
            filters[filter].value = preset[filter];
        });

        appendFilters();
        applyFilters();
    });
});

function createFilter(name, value, min, max, unit) {
    const filter = document.createElement("div");
    filter.classList.add("filter");

    const p = document.createElement("p");
    p.textContent = name;

    const input = document.createElement("input");
    input.type = "range";
    input.id = name;
    input.value = value;
    input.min = min;
    input.max = max;

    filter.append(p, input);

    input.addEventListener("input", () => {
        filters[name].value = input.value;
        applyFilters();
    });

    return filter;
}

function appendFilters() {
    Object.keys(filters).forEach(filter => {
        const { value, min, max, unit } = filters[filter];
        const filterElement = createFilter(filter, value, min, max, unit);
        filtersContainer.appendChild(filterElement);
    });
}

function applyFilters() {
    canvasCtx.clearRect(image, 0, 0, imageCanvas.width, imageCanvas.height);

    canvasCtx.filter = `
    brightness(${filters.brightness.value}${filters.brightness.unit})
    contrast(${filters.contrast.value}${filters.contrast.unit})
    saturate(${filters.saturation.value}${filters.saturation.unit})
    hue-rotate(${filters.hueRotation.value}${filters.hueRotation.unit})
    blur(${filters.blur.value}${filters.blur.unit})
    grayscale(${filters.grayscale.value}${filters.grayscale.unit})
    sepia(${filters.sepia.value}${filters.sepia.unit})
    opacity(${filters.opacity.value}${filters.opacity.unit})
    invert(${filters.invert.value}${filters.invert.unit})
    `;

    canvasCtx.drawImage(image, 0, 0);
}

imageInput.addEventListener("change", e => {
    file = e.target.files[0];

    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
        image = img;
        imageCanvas.width = img.width;
        imageCanvas.height = img.height;
        canvasCtx.drawImage(img, 0, 0);
    }

    placeholder.style.display = "none";
    imageCanvas.style.display = "initial";
});

resetBtn.addEventListener("click", () => {
    filtersContainer.innerHTML = "";

    filters = {
        brightness: { value: 100, min: 0, max: 200, unit: "%" },
        contrast: { value: 100, min: 0, max: 200, unit: "%" },
        saturation: { value: 100, min: 0, max: 200, unit: "%" },
        hueRotation: { value: 0, min: 0, max: 360, unit: "deg" },
        blur: { value: 0, min: 0, max: 20, unit: "px" },
        grayscale: { value: 0, min: 0, max: 100, unit: "%" },
        sepia: { value: 0, min: 0, max: 100, unit: "%" },
        opacity: { value: 100, min: 0, max: 100, unit: "%" },
        invert: { value: 0, min: 0, max: 100, unit: "%" }
    };

    appendFilters();
    applyFilters();
});

downloadBtn.addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = `edited-${file.name}`;
    link.href = imageCanvas.toDataURL();
    link.click();
});
