// Paint Clone – Drawing + Tools + Colors
(function () {
  const canvas = document.getElementById("my-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const tools = document.querySelectorAll("[data-tool]");
  const colorCells = document.querySelectorAll(".color-palette .cell");
  const colorPrimaryBox = document.getElementById("primary-color");
  const colorSecondaryBox = document.getElementById("secondary-color");
  const undoBtn = document.querySelector('[data-btn="undo"]');
  const redoBtn = document.querySelector('[data-btn="redo"]');

  // Canvas Setup
  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    const ratio = window.devicePixelRatio || 1;
    canvas.width = rect.width * ratio;
    canvas.height = rect.height * ratio;
    ctx.scale(ratio, ratio);
    redraw();
  }

  let drawing = false;
  let lastX = 0,
    lastY = 0;
  let currentTool = "pencil";
  let primaryColor = "#000000";
  let secondaryColor = "#ffffff";
  let lineWidth = 6;

  // History (Undo / Redo)
  const history = [];
  let index = -1;

  function saveState() {
    history.splice(index + 1);
    history.push(canvas.toDataURL());
    index = history.length - 1;
  }

  function redraw() {
    if (index >= 0) {
      const img = new Image();
      img.src = history[index];
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(
          img,
          0,
          0,
          canvas.width / devicePixelRatio,
          canvas.height / devicePixelRatio
        );
      };
    }
  }

  // Draw Handlers
  function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const clientY = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
    return { x: clientX, y: clientY };
  }

  function startDraw(e) {
    drawing = true;
    const { x, y } = getPos(e);
    lastX = x;
    lastY = y;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = currentTool === "eraser" ? "#ffffff" : primaryColor;
    ctx.beginPath();
    ctx.moveTo(x, y);
  }

  function drawMove(e) {
    if (!drawing) return;
    const { x, y } = getPos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
    lastX = x;
    lastY = y;
  }

  function endDraw() {
    if (!drawing) return;
    drawing = false;
    ctx.closePath();
    saveState();
  }

  // Tool Switching
  tools.forEach((tool) => {
    tool.addEventListener("click", () => {
      tools.forEach((t) => t.classList.remove("active"));
      tool.classList.add("active");
      currentTool = tool.dataset.tool;
    });
  });

  // Color Handling
  colorCells.forEach((cell) => {
    cell.addEventListener("click", () => {
      const bg = window.getComputedStyle(cell).backgroundColor;
      if (bg && bg !== "transparent" && bg !== "rgba(0, 0, 0, 0)") {
        primaryColor = rgbToHex(bg);
        updateColorSwatches();
      }
    });
  });

  // Toggle between Color 1 & Color 2
  colorPrimaryBox.addEventListener("click", () => {
    colorPrimaryBox.classList.add("active");
    colorSecondaryBox.classList.remove("active");
    primaryColor = getBoxColor(colorPrimaryBox);
  });

  colorSecondaryBox.addEventListener("click", () => {
    colorSecondaryBox.classList.add("active");
    colorPrimaryBox.classList.remove("active");
    primaryColor = getBoxColor(colorSecondaryBox);
  });

  function getBoxColor(box) {
    const inner = box.querySelector(".swatch-inner");
    return window.getComputedStyle(inner).backgroundColor;
  }

  function updateColorSwatches() {
    colorPrimaryBox.querySelector(".swatch-inner").style.background = primaryColor;
    colorSecondaryBox.querySelector(".swatch-inner").style.background = secondaryColor;
  }

  function rgbToHex(rgb) {
    const m = rgb.match(/\d+/g);
    if (!m) return rgb;
    return (
      "#" +
      ((1 << 24) +
        (parseInt(m[0]) << 16) +
        (parseInt(m[1]) << 8) +
        parseInt(m[2]))
        .toString(16)
        .slice(1)
    );
  }

  // Undo / Redo
  undoBtn?.addEventListener("click", () => {
    if (index > 0) {
      index--;
      redraw();
    }
  });

  redoBtn?.addEventListener("click", () => {
    if (index < history.length - 1) {
      index++;
      redraw();
    }
  });

  // Event Binding
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();
  saveState();

  canvas.addEventListener("mousedown", startDraw);
  canvas.addEventListener("mousemove", drawMove);
  window.addEventListener("mouseup", endDraw);

  canvas.addEventListener("touchstart", (e) => {
    e.preventDefault();
    startDraw(e);
  });
  canvas.addEventListener("touchmove", (e) => {
    e.preventDefault();
    drawMove(e);
  });
  canvas.addEventListener("touchend", (e) => {
    e.preventDefault();
    endDraw(e);
  });


  updateColorSwatches();
})();
