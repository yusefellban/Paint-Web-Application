/**
 * @class
 * to Creatre the canvas
 */
export default class DrawingApp {
  constructor(
    canvasId,
    btnClass,
    widthInputId,
    heightInputId,
    eraserModeId,
    colorSelectorClass,
    zoomSliderId,
    TextSliderId
  ) {
    this.canvas = document.querySelector(canvasId);
    this.btn = document.querySelector(btnClass);
    this.ctx = this.canvas.getContext("2d");
    this.widthInput = document.getElementById(widthInputId);
    this.heightInput = document.getElementById(heightInputId);
    this.eraserMode = document.getElementById(eraserModeId);
    this.chooseColor = document.querySelectorAll(colorSelectorClass);

    this.zoomSlider = document.getElementById(zoomSliderId);

    this.TextSlider = document.getElementById(TextSliderId);
    this.isDrawing = false;
    this.x = 0;
    this.y = 0;
    this.savedImage = null;
    this.isErasing = false;
    this.penColor = "black";
    this.fSize = 10;
    this.init();
  }

  init() {
    this.setCanvasSize();
    this.attachEventListeners();
    this.initColorSelection();
    this.mouse();
  }

  ctxSet() {
    this.ctx.lineWidth = this.fSize;
    this.ctx.lineJoin = "round";
    this.ctx.lineCap = "round";
  }

  setCanvasSize() {
    this.canvas.width =
      this.widthInput.value == 0
        ? window.innerWidth * 0.8
        : this.widthInput.value;

    this.canvas.height =
      this.heightInput.value == 0 ? 500 : this.heightInput.value;
    document.getElementById("widthCanvas").textContent = this.canvas.width;
    document.getElementById("heightCanvas").textContent = this.canvas.height;
    this.ctxSet();
  }

  saveDrawing() {
    this.savedImage = this.ctx.getImageData(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );
  }

  restoreDrawing() {
    if (this.savedImage) {
      this.ctx.putImageData(this.savedImage, 0, 0);
    }
  }

  updateCanvasSize() {
    this.setCanvasSize();
    this.restoreDrawing();
  }

  startDrawing(e) {
    this.x = e.offsetX;
    this.y = e.offsetY;
    this.isDrawing = true;
  }

  stopDrawing() {
    this.isDrawing = false;
  }

  draw(e) {
    if (!this.isDrawing) return;

    this.ctx.strokeStyle = this.penColor;

    if (this.isErasing) {
      this.ctx.globalCompositeOperation = "destination-out";
      this.ctx.lineWidth = this.fSize;
      this.ctx.beginPath();
      this.ctx.moveTo(this.x, this.y);
      this.ctx.lineTo(e.offsetX, e.offsetY);
      this.ctx.stroke();
      this.ctx.globalCompositeOperation = "source-over";
    } else {
      this.ctx.lineWidth = this.fSize;
      this.ctx.beginPath();
      this.ctx.moveTo(this.x, this.y);
      this.ctx.lineTo(e.offsetX, e.offsetY);
      this.ctx.stroke();
    }

    this.saveDrawing();

    this.x = e.offsetX;
    this.y = e.offsetY;
  }

  downloadImage() {
    const a = document.createElement("a");
    a.href = this.canvas.toDataURL("image/png");
    a.download = "canvas-img.png";
    a.click();
  }

  mouse() {
    this.canvas.addEventListener("mousemove", (e) => {
      document.getElementById("mouseX").textContent = e.offsetX;
      document.getElementById("mouseY").textContent = e.offsetY;
    });
  }

  zoomCanvas() {
    const scaleValue = this.zoomSlider.value;
    this.canvas.style.transform = `scale(${scaleValue})`;
  }

  textControl() {
    this.fSize = this.TextSlider.value;
    this.ctxSet();
  }
  toggleEraser() {
    this.isErasing = this.eraserMode.checked;
        this.canvas.style.cursor = "grabbing";

  }

  initColorSelection() {
    this.chooseColor.forEach((color) => {
      color.addEventListener("click", () => {
        this.penColor = color.style.backgroundColor;
        this.isErasing = false;
        this.eraserMode.checked = false;
        this.canvas.style.cursor = "crosshair";
      });
    });
  }

  attachEventListeners() {
    this.widthInput.addEventListener("change", () => this.updateCanvasSize());
    this.heightInput.addEventListener("change", () => this.updateCanvasSize());
    this.eraserMode.addEventListener("change", () => this.toggleEraser());
    this.zoomSlider.addEventListener("input", () => this.zoomCanvas());
    this.TextSlider.addEventListener("input", () => this.textControl());

    this.canvas.addEventListener("mousedown", (e) => this.startDrawing(e));
    this.canvas.addEventListener("mouseup", () => this.stopDrawing());
    this.canvas.addEventListener("mousemove", (e) => this.draw(e));

    window.addEventListener("resize", () => {
      this.setCanvasSize();
      this.restoreDrawing();
    });

    this.btn.addEventListener("click", () => this.downloadImage());
  }
}
