const oCan = document.getElementById('canvas');
const ctx = oCan.getContext('2d');

const oColorInput = document.getElementById('colorInput');
const oLineWidthRange = document.getElementById('lineWidthRange');
const oLineWidthValue = document.getElementById('lineWidthValue');
const oClearAllButton = document.getElementById('clearAllButton');
const oEraserButton = document.getElementById('eraserButton');
const oEraserLineWidthRange = document.getElementById('eraserLineWidthRange');
const oEraserLineWidthValue = document.getElementById('eraserLineWidthValue');
const oEraserCircle = document.getElementById('eraserCircle');

const clientWidth = document.documentElement.clientWidth;
const clientHeight = document.documentElement.clientHeight;

oCan.width = clientWidth;
oCan.height = clientHeight;

const state = {
  initPos: {},
  eraserState: false
};

const CANVSA_VALUE = {
  DEFAULT_COLOR: '#000',
  DEFAULT_LINE_STYLE: 'round',
  DEFAULT_LINE_WIDTH: 1,
  EARSER_COLOR: '#fff'
};

const KEYBOARD = {
  UNDO: 'z',
  REDO: 'b'
}

const init = () => {
  initStyle();
  bindEvent();
}

function initStyle () {
  ctx.setColor(CANVSA_VALUE.DEFAULT_COLOR);
  ctx.setLineStyle(CANVSA_VALUE.DEFAULT_LINE_STYLE);
  ctx.setLineWidth(CANVSA_VALUE.DEFAULT_LINE_WIDTH);
}

function bindEvent () {
  oCan.addEventListener('mousedown', handleCanvasMouseDown, false);
  oColorInput.addEventListener('input', handleColorInput, false);
  oLineWidthRange.addEventListener('input', handleLineWidthRange, false);
  oClearAllButton.addEventListener('click', handleClearAllBtnClick, false);
  oEraserButton.addEventListener('click', handleEraserBtnClick, false);
  oEraserLineWidthRange.addEventListener('input', handleEraserLineWidthRange, false);
  document.addEventListener('keydown', handleKeyDown, false);
}

function handleColorInput () {
  const color = this.value;
  ctx.setColor(color);
  ctx.setLineWidth(oLineWidthRange.value);
  state.eraserState = false;
  oEraserCircle.setVisible(false);
}

function handleLineWidthRange () {
  const width = this.value;
  oLineWidthValue.textContent = width;
  ctx.setLineWidth(width);
}

function handleClearAllBtnClick () {
  clearAll();
}

function handleEraserBtnClick () {
  const lineWidthValue = oEraserLineWidthRange.value;
  state.eraserState = true;

  ctx.setColor(CANVSA_VALUE.EARSER_COLOR);
  ctx.setLineWidth(lineWidthValue);
  oEraserCircle.setSize(lineWidthValue);
}

function handleEraserLineWidthRange () {
  const width = this.value;
  oEraserLineWidthValue.textContent = width;
  oEraserCircle.setSize(width);
  state.eraserState && ctx.setLineWidth(width);
}

function handleCanvasMouseDown (e) {
  const x1 = e.clientX;
  const y1 = e.clientY;

  state.initPos = {x1, y1};

  drawPoint(x1, y1);
  
  oCan.addEventListener('mousemove', handleCanvasMouseMove, false);
  oCan.addEventListener('mouseup', handleCanvasMouseUp, false);

  if (state.eraserState) {
    oEraserCircle.setVisible(true);
    oEraserCircle.setPosition(x1, y1);
    oEraserCircle.addEventListener('mouseup', handleEraserCircleMouseUp, false);
  }
}

function handleCanvasMouseMove (e) {
  const x2 = e.clientX;
  const y2 = e.clientY;

  drawLine({...state.initPos, x2, y2})
  state.eraserState &&  oEraserCircle.setPosition(x2, y2);
  state.initPos = {x1: x2, y1: y2};
}

function handleCanvasMouseUp () {
  oCan.removeEventListener('mousemove', handleCanvasMouseMove, false);
  oCan.removeEventListener('mouseup', handleCanvasMouseUp, false);
}

function handleKeyDown (e) {
  const key = e.key;
  if (e.metaKey && Object.values(KEYBOARD).includes(key)) {
    
  }
}

function handleEraserCircleMouseUp () {
  oEraserCircle.setVisible(false);
  oEraserCircle.removeEventListener('mouseup', handleEraserCircleMouseUp, false);
  handleCanvasMouseUp();
}

function drawPoint(x, y) {
  ctx.beginPath();
  ctx.arc(x, y, ctx.lineWidth / 5, 0, 2 * Math.PI, false);
  ctx.stroke();
  ctx.fill();
}

function drawLine({ x1, y1, x2, y2}) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function clearAll () {
  console.log(oCan.offsetWidth);
 ctx.clearRect(0, 0, oCan.offsetWidth, oCan.offsetHeight);
}

oEraserCircle.setVisible = function (visible) {
  this.style.display = visible ? 'block' : 'none';
}

oEraserCircle.setSize = function (size) {
  this.style.width = size + 'px';
  this.style.height = size + 'px';
}

oEraserCircle.setPosition = function (x, y) {
  this.style.left = x - this.offsetWidth / 2 + 'px';
  this.style.top = y - this.offsetWidth / 2 + 'px';
}

ctx.setColor = function (color) {
  this.strokeStyle = color;
  this.fillStyle = color;
}

ctx.setLineStyle = function (style) {
  this.lineCap = style;
  this.lineJoin = style;
}

ctx.setLineWidth = function (width) {
  this.lineWidth = width;
}

init();