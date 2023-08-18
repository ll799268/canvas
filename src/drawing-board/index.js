const oCan = document.getElementById('canvas');
const ctx = oCan.getContext('2d');

// 改变颜色ipt
const oColorInput = document.getElementById('colorInput');
// 改变线条ipt
const oLineWidthRange = document.getElementById('lineWidthRange');
// 线条的回显
const oLineWidthValue = document.getElementById('lineWidthValue');
// 清空画布按钮
const oClearAllButton = document.getElementById('clearAllButton');
// 橡皮擦按钮
const oEraserButton = document.getElementById('eraserButton');
// 改变橡皮擦按钮大小
const oEraserLineWidthRange = document.getElementById('eraserLineWidthRange');
// 橡皮擦按钮大小设置
const oEraserLineWidthValue = document.getElementById('eraserLineWidthValue');
// 橡皮擦
const oEraserCircle = document.getElementById('eraserCircle');

const clientWidth = document.documentElement.clientWidth;
const clientHeight = document.documentElement.clientHeight;

oCan.width = clientWidth;
oCan.height = clientHeight;

const state = {
  initPos: {}, // 鼠标初始位置
  eraserState: false, // 是否是橡皮擦画布
  drewData: [], // 绘制数据栈
  revokedData: [] // 恢复数据栈
};

const DATA_FIELD = {
  DREW: 'drewData',
  REVOKED: 'revokedData'
}

const DATA_TYPE = {
  MOVE_TO: 'moveTo',
  LINE_TO: 'lineTo'
}

// canvas默认值
const CANVAS_VALUE = {
  DEFAULT_COLOR: '#000',
  DEFAULT_LINE_STYLE: 'round',
  DEFAULT_LINE_WIDTH: 1,
  EARSER_COLOR: '#fff'
};

const KEYBOARD = {
  UNDO: 'z', // 回退
  REDO: 'b' // 恢复
}

/**
 * 初始化
 */
const init = () => {
  initStyle();
  bindEvent();
}

/**
 * 初始化样式
 */
function initStyle() {
  ctx.setColor(CANVAS_VALUE.DEFAULT_COLOR);
  ctx.setLineStyle(CANVAS_VALUE.DEFAULT_LINE_STYLE);
  ctx.setLineWidth(CANVAS_VALUE.DEFAULT_LINE_WIDTH);
}

/**
 * 绑定事件
 */
function bindEvent() {
  oCan.addEventListener('mousedown', handleCanvasMouseDown, false);
  oColorInput.addEventListener('input', handleColorInput, false);
  oLineWidthRange.addEventListener('input', handleLineWidthRange, false);
  oClearAllButton.addEventListener('click', handleClearAllBtnClick, false);
  oEraserButton.addEventListener('click', handleEraserBtnClick, false);
  oEraserLineWidthRange.addEventListener('input', handleEraserLineWidthRange, false);
  document.addEventListener('keydown', handleKeyDown, false);
}

/**
 * 颜色选择器修改
 */
function handleColorInput() {
  const color = this.value;
  // 设置颜色和还原线条宽度
  ctx.setColor(color);
  ctx.setLineWidth(oLineWidthRange.value);

  // 将橡皮擦状态关闭，并隐藏
  state.eraserState = false;
  oEraserCircle.setVisible(false);
}

/**
 * 线条粗度选择器修改
 */
function handleLineWidthRange() {
  const width = this.value;
  // 设置宽度并回显
  oLineWidthValue.textContent = width;
  ctx.setLineWidth(width);
}

/**
 * 清除按钮点击
 */
function handleClearAllBtnClick() {
  clearAll();
}

/**
 * 橡皮擦按钮点击
 */
function handleEraserBtnClick() {
  const lineWidthValue = oEraserLineWidthRange.value;
  state.eraserState = true;

  // 重置橡皮擦颜色和设置绘制宽度
  ctx.setColor(CANVAS_VALUE.EARSER_COLOR);
  ctx.setLineWidth(lineWidthValue);

  // 设置橡皮擦尺寸
  oEraserCircle.setSize(lineWidthValue);
}

/**
 * 橡皮擦大小修改
 */
function handleEraserLineWidthRange() {
  const width = this.value;
  // 设置大小并回显
  oEraserLineWidthValue.textContent = width;
  oEraserCircle.setSize(width);
  state.eraserState && ctx.setLineWidth(width);
}

/**
 * canvas 画布按下
 * @param {*} e 
 */
function handleCanvasMouseDown(e) {
  const x1 = e.clientX;
  const y1 = e.clientY;

  // 位置存储
  state.initPos = { x1, y1 };

  // 画一个初始圆形
  drawPoint(x1, y1);
  // 记录绘画位置
  setDrewRecord(DATA_TYPE.MOVE_TO, [x1, y1]);

  oCan.addEventListener('mousemove', handleCanvasMouseMove, false);
  oCan.addEventListener('mouseup', handleCanvasMouseUp, false);

  // 橡皮擦绘制
  if (state.eraserState) {
    oEraserCircle.setVisible(true);
    oEraserCircle.setPosition(x1, y1);
    oEraserCircle.addEventListener('mouseup', handleEraserCircleMouseUp, false);
  }
}

/**
 * canvas 画布移动
 * @param {*} e 
 */
function handleCanvasMouseMove(e) {
  const x2 = e.clientX;
  const y2 = e.clientY;

  // 绘制路线
  drawLine({ ...state.initPos, x2, y2 })
  // 记录绘画位置
  setDrewRecord(DATA_TYPE.LINE_TO, [x2, y2]);

  // 设置位置
  state.eraserState && oEraserCircle.setPosition(x2, y2);
  state.initPos = { x1: x2, y1: y2 };

}

/**
 * canvas 画布弹起
 * @param {*} e 
 */
function handleCanvasMouseUp() {
  oCan.removeEventListener('mousemove', handleCanvasMouseMove, false);
  oCan.removeEventListener('mouseup', handleCanvasMouseUp, false);
}

/**
 * 键盘弹起
 * @param {*} e 
 */
function handleKeyDown(e) {
  const key = e.key;
  // 当按键是ctrl + z 或者是ctrl + b
  if (e.metaKey && Object.values(KEYBOARD).includes(key)) {
    // 执行撤销、恢复操作
    doDrewRecord(key);
    // 绘制
    drawBatchLine();
  }

  // 如果没有绘制、回退记录
  if (!state[DATA_FIELD.DREW].length || !state[DATA_FIELD.REVOKED].length) {
    ctx.setColor(oColorInput.value);
    ctx.setLineWidth(oLineWidthRange.value);
  }
}

/**
 * 橡皮擦弹起
 */
function handleEraserCircleMouseUp() {
  oEraserCircle.setVisible(false);
  oEraserCircle.removeEventListener('mouseup', handleEraserCircleMouseUp, false);
  handleCanvasMouseUp();
}

/**
 * 绘制圆
 * @param {Number} x x坐标
 * @param {Number} y y坐标
 */
function drawPoint(x, y) {
  ctx.beginPath();
  ctx.arc(x, y, ctx.lineWidth / 2, 0, 2 * Math.PI, false);
  ctx.stroke();
  ctx.fill();
}

/**
 * 绘制线
 * @param {*} param 位置
 */
function drawLine({ x1, y1, x2, y2 }) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

/**
 * 绘制记录线条
 */
function drawBatchLine() {
  clearAll();

  state[DATA_FIELD.DREW].forEach(item => {
    // 初始化canvas绘制
    ctx.beginPath();
    const { moveTo: [x1, y1], lineTo, info: { color, width } } = item;
    ctx.setColor(color);
    ctx.setLineWidth(width);
    ctx.moveTo(x1, y1);

    // 线条绘制
    lineTo.forEach(line => {
      ctx.lineTo(...line);
    });
    ctx.stroke();
  })
}

/**
 * 清除画布
 */
function clearAll() {
  ctx.clearRect(0, 0, oCan.offsetWidth, oCan.offsetHeight);
}

/**
 * 设置橡皮擦是否隐藏
 * @param {Boolean} visible 是否隐藏
 */
oEraserCircle.setVisible = function (visible) {
  this.style.display = visible ? 'block' : 'none';
}

/**
 * 设置橡皮擦大小
 * @param {Number} size 大小
 */
oEraserCircle.setSize = function (size) {
  this.style.width = size + 'px';
  this.style.height = size + 'px';
}

/**
 * 设置橡皮擦位置
 * @param {Number} x x坐标
 * @param {Number} y y坐标
 */
oEraserCircle.setPosition = function (x, y) {
  this.style.left = x - this.offsetWidth / 2 + 'px';
  this.style.top = y - this.offsetWidth / 2 + 'px';
}

/**
 * 设置画布颜色
 * @param {*} color 
 */
ctx.setColor = function (color) {
  this.strokeStyle = color;
  this.fillStyle = color;
}

/**
 * 获取画布颜色
 * @returns 
 */
ctx.getColor = function () {
  return this.strokeStyle;
}

/**
 * 设置线条样式
 * @param {*} style 
 */
ctx.setLineStyle = function (style) {
  this.lineCap = style;
  this.lineJoin = style;
}

/**
 * 设置线条宽度
 * @param {Number} width 
 */
ctx.setLineWidth = function (width) {
  this.lineWidth = width;
}

/**
 * 获取线条宽度
 * @returns 
 */
ctx.getLineWidth = function () {
  return this.lineWidth;
}

/**
 * 设置画布记录
 * @param {String} type 类型：MOVE_TO、LINE_TO
 * @param {Array} data 数据
 */
function setDrewRecord(type, data) {
  switch (type) {
    case DATA_TYPE.MOVE_TO:
      state[DATA_FIELD.DREW].push({
        [DATA_TYPE.MOVE_TO]: [...data],
        [DATA_TYPE.LINE_TO]: [],
        info: {
          color: ctx.getColor(),
          width: ctx.getLineWidth()
        }
      })
      break;
    case DATA_TYPE.LINE_TO:
      const drewData = state[DATA_FIELD.DREW];
      drewData[drewData.length - 1][DATA_TYPE.LINE_TO].push([...data]);
      break;
    default:
      break;
  }
}

/**
 * 回退、撤销
 * @param {String} key z/b
 */
function doDrewRecord(key) {
  switch (key) {
    // 回退z
    case KEYBOARD.UNDO:
      state[DATA_FIELD.DREW].length
        &&
        state[DATA_FIELD.REVOKED].push(state[DATA_FIELD.DREW].pop());
      break;
    // 撤销b
    case KEYBOARD.REDO:
      state[DATA_FIELD.REVOKED].length
        &&
        state[DATA_FIELD.DREW].push(state[DATA_FIELD.REVOKED].pop());
      break;
    default:
      break;
  }
}

init();