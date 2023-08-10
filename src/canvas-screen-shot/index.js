((doc) => {
  const oContainer = doc.querySelector('.canvas-container');
  const oScreenShot = doc.querySelector('.canvas-screen-shot');
  const oImageFile = doc.querySelector('#imageFile');
  const oCan = doc.querySelector('#can');
  const oCanScreenShot = doc.querySelector('#can-screen-shot');
  const ctx = oCan.getContext('2d');
  const screenShowCtx = oCanScreenShot.getContext('2d');
  const MARK_OPACITY = .5;
  let screenShotData = [];

  const oImage = new Image();

  let initPos = null;

  /**
   * 初始化
   */
  function init() {
    bindEvent();
  }

  /**
   * 绑定事件
   */
  function bindEvent() {
    oImageFile.addEventListener('change', handleFileChange, false);
    oCan.addEventListener('mousedown', handleCanvasMouseDown, false);
  }

  /**
   * 生成上传图上图鼠标按下
   */
  function handleCanvasMouseDown(e) {
    initPos = [e.offsetX, e.offsetY];

    oCan.addEventListener('mousemove', handleCanvasMouseMove, false);
    oCan.addEventListener('mouseup', handleCanvasMouseUp, false);
  }

  /**
   * 生成上传图上图鼠标移动
   */
  function handleCanvasMouseMove(e) {
    const endX = e.offsetX;
    const endY = e.offsetY;

    const [startX, startY] = initPos;

    const rectWidth = endX - startX;
    const rectHeight = endY - startY;

    const { width, height } = oCan;

    screenShotData = [startX, startY, rectWidth, rectHeight];

    // 清除画布
    ctx.clearRect(0, 0, width, height);
    // 绘制图片遮罩
    drawImageMask(0, 0, width, height);
    // 绘制截图部分
    drawScreenShot(width, height, rectWidth, rectHeight);
  }

  /**
   * 生成上传图上图鼠标弹起
   */
  function handleCanvasMouseUp() {
    oCan.removeEventListener('mousemove', handleCanvasMouseMove, false);
    oCan.removeEventListener('mouseup', handleCanvasMouseUp, false);
    drawScreenShotImage();
  }

  /**
   * 上传图片
   */
  function handleFileChange(e) {
    const file = e.target.files[0];

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = e => {
      const data = e.target.result;
      oImage.src = data;

      oImage.onload = function () {
        const { width, height } = this;
        generateCanvas(oContainer, oCan, width, height);
        ctx.drawImage(oImage, 0, 0, width, height);
        drawImageMask(0, 0, width, height, MARK_OPACITY);
      }
    }
  }

  /**
   * 生成canvas
   * @param {HTMLElement} container canvas外容器
   * @param {HTMLElement} oCan canvas
   * @param {Number} width 宽度
   * @param {Number} height 高度
   */
  function generateCanvas(container, oCan, width, height) {
    container.style.width = width + 'px';
    container.style.height = height + 'px';
    container.style.display = 'block';

    oCan.width = width;
    oCan.height = height;

  }

  /**
   * 绘制图片遮罩
   * @param {*} x 横坐标
   * @param {*} y 纵坐标
   * @param {*} width 宽度
   * @param {*} height 高度
   */
  function drawImageMask(x, y, width, height) {
    ctx.fillStyle = `rgba(255, 255, 255, ${MARK_OPACITY})`;
    ctx.fillRect(x, y, width, height);
  }

  /**
   * 绘制截图
   * @param {*} canWidth 画布宽
   * @param {*} canHeight 画布高
   * @param {*} rectWidth 移动的宽度
   * @param {*} rectHeight 移动的高度
   */
  function drawScreenShot(canWidth, canHeight, rectWidth, rectHeight) {
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = '#000';
    ctx.fillRect(...initPos, rectWidth, rectHeight);

    ctx.globalCompositeOperation = 'destination-over';
    ctx.drawImage(oImage, 0, 0, canWidth, canHeight, 0, 0, canWidth, canHeight)
  }

  /**
   * 生成绘制截图
   */
  function drawScreenShotImage() {
    const data = ctx.getImageData(...screenShotData);
    generateCanvas(oScreenShot, oCanScreenShot, screenShotData[2], screenShotData[3]);
    screenShowCtx.clearRect(...screenShotData);
    screenShowCtx.putImageData(data, 0, 0);
  }


  init();
})(document);