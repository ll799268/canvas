
const oCan = document.getElementById('canvas');

/**
 * getContext 参数：2d Canvas API
 *                webgl WEBGl API
 */
const ctx = oCan.getContext('2d');

const clientWidth = document.documentElement.clientWidth;
const clientHeight = document.documentElement.clientHeight;

oCan.width = clientWidth;
oCan.height = clientHeight;

// 画线条 stroke
// 填充样式 fill
ctx.strokeStyle = 'green';
ctx.fillStyle = 'red';

// 线段头样式
ctx.lineCap = 'round';

// 交叉头样式
ctx.lineJoin = 'round';

// 线段的宽度
ctx.lineWidth = 2;

// 开始画东西，开启一个画东西的路径
ctx.beginPath();

// 1.画笔移动到开始位置
ctx.moveTo(100, 100);
// 2.要把画笔画到那个像素上
// 这条线要延伸到什么位置
ctx.lineTo(300, 300);
ctx.lineTo(500, 200);
ctx.lineTo(100, 100);

// 开始按1.2的规则开始绘制
ctx.stroke();

// 画弧
ctx.beginPath();
// 画弧的规则
ctx.arc(700, 400, 50, 0, 2 * Math.PI, false);
ctx.stroke();
ctx.fill();

// 画弧
ctx.beginPath();
// 画弧的规则
ctx.arc(500, 500, 50, 0, Math.PI, false);
ctx.lineTo(550, 500);
ctx.stroke();
ctx.fill();