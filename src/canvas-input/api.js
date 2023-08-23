
const oCan = document.getElementById('can');
const ctx = oCan.getContext('2d');

const documentElement = document.documentElement;

oCan.width = documentElement.clientWidth;
oCan.height = documentElement.clientHeight;

/**
 * fillText() 填充文本(实心)
 * strokeText() 描边文本(空心)
 */

/**
 * 参数
 * 1、文本 (必填)
 * 2、横坐标 (必填)
 * 3、纵坐标 (必填)
 * 4、文本最大宽度 (可选)
 */

/**
 * font 设置文本样式、尺寸、字体(按顺序，同步设置)
 * 1、样式 (可选)
 * 2、尺寸 (可选)
 * 3、字体 (可选)
 * 
 */

// ex1:
// ctx.font = 'bold 50px serif';
// ctx.fillText('I LOVE YOU!', 500, 300);
// ctx.strokeText('I LOVE YOU!', 500, 300);



// ex2:
// ctx.font = '50px serif';
// ctx.strokeStyle = 'red';

// // 横坐标
// ctx.moveTo(500, 100);
// ctx.lineTo(1000, 100);
// // 纵坐标
// ctx.moveTo(500, 100);
// ctx.lineTo(500, 600);
// ctx.stroke();

// /**
//  * textAlign 将文本的左边或者右边对其Y轴
//  * start/left 等效
//  * end/right 等效
//  */
// ctx.textAlign = 'left';
// ctx.fillText('LEFT TEXT', 500, 100);
// ctx.textAlign = 'right';
// ctx.fillText('RIGHT TEXT', 500, 150);

// ctx.textAlign = 'start';
// ctx.fillText('START TEXT', 500, 200);
// ctx.textAlign = 'end';
// ctx.fillText('END TEXT', 500, 250);


