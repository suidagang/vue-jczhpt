/* eslint-disable no-param-reassign */
/* eslint-disable max-classes-per-file */
const randomNum = (min = 1, max = 9) => Math.floor(Math.random() * (max - min + 1) + min);

class Star {
  constructor(width, height) {
    this.x = randomNum(width / 2 - 800, width / 2 + 800);
    this.y = randomNum(height / 2 - 800, height / 2 + 800);
    // 流星雨的长度
    this.length = randomNum(180, 250);
    const dx = this.x - width / 2;
    const dy = this.y - height / 2;
    let sin = null;
    let cos = null;
    if (dx !== 0 || dy !== 0) {
      sin = dy / Math.sqrt(dx * dx + dy * dy);
      cos = dx / Math.sqrt(dx * dx + dy * dy);
    }
    this.width = cos !== null || sin !== null ? this.length * cos : 0; // 流星所占的宽度
    this.height = cos !== null || sin !== null ? this.length * sin : this.length; // 流星所占的高度
    const speed = randomNum(5, 6);
    this.offset_x = speed * cos;
    this.offset_y = speed * sin;
  }

  // 绘制流星
  draw(ctx) {
    ctx.save();
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.globalAlpha = 1;
    const line = ctx.createLinearGradient(this.x, this.y, this.x + this.width, this.y + this.height);
    line.addColorStop(0, 'rgba(17,40,81,1)');
    line.addColorStop(0.6, 'rgba(42,74,120,1)');
    line.addColorStop(1, 'rgba(56,130,131,1)');
    ctx.strokeStyle = line;
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x + this.width, this.y + this.height);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
  }

  move() {
    this.x += this.offset_x;
    this.y += this.offset_y;
  }
}

class Tx {
  constructor(canvas, count) {
    this.ctx = canvas.getContext('2d');
    this.width = canvas.width;
    this.height = canvas.height;
    this.count = count;
    this.stars = [];
    this.animationFrameId = null;
  }

  drawStars() {
    for (let i = 0; i < this.count; i++) {
      this.stars.push(new Star(this.width, this.height));
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    for (let i = 0; i < this.stars.length; i++) {
      this.stars[i].draw(this.ctx);
      this.stars[i].move();
      if (this.stars[i].x > this.width || this.stars[i].x < 0 || this.stars[i].y > this.height || this.stars[i].y < 0) {
        this.stars.splice(i, 1);
        this.stars.push(new Star(this.width, this.height));
        // eslint-disable-next-line no-plusplus
        i--;
      }
    }
    this.animationFrameId = window.requestAnimationFrame(() => this.animate());
  }

  clearAnimationFrame() {
    window.cancelAnimationFrame(this.animationFrameId);
  }
}

export function init(canvas) {
  canvas.width = 3840;
  canvas.height = 990;
  const tx = new Tx(canvas, 200);
  tx.drawStars();
  tx.animate();
  return tx;
}
