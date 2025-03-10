class Snake {
    constructor(canvas, initialX, initialY, color) {
        this.canvas = canvas;
        // 获取游戏实例中的网格大小
        const game = window.gameInstance;
        this.size = game ? game.gridSize : 20;
        this.color = color;
        this.speed = { x: this.size, y: 0 };
        this.body = [
            { x: initialX, y: initialY },
            { x: initialX - this.size, y: initialY },
            { x: initialX - this.size * 2, y: initialY }
        ];
        this.score = 0;
    }

    move(food) {
        const head = { x: this.body[0].x + this.speed.x, y: this.body[0].y + this.speed.y };
        
        // 处理穿墙
        head.x = (head.x + this.canvas.width) % this.canvas.width;
        head.y = (head.y + this.canvas.height) % this.canvas.height;

        this.body.unshift(head);

        // 检查是否吃到食物
        if (head.x === food.position.x && head.y === food.position.y) {
            this.score++;
            return true;
        }

        this.body.pop();
        return false;
    }

    checkCollision(otherSnake = null) {
        const head = this.body[0];

        // 检查自身碰撞
        for (let i = 1; i < this.body.length; i++) {
            if (head.x === this.body[i].x && head.y === this.body[i].y) {
                return true;
            }
        }

        // 检查与其他蛇的碰撞
        if (otherSnake) {
            return otherSnake.body.some(segment => 
                head.x === segment.x && head.y === segment.y
            );
        }

        return false;
    }

    changeDirection(direction) {
        const directions = {
            'ArrowUp': { x: 0, y: -this.size },
            'ArrowDown': { x: 0, y: this.size },
            'ArrowLeft': { x: -this.size, y: 0 },
            'ArrowRight': { x: this.size, y: 0 }
        };

        const newDirection = directions[direction];
        if (newDirection) {
            // 防止直接反向
            if (this.speed.x !== -newDirection.x || this.speed.y !== -newDirection.y) {
                this.speed = newDirection;
            }
        }
    }

    draw(ctx) {
        // 绘制蛇身
        this.body.forEach((segment, index) => {
            // 为蛇身创建渐变颜色
            const alpha = 0.7 + (0.3 * (1 - index / this.body.length));
            
            // 绘制圆角矩形
            this.drawRoundedRect(
                ctx, 
                segment.x, 
                segment.y, 
                this.size, 
                this.size, 
                index === 0 ? 8 : 4, // 蛇头圆角更大
                this.color,
                alpha,
                index === 0 // 是否是蛇头
            );
            
            // 为蛇头添加眼睛
            if (index === 0) {
                this.drawEyes(ctx, segment.x, segment.y);
            }
        });
    }
    
    // 绘制圆角矩形
    drawRoundedRect(ctx, x, y, width, height, radius, color, alpha, isHead) {
        ctx.save();
        
        // 创建基本形状
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.arcTo(x + width, y, x + width, y + height, radius);
        ctx.arcTo(x + width, y + height, x, y + height, radius);
        ctx.arcTo(x, y + height, x, y, radius);
        ctx.arcTo(x, y, x + width, y, radius);
        ctx.closePath();
        
        // 填充主体颜色
        ctx.fillStyle = isHead ? color : color + Math.floor(alpha * 255).toString(16);
        ctx.fill();
        
        // 添加光泽效果
        const gradient = ctx.createLinearGradient(x, y, x, y + height);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${isHead ? 0.3 : 0.15})`);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // 添加边框
        if (isHead) {
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.stroke();
        }
        
        ctx.restore();
    }
    
    // 绘制蛇眼睛
    drawEyes(ctx, x, y) {
        const eyeSize = this.size / 5;
        const eyeOffset = this.size / 3;
        
        // 确定眼睛位置基于移动方向
        let eyeX1, eyeY1, eyeX2, eyeY2;
        
        if (this.speed.x > 0) { // 向右
            eyeX1 = eyeX2 = x + this.size - eyeOffset;
            eyeY1 = y + eyeOffset;
            eyeY2 = y + this.size - eyeOffset;
        } else if (this.speed.x < 0) { // 向左
            eyeX1 = eyeX2 = x + eyeOffset;
            eyeY1 = y + eyeOffset;
            eyeY2 = y + this.size - eyeOffset;
        } else if (this.speed.y < 0) { // 向上
            eyeY1 = eyeY2 = y + eyeOffset;
            eyeX1 = x + eyeOffset;
            eyeX2 = x + this.size - eyeOffset;
        } else { // 向下
            eyeY1 = eyeY2 = y + this.size - eyeOffset;
            eyeX1 = x + eyeOffset;
            eyeX2 = x + this.size - eyeOffset;
        }
        
        // 绘制眼白
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(eyeX1, eyeY1, eyeSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(eyeX2, eyeY2, eyeSize, 0, Math.PI * 2);
        ctx.fill();
        
        // 绘制眼球
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(eyeX1, eyeY1, eyeSize / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(eyeX2, eyeY2, eyeSize / 2, 0, Math.PI * 2);
        ctx.fill();
    }
}