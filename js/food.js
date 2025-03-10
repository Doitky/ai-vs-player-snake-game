class Food {
    constructor(canvas) {
        this.canvas = canvas;
        this.position = { x: 0, y: 0 };
        // 获取游戏实例中的网格大小
        const game = window.gameInstance;
        this.size = game ? game.gridSize : 20;
        this.color = '#ff0000';
        this.pulseSize = 0;
        this.pulseDirection = 1;
        this.types = [
            { color: '#ff0000', value: 1 },  // 红色苹果
            { color: '#ffcc00', value: 2 },  // 黄色香蕉
            { color: '#9c27b0', value: 3 }   // 紫色浆果
        ];
        this.currentType = this.types[0];
        this.animationFrame = 0;
    }

    generate(snakes) {
        const canvasWidth = this.canvas.width;
        const canvasHeight = this.canvas.height;
        
        do {
            this.position.x = Math.floor(Math.random() * (canvasWidth / this.size)) * this.size;
            this.position.y = Math.floor(Math.random() * (canvasHeight / this.size)) * this.size;
        } while (this.checkCollision(snakes));
        
        // 随机选择食物类型
        this.currentType = this.types[Math.floor(Math.random() * this.types.length)];
        this.color = this.currentType.color;
        this.animationFrame = 0;
    }

    checkCollision(snakes) {
        return snakes.some(snake => 
            snake.body.some(segment => 
                segment.x === this.position.x && segment.y === this.position.y
            )
        );
    }

    draw(ctx) {
        // 更新脉动动画
        this.animationFrame++;
        this.pulseSize += 0.05 * this.pulseDirection;
        if (this.pulseSize > 1.5) this.pulseDirection = -1;
        if (this.pulseSize < 0.8) this.pulseDirection = 1;
        
        const centerX = this.position.x + this.size / 2;
        const centerY = this.position.y + this.size / 2;
        
        // 绘制光晕效果
        ctx.beginPath();
        ctx.arc(centerX, centerY, this.size * this.pulseSize, 0, Math.PI * 2);
        ctx.fillStyle = this.color + '33'; // 半透明
        ctx.fill();
        
        // 绘制食物主体
        this.drawFoodType(ctx, this.currentType);
    }
    
    // 根据食物类型绘制不同外观
    drawFoodType(ctx, type) {
        const x = this.position.x;
        const y = this.position.y;
        const size = this.size;
        
        switch(type) {
            case this.types[0]: // 红苹果
                this.drawApple(ctx, x, y, size);
                break;
            case this.types[1]: // 黄色香蕉
                this.drawBanana(ctx, x, y, size);
                break;
            case this.types[2]: // 紫色浆果
                this.drawBerry(ctx, x, y, size);
                break;
            default:
                // 默认食物
                ctx.fillStyle = type.color;
                ctx.fillRect(x, y, size, size);
        }
    }
    
    // 绘制苹果
    drawApple(ctx, x, y, size) {
        const centerX = x + size / 2;
        const centerY = y + size / 2;
        const radius = size / 2 * 0.9;
        
        // 主体
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fillStyle = '#ff0000';
        ctx.fill();
        
        // 高光
        ctx.beginPath();
        ctx.arc(centerX - radius/3, centerY - radius/3, radius/3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fill();
        
        // 茎
        ctx.beginPath();
        ctx.rect(centerX - 1, y, 2, size/5);
        ctx.fillStyle = '#7d5a00';
        ctx.fill();
        
        // 叶子
        ctx.beginPath();
        ctx.ellipse(centerX + 3, y + size/6, 4, 2, Math.PI/4, 0, Math.PI * 2);
        ctx.fillStyle = '#4CAF50';
        ctx.fill();
    }
    
    // 绘制香蕉
    drawBanana(ctx, x, y, size) {
        const centerX = x + size / 2;
        const centerY = y + size / 2;
        
        // 绘制弯曲的香蕉
        ctx.beginPath();
        ctx.moveTo(x + size * 0.3, y + size * 0.2);
        ctx.quadraticCurveTo(
            x + size * 0.1, y + size * 0.5,
            x + size * 0.3, y + size * 0.8
        );
        ctx.quadraticCurveTo(
            x + size * 0.6, y + size * 1.0,
            x + size * 0.8, y + size * 0.7
        );
        ctx.quadraticCurveTo(
            x + size * 0.9, y + size * 0.4,
            x + size * 0.7, y + size * 0.2
        );
        ctx.closePath();
        
        // 填充香蕉颜色
        ctx.fillStyle = '#ffcc00';
        ctx.fill();
        
        // 香蕉高光
        ctx.beginPath();
        ctx.moveTo(x + size * 0.4, y + size * 0.3);
        ctx.quadraticCurveTo(
            x + size * 0.3, y + size * 0.5,
            x + size * 0.4, y + size * 0.7
        );
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.stroke();
    }
    
    // 绘制浆果
    drawBerry(ctx, x, y, size) {
        const centerX = x + size / 2;
        const centerY = y + size / 2;
        const radius = size / 2 * 0.8;
        
        // 绘制浆果主体
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fillStyle = '#9c27b0';
        ctx.fill();
        
        // 添加纹理
        for (let i = 0; i < 5; i++) {
            const angle = (Math.PI * 2 / 5) * i + this.animationFrame / 50;
            const dotX = centerX + Math.cos(angle) * radius * 0.6;
            const dotY = centerY + Math.sin(angle) * radius * 0.6;
            
            ctx.beginPath();
            ctx.arc(dotX, dotY, size/8, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.fill();
        }
        
        // 茎
        ctx.beginPath();
        ctx.rect(centerX - 1, y, 2, size/6);
        ctx.fillStyle = '#4CAF50';
        ctx.fill();
    }
}