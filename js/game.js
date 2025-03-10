class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // 基本网格单位大小
        this.gridSize = 20;
        
        // 设置游戏区域的网格数量
        this.gridWidth = 40;  // 水平方向的网格数
        this.gridHeight = 30; // 垂直方向的网格数
        
        // 设置画布大小
        this.resizeCanvas();
        
        // 监听窗口大小变化
        window.addEventListener('resize', this.resizeCanvas.bind(this));
        
        // 初始化蛇和食物
        this.playerSnake = new Snake(this.canvas, this.gridToPixel(6), this.gridToPixel(15), '#3498db');
        this.aiSnake = new AISnake(this.canvas, this.gridToPixel(34), this.gridToPixel(15));
        this.food = new Food(this.canvas);
        
        this.gameLoop = this.gameLoop.bind(this);
        this.lastUpdateTime = 0;
        this.updateInterval = 100; // 更新间隔（毫秒）
        
        // 游戏状态 - 默认为停止状态，等待用户启动
        this.gameState = {
            running: false,
            paused: false,
            over: false
        };
        
        // 设置事件监听器
        document.addEventListener('keydown', this.handleKeyPress.bind(this));
        this.setupEventListeners();
        
        // 初始化游戏元素
        this.food.generate([this.playerSnake, this.aiSnake]);
        
        // 绘制初始画面
        this.draw();
        this.drawGameMessage('按回车键开始游戏');
    }
    
    setupEventListeners() {
        // 开始/重新开始按钮
        const startButton = document.getElementById('start-button');
        startButton.textContent = '开始游戏';
        startButton.addEventListener('click', () => {
            if (!this.gameState.running || this.gameState.over) {
                this.resetGame();
                this.startGame();
            }
        });
        
        // 暂停/继续按钮
        const pauseButton = document.getElementById('pause-button');
        pauseButton.addEventListener('click', () => {
            this.togglePause();
        });
        
        // 停止按钮
        const stopButton = document.getElementById('stop-button');
        if (stopButton) {
            stopButton.addEventListener('click', () => {
                this.stopGame();
            });
        }
    }
    
    handleKeyPress(event) {
        // 只在游戏运行时处理方向键
        if (this.gameState.running && !this.gameState.paused) {
            this.playerSnake.changeDirection(event.key);
        }
        
        // 空格键暂停/继续游戏
        if (event.code === 'Space') {
            this.togglePause();
        }
        
        // 回车键启动/重新开始游戏
        if (event.code === 'Enter') {
            if (this.gameState.over || !this.gameState.running) {
                this.resetGame();
            }
        }
        
        // ESC键停止游戏
        if (event.code === 'Escape') {
            this.stopGame();
        }
    }
    
    togglePause() {
        if (this.gameState.over || !this.gameState.running) return;
        
        this.gameState.paused = !this.gameState.paused;
        const pauseButton = document.getElementById('pause-button');
        
        if (this.gameState.paused) {
            pauseButton.textContent = '继续';
            this.drawGameMessage('游戏暂停 - 按空格键继续');
        } else {
            pauseButton.textContent = '暂停';
            requestAnimationFrame(this.gameLoop);
        }
    }
    
    stopGame() {
        this.gameState.running = false;
        this.gameState.paused = false;
        this.gameState.over = true;
        this.drawGameMessage('游戏已停止 - 按回车键重新开始');
    }
    
    update() {
        // 更新玩家蛇
        if (this.playerSnake.move(this.food)) {
            this.food.generate([this.playerSnake, this.aiSnake]);
            this.updateScore();
        }
        
        // 更新AI蛇
        this.aiSnake.updateAI(this.food, this.playerSnake);
        if (this.aiSnake.move(this.food)) {
            this.food.generate([this.playerSnake, this.aiSnake]);
            this.updateScore();
        }
        
        // 检查碰撞
        if (this.playerSnake.checkCollision()) {
            this.gameOver("游戏结束 - 你撞到了自己");
        } else if (this.playerSnake.checkCollision(this.aiSnake)) {
            this.gameOver("游戏结束 - 你撞到了AI蛇");
        } else if (this.aiSnake.checkCollision()) {
            this.gameOver("恭喜获胜 - AI蛇撞到了自己");
        }
    }
    
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.food.draw(this.ctx);
        this.playerSnake.draw(this.ctx);
        this.aiSnake.draw(this.ctx);
    }
    
    gameLoop(currentTime) {
        // 即使游戏暂停或结束，也需要绘制当前状态
        if (currentTime - this.lastUpdateTime >= this.updateInterval) {
            // 只有在游戏运行中才更新游戏状态
            if (this.gameState.running && !this.gameState.paused && !this.gameState.over) {
                this.update();
            }
            // 无论游戏状态如何，都需要绘制
            this.draw();
            this.lastUpdateTime = currentTime;
        }
        
        // 继续请求下一帧
        requestAnimationFrame(this.gameLoop);
    }
    
    startGame() {
        this.gameState.running = true;
        this.gameState.paused = false;
        this.gameState.over = false;
        document.getElementById('pause-button').textContent = '暂停';
        document.getElementById('start-button').textContent = '重新开始';
        requestAnimationFrame(this.gameLoop);
    }
    
    // 将网格坐标转换为像素坐标
    gridToPixel(gridPos) {
        return gridPos * this.gridSize;
    }
    
    // 调整画布大小
    resizeCanvas() {
        // 获取容器元素
        const container = document.querySelector('.canvas-container');
        if (!container) return;
        
        // 获取容器宽度
        const containerWidth = container.clientWidth;
        
        // 计算理想的画布大小
        const idealWidth = this.gridWidth * this.gridSize;
        const idealHeight = this.gridHeight * this.gridSize;
        
        // 如果容器宽度小于理想宽度，按比例缩放
        if (containerWidth < idealWidth) {
            const scale = containerWidth / idealWidth;
            this.canvas.width = containerWidth;
            this.canvas.height = idealHeight * scale;
            this.canvas.style.width = '100%';
            this.canvas.style.height = 'auto';
            
            // 调整绘图上下文以保持网格的正确比例
            this.ctx.scale(scale, scale);
        } else {
            // 否则使用理想大小
            this.canvas.width = idealWidth;
            this.canvas.height = idealHeight;
            this.canvas.style.width = idealWidth + 'px';
            this.canvas.style.height = idealHeight + 'px';
            
            // 重置绘图上下文
            this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        }
    }
    
    resetGame() {
        // 重置蛇的位置和分数
        this.playerSnake = new Snake(this.canvas, this.gridToPixel(6), this.gridToPixel(15), '#3498db');
        this.aiSnake = new AISnake(this.canvas, this.gridToPixel(34), this.gridToPixel(15));
        
        // 重新生成食物
        this.food.generate([this.playerSnake, this.aiSnake]);
        
        // 更新分数显示
        this.updateScore();
        
        // 重置游戏状态
        this.gameState.over = false;
        
        // 直接开始新游戏
        this.startGame();
    }

    // 在画布上显示游戏状态消息
    drawGameMessage(message) {
        const totalWidth = this.gridWidth * this.gridSize;
        const totalHeight = this.gridHeight * this.gridSize;
        
        this.ctx.save();
        
        // 半透明背景
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
        this.ctx.fillRect(0, totalHeight / 2 - 50, totalWidth, 100);
        
        // 边框
        this.ctx.strokeStyle = this.gameState.over ? '#ff5722' : '#4CAF50';
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(5, totalHeight / 2 - 45, totalWidth - 10, 90);
        
        // 文字阴影
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        this.ctx.shadowBlur = 10;
        this.ctx.shadowOffsetX = 2;
        this.ctx.shadowOffsetY = 2;
        
        // 根据画布大小调整字体大小
        const fontSize = Math.min(32, Math.max(18, totalWidth / 25));
        
        // 主要消息
        this.ctx.fillStyle = this.gameState.over ? '#ff5722' : '#ffffff';
        this.ctx.font = `bold ${fontSize}px "Noto Sans SC"`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        // 如果消息包含 - 分隔符，分两行显示
        if (message.includes(' - ')) {
            const [mainMsg, subMsg] = message.split(' - ');
            this.ctx.fillText(mainMsg, totalWidth / 2, totalHeight / 2 - 15);
            
            // 次要消息
            this.ctx.fillStyle = '#cccccc';
            this.ctx.font = `${fontSize * 0.7}px "Noto Sans SC"`;
            this.ctx.fillText(subMsg, totalWidth / 2, totalHeight / 2 + 20);
        } else {
            this.ctx.fillText(message, totalWidth / 2, totalHeight / 2);
        }
        
        this.ctx.restore();
    }
    
    updateScore() {
        document.getElementById('playerScore').textContent = this.playerSnake.score;
        document.getElementById('aiScore').textContent = this.aiSnake.score;
    }
    
    gameOver(message) {
        this.gameState.running = false;
        this.gameState.over = true;
        this.gameOverMessage = message + " - 按回车键重新开始";
        
        // 更新按钮文本
        document.getElementById('start-button').textContent = '开始游戏';
        
        // 游戏结束后不自动重新开始，等待用户操作
    }
    
    // 添加食物效果
    createFoodEffect(x, y) {
        this.ctx.beginPath();
        this.ctx.arc(x + this.food.size/2, y + this.food.size/2, this.food.size, 0, Math.PI * 2);
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        this.ctx.fill();
    }
    
    // 绘制网格背景
    drawGrid() {
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        this.ctx.lineWidth = 1;
        
        // 使用类的网格大小
        const totalWidth = this.gridWidth * this.gridSize;
        const totalHeight = this.gridHeight * this.gridSize;
        
        // 绘制垂直线
        for (let x = 0; x <= totalWidth; x += this.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, totalHeight);
            this.ctx.stroke();
        }
        
        // 绘制水平线
        for (let y = 0; y <= totalHeight; y += this.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(totalWidth, y);
            this.ctx.stroke();
        }
    }
    
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制网格背景
        this.drawGrid();
        
        // 绘制食物效果
        this.createFoodEffect(this.food.position.x, this.food.position.y);
        
        // 绘制游戏元素
        this.food.draw(this.ctx);
        this.playerSnake.draw(this.ctx);
        this.aiSnake.draw(this.ctx);

        // 在游戏暂停或结束时显示状态消息
        if (this.gameState.paused) {
            this.drawGameMessage('游戏暂停');
        } else if (this.gameState.over) {
            this.drawGameMessage(this.gameOverMessage || '游戏结束');
        }
    }
}

window.onload = () => {
    // 创建全局游戏实例
    window.gameInstance = new Game();
};