class AISnake extends Snake {
    constructor(canvas, initialX, initialY) {
        super(canvas, initialX, initialY, '#00ff00');
        this.pathfindingGrid = [];
        this.gridSize = this.size;
    }

    // 初始化寻路网格
    initGrid() {
        const width = this.canvas.width / this.gridSize;
        const height = this.canvas.height / this.gridSize;
        this.pathfindingGrid = [];

        for (let y = 0; y < height; y++) {
            this.pathfindingGrid[y] = [];
            for (let x = 0; x < width; x++) {
                this.pathfindingGrid[y][x] = {
                    x: x * this.gridSize,
                    y: y * this.gridSize,
                    f: 0,
                    g: 0,
                    h: 0,
                    parent: null,
                    closed: false
                };
            }
        }
    }

    // 获取网格节点
    getNode(x, y) {
        const gridX = Math.floor(x / this.gridSize);
        const gridY = Math.floor(y / this.gridSize);
        if (gridY >= 0 && gridY < this.pathfindingGrid.length &&
            gridX >= 0 && gridX < this.pathfindingGrid[0].length) {
            return this.pathfindingGrid[gridY][gridX];
        }
        return null;
    }

    // 获取相邻节点
    getNeighbors(node) {
        const neighbors = [];
        const directions = [
            { x: 0, y: -this.gridSize },  // 上
            { x: this.gridSize, y: 0 },   // 右
            { x: 0, y: this.gridSize },   // 下
            { x: -this.gridSize, y: 0 }   // 左
        ];

        for (const dir of directions) {
            let newX = (node.x + dir.x + this.canvas.width) % this.canvas.width;
            let newY = (node.y + dir.y + this.canvas.height) % this.canvas.height;
            const neighbor = this.getNode(newX, newY);
            
            if (neighbor && !this.isCollision(newX, newY)) {
                neighbors.push(neighbor);
            }
        }

        return neighbors;
    }

    // 检查位置是否会发生碰撞
    isCollision(x, y) {
        // 检查是否与自身碰撞
        for (let i = 1; i < this.body.length; i++) {
            if (x === this.body[i].x && y === this.body[i].y) {
                return true;
            }
        }
        return false;
    }

    // 曼哈顿距离启发式函数
    heuristic(pos0, pos1) {
        const dx = Math.abs(pos0.x - pos1.x);
        const dy = Math.abs(pos0.y - pos1.y);
        return dx + dy;
    }

    // A*寻路算法
    findPath(target) {
        this.initGrid();
        const startNode = this.getNode(this.body[0].x, this.body[0].y);
        const endNode = this.getNode(target.x, target.y);
        
        if (!startNode || !endNode) return null;

        const openSet = [startNode];
        startNode.g = 0;
        startNode.f = this.heuristic(startNode, endNode);

        while (openSet.length > 0) {
            // 找到F值最小的节点
            let current = openSet[0];
            let currentIndex = 0;
            for (let i = 1; i < openSet.length; i++) {
                if (openSet[i].f < current.f) {
                    current = openSet[i];
                    currentIndex = i;
                }
            }

            // 到达目标
            if (current.x === endNode.x && current.y === endNode.y) {
                const path = [];
                let curr = current;
                while (curr.parent) {
                    path.unshift(curr);
                    curr = curr.parent;
                }
                return path;
            }

            // 移除当前节点
            openSet.splice(currentIndex, 1);
            current.closed = true;

            // 检查相邻节点
            const neighbors = this.getNeighbors(current);
            for (const neighbor of neighbors) {
                if (neighbor.closed) continue;

                const gScore = current.g + this.gridSize;

                if (!openSet.includes(neighbor)) {
                    openSet.push(neighbor);
                } else if (gScore >= neighbor.g) {
                    continue;
                }

                neighbor.parent = current;
                neighbor.g = gScore;
                neighbor.f = neighbor.g + this.heuristic(neighbor, endNode);
            }
        }

        return null; // 没找到路径
    }

    // 更新AI移动
    updateAI(food, playerSnake) {
        const path = this.findPath(food.position);
        
        if (path && path.length > 0) {
            const nextMove = path[0];
            const head = this.body[0];
            
            // 根据下一个位置决定移动方向
            if (nextMove.x > head.x) this.changeDirection('ArrowRight');
            else if (nextMove.x < head.x) this.changeDirection('ArrowLeft');
            else if (nextMove.y > head.y) this.changeDirection('ArrowDown');
            else if (nextMove.y < head.y) this.changeDirection('ArrowUp');
        }
    }
}