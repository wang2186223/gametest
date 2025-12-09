// 2048 游戏核心逻辑
class Game2048 {
    constructor() {
        this.size = 4;
        this.grid = [];
        this.score = 0;
        this.bestScore = this.loadBestScore();
        this.history = [];
        this.maxHistoryLength = 1; // 只保存一步撤销
        
        this.initDOM();
        this.init();
        this.setupEventListeners();
    }

    // 初始化 DOM 元素
    initDOM() {
        this.gridContainer = document.getElementById('grid-container');
        this.tileContainer = document.getElementById('tile-container');
        this.scoreElement = document.getElementById('score');
        this.bestScoreElement = document.getElementById('best-score');
        this.gameMessage = document.getElementById('game-message');
        this.messageTitle = document.getElementById('message-title');
        this.messageText = document.getElementById('message-text');

        // 创建网格背景
        for (let i = 0; i < this.size * this.size; i++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            this.gridContainer.appendChild(cell);
        }

        this.updateBestScore();
    }

    // 初始化游戏
    init() {
        this.grid = [];
        for (let i = 0; i < this.size; i++) {
            this.grid[i] = [];
            for (let j = 0; j < this.size; j++) {
                this.grid[i][j] = 0;
            }
        }
        this.score = 0;
        this.history = [];
        this.updateScore();
        this.hideMessage();
        this.clearTiles();
        
        // 添加两个初始方块
        this.addRandomTile();
        this.addRandomTile();
        this.renderGrid();
    }

    // 设置事件监听
    setupEventListeners() {
        // 键盘事件
        document.addEventListener('keydown', (e) => {
            if (e.key.startsWith('Arrow')) {
                e.preventDefault();
                this.handleMove(e.key);
            }
        });

        // 触摸事件
        let touchStartX = 0;
        let touchStartY = 0;

        this.gridContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        });

        this.gridContainer.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;

            if (Math.abs(deltaX) > 30 || Math.abs(deltaY) > 30) {
                if (Math.abs(deltaX) > Math.abs(deltaY)) {
                    this.handleMove(deltaX > 0 ? 'ArrowRight' : 'ArrowLeft');
                } else {
                    this.handleMove(deltaY > 0 ? 'ArrowDown' : 'ArrowUp');
                }
            }
        });

        // 按钮事件
        document.getElementById('new-game').addEventListener('click', () => {
            this.init();
        });

        document.getElementById('undo').addEventListener('click', () => {
            this.undo();
        });

        document.getElementById('retry-button').addEventListener('click', () => {
            this.init();
        });
    }

    // 处理移动
    handleMove(direction) {
        if (this.isGameOver()) return;

        this.saveState();

        let moved = false;
        const oldGrid = JSON.stringify(this.grid);

        switch (direction) {
            case 'ArrowUp':
                moved = this.moveUp();
                break;
            case 'ArrowDown':
                moved = this.moveDown();
                break;
            case 'ArrowLeft':
                moved = this.moveLeft();
                break;
            case 'ArrowRight':
                moved = this.moveRight();
                break;
        }

        if (moved) {
            this.addRandomTile();
            this.renderGrid();
            this.updateScore();
            
            if (this.checkWin()) {
                this.showMessage('胜利！', '恭喜你达到了 2048！');
            } else if (this.isGameOver()) {
                this.showMessage('游戏结束', `你的分数：${this.score}`);
            }
        } else {
            // 没有移动，移除保存的状态
            this.history.pop();
        }
    }

    // 保存状态（用于撤销）
    saveState() {
        this.history.push({
            grid: JSON.parse(JSON.stringify(this.grid)),
            score: this.score
        });
        
        if (this.history.length > this.maxHistoryLength) {
            this.history.shift();
        }
    }

    // 撤销
    undo() {
        if (this.history.length === 0) return;
        
        const lastState = this.history.pop();
        this.grid = lastState.grid;
        this.score = lastState.score;
        
        this.renderGrid();
        this.updateScore();
        this.hideMessage();
    }

    // 向上移动
    moveUp() {
        let moved = false;
        for (let col = 0; col < this.size; col++) {
            const column = this.getColumn(col);
            const newColumn = this.mergeLine(column);
            if (JSON.stringify(column) !== JSON.stringify(newColumn)) {
                moved = true;
            }
            this.setColumn(col, newColumn);
        }
        return moved;
    }

    // 向下移动
    moveDown() {
        let moved = false;
        for (let col = 0; col < this.size; col++) {
            const column = this.getColumn(col).reverse();
            const newColumn = this.mergeLine(column);
            if (JSON.stringify(column) !== JSON.stringify(newColumn)) {
                moved = true;
            }
            this.setColumn(col, newColumn.reverse());
        }
        return moved;
    }

    // 向左移动
    moveLeft() {
        let moved = false;
        for (let row = 0; row < this.size; row++) {
            const newRow = this.mergeLine(this.grid[row]);
            if (JSON.stringify(this.grid[row]) !== JSON.stringify(newRow)) {
                moved = true;
            }
            this.grid[row] = newRow;
        }
        return moved;
    }

    // 向右移动
    moveRight() {
        let moved = false;
        for (let row = 0; row < this.size; row++) {
            const reversedRow = [...this.grid[row]].reverse();
            const newRow = this.mergeLine(reversedRow).reverse();
            if (JSON.stringify(this.grid[row]) !== JSON.stringify(newRow)) {
                moved = true;
            }
            this.grid[row] = newRow;
        }
        return moved;
    }

    // 合并一行/列
    mergeLine(line) {
        // 移除零
        let newLine = line.filter(val => val !== 0);
        
        // 合并相同的数字
        for (let i = 0; i < newLine.length - 1; i++) {
            if (newLine[i] === newLine[i + 1]) {
                newLine[i] *= 2;
                this.score += newLine[i];
                newLine.splice(i + 1, 1);
            }
        }
        
        // 填充零
        while (newLine.length < this.size) {
            newLine.push(0);
        }
        
        return newLine;
    }

    // 获取列
    getColumn(col) {
        const column = [];
        for (let row = 0; row < this.size; row++) {
            column.push(this.grid[row][col]);
        }
        return column;
    }

    // 设置列
    setColumn(col, values) {
        for (let row = 0; row < this.size; row++) {
            this.grid[row][col] = values[row];
        }
    }

    // 添加随机方块
    addRandomTile() {
        const emptyCells = [];
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.grid[i][j] === 0) {
                    emptyCells.push({ row: i, col: j });
                }
            }
        }

        if (emptyCells.length > 0) {
            const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            this.grid[randomCell.row][randomCell.col] = Math.random() < 0.9 ? 2 : 4;
        }
    }

    // 渲染网格
    renderGrid() {
        this.clearTiles();

        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                const value = this.grid[row][col];
                if (value !== 0) {
                    this.createTile(row, col, value);
                }
            }
        }
    }

    // 清除所有方块
    clearTiles() {
        this.tileContainer.innerHTML = '';
    }

    // 创建方块
    createTile(row, col, value) {
        const tile = document.createElement('div');
        tile.className = `tile tile-${value} tile-new`;
        
        if (value > 2048) {
            tile.className += ' tile-super';
        }
        
        tile.textContent = value;
        
        // 计算位置和大小
        const containerWidth = this.tileContainer.offsetWidth;
        const cellSize = (containerWidth - 15 * 3) / 4; // 15px 是间距
        const position = this.getTilePosition(row, col, cellSize);
        
        tile.style.width = cellSize + 'px';
        tile.style.height = cellSize + 'px';
        tile.style.left = position.x + 'px';
        tile.style.top = position.y + 'px';
        
        this.tileContainer.appendChild(tile);
    }

    // 获取方块位置
    getTilePosition(row, col, cellSize) {
        const gap = 15;
        return {
            x: col * (cellSize + gap),
            y: row * (cellSize + gap)
        };
    }

    // 更新分数
    updateScore() {
        this.scoreElement.textContent = this.score;
        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            this.updateBestScore();
            this.saveBestScore();
        }
    }

    // 更新最高分
    updateBestScore() {
        this.bestScoreElement.textContent = this.bestScore;
    }

    // 保存最高分
    saveBestScore() {
        localStorage.setItem('2048-best-score', this.bestScore);
    }

    // 加载最高分
    loadBestScore() {
        return parseInt(localStorage.getItem('2048-best-score')) || 0;
    }

    // 检查是否获胜
    checkWin() {
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                if (this.grid[row][col] === 2048) {
                    return true;
                }
            }
        }
        return false;
    }

    // 检查游戏是否结束
    isGameOver() {
        // 检查是否有空格
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                if (this.grid[row][col] === 0) {
                    return false;
                }
            }
        }

        // 检查是否可以合并
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                const value = this.grid[row][col];
                // 检查右边
                if (col < this.size - 1 && this.grid[row][col + 1] === value) {
                    return false;
                }
                // 检查下面
                if (row < this.size - 1 && this.grid[row + 1][col] === value) {
                    return false;
                }
            }
        }

        return true;
    }

    // 显示消息
    showMessage(title, text) {
        this.messageTitle.textContent = title;
        this.messageText.textContent = text;
        this.gameMessage.classList.remove('hidden');
    }

    // 隐藏消息
    hideMessage() {
        this.gameMessage.classList.add('hidden');
    }
}

// 初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    new Game2048();
});
