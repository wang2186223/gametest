// Matter.js 物理引擎 CDN 加载
(function loadMatterJS() {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/matter-js/0.19.0/matter.min.js';
    script.onload = () => initGame();
    document.head.appendChild(script);
})();

// 球体颜色配置
const BALL_COLORS = {
    2: { gradient: ['#667eea', '#764ba2'], text: '#fff' },
    4: { gradient: ['#f093fb', '#f5576c'], text: '#fff' },
    8: { gradient: ['#4facfe', '#00f2fe'], text: '#fff' },
    16: { gradient: ['#43e97b', '#38f9d7'], text: '#fff' },
    32: { gradient: ['#fa709a', '#fee140'], text: '#fff' },
    64: { gradient: ['#30cfd0', '#330867'], text: '#fff' },
    128: { gradient: ['#a8edea', '#fed6e3'], text: '#333' },
    256: { gradient: ['#ff9a9e', '#fecfef'], text: '#333' },
    512: { gradient: ['#ffecd2', '#fcb69f'], text: '#333' },
    1024: { gradient: ['#ff6e7f', '#bfe9ff'], text: '#fff' },
    2048: { gradient: ['#e0c3fc', '#8ec5fc'], text: '#fff' },
    4096: { gradient: ['#f77062', '#fe5196'], text: '#fff' }
};

// 游戏配置
const CONFIG = {
    ballRadius: 20,
    minValue: 2,
    maxStartValue: 32,
    gravity: 0.8,
    restitution: 0.3,
    friction: 0.1,
    mergeDelay: 100,
    gameOverLine: 100
};

class Ball2048Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.score = 0;
        this.bestScore = this.loadBestScore();
        this.balls = [];
        this.nextBallValue = this.getRandomBallValue();
        this.mouseX = 0;
        this.aimLineActive = false;
        this.gameOver = false;
        this.gameWon = false;
        this.canDrop = true;
        this.mergingPairs = new Set();
        
        this.setupCanvas();
        this.updateBestScore();
    }

    init() {
        const { Engine, Render, World, Bodies, Events, Runner } = Matter;

        // 创建引擎
        this.engine = Engine.create();
        this.world = this.engine.world;
        this.world.gravity.y = CONFIG.gravity;

        // 创建渲染器
        this.render = Render.create({
            canvas: this.canvas,
            engine: this.engine,
            options: {
                width: this.canvas.width,
                height: this.canvas.height,
                wireframes: false,
                background: 'transparent'
            }
        });

        // 创建边界墙
        this.createWalls();

        // 启动引擎和渲染
        const runner = Runner.create();
        Runner.run(runner, this.engine);
        Render.run(this.render);

        // 碰撞检测
        Events.on(this.engine, 'collisionStart', (event) => {
            this.handleCollisions(event.pairs);
        });

        // 每帧更新
        Events.on(this.engine, 'afterUpdate', () => {
            this.checkGameOver();
            this.drawBalls();
        });

        // 设置事件监听
        this.setupEventListeners();
        this.updateNextBall();
    }

    setupCanvas() {
        const container = this.canvas.parentElement;
        const rect = container.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
    }

    createWalls() {
        const { Bodies, World } = Matter;
        const thickness = 50;
        const width = this.canvas.width;
        const height = this.canvas.height;

        // 底部
        const ground = Bodies.rectangle(width / 2, height + thickness / 2, width, thickness, {
            isStatic: true,
            render: { fillStyle: 'transparent' }
        });

        // 左墙
        const leftWall = Bodies.rectangle(-thickness / 2, height / 2, thickness, height * 2, {
            isStatic: true,
            render: { fillStyle: 'transparent' }
        });

        // 右墙
        const rightWall = Bodies.rectangle(width + thickness / 2, height / 2, thickness, height * 2, {
            isStatic: true,
            render: { fillStyle: 'transparent' }
        });

        World.add(this.world, [ground, leftWall, rightWall]);
    }

    setupEventListeners() {
        // 鼠标/触摸移动
        this.canvas.addEventListener('mousemove', (e) => this.handleMove(e));
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            this.handleMove(e.touches[0]);
        }, { passive: false });

        // 鼠标/触摸点击
        this.canvas.addEventListener('click', (e) => this.handleClick(e));
        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            if (e.changedTouches.length > 0) {
                this.handleClick(e.changedTouches[0]);
            }
        }, { passive: false });

        // 鼠标离开
        this.canvas.addEventListener('mouseleave', () => {
            this.aimLineActive = false;
            this.updateAimLine();
        });

        // 按钮事件
        document.getElementById('restartBtn').addEventListener('click', () => this.restart());
        document.getElementById('retryBtn').addEventListener('click', () => this.restart());
        document.getElementById('continueBtn').addEventListener('click', () => this.continueGame());
        document.getElementById('restartWinBtn').addEventListener('click', () => this.restart());
    }

    handleMove(e) {
        if (this.gameOver) return;
        
        const rect = this.canvas.getBoundingClientRect();
        this.mouseX = e.clientX - rect.left;
        this.aimLineActive = true;
        this.updateAimLine();
    }

    handleClick(e) {
        if (!this.canDrop || this.gameOver) return;

        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        
        this.dropBall(x);
    }

    dropBall(x) {
        const { Bodies, World } = Matter;
        
        // 限制投放范围
        const radius = this.getBallRadius(this.nextBallValue);
        x = Math.max(radius + 10, Math.min(x, this.canvas.width - radius - 10));

        const ball = Bodies.circle(x, 50, radius, {
            restitution: CONFIG.restitution,
            friction: CONFIG.friction,
            render: {
                fillStyle: this.getBallColor(this.nextBallValue)
            }
        });

        ball.value = this.nextBallValue;
        ball.merged = false;

        World.add(this.world, ball);
        this.balls.push(ball);

        // 准备下一个球
        this.canDrop = false;
        setTimeout(() => {
            this.nextBallValue = this.getRandomBallValue();
            this.updateNextBall();
            this.canDrop = true;
        }, 500);

        this.aimLineActive = false;
        this.updateAimLine();
    }

    handleCollisions(pairs) {
        const { World, Body } = Matter;

        pairs.forEach(pair => {
            const { bodyA, bodyB } = pair;

            // 检查是否是两个球
            if (!bodyA.value || !bodyB.value) return;
            if (bodyA.merged || bodyB.merged) return;
            if (bodyA.value !== bodyB.value) return;

            // 防止重复合并
            const pairKey = [bodyA.id, bodyB.id].sort().join('-');
            if (this.mergingPairs.has(pairKey)) return;
            this.mergingPairs.add(pairKey);

            // 延迟合并，等待物理稳定
            setTimeout(() => {
                if (!this.world.bodies.includes(bodyA) || !this.world.bodies.includes(bodyB)) {
                    this.mergingPairs.delete(pairKey);
                    return;
                }

                // 合并球体
                const newValue = bodyA.value * 2;
                const midX = (bodyA.position.x + bodyB.position.x) / 2;
                const midY = (bodyA.position.y + bodyB.position.y) / 2;

                // 移除旧球
                World.remove(this.world, bodyA);
                World.remove(this.world, bodyB);
                this.balls = this.balls.filter(b => b !== bodyA && b !== bodyB);

                // 创建新球
                const newRadius = this.getBallRadius(newValue);
                const newBall = Matter.Bodies.circle(midX, midY, newRadius, {
                    restitution: CONFIG.restitution,
                    friction: CONFIG.friction,
                    render: {
                        fillStyle: this.getBallColor(newValue)
                    }
                });

                newBall.value = newValue;
                newBall.merged = false;

                // 添加合并动画效果
                Body.setVelocity(newBall, { x: 0, y: -2 });

                World.add(this.world, newBall);
                this.balls.push(newBall);

                // 更新分数
                this.score += newValue;
                this.updateScore();

                // 检查是否达到2048
                if (newValue === 2048 && !this.gameWon) {
                    this.gameWon = true;
                    setTimeout(() => this.showWin(), 500);
                }

                this.mergingPairs.delete(pairKey);
            }, CONFIG.mergeDelay);
        });
    }

    drawBalls() {
        this.balls.forEach(ball => {
            const { x, y } = ball.position;
            const radius = ball.circleRadius;
            const value = ball.value;

            // 绘制球体
            const gradient = this.ctx.createRadialGradient(x - radius/3, y - radius/3, 0, x, y, radius);
            const colors = BALL_COLORS[value] || BALL_COLORS[4096];
            gradient.addColorStop(0, colors.gradient[0]);
            gradient.addColorStop(1, colors.gradient[1]);

            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(x, y, radius, 0, Math.PI * 2);
            this.ctx.fill();

            // 绘制高光效果
            const highlightGradient = this.ctx.createRadialGradient(
                x - radius/3, y - radius/3, 0,
                x - radius/3, y - radius/3, radius/2
            );
            highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
            highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

            this.ctx.fillStyle = highlightGradient;
            this.ctx.beginPath();
            this.ctx.arc(x, y, radius, 0, Math.PI * 2);
            this.ctx.fill();

            // 绘制数字
            this.ctx.fillStyle = colors.text;
            this.ctx.font = `bold ${radius * 0.8}px Arial`;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(value, x, y);
        });
    }

    updateAimLine() {
        const aimLine = document.getElementById('aimLine');
        
        if (this.aimLineActive && this.canDrop && !this.gameOver) {
            aimLine.style.display = 'block';
            aimLine.style.left = this.mouseX + 'px';
            aimLine.style.top = '0';
            aimLine.style.height = '80px';
        } else {
            aimLine.style.display = 'none';
        }
    }

    checkGameOver() {
        for (const ball of this.balls) {
            if (ball.position.y < CONFIG.gameOverLine) {
                if (!this.gameOver) {
                    this.gameOver = true;
                    setTimeout(() => this.showGameOver(), 500);
                }
                break;
            }
        }
    }

    showGameOver() {
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('gameOver').classList.remove('hidden');
    }

    showWin() {
        document.getElementById('winScore').textContent = this.score;
        document.getElementById('gameWin').classList.remove('hidden');
    }

    continueGame() {
        document.getElementById('gameWin').classList.add('hidden');
    }

    restart() {
        // 清除所有球体
        const { World } = Matter;
        this.balls.forEach(ball => World.remove(this.world, ball));
        this.balls = [];
        
        // 重置状态
        this.score = 0;
        this.gameOver = false;
        this.gameWon = false;
        this.canDrop = true;
        this.nextBallValue = this.getRandomBallValue();
        this.mergingPairs.clear();
        
        // 更新UI
        this.updateScore();
        this.updateNextBall();
        document.getElementById('gameOver').classList.add('hidden');
        document.getElementById('gameWin').classList.add('hidden');
    }

    getRandomBallValue() {
        const values = [2, 2, 2, 4, 4, 8];
        return values[Math.floor(Math.random() * values.length)];
    }

    getBallRadius(value) {
        const baseRadius = CONFIG.ballRadius;
        if (value <= 8) return baseRadius;
        if (value <= 32) return baseRadius * 1.2;
        if (value <= 128) return baseRadius * 1.4;
        if (value <= 512) return baseRadius * 1.6;
        return baseRadius * 1.8;
    }

    getBallColor(value) {
        const colors = BALL_COLORS[value] || BALL_COLORS[4096];
        return colors.gradient[0];
    }

    updateNextBall() {
        const nextBall = document.getElementById('nextBall');
        nextBall.textContent = this.nextBallValue;
        nextBall.className = `next-ball ball-${this.nextBallValue}`;
    }

    updateScore() {
        document.getElementById('score').textContent = this.score;
        
        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            this.updateBestScore();
            this.saveBestScore();
        }
    }

    updateBestScore() {
        document.getElementById('best').textContent = this.bestScore;
    }

    saveBestScore() {
        localStorage.setItem('ball2048-best', this.bestScore);
    }

    loadBestScore() {
        return parseInt(localStorage.getItem('ball2048-best')) || 0;
    }
}

// 初始化游戏
function initGame() {
    const game = new Ball2048Game();
    game.init();

    // 窗口大小改变时重新设置画布
    window.addEventListener('resize', () => {
        game.setupCanvas();
        // 重启物理引擎以适应新尺寸
        game.restart();
    });
}
