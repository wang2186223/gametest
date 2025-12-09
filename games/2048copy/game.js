// 2048 Card Master Game
class CardGame {
    constructor() {
        this.slots = [null, null, null, null]; // 4个卡槽
        this.deck = []; // 卡牌堆
        this.nextCardValue = 2;
        this.score = 0;
        this.bestScore = this.loadBestScore();
        this.level = 1;
        this.targetScore = 500;
        this.baseTarget = 500;
        this.history = [];
        this.maxHistory = 5;
        this.draggedCard = null;
        this.draggedSlot = null;
        this.hintCount = 3;
        
        this.initDeck();
        this.initDOM();
        this.setupEventListeners();
        this.updateUI();
        this.generateNextCard();
    }

    initDeck() {
        // 初始化52张卡牌（权重分配）
        const weights = {
            2: 20,
            4: 15,
            8: 10,
            16: 7
        };
        
        for (const [value, count] of Object.entries(weights)) {
            for (let i = 0; i < count; i++) {
                this.deck.push(parseInt(value));
            }
        }
        
        this.shuffleDeck();
    }

    shuffleDeck() {
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    }

    initDOM() {
        this.deckElement = document.getElementById('deck');
        this.deckCountElement = document.getElementById('deckCount');
        this.slotsContainer = document.getElementById('slotsContainer');
        this.discardPile = document.getElementById('discardPile');
        this.scoreElement = document.getElementById('currentScore');
        this.bestScoreElement = document.getElementById('bestScore');
        this.levelElement = document.getElementById('currentLevel');
        this.targetElement = document.getElementById('targetScore');
        this.progressBar = document.getElementById('progressBar');
        this.nextCardElement = document.getElementById('nextCard');
        this.overlay = document.getElementById('gameOverlay');
        
        this.updateBestScore();
    }

    setupEventListeners() {
        // 卡牌堆点击
        this.deckElement.addEventListener('click', () => this.drawCard());

        // 槽位事件
        const slotElements = document.querySelectorAll('.slot');
        slotElements.forEach((slot, index) => {
            // 拖放事件
            slot.addEventListener('dragover', (e) => this.handleDragOver(e, index));
            slot.addEventListener('dragleave', (e) => this.handleDragLeave(e));
            slot.addEventListener('drop', (e) => this.handleDrop(e, index));
            
            // 触摸事件
            slot.addEventListener('touchmove', (e) => this.handleTouchMove(e));
            slot.addEventListener('touchend', (e) => this.handleTouchEnd(e, index));
        });

        // 弃牌堆事件
        this.discardPile.addEventListener('dragover', (e) => this.handleDiscardDragOver(e));
        this.discardPile.addEventListener('dragleave', (e) => this.handleDiscardDragLeave(e));
        this.discardPile.addEventListener('drop', (e) => this.handleDiscardDrop(e));

        // 按钮事件
        document.getElementById('undoBtn').addEventListener('click', () => this.undo());
        document.getElementById('hintBtn').addEventListener('click', () => this.showHint());
        document.getElementById('newGameBtn').addEventListener('click', () => this.newGame());
        document.getElementById('retryBtn').addEventListener('click', () => this.newGame());
        document.getElementById('continueBtn').addEventListener('click', () => this.continueGame());
    }

    drawCard() {
        if (this.deck.length === 0) {
            this.showMessage('卡牌用完了！', '游戏结束');
            return;
        }

        // 检查是否有空槽
        const emptySlot = this.slots.findIndex(slot => slot === null);
        if (emptySlot === -1) {
            this.showMessage('没有空槽了！', '请合并卡片或丢弃到弃牌堆');
            return;
        }

        // 保存状态
        this.saveState();

        // 抽取下一张卡片
        const value = this.nextCardValue;
        this.placeCard(emptySlot, value);

        // 生成新的下一张
        this.generateNextCard();
        
        this.updateUI();
        this.checkGameState();
    }

    generateNextCard() {
        if (this.deck.length > 0) {
            this.nextCardValue = this.deck.pop();
        } else {
            this.nextCardValue = Math.random() < 0.7 ? 2 : 4;
        }
        
        const nextCard = this.nextCardElement.querySelector('.card-value') || 
                        document.createElement('div');
        nextCard.className = 'card-value';
        nextCard.textContent = this.nextCardValue;
        
        this.nextCardElement.innerHTML = '';
        this.nextCardElement.appendChild(nextCard);
        this.nextCardElement.style.background = this.getCardGradient(this.nextCardValue);
        this.nextCardElement.style.color = this.getCardTextColor(this.nextCardValue);
    }

    placeCard(slotIndex, value, animate = true) {
        const slot = this.slotsContainer.children[slotIndex];
        
        // 创建卡片元素
        const card = document.createElement('div');
        card.className = 'card';
        card.setAttribute('data-value', value);
        card.setAttribute('draggable', 'true');
        card.innerHTML = `<div class="card-value">${value}</div>`;

        // 设置拖拽事件
        card.addEventListener('dragstart', (e) => this.handleDragStart(e, slotIndex));
        card.addEventListener('dragend', (e) => this.handleDragEnd(e));
        
        // 触摸事件
        card.addEventListener('touchstart', (e) => this.handleTouchStart(e, slotIndex));

        // 添加到槽位
        slot.innerHTML = '';
        slot.appendChild(card);
        slot.classList.add('occupied');
        slot.querySelector('.slot-placeholder')?.remove();

        // 更新槽位数据
        this.slots[slotIndex] = value;

        // 动画效果
        if (animate) {
            card.style.animation = 'slideUp 0.3s ease-out';
        }
    }

    handleDragStart(e, slotIndex) {
        this.draggedSlot = slotIndex;
        this.draggedCard = e.target;
        e.target.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
    }

    handleDragEnd(e) {
        e.target.classList.remove('dragging');
        document.querySelectorAll('.slot').forEach(slot => {
            slot.classList.remove('highlight');
        });
        this.discardPile.classList.remove('highlight');
    }

    handleDragOver(e, slotIndex) {
        e.preventDefault();
        if (this.draggedSlot === null) return;

        const targetSlot = e.currentTarget;
        const canMerge = this.slots[slotIndex] === this.slots[this.draggedSlot] && 
                        this.slots[slotIndex] !== null;
        const isEmpty = this.slots[slotIndex] === null;

        if (canMerge || isEmpty) {
            targetSlot.classList.add('highlight');
            e.dataTransfer.dropEffect = 'move';
        }
    }

    handleDragLeave(e) {
        e.currentTarget.classList.remove('highlight');
    }

    handleDrop(e, slotIndex) {
        e.preventDefault();
        e.currentTarget.classList.remove('highlight');

        if (this.draggedSlot === null || this.draggedSlot === slotIndex) return;

        const sourceValue = this.slots[this.draggedSlot];
        const targetValue = this.slots[slotIndex];

        // 保存状态
        this.saveState();

        if (targetValue === null) {
            // 移动到空槽
            this.moveCard(this.draggedSlot, slotIndex);
        } else if (sourceValue === targetValue) {
            // 合并卡片
            this.mergeCards(this.draggedSlot, slotIndex);
        }

        this.draggedSlot = null;
        this.draggedCard = null;
        this.updateUI();
        this.checkGameState();
    }

    handleDiscardDragOver(e) {
        e.preventDefault();
        this.discardPile.classList.add('highlight');
    }

    handleDiscardDragLeave(e) {
        this.discardPile.classList.remove('highlight');
    }

    handleDiscardDrop(e) {
        e.preventDefault();
        this.discardPile.classList.remove('highlight');

        if (this.draggedSlot === null) return;

        // 保存状态
        this.saveState();

        // 移除卡片
        this.removeCard(this.draggedSlot);
        
        this.draggedSlot = null;
        this.draggedCard = null;
        this.updateUI();
    }

    // 触摸事件处理
    handleTouchStart(e, slotIndex) {
        this.draggedSlot = slotIndex;
        this.draggedCard = e.currentTarget;
        e.currentTarget.classList.add('dragging');
    }

    handleTouchMove(e) {
        e.preventDefault();
    }

    handleTouchEnd(e, slotIndex) {
        if (this.draggedCard) {
            this.draggedCard.classList.remove('dragging');
        }

        if (this.draggedSlot === null || this.draggedSlot === slotIndex) {
            this.draggedSlot = null;
            this.draggedCard = null;
            return;
        }

        const sourceValue = this.slots[this.draggedSlot];
        const targetValue = this.slots[slotIndex];

        // 保存状态
        this.saveState();

        if (targetValue === null) {
            this.moveCard(this.draggedSlot, slotIndex);
        } else if (sourceValue === targetValue) {
            this.mergeCards(this.draggedSlot, slotIndex);
        }

        this.draggedSlot = null;
        this.draggedCard = null;
        this.updateUI();
        this.checkGameState();
    }

    moveCard(fromSlot, toSlot) {
        this.slots[toSlot] = this.slots[fromSlot];
        this.slots[fromSlot] = null;
        this.renderSlots();
    }

    mergeCards(fromSlot, toSlot) {
        const newValue = this.slots[toSlot] * 2;
        this.slots[toSlot] = newValue;
        this.slots[fromSlot] = null;
        
        // 更新分数
        this.score += newValue;
        
        // 合并动画
        const targetSlot = this.slotsContainer.children[toSlot];
        targetSlot.style.animation = 'none';
        setTimeout(() => {
            targetSlot.style.animation = 'pulse 0.5s ease';
        }, 10);

        this.renderSlots();
        this.checkLevelUp();
    }

    removeCard(slotIndex) {
        this.slots[slotIndex] = null;
        this.renderSlots();
    }

    renderSlots() {
        this.slots.forEach((value, index) => {
            const slot = this.slotsContainer.children[index];
            
            if (value === null) {
                slot.innerHTML = '<div class="slot-placeholder">空槽</div>';
                slot.classList.remove('occupied');
            } else {
                this.placeCard(index, value, false);
            }
        });
    }

    checkLevelUp() {
        if (this.score >= this.targetScore) {
            this.level++;
            this.targetScore = Math.floor(this.baseTarget * Math.pow(1.5, this.level - 1));
            
            // 显示升级提示
            this.showMessage('🎉 恭喜升级！', `进入第 ${this.level} 关`);
            
            // 检查是否达到2048
            if (this.slots.some(value => value === 2048)) {
                setTimeout(() => {
                    this.showWin();
                }, 1000);
            }
        }
    }

    checkGameState() {
        // 检查是否还能操作
        const hasEmpty = this.slots.some(slot => slot === null);
        const canMerge = this.slots.some((value, i) => 
            value !== null && this.slots.some((v, j) => i !== j && v === value)
        );

        if (!hasEmpty && !canMerge && this.deck.length === 0) {
            setTimeout(() => {
                this.showGameOver();
            }, 500);
        }
    }

    saveState() {
        const state = {
            slots: [...this.slots],
            deck: [...this.deck],
            score: this.score,
            level: this.level,
            targetScore: this.targetScore,
            nextCardValue: this.nextCardValue
        };
        
        this.history.push(state);
        if (this.history.length > this.maxHistory) {
            this.history.shift();
        }
    }

    undo() {
        if (this.history.length === 0) {
            this.showMessage('没有可撤销的操作', '');
            return;
        }

        const state = this.history.pop();
        this.slots = state.slots;
        this.deck = state.deck;
        this.score = state.score;
        this.level = state.level;
        this.targetScore = state.targetScore;
        this.nextCardValue = state.nextCardValue;

        this.renderSlots();
        this.generateNextCard();
        this.updateUI();
    }

    showHint() {
        // 寻找可合并的卡片
        let hintFound = false;
        
        for (let i = 0; i < this.slots.length; i++) {
            if (this.slots[i] === null) continue;
            
            for (let j = i + 1; j < this.slots.length; j++) {
                if (this.slots[i] === this.slots[j]) {
                    // 高亮提示
                    const slot1 = this.slotsContainer.children[i];
                    const slot2 = this.slotsContainer.children[j];
                    
                    slot1.style.animation = 'pulse 0.5s ease 3';
                    slot2.style.animation = 'pulse 0.5s ease 3';
                    
                    hintFound = true;
                    break;
                }
            }
            if (hintFound) break;
        }

        if (!hintFound) {
            this.showMessage('没有可合并的卡片', '试试抽取新卡片');
        }
    }

    newGame() {
        this.slots = [null, null, null, null];
        this.deck = [];
        this.score = 0;
        this.level = 1;
        this.targetScore = this.baseTarget;
        this.history = [];
        
        this.initDeck();
        this.renderSlots();
        this.generateNextCard();
        this.updateUI();
        this.hideOverlay();
    }

    updateUI() {
        this.scoreElement.textContent = this.score;
        this.levelElement.textContent = this.level;
        this.targetElement.textContent = this.targetScore;
        this.deckCountElement.textContent = this.deck.length;
        
        // 更新进度条
        const progress = Math.min((this.score / this.targetScore) * 100, 100);
        this.progressBar.style.width = progress + '%';
        
        // 更新最高分
        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            this.updateBestScore();
            this.saveBestScore();
        }

        // 更新撤销按钮状态
        document.getElementById('undoBtn').disabled = this.history.length === 0;
    }

    updateBestScore() {
        this.bestScoreElement.textContent = this.bestScore;
    }

    saveBestScore() {
        localStorage.setItem('card2048-best', this.bestScore);
    }

    loadBestScore() {
        return parseInt(localStorage.getItem('card2048-best')) || 0;
    }

    getCardGradient(value) {
        const gradients = {
            2: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            4: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            8: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            16: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            32: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            64: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
            128: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
            256: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
            512: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
            1024: 'linear-gradient(135deg, #ff6e7f 0%, #bfe9ff 100%)',
            2048: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
            4096: 'linear-gradient(135deg, #f77062 0%, #fe5196 100%)'
        };
        return gradients[value] || gradients[4096];
    }

    getCardTextColor(value) {
        return value >= 128 && value <= 512 ? '#333' : 'white';
    }

    showMessage(title, message) {
        // 简单提示（可以用更好的UI组件替换）
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 20px 30px;
            border-radius: 12px;
            z-index: 3000;
            text-align: center;
            animation: fadeIn 0.3s;
        `;
        toast.innerHTML = `<h3 style="margin-bottom: 10px;">${title}</h3><p>${message}</p>`;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'fadeOut 0.3s';
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    }

    showGameOver() {
        document.getElementById('overlayTitle').textContent = '游戏结束';
        document.getElementById('overlayMessage').textContent = '没有更多操作空间了！';
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('finalLevel').textContent = this.level;
        document.getElementById('continueBtn').classList.add('hidden');
        this.overlay.classList.remove('hidden');
    }

    showWin() {
        document.getElementById('overlayTitle').textContent = '🎉 恭喜获胜！';
        document.getElementById('overlayMessage').textContent = '你达到了 2048！';
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('finalLevel').textContent = this.level;
        document.getElementById('continueBtn').classList.remove('hidden');
        this.overlay.classList.remove('hidden');
    }

    continueGame() {
        this.hideOverlay();
    }

    hideOverlay() {
        this.overlay.classList.add('hidden');
    }
}

// 添加动画样式
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); box-shadow: 0 8px 30px rgba(102, 126, 234, 0.6); }
    }
    @keyframes slideUp {
        from { transform: translateY(20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }
    @keyframes fadeOut {
        to { opacity: 0; }
    }
`;
document.head.appendChild(style);

// 初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    new CardGame();
});
