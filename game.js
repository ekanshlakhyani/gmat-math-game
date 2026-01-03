// Prime numbers for special mode weighting
const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29];

// Game State
let gameState = {
    mode: null,
    difficulty: null,
    questionCount: null,
    currentQuestion: 0,
    score: 0,
    wrongCount: 0,
    questionsData: [],
    gameStartTime: null,
    currentProblem: null
};

// ==================== SCREEN MANAGEMENT ====================
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

// ==================== MODE SELECTION ====================
document.querySelectorAll('.mode-card').forEach(card => {
    card.querySelector('.btn').addEventListener('click', () => {
        gameState.mode = card.dataset.mode;
        showDifficultySelection();
    });
});

function showDifficultySelection() {
    const grid = document.getElementById('difficultyGrid');
    grid.innerHTML = '';

    let difficulties = [];
    const subtitle = document.getElementById('difficultySubtitle');

    if (gameState.mode === 'squares') {
        difficulties = [
            { name: 'Level 1', value: 'level1', desc: 'Numbers 2-9', detail: 'Start with single-digit bases. Fast and fundamental. Perfect for warming up.' },
            { name: 'Level 2', value: 'level2', desc: 'Numbers 2-9, 11-19', detail: 'Mix of single and double-digit bases. Increased difficulty with more variety.' },
            { name: 'Level 3', value: 'level3', desc: 'Numbers 2-29', detail: 'Full range with heavy bias on harder numbers. True GMAT-level challenge!' }
        ];
        subtitle.textContent = 'Master perfect squares with progressive difficulty';
    } else if (gameState.mode === 'cubes') {
        difficulties = [
            { name: 'Level 1', value: 'level1', desc: 'Numbers 2-9', detail: 'Start with single-digit bases. Fast and fundamental. Perfect for warming up.' },
            { name: 'Level 2', value: 'level2', desc: 'Numbers 2-9, 11-19', detail: 'Mix of single and double-digit bases. Increased difficulty with more variety.' },
            { name: 'Level 3', value: 'level3', desc: 'Numbers 2-29', detail: 'Full range with heavy bias on harder numbers. True GMAT-level challenge!' }
        ];
        subtitle.textContent = 'Master perfect cubes with progressive difficulty';
    } else if (gameState.mode === 'roots') {
        difficulties = [
            { name: 'Easy', value: 'easy', desc: 'All numbers 2-30', detail: 'Wide range of roots to practice. Good for building confidence.' },
            { name: 'Hard', value: 'hard', desc: 'Challenging ranges', detail: 'Focused on tougher numbers. 70% primes for harder calculations.' },
            { name: 'Special', value: 'special', desc: 'Prime number bias', detail: '70% prime numbers. Extra mental math challenge for advanced users.' },
            { name: 'Unknown', value: 'unknown', desc: 'Prime heavy + mystery', detail: 'You won\'t know if it\'s square or cube root! 85% primes.' },
            { name: 'Final Boss', value: 'level5', desc: 'Perfect + Imperfect Numbers', detail: 'Ultimate challenge! 50% perfect numbers (integer answer) + 50% imperfect numbers (give range like 7-8).' }
        ];
        subtitle.textContent = 'Find the root - figure it out yourself!';
    } else if (gameState.mode === 'combined') {
        difficulties = [
            { name: 'Easy', value: 'easy', desc: 'All numbers 2-30', detail: 'Mystery mix! You won\'t know if it\'s square or cube. Random difficulty for maximum challenge!' },
            { name: 'Hard', value: 'hard', desc: 'Challenging ranges', detail: 'Mystery mode with harder bases. You must figure out if you need square or cube root!' },
            { name: 'Special', value: 'special', desc: 'Prime number bias', detail: 'Prime-heavy mystery mode! 70% primes. Ultimate unknowns with serious GMAT prep challenge!' }
        ];
        subtitle.textContent = 'Mix of squares & cubes - Never know which one!';
    }

    difficulties.forEach(diff => {
        const card = document.createElement('div');
        card.className = 'difficulty-card';
        const detailText = diff.detail || diff.desc;
        card.innerHTML = `<h4>${diff.name}</h4><p>${diff.desc}</p><div class="difficulty-tooltip">${detailText}</div>`;
        card.addEventListener('click', () => {
            document.querySelectorAll('.difficulty-card').forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            gameState.difficulty = diff.value;
        });
        grid.appendChild(card);
    });

    showScreen('difficultySelection');
}

document.getElementById('backToMode').addEventListener('click', () => {
    gameState.difficulty = null;
    showScreen('modeSelection');
});

// ==================== QUESTION COUNT SELECTION ====================
document.querySelectorAll('.question-card').forEach(card => {
    card.addEventListener('click', () => {
        document.querySelectorAll('.question-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        gameState.questionCount = parseInt(card.dataset.count);
    });
});

document.getElementById('backToDifficulty').addEventListener('click', () => {
    gameState.questionCount = null;
    showDifficultySelection();
});

// ==================== GAME LOGIC ====================
function generateSquaresProblem(level) {
    let num;
    const rand = Math.random();

    if (level === 'level1') {
        num = Math.floor(Math.random() * 8) + 2; // 2-9
    } else if (level === 'level2') {
        if (rand < 0.33) {
            num = Math.floor(Math.random() * 8) + 2; // 2-9
        } else {
            num = Math.floor(Math.random() * 9) + 11; // 11-19
        }
    } else {
        if (rand < 0.2) {
            num = Math.floor(Math.random() * 8) + 2; // 2-9
        } else if (rand < 0.5) {
            num = Math.floor(Math.random() * 9) + 11; // 11-19
        } else {
            num = Math.floor(Math.random() * 9) + 21; // 21-29
        }
    }

    return {
        question: `${num}²`,
        answer: num * num,
        baseNum: num
    };
}

function generateCubesProblem(level) {
    let num;
    const rand = Math.random();

    if (level === 'level1') {
        num = Math.floor(Math.random() * 8) + 2; // 2-9
    } else if (level === 'level2') {
        if (rand < 0.33) {
            num = Math.floor(Math.random() * 8) + 2; // 2-9
        } else {
            num = Math.floor(Math.random() * 9) + 11; // 11-19
        }
    } else {
        if (rand < 0.2) {
            num = Math.floor(Math.random() * 8) + 2; // 2-9
        } else if (rand < 0.5) {
            num = Math.floor(Math.random() * 9) + 11; // 11-19
        } else {
            num = Math.floor(Math.random() * 9) + 21; // 21-29
        }
    }

    return {
        question: `${num}³`,
        answer: num * num * num,
        baseNum: num
    };
}

function generateRootsProblem(difficulty) {
    let baseNum;
    const rand = Math.random();
    const squareNumbers = [14, 16, 17, 18, 19, 21, 22, 23, 24, 25, 26, 27, 28, 29];
    const cubeNumbers = [6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 23, 24, 25, 26, 27, 28, 29];

    if (difficulty === 'easy') {
        baseNum = Math.floor(Math.random() * 29) + 2;
    } else if (difficulty === 'hard') {
        const allHardNumbers = [...new Set([...squareNumbers, ...cubeNumbers])];
        baseNum = allHardNumbers[Math.floor(Math.random() * allHardNumbers.length)];
    } else if (difficulty === 'special') {
        const allSpecialNumbers = [...new Set([...squareNumbers, ...cubeNumbers])];
        const primeInRange = allSpecialNumbers.filter(n => primes.includes(n));
        if (rand < 0.7 && primeInRange.length > 0) {
            baseNum = primeInRange[Math.floor(Math.random() * primeInRange.length)];
        } else {
            baseNum = allSpecialNumbers[Math.floor(Math.random() * allSpecialNumbers.length)];
        }
    } else if (difficulty === 'unknown') {
        const allUnknownNumbers = [...new Set([...squareNumbers, ...cubeNumbers])];
        const primeInRange = allUnknownNumbers.filter(n => primes.includes(n));
        if (rand < 0.85 && primeInRange.length > 0) {
            baseNum = primeInRange[Math.floor(Math.random() * primeInRange.length)];
        } else {
            baseNum = allUnknownNumbers[Math.floor(Math.random() * allUnknownNumbers.length)];
        }
    } else if (difficulty === 'level5') {
        // Final Boss: 50% perfect numbers, 50% imperfect numbers
        const isPerfect = Math.random() < 0.5;
        if (isPerfect) {
            // Perfect number - user answers an integer
            baseNum = Math.floor(Math.random() * 29) + 2;
            const isSquare = Math.random() < 0.5;
            const resultNumber = isSquare ? baseNum * baseNum : baseNum * baseNum * baseNum;
            return {
                question: `${resultNumber}`,
                answer: baseNum,
                baseNum,
                isSquare,
                isPerfect: true,
                level5: true
            };
        } else {
            // Imperfect number - user answers a range like "7-8"
            baseNum = Math.floor(Math.random() * 29) + 2;
            const isSquare = Math.random() < 0.5;
            // Add random offset to make it imperfect
            const offset = Math.random() < 0.5 ? Math.random() * 0.5 : Math.random() * 0.5 + 0.5; // 0.01 to 0.99
            const resultNumber = (isSquare ? baseNum * baseNum : baseNum * baseNum * baseNum) + offset;
            return {
                question: `${Math.floor(resultNumber)}`,
                answer: baseNum, // The lower bound of the range
                answerUpper: baseNum + 1, // The upper bound
                baseNum,
                isSquare,
                isPerfect: false,
                level5: true,
                isImperfect: true
            };
        }
    }

    const isSquare = Math.random() < 0.5;
    const resultNumber = isSquare ? baseNum * baseNum : baseNum * baseNum * baseNum;

    // For 'unknown' difficulty, don't show the symbol to keep it a mystery
    let symbol = '';
    if (difficulty !== 'unknown') {
        symbol = isSquare ? '√' : '∛';
    }

    return {
        question: `${symbol}${resultNumber}`,
        answer: baseNum,
        baseNum,
        isSquare
    };
}

function generateCombinedProblem(difficulty) {
    let baseNum;
    const rand = Math.random();
    const squareNumbers = [14, 16, 17, 18, 19, 21, 22, 23, 24, 25, 26, 27, 28, 29];
    const cubeNumbers = [6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 23, 24, 25, 26, 27, 28, 29];

    if (difficulty === 'easy') {
        baseNum = Math.floor(Math.random() * 29) + 2;
    } else if (difficulty === 'hard') {
        const allHardNumbers = [...new Set([...squareNumbers, ...cubeNumbers])];
        baseNum = allHardNumbers[Math.floor(Math.random() * allHardNumbers.length)];
    } else if (difficulty === 'special') {
        const allSpecialNumbers = [...new Set([...squareNumbers, ...cubeNumbers])];
        const primeInRange = allSpecialNumbers.filter(n => primes.includes(n));
        if (rand < 0.7 && primeInRange.length > 0) {
            baseNum = primeInRange[Math.floor(Math.random() * primeInRange.length)];
        } else {
            baseNum = allSpecialNumbers[Math.floor(Math.random() * allSpecialNumbers.length)];
        }
    }

    const isSquare = Math.random() < 0.5;
    const symbol = isSquare ? '²' : '³';
    const answer = isSquare ? baseNum * baseNum : baseNum * baseNum * baseNum;

    return {
        question: `${baseNum}${symbol}`,
        answer,
        baseNum
    };
}

function generateProblem() {
    if (gameState.mode === 'squares') {
        return generateSquaresProblem(gameState.difficulty);
    } else if (gameState.mode === 'cubes') {
        return generateCubesProblem(gameState.difficulty);
    } else if (gameState.mode === 'roots') {
        return generateRootsProblem(gameState.difficulty);
    } else {
        return generateCombinedProblem(gameState.difficulty);
    }
}

// ==================== START GAME ====================
document.getElementById('submitBtn').addEventListener('click', submitAnswer);

document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && document.getElementById('gameScreen').classList.contains('active')) {
        submitAnswer();
    }
});

// Add listener to difficulty cards to enable starting game
document.addEventListener('click', (e) => {
    if (e.target.closest('.difficulty-card')) {
        // Auto-proceed to question selection after 300ms
        setTimeout(() => {
            if (gameState.difficulty && gameState.questionCount === null) {
                showScreen('questionSelection');
            }
        }, 300);
    }
});

// Auto-start game when question count is selected
document.addEventListener('click', (e) => {
    if (e.target.closest('.question-card') && gameState.difficulty && gameState.questionCount) {
        setTimeout(() => {
            startGame();
        }, 300);
    }
});

function startGame() {
    gameState.currentQuestion = 0;
    gameState.score = 0;
    gameState.wrongCount = 0;
    gameState.questionsData = [];
    gameState.gameStartTime = Date.now();

    updateGameHeader();
    document.getElementById('currentScore').textContent = '0';
    loadNextQuestion();
    showScreen('gameScreen');
}

function updateGameHeader() {
    const modeTitle = gameState.mode.charAt(0).toUpperCase() + gameState.mode.slice(1);
    const diffTitle = gameState.difficulty.charAt(0).toUpperCase() + gameState.difficulty.slice(1);
    document.getElementById('gameTitle').textContent = `${modeTitle} - ${diffTitle}`;
    document.getElementById('gameSubtitle').textContent = `Question ${gameState.currentQuestion + 1} of ${gameState.questionCount}`;
}

function loadNextQuestion() {
    gameState.currentProblem = generateProblem();
    document.getElementById('questionText').textContent = gameState.currentProblem.question;
    document.getElementById('answerInput').value = '';
    document.getElementById('answerInput').focus();
    document.getElementById('feedback').classList.add('hidden');

    // Show helper text for ALL Level 5 (Final Boss) questions
    const inputHelper = document.getElementById('inputHelper');
    if (gameState.currentProblem.level5) {
        inputHelper.style.display = 'block';
    } else {
        inputHelper.style.display = 'none';
    }

    updateProgressBar();
}

function submitAnswer() {
    const userInput = document.getElementById('answerInput').value.trim();
    let isCorrect = false;
    let additionalInfo = '';

    // Handle Level 5 range answers ONLY for imperfect numbers
    if (gameState.currentProblem.level5 && gameState.currentProblem.isImperfect) {
        // For imperfect numbers, expect a range
        if (userInput.includes('-')) {
            const parts = userInput.split('-').map(p => parseInt(p.trim()));
            if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
                const lower = Math.min(parts[0], parts[1]);
                const upper = Math.max(parts[0], parts[1]);

                // For imperfect numbers, accept both square root range and cube root range
                // Calculate what the ranges should be
                const sqrtValue = Math.sqrt(parseInt(gameState.currentProblem.question));
                const cbrtValue = Math.cbrt(parseInt(gameState.currentProblem.question));

                const sqrtLower = Math.floor(sqrtValue);
                const sqrtUpper = Math.ceil(sqrtValue);
                const cbrtLower = Math.floor(cbrtValue);
                const cbrtUpper = Math.ceil(cbrtValue);

                // Check if it matches either range
                const matchesSqrt = lower === sqrtLower && upper === sqrtUpper;
                const matchesCbrt = lower === cbrtLower && upper === cbrtUpper;

                if (matchesSqrt || matchesCbrt) {
                    isCorrect = true;
                }
            } else {
                showFeedback('For imperfect numbers, enter range as "7-8" or "7 - 8"', 'wrong');
                return;
            }
        } else {
            showFeedback('For imperfect numbers, enter range as "7-8" or "7 - 8"', 'wrong');
            return;
        }
    } else {
        // Regular integer answer (for Level 5 perfect numbers OR other modes)
        const userAnswer = parseInt(userInput);
        if (isNaN(userAnswer)) {
            showFeedback('Please enter a valid number', 'wrong');
            return;
        }
        isCorrect = userAnswer === gameState.currentProblem.answer;

        // For roots mode, check alternative roots (but not for level 5 imperfect)
        if (gameState.mode === 'roots' && !isCorrect && gameState.currentProblem.isSquare !== undefined && !gameState.currentProblem.isImperfect) {
            if (gameState.currentProblem.isSquare) {
                const cubeRoot = Math.round(Math.pow(gameState.currentProblem.question, 1 / 3));
                if (userAnswer === cubeRoot && cubeRoot * cubeRoot * cubeRoot === parseInt(gameState.currentProblem.question)) {
                    additionalInfo = ' Also the cube root!';
                }
            } else {
                const squareRoot = Math.round(Math.sqrt(gameState.currentProblem.question));
                if (userAnswer === squareRoot && squareRoot * squareRoot === parseInt(gameState.currentProblem.question)) {
                    additionalInfo = ' Also the square root!';
                }
            }
        }
    }

    if (isCorrect || additionalInfo) {
        const timeSpent = (Date.now() - gameState.gameStartTime) / 1000 / (gameState.currentQuestion + 1);
        const maxPointsPerQ = 1000000 / gameState.questionCount;
        const points = Math.round(maxPointsPerQ / (1 + Math.log(timeSpent + 1)));

        gameState.score += points;
        showFeedback(`✓ Correct!${additionalInfo}`, 'correct');
    } else {
        gameState.wrongCount++;

        // Format the correct answer display
        let correctAnswerDisplay = gameState.currentProblem.answer;
        if (gameState.currentProblem.isImperfect) {
            // For imperfect numbers, show both possible ranges
            const sqrtValue = Math.sqrt(parseInt(gameState.currentProblem.question));
            const cbrtValue = Math.cbrt(parseInt(gameState.currentProblem.question));
            const sqrtLower = Math.floor(sqrtValue);
            const sqrtUpper = Math.ceil(sqrtValue);
            const cbrtLower = Math.floor(cbrtValue);
            const cbrtUpper = Math.ceil(cbrtValue);
            correctAnswerDisplay = `${sqrtLower}-${sqrtUpper} or ${cbrtLower}-${cbrtUpper}`;
        }

        if (gameState.wrongCount === 2) {
            showFeedback(`✗ Wrong! Answer: ${correctAnswerDisplay} ⚠️ One more wrong ends the game!`, 'warning');
        } else if (gameState.wrongCount === 3) {
            showFeedback(`✗ Wrong! Answer: ${correctAnswerDisplay} ❌ Game Over!`, 'wrong');
            setTimeout(() => {
                endGame();
            }, 1500);
            document.getElementById('submitBtn').disabled = true;
            return;
        } else {
            showFeedback(`✗ Wrong! Answer: ${correctAnswerDisplay}`, 'wrong');
        }
    }

    gameState.questionsData.push({
        isCorrect: isCorrect || !!additionalInfo,
        answer: gameState.currentProblem.answer,
        userAnswer: userInput
    });

    updateStrikeDisplay();

    document.getElementById('submitBtn').disabled = true;
    setTimeout(() => {
        gameState.currentQuestion++;

        if (gameState.currentQuestion >= gameState.questionCount || gameState.wrongCount >= 3) {
            endGame();
        } else {
            updateGameHeader();
            loadNextQuestion();
            document.getElementById('submitBtn').disabled = false;
        }
    }, 1500);
}

function showFeedback(message, type) {
    const feedback = document.getElementById('feedback');
    feedback.textContent = message;
    feedback.className = `feedback ${type}`;
}

function updateProgressBar() {
    const progress = (gameState.currentQuestion / gameState.questionCount) * 100;
    document.getElementById('progressBar').style.width = progress + '%';
}

function updateScoreDisplay() {
    document.getElementById('currentScore').textContent = gameState.score.toLocaleString();
}

function updateStrikeDisplay() {
    const strikes = document.querySelectorAll('.strike');
    strikes.forEach((strike, index) => {
        if (index < gameState.wrongCount) {
            strike.classList.add('active');
        } else {
            strike.classList.remove('active');
        }
    });
}

// ==================== END GAME ====================
function endGame() {
    const totalTime = (Date.now() - gameState.gameStartTime) / 1000;
    const correctAnswers = gameState.questionsData.filter(q => q.isCorrect).length;
    const avgTime = gameState.currentQuestion > 0 ? totalTime / gameState.currentQuestion : 0;

    // Display results
    document.getElementById('resultCorrect').textContent = correctAnswers;
    document.getElementById('resultTime').textContent = totalTime.toFixed(2) + 's';
    document.getElementById('resultAvgTime').textContent = avgTime.toFixed(2) + 's';
    document.getElementById('finalScore').textContent = gameState.score.toLocaleString();

    // Result message
    const accuracy = (correctAnswers / gameState.currentQuestion) * 100;
    let message = '';
    let messageClass = '';

    if (accuracy === 100) {
        message = '🌟 Perfect! You\'re a GMAT master!';
        messageClass = 'excellent';
    } else if (accuracy >= 80) {
        message = '🎯 Excellent work! Keep practicing!';
        messageClass = 'excellent';
    } else if (accuracy >= 60) {
        message = '👍 Good effort! More practice needed!';
        messageClass = 'good';
    } else {
        message = '💪 Keep grinding! You\'ll get there!';
        messageClass = 'okay';
    }

    const resultMessage = document.getElementById('resultMessage');
    resultMessage.textContent = message;
    resultMessage.className = `result-message ${messageClass}`;

    showScreen('resultsScreen');
}

// ==================== RESULTS SCREEN HANDLERS ====================
document.getElementById('playAgainBtn').addEventListener('click', () => {
    gameState = {
        mode: null,
        difficulty: null,
        questionCount: null,
        currentQuestion: 0,
        score: 0,
        wrongCount: 0,
        questionsData: [],
        gameStartTime: null,
        currentProblem: null
    };
    showScreen('modeSelection');
});

document.getElementById('homeBtn').addEventListener('click', () => {
    gameState = {
        mode: null,
        difficulty: null,
        questionCount: null,
        currentQuestion: 0,
        score: 0,
        wrongCount: 0,
        questionsData: [],
        gameStartTime: null,
        currentProblem: null
    };
    showScreen('modeSelection');
});

// Initialize
showScreen('modeSelection');