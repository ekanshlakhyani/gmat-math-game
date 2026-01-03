const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Game configuration
let gameConfig = {
  mode: null,      // 'standard', 'combined', or 'roots'
  gameType: null,  // 'squares' or 'cubes'
  level: null,     // 1, 2, or 3 (for standard mode)
  difficulty: null, // 'easy', 'hard', 'special', or 'unknown' (for combined/roots mode)
  questionCount: null // 3, 5, or 10
};

// Prime numbers for special mode weighting
const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29];

let score = 0;
let questionsAnswered = 0;
let questionsData = []; // Track {isCorrect, timeSpent}
let gameStartTime = null;
let wrongCount = 0; // Track wrong answers

// Generate number for combined mode based on difficulty
function generateNumberForCombined(difficulty) {
  let num;
  const rand = Math.random();

  if (difficulty === 'easy') {
    // Easy: 2-30 (all numbers except 1)
    num = Math.floor(Math.random() * 29) + 2;
  } else if (difficulty === 'hard') {
    // Hard: Squares (14, 16-19, 21-29), Cubes (6-9, 11-19, 21-29)
    // Combine both ranges
    const squareNumbers = [14, 16, 17, 18, 19, 21, 22, 23, 24, 25, 26, 27, 28, 29];
    const cubeNumbers = [6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 23, 24, 25, 26, 27, 28, 29];
    const allHardNumbers = [...new Set([...squareNumbers, ...cubeNumbers])];
    num = allHardNumbers[Math.floor(Math.random() * allHardNumbers.length)];
  } else if (difficulty === 'special') {
    // Special: Same as hard but with prime number bias
    const squareNumbers = [14, 16, 17, 18, 19, 21, 22, 23, 24, 25, 26, 27, 28, 29];
    const cubeNumbers = [6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 23, 24, 25, 26, 27, 28, 29];
    const allSpecialNumbers = [...new Set([...squareNumbers, ...cubeNumbers])];
    const primeInRange = allSpecialNumbers.filter(n => primes.includes(n));

    // 70% chance of prime, 30% chance of composite in the range
    if (rand < 0.7 && primeInRange.length > 0) {
      num = primeInRange[Math.floor(Math.random() * primeInRange.length)];
    } else {
      num = allSpecialNumbers[Math.floor(Math.random() * allSpecialNumbers.length)];
    }
  }
  return num;
}

// Generate number for roots mode based on difficulty
function generateNumberForRoots(difficulty) {
  let baseNum;
  const rand = Math.random();
  let isSquare;

  if (difficulty === 'easy') {
    // Easy: 2-30 (all numbers except 1)
    baseNum = Math.floor(Math.random() * 29) + 2;
    isSquare = Math.random() < 0.5;
  } else if (difficulty === 'hard') {
    // Hard: Same as combined hard numbers
    const squareNumbers = [14, 16, 17, 18, 19, 21, 22, 23, 24, 25, 26, 27, 28, 29];
    const cubeNumbers = [6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 23, 24, 25, 26, 27, 28, 29];
    const allHardNumbers = [...new Set([...squareNumbers, ...cubeNumbers])];
    baseNum = allHardNumbers[Math.floor(Math.random() * allHardNumbers.length)];

    // Randomly pick square or cube based on availability
    const canBeSquare = squareNumbers.includes(baseNum);
    const canBeCube = cubeNumbers.includes(baseNum);
    if (canBeSquare && canBeCube) {
      isSquare = Math.random() < 0.5;
    } else if (canBeSquare) {
      isSquare = true;
    } else {
      isSquare = false;
    }
  } else if (difficulty === 'special') {
    // Special: Same as hard but with prime number bias
    const squareNumbers = [14, 16, 17, 18, 19, 21, 22, 23, 24, 25, 26, 27, 28, 29];
    const cubeNumbers = [6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 23, 24, 25, 26, 27, 28, 29];
    const allSpecialNumbers = [...new Set([...squareNumbers, ...cubeNumbers])];
    const primeInRange = allSpecialNumbers.filter(n => primes.includes(n));

    // 70% chance of prime, 30% chance of composite in the range
    if (rand < 0.7 && primeInRange.length > 0) {
      baseNum = primeInRange[Math.floor(Math.random() * primeInRange.length)];
    } else {
      baseNum = allSpecialNumbers[Math.floor(Math.random() * allSpecialNumbers.length)];
    }

    const canBeSquare = squareNumbers.includes(baseNum);
    const canBeCube = cubeNumbers.includes(baseNum);
    if (canBeSquare && canBeCube) {
      isSquare = Math.random() < 0.5;
    } else if (canBeSquare) {
      isSquare = true;
    } else {
      isSquare = false;
    }
  } else if (difficulty === 'unknown') {
    // Unknown: Harder range with even more prime bias
    const squareNumbers = [14, 16, 17, 18, 19, 21, 22, 23, 24, 25, 26, 27, 28, 29];
    const cubeNumbers = [6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 23, 24, 25, 26, 27, 28, 29];
    const allUnknownNumbers = [...new Set([...squareNumbers, ...cubeNumbers])];
    const primeInRange = allUnknownNumbers.filter(n => primes.includes(n));

    // 85% chance of prime, 15% chance of composite in the range
    if (rand < 0.85 && primeInRange.length > 0) {
      baseNum = primeInRange[Math.floor(Math.random() * primeInRange.length)];
    } else {
      baseNum = allUnknownNumbers[Math.floor(Math.random() * allUnknownNumbers.length)];
    }

    const canBeSquare = squareNumbers.includes(baseNum);
    const canBeCube = cubeNumbers.includes(baseNum);
    if (canBeSquare && canBeCube) {
      isSquare = Math.random() < 0.5;
    } else if (canBeSquare) {
      isSquare = true;
    } else {
      isSquare = false;
    }
  }

  // Calculate the perfect square or cube to show
  const resultNumber = isSquare ? baseNum * baseNum : baseNum * baseNum * baseNum;

  return {
    baseNum,
    resultNumber,
    isSquare
  };
}

// Generate number based on level with weighted probability (skip easy numbers 1, 10, 20, 30)
function generateNumberByLevel(level) {
  let num;
  const rand = Math.random();

  if (level === 1) {
    // Level 1: 2-9 (skip 1 and 10)
    num = Math.floor(Math.random() * 8) + 2;
  } else if (level === 2) {
    // Level 2: 2-9, 11-19 (2nd half more probability, skip 10 and 20)
    if (rand < 0.33) {
      num = Math.floor(Math.random() * 8) + 2; // 2-9
    } else {
      num = Math.floor(Math.random() * 9) + 11; // 11-19
    }
  } else if (level === 3) {
    // Level 3: 2-9, 11-19, 21-29 (3rd part > 2nd part > 1st part, skip 1, 10, 20, 30)
    if (rand < 0.2) {
      num = Math.floor(Math.random() * 8) + 2; // 2-9
    } else if (rand < 0.5) {
      num = Math.floor(Math.random() * 9) + 11; // 11-19
    } else {
      num = Math.floor(Math.random() * 9) + 21; // 21-29
    }
  }
  return num;
}

// Generate problem based on game type and level
function generateProblem() {
  let num;

  if (gameConfig.mode === 'roots') {
    const rootData = generateNumberForRoots(gameConfig.difficulty);
    return {
      question: `${rootData.resultNumber}`,
      answer: rootData.baseNum,
      isSquare: rootData.isSquare,
      alternativeAnswer: null // Will be calculated if the number is both square and cube
    };
  } else if (gameConfig.mode === 'combined') {
    num = generateNumberForCombined(gameConfig.difficulty);
    // Randomly choose between square and cube for combined mode
    const isSquare = Math.random() < 0.5;
    if (isSquare) {
      return {
        question: `${num}²`,
        answer: num * num
      };
    } else {
      return {
        question: `${num}³`,
        answer: num * num * num
      };
    }
  } else {
    num = generateNumberByLevel(gameConfig.level);
    if (gameConfig.gameType === 'squares') {
      return {
        question: `${num}²`,
        answer: num * num
      };
    } else if (gameConfig.gameType === 'cubes') {
      return {
        question: `${num}³`,
        answer: num * num * num
      };
    }
  }
}

// Prompt user with options
function promptUser(message, options) {
  return new Promise((resolve) => {
    rl.question(message, (answer) => {
      const selected = parseInt(answer);
      if (options.includes(selected)) {
        resolve(selected);
      } else {
        console.log('Invalid choice. Please try again.\n');
        promptUser(message, options).then(resolve);
      }
    });
  });
}

// Calculate time-based score with logarithmic penalty (normalized to 1,000,000)
function calculateTimeScore(isCorrect, secondsPerQuestion, questionCount) {
  if (!isCorrect) {
    return 0; // Wrong answer = 0 points, massive penalty
  }

  // Score is normalized to 1,000,000 total regardless of question count
  // Points per question if perfect = 1,000,000 / questionCount
  const maxPointsPerQuestion = 1000000 / questionCount;

  // Using logarithmic decay: score decreases logarithmically with time
  // Formula: maxPointsPerQuestion / (1 + ln(secondsPerQuestion + 1))
  const timePenalty = Math.log(secondsPerQuestion + 1);
  const finalScore = maxPointsPerQuestion / (1 + timePenalty);

  return Math.round(finalScore);
}

// Ask question and validate answer
function askQuestion(problem, questionNumber) {
  return new Promise((resolve) => {
    const questionStartTime = Date.now();

    rl.question(`[Q${questionNumber}] ${problem.question}: `, (userAnswer) => {
      const questionEndTime = Date.now();
      const secondsSpent = (questionEndTime - questionStartTime) / 1000;

      let isCorrect = parseInt(userAnswer) === problem.answer;
      let additionalInfo = '';

      // For roots mode, also check if the alternative root is correct (for numbers that are both perfect squares and cubes)
      if (gameConfig.mode === 'roots' && !isCorrect) {
        const userNum = parseInt(userAnswer);
        // Check if this could be a valid alternative root
        if (problem.isSquare) {
          // If we were showing a square, check if it could be a cube
          const cubeRoot = Math.round(Math.pow(problem.question, 1 / 3));
          if (userNum === cubeRoot && cubeRoot * cubeRoot * cubeRoot === parseInt(problem.question)) {
            isCorrect = true;
            additionalInfo = ` This is also the cube root!`;
          }
        } else {
          // If we were showing a cube, check if it could be a square
          const squareRoot = Math.round(Math.sqrt(problem.question));
          if (userNum === squareRoot && squareRoot * squareRoot === parseInt(problem.question)) {
            isCorrect = true;
            additionalInfo = ` This is also the square root!`;
          }
        }
      }

      const questionScore = calculateTimeScore(isCorrect, secondsSpent, gameConfig.questionCount);

      if (isCorrect) {
        console.log(`\u2713 Correct! [${secondsSpent.toFixed(2)}s]${additionalInfo}\n`);
      } else {
        wrongCount++;
        if (wrongCount === 2) {
          console.log(`\u2717 Wrong! The answer was ${problem.answer} [${secondsSpent.toFixed(2)}s]`);
          console.log(`\u26a0\ufe0f  WARNING: You have 1 more wrong answer allowed! (${wrongCount}/3 strikes)\n`);
        } else if (wrongCount === 3) {
          console.log(`\u2717 Wrong! The answer was ${problem.answer} [${secondsSpent.toFixed(2)}s]`);
          console.log(`\u274c GAME OVER! You reached 3 strikes!\n`);
        } else {
          console.log(`\u2717 Wrong! The answer was ${problem.answer} [${secondsSpent.toFixed(2)}s]\n`);
        }
      }

      questionsData.push({
        isCorrect,
        timeSpent: secondsSpent,
        pointsEarned: questionScore
      });

      score += questionScore;
      questionsAnswered++;
      resolve();
    });
  });
}

// Main game setup and flow
async function startGame() {
  console.log('\n🎮 Welcome to Math Game!\n');

  // Step 1: Choose game mode
  console.log('Choose Game Mode:');
  console.log('1. Standard (Squares or Cubes)');
  console.log('2. Combined (Squares & Cubes Mix)');
  console.log('3. Roots (Find the root)\n');
  const mode = await promptUser('Select (1, 2, or 3): ', [1, 2, 3]);
  const modeOptions = ['standard', 'combined', 'roots'];
  gameConfig.mode = modeOptions[mode - 1];

  let gameTypeStr = '';

  if (gameConfig.mode === 'standard') {
    // Step 1b: Choose game type for standard mode
    console.log('\nChoose Game Type:');
    console.log('1. Squares (x²)');
    console.log('2. Cubes (x³)\n');
    const gameType = await promptUser('Select (1 or 2): ', [1, 2]);
    gameConfig.gameType = gameType === 1 ? 'squares' : 'cubes';
    gameTypeStr = gameConfig.gameType === 'squares' ? 'Squares' : 'Cubes';

    // Step 2: Choose level for standard mode
    console.log('\nChoose Level:');
    console.log('1. Level 1 (Numbers 2-9)');
    console.log('2. Level 2 (Numbers 2-9, 11-19 more likely)');
    console.log('3. Level 3 (Numbers 2-9, 11-19, 21-29 more likely)\n');
    const level = await promptUser('Select (1, 2, or 3): ', [1, 2, 3]);
    gameConfig.level = level;
  } else if (gameConfig.mode === 'combined') {
    // Step 2: Choose difficulty for combined mode
    console.log('\nChoose Difficulty:');
    console.log('1. Easy (All numbers 2-30)');
    console.log('2. Hard (Challenging number ranges)');
    console.log('3. Special (Hard with prime number bias)\n');
    const difficulty = await promptUser('Select (1, 2, or 3): ', [1, 2, 3]);
    const diffOptions = ['easy', 'hard', 'special'];
    gameConfig.difficulty = diffOptions[difficulty - 1];
    gameTypeStr = `Combined - ${gameConfig.difficulty.charAt(0).toUpperCase() + gameConfig.difficulty.slice(1)}`;
  } else if (gameConfig.mode === 'roots') {
    // Step 2: Choose difficulty for roots mode
    console.log('\nChoose Difficulty:');
    console.log('1. Easy (All numbers 2-30)');
    console.log('2. Hard (Challenging number ranges)');
    console.log('3. Special (Hard with prime number bias)');
    console.log('4. Unknown (Harder range with heavy prime bias)\n');
    const difficulty = await promptUser('Select (1, 2, 3, or 4): ', [1, 2, 3, 4]);
    const diffOptions = ['easy', 'hard', 'special', 'unknown'];
    gameConfig.difficulty = diffOptions[difficulty - 1];
    gameTypeStr = `Roots - ${gameConfig.difficulty.charAt(0).toUpperCase() + gameConfig.difficulty.slice(1)}`;
  }

  // Step 3: Choose number of questions
  console.log('\nChoose Number of Questions:');
  console.log('1. 3 Questions');
  console.log('2. 5 Questions');
  console.log('3. 10 Questions\n');
  const questionSet = await promptUser('Select (1, 2, or 3): ', [1, 2, 3]);
  const questionOptions = [3, 5, 10];
  gameConfig.questionCount = questionOptions[questionSet - 1];

  // Start the game
  if (gameConfig.mode === 'standard') {
    console.log(`\n✨ Starting ${gameTypeStr} - Level ${gameConfig.level} (${gameConfig.questionCount} questions)\n`);
  } else {
    console.log(`\n✨ Starting ${gameTypeStr} (${gameConfig.questionCount} questions)\n`);
  }

  score = 0;
  questionsAnswered = 0;
  questionsData = [];
  wrongCount = 0;
  gameStartTime = Date.now();

  while (questionsAnswered < gameConfig.questionCount && wrongCount < 3) {
    const problem = generateProblem();
    await askQuestion(problem, questionsAnswered + 1);
  }

  // Calculate stats
  const gameEndTime = Date.now();
  const totalTime = (gameEndTime - gameStartTime) / 1000;
  const correctAnswers = questionsData.filter(q => q.isCorrect).length;
  const avgTimePerQuestion = questionsAnswered > 0 ? totalTime / questionsAnswered : 0;
  const endReason = wrongCount >= 3 ? ' (Game Ended - 3 Strikes)' : '';

  // Game over
  console.log(`\n🎉 Game Over!${endReason}`);
  console.log(`Correct: ${correctAnswers}/${questionsAnswered}`);
  console.log(`Wrong: ${wrongCount}/3 strikes`);
  console.log(`Total Time: ${totalTime.toFixed(2)}s`);
  if (questionsAnswered > 0) {
    console.log(`Avg Time per Question: ${avgTimePerQuestion.toFixed(2)}s`);
  }
  console.log(`\n📊 Final Score: ${score.toLocaleString()}\n`);

  // Ask if they want to play again
  rl.question('Play again? (yes/no): ', (answer) => {
    if (answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y') {
      score = 0;
      questionsAnswered = 0;
      wrongCount = 0;
      gameConfig = { mode: null, gameType: null, level: null, difficulty: null, questionCount: null };
      startGame();
    } else {
      console.log('\nThanks for playing! 👋\n');
      rl.close();
    }
  });
}

// Start the game
startGame();