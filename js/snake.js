export { start, stop }

// Playing board
const canvasBlockSize = 25;
const rowAndColumnLength = 20;
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

// Snake and food
let snakeHead = {x: getRandomCoordinate(), y: getRandomCoordinate()};
let delta = {x: 0, y: 0};
let food = {x: 0, y: 0}
let snakeBody = [];

// Score
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('highScore');
let highScore = 0;

// Update
let updateInterval;
let updateNumber = 0;
let updateNumberCheck = 1;

function start() {
    canvas.height = rowAndColumnLength * canvasBlockSize;
    canvas.width = rowAndColumnLength * canvasBlockSize;
    document.addEventListener('keydown', changeDirection);
    placeFood();
    updateInterval = setInterval(update, 100);
}

function stop() {
    clearInterval(updateInterval);
    reset();
}

function reset() {
    snakeHead.x = getRandomCoordinate();
    snakeHead.y = getRandomCoordinate();
    delta.x = 0;
    delta.y = 0;
    snakeBody = [];
    placeFood();
    updateNumber = 0;
    updateNumberCheck = 0;
}

function update() {
    scoreElement.innerHTML = snakeBody.length.toString();

    if (snakeBody.length > highScore) {
        highScore = snakeBody.length;
        highScoreElement.innerHTML = highScore;
    }

    context.fillStyle = 'black';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = 'lime';
    context.fillRect(food.x, food.y, canvasBlockSize, canvasBlockSize);

    if (snakeHead.x === food.x && snakeHead.y === food.y) {
        snakeBody.push([food.x, food.y]);
        placeFood();
    }

    updateSnake();
    checkGameOver();
    updateNumber++;
}

function updateSnake() {
    // Update snake
    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }
    if (snakeBody.length) {
        snakeBody[0] = [snakeHead.x, snakeHead.y];
    }

    // Fill in snake color
    context.fillStyle = 'white';
    snakeHead.x += delta.x * canvasBlockSize;
    snakeHead.y += delta.y * canvasBlockSize;
    context.fillRect(snakeHead.x, snakeHead.y, canvasBlockSize, canvasBlockSize);
    for (let i = 0; i < snakeBody.length; i++) {
        context.fillRect(snakeBody[i][0], snakeBody[i][1], canvasBlockSize, canvasBlockSize);
    }
}

function checkGameOver() {
    let isOutOfBounds = snakeHead.x < 0 || snakeHead.x > rowAndColumnLength * canvasBlockSize || snakeHead.y < 0 || snakeHead.y > rowAndColumnLength * canvasBlockSize;
    if (isOutOfBounds) {
        reset();
    }

    for (let i = 0; i < snakeBody.length; i++) {
        let isSnakeRunningIntoItself = snakeHead.x === snakeBody[i][0] && snakeHead.y === snakeBody[i][1];
        if (isSnakeRunningIntoItself) {
            reset();
        }
    }
}

function changeDirection(event) {
    // Check that game updated in between keystrokes
    if (updateNumber === updateNumberCheck) {
        return;
    }

    if (event.code === 'ArrowUp' && delta.y !== 1) {
        delta.x = 0;
        delta.y = -1;
    }
    else if (event.code === 'ArrowDown' && delta.y !== -1) {
        delta.x = 0;
        delta.y = 1;
    }
    else if (event.code === 'ArrowLeft' && delta.x !== 1) {
        delta.x = -1;
        delta.y = 0;
    }
    else if (event.code === 'ArrowRight' && delta.x !== -1) {
        delta.x = 1;
        delta.y = 0;
    }
    updateNumberCheck = updateNumber;
}

function placeFood() {
    food.x = getRandomCoordinate();
    food.y = getRandomCoordinate();

    // Check that food isn't placed under snake
    let isFoodHidden = true;
    for (let i = 0; i < snakeBody.length; i++) {
        isFoodHidden = food.x === snakeBody[i][0] && food.y === snakeBody[i][1];
        if (isFoodHidden) {
            food.x = getRandomCoordinate();
            food.y = getRandomCoordinate();
            i = 0;
        }
    }
}

function getRandomCoordinate() {
    return Math.floor(Math.random() * rowAndColumnLength) * canvasBlockSize;
}

// Highscores

function saveScore(username, score) {
    fetch(h, {
        method: 'POST',
        body: JSON.stringify({
          username: username,
          score: score,
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8'
        }
      }).catch(error => {
        console.error('Error fetching data:', error);
    });
}

function populateTop10List() {
    const listElement = document.getElementById('highScoreList');
    fetch(t)
        .then(response => response.json())
        .then(data => {
            listElement.innerHTML = '';
            let count = 0;

            data.forEach(item => {
                count++;
                const listItem = document.createElement('li');
                listItem.textContent = count + '. ' + item.username + ': ' + item.score;
                listElement.appendChild(listItem);
            });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

// Score modal
const scoresModal = document.getElementById('scoresModal');
const openModalScoresBtn = document.getElementById('openModalScoresBtn');
const closeScoresBtn = document.getElementById('closeScoresModal');

openModalScoresBtn.addEventListener('click', () => {
    populateTop10List();
    scoresModal.style.display = 'block';
});

closeScoresBtn.addEventListener('click', () => {
    scoresModal.style.display = 'none';
});

// Save modal
const saveModal = document.getElementById('saveModal');
const saveButton = document.getElementById('saveButton');
const openModalSaveBtn = document.getElementById('openModalSaveBtn');
const closeSaveBtn = document.getElementById('closeSaveModal');

openModalSaveBtn.addEventListener('click', () => {
    saveModal.style.display = 'block';
    saveButton.style.display = 'block';
    document.getElementById('scoreToSave').innerHTML = highScore;
});

closeSaveBtn.addEventListener('click', () => {
    saveModal.style.display = 'none';
});

function handleSubmit() {
    const username = document.getElementById('usernameInput').value;
    saveScore(username, highScore);
    saveModal.style.display = 'none';
}

document.getElementById('saveButton').addEventListener('click', handleSubmit);

// Close modal when clicking outside of it
window.addEventListener('click', (event) => {
    if (event.target === scoresModal || event.target === saveModal) {
        scoresModal.style.display = 'none';
        saveModal.style.display = 'none';
    }
});

var _0x1994=["\x68\x74\x74\x70\x73\x3A\x2F\x2F\x70\x72\x6F\x66\x69\x63\x69\x65\x6E\x74\x2D\x67\x6F\x73\x68\x61\x77\x6B\x2D\x38\x31\x39\x36\x2E\x64\x61\x74\x61\x70\x6C\x69\x63\x69\x74\x79\x2E\x69\x6F\x2F\x70\x6F\x72\x74\x66\x6F\x6C\x69\x6F\x2F\x68\x69\x67\x68\x73\x63\x6F\x72\x65"];let h=_0x1994[0]
var _0x3881=["\x68\x74\x74\x70\x73\x3A\x2F\x2F\x70\x72\x6F\x66\x69\x63\x69\x65\x6E\x74\x2D\x67\x6F\x73\x68\x61\x77\x6B\x2D\x38\x31\x39\x36\x2E\x64\x61\x74\x61\x70\x6C\x69\x63\x69\x74\x79\x2E\x69\x6F\x2F\x70\x6F\x72\x74\x66\x6F\x6C\x69\x6F\x2F\x74\x6F\x70\x31\x30"];let t=_0x3881[0]
