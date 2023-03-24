export { start, stop }

// Playing board
const canvasBlockSize = 25;
const rowAndColumnLength = 20;
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

// Snake and food
let snakeHead = {x: getRandomCoordinate(), y: getRandomCoordinate()};
let delta = {x: 0, y: 0};
let food = {x: 0, y: 0}
let snakeBody = [];

// Score
const scoreElement = document.getElementById("score");
const highScoreElement = document.getElementById("highScore");
let highScore = 0;

// Update
let updateInterval;
let updateNumber = 0;
let updateNumberCheck = 1;

function start() {
    canvas.height = rowAndColumnLength * canvasBlockSize;
    canvas.width = rowAndColumnLength * canvasBlockSize;
    document.addEventListener("keydown", changeDirection);
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
    scoreElement.innerHTML = snakeBody.length;

    if (snakeBody.length > highScore) {
        highScore = snakeBody.length;
        highScoreElement.innerHTML = highScore;
    }

    context.fillStyle = "black";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "lime";
    context.fillRect(food.x, food.y, canvasBlockSize, canvasBlockSize);

    if (snakeHead.x == food.x && snakeHead.y == food.y) {
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
    context.fillStyle = "white";
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
        let isSnakeRunningIntoItself = snakeHead.x == snakeBody[i][0] && snakeHead.y == snakeBody[i][1];
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

    if (event.code === "ArrowUp" && delta.y !== 1) {
        delta.x = 0;
        delta.y = -1;
    }
    else if (event.code === "ArrowDown" && delta.y !== -1) {
        delta.x = 0;
        delta.y = 1;
    }
    else if (event.code === "ArrowLeft" && delta.x !== 1) {
        delta.x = -1;
        delta.y = 0;
    }
    else if (event.code === "ArrowRight" && delta.x !== -1) {
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
