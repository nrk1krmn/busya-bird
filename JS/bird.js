
let board;
let boardWidth = 510;
let boardHeight = 1100;
let context;

let birdWidth = 110;
let birdHeight = 130;
let birdX = boardWidth / 8;
let birdY = boardHeight / 2.23;
let birdImg;

let bird = {
    x: birdX,
    y: birdY,
    width: birdWidth,
    height: birdHeight
}

let pipeArray = [];
let pipeWidth = 100;
let pipeHeight = 850;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

let nimb;
let loseBird;

let velocityX = -3.7;
let velocityY = 0;
let gravity = 0.15;

let gameOver = false;
let score = 0;

window.onload = function () {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    birdImg = new Image();
    birdImg.src = "./images/flappybird.png";
    birdImg.onload = function () {
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    }

    loseBird = new Image();
    loseBird.src = "./images/lose_bird.png";

    nimb = new Image();
    nimb.src = "./images/nimb.png"

    topPipeImg = new Image();
    topPipeImg.src = "./images/toppipe.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src = "./images/bottompipe.png";

    requestAnimationFrame(update);
    setInterval(placePipes, 1500);
    document.addEventListener("keydown", moveBird);
    document.addEventListener("touchstart", moveBird);
}

function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    velocityY += gravity;

    bird.y = Math.max(bird.y + velocityY, 0);
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    if (bird.y > board.height) {
        gameOver = true;
    }

    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 0.5;
            pipe.passed = true;
        }

        if (detectCollision(bird, pipe)) {
            gameOver = true;
        }
    }

    while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
        pipeArray.shift();
    }

    context.fillStyle = "white";
    if (score < 10) {
        context.fillRect(220, 30, 63, 80);
    }
    if (score >= 10 && score < 100) {
        context.fillRect(220, 30, 105, 80);
    }
    if (score >= 100) {
        context.fillRect(220, 30, 147, 80);
    }

    context.font = "70px sans-serif";
    context.fillStyle = "black";
    context.fillText(score, 233, 96);
    context.fillStyle = "violet";
    context.fillText(score, 232, 95);


    if (gameOver) {
        context.drawImage(loseBird, bird.x - 10, bird.y - 10, bird.width + 29, bird.height + 27);
        context.drawImage(nimb, bird.x - 4, bird.y - 20, 125, 50);
        context.fillStyle = "white";
        context.fillRect(25, 435, 450, 170);
        context.fillStyle = "black";
        context.fillText("    БУСЬКА", 38, 511);
        context.fillText("ПРОИГРАЛА", 38, 581);
        context.fillStyle = "violet";
        context.fillText("    БУСЬКА", 37, 510);
        context.fillText("ПРОИГРАЛА", 37, 580);
        boardHeight = 0;
        boardWidth = 0;

    }
}

function placePipes() {
    if (gameOver) {
        return;
    }
    let randomPipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);
    let openingSpace = board.height / 4;

    let topPipe = {
        img: topPipeImg,
        x: pipeX,
        y: randomPipeY,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    }
    pipeArray.push(topPipe);

    let bottomPipe = {
        img: bottomPipeImg,
        x: pipeX,
        y: randomPipeY + pipeHeight + openingSpace,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    }
    pipeArray.push(bottomPipe);
}

function moveBird(e) {
    console.log(e.code)

    velocityY = -6.5;

    if (gameOver) {
        bird.y = birdY;
        pipeArray = [];
        score = 0;
        gameOver = false;
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y;
}
