let canvas;
let ctx;
let intervalId;

let paddleWidth;
let paddleHeight;
let ballRadius = 10;

let paddle1Y;
let paddle2Y;

let paddleSpeed = 10;

let ballX;
let ballY;
let ballSpeedX;
let ballSpeedY;
let initialBallSpeedX;
let initialBallSpeedY;

let player1Score = 0; // Initial score for Player 1
let player2Score = 0; // Initial score for Player 2

let upPressed = false;
let downPressed = false;
let wPressed = false;
let sPressed = false;

// Function to start the Pong game
export function startPongGame(ballSpeed, paddleSize) {
    // Stop the previous game if it's already running
    stopPongGame();

    canvas = document.getElementById("pongCanvas");
    ctx = canvas.getContext("2d");

    // Show the canvas and score container
    document.getElementById("pongCanvas").style.display = "block";
    document.getElementById("score-container").style.display = "block";

    paddleWidth = 10;
    paddleHeight = paddleSize;

    // Initialize the ball speed and store it in the variables
    initialBallSpeedX = ballSpeed;
    initialBallSpeedY = ballSpeed;
    ballSpeedX = initialBallSpeedX;
    ballSpeedY = initialBallSpeedY;

    paddle1Y = (canvas.height - paddleHeight) / 2;
    paddle2Y = (canvas.height - paddleHeight) / 2;
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;

    // Add keydown and keyup event listeners
    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);

    // Reference the score element after it's loaded
    const scoreElement = document.getElementById("score");

    // Start the game loop
    intervalId = setInterval(() => draw(scoreElement), 1000 / 60);
}

// Function to stop the Pong game
export function stopPongGame() {
    clearInterval(intervalId);
    intervalId = null;
}

// Function to draw the game elements
function draw(scoreElement) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the ball
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.closePath();

    // Draw the paddles
    ctx.fillStyle = "white";
    ctx.fillRect(10, paddle1Y, paddleWidth, paddleHeight);
    ctx.fillRect(canvas.width - paddleWidth - 10, paddle2Y, paddleWidth, paddleHeight);

    // Move the paddles
    movePaddles();

    // Move the ball
    ballX += ballSpeedX;
    ballY += ballSpeedY;
    checkBallCollisions(scoreElement);
}

// Function to handle keydown events
function keyDownHandler(e) {
    if (e.key === "Up" || e.key === "ArrowUp") {
        upPressed = true;
        e.preventDefault();  // Empêche le défilement de la page
    } else if (e.key === "Down" || e.key === "ArrowDown") {
        downPressed = true;
        e.preventDefault();  // Empêche le défilement de la page
    }
    if (e.key === "W" || e.key === "w") {
        wPressed = true;
    } else if (e.key === "S" || e.key === "s") {
        sPressed = true;
    }
}

// Function to handle keyup events
function keyUpHandler(e) {
    if (e.key === "Up" || e.key === "ArrowUp") {
        upPressed = false;
        e.preventDefault();
    } else if (e.key === "Down" || e.key === "ArrowDown") {
        downPressed = false;
        e.preventDefault();
    }
    if (e.key === "W" || e.key === "w") {
        wPressed = false;
    } else if (e.key === "S" || e.key === "s") {
        sPressed = false;
    }
}

// Function to move the paddles
function movePaddles() {
    if (wPressed && paddle1Y > 0) {
        paddle1Y -= paddleSpeed;
    } else if (sPressed && paddle1Y < canvas.height - paddleHeight) {
        paddle1Y += paddleSpeed;
    }

    if (upPressed && paddle2Y > 0) {
        paddle2Y -= paddleSpeed;
    } else if (downPressed && paddle2Y < canvas.height - paddleHeight) {
        paddle2Y += paddleSpeed;
    }
}

// Function to check for ball collisions
function checkBallCollisions(scoreElement) {
    if (ballY + ballRadius > canvas.height || ballY - ballRadius < 0) {
        ballSpeedY = -ballSpeedY;
    }

    // Collision with player 1's paddle
    if (ballX - ballRadius < 20 && ballY > paddle1Y && ballY < paddle1Y + paddleHeight) {
        ballSpeedX = -ballSpeedX;
    }

    // Collision with player 2's paddle
    if (ballX + ballRadius > canvas.width - 20 && ballY > paddle2Y && ballY < paddle2Y + paddleHeight) {
        ballSpeedX = -ballSpeedX;
    }

    // Point scored
    if (ballX - ballRadius < 0) {
        player2Score++;
        updateScore(scoreElement);  // Update the score when Player 2 scores
        resetBall();
    } else if (ballX + ballRadius > canvas.width) {
        player1Score++;
        updateScore(scoreElement);  // Update the score when Player 1 scores
        resetBall();
    }
}

// Function to reset the ball after a point is scored
function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = initialBallSpeedX;
    ballSpeedY = initialBallSpeedY;
}

// Function to update the score in the DOM
function updateScore(scoreElement) {
    scoreElement.innerHTML = `
        <div class="score-box">
            <span>Joueur 1: ${player1Score}</span>
            <span>Joueur 2: ${player2Score}</span>
        </div>
    `;
}
