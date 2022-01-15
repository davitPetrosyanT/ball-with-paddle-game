window.onload = function windowLoaded() {
    document.addEventListener("resize", onResize);

    const canvas = document.getElementById("gameCanvas");
    const canvasContext = canvas.getContext("2d");
    canvas.addEventListener("mousemove", updateMousePosition);

    const BALL_RADIUS = 10;
    let ballX = canvas.width / 2 - BALL_RADIUS;
    let ballY = canvas.height / 2 - BALL_RADIUS;
    let ballSpeedX = 5;
    let ballSpeedY = 5;

    const PADDLE_WIDTH = 100;
    const PADDLE_THICKNESS = 10;
    let paddleX = 400;
    let paddleSpeedX = 10;

    // animation
    let stop = false;
    let frameCount = 0;
    const $results = document.getElementById("results");
    let fps = 30;
    let fpsInterval;
    let startTime;
    let now;
    let then;
    let elapsed;

    startAnimating(fps);


    function updateScreen() {
        drawAll();
        moveBall();
    }

    function drawAll() {
        /** canvas background **/
        colorRect({topLeftX: 0, topLeftY: 0, boxWidth: canvas.width, boxHeight: canvas.height, color: "black"});

        /** paddle **/
        colorRect({
            topLeftX: paddleX,
            topLeftY: canvas.height - PADDLE_THICKNESS,
            boxWidth: PADDLE_WIDTH,
            boxHeight: PADDLE_THICKNESS,
            color: "white"
        });

        /** ball **/
        colorCircle({centerX: ballX, centerY: ballY, radius: BALL_RADIUS, color: "white"})
    }

    function colorRect({topLeftX, topLeftY, boxWidth, boxHeight, color}) {
        canvasContext.fillStyle = color;
        canvasContext.fillRect(topLeftX, topLeftY, boxWidth, boxHeight);
    }

    function colorCircle({centerX, centerY, radius, color}) {
        canvasContext.fillStyle = color;
        canvasContext.beginPath();
        canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
        canvasContext.fill();
    }

    function moveBall() {
        // moving ball
        ballX += ballSpeedX;
        ballY += ballSpeedY;

        // right
        if (ballX > canvas.width) {
            ballSpeedX *= -1;
        }

        // left
        if (ballX < 0) {
            ballSpeedX *= -1;
        }

        // top
        if (ballY < 0) {
            ballSpeedY *= -1;
        }

        // bottom
        if (ballY > canvas.height) {
            resetBallPosition();
        }
    }

    function doesPaddleCatchTheBall() {
        if(ballX >= paddleX && ballX <= paddleX + PADDLE_WIDTH){
            if(ballY > canvas.height - PADDLE_THICKNESS){
                resetBallPosition();
            }
        }
    }

    function startAnimating(fps) {
        fpsInterval = 1000 / fps;
        then = Date.now();
        startTime = then;
        animate();
    }

    function animate() {
        // stop
        if (stop) {
            return;
        }

        // request another frame
        requestAnimationFrame(animate);

        // calc elapsed time since last loop
        now = Date.now();
        elapsed = now - then;

        // if enough time has elapsed, draw the next frame
        if (elapsed > fpsInterval) {

            // Get ready for next frame by setting then=now, but...
            // Also, adjust for fpsInterval not being multiple of 16.67
            then = now - (elapsed % fpsInterval);
            // draw stuff here
            updateScreen();

            // TESTING...Report #seconds since start and achieved fps.
            let sinceStart = now - startTime;
            let currentFps = Math.round(1000 / (sinceStart / ++frameCount) * 100) / 100;
            $results.innerText = ("Elapsed time= " + Math.round(sinceStart / 1000 * 100) / 100 + " secs @ " + currentFps + " fps.");

        }
    }

    function updateMousePosition(e) {
        const rect = canvas.getBoundingClientRect();
        const root = document.documentElement;

        const mouseX = e.clientX - rect.left - root.scrollLeft;
        const mouseY = e.clientY - rect.top - root.scrollTop;

        if (mouseX < canvas.width) {
            paddleX = mouseX - PADDLE_WIDTH/2;
        }

        doesPaddleCatchTheBall()
    }

    function resetBallPosition() {
        ballX = canvas.width / 2 - BALL_RADIUS;
        ballY = canvas.height / 2 - BALL_RADIUS;
    }
};

function onResize(canvas, canvasContext) {
    canvasContext.fillRect(0, 0, canvas.width, canvas.height);
}
