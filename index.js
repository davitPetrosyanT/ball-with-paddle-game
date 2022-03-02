window.onload = function windowLoaded() {
    document.addEventListener("resize", onResize);

    const canvas = document.getElementById("gameCanvas");
    const canvasContext = canvas.getContext("2d");
    canvas.addEventListener("mousemove", updateMousePosition);
    canvas.addEventListener("click", startTheGame );

    // ball variables
    const BALL_RADIUS = 10;
    let ballX = canvas.width / 2 - BALL_RADIUS;
    let ballY = canvas.height / 2 - BALL_RADIUS;
    let ballSpeedX = 5;
    let ballSpeedY = 7;

    // paddle variables
    const PADDLE_WIDTH = 100;
    const PADDLE_THICKNESS = 10;
    const PADDLE_DISTANCE_FROM_EDGE = 60;
    let paddleX = 400;
    let paddleSpeedX = 10;

    // mouse
    let mouseX = 0;
    let mouseY = 0;

    // brick
    const BRICK_WIDTH = 100;
    const BRICK_HEIGHT = 50;
    const BRICK_COUNT = 8;
    const BRICK_GAP = 2;
    let brickGreed = new Array(BRICK_COUNT).fill(true);
    const BRICK_ROWS = 4;

    resetBricks();


    // animation
    let stop = true;
    let frameCount = 0;
    const $results = document.getElementById("results");
    let fps = 30;
    let fpsInterval;
    let startTime;
    let now;
    let then;
    let elapsed;

    // startAnimating(fps);
    updateScreen();

    function updateScreen() {
        drawAll();
        moveBall();
    }

    function startTheGame() {
        if (stop) {
            stop = false;
            startAnimating(fps);
        }
    }

    function endTheGame() {
        // stop = true;
        resetBallPosition();
        resetBallSpeed();
    }

    function drawAll() {
        /** canvas background **/
        colorRect({topLeftX: 0, topLeftY: 0, boxWidth: canvas.width, boxHeight: canvas.height, fillColor: "black"});

        /** paddle **/
        colorRect({
            topLeftX: paddleX,
            topLeftY: canvas.height - PADDLE_DISTANCE_FROM_EDGE,
            boxWidth: PADDLE_WIDTH,
            boxHeight: PADDLE_THICKNESS,
            fillColor: "white"
        });

        /** ball **/
        colorCircle({centerX: ballX, centerY: ballY, radius: BALL_RADIUS, fillColor: "white"});

        /** bricks **/
        drawBricks();

        /** debug info **/
        let mouseBrickCol = mouseX / BRICK_WIDTH;
        let mouseBrickRow = mouseY / BRICK_HEIGHT;
        colorText({text: `${mouseBrickCol}, ${mouseBrickRow}`, textX: mouseX, textY: mouseY, fillColor: 'yellow'})
    }

    /**
     *
     * @param topLeftX
     * @param topLeftY
     * @param boxWidth
     * @param boxHeight
     * @param fillColor
     */
    function colorRect({topLeftX, topLeftY, boxWidth, boxHeight, fillColor}) {
        canvasContext.fillStyle = fillColor;
        canvasContext.fillRect(topLeftX, topLeftY, boxWidth, boxHeight);
    }

    /**
     *
     * @param centerX
     * @param centerY
     * @param radius
     * @param fillColor
     */
    function colorCircle({centerX, centerY, radius, fillColor}) {
        canvasContext.fillStyle = fillColor;
        canvasContext.beginPath();
        canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
        canvasContext.fill();
    }

    /**
     *
     * @param text
     * @param textX
     * @param textY
     * @param fillColor
     */
    function colorText({text, textX, textY, fillColor}) {
        canvasContext.fillStyle = fillColor;
        canvasContext.fillText(text, textX, textY);
    }

    function drawBricks() {
        for(let ri = 0; ri < BRICK_ROWS; ri++){
            for(let i = 0; i<BRICK_COUNT; i++){
                if(brickGreed[i]){
                    colorRect({
                        topLeftX: BRICK_WIDTH * i,
                        topLeftY: ri * BRICK_HEIGHT,
                        boxWidth: BRICK_WIDTH - BRICK_GAP,
                        boxHeight: BRICK_HEIGHT - BRICK_GAP,
                        fillColor: "blue"
                    });
                }
            }
        }
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
            endTheGame();
        }

        const paddleTopEdgeY = canvas.height - PADDLE_DISTANCE_FROM_EDGE - PADDLE_THICKNESS;
        const paddleBottomEdgeY = canvas.height - PADDLE_DISTANCE_FROM_EDGE;
        const paddleLeftEdgeX = paddleX;
        const paddleRightEdgeX = paddleX + PADDLE_WIDTH;

        if( ballX + BALL_RADIUS > paddleLeftEdgeX && // right
            ballX - BALL_RADIUS < paddleRightEdgeX && // left
            ballY + BALL_RADIUS > paddleTopEdgeY && // below
            ballY - BALL_RADIUS < paddleBottomEdgeY // below
        ){

            ballSpeedY *= -1;

            const paddleCenterX = paddleX + PADDLE_WIDTH / 2;
            const ballDistFromPaddleCenterX = ballX - paddleCenterX;
            ballSpeedX = ballDistFromPaddleCenterX * 0.35;
            console.log("ballSpeedX: ", ballSpeedX)
        }
    }

    function updateMousePosition(e) {
        const rect = canvas.getBoundingClientRect();
        const root = document.documentElement;

        mouseX = e.clientX - rect.left - root.scrollLeft;
        mouseY = e.clientY - rect.top - root.scrollTop;

        if (mouseX < canvas.width) {
            paddleX = mouseX - PADDLE_WIDTH/2;
        }
    }

    function resetBallPosition() {
        ballX = canvas.width / 2 - BALL_RADIUS;
        ballY = canvas.height / 2 - BALL_RADIUS;
    }

    function resetBallSpeed() {
        ballSpeedX = 5;
        ballSpeedY = 5;
    }

    function resetBricks() {
        for(let i=0; i < BRICK_COUNT; i++){
            brickGreed[i] = true;
        }

        // for debugging
        // for(let i=0; i < BRICK_COUNT; i++){
        //     brickGreed[i] = Math.random() < 0.5;
        // }
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

};

function onResize(canvas, canvasContext) {
    canvasContext.fillRect(0, 0, canvas.width, canvas.height);
}
