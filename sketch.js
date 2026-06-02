let shipX = 200;
let asteroids = [];
let score = 0;
let gameOver = false;
let fallSpeed = 4;
let started = false;
let audioCtx;
let stars = [];
let highScore = 0;
let players = 1;
let ship2X = 270;
let ship1Alive = true;
let ship2Alive = true;

function setup() {
    createCanvas(400, 600);
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    for (let i = 0; i < 50; i++) {
        stars.push({x: random(400), y:random(600) })
    }
    if (localStorage.getItem("highScore")) {
        highScore = Number(localStorage.getItem("highScore"));
    }
}

function draw() {
    background(10,10,40);

    fill(255);
    for (let i = 0; i < stars.length; i++) {
        circle(stars[i].x, stars[i].y, 2);
        stars[i].y = stars[i].y + 1;
        if (stars[i].y > 600) {
            stars[i].y = 0;
            stars[i].x = random(400);
        }
    }

    if (!started) {
        fill(255);
        textAlign(CENTER);
        textSize(36);
        text("Asteroid Dodger", 200, 250);
        textSize(20);
        text("Press 1 for One Player", 200, 300);
        text("Press 2 for Two Players", 200, 330);
        return;
    }

    if (gameOver) {
        fill(255);
        textAlign(CENTER);
        if (players === 1) {
            textSize(40);
            text("Game Over", 200, 280);
            textSize(24);
            text("Score: " + score, 200, 320);
            text("Best: " + highScore, 200, 350);
        } else {
            textSize(34);
            if (ship1Alive) {
                text("PLayer 1 Wins!", 200, 290);
            } else {
                text("Player 2 Wins!", 200, 290);
            }
        }
        textSize(16);
        text("Press any key to play again", 200, 380);
        return;
    }

    if (keyIsDown(LEFT_ARROW)) {
        shipX = shipX - 5
    }

    if (keyIsDown(RIGHT_ARROW)) {
        shipX = shipX + 5
    }

    shipX = constrain(shipX, 15, 385);

    if (players == 2) {
        if (keyIsDown(65)) {
            ship2X = ship2X - 5
        }
        if (keyIsDown(68)) {
            ship2X = ship2X + 5
        }
        ship2X = constrain(ship2X, 15, 385);
    }

    if (frameCount % 30 === 0) {
        asteroids.push({ x: random(20, 380), y: 0, bumps: makeBumps()});
    }

    fill(110, 105, 100);
    for (let i = 0; i < asteroids.length; i++) {
        asteroids[i].y = asteroids[i].y + fallSpeed;
        
        beginShape();
        for (let a = 0; a < asteroids[i].bumps.length; a++) {
            let angle = (TWO_PI/asteroids[i].bumps.length * a);
            let r = asteroids[i].bumps[a];
            vertex(asteroids[i].x + cos(angle) * r, asteroids[i].y + sin(angle) * r)
        }
        endShape(CLOSE);

        if (ship1Alive && dist(shipX, 555, asteroids[i].x, asteroids[i].y) < 25) {
            ship1Alive = false;
            playBeep(120, 0.4);
        }

        if (players === 2 && ship1Alive && dist(shipX, 555, asteroids[i].x, asteroids[i].y) < 25) {
                ship2Alive = false;
                playBeep(120,0.4);
        }
        
    }

    if (players === 1) {
        if (!ship1Alive) {
            gameOver = true;
            if (score > highScore) {
                highScore = score;
                localStorage.setItem("highScore", highScore)
            }
        }
    } else {
        if (!ship1Alive || !ship2Alive) {
            gameOver = true;
        }
    }

    fill(255, 150, 0);
    triangle(shipX, 585, shipX - 6, 570, shipX + 6, 570);
    fill(0, 200, 255)
    triangle(shipX,540,shipX - 15, 570, shipX +15, 570);

    if (players == 2) {
        fill(255, 150, 0);
        triangle(ship2X, 585, ship2X - 6, 570, ship2X + 6, 570);
        fill(0, 255, 120);
        triangle(ship2X, 540, ship2X - 15, 570, ship2X + 15, 570);
    }

    score = score + 1;
    fallSpeed = fallSpeed + 0.002
    fill(255);
    textAlign(LEFT);
    textSize(20);
    text("Score: " + score, 10, 30);
}

function keyPressed() {
    if (audioCtx.state === "suspended") { audioCtx.resume(); }

    if (!started) {
        if (key === "1") {
            players = 1;
            started = true;
        }
        if (key === "2") {
            players = 2;
            shipX = 130;
            ship2X = 270;
            started = true;
        }
        return;
    }

    if (gameOver) {
        asteroids = []
        score = 0;
        shipX = 200;
        ship2X = 270;
        ship1Alive = true;
        ship2Alive = true;
        gameOver = false;
        fallSpeed = 4;
        started = false;
    }
}

function playBeep(freq, duration) {
    let osc = audioCtx.createOscillator();
    let gain = audioCtx.createGain();
    osc.frequency.value = freq;
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
}

function makeBumps() {
    let b = [];
    for (let a = 0; a < 10; a++) {
        b.push(random(10,18));
    }
    return b;
}








