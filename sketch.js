let gameState = "LOBBY";
let selectedPlayerIndex = 0;

let player;
let bot;
let ball;

let goalkeeperLeft;
let goalkeeperRight;

let playerScore = 0;
let botScore = 0;

let winnerText = "";

const FIELD_MARGIN = 50;
const GOAL_SIZE = 170;
const GOAL_DEPTH = 45;
const MAX_SCORE = 5;

const GK_RADIUS = 14;
const GK_SPEED = 2.5;

const PLAYER_SPEED_MULTIPLIER = 0.65;

// BOT MAIS LENTO
const BOT_SPEED_MULTIPLIER = 0.75;

// CHUTE MAIS FRACO
const KICK_FORCE = 7;
const KICK_COOLDOWN = 25;

let kickCooldown = 0;

let shirtPicker;
let shortsPicker;
let socksPicker;
let startButton;


// =====================================
// JOGADORES
// =====================================

const PLAYERS_DATA = [
  {
    name: "Lionel Messi",
    speed: 5,
    power: 8,
    color: [100, 180, 255]
  },

  {
    name: "Neymar Jr",
    speed: 5.3,
    power: 7.2,
    color: [240, 200, 50]
  },

  {
    name: "Vinicius Jr",
    speed: 5.5,
    power: 7,
    color: [255, 255, 255]
  },

  {
    name: "Cristiano Ronaldo",
    speed: 5.1,
    power: 8.8,
    color: [220, 50, 50]
  },

  {
    name: "Kylian Mbappe",
    speed: 5.6,
    power: 7.5,
    color: [50, 50, 200]
  },

  {
    name: "Erling Haaland",
    speed: 4.6,
    power: 9.5,
    color: [180, 220, 250]
  }
];


// =====================================
// SETUP
// =====================================

function setup() {

  createCanvas(1200, 700);

  shirtPicker = createColorPicker("#64B4FF");
  shirtPicker.position(700, 150);

  shortsPicker = createColorPicker("#FFFFFF");
  shortsPicker.position(700, 200);

  socksPicker = createColorPicker("#64B4FF");
  socksPicker.position(700, 250);

  startButton = createButton("INICIAR JOGO");

  startButton.position(
    width / 2 - 80,
    500
  );

  startButton.size(160, 45);

  startButton.mousePressed(startGame);
}


// =====================================
// DRAW
// =====================================

function draw() {

  if (gameState === "LOBBY") {

    shirtPicker.show();
    shortsPicker.show();
    socksPicker.show();
    startButton.show();

    drawLobby();

  } else {

    shirtPicker.hide();
    shortsPicker.hide();
    socksPicker.hide();
    startButton.hide();

    runGame();

    if (gameState === "GAMEOVER") {
      drawGameOver();
    }
  }
}


// =====================================
// MENU
// =====================================

function drawLobby() {

  background(20, 30, 40);

  let p = PLAYERS_DATA[selectedPlayerIndex];

  textAlign(CENTER, CENTER);

  fill(255, 215, 0);
  textSize(32);

  text(
    "ESCOLHA SEU JOGADOR",
    width / 2,
    45
  );

  fill(30, 45, 60);

  stroke(
    p.color[0],
    p.color[1],
    p.color[2]
  );

  strokeWeight(4);

  rect(
    width / 2 - 300,
    100,
    250,
    280,
    15
  );

  fill(
    p.color[0],
    p.color[1],
    p.color[2]
  );

  noStroke();

  ellipse(
    width / 2 - 175,
    165,
    70
  );

  fill(255);

  textSize(20);

  text(
    p.name,
    width / 2 - 175,
    225
  );

  textSize(15);

  text(
    "Velocidade: " + p.speed,
    width / 2 - 175,
    260
  );

  text(
    "Forca: " + p.power,
    width / 2 - 175,
    290
  );

  fill(30, 45, 60);

  stroke(100);
  strokeWeight(2);

  rect(
    width / 2 + 20,
    100,
    300,
    280,
    15
  );

  fill(255);
  noStroke();

  textSize(20);

  text(
    "COR DO UNIFORME",
    width / 2 + 170,
    125
  );

  textAlign(LEFT, CENTER);

  textSize(15);

  text("Camisa:", width / 2 + 40, 165);
  text("Shorts:", width / 2 + 40, 215);
  text("Meiao:", width / 2 + 40, 265);

  drawPreviewCharacter(
    width / 2 + 170,
    330
  );

  textAlign(CENTER, CENTER);

  fill(180);
  textSize(16);

  text(
    "Use as setas esquerda/direita para trocar",
    width / 2,
    430
  );

  fill(0, 255, 127);
  textSize(21);

  text(
    "ENTER ou ESPACO para jogar",
    width / 2,
    470
  );
}


// =====================================
// PERSONAGEM DO MENU
// =====================================

function drawPreviewCharacter(x, y) {

  push();

  translate(x, y);

  fill(socksPicker.color());

  stroke(0);

  ellipse(-10, 20, 9, 18);
  ellipse(10, 20, 9, 18);

  fill(shortsPicker.color());

  rect(-15, 0, 30, 18, 4);

  fill(shirtPicker.color());

  rect(-22, -25, 44, 28, 6);

  fill(240, 190, 150);

  ellipse(0, -38, 25);

  pop();
}


// =====================================
// CONTROLES
// =====================================

function keyPressed() {

  if (gameState === "LOBBY") {

    if (keyCode === RIGHT_ARROW) {

      selectedPlayerIndex++;

      if (
        selectedPlayerIndex >=
        PLAYERS_DATA.length
      ) {
        selectedPlayerIndex = 0;
      }
    }

    if (keyCode === LEFT_ARROW) {

      selectedPlayerIndex--;

      if (selectedPlayerIndex < 0) {
        selectedPlayerIndex =
          PLAYERS_DATA.length - 1;
      }
    }

    if (
      keyCode === ENTER ||
      keyCode === 32 ||
      key === " "
    ) {

      startGame();

      return false;
    }
  }

  else if (gameState === "GAME") {

    if (key === "c" || key === "C") {
      switchPlayer();
    }

    if (
      keyCode === 32 ||
      key === " "
    ) {

      player.kick();

      return false;
    }
  }

  else if (gameState === "GAMEOVER") {

    if (key === "r" || key === "R") {
      gameState = "LOBBY";
    }
  }
}


// =====================================
// COMEÇAR JOGO
// =====================================

function startGame() {

  playerScore = 0;
  botScore = 0;

  winnerText = "";
  kickCooldown = 0;

  gameState = "GAME";

  let pData =
    PLAYERS_DATA[selectedPlayerIndex];

  let botIndex =
    (selectedPlayerIndex + 1) %
    PLAYERS_DATA.length;

  let bData =
    PLAYERS_DATA[botIndex];

  let playerKit = {

    shirt: shirtPicker.color(),
    shorts: shortsPicker.color(),
    socks: socksPicker.color()
  };

  let botKit = {

    shirt: color(
      bData.color[0],
      bData.color[1],
      bData.color[2]
    ),

    shorts: color(20),
    socks: color(255)
  };

  player = new Player(
    260,
    height / 2,
    pData,
    true,
    playerKit
  );

  bot = new Player(
    width - 260,
    height / 2,
    bData,
    false,
    botKit
  );

  ball = new Ball(
    width / 2,
    height / 2
  );

  goalkeeperLeft = new Goalkeeper(
    FIELD_MARGIN + 20,
    height / 2,
    "left"
  );

  goalkeeperRight = new Goalkeeper(
    width - FIELD_MARGIN - 20,
    height / 2,
    "right"
  );

  resetMatch("right");
}


// =====================================
// TROCAR JOGADOR
// =====================================

function switchPlayer() {

  selectedPlayerIndex++;

  if (
    selectedPlayerIndex >=
    PLAYERS_DATA.length
  ) {

    selectedPlayerIndex = 0;
  }

  let data =
    PLAYERS_DATA[selectedPlayerIndex];

  player.data = data;

  player.speed =
    data.speed *
    PLAYER_SPEED_MULTIPLIER;

  player.power =
    data.power;
}


// =====================================
// RESETAR LANCE
// =====================================

function resetMatch(side) {

  player.pos.set(
    260,
    height / 2
  );

  bot.pos.set(
    width - 260,
    height / 2
  );

  player.vel.set(0, 0);
  bot.vel.set(0, 0);

  goalkeeperLeft.reset();
  goalkeeperRight.reset();

  ball.pos.set(
    width / 2,
    height / 2
  );

  if (side === "right") {

    ball.vel.set(
      -3,
      random(-1.5, 1.5)
    );

  } else {

    ball.vel.set(
      3,
      random(-1.5, 1.5)
    );
  }

  ball.stuckFrames = 0;
  kickCooldown = 0;
}


// =====================================
// PONTO
// =====================================

function finishPoint(side) {

  if (
    playerScore >= MAX_SCORE ||
    botScore >= MAX_SCORE
  ) {

    gameState = "GAMEOVER";

    if (playerScore >= MAX_SCORE) {
      winnerText = "VOCÊ VENCEU!";
    } else {
      winnerText =
        "O ADVERSÁRIO VENCEU!";
    }

  } else {

    resetMatch(side);
  }
}


// =====================================
// JOGO
// =====================================

function runGame() {

  if (kickCooldown > 0) {
    kickCooldown--;
  }

  drawField();

  if (gameState === "GAME") {

    ball.update();

    player.update();
    bot.update();

    goalkeeperLeft.update();
    goalkeeperRight.update();

    player.checkCollision(ball);
    bot.checkCollision(ball);

    goalkeeperLeft.checkCollision(ball);
    goalkeeperRight.checkCollision(ball);
  }

  ball.display();

  goalkeeperLeft.display();
  goalkeeperRight.display();

  player.display();
  bot.display();

  drawScore();

  if (gameState === "GAME") {
    drawControls();
  }
}


// =====================================
// CONTROLES NA TELA
// =====================================

function drawControls() {

  fill(0, 0, 0, 150);

  noStroke();

  rect(
    15,
    height - 48,
    370,
    32,
    8
  );

  fill(255);

  textAlign(LEFT, CENTER);

  textSize(14);

  text(
    "WASD/SETAS = MOVER   ESPAÇO = CHUTAR",
    25,
    height - 32
  );
}


// =====================================
// CAMPO
// =====================================

function drawField() {

  background(30, 130, 40);

  noStroke();

  for (
    let x = 0;
    x < width;
    x += 60
  ) {

    if ((x / 60) % 2 === 0) {
      fill(34, 139, 34);
    } else {
      fill(28, 120, 28);
    }

    rect(x, 0, 60, height);
  }

  stroke(255);
  strokeWeight(4);
  noFill();

  rect(
    FIELD_MARGIN,
    FIELD_MARGIN,
    width - FIELD_MARGIN * 2,
    height - FIELD_MARGIN * 2
  );

  line(
    width / 2,
    FIELD_MARGIN,
    width / 2,
    height - FIELD_MARGIN
  );

  ellipse(
    width / 2,
    height / 2,
    140
  );

  fill(255);
  noStroke();

  ellipse(
    width / 2,
    height / 2,
    8
  );

  stroke(255);
  noFill();

  rect(
    FIELD_MARGIN,
    height / 2 - 120,
    130,
    240
  );

  rect(
    width - FIELD_MARGIN - 130,
    height / 2 - 120,
    130,
    240
  );

  let goalTop =
    height / 2 -
    GOAL_SIZE / 2;

  drawGoal(
    FIELD_MARGIN - GOAL_DEPTH,
    goalTop,
    GOAL_DEPTH,
    GOAL_SIZE
  );

  drawGoal(
    width - FIELD_MARGIN,
    goalTop,
    GOAL_DEPTH,
    GOAL_SIZE
  );

  drawCornerMarks();
}


// =====================================
// CANTOS
// =====================================

function drawCornerMarks() {

  stroke(255);
  strokeWeight(3);
  noFill();

  let r = 25;

  arc(
    FIELD_MARGIN,
    FIELD_MARGIN,
    r * 2,
    r * 2,
    0,
    HALF_PI
  );

  arc(
    width - FIELD_MARGIN,
    FIELD_MARGIN,
    r * 2,
    r * 2,
    HALF_PI,
    PI
  );

  arc(
    width - FIELD_MARGIN,
    height - FIELD_MARGIN,
    r * 2,
    r * 2,
    PI,
    PI + HALF_PI
  );

  arc(
    FIELD_MARGIN,
    height - FIELD_MARGIN,
    r * 2,
    r * 2,
    PI + HALF_PI,
    TWO_PI
  );
}


// =====================================
// GOL
// =====================================

function drawGoal(x, y, w, h) {

  fill(0, 50, 0, 100);

  stroke(255);
  strokeWeight(2);

  rect(x, y, w, h);

  stroke(255, 150);

  for (
    let i = x;
    i <= x + w;
    i += 6
  ) {

    line(i, y, i, y + h);
  }

  for (
    let j = y;
    j <= y + h;
    j += 8
  ) {

    line(x, j, x + w, j);
  }
}


// =====================================
// PLACAR
// =====================================

function drawScore() {

  fill(10, 20, 30, 220);

  noStroke();

  rect(
    width / 2 - 250,
    10,
    500,
    45,
    10
  );

  fill(255);

  textAlign(CENTER, CENTER);

  textSize(17);

  text(
    player.data.name +
    "  " +
    playerScore +
    " x " +
    botScore +
    "  " +
    bot.data.name,
    width / 2,
    32
  );
}


// =====================================
// GAME OVER
// =====================================

function drawGameOver() {

  fill(0, 0, 0, 190);

  rect(
    0,
    0,
    width,
    height
  );

  fill(255, 215, 0);

  textAlign(CENTER, CENTER);

  textSize(42);

  text(
    winnerText,
    width / 2,
    height / 2 - 30
  );

  fill(255);

  textSize(20);

  text(
    "Pressione R para voltar ao menu",
    width / 2,
    height / 2 + 35
  );
}


// =====================================
// GOLEIRO
// =====================================

class Goalkeeper {

  constructor(x, y, side) {

    this.x = x;
    this.y = y;

    this.side = side;

    this.radius = GK_RADIUS;
    this.speed = GK_SPEED;

    this.direction = 1;

    if (side === "left") {

      this.color =
        color(255, 180, 0);

    } else {

      this.color =
        color(220, 50, 50);
    }
  }

  reset() {

    this.y = height / 2;
    this.direction = 1;
  }

  update() {

    this.y +=
      this.speed *
      this.direction;

    let top =
      height / 2 -
      GOAL_SIZE / 2 +
      this.radius;

    let bottom =
      height / 2 +
      GOAL_SIZE / 2 -
      this.radius;

    if (this.y <= top) {

      this.y = top;
      this.direction = 1;
    }

    if (this.y >= bottom) {

      this.y = bottom;
      this.direction = -1;
    }
  }

  checkCollision(b) {

    let dx =
      b.pos.x - this.x;

    let dy =
      b.pos.y - this.y;

    let distancia =
      sqrt(dx * dx + dy * dy);

    let distanciaMinima =
      this.radius + b.radius;

    if (
      distancia > 0 &&
      distancia < distanciaMinima
    ) {

      let nx = dx / distancia;
      let ny = dy / distancia;

      let sobreposicao =
        distanciaMinima - distancia;

      b.pos.x += nx * sobreposicao;
      b.pos.y += ny * sobreposicao;

      if (this.side === "left") {

        b.vel.x =
          abs(b.vel.x) + 2;

      } else {

        b.vel.x =
          -abs(b.vel.x) - 2;
      }

      b.vel.y +=
        (b.pos.y - this.y) *
        0.15;

      b.vel.limit(10);
    }
  }

  display() {

    push();

    fill(0, 0, 0, 70);

    noStroke();

    ellipse(
      this.x + 3,
      this.y + 3,
      this.radius * 2
    );

    fill(this.color);

    stroke(0);
    strokeWeight(2);

    ellipse(
      this.x,
      this.y,
      this.radius * 2
    );

    fill(255);
    noStroke();

    textAlign(CENTER, CENTER);
    textSize(8);

    text(
      "GK",
      this.x,
      this.y
    );

    pop();
  }
}


// =====================================
// JOGADOR
// =====================================

class Player {

  constructor(
    x,
    y,
    data,
    human,
    kit
  ) {

    this.pos =
      createVector(x, y);

    this.vel =
      createVector(0, 0);

    this.radius = 22;

    this.data = data;

    this.human = human;

    this.kit = kit;

    // ================================
    // VELOCIDADE DIFERENTE
    // HUMANO / BOT
    // ================================

    if (this.human) {

      this.speed =
        data.speed *
        PLAYER_SPEED_MULTIPLIER;

    } else {

      this.speed =
        data.speed *
        PLAYER_SPEED_MULTIPLIER *
        BOT_SPEED_MULTIPLIER;
    }

    this.power = data.power;

    this.lastKick = 0;
  }


  update() {

    if (this.human) {
      this.input();
    } else {
      this.ai();
    }

    this.pos.add(this.vel);

    // =================================
    // PODE ATRAVESSAR O MEIO DO CAMPO
    // =================================

    this.pos.x =
      constrain(
        this.pos.x,
        FIELD_MARGIN + this.radius,
        width -
          FIELD_MARGIN -
          this.radius
      );

    this.pos.y =
      constrain(
        this.pos.y,
        FIELD_MARGIN + this.radius,
        height -
          FIELD_MARGIN -
          this.radius
      );
  }


  // ===================================
  // CONTROLE HUMANO
  // ===================================

  input() {

    this.vel.set(0, 0);

    if (
      keyIsDown(LEFT_ARROW) ||
      keyIsDown(65)
    ) {
      this.vel.x = -this.speed;
    }

    if (
      keyIsDown(RIGHT_ARROW) ||
      keyIsDown(68)
    ) {
      this.vel.x = this.speed;
    }

    if (
      keyIsDown(UP_ARROW) ||
      keyIsDown(87)
    ) {
      this.vel.y = -this.speed;
    }

    if (
      keyIsDown(DOWN_ARROW) ||
      keyIsDown(83)
    ) {
      this.vel.y = this.speed;
    }
  }


  // ===================================
  // IA DO BOT
  // ===================================

  ai() {

    let distancia =
      p5.Vector.dist(
        this.pos,
        ball.pos
      );

    let target;

    // =================================
    // SE ESTÁ LONGE:
    // VAI ATRÁS DA BOLA
    // =================================

    if (distancia > 50) {

      target =
        ball.pos.copy();

    } else {

      // =================================
      // QUANDO CHEGA PERTO,
      // POSICIONA-SE ATRÁS DA BOLA
      // EM DIREÇÃO AO GOL
      // =================================

      target =
        createVector(
          ball.pos.x + 25,
          ball.pos.y
        );
    }

    let direction =
      p5.Vector.sub(
        target,
        this.pos
      );

    if (direction.mag() > 3) {

      direction.normalize();

      // BOT MAIS LENTO
      direction.mult(
        this.speed * 0.85
      );

      this.vel =
        direction;

    } else {

      this.vel.set(0, 0);
    }


    // =================================
    // BOT ESTÁ PERTO DA BOLA
    // =================================

    if (
      distancia <
      this.radius +
      ball.radius +
      25
    ) {

      // =================================
      // O BOT SÓ CHUTA PARA A ESQUERDA
      // POIS O GOL DELE É O ESQUERDO
      // =================================

      let golX =
        FIELD_MARGIN - 10;

      let golY =
        height / 2;

      let chute =
        createVector(
          golX - ball.pos.x,
          golY - ball.pos.y
        );

      // GARANTE QUE O BOT NUNCA
      // CHUTE PARA TRÁS
      if (chute.x > 0) {
        chute.x = -1;
      }

      chute.normalize();

      // CHUTE MAIS FRACO
      ball.vel =
        chute.mult(
          KICK_FORCE +
          this.power * 0.20
        );
    }


    // =================================
    // BOT PERSEGUE A BOLA MESMO
    // NO OUTRO LADO DO CAMPO
    // =================================

    if (
      ball.pos.x < width / 2 &&
      this.pos.x > width / 2
    ) {

      let ataque =
        p5.Vector.sub(
          ball.pos,
          this.pos
        );

      if (ataque.mag() > 5) {

        ataque.normalize();

        // MAIS LENTO
        ataque.mult(
          this.speed * 0.90
        );

        this.vel =
          ataque;
      }
    }


    // =================================
    // SE A BOLA ESTÁ NO CAMPO DO BOT,
    // ELE TAMBÉM VAI ATRÁS DELA
    // =================================

    if (
      ball.pos.x > width / 2
    ) {

      let perseguir =
        p5.Vector.sub(
          ball.pos,
          this.pos
        );

      if (perseguir.mag() > 5) {

        perseguir.normalize();

        perseguir.mult(
          this.speed * 0.85
        );

        this.vel =
          perseguir;
      }
    }
  }


  // ===================================
  // CHUTE DO HUMANO
  // ===================================

  kick() {

    if (kickCooldown > 0) {
      return;
    }

    let dx =
      ball.pos.x -
      this.pos.x;

    let dy =
      ball.pos.y -
      this.pos.y;

    let distancia =
      sqrt(dx * dx + dy * dy);

    if (
      distancia <
      this.radius +
      ball.radius +
      30
    ) {

      let direcao;

      // =================================
      // CHUTA NA DIREÇÃO EM QUE ANDA
      // =================================

      if (this.vel.mag() > 0.1) {

        direcao =
          this.vel.copy();

        direcao.normalize();

      } else {

        // PARADO = DIREÇÃO DO GOL
        direcao =
          createVector(1, 0);
      }


      // =================================
      // O HUMANO SÓ PODE CHUTAR PARA FRENTE
      // =================================

      if (direcao.x < 0) {
        direcao.x = 0.2;
        direcao.normalize();
      }


      // =================================
      // CHUTE MAIS FRACO
      // =================================

      let forca =
        KICK_FORCE +
        this.power * 0.25;

      ball.vel =
        direcao.mult(forca);

      ball.pos.x +=
        direcao.x * 3;

      ball.pos.y +=
        direcao.y * 3;

      kickCooldown =
        KICK_COOLDOWN;
    }
  }


  // ===================================
  // COLISÃO COM A BOLA
  // ===================================

  checkCollision(b) {

    let dx =
      b.pos.x -
      this.pos.x;

    let dy =
      b.pos.y -
      this.pos.y;

    let distancia =
      sqrt(dx * dx + dy * dy);

    let distanciaMinima =
      this.radius +
      b.radius;

    if (
      distancia > 0 &&
      distancia < distanciaMinima
    ) {

      let nx =
        dx / distancia;

      let ny =
        dy / distancia;

      let velocidadeNormal =
        b.vel.x * nx +
        b.vel.y * ny;

      let forca =
        this.power * 0.35;

      if (
        velocidadeNormal < forca
      ) {

        let impulso =
          forca -
          velocidadeNormal;

        b.vel.x +=
          nx * impulso;

        b.vel.y +=
          ny * impulso;
      }

      b.vel.limit(9);

      let sobreposicao =
        distanciaMinima -
        distancia;

      if (sobreposicao > 0) {

        b.pos.x +=
          nx * sobreposicao;

        b.pos.y +=
          ny * sobreposicao;
      }
    }
  }


  // ===================================
  // DESENHAR JOGADOR
  // ===================================

  display() {

    push();

    translate(
      this.pos.x,
      this.pos.y
    );

    fill(this.kit.socks);

    stroke(0);

    ellipse(-10, 18, 9, 13);
    ellipse(10, 18, 9, 13);

    fill(20);

    ellipse(-10, 24, 10, 6);
    ellipse(10, 24, 10, 6);

    fill(this.kit.shorts);

    rect(-18, 2, 36, 14, 4);

    fill(this.kit.shirt);

    rect(-20, -18, 40, 23, 5);

    rect(-25, -17, 8, 13, 3);
    rect(17, -17, 8, 13, 3);

    fill(240, 190, 150);

    noStroke();

    ellipse(0, -27, 22);

    pop();
  }
}


// =====================================
// BOLA
// =====================================

class Ball {

  constructor(x, y) {

    this.pos =
      createVector(x, y);

    this.vel =
      createVector(0, 0);

    this.radius = 11;

    this.friction = 0.985;

    this.angle = 0;

    this.stuckFrames = 0;
  }


  update() {

    this.pos.add(this.vel);

    this.vel.mult(this.friction);

    this.angle +=
      this.vel.mag() * 0.1;

    this.checkWalls();


    // =================================
    // SE A BOLA ESTIVER QUASE PARADA
    // NÃO DEIXA FICAR PRESA
    // =================================

    if (this.vel.mag() < 0.15) {
      this.stuckFrames++;
    } else {
      this.stuckFrames = 0;
    }


    if (this.stuckFrames > 35) {

      // Dá um pequeno impulso para dentro
      // do campo, evitando ficar presa
      // na parede.

      if (
        this.pos.x <
        FIELD_MARGIN + 25
      ) {

        this.vel.x = 1.8;

      } else if (
        this.pos.x >
        width -
        FIELD_MARGIN -
        25
      ) {

        this.vel.x = -1.8;

      } else {

        this.vel.x =
          random(-1.5, 1.5);
      }

      this.vel.y =
        random(-1.2, 1.2);

      this.stuckFrames = 0;
    }

    this.vel.limit(9);
  }


  // ===================================
  // PAREDES
  // ===================================

  checkWalls() {

    let goalTop =
      height / 2 -
      GOAL_SIZE / 2;

    let goalBottom =
      height / 2 +
      GOAL_SIZE / 2;


    // =================================
    // GOL ESQUERDO
    // =================================

    if (
      this.pos.x <
        FIELD_MARGIN - 10 &&
      this.pos.y > goalTop &&
      this.pos.y < goalBottom
    ) {

      botScore++;

      finishPoint("left");

      return;
    }


    // =================================
    // GOL DIREITO
    // =================================

    if (
      this.pos.x >
        width -
        FIELD_MARGIN +
        10 &&
      this.pos.y > goalTop &&
      this.pos.y < goalBottom
    ) {

      playerScore++;

      finishPoint("right");

      return;
    }


    // =================================
    // BORDA DE CIMA
    // =================================

    if (
      this.pos.y -
      this.radius <
      FIELD_MARGIN
    ) {

      this.pos.y =
        FIELD_MARGIN +
        this.radius;

      if (this.vel.y < 0) {

        this.vel.y =
          abs(this.vel.y) * 0.9;
      }
    }


    // =================================
    // BORDA DE BAIXO
    // =================================

    if (
      this.pos.y +
      this.radius >
      height -
      FIELD_MARGIN
    ) {

      this.pos.y =
        height -
        FIELD_MARGIN -
        this.radius;

      if (this.vel.y > 0) {

        this.vel.y =
          -abs(this.vel.y) * 0.9;
      }
    }


    // =================================
    // BORDA ESQUERDA
    // =================================

    if (
      this.pos.y < goalTop ||
      this.pos.y > goalBottom
    ) {

      if (
        this.pos.x -
        this.radius <
        FIELD_MARGIN
      ) {

        this.pos.x =
          FIELD_MARGIN +
          this.radius;

        if (this.vel.x < 0) {

          this.vel.x =
            abs(this.vel.x) * 0.9;
        }
      }


      // =================================
      // BORDA DIREITA
      // =================================

      if (
        this.pos.x +
        this.radius >
        width -
        FIELD_MARGIN
      ) {

        this.pos.x =
          width -
          FIELD_MARGIN -
          this.radius;

        if (this.vel.x > 0) {

          this.vel.x =
            -abs(this.vel.x) * 0.9;
        }
      }
    }


    // =================================
    // PROTEÇÃO CONTRA BOLA PRESA
    // =================================

    if (
      this.pos.x <=
      FIELD_MARGIN +
      this.radius + 2
    ) {

      if (this.vel.x <= 0) {
        this.vel.x = 1.5;
      }
    }

    if (
      this.pos.x >=
      width -
      FIELD_MARGIN -
      this.radius - 2
    ) {

      if (this.vel.x >= 0) {
        this.vel.x = -1.5;
      }
    }
  }


  // ===================================
  // DESENHAR BOLA
  // ===================================

  display() {

    push();

    translate(
      this.pos.x,
      this.pos.y
    );

    rotate(this.angle);

    fill(0, 0, 0, 60);

    noStroke();

    ellipse(
      3,
      3,
      this.radius * 2
    );

    fill(255);

    stroke(0);
    strokeWeight(2);

    ellipse(
      0,
      0,
      this.radius * 2
    );

    fill(0);
    noStroke();

    ellipse(0, 0, 5);

    stroke(0);

    line(-8, 0, 8, 0);
    line(0, -8, 0, 8);

    pop();
  }
}
