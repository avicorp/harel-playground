// ── Canvas & Context ─────────────────────────────────────────────
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// ── Audio (single shared context) ────────────────────────────────
let audioCtx = null;
function getAudioCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}

function playBeep(frequency, duration, type = 'square', volume = 0.1) {
  if (muted) return;
  try {
    const ac = getAudioCtx();
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.frequency.value = frequency;
    osc.type = type;
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.start();
    gain.gain.setValueAtTime(volume, ac.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + duration);
    osc.stop(ac.currentTime + duration);
  } catch (_) {}
}

function playExplosion() {
  playBeep(120, 0.3, 'sawtooth', 0.15);
  setTimeout(() => playBeep(80, 0.2, 'square', 0.08), 50);
}

function playPowerUp() {
  playBeep(500, 0.08, 'sine', 0.12);
  setTimeout(() => playBeep(700, 0.08, 'sine', 0.12), 80);
  setTimeout(() => playBeep(900, 0.12, 'sine', 0.12), 160);
}

function playLevelUp() {
  playBeep(400, 0.1, 'sine', 0.12);
  setTimeout(() => playBeep(500, 0.1, 'sine', 0.12), 100);
  setTimeout(() => playBeep(600, 0.1, 'sine', 0.12), 200);
  setTimeout(() => playBeep(800, 0.15, 'sine', 0.15), 300);
}

// ── Game State ───────────────────────────────────────────────────
let player = {
  x: 380, y: 540, w: 40, h: 40,
  color: 'cyan',
  speed: 300,
  lives: 3,
  maxLives: 5,
  invincible: false,
  invincibleTimer: 0,
  weapon: 'single',      // single, double, triple, spread, rapid
  weaponTimer: 0,         // countdown for weapon powerup
  fireRate: 250,          // ms between shots
  lastShot: 0
};

const bullets = [];
const enemies = [];
const enemyBullets = [];
const powerUps = [];
const stars = [];
const particles = [];
const damageNumbers = [];

let lastEnemySpawn = 0;
let lastPowerUpSpawn = 0;
let lastStarSpawn = 0;
let score = 0;
let highScore = parseInt(localStorage.getItem('spaceShooterHighScore') || '0');
let running = false;
let paused = false;
let gameOver = false;
let muted = false;
let level = 1;
let enemiesKilled = 0;
let enemiesForNextLevel = 15;
let screenShake = 0;
let comboCount = 0;
let comboTimer = 0;
let levelUpDisplay = 0;

// ── Key State Tracking (smooth movement) ─────────────────────────
const keys = {};
window.addEventListener('keydown', e => {
  keys[e.key] = true;
  if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'ArrowDown' ||
      e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
    e.preventDefault();
  }
  if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') {
    if (running && !gameOver) togglePause();
  }
});
window.addEventListener('keyup', e => { keys[e.key] = false; });

// ── Enemy Types ──────────────────────────────────────────────────
const ENEMY_TYPES = {
  basic: { color: '#ff4444', speed: 100, points: 10, hp: 1, w: 36, h: 36, shape: 'basic' },
  fast: { color: '#44ff44', speed: 200, points: 20, hp: 1, w: 30, h: 30, shape: 'fast' },
  tank: { color: '#ff8800', speed: 60, points: 30, hp: 3, w: 44, h: 44, shape: 'tank' },
  zigzag: { color: '#ff44ff', speed: 120, points: 25, hp: 2, w: 34, h: 34, shape: 'zigzag' },
  shooter: { color: '#44ffff', speed: 80, points: 35, hp: 2, w: 38, h: 38, shape: 'shooter' },
  boss: { color: '#ff0000', speed: 30, points: 200, hp: 20, w: 80, h: 60, shape: 'boss' }
};

// ── Power-Up Types ───────────────────────────────────────────────
const POWERUP_TYPES = [
  { type: 'double', color: '#00ffff', label: 'D', desc: 'Double Shot' },
  { type: 'triple', color: '#ff00ff', label: 'T', desc: 'Triple Shot' },
  { type: 'spread', color: '#ffaa00', label: 'S', desc: 'Spread Shot' },
  { type: 'rapid', color: '#ff4444', label: 'R', desc: 'Rapid Fire' },
  { type: 'heal', color: '#44ff44', label: '+', desc: 'Extra Life' },
  { type: 'shield', color: '#8888ff', label: 'I', desc: 'Shield' },
  { type: 'score', color: '#ffff00', label: '$', desc: '+100 Points' }
];

// ── Spawning ─────────────────────────────────────────────────────
function getEnemySpawnRate() {
  return Math.max(300, 1000 - (level - 1) * 80);
}

function getEnemyTypesForLevel() {
  const types = ['basic'];
  if (level >= 2) types.push('fast');
  if (level >= 3) types.push('zigzag');
  if (level >= 4) types.push('tank');
  if (level >= 5) types.push('shooter');
  return types;
}

function spawnEnemy() {
  const availableTypes = getEnemyTypesForLevel();
  const typeName = availableTypes[Math.floor(Math.random() * availableTypes.length)];
  const type = ENEMY_TYPES[typeName];
  const e = {
    x: Math.random() * (canvas.width - type.w),
    y: -type.h,
    w: type.w,
    h: type.h,
    color: type.color,
    speed: type.speed + (level - 1) * 8,
    points: type.points,
    hp: type.hp,
    maxHp: type.hp,
    shape: type.shape,
    spawnTime: performance.now(),
    lastShot: 0
  };
  if (typeName === 'zigzag') {
    e.zigzagPhase = Math.random() * Math.PI * 2;
    e.zigzagAmplitude = 80 + Math.random() * 60;
    e.baseX = e.x;
  }
  enemies.push(e);
}

function spawnBoss() {
  const type = ENEMY_TYPES.boss;
  const boss = {
    x: canvas.width / 2 - type.w / 2,
    y: -type.h,
    w: type.w,
    h: type.h,
    color: type.color,
    speed: type.speed,
    points: type.points + level * 50,
    hp: type.hp + (level - 1) * 5,
    maxHp: type.hp + (level - 1) * 5,
    shape: type.shape,
    spawnTime: performance.now(),
    lastShot: 0,
    isBoss: true,
    moveDir: 1
  };
  enemies.push(boss);
  screenShake = 10;
  playBeep(60, 0.5, 'sawtooth', 0.2);
}

function spawnPowerUp() {
  const type = POWERUP_TYPES[Math.floor(Math.random() * POWERUP_TYPES.length)];
  powerUps.push({
    x: Math.random() * (canvas.width - 24),
    y: -24,
    w: 24, h: 24,
    color: type.color,
    type: type.type,
    label: type.label,
    desc: type.desc,
    speed: 80,
    bobPhase: Math.random() * Math.PI * 2
  });
}

function spawnStar() {
  stars.push({
    x: Math.random() * canvas.width,
    y: -2,
    size: Math.random() * 2.5 + 0.5,
    speed: 20 + Math.random() * 40,
    brightness: 0.3 + Math.random() * 0.7
  });
}

// ── Particles ────────────────────────────────────────────────────
function spawnExplosion(x, y, color, count = 12) {
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
    const speed = 80 + Math.random() * 160;
    particles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 0.4 + Math.random() * 0.4,
      maxLife: 0.4 + Math.random() * 0.4,
      color,
      size: 2 + Math.random() * 3
    });
  }
}

function spawnHitSpark(x, y) {
  for (let i = 0; i < 5; i++) {
    particles.push({
      x, y,
      vx: (Math.random() - 0.5) * 200,
      vy: (Math.random() - 0.5) * 200,
      life: 0.15 + Math.random() * 0.15,
      maxLife: 0.2,
      color: '#ffffff',
      size: 1.5 + Math.random() * 1.5
    });
  }
}

function spawnDamageNumber(x, y, value, color = '#ffffff') {
  damageNumbers.push({
    x, y, value: String(value), color,
    life: 0.8,
    vy: -60
  });
}

// ── Shooting ─────────────────────────────────────────────────────
function shoot() {
  const now = performance.now();
  let rate = player.fireRate;
  if (player.weapon === 'rapid') rate = 100;
  if (now - player.lastShot < rate) return;
  player.lastShot = now;

  const bx = player.x + player.w / 2;
  const by = player.y;
  const bSpeed = 500;

  switch (player.weapon) {
    case 'single':
      bullets.push({ x: bx - 3, y: by, w: 6, h: 14, color: '#00ff88', vy: -bSpeed, vx: 0 });
      break;
    case 'double':
      bullets.push({ x: bx - 12, y: by + 4, w: 6, h: 14, color: '#00ffff', vy: -bSpeed, vx: 0 });
      bullets.push({ x: bx + 6, y: by + 4, w: 6, h: 14, color: '#00ffff', vy: -bSpeed, vx: 0 });
      break;
    case 'triple':
      bullets.push({ x: bx - 3, y: by, w: 6, h: 14, color: '#ff00ff', vy: -bSpeed, vx: 0 });
      bullets.push({ x: bx - 16, y: by + 8, w: 6, h: 14, color: '#ff00ff', vy: -bSpeed, vx: -40 });
      bullets.push({ x: bx + 10, y: by + 8, w: 6, h: 14, color: '#ff00ff', vy: -bSpeed, vx: 40 });
      break;
    case 'spread':
      for (let a = -2; a <= 2; a++) {
        bullets.push({
          x: bx - 3, y: by, w: 5, h: 12,
          color: '#ffaa00',
          vy: -bSpeed,
          vx: a * 60
        });
      }
      break;
    case 'rapid':
      bullets.push({ x: bx - 3, y: by, w: 5, h: 10, color: '#ff4444', vy: -bSpeed * 1.2, vx: 0 });
      break;
  }
  playBeep(700, 0.04, 'square', 0.06);
}

function enemyShoot(e) {
  const dx = player.x + player.w / 2 - (e.x + e.w / 2);
  const dy = player.y + player.h / 2 - (e.y + e.h / 2);
  const dist = Math.sqrt(dx * dx + dy * dy);
  const speed = 180;
  enemyBullets.push({
    x: e.x + e.w / 2 - 3,
    y: e.y + e.h,
    w: 6, h: 6,
    color: '#ff6666',
    vx: (dx / dist) * speed,
    vy: (dy / dist) * speed
  });
  playBeep(200, 0.06, 'sawtooth', 0.04);
}

// ── Update ───────────────────────────────────────────────────────
function update(delta) {
  if (paused || gameOver) return;

  const now = performance.now();

  // ── Screen shake decay
  if (screenShake > 0) screenShake *= 0.9;
  if (screenShake < 0.3) screenShake = 0;

  // ── Combo timer
  if (comboTimer > 0) {
    comboTimer -= delta;
    if (comboTimer <= 0) { comboCount = 0; comboTimer = 0; }
  }

  // ── Level-up display
  if (levelUpDisplay > 0) levelUpDisplay -= delta;

  // ── Player weapon timer
  if (player.weaponTimer > 0) {
    player.weaponTimer -= delta;
    if (player.weaponTimer <= 0) {
      player.weapon = 'single';
      player.weaponTimer = 0;
    }
  }

  // ── Invincibility
  if (player.invincible) {
    player.invincibleTimer -= delta;
    if (player.invincibleTimer <= 0) {
      player.invincible = false;
    }
  }

  // ── Player movement (smooth, bounded)
  if (keys['ArrowLeft'] || keys['a'] || keys['A']) {
    player.x -= player.speed * delta;
  }
  if (keys['ArrowRight'] || keys['d'] || keys['D']) {
    player.x += player.speed * delta;
  }
  if (keys['ArrowUp'] || keys['w'] || keys['W']) {
    player.y -= player.speed * delta;
  }
  if (keys['ArrowDown'] || keys['s'] || keys['S']) {
    player.y += player.speed * delta;
  }
  // Clamp to canvas
  player.x = Math.max(0, Math.min(canvas.width - player.w, player.x));
  player.y = Math.max(canvas.height * 0.3, Math.min(canvas.height - player.h, player.y));

  // ── Auto-fire while holding space
  if (keys[' ']) shoot();

  // ── Stars
  for (const s of stars) s.y += s.speed * delta;
  while (stars.length && stars[0].y > canvas.height + 5) stars.shift();

  // ── Player bullets
  for (const b of bullets) {
    b.y += b.vy * delta;
    b.x += (b.vx || 0) * delta;
  }
  for (let i = bullets.length - 1; i >= 0; i--) {
    const b = bullets[i];
    if (b.y < -20 || b.x < -20 || b.x > canvas.width + 20) bullets.splice(i, 1);
  }

  // ── Enemy bullets
  for (const eb of enemyBullets) {
    eb.x += eb.vx * delta;
    eb.y += eb.vy * delta;
  }
  for (let i = enemyBullets.length - 1; i >= 0; i--) {
    const eb = enemyBullets[i];
    if (eb.y > canvas.height + 10 || eb.y < -10 || eb.x < -10 || eb.x > canvas.width + 10) {
      enemyBullets.splice(i, 1);
    }
  }

  // ── Enemy bullets hit player
  if (!player.invincible) {
    for (let i = enemyBullets.length - 1; i >= 0; i--) {
      if (rectsOverlap(enemyBullets[i], player)) {
        enemyBullets.splice(i, 1);
        hitPlayer();
        break;
      }
    }
  }

  // ── Enemies
  for (const e of enemies) {
    e.y += e.speed * delta;

    if (e.shape === 'zigzag') {
      e.zigzagPhase += delta * 3;
      e.x = e.baseX + Math.sin(e.zigzagPhase) * e.zigzagAmplitude;
      e.x = Math.max(0, Math.min(canvas.width - e.w, e.x));
    }

    if (e.isBoss) {
      if (e.y > 30) e.y = 30;
      e.x += e.moveDir * 80 * delta;
      if (e.x <= 0 || e.x >= canvas.width - e.w) e.moveDir *= -1;
      // Boss shoots frequently
      if (now - e.lastShot > 600) {
        enemyShoot(e);
        e.lastShot = now;
      }
    }

    // Shooter enemies fire at player
    if (e.shape === 'shooter' && now - e.lastShot > 2000) {
      enemyShoot(e);
      e.lastShot = now;
    }
  }

  // Remove off-screen enemies
  for (let i = enemies.length - 1; i >= 0; i--) {
    if (enemies[i].y > canvas.height + 60) enemies.splice(i, 1);
  }

  // ── Enemy-player collision
  if (!player.invincible) {
    for (let i = enemies.length - 1; i >= 0; i--) {
      if (rectsOverlap(enemies[i], player)) {
        spawnExplosion(enemies[i].x + enemies[i].w / 2, enemies[i].y + enemies[i].h / 2, enemies[i].color, 8);
        if (!enemies[i].isBoss) enemies.splice(i, 1);
        hitPlayer();
        break;
      }
    }
  }

  // ── Bullet-enemy collision
  for (let i = enemies.length - 1; i >= 0; i--) {
    const e = enemies[i];
    for (let j = bullets.length - 1; j >= 0; j--) {
      const b = bullets[j];
      if (rectsOverlap(e, b)) {
        bullets.splice(j, 1);
        spawnHitSpark(b.x + b.w / 2, b.y);
        e.hp--;
        if (e.hp <= 0) {
          // Killed
          comboCount++;
          comboTimer = 1.5;
          const comboMult = Math.min(comboCount, 5);
          const pts = e.points * comboMult;
          score += pts;
          enemiesKilled++;
          spawnExplosion(e.x + e.w / 2, e.y + e.h / 2, e.color, e.isBoss ? 30 : 14);
          spawnDamageNumber(e.x + e.w / 2, e.y, '+' + pts, comboMult > 1 ? '#ffff00' : '#ffffff');
          if (e.isBoss) {
            screenShake = 15;
            playExplosion();
            // Boss drops powerup
            powerUps.push({
              x: e.x + e.w / 2 - 12, y: e.y + e.h / 2,
              w: 24, h: 24,
              color: '#ff00ff', type: 'triple', label: 'T', desc: 'Triple Shot',
              speed: 80, bobPhase: 0
            });
          } else {
            playBeep(350, 0.12, 'square', 0.08);
          }
          enemies.splice(i, 1);

          // ── Level progression
          if (enemiesKilled >= enemiesForNextLevel) {
            levelUp();
          }
        } else {
          playBeep(250, 0.05, 'square', 0.05);
          spawnDamageNumber(e.x + e.w / 2, e.y, '1', '#ffaa44');
        }
        break;
      }
    }
  }

  // ── Powerup collection
  for (let i = powerUps.length - 1; i >= 0; i--) {
    const p = powerUps[i];
    p.y += p.speed * delta;
    p.bobPhase += delta * 4;
    if (rectsOverlap(p, player)) {
      applyPowerUp(p);
      powerUps.splice(i, 1);
    } else if (p.y > canvas.height + 30) {
      powerUps.splice(i, 1);
    }
  }

  // ── Particles
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx * delta;
    p.y += p.vy * delta;
    p.life -= delta;
    p.vx *= 0.97;
    p.vy *= 0.97;
    if (p.life <= 0) particles.splice(i, 1);
  }

  // ── Damage numbers
  for (let i = damageNumbers.length - 1; i >= 0; i--) {
    const d = damageNumbers[i];
    d.y += d.vy * delta;
    d.life -= delta;
    if (d.life <= 0) damageNumbers.splice(i, 1);
  }

  // ── Spawners
  if (now - lastEnemySpawn > getEnemySpawnRate()) {
    spawnEnemy();
    lastEnemySpawn = now;
  }

  if (now - lastPowerUpSpawn > 6000) {
    spawnPowerUp();
    lastPowerUpSpawn = now;
  }

  if (now - lastStarSpawn > 150) {
    spawnStar();
    lastStarSpawn = now;
  }
}

// ── Player Hit ───────────────────────────────────────────────────
function hitPlayer() {
  player.lives--;
  screenShake = 12;
  playExplosion();
  spawnExplosion(player.x + player.w / 2, player.y + player.h / 2, player.color, 10);

  if (player.lives <= 0) {
    endGame();
  } else {
    player.invincible = true;
    player.invincibleTimer = 2;
  }
}

function applyPowerUp(p) {
  playPowerUp();
  spawnDamageNumber(p.x, p.y, p.desc, p.color);
  switch (p.type) {
    case 'double':
    case 'triple':
    case 'spread':
    case 'rapid':
      player.weapon = p.type;
      player.weaponTimer = 10;
      break;
    case 'heal':
      player.lives = Math.min(player.lives + 1, player.maxLives);
      break;
    case 'shield':
      player.invincible = true;
      player.invincibleTimer = 5;
      break;
    case 'score':
      score += 100;
      break;
  }
}

function levelUp() {
  level++;
  enemiesKilled = 0;
  enemiesForNextLevel = 15 + level * 5;
  levelUpDisplay = 2.5;
  playLevelUp();

  // Spawn boss every 3 levels
  if (level % 3 === 0) {
    setTimeout(() => { if (running && !gameOver) spawnBoss(); }, 1500);
  }
}

// ── Game Over / Restart ──────────────────────────────────────────
function endGame() {
  gameOver = true;
  running = false;
  if (score > highScore) {
    highScore = score;
    localStorage.setItem('spaceShooterHighScore', String(highScore));
  }
  showGameOverScreen();
}

function showGameOverScreen() {
  const el = document.getElementById('gameover-screen');
  document.getElementById('final-score').textContent = score;
  document.getElementById('high-score').textContent = highScore;
  document.getElementById('final-level').textContent = level;
  if (score >= highScore && score > 0) {
    document.getElementById('new-highscore').style.display = 'block';
  } else {
    document.getElementById('new-highscore').style.display = 'none';
  }
  el.style.display = 'flex';
}

function restartGame() {
  document.getElementById('gameover-screen').style.display = 'none';
  // Reset state
  player.x = 380; player.y = 540;
  player.lives = 3;
  player.invincible = false;
  player.invincibleTimer = 0;
  player.weapon = 'single';
  player.weaponTimer = 0;
  player.lastShot = 0;
  bullets.length = 0;
  enemies.length = 0;
  enemyBullets.length = 0;
  powerUps.length = 0;
  particles.length = 0;
  damageNumbers.length = 0;
  score = 0;
  level = 1;
  enemiesKilled = 0;
  enemiesForNextLevel = 15;
  screenShake = 0;
  comboCount = 0;
  comboTimer = 0;
  levelUpDisplay = 0;
  gameOver = false;
  running = true;
  paused = false;
  lastTime = performance.now();
  lastEnemySpawn = performance.now();
  lastPowerUpSpawn = performance.now();
  lastStarSpawn = performance.now();
  requestAnimationFrame(gameLoop);
}

function togglePause() {
  paused = !paused;
  document.getElementById('pause-overlay').style.display = paused ? 'flex' : 'none';
  if (!paused) {
    lastTime = performance.now();
  }
}

// ── Drawing ──────────────────────────────────────────────────────
function draw() {
  ctx.save();
  // Screen shake offset
  if (screenShake > 0) {
    const sx = (Math.random() - 0.5) * screenShake;
    const sy = (Math.random() - 0.5) * screenShake;
    ctx.translate(sx, sy);
  }

  ctx.clearRect(-10, -10, canvas.width + 20, canvas.height + 20);

  // ── Stars
  for (const s of stars) {
    ctx.globalAlpha = s.brightness;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(s.x, s.y, s.size, s.size);
  }
  ctx.globalAlpha = 1;

  // ── Power-ups
  for (const p of powerUps) {
    const bob = Math.sin(p.bobPhase) * 3;
    ctx.save();
    ctx.translate(p.x + p.w / 2, p.y + p.h / 2 + bob);
    // Outer glow
    ctx.shadowColor = p.color;
    ctx.shadowBlur = 10;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.roundRect(-p.w / 2, -p.h / 2, p.w, p.h, 5);
    ctx.fill();
    ctx.shadowBlur = 0;
    // Label
    ctx.fillStyle = '#000';
    ctx.font = 'bold 14px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(p.label, 0, 1);
    ctx.restore();
  }

  // ── Enemies
  for (const e of enemies) {
    drawEnemy(e);
  }

  // ── Enemy bullets
  for (const eb of enemyBullets) {
    ctx.fillStyle = eb.color;
    ctx.shadowColor = '#ff0000';
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.arc(eb.x + eb.w / 2, eb.y + eb.h / 2, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  // ── Player bullets
  for (const b of bullets) {
    ctx.fillStyle = b.color;
    ctx.shadowColor = b.color;
    ctx.shadowBlur = 8;
    ctx.fillRect(b.x, b.y, b.w, b.h);
    ctx.shadowBlur = 0;
  }

  // ── Player
  if (!player.invincible || Math.floor(performance.now() / 80) % 2 === 0) {
    drawPlayer();
  }

  // ── Particles
  for (const p of particles) {
    const alpha = Math.max(0, p.life / p.maxLife);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
  }
  ctx.globalAlpha = 1;

  // ── Damage numbers
  for (const d of damageNumbers) {
    ctx.globalAlpha = Math.max(0, d.life / 0.8);
    ctx.fillStyle = d.color;
    ctx.font = 'bold 14px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(d.value, d.x, d.y);
  }
  ctx.globalAlpha = 1;

  ctx.restore();

  // ── HUD (drawn without shake) ──
  drawHUD();
}

function drawPlayer() {
  const cx = player.x + player.w / 2;
  const cy = player.y + player.h / 2;

  // Engine glow
  ctx.fillStyle = '#ff8800';
  ctx.shadowColor = '#ff4400';
  ctx.shadowBlur = 12;
  ctx.beginPath();
  ctx.moveTo(cx - 8, player.y + player.h);
  ctx.lineTo(cx, player.y + player.h + 10 + Math.random() * 6);
  ctx.lineTo(cx + 8, player.y + player.h);
  ctx.fill();
  ctx.shadowBlur = 0;

  // Ship body
  ctx.fillStyle = player.color;
  ctx.shadowColor = player.color;
  ctx.shadowBlur = 8;
  ctx.beginPath();
  // Nose
  ctx.moveTo(cx, player.y);
  // Right wing
  ctx.lineTo(cx + player.w / 2, player.y + player.h * 0.7);
  ctx.lineTo(cx + player.w / 2 + 5, player.y + player.h);
  ctx.lineTo(cx + 4, player.y + player.h * 0.8);
  // Bottom center
  ctx.lineTo(cx, player.y + player.h * 0.9);
  // Left side (mirror)
  ctx.lineTo(cx - 4, player.y + player.h * 0.8);
  ctx.lineTo(cx - player.w / 2 - 5, player.y + player.h);
  ctx.lineTo(cx - player.w / 2, player.y + player.h * 0.7);
  ctx.closePath();
  ctx.fill();
  ctx.shadowBlur = 0;

  // Cockpit
  ctx.fillStyle = '#ffffff';
  ctx.globalAlpha = 0.6;
  ctx.beginPath();
  ctx.ellipse(cx, player.y + player.h * 0.4, 4, 8, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  // Shield indicator
  if (player.invincible) {
    ctx.strokeStyle = '#8888ff';
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.4 + Math.sin(performance.now() / 100) * 0.3;
    ctx.beginPath();
    ctx.arc(cx, cy, player.w / 2 + 8, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }
}

function drawEnemy(e) {
  const cx = e.x + e.w / 2;
  const cy = e.y + e.h / 2;

  ctx.fillStyle = e.color;
  ctx.shadowColor = e.color;
  ctx.shadowBlur = 6;

  switch (e.shape) {
    case 'basic':
      // Simple invader shape
      ctx.beginPath();
      ctx.moveTo(cx, e.y);
      ctx.lineTo(cx + e.w / 2, e.y + e.h * 0.5);
      ctx.lineTo(cx + e.w / 2 - 4, e.y + e.h);
      ctx.lineTo(cx - e.w / 2 + 4, e.y + e.h);
      ctx.lineTo(cx - e.w / 2, e.y + e.h * 0.5);
      ctx.closePath();
      ctx.fill();
      break;

    case 'fast':
      // Arrow/dart shape
      ctx.beginPath();
      ctx.moveTo(cx, e.y);
      ctx.lineTo(cx + e.w / 2, e.y + e.h);
      ctx.lineTo(cx, e.y + e.h * 0.7);
      ctx.lineTo(cx - e.w / 2, e.y + e.h);
      ctx.closePath();
      ctx.fill();
      break;

    case 'tank':
      // Chunky hexagonal shape
      ctx.beginPath();
      ctx.moveTo(cx - e.w * 0.3, e.y);
      ctx.lineTo(cx + e.w * 0.3, e.y);
      ctx.lineTo(cx + e.w / 2, e.y + e.h * 0.3);
      ctx.lineTo(cx + e.w / 2, e.y + e.h * 0.7);
      ctx.lineTo(cx + e.w * 0.3, e.y + e.h);
      ctx.lineTo(cx - e.w * 0.3, e.y + e.h);
      ctx.lineTo(cx - e.w / 2, e.y + e.h * 0.7);
      ctx.lineTo(cx - e.w / 2, e.y + e.h * 0.3);
      ctx.closePath();
      ctx.fill();
      break;

    case 'zigzag':
      // Diamond shape
      ctx.beginPath();
      ctx.moveTo(cx, e.y);
      ctx.lineTo(cx + e.w / 2, cy);
      ctx.lineTo(cx, e.y + e.h);
      ctx.lineTo(cx - e.w / 2, cy);
      ctx.closePath();
      ctx.fill();
      break;

    case 'shooter':
      // Ship-like (faces downward)
      ctx.beginPath();
      ctx.moveTo(cx - e.w / 2, e.y);
      ctx.lineTo(cx + e.w / 2, e.y);
      ctx.lineTo(cx + e.w * 0.3, e.y + e.h * 0.6);
      ctx.lineTo(cx, e.y + e.h);
      ctx.lineTo(cx - e.w * 0.3, e.y + e.h * 0.6);
      ctx.closePath();
      ctx.fill();
      // Cannon indicator
      ctx.fillStyle = '#ffffff';
      ctx.globalAlpha = 0.5;
      ctx.beginPath();
      ctx.arc(cx, e.y + e.h * 0.65, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
      break;

    case 'boss':
      // Large menacing shape
      ctx.beginPath();
      ctx.moveTo(cx - e.w / 2, e.y + 10);
      ctx.lineTo(cx - e.w * 0.3, e.y);
      ctx.lineTo(cx + e.w * 0.3, e.y);
      ctx.lineTo(cx + e.w / 2, e.y + 10);
      ctx.lineTo(cx + e.w / 2, e.y + e.h * 0.7);
      ctx.lineTo(cx + e.w * 0.3, e.y + e.h);
      ctx.lineTo(cx + 6, e.y + e.h * 0.8);
      ctx.lineTo(cx, e.y + e.h);
      ctx.lineTo(cx - 6, e.y + e.h * 0.8);
      ctx.lineTo(cx - e.w * 0.3, e.y + e.h);
      ctx.lineTo(cx - e.w / 2, e.y + e.h * 0.7);
      ctx.closePath();
      ctx.fill();
      // Boss eyes
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(cx - 12, e.y + e.h * 0.35, 5, 0, Math.PI * 2);
      ctx.arc(cx + 12, e.y + e.h * 0.35, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(cx - 12, e.y + e.h * 0.35, 2.5, 0, Math.PI * 2);
      ctx.arc(cx + 12, e.y + e.h * 0.35, 2.5, 0, Math.PI * 2);
      ctx.fill();
      break;
  }

  ctx.shadowBlur = 0;

  // Health bar for multi-hp enemies
  if (e.maxHp > 1) {
    const barW = e.w;
    const barH = 4;
    const barX = e.x;
    const barY = e.y - 8;
    ctx.fillStyle = '#333';
    ctx.fillRect(barX, barY, barW, barH);
    ctx.fillStyle = e.hp / e.maxHp > 0.3 ? '#44ff44' : '#ff4444';
    ctx.fillRect(barX, barY, barW * (e.hp / e.maxHp), barH);
  }
}

function drawHUD() {
  // ── Score
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 18px monospace';
  ctx.textAlign = 'left';
  ctx.fillText('Score: ' + score, 12, 28);

  // ── High Score
  ctx.fillStyle = '#888888';
  ctx.font = '12px monospace';
  ctx.fillText('Best: ' + highScore, 12, 46);

  // ── Level
  ctx.fillStyle = '#ffcc00';
  ctx.font = 'bold 16px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('Level ' + level, canvas.width / 2, 28);

  // Level progress bar
  const progW = 100;
  const progH = 4;
  const progX = canvas.width / 2 - progW / 2;
  const progY = 34;
  ctx.fillStyle = '#333';
  ctx.fillRect(progX, progY, progW, progH);
  ctx.fillStyle = '#ffcc00';
  ctx.fillRect(progX, progY, progW * (enemiesKilled / enemiesForNextLevel), progH);

  // ── Lives
  ctx.textAlign = 'right';
  for (let i = 0; i < player.lives; i++) {
    const hx = canvas.width - 16 - i * 22;
    const hy = 14;
    ctx.fillStyle = player.color;
    ctx.beginPath();
    ctx.moveTo(hx, hy - 6);
    ctx.lineTo(hx + 7, hy + 3);
    ctx.lineTo(hx, hy + 8);
    ctx.lineTo(hx - 7, hy + 3);
    ctx.closePath();
    ctx.fill();
  }

  // ── Weapon indicator
  if (player.weapon !== 'single') {
    const weaponNames = {
      double: 'DOUBLE', triple: 'TRIPLE', spread: 'SPREAD', rapid: 'RAPID'
    };
    const weaponColors = {
      double: '#00ffff', triple: '#ff00ff', spread: '#ffaa00', rapid: '#ff4444'
    };
    ctx.fillStyle = weaponColors[player.weapon] || '#fff';
    ctx.font = 'bold 13px monospace';
    ctx.textAlign = 'right';
    ctx.fillText(weaponNames[player.weapon] + ' ' + Math.ceil(player.weaponTimer) + 's', canvas.width - 12, 40);
  }

  // ── Combo display
  if (comboCount > 1 && comboTimer > 0) {
    ctx.fillStyle = '#ffff00';
    ctx.font = 'bold 16px monospace';
    ctx.textAlign = 'center';
    ctx.globalAlpha = Math.min(1, comboTimer);
    ctx.fillText('COMBO x' + Math.min(comboCount, 5), canvas.width / 2, canvas.height - 20);
    ctx.globalAlpha = 1;
  }

  // ── Level Up display
  if (levelUpDisplay > 0) {
    ctx.globalAlpha = Math.min(1, levelUpDisplay);
    ctx.fillStyle = '#ffcc00';
    ctx.font = 'bold 28px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('LEVEL ' + level, canvas.width / 2, canvas.height / 2 - 30);
    ctx.font = '14px monospace';
    ctx.fillText('Enemies are getting stronger!', canvas.width / 2, canvas.height / 2);
    ctx.globalAlpha = 1;
  }
}

// ── Utility ──────────────────────────────────────────────────────
function rectsOverlap(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

// ── Game Loop ────────────────────────────────────────────────────
let lastTime = performance.now();
function gameLoop() {
  if (!running && !gameOver) return;
  if (gameOver) return;
  const now = performance.now();
  const delta = Math.min((now - lastTime) / 1000, 0.05); // cap delta
  lastTime = now;
  update(delta);
  draw();
  requestAnimationFrame(gameLoop);
}

// ── UI Event Handlers ────────────────────────────────────────────
// Ship color selection
for (const btn of document.querySelectorAll('.ship-select')) {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.ship-select').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    player.color = btn.dataset.color;
  });
}
// Default selection
document.querySelector('.ship-select[data-color="cyan"]').classList.add('selected');

// Start game
document.getElementById('start-btn').addEventListener('click', () => {
  document.getElementById('start-screen').style.display = 'none';
  canvas.style.display = 'block';
  document.getElementById('mute-btn').style.display = 'block';
  running = true;
  lastTime = performance.now();
  lastEnemySpawn = performance.now();
  lastPowerUpSpawn = performance.now();
  requestAnimationFrame(gameLoop);
});

// Restart
document.getElementById('restart-btn').addEventListener('click', restartGame);

// Mute
document.getElementById('mute-btn').addEventListener('click', () => {
  muted = !muted;
  document.getElementById('mute-btn').textContent = muted ? '🔇' : '🔊';
});

// Prevent scrolling with space/arrows
window.addEventListener('keydown', e => {
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
    e.preventDefault();
  }
});
