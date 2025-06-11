const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

let player = { x: 400, y: 550, w: 40, h: 40, color: 'cyan' };
const bullets = [];
const enemies = [];
const powerUps = [];
const stars = [];

let lastEnemySpawn = 0;
let lastPowerUpSpawn = 0;
let lastStarSpawn = 0;
let score = 0;
let running = false;
let muted = false;

const enemyTypes = [
  { color: 'red', speed: 100, points: 10 },
  { color: 'green', speed: 150, points: 20 }
];

function playBeep(frequency, duration) {
  if (muted) return;
  const ctxAudio = new (window.AudioContext || window.webkitAudioContext)();
  const osc = ctxAudio.createOscillator();
  const gain = ctxAudio.createGain();
  osc.frequency.value = frequency;
  osc.type = 'square';
  osc.connect(gain);
  gain.connect(ctxAudio.destination);
  osc.start();
  gain.gain.setValueAtTime(0.1, ctxAudio.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctxAudio.currentTime + duration);
  osc.stop(ctxAudio.currentTime + duration);
}

function spawnEnemy() {
  const type = enemyTypes[Math.floor(Math.random()*enemyTypes.length)];
  enemies.push({
    x: Math.random() * 760,
    y: -40,
    w: 40,
    h: 40,
    color: type.color,
    speed: type.speed,
    points: type.points
  });
}

function spawnPowerUp() {
  powerUps.push({ x: Math.random() * 760, y: -20, w: 20, h: 20, color: 'yellow' });
}

function spawnStar() {
  stars.push({ x: Math.random()*800, y: -2, size: Math.random()*2+1, speed: 30 });
}

function update(delta) {
  for (const s of stars) s.y += s.speed * delta;
  while (stars.length && stars[0].y > 600) stars.shift();

  for (const b of bullets) b.y -= 400 * delta;
  while (bullets.length && bullets[0].y < -20) bullets.shift();

  for (const e of enemies) e.y += e.speed * delta;
  while (enemies.length && enemies[0].y > 620) enemies.shift();

  for (const p of powerUps) p.y += 80 * delta;
  while (powerUps.length && powerUps[0].y > 620) powerUps.shift();

  for (let i = enemies.length - 1; i >= 0; i--) {
    const e = enemies[i];
    if (rectsOverlap(e, player)) {
      playBeep(100,0.5);
      alert('Game over! Score: ' + score);
      document.location.reload();
      return;
    }
    for (let j = bullets.length - 1; j >= 0; j--) {
      const b = bullets[j];
      if (rectsOverlap(e, b)) {
        enemies.splice(i,1);
        bullets.splice(j,1);
        score += e.points;
        playBeep(300,0.1);
        break;
      }
    }
  }

  for (let i = powerUps.length - 1; i >= 0; i--) {
    const p = powerUps[i];
    if (rectsOverlap(p, player)) {
      powerUps.splice(i,1);
      score += 50;
      playBeep(600,0.1);
    }
  }

  if (performance.now() - lastEnemySpawn > 1000) {
    spawnEnemy();
    lastEnemySpawn = performance.now();
  }

  if (performance.now() - lastPowerUpSpawn > 5000) {
    spawnPowerUp();
    lastPowerUpSpawn = performance.now();
  }

  if (performance.now() - lastStarSpawn > 200) {
    spawnStar();
    lastStarSpawn = performance.now();
  }
}

function draw() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle = 'white';
  for (const s of stars) {
    ctx.fillRect(s.x,s.y,s.size,s.size);
  }
  drawRect(player);
  bullets.forEach(drawRect);
  enemies.forEach(drawRect);
  powerUps.forEach(drawRect);
  ctx.fillStyle = 'white';
  ctx.fillText('Score: ' + score, 10, 20);
}

function drawRect(o) {
  ctx.fillStyle = o.color;
  ctx.fillRect(o.x,o.y,o.w,o.h);
}

function rectsOverlap(a,b){
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

let lastTime = performance.now();
function gameLoop(){
  if(!running) return;
  const now = performance.now();
  const delta = (now - lastTime)/1000;
  update(delta);
  draw();
  lastTime = now;
  requestAnimationFrame(gameLoop);
}

// controls
window.addEventListener('keydown',e=>{
  if(!running) return;
  if(e.key==='ArrowLeft') player.x -= 20;
  if(e.key==='ArrowRight') player.x += 20;
  if(e.key===' '){
    bullets.push({x:player.x+player.w/2-5,y:player.y,w:10,h:20,color:'lime'});
    playBeep(700,0.05);
  }
});

// ui
for(const btn of document.querySelectorAll('.ship-select')){
  btn.addEventListener('click',()=>{
    document.querySelectorAll('.ship-select').forEach(b=>b.disabled=false);
    btn.disabled=true;
    player.color=btn.dataset.color;
  });
}

document.getElementById('start-btn').addEventListener('click',()=>{
  document.getElementById('start-screen').style.display='none';
  canvas.style.display='block';
  running=true;
  lastTime=performance.now();
  requestAnimationFrame(gameLoop);
});

document.getElementById('mute-btn').addEventListener('click',()=>{
  muted=!muted;
  document.getElementById('mute-btn').innerText=muted?'Unmute':'Mute';
});

