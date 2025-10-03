// Elementos
const wheel = document.getElementById('wheel');
const labelsContainer = document.getElementById('labels');
const optionsInput = document.getElementById('options');
const spinBtn = document.getElementById('spinBtn');
const randomizeBtn = document.getElementById('randomizeBtn');
const resultDisplay = document.getElementById('result');
const centerBtn = document.getElementById('centerBtn');

// Modal (Bootstrap 5) inicializado en JS
const winnerModalEl = document.getElementById('winnerModal');
const winnerTextEl = document.getElementById('winnerText');
const winnerSubEl = document.getElementById('winnerSub');
let bsWinnerModal = null;
if (winnerModalEl) {
  bsWinnerModal = new bootstrap.Modal(winnerModalEl, { keyboard: true });
}

let sectors = [];
let currentRotation = 0;
let isSpinning = false;

// Palette simple pero variada
function palette(n){
  const base = ['#ff7b7b','#ffb571','#ffd166','#f7ff6b','#8bf28b','#6fe0d8','#8cc1ff','#b79bff','#f29be6','#ffd1f0'];
  return base[(n-1) % base.length];
}

// Genera sectores desde textarea
function generateSectors(){
  const lines = optionsInput.value.split('\n').map(s => s.trim()).filter(Boolean);
  sectors = lines;
  renderWheel();
}

// Renderiza la rueda con conic-gradient y etiquetas
function renderWheel(){
  labelsContainer.innerHTML = '';
  const n = Math.max(sectors.length, 1);
  const anglePer = 360 / n;

  // background con colores
  const colors = [];
  for(let i=0;i<n;i++) colors.push(palette(i+1));
  wheel.style.background = `conic-gradient(${colors.map((c,i)=> `${c} ${i*anglePer}deg ${ (i+1)*anglePer }deg`).join(',')})`;

  // crear etiquetas posicionadas
  for(let i=0;i<n;i++){
    const el = document.createElement('div');
    el.className = 'sector';
    const rotate = i * anglePer;
    el.style.transform = `rotate(${rotate}deg) translate(-50%,-50%)`;
    const inner = document.createElement('div');
    inner.style.transform = `rotate(${anglePer/2}deg)`;
    inner.textContent = sectors[i] || `Opción ${i+1}`;
    el.appendChild(inner);
    labelsContainer.appendChild(el);
  }
}

// Convierte ángulo visual a índice de sector
function angleToSector(angle){
  const n = sectors.length;
  const normalized = (angle % 360 + 360) % 360;
  const anglePer = 360 / n;
  const idx = Math.floor((360 - normalized + anglePer/2) / anglePer) % n;
  return idx;
}

// Mostrar modal ganador
function showWinnerModal(prize){
  if(!bsWinnerModal) return;
  winnerTextEl.textContent = prize;
  winnerSubEl.textContent = '🔥🔥🔥🔥';
  bsWinnerModal.show();
}

// Acción de girar
function spin(){
  if(isSpinning) return;
  if(sectors.length === 0) return;
  isSpinning = true;
  resultDisplay.textContent = 'Girando...';

  const extraTurns = Math.floor(Math.random() * 4) + 5; // 5..8 vueltas
  const randomOffset = Math.random() * 360;
  const finalRotation = extraTurns * 360 + randomOffset;

  const duration = 4 + extraTurns * 0.45;
  wheel.style.transition = `transform ${duration}s cubic-bezier(.18,.9,.2,1)`;
  currentRotation = (currentRotation + finalRotation) % 36000;
  wheel.style.transform = `rotate(${currentRotation}deg)`;

  wheel.addEventListener('transitionend', onEnd, { once:true });

  function onEnd(){
    const visualAngle = currentRotation % 360;
    const idx = angleToSector(visualAngle);
    const prize = sectors[idx];
    resultDisplay.textContent = prize;
    isSpinning = false;

    // Mostrar modal con el premio ganador
    showWinnerModal(prize);
  }
}

// Eventos
spinBtn.addEventListener('click', spin);
centerBtn.addEventListener('click', spin);
randomizeBtn.addEventListener('click', generateSectors);
optionsInput.addEventListener('input', generateSectors);
//document.addEventListener('keydown', e => { if(e.code === 'Space'){ e.preventDefault(); spin(); } });

// Inicial
generateSectors();