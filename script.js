'use strict';
const menu = document.querySelector('.menu-toggle');
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));document.querySelector('nav').classList.toggle('open',open)});
document.querySelectorAll('nav a').forEach(a=>a.addEventListener('click',()=>{menu.setAttribute('aria-expanded','false');document.querySelector('nav').classList.remove('open')}));
document.addEventListener('keydown',e=>{if(e.key==='Escape'){menu.setAttribute('aria-expanded','false');document.querySelector('nav').classList.remove('open')}});
let selected='All';const search=document.querySelector('#pub-search');
function filterPapers(){let count=0;document.querySelectorAll('.publication').forEach(p=>{const visible=(selected==='All'||p.dataset.topic===selected)&&p.textContent.toLowerCase().includes(search.value.trim().toLowerCase());p.hidden=!visible;if(visible)count++});document.querySelector('#result-count').textContent=`${count} selected publication${count===1?'':'s'}`;document.querySelector('#no-results').hidden=count!==0;document.querySelectorAll('[data-filter]').forEach(b=>{const active=b.dataset.filter===selected;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active))})}
document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{selected=b.dataset.filter;filterPapers()}));
search.addEventListener('input',filterPapers);
document.querySelectorAll('[data-research-filter]').forEach(a=>a.addEventListener('click',()=>{selected=a.dataset.researchFilter;search.value='';filterPapers()}));

// Educational illustration with simulated activity, never presented as measured data.
const canvas=document.querySelector('#brain'),ctx=canvas.getContext('2d');
const signalCanvas=document.querySelector('#signals'),signalCtx=signalCanvas.getContext('2d');
const reduce=matchMedia('(prefers-reduced-motion: reduce)');
let paused=reduce.matches,visible=true,mode='eeg',w=500,h=440,last=0,phase=0;
const motion=document.querySelector('#motion');
const colors={eeg:[180,226,193],fnirs:[235,167,129],ai:[161,196,233]};
const labels={eeg:'Electrical activity. Millisecond dynamics.',fnirs:'Near-infrared light. Hemodynamic responses.',ai:'Neural representations. Learned relationships.'};
const descriptions={eeg:['EEG · Electrical activity','Scalp electrodes record electrical potentials associated with brain activity. I use signal processing and machine learning to study patterns in these recordings.'],fnirs:['fNIRS · Optical brain sensing','Near-infrared light helps estimate changes in oxygenated and deoxygenated hemoglobin in superficial brain tissue. My research includes fNIRS in music and psychological studies.'],ai:['Transformers · Learning from signals','Transformer models learn relationships in neural recordings. My research explores improved EEG representations, including graph-biased transformers for silent speech decoding.']};
function updateMotion(){motion.textContent=paused?'Resume motion ▷':'Pause motion Ⅱ';motion.setAttribute('aria-pressed',String(paused))}updateMotion();
motion.addEventListener('click',()=>{paused=!paused;updateMotion();draw()});
reduce.addEventListener('change',e=>{if(e.matches){paused=true;updateMotion();draw()}});
document.querySelectorAll('[data-mode]').forEach(b=>b.addEventListener('click',()=>{mode=b.dataset.mode;document.querySelectorAll('[data-mode]').forEach(t=>t.setAttribute('aria-pressed',String(t===b)));document.querySelector('#brain-label').textContent=labels[mode];document.querySelector('#modality-title').textContent=descriptions[mode][0];document.querySelector('#modality-description').textContent=descriptions[mode][1];draw()}));
const regions=[[.38,.22],[.48,.25],[.59,.18],[.61,.35],[.69,.30]];
function draw(){if(!ctx)return;ctx.clearRect(0,0,w,h);const side=Math.min(w,h),ox=(w-side)/2,oy=(h-side)/2,c=colors[mode];regions.forEach((p,i)=>{const x=ox+p[0]*side,y=oy+p[1]*side,r=side*(.045+.008*Math.sin(phase*.9+i));const gradient=ctx.createRadialGradient(x,y,0,x,y,r);gradient.addColorStop(0,`rgba(${c},${.07+.04*Math.sin(phase*.8+i)})`);gradient.addColorStop(1,`rgba(${c},0)`);ctx.fillStyle=gradient;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill()});if(mode==='ai'){for(let i=0;i<regions.length-1;i++){const a=regions[i],b=regions[i+1];ctx.beginPath();ctx.moveTo(ox+a[0]*side,oy+a[1]*side);ctx.lineTo(ox+b[0]*side,oy+b[1]*side);ctx.strokeStyle='rgba(173,208,243,.28)';ctx.lineWidth=.8;ctx.stroke();const t=(phase*.12+i*.15)%1;ctx.fillStyle='rgba(195,224,245,.65)';ctx.beginPath();ctx.arc(ox+(a[0]+(b[0]-a[0])*t)*side,oy+(a[1]+(b[1]-a[1])*t)*side,1.6,0,Math.PI*2);ctx.fill()}}drawSignals()}
function drawSignals(){const sw=signalCanvas.width,sh=signalCanvas.height;signalCtx.clearRect(0,0,sw,sh);const streams=mode==='fnirs'?2:3;for(let row=0;row<streams;row++){signalCtx.beginPath();for(let x=0;x<sw;x++){const t=x/sw*15-phase*.65,y=mode==='fnirs'?Math.sin(t*.55+row*2.8)*sh*.13:Math.sin(t*3+row)*Math.sin(t*.7+row)*sh*.055+Math.sin(t*9+row)*sh*.027;const yy=sh*(row+1)/(streams+1)+y;if(!x)signalCtx.moveTo(x,yy);else signalCtx.lineTo(x,yy)}signalCtx.strokeStyle=mode==='fnirs'?(row?'#85c2d5':'#eba781'):`rgba(${colors[mode]},.6)`;signalCtx.lineWidth=1;signalCtx.stroke()}}
function resize(){const rect=canvas.getBoundingClientRect();w=rect.width;h=rect.height;const dpr=Math.min(devicePixelRatio||1,2);canvas.width=w*dpr;canvas.height=h*dpr;signalCanvas.width=w*dpr;signalCanvas.height=48*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);draw()}
new ResizeObserver(resize).observe(canvas);new IntersectionObserver(entries=>{visible=entries[0].isIntersecting},{threshold:.05}).observe(canvas);
function frame(time){if(time-last>50){const dt=Math.min((time-last)/1000,.08);last=time;if(!paused&&visible&&!document.hidden){phase+=dt;draw()}}requestAnimationFrame(frame)}resize();requestAnimationFrame(frame);
