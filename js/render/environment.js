import { W, H, WEATHER_DURATION, WEATHER_ICONS } from '../config.js';
import { state } from '../state.js';
import { getWeather, getNextWeather } from '../weather.js';
import { drawFishBody } from '../utils.js';

export function drawEnvironment(ctx, t) {
  const weather = getWeather();
  const skyGrad = ctx.createLinearGradient(0, 0, 0, 320);
  if (weather === 'day') { skyGrad.addColorStop(0, '#87CEEB'); skyGrad.addColorStop(1, '#ffd9a0'); }
  else if (weather === 'sunset') { skyGrad.addColorStop(0, '#ff7e5f'); skyGrad.addColorStop(1, '#ffe29a'); }
  else if (weather === 'night') { skyGrad.addColorStop(0, '#0b1021'); skyGrad.addColorStop(1, '#2a3a5a'); }
  else if (weather === 'rain') { skyGrad.addColorStop(0, '#4a5a6a'); skyGrad.addColorStop(1, '#8a9aaa'); }
  else if (weather === 'fog') { skyGrad.addColorStop(0, '#b0b8c0'); skyGrad.addColorStop(1, '#e0e8f0'); }
  ctx.fillStyle = skyGrad; ctx.fillRect(0, 0, W, 320);

  if (weather === 'day' || weather === 'sunset') {
    const sunGrad = ctx.createRadialGradient(750, 100, 10, 750, 100, 100);
    sunGrad.addColorStop(0, weather === 'sunset' ? 'rgba(255,150,50,1)' : 'rgba(255,250,200,1)');
    sunGrad.addColorStop(1, 'rgba(255,220,100,0)');
    ctx.fillStyle = sunGrad; ctx.beginPath(); ctx.arc(750, 100, 100, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fff8d0'; ctx.beginPath(); ctx.arc(750, 100, 35, 0, Math.PI * 2); ctx.fill();
  } else if (weather === 'night') {
    ctx.fillStyle = '#f0f0ff'; ctx.beginPath(); ctx.arc(750, 100, 40, 0, Math.PI * 2); ctx.fill();
    for (let i = 0; i < 30; i++) {
      const sx = (i * 37 + Math.sin(i) * 20) % W; const sy = (i * 23) % 200;
      ctx.fillStyle = `rgba(255,255,255,${0.3 + Math.sin(t * 2 + i) * 0.3})`; ctx.fillRect(sx, sy, 2, 2);
    }
  }
  if (weather !== 'night' && weather !== 'fog') {
    ctx.fillStyle = weather === 'rain' ? 'rgba(100,110,120,0.5)' : 'rgba(255,255,255,0.6)';
    for (const [cx, cy, sc] of [[200, 80, 1], [500, 130, 0.8]]) {
      const offset = (t * 5 * sc) % (W + 200) - 100;
      ctx.beginPath(); ctx.arc(offset, cy, 25 * sc, 0, Math.PI * 2);
      ctx.arc(offset + 25 * sc, cy + 5, 30 * sc, 0, Math.PI * 2);
      ctx.arc(offset + 55 * sc, cy, 22 * sc, 0, Math.PI * 2); ctx.fill();
    }
  }
  ctx.fillStyle = weather === 'night' ? '#1a2a1a' : weather === 'sunset' ? '#5a4a3a' : '#6a8a5a';
  ctx.beginPath(); ctx.moveTo(0, 320);
  for (let x = 0; x <= W; x += 40) ctx.lineTo(x, 290 + Math.sin(x * 0.008) * 25);
  ctx.lineTo(W, 320); ctx.closePath(); ctx.fill();
  ctx.fillStyle = weather === 'night' ? '#0a1a0a' : weather === 'sunset' ? '#4a3a2a' : '#4a6a3a';
  ctx.beginPath(); ctx.moveTo(0, 320);
  for (let x = 0; x <= W; x += 40) ctx.lineTo(x, 305 + Math.sin(x * 0.012 + 2) * 18);
  ctx.lineTo(W, 320); ctx.closePath(); ctx.fill();
  ctx.fillStyle = weather === 'night' ? '#0a150a' : weather === 'sunset' ? '#3a2a1a' : '#2a4a2a';
  for (const tx of [50, 130, 210, 800, 870]) {
    ctx.beginPath(); ctx.moveTo(tx, 315); ctx.lineTo(tx - 15, 315); ctx.lineTo(tx, 260); ctx.lineTo(tx + 15, 315); ctx.fill();
    ctx.beginPath(); ctx.moveTo(tx, 290); ctx.lineTo(tx - 12, 290); ctx.lineTo(tx, 240); ctx.lineTo(tx + 12, 290); ctx.fill();
  }
  const waterGrad = ctx.createLinearGradient(0, 320, 0, H);
  if (weather === 'day') { waterGrad.addColorStop(0, '#3a7ca8'); waterGrad.addColorStop(1, '#1a3a5a'); }
  else if (weather === 'sunset') { waterGrad.addColorStop(0, '#8a5a4a'); waterGrad.addColorStop(1, '#2a1a3a'); }
  else if (weather === 'night') { waterGrad.addColorStop(0, '#0a1a3a'); waterGrad.addColorStop(1, '#050a15'); }
  else if (weather === 'rain') { waterGrad.addColorStop(0, '#4a5a6a'); waterGrad.addColorStop(1, '#1a2a3a'); }
  else if (weather === 'fog') { waterGrad.addColorStop(0, '#8a9aaa'); waterGrad.addColorStop(1, '#3a4a5a'); }
  ctx.fillStyle = waterGrad; ctx.fillRect(0, 320, W, H - 320);

  ctx.strokeStyle = weather === 'night' ? 'rgba(100,150,200,0.15)' : 'rgba(150,200,255,0.25)'; ctx.lineWidth = 2;
  for (let i = 0; i < 8; i++) {
    const wy = 340 + i * 35; ctx.beginPath();
    for (let x = 0; x <= W; x += 10) {
      const y = wy + Math.sin(x * 0.02 + t * 1.5 + i) * 3;
      if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  if (weather === 'day' || weather === 'sunset') {
    for (let i = 0; i < 25; i++) {
      const bx = 400 + Math.sin(t * 0.5 + i * 1.7) * 380;
      const by = 340 + (i * 23) % 240;
      const alpha = 0.1 + Math.sin(t * 2 + i) * 0.08;
      ctx.fillStyle = `rgba(255, 250, 200, ${Math.max(0, alpha)})`;
      ctx.fillRect(bx, by, 20 + Math.sin(t + i) * 10, 2);
    }
  }
  for (const f of state.bgFish) {
    drawFishBody(ctx, f.x, f.y, f.size, f.color, f.dir, weather === 'night' ? 0.2 : 0.4 + f.depth * 0.4);
  }
  for (const b of state.bubbles) {
    ctx.fillStyle = `rgba(200, 230, 255, ${0.3 * b.depth})`;
    ctx.beginPath(); ctx.arc(b.x, b.y, b.size, 0, Math.PI * 2); ctx.fill();
  }
  if (weather === 'rain') {
    ctx.strokeStyle = 'rgba(180, 200, 220, 0.4)'; ctx.lineWidth = 1.5;
    for (const r of state.rainDrops) {
      ctx.beginPath(); ctx.moveTo(r.x, r.y); ctx.lineTo(r.x - 2, r.y + r.len); ctx.stroke();
    }
    for (let i = 0; i < 5; i++) {
      const rx = (i * 173 + t * 50) % W; const ry = 340 + (i * 67) % 250;
      const rr = (t * 100 + i * 30) % 30;
      if (rr > 0) {
        ctx.strokeStyle = `rgba(200, 220, 240, ${1 - rr / 30})`;
        ctx.beginPath(); ctx.ellipse(rx, ry, rr, rr * 0.3, 0, 0, Math.PI * 2); ctx.stroke();
      }
    }
  }
  if (weather === 'fog') {
    ctx.fillStyle = 'rgba(200, 210, 220, 0.4)';
    for (let i = 0; i < 5; i++) {
      ctx.beginPath(); ctx.arc((i * 200 + t * 10) % W, 350 + i * 40, 150, 0, Math.PI * 2); ctx.fill();
    }
  }
}

export function updateEnvironmentParticles(dt, t) {
  for (const f of state.bgFish) {
    f.x += f.speed * f.dir; f.wobble += dt * 3; f.y += Math.sin(f.wobble) * 0.3;
    if (f.x > W + 40) { f.x = -40; f.y = 340 + Math.random() * 230; }
    if (f.x < -40) { f.x = W + 40; f.y = 340 + Math.random() * 230; }
  }
  for (const b of state.bubbles) {
    b.y -= b.speed; b.x += Math.sin(t + b.y * 0.05) * 0.3;
    if (b.y < 320) { b.y = H; b.x = Math.random() * W; }
  }
  if (getWeather() === 'rain') {
    for (const r of state.rainDrops) {
      r.y += r.speed * dt;
      if (r.y > H) { r.y = -20; r.x = Math.random() * W; }
    }
  }
}
