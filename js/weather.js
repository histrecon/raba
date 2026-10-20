import { WEATHERS, WEATHER_DURATION } from './config.js';
import { state } from './state.js';

export function getWeather() { return WEATHERS[state.weatherIndex]; }
export function getNextWeather() { return WEATHERS[(state.weatherIndex + 1) % WEATHERS.length]; }
export function changeWeather() { state.weatherIndex = (state.weatherIndex + 1) % WEATHERS.length; state.weatherTimer = 0; }
export function updateGameTime(dt) { state.gameTimeMinutes += dt; if (state.gameTimeMinutes >= 24 * 60) state.gameTimeMinutes -= 24 * 60; }
export function formatTime() {
  const h = Math.floor(state.gameTimeMinutes / 60) % 24;
  const m = Math.floor(state.gameTimeMinutes) % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}
export function tickWeather(dt) {
  state.weatherTimer += dt;
  if (state.weatherTimer > WEATHER_DURATION) changeWeather();
}
