import './style.css';
import { Game } from './game/Game';

const canvas = document.querySelector<HTMLCanvasElement>('#game-canvas');

if (!canvas) {
  throw new Error('未找到游戏画布。');
}

const game = new Game(canvas);
game.start();
