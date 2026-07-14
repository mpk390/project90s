import { GameScene } from './scene.js';
import { AudioManager } from './audio.js';
import { UI } from './ui.js';
import { Controls } from './controls.js';
import { Game } from './game.js';

const ui=new UI();const audio=new AudioManager();const gs=new GameScene(document.getElementById('game-canvas'));const game=new Game(gs,audio,ui);
const savedMusic=localStorage.getItem('fuelRushMusic')!=='false',savedSound=localStorage.getItem('fuelRushSound')!=='false';audio.musicEnabled=savedMusic;audio.soundEnabled=savedSound;ui.$('music-toggle').checked=savedMusic;ui.$('sound-toggle').checked=savedSound;
new Controls(document.getElementById('game-canvas'),{left:()=>game.state==='running'&&game.player.moveLane(-1),right:()=>game.state==='running'&&game.player.moveLane(1),up:()=>game.state==='running'&&game.player.jump(game.powerups['Jump Boost']>0?1.25:1),down:()=>game.state==='running'&&game.player.slide(),pause:()=>game.state==='running'?game.pause():game.state==='paused'&&game.resume()});
const click=(id,fn)=>ui.$(id).addEventListener('click',()=>{audio.play('button');fn();});click('play-btn',()=>game.start());click('pause-btn',()=>game.pause());click('resume-btn',()=>game.resume());click('restart-btn',()=>game.start());click('pause-restart-btn',()=>game.start());click('pause-main-btn',()=>game.menu());click('gameover-main-btn',()=>game.menu());click('settings-btn',()=>ui.show('settings-menu'));click('settings-back-btn',()=>ui.show('main-menu'));click('fullscreen-btn',()=>document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen?.());
ui.$('music-toggle').addEventListener('change',e=>audio.setMusic(e.target.checked));ui.$('sound-toggle').addEventListener('change',e=>audio.setSound(e.target.checked));ui.$('effects-toggle').addEventListener('change',e=>game.effects.setReduced(e.target.checked));document.addEventListener('visibilitychange',()=>{if(document.hidden&&game.state==='running')game.pause();});
await audio.init();ui.loading(.25,'Loading modular game systems...');await game.init(p=>ui.loading(.25+p*.7,'Loading player model...'));ui.loading(1,'Ready');setTimeout(()=>ui.show('main-menu'),280);
let last=performance.now();function frame(now){const dt=Math.min((now-last)/1000,.05);last=now;game.update(dt);if(game.state!=='running')gs.follow(game.player,dt,game.speed);gs.render();requestAnimationFrame(frame);}requestAnimationFrame(frame);
