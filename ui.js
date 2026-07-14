export class UI {
  constructor(){this.$=id=>document.getElementById(id);this.screens=['loading-screen','main-menu','pause-menu','game-over','settings-menu'];this.toastTimer=null;}
  show(name){for(const id of this.screens)this.$(id).classList.toggle('active',id===name);}
  hideScreens(){for(const id of this.screens)this.$(id).classList.remove('active');}
  hud(v){this.$('hud').classList.toggle('hidden',!v);}
  loading(p,text){this.$('loading-progress').style.width=`${Math.round(p*100)}%`;if(text)this.$('loading-text').textContent=text;}
  update(score,coins,distance,mult){this.$('score').textContent=Math.floor(score).toLocaleString();this.$('coins').textContent=coins;this.$('distance').textContent=`${Math.floor(distance)} m`;this.$('multiplier').textContent=`x${mult}`;}
  gameOver(data){this.$('final-score').textContent=Math.floor(data.score).toLocaleString();this.$('final-distance').textContent=`${Math.floor(data.distance)} m`;this.$('final-coins').textContent=data.coins;this.$('high-score').textContent=Math.floor(data.high).toLocaleString();this.show('game-over');}
  powerups(active){const bar=this.$('powerup-bar');bar.innerHTML='';for(const [name,time] of Object.entries(active)){if(time>0){const p=document.createElement('div');p.className='powerup-pill';p.textContent=`${name} ${time.toFixed(1)}s`;bar.appendChild(p);}}}
  toast(msg){const el=this.$('toast');el.textContent=msg;el.classList.add('show');clearTimeout(this.toastTimer);this.toastTimer=setTimeout(()=>el.classList.remove('show'),1200);}
}
