class Controls {
  constructor(target,actions){this.actions=actions;this.start=null;this.locked=false;window.addEventListener('keydown',e=>this.key(e),{passive:false});target.addEventListener('pointerdown',e=>{this.start={x:e.clientX,y:e.clientY,t:performance.now()};});target.addEventListener('pointerup',e=>this.swipe(e));}
  key(e){if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Space'].includes(e.code))e.preventDefault();if(e.repeat)return;const m={KeyA:'left',ArrowLeft:'left',KeyD:'right',ArrowRight:'right',Space:'up',ArrowUp:'up',KeyS:'down',ArrowDown:'down',Escape:'pause',KeyP:'pause'};if(m[e.code])this.actions[m[e.code]]?.();}
  swipe(e){if(!this.start)return;const dx=e.clientX-this.start.x,dy=e.clientY-this.start.y;this.start=null;if(Math.max(Math.abs(dx),Math.abs(dy))<28)return;if(Math.abs(dx)>Math.abs(dy))this.actions[dx<0?'left':'right']?.();else this.actions[dy<0?'up':'down']?.();}
}
