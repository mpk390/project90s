import * as THREE from 'three';
import { PlayerLoader } from './loader.js';

export class Player {
  constructor(scene, audio) {
    this.scene=scene; this.audio=audio; this.group=new THREE.Group(); this.group.position.set(0,0,6); scene.add(this.group);
    this.loader=new PlayerLoader(); this.model=null; this.mixer=null; this.actions={}; this.currentAction='Idle';
    this.lane=0; this.targetX=0; this.yVelocity=0; this.grounded=true; this.sliding=false; this.slideTimer=0; this.invincible=false; this.hitbox=new THREE.Box3(); this.time=0;
  }
  async init(progress){ const data=await this.loader.loadPlayerModel(progress); this.model=data.root; this.group.add(this.model); if(data.animations.length){this.mixer=new THREE.AnimationMixer(this.model); for(const clip of data.animations)this.actions[this.#mapName(clip.name)]=this.mixer.clipAction(clip); this.playAnimation('Idle',0);} }
  #mapName(n){const s=n.toLowerCase(); for(const key of ['Idle','Run','Jump','Roll','Slide','Left','Right','Hit','Fall','Celebrate'])if(s.includes(key.toLowerCase()))return key; return n;}
  playAnimation(name,fade=.18){if(this.currentAction===name)return; const next=this.actions[name]; const prev=this.actions[this.currentAction]; if(prev)prev.fadeOut(fade); if(next)next.reset().fadeIn(fade).play(); this.currentAction=name;}
  moveLane(dir){if(this.sliding)return; const old=this.lane; this.lane=THREE.MathUtils.clamp(this.lane+dir,-1,1); if(old!==this.lane){this.targetX=this.lane*2.5;this.playAnimation(dir<0?'Left':'Right');this.audio.play('lane');}}
  jump(boost=1){if(!this.grounded||this.sliding)return; this.yVelocity=9.1*boost;this.grounded=false;this.playAnimation('Jump');this.audio.play('jump');}
  slide(){if(!this.grounded||this.sliding)return;this.sliding=true;this.slideTimer=.82;this.group.scale.y=.56;this.playAnimation('Slide');this.audio.play('slide');}
  reset(){this.group.position.set(0,0,6);this.group.scale.set(1,1,1);this.lane=0;this.targetX=0;this.yVelocity=0;this.grounded=true;this.sliding=false;this.invincible=false;this.playAnimation('Run');}
  update(dt,running,jumpBoost=1){this.time+=dt;if(this.mixer)this.mixer.update(dt);this.group.position.x=THREE.MathUtils.damp(this.group.position.x,this.targetX,13,dt);if(!this.grounded){this.yVelocity-=22*dt;this.group.position.y+=this.yVelocity*dt;if(this.group.position.y<=0){this.group.position.y=0;this.yVelocity=0;this.grounded=true;if(running)this.playAnimation('Run');}}
    if(this.sliding){this.slideTimer-=dt;if(this.slideTimer<=0){this.sliding=false;this.group.scale.y=1;if(running)this.playAnimation('Run');}}
    if(!this.mixer&&this.model?.userData.rig&&running)this.#proceduralRun(dt);
    if(running&&this.grounded&&!this.sliding&&this.currentAction!=='Run')this.playAnimation('Run');
    this.hitbox.setFromObject(this.group);this.hitbox.expandByScalar(-.16);
  }
  #proceduralRun(){const r=this.model.userData.rig,t=this.time*11,s=Math.sin(t),c=Math.cos(t);r.leftArm.rotation.x=s*.75;r.rightArm.rotation.x=-s*.75;r.leftLeg.rotation.x=-s*.72;r.rightLeg.rotation.x=s*.72;r.torso.rotation.z=c*.025;this.model.position.y=Math.abs(s)*.025;}
  celebrate(){this.playAnimation('Celebrate');}
  hit(){this.playAnimation('Hit');}
}
