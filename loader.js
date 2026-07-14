class PlayerLoader {
  constructor() {
    this.loader = new GLTFLoader();
    this.textureLoader = new THREE.TextureLoader();
  }

  async loadPlayerModel(onProgress = () => {}) {
    // A custom GLB/GLTF always has priority when supplied.
    const candidates = ['assets/models/player/player.glb', 'assets/models/player/player.gltf'];
    for (const path of candidates) {
      try {
        const gltf = await this.#load(path, onProgress);
        const root = gltf.scene;
        root.name = 'ExternalPlayerModel';
        root.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
        this.#normalize(root);
        return { root, animations: gltf.animations, source: path };
      } catch (_) { /* Try the next supported player source. */ }
    }

    // Image-based character used by this customized edition.
    try {
      const root = await this.#loadImageCharacter('assets/images/player-character.png', onProgress);
      return { root, animations: [], source: 'assets/images/player-character.png' };
    } catch (_) { /* Fall back to the procedural human. */ }

    onProgress(1);
    return { root: this.createPlaceholderHuman(), animations: [], source: 'procedural-placeholder' };
  }

  #load(url, onProgress) {
    return new Promise((resolve, reject) => this.loader.load(
      url,
      resolve,
      e => onProgress(e.total ? e.loaded / e.total : .5),
      reject
    ));
  }

  #loadImageCharacter(url, onProgress) {
    return new Promise((resolve, reject) => {
      this.textureLoader.load(url, texture => {
        texture.encoding = THREE.sRGBEncoding;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;

        const root = new THREE.Group();
        root.name = 'ImagePlayerCharacter';

        const material = new THREE.SpriteMaterial({
          map: texture,
          transparent: true,
          alphaTest: 0.03,
          depthWrite: false
        });
        const sprite = new THREE.Sprite(material);
        sprite.name = 'RunningCharacterSprite';
        sprite.scale.set(2.15, 2.87, 1);
        sprite.position.y = 1.43;
        root.add(sprite);

        const shadowMaterial = new THREE.MeshBasicMaterial({
          color: 0x000000,
          transparent: true,
          opacity: .28,
          depthWrite: false
        });
        const shadow = new THREE.Mesh(new THREE.CircleGeometry(.55, 28), shadowMaterial);
        shadow.rotation.x = -Math.PI / 2;
        shadow.scale.set(1.05, .42, 1);
        shadow.position.set(0, .025, .04);
        root.add(shadow);

        root.userData.spriteCharacter = { sprite, shadow };
        onProgress(1);
        resolve(root);
      }, undefined, reject);
    });
  }

  #normalize(root) {
    const box = new THREE.Box3().setFromObject(root);
    const size = box.getSize(new THREE.Vector3());
    const scale = 1.8 / Math.max(size.y, .01);
    root.scale.multiplyScalar(scale);
    const box2 = new THREE.Box3().setFromObject(root);
    root.position.y -= box2.min.y;
    root.rotation.y = Math.PI;
  }

  createPlaceholderHuman() {
    const human = new THREE.Group();
    human.name = 'ProceduralHuman';
    const skin = new THREE.MeshStandardMaterial({ color: 0xa66f4b, roughness: .72 });
    const suit = new THREE.MeshStandardMaterial({ color: 0x151a20, roughness: .5, metalness: .08 });
    const accent = new THREE.MeshStandardMaterial({ color: 0xffa000, roughness: .4 });
    const shoe = new THREE.MeshStandardMaterial({ color: 0x090a0c, roughness: .85 });
    const hair = new THREE.MeshStandardMaterial({ color: 0x15100d, roughness: .9 });
    const part = (geo, mat, pos) => { const m = new THREE.Mesh(geo, mat); m.position.set(...pos); m.castShadow = true; human.add(m); return m; };
    const hips = part(new THREE.CapsuleGeometry(.28,.42,6,12), suit,[0,.92,0]);
    const torso = part(new THREE.CapsuleGeometry(.35,.62,8,14), suit,[0,1.55,0]); torso.scale.z=.72;
    const stripe = part(new THREE.BoxGeometry(.08,.64,.04),accent,[0,1.58,.33]);
    const neck = part(new THREE.CylinderGeometry(.11,.12,.18,12),skin,[0,2.02,0]);
    const head = part(new THREE.SphereGeometry(.23,18,14),skin,[0,2.25,0]); head.scale.set(.88,1.08,.92);
    const hairCap = part(new THREE.SphereGeometry(.235,16,10,0,Math.PI*2,0,Math.PI*.46),hair,[0,2.34,-.01]); hairCap.scale.set(.9,.75,.95);
    const leftArm = part(new THREE.CapsuleGeometry(.105,.62,5,10),suit,[-.43,1.55,0]);
    const rightArm = part(new THREE.CapsuleGeometry(.105,.62,5,10),suit,[.43,1.55,0]);
    const leftLeg = part(new THREE.CapsuleGeometry(.13,.66,5,10),suit,[-.17,.45,0]);
    const rightLeg = part(new THREE.CapsuleGeometry(.13,.66,5,10),suit,[.17,.45,0]);
    const leftShoe = part(new THREE.BoxGeometry(.22,.14,.42),shoe,[-.17,.08,.08]);
    const rightShoe = part(new THREE.BoxGeometry(.22,.14,.42),shoe,[.17,.08,.08]);
    human.userData.rig={hips,torso,head,leftArm,rightArm,leftLeg,rightLeg,leftShoe,rightShoe,stripe};
    return human;
  }
}
