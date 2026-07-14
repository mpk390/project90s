class PlayerLoader {
  constructor() {
    this.loader = new GLTFLoader();
    this.textureLoader = new THREE.TextureLoader();
  }

  async loadPlayerModel(onProgress = function () {}) {
    const candidates = [
      'assets/models/player/player.glb?v=4',
      'assets/models/player/player.gltf?v=4'
    ];

    for (const path of candidates) {
      try {
        const gltf = await this.loadGLTF(path, onProgress);
        const root = gltf.scene;
        root.name = 'ExternalPlayerModel';
        root.traverse(function (object) {
          if (object.isMesh) {
            object.castShadow = true;
            object.receiveShadow = true;
          }
        });
        this.normalize(root);
        return { root: root, animations: gltf.animations || [], source: path };
      } catch (error) {
        // The custom model is optional. Continue to the image character.
      }
    }

    try {
      const imagePath = 'assets/images/player-character.png?v=4';
      const root = await this.loadImageCharacter(imagePath, onProgress);
      return { root: root, animations: [], source: imagePath };
    } catch (error) {
      console.warn('Character image could not be loaded. Using fallback human.', error);
    }

    onProgress(1);
    return {
      root: this.createPlaceholderHuman(),
      animations: [],
      source: 'procedural-placeholder'
    };
  }

  loadGLTF(url, onProgress) {
    const loader = this.loader;
    return new Promise(function (resolve, reject) {
      loader.load(
        url,
        resolve,
        function (event) {
          onProgress(event.total ? event.loaded / event.total : 0.5);
        },
        reject
      );
    });
  }

  loadImageCharacter(url, onProgress) {
    const textureLoader = this.textureLoader;
    return new Promise(function (resolve, reject) {
      textureLoader.load(
        url,
        function (texture) {
          texture.encoding = THREE.sRGBEncoding;
          texture.minFilter = THREE.LinearFilter;
          texture.magFilter = THREE.LinearFilter;

          const root = new THREE.Group();
          root.name = 'ImagePlayerCharacter';

          const material = new THREE.SpriteMaterial({
            map: texture,
            transparent: true,
            alphaTest: 0.02,
            depthWrite: false
          });

          const sprite = new THREE.Sprite(material);
          sprite.name = 'RunningCharacterSprite';
          sprite.scale.set(2.1, 2.8, 1);
          sprite.position.set(0, 1.4, 0);
          root.add(sprite);

          const shadowMaterial = new THREE.MeshBasicMaterial({
            color: 0x000000,
            transparent: true,
            opacity: 0.28,
            depthWrite: false
          });
          const shadow = new THREE.Mesh(
            new THREE.CircleGeometry(0.55, 28),
            shadowMaterial
          );
          shadow.rotation.x = -Math.PI / 2;
          shadow.scale.set(1.05, 0.42, 1);
          shadow.position.set(0, 0.025, 0.04);
          root.add(shadow);

          root.userData.spriteCharacter = {
            sprite: sprite,
            shadow: shadow
          };

          onProgress(1);
          resolve(root);
        },
        undefined,
        reject
      );
    });
  }

  normalize(root) {
    const box = new THREE.Box3().setFromObject(root);
    const size = box.getSize(new THREE.Vector3());
    const scale = 1.8 / Math.max(size.y, 0.01);
    root.scale.multiplyScalar(scale);
    const normalizedBox = new THREE.Box3().setFromObject(root);
    root.position.y -= normalizedBox.min.y;
    root.rotation.y = Math.PI;
  }

  createPlaceholderHuman() {
    const human = new THREE.Group();
    human.name = 'ProceduralHuman';
    const skin = new THREE.MeshStandardMaterial({ color: 0xa66f4b, roughness: 0.72 });
    const suit = new THREE.MeshStandardMaterial({ color: 0x151a20, roughness: 0.5, metalness: 0.08 });
    const accent = new THREE.MeshStandardMaterial({ color: 0xffa000, roughness: 0.4 });
    const shoe = new THREE.MeshStandardMaterial({ color: 0x090a0c, roughness: 0.85 });
    const hair = new THREE.MeshStandardMaterial({ color: 0x15100d, roughness: 0.9 });

    function part(geometry, material, position) {
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(position[0], position[1], position[2]);
      mesh.castShadow = true;
      human.add(mesh);
      return mesh;
    }

    const hips = part(new THREE.CapsuleGeometry(0.28, 0.42, 6, 12), suit, [0, 0.92, 0]);
    const torso = part(new THREE.CapsuleGeometry(0.35, 0.62, 8, 14), suit, [0, 1.55, 0]);
    torso.scale.z = 0.72;
    const stripe = part(new THREE.BoxGeometry(0.08, 0.64, 0.04), accent, [0, 1.58, 0.33]);
    part(new THREE.CylinderGeometry(0.11, 0.12, 0.18, 12), skin, [0, 2.02, 0]);
    const head = part(new THREE.SphereGeometry(0.23, 18, 14), skin, [0, 2.25, 0]);
    head.scale.set(0.88, 1.08, 0.92);
    const hairCap = part(new THREE.SphereGeometry(0.235, 16, 10, 0, Math.PI * 2, 0, Math.PI * 0.46), hair, [0, 2.34, -0.01]);
    hairCap.scale.set(0.9, 0.75, 0.95);
    const leftArm = part(new THREE.CapsuleGeometry(0.105, 0.62, 5, 10), suit, [-0.43, 1.55, 0]);
    const rightArm = part(new THREE.CapsuleGeometry(0.105, 0.62, 5, 10), suit, [0.43, 1.55, 0]);
    const leftLeg = part(new THREE.CapsuleGeometry(0.13, 0.66, 5, 10), suit, [-0.17, 0.45, 0]);
    const rightLeg = part(new THREE.CapsuleGeometry(0.13, 0.66, 5, 10), suit, [0.17, 0.45, 0]);
    const leftShoe = part(new THREE.BoxGeometry(0.22, 0.14, 0.42), shoe, [-0.17, 0.08, 0.08]);
    const rightShoe = part(new THREE.BoxGeometry(0.22, 0.14, 0.42), shoe, [0.17, 0.08, 0.08]);

    human.userData.rig = {
      hips: hips,
      torso: torso,
      head: head,
      leftArm: leftArm,
      rightArm: rightArm,
      leftLeg: leftLeg,
      rightLeg: rightLeg,
      leftShoe: leftShoe,
      rightShoe: rightShoe,
      stripe: stripe
    };
    return human;
  }
}
