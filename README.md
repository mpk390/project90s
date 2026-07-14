# Fuel Rush 3D

A complete client-side 3D endless runner built with HTML, CSS, JavaScript, and Three.js. It is designed to run directly on GitHub Pages without Node.js, npm, a build step, a backend, or a database.

## Features

- Three-lane endless running on a completely flat, straight industrial road
- Petrol-station and fuel-industry environment
- Procedural obstacles, pickups, power-ups, increasing speed and difficulty
- Desktop keyboard and mobile swipe controls
- Dynamic GLB/GLTF player loading with a procedural human fallback
- Smooth camera follow, shadows, fog, particles and speed-line effects
- Score, distance, coins, high score in LocalStorage, pause, settings and fullscreen
- Generated Web Audio fallbacks when MP3 files are absent or empty
- Responsive portrait, landscape, desktop, tablet and mobile layout

## Install / Run

No installation is required.

1. Extract the ZIP.
2. Upload every extracted file and folder to the root of a GitHub repository.
3. In GitHub, open **Settings → Pages**.
4. Under **Build and deployment**, select **Deploy from a branch**.
5. Select your main branch and `/ (root)`.
6. Save and open the generated GitHub Pages URL.

The game uses the Three.js CDN, so the first visit needs internet access.

## Replace the Player Model

Place either of these files in:

- `assets/models/player/player.glb`
- `assets/models/player/player.gltf`

The loader checks GLB first and GLTF second. If neither loads, the game automatically creates a realistic-proportion procedural placeholder human.

Recommended model guidelines:

- Face the character toward the model's forward direction; the loader applies a standard rotation.
- Use meters or any consistent scale; the loader normalizes model height to about 1.8 units.
- Put embedded textures inside GLB for the easiest replacement.
- Meshes automatically receive and cast shadows.

## Replace Head, Face, Hair, Skin or Body

Edit those parts in your preferred 3D application and export the complete character again as `player.glb`. No JavaScript changes are required. For separate texture files, keep their relative paths valid inside `assets/models/player/`.

## Animation Support

The loader searches animation clip names for these words:

`Idle`, `Run`, `Jump`, `Roll`, `Slide`, `Left`, `Right`, `Hit`, `Fall`, `Celebrate`

Name animation clips using those words. Smooth cross-fades are applied automatically. If animations are missing, the placeholder character uses procedural running motion.

## Replace Sounds

Replace files in `assets/audio/music/`:

- `background.mp3`
- `run.mp3`
- `jump.mp3`
- `coin.mp3`
- `slide.mp3`
- `crash.mp3`
- `powerup.mp3`

The current files are silent placeholders. The Audio Manager generates lightweight synthesized fallback sounds, so the game still works before you add real audio.

## Replace Textures

Add optimized JPG, PNG or WebP files to `assets/textures/`, import them in `scene.js`, then assign them to materials. WebP is recommended for small downloads. Use power-of-two dimensions when mipmapping is important.

## Controls

| Action | Keyboard | Mobile |
|---|---|---|
| Move left | A or Left Arrow | Swipe left |
| Move right | D or Right Arrow | Swipe right |
| Jump | Space or Up Arrow | Swipe up |
| Slide | S or Down Arrow | Swipe down |
| Pause | P, Escape or pause button | Pause button |

## Folder Structure

```text
/
├── index.html
├── style.css
├── main.js
├── player.js
├── game.js
├── scene.js
├── controls.js
├── ui.js
├── audio.js
├── loader.js
├── effects.js
├── assets/
│   ├── models/
│   │   ├── player/
│   │   ├── obstacles/
│   │   └── environment/
│   ├── textures/
│   ├── audio/music/
│   └── images/
└── README.md
```

## Performance Notes

The renderer limits device pixel ratio, reuses a small number of road segments, uses simple procedural geometry, caps shadow-map size and keeps effects lightweight. For very low-end devices, enable **Reduced effects** in Settings.

## License

MIT License. The generated code and procedural placeholder assets may be used, modified and distributed freely. Three.js is used from its official npm CDN distribution and retains its own MIT license.

## Opening locally

You can double-click `index.html` and run the game directly in Chrome or Edge while connected to the internet. The Three.js library is loaded from a free CDN. GitHub Pages is still the recommended deployment method.

## Included custom image character

This edition includes `assets/images/player-character.png` as the running player. A custom `player.glb` or `player.gltf` placed in `assets/models/player/` will still take priority automatically.
