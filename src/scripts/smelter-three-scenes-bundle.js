/**
 * ============================================================================
 * SMELTER STUDIO — Three.js scenes bundle (portable)
 * ============================================================================
 *
 * Two standalone scenes auto-mount on canvas IDs:
 *   1. #refining-blob-canvas    — morphing ore → Platonic gem
 *   2. #gem-tictactoe-canvas    — 3×3 board, winning lines refine into gems
 *
 * Dependencies (load BEFORE this file, in this order):
 *   <script defer src="https://cdn.jsdelivr.net/npm/three@0.147.0/build/three.min.js"></script>
 *   <script defer src="https://cdn.jsdelivr.net/npm/three@0.147.0/examples/js/loaders/RGBELoader.js"></script>
 *   <script defer src="/scripts/smelter-three-scenes-bundle.js"></script>
 *
 * Optional asset (procedural fallback used if missing):
 *   /images/hdri/studio_small_09_1k.hdr
 * ============================================================================
 */

/* global THREE */

const HDRI_PATH = '/images/hdri/studio_small_09_1k.hdr';

const USE_HERO_GLASS_SPHERE = false;

function readSiteDarkMode() {
  const saved = localStorage.getItem('theme');
  if (saved === 'dark') return true;
  if (saved === 'light') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

const GEM_PALETTE_U_DARK = 1.0;
const FACET_QUANTIZE = 0.12;
const FACET_SHARP_MAX = 0.6;

function createFallbackEquirectTexture() {
  const w = 512;
  const h = 256;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  const sky = ctx.createLinearGradient(0, 0, 0, h);
  sky.addColorStop(0, '#f2f4f8');
  sky.addColorStop(0.45, '#c8d0e0');
  sky.addColorStop(1, '#1a1f2e');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);
  const key = (x, y, r, color) => {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, color);
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
  };
  key(w * 0.35, h * 0.18, h * 0.55, 'rgba(255,255,255,0.85)');
  key(w * 0.72, h * 0.22, h * 0.45, 'rgba(200,220,255,0.5)');
  const tex = new THREE.CanvasTexture(canvas);
  tex.mapping = THREE.EquirectangularReflectionMapping;
  return tex;
}

function initRefiningBlob() {
  if (typeof THREE === 'undefined' || typeof THREE.RGBELoader === 'undefined') {
    setTimeout(initRefiningBlob, 30);
    return;
  }

  const container = document.getElementById('refining-blob-canvas');
  if (!container) return;

  const renderer = new THREE.WebGLRenderer({ canvas: container, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.18;
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.physicallyCorrectLights = true;

  const morphClock = new THREE.Clock();

  const scene = new THREE.Scene();
  const keyLight = new THREE.DirectionalLight(0xffffff, 0);
  const keyLightBase = new THREE.Vector3(4.2, 11.5, 3.2);
  keyLight.position.copy(keyLightBase);
  scene.add(keyLight);

  const SPHERE_RADIUS = 2.3;
  const BLOB_RADIUS = SPHERE_RADIUS * 0.8;
  const SHADOW_SIZE = BLOB_RADIUS * 2.8;

  const THEME_PAGE_BG = { light: '#ffffff', dark: '#080705' };
  const themeColors = {
    light: new THREE.Color(THEME_PAGE_BG.light),
    dark: new THREE.Color(THEME_PAGE_BG.dark),
  };

  const RIM_BLUE_LIGHT = new THREE.Color('#3d60e2').lerp(new THREE.Color(0xffffff), 0.82);
  const RIM_NEUTRAL_DARK = new THREE.Color(0.9, 0.91, 0.94);

  const shadowCanvas = document.createElement('canvas');
  shadowCanvas.width = 128;
  shadowCanvas.height = 128;
  const shadowCtx = shadowCanvas.getContext('2d');
  const gradient = shadowCtx.createRadialGradient(64, 64, 0, 64, 64, 54);
  gradient.addColorStop(0, 'rgba(0,0,0,0.5)');
  gradient.addColorStop(0.88, 'rgba(0,0,0,0.02)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
  shadowCtx.fillStyle = gradient;
  shadowCtx.fillRect(0, 0, 128, 128);

  const shadowMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(SHADOW_SIZE, SHADOW_SIZE),
    new THREE.MeshBasicMaterial({
      map: new THREE.CanvasTexture(shadowCanvas),
      transparent: true,
      depthWrite: false,
      opacity: 0.5,
    })
  );
  shadowMesh.rotation.x = -Math.PI / 2;
  shadowMesh.position.y = -BLOB_RADIUS - 0.2;

  let diamondMesh = null;
  let glassMesh = null;
  let gradientMesh = null;
  let glassSpinX = 0;
  let glassSpinY = 0;
  let hoverProgress = 0;
  let hoverTarget = 0;
  let morphPhase = 0;
  const diamondNormalMat = new THREE.Matrix3();
  let storedDiamondRadius = BLOB_RADIUS;
  let diamondBlobTopo = true;
  let diamondCachedShapeSlot = 0;

  function attachSphereDirAttribute(geometry) {
    const pos = geometry.attributes.position;
    const arr = new Float32Array(pos.count * 3);
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);
      const len = Math.hypot(x, y, z) || 1;
      arr[i * 3] = x / len;
      arr[i * 3 + 1] = y / len;
      arr[i * 3 + 2] = z / len;
    }
    geometry.setAttribute('sphereDir', new THREE.BufferAttribute(arr, 3));
  }

  function createBlobGeometry(R) {
    const geo = new THREE.IcosahedronGeometry(R, 5);
    attachSphereDirAttribute(geo);
    return geo;
  }

  function createDiamondGeometry(shapeSlot, R) {
    const s = R / Math.sqrt(3);
    let geo;
    if (shapeSlot === 0) {
      geo = new THREE.TetrahedronGeometry(R, 3);
    } else if (shapeSlot === 1) {
      geo = new THREE.BoxGeometry(s * 2, s * 2, s * 2, 20, 20, 20);
    } else if (shapeSlot === 2) {
      geo = new THREE.OctahedronGeometry(R, 3);
    } else if (shapeSlot === 3) {
      geo = new THREE.DodecahedronGeometry(R, 2);
    } else {
      geo = new THREE.IcosahedronGeometry(R, 3);
    }
    attachSphereDirAttribute(geo);
    return geo;
  }

  const syncTheme = () => {
    const dark = readSiteDarkMode();
    scene.background = null;
    renderer.toneMappingExposure = dark ? 1.12 : 1.14;
    keyLight.intensity = dark ? 0 : 1.45;
    shadowMesh.material.opacity = dark ? 0.9 : 0.5;

    if (USE_HERO_GLASS_SPHERE && glassMesh) {
      const m = glassMesh.material;
      m.color.set(0xffffff);
      if (dark) {
        m.envMapIntensity = 0.88;
        m.thickness = 0.42;
        m.ior = 1.5;
        m.roughness = 0.052;
        m.clearcoat = 0.38;
        m.clearcoatRoughness = 0.2;
        m.specularIntensity = 0.68;
        m.attenuationDistance = Infinity;
        m.attenuationColor.setRGB(0.96, 0.95, 0.94);
        m.transmission = 1;
      } else {
        m.envMapIntensity = 0.86;
        m.thickness = 0.006;
        m.ior = 1.52;
        m.roughness = 0.014;
        m.clearcoat = 0.38;
        m.clearcoatRoughness = 0.06;
        m.specularIntensity = 0.95;
        m.attenuationDistance = Infinity;
        m.attenuationColor.setRGB(1, 1, 1);
        m.transmission = 0.992;
      }
    }

    if (USE_HERO_GLASS_SPHERE && gradientMesh && gradientMesh.material.uniforms) {
      const gu = gradientMesh.material.uniforms;
      gu.uBlue.value.copy(dark ? RIM_NEUTRAL_DARK : RIM_BLUE_LIGHT);
      gu.uMaxAlpha.value = dark ? 0.28 : 0.036;
      gu.uBlueMix.value = dark ? 0.28 : 0.32;
      gu.uBodyStrength.value = dark ? 0.09 : 0.0025;
    }

    if (diamondMesh && diamondMesh.material.uniforms) {
      const u = diamondMesh.material.uniforms;
      u.uDark.value = GEM_PALETTE_U_DARK;
      u.uLightBackdrop.value = dark ? 0.0 : 1.0;
      u.uAiryGem.value = dark ? 0.0 : 1.0;
      u.uBlueRefractMix.value = 1.0;
      u.uFacetQuantize.value = FACET_QUANTIZE;
    }
  };

  const camera = new THREE.PerspectiveCamera(46, 1, 0.1, 100);
  camera.position.set(0, 0.26, 8.35);
  const applyCameraFraming = () => camera.lookAt(0, -0.66, 0);
  applyCameraFraming();

  const handleResize = () => {
    if (!container) return;
    const w = Math.max(1, Math.round(container.clientWidth));
    const h = Math.max(1, Math.round(container.clientHeight));
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    applyCameraFraming();
    renderer.setSize(w, h);
  };
  window.addEventListener('resize', handleResize);
  setTimeout(handleResize, 100);

  const tiltGroup = new THREE.Group();
  const dragInspectGroup = new THREE.Group();
  dragInspectGroup.rotation.order = 'YXZ';

  const shadowRoot = new THREE.Group();
  shadowRoot.add(shadowMesh);

  const scenePivot = new THREE.Group();
  scenePivot.position.set(-1.8, 0.34, 0);
  scenePivot.add(dragInspectGroup);
  dragInspectGroup.add(tiltGroup);
  scenePivot.add(shadowRoot);
  scene.add(scenePivot);

  const buildScene = (envTexture) => {
    envTexture.mapping = THREE.EquirectangularReflectionMapping;

    const pmrem = new THREE.PMREMGenerator(renderer);
    const pmremRT = pmrem.fromEquirectangular(envTexture);
    const envCube = pmremRT.texture;
    scene.environment = envCube;
    pmrem.dispose();

    const cubeRT = new THREE.WebGLCubeRenderTarget(256, {
      type: THREE.HalfFloatType,
      encoding: THREE.LinearEncoding,
      generateMipmaps: false,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
    });
    cubeRT.fromEquirectangularTexture(renderer, envTexture);
    const envCubeMap = cubeRT.texture;

    requestAnimationFrame(() => {
      envTexture.dispose();
      pmremRT.dispose();
    });

    const diamondRadius = BLOB_RADIUS;
    storedDiamondRadius = diamondRadius;

    const diamondMaterial = new THREE.ShaderMaterial({
      extensions: { derivatives: true },
      uniforms: {
        uTime: { value: 0 },
        uDark: { value: GEM_PALETTE_U_DARK },
        uLightBackdrop: { value: readSiteDarkMode() ? 0.0 : 1.0 },
        uAiryGem: { value: readSiteDarkMode() ? 0.0 : 1.0 },
        uBlueRefractMix: { value: 1.0 },
        uMorph: { value: 0 },
        uShapeIndex: { value: 0.0 },
        uRadius: { value: diamondRadius },
        uLightDir: { value: new THREE.Vector3().copy(keyLightBase).normalize() },
        envMap: { value: envCubeMap },
        uNormalMatrix: { value: new THREE.Matrix3() },
        uFacetSharp: { value: 0.0 },
        uFacetQuantize: { value: FACET_QUANTIZE },
      },
      vertexShader: `
        uniform float uMorph;
        uniform float uShapeIndex;
        uniform float uRadius;
        uniform float uTime;

        attribute vec3 sphereDir;

        varying vec3 vWorldNormal;
        varying vec3 vWorldPos;
        varying vec3 vLocalPos;
        varying float vMorph;

        const float TETRA_H_R = 0.3333333333;
        const float OCTA_H_R = 0.5773502691896258;
        const float ICO_DODE_H_R = 0.7946544722917661;

        vec3 cubePos(vec3 d, float R) {
          float a = R / 1.7320508075688772;
          float m = max(max(abs(d.x), abs(d.y)), abs(d.z));
          return d * a / max(m, 1e-4);
        }

        vec3 cubeNrm(vec3 d) {
          vec3 a = abs(d);
          if (a.x > a.y) {
            if (a.x > a.z) return vec3(d.x >= 0.0 ? 1.0 : -1.0, 0.0, 0.0);
            return vec3(0.0, 0.0, d.z >= 0.0 ? 1.0 : -1.0);
          }
          if (a.y > a.z) return vec3(0.0, d.y >= 0.0 ? 1.0 : -1.0, 0.0);
          return vec3(0.0, 0.0, d.z >= 0.0 ? 1.0 : -1.0);
        }

        void tetraExit(vec3 d, float R, out float tOut, out vec3 nOut) {
          float h = R * TETRA_H_R;
          vec3 n0 = vec3(-0.5773502691896258, 0.5773502691896258, 0.5773502691896258);
          vec3 n1 = vec3(0.5773502691896258, -0.5773502691896258, 0.5773502691896258);
          vec3 n2 = vec3(0.5773502691896258, 0.5773502691896258, -0.5773502691896258);
          vec3 n3 = vec3(-0.5773502691896258, -0.5773502691896258, -0.5773502691896258);
          float tMin = 1e10;
          vec3 nBest = n0;
          float nd;
          nd = dot(n0, d); if (nd > 1e-5) { float t0 = h / nd; if (t0 < tMin) { tMin = t0; nBest = n0; } }
          nd = dot(n1, d); if (nd > 1e-5) { float t1 = h / nd; if (t1 < tMin) { tMin = t1; nBest = n1; } }
          nd = dot(n2, d); if (nd > 1e-5) { float t2 = h / nd; if (t2 < tMin) { tMin = t2; nBest = n2; } }
          nd = dot(n3, d); if (nd > 1e-5) { float t3 = h / nd; if (t3 < tMin) { tMin = t3; nBest = n3; } }
          tOut = tMin;
          nOut = nBest;
        }

        void octaExit(vec3 d, float R, out float tOut, out vec3 nOut) {
          float h = R * OCTA_H_R;
          float tMin = 1e10;
          vec3 nBest = vec3(0.5773502691896258, 0.5773502691896258, 0.5773502691896258);
          vec3 nn;
          float nd, tt;
          nn = vec3(0.5773502691896258, 0.5773502691896258, 0.5773502691896258);
          nd = dot(nn, d); if (nd > 1e-5) { tt = h / nd; if (tt < tMin) { tMin = tt; nBest = nn; } }
          nn = vec3(0.5773502691896258, 0.5773502691896258, -0.5773502691896258);
          nd = dot(nn, d); if (nd > 1e-5) { tt = h / nd; if (tt < tMin) { tMin = tt; nBest = nn; } }
          nn = vec3(0.5773502691896258, -0.5773502691896258, 0.5773502691896258);
          nd = dot(nn, d); if (nd > 1e-5) { tt = h / nd; if (tt < tMin) { tMin = tt; nBest = nn; } }
          nn = vec3(0.5773502691896258, -0.5773502691896258, -0.5773502691896258);
          nd = dot(nn, d); if (nd > 1e-5) { tt = h / nd; if (tt < tMin) { tMin = tt; nBest = nn; } }
          nn = vec3(-0.5773502691896258, 0.5773502691896258, 0.5773502691896258);
          nd = dot(nn, d); if (nd > 1e-5) { tt = h / nd; if (tt < tMin) { tMin = tt; nBest = nn; } }
          nn = vec3(-0.5773502691896258, 0.5773502691896258, -0.5773502691896258);
          nd = dot(nn, d); if (nd > 1e-5) { tt = h / nd; if (tt < tMin) { tMin = tt; nBest = nn; } }
          nn = vec3(-0.5773502691896258, -0.5773502691896258, 0.5773502691896258);
          nd = dot(nn, d); if (nd > 1e-5) { tt = h / nd; if (tt < tMin) { tMin = tt; nBest = nn; } }
          nn = vec3(-0.5773502691896258, -0.5773502691896258, -0.5773502691896258);
          nd = dot(nn, d); if (nd > 1e-5) { tt = h / nd; if (tt < tMin) { tMin = tt; nBest = nn; } }
          tOut = tMin;
          nOut = nBest;
        }

        void isoExit(vec3 d, float R, out float tOut, out vec3 nOut) {
          float h = R * ICO_DODE_H_R;
          float tMin = 1e10;
          vec3 nBest = vec3(-0.5773502692, 0.5773502692, 0.5773502692);
          vec3 nn;
          float nd, tt;
          nn = vec3(-0.5773502692, 0.5773502692, 0.5773502692);
          nd = dot(nn, d); if (nd > 1e-5) { tt = h / nd; if (tt < tMin) { tMin = tt; nBest = nn; } }
          nn = vec3(0.0, 0.9341723590, 0.3568220898);
          nd = dot(nn, d); if (nd > 1e-5) { tt = h / nd; if (tt < tMin) { tMin = tt; nBest = nn; } }
          nn = vec3(0.0, 0.9341723590, -0.3568220898);
          nd = dot(nn, d); if (nd > 1e-5) { tt = h / nd; if (tt < tMin) { tMin = tt; nBest = nn; } }
          nn = vec3(-0.5773502692, 0.5773502692, -0.5773502692);
          nd = dot(nn, d); if (nd > 1e-5) { tt = h / nd; if (tt < tMin) { tMin = tt; nBest = nn; } }
          nn = vec3(-0.9341723590, 0.3568220898, 0.0);
          nd = dot(nn, d); if (nd > 1e-5) { tt = h / nd; if (tt < tMin) { tMin = tt; nBest = nn; } }
          nn = vec3(0.5773502692, 0.5773502692, 0.5773502692);
          nd = dot(nn, d); if (nd > 1e-5) { tt = h / nd; if (tt < tMin) { tMin = tt; nBest = nn; } }
          nn = vec3(-0.3568220898, 0.0, 0.9341723590);
          nd = dot(nn, d); if (nd > 1e-5) { tt = h / nd; if (tt < tMin) { tMin = tt; nBest = nn; } }
          nn = vec3(-0.9341723590, -0.3568220898, 0.0);
          nd = dot(nn, d); if (nd > 1e-5) { tt = h / nd; if (tt < tMin) { tMin = tt; nBest = nn; } }
          nn = vec3(-0.3568220898, 0.0, -0.9341723590);
          nd = dot(nn, d); if (nd > 1e-5) { tt = h / nd; if (tt < tMin) { tMin = tt; nBest = nn; } }
          nn = vec3(0.5773502692, 0.5773502692, -0.5773502692);
          nd = dot(nn, d); if (nd > 1e-5) { tt = h / nd; if (tt < tMin) { tMin = tt; nBest = nn; } }
          nn = vec3(0.5773502692, -0.5773502692, 0.5773502692);
          nd = dot(nn, d); if (nd > 1e-5) { tt = h / nd; if (tt < tMin) { tMin = tt; nBest = nn; } }
          nn = vec3(0.0, -0.9341723590, 0.3568220898);
          nd = dot(nn, d); if (nd > 1e-5) { tt = h / nd; if (tt < tMin) { tMin = tt; nBest = nn; } }
          nn = vec3(0.0, -0.9341723590, -0.3568220898);
          nd = dot(nn, d); if (nd > 1e-5) { tt = h / nd; if (tt < tMin) { tMin = tt; nBest = nn; } }
          nn = vec3(0.5773502692, -0.5773502692, -0.5773502692);
          nd = dot(nn, d); if (nd > 1e-5) { tt = h / nd; if (tt < tMin) { tMin = tt; nBest = nn; } }
          nn = vec3(0.9341723590, -0.3568220898, 0.0);
          nd = dot(nn, d); if (nd > 1e-5) { tt = h / nd; if (tt < tMin) { tMin = tt; nBest = nn; } }
          nn = vec3(0.3568220898, 0.0, 0.9341723590);
          nd = dot(nn, d); if (nd > 1e-5) { tt = h / nd; if (tt < tMin) { tMin = tt; nBest = nn; } }
          nn = vec3(-0.5773502692, -0.5773502692, 0.5773502692);
          nd = dot(nn, d); if (nd > 1e-5) { tt = h / nd; if (tt < tMin) { tMin = tt; nBest = nn; } }
          nn = vec3(-0.5773502692, -0.5773502692, -0.5773502692);
          nd = dot(nn, d); if (nd > 1e-5) { tt = h / nd; if (tt < tMin) { tMin = tt; nBest = nn; } }
          nn = vec3(0.3568220898, 0.0, -0.9341723590);
          nd = dot(nn, d); if (nd > 1e-5) { tt = h / nd; if (tt < tMin) { tMin = tt; nBest = nn; } }
          nn = vec3(0.9341723590, 0.3568220898, 0.0);
          nd = dot(nn, d); if (nd > 1e-5) { tt = h / nd; if (tt < tMin) { tMin = tt; nBest = nn; } }
          tOut = tMin;
          nOut = nBest;
        }

        void dodecaExit(vec3 d, float R, out float tOut, out vec3 nOut) {
          float h = R * ICO_DODE_H_R;
          float tMin = 1e10;
          vec3 nBest = vec3(0.0, 0.8506508083520399, 0.5257311121191337);
          vec3 nn;
          float nd, tt;
          nn = vec3(0.0, 0.8506508083520399, 0.5257311121191337);
          nd = dot(nn, d); if (nd > 1e-5) { tt = h / nd; if (tt < tMin) { tMin = tt; nBest = nn; } }
          nn = vec3(0.8506508083520399, 0.5257311121191337, 0.0);
          nd = dot(nn, d); if (nd > 1e-5) { tt = h / nd; if (tt < tMin) { tMin = tt; nBest = nn; } }
          nn = vec3(0.5257311121191337, 0.0, -0.8506508083520399);
          nd = dot(nn, d); if (nd > 1e-5) { tt = h / nd; if (tt < tMin) { tMin = tt; nBest = nn; } }
          nn = vec3(-0.5257311121191335, 0.0, -0.8506508083520399);
          nd = dot(nn, d); if (nd > 1e-5) { tt = h / nd; if (tt < tMin) { tMin = tt; nBest = nn; } }
          nn = vec3(-0.8506508083520399, -0.5257311121191337, 0.0);
          nd = dot(nn, d); if (nd > 1e-5) { tt = h / nd; if (tt < tMin) { tMin = tt; nBest = nn; } }
          nn = vec3(0.0, 0.8506508083520399, -0.5257311121191337);
          nd = dot(nn, d); if (nd > 1e-5) { tt = h / nd; if (tt < tMin) { tMin = tt; nBest = nn; } }
          nn = vec3(-0.8506508083520399, 0.5257311121191335, 0.0);
          nd = dot(nn, d); if (nd > 1e-5) { tt = h / nd; if (tt < tMin) { tMin = tt; nBest = nn; } }
          nn = vec3(-0.5257311121191335, 0.0, 0.8506508083520399);
          nd = dot(nn, d); if (nd > 1e-5) { tt = h / nd; if (tt < tMin) { tMin = tt; nBest = nn; } }
          nn = vec3(0.0, -0.8506508083520399, -0.5257311121191335);
          nd = dot(nn, d); if (nd > 1e-5) { tt = h / nd; if (tt < tMin) { tMin = tt; nBest = nn; } }
          nn = vec3(0.5257311121191335, 0.0, 0.8506508083520399);
          nd = dot(nn, d); if (nd > 1e-5) { tt = h / nd; if (tt < tMin) { tMin = tt; nBest = nn; } }
          nn = vec3(0.8506508083520399, -0.5257311121191335, 0.0);
          nd = dot(nn, d); if (nd > 1e-5) { tt = h / nd; if (tt < tMin) { tMin = tt; nBest = nn; } }
          nn = vec3(0.0, -0.8506508083520399, 0.5257311121191335);
          nd = dot(nn, d); if (nd > 1e-5) { tt = h / nd; if (tt < tMin) { tMin = tt; nBest = nn; } }
          tOut = tMin;
          nOut = nBest;
        }

        vec3 shapePos(vec3 d, float R, float idx) {
          float t;
          vec3 nn;
          if (idx < 0.5) {
            tetraExit(d, R, t, nn);
            return d * t;
          }
          if (idx < 1.5) return cubePos(d, R);
          if (idx < 2.5) {
            octaExit(d, R, t, nn);
            return d * t;
          }
          if (idx < 3.5) {
            dodecaExit(d, R, t, nn);
            return d * t;
          }
          isoExit(d, R, t, nn);
          return d * t;
        }

        vec3 shapeNrm(vec3 d, float R, float idx) {
          float t;
          vec3 nn;
          if (idx < 0.5) {
            tetraExit(d, R, t, nn);
            return nn;
          }
          if (idx < 1.5) return cubeNrm(d);
          if (idx < 2.5) {
            octaExit(d, R, t, nn);
            return nn;
          }
          if (idx < 3.5) {
            dodecaExit(d, R, t, nn);
            return nn;
          }
          isoExit(d, R, t, nn);
          return nn;
        }

        void main() {
          vec3 dir = normalize(sphereDir);

          float n1 = sin(dot(dir, vec3(2.1, 1.7, 0.9)) * 2.15 + uTime * 0.52);
          float n2 = sin(dot(dir, vec3(-1.35, 2.35, 1.05)) * 2.45 + uTime * 0.4);
          float n3 = sin(dot(dir, vec3(0.55, -1.65, 2.75)) * 1.85 + uTime * 0.62);
          float n4 = sin(dot(dir, vec3(1.2, -0.9, 2.2)) * 1.25 + uTime * 0.28);
          float wPos = clamp(uMorph, 0.0, 1.0);
          float bumpScale = (1.0 - smoothstep(0.05, 0.48, wPos));
          float bumpRaw =
            0.072 * n1 + 0.052 * n2 + 0.038 * n3 + 0.026 * n4;
          float bump = bumpScale * bumpRaw / (1.0 + abs(bumpRaw) * 0.58);

          float ruggedW = bumpScale * (1.0 - smoothstep(0.0, 0.40, wPos));
          float h1 = sin(dot(dir, vec3(3.9, 1.4, 2.2)) * 6.9 + uTime * 1.12);
          float h2 = sin(dot(dir, vec3(-2.2, 3.7, 1.9)) * 6.1 + uTime * 0.94);
          float h3 = sin(dot(dir, vec3(1.3, -2.5, 4.1)) * 5.4 + uTime * 1.2);
          float h4 = sin(dot(dir, vec3(2.8, 2.9, -3.3)) * 7.2 + uTime * 0.82);
          float rugged = ruggedW * 0.058 * (h1 + 0.52 * h2 + 0.4 * h3 + 0.26 * h4);
          vec3 blob = dir * uRadius * (1.0 + bump + rugged);

          vec3 target = shapePos(dir, uRadius, uShapeIndex);
          float snapT = 1.0 - pow(max(0.0, 1.0 - wPos), 5.25);
          vec3 morphed = mix(blob, target, snapT);

          float mA = sin(dot(dir, vec3(5.1, 0.9, 2.4)) * 5.0 + uTime * 1.06);
          float mB = sin(dot(dir, vec3(1.1, 5.8, 1.7)) * 5.4 + uTime * 0.9);
          float mC = sin(dot(dir, vec3(2.6, 1.8, 5.2)) * 4.7 + uTime * 1.14);
          float rawNMix = ruggedW * (1.0 - smoothstep(0.26, 0.52, wPos));
          vec3 blobN = normalize(dir + rawNMix * 0.24 * vec3(mA, mB, mC));
          vec3 targN = shapeNrm(dir, uRadius, uShapeIndex);
          float normalW = max(smoothstep(0.002, 0.55, snapT), step(0.96, snapT));
          vec3 nLocal = normalize(mix(blobN, targN, normalW));

          vWorldNormal = normalize(mat3(modelMatrix) * nLocal);
          vec4 wp = modelMatrix * vec4(morphed, 1.0);
          vWorldPos = wp.xyz;
          vLocalPos = morphed;
          vMorph = snapT;
          gl_Position = projectionMatrix * viewMatrix * wp;
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uDark;
        uniform float uLightBackdrop;
        uniform float uAiryGem;
        uniform float uBlueRefractMix;
        uniform vec3 uLightDir;
        uniform samplerCube envMap;
        uniform float uShapeIndex;
        uniform mat3 uNormalMatrix;
        uniform float uFacetSharp;
        uniform float uFacetQuantize;
        varying vec3 vWorldNormal;
        varying vec3 vWorldPos;
        varying vec3 vLocalPos;
        varying float vMorph;

        vec3 envSample(samplerCube cube, vec3 dir, float dark) {
          vec3 c = textureCube(cube, dir).rgb;
          float denom = mix(1.05, 0.8, dark);
          c = c / (c + vec3(denom));
          return mix(c, c * c, mix(0.18, 0.035, dark));
        }

        vec3 innerVolumeShaded(
          vec3 n,
          vec3 v,
          vec3 L,
          float fresnel,
          float morph,
          float dark,
          float gemBlend
        ) {
          vec3 Lfill = normalize(vec3(-0.55, -0.2, 0.82));
          float polish = smoothstep(0.14, 0.86, morph) * (1.0 - gemBlend);
          float raw = clamp(1.0 - smoothstep(0.14, 0.86, morph), 0.0, 1.0);

          float ndl = max(dot(n, L), 0.0);
          float roughBlob = pow(max(ndl, 0.02), 0.58) * 0.78 + 0.14;
          float rawGrain = raw * (1.0 - gemBlend * 0.92);
          roughBlob += rawGrain * 0.11 * sin(dot(n, vec3(4.2, 2.8, 1.6)) * 7.5 + uTime * 1.35);
          roughBlob += rawGrain * 0.06 * sin(dot(n, vec3(-1.5, 5.1, 2.3)) * 9.2 + uTime * 1.05);
          float tightGeo = pow(max(ndl, 0.035), 0.74);
          float diff = mix(roughBlob, tightGeo, polish);
          diff = mix(diff, diff * diff, polish * 0.5);

          float ndfill = max(dot(n, Lfill), 0.0);
          float fillW = mix(0.22, 0.42, dark);
          diff = clamp(diff + ndfill * fillW * mix(1.15, 1.0, polish), 0.0, 1.0);

          vec3 sh, mid, hi, rim;
          if (dark < 0.5) {
            sh  = vec3(0.03, 0.16, 0.82);
            mid = vec3(0.07, 0.34, 0.96);
            hi  = vec3(0.22, 0.52, 1.0);
            rim = vec3(0.38, 0.68, 1.0);
          } else {
            sh  = vec3(0.16, 0.38, 0.93);
            mid = vec3(0.38, 0.60, 1.0);
            hi  = vec3(0.58, 0.80, 1.0);
            rim = vec3(0.70, 0.90, 1.0);
          }

          vec3 body = mix(
            mix(sh, mid, smoothstep(0.1, 0.52, diff)),
            hi,
            smoothstep(0.42, 0.96, diff)
          );
          body = mix(body, mix(body, mid, 0.35), raw * 0.22);

          vec3 H = normalize(L + v);
          float specPw = mix(mix(12.0, 22.0, raw), 118.0, polish);
          float specAmp = mix(0.14, 1.38, polish);
          float ndh = max(dot(n, H), 0.0);
          float spec = (pow(ndh, specPw) * specAmp + pow(ndh, 36.0) * specAmp * 0.06) * (1.0 - gemBlend * 0.75);
          vec3 specTint = mix(vec3(0.82, 0.93, 1.0), vec3(0.9, 0.96, 1.0), dark);
          body += specTint * spec;

          vec3 H2 = normalize(Lfill + v);
          float spec2Pw = mix(mix(8.0, 18.0, raw), 72.0, polish);
          float spec2Amp = mix(0.08, 0.58, polish);
          float ndh2 = max(dot(n, H2), 0.0);
          float spec2 = pow(ndh2, spec2Pw) * spec2Amp * (1.0 - gemBlend * 0.75);
          body += vec3(0.78, 0.9, 1.0) * spec2 * mix(1.0, 1.08, dark);

          float f = pow(fresnel, mix(1.05, 1.2, polish));
          body = mix(body, rim, f * mix(0.18, 0.52, polish));

          vec3 deepShift = mix(vec3(0.95, 0.97, 1.08), vec3(0.94, 0.96, 1.1), dark);
          body = mix(body, body * deepShift, f * mix(0.1, 0.24, polish));

          float veilRaw = 0.94 + 0.06 * sin(uTime * 0.65 + dot(n, vec3(2.3, 1.1, 0.9)) * 5.5);
          float veilPolish = 1.0;
          float veil = mix(veilRaw, veilPolish, polish);
          return clamp(body * veil, 0.0, 1.0);
        }

        vec3 thinFilmIridescence(float cosTheta, float dark) {
          float t = 1.0 - cosTheta;
          vec3 blue   = mix(vec3(0.08, 0.28, 0.92), vec3(0.22, 0.48, 1.0), dark);
          vec3 indigo = mix(vec3(0.18, 0.14, 0.88), vec3(0.38, 0.32, 0.99), dark);
          vec3 violet = mix(vec3(0.42, 0.12, 0.92), vec3(0.62, 0.38, 1.0), dark);
          vec3 col = blue;
          col = mix(col, indigo, smoothstep(0.18, 0.52, t));
          col = mix(col, violet, smoothstep(0.48, 0.82, t));
          return col;
        }

        vec3 brilliantFacetNormalHard(vec3 p) {
          vec3 u = normalize(p);
          float lon = atan(u.z, u.x);
          float lat = asin(clamp(u.y, -1.0, 1.0));
          float nLon = 14.0;
          float nLat = 9.0;
          float lonQ = floor(lon / (6.2831853 / nLon) + 0.5) * (6.2831853 / nLon);
          float latQ = floor((lat + 1.5707963) / (3.14159265 / nLat) + 0.5) * (3.14159265 / nLat) - 1.5707963;
          float cl = cos(latQ);
          return normalize(vec3(cl * cos(lonQ), sin(latQ), cl * sin(lonQ)));
        }

        vec3 snapGemNormalHard(vec3 p, float shapeIdx) {
          return brilliantFacetNormalHard(p);
        }

        vec3 snapGemNormal(vec3 p, float shapeIdx) {
          return normalize(mix(normalize(p), brilliantFacetNormalHard(p), uFacetQuantize));
        }

        vec3 gemMirrorShaded(
          vec3 n,
          vec3 v,
          vec3 L,
          samplerCube cube,
          float dark,
          float shapeIdx
        ) {
          float ndv = clamp(dot(n, v), 0.0, 1.0);

          vec3 iriColor = thinFilmIridescence(ndv, dark);

          vec3 R = reflect(-v, n);
          vec3 envRaw = envSample(cube, R, dark);
          vec3 envC = max(envRaw, iriColor * mix(0.18, 0.3, dark));
          envC = mix(envC, envC * iriColor, mix(0.38, 0.22, dark));

          vec3 F0 = mix(vec3(0.52, 0.48, 0.88), vec3(0.62, 0.58, 0.96), dark);
          vec3 F = F0 + (1.0 - F0) * pow(1.0 - ndv, 5.0);
          vec3 lit = envC * mix(F, iriColor * 0.8 + F * 0.4, 0.5) * mix(1.18, 1.68, dark);

          float ndl = max(dot(n, L), 0.0);
          vec3 diff = iriColor * (ndl * mix(0.72, 0.86, dark) + mix(0.2, 0.26, dark));

          vec3 H = normalize(L + v);
          float nh = max(dot(n, H), 0.0);
          float specNdH = pow(nh, 168.0) * 1.22 + pow(nh, 42.0) * 0.09;
          vec3 sunSpec = mix(vec3(0.92, 0.96, 1.0), iriColor + 0.4, 0.45) * specNdH * mix(1.35, 1.72, dark);

          float fe = pow(1.0 - ndv, 2.85);
          vec3 rimCol = thinFilmIridescence(0.05, dark);
          vec3 rim = rimCol * fe * mix(0.52, 0.72, dark);

          return clamp(diff + lit + sunSpec + rim, 0.0, 1.0);
        }

        void main() {
          float polish = smoothstep(0.14, 0.86, vMorph);
          float gemW = smoothstep(0.3, 0.84, vMorph);
          float raw = clamp(1.0 - polish, 0.0, 1.0);

          vec3 smoothN = normalize(vWorldNormal);
          float gritAmt = 0.16 * raw * raw * (1.0 - smoothstep(0.12, 0.32, vMorph));
          vec3 grit = gritAmt * vec3(
            sin(dot(vWorldPos, vec3(23.2, 14.7, 19.1)) + uTime * 1.5),
            sin(dot(vWorldPos, vec3(17.1, 28.4, 9.3)) + uTime * 1.15),
            sin(dot(vWorldPos, vec3(11.5, 13.2, 27.8)) + uTime * 1.28)
          );
          smoothN = normalize(smoothN + grit);

          vec3 v = normalize(cameraPosition - vWorldPos);

          vec3 gemBlend = snapGemNormal(vLocalPos, uShapeIndex);
          vec3 gemHardOnly = snapGemNormalHard(vLocalPos, uShapeIndex);
          vec3 gemLocalN = normalize(mix(gemBlend, gemHardOnly, clamp(uFacetSharp, 0.0, 1.0)));
          vec3 gemWorldN = normalize(uNormalMatrix * gemLocalN);
          float gemSnap = smoothstep(0.46, 0.86, vMorph);
          float gemSnapFull = smoothstep(0.58, 0.88, vMorph);
          vec3 nBlend = normalize(mix(smoothN, gemWorldN, gemSnap));
          vec3 n = normalize(mix(nBlend, gemWorldN, gemSnapFull));
          float fresnel = pow(1.0 - clamp(abs(dot(n, v)), 0.0, 1.0), 1.38);

          vec3 L = normalize(uLightDir);
          vec3 blobMat = innerVolumeShaded(n, v, L, fresnel, vMorph, uDark, gemW);
          vec3 gemMat = gemMirrorShaded(n, v, L, envMap, uDark, uShapeIndex);
          vec3 refractBlues = mix(blobMat, gemMat, gemW);

          float ndvSafe = clamp(dot(n, v), 0.0, 1.0);
          float Fsch = 0.038 + 0.962 * pow(1.0 - ndvSafe, 5.0);
          float geomEdge = smoothstep(0.05, 0.9, vMorph);
          float envPolish = mix(0.18, 1.0, polish);
          float envAdd = (1.0 - gemW * 0.62);

          vec3 Renv = reflect(-v, n);
          vec3 envReflected = envSample(envMap, Renv, uDark);
          float reflGain = mix(0.06, 0.2, geomEdge) * mix(0.82, 1.02, uDark) * mix(1.0, 1.14, uAiryGem);
          float gemReflBoost = 1.0 + gemW * gemW * 0.35;
          vec3 envRefTint = mix(vec3(1.0), mix(vec3(0.55, 0.72, 1.0), vec3(0.62, 0.78, 1.0), uDark), 0.55);
          refractBlues += envReflected * envRefTint * Fsch * reflGain * envPolish * envAdd * gemReflBoost;

          vec3 Traw = refract(-v, n, mix(0.9, 0.82, uAiryGem));
          vec3 Tenv = (dot(Traw, Traw) > 1.0e-6) ? normalize(Traw) : Renv;
          vec3 envRefracted = envSample(envMap, Tenv, uDark);
          vec3 tint = mix(vec3(0.78, 0.9, 1.0), vec3(0.84, 0.92, 1.0), uDark);
          tint = mix(tint, vec3(0.9, 0.95, 1.0), uAiryGem * 0.65);
          float refrGain =
            mix(0.3, 0.13, geomEdge) * (1.0 - Fsch * 0.68) * mix(1.0, 1.22, uDark) * envPolish * mix(1.0, 2.35, uAiryGem);
          float refrThroughKill = mix(1.0, 0.32, smoothstep(0.42, 0.9, vMorph));
          refrThroughKill = mix(refrThroughKill, mix(0.78, 1.0, polish), uAiryGem);
          float refrBody = mix(0.55, 0.24, uAiryGem);
          float refrEnvW = mix(0.54, 0.88, uAiryGem);
          refractBlues = mix(
            refractBlues,
            refractBlues * refrBody + envRefracted * tint * refrEnvW,
            clamp(refrGain * mix(0.42, 1.0, polish) * refrThroughKill * envAdd, 0.0, 0.94)
          );

          vec3 skyRim = mix(vec3(0.92, 0.96, 1.0), vec3(0.96, 0.99, 1.0), uDark);
          skyRim = mix(skyRim, vec3(0.40, 0.58, 0.99), uLightBackdrop * 0.75);
          float rimEnv = pow(fresnel, 1.32) * mix(0.08, 0.16, geomEdge) * mix(1.0, 1.18, uDark);
          refractBlues += envReflected * skyRim * rimEnv * envPolish * envAdd * 0.55;

          refractBlues = clamp(refractBlues, 0.0, 1.0);

          vec3 lightHi = vec3(0.42, 0.54, 0.9);
          vec3 lightLo = vec3(0.1, 0.22, 0.78);
          vec3 darkHi = vec3(0.42, 0.55, 0.94);
          vec3 darkLo = vec3(0.25, 0.40, 0.90);
          vec3 hi = mix(lightHi, darkHi, uDark);
          vec3 lo = mix(lightLo, darkLo, uDark);
          float fBlend = mix(0.38, 0.32, uDark);
          vec3 base = mix(hi, lo, fresnel * fBlend);
          base = mix(base, vec3(0.56, 0.74, 1.0), uAiryGem * mix(0.35, 0.85, 1.0 - fresnel));

          float mixBase = mix(0.88, 0.66, uDark);
          float mixEdge = mix(0.98, 0.92, uDark);
          float mixAmt = min(uBlueRefractMix * (mixBase + mixEdge * fresnel) + 0.12, 1.0);
          mixAmt = min(mixAmt + uAiryGem * 0.24, 1.0);
          vec3 col = mix(base, refractBlues, mixAmt);
          float lum = dot(col, vec3(0.2126, 0.7152, 0.0722));
          float sat = mix(1.32, 1.05, uDark);
          sat = mix(sat, 0.92, uAiryGem * 0.55);
          col = mix(vec3(lum), col, sat);
          col = pow(max(col, vec3(1e-5)), mix(vec3(0.94), vec3(1.0), uDark));
          col *= mix(1.0, 1.09, uDark);
          if (uLightBackdrop > 0.01) {
            float Lpk = dot(col, vec3(0.2126, 0.7152, 0.0722));
            float g = smoothstep(0.62, 0.96, Lpk) * uLightBackdrop;
            vec3 coolPeak = vec3(0.38, 0.56, 1.0);
            vec3 violetPeak = vec3(0.58, 0.42, 0.98);
            vec3 peakTint = mix(coolPeak, violetPeak, 0.4);
            col = mix(col, peakTint, g * 0.6);
            col = mix(col, col * vec3(0.88, 0.93, 1.08), g * 0.45);
            col = clamp(col, 0.0, 1.0);
          }
          gl_FragColor = vec4(col, 1.0);
        }
      `,
    });

    diamondBlobTopo = true;
    diamondCachedShapeSlot = 0;
    diamondMesh = new THREE.Mesh(createBlobGeometry(diamondRadius), diamondMaterial);
    diamondMesh.rotation.set(0.35, 0.6, 0.15);
    diamondMesh.renderOrder = 0;

    tiltGroup.add(diamondMesh);

    if (USE_HERO_GLASS_SPHERE) {
      const glassMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0,
        roughness: 0.014,
        transmission: 0.992,
        thickness: 0.006,
        ior: 1.52,
        envMap: envCube,
        envMapIntensity: 0.86,
        clearcoat: 0.38,
        clearcoatRoughness: 0.06,
        specularIntensity: 0.95,
        attenuationDistance: Infinity,
        attenuationColor: new THREE.Color(0xffffff),
        side: THREE.FrontSide,
      });
      glassMesh = new THREE.Mesh(new THREE.SphereGeometry(SPHERE_RADIUS, 64, 64), glassMat);
      glassMesh.renderOrder = 1;

      gradientMesh = new THREE.Mesh(
        new THREE.SphereGeometry(SPHERE_RADIUS * 1.0006, 64, 64),
        new THREE.ShaderMaterial({
          transparent: true,
          depthWrite: false,
          side: THREE.FrontSide,
          uniforms: {
            uBlue: { value: new THREE.Color().copy(RIM_BLUE_LIGHT) },
            uTime: { value: 0 },
            uMaxAlpha: { value: readSiteDarkMode() ? 0.28 : 0.036 },
            uBlueMix: { value: readSiteDarkMode() ? 0.28 : 0.32 },
            uBodyStrength: { value: readSiteDarkMode() ? 0.09 : 0.0025 },
          },
          vertexShader: `
            varying vec3 vNormal;
            varying vec3 vViewDir;
            void main() {
              vec4 wp = modelMatrix * vec4(position, 1.0);
              vViewDir  = normalize(wp.xyz - cameraPosition);
              vNormal   = normalize(mat3(modelMatrix) * normal);
              gl_Position = projectionMatrix * viewMatrix * wp;
            }
          `,
          fragmentShader: `
            uniform vec3  uBlue;
            uniform float uTime;
            uniform float uMaxAlpha;
            uniform float uBlueMix;
            uniform float uBodyStrength;
            varying vec3  vNormal;
            varying vec3  vViewDir;

            void main() {
              float ndv = clamp(dot(vNormal, -vViewDir), 0.0, 1.0);
              float edge = 1.0 - ndv;
              float rimTaper = 1.0 - smoothstep(0.84, 0.996, edge);
              float wash = pow(edge, 1.14);
              wash = smoothstep(0.05, 0.94, wash) * rimTaper;
              float body = pow(edge, 2.35) * uBodyStrength;
              float w1 = sin(uTime * 0.31 + dot(vNormal, vec3(1.15, 0.55, 0.35)) * 2.6);
              float w2 = sin(uTime * 0.19 + dot(vNormal, vec3(-0.4, 0.9, 0.55)) * 2.1);
              float flow = 0.82 + 0.18 * (0.5 + 0.5 * w1) * (0.5 + 0.5 * w2);
              float alpha = (wash * 0.86 + body) * flow * uMaxAlpha;
              vec3 tint = mix(vec3(1.0), uBlue, uBlueMix);
              gl_FragColor = vec4(tint, alpha);
            }
          `,
        })
      );
      gradientMesh.renderOrder = 2;

      tiltGroup.add(glassMesh);
      tiltGroup.add(gradientMesh);
    }

    syncTheme();
  };

  new THREE.RGBELoader().load(
    HDRI_PATH,
    (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      buildScene(texture);
    },
    undefined,
    () => {
      console.warn('[refining-blob] HDRI load failed, using procedural environment.');
      buildScene(createFallbackEquirectTexture());
    }
  );

  syncTheme();

  const observer = new MutationObserver(() => syncTheme());
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

  let mouse = new THREE.Vector2(0, 0);
  let targetMouse = new THREE.Vector2(0, 0);

  let dragYaw = 0;
  let dragPitch = 0;
  let dragPointerId = null;
  let lastDragX = 0;
  let lastDragY = 0;
  const DRAG_SENS = 0.0055;
  const MAX_DRAG_PITCH = 0.72;

  const reducedMotionMq = window.matchMedia('(prefers-reduced-motion: reduce)');
  let prefersReducedMotion = reducedMotionMq.matches;
  const onReducedMotionChange = () => {
    prefersReducedMotion = reducedMotionMq.matches;
  };
  if (typeof reducedMotionMq.addEventListener === 'function') {
    reducedMotionMq.addEventListener('change', onReducedMotionChange);
  } else {
    reducedMotionMq.addListener(onReducedMotionChange);
  }

  function endDragInspect(e) {
    if (dragPointerId == null || e.pointerId !== dragPointerId) return;
    try {
      container.releasePointerCapture(dragPointerId);
    } catch {
      /* ignore */
    }
    dragPointerId = null;
    container.style.cursor = '';
  }

  container.addEventListener('pointerenter', () => {
    hoverTarget = 1;
  });
  container.addEventListener('pointerleave', () => {
    hoverTarget = 0;
    targetMouse.set(0, 0);
  });
  container.addEventListener('pointerdown', (e) => {
    if (e.button != null && e.button !== 0) return;
    dragPointerId = e.pointerId;
    lastDragX = e.clientX;
    lastDragY = e.clientY;
    try {
      container.setPointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
    container.style.cursor = 'grabbing';
  });
  container.addEventListener(
    'pointermove',
    (e) => {
      if (dragPointerId != null && e.pointerId === dragPointerId) {
        e.preventDefault();
        const dx = e.clientX - lastDragX;
        const dy = e.clientY - lastDragY;
        lastDragX = e.clientX;
        lastDragY = e.clientY;
        dragYaw += dx * DRAG_SENS;
        dragPitch += dy * DRAG_SENS;
        dragPitch = THREE.MathUtils.clamp(dragPitch, -MAX_DRAG_PITCH, MAX_DRAG_PITCH);
      }
      const r = container.getBoundingClientRect();
      targetMouse.x = THREE.MathUtils.clamp(((e.clientX - r.left) / r.width) * 2 - 1, -1, 1);
      targetMouse.y = THREE.MathUtils.clamp(-((e.clientY - r.top) / r.height) * 2 + 1, -1, 1);
    },
    { passive: false }
  );
  container.addEventListener('pointerup', endDragInspect);
  container.addEventListener('pointercancel', endDragInspect);

  function morphCurve(t) {
    function smootherstep01(s) {
      const x = Math.max(0, Math.min(1, s));
      return x * x * x * (x * (x * 6 - 15) + 10);
    }
    if (t < 0.24) return 0;
    if (t < 0.48) return smootherstep01((t - 0.24) / 0.24);
    if (t < 0.68) return 1;
    if (t < 0.92) return 1.0 - smootherstep01((t - 0.68) / 0.24);
    return 0;
  }

  let heroVisible = true;
  const heroVisObs = new IntersectionObserver(
    ([entry]) => { heroVisible = entry.isIntersecting; },
    { threshold: 0 }
  );
  heroVisObs.observe(container);

  function animate() {
    requestAnimationFrame(animate);

    const dt = Math.min(morphClock.getDelta(), 0.05);

    if (!heroVisible) return;

    hoverProgress += (hoverTarget - hoverProgress) * 0.08;
    mouse.x += (targetMouse.x - mouse.x) * 0.06;
    mouse.y += (targetMouse.y - mouse.y) * 0.06;

    if (USE_HERO_GLASS_SPHERE && glassMesh) {
      if (!prefersReducedMotion) {
        glassSpinY += 0.001 + hoverProgress * 0.002;
        glassSpinX += 0.00035 + hoverProgress * 0.00055;
      }
      const ig = 0.35 + hoverProgress * 0.65;
      glassMesh.rotation.x = glassSpinX + mouse.y * 0.11 * ig;
      glassMesh.rotation.y = glassSpinY + mouse.x * 0.14 * ig;
    }
    if (USE_HERO_GLASS_SPHERE && gradientMesh && gradientMesh.material.uniforms && !prefersReducedMotion) {
      gradientMesh.material.uniforms.uTime.value += 0.0075 * (1 + hoverProgress * 0.35);
    }

    const darkNow = readSiteDarkMode();
    if (!darkNow) {
      const k = 0.32 + hoverProgress * 0.55;
      keyLight.position.set(
        keyLightBase.x + mouse.x * 3.4 * k,
        keyLightBase.y + mouse.y * 2.2 * k,
        keyLightBase.z - mouse.x * 1.1 * k + mouse.y * 0.75 * k
      );
    } else {
      keyLight.position.copy(keyLightBase);
    }
    if (diamondMesh && diamondMesh.material.uniforms) {
      const u = diamondMesh.material.uniforms;
      u.uDark.value = GEM_PALETTE_U_DARK;
      u.uLightBackdrop.value = readSiteDarkMode() ? 0.0 : 1.0;
      u.uAiryGem.value = readSiteDarkMode() ? 0.0 : 1.0;
      u.uFacetQuantize.value = FACET_QUANTIZE;
      u.uLightDir.value.copy(keyLight.position).normalize();

      if (prefersReducedMotion) {
        const STATIC_PLATONIC = 4;
        u.uMorph.value = 1.0;
        u.uShapeIndex.value = STATIC_PLATONIC;
        if (diamondBlobTopo || diamondCachedShapeSlot !== STATIC_PLATONIC) {
          diamondBlobTopo = false;
          diamondCachedShapeSlot = STATIC_PLATONIC;
          diamondMesh.geometry.dispose();
          diamondMesh.geometry = createDiamondGeometry(STATIC_PLATONIC, storedDiamondRadius);
        }
        u.uFacetSharp.value = FACET_SHARP_MAX;
      } else {
        const SHAPE_COUNT = 10;
        const spinBoost = 1.0 + hoverProgress * 1.8;
        diamondMesh.rotation.x += (0.00055 + hoverProgress * 0.0012) * spinBoost;
        diamondMesh.rotation.y += (0.00085 + hoverProgress * 0.0018) * spinBoost;
        u.uTime.value += 0.01 * spinBoost;

        morphPhase += 0.09 * (1 + hoverProgress * 0.65) * dt;
        const shapeSlot = Math.floor(morphPhase) % SHAPE_COUNT;
        const platonicKind = shapeSlot % 5;
        const local = morphPhase - Math.floor(morphPhase);
        const m = morphCurve(local);
        u.uMorph.value = m;
        u.uShapeIndex.value = platonicKind;

        const BLOB_TOPO_MORPH = 0.22;
        const SHAPE_TOPO_MORPH = 0.34;
        if (m <= BLOB_TOPO_MORPH) {
          if (!diamondBlobTopo) {
            diamondBlobTopo = true;
            diamondMesh.geometry.dispose();
            diamondMesh.geometry = createBlobGeometry(storedDiamondRadius);
          }
        } else if (m >= SHAPE_TOPO_MORPH) {
          if (diamondBlobTopo || diamondCachedShapeSlot !== platonicKind) {
            diamondBlobTopo = false;
            diamondCachedShapeSlot = platonicKind;
            diamondMesh.geometry.dispose();
            diamondMesh.geometry = createDiamondGeometry(platonicKind, storedDiamondRadius);
          }
        }

        if (diamondBlobTopo) {
          u.uFacetSharp.value = 0.0;
        } else {
          u.uFacetSharp.value = THREE.MathUtils.smoothstep(m, 0.38, 0.82) * FACET_SHARP_MAX;
        }
      }

      diamondMesh.updateMatrixWorld(true);
      diamondNormalMat.getNormalMatrix(diamondMesh.matrixWorld);
      u.uNormalMatrix.value.copy(diamondNormalMat);

      const shadowScale = THREE.MathUtils.lerp(1.08, 0.88, u.uMorph.value);
      shadowMesh.scale.setScalar(shadowScale);
      const baseShadowOpacity = darkNow ? 0.9 : 0.5;
      shadowMesh.material.opacity = baseShadowOpacity * THREE.MathUtils.lerp(1.0, 0.86, u.uMorph.value);
    }

    const tiltStrength = 0.08 + hoverProgress * 0.16;
    tiltGroup.rotation.x = mouse.y * tiltStrength;
    tiltGroup.rotation.y = mouse.x * tiltStrength;

    dragInspectGroup.rotation.y = dragYaw;
    dragInspectGroup.rotation.x = dragPitch;

    shadowRoot.position.x = -mouse.x * 0.4;
    shadowRoot.position.z = mouse.y * 0.4;

    renderer.render(scene, camera);
  }
  animate();
}

if (document.readyState === 'complete' || document.readyState === 'interactive') {
  setTimeout(initRefiningBlob, 100);
} else {
  document.addEventListener('DOMContentLoaded', () => setTimeout(initRefiningBlob, 100));
}

/**
 * ============================================================================
 * SECTION B — gem-tictactoe.js (3×3 gem board)
 * ============================================================================
 */

(function () {
  'use strict';

  const HDRI_PATH = '/images/hdri/studio_small_09_1k.hdr';

  function readSiteDarkMode() {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') return true;
    if (saved === 'light') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  const GEM_PALETTE_U_DARK = 1.0;

  const VERTEX_GEM = `
        uniform float uMorph;
        uniform float uShapeIndex;
        uniform float uShapeIndexB;
        uniform float uMorphAB;
        uniform float uRadius;
        uniform float uTime;

        attribute vec3 sphereDir;

        varying vec3 vWorldNormal;
        varying vec3 vWorldPos;
        varying vec3 vLocalPos;
        varying vec3 vLocalPlatonicN;
        varying float vMorph;

        const float TETRA_H_R = 0.3333333333;
        const float OCTA_H_R = 0.5773502691896258;
        const float ICO_DODE_H_R = 0.7946544722917661;

        vec3 cubePos(vec3 d, float R) {
          float a = R / 1.7320508075688772;
          float m = max(max(abs(d.x), abs(d.y)), abs(d.z));
          return d * a / max(m, 1e-4);
        }

        vec3 cubeNrm(vec3 d) {
          vec3 a = abs(d);
          if (a.x > a.y) {
            if (a.x > a.z) return vec3(d.x >= 0.0 ? 1.0 : -1.0, 0.0, 0.0);
            return vec3(0.0, 0.0, d.z >= 0.0 ? 1.0 : -1.0);
          }
          if (a.y > a.z) return vec3(0.0, d.y >= 0.0 ? 1.0 : -1.0, 0.0);
          return vec3(0.0, 0.0, d.z >= 0.0 ? 1.0 : -1.0);
        }

        void tetraExit(vec3 d, float R, out float tOut, out vec3 nOut) {
          float h = R * TETRA_H_R;
          vec3 n0 = vec3(-0.5773502691896258, 0.5773502691896258, 0.5773502691896258);
          vec3 n1 = vec3(0.5773502691896258, -0.5773502691896258, 0.5773502691896258);
          vec3 n2 = vec3(0.5773502691896258, 0.5773502691896258, -0.5773502691896258);
          vec3 n3 = vec3(-0.5773502691896258, -0.5773502691896258, -0.5773502691896258);
          float tMin = 1e10;
          vec3 nBest = n0;
          float nd;
          nd = dot(n0, d); if (nd > 1e-5) { float t0 = h / nd; if (t0 < tMin) { tMin = t0; nBest = n0; } }
          nd = dot(n1, d); if (nd > 1e-5) { float t1 = h / nd; if (t1 < tMin) { tMin = t1; nBest = n1; } }
          nd = dot(n2, d); if (nd > 1e-5) { float t2 = h / nd; if (t2 < tMin) { tMin = t2; nBest = n2; } }
          nd = dot(n3, d); if (nd > 1e-5) { float t3 = h / nd; if (t3 < tMin) { tMin = t3; nBest = n3; } }
          tOut = tMin;
          nOut = nBest;
        }

        void octaExit(vec3 d, float R, out float tOut, out vec3 nOut) {
          float h = R * OCTA_H_R;
          float tMin = 1e10;
          vec3 nBest = vec3(0.5773502691896258, 0.5773502691896258, 0.5773502691896258);
          vec3 nn;
          float nd, tt;
          nn = vec3(0.5773502691896258, 0.5773502691896258, 0.5773502691896258);
          nd = dot(nn, d); if (nd > 1e-5) { tt = h / nd; if (tt < tMin) { tMin = tt; nBest = nn; } }
          nn = vec3(0.5773502691896258, 0.5773502691896258, -0.5773502691896258);
          nd = dot(nn, d); if (nd > 1e-5) { tt = h / nd; if (tt < tMin) { tMin = tt; nBest = nn; } }
          nn = vec3(0.5773502691896258, -0.5773502691896258, 0.5773502691896258);
          nd = dot(nn, d); if (nd > 1e-5) { tt = h / nd; if (tt < tMin) { tMin = tt; nBest = nn; } }
          nn = vec3(0.5773502691896258, -0.5773502691896258, -0.5773502691896258);
          nd = dot(nn, d); if (nd > 1e-5) { tt = h / nd; if (tt < tMin) { tMin = tt; nBest = nn; } }
          nn = vec3(-0.5773502691896258, 0.5773502691896258, 0.5773502691896258);
          nd = dot(nn, d); if (nd > 1e-5) { tt = h / nd; if (tt < tMin) { tMin = tt; nBest = nn; } }
          nn = vec3(-0.5773502691896258, 0.5773502691896258, -0.5773502691896258);
          nd = dot(nn, d); if (nd > 1e-5) { tt = h / nd; if (tt < tMin) { tMin = tt; nBest = nn; } }
          nn = vec3(-0.5773502691896258, -0.5773502691896258, 0.5773502691896258);
          nd = dot(nn, d); if (nd > 1e-5) { tt = h / nd; if (tt < tMin) { tMin = tt; nBest = nn; } }
          nn = vec3(-0.5773502691896258, -0.5773502691896258, -0.5773502691896258);
          nd = dot(nn, d); if (nd > 1e-5) { tt = h / nd; if (tt < tMin) { tMin = tt; nBest = nn; } }
          tOut = tMin;
          nOut = nBest;
        }

        void isoExit(vec3 d, float R, out float tOut, out vec3 nOut) {
          float h = R * ICO_DODE_H_R;
          float tMin = 1e10;
          vec3 nBest = vec3(-0.5773502692, 0.5773502692, 0.5773502692);
          vec3 nn;
          float nd, tt;
          nn = vec3(-0.5773502692, 0.5773502692, 0.5773502692);
          nd = dot(nn, d); if (nd > 1e-5) { tt = h / nd; if (tt < tMin) { tMin = tt; nBest = nn; } }
          nn = vec3(0.0, 0.9341723590, 0.3568220898);
          nd = dot(nn, d); if (nd > 1e-5) { tt = h / nd; if (tt < tMin) { tMin = tt; nBest = nn; } }
          nn = vec3(0.0, 0.9341723590, -0.3568220898);
          nd = dot(nn, d); if (nd > 1e-5) { tt = h / nd; if (tt < tMin) { tMin = tt; nBest = nn; } }
          nn = vec3(-0.5773502692, 0.5773502692, -0.5773502692);
          nd = dot(nn, d); if (nd > 1e-5) { tt = h / nd; if (tt < tMin) { tMin = tt; nBest = nn; } }
          nn = vec3(-0.9341723590, 0.3568220898, 0.0);
          nd = dot(nn, d); if (nd > 1e-5) { tt = h / nd; if (tt < tMin) { tMin = tt; nBest = nn; } }
          nn = vec3(0.5773502692, 0.5773502692, 0.5773502692);
          nd = dot(nn, d); if (nd > 1e-5) { tt = h / nd; if (tt < tMin) { tMin = tt; nBest = nn; } }
          nn = vec3(-0.3568220898, 0.0, 0.9341723590);
          nd = dot(nn, d); if (nd > 1e-5) { tt = h / nd; if (tt < tMin) { tMin = tt; nBest = nn; } }
          nn = vec3(-0.9341723590, -0.3568220898, 0.0);
          nd = dot(nn, d); if (nd > 1e-5) { tt = h / nd; if (tt < tMin) { tMin = tt; nBest = nn; } }
          nn = vec3(-0.3568220898, 0.0, -0.9341723590);
          nd = dot(nn, d); if (nd > 1e-5) { tt = h / nd; if (tt < tMin) { tMin = tt; nBest = nn; } }
          nn = vec3(0.5773502692, 0.5773502692, -0.5773502692);
          nd = dot(nn, d); if (nd > 1e-5) { tt = h / nd; if (tt < tMin) { tMin = tt; nBest = nn; } }
          nn = vec3(0.5773502692, -0.5773502692, 0.5773502692);
          nd = dot(nn, d); if (nd > 1e-5) { tt = h / nd; if (tt < tMin) { tMin = tt; nBest = nn; } }
          nn = vec3(0.0, -0.9341723590, 0.3568220898);
          nd = dot(nn, d); if (nd > 1e-5) { tt = h / nd; if (tt < tMin) { tMin = tt; nBest = nn; } }
          nn = vec3(0.0, -0.9341723590, -0.3568220898);
          nd = dot(nn, d); if (nd > 1e-5) { tt = h / nd; if (tt < tMin) { tMin = tt; nBest = nn; } }
          nn = vec3(0.5773502692, -0.5773502692, -0.5773502692);
          nd = dot(nn, d); if (nd > 1e-5) { tt = h / nd; if (tt < tMin) { tMin = tt; nBest = nn; } }
          nn = vec3(0.9341723590, -0.3568220898, 0.0);
          nd = dot(nn, d); if (nd > 1e-5) { tt = h / nd; if (tt < tMin) { tMin = tt; nBest = nn; } }
          nn = vec3(0.3568220898, 0.0, 0.9341723590);
          nd = dot(nn, d); if (nd > 1e-5) { tt = h / nd; if (tt < tMin) { tMin = tt; nBest = nn; } }
          nn = vec3(-0.5773502692, -0.5773502692, 0.5773502692);
          nd = dot(nn, d); if (nd > 1e-5) { tt = h / nd; if (tt < tMin) { tMin = tt; nBest = nn; } }
          nn = vec3(-0.5773502692, -0.5773502692, -0.5773502692);
          nd = dot(nn, d); if (nd > 1e-5) { tt = h / nd; if (tt < tMin) { tMin = tt; nBest = nn; } }
          nn = vec3(0.3568220898, 0.0, -0.9341723590);
          nd = dot(nn, d); if (nd > 1e-5) { tt = h / nd; if (tt < tMin) { tMin = tt; nBest = nn; } }
          nn = vec3(0.9341723590, 0.3568220898, 0.0);
          nd = dot(nn, d); if (nd > 1e-5) { tt = h / nd; if (tt < tMin) { tMin = tt; nBest = nn; } }
          tOut = tMin;
          nOut = nBest;
        }

        void dodecaExit(vec3 d, float R, out float tOut, out vec3 nOut) {
          float h = R * ICO_DODE_H_R;
          float tMin = 1e10;
          vec3 nBest = vec3(0.0, 0.8506508083520399, 0.5257311121191337);
          vec3 nn;
          float nd, tt;
          nn = vec3(0.0, 0.8506508083520399, 0.5257311121191337);
          nd = dot(nn, d); if (nd > 1e-5) { tt = h / nd; if (tt < tMin) { tMin = tt; nBest = nn; } }
          nn = vec3(0.8506508083520399, 0.5257311121191337, 0.0);
          nd = dot(nn, d); if (nd > 1e-5) { tt = h / nd; if (tt < tMin) { tMin = tt; nBest = nn; } }
          nn = vec3(0.5257311121191337, 0.0, -0.8506508083520399);
          nd = dot(nn, d); if (nd > 1e-5) { tt = h / nd; if (tt < tMin) { tMin = tt; nBest = nn; } }
          nn = vec3(-0.5257311121191335, 0.0, -0.8506508083520399);
          nd = dot(nn, d); if (nd > 1e-5) { tt = h / nd; if (tt < tMin) { tMin = tt; nBest = nn; } }
          nn = vec3(-0.8506508083520399, -0.5257311121191337, 0.0);
          nd = dot(nn, d); if (nd > 1e-5) { tt = h / nd; if (tt < tMin) { tMin = tt; nBest = nn; } }
          nn = vec3(0.0, 0.8506508083520399, -0.5257311121191337);
          nd = dot(nn, d); if (nd > 1e-5) { tt = h / nd; if (tt < tMin) { tMin = tt; nBest = nn; } }
          nn = vec3(-0.8506508083520399, 0.5257311121191335, 0.0);
          nd = dot(nn, d); if (nd > 1e-5) { tt = h / nd; if (tt < tMin) { tMin = tt; nBest = nn; } }
          nn = vec3(-0.5257311121191335, 0.0, 0.8506508083520399);
          nd = dot(nn, d); if (nd > 1e-5) { tt = h / nd; if (tt < tMin) { tMin = tt; nBest = nn; } }
          nn = vec3(0.0, -0.8506508083520399, -0.5257311121191335);
          nd = dot(nn, d); if (nd > 1e-5) { tt = h / nd; if (tt < tMin) { tMin = tt; nBest = nn; } }
          nn = vec3(0.5257311121191335, 0.0, 0.8506508083520399);
          nd = dot(nn, d); if (nd > 1e-5) { tt = h / nd; if (tt < tMin) { tMin = tt; nBest = nn; } }
          nn = vec3(0.8506508083520399, -0.5257311121191335, 0.0);
          nd = dot(nn, d); if (nd > 1e-5) { tt = h / nd; if (tt < tMin) { tMin = tt; nBest = nn; } }
          nn = vec3(0.0, -0.8506508083520399, 0.5257311121191335);
          nd = dot(nn, d); if (nd > 1e-5) { tt = h / nd; if (tt < tMin) { tMin = tt; nBest = nn; } }
          tOut = tMin;
          nOut = nBest;
        }

        vec3 shapePos(vec3 d, float R, float idx) {
          float t;
          vec3 nn;
          if (idx < 0.5) {
            tetraExit(d, R, t, nn);
            return d * t;
          }
          if (idx < 1.5) return cubePos(d, R);
          if (idx < 2.5) {
            octaExit(d, R, t, nn);
            return d * t;
          }
          if (idx < 3.5) {
            dodecaExit(d, R, t, nn);
            return d * t;
          }
          isoExit(d, R, t, nn);
          return d * t;
        }

        vec3 shapeNrm(vec3 d, float R, float idx) {
          float t;
          vec3 nn;
          if (idx < 0.5) {
            tetraExit(d, R, t, nn);
            return nn;
          }
          if (idx < 1.5) return cubeNrm(d);
          if (idx < 2.5) {
            octaExit(d, R, t, nn);
            return nn;
          }
          if (idx < 3.5) {
            dodecaExit(d, R, t, nn);
            return nn;
          }
          isoExit(d, R, t, nn);
          return nn;
        }

        void main() {
          vec3 dir = normalize(sphereDir);

          float n1 = sin(dot(dir, vec3(2.1, 1.7, 0.9)) * 2.15 + uTime * 0.52);
          float n2 = sin(dot(dir, vec3(-1.35, 2.35, 1.05)) * 2.45 + uTime * 0.4);
          float n3 = sin(dot(dir, vec3(0.55, -1.65, 2.75)) * 1.85 + uTime * 0.62);
          float n4 = sin(dot(dir, vec3(1.2, -0.9, 2.2)) * 1.25 + uTime * 0.28);
          float wPos = clamp(uMorph, 0.0, 1.0);
          float bumpScale = (1.0 - smoothstep(0.05, 0.48, wPos));
          float bumpRaw =
            0.072 * n1 + 0.052 * n2 + 0.038 * n3 + 0.026 * n4;
          float bump = bumpScale * bumpRaw / (1.0 + abs(bumpRaw) * 0.58);

          float ruggedW = bumpScale * (1.0 - smoothstep(0.0, 0.40, wPos));
          float h1 = sin(dot(dir, vec3(3.9, 1.4, 2.2)) * 6.9 + uTime * 1.12);
          float h2 = sin(dot(dir, vec3(-2.2, 3.7, 1.9)) * 6.1 + uTime * 0.94);
          float h3 = sin(dot(dir, vec3(1.3, -2.5, 4.1)) * 5.4 + uTime * 1.2);
          float h4 = sin(dot(dir, vec3(2.8, 2.9, -3.3)) * 7.2 + uTime * 0.82);
          float rugged = ruggedW * 0.058 * (h1 + 0.52 * h2 + 0.4 * h3 + 0.26 * h4);
          vec3 blob = dir * uRadius * (1.0 + bump + rugged);

          vec3 targetA = shapePos(dir, uRadius, uShapeIndex);
          vec3 targetB = shapePos(dir, uRadius, uShapeIndexB);
          float mAB = uMorphAB * uMorphAB * (3.0 - 2.0 * uMorphAB);
          vec3 target = mix(targetA, targetB, mAB);
          float snapT = 1.0 - pow(max(0.0, 1.0 - wPos), 5.25);
          vec3 morphed = mix(blob, target, snapT);

          float mA = sin(dot(dir, vec3(5.1, 0.9, 2.4)) * 5.0 + uTime * 1.06);
          float mB = sin(dot(dir, vec3(1.1, 5.8, 1.7)) * 5.4 + uTime * 0.9);
          float mC = sin(dot(dir, vec3(2.6, 1.8, 5.2)) * 4.7 + uTime * 1.14);
          float rawNMix = ruggedW * (1.0 - smoothstep(0.26, 0.52, wPos));
          vec3 blobN = normalize(dir + rawNMix * 0.24 * vec3(mA, mB, mC));
          vec3 targNA = shapeNrm(dir, uRadius, uShapeIndex);
          vec3 targNB = shapeNrm(dir, uRadius, uShapeIndexB);
          vec3 targN = normalize(mix(targNA, targNB, mAB));
          float normalW = max(smoothstep(0.002, 0.55, snapT), step(0.96, snapT));
          vec3 nLocal = normalize(mix(blobN, targN, normalW));
          vLocalPlatonicN = targN;

          vWorldNormal = normalize(mat3(modelMatrix) * nLocal);
          vec4 wp = modelMatrix * vec4(morphed, 1.0);
          vWorldPos = wp.xyz;
          vLocalPos = morphed;
          vMorph = snapT;
          gl_Position = projectionMatrix * viewMatrix * wp;
        }
      `;
  const FRAGMENT_GEM = `
        uniform float uTime;
        uniform float uDark;
        uniform float uLightBackdrop;
        uniform float uAiryGem;
        uniform float uBlueRefractMix;
        uniform vec3 uLightDir;
        uniform samplerCube envMap;
        uniform float uShapeIndex;
        uniform mat3 uNormalMatrix;
        uniform float uFacetSharp;
        uniform float uFacetQuantize;
        uniform vec3 uGemMul;
        uniform float uSpectralBias;
        varying vec3 vWorldNormal;
        varying vec3 vWorldPos;
        varying vec3 vLocalPos;
        varying vec3 vLocalPlatonicN;
        varying float vMorph;

        vec3 envSample(samplerCube cube, vec3 dir, float dark) {
          vec3 c = textureCube(cube, dir).rgb;
          float denom = mix(1.05, 0.8, dark);
          c = c / (c + vec3(denom));
          return mix(c, c * c, mix(0.18, 0.035, dark));
        }

        vec3 innerVolumeShaded(
          vec3 n,
          vec3 v,
          vec3 L,
          float fresnel,
          float morph,
          float dark,
          float gemBlend
        ) {
          vec3 Lfill = normalize(vec3(-0.55, -0.2, 0.82));
          float polish = smoothstep(0.14, 0.86, morph) * (1.0 - gemBlend);
          float raw = clamp(1.0 - smoothstep(0.14, 0.86, morph), 0.0, 1.0);

          float ndl = max(dot(n, L), 0.0);
          float roughBlob = pow(max(ndl, 0.02), 0.58) * 0.78 + 0.14;
          float rawGrain = raw * (1.0 - gemBlend * 0.92);
          roughBlob += rawGrain * 0.11 * sin(dot(n, vec3(4.2, 2.8, 1.6)) * 7.5 + uTime * 1.35);
          roughBlob += rawGrain * 0.06 * sin(dot(n, vec3(-1.5, 5.1, 2.3)) * 9.2 + uTime * 1.05);
          float tightGeo = pow(max(ndl, 0.035), 0.74);
          float diff = mix(roughBlob, tightGeo, polish);
          diff = mix(diff, diff * diff, polish * 0.5);

          float ndfill = max(dot(n, Lfill), 0.0);
          float fillW = mix(0.22, 0.42, dark);
          diff = clamp(diff + ndfill * fillW * mix(1.15, 1.0, polish), 0.0, 1.0);

          vec3 sh, mid, hi, rim;
          if (dark < 0.5) {
            sh  = vec3(0.03, 0.16, 0.82);
            mid = vec3(0.07, 0.34, 0.96);
            hi  = vec3(0.22, 0.52, 1.0);
            rim = vec3(0.38, 0.68, 1.0);
          } else {
            sh  = vec3(0.16, 0.38, 0.93);
            mid = vec3(0.38, 0.60, 1.0);
            hi  = vec3(0.58, 0.80, 1.0);
            rim = vec3(0.70, 0.90, 1.0);
          }

          vec3 body = mix(
            mix(sh, mid, smoothstep(0.1, 0.52, diff)),
            hi,
            smoothstep(0.42, 0.96, diff)
          );
          body = mix(body, mix(body, mid, 0.35), raw * 0.22);

          vec3 H = normalize(L + v);
          float specPw = mix(mix(12.0, 22.0, raw), 118.0, polish);
          float specAmp = mix(0.14, 1.38, polish);
          float ndh = max(dot(n, H), 0.0);
          float spec = (pow(ndh, specPw) * specAmp + pow(ndh, 36.0) * specAmp * 0.06) * (1.0 - gemBlend * 0.75);
          vec3 specTint = mix(vec3(0.82, 0.93, 1.0), vec3(0.9, 0.96, 1.0), dark);
          body += specTint * spec;

          vec3 H2 = normalize(Lfill + v);
          float spec2Pw = mix(mix(8.0, 18.0, raw), 72.0, polish);
          float spec2Amp = mix(0.08, 0.58, polish);
          float ndh2 = max(dot(n, H2), 0.0);
          float spec2 = pow(ndh2, spec2Pw) * spec2Amp * (1.0 - gemBlend * 0.75);
          body += vec3(0.78, 0.9, 1.0) * spec2 * mix(1.0, 1.08, dark);

          float f = pow(fresnel, mix(1.05, 1.2, polish));
          body = mix(body, rim, f * mix(0.18, 0.52, polish));

          vec3 deepShift = mix(vec3(0.95, 0.97, 1.08), vec3(0.94, 0.96, 1.1), dark);
          body = mix(body, body * deepShift, f * mix(0.1, 0.24, polish));

          float veilRaw = 0.94 + 0.06 * sin(uTime * 0.65 + dot(n, vec3(2.3, 1.1, 0.9)) * 5.5);
          float veilPolish = 1.0;
          float veil = mix(veilRaw, veilPolish, polish);
          return clamp(body * veil, 0.0, 1.0);
        }

        vec3 thinFilmIridescence(float cosTheta, float dark) {
          float s = clamp(uSpectralBias, 0.0, 1.0);
          float t = clamp((1.0 - cosTheta) + s * 0.34, 0.0, 1.0);
          vec3 blue   = mix(vec3(0.08, 0.28, 0.92), vec3(0.22, 0.48, 1.0), dark);
          vec3 indigo = mix(vec3(0.18, 0.14, 0.88), vec3(0.38, 0.32, 0.99), dark);
          vec3 violet = mix(vec3(0.42, 0.12, 0.92), vec3(0.62, 0.38, 1.0), dark);
          vec3 cool = mix(blue, indigo, s * 0.35);
          vec3 warm = mix(indigo, violet, 0.35 + s * 0.55);
          vec3 col = mix(cool, warm, 0.25 + s * 0.35);
          float ti = t * t * (3.0 - 2.0 * t);
          col = mix(col, indigo, smoothstep(0.05 - s * 0.06, 0.58 - s * 0.22, ti));
          col = mix(col, violet, smoothstep(0.18 - s * 0.12, 0.92 - s * 0.12, ti));
          return col;
        }

        vec3 brilliantFacetNormalHard(vec3 p) {
          vec3 u = normalize(p);
          float lon = atan(u.z, u.x);
          float lat = asin(clamp(u.y, -1.0, 1.0));
          float nLon = 14.0;
          float nLat = 9.0;
          float lonQ = floor(lon / (6.2831853 / nLon) + 0.5) * (6.2831853 / nLon);
          float latQ = floor((lat + 1.5707963) / (3.14159265 / nLat) + 0.5) * (3.14159265 / nLat) - 1.5707963;
          float cl = cos(latQ);
          return normalize(vec3(cl * cos(lonQ), sin(latQ), cl * sin(lonQ)));
        }

        vec3 snapGemNormalHard(vec3 p, float shapeIdx) {
          return brilliantFacetNormalHard(p);
        }

        vec3 snapGemNormal(vec3 p, float shapeIdx) {
          return normalize(mix(normalize(p), brilliantFacetNormalHard(p), uFacetQuantize));
        }

        vec3 gemMirrorShaded(
          vec3 n,
          vec3 v,
          vec3 L,
          samplerCube cube,
          float dark,
          float shapeIdx
        ) {
          float ndv = clamp(dot(n, v), 0.0, 1.0);

          vec3 iriColor = thinFilmIridescence(ndv, dark);

          vec3 R = reflect(-v, n);
          vec3 envRaw = envSample(cube, R, dark);
          vec3 envC = max(envRaw, iriColor * mix(0.18, 0.3, dark));
          envC = mix(envC, envC * iriColor, mix(0.38, 0.22, dark));

          vec3 F0 = mix(vec3(0.52, 0.48, 0.88), vec3(0.62, 0.58, 0.96), dark);
          vec3 F = F0 + (1.0 - F0) * pow(1.0 - ndv, 5.0);
          vec3 lit = envC * mix(F, iriColor * 0.8 + F * 0.4, 0.5) * mix(1.18, 1.68, dark);

          float ndl = max(dot(n, L), 0.0);
          vec3 diff = iriColor * (ndl * mix(0.72, 0.86, dark) + mix(0.2, 0.26, dark));

          vec3 H = normalize(L + v);
          float nh = max(dot(n, H), 0.0);
          float specNdH = pow(nh, 168.0) * 1.22 + pow(nh, 42.0) * 0.09;
          vec3 sunSpec = mix(vec3(0.92, 0.96, 1.0), iriColor + 0.4, 0.45) * specNdH * mix(1.35, 1.72, dark);

          float fe = pow(1.0 - ndv, 2.85);
          vec3 rimCol = thinFilmIridescence(0.05, dark);
          vec3 rim = rimCol * fe * mix(0.52, 0.72, dark);

          return clamp(diff + lit + sunSpec + rim, 0.0, 1.0);
        }

        void main() {
          float polish = smoothstep(0.14, 0.86, vMorph);
          float gemW = smoothstep(0.3, 0.84, vMorph);
          float raw = clamp(1.0 - polish, 0.0, 1.0);

          vec3 smoothN = normalize(vWorldNormal);
          float gritAmt = 0.16 * raw * raw * (1.0 - smoothstep(0.12, 0.32, vMorph));
          vec3 grit = gritAmt * vec3(
            sin(dot(vWorldPos, vec3(23.2, 14.7, 19.1)) + uTime * 1.5),
            sin(dot(vWorldPos, vec3(17.1, 28.4, 9.3)) + uTime * 1.15),
            sin(dot(vWorldPos, vec3(11.5, 13.2, 27.8)) + uTime * 1.28)
          );
          smoothN = normalize(smoothN + grit);

          vec3 v = normalize(cameraPosition - vWorldPos);

          vec3 gemBlend = snapGemNormal(vLocalPos, uShapeIndex);
          vec3 gemHardOnly = snapGemNormalHard(vLocalPos, uShapeIndex);
          vec3 gemLocalN = normalize(mix(gemBlend, gemHardOnly, clamp(uFacetSharp, 0.0, 1.0)));
          vec3 gemWorldN = normalize(uNormalMatrix * gemLocalN);
          float gemSnap = smoothstep(0.46, 0.86, vMorph);
          float gemSnapFull = smoothstep(0.58, 0.88, vMorph);
          vec3 nBlend = normalize(mix(smoothN, gemWorldN, gemSnap));
          vec3 n = normalize(mix(nBlend, gemWorldN, gemSnapFull));
          float fresnel = pow(1.0 - clamp(abs(dot(n, v)), 0.0, 1.0), 1.38);

          vec3 L = normalize(uLightDir);
          vec3 blobMat = innerVolumeShaded(n, v, L, fresnel, vMorph, uDark, gemW);
          vec3 gemMat = gemMirrorShaded(n, v, L, envMap, uDark, uShapeIndex);
          vec3 refractBlues = mix(blobMat, gemMat, gemW);

          float ndvSafe = clamp(dot(n, v), 0.0, 1.0);
          float Fsch = 0.038 + 0.962 * pow(1.0 - ndvSafe, 5.0);
          float geomEdge = smoothstep(0.05, 0.9, vMorph);
          float envPolish = mix(0.18, 1.0, polish);
          float envAdd = (1.0 - gemW * 0.62);

          vec3 Renv = reflect(-v, n);
          vec3 envReflected = envSample(envMap, Renv, uDark);
          float reflGain = mix(0.06, 0.2, geomEdge) * mix(0.82, 1.02, uDark) * mix(1.0, 1.14, uAiryGem);
          float gemReflBoost = 1.0 + gemW * gemW * 0.35;
          vec3 envRefTint = mix(vec3(1.0), mix(vec3(0.55, 0.72, 1.0), vec3(0.62, 0.78, 1.0), uDark), 0.55);
          refractBlues += envReflected * envRefTint * Fsch * reflGain * envPolish * envAdd * gemReflBoost;

          vec3 Traw = refract(-v, n, mix(0.9, 0.82, uAiryGem));
          vec3 Tenv = (dot(Traw, Traw) > 1.0e-6) ? normalize(Traw) : Renv;
          vec3 envRefracted = envSample(envMap, Tenv, uDark);
          vec3 tint = mix(vec3(0.78, 0.9, 1.0), vec3(0.84, 0.92, 1.0), uDark);
          tint = mix(tint, vec3(0.9, 0.95, 1.0), uAiryGem * 0.65);
          float refrGain =
            mix(0.3, 0.13, geomEdge) * (1.0 - Fsch * 0.68) * mix(1.0, 1.22, uDark) * envPolish * mix(1.0, 2.35, uAiryGem);
          float refrThroughKill = mix(1.0, 0.32, smoothstep(0.42, 0.9, vMorph));
          refrThroughKill = mix(refrThroughKill, mix(0.78, 1.0, polish), uAiryGem);
          float refrBody = mix(0.55, 0.24, uAiryGem);
          float refrEnvW = mix(0.54, 0.88, uAiryGem);
          refractBlues = mix(
            refractBlues,
            refractBlues * refrBody + envRefracted * tint * refrEnvW,
            clamp(refrGain * mix(0.42, 1.0, polish) * refrThroughKill * envAdd, 0.0, 0.94)
          );

          vec3 skyRim = mix(vec3(0.92, 0.96, 1.0), vec3(0.96, 0.99, 1.0), uDark);
          skyRim = mix(skyRim, vec3(0.40, 0.58, 0.99), uLightBackdrop * 0.75);
          float rimEnv = pow(fresnel, 1.32) * mix(0.08, 0.16, geomEdge) * mix(1.0, 1.18, uDark);
          refractBlues += envReflected * skyRim * rimEnv * envPolish * envAdd * 0.55;

          refractBlues = clamp(refractBlues, 0.0, 1.0);

          vec3 lightHi = vec3(0.42, 0.54, 0.9);
          vec3 lightLo = vec3(0.1, 0.22, 0.78);
          vec3 darkHi = vec3(0.42, 0.55, 0.94);
          vec3 darkLo = vec3(0.25, 0.40, 0.90);
          vec3 hi = mix(lightHi, darkHi, uDark);
          vec3 lo = mix(lightLo, darkLo, uDark);
          float fBlend = mix(0.38, 0.32, uDark);
          vec3 base = mix(hi, lo, fresnel * fBlend);
          base = mix(base, vec3(0.56, 0.74, 1.0), uAiryGem * mix(0.35, 0.85, 1.0 - fresnel));

          float mixBase = mix(0.88, 0.66, uDark);
          float mixEdge = mix(0.98, 0.92, uDark);
          float mixAmt = min(uBlueRefractMix * (mixBase + mixEdge * fresnel) + 0.12, 1.0);
          mixAmt = min(mixAmt + uAiryGem * 0.24, 1.0);
          vec3 col = mix(base, refractBlues, mixAmt);
          float lum = dot(col, vec3(0.2126, 0.7152, 0.0722));
          float sat = mix(1.32, 1.05, uDark);
          sat = mix(sat, 0.92, uAiryGem * 0.55);
          col = mix(vec3(lum), col, sat);
          col = pow(max(col, vec3(1e-5)), mix(vec3(0.94), vec3(1.0), uDark));
          col *= mix(1.0, 1.09, uDark);
          if (uLightBackdrop > 0.01) {
            float Lpk = dot(col, vec3(0.2126, 0.7152, 0.0722));
            float g = smoothstep(0.62, 0.96, Lpk) * uLightBackdrop;
            vec3 coolPeak = vec3(0.38, 0.56, 1.0);
            vec3 violetPeak = vec3(0.58, 0.42, 0.98);
            vec3 peakTint = mix(coolPeak, violetPeak, 0.12 + uSpectralBias * 0.78);
            col = mix(col, peakTint, g * 0.6);
            col = mix(col, col * vec3(0.88, 0.93, 1.08), g * 0.45);
            col = clamp(col, 0.0, 1.0);
          }
          col = clamp(col * uGemMul, 0.0, 1.0);
          gl_FragColor = vec4(col, 1.0);
        }
      `;

  const WIN_LINES = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];

  const ALL_SHAPES = [0, 1, 2, 3, 4];

  const PHASE_IDLE      = 0;
  const PHASE_RESOLVING = 1;
  const PHASE_HOLD      = 2;
  const PHASE_DISSOLVING = 3;

  const PHASE_DURATION = [1.5, 1.0, 2.0, 1.0];

  function createFallbackEquirectTexture() {
    const w = 512;
    const h = 256;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, '#f2f4f8');
    g.addColorStop(0.5, '#d0d8e8');
    g.addColorStop(1, '#1a1f2e');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    const tex = new THREE.CanvasTexture(canvas);
    tex.mapping = THREE.EquirectangularReflectionMapping;
    return tex;
  }

  function attachSphereDirAttribute(geometry) {
    const pos = geometry.attributes.position;
    const arr = new Float32Array(pos.count * 3);
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);
      const len = Math.hypot(x, y, z) || 1;
      arr[i * 3] = x / len;
      arr[i * 3 + 1] = y / len;
      arr[i * 3 + 2] = z / len;
    }
    geometry.setAttribute('sphereDir', new THREE.BufferAttribute(arr, 3));
  }

  function createBlobGeometry(R) {
    const geo = new THREE.IcosahedronGeometry(R, 5);
    attachSphereDirAttribute(geo);
    return geo;
  }

  function createDiamondGeometry(shapeSlot, R) {
    const s = R / Math.sqrt(3);
    let geo;
    if (shapeSlot === 0) geo = new THREE.TetrahedronGeometry(R, 3);
    else if (shapeSlot === 1) geo = new THREE.BoxGeometry(s * 2, s * 2, s * 2, 20, 20, 20);
    else if (shapeSlot === 2) geo = new THREE.OctahedronGeometry(R, 3);
    else if (shapeSlot === 3) geo = new THREE.DodecahedronGeometry(R, 2);
    else geo = new THREE.IcosahedronGeometry(R, 3);
    attachSphereDirAttribute(geo);
    return geo;
  }

  function cellPositionBoard(index, spacing) {
    const col = index % 3;
    const row = Math.floor(index / 3);
    const x = (col - 1) * spacing;
    const y = (1 - row) * spacing;
    return new THREE.Vector3(x, y, 0);
  }

  function randomSpectralBias() {
    return THREE.MathUtils.clamp(Math.random() * 0.92 + 0.04, 0.04, 0.98);
  }

  function gemMulForCell() {
    const j = (Math.random() - 0.5) * 0.06;
    return new THREE.Vector3(1 + j, 1 + j * 0.3, 1 - j * 0.4);
  }

  function pickRandom(arr, exclude) {
    const pool = arr.filter((v) => v !== exclude);
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function pickRandomLineIdx(exclude) {
    return pickRandom(Array.from({ length: WIN_LINES.length }, (_, i) => i), exclude);
  }

  function createRefinedGemMaterial(envCubeMap, radius, lightDir, spectralBias, gemMul) {
    return new THREE.ShaderMaterial({
      extensions: { derivatives: true },
      uniforms: {
        uTime: { value: 0 },
        uDark: { value: GEM_PALETTE_U_DARK },
        uLightBackdrop: { value: readSiteDarkMode() ? 0.0 : 1.0 },
        uAiryGem: { value: 0.0 },
        uBlueRefractMix: { value: 1.0 },
        uMorph: { value: 0.0 },
        uShapeIndex: { value: 4.0 },
        uShapeIndexB: { value: 4.0 },
        uMorphAB: { value: 0 },
        uRadius: { value: radius },
        uLightDir: { value: lightDir.clone().normalize() },
        envMap: { value: envCubeMap },
        uNormalMatrix: { value: new THREE.Matrix3() },
        uFacetSharp: { value: 0.0 },
        uFacetQuantize: { value: 0.12 },
        uGemMul: { value: gemMul.clone() },
        uSpectralBias: { value: spectralBias },
      },
      vertexShader: VERTEX_GEM,
      fragmentShader: FRAGMENT_GEM,
    });
  }

  function initGemTicTacToe() {
    if (typeof THREE === 'undefined' || typeof THREE.RGBELoader === 'undefined') {
      setTimeout(initGemTicTacToe, 40);
      return;
    }

    const canvas = document.getElementById('gem-tictactoe-canvas');
    if (!canvas) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.physicallyCorrectLights = true;

    const scene = new THREE.Scene();
    const themeBg = {
      light: new THREE.Color('#ffffff'),
      dark: new THREE.Color('#080705'),
    };

    const camera = new THREE.PerspectiveCamera(36, 1, 0.08, 80);
    camera.position.set(0, 0, 5.15);
    camera.lookAt(0, 0, 0);

    const keyLightBase = new THREE.Vector3(4.2, 11.5, 3.2);
    const key = new THREE.DirectionalLight(0xffffff, 0);
    key.position.copy(keyLightBase);
    scene.add(key);

    const boardRoot = new THREE.Group();
    scene.add(boardRoot);

    const BOARD_SPACING = 1.08;
    const GEM_R = 0.38;
    const FACET_SHARP_MAX = 0.6;

    let gridLines = null;
    let blobGeo = null;
    let platGeo = null;
    let platGeoShape = -1;
    function gridLinesMaterial() {
      const dark = readSiteDarkMode();
      return new THREE.LineBasicMaterial({
        color: dark ? 0xa8b4c8 : 0x475569,
        transparent: true,
        opacity: dark ? 0.35 : 0.55,
      });
    }
    function buildGridLines() {
      if (gridLines) {
        boardRoot.remove(gridLines);
        gridLines.geometry.dispose();
        gridLines.material.dispose();
      }
      const half = BOARD_SPACING * 1.5;
      const d = BOARD_SPACING * 0.5;
      const pts = [];
      pts.push(new THREE.Vector3(-d, half, 0), new THREE.Vector3(-d, -half, 0));
      pts.push(new THREE.Vector3(d, half, 0), new THREE.Vector3(d, -half, 0));
      pts.push(new THREE.Vector3(-half, d, 0), new THREE.Vector3(half, d, 0));
      pts.push(new THREE.Vector3(-half, -d, 0), new THREE.Vector3(half, -d, 0));
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      gridLines = new THREE.LineSegments(geo, gridLinesMaterial());
      boardRoot.add(gridLines);
    }
    buildGridLines();

    const gemMeshes = [];
    const diamondNormalMat = new THREE.Matrix3();

    let phase = PHASE_IDLE;
    let phaseTimer = 0;
    let activeLineIdx = -1;
    let activeShape = -1;
    let lastLineIdx = -1;
    let lastShape = -1;
    let morphProgress = 0;
    const activeSet = new Set();

    function syncTheme() {
      const dark = readSiteDarkMode();
      scene.background = null;
      renderer.toneMappingExposure = dark ? 1.12 : 1.14;
      key.intensity = dark ? 0 : 1.45;
      buildGridLines();
      const lb = dark ? 0.0 : 1.0;
      gemMeshes.forEach((mesh) => {
        const u = mesh.material.uniforms;
        u.uDark.value = GEM_PALETTE_U_DARK;
        u.uLightBackdrop.value = lb;
        u.uAiryGem.value = 0.0;
        u.uFacetSharp.value = 0.0;
        u.uFacetQuantize.value = 0.12;
      });
    }

    function buildFromEnv(envTexture) {
      envTexture.mapping = THREE.EquirectangularReflectionMapping;

      const pmrem = new THREE.PMREMGenerator(renderer);
      const pmremRT = pmrem.fromEquirectangular(envTexture);
      scene.environment = pmremRT.texture;
      pmrem.dispose();

      const cubeRT = new THREE.WebGLCubeRenderTarget(256, {
        type: THREE.HalfFloatType,
        encoding: THREE.LinearEncoding,
        generateMipmaps: false,
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
      });
      cubeRT.fromEquirectangularTexture(renderer, envTexture);
      const envCubeMap = cubeRT.texture;
      requestAnimationFrame(() => {
        envTexture.dispose();
        pmremRT.dispose();
      });

      gemMeshes.forEach((m) => {
        boardRoot.remove(m);
        m.material.dispose();
      });
      gemMeshes.length = 0;
      if (blobGeo) { blobGeo.dispose(); blobGeo = null; }
      if (platGeo) { platGeo.dispose(); platGeo = null; platGeoShape = -1; }

      blobGeo = createBlobGeometry(GEM_R);

      for (let i = 0; i < 9; i++) {
        const mat = createRefinedGemMaterial(
          envCubeMap,
          GEM_R,
          keyLightBase,
          randomSpectralBias(),
          gemMulForCell()
        );
        const mesh = new THREE.Mesh(blobGeo, mat);
        mesh.userData.cellIndex = i;
        mesh.userData.timeOffset = Math.random() * 120;
        mesh.position.copy(cellPositionBoard(i, BOARD_SPACING));
        mesh.rotation.set(0.35, 0.55, 0.12);
        boardRoot.add(mesh);
        gemMeshes.push(mesh);
      }

      syncTheme();
    }

    syncTheme();

    new THREE.RGBELoader().load(
      HDRI_PATH,
      (texture) => buildFromEnv(texture),
      undefined,
      () => {
        console.warn('[gem-tictactoe] HDRI load failed; fallback env.');
        buildFromEnv(createFallbackEquirectTexture());
      }
    );

    const themeObserver = new MutationObserver(() => syncTheme());
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    const clock = new THREE.Clock();
    const lightNorm = keyLightBase.clone().normalize();

    let isVisible = true;
    const visObs = new IntersectionObserver(
      ([entry]) => { isVisible = entry.isIntersecting; },
      { threshold: 0 }
    );
    visObs.observe(canvas);

    function resize() {
      const w = Math.max(1, canvas.clientWidth);
      const h = Math.max(1, canvas.clientHeight);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    }
    window.addEventListener('resize', resize);
    resize();

    function startNewCycle() {
      activeLineIdx = pickRandomLineIdx(lastLineIdx);
      activeShape = pickRandom(ALL_SHAPES, lastShape);
      lastLineIdx = activeLineIdx;
      lastShape = activeShape;
      activeSet.clear();
      WIN_LINES[activeLineIdx].forEach((idx) => activeSet.add(idx));
      morphProgress = 0;
      if (platGeoShape !== activeShape) {
        if (platGeo) platGeo.dispose();
        platGeo = createDiamondGeometry(activeShape, GEM_R);
        platGeoShape = activeShape;
      }
    }

    function easeMorph(p) {
      return p * p * (3 - 2 * p);
    }

    function animate() {
      requestAnimationFrame(animate);

      if (!isVisible) {
        clock.getDelta();
        return;
      }

      const dt = Math.min(clock.getDelta(), 0.1);
      const t = clock.elapsedTime;

      if (!prefersReducedMotion) {
        phaseTimer += dt;
        const dur = PHASE_DURATION[phase];

        if (phase === PHASE_RESOLVING || phase === PHASE_DISSOLVING) {
          morphProgress = Math.min(phaseTimer / dur, 1);
        }

        if (phaseTimer >= dur) {
          phaseTimer -= dur;
          if (phase === PHASE_IDLE) {
            startNewCycle();
            phase = PHASE_RESOLVING;
          } else if (phase === PHASE_RESOLVING) {
            morphProgress = 1;
            phase = PHASE_HOLD;
          } else if (phase === PHASE_HOLD) {
            morphProgress = 0;
            phase = PHASE_DISSOLVING;
          } else {
            morphProgress = 0;
            activeSet.clear();
            phase = PHASE_IDLE;
          }
        }
      }

      const dark = readSiteDarkMode();
      gemMeshes.forEach((mesh) => {
        const u = mesh.material.uniforms;
        const idx = mesh.userData.cellIndex;
        const onActiveLine = activeSet.has(idx);

        u.uLightDir.value.copy(lightNorm);
        u.uTime.value = t + mesh.userData.timeOffset;
        u.uMorphAB.value = 0;

        let morph = 0;
        if (onActiveLine) {
          if (phase === PHASE_RESOLVING) {
            morph = easeMorph(morphProgress);
          } else if (phase === PHASE_HOLD) {
            morph = 1;
          } else if (phase === PHASE_DISSOLVING) {
            morph = 1 - easeMorph(morphProgress);
          }
          u.uShapeIndex.value = activeShape;
        } else {
          u.uShapeIndex.value = 4;
        }
        u.uShapeIndexB.value = u.uShapeIndex.value;
        u.uMorph.value = morph;

        const usePlat = onActiveLine && morph >= 0.34 && platGeo !== null;
        const targetGeo = usePlat ? platGeo : blobGeo;
        if (targetGeo && mesh.geometry !== targetGeo) {
          mesh.geometry = targetGeo;
        }
        u.uFacetSharp.value = usePlat
          ? THREE.MathUtils.smoothstep(morph, 0.38, 0.82) * FACET_SHARP_MAX
          : 0.0;
        u.uAiryGem.value = dark ? 0.0 : morph;

        if (!prefersReducedMotion) {
          mesh.rotation.y += dt * 0.22;
          mesh.rotation.x = 0.35 + Math.sin(t * 0.45 + mesh.position.x) * 0.06;
        }
        mesh.updateMatrixWorld(true);
        diamondNormalMat.getNormalMatrix(mesh.matrixWorld);
        u.uNormalMatrix.value.copy(diamondNormalMat);
      });

      if (!prefersReducedMotion) {
        boardRoot.rotation.z = Math.sin(t * 0.08) * 0.02;
      } else {
        boardRoot.rotation.z = 0;
      }

      renderer.render(scene, camera);
    }
    animate();
  }

  function scheduleInit() {
    setTimeout(initGemTicTacToe, 120);
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    scheduleInit();
  } else {
    document.addEventListener('DOMContentLoaded', scheduleInit);
  }
})();
