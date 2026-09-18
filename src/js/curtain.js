import { Renderer, Program, Mesh, Triangle, Texture, Vec2, Color } from 'ogl'
import gsap from 'gsap'

/* ==================================================================
   PaperCurtain
   ------------------------------------------------------------------
   A full-screen sheet of paper that tears across the viewport to
   cover or reveal the page. Used for the menu open/close transition.

   The tear line is a straight sweep displaced by two noise fields:
     - a broad, low-frequency curve  : the sag of a held sheet
     - a high-frequency fibre fringe : the ragged torn edge itself

   in() covers the screen, out() retracts. Both return the GSAP tween
   so callers can chain. Rendering is gated on the tween being active,
   so an idle curtain costs nothing.
   ================================================================== */

const vertex = /* glsl */ `
  attribute vec2 uv;
  attribute vec2 position;

  uniform vec2 uRatio;

  varying vec2 vUv;
  varying vec2 vTexUv;

  void main() {
    vUv = uv;
    // Aspect-corrected coords so the paper grain never stretches.
    vTexUv = (uv - 0.5) * uRatio + 0.5;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`

const fragment = /* glsl */ `
  precision highp float;

  uniform float uProgress;
  uniform float uHorizontal;
  uniform float uAmplitude;
  uniform float uCurveFrequency;
  uniform float uCurveAmplitude;
  uniform float uRippedFrequency;
  uniform float uRippedAmplitude;
  uniform float uRippedHeight;
  uniform float uRippedDelta;
  uniform float uSeed;
  uniform vec3  uColor;
  uniform vec3  uFringe;
  uniform sampler2D uTexture;

  varying vec2 vUv;
  varying vec2 vTexUv;

  // --- Simplex 2D noise (Ashima / Gustavson, public domain) ---
  vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                       -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                            + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy),
                            dot(x12.zw, x12.zw)), 0.0);
    m = m * m; m = m * m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  // Fractal noise - five octaves, matching the reference fibre density.
  float fbm(vec2 p) {
    float value = 0.0;
    float amp = 0.5;
    for (int i = 0; i < 5; i++) {
      value += amp * snoise(p);
      p *= 2.0;
      amp *= 0.5;
    }
    return value;
  }

  void main() {
    // axis runs along the direction of travel, across runs along the tear.
    float axis   = mix(vUv.y, vUv.x, uHorizontal);
    float across = mix(vUv.x, vUv.y, uHorizontal);

    // Sweep the line clear past both ends so no deviation can leave a gap.
    float travel = mix(-uAmplitude, 1.0 + uAmplitude, uProgress);

    // Broad sag of a held sheet.
    float curve = snoise(vec2(across * uCurveFrequency, uSeed)) * uCurveAmplitude;

    // The tear itself. Both terms are one-dimensional - functions of the
    // across coordinate alone - so the boundary stays a line. Letting this
    // vary along the travel axis is what turns a tear into fur.
    // Two scales, an order of magnitude apart: a slow wander that makes
    // the tear look hand-made, and a fine raggedness for the fibre. Both
    // stay small - a real tear deviates a percent or two of the sheet, and
    // anything more reads as a sawtooth rather than as paper.
    float ragged = fbm(vec2(across * uRippedFrequency * 3.0, uSeed + 3.0));
    float deckle = fbm(vec2(across * uRippedFrequency * 18.0, uSeed + 9.0));

    float line = travel
               + curve * uAmplitude * 4.0
               + ragged * uRippedHeight * 0.30 * uRippedDelta
               + deckle * uRippedHeight * (uRippedAmplitude / 0.05) * 0.09;

    // Signed distance past the tear, positive inside the sheet.
    float edge = line - axis;

    // Fixed-width antialiasing: fwidth needs a WebGL1 extension that is
    // not worth requiring for a two-pixel soften.
    const float AA = 0.0012;
    float alpha = smoothstep(-AA, AA, edge);

    // Loose fibres shed just beyond the tear, in a narrow band along it.
    // This is the only term allowed to vary in two dimensions.
    float fleck = fbm(vec2(across * 150.0, axis * 150.0));
    float band  = smoothstep(uRippedHeight * 0.10, 0.0, abs(edge));
    alpha = max(alpha, smoothstep(0.34, 0.50, fleck) * band);

    if (alpha <= 0.002) discard;

    // Paper grain modulates the ink so the sheet never reads as flat fill.
    float grain = texture2D(uTexture, vTexUv).r;
    vec3 color = uColor * (0.84 + grain * 0.16);

    // A torn edge exposes lighter fibre along the rip - a few pixels only,
    // or the sheet looks blurred rather than torn.
    float fringe = 1.0 - smoothstep(0.0, uRippedHeight * 0.12, edge);
    color = mix(color, uFringe, clamp(fringe, 0.0, 1.0) * 0.35);

    gl_FragColor = vec4(color, alpha);
  }
`

export class PaperCurtain {
  constructor(canvas, options = {}) {
    const {
      color = '#1d1d1b',
      fringe = '#6b665f',
      texture = '/ref/site/pt-texture-2.jpg',
      duration = 2,
      ease = 'power3.inOut',
      amplitude = 0.25,
      curveFrequency = 1,
      curveAmplitude = 0.1,
      rippedFrequency = 3.5,
      rippedAmplitude = 0.05,
      rippedHeight = 0.07,
      rippedDelta = 1,
      horizontal = false,
    } = options

    this.canvas = canvas
    this.duration = duration
    this.ease = ease
    this.isRendering = false

    this.renderer = new Renderer({
      canvas,
      alpha: true,
      antialias: false,
      dpr: Math.min(window.devicePixelRatio, 2),
    })
    this.gl = this.renderer.gl
    this.gl.clearColor(0, 0, 0, 0)

    const paper = new Texture(this.gl, { wrapS: this.gl.REPEAT, wrapT: this.gl.REPEAT })
    const image = new Image()
    image.crossOrigin = 'anonymous'
    image.onload = () => { paper.image = image }
    image.src = texture

    this.program = new Program(this.gl, {
      vertex,
      fragment,
      transparent: true,
      depthTest: false,
      uniforms: {
        uProgress: { value: 0 },
        uHorizontal: { value: horizontal ? 1 : 0 },
        uAmplitude: { value: amplitude },
        uCurveFrequency: { value: curveFrequency },
        uCurveAmplitude: { value: curveAmplitude },
        uRippedFrequency: { value: rippedFrequency },
        uRippedAmplitude: { value: rippedAmplitude },
        uRippedHeight: { value: rippedHeight },
        uRippedDelta: { value: rippedDelta },
        uSeed: { value: Math.random() * 100 },
        uColor: { value: new Color(color) },
        uFringe: { value: new Color(fringe) },
        uTexture: { value: paper },
        uRatio: { value: new Vec2(1, 1) },
      },
    })

    this.mesh = new Mesh(this.gl, { geometry: new Triangle(this.gl), program: this.program })

    this.resize = this.resize.bind(this)
    this.render = this.render.bind(this)
    window.addEventListener('resize', this.resize)
    this.resize()
  }

  resize() {
    const w = window.innerWidth
    const h = window.innerHeight
    this.renderer.setSize(w, h)

    // Cover-fit the square paper tile across the viewport.
    const aspect = w / h
    const ratio = this.program.uniforms.uRatio.value
    if (aspect > 1) ratio.set(1, 1 / aspect)
    else ratio.set(aspect, 1)

    if (!this.isRendering) this.render()
  }

  render() {
    this.renderer.render({ scene: this.mesh })
  }

  /** Drive the tween and render only while it runs. */
  tween(to, onComplete) {
    this.tweenRef?.kill()
    this.isRendering = true
    this.tweenRef = gsap.to(this.program.uniforms.uProgress, {
      value: to,
      duration: this.duration,
      ease: this.ease,
      onUpdate: this.render,
      onComplete: () => {
        this.isRendering = false
        this.render()
        onComplete?.()
      },
    })
    return this.tweenRef
  }

  /** Tear the sheet across the screen. */
  in(onComplete) { return this.tween(1, onComplete) }

  /** Retract it. */
  out(onComplete) { return this.tween(0, onComplete) }

  get progress() { return this.program.uniforms.uProgress.value }

  destroy() {
    this.tweenRef?.kill()
    window.removeEventListener('resize', this.resize)
  }
}
