import { useEffect, useRef } from 'react'

/**
 * Escena 3D del hero: topología de nodos, cubos wireframe, torus knot, grilla en
 * perspectiva y paquetes que viajan por los enlaces. Reacciona al mouse.
 *
 * Portado del sitio de Valentin Torassa (github.com/ValentinTorassa/ValenTorassa-Web).
 *
 * three se carga en diferido (import dinámico) y sólo cuando el hero entra en
 * viewport, así no pesa en el primer render.
 */

type SceneQuality = 'full' | 'reduced'

function getScenePreference(): { enabled: boolean; quality: SceneQuality } {
  const navigatorWithHints = navigator as Navigator & {
    connection?: { saveData?: boolean; effectiveType?: string }
    deviceMemory?: number
  }
  const connection = navigatorWithHints.connection
  const slowConnection = connection?.effectiveType === 'slow-2g' || connection?.effectiveType === '2g'
  const constrainedDevice =
    (navigatorWithHints.deviceMemory !== undefined && navigatorWithHints.deviceMemory <= 4) ||
    navigator.hardwareConcurrency <= 4 ||
    connection?.effectiveType === '3g' ||
    window.matchMedia('(max-width: 700px)').matches

  return {
    enabled: !connection?.saveData && !slowConnection,
    quality: constrainedDevice ? 'reduced' : 'full',
  }
}

export function HeroScene() {
  const mountRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const container = mountRef.current
    if (!container) return undefined

    const scenePreference = getScenePreference()
    if (!scenePreference.enabled) return undefined

    let disposeScene: (() => void) | undefined
    let isDisposed = false
    let idleHandle: number | undefined
    let timeoutHandle: ReturnType<typeof globalThis.setTimeout> | undefined
    let visibilityObserver: IntersectionObserver | undefined
    let hasScheduledScene = false

    const startScene = () => {
      void import('../threeRuntime')
        .then((THREE) => {
          if (isDisposed || !container.isConnected) return
          try {
            disposeScene = setupHeroScene(THREE, container, scenePreference.quality)
          } catch {
            container.classList.add('is-unavailable')
          }
        })
        .catch(() => {
          container.classList.add('is-unavailable')
        })
    }

    const scheduleScene = () => {
      if (hasScheduledScene) return
      hasScheduledScene = true

      if (typeof window.requestIdleCallback === 'function') {
        idleHandle = window.requestIdleCallback(startScene, { timeout: 1200 })
      } else {
        timeoutHandle = globalThis.setTimeout(startScene, 120)
      }
    }

    if ('IntersectionObserver' in window) {
      visibilityObserver = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            visibilityObserver?.disconnect()
            scheduleScene()
          }
        },
        { threshold: 0.12 },
      )
      visibilityObserver.observe(container)
    } else {
      scheduleScene()
    }

    return () => {
      isDisposed = true
      visibilityObserver?.disconnect()
      if (idleHandle !== undefined) window.cancelIdleCallback(idleHandle)
      if (timeoutHandle !== undefined) globalThis.clearTimeout(timeoutHandle)
      disposeScene?.()
    }
  }, [])

  return <div className="hero-scene" ref={mountRef} aria-hidden="true" />
}

function setupHeroScene(
  THREE: typeof import('../threeRuntime'),
  container: HTMLDivElement,
  quality: SceneQuality,
) {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches
  const scene = new THREE.Scene()
  scene.fog = new THREE.FogExp2(0x080910, 0.052)

  const camera = new THREE.PerspectiveCamera(41, 1, 0.1, 100)
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: quality === 'full',
    depth: true,
    stencil: false,
    powerPreference: quality === 'full' ? 'high-performance' : 'low-power',
  })

  renderer.setClearColor(0x000000, 0)
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.08
  container.appendChild(renderer.domElement)

  const topology = new THREE.Group()
  topology.position.set(0, -0.34, -0.5)
  scene.add(topology)

  const ambientLight = new THREE.AmbientLight(0x8b7cff, 1.25)
  const tealLight = new THREE.PointLight(0x54e6d6, 9, 16, 2)
  const violetLight = new THREE.PointLight(0x8b7cff, 7, 14, 2)
  tealLight.position.set(-4.5, 2.6, 2.8)
  violetLight.position.set(4.5, 1.4, 1.4)
  scene.add(ambientLight, tealLight, violetLight)

  const disposables: Array<{ dispose: () => void }> = []
  const teal = new THREE.LineBasicMaterial({ color: 0x54e6d6, transparent: true, opacity: 0.34 })
  const cyan = new THREE.LineBasicMaterial({ color: 0x72f2e2, transparent: true, opacity: 0.56 })
  const linkMaterial = new THREE.LineBasicMaterial({ color: 0x54e6d6, transparent: true, opacity: 0.19 })
  const violet = new THREE.LineBasicMaterial({ color: 0x9c8cff, transparent: true, opacity: 0.54 })
  const amber = new THREE.LineBasicMaterial({ color: 0xf0b45b, transparent: true, opacity: 0.32 })
  const vertexMaterial = new THREE.PointsMaterial({
    color: 0x7af7e9,
    transparent: true,
    opacity: 0.64,
    size: 0.035,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
  const starMaterial = new THREE.PointsMaterial({
    color: 0x8b9cb8,
    transparent: true,
    opacity: 0.3,
    size: 0.018,
    sizeAttenuation: true,
    depthWrite: false,
  })
  const createFresnelMaterial = (color: number, opacity: number) =>
    new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: new THREE.Color(color) },
        uOpacity: { value: opacity },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vViewDirection;

        void main() {
          vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
          vNormal = normalize(normalMatrix * normal);
          vViewDirection = normalize(-viewPosition.xyz);
          gl_Position = projectionMatrix * viewPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        uniform float uOpacity;
        varying vec3 vNormal;
        varying vec3 vViewDirection;

        void main() {
          float rim = pow(1.0 - max(dot(normalize(vNormal), normalize(vViewDirection)), 0.0), 3.5);
          float alpha = rim * uOpacity;
          gl_FragColor = vec4(uColor, alpha);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
  const coreSurfaceMaterial = createFresnelMaterial(0x9c8cff, 0.09)
  const knotSurfaceMaterial = createFresnelMaterial(0x62dfd2, 0.065)
  const glowMaterial = new THREE.MeshStandardMaterial({
    color: 0xb7fff7,
    emissive: 0x54e6d6,
    emissiveIntensity: 1.8,
    roughness: 0.18,
    transparent: true,
    opacity: 0.86,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
  const packetMaterial = new THREE.MeshBasicMaterial({
    color: 0x72f2e2,
    transparent: true,
    opacity: 0.88,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
  const packetAltMaterial = new THREE.MeshBasicMaterial({
    color: 0xb0a6ff,
    transparent: true,
    opacity: 0.74,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
  const nodeMaterial = new THREE.MeshBasicMaterial({
    color: 0x72f2e2,
    transparent: true,
    opacity: 0.82,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
  disposables.push(
    teal,
    cyan,
    linkMaterial,
    violet,
    amber,
    vertexMaterial,
    starMaterial,
    coreSurfaceMaterial,
    knotSurfaceMaterial,
    glowMaterial,
    packetMaterial,
    packetAltMaterial,
    nodeMaterial,
  )

  const grid = new THREE.GridHelper(18, 44, 0x54e6d6, 0x1c2941)
  grid.position.set(0, -2.68, -1.4)
  grid.rotation.x = 0.1
  const gridMaterials = Array.isArray(grid.material) ? grid.material : [grid.material]
  gridMaterials.forEach((material) => {
    material.transparent = true
    material.opacity = 0.22
    disposables.push(material)
  })
  topology.add(grid)

  const pseudoRandom = (seed: number) => Math.abs(Math.sin(seed * 12.9898) * 43758.5453) % 1
  const starPositions = new Float32Array(quality === 'full' ? 270 : 135)
  for (let index = 0; index < starPositions.length; index += 3) {
    const seed = index + 11
    starPositions[index] = (pseudoRandom(seed) - 0.5) * 17
    starPositions[index + 1] = (pseudoRandom(seed * 1.7) - 0.5) * 8
    starPositions[index + 2] = -3.5 - pseudoRandom(seed * 2.3) * 7
  }
  const starGeometry = new THREE.BufferGeometry()
  starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3))
  const starField = new THREE.Points(starGeometry, starMaterial)
  topology.add(starField)
  disposables.push(starGeometry)

  const vertexPositions = new Float32Array(quality === 'full' ? 126 : 72)
  for (let index = 0; index < vertexPositions.length; index += 3) {
    const seed = index + 1
    const side = seed % 2 === 0 ? -1 : 1
    vertexPositions[index] = side * (2.2 + (Math.sin(seed * 14.1) + 1) * 1.5)
    vertexPositions[index + 1] = -1.7 + (Math.sin(seed * 9.7) + 1) * 2.05
    vertexPositions[index + 2] = -2.5 - (Math.sin(seed * 5.3) + 1) * 1.5
  }
  const vertexGeometry = new THREE.BufferGeometry()
  vertexGeometry.setAttribute('position', new THREE.BufferAttribute(vertexPositions, 3))
  const vertexField = new THREE.Points(vertexGeometry, vertexMaterial)
  topology.add(vertexField)
  disposables.push(vertexGeometry)

  const terrainGeometry = new THREE.PlaneGeometry(10.4, 3.4, 16, 6)
  const terrainPosition = terrainGeometry.attributes.position
  for (let index = 0; index < terrainPosition.count; index += 1) {
    const x = terrainPosition.getX(index)
    const y = terrainPosition.getY(index)
    terrainPosition.setZ(index, Math.sin(x * 1.4 + y * 2.1) * 0.11)
  }
  terrainPosition.needsUpdate = true
  const terrainEdges = new THREE.EdgesGeometry(terrainGeometry)
  const terrain = new THREE.LineSegments(terrainEdges, linkMaterial)
  terrain.position.set(0, -2.34, -2.95)
  terrain.rotation.x = -Math.PI / 2.72
  topology.add(terrain)
  disposables.push(terrainGeometry, terrainEdges)

  const coreGroup = new THREE.Group()
  coreGroup.position.set(4.35, -0.14, -2.62)
  coreGroup.scale.setScalar(0.94)
  topology.add(coreGroup)

  const coreBaseGeometry = new THREE.IcosahedronGeometry(1.27, 2)
  const coreEdgeGeometry = new THREE.EdgesGeometry(coreBaseGeometry, 18)
  const core = new THREE.LineSegments(coreEdgeGeometry, violet)
  const coreSurface = new THREE.Mesh(coreBaseGeometry, coreSurfaceMaterial)
  const coreGlowGeometry = new THREE.OctahedronGeometry(0.34, 1)
  const coreGlow = new THREE.Mesh(coreGlowGeometry, glowMaterial)
  coreGroup.add(coreSurface, core, coreGlow)
  disposables.push(coreBaseGeometry, coreEdgeGeometry, coreGlowGeometry)

  const coreOrbitBaseA = new THREE.TorusGeometry(1.68, 0.012, 5, 84)
  const coreOrbitGeometryA = new THREE.EdgesGeometry(coreOrbitBaseA)
  const coreOrbitA = new THREE.LineSegments(coreOrbitGeometryA, cyan)
  coreOrbitA.rotation.set(0.8, 0.24, 0.34)
  coreGroup.add(coreOrbitA)
  const coreOrbitBaseB = new THREE.TorusGeometry(1.92, 0.01, 5, 72)
  const coreOrbitGeometryB = new THREE.EdgesGeometry(coreOrbitBaseB)
  const coreOrbitB = new THREE.LineSegments(coreOrbitGeometryB, amber)
  coreOrbitB.rotation.set(1.18, -0.18, -0.46)
  coreGroup.add(coreOrbitB)
  disposables.push(coreOrbitBaseA, coreOrbitGeometryA, coreOrbitBaseB, coreOrbitGeometryB)

  const knotGroup = new THREE.Group()
  knotGroup.position.set(-4.35, -0.3, -2.62)
  knotGroup.scale.setScalar(0.94)
  topology.add(knotGroup)
  const knotBaseGeometry = new THREE.TorusKnotGeometry(0.88, 0.2, 72, 8, 2, 3)
  const knotEdgeGeometry = new THREE.EdgesGeometry(knotBaseGeometry, 22)
  const knotSurface = new THREE.Mesh(knotBaseGeometry, knotSurfaceMaterial)
  const knotEdges = new THREE.LineSegments(knotEdgeGeometry, teal)
  knotGroup.add(knotSurface, knotEdges)
  disposables.push(knotBaseGeometry, knotEdgeGeometry)

  const ringBaseGeometry = new THREE.TorusGeometry(1.58, 0.012, 6, 88)
  const ringGeometry = new THREE.EdgesGeometry(ringBaseGeometry)
  const ring = new THREE.LineSegments(ringGeometry, cyan)
  ring.rotation.set(1.17, 0.3, 0.34)
  knotGroup.add(ring)
  const orbitBaseGeometry = new THREE.TorusGeometry(1.86, 0.01, 6, 72)
  const orbitGeometry = new THREE.EdgesGeometry(orbitBaseGeometry)
  const orbit = new THREE.LineSegments(orbitGeometry, violet)
  orbit.rotation.set(0.72, -0.12, -0.56)
  knotGroup.add(orbit)
  disposables.push(ringBaseGeometry, ringGeometry, orbitBaseGeometry, orbitGeometry)

  const scanGeometry = new THREE.PlaneGeometry(9.2, 0.014)
  const scanMaterial = new THREE.MeshBasicMaterial({
    color: 0x54e6d6,
    transparent: true,
    opacity: 0.2,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
  const scanLine = new THREE.Mesh(scanGeometry, scanMaterial)
  scanLine.position.set(0, -1.92, -2.92)
  topology.add(scanLine)
  disposables.push(scanGeometry, scanMaterial)

  const cubeSpecs = [
    { position: [-4.5, -1.18, -1.82], scale: [0.72, 0.55, 0.55], material: teal },
    { position: [-2.45, 1.18, -2.8], scale: [0.62, 0.62, 0.62], material: violet },
    { position: [4.3, -1.38, -2.28], scale: [0.84, 0.55, 0.68], material: teal },
    { position: [2.32, 1.28, -3.2], scale: [0.62, 0.62, 0.62], material: amber },
  ] as const
  const cubes: Array<InstanceType<typeof THREE.LineSegments>> = []
  cubeSpecs.forEach((spec) => {
    const baseGeometry = new THREE.BoxGeometry(spec.scale[0], spec.scale[1], spec.scale[2])
    const edgeGeometry = new THREE.EdgesGeometry(baseGeometry)
    const cube = new THREE.LineSegments(edgeGeometry, spec.material)
    cube.position.set(spec.position[0], spec.position[1], spec.position[2])
    topology.add(cube)
    cubes.push(cube)
    disposables.push(baseGeometry, edgeGeometry)
  })

  const linkSegments = [
    { from: [-4.5, -1.18, -1.82], to: [-2.45, 1.18, -2.8] },
    { from: [-2.45, 1.18, -2.8], to: [0, -0.4, -2.35] },
    { from: [0, -0.4, -2.35], to: [2.32, 1.28, -3.2] },
    { from: [0, -0.4, -2.35], to: [4.3, -1.38, -2.28] },
    { from: [-4.35, -0.3, -2.62], to: [4.35, -0.14, -2.62] },
    { from: [-4.5, -1.18, -1.82], to: [4.3, -1.38, -2.28] },
  ] as const
  const linkPositions = new Float32Array(linkSegments.flatMap((segment) => [...segment.from, ...segment.to]))
  const linkGeometry = new THREE.BufferGeometry()
  linkGeometry.setAttribute('position', new THREE.BufferAttribute(linkPositions, 3))
  const links = new THREE.LineSegments(linkGeometry, linkMaterial)
  topology.add(links)
  disposables.push(linkGeometry)

  const packetGeometry = new THREE.OctahedronGeometry(0.058, 0)
  const animatedLinkSegments = quality === 'full' ? linkSegments : linkSegments.slice(0, 4)
  const packets = animatedLinkSegments.map((segment, index) => {
    const packet = new THREE.Mesh(packetGeometry, index % 2 === 0 ? packetMaterial : packetAltMaterial)
    topology.add(packet)
    return {
      mesh: packet,
      from: new THREE.Vector3(segment.from[0], segment.from[1], segment.from[2]),
      to: new THREE.Vector3(segment.to[0], segment.to[1], segment.to[2]),
      offset: index / linkSegments.length,
    }
  })
  disposables.push(packetGeometry)

  const nodeGeometry = new THREE.OctahedronGeometry(0.078, 0)
  const nodePositions = [
    [-4.5, -1.18, -1.82],
    [-2.45, 1.18, -2.8],
    [0, -0.4, -2.35],
    [2.32, 1.28, -3.2],
    [4.3, -1.38, -2.28],
    [-4.35, -0.3, -2.62],
    [4.35, -0.14, -2.62],
  ] as const
  const nodes = nodePositions.map((position) => {
    const node = new THREE.Mesh(nodeGeometry, nodeMaterial)
    node.position.set(position[0], position[1], position[2])
    topology.add(node)
    return node
  })
  disposables.push(nodeGeometry)

  const resize = () => {
    const width = container.clientWidth
    const height = container.clientHeight
    if (!width || !height) return
    const isCompact = width < 700
    const maxPixelRatio = quality === 'full' ? (isCompact ? 1.25 : 1.65) : 1
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxPixelRatio))
    renderer.setSize(width, height, false)
    camera.aspect = width / height
    camera.position.set(0, isCompact ? 0.1 : 0.28, isCompact ? 9.15 : 7.45)
    camera.updateProjectionMatrix()
    topology.scale.setScalar(isCompact ? 0.72 : 1)
    renderer.render(scene, camera)
  }

  const pointerTarget = { x: 0, y: 0 }
  const handlePointerMove = (event: PointerEvent) => {
    pointerTarget.y = (event.clientX / window.innerWidth - 0.5) * 0.1
    pointerTarget.x = (event.clientY / window.innerHeight - 0.5) * -0.045
  }

  let frame = 0
  let running = false
  let isIntersecting = true
  let previousFrameTime = 0
  const clock = new THREE.Clock(false)
  const render = (frameTime = 0) => {
    if (!running) return

    if (quality === 'reduced' && frameTime - previousFrameTime < 32) {
      frame = window.requestAnimationFrame(render)
      return
    }

    previousFrameTime = frameTime
    const elapsed = clock.getElapsedTime()
    topology.rotation.y += (Math.sin(elapsed * 0.14) * 0.065 + pointerTarget.y - topology.rotation.y) * 0.035
    topology.rotation.x += (Math.sin(elapsed * 0.1) * 0.014 + pointerTarget.x - topology.rotation.x) * 0.035
    coreGroup.rotation.y = elapsed * 0.11
    coreGroup.rotation.x = Math.sin(elapsed * 0.17) * 0.08
    core.rotation.x = elapsed * 0.16
    core.rotation.y = elapsed * 0.22
    coreSurface.rotation.copy(core.rotation)
    coreGlow.rotation.set(elapsed * 0.32, elapsed * 0.41, elapsed * 0.24)
    coreGlow.scale.setScalar(0.92 + Math.sin(elapsed * 1.5) * 0.08)
    coreOrbitA.rotation.z = 0.34 + elapsed * 0.07
    coreOrbitB.rotation.z = -0.46 - elapsed * 0.052
    knotGroup.rotation.y = -elapsed * 0.08
    knotGroup.rotation.x = Math.sin(elapsed * 0.16) * 0.09
    knotSurface.rotation.z = elapsed * 0.06
    knotEdges.rotation.copy(knotSurface.rotation)
    ring.rotation.z = 0.34 + elapsed * 0.065
    orbit.rotation.z = -0.56 - elapsed * 0.045
    starField.rotation.y = Math.sin(elapsed * 0.045) * 0.035
    vertexField.rotation.y = Math.sin(elapsed * 0.075) * 0.04
    terrain.position.y = -2.34 + Math.sin(elapsed * 0.34) * 0.022
    scanLine.position.y = -2.35 + ((elapsed * 0.28) % 4.25)
    scanMaterial.opacity = 0.11 + Math.sin(elapsed * 1.8) * 0.045
    packets.forEach((packet, index) => {
      const progress = (elapsed * (0.07 + index * 0.006) + packet.offset) % 1
      packet.mesh.position.lerpVectors(packet.from, packet.to, progress)
      packet.mesh.rotation.set(elapsed * 0.7, elapsed * 0.95 + index, elapsed * 0.45)
      packet.mesh.scale.setScalar(0.72 + Math.sin((progress + elapsed) * Math.PI * 2) * 0.16)
    })
    nodes.forEach((node, index) => {
      node.scale.setScalar(0.76 + Math.sin(elapsed * 1.35 + index * 0.82) * 0.16)
    })
    cubes.forEach((cube, index) => {
      cube.rotation.x = Math.sin(elapsed * 0.15 + index) * 0.065
      cube.rotation.y = elapsed * (0.038 + index * 0.009)
    })
    renderer.render(scene, camera)
    frame = window.requestAnimationFrame(render)
  }

  const start = () => {
    if (running || prefersReducedMotion || document.hidden || !isIntersecting) return
    running = true
    clock.start()
    frame = window.requestAnimationFrame(render)
  }
  const stop = () => {
    if (!running) return
    running = false
    clock.stop()
    window.cancelAnimationFrame(frame)
  }
  const handleVisibility = () => {
    if (document.hidden) stop()
    else start()
  }

  resize()
  container.classList.add('is-ready')
  if (prefersReducedMotion) renderer.render(scene, camera)
  else start()

  const resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(container)
  const sceneObserver = new IntersectionObserver(
    ([entry]) => {
      isIntersecting = entry.isIntersecting
      if (isIntersecting) start()
      else stop()
    },
    { rootMargin: '160px 0px' },
  )
  sceneObserver.observe(container)
  document.addEventListener('visibilitychange', handleVisibility)
  if (hasFinePointer && !prefersReducedMotion) {
    window.addEventListener('pointermove', handlePointerMove, { passive: true })
  }

  return () => {
    stop()
    resizeObserver.disconnect()
    sceneObserver.disconnect()
    document.removeEventListener('visibilitychange', handleVisibility)
    window.removeEventListener('pointermove', handlePointerMove)
    container.classList.remove('is-ready')
    disposables.forEach((item) => item.dispose())
    renderer.dispose()
    renderer.domElement.remove()
  }
}
