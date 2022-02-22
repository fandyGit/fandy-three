<template>
  <div id="Stats-output"></div>
  <div id="WebGL-output"></div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
onMounted(() => {
  function initState() {
    //@ts-ignore
    let state = new Stats()
    state.setMode(0)
    state.domElement.position = 'absolute'
    state.domElement.style.left = '0px'
    state.domElement.style.right = '0px'
    //@ts-ignore
    document.getElementById('Stats-output').append(state.domElement)
    return state
  }
  let stats = initState()
  // 场景
  let scene = new THREE.Scene()
  // 照相机
  let camera = new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,0.1,1000)
  camera.position.x = -30
  camera.position.y = 40
  camera.position.z = 40
  camera.lookAt(scene.position)
  scene.add(camera)
  // 渲染器
  let renderer = new THREE.WebGLRenderer()
  renderer.setClearColor(new THREE.Color(0xffffff))
  renderer.setSize(window.innerWidth,window.innerHeight)
  renderer.shadowMapEnabled = true
  scene.add(renderer)
  // 点光
  let spotLight = new THREE.SpotLight(0x778899)
  spotLight.position.set(-30,40,40)
  spotLight.castShadow = true
  scene.add(spotLight)

  let torus = createMesh(new THREE.RingGeometry())
  scene.add(torus)

  function createMesh(geo:any) {
    let meshMaterial = new THREE.MeshNormalMaterial()
    meshMaterial.side = THREE.DoubleSide
    let wireFrameMat = new THREE.MeshBasicMaterial()
    wireFrameMat.wireframe = true
    let mesh = new THREE.SceneUtils.createMultiMaterialObject(geo, [meshMaterial,wireFrameMat])
    return mesh
  }


  //@ts-ignore
  let controls = new function () {
    //@ts-ignore
    this.rotationSpeed = 0.1
    //@ts-ignore
    this.innerRadius = 0
    //@ts-ignore
    this.outerRadius = 50
    //@ts-ignore
    this.thetaSegments = 8
    //@ts-ignore
    this.phiSegments = 8
    //@ts-ignore
    this.thetaStart = 0
    //@ts-ignore
    this.thetaLength = Math.PI * 2
    //@ts-ignore
    this.drawer = function () {
      scene.remove(torus)
      torus = createMesh(new THREE.RingGeometry(controls.innerRadius, controls.outerRadius, controls.thetaSegments, controls.phiSegments, controls.thetaStart, controls.thetaLength))
      scene.add(torus)
    }

  }

  let gui = new dat.GUI()
  gui.add(controls,'rotationSpeed',0.1,1)
  gui.add(controls,'innerRadius',0,20).onChange(controls.drawer)
  gui.add(controls,'outerRadius',0,100).onChange(controls.drawer)
  gui.add(controls,'thetaSegments',0,10).step(1).onChange(controls.drawer)
  gui.add(controls,'phiSegments',0,10).step(1).onChange(controls.drawer)

  // @ts-ignore
  document.getElementById('WebGL-output').append(renderer.domElement)
  renderScene()
  function renderScene() {
    stats.update();
    torus.rotation.y += controls.rotationSpeed
    requestAnimationFrame(renderScene)
    renderer.render(scene,camera)
  }

})


</script>

<style lang="scss" scoped>
#WebGL-output{
  width: 100%;
  height: 100%;
  overflow-x: hidden;
}

</style>
