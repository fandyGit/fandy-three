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
  // 相机
  let camera = new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,0.1,1000)
  camera.position.x = -30
  camera.position.y = 40
  camera.position.z = 40
  camera.lookAt(scene.position)
  scene.add(camera)
  // 渲染器
  let renderer = new THREE.WebGLRenderer()
  renderer.setClearColor(new THREE.Color(0xffffff,1.0))
  renderer.setSize(window.innerWidth,window.innerHeight)
  renderer.shadowMapEnabled = true
  scene.add(renderer)
  // 环境光
  let ambientLight = new THREE.AmbientLight(0x999999)
  scene.add(ambientLight)
  // 点光
  let spotLight = new THREE.SpotLight(0x456789)
  spotLight.position.set(-30,30,30)
  spotLight.castShadow = true
  scene.add(spotLight)

  //@ts-ignore
  let controls = new function (){
    //@ts-ignore
    this.rotationSpeed = 0.1
    //@ts-ignore
    this.radius = 4
    //@ts-ignore
    this.segments = 10
    //@ts-ignore
    this.thetaStart = 0.5* Math.PI*2
    //@ts-ignore
    this.thetaEnd = 0.5* Math.PI*2
    //@ts-ignore
    this.draw = function () {
      scene.remove(circle)
      circle = createMesh(new THREE.CircleGeometry(controls.radius,controls.segments,controls.thetaStart,controls.thetaEnd))
      scene.add(circle)
    }

  }
  //@ts-ignore
  let gui = new dat.GUI()
  gui.add(controls,'rotationSpeed',0,1)
  gui.add(controls,'radius',1,20).onChange(controls.draw)
  gui.add(controls,'segments',1,20).onChange(controls.draw)
  gui.add(controls,'thetaStart',0,2*Math.PI).onChange(controls.draw)
  gui.add(controls,'thetaEnd',0,2*Math.PI).onChange(controls.draw)
  function createMesh(geo:any) {
    let meshMaterial = new THREE.MeshNormalMaterial()
    meshMaterial.side = THREE.DoubleSide
    let wireFrameMats = new THREE.MeshBasicMaterial()
    wireFrameMats.wireframe = true
    let circle = new THREE.SceneUtils.createMultiMaterialObject(geo,[meshMaterial,wireFrameMats])
    return circle
  }
  let circle = createMesh(new THREE.CircleGeometry(10,10,0.5*Math.PI*2,0.5*Math.PI*2))
  scene.add(circle)

  //@ts-ignore
  document.getElementById('WebGL-output').append(renderer.domElement)
  renderScene()
  function renderScene() {
    stats.update()
    circle.rotation.y += controls.rotationSpeed
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
