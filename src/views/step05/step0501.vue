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
  camera.lookAt(new THREE.Vector3(10,0,0))
  scene.add(camera)
  // 渲染器
  let renderer = new THREE.WebGLRenderer()
  renderer.setClearColor(new THREE.Color(0xffffff,1.0))
  renderer.setSize(window.innerWidth,window.innerHeight)
  renderer.shadowMapEnabled = true
  scene.add(renderer)
  // 环境光
  let ambientLight = new THREE.AmbientLight(0x888888)
  scene.add(ambientLight)
  // 点光
  let spotLight = new THREE.SpotLight(0x787878)
  spotLight.position.set(-30,30,30)
  spotLight.castShadow = true
  scene.add(spotLight)
  //创建平面图
  function createPlaneMesh(geo:any){
    let meshMaterial = new THREE.MeshNormalMaterial()
    meshMaterial.side = THREE.DoubleSide
    let wireFrameMat = new THREE.MeshBasicMaterial()
    wireFrameMat.wireframe = true
    let plane = new THREE.SceneUtils.createMultiMaterialObject(geo,[meshMaterial,wireFrameMat])
    return plane
  }
  let plane = createPlaneMesh(new THREE.PlaneGeometry(14,14,4,4))
  //@ts-ignore
  let controls = new function () {
    //@ts-ignore
    this.rotationSpeed = 0.1
    //@ts-ignore
    this.width = plane.children[0].geometry.parameters.width
    //@ts-ignore
    this.height = plane.children[0].geometry.parameters.height
    //@ts-ignore
    this.widthSegments = plane.children[0].geometry.parameters.widthSegments
    //@ts-ignore
    this.heightSegments = plane.children[0].geometry.parameters.heightSegments
    //@ts-ignore
    this.draw = function () {
      scene.remove(plane)
      plane =createPlaneMesh(new THREE.PlaneGeometry(controls.width,controls.height,Math.round(controls.widthSegments),Math.round(controls.heightSegments)))
      scene.add(plane)
    }
  }

  let gui = new dat.GUI()
  gui.add(controls,'width',0,20).onChange(controls.draw)
  gui.add(controls,'height',0,20).onChange(controls.draw)
  gui.add(controls,'widthSegments',0,20).onChange(controls.draw)
  gui.add(controls,'heightSegments',0,20).onChange(controls.draw)
  scene.add(plane)
  //@ts-ignore
  document.getElementById('WebGL-output').append(renderer.domElement)
  // 渲染函数
  renderScene()
  function renderScene() {
    stats.update()
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
