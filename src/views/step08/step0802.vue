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
  camera.position.x = 30;
  camera.position.y = 30;
  camera.position.z = 30;
  camera.lookAt(new THREE.Vector3(0, 0, 0));
  scene.add(camera)
  // 渲染器
  let renderer = new THREE.WebGLRenderer()
  renderer.setClearColor(new THREE.Color(0xEEEEEE,1.0))
  renderer.setSize(window.innerWidth,window.innerHeight)
  renderer.shadowMapEnabled = true
  scene.add(renderer)
  // 灯光
  let spotLight = new THREE.SpotLight(0xffffff)
  spotLight.position.set(30,30,30)
  spotLight.castShadow = true
  scene.add(spotLight)

  // 构建几何体
  function createMesh(geom:any) {
    let meshMaterial = new THREE.MeshNormalMaterial()
    meshMaterial.side = THREE.DoubleSide
    let wireFrameMat = new THREE.MeshBasicMaterial()
    wireFrameMat.wireframe = true
    let mesh = new THREE.SceneUtils.createMultiMaterialObject(geom,[meshMaterial,wireFrameMat])
    return mesh
  }

  let torus = createMesh(new THREE.TorusKnotGeometry(10, 1, 64, 8, 2, 3, 1))
  scene.add(torus)
  let loadMesh:any
  //@ts-ignore
  let controls = new function () {
    //@ts-ignore
    this.draw = function () {
      scene.remove(torus)
      torus = createMesh(new THREE.TorusKnotGeometry(10, 1, 64, 8, 2, 3, 1))
      scene.add(torus)
    }
    //@ts-ignore
    this.save = function () {
      let result = torus.toJSON()
      localStorage.setItem('loadJson',JSON.stringify(result))
    }
    //@ts-ignore
    this.load = function () {
      scene.remove(loadMesh)
      let json = localStorage.getItem('loadJson')
      if (json) {
        let loaderGeom = JSON.parse(json)
        let loader = new THREE.ObjectLoader(loaderGeom)
        loadMesh = loader.parse(loaderGeom)
        loadMesh.position.x -= 50
        scene.add(loadMesh)
      }
    }
  }
  let gui = new dat.GUI()
  gui.add(controls,'draw').onChange(controls.draw)
  gui.add(controls,'save').onChange(controls.save)
  gui.add(controls,'load').onChange(controls.load)

  // @ts-ignore
  document.getElementById('WebGL-output').append(renderer.domElement)
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
