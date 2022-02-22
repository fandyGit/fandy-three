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
  camera.position.x = 0
  camera.position.y = 0
  camera.position.z = 140
  camera.lookAt(scene.position)
  scene.add(camera)
  // 渲染器
  let renderer = new THREE.WebGLRenderer()
  renderer.setClearColor(new THREE.Color(0x000000,1.0))
  renderer.setSize(window.innerWidth,window.innerHeight)
  renderer.shadowMapEnabled = true
  scene.add(renderer)
  function createSprites() {
    let geom = new THREE.Geometry()
    let material = new THREE.PointCloudMaterial({size:4,vertexColors:true,color:0xfffff})

    for (var i = -5; i < 5; i++) {
      for (var j = -5; j < 5; j++) {
        var particle = new THREE.Vector3(i*10,j*10,0)
        geom.vertices.push(particle)
        geom.colors.push(new THREE.Color(Math.random()*0xffffff))
      }
    }

    let cloud = new THREE.PointCloud(geom,material)
    scene.add(cloud)
  }
  createSprites()

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
