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
  camera.position.z = 100
  camera.lookAt(scene.position)
  scene.add(camera)
  // 渲染器
  let renderer = new THREE.WebGLRenderer()
  renderer.setClearColor(new THREE.Color(0x000000,1.0))
  renderer.setSize(window.innerWidth,window.innerHeight)
  renderer.shadowMapEnabled = true
  scene.add(renderer)
  let cloud:any
  function createSprites(size:any,transparent:any,opacity:any,vertexColors:any,sizeAttenuation:any,color:any) {
    let geom = new THREE.Geometry()
    let material = new THREE.PointCloudMaterial({
      size:size,
      transparent:transparent,
      opacity:opacity,
      vertexColors:vertexColors,
      sizeAttenuation:sizeAttenuation,
      color:color
    })
    let rang = 500
    for (var i = 0; i < 5000; i++) {
      var particle = new THREE.Vector3(Math.random()*rang - rang/2,Math.random()*rang - rang/2,Math.random()*rang - rang/2)
      geom.vertices.push(particle)
      let color = new THREE.Color(0x00ff00)
      color.setHSL(color.getHSL().h,color.getHSL().s,Math.random()*color.getHSL().l)
      geom.colors.push(color)
    }

    cloud = new THREE.PointCloud(geom,material)
    cloud.name = "particles";
    scene.add(cloud)
  }
  createSprites(4,true,0.6,true,true,0xffffff)
  let orbitControl = new THREE.OrbitControls(camera,renderer.domElement)
  // @ts-ignore
  document.getElementById('WebGL-output').append(renderer.domElement)
  renderScene()
  function renderScene() {
    stats.update()
    orbitControl.update()
    cloud.rotation.x += 0.0055
    cloud.rotation.z += 0.0055
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
