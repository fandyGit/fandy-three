<template>
  <div id="Stats-output"></div>
  <div id="WebGL-output"></div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
onMounted(() => {
  let stats = initStats()
  function initStats() {
    //@ts-ignore
    let stats = new Stats()
    stats.setMode(0)
    stats.domElement.position = 'absolute'
    stats.domElement.right = '0px'
    stats.domElement.top = '0px'
    // @ts-ignore
    document.getElementById('Stats-output').append(stats.domElement)
    return stats
  }
  // 场景
  let scene = new THREE.Scene()
  // 照相机
  let camera = new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,0.1,1000)
  camera.position.x = -60
  camera.position.y = 30
  camera.position.z = 40
  camera.lookAt(scene.position)
  scene.add(camera)

  // 渲染器
  let renderer = new THREE.WebGLRenderer()
  renderer.setClearColor(new THREE.Color(0x856478))
  renderer.shadowMapEnabled = true
  renderer.setSize(window.innerWidth,window.innerHeight)

  // 灯光
  let spotLight = new THREE.SpotLight(0xffffff)
  spotLight.position.set(40,80,50)
  spotLight.castShadow = true
  scene.add(spotLight)
  // 环境光
  let ambientLight = new THREE.AmbientLight(0x333333)
  scene.add(ambientLight)

  //平面图
  let planeGeometry = new THREE.PlaneGeometry(60,20)
  let planeMaterial =new THREE.MeshLambertMaterial({color:0xffffff})
  let plane = new THREE.Mesh(planeGeometry,planeMaterial)
  plane.receiveShadow = true
  plane.rotation.x= -0.5 * Math.PI
  plane.position.x = 5
  plane.position.y = 0
  plane.position.z = 0

  scene.add(plane)

  // 立方体
  let cubeGeometry = new THREE.BoxGeometry(5,5,5)
  let cubeMaterial = new THREE.MeshLambertMaterial({color:0x676790})
  let cube = new THREE.Mesh(cubeGeometry,cubeMaterial);
  cube.position.x = -10
  cube.position.y = 5
  cube.position.z = 0
  cube.castShadow = true
  scene.add(cube)

  // 球体
  let sphereGeometry = new THREE.SphereGeometry(4,12,12)
  let sphereMaterial = new THREE.MeshLambertMaterial({color:0x4f4f4f})
  let sphere = new THREE.Mesh(sphereGeometry,sphereMaterial)
  sphere.position.x = 4
  sphere.position.y = 2
  sphere.position.z = 2
  sphere.castShadow = true

  scene.add(sphere)

  //@ts-ignore
  document.getElementById('WebGL-output').append(renderer.domElement)
  //@ts-ignore
  let controls = new function(){
    //@ts-ignore
    this.rotationSpend = 0.02
    //@ts-ignore
    this.geometrySpend = 0.02
  }

  let gui = new dat.GUI()
  gui.add(controls,'rotationSpend',0,0.5)
  gui.add(controls,'geometrySpend',0,0.5)

  renderScene()
  var step = 0
  function renderScene() {
    stats.update()
    cube.rotation.x += controls.rotationSpend
    cube.rotation.y += controls.rotationSpend
    cube.rotation.z += controls.rotationSpend

    step += controls.geometrySpend

    sphere.position.x = 20 + (10 * Math.cos(step))
    sphere.position.y = 2 + (10 * Math.abs(Math.sin(step)))

    requestAnimationFrame(renderScene)
    renderer.render(scene,camera)
  }
  window.addEventListener('resize',onresize,false)
  function onresize() {
    camera.aspect = window.innerWidth/window.innerHeight
    camera.updateProjectionMatrix()
    camera.resize(window.innerWidth,window.innerHeight)
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
