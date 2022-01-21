<template>
  <div id="Stats-output"></div>
  <div id="WebGL-output"></div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
onMounted(() => {
  let stats = initStats()
  // 场景
  let scene = new THREE.Scene()
  // 照相机
  let camera = new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,0.1,1000)
  camera.position.x = -60
  camera.position.y = 40
  camera.position.z = 30
  camera.lookAt(scene.position)
  scene.add(camera)

  // 渲染器
  let renderer = new THREE.WebGLRenderer()
  renderer.setClearColor(new THREE.Color(0xeeeeee,1.0))
  renderer.setSize(window.innerWidth,window.innerHeight)
  renderer.shadowMapEnabled = true;

  // 平面图
  let planeGeometry = new THREE.PlaneGeometry(40,20)
  let planeMaterial = new THREE.MeshLambertMaterial({color:0xffffff})
  let plane = new THREE.Mesh(planeGeometry,planeMaterial)
  plane.receiveShadow = true
  plane.rotation.x = -0.5* Math.PI
  plane.position.x = 5
  plane.position.y = 0
  plane.position.z = 0

  scene.add(plane)

  //灯光
  let spotLight = new THREE.SpotLight(0xffffff)
  spotLight.position.set(-40,50,10)
  spotLight.castShadow = true
  scene.add(spotLight)

  // 立方体
  let cubeGeometry = new THREE.BoxGeometry(4,4,4)
  let cubeMaterial = new THREE.MeshLambertMaterial({color:0x7777fff})
  let cube = new THREE.Mesh(cubeGeometry,cubeMaterial)

  cube.position.x = -4
  cube.position.y = 3
  cube.position.z = 0

  cube.castShadow = true
  scene.add(cube)

  // 球体
  let sphereGeometry = new THREE.SphereGeometry(4,20,20)
  let sphereMaterial = new THREE.MeshLambertMaterial({color:0x7777ff})
  let sphere = new THREE.Mesh(sphereGeometry,sphereMaterial)
  sphere.castShadow = true
  sphere.position.x = 20
  sphere.position.y = 2
  sphere.position.z = 2
  scene.add(sphere)

  //@ts-ignore
  let control = new function (){
    //@ts-ignore
    this.rotationSpeed = 0.02
    //@ts-ignore
    this.bouncingSpeed = 0.03
  }

  let gui= new dat.GUI();
  gui.add(control,'rotationSpeed',0,0.5)
  gui.add(control,'bouncingSpeed',0,0.5)

  //@ts-ignore
  document.getElementById('WebGL-output').append(renderer.domElement)
  renderScene()
  var step = 0
  function renderScene() {
    stats.update()
    //@ts-ignore
    cube.rotation.x += control.rotationSpeed;
    //@ts-ignore
    cube.rotation.y += control.rotationSpeed;
    //@ts-ignore
    cube.rotation.z += control.rotationSpeed;

    step += control.bouncingSpeed

    sphere.position.x = 20 + (10 * Math.cos(step))
    sphere.position.y = 2+ (10 * Math.abs(Math.sin(step)))

    requestAnimationFrame(renderScene)
    renderer.render(scene,camera)
  }
  function initStats() {
    //@ts-ignore
    let stats = new Stats()
    stats.setMode(0)
    stats.domElement.position = 'absolute';
    stats.domElement.left = '0px';
    stats.domElement.right = '0px';
    //@ts-ignore
    document.getElementById('Stats-output').append(stats.domElement)
    return stats
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
