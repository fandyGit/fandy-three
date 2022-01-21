<template>
  <div id="Stats-output"></div>
  <div id="WebGL-output"></div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
onMounted(() => {
  let stats = initState()
  // 创建场景
  let scene = new THREE.Scene()
  // 创建照相机
  let camera = new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,0.1,1000)
  camera.position.x= -30
  camera.position.y= 40
  camera.position.z= 30
  camera.lookAt(scene.position)
  scene.add(camera)
  // 创建渲染器
  let renderer = new THREE.WebGLRenderer()
  renderer.setClearColor(new THREE.Color(0xEEEEEE,1.0));
  renderer.setSize(window.innerWidth,window.innerHeight);
  renderer.shadowMapEnabled = true
  //点光
  let spotLight = new THREE.SpotLight(0xffffff);
  spotLight.castShadow = true;
  spotLight.position.set(-40,50,10);
  scene.add(spotLight)

  //平面图
  let planeGeometry = new THREE.PlaneGeometry(60,20)
  let planeMaterial = new THREE.MeshLambertMaterial({color:0xffffff})
  let plane = new THREE.Mesh(planeGeometry,planeMaterial)
  plane.receiveShadow = true
  plane.rotation.x = -0.5 * Math.PI;
  plane.position.x= 15
  plane.position.y= 0
  plane.position.z= 0
  scene.add(plane)

  // 立方体
  let cubeGeometry = new THREE.BoxGeometry(4,4,4)
  let cubeMaterial = new THREE.MeshLambertMaterial({color:0x765909})
  let cube = new THREE.Mesh(cubeGeometry,cubeMaterial)
  cube.castShadow = true
  cube.position.x = -4;
  cube.position.y = 3;
  cube.position.z = 0;

  scene.add(cube)

  //球体
  let sphereGeometry = new THREE.SphereGeometry(4,20,20)
  let sphereMaterial = new THREE.MeshLambertMaterial({color:0x7777ff})
  let sphere = new THREE.Mesh(sphereGeometry,sphereMaterial)
  sphere.castShadow = true
  sphere.position.x = 20
  sphere.position.y = 4
  sphere.position.z = 4

  scene.add(sphere)



  //@ts-ignore
  document.getElementById('WebGL-output').append(renderer.domElement)

  renderScene()
  var step = 0
  function renderScene() {
    stats.update()
    // cube.rotation.x += 0.02
    // cube.rotation.y += 0.02
    // cube.rotation.z += 0.02

    step+=0.04

    sphere.position.x = 20 + (10 * (Math.cos(step)))
    sphere.position.y = 2 + (10 * (Math.abs(Math.sin(step))))

    requestAnimationFrame(renderScene)
    renderer.render(scene,camera)
  }
  function initState() {
    //@ts-ignore
    let stats = new Stats()
    stats.setMode(0)
    stats.domElement.position='absolute'
    stats.domElement.left='0px'
    stats.domElement.top='0px'
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
