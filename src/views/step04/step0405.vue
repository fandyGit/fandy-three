<template>
  <div id="Stats-output"></div>
  <div id="WebGL-output"></div>
</template>

<script setup lang="ts">
import {onMounted, render} from 'vue'
onMounted(() => {
  function initState() {
    //@ts-ignore
    let stats = new Stats()
    stats.setMode(0)
    stats.domElement.position = 'absolute'
    stats.domElement.left = '0px'
    stats.domElement.top = '0px'
    //@ts-ignore
    document.getElementById('Stats-output').append(stats.domElement)
    return stats
  }
  let stats = initState()
  //场景
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
  renderer.setClearColor(new THREE.Color(0xffffff,0.5))
  renderer.setSize(window.innerWidth,window.innerHeight)
  renderer.shadowMapEnabled = true
  scene.add(renderer)
  //环境光
  let ambientLight = new THREE.AmbientLight(0x666666)
  scene.add(ambientLight)
  // 点光
  let spotLight = new THREE.SpotLight(0x99ff99)
  spotLight.position.set(-30,30,30)
  spotLight.castShadow = true
  scene.add(spotLight)
  // 平面图
  let planeGeometry = new THREE.PlaneGeometry(60,40)
  let planeMaterial = new THREE.MeshLambertMaterial({color:Math.random()*0xffffff})
  let plane = new THREE.Mesh(planeGeometry,planeMaterial)
  plane.rotation.x = -0.5 * Math.PI
  plane.position.x = 4
  plane.position.y = 0
  plane.position.z = 0
  plane.receiveShadow = true
  scene.add(plane)

  // 魔方
  let ground = new THREE.Mesh()
  let mats = []
  mats.push(new THREE.MeshBasicMaterial({color: 0x009e60 }))
  mats.push(new THREE.MeshBasicMaterial({color: 0x009e60 }))
  mats.push(new THREE.MeshBasicMaterial({color: 0x0051ba }))
  mats.push(new THREE.MeshBasicMaterial({color: 0x0051ba }))
  mats.push(new THREE.MeshBasicMaterial({color: 0xffd500 }))
  mats.push(new THREE.MeshBasicMaterial({color: 0xffd500 }))
  mats.push(new THREE.MeshBasicMaterial({color: 0xff5800 }))
  mats.push(new THREE.MeshBasicMaterial({color: 0xff5800 }))
  mats.push(new THREE.MeshBasicMaterial({color: 0xC41E3A }))
  mats.push(new THREE.MeshBasicMaterial({color: 0xC41E3A }))
  mats.push(new THREE.MeshBasicMaterial({color: 0xffffff }))
  mats.push(new THREE.MeshBasicMaterial({color: 0xffffff }))

  let faceMaterial = new THREE.MeshFaceMaterial(mats)
  let widthNumber = 4
  let cubeWidth = 3
  for (var i = 0; i < widthNumber; i++) {
    for (var j = 0; j < widthNumber; j++) {
      for (var k = 0; k < widthNumber; k++) {
        let cubeGeometry = new THREE.BoxGeometry(cubeWidth-0.1,cubeWidth-0.1,cubeWidth-0.1)
        let cube = new THREE.Mesh(cubeGeometry,faceMaterial)
        cube.position.set(i*cubeWidth - cubeWidth,j*cubeWidth,k*cubeWidth - cubeWidth)
        ground.add(cube)
      }
    }
  }
  scene.add(ground)
  //@ts-ignore
  let controls = new function () {
    //@ts-ignore
    this.rotationSpeed = 0.01
  }
  let gui = new dat.GUI()
  gui.add(controls,'rotationSpeed',0,0.5)
  //@ts-ignore
  document.getElementById('WebGL-output').append(renderer.domElement)

  // 渲染函数
  function renderScene(){
    stats.update()
    ground.rotation.y += controls.rotationSpeed
    requestAnimationFrame(renderScene)
    renderer.render(scene,camera)
  }
  renderScene()
})


</script>

<style lang="scss" scoped>
#WebGL-output{
  width: 100%;
  height: 100%;
  overflow-x: hidden;
}

</style>
