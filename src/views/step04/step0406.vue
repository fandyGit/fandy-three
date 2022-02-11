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
  // 场景
  let scene = new THREE.Scene()
  // 相机
  let camera = new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,0.1,1000)
  camera.position.x = -30
  camera.position.y = 30
  camera.position.z = 30
  camera.lookAt(new THREE.Vector3(10,0,0))
  scene.add(camera)
  // 渲染器
  let renderer = new THREE.WebGLRenderer()
  renderer.setClearColor(new THREE.Color(0xffffff,1))
  renderer.setSize(window.innerWidth,window.innerHeight)
  renderer.shadowMapEnabled = true
  scene.add(renderer)
  // 环境光
  let ambientLight = new THREE.AmbientLight(0x666666)
  scene.add(ambientLight)
  // 点光
  let spotLight = new THREE.SpotLight(0xeeeeee)
  spotLight.position.set(-30,30,30)
  spotLight.castShadow = true
  scene.add(spotLight)
  // 平面图
  let groundGeometry = new THREE.PlaneGeometry(60,40,4,4)
  let groundMaterial = new THREE.MeshLambertMaterial({color:0x9876f54})
  let ground = new THREE.Mesh(groundGeometry,groundMaterial)
  ground.rotation.x = -0.5*Math.PI
  ground.position.x = 3
  ground.position.y = 0
  ground.position.z = 0
  ground.castShadow = true
  scene.add(ground)

  // 共有材质
  let meshMaterial = new THREE.MeshLambertMaterial({color:0x777777})
  // 构建三个图形
  let cubeGeometry = new THREE.BoxGeometry(14,14,14)
  let sphereGeometry = new THREE.SphereGeometry(14,10,10)
  let planeGeometry = new THREE.PlaneGeometry(14,14,4,4)

  let cube = new THREE.Mesh(cubeGeometry,meshMaterial)
  let sphere = new THREE.Mesh(sphereGeometry,meshMaterial)
  let plane = new THREE.Mesh(planeGeometry,meshMaterial)

  cube.position.x = 0
  cube.position.y = 3
  cube.position.z = 2

  sphere.position.clone(cube.position)
  plane.position.clone(cube.position)

  scene.add(cube)
  // @ts-ignore
  let controls = new function () {
    // @ts-ignore
    this.rotationSpeed = 0.05
    // @ts-ignore
    this.selectedMesh = 'cube'
    // @ts-ignore
    this.side = 'front'
    // @ts-ignore
    this.wrapAround = false
    // @ts-ignore
    this.wrapR = 1
    // @ts-ignore
    this.wrapG = 1
    // @ts-ignore
    this.wrapB = 1
    // @ts-ignore
    this.emissive = 0x909909
    // @ts-ignore
    this.opacity = meshMaterial.opacity
    // @ts-ignore
    this.transparent = meshMaterial.transparent
    // @ts-ignore
    this.visible = meshMaterial.visible
  }
  let gui = new dat.GUI()
  let spGui = gui.addFolder('mesh')
  spGui.add(controls,'rotationSpeed',0,0.5)
  spGui.add(controls,'opacity',0,1).onChange(function (e: any) {
    meshMaterial.opacity = e
  })
  spGui.add(controls,'transparent').onChange(function (e: any) {
    meshMaterial.transparent = e
  })
  spGui.add(controls,'visible').onChange(function (e: any) {
    meshMaterial.visible = e
  })
  spGui.add(controls,'wrapAround').onChange(function (e: any) {
    meshMaterial.wrapAround = e
    meshMaterial.needsUpdate = true
  })
  spGui.add(controls,'wrapR',0,1).onChange(function (e: any) {
    meshMaterial.wrapRGB.x = e
  })
  spGui.add(controls,'wrapG',0,1).onChange(function (e: any) {
    meshMaterial.wrapRGB.y = e
  })
  spGui.add(controls,'wrapB',0,1).onChange(function (e: any) {
    meshMaterial.wrapRGB.z = e
  })
  spGui.addColor(controls,'emissive').onChange(function (e: any) {
    meshMaterial.emissive = new THREE.Color(e)
  })
  spGui.add(controls,'selectedMesh',['cube','sphere','plane']).onChange(function (e:any){
    scene.remove(cube)
    scene.remove(sphere)
    scene.remove(plane)
    switch (e) {
      case 'cube':
        scene.add(cube)
            break
      case 'sphere':
        scene.add(sphere)
            break
      case 'plane':
        scene.add(plane)
            break
    }
    scene.add(e)
  })
  spGui.add(controls,'side',['front','back','double']).onChange(function (e:any){
    switch (e) {
      case 'front':
        meshMaterial.side = THREE.FrontSide
        break
      case 'back':
        meshMaterial.side = THREE.BackSide
        break
      case "double":
        meshMaterial.side = THREE.DoubleSide;
        break;
    }
  })





  //@ts-ignore
  document.getElementById('WebGL-output').append(renderer.domElement)
  // 渲染函数
  function renderScene() {
    stats.update()
    sphere.rotation.y += controls.rotationSpeed
    cube.rotation.y += controls.rotationSpeed
    plane.rotation.y += controls.rotationSpeed
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
