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
  let scene = new THREE.Scene()
  // 透视相机
  let camera = new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,0.1,1000)
  camera.position.x = -40
  camera.position.y = 30
  camera.position.z = 30
  camera.lookAt(scene.position)
  scene.add(camera)

  //渲染器
  let renderer = new THREE.WebGLRenderer()
  renderer.setClearColor(new THREE.Color(0xffffff,0.1))
  renderer.setSize(window.innerWidth,window.innerHeight)
  renderer.shadowMapEnabled = true
  scene.add(renderer)

  // 灯光
  let spotLight = new THREE.SpotLight(0xffffff)
  spotLight.position.set(-30,30,30)
  spotLight.castShadow = true
  scene.add(spotLight)

  //环境光
  let ambientLight = new THREE.AmbientLight(0x0c0c0c)
  scene.add(ambientLight)

  // 平面图
  let planeGeometry = new THREE.PlaneGeometry(60,20)
  let planeMaterial = new THREE.MeshLambertMaterial({color:0x99ff99})
  let plane = new THREE.Mesh(planeGeometry,planeMaterial)
  plane.castShadow = true
  plane.rotation.x = -0.5*Math.PI
  plane.position.x = 4
  plane.position.y = 0
  plane.position.z = 0
  scene.add(plane)

  /*// 立方体
  let cubeGeometry = new THREE.BoxGeometry(4,4,4)
  let cubeMaterial = new THREE.MeshLambertMaterial({color: 0x669933})
  let cube = new THREE.Mesh(cubeGeometry,cubeMaterial)
  cube.position.x = -12
  cube.position.y = 4
  cube.position.z = 2
  scene.add(cube)

  // 球体
  let sphereGeometry = new THREE.SphereGeometry(4,20,30)
  let sphereMaterial = new THREE.MeshLambertMaterial({color:0x558822})
  let sphere = new THREE.Mesh(sphereGeometry,sphereMaterial)
  sphere.position.x = 8
  sphere.position.y = 4
  sphere.position.z = 0
  scene.add(sphere)

  // 控制器
  let gui = new dat.GUI()
  // 控制器函数
  // @ts-ignore
  const controls = new function () {
    // @ts-ignore
    this.cubeSpeed = 0.01
    // @ts-ignore
    this.sphereSpeed = 0.01
    // @ts-ignore
    this.opacity = cubeMaterial.opacity
    // @ts-ignore
    this.transparent = cubeMaterial.transparent
    // @ts-ignore
    this.wireframe = cubeMaterial.wireframe
    // @ts-ignore
    this.wireframeLinewidth = cubeMaterial.wireframeLinewidth
    // @ts-ignore
    this.visible = cubeMaterial.visible
    // @ts-ignore
    this.color = cubeMaterial.color.getStyle()

  }
  gui.add(controls,'cubeSpeed')
  gui.add(controls,'sphereSpeed')
  let spGui = gui.addFolder('Mesh')
  spGui.add(controls,'opacity',0,1).onChange(function (e:any) {
    cubeMaterial.opacity = e
  })
  spGui.add(controls,'transparent').onChange(function (e:any) {
    cubeMaterial.transparent = e
  })
  spGui.add(controls,'wireframe').onChange(function (e:any) {
    cubeMaterial.wireframe = e
  })
  spGui.add(controls,'wireframeLinewidth',0,20).onChange(function (e:any) {
    cubeMaterial.wireframeLinewidth = e
  })
  spGui.add(controls,'visible').onChange(function (e:any) {
    cubeMaterial.visible = e
  })
  spGui.addColor(controls,'color').onChange(function (e:any) {
    cubeMaterial.color.setStyle(e)
  })*/



  //@ts-ignore
  document.getElementById('WebGL-output').append(renderer.domElement)
  let state = initState()
  function renderScene() {
    state.update()
    // cube.rotation.y += controls.cubeSpeed
    // sphere.rotation.y += controls.cubeSpeed
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
