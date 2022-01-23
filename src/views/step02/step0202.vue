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
    stats.domElement.left = '0px'
    stats.domElement.top = '0px'

    //@ts-ignore
    document.getElementById('Stats-output').append(stats.domElement)
    return stats
  }
  let scene = new THREE.Scene()
  scene.fog = new THREE.Fog(0xffffff,0.015,80)

  let camera = new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,0.1,1000)
  camera.position.x = -40
  camera.position.y = 40
  camera.position.z = 30
  camera.lookAt(scene.position)

  let renderer = new THREE.WebGLRenderer()
  renderer.setClearColor(new THREE.Color(0xEEEEEE,1.0))
  renderer.setSize(window.innerWidth,window.innerHeight)
  renderer.shadowMapEnabled = true

  let ambientLight = new THREE.AmbientLight(0x0c0c0c)
  scene.add(ambientLight)

  let spotLight = new THREE.SpotLight(0xffffff)
  spotLight.position.set(-40,30,10)
  spotLight.castShadow = true
  scene.add(spotLight)

  let planeGeometry = new THREE.PlaneGeometry(60,40,1,1)
  let planeMaterial = new THREE.MeshLambertMaterial({color:0xffffff})
  let plane = new THREE.Mesh(planeGeometry,planeMaterial)


  plane.rotation.x = -0.5 *Math.PI
  plane.position.x = 4
  plane.position.y = 0
  plane.position.z = 0
  scene.add(plane)

  // 应用到所有的材质
  scene.overrideMaterial = new THREE.MeshLambertMaterial({color:0x999999})
  //@ts-ignore
  let controls = new function (){
    //@ts-ignore
    this.rotationSpeed = 0.02
    //@ts-ignore
    this.numberOfObjects = scene.children.length
    //@ts-ignore
    this.addCube = function () {
      let cubeSize = Math.ceil(Math.random() * 3)
      let cubeGeometery = new THREE.CubeGeometry(cubeSize,cubeSize,cubeSize)
      let cubeMaterial = new THREE.MeshLambertMaterial({color: Math.random()*0xffffff})
      let cube = new THREE.Mesh(cubeGeometery,cubeMaterial)

      cube.position.x = -30 + Math.round(Math.random() * planeGeometry.parameters.width)
      cube.position.y = Math.round(Math.random() * 4)
      cube.position.z = -20 + Math.round(Math.random() * planeGeometry.parameters.height)

      scene.add(cube)
      this.numberOfObjects = scene.children.length
    }
    //@ts-ignore
    this.removeCube = function () {
      let allChildren = scene.children
      let lastChildren = allChildren[allChildren.length - 1]
      if (lastChildren instanceof THREE.Mesh) {
        scene.remove(lastChildren)
        this.numberOfObjects = scene.children.length
      }
    }
  }

  let gui = new dat.GUI()
  gui.add(controls,'rotationSpeed',0,0.5)
  gui.add(controls,'addCube')
  gui.add(controls,'removeCube')
  gui.add(controls,'numberOfObjects')

  //@ts-ignore
  document.getElementById('WebGL-output').append(renderer.domElement)
  renderScene()
  function renderScene() {

    stats.update()
    scene.traverse(function (e: any) {
      if (e instanceof THREE.Mesh && e!=plane){
        e.rotation.x += controls.rotationSpeed
        e.rotation.y += controls.rotationSpeed
        e.rotation.z += controls.rotationSpeed
      }
    })
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
