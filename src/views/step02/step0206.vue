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
    stats.domElement.right = '0px'
    //@ts-ignore
    document.getElementById('Stats-output').append(stats.domElement)
    return stats
  }
  let scene = new THREE.Scene
  let camera = new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,0.1,1000)
  camera.position.x = 120
  camera.position.y = 60
  camera.position.z = 180
  camera.lookAt(scene.position)

  let renderer = new THREE.WebGLRenderer()
  renderer.shadowMapEnabled = true
  renderer.setClearColor(new THREE.Color(0xeeeee,1.0))
  renderer.setSize(window.innerWidth,window.innerHeight)

  let spotLight = new THREE.SpotLight(0x666666)
  spotLight.castShadow = true
  spotLight.position.set(-40,40,40)
  scene.add(spotLight)

  let directionalLight = new THREE.DirectionalLight({color:0xffffff})
  directionalLight.position.set(-20,40,60)
  scene.add(directionalLight)

  // add subtle ambient lighting
  var ambientLight = new THREE.AmbientLight(0x292929);
  scene.add(ambientLight);

  let planeGeometry = new THREE.PlaneGeometry(180,180)
  let planeMaterial = new THREE.MeshLambertMaterial({color:0x383838})
  let plane = new THREE.Mesh(planeGeometry,planeMaterial)

  plane.rotation.x = -0.5 * Math.PI
  plane.position.x = 0
  plane.position.y = 0
  plane.position.z = 0
  scene.add(plane)

  for (var j = 0; j < (planeGeometry.parameters.width/5); j++) {
    for(var i = 0; i < (planeGeometry.parameters.height/5);i++) {
      let cubeSize = Math.ceil(Math.random() * 4)
      let cubeGeometry = new THREE.BoxGeometry(4,4,4)
      let cubeMaterial = new THREE.MeshLambertMaterial({color:Math.random() * 0xffffff})
      let cube = new THREE.Mesh(cubeGeometry,cubeMaterial)

      cube.position.x = -((planeGeometry.parameters.width)/2) + 2 + (i*5)
      cube.position.z = -((planeGeometry.parameters.height)/2) + 2 + (j*5)
      cube.position.y = 2

      scene.add(cube)
    }

  }
  //@ts-ignore
  let controls = new function () {
    //@ts-ignore
    this.perspective = 'perspective'
    //@ts-ignore
    this.switchCamera = function () {
      if (camera instanceof THREE.PerspectiveCamera) {
          camera = new THREE.OrthographicCamera(window.innerWidth/-16,window.innerWidth/16,window.innerHeight/16,window.innerHeight/-16,-200,500)
          camera.position.x = 120
          camera.position.y = 60
          camera.position.z = 180
          camera.lookAt(scene.position)
          this.perspective = 'orthographicCamera'
      } else {
          camera = new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,0.1,1000)
          camera.position.x = 120
          camera.position.y = 60
          camera.position.z = 180
          camera.lookAt(scene.position)
          this.perspective = 'perspective'
      }
    }

  }
  let gui = new dat.GUI()
  gui.add(controls,'switchCamera')
  gui.add(controls,'perspective').listen()

  let lookGeometry = new THREE.SphereGeometry(2)
  let lookAtMesh = new THREE.Mesh(lookGeometry,new THREE.MeshLambertMaterial({color:0xff0000}))
  scene.add(lookAtMesh)

  //@ts-ignore
  document.getElementById('WebGL-output').append(renderer.domElement)
  renderScene()
  var step = 0
  function renderScene() {
    stats.update()
    step += 0.02
    if (camera instanceof THREE.Camera) {
      let x = 10 +(100 * Math.sin(step))
      camera.lookAt(new THREE.Vector3(x,10,0))
      lookAtMesh.position.copy(new THREE.Vector3(x,10,0))
    }
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
