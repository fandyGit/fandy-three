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
  let scene = new THREE.Scene()
  let camera = new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,0.1,1000)
  camera.position.x = -30
  camera.position.y = 40
  camera.position.z = 40
  camera.lookAt(scene.position)

  let renderer = new THREE.WebGLRenderer()
  renderer.setClearColor(new THREE.Color(0xeeeeee,1.0))
  renderer.setSize(window.innerWidth,window.innerHeight)
  renderer.shadowMapEnabled = true
  //
  let spotLight = new THREE.SpotLight(0xffff00)
  spotLight.position.set(-30,30,40)
  spotLight.castShadow = true
  scene.add(spotLight)


  // 环境光
  let ambientLight = new THREE.AmbientLight(0x888888)
  scene.add(ambientLight)
  // 点光
  let pointColor = '#e81009'
  let pointLight =new THREE.PointLight(pointColor)
  pointLight.distance = 50
  scene.add(pointLight)

  pointLight.position.set( 10, 10, 10 );
  var sphereSize = 1;
  var pointLightHelper = new THREE.PointLightHelper( pointLight, sphereSize );
  scene.add( pointLightHelper );

  let directionalLight = new THREE.DirectionalLight(0x777777)
  directionalLight.position.set(-30,40,40)

  let planeGeometry = new THREE.PlaneGeometry(60,20)
  let planeMaterial = new THREE.MeshLambertMaterial({color:0x45ff45})
  let plane = new THREE.Mesh(planeGeometry,planeMaterial)
  plane.receiveShadow = true

  plane.rotation.x = -0.5 * Math.PI
  plane.position.x = 0
  plane.position.y = 0
  plane.position.z = 0
  scene.add(plane)

  let cubeGeometry = new THREE.BoxGeometry(4,4,4)
  let cubeMaterial = new THREE.MeshLambertMaterial({color:0x595959})
  let cube = new THREE.Mesh(cubeGeometry,cubeMaterial)
  cube.castShadow = true
  cube.position.x = -8
  cube.position.y = 2
  cube.position.z = 2
  scene.add(cube)

  let sphereGeometry = new THREE.SphereGeometry(4,20,20)
  let sphereMaterial = new THREE.MeshLambertMaterial({color:0x456599})
  let sphere = new THREE.Mesh(sphereGeometry,sphereMaterial)
  sphere.castShadow = true
  sphere.position.x = 5
  sphere.position.y = 4
  sphere.position.z = 2

  scene.add(sphere)
  //@ts-ignore
  let controls = new function () {
    //@ts-ignore
    this.cubeSpeed = 0.02
    //@ts-ignore
    this.sphereSpeed = 0.03
  }

  let gui = new dat.GUI()
  gui.add(controls,'cubeSpeed',0,5)
  gui.add(controls,'sphereSpeed',0,5)



  //@ts-ignore
  document.getElementById('WebGL-output').append(renderer.domElement)

  renderScene()
  var step = 0
  function renderScene() {
    stats.update()
    cube.rotation.x += controls.cubeSpeed
    cube.rotation.y += controls.cubeSpeed
    cube.rotation.z += controls.cubeSpeed

    step += controls.sphereSpeed
    sphere.position.x = 10 + 10 * Math.cos(step)
    sphere.position.y = 2 + 10 * Math.abs(Math.sin(step))

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
