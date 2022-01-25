<template>
<!--  <img src="../../assets/textures/ground/grasslight-big.jpg" alt="">-->
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
  scene.fog = new THREE.Fog(0xaaaaaa, 0.010, 200)

  let camera = new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,0.1,1000)
  camera.position.x = -20
  camera.position.y = 15
  camera.position.z = 45
  camera.lookAt(new THREE.Vector3(10,0,0))

  let renderer = new THREE.WebGLRenderer()
  renderer.setClearColor(new THREE.Color(0xaaaaff,1.0))
  renderer.setSize(window.innerWidth,window.innerHeight)
  renderer.shadowMapEnabled = true

  // create the ground plane
  let textureGrass = THREE.ImageUtils.loadTexture(getImageUrl());
  textureGrass.wrapS = THREE.RepeatWrapping;
  textureGrass.wrapT = THREE.RepeatWrapping;
  textureGrass.repeat.set(4, 4);

  let planeGeometry = new THREE.PlaneGeometry(1000,200,20,20)
  let planeMaterial = new THREE.MeshLambertMaterial({map: textureGrass})
  let plane = new THREE.Mesh(planeGeometry,planeMaterial)

  plane.receiveShadow = true
  plane.rotation.x = -0.5 * Math.PI
  plane.position.x = 15
  plane.position.y = 0
  plane.position.z = 0
  scene.add(plane)


  let cubeGeometry = new THREE.BoxGeometry(4,4,4)
  let cubeMaterial = new THREE.MeshLambertMaterial({map:textureGrass})
  let cube = new THREE.Mesh(cubeGeometry,cubeMaterial)
  cube.castShadow = true
  cube.position.x = -4
  cube.position.y = 3
  cube.position.z = 2
  scene.add(cube)

  let sphereGeometry = new THREE.SphereGeometry(4,20,20)
  let sphereMaterial = new THREE.MeshLambertMaterial({map:textureGrass})
  let sphere = new THREE.Mesh(sphereGeometry,sphereMaterial)
  sphere.position.x = 10
  sphere.position.y = 5
  sphere.position.z = 10
  sphere.castShadow = true
  scene.add(sphere)

  let hemiLight = new THREE.HemisphereLight(0x0000ff,0x00ff00,0.6)
  hemiLight.position.set(0, 500, 0);
  scene.add(hemiLight)
// add spotlight for a bit of light
  var spotLight0 = new THREE.SpotLight(0xcccccc);
  spotLight0.position.set(-40, 60, -10);
  spotLight0.lookAt(plane);
  scene.add(spotLight0);

  let ambiColor = '#1fe709'
  let ambientLight = new THREE.AmbientLight(ambiColor)
  scene.add(ambientLight)

  let pointColor = '#ffffff'
  let directionalLight = new THREE.DirectionalLight(pointColor)
  directionalLight.position.set(-60,40,-10)
  directionalLight.castShadow = true
  directionalLight.target = plane
  directionalLight.shadowCameraNear = 0.1
  directionalLight.shadowCameraFar = 1000
  directionalLight.shadowCameraLeft = -50
  directionalLight.shadowCameraRight = 50
  directionalLight.shadowCameraTop = 50
  directionalLight.shadowCameraBottom = -50
  directionalLight.distance = 0
  directionalLight.intensity = 0.4
  directionalLight.shadowMapWidth = 2048
  directionalLight.shadowMapHeight = 2048
  //@ts-ignore
  let controls = new function () {
    //@ts-ignore
    this.cubeSpeed = 0.02
    //@ts-ignore
    this.sphereSpeed = 0.03
    //@ts-ignore
    this.skyColor = 0x0000ff;
    //@ts-ignore
    this.color = 0x00ff00;

  }

  let gui = new dat.GUI()
  gui.add(controls,'cubeSpeed',0,5)
  gui.add(controls,'sphereSpeed',0,5)
  gui.addColor(controls,'skyColor').onChange(function (e:any){
    hemiLight.color = new THREE.Color(e)
  })
  gui.addColor(controls,'color').onChange(function (e:any){
    hemiLight.groundColor = new THREE.Color(e)
  })

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

    sphere.position.x = 20 + 10 * Math.sin(step)
    sphere.position.y = 2 + 10 * Math.abs(Math.sin(step))

    requestAnimationFrame(renderScene)
    renderer.render(scene,camera)
  }
  function getImageUrl() {
    return new URL(`../../assets/textures/ground/grasslight-big.jpg`, import.meta.url).href;
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
