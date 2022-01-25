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
  scene.fog = new THREE.Fog(0xaaaaaa,0.01,200)
  let camera = new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,0.1,1000)
  camera.position.x = -20
  camera.position.y = 15
  camera.position.z = 45
  camera.lookAt(new THREE.Vector3(10,0,0))

  let renderer = new THREE.WebGLRenderer({antialias: false, alpha: true})
  renderer.setClearColor(new THREE.Color(0xaaaaff,1.0))
  renderer.setSize(window.innerWidth,window.innerHeight)
  renderer.shadowMapEnabled = true

  // create the ground plane
  let textureGrass = THREE.ImageUtils.loadTexture(getImageUrl('../../assets/textures/ground/grasslight-big.jpg'));
  textureGrass.wrapS = THREE.RepeatWrapping;
  textureGrass.wrapT = THREE.RepeatWrapping;
  textureGrass.repeat.set(4, 4);

  let planeGeometry = new THREE.PlaneGeometry(1000,200,20,20)
  let planeMaterial = new THREE.MeshLambertMaterial({map:textureGrass})
  let plane = new THREE.Mesh(planeGeometry,planeMaterial)
  plane.rotation.x = -0.5 * Math.PI
  plane.position.x = 15
  plane.position.y = 0
  plane.position.z = 0
  plane.receiveShadow = true
  scene.add(plane)

  let cubeGeometry = new THREE.BoxGeometry(4,4,4)
  let cubeMaterial = new THREE.MeshLambertMaterial({color:0x348899})
  let cube = new THREE.Mesh(cubeGeometry,cubeMaterial)
  cube.position.x = -4
  cube.position.y = 2
  cube.position.z = 2
  cube.castShadow = true
  scene.add(cube)

  let sphereGeometry = new THREE.SphereGeometry(4,20,20)
  let sphereMaterial = new THREE.MeshLambertMaterial({color:'#0bee0f'})
  let sphere = new THREE.Mesh(sphereGeometry,sphereMaterial)
  sphere.position.x = 4
  sphere.position.y = 2
  sphere.position.z = 2
  sphere.castShadow = true
  scene.add(sphere)

  let ambientLight = new THREE.AmbientLight(0x333333)
  scene.add(ambientLight)

  var spotLight0 = new THREE.SpotLight(0xcccccc);
  spotLight0.position.set(-40, 60, -10);
  spotLight0.lookAt(plane);
  scene.add(spotLight0);

  let pointColor = '#1c1c1c'
  let spotLight = new THREE.DirectionalLight(pointColor)
  spotLight.position.set(30, 10, -50);
  spotLight.castShadow = true;
  spotLight.shadowCameraNear = 0.1;
  spotLight.shadowCameraFar = 100;
  spotLight.shadowCameraFov = 50;
  spotLight.target = plane;
  spotLight.distance = 0;
  spotLight.shadowCameraNear = 2;
  spotLight.shadowCameraFar = 200;
  spotLight.shadowCameraLeft = -100;
  spotLight.shadowCameraRight = 100;
  spotLight.shadowCameraTop = 100;
  scene.add(spotLight)
  //@ts-ignore
  let controls = new function () {
    //@ts-ignore
    this.pointColor = pointColor
    //@ts-ignore
    this.cubeSpeed = 0.03
    //@ts-ignore
    this.sphereSpeed = 0.03
  }
  let gui = new dat.GUI()
  gui.add(controls,'cubeSpeed',0,5)
  gui.add(controls,'sphereSpeed',0,5)
  gui.addColor(controls,'pointColor').onChange(function (e: any){
    spotLight.color = new THREE.Color(e)
  })

  let textureFlare0 = THREE.ImageUtils.loadTexture(getImageUrl("../../assets/textures/lensflare/lensflare0.png"));
  let textureFlare3 = THREE.ImageUtils.loadTexture(getImageUrl("../../assets/textures/lensflare/lensflare3.png"));

  let flareColor = new THREE.Color(0xffaacc);
  let lensFlare = new THREE.LensFlare(textureFlare0, 350, 0.0, THREE.AdditiveBlending, flareColor);

  // lensFlare.add(textureFlare3, 60, 0.6, THREE.AdditiveBlending);
  // lensFlare.add(textureFlare3, 70, 0.7, THREE.AdditiveBlending);
  // lensFlare.add(textureFlare3, 120, 0.9, THREE.AdditiveBlending);
  // lensFlare.add(textureFlare3, 70, 1.0, THREE.AdditiveBlending);

  lensFlare.position.copy(spotLight.position);
  scene.add(lensFlare);

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

    sphere.position.x = 20 + 10 * Math.cos(step)
    sphere.position.y = 2 + 10 * Math.abs(Math.sin(step))

    requestAnimationFrame(renderScene)
    renderer.render(scene,camera)
  }

  // ../../assets/textures/ground/grasslight-big.jpg
  function getImageUrl(url:string) {
    return new URL(url, import.meta.url).href;
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
