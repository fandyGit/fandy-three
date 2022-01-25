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
  camera.position.y = 30
  camera.position.z = 30
  camera.lookAt(new THREE.Vector3(10,0,0))

  let renderer = new THREE.WebGLRenderer()
  renderer.setClearColor(new THREE.Color(0xeeeeee,1.0))
  renderer.shadowMapEnabled = true
  renderer.setSize(window.innerWidth,window.innerHeight)

  let ambiColor = '#1c1c1c'
  let ambiLight = new THREE.AmbientLight(ambiColor)
  scene.add(ambiLight)

  let spotLight = new THREE.SpotLight(0xffffff)
  spotLight.position.set(3,25,20)
  spotLight.castShadow = true
  spotLight.shadowCameraVisible = true
  spotLight.shadowCameraNear = 2
  spotLight.shadowCameraFar = 200
  spotLight.shadowCameraFov = 45
  spotLight.distance = 0
  // scene.add(spotLight)

  let planeGeometry = new THREE.PlaneGeometry(600,200,20,20)
    let planeMaterial = new THREE.MeshLambertMaterial({color:0x898760})
  let plane = new THREE.Mesh(planeGeometry,planeMaterial)
  plane.rotation.x = -0.5 * Math.PI
  plane.position.x = 15
  plane.position.y = -5
  plane.position.z = 0
  plane.castShadow = true
  scene.add(plane)

  let cubeGeometry = new THREE.BoxGeometry(4,4,4)
  let cubeMaterial = new THREE.MeshLambertMaterial({color:0xff4588})
  let cube = new THREE.Mesh(cubeGeometry,cubeMaterial)
  cube.position.x = -4
  cube.position.y = 3
  cube.position.z = 0
  cube.castShadow = true
  scene.add(cube)

  let sphereGeometry = new THREE.SphereGeometry(4,20,20)
  let sphereMaterial = new THREE.MeshLambertMaterial({color:0x7777ff})
  let sphere = new THREE.Mesh(sphereGeometry,sphereMaterial)
  sphere.castShadow = true
  sphere.position.x = 20
  sphere.position.y = 0
  sphere.position.z = 2
  scene.add(sphere)

  let sphereLightGeometry = new THREE.SphereGeometry(0.2)
  let sphereLightMaterial = new THREE.MeshLambertMaterial({colr:0xac6c25})
  let sphereLightMesh = new THREE.Mesh(sphereLightGeometry,sphereLightMaterial)
  sphereLightMesh.castShadow = true
  sphereLightMesh.position.x = 10
  sphereLightMesh.position.y = 0
  sphereLightMesh.position.z = 2
  scene.add(sphereLightMesh)

  let pointColor = '#ff5808'
  let directionalLight = new THREE.DirectionalLight(pointColor)
  directionalLight.position.set(-40,60,-10)
  directionalLight.castShadow = true
  directionalLight.shadowCameraNear = 2
  directionalLight.shadowCameraFar = 200
  directionalLight.shadowCameraLeft = -50
  directionalLight.shadowCameraRight = 50
  directionalLight.shadowCameraTop = 50
  directionalLight.shadowCameraBottom = -50

  directionalLight.distance = 0;
  directionalLight.intensity = 0.5;
  directionalLight.shadowMapHeight = 1024;
  directionalLight.shadowMapWidth = 1024;
  var target = new THREE.Object3D();
  target.position.set(new THREE.Vector3(5, 0, 0))
  scene.add(directionalLight)


  //@ts-ignore
  let controls = new function () {
    //@ts-ignore
    this.cubeSpeed = 0.02
    //@ts-ignore
    this.sphereSpeed = 0.03
    //@ts-ignore
    this.ambiColor = ambiColor
    //@ts-ignore
    this.pointColor = pointColor
    //@ts-ignore
    this.debug = false
    //@ts-ignore
    this.target = 'Plane'
    //@ts-ignore
    this.intensity = 0
  }

  let gui = new dat.GUI()
  gui.add(controls,'cubeSpeed',0,5)
  gui.add(controls,'sphereSpeed',0,5)
  gui.addColor(controls,'ambiColor').onChange(function (e:any) {
    ambiLight.color = new THREE.Color(e)
  })
  gui.addColor(controls,'pointColor').onChange(function (e:any) {
    directionalLight.color = new THREE.Color(e)
  })
  gui.add(controls,'debug').onChange(function (e:any) {
    directionalLight.shadowCameraVisible = e
  })
  gui.add(controls,'intensity',0,1).onChange(function (e:any) {
    directionalLight.intensity = e
  })
  gui.add(controls, 'target', ['Plane', 'Sphere', 'Cube']).onChange(function (e) {
    console.log(e);
    switch (e) {
      case "Plane":
        directionalLight.target = plane;
        break;
      case "Sphere":
        directionalLight.target = sphere;
        break;
      case "Cube":
        directionalLight.target = cube;
        break;
    }

  });
  //@ts-ignore
  document.getElementById('WebGL-output').append(renderer.domElement)
  renderScene()
  var step = 0

  function renderScene() {
    stats.update()

    cube.rotation.x += controls.cubeSpeed
    cube.rotation.y += controls.cubeSpeed
    cube.rotation.z += controls.cubeSpeed

    step+=controls.sphereSpeed

    sphere.position.x = 20 + 10 * Math.sin(step)
    sphere.position.y = 2 + 10 * Math.abs(Math.cos(step))

    sphereLightMesh.position.z = -8;
    sphereLightMesh.position.y = +(27 * (Math.sin(step / 3)));
    sphereLightMesh.position.x = 10 + (26 * (Math.cos(step / 3)));

    directionalLight.position.copy(sphereLightMesh.position)

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
