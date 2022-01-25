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
  camera.lookAt(new THREE.Vector3(10, 0, 0))

  let renderer = new THREE.WebGLRenderer()
  renderer.setClearColor(new THREE.Color(0xeeeeee,1.0))
  renderer.setSize(window.innerWidth,window.innerHeight)
  renderer.shadowMapEnabled = true



  let planeGeometry = new THREE.PlaneGeometry(60,20,1,1)
  let planeMaterial = new THREE.MeshLambertMaterial({color:0xffffff})
  let plane = new THREE.Mesh(planeGeometry,planeMaterial)
  plane.rotation.x = -0.5 * Math.PI
  plane.position.x = 15
  plane.position.y = 0
  plane.position.z = 0
  plane.receiveShadow = true
  scene.add(plane)

  let cubeGeometry = new THREE.BoxGeometry(4,4,4)
  let cubeMaterial =new THREE.MeshLambertMaterial({color:0xff3333})
  let cube = new THREE.Mesh(cubeGeometry,cubeMaterial)
  cube.castShadow = true
  cube.position.x = -4
  cube.position.y = 3
  cube.position.z = 0
  scene.add(cube)

  let sphereGeometry = new THREE.SphereGeometry(4,20,20)
  let sphereMaterial = new THREE.MeshLambertMaterial({color:0x4598ff})
  let sphere = new THREE.Mesh(sphereGeometry,sphereMaterial)
  sphere.castShadow = true
  sphere.position.x = 20
  sphere.position.y = 0
  sphere.position.z = 2
  scene.add(sphere)

  let spotLight0 = new THREE.SpotLight(0xcccccc)
  spotLight0.position.set(-40,30,-10)
  // spotLight0.castShadow = true
  spotLight0.lookAt(plane)
  scene.add(spotLight0)

  let ambColor = '#1c1c1c'
  let ambientLight = new THREE.AmbientLight(ambColor)
  scene.add(ambientLight)

  let target = new THREE.Object3D();
  //@ts-ignore
  target.position.set(new THREE.Vector3(5, 0, 0))

  let spotColor = '#ffffff'
  var spotLight = new THREE.SpotLight(spotColor)
  spotLight.position.set(-40,60,10)
  spotLight.castShadow = true
  spotLight.shadowCameraNear = 2
  spotLight.shadowCameraFar = 200
  spotLight.shadowCameraFov = 45
  spotLight.target = plane
  spotLight.distance = 0
  spotLight.angle = 0.4


  scene.add(spotLight)

  let sphereLightGeometry = new THREE.SphereGeometry(0.2)
  let sphereLightMaterial = new THREE.MeshLambertMaterial({color:0xac6c25})
  let sphereLight = new THREE.Mesh(sphereLightGeometry,sphereLightMaterial)
  sphereLight.castShadow = true
  sphereLight.position.set(new THREE.Vector3(3,20,3))
  scene.add(sphereLight)

  //@ts-ignore
  let controls = new function () {
    //@ts-ignore
    this.cubeSpeed = 0.02
    //@ts-ignore
    this.sphereSpeed = 0.03
    //@ts-ignore
    this.ambientColor = ambColor
    //@ts-ignore
    this.pointColor = spotColor
    //@ts-ignore
    this.stopMovingLight = false;
    //@ts-ignore
    this.debug = false;
    //@ts-ignore
    this.target = 'Plane';
    //@ts-ignore
    this.intensity = 0;
  }

  let gui = new dat.GUI()
  gui.add(controls,'cubeSpeed',0,5)
  gui.add(controls,'sphereSpeed',0,5)
  gui.addColor(controls,'ambientColor').onChange(function (e: any){
    //@ts-ignore
    ambientLight.color = new THREE.Color(e)
  })
  gui.addColor(controls,'pointColor').onChange(function (e: any){
    //@ts-ignore
    spotLight.color = new THREE.Color(e)
  })
  gui.add(controls, 'stopMovingLight').onChange(function (e:any) {
    stopMovingLight = e;
  });
  gui.add(controls, 'debug').onChange(function (e:any) {
    spotLight.shadowCameraVisible = e;
  });
  gui.add(controls, 'intensity',0,5).onChange(function (e:any) {
    spotLight.intensity = e;
  });
  gui.add(controls,'target',['Plane','Sphere','Cube']).onChange(function (e:any) {
    switch (e) {
      case 'Plane':
        spotLight.target = plane
            break;
      case 'Sphere':
        spotLight.target = sphere
            break;
      case 'Cube':
        spotLight.target = cube
            break;
    }
  })

  var stopMovingLight = false;
  var phase = 0;
  //@ts-ignore
  document.getElementById('WebGL-output').append(renderer.domElement)
  renderScene()
  var step = 0
  var invert = 1
  function renderScene() {
    stats.update()
    cube.rotation.x += controls.cubeSpeed
    cube.rotation.y += controls.cubeSpeed
    cube.rotation.z += controls.cubeSpeed

    step += controls.sphereSpeed
    sphere.position.x = 20 + 10*Math.sin(step)
    sphere.position.y = 2 + 10*Math.abs(Math.sin(step))

    if (!stopMovingLight) {
      if (phase > 2 * Math.PI) {
        invert = invert * -1
        phase -= 2 * Math.PI;
      }else {
        phase += controls.cubeSpeed;
      }
      sphereLight.position.z = +(7 * (Math.sin(phase)));
      sphereLight.position.x = +(14 * (Math.cos(phase)));
      sphereLight.position.y = 10;
      if (invert < 0) {
        var pivot = 14;
        sphereLight.position.x = (invert * (sphereLight.position.x - pivot)) + pivot;
      }
      spotLight.position.copy(sphereLight.position);
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
