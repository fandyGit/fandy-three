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
  camera.position.x = 20
  camera.position.y = 30
  camera.position.z = 21
  camera.lookAt(new THREE.Vector3(0, 0, -30))
  scene.add(camera)


  let renderer = new THREE.WebGLDeferredRenderer({
    width:window.innerWidth,
    height:window.innerHeight,
    scale:1,antialias:true,
    tonemapping: THREE.FilmicOperator,brightness:2.5
  })

  let planeGeometry = new THREE.PlaneGeometry(70,70,10,10)
  let planeMaterial = new THREE.MeshPhongMaterial({color: 0xffffff, specular: 0xffffff, shininess: 200})
  let plane = new THREE.Mesh(planeGeometry,planeMaterial)
  plane.rotation.x = -0.5 * Math.PI
  plane.position.x = 0
  plane.position.y = 0
  plane.position.z = 0
  scene.add(plane)

  let spotLight0 = new THREE.SpotLight(0xccccc)
  spotLight0.position.set(-40,60,10)
  spotLight0.intensity =0.1
  spotLight0.lookAt(plane)
  scene.add(spotLight0)

  let areaLight1 = new THREE.AreaLight(0xff0000,3)
  areaLight1.position.set(-10,10,-35)
  areaLight1.rotation.set(-Math.PI/2,0,0)
  areaLight1.width = 4
  areaLight1.height = 9.9
  scene.add(areaLight1)

  let areaLight2 = new THREE.AreaLight(0x00ff00,3)
  areaLight2.position.set(0,10,-35)
  areaLight2.rotation.set(-Math.PI/2,0,0)
  areaLight2.width = 4
  areaLight2.height = 9.9
  scene.add(areaLight2)

  let areaLight3 = new THREE.AreaLight(0x0000ff,3)
  areaLight3.position.set(10,10,-35)
  areaLight3.rotation.set(-Math.PI/2,0,0)
  areaLight3.width = 4
  areaLight3.height = 9.9
  scene.add(areaLight3)

  let planeGeometry1 = new THREE.BoxGeometry(4,10,0)
  let planeMaterial1Mat = new THREE.MeshBasicMaterial({color:0xff0000})
  let plane1 = new THREE.Mesh(planeGeometry1,planeMaterial1Mat)
  plane1.position.copy(areaLight1.position)
  scene.add(plane1)

  let planeGeometry2 = new THREE.BoxGeometry(4,10,0)
  let planeMaterial2Mat = new THREE.MeshBasicMaterial({color:0x00ff00})
  let plane2 = new THREE.Mesh(planeGeometry2,planeMaterial2Mat)
  plane2.position.copy(areaLight2.position)
  scene.add(plane2);

  let planeGeometry3 = new THREE.BoxGeometry(4,10,0)
  let planeMaterial3Mat = new THREE.MeshBasicMaterial({color:0x0000ff})
  let plane3 = new THREE.Mesh(planeGeometry3,planeMaterial3Mat)
  plane3.position.copy(areaLight3.position)
  scene.add(plane3);
  //@ts-ignore
  let controls = new function () {
    //@ts-ignore
    this.color1 = 0xff0000
    //@ts-ignore
    this.intensity1 = 0.01
    //@ts-ignore
    this.color2 = 0x00ff00
    //@ts-ignore
    this.intensity2 = 0.01
    //@ts-ignore
    this.color3 = 0x0000ff
    //@ts-ignore
    this.intensity3 = 0.01

  }
  let gui = new dat.GUI()
  gui.addColor(controls,'color1').onChange(function (e:any){
    areaLight1.color = new THREE.Color(e)
    planeMaterial1Mat.color = new THREE.Color(e)
    scene.remove(plane1)
    plane1 = new THREE.Mesh(planeGeometry1,planeMaterial1Mat)
    plane1.position.copy(areaLight1.position)
    scene.add(plane1)
  })
  gui.add(controls, 'intensity1', 0, 5).onChange(function (e) {
    areaLight1.intensity = e;
  });
  gui.addColor(controls,'color2').onChange(function (e:any){
    areaLight2.color = new THREE.Color(e)
    planeMaterial2Mat.color = new THREE.Color(e)
    scene.remove(plane2)
    plane2 = new THREE.Mesh(planeGeometry2,planeMaterial2Mat)
    plane2.position.copy(areaLight2.position)
    scene.add(plane2)
  })
  gui.add(controls, 'intensity2', 0, 5).onChange(function (e) {
    areaLight2.intensity = e;
  });
  gui.addColor(controls,'color3').onChange(function (e:any){
    areaLight3.color = new THREE.Color(e)
    planeMaterial3Mat.color = new THREE.Color(e)
    scene.remove(plane3)
    plane3 = new THREE.Mesh(planeGeometry3,planeMaterial3Mat)
    plane3.position.copy(areaLight3.position)
    scene.add(plane3)
  })
  gui.add(controls, 'intensity3', 0, 5).onChange(function (e) {
    areaLight3.intensity = e;
  });
  //@ts-ignore
  document.getElementById('WebGL-output').append(renderer.domElement)
  renderScene()
  function renderScene() {
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
