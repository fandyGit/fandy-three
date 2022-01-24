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
  camera.position.z = 40
  camera.lookAt(scene.position)

  let renderer = new THREE.WebGLRenderer()
  renderer.setClearColor(new THREE.Color(0xeeeeee,1.0))
  renderer.shadowMapEnabled = true
  renderer.setSize(window.innerWidth,window.innerHeight)

  let spotLight = new THREE.SpotLight(0xffffff)
  spotLight.castShadow = true
  spotLight.position.set(-40, 60, 20);
  scene.add(spotLight)

  let planeGeometry = new THREE.PlaneGeometry(60,20,1,1)
  let planeMaterial = new THREE.MeshLambertMaterial({color:0x545407})
  let plane = new THREE.Mesh(planeGeometry,planeMaterial)
  plane.receiveShadow = true
  plane.rotation.x = -0.5 * Math.PI
  plane.position.x = 4
  plane.position.y = 0
  plane.position.z = 0

  scene.add(plane)

  let cubeGeometry = new THREE.BoxGeometry(4,8,8)
  let cubeMaterial = new THREE.MeshLambertMaterial({color:0x44ff44})
  let cube = new THREE.Mesh(cubeGeometry,cubeMaterial)
  cube.castShadow = true

  cube.position.x = 4
  cube.position.y = 0
  cube.position.z = 0
  scene.add(cube)
  //@ts-ignore
  let control = new function () {
    //@ts-ignore
    this.scaleX = 1
    //@ts-ignore
    this.scaleY = 1
    //@ts-ignore
    this.scaleZ = 1

    //@ts-ignore
    this.positionX = 4
    //@ts-ignore
    this.positionY = 4
    //@ts-ignore
    this.positionZ = 4
    //@ts-ignore
    this.rotationX = 0;
    //@ts-ignore
    this.rotationY = 0;
    //@ts-ignore
    this.rotationZ = 0;
    //@ts-ignore
    this.scale = 1;

    //@ts-ignore
    this.translateX = 0
    //@ts-ignore
    this.translateY = 0
    //@ts-ignore
    this.translateZ = 0
    //@ts-ignore
    this.visible = true;
    //@ts-ignore
    this.translate = function () {
      cube.translateX(control.translateX)
      cube.translateY(control.translateY)
      cube.translateZ(control.translateZ)

      cube.positionX = cube.position.x
      cube.positionY = cube.position.y
      cube.positionZ = cube.position.z
    }



  }
  let gui = new dat.GUI()

  let guiScale = gui.addFolder('scale')
  guiScale.add(control,'scaleX',0,5)
  guiScale.add(control,'scaleY',0,5)
  guiScale.add(control,'scaleZ',0,5)

  let guiPosition = gui.addFolder('position')
  let contX = guiPosition.add(control,'positionX',0,5)
  let contY = guiPosition.add(control,'positionY',0,5)
  let contZ = guiPosition.add(control,'positionZ',0,5)
  contX.listen()
  contX.onChange(function (value:any){
    cube.position.x = control.positionX
  })
  contY.listen()
  contY.onChange(function (value:any){
    cube.position.y = control.positionY
  })
  contZ.listen()
  contZ.onChange(function (value:any){
    cube.position.z = control.positionZ
  })

  let guiRotation = gui.addFolder('rotation')
  guiRotation.add(control,'rotationX',-4,4)
  guiRotation.add(control,'rotationY',-4,4)
  guiRotation.add(control,'rotationZ',-4,4)

  let guiTranslate = gui.addFolder('translate');
  guiTranslate.add(control, 'translateX', -10, 10);
  guiTranslate.add(control, 'translateY', -10, 10);
  guiTranslate.add(control, 'translateZ', -10, 10);
  gui.add(control, 'translate');

  gui.add(control, 'visible');


  //@ts-ignore
  document.getElementById('WebGL-output').append(renderer.domElement)

  renderScene()
  function renderScene() {
    stats.update()
    cube.visible = control.visible

    cube.rotation.x = control.rotationX;
    cube.rotation.y = control.rotationY;
    cube.rotation.z = control.rotationZ;

    // cube.translateX(control.translateX)
    // cube.translateY(control.translateY)
    // cube.translateZ(control.translateZ)

    cube.scale.set(control.scaleX, control.scaleY, control.scaleZ);
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
