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
  scene.overrideMaterial = new THREE.MeshDepthMaterial()

  // 相机
  let camera = new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,10,130)
  camera.position.x = -30
  camera.position.y = 40
  camera.position.z = 40
  camera.lookAt(scene.position)
  scene.add(camera)

  //渲染器
  let renderer = new THREE.WebGLRenderer()
  renderer.setClearColor(new THREE.Color(0xffffff,1))
  renderer.setSize(window.innerWidth,window.innerHeight)
  renderer.shadowMapEnabled = true
  scene.add(renderer)

  // 点光
  let spotLight = new THREE.SpotLight(0x349934)
  spotLight.position.set(-30,30,30)
  spotLight.castShadow = true
  scene.add(spotLight)
  //@ts-ignore
  var controls = new function () {
    //@ts-ignore
    this.cameraNear = camera.near
    //@ts-ignore
    this.cameraFar = camera.far
    //@ts-ignore
    this.cubeSpeed = 0.01
    //@ts-ignore
    this.numberOfObjects = scene.children.length;
    //@ts-ignore
    this.addCube = function () {
      let cubeSize = Math.ceil(3 + Math.random()*3)
      let cubeGeometry = new THREE.BoxGeometry(cubeSize,cubeSize,cubeSize)
      let cubeMaterial = new THREE.MeshLambertMaterial({color:Math.random() * 0xffffff})
      let cube = new THREE.Mesh(cubeGeometry,cubeMaterial)
      cube.castShadow = true
      cube.position.x = -60 + (Math.round(Math.random()*100))
      cube.position.y = Math.round(Math.random()*10)
      cube.position.z = -100 + (Math.round(Math.random()*150))

      scene.add(cube)
      this.numberOfObjects = scene.children.length;

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
  //@ts-ignore
  let gui = new dat.GUI()
  gui.add(controls,'cubeSpeed',0,0.5)
  gui.add(controls,'addCube')
  gui.add(controls,'removeCube')
  gui.add(controls, 'cameraNear', 0, 50).onChange(function (e) {
    camera.near = e;
  });
  gui.add(controls, 'cameraFar', 50, 200).onChange(function (e) {
    camera.far = e;
  });

  let i = 0;
  while (i < 10) {
    controls.addCube();
    i++;
  }

  //@ts-ignore
  document.getElementById('WebGL-output').append(renderer.domElement)

  let stats = initState()
  function renderScene(){
    stats.update()
    scene.traverse(function (e: any) {
      if (e instanceof THREE.Mesh) {
        e.rotation.x += controls.cubeSpeed
        e.rotation.y += controls.cubeSpeed
        e.rotation.z += controls.cubeSpeed
      }
    })
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
