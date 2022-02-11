<template>
  <div id="Stats-output"></div>
  <div id="WebGL-output"></div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
onMounted(() => {
  function initState() {
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
  let stats = initState()
  //场景
  let scene = new THREE.Scene()
  //相机
  let camera = new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,0.1,1000)
  camera.near = 13
  camera.far = 139
  camera.position.x = -40
  camera.position.y = 40
  camera.position.z = 40
  camera.lookAt(scene.position)
  scene.add(camera)

  //渲染器
  let renderer = new THREE.WebGLRenderer()
  renderer.setClearColor(new THREE.Color(0x090f00,1.0))
  renderer.setSize(window.innerWidth,window.innerHeight)
  renderer.shadowMapEnabled = true
  scene.add(renderer)

  // 灯光
  let spotLight = new THREE.SpotLight(0xeeeeee)
  spotLight.castShadow = true
  spotLight.position.set(-30,30,30)
  scene.add(spotLight)
  let cube: any = null
  //@ts-ignore
  let controls = new function () {
    //@ts-ignore
    this.color = 0x00ff00
    //@ts-ignore
    this.cubeSpeed = 0.01
    //@ts-ignore
    this.cameraNear = camera.near
    //@ts-ignore
    this.cameraFar = camera.far
    //@ts-ignore
    this.numberOfCube = scene.children.length
    //@ts-ignore
    this.addCube = function () {
      let cubeSize = Math.ceil(Math.random()*3 + 3)
      let cubeGeometry = new THREE.BoxGeometry(cubeSize,cubeSize,cubeSize)
      // let cubeGeometry = new THREE.SphereGeometry(cubeSize,cubeSize*5,cubeSize*5)
      //let cubeMaterial = new THREE.MeshLambertMaterial({color:Math.random()*0xffffff})
      // cube = new THREE.Mesh(cubeGeometry,cubeMaterial)
      let cubeMaterial = new THREE.MeshDepthMaterial()
      let colorMaterial = new THREE.MeshBasicMaterial({
        color: controls.color,
        transparent: true,
        blending:THREE.MultiplyBlending
      })
      let cube = new THREE.SceneUtils.createMultiMaterialObject(cubeGeometry, [colorMaterial, cubeMaterial])

      cube.children[1].scale.set(0.99,0.99,0.99)

      cube.position.x = -50 + (Math.round(Math.random()*100))
      cube.position.y = Math.round(Math.random()*10)
      cube.position.z = -100 + (Math.round(Math.random()*150))

      cube.castShadow = true
      scene.add(cube)
      this.numberOfCube = scene.children.length
    }
    //@ts-ignore
    this.removeCube = function () {
      let allChildren = scene.children
      let lastObj = allChildren[allChildren.length - 1]
      if (lastObj instanceof THREE.Mesh){
        scene.remove(lastObj)
        this.numberOfCube = scene.children.length
      }
    }

  }
  //@ts-ignore
  let gui = new dat.GUI()
  gui.add(controls,'cubeSpeed',0,0.5)
  gui.addColor(controls,'color')
  gui.add(controls,'addCube')
  gui.add(controls,'removeCube')
  gui.add(controls,'cameraNear',0,30).onChange(function (e: any) {
    camera.near = e
  })
  gui.add(controls,'cameraFar',0,30).onChange(function (e: any) {
    camera.far = e
  })
  let i = 0
  while(i < 10) {
    controls.addCube()
    i++
  }
  //@ts-ignore
  document.getElementById('WebGL-output').append(renderer.domElement)
  // 渲染函数
  function renderScene() {
    stats.update()
    scene.traverse(function (e:any) {
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
