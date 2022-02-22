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
  let stats = initState()
  // 场景
  let scene = new THREE.Scene()
  // 照相机
  let camera = new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,0.1,1000)
  camera.position.x = -30
  camera.position.y = 70
  camera.position.z = 70
  camera.lookAt(scene.position)
  scene.add(camera)
  // 渲染器
  let renderer = new THREE.WebGLRenderer()
  renderer.setClearColor(new THREE.Color(0xffffff,1.0))
  renderer.setSize(window.innerWidth,window.innerHeight)
  renderer.shadowMapEnabled = true
  scene.add(renderer)
  // 环境光
  let ambientLight = new THREE.AmbientLight(0x999999)
  scene.add(ambientLight)
  // 点光
  let spotLight = new THREE.SpotLight(0x789789)
  spotLight.position.set(-30,40,40)
  spotLight.castShadow = true
  scene.add(spotLight)
  function createMesh(geo:any) {
    let meshMaterial = new THREE.MeshNormalMaterial()
    meshMaterial.side = THREE.DoubleSide
    let wireFrameMats = new THREE.MeshBasicMaterial()
    wireFrameMats.wireframe = true
    let mesh = THREE.SceneUtils.createMultiMaterialObject(geo, [meshMaterial,wireFrameMats])
    return mesh
  }
  function drawShape() {
    let shape = new THREE.Shape()
    shape.moveTo(10,40)
    shape.lineTo(10,40)
    shape.bezierCurveTo(15,25,25,25,30,60)
    shape.splineThru(
        [
            new THREE.Vector2(32,30),
            new THREE.Vector2(28,20),
            new THREE.Vector2(30,10),
        ]
    )
    shape.quadraticCurveTo(20,15,10,10)
    let hole1 = new THREE.Path()
    hole1.absellipse(16,24,2,3,0,Math.PI*2,true)
    shape.holes.push(hole1)

    let hole2 = new THREE.Path()
    hole2.absellipse(20,16,2,3,0,Math.PI*2,true)
    shape.holes.push(hole2)
    return shape
  }
  function createLine(shape:any,flag:any) {
    if (!flag) {
        let mesh = new THREE.Line(shape.createPointsGeometry(10),new THREE.LineBasicMaterial({
          color:0xff3333,
          linewidth:2
        }))
        return mesh
    } else {
      let mesh = new THREE.Line(shape.createSpacedPointsGeometry(3),new THREE.LineBasicMaterial({
        color:0xff3333,
        linewidth:2
      }))
      return mesh
    }

  }
  let shape = createMesh(new THREE.ShapeGeometry(drawShape()))
  shape.rotation.x = -0.5 * Math.PI
  shape.position.x = 4
  shape.position.y = -10
  scene.add(shape)
  //@ts-ignore
  document.getElementById('WebGL-output').append(renderer.domElement)
  //@ts-ignore
  let controls = new function (){
    //@ts-ignore
    this.rotationSpeed = 0.01
    //@ts-ignore
    this.asGeometry = function () {
      scene.remove(shape)
      shape = createMesh(new THREE.ShapeGeometry(drawShape()))
      scene.add(shape)
    }
    //@ts-ignore
    this.asPoint = function () {
      scene.remove(shape)
      shape = createLine(drawShape(),false)
      scene.add(shape)
    }
    //@ts-ignore
    this.asSpacePoint = function () {
      scene.remove(shape)
      shape = createLine(drawShape(),true)
      scene.add(shape)
    }
  }

  let gui = new dat.GUI()
  gui.add(controls,'rotationSpeed',0.1,0.5)
  gui.add(controls,'asGeometry')
  gui.add(controls,'asPoint')
  gui.add(controls,'asSpacePoint')


  renderScene()
  function renderScene() {
    stats.update()
    shape.rotation.y += controls.rotationSpeed
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
