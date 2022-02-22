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
  // 相机
  let camera = new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,0.1,1000)
  camera.position.x = -20;
  camera.position.y = 60;
  camera.position.z = 60;
  camera.lookAt(new THREE.Vector3(20, 20, 0));
  scene.add(camera)
  // 渲染器
  let renderer = new THREE.WebGLRenderer()
  renderer.setClearColor(new THREE.Color(0xffffff,1.0))
  renderer.setSize(window.innerWidth,window.innerHeight)
  renderer.shadowMapEnabled = true
  scene.add(renderer)
  // 灯光
  let spotLight = new THREE.SpotLight(0x787878)
  spotLight.position.set(-30,30,30)
  spotLight.castShadow = true
  scene.add(spotLight)

  let shape = createMesh(new THREE.ShapeGeometry(drawShape()))
  scene.add(shape)
  function createMesh(geom: any) {
    geom.applyMatrix(new THREE.Matrix4().makeTranslation(-20, 0, 0));
    let meshMaterial = new THREE.MeshNormalMaterial({
      shading: THREE.FlatShading,
      transparent: true,
      opacity: 0.7
    })
    meshMaterial.side = THREE.DoubleSide
    let wireFrameMat = new THREE.MeshBasicMaterial()
    wireFrameMat.wireframe = true
    let mesh = new THREE.SceneUtils.createMultiMaterialObject(geom,[meshMaterial])
    return mesh
  }

  function drawShape() {
    let shape = new THREE.Shape()
    shape.moveTo(10,10)
    shape.lineTo(10,40)
    shape.bezierCurveTo(15,25,25,25,30,40)
    shape.splineThru(
        [
          new THREE.Vector2(32,30),
          new THREE.Vector2(28,20),
          new THREE.Vector2(30,10),
        ]
    )
    shape.quadraticCurveTo(20,15,10,10)

    let hole1 = new THREE.Path()
    hole1.absellipse(16,24,2,3,0,2*Math.PI,true)
    shape.holes.push(hole1)

    let hole2 = new THREE.Path()
    hole2.absellipse(23,24,2,3,0,2*Math.PI,true)
    shape.holes.push(hole2)

    let hole3 = new THREE.Path()
    hole3.absarc(20,16,2,0,Math.PI,true)
    shape.holes.push(hole3)

    return shape
  }

  //@ts-ignore
  let controls = new function () {
    //@ts-ignore
    this.amount = 2
    //@ts-ignore
    this.bevelThickness = 2
    //@ts-ignore
    this.bevelSize = 0.5
    //@ts-ignore
    this.bevelSegments =3
    //@ts-ignore
    this.bevelEnabled = true
    //@ts-ignore
    this.curveSegments =12
    //@ts-ignore
    this.steps = 1
    //@ts-ignore
    this.asGeom = function () {
      scene.remove(shape)
      let options = {
        amount: controls.amount,
        bevelThickness:controls.bevelThickness,
        bevelSize:controls.bevelSize,
        bevelEnabled:controls.bevelEnabled,
        curveSegments:controls.curveSegments,
        steps:controls.steps
      }
      shape = createMesh(new THREE.ExtrudeGeometry(drawShape(),options))
      scene.add(shape)
    }
  }
  let gui = new dat.GUI()
  gui.add(controls,'amount',0,20).onChange(controls.asGeom)
  gui.add(controls,'bevelThickness',0,20).onChange(controls.asGeom)
  gui.add(controls,'bevelSize',0,20).onChange(controls.asGeom)
  gui.add(controls,'bevelSegments',0,20).step(1).onChange(controls.asGeom)
  gui.add(controls,'curveSegments',1,20).step(1).onChange(controls.asGeom)
  gui.add(controls,'bevelEnabled').onChange(controls.asGeom)
  gui.add(controls, 'steps', 1, 5).step(1).onChange(controls.asGeom);
  controls.asGeom();
  //@ts-ignore
  document.getElementById('WebGL-output').append(renderer.domElement)
  renderScene()
  function renderScene() {
    stats.update()
    shape.rotation.y +=0.05
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
