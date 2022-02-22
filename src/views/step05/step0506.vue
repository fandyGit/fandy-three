<template>
  <div id="Stats-output"></div>
  <div id="WebGL-output"></div>
</template>

<script setup lang="ts">
import {onMounted, popScopeId} from 'vue'
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
  camera.position.x = -30;
  camera.position.y = 30
  camera.position.z = 30
  camera.lookAt(scene.position)
  scene.add(camera)
  // 渲染器
  let renderer = new THREE.WebGLRenderer()
  renderer.setClearColor(new THREE.Color(0xffffff,1.0))
  renderer.setSize(window.innerWidth,window.innerHeight)
  renderer.shadowMapEnabled = true
  scene.add(renderer)
  // 点光
  let spotLight = new THREE.SpotLight(0x778899)
  spotLight.position.set(-30,30,30)
  spotLight.castShadow = true
  scene.add(spotLight)

  let cylinder = createMesh(new THREE.CylinderGeometry(10,10,10))
  cylinder.position.x = -10
  scene.add(cylinder)

  let torus = createMesh(new THREE.TorusGeometry(10,10,8,6,Math.PI*2))
  torus.position.x = 20
  scene.add(torus)
  function createMesh(geo: any) {
    let meshMaterial = new THREE.MeshNormalMaterial()
    meshMaterial.side = THREE.DoubleSide
    let wireFrameMat = new THREE.MeshBasicMaterial()
    wireFrameMat.wireframe = true
    let mesh = THREE.SceneUtils.createMultiMaterialObject(geo, [meshMaterial,wireFrameMat])
    return mesh
  }
  //@ts-ignore
  let controls = new function () {
    //@ts-ignore
    this.radiusTop = 20
    //@ts-ignore
    this.radiusBottom = 20
    //@ts-ignore
    this.height = 20
    //@ts-ignore
    this.radialSegments = 8
    //@ts-ignore
    this.heightSegments = 8
    //@ts-ignore
    this.openEnded = false
    //@ts-ignore
    this.redraw = function () {
      scene.remove(cylinder)
      cylinder = createMesh(new THREE.CylinderGeometry(controls.radiusTop,controls.radiusBottom,controls.height,controls.radialSegments,controls.heightSegments,controls.openEnded))
      scene.add(cylinder)
    }
    //@ts-ignore 环形
    this.radius = torus.children[0].geometry.parameters.radius
    //@ts-ignore
    this.tube = torus.children[0].geometry.parameters.tube
    //@ts-ignore
    this.cyRadialSegments = torus.children[0].geometry.parameters.radialSegments
    //@ts-ignore
    this.cyTubularSegments = torus.children[0].geometry.parameters.tubularSegments
    //@ts-ignore
    this.arc = torus.children[0].geometry.parameters.arc
    //@ts-ignore
    this.redraw2 = function () {
      scene.remove(torus)
      torus = createMesh(new THREE.TorusGeometry(controls.radius,controls.tube,Math.round(controls.cyRadialSegments),Math.round(controls.cyTubularSegments),controls.arc))
      scene.add(torus)
    }
  }
  //@ts-ignore
  let gui = new dat.GUI()
  let cyGUI = gui.addFolder('cylinder')
  cyGUI.add(controls,'radiusTop',0,20).onChange(controls.redraw)
  cyGUI.add(controls,'radiusBottom',0,20).onChange(controls.redraw)
  cyGUI.add(controls,'height',0,20).onChange(controls.redraw)
  cyGUI.add(controls,'radialSegments',0,20).step(1).onChange(controls.redraw)
  cyGUI.add(controls,'heightSegments',0,20).step(1).onChange(controls.redraw)
  cyGUI.add(controls,'openEnded',0,20).onChange(controls.redraw)
  let torusGUI = gui.addFolder('torus')
  torusGUI.add(controls,'radius',0,20).onChange(controls.redraw2)
  torusGUI.add(controls,'tube',0,20).onChange(controls.redraw2)
  torusGUI.add(controls,'cyRadialSegments',0,20).onChange(controls.redraw2)
  torusGUI.add(controls,'cyTubularSegments',1,20).onChange(controls.redraw2)
  torusGUI.add(controls,'arc',0,Math.PI * 2).onChange(controls.redraw2)
  //@ts-ignore
  document.getElementById('WebGL-output').append(renderer.domElement)
  renderscene()
  function renderscene() {
    stats.update()
    cylinder.rotation.y += 0.05
    requestAnimationFrame(renderscene)
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
