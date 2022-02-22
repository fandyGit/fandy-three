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
  camera.position.y = 30
  camera.position.z = 30
  camera.lookAt(scene.position)
  scene.add(camera)
  // 渲染器
  let renderer = new THREE.WebGLRenderer()
  renderer.setClearColor(new THREE.Color(0xffffff))
  renderer.setSize(window.innerWidth,window.innerHeight)
  renderer.shadowMapEnabled = true
  scene.add(renderer)
  // 点光
  let spotLight = new THREE.SpotLight(0x778899)
  spotLight.position.set(-30,40,40)
  spotLight.castShadow = true
  scene.add(spotLight)

  let cube = createMesh(new THREE.BoxGeometry(10,10,10,1,1,1))
  cube.position.x = -10
  cube.position.y = 8
  cube.position.z = 2
  scene.add(cube)

  let sphere = createMesh(new THREE.SphereGeometry(6,20,20))
  sphere.position.x = 10
  sphere.position.y = 0
  sphere.position.z = 2
  scene.add(sphere)

  function createMesh(geo:any) {
    let meshMaterial = new THREE.MeshNormalMaterial()
    meshMaterial.side = THREE.DoubleSide
    let wireFrameMat = new THREE.MeshBasicMaterial()
    wireFrameMat.wireframe = true
    let mesh = new THREE.SceneUtils.createMultiMaterialObject(geo, [meshMaterial,wireFrameMat])
    return mesh
  }


  //@ts-ignore
  let controls = new function () {
    //@ts-ignore
    this.rotationSpeed = 0.05
    //@ts-ignore
    this.width = cube.children[0].geometry.parameters.width
    //@ts-ignore
    this.height = cube.children[0].geometry.parameters.height
    //@ts-ignore
    this.depth = cube.children[0].geometry.parameters.depth
    //@ts-ignore
    this.widthSegments = cube.children[0].geometry.parameters.widthSegments
    //@ts-ignore
    this.heightSegments = cube.children[0].geometry.parameters.heightSegments
    //@ts-ignore
    this.depthSegments = cube.children[0].geometry.parameters.depthSegments
    //@ts-ignore
    this.drawerCube = function () {
      scene.remove(sphere)
      scene.remove(cube)
      cube = createMesh(new THREE.BoxGeometry(controls.width, controls.height, controls.depth, Math.round(controls.widthSegments), Math.round(controls.heightSegments), Math.round(controls.depthSegments)))
      scene.add(cube)
    }
    // 球体
    // @ts-ignore
    this.sphereRadius = sphere.children[0].geometry.parameters.radius
    // @ts-ignore
    this.sphereWidthSegments = sphere.children[0].geometry.parameters.widthSegments
    // @ts-ignore
    this.sphereHeightSegments = sphere.children[0].geometry.parameters.heightSegments
    // @ts-ignore
    this.spherePhiStart = 0
    // @ts-ignore
    this.spherePhiLength = Math.PI * 2
    // @ts-ignore
    this.sphereThetaStart = 0
    // @ts-ignore
    this.sphereThetaLength = Math.PI * 2
    // @ts-ignore
    this.drawerSphere = function () {
      scene.remove(cube)
      scene.remove(sphere)
      sphere = createMesh(new THREE.SphereGeometry(controls.sphereRadius, controls.sphereWidthSegments, controls.sphereHeightSegments, controls.spherePhiStart, controls.spherePhiLength, controls.sphereThetaStart, controls.sphereThetaLength))
      scene.add(sphere)
    }


  }

  let gui = new dat.GUI()
  let cubeGui = gui.addFolder('cubeGui')
  cubeGui.add(controls,'rotationSpeed',0.1,1)
  cubeGui.add(controls,'width',0,40).onChange(controls.drawerCube)
  cubeGui.add(controls,'height',0,40).onChange(controls.drawerCube)
  cubeGui.add(controls,'depth',0,40).onChange(controls.drawerCube)
  cubeGui.add(controls,'widthSegments',0,10).onChange(controls.drawerCube)
  cubeGui.add(controls,'heightSegments',0,10).onChange(controls.drawerCube)
  cubeGui.add(controls,'depthSegments',0,10).onChange(controls.drawerCube)
  let sphereGui = gui.addFolder('sphereGui');
  sphereGui.add(controls,'sphereRadius',0,40).onChange(controls.drawerSphere);
  sphereGui.add(controls,'sphereWidthSegments',0,20).onChange(controls.drawerSphere);
  sphereGui.add(controls,'sphereHeightSegments',0,20).onChange(controls.drawerSphere)
  sphereGui.add(controls,'spherePhiStart', 0, 2 * Math.PI).onChange(controls.drawerSphere)
  sphereGui.add(controls,'spherePhiLength', 0, 2 * Math.PI).onChange(controls.drawerSphere)
  sphereGui.add(controls,'sphereThetaStart', 0, 2 * Math.PI).onChange(controls.drawerSphere)
  sphereGui.add(controls,'sphereThetaLength', 0, 2 * Math.PI).onChange(controls.drawerSphere)
  // @ts-ignore
  document.getElementById('WebGL-output').append(renderer.domElement)
  renderScene()
  function renderScene() {
    stats.update();
    // cube.rotation.y += controls.rotationSpeed
    // sphere.rotation.y += controls.rotationSpeed
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
